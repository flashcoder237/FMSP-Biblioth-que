import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  BookOpen, 
  Clock,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Book, Stats, Category } from '../../preload';

interface PrintManagerProps {
  books: Book[];
  stats: Stats;
  categories: Category[];
  onClose: () => void;
}

type PrintType = 'inventory' | 'available' | 'borrowed';

export const PrintManager: React.FC<PrintManagerProps> = ({ 
  books, 
  stats, 
  categories, 
  onClose 
}) => {
  const [selectedType, setSelectedType] = useState<PrintType>('inventory');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const printOptions = [
    {
      id: 'inventory' as PrintType,
      title: 'Inventaire Complet',
      description: 'Tous les livres avec détails complets',
      icon: FileText,
      color: 'bg-blue-500',
      count: stats.totalBooks
    },
    {
      id: 'borrowed' as PrintType,
      title: 'Livres Empruntés',
      description: 'Livres actuellement en circulation',
      icon: Clock,
      color: 'bg-orange-500',
      count: stats.borrowedBooks
    }
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePrint = async () => {
    setIsProcessing(true);
    try {
      const printData = {
        books,
        stats,
        categories
      };

      let success = false;
      switch (selectedType) {
        case 'inventory':
          success = await window.electronAPI.printInventory(printData);
          break;
        case 'available':
          success = await window.electronAPI.printAvailableBooks(printData);
          break;
        case 'borrowed':
          success = await window.electronAPI.printBorrowedBooks(printData);
          break;
      }

      if (success) {
        showMessage('success', 'Impression lancée avec succès !');
      } else {
        showMessage('error', 'Erreur lors de l\'impression');
      }
    } catch (error) {
      console.error('Print error:', error);
      showMessage('error', 'Erreur lors de l\'impression');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = async () => {
    setIsProcessing(true);
    try {
      const exportData = {
        books,
        stats,
        categories
      };

      const filePath = await window.electronAPI.exportCSV(exportData);
      
      if (filePath) {
        showMessage('success', `Fichier exporté: ${filePath.split(/[\\/]/).pop()}`);
      } else {
        showMessage('error', 'Export annulé ou erreur');
      }
    } catch (error) {
      console.error('Export error:', error);
      showMessage('error', 'Erreur lors de l\'export');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewData = () => {
    switch (selectedType) {
      case 'inventory':
        return {
          title: 'Inventaire Complet',
          items: [
            `${stats.totalBooks} livres au total`,
            `${stats.availableBooks} livres disponibles`,
            `${stats.borrowedBooks} livres empruntés`,
            `${stats.totalAuthors} auteurs référencés`,
            `${stats.totalCategories} catégories`
          ]
        };
      case 'available':
        const availableBooks = books.filter(book => !book.isBorrowed);
        return {
          title: 'Livres Disponibles',
          items: [
            `${availableBooks.length} livres disponibles`,
            `Taux de disponibilité: ${((availableBooks.length / stats.totalBooks) * 100).toFixed(1)}%`,
            'Détails: Titre, Auteur, Catégorie, ISBN, Année',
            'Triés par ordre alphabétique'
          ]
        };
      case 'borrowed':
        const borrowedBooks = books.filter(book => book.isBorrowed);
        return {
          title: 'Livres Empruntés',
          items: [
            `${borrowedBooks.length} livres en circulation`,
            `Taux d'emprunt: ${((borrowedBooks.length / stats.totalBooks) * 100).toFixed(1)}%`,
            'Informations emprunteurs incluses',
            'Durées d\'emprunt calculées',
            'Alertes de retard affichées'
          ]
        };
    }
  };

  const previewData = getPreviewData();

  return (
    <div className="print-manager-overlay">
      <div className="print-manager">
        <div className="print-header">
          <div className="header-content">
            <Printer className="header-icon" size={24} />
            <div>
              <h2 className="header-title">Impression & Export</h2>
              <p className="header-subtitle">Générer des rapports de votre bibliothèque</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="print-content">
          <div className="options-section">
            <h3 className="section-title">Type de rapport</h3>
            <div className="print-options">
              {printOptions.map((option) => (
                <button
                  key={option.id}
                  className={`print-option ${selectedType === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(option.id)}
                >
                  <div className={`option-icon ${option.color}`}>
                    <option.icon size={20} />
                  </div>
                  <div className="option-content">
                    <div className="option-title">{option.title}</div>
                    <div className="option-description">{option.description}</div>
                    <div className="option-count">{option.count} élément(s)</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="preview-section">
            <h3 className="section-title">Aperçu du rapport</h3>
            <div className="preview-card">
              <div className="preview-header">
                <FileText size={18} />
                <span className="preview-title">{previewData.title}</span>
              </div>
              <div className="preview-content">
                <p className="preview-description">Ce rapport inclura :</p>
                <ul className="preview-list">
                  {previewData.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="print-actions">
          <div className="action-group">
            <button
              className="btn-secondary"
              onClick={handleExportCSV}
              disabled={isProcessing}
            >
              <Download size={16} />
              Exporter CSV
            </button>
            <button
              className="btn-primary"
              onClick={handlePrint}
              disabled={isProcessing}
            >
              <Printer size={16} />
              {isProcessing ? 'Traitement...' : 'Imprimer'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .print-manager-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .print-manager {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .print-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          color: #22c55e;
        }
        
        .header-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }
        
        .header-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          margin: 0 24px 16px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        
        .message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        
        .print-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 24px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }
        
        .options-section {
          margin-bottom: 32px;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .print-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .print-option:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .print-option.selected {
          background: #f0fdf4;
          border-color: #22c55e;
        }
        
        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .option-content {
          flex: 1;
          text-align: left;
        }
        
        .option-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .option-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .option-count {
          font-size: 12px;
          color: #22c55e;
          font-weight: 600;
        }
        
        .preview-section {
          margin-bottom: 24px;
        }
        
        .preview-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .preview-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .preview-content {
          padding: 20px;
        }
        
        .preview-description {
          font-size: 14px;
          color: #374151;
          margin: 0 0 12px 0;
          font-weight: 500;
        }
        
        .preview-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .preview-list li {
          padding: 6px 0;
          font-size: 14px;
          color: #6b7280;
          position: relative;
          padding-left: 20px;
        }
        
        .preview-list li::before {
          content: '•';
          color: #22c55e;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .print-actions {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .action-group {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover {
          background: #16a34a;
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-green-500 { background-color: #22c55e; }
        .bg-orange-500 { background-color: #f97316; }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 8px;
          }
          
          .print-manager {
            max-height: 95vh;
          }
          
          .print-header {
            padding: 16px 16px 0;
          }
          
          .print-content {
            padding: 0 16px;
          }
          
          .print-actions {
            padding: 16px;
          }
          
          .action-group {
            flex-direction: column;
          }
          
          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
    