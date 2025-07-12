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
      id: 'available' as PrintType,
      title: 'Livres Disponibles',
      description: 'Livres actuellement disponibles à l\'emprunt',
      icon: BookOpen,
      color: 'bg-green-500',
      count: stats.availableBooks
    },
    {
      id: 'borrowed' as PrintType,
      title: 'Livres Empruntés',
      description: 'Livres actuellement en prêt avec emprunteurs',
      icon: Clock,
      color: 'bg-orange-500',
      count: stats.borrowedBooks
    }
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePrint = async () => {
    setIsProcessing(true);
    try {
      const printData = { books, stats, categories };

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
        showMessage('success', 'Document envoyé à l\'imprimante avec succès');
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
      const exportData = { books, stats, categories };
      const filePath = await window.electronAPI.exportCSV(exportData);
      
      if (filePath) {
        showMessage('success', `Fichier CSV exporté : ${filePath.split(/[/\\]/).pop()}`);
      } else {
        showMessage('error', 'Export annulé ou erreur');
      }
    } catch (error) {
      console.error('Export error:', error);
      showMessage('error', 'Erreur lors de l\'export CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewData = () => {
    switch (selectedType) {
      case 'inventory':
        return {
          title: 'Inventaire Complet',
          items: books,
          description: `${stats.totalBooks} livre(s) au total`
        };
      case 'available':
        return {
          title: 'Livres Disponibles',
          items: books.filter(book => !book.isBorrowed),
          description: `${stats.availableBooks} livre(s) disponible(s)`
        };
      case 'borrowed':
        return {
          title: 'Livres Empruntés',
          items: books.filter(book => book.isBorrowed),
          description: `${stats.borrowedBooks} livre(s) emprunté(s)`
        };
    }
  };

  const previewData = getPreviewData();

  return (
    <div className="print-manager-overlay">
      <div className="print-manager-modal">
        <div className="modal-header">
          <div className="header-left">
            <Printer size={24} />
            <div>
              <h2 className="modal-title">Impression & Export</h2>
              <p className="modal-subtitle">Générer des rapports de la bibliothèque</p>
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

        <div className="modal-content">
          <div className="options-section">
            <h3 className="section-title">Sélectionner le type de rapport</h3>
            <div className="print-options">
              {printOptions.map((option) => (
                <button
                  key={option.id}
                  className={`option-card ${selectedType === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(option.id)}
                >
                  <div className={`option-icon ${option.color}`}>
                    <option.icon size={24} />
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
            <h3 className="section-title">Aperçu du contenu</h3>
            <div className="preview-card">
              <div className="preview-header">
                <h4>{previewData.title}</h4>
                <span className="preview-count">{previewData.description}</span>
              </div>
              
              <div className="preview-content">
                <div className="preview-table">
                  <div className="table-header">
                    <div className="header-cell">Titre</div>
                    <div className="header-cell">Auteur</div>
                    <div className="header-cell">Catégorie</div>
                    {selectedType === 'borrowed' && (
                      <>
                        <div className="header-cell">Emprunteur</div>
                        <div className="header-cell">Date</div>
                      </>
                    )}
                    {selectedType !== 'borrowed' && (
                      <div className="header-cell">Statut</div>
                    )}
                  </div>
                  
                  <div className="table-body">
                    {previewData.items.slice(0, 5).map((book, index) => (
                      <div key={index} className="table-row">
                        <div className="table-cell">{book.title}</div>
                        <div className="table-cell">{book.author}</div>
                        <div className="table-cell">
                          <span className="category-badge">{book.category}</span>
                        </div>
                        {selectedType === 'borrowed' && (
                          <>
                            <div className="table-cell">{book.borrowerName}</div>
                            <div className="table-cell">
                              {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '-'}
                            </div>
                          </>
                        )}
                        {selectedType !== 'borrowed' && (
                          <div className="table-cell">
                            <span className={`status-badge ${book.isBorrowed ? 'borrowed' : 'available'}`}>
                              {book.isBorrowed ? 'Emprunté' : 'Disponible'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {previewData.items.length > 5 && (
                      <div className="table-row more-items">
                        <div className="table-cell" style={{ textAlign: 'center', fontStyle: 'italic', color: '#6b7280' }}>
                          ... et {previewData.items.length - 5} autre(s) élément(s)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <span>📄 Format PDF pour impression</span>
            <span>📊 Format CSV pour données</span>
          </div>
          <div className="footer-actions">
            <button 
              className="btn-secondary"
              onClick={handleExportCSV}
              disabled={isProcessing}
            >
              <Download size={16} />
              {isProcessing ? 'Export...' : 'Exporter CSV'}
            </button>
            <button 
              className="btn-primary"
              onClick={handlePrint}
              disabled={isProcessing}
            >
              <Printer size={16} />
              {isProcessing ? 'Impression...' : 'Imprimer'}
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
        
        .print-manager-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .modal-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message.success {
          background: #f0fdf4;
          color: #16a34a;
          border-bottom: 1px solid #bbf7d0;
        }
        
        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border-bottom: 1px solid #fecaca;
        }
        
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .option-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .option-card:hover {
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .option-card.selected {
          border-color: #22c55e;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
          margin-bottom: 8px;
        }
        
        .option-count {
          font-size: 12px;
          color: #22c55e;
          font-weight: 600;
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
          justify-content: space-between;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .preview-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .preview-count {
          font-size: 14px;
          color: #6b7280;
        }
        
        .preview-content {
          padding: 20px;
        }
        
        .preview-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .header-cell {
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-body {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .table-row.more-items {
          grid-template-columns: 1fr;
        }
        
        .table-cell {
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .category-badge {
          background: #22c55e;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .status-badge.available {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .status-badge.borrowed {
          background: #fef2f2;
          color: #dc2626;
        }
        
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .footer-info {
          display: flex;
          gap: 24px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .footer-actions {
          display: flex;
          gap: 12px;
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
        
        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #16a34a;
          transform: translateY(-1px);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-green-500 { background-color: #22c55e; }
        .bg-orange-500 { background-color: #f97316; }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 10px;
          }
          
          .print-options {
            grid-template-columns: 1fr;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
          
          .header-cell,
          .table-cell {
            padding: 8px 12px;
          }
          
          .footer-info {
            display: none;
          }
          
          .footer-actions {
            width: 100%;
            justify-content: stretch;
          }
          
          .btn-secondary,
          .btn-primary {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};