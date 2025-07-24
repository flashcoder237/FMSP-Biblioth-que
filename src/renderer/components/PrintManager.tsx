import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  BookOpen, 
  Clock,
  X,
  Check,
  AlertCircle,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react';
import { Document, Stats } from '../../preload';
import { InstitutionSettings } from '../../preload';

interface PrintManagerProps {
  documents: Document[];
  stats: Stats;
  onClose: () => void;
}

type PrintType = 'inventory' | 'available' | 'borrowed';

export const PrintManager: React.FC<PrintManagerProps> = ({ 
  documents, 
  stats, 
  onClose 
}) => {
  const [selectedType, setSelectedType] = useState<PrintType>('inventory');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettings>({
    name: 'Bibliothèque Numérique',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    description: 'Système de gestion de bibliothèque moderne'
  });

  useEffect(() => {
    // Charger les informations de l'institution depuis localStorage
    const loadInstitutionSettings = () => {
      try {
        const stored = localStorage.getItem('institutionSettings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setInstitutionSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres d\'institution:', error);
      }
    };

    loadInstitutionSettings();
  }, []);

  const printOptions = [
    {
      id: 'inventory' as PrintType,
      title: 'Inventaire Complet',
      description: 'Liste détaillée de tous les documents avec statuts',
      icon: FileText,
      color: '#3E5C49',
      gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
      count: documents.length,
      features: ['Informations complètes', 'Statuts des emprunts', 'Métadonnées']
    },
    {
      id: 'available' as PrintType,
      title: 'Documents Disponibles',
      description: 'Collection des ouvrages disponibles à l\'emprunt',
      icon: BookOpen,
      color: '#3E5C49',
      gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6B57 100%)',
      count: documents.filter(doc => !doc.estEmprunte).length,
      features: ['Documents en rayon', 'Prêts à emprunter', 'Tri par catégorie']
    },
    {
      id: 'borrowed' as PrintType,
      title: 'Documents Empruntés',
      description: 'Suivi des emprunts en cours avec emprunteurs',
      icon: Clock,
      color: '#C2571B',
      gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)',
      count: documents.filter(doc => doc.estEmprunte).length,
      features: ['Noms des emprunteurs', 'Dates d\'emprunt', 'Alertes retard']
    }
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePrint = async () => {
    setIsProcessing(true);
    try {
      const printData = { 
        documents, 
        stats, 
        institution: institutionSettings 
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
      const exportData = { 
        documents, 
        stats, 
        institution: institutionSettings 
      };
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
          items: documents,
          description: `${documents.length} document(s) au total`,
          icon: BarChart3
        };
      case 'available':
        return {
          title: 'Documents Disponibles',
          items: documents.filter(doc => !doc.estEmprunte),
          description: `${documents.filter(doc => !doc.estEmprunte).length} document(s) disponible(s)`,
          icon: BookOpen
        };
      case 'borrowed':
        return {
          title: 'Documents Empruntés',
          items: documents.filter(doc => doc.estEmprunte),
          description: `${documents.filter(doc => doc.estEmprunte).length} document(s) emprunté(s)`,
          icon: Clock
        };
    }
  };

  const previewData = getPreviewData();
  const selectedOption = printOptions.find(opt => opt.id === selectedType);
  if (!selectedOption) {
    return <div>Erreur: option sélectionnée invalide</div>;
  }

  return (
    <div className="print-manager-overlay">
      <div className="print-manager-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Printer size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Impression & Export</h2>
              <p className="modal-subtitle">Générez des rapports professionnels de votre bibliothèque</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="modal-content">
          {/* Options Selection */}
          <div className="options-section">
            <div className="section-header">
              <h3 className="section-title">Choisir le type de rapport</h3>
              <p className="section-description">Sélectionnez le contenu à inclure dans votre document</p>
            </div>
            
            <div className="print-options">
              {printOptions.map((option) => (
                <div
                  key={option.id}
                  className={`option-card ${selectedType === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(option.id)}
                >
                  <div className="option-header">
                    <div 
                      className="option-icon"
                      style={{ background: option.gradient }}
                    >
                      <option.icon size={24} />
                    </div>
                    <div className="option-badge">
                      {option.count} élément{option.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="option-content">
                    <h4 className="option-title">{option.title}</h4>
                    <p className="option-description">{option.description}</p>
                    
                    <div className="option-features">
                      {option.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="option-indicator">
                    {selectedType === option.id && <Check size={16} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <div className="section-header">
              <div className="preview-title-section">
                <h3 className="section-title">Aperçu du contenu</h3>
                <div className="preview-stats">
                  <previewData.icon size={16} />
                  <span>{previewData.description}</span>
                </div>
              </div>
              <button className="preview-button">
                <Eye size={16} />
                Prévisualiser
              </button>
            </div>
            
            <div className="preview-card">
              <div className="preview-header">
                <div className="institution-header">
                  {institutionSettings.logo && (
                    <div className="institution-logo">
                      <img src={institutionSettings.logo} alt="Logo" />
                    </div>
                  )}
                  <div className="institution-info">
                    <h3 className="institution-name">{institutionSettings.name}</h3>
                    {institutionSettings.address && (
                      <p className="institution-address">
                        {institutionSettings.address}, {institutionSettings.city}
                      </p>
                    )}
                    {institutionSettings.phone && (
                      <p className="institution-contact">
                        Tél: {institutionSettings.phone}
                        {institutionSettings.email && ` • ${institutionSettings.email}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="report-header">
                  <div 
                    className="preview-icon"
                    style={{ background: selectedOption?.gradient }}
                  >
                    <selectedOption.icon size={20} />
                  </div>
                  <div className="preview-info">
                    <h4 className="preview-title">{previewData.title}</h4>
                    <p className="preview-subtitle">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
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
                    {previewData.items.slice(0, 4).map((doc, index) => (
                      <div key={index} className="table-row">
                        <div className="table-cell">
                          <div className="cell-content">
                            <div className="book-title">{doc.titre}</div>
                          </div>
                        </div>
                        <div className="table-cell">{doc.auteur}</div>
                        <div className="table-cell">
                          <span className="category-badge">{doc.descripteurs}</span>
                        </div>
                        {selectedType === 'borrowed' && (
                          <>
                            <div className="table-cell">
                              <strong>{doc.nomEmprunteur || '-'}</strong>
                            </div>
                            <div className="table-cell">
                              {doc.dateEmprunt ? new Date(doc.dateEmprunt).toLocaleDateString('fr-FR') : '-'}
                            </div>
                          </>
                        )}
                        {selectedType !== 'borrowed' && (
                          <div className="table-cell">
                            <span className={`status-badge ${doc.estEmprunte ? 'borrowed' : 'available'}`}>
                              {doc.estEmprunte ? 'Emprunté' : 'Disponible'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {previewData.items.length > 4 && (
                      <div className="table-row more-items">
                        <div className="table-cell more-text">
                          ... et {previewData.items.length - 4} autre(s) élément(s)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <div className="info-item">
              <FileText size={16} />
              <span>Format PDF professionnel</span>
            </div>
            <div className="info-item">
              <Download size={16} />
              <span>Export CSV pour données</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button 
              className="btn-secondary"
              onClick={handleExportCSV}
              disabled={isProcessing}
            >
              <Download size={18} />
              {isProcessing ? 'Export...' : 'Exporter CSV'}
            </button>
            <button 
              className="btn-primary"
              onClick={handlePrint}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Zap size={18} />
                  Génération...
                </>
              ) : (
                <>
                  <Printer size={18} />
                  Imprimer
                </>
              )}
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
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .print-manager-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: scale(1.05);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .message.error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-title-section {
          flex: 1;
        }
        
        .preview-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
          margin-top: 4px;
        }
        
        .preview-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preview-button:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .option-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(62, 92, 73, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .option-card:hover::before {
          opacity: 1;
        }
        
        .option-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
          border-color: #3E5C49;
        }
        
        .option-card.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.02);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .option-card.selected::before {
          opacity: 1;
        }
        
        .option-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .option-badge {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .option-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .option-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        
        .option-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .feature-tag {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .option-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 24px;
          height: 24px;
          background: #3E5C49;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }
        
        .option-card.selected .option-indicator {
          opacity: 1;
          transform: scale(1);
        }
        
        .preview-card {
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .preview-header {
          padding: 24px;
          background: #F3EED9;
        }

        .institution-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.5);
        }

        .institution-logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #E5DCC2;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .institution-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .institution-info {
          flex: 1;
        }

        .institution-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }

        .institution-address {
          font-size: 13px;
          color: #6E6E6E;
          margin: 0 0 2px 0;
        }

        .institution-contact {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .preview-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 2px 0;
        }
        
        .preview-subtitle {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-content {
          padding: 24px;
        }
        
        .preview-table {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #E5DCC2;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .header-cell {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #2E2E2E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-body {
          max-height: 240px;
          overflow-y: auto;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          border-bottom: 1px solid #F3EED9;
          transition: background 0.2s ease;
        }
        
        .table-row:hover {
          background: #FEFEFE;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .table-row.more-items {
          grid-template-columns: 1fr;
          background: #F3EED9;
        }
        
        .table-cell {
          padding: 16px 20px;
          font-size: 14px;
          color: #2E2E2E;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .cell-content {
          width: 100%;
        }
        
        .book-title {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .more-text {
          text-align: center;
          font-style: italic;
          color: #6E6E6E;
          justify-content: center;
        }
        
        .category-badge {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge.available {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .status-badge.borrowed {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
        }
        
        .footer-info {
          display: flex;
          gap: 32px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .footer-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .print-options {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
          
          .header-cell,
          .table-cell {
            padding: 12px 16px;
          }
          
          .modal-content {
            padding: 24px;
            gap: 32px;
          }
        }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 12px;
          }
          
          .print-manager-modal {
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 24px 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
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
          
          .option-card {
            padding: 20px;
          }
          
          .preview-content {
            padding: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .modal-header {
            padding: 20px 16px;
          }
          
          .modal-content {
            padding: 16px;
            gap: 24px;
          }
          
          .modal-footer {
            padding: 16px;
            flex-direction: column;
            gap: 16px;
          }
          
          .footer-actions {
            flex-direction: column;
          }
          
          .option-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .option-badge {
            text-align: center;
          }
          
          .table-header,
          .table-row {
            display: block;
          }
          
          .header-cell,
          .table-cell {
            display: block;
            padding: 8px 16px;
            border-bottom: 1px solid #F3EED9;
          }
          
          .header-cell {
            background: #E5DCC2;
            font-weight: 700;
          }
          
          .table-cell:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </div>
  );
};