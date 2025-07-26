import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  Calendar,
  Building,
  FileBarChart
} from 'lucide-react';
import { MicroButton, MicroCard } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';

export interface ExportConfig {
  format: 'excel' | 'csv';
  dataTypes: {
    documents: boolean;
    borrowers: boolean;
    borrowHistory: boolean;
    authors: boolean;
    categories: boolean;
    stats: boolean;
  };
  documentFields: {
    titre: boolean;
    auteur: boolean;
    editeur: boolean;
    lieuEdition: boolean;
    annee: boolean;
    descripteurs: boolean;
    cote: boolean;
    type: boolean;
    isbn: boolean;
    description: boolean;
    estEmprunte: boolean;
    dateEmprunt: boolean;
    nomEmprunteur: boolean;
    dateRetourPrevu: boolean;
  };
  borrowerFields: {
    firstName: boolean;
    lastName: boolean;
    type: boolean;
    matricule: boolean;
    classe: boolean;
    position: boolean;
    email: boolean;
    phone: boolean;
    cniNumber: boolean;
  };
  historyFields: {
    // Document fields
    documentTitle: boolean;
    documentAuthor: boolean;
    documentEditor: boolean;
    documentYear: boolean;
    documentType: boolean;
    documentCote: boolean;
    documentISBN: boolean;
    
    // Borrower fields
    borrowerName: boolean;
    borrowerFirstName: boolean;
    borrowerLastName: boolean;
    borrowerMatricule: boolean;
    borrowerType: boolean;
    borrowerClass: boolean;
    borrowerPosition: boolean;
    borrowerEmail: boolean;
    borrowerPhone: boolean;
    borrowerCNI: boolean;
    
    // Loan details
    borrowDate: boolean;
    borrowTime: boolean;
    expectedReturnDate: boolean;
    actualReturnDate: boolean;
    actualReturnTime: boolean;
    status: boolean;
    duration: boolean;
    overdueDays: boolean;
    isOverdue: boolean;
    loanPeriod: boolean;
    season: boolean;
    schoolYear: boolean;
    notes: boolean;
  };
  dateRange: {
    enabled: boolean;
    startDate: string;
    endDate: string;
  };
  filters: {
    documentStatus: 'all' | 'available' | 'borrowed';
    borrowerType: 'all' | 'student' | 'staff';
    historyStatus: 'all' | 'active' | 'returned' | 'overdue';
  };
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => Promise<void>;
  availableData: {
    documents: boolean;
    borrowers: boolean;
    borrowHistory: boolean;
  };
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  availableData
}) => {
  const { success, error } = useQuickToast();
  const [isExporting, setIsExporting] = useState(false);

  const [config, setConfig] = useState<ExportConfig>({
    format: 'excel',
    dataTypes: {
      documents: true,
      borrowers: false,
      borrowHistory: false,
      authors: false,
      categories: false,
      stats: false
    },
    documentFields: {
      titre: true,
      auteur: true,
      editeur: true,
      lieuEdition: false,
      annee: true,
      descripteurs: true,
      cote: true,
      type: false,
      isbn: false,
      description: false,
      estEmprunte: true,
      dateEmprunt: false,
      nomEmprunteur: false,
      dateRetourPrevu: false
    },
    borrowerFields: {
      firstName: true,
      lastName: true,
      type: true,
      matricule: true,
      classe: true,
      position: true,
      email: false,
      phone: false,
      cniNumber: false
    },
    historyFields: {
      // Document fields - default selection
      documentTitle: true,
      documentAuthor: true,
      documentEditor: false,
      documentYear: false,
      documentType: true,
      documentCote: false,
      documentISBN: false,
      
      // Borrower fields - default selection
      borrowerName: true,
      borrowerFirstName: false,
      borrowerLastName: false,
      borrowerMatricule: true,
      borrowerType: true,
      borrowerClass: true,
      borrowerPosition: false,
      borrowerEmail: false,
      borrowerPhone: false,
      borrowerCNI: false,
      
      // Loan details - default selection
      borrowDate: true,
      borrowTime: false,
      expectedReturnDate: true,
      actualReturnDate: true,
      actualReturnTime: false,
      status: true,
      duration: true,
      overdueDays: true,
      isOverdue: true,
      loanPeriod: false,
      season: false,
      schoolYear: false,
      notes: false
    },
    dateRange: {
      enabled: false,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    filters: {
      documentStatus: 'all',
      borrowerType: 'all',
      historyStatus: 'all'
    }
  });

  const updateDataType = (dataType: keyof ExportConfig['dataTypes'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      dataTypes: { ...prev.dataTypes, [dataType]: enabled }
    }));
  };

  const updateDocumentField = (field: keyof ExportConfig['documentFields'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      documentFields: { ...prev.documentFields, [field]: enabled }
    }));
  };

  const updateBorrowerField = (field: keyof ExportConfig['borrowerFields'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      borrowerFields: { ...prev.borrowerFields, [field]: enabled }
    }));
  };

  const updateHistoryField = (field: keyof ExportConfig['historyFields'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      historyFields: { ...prev.historyFields, [field]: enabled }
    }));
  };

  const handleExport = async () => {
    const selectedDataTypes = Object.entries(config.dataTypes).filter(([_, enabled]) => enabled);
    
    if (selectedDataTypes.length === 0) {
      error('Sélection requise', 'Veuillez sélectionner au moins un type de données à exporter');
      return;
    }

    setIsExporting(true);
    try {
      await onExport(config);
      success('Export réussi', 'Les données ont été exportées avec succès');
      onClose();
    } catch (err) {
      error('Erreur d\'export', 'Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const selectAllDocumentFields = () => {
    setConfig(prev => ({
      ...prev,
      documentFields: Object.keys(prev.documentFields).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as ExportConfig['documentFields'])
    }));
  };

  const deselectAllDocumentFields = () => {
    setConfig(prev => ({
      ...prev,
      documentFields: Object.keys(prev.documentFields).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as ExportConfig['documentFields'])
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay">
      <div className="export-dialog">
        {/* Header */}
        <div className="dialog-header">
          <div className="header-content">
            <div className="header-icon">
              <FileSpreadsheet size={28} />
            </div>
            <div className="header-text">
              <h2 className="dialog-title">Exporter les Données</h2>
              <p className="dialog-subtitle">Choisissez les données et le format d'export</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="dialog-content">
          {/* Format Selection */}
          <div className="section">
            <h3 className="section-title">Format d'Export</h3>
            <div className="format-options">
              <div 
                className={`format-option ${config.format === 'excel' ? 'selected' : ''}`}
                onClick={() => setConfig(prev => ({ ...prev, format: 'excel' }))}
              >
                <FileSpreadsheet size={20} />
                <span>Excel (.xlsx)</span>
                <div className="format-badge">Recommandé</div>
              </div>
              <div 
                className={`format-option ${config.format === 'csv' ? 'selected' : ''}`}
                onClick={() => setConfig(prev => ({ ...prev, format: 'csv' }))}
              >
                <FileText size={20} />
                <span>CSV (.csv)</span>
              </div>
            </div>
          </div>

          {/* Data Types Selection */}
          <div className="section">
            <h3 className="section-title">Types de Données</h3>
            <div className="data-types-grid">
              {availableData.documents && (
                <div 
                  className={`data-type-card ${config.dataTypes.documents ? 'selected' : ''}`}
                  onClick={() => updateDataType('documents', !config.dataTypes.documents)}
                >
                  <BookOpen size={24} />
                  <span>Documents</span>
                  {config.dataTypes.documents ? <CheckCircle size={16} /> : <Circle size={16} />}
                </div>
              )}
              
              {availableData.borrowers && (
                <div 
                  className={`data-type-card ${config.dataTypes.borrowers ? 'selected' : ''}`}
                  onClick={() => updateDataType('borrowers', !config.dataTypes.borrowers)}
                >
                  <Users size={24} />
                  <span>Emprunteurs</span>
                  {config.dataTypes.borrowers ? <CheckCircle size={16} /> : <Circle size={16} />}
                </div>
              )}
              
              {availableData.borrowHistory && (
                <div 
                  className={`data-type-card ${config.dataTypes.borrowHistory ? 'selected' : ''}`}
                  onClick={() => updateDataType('borrowHistory', !config.dataTypes.borrowHistory)}
                >
                  <Clock size={24} />
                  <span>Historique</span>
                  {config.dataTypes.borrowHistory ? <CheckCircle size={16} /> : <Circle size={16} />}
                </div>
              )}

              <div 
                className={`data-type-card ${config.dataTypes.authors ? 'selected' : ''}`}
                onClick={() => updateDataType('authors', !config.dataTypes.authors)}
              >
                <Users size={24} />
                <span>Auteurs</span>
                {config.dataTypes.authors ? <CheckCircle size={16} /> : <Circle size={16} />}
              </div>

              <div 
                className={`data-type-card ${config.dataTypes.categories ? 'selected' : ''}`}
                onClick={() => updateDataType('categories', !config.dataTypes.categories)}
              >
                <Database size={24} />
                <span>Catégories</span>
                {config.dataTypes.categories ? <CheckCircle size={16} /> : <Circle size={16} />}
              </div>

              <div 
                className={`data-type-card ${config.dataTypes.stats ? 'selected' : ''}`}
                onClick={() => updateDataType('stats', !config.dataTypes.stats)}
              >
                <FileBarChart size={24} />
                <span>Statistiques</span>
                {config.dataTypes.stats ? <CheckCircle size={16} /> : <Circle size={16} />}
              </div>
            </div>
          </div>

          {/* Document Fields */}
          {config.dataTypes.documents && (
            <div className="section">
              <div className="section-header">
                <h3 className="section-title">Champs Documents</h3>
                <div className="field-actions">
                  <button className="action-link" onClick={selectAllDocumentFields}>Tout sélectionner</button>
                  <button className="action-link" onClick={deselectAllDocumentFields}>Tout désélectionner</button>
                </div>
              </div>
              <div className="fields-grid">
                {Object.entries({
                  titre: 'Titre',
                  auteur: 'Auteur',
                  editeur: 'Éditeur',
                  lieuEdition: 'Lieu d\'édition',
                  annee: 'Année',
                  descripteurs: 'Catégories',
                  cote: 'Cote',
                  type: 'Type',
                  isbn: 'ISBN',
                  description: 'Description',
                  estEmprunte: 'Statut d\'emprunt',
                  dateEmprunt: 'Date d\'emprunt',
                  nomEmprunteur: 'Emprunteur',
                  dateRetourPrevu: 'Date retour prévue'
                }).map(([field, label]) => (
                  <div 
                    key={field}
                    className={`field-checkbox ${config.documentFields[field as keyof ExportConfig['documentFields']] ? 'checked' : ''}`}
                    onClick={() => updateDocumentField(field as keyof ExportConfig['documentFields'], !config.documentFields[field as keyof ExportConfig['documentFields']])}
                  >
                    {config.documentFields[field as keyof ExportConfig['documentFields']] ? <CheckCircle size={16} /> : <Circle size={16} />}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Borrower Fields */}
          {config.dataTypes.borrowers && (
            <div className="section">
              <h3 className="section-title">Champs Emprunteurs</h3>
              <div className="fields-grid">
                {Object.entries({
                  firstName: 'Prénom',
                  lastName: 'Nom',
                  type: 'Type',
                  matricule: 'Matricule',
                  classe: 'Classe',
                  position: 'Poste',
                  email: 'Email',
                  phone: 'Téléphone',
                  cniNumber: 'CNI'
                }).map(([field, label]) => (
                  <div 
                    key={field}
                    className={`field-checkbox ${config.borrowerFields[field as keyof ExportConfig['borrowerFields']] ? 'checked' : ''}`}
                    onClick={() => updateBorrowerField(field as keyof ExportConfig['borrowerFields'], !config.borrowerFields[field as keyof ExportConfig['borrowerFields']])}
                  >
                    {config.borrowerFields[field as keyof ExportConfig['borrowerFields']] ? <CheckCircle size={16} /> : <Circle size={16} />}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Fields */}
          {config.dataTypes.borrowHistory && (
            <div className="section">
              <h3 className="section-title">Champs Historique des Emprunts</h3>
              
              {/* Document Information */}
              <div className="subsection">
                <h4 className="subsection-title">Informations Document</h4>
                <div className="fields-grid">
                  {Object.entries({
                    documentTitle: 'Titre du document',
                    documentAuthor: 'Auteur',
                    documentEditor: 'Éditeur',
                    documentYear: 'Année',
                    documentType: 'Type',
                    documentCote: 'Cote',
                    documentISBN: 'ISBN'
                  }).map(([field, label]) => (
                    <div 
                      key={field}
                      className={`field-checkbox ${config.historyFields[field as keyof ExportConfig['historyFields']] ? 'checked' : ''}`}
                      onClick={() => updateHistoryField(field as keyof ExportConfig['historyFields'], !config.historyFields[field as keyof ExportConfig['historyFields']])}
                    >
                      {config.historyFields[field as keyof ExportConfig['historyFields']] ? <CheckCircle size={16} /> : <Circle size={16} />}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Borrower Information */}
              <div className="subsection">
                <h4 className="subsection-title">Informations Emprunteur</h4>
                <div className="fields-grid">
                  {Object.entries({
                    borrowerName: 'Nom complet',
                    borrowerFirstName: 'Prénom',
                    borrowerLastName: 'Nom',
                    borrowerMatricule: 'Matricule',
                    borrowerType: 'Type',
                    borrowerClass: 'Classe',
                    borrowerPosition: 'Position',
                    borrowerEmail: 'Email',
                    borrowerPhone: 'Téléphone',
                    borrowerCNI: 'CNI'
                  }).map(([field, label]) => (
                    <div 
                      key={field}
                      className={`field-checkbox ${config.historyFields[field as keyof ExportConfig['historyFields']] ? 'checked' : ''}`}
                      onClick={() => updateHistoryField(field as keyof ExportConfig['historyFields'], !config.historyFields[field as keyof ExportConfig['historyFields']])}
                    >
                      {config.historyFields[field as keyof ExportConfig['historyFields']] ? <CheckCircle size={16} /> : <Circle size={16} />}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan Details */}
              <div className="subsection">
                <h4 className="subsection-title">Détails de l'Emprunt</h4>
                <div className="fields-grid">
                  {Object.entries({
                    borrowDate: 'Date emprunt',
                    borrowTime: 'Heure emprunt',
                    expectedReturnDate: 'Date retour prévue',
                    actualReturnDate: 'Date retour effective',
                    actualReturnTime: 'Heure retour',
                    status: 'Statut',
                    duration: 'Durée (jours)',
                    overdueDays: 'Jours de retard',
                    isOverdue: 'En retard (Oui/Non)',
                    loanPeriod: 'Période d\'emprunt',
                    season: 'Saison',
                    schoolYear: 'Année scolaire',
                    notes: 'Notes'
                  }).map(([field, label]) => (
                    <div 
                      key={field}
                      className={`field-checkbox ${config.historyFields[field as keyof ExportConfig['historyFields']] ? 'checked' : ''}`}
                      onClick={() => updateHistoryField(field as keyof ExportConfig['historyFields'], !config.historyFields[field as keyof ExportConfig['historyFields']])}
                    >
                      {config.historyFields[field as keyof ExportConfig['historyFields']] ? <CheckCircle size={16} /> : <Circle size={16} />}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          {config.dataTypes.borrowHistory && (
            <div className="section">
              <div className="section-header">
                <h3 className="section-title">Filtre par Date</h3>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="dateRange"
                    checked={config.dateRange.enabled}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, enabled: e.target.checked }
                    }))}
                  />
                  <label htmlFor="dateRange"></label>
                </div>
              </div>
              
              {config.dateRange.enabled && (
                <div className="date-range-inputs">
                  <div className="date-input">
                    <label>Date de début</label>
                    <input
                      type="date"
                      value={config.dateRange.startDate}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, startDate: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="date-input">
                    <label>Date de fin</label>
                    <input
                      type="date"
                      value={config.dateRange.endDate}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, endDate: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="section">
            <h3 className="section-title">Filtres</h3>
            <div className="filters-grid">
              {config.dataTypes.documents && (
                <div className="filter-group">
                  <label>Statut Documents</label>
                  <select 
                    value={config.filters.documentStatus} 
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      filters: { ...prev.filters, documentStatus: e.target.value as any }
                    }))}
                  >
                    <option value="all">Tous</option>
                    <option value="available">Disponibles</option>
                    <option value="borrowed">Empruntés</option>
                  </select>
                </div>
              )}

              {config.dataTypes.borrowers && (
                <div className="filter-group">
                  <label>Type Emprunteurs</label>
                  <select 
                    value={config.filters.borrowerType} 
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      filters: { ...prev.filters, borrowerType: e.target.value as any }
                    }))}
                  >
                    <option value="all">Tous</option>
                    <option value="student">Étudiants</option>
                    <option value="staff">Personnel</option>
                  </select>
                </div>
              )}

              {config.dataTypes.borrowHistory && (
                <div className="filter-group">
                  <label>Statut Historique</label>
                  <select 
                    value={config.filters.historyStatus} 
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      filters: { ...prev.filters, historyStatus: e.target.value as any }
                    }))}
                  >
                    <option value="all">Tous</option>
                    <option value="active">En cours</option>
                    <option value="returned">Rendus</option>
                    <option value="overdue">En retard</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <MicroButton variant="secondary" onClick={onClose}>
            Annuler
          </MicroButton>
          <MicroButton 
            variant="success" 
            icon={Download} 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Export en cours...' : `Exporter en ${config.format.toUpperCase()}`}
          </MicroButton>
        </div>
      </div>

      <style>{`
        .export-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

        .export-dialog {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .dialog-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dialog-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .dialog-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
        }

        .dialog-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .subsection {
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.02);
          border-radius: 8px;
          border-left: 3px solid #3E5C49;
        }

        .subsection-title {
          font-size: 15px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 12px 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .field-actions {
          display: flex;
          gap: 16px;
        }

        .action-link {
          background: none;
          border: none;
          color: #3E5C49;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .action-link:hover {
          color: #2E453A;
        }

        .format-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .format-option {
          padding: 20px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .format-option:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .format-option.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.1);
        }

        .format-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #C2571B;
          color: #F3EED9;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .data-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .data-type-card {
          padding: 20px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          position: relative;
        }

        .data-type-card:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .data-type-card.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.1);
        }

        .data-type-card svg:last-child {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #3E5C49;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .field-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .field-checkbox:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .field-checkbox.checked {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-switch label {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .toggle-switch label:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + label {
          background-color: #3E5C49;
        }

        .toggle-switch input:checked + label:before {
          transform: translateX(26px);
        }

        .date-range-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .date-input label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #2E2E2E;
          margin-bottom: 8px;
        }

        .date-input input {
          width: 100%;
          padding: 12px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.3s ease;
        }

        .date-input input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 14px;
          font-weight: 500;
          color: #2E2E2E;
        }

        .filter-group select {
          padding: 12px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.3s ease;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .dialog-footer {
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .export-dialog {
            margin: 12px;
          }

          .data-types-grid,
          .fields-grid,
          .filters-grid {
            grid-template-columns: 1fr;
          }

          .format-options {
            grid-template-columns: 1fr;
          }

          .date-range-inputs {
            grid-template-columns: 1fr;
          }

          .dialog-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};