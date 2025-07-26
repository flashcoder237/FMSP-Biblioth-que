import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  Users, 
  BookOpen, 
  Clock,
  Settings,
  FileSpreadsheet,
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ReportService, ReportData, ExportOptions } from '../services/ReportService';
import { Document, Borrower, BorrowHistory } from '../../types';
import { useQuickToast } from './ToastSystem';

interface ReportsManagerProps {
  documents: Document[];
  borrowers: Borrower[];
  borrowHistory: BorrowHistory[];
  onClose: () => void;
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  documents,
  borrowers,
  borrowHistory,
  onClose
}) => {
  const [selectedReportType, setSelectedReportType] = useState<'documents' | 'borrowers' | 'history'>('documents');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('pdf');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: new Date().toISOString().split('T')[0]
  });
  const [useDateFilter, setUseDateFilter] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState<ReportData | null>(null);
  const toast = useQuickToast();

  useEffect(() => {
    // Définir la date de début par défaut (30 jours en arrière)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setDateRange(prev => ({
      ...prev,
      start: thirtyDaysAgo.toISOString().split('T')[0]
    }));
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      const options: ExportOptions = {
        format: exportFormat,
        includeDetails,
        dateRange: useDateFilter ? dateRange : undefined
      };

      let reportData: ReportData;

      switch (selectedReportType) {
        case 'documents':
          reportData = ReportService.generateDocumentReport(documents, options);
          break;
        case 'borrowers':
          reportData = ReportService.generateBorrowerReport(borrowers, borrowHistory, options);
          break;
        case 'history':
          reportData = ReportService.generateBorrowHistoryReport(borrowHistory, options);
          break;
        default:
          throw new Error('Type de rapport non reconnu');
      }

      setReportPreview(reportData);
      toast.success('Rapport généré', 'Le rapport a été généré avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur de génération', 'Erreur lors de la génération du rapport: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async () => {
    if (!reportPreview) return;

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      let filename = `${selectedReportType}_${timestamp}`;
      let content: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'csv':
          content = ReportService.exportToCSV(reportPreview);
          filename += '.csv';
          mimeType = 'text/csv;charset=utf-8';
          break;
        case 'pdf':
          content = ReportService.generatePDFContent(reportPreview);
          filename += '.html'; // L'utilisateur pourra ensuite imprimer en PDF
          mimeType = 'text/html;charset=utf-8';
          break;
        case 'excel':
          // Pour Excel, on génère un CSV avec un type MIME spécifique
          content = ReportService.exportToCSV(reportPreview);
          filename += '.csv';
          mimeType = 'application/vnd.ms-excel';
          break;
        default:
          throw new Error('Format d\'export non supporté');
      }

      ReportService.downloadFile(content, filename, mimeType);
      toast.success('Téléchargement réussi', `Le rapport ${filename} a été téléchargé`);
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur de téléchargement', 'Erreur lors du téléchargement: ' + error.message);
    }
  };

  const reportTypes = [
    {
      key: 'documents' as const,
      title: 'Rapport des Documents',
      description: 'Liste complète des documents avec leur statut',
      icon: BookOpen,
      count: documents.length
    },
    {
      key: 'borrowers' as const,
      title: 'Rapport des Emprunteurs',
      description: 'Statistiques et informations des emprunteurs',
      icon: Users,
      count: borrowers.length
    },
    {
      key: 'history' as const,
      title: 'Historique des Emprunts',
      description: 'Historique complet des emprunts et retours',
      icon: Clock,
      count: borrowHistory.length
    }
  ];

  const exportFormats = [
    {
      key: 'pdf' as const,
      title: 'PDF',
      description: 'Format imprimable avec mise en forme',
      icon: FileText
    },
    {
      key: 'csv' as const,
      title: 'CSV',
      description: 'Données brutes pour tableur',
      icon: FileSpreadsheet
    },
    {
      key: 'excel' as const,
      title: 'Excel',
      description: 'Compatible Microsoft Excel',
      icon: FileSpreadsheet
    }
  ];

  return (
    <div className="reports-manager">
      <div className="reports-overlay" onClick={onClose} />
      
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-info">
            <BarChart3 size={24} />
            <div>
              <h2>Génération de Rapports</h2>
              <p>Créez et exportez des rapports détaillés</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="reports-content">
          {/* Sélection du type de rapport */}
          <div className="section">
            <h3>Type de Rapport</h3>
            <div className="report-types">
              {reportTypes.map(type => (
                <button
                  key={type.key}
                  className={`report-type-card ${selectedReportType === type.key ? 'selected' : ''}`}
                  onClick={() => setSelectedReportType(type.key)}
                >
                  <div className="card-icon">
                    <type.icon size={24} />
                  </div>
                  <div className="card-content">
                    <h4>{type.title}</h4>
                    <p>{type.description}</p>
                    <span className="count">{type.count} éléments</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options de filtrage */}
          <div className="section">
            <h3>Options de Filtrage</h3>
            <div className="filter-options">
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useDateFilter}
                    onChange={(e) => setUseDateFilter(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Filtrer par période
                </label>
              </div>

              {useDateFilter && (
                <div className="date-range">
                  <div className="date-input">
                    <label>Du</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div className="date-input">
                    <label>Au</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Inclure les détails complets
                </label>
              </div>
            </div>
          </div>

          {/* Format d'export */}
          <div className="section">
            <h3>Format d'Export</h3>
            <div className="export-formats">
              {exportFormats.map(format => (
                <button
                  key={format.key}
                  className={`format-option ${exportFormat === format.key ? 'selected' : ''}`}
                  onClick={() => setExportFormat(format.key)}
                >
                  <format.icon size={20} />
                  <div>
                    <span className="format-title">{format.title}</span>
                    <span className="format-description">{format.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu du rapport */}
          {reportPreview && (
            <div className="section">
              <h3>Aperçu du Rapport</h3>
              <div className="report-preview">
                <div className="preview-header">
                  <h4>{reportPreview.title}</h4>
                  <p>{reportPreview.subtitle}</p>
                  <span className="generation-time">
                    Généré le {new Date(reportPreview.generatedAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                {reportPreview.summary && (
                  <div className="summary-preview">
                    <h5>Résumé</h5>
                    <div className="summary-grid">
                      {Object.entries(reportPreview.summary).map(([key, value]) => (
                        <div key={key} className="summary-item">
                          <span className="summary-label">{key}:</span>
                          <span className="summary-value">{value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="data-preview">
                  <p><strong>{reportPreview.data.length}</strong> éléments dans ce rapport</p>
                  {reportPreview.data.length > 0 && (
                    <div className="sample-data">
                      <span>Aperçu des premières lignes:</span>
                      <pre>{JSON.stringify(reportPreview.data.slice(0, 2), null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="reports-actions">
          <button
            className="generate-btn"
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="spinning" />
                Génération...
              </>
            ) : (
              <>
                <Settings size={16} />
                Générer le Rapport
              </>
            )}
          </button>

          {reportPreview && (
            <button
              className="download-btn"
              onClick={downloadReport}
            >
              <Download size={16} />
              Télécharger ({exportFormat.toUpperCase()})
            </button>
          )}
        </div>
      </div>

      <style>{`
        .reports-manager {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .reports-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }

        .reports-container {
          position: relative;
          background: white;
          border-radius: 20px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.3);
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border-radius: 20px 20px 0 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-info h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
        }

        .header-info p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .close-btn {
          background: rgba(243, 238, 217, 0.1);
          border: none;
          color: #F3EED9;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(220, 38, 38, 0.2);
          color: #DC2626;
        }

        .reports-content {
          padding: 32px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #3E5C49;
        }

        .report-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .report-type-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 2px solid rgba(229, 220, 194, 0.3);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .report-type-card:hover {
          border-color: rgba(62, 92, 73, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.1);
        }

        .report-type-card.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .card-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #3E5C49;
        }

        .card-content p {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #4A4A4A;
          line-height: 1.4;
        }

        .count {
          font-size: 12px;
          color: #C2571B;
          font-weight: 600;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #4A4A4A;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .date-range {
          display: flex;
          gap: 16px;
          margin-left: 24px;
        }

        .date-input {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-input label {
          font-size: 12px;
          font-weight: 600;
          color: #4A4A4A;
        }

        .date-input input {
          padding: 8px 12px;
          border: 1px solid rgba(229, 220, 194, 0.4);
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .date-input input:focus {
          border-color: #3E5C49;
        }

        .export-formats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .format-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid rgba(229, 220, 194, 0.3);
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .format-option:hover {
          border-color: rgba(62, 92, 73, 0.3);
        }

        .format-option.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .format-title {
          display: block;
          font-weight: 600;
          color: #3E5C49;
          font-size: 14px;
        }

        .format-description {
          display: block;
          font-size: 12px;
          color: #4A4A4A;
        }

        .report-preview {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(229, 220, 194, 0.3);
          border-radius: 12px;
          padding: 20px;
        }

        .preview-header h4 {
          margin: 0 0 4px 0;
          color: #3E5C49;
          font-size: 16px;
        }

        .preview-header p {
          margin: 0 0 8px 0;
          color: #4A4A4A;
          font-size: 14px;
        }

        .generation-time {
          font-size: 12px;
          color: #C2571B;
          font-weight: 600;
        }

        .summary-preview {
          margin: 16px 0;
          padding: 16px;
          background: white;
          border-radius: 8px;
        }

        .summary-preview h5 {
          margin: 0 0 12px 0;
          color: #3E5C49;
          font-size: 14px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(62, 92, 73, 0.05);
          border-radius: 6px;
          font-size: 12px;
        }

        .summary-label {
          font-weight: 600;
          color: #4A4A4A;
        }

        .summary-value {
          color: #C2571B;
          font-weight: 600;
        }

        .data-preview {
          margin-top: 16px;
          padding: 16px;
          background: white;
          border-radius: 8px;
        }

        .sample-data {
          margin-top: 8px;
        }

        .sample-data pre {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          font-size: 11px;
          overflow-x: auto;
          max-height: 150px;
          overflow-y: auto;
        }

        .reports-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(229, 220, 194, 0.3);
          background: rgba(243, 238, 217, 0.1);
          border-radius: 0 0 20px 20px;
        }

        .generate-btn, .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .generate-btn {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }

        .generate-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1F2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .download-btn {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
        }

        .download-btn:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194, 87, 27, 0.3);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .reports-container {
            margin: 10px;
            max-height: calc(100vh - 20px);
          }

          .reports-header {
            padding: 20px;
          }

          .reports-content {
            padding: 20px;
          }

          .report-types {
            grid-template-columns: 1fr;
          }

          .export-formats {
            grid-template-columns: 1fr;
          }

          .date-range {
            flex-direction: column;
            margin-left: 0;
          }

          .reports-actions {
            flex-direction: column;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};