import React, { useState } from 'react';
import { 
  Clock, 
  User, 
  Calendar, 
  Book,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  X,
  ArrowUpDown,
  Eye,
  RotateCcw
} from 'lucide-react';
import { Document } from '../../types';

interface BorrowedDocumentsProps {
  documents: Document[]; // Array of documents (already filtered to borrowed ones)
  onReturn: (documentId: number) => void; // Simplified callback
}

export const BorrowedDocuments: React.FC<BorrowedDocumentsProps> = ({ documents, onReturn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'borrower' | 'date' | 'title' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'warning' | 'overdue'>('all');

  const handleReturn = (document: Document) => {
    if (window.confirm(`Confirmer le retour de "${document.titre}" emprunté par ${document.nomEmprunteur} ?`)) {
      onReturn(document.id!);
    }
  };

  // Filter and sort documents
  const processedDocuments = documents
    .filter(doc => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        doc.titre.toLowerCase().includes(query) ||
        doc.auteur.toLowerCase().includes(query) ||
        doc.nomEmprunteur?.toLowerCase().includes(query)
      );
    })
    .filter(doc => {
      if (filterStatus === 'all') return true;
      
      const borrowDate = new Date(doc.dateEmprunt!);
      const expectedDate = new Date(doc.dateRetourPrevu!);
      const today = new Date();
      const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterStatus) {
        case 'overdue': return diffDays < 0;
        case 'warning': return diffDays >= 0 && diffDays <= 3;
        case 'normal': return diffDays > 3;
        default: return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.titre.localeCompare(b.titre);
        case 'borrower': return (a.nomEmprunteur || '').localeCompare(b.nomEmprunteur || '');
        case 'date': return new Date(a.dateEmprunt!).getTime() - new Date(b.dateEmprunt!).getTime();
        case 'status':
          const getStatusPriority = (doc: Document) => {
            const expectedDate = new Date(doc.dateRetourPrevu!);
            const today = new Date();
            const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) return 3; // overdue
            if (diffDays <= 3) return 2; // warning
            return 1; // normal
          };
          return getStatusPriority(b) - getStatusPriority(a);
        default: return 0;
      }
    });

  const getStatusInfo = (document: Document) => {
    const borrowDate = new Date(document.dateEmprunt!);
    const expectedDate = new Date(document.dateRetourPrevu!);
    const today = new Date();
    const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        status: 'overdue',
        label: `En retard de ${Math.abs(diffDays)} jour(s)`,
        className: 'status-overdue',
        icon: AlertTriangle
      };
    } else if (diffDays <= 3) {
      return {
        status: 'warning', 
        label: diffDays === 0 ? 'À rendre aujourd\'hui' : `${diffDays} jour(s) restant(s)`,
        className: 'status-warning',
        icon: Clock
      };
    } else {
      return {
        status: 'normal',
        label: `${diffDays} jour(s) restant(s)`,
        className: 'status-normal', 
        icon: CheckCircle
      };
    }
  };

  return (
    <div className="borrowed-documents-container">
      <div className="page-content">
        {/* Enhanced Header */}
        <div className="page-header">
          <div className="header-main">
            <div className="header-icon">
              <Clock size={36} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Documents empruntés</h1>
              <p className="page-subtitle">
                {documents.length} document(s) actuellement en circulation
              </p>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="enhanced-controls">
            <div className="controls-row">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher par document, auteur, emprunteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-controls">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="filter-select"
                >
                  <option value="date">Trier par date d'emprunt</option>
                  <option value="title">Trier par titre</option>
                  <option value="borrower">Trier par emprunteur</option>
                  <option value="status">Trier par statut</option>
                </select>

                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="filter-select"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="overdue">En retard</option>
                  <option value="warning">À rendre bientôt</option>
                  <option value="normal">Dans les temps</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchQuery && (
          <div className="results-summary">
            <span className="results-count">
              {processedDocuments.length} résultat(s) pour "{searchQuery}"
            </span>
          </div>
        )}

        {/* Documents List */}
        {processedDocuments.length > 0 ? (
          <div className="documents-grid">
            {processedDocuments.map(document => {
              const statusInfo = getStatusInfo(document);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={document.id} className={`document-card ${statusInfo.className}`}>
                  <div className="document-header">
                    <div className="document-info">
                      <h3 className="document-title">{document.titre}</h3>
                      <p className="document-author">{document.auteur}</p>
                      <p className="document-details">
                        {document.editeur} • {document.annee}
                      </p>
                    </div>
                    <div className="document-status">
                      <StatusIcon size={20} />
                    </div>
                  </div>

                  <div className="borrower-info">
                    <div className="borrower-details">
                      <div className="borrower-name">
                        <User size={16} />
                        <span>{document.nomEmprunteur}</span>
                      </div>
                      <div className="borrow-dates">
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>Emprunté le {new Date(document.dateEmprunt!).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="date-info">
                          <Clock size={14} />
                          <span>À rendre le {new Date(document.dateRetourPrevu!).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="document-status-bar">
                    <div className={`status-badge ${statusInfo.className}`}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      onClick={() => handleReturn(document)}
                      className="return-button"
                      title="Marquer comme rendu"
                    >
                      <RotateCcw size={16} />
                      Retour
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {searchQuery ? (
                <Search size={80} />
              ) : (
                <Clock size={80} />
              )}
            </div>
            <h3 className="empty-title">
              {documents.length === 0 ? 'Aucun document emprunté' : 'Aucun résultat'}
            </h3>
            <p className="empty-description">
              {documents.length === 0 
                ? 'Tous les documents sont actuellement disponibles dans la bibliothèque.'
                : searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : 'Aucun document ne correspond aux filtres sélectionnés.'
              }
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button 
                className="clear-filters"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .borrowed-documents-container {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }

        .page-content {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0;
        }

        .enhanced-controls {
          border-top: 1px solid rgba(243, 238, 217, 0.3);
          padding-top: 24px;
        }

        .controls-row {
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 14px;
          background: #FFFFFF;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          color: #2E2E2E;
        }

        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          padding: 4px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: #f5f5f5;
          color: #2E2E2E;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          background: #FFFFFF;
          font-size: 14px;
          color: #2E2E2E;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          min-width: 180px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .results-summary {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 16px 24px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }

        .results-count {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .document-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-left: 4px solid #E5DCC2;
          border: 1px solid rgba(229, 220, 194, 0.2);
        }

        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
        }

        .document-card.status-overdue {
          border-left-color: #DC2626;
          background: linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%);
        }

        .document-card.status-warning {
          border-left-color: #F59E0B;
          background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%);
        }

        .document-card.status-normal {
          border-left-color: #10B981;
          background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .document-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .document-author {
          font-size: 14px;
          color: #3E5C49;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .document-details {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }

        .document-status {
          padding: 8px;
          border-radius: 8px;
          background: rgba(243, 238, 217, 0.5);
        }

        .borrower-info {
          padding: 16px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }

        .borrower-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 12px;
        }

        .borrow-dates {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6E6E6E;
        }

        .document-status-bar {
          margin-bottom: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.status-overdue {
          background: #FEE2E2;
          color: #DC2626;
        }

        .status-badge.status-warning {
          background: #FEF3C7;
          color: #F59E0B;
        }

        .status-badge.status-normal {
          background: #D1FAE5;
          color: #10B981;
        }

        .document-actions {
          display: flex;
          justify-content: flex-end;
        }

        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .return-button:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(229, 220, 194, 0.2);
        }

        .empty-icon {
          margin-bottom: 24px;
          color: #E5DCC2;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .empty-description {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .clear-filters {
          padding: 12px 24px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .clear-filters:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 16px;
          }

          .page-header {
            padding: 20px;
          }

          .header-main {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .controls-row {
            flex-direction: column;
            gap: 16px;
          }

          .search-container {
            min-width: unset;
          }

          .filter-controls {
            width: 100%;
            justify-content: space-between;
          }

          .filter-select {
            flex: 1;
            min-width: unset;
          }

          .documents-grid {
            grid-template-columns: 1fr;
          }

          .document-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};