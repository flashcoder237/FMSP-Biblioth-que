import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  User, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Search,
  X,
  RotateCcw
} from 'lucide-react';

// Types
interface Document {
  id?: number;
  titre: string;
  auteur: string;
  editeur: string;
  annee: string;
  nomEmprunteur?: string;
  dateEmprunt?: string;
  dateRetourPrevu?: string;
}

interface BorrowedDocumentsProps {
  documents: Document[];
  onReturn: (documentId: number) => void;
  onClose?: () => void;
}

type SortBy = 'borrower' | 'date' | 'title' | 'status';
type FilterStatus = 'all' | 'normal' | 'warning' | 'overdue';

interface StatusInfo {
  status: string;
  label: string;
  className: string;
  icon: React.ComponentType<any>;
}

// Utility functions
const getStatusInfo = (document: Document): StatusInfo => {
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

const getStatusPriority = (doc: Document): number => {
  const expectedDate = new Date(doc.dateRetourPrevu!);
  const today = new Date();
  const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 3; // overdue
  if (diffDays <= 3) return 2; // warning
  return 1; // normal
};

// Sub-components
const SearchBar: React.FC<{
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ searchQuery, onSearchChange }) => (
  <div className="search-container">
    <div className="search-input-wrapper">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Rechercher par document, auteur, emprunteur..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button 
          className="clear-search"
          onClick={() => onSearchChange('')}
        >
          <X size={18} />
        </button>
      )}
    </div>
  </div>
);

const FilterControls: React.FC<{
  sortBy: SortBy;
  filterStatus: FilterStatus;
  onSortChange: (sort: SortBy) => void;
  onFilterChange: (filter: FilterStatus) => void;
}> = ({ sortBy, filterStatus, onSortChange, onFilterChange }) => (
  <div className="filter-controls">
    <select 
      value={sortBy} 
      onChange={(e) => onSortChange(e.target.value as SortBy)}
      className="filter-select"
    >
      <option value="date">Trier par date d'emprunt</option>
      <option value="title">Trier par titre</option>
      <option value="borrower">Trier par emprunteur</option>
      <option value="status">Trier par statut</option>
    </select>

    <select 
      value={filterStatus} 
      onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
      className="filter-select"
    >
      <option value="all">Tous les statuts</option>
      <option value="overdue">En retard</option>
      <option value="warning">À rendre bientôt</option>
      <option value="normal">Dans les temps</option>
    </select>
  </div>
);

const DocumentCard: React.FC<{
  document: Document;
  onReturn: (doc: Document) => void;
}> = ({ document, onReturn }) => {
  const statusInfo = getStatusInfo(document);
  const StatusIcon = statusInfo.icon;
  
  return (
    <div className={`document-card ${statusInfo.className}`}>
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
          onClick={() => onReturn(document)}
          className="return-button"
          title="Marquer comme rendu"
        >
          <RotateCcw size={16} />
          Retour
        </button>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  hasDocuments: boolean;
  searchQuery: string;
  filterStatus: FilterStatus;
  onClearFilters: () => void;
}> = ({ hasDocuments, searchQuery, filterStatus, onClearFilters }) => (
  <div className="empty-state">
    <div className="empty-icon">
      {searchQuery ? (
        <Search size={80} />
      ) : (
        <Clock size={80} />
      )}
    </div>
    <h3 className="empty-title">
      {!hasDocuments ? 'Aucun document emprunté' : 'Aucun résultat'}
    </h3>
    <p className="empty-description">
      {!hasDocuments 
        ? 'Tous les documents sont actuellement disponibles dans la bibliothèque.'
        : searchQuery 
        ? `Aucun résultat pour "${searchQuery}"`
        : 'Aucun document ne correspond aux filtres sélectionnés.'
      }
    </p>
    {(searchQuery || filterStatus !== 'all') && (
      <button 
        className="clear-filters"
        onClick={onClearFilters}
      >
        Effacer les filtres
      </button>
    )}
  </div>
);

// Main Component
export const BorrowedDocuments: React.FC<BorrowedDocumentsProps> = ({ documents, onReturn, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const handleReturn = (document: Document) => {
    if (window.confirm(`Confirmer le retour de "${document.titre}" emprunté par ${document.nomEmprunteur} ?`)) {
      onReturn(document.id!);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
  };

  // Use only real documents - no mock data to ensure institution isolation
  const mockDocuments = documents;

  // Processed documents with memoization for performance
  const processedDocuments = useMemo(() => {
    return mockDocuments
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
          case 'status': return getStatusPriority(b) - getStatusPriority(a);
          default: return 0;
        }
      });
  }, [mockDocuments, searchQuery, filterStatus, sortBy]);

  return (
    <div className="borrowed-documents-container">
      <div className="page-content">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-main">
            <div className="header-icon">
              <Clock size={36} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Documents empruntés</h1>
              <p className="page-subtitle">
                {mockDocuments.length} document(s) actuellement en circulation
              </p>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="enhanced-controls">
            <div className="controls-row">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <FilterControls
                sortBy={sortBy}
                filterStatus={filterStatus}
                onSortChange={setSortBy}
                onFilterChange={setFilterStatus}
              />
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

        {/* Content Section */}
        {processedDocuments.length > 0 ? (
          <div className="documents-grid">
            {processedDocuments.map(document => (
              <DocumentCard
                key={document.id}
                document={document}
                onReturn={handleReturn}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasDocuments={mockDocuments.length > 0}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      <style>{`
        /* Variables CSS pour la palette de couleurs */
        :root {
          --dark-green: #3E5C49;
          --medium-green: #5A7A65;
          --light-green: #7A9A85;
          --warm-brown: #C2571B;
          --medium-brown: #A04315;
          --dark-brown: #8A3612;
          --cream: #F8F6F0;
          --light-cream: #FEFDFB;
          --beige: #E5DCC2;
          --light-beige: #F3EED9;
          --warm-beige: #C2A678;
          --text-dark: #2A2A2A;
          --text-medium: #4A4A4A;
          --text-light: #6A6A6A;
          --white: #FFFFFF;
          --error: #DC2626;
          --warning: #D97706;
          --success: #059669;
        }

        .borrowed-documents-container {
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(135deg, var(--cream) 0%, var(--light-beige) 100%);
          min-height: 100vh;
        }

        .page-content {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header Styles - Fond vert sombre */
        .page-header {
          background: linear-gradient(135deg, var(--dark-green) 0%, var(--medium-green) 100%);
          border-radius: 24px;
          padding: 0;
          margin-bottom: 32px;
          box-shadow: 
            0 20px 60px rgba(62, 92, 73, 0.3),
            0 8px 32px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(62, 92, 73, 0.3);
          backdrop-filter: blur(20px);
          overflow: hidden;
          position: relative;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            transparent 100%);
          pointer-events: none;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 40px 40px 32px 40px;
          position: relative;
          z-index: 2;
        }

        .header-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--warm-brown) 0%, var(--medium-brown) 30%, var(--dark-brown) 100%);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cream);
          box-shadow: 
            0 16px 40px rgba(194, 87, 27, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
          position: relative;
          transform: rotate(-2deg);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .header-icon:hover {
          transform: rotate(0deg) scale(1.05);
          box-shadow: 
            0 20px 50px rgba(194, 87, 27, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
        }

        .header-icon::before {
          content: '';
          position: absolute;
          inset: 3px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.1) 50%, 
            transparent 100%);
          border-radius: 25px;
        }

        .header-icon::after {
          content: '';
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--success) 0%, #047857 100%);
          border-radius: 50%;
          border: 3px solid var(--white);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 36px;
          font-weight: 900;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
          color: var(--cream);
          position: relative;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .page-title::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 60px;
          height: 3px;
        }

        .page-subtitle {
          font-size: 18px;
          color: var(--beige);
          margin: 0;
          font-weight: 600;
          opacity: 0.95;
        }

        /* Controls Styles */
        .enhanced-controls {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding: 32px 40px 40px 40px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          position: relative;
          z-index: 2;
        }

        .enhanced-controls::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.3) 20%, 
            rgba(194, 87, 27, 0.4) 50%, 
            rgba(255, 255, 255, 0.3) 80%, 
            transparent 100%);
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
          min-width: 320px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          color: var(--text-light);
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 18px 18px 18px 52px;
          border: 2px solid var(--beige);
          border-radius: 16px;
          font-size: 15px;
          background: var(--white);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          color: var(--text-dark);
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .search-input::placeholder {
          color: var(--text-light);
          font-weight: 400;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--warm-brown);
          box-shadow: 0 0 0 4px rgba(194, 87, 27, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08);
          background: var(--light-cream);
          transform: translateY(-1px);
        }

        .clear-search {
          position: absolute;
          right: 14px;
          padding: 6px;
          border: none;
          background: var(--light-beige);
          color: var(--text-medium);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: var(--beige);
          color: var(--text-dark);
          transform: scale(1.05);
        }

        .filter-controls {
          display: flex;
          gap: 16px;
        }

        .filter-select {
          padding: 16px 20px;
          border: 2px solid var(--beige);
          border-radius: 12px;
          background: var(--white);
          font-size: 14px;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          min-width: 190px;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--warm-brown);
          box-shadow: 0 0 0 4px rgba(194, 87, 27, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08);
          background: var(--light-cream);
          transform: translateY(-1px);
        }

        /* Results Summary */
        .results-summary {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 18px 26px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--beige);
          backdrop-filter: blur(10px);
        }

        .results-count {
          font-size: 15px;
          color: var(--text-medium);
          font-weight: 600;
        }

        /* Documents Grid */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
          gap: 24px;
        }

        /* Document Card Styles */
        .document-card {
          background: var(--white);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-left: 5px solid var(--beige);
          border: 1px solid rgba(229, 220, 194, 0.3);
          position: relative;
          overflow: hidden;
        }

        .document-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--beige) 50%, transparent 100%);
        }

        .document-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(0, 0, 0, 0.12);
        }

        .document-card.status-overdue {
          border-left-color: var(--error);
          background: linear-gradient(135deg, #FEF2F2 0%, var(--white) 100%);
        }

        .document-card.status-overdue::before {
          background: linear-gradient(90deg, transparent 0%, var(--error) 50%, transparent 100%);
        }

        .document-card.status-warning {
          border-left-color: var(--warning);
          background: linear-gradient(135deg, #FFFBEB 0%, var(--white) 100%);
        }

        .document-card.status-warning::before {
          background: linear-gradient(90deg, transparent 0%, var(--warning) 50%, transparent 100%);
        }

        .document-card.status-normal {
          border-left-color: var(--success);
          background: linear-gradient(135deg, #ECFDF5 0%, var(--white) 100%);
        }

        .document-card.status-normal::before {
          background: linear-gradient(90deg, transparent 0%, var(--success) 50%, transparent 100%);
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .document-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 10px 0;
          line-height: 1.3;
          letter-spacing: -0.2px;
        }

        .document-author {
          font-size: 15px;
          color: var(--dark-green);
          font-weight: 700;
          margin: 0 0 6px 0;
        }

        .document-details {
          font-size: 13px;
          color: var(--text-light);
          margin: 0;
          font-weight: 500;
        }

        .document-status {
          padding: 10px;
          border-radius: 12px;
          background: var(--light-beige);
          backdrop-filter: blur(4px);
          color: var(--dark-green);
        }

        .borrower-info {
          padding: 20px;
          background: var(--light-beige);
          border-radius: 16px;
          margin-bottom: 20px;
          border: 1px solid var(--beige);
          backdrop-filter: blur(4px);
        }

        .borrower-name {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 14px;
          font-size: 15px;
        }

        .borrower-name svg {
          color: var(--dark-green);
        }

        .borrow-dates {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-medium);
          font-weight: 500;
        }

        .date-info svg {
          color: var(--warm-beige);
        }

        .document-status-bar {
          margin-bottom: 20px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .status-badge.status-overdue {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          color: var(--error);
        }

        .status-badge.status-warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          color: var(--warning);
        }

        .status-badge.status-normal {
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          color: var(--success);
        }

        .document-actions {
          display: flex;
          justify-content: flex-end;
        }

        .return-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: linear-gradient(135deg, var(--dark-green) 0%, var(--medium-green) 100%);
          color: var(--cream);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 6px 20px rgba(62, 92, 73, 0.25);
        }

        .return-button:hover {
          background: linear-gradient(135deg, var(--medium-green) 0%, var(--light-green) 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.35);
        }

        .return-button:active {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--beige);
          backdrop-filter: blur(10px);
        }

        .empty-icon {
          margin-bottom: 28px;
          color: var(--warm-beige);
        }

        .empty-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-dark);
          margin: 0 0 16px 0;
          letter-spacing: -0.4px;
        }

        .empty-description {
          font-size: 16px;
          color: var(--text-medium);
          margin: 0 0 36px 0;
          line-height: 1.6;
          font-weight: 500;
        }

        .clear-filters {
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--warm-brown) 0%, var(--medium-brown) 100%);
          color: var(--cream);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 6px 20px rgba(194, 87, 27, 0.25);
        }

        .clear-filters:hover {
          background: linear-gradient(135deg, var(--medium-brown) 0%, var(--dark-brown) 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(194, 87, 27, 0.35);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-content {
            padding: 20px;
          }

          .page-header {
            padding: 0;
          }

          .header-main {
            flex-direction: column;
            text-align: center;
            gap: 20px;
            padding: 32px 24px;
          }

          .header-icon {
            width: 72px;
            height: 72px;
          }

          .page-title {
            font-size: 28px;
          }

          .enhanced-controls {
            padding: 24px;
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
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .page-content {
            padding: 16px;
          }

          .header-main {
            padding: 24px 20px;
          }

          .header-icon {
            width: 64px;
            height: 64px;
          }

          .page-title {
            font-size: 24px;
          }

          .enhanced-controls {
            padding: 20px;
          }

          .search-input {
            padding: 16px 16px 16px 48px;
            font-size: 14px;
          }

          .filter-select {
            padding: 14px 16px;
            font-size: 13px;
            min-width: unset;
          }

          .document-card {
            padding: 20px;
          }

          .document-title {
            font-size: 18px;
          }

          .borrower-info {
            padding: 16px;
          }

          .return-button {
            padding: 12px 20px;
            font-size: 13px;
          }

          .empty-state {
            padding: 60px 24px;
          }

          .empty-title {
            font-size: 22px;
          }

          .empty-description {
            font-size: 15px;
          }
        }

        /* Hover animations and micro-interactions */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .document-card {
          animation: fadeInUp 0.5s ease-out;
        }

        .document-card:nth-child(1) { animation-delay: 0.1s; }
        .document-card:nth-child(2) { animation-delay: 0.2s; }
        .document-card:nth-child(3) { animation-delay: 0.3s; }
        .document-card:nth-child(4) { animation-delay: 0.4s; }
        .document-card:nth-child(5) { animation-delay: 0.5s; }
        .document-card:nth-child(6) { animation-delay: 0.6s; }

        /* Improved accessibility */
        .search-input:focus-visible,
        .filter-select:focus-visible,
        .return-button:focus-visible,
        .clear-filters:focus-visible {
          outline: 3px solid var(--warm-brown);
          outline-offset: 2px;
        }

        /* Glow effects for status indicators */
        .status-badge.status-overdue {
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .status-badge.status-warning {
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        }

        .status-badge.status-normal {
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        /* Enhanced button interactions */
        .return-button {
          position: relative;
          overflow: hidden;
        }

        .return-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .return-button:hover::before {
          left: 100%;
        }

        /* Improved card hover effects */
        .document-card {
          position: relative;
          overflow: hidden;
        }

        .document-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(62, 92, 73, 0.02) 0%, 
            rgba(194, 87, 27, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .document-card:hover::after {
          opacity: 1;
        }

        /* Enhanced search input */
        .search-input-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, 
            rgba(194, 87, 27, 0.1) 0%, 
            rgba(62, 92, 73, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .search-input:focus + .search-input-wrapper::before {
          opacity: 1;
        }

        /* Subtle animations for status changes */
        .status-badge {
          transition: all 0.3s ease;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        /* Enhanced header gradient animation */
        .page-header {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Improved filter controls styling */
        .filter-controls {
          position: relative;
        }

        .filter-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          appearance: none;
          padding-right: 40px;
        }

        /* Enhanced color consistency */
        .borrower-name svg,
        .date-info svg,
        .document-status svg {
          transition: color 0.3s ease;
        }

        .document-card:hover .borrower-name svg,
        .document-card:hover .date-info svg,
        .document-card:hover .document-status svg {
          color: var(--warm-brown);
        }

        /* Print optimization */
        @media print {
          .borrowed-documents-container {
            background: white;
          }

          .page-header {
            background: var(--dark-green) !important;
            box-shadow: none;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .enhanced-controls,
          .document-actions {
            display: none;
          }

          .document-card {
            box-shadow: none;
            border: 1px solid #ccc;
            break-inside: avoid;
            margin-bottom: 20px;
          }
        }

        /* High contrast mode enhancements */
        @media (prefers-contrast: high) {
          .document-card {
            border: 2px solid var(--text-dark);
          }

          .search-input,
          .filter-select {
            border: 2px solid var(--text-dark);
          }

          .return-button {
            background: var(--text-dark);
            color: var(--white);
            border: 2px solid var(--text-dark);
          }

          .status-badge {
            border: 1px solid var(--text-dark);
          }
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .document-card,
          .return-button,
          .clear-filters,
          .search-input,
          .filter-select {
            animation: none;
            transition: none;
          }

          .document-card:hover {
            transform: none;
          }

          .page-header {
            animation: none;
          }
        }

        /* Focus improvements for better accessibility */
        .search-input:focus,
        .filter-select:focus,
        .return-button:focus,
        .clear-filters:focus {
          position: relative;
          z-index: 10;
        }

        /* Enhanced visual hierarchy */
        .page-title {
          position: relative;
        }

        .page-title::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          border-radius: 12px;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}