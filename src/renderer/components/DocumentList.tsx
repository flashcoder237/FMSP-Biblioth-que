import React, { useState, useEffect } from 'react';
import { Document, SyncStatus, NetworkStatus } from '../../types';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  Tag, 
  Hash,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  LayoutGrid,
  Layers,
  Heart
} from 'lucide-react';
import { Document3DView } from './Book3DView';
import { useQuickToast } from './ToastSystem';

interface DocumentListProps {
  documents: Document[];
  onAdd: () => void;
  onEdit: (document: Document) => void;
  onBorrow?: (document: Document) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  syncStatus: SyncStatus;
  networkStatus: NetworkStatus;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onAdd,
  onEdit,
  onBorrow,
  onDelete,
  onRefresh,
  syncStatus,
  networkStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSyncStatus, setSelectedSyncStatus] = useState('all');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | '3d'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const toast = useQuickToast();

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory, selectedSyncStatus]);

  const filterDocuments = () => {
    let filtered = documents;

    // Filtrage par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.titre.toLowerCase().includes(term) ||
        doc.auteur.toLowerCase().includes(term) ||
        doc.editeur.toLowerCase().includes(term) ||
        doc.descripteurs.toLowerCase().includes(term) ||
        doc.cote.toLowerCase().includes(term) ||
        (doc.isbn && doc.isbn.toLowerCase().includes(term))
      );
    }

    // Filtrage par catégorie (utilise les descripteurs)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc =>
        doc.descripteurs.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filtrage par statut de sync
    if (selectedSyncStatus !== 'all') {
      filtered = filtered.filter(doc => doc.syncStatus === selectedSyncStatus);
    }

    setFilteredDocuments(filtered);
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    documents.forEach(doc => {
      doc.descripteurs.split(',').forEach(desc => {
        categories.add(desc.trim());
      });
    });
    return Array.from(categories).sort();
  };

  const getSyncStatusIcon = (status: Document['syncStatus']) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="sync-icon synced" />;
      case 'pending':
        return <Clock className="sync-icon pending" />;
      case 'error':
        return <AlertCircle className="sync-icon error" />;
      case 'conflict':
        return <AlertCircle className="sync-icon conflict" />;
      default:
        return <Clock className="sync-icon default" />;
    }
  };

  const handleEdit = (document: Document) => {
    onEdit(document);
    toast.info('Ouverture du formulaire de modification', `Pour "${document.titre}"`);
  };

  const handleBorrow = (document: Document) => {
    if (onBorrow) {
      onBorrow(document);
      const action = document.estEmprunte ? 'retourné' : 'emprunté';
      toast.success(`Document ${action}`, `"${document.titre}" a été ${action} avec succès`);
    }
  };

  const handleDelete = (id: number) => {
    const document = documents.find(d => d.id === id);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      onDelete(id);
      if (document) {
        toast.success('Document supprimé', `"${document.titre}" a été retiré de la collection`);
      }
    }
  };

  const handleView3D = (document: Document) => {
    setSelectedDocument(document);
    toast.info('Vue 3D activée', `Exploration de "${document.titre}"`);
  };

  const getNetworkStatusDisplay = () => {
    return (
      <div className="network-status">
        {networkStatus.isOnline ? (
          <div className="status-item online">
            <Wifi size={16} />
            En ligne
          </div>
        ) : (
          <div className="status-item offline">
            <WifiOff size={16} />
            Hors ligne
          </div>
        )}
        
        {syncStatus.syncInProgress && (
          <div className="status-item syncing">
            <Loader2 size={16} className="animate-spin" />
            Synchronisation...
          </div>
        )}
        
        {syncStatus.pendingOperations > 0 && (
          <div className="status-item pending-ops">
            {syncStatus.pendingOperations} en attente
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="document-list-container">
      {/* En-tête principal */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <BookOpen size={28} />
            </div>
            <div className="header-text">
              <h1 className="page-title">
                Bibliothèque Numérique
              </h1>
              <p className="page-subtitle">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} dans votre collection
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            {getNetworkStatusDisplay()}
            <button onClick={onAdd} className="add-button">
              <Plus size={18} />
              Nouveau document
            </button>
          </div>
        </div>
        
        {syncStatus.lastSync && (
          <div className="sync-info">
            <Clock size={14} />
            Dernière synchronisation: {new Date(syncStatus.lastSync).toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      {/* Section de filtrage */}
      <div className="filters-section">
        <div className="section-header">
          <div className="section-icon">
            <Filter size={20} />
          </div>
          <h3 className="section-title">Filtres et recherche</h3>
        </div>
        
        <div className="filters-grid">
          <div className="filter-field search-field">
            <label className="filter-label">
              <Search size={16} />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
              placeholder="Titre, auteur, éditeur, cote, ISBN..."
            />
          </div>

          <div className="filter-field">
            <label className="filter-label">
              <Tag size={16} />
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Toutes les catégories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">
              <CheckCircle size={16} />
              Statut sync
            </label>
            <select
              value={selectedSyncStatus}
              onChange={(e) => setSelectedSyncStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="synced">Synchronisé</option>
              <option value="pending">En attente</option>
              <option value="error">Erreur</option>
              <option value="conflict">Conflit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des documents */}
      {filteredDocuments.length > 0 ? (
        <div className="documents-grid">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="document-card">
              {/* Image de couverture */}
              {document.couverture && (
                <div className="document-cover">
                  <img
                    src={document.couverture}
                    alt={`Couverture de ${document.titre}`}
                    className="cover-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="document-content">
                {/* En-tête avec statut */}
                <div className="document-header">
                  <div className="document-title-section">
                    <h3 className="document-title" title={document.titre}>
                      {document.titre}
                    </h3>
                    <p className="document-author" title={document.auteur}>
                      <User size={14} />
                      {document.auteur}
                    </p>
                  </div>
                  <div className="document-status">
                    {getSyncStatusIcon(document.syncStatus)}
                    {document.estEmprunte && (
                      <div className="borrowed-indicator" title="Emprunté" />
                    )}
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="document-details">
                  <div className="detail-item">
                    <Building size={14} />
                    <span className="detail-text">{document.editeur}</span>
                  </div>
                  
                  <div className="detail-item">
                    <MapPin size={14} />
                    <span className="detail-text">{document.lieuEdition}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span className="detail-text">{document.annee}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Hash size={14} />
                    <span className="detail-text document-cote">{document.cote}</span>
                  </div>
                  
                  <div className="detail-item tags-item">
                    <Tag size={14} />
                    <div className="tags-container">
                      {document.descripteurs.split(',').slice(0, 3).map((desc, index) => (
                        <span
                          key={index}
                          className="tag-badge"
                          title={desc.trim()}
                        >
                          {desc.trim()}
                        </span>
                      ))}
                      {document.descripteurs.split(',').length > 3 && (
                        <span className="tags-more">
                          +{document.descripteurs.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {document.description && (
                  <p className="document-description" title={document.description}>
                    {document.description}
                  </p>
                )}

                {/* Pied de carte avec actions */}
                <div className="document-footer">
                  <div className="document-meta">
                    <span className="version-info">v{document.version}</span>
                    <span className="date-info">
                      {new Date(document.lastModified).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="document-actions">
                    {onBorrow && (
                      <button
                        onClick={() => handleBorrow(document)}
                        className="action-button borrow-button"
                        title={document.estEmprunte ? "Retourner" : "Emprunter"}
                        disabled={!document.estEmprunte && document.syncStatus === 'error'}
                      >
                        <Heart size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(document)}
                      className="action-button edit-button"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => document.id && onDelete(document.id)}
                      className="action-button delete-button"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Message vide */
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={64} />
          </div>
          <h3 className="empty-title">
            {searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
              ? 'Aucun document trouvé'
              : 'Votre bibliothèque est vide'
            }
          </h3>
          <p className="empty-description">
            {searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
              ? 'Essayez de modifier vos critères de recherche pour trouver ce que vous cherchez.'
              : 'Commencez par ajouter votre premier document pour enrichir votre collection.'
            }
          </p>
          <button onClick={onAdd} className="empty-action-button">
            <Plus size={18} />
            Ajouter un document
          </button>
        </div>
      )}

      <style>{`
        .document-list-container {
          padding: 24px;
          background: linear-gradient(135deg, #F8F6F0 0%, #FFFFFF 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* En-tête principal */
        .page-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 20px;
          padding: 32px;
          color: #F3EED9;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 80% 20%, rgba(243, 238, 217, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
          gap: 24px;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 6px 0;
          line-height: 1.2;
          letter-spacing: -0.4px;
        }

        .page-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .network-status {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(243, 238, 217, 0.1);
          font-weight: 500;
        }

        .status-item.online { color: #10B981; }
        .status-item.offline { color: #EF4444; }
        .status-item.syncing { color: #3B82F6; }
        .status-item.pending-ops { color: #F59E0B; }

        .add-button {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 16px rgba(194, 87, 27, 0.2);
        }

        .add-button:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .sync-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 13px;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }

        /* Section des filtres */
        .filters-section {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(229, 220, 194, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 20px;
        }

        .filter-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-field.search-field {
          position: relative;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }

        .filter-input,
        .filter-select {
          padding: 12px 16px;
          border: 2px solid #B8A678;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #1A1A1A;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-sizing: border-box;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.25);
          background: #FEFEFE;
        }

        /* Grille des documents */
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .document-card {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(229, 220, 194, 0.3);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }

        .document-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          border-color: rgba(62, 92, 73, 0.2);
        }

        .document-cover {
          height: 200px;
          background: linear-gradient(135deg, #F8F6F0 0%, #E5DCC2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .document-card:hover .cover-image {
          transform: scale(1.05);
        }

        .document-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .document-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .document-title-section {
          flex: 1;
          min-width: 0;
        }

        .document-title {
          font-size: 16px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 6px 0;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .document-author {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .document-status {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .sync-icon {
          width: 16px;
          height: 16px;
        }

        .sync-icon.synced { color: #10B981; }
        .sync-icon.pending { color: #F59E0B; }
        .sync-icon.error { color: #EF4444; }
        .sync-icon.conflict { color: #F97316; }
        .sync-icon.default { color: #6B7280; }

        .borrowed-indicator {
          width: 8px;
          height: 8px;
          background: #F97316;
          border-radius: 50%;
        }

        .document-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #4A4A4A;
          min-height: 20px;
        }

        .detail-item svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .detail-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .document-cote {
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 12px;
          font-weight: 500;
        }

        .tags-item {
          align-items: flex-start;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          flex: 1;
        }

        .tag-badge {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tags-more {
          font-size: 11px;
          color: #9CA3AF;
          font-weight: 500;
        }

        .document-description {
          font-size: 13px;
          color: #4A4A4A;
          line-height: 1.4;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .document-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(229, 220, 194, 0.3);
          margin-top: auto;
        }

        .document-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #9CA3AF;
        }

        .version-info {
          font-weight: 600;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .edit-button {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .edit-button:hover {
          background: rgba(62, 92, 73, 0.2);
          transform: translateY(-1px);
        }

        .delete-button {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .delete-button:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }

        .borrow-button {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }

        .borrow-button:hover:not(:disabled) {
          background: rgba(194, 87, 27, 0.2);
          transform: translateY(-1px);
        }

        .borrow-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* État vide */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 20px;
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }

        .empty-description {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0 0 32px 0;
          max-width: 480px;
          line-height: 1.5;
        }

        .empty-action-button {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.2);
        }

        .empty-action-button:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.3);
        }

        /* Animation de rotation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .documents-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .document-list-container {
            padding: 16px;
            gap: 16px;
          }

          .page-header {
            padding: 24px;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }

          .header-main {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .header-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .network-status {
            justify-content: center;
            flex-wrap: wrap;
          }

          .filters-section {
            padding: 20px;
          }

          .documents-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .document-card {
            border-radius: 12px;
          }

          .document-content {
            padding: 16px;
            gap: 12px;
          }

          .document-title {
            font-size: 15px;
          }

          .empty-state {
            padding: 40px 16px;
          }

          .empty-title {
            font-size: 18px;
          }

          .empty-description {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .document-list-container {
            padding: 12px;
          }

          .page-header {
            padding: 20px;
            border-radius: 16px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
          }

          .page-title {
            font-size: 24px;
          }

          .page-subtitle {
            font-size: 14px;
          }

          .add-button {
            padding: 10px 16px;
            font-size: 13px;
          }

          .section-title {
            font-size: 16px;
          }

          .filters-section {
            padding: 16px;
          }

          .document-cover {
            height: 160px;
          }

          .document-content {
            padding: 14px;
          }

          .document-title {
            font-size: 14px;
          }

          .document-author {
            font-size: 13px;
          }

          .detail-item {
            font-size: 12px;
          }

          .tag-badge {
            font-size: 10px;
            padding: 3px 6px;
            max-width: 60px;
          }

          .empty-state {
            padding: 32px 12px;
          }

          .empty-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            margin-bottom: 20px;
          }

          .empty-title {
            font-size: 16px;
          }

          .empty-description {
            font-size: 13px;
            margin-bottom: 24px;
          }

          .empty-action-button {
            padding: 12px 20px;
            font-size: 14px;
          }
        }

        /* États de focus pour accessibilité */
        .add-button:focus-visible,
        .empty-action-button:focus-visible,
        .action-button:focus-visible {
          outline: 2px solid #3E5C49;
          outline-offset: 2px;
        }

        .filter-input:focus-visible,
        .filter-select:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.2);
        }

        /* Animation d'entrée pour les cartes */
        @keyframes cardSlideIn {
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
          animation: cardSlideIn 0.4s ease-out forwards;
        }

        .document-card:nth-child(1) { animation-delay: 0ms; }
        .document-card:nth-child(2) { animation-delay: 50ms; }
        .document-card:nth-child(3) { animation-delay: 100ms; }
        .document-card:nth-child(4) { animation-delay: 150ms; }
        .document-card:nth-child(5) { animation-delay: 200ms; }
        .document-card:nth-child(6) { animation-delay: 250ms; }

        /* Animation pour les filtres */
        .filters-section {
          animation: cardSlideIn 0.3s ease-out;
        }

        /* Amélioration du contraste pour l'accessibilité */
        @media (prefers-contrast: high) {
          .document-card {
            border: 2px solid #2E2E2E;
          }

          .tag-badge {
            background: #3E5C49;
            color: #FFFFFF;
          }

          .detail-item {
            color: #2E2E2E;
          }
        }

        /* Respect des préférences de mouvement réduit */
        @media (prefers-reduced-motion: reduce) {
          .document-card,
          .filters-section,
          .add-button,
          .empty-action-button,
          .action-button,
          .cover-image {
            animation: none;
            transition: none;
          }

          .animate-spin {
            animation: none;
          }
        }

        /* Dark mode support (optionnel) */
        @media (prefers-color-scheme: dark) {
          .document-list-container {
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
          }

          .page-header {
            background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          }

          .filters-section,
          .document-card,
          .empty-state {
            background: #2D2D2D;
            border-color: rgba(255, 255, 255, 0.1);
          }

          .document-title,
          .section-title,
          .empty-title {
            color: #FFFFFF;
          }

          .document-author,
          .detail-item,
          .document-description,
          .empty-description {
            color: #B0B0B0;
          }

          .filter-input,
          .filter-select {
            background: #2D2D2D;
            border-color: rgba(255, 255, 255, 0.2);
            color: #FFFFFF;
          }

          .filter-label {
            color: #FFFFFF;
          }

          .tag-badge {
            background: rgba(62, 92, 73, 0.3);
            color: #A8D5BA;
          }
        }
      `}</style>
    </div>
  );
};