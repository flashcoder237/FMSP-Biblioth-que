import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar,
  Filter,
  Download,
  Printer,
  Search,
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Book,
  GraduationCap,
  Briefcase,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { BorrowHistory as BorrowHistoryType, HistoryFilter } from '../../types';
import { ExportDialog, ExportConfig } from './ExportDialog';

import { SupabaseRendererService as SupabaseService } from '../services/SupabaseClient';

interface BorrowHistoryProps {
  onClose: () => void;
  supabaseService: SupabaseService;
}

export const BorrowHistory: React.FC<BorrowHistoryProps> = ({ onClose }) => {
  const [history, setHistory] = useState<BorrowHistoryType[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BorrowHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState<HistoryFilter>({
    startDate: '',
    endDate: '',
    borrowerType: 'all',
    status: 'all'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filters, searchQuery]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await window.electronAPI.getBorrowHistory();
      setHistory(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    // Appliquer les filtres de date
    if (filters.startDate) {
      filtered = filtered.filter(item => 
        new Date(item.borrowDate) >= new Date(filters.startDate!)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(item => 
        new Date(item.borrowDate) <= new Date(filters.endDate! + ' 23:59:59')
      );
    }

    // Filtre par type d'emprunteur
    if (filters.borrowerType !== 'all') {
      filtered = filtered.filter(item => 
        item.borrower?.type === filters.borrowerType
      );
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.document?.titre.toLowerCase().includes(query) ||
        item.document?.auteur.toLowerCase().includes(query) ||
        `${item.borrower?.firstName} ${item.borrower?.lastName}`.toLowerCase().includes(query) ||
        item.borrower?.matricule.toLowerCase().includes(query)
      );
    }

    setFilteredHistory(filtered);
  };

  const handleFilterChange = (key: keyof HistoryFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      borrowerType: 'all',
      status: 'all'
    });
    setSearchQuery('');
  };

  const handlePrint = async () => {
    try {
      const printData = {
        history: filteredHistory,
        filters,
        stats: getFilteredStats()
      };
      await window.electronAPI.printBorrowHistory(printData);
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
    }
  };

  const handleExport = async (config: ExportConfig) => {
    try {
      const result = await window.electronAPI.exportAdvanced(config);
      if (result.success && result.path) {
        const fileName = result.path.split(/[/\\]/).pop();
        alert(`Fichier exporté avec succès : ${fileName}`);
      } else if (result.cancelled) {
        return;
      } else {
        alert(`Erreur lors de l'export : ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  const getFilteredStats = () => {
    const total = filteredHistory.length;
    const active = filteredHistory.filter(h => h.status === 'active').length;
    const returned = filteredHistory.filter(h => h.status === 'returned').length;
    const overdue = filteredHistory.filter(h => h.status === 'overdue').length;
    const students = filteredHistory.filter(h => h.borrower?.type === 'student').length;
    const staff = filteredHistory.filter(h => h.borrower?.type === 'staff').length;
    
    return { total, active, returned, overdue, students, staff };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className="text-blue-500" />;
      case 'returned':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'returned':
        return 'Rendu';
      case 'overdue':
        return 'En retard';
      default:
        return status;
    }
  };

  const stats = getFilteredStats();

  return (
    <div className="history-overlay">
      <div className="history-modal">
        {/* Header avec navigation améliorée */}
        <div className="modal-header">
          <div className="header-left">
            <div className="header-icon">
              <History size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Historique des Emprunts</h2>
              <div className="header-stats">
                <span className="stat-pill">
                  <BarChart3 size={14} />
                  {stats.total} emprunts
                </span>
                <span className="stat-pill active">
                  <Clock size={14} />
                  {stats.active} actifs
                </span>
                <span className="stat-pill returned">
                  <CheckCircle size={14} />
                  {stats.returned} rendus
                </span>
                {stats.overdue > 0 && (
                  <span className="stat-pill overdue">
                    <AlertTriangle size={14} />
                    {stats.overdue} en retard
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="close-button" onClick={onClose} title="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Barre de contrôles principale */}
        <div className="controls-bar">
          {/* Recherche globale */}
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par document, auteur, emprunteur ou matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  title="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="quick-actions">
            <button 
              className="action-btn secondary" 
              onClick={() => setShowExportDialog(true)}
              title="Exporter les données"
            >
              <Download size={18} />
              <span className="action-text">Exporter</span>
            </button>
            <button 
              className="action-btn primary" 
              onClick={handlePrint}
              title="Imprimer l'historique"
            >
              <Printer size={18} />
              <span className="action-text">Imprimer</span>
            </button>
          </div>
        </div>

        {/* Filtres compacts */}
        <div className="filters-bar">
          <div className="filters-group">
            <div className="filter-item">
              <Calendar size={16} className="filter-icon" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="filter-input date"
                title="Date de début"
              />
              <span className="filter-separator">→</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="filter-input date"
                title="Date de fin"
              />
            </div>
            
            <div className="filter-item">
              <User size={16} className="filter-icon" />
              <select 
                value={filters.borrowerType} 
                onChange={(e) => handleFilterChange('borrowerType', e.target.value)}
                className="filter-input select"
              >
                <option value="all">Tous</option>
                <option value="student">Étudiants</option>
                <option value="staff">Personnel</option>
              </select>
            </div>
            
            <div className="filter-item">
              <Filter size={16} className="filter-icon" />
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-input select"
              >
                <option value="all">Tous statuts</option>
                <option value="active">En cours</option>
                <option value="returned">Rendus</option>
                <option value="overdue">En retard</option>
              </select>
            </div>

            {/* Indicateur de filtres actifs */}
            {(Object.values(filters).some(f => f && f !== 'all') || searchQuery) && (
              <button 
                className="reset-filters-btn"
                onClick={resetFilters}
                title="Réinitialiser tous les filtres"
              >
                <X size={16} />
                Réinitialiser
              </button>
            )}
          </div>

          <div className="results-counter">
            <span className="results-text">
              {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
              {history.length !== filteredHistory.length && (
                <span className="total-count"> sur {history.length}</span>
              )}
            </span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="history-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement de l'historique...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="history-list">
              {filteredHistory.map((item) => (
                <div key={item.id} className={`history-item ${item.status}`}>
                  {/* En-tête de la carte */}
                  <div className="item-header">
                    <div className="status-badge">
                      {getStatusIcon(item.status)}
                      <span className="status-text">{getStatusLabel(item.status)}</span>
                    </div>
                    
                    <div className="item-dates">
                      <div className="date-info">
                        <span className="date-label">Emprunté</span>
                        <span className="date-value">
                          {new Date(item.borrowDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {item.actualReturnDate && (
                        <div className="date-info returned">
                          <span className="date-label">Rendu</span>
                          <span className="date-value">
                            {new Date(item.actualReturnDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenu principal de la carte */}
                  <div className="item-body">
                    {/* Section document */}
                    <div className="document-section">
                      <div className="document-cover">
                        {item.document?.couverture ? (
                          <img src={item.document?.couverture} alt={item.document?.titre} />
                        ) : (
                          <Book size={24} />
                        )}
                      </div>
                      
                      <div className="document-info">
                        <h4 className="document-title">{item.document?.titre}</h4>
                        <p className="document-author">par {item.document?.auteur}</p>
                        {item.document?.descripteurs && (
                          <span className="document-category">{item.document?.descripteurs}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Section emprunteur */}
                    <div className="borrower-section">
                      <div className="borrower-header">
                        <div className="borrower-type-badge">
                          {item.borrower?.type === 'student' ? (
                            <GraduationCap size={16} />
                          ) : (
                            <Briefcase size={16} />
                          )}
                          <span>{item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                        </div>
                      </div>
                      
                      <div className="borrower-details">
                        <h4 className="borrower-name">
                          {item.borrower?.firstName} {item.borrower?.lastName}
                        </h4>
                        <div className="borrower-meta">
                          <span className="borrower-id">{item.borrower?.matricule}</span>
                          {item.borrower?.type === 'student' && item.borrower.classe && (
                            <span className="borrower-extra">{item.borrower.classe}</span>
                          )}
                          {item.borrower?.type === 'staff' && item.borrower.position && (
                            <span className="borrower-extra">{item.borrower.position}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline simplifiée */}
                    <div className="timeline-section">
                      <div className="timeline-compact">
                        <div className="timeline-point start">
                          <div className="point-dot"></div>
                          <div className="point-info">
                            <span className="point-date">
                              {new Date(item.borrowDate).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </span>
                            <span className="point-label">Début</span>
                          </div>
                        </div>
                        
                        <div className="timeline-line"></div>
                        
                        <div className="timeline-point expected">
                          <div className="point-dot"></div>
                          <div className="point-info">
                            <span className="point-date">
                              {new Date(item.expectedReturnDate).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </span>
                            <span className="point-label">Prévu</span>
                          </div>
                        </div>
                        
                        {item.actualReturnDate && (
                          <>
                            <div className="timeline-line"></div>
                            <div className="timeline-point end">
                              <div className="point-dot"></div>
                              <div className="point-info">
                                <span className="point-date">
                                  {new Date(item.actualReturnDate).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </span>
                                <span className="point-label">Rendu</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes (si présentes) */}
                  {item.notes && (
                    <div className="item-notes">
                      <div className="notes-content">
                        <strong>Notes :</strong> {item.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <History size={64} />
              </div>
              <h3 className="empty-title">
                {Object.values(filters).some(f => f && f !== 'all') || searchQuery
                  ? 'Aucun résultat trouvé'
                  : 'Aucun historique'
                }
              </h3>
              <p className="empty-description">
                {Object.values(filters).some(f => f && f !== 'all') || searchQuery
                  ? 'Essayez de modifier vos critères de recherche ou filtres'
                  : 'L\'historique des emprunts apparaîtra ici au fur et à mesure'
                }
              </p>
              {(Object.values(filters).some(f => f && f !== 'all') || searchQuery) && (
                <button className="action-btn primary" onClick={resetFilters}>
                  <X size={16} />
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .history-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 40px 20px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .history-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1400px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* HEADER AMÉLIORÉ */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 40px;
          background: linear-gradient(135deg, #2E453A 0%, #1f2e26 100%);
          color: #f8fafc;
          border-bottom: 1px solid rgba(46, 69, 58, 0.3);
          flex-shrink: 0;
          min-height: auto;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(248, 250, 252, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          flex-shrink: 0;
        }
        
        .header-text {
          flex: 1;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 10px 0;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        
        .header-stats {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(248, 250, 252, 0.1);
          border: 1px solid rgba(248, 250, 252, 0.15);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .stat-pill.active { 
          background: rgba(194, 87, 27, 0.2);
          border-color: rgba(194, 87, 27, 0.3);
          color: #f97316;
        }
        .stat-pill.returned { 
          background: rgba(46, 69, 58, 0.2);
          border-color: rgba(46, 69, 58, 0.3);
          color: #4ade80;
        }
        .stat-pill.overdue { 
          background: rgba(220, 38, 38, 0.2);
          border-color: rgba(220, 38, 38, 0.3);
          color: #fca5a5;
        }
        
        .close-button {
          background: rgba(248, 250, 252, 0.1);
          border: 1px solid rgba(248, 250, 252, 0.15);
          color: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .close-button:hover {
          background: rgba(248, 250, 252, 0.2);
          transform: scale(1.05);
        }

        /* BARRE DE CONTRÔLES */
        .controls-bar {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 40px;
          background: #fafafa;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .search-section {
          flex: 1;
          max-width: 500px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #6b7280;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          background: #ffffff;
          color: #1f2937;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-input:focus {
          outline: none;
          border-color: #2E453A;
          box-shadow: 0 0 0 3px rgba(46, 69, 58, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          color: #1f2937;
          background: #f3f4f6;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .action-btn.secondary {
          background: #ffffff;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .action-btn.secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #2E453A 0%, #1f2e26 100%);
          color: #ffffff;
          border: 2px solid transparent;
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, #1f2e26 0%, #0f1712 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(46, 69, 58, 0.4);
        }

        .action-text {
          display: inline;
        }

        /* BARRE DE FILTRES */
        .filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 40px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          gap: 24px;
          flex-shrink: 0;
        }

        .filters-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .filter-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .filter-input {
          border: none;
          background: transparent;
          color: #1e293b;
          font-size: 14px;
          min-width: 0;
        }

        .filter-input:focus {
          outline: none;
        }

        .filter-input.date {
          width: 130px;
        }

        .filter-input.select {
          cursor: pointer;
          min-width: 120px;
        }

        .filter-separator {
          margin: 0 4px;
          color: #64748b;
          font-size: 14px;
        }

        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #fef3f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-filters-btn:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .results-counter {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .results-text {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .total-count {
          color: #94a3b8;
        }

        /* CONTENU PRINCIPAL */
        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 40px;
          background: #fafafa;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #2E453A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* CARTES D'HISTORIQUE AMÉLIORÉES */
        .history-item {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .history-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #64748b;
          transition: all 0.3s ease;
        }

        .history-item.active::before { background: #C2571B; }
        .history-item.returned::before { background: #2E453A; }
        .history-item.overdue::before { background: #dc2626; }

        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border-color: #d1d5db;
        }

        .item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .status-text {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .item-dates {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .date-info {
          text-align: right;
        }

        .date-label {
          display: block;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .date-value {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .date-info.returned .date-value {
          color: #2E453A;
        }

        .item-body {
          padding: 24px;
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* SECTION DOCUMENT */
        .document-section {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .document-cover {
          width: 56px;
          height: 72px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .document-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .document-info {
          flex: 1;
          min-width: 0;
        }

        .document-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .document-author {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 12px 0;
          font-style: italic;
        }

        .document-category {
          display: inline-block;
          background: linear-gradient(135deg, #2E453A 0%, #1f2e26 100%);
          color: #f8fafc;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* SECTION EMPRUNTEUR */
        .borrower-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .borrower-header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .borrower-type-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .borrower-details {
          flex: 1;
        }

        .borrower-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .borrower-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .borrower-id {
          font-size: 13px;
          color: #C2571B;
          font-weight: 600;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .borrower-extra {
          font-size: 13px;
          color: #64748b;
        }

        /* TIMELINE COMPACTE */
        .timeline-section {
          display: flex;
          justify-content: center;
        }

        .timeline-compact {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          max-width: fit-content;
        }

        .timeline-point {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .point-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #64748b;
          position: relative;
          z-index: 2;
        }

        .timeline-point.start .point-dot { background: #C2571B; }
        .timeline-point.expected .point-dot { background: #f59e0b; }
        .timeline-point.end .point-dot { background: #2E453A; }

        .point-info {
          text-align: center;
        }

        .point-date {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .point-label {
          display: block;
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .timeline-line {
          height: 2px;
          width: 24px;
          background: #e2e8f0;
          position: relative;
          top: -14px;
        }

        /* NOTES */
        .item-notes {
          padding: 16px 24px;
          background: #fffbeb;
          border-top: 1px solid #fed7aa;
        }

        .notes-content {
          font-size: 13px;
          color: #92400e;
          line-height: 1.5;
        }

        /* ÉTAT VIDE */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
        }

        .empty-icon {
          color: #cbd5e1;
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1e293b;
        }

        .empty-description {
          margin: 0 0 32px 0;
          font-size: 16px;
          color: #64748b;
          max-width: 400px;
          line-height: 1.6;
        }

        /* CLASSES UTILITAIRES */
        .text-blue-500 { color: #C2571B; }
        .text-green-500 { color: #2E453A; }
        .text-red-500 { color: #dc2626; }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1200px) {
          .item-body {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          
          .timeline-section {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .history-modal {
            margin: 16px;
            max-height: calc(100vh - 32px);
            border-radius: 20px;
          }

          .history-overlay {
            padding: 16px;
          }

          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .header-left {
            flex-direction: column;
            gap: 16px;
          }

          .header-stats {
            justify-content: center;
          }

          .controls-bar {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .search-section {
            max-width: none;
          }

          .quick-actions {
            justify-content: center;
          }

          .action-text {
            display: none;
          }

          .filters-bar {
            padding: 14px 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filters-group {
            flex-direction: column;
            gap: 12px;
          }

          .filter-item {
            justify-content: space-between;
          }

          .history-content {
            padding: 16px 20px;
          }

          .item-body {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .document-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .timeline-compact {
            flex-direction: column;
            gap: 12px;
          }

          .timeline-line {
            width: 2px;
            height: 16px;
            top: 0;
          }

          .item-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .item-dates {
            flex-direction: column;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 20px 16px;
          }

          .modal-title {
            font-size: 24px;
          }

          .controls-bar, .filters-bar, .history-content {
            padding-left: 16px;
            padding-right: 16px;
          }

          .item-header, .item-body, .item-notes {
            padding-left: 16px;
            padding-right: 16px;
          }

          .stat-pill {
            font-size: 12px;
            padding: 4px 8px;
          }
        }
      `}</style>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExport}
          availableData={{
            documents: false,
            borrowers: false,
            borrowHistory: true
          }}
        />
      )}
    </div>
  );
};