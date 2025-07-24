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
  Briefcase
} from 'lucide-react';
import { BorrowHistory as BorrowHistoryType, HistoryFilter } from '../../types';

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

  const handleExport = async () => {
    try {
      const exportData = {
        history: filteredHistory,
        filters,
        stats: getFilteredStats()
      };
      const filePath = await window.electronAPI.exportCSV(exportData);
      if (filePath) {
        alert(`Fichier exporté : ${filePath.split(/[/\\]/).pop()}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
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
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <History size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Historique des Emprunts</h2>
              <p className="modal-subtitle">
                {stats.total} emprunt(s) • {stats.active} actif(s) • {stats.returned} rendu(s)
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon total">
              <History size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon active">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">En cours</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon returned">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.returned}</span>
              <span className="stat-label">Rendus</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon overdue">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.overdue}</span>
              <span className="stat-label">En retard</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
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
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <Calendar size={16} />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="date-input"
                  placeholder="Date début"
                />
                <span className="filter-separator">à</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="date-input"
                  placeholder="Date fin"
                />
              </div>
              
              <div className="filter-group">
                <Filter size={16} />
                <select 
                  value={filters.borrowerType} 
                  onChange={(e) => handleFilterChange('borrowerType', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tous les emprunteurs</option>
                  <option value="student">Étudiants</option>
                  <option value="staff">Personnel</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">En cours</option>
                  <option value="returned">Rendus</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
              
              <button className="reset-filters-btn" onClick={resetFilters}>
                <X size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
          
          <div className="actions-row">
            <div className="results-info">
              {filteredHistory.length} résultat(s) affiché(s)
            </div>
            
            <div className="export-actions">
              <button className="btn-secondary" onClick={handleExport}>
                <Download size={16} />
                Exporter CSV
              </button>
              <button className="btn-primary" onClick={handlePrint}>
                <Printer size={16} />
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
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
                  <div className="item-header">
                    <div className="status-section">
                      {getStatusIcon(item.status)}
                      <span className="status-label">{getStatusLabel(item.status)}</span>
                    </div>
                    
                    <div className="dates-section">
                      <span className="borrow-date">
                        Emprunté le {new Date(item.borrowDate).toLocaleDateString('fr-FR')}
                      </span>
                      {item.actualReturnDate && (
                        <span className="return-date">
                          Rendu le {new Date(item.actualReturnDate).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-content">
                    <div className="book-section">
                      <div className="book-cover">
                        {item.document?.couverture ? (
                          <img src={item.document?.couverture} alt={item.document?.titre} />
                        ) : (
                          <Book size={24} />
                        )}
                      </div>
                      
                      <div className="book-details">
                        <h4 className="book-title">{item.document?.titre}</h4>
                        <p className="book-author">par {item.document?.auteur}</p>
                        <span className="book-category">{item.document?.descripteurs}</span>
                      </div>
                    </div>
                    
                    <div className="borrower-section">
                      <div className="borrower-type">
                        {item.borrower?.type === 'student' ? (
                          <GraduationCap size={16} />
                        ) : (
                          <Briefcase size={16} />
                        )}
                        <span>{item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                      </div>
                      
                      <div className="borrower-info">
                        <h4 className="borrower-name">
                          {item.borrower?.firstName} {item.borrower?.lastName}
                        </h4>
                        <p className="borrower-details">
                          {item.borrower?.matricule}
                          {item.borrower?.type === 'student' && item.borrower.classe && 
                            ` • ${item.borrower.classe}`
                          }
                          {item.borrower?.type === 'staff' && item.borrower.position && 
                            ` • ${item.borrower.position}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="timeline-section">
                      <div className="timeline-item">
                        <div className="timeline-dot borrow"></div>
                        <div className="timeline-content">
                          <div className="timeline-label">Emprunt</div>
                          <div className="timeline-date">
                            {new Date(item.borrowDate).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(item.borrowDate).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-dot expected"></div>
                        <div className="timeline-content">
                          <div className="timeline-label">Retour prévu</div>
                          <div className="timeline-date">
                            {new Date(item.expectedReturnDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      {item.actualReturnDate && (
                        <div className="timeline-item">
                          <div className="timeline-dot return"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Retour effectué</div>
                            <div className="timeline-date">
                              {new Date(item.actualReturnDate).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(item.actualReturnDate).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="item-notes">
                      <strong>Notes :</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <History size={64} />
              <h3>Aucun historique trouvé</h3>
              <p>
                {Object.values(filters).some(f => f && f !== 'all') || searchQuery
                  ? 'Aucun résultat pour les critères sélectionnés'
                  : 'L\'historique des emprunts apparaîtra ici'
                }
              </p>
              {(Object.values(filters).some(f => f && f !== 'all') || searchQuery) && (
                <button className="btn-secondary" onClick={resetFilters}>
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
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .history-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
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
          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);
          color: #F3EED9;
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
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1001;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .stats-section {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);
          flex: 1;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .stat-icon.total { background: #6E6E6E; }
        .stat-icon.active { background: #3B82F6; }
        .stat-icon.returned { background: #3E5C49; }
        .stat-icon.overdue { background: #DC2626; }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filters-section {
          padding: 24px 32px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .filters-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
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
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6E6E6E;
          box-shadow: 0 0 0 3px rgba(110, 110, 110, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2E2E2E;
          background: #F3EED9;
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .date-input, .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-separator {
          margin: 0 8px;
          color: #6E6E6E;
          font-size: 14px;
        }
        
        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-filters-btn:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .results-info {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .export-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .btn-secondary:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #6E6E6E;
          color: #F3EED9;
        }
        
        .btn-primary:hover {
          background: #5A5A5A;
        }
        
        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E5DCC2;
          border-top: 3px solid #6E6E6E;
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
        
        .history-item {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .history-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #6E6E6E;
        }
        
        .history-item.active::before { background: #3B82F6; }
        .history-item.returned::before { background: #3E5C49; }
        .history-item.overdue::before { background: #DC2626; }
        
        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F9FAFB;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .status-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dates-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        
        .borrow-date, .return-date {
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .return-date {
          font-weight: 600;
          color: #3E5C49;
        }
        
        .item-content {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 24px;
          padding: 20px;
        }
        
        .book-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .book-cover {
          width: 48px;
          height: 64px;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
          flex-shrink: 0;
          overflow: hidden;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 8px 0;
        }
        
        .book-category {
          background: #6E6E6E;
          color: #F3EED9;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .borrower-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .borrower-name {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .borrower-details {
          font-size: 13px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .timeline-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .timeline-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .timeline-dot.borrow { background: #3B82F6; }
        .timeline-dot.expected { background: #F59E0B; }
        .timeline-dot.return { background: #3E5C49; }
        
        .timeline-label {
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .timeline-date {
          font-size: 12px;
          color: #2E2E2E;
          margin-top: 2px;
        }
        
        .item-notes {
          padding: 16px 20px;
          background: #FEF7F0;
          border-top: 1px solid #E5DCC2;
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #2E2E2E;
        }
        
        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }
        
        .text-blue-500 { color: #3B82F6; }
        .text-green-500 { color: #3E5C49; }
        .text-red-500 { color: #DC2626; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .item-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .filter-controls {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 768px) {
          .history-modal {
            margin: 12px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-section {
            padding: 16px 20px;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .stat-card {
            flex: 1;
            min-width: calc(50% - 6px);
          }
          
          .filters-section {
            padding: 16px 20px;
          }
          
          .history-content {
            padding: 16px 20px;
          }
          
          .book-section {
            flex-direction: column;
            text-align: center;
          }
          
          .timeline-section {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};