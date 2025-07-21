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
import { Book as BookType } from '../../types';

interface BorrowedBooksProps {
  books: BookType[]; // Array of books (already filtered to borrowed ones)
  onReturn: (bookId: number) => void; // Simplified callback
}

export const BorrowedBooks: React.FC<BorrowedBooksProps> = ({ books, onReturn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'borrower' | 'date' | 'title' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'warning' | 'overdue'>('all');

  const handleReturn = (book: BookType) => {
    if (window.confirm(`Confirmer le retour de "${book.title}" emprunté par ${book.borrowerName} ?`)) {
      onReturn(book.id!);
    }
  };

  const getDaysOverdue = (borrowDate: string) => {
    const borrowed = new Date(borrowDate);
    const today = new Date();
    const diffTime = today.getTime() - borrowed.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusInfo = (borrowDate: string) => {
    const days = getDaysOverdue(borrowDate);
    if (days <= 14) {
      return { 
        status: 'normal', 
        color: '#3E5C49', 
        bgColor: 'rgba(62, 92, 73, 0.1)',
        text: `${days} jour(s)`,
        priority: 1
      };
    } else if (days <= 30) {
      return { 
        status: 'warning', 
        color: '#C2571B', 
        bgColor: 'rgba(194, 87, 27, 0.1)',
        text: `${days} jour(s) - À surveiller`,
        priority: 2
      };
    } else {
      return { 
        status: 'overdue', 
        color: '#DC2626', 
        bgColor: 'rgba(220, 38, 38, 0.1)',
        text: `${days} jour(s) - En retard`,
        priority: 3
      };
    }
  };

  // ✅ Filter only borrowed books and apply search/status filters
  const borrowedBooks = books.filter(book => book.isBorrowed);
  
  const filteredBooks = borrowedBooks.filter(book => {
    // Filtre par recherche
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.borrowerName?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre par statut
    if (filterStatus === 'all') return matchesSearch;
    
    const statusInfo = getStatusInfo(book.borrowDate!);
    return matchesSearch && statusInfo.status === filterStatus;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'borrower':
        return (a.borrowerName || '').localeCompare(b.borrowerName || '');
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        const statusA = getStatusInfo(a.borrowDate!);
        const statusB = getStatusInfo(b.borrowDate!);
        return statusB.priority - statusA.priority;
      case 'date':
      default:
        return new Date(b.borrowDate!).getTime() - new Date(a.borrowDate!).getTime();
    }
  });

  const getStatusCounts = () => {
    const counts = { normal: 0, warning: 0, overdue: 0 };
    borrowedBooks.forEach(book => {
      if (book.borrowDate) {
        const status = getStatusInfo(book.borrowDate).status;
        if (status in counts) counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
 

  return (
    <div className="borrowed-books">
      {/* Hero Header */}
      <div className="page-header">
        <div className="header-background">
          <div className="background-pattern"></div>
        </div>
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Clock size={36} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Documents empruntés</h1>
              <p className="page-subtitle">
                {books.length} document(s) actuellement en circulation
              </p>
            </div>
          </div>
          
          {/* Status Overview */}
          <div className="status-overview">
            <div className="status-card normal">
              <div className="status-icon">
                <CheckCircle size={20} />
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.normal}</span>
                <span className="status-label">Normal</span>
              </div>
            </div>
            
            <div className="status-card warning">
              <div className="status-icon">
                <Clock size={20} />
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.warning}</span>
                <span className="status-label">À surveiller</span>
              </div>
            </div>
            
            <div className="status-card overdue">
              <div className="status-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.overdue}</span>
                <span className="status-label">En retard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou emprunteur..."
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
        
        <div className="filters-container">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="normal">Normal (≤14 jours)</option>
              <option value="warning">À surveiller (15-30 jours)</option>
              <option value="overdue">En retard (&gt;30 jours)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <ArrowUpDown size={16} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="date">Trier par date d'emprunt</option>
              <option value="borrower">Trier par emprunteur</option>
              <option value="title">Trier par titre</option>
              <option value="status">Trier par statut</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="books-content">
        {sortedBooks.length > 0 ? (
          <div className="borrowed-list">
            {sortedBooks.map((book) => {
              const statusInfo = getStatusInfo(book.borrowDate!);
              
              return (
                <div key={book.id} className={`borrowed-card ${statusInfo.status}`}>
                  <div className="card-content">
                    <div className="book-info">
                      <div className="book-cover">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} />
                        ) : (
                          <div className="book-cover-placeholder">
                            <Book size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="book-details">
                        <div className="book-main">
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">par {book.author}</p>
                          <div className="book-category">
                            <span className="category-badge">{book.category}</span>
                          </div>
                        </div>
                        
                        <div className="borrow-details">
                          <div className="detail-item">
                            <User size={16} />
                            <span className="borrower-name">{book.borrowerName}</span>
                          </div>
                          <div className="detail-item">
                            <Calendar size={16} />
                            <span>Emprunté le {new Date(book.borrowDate!).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="status-section">
                      <div className="status-indicator" style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color 
                      }}>
                        <div className="status-dot" style={{ backgroundColor: statusInfo.color }}></div>
                        <span className="status-text">{statusInfo.text}</span>
                      </div>
                      
                      <div className="card-actions">
                        <button 
                          className="action-button view"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-button return"
                          onClick={() => handleReturn(book)}
                          title="Marquer comme rendu"
                        >
                          <RotateCcw size={18} />
                          <span>Retour</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">
              {books.length === 0 ? (
                <CheckCircle size={80} />
              ) : (
                <Search size={80} />
              )}
            </div>
            <h3 className="empty-title">
              {books.length === 0 ? 'Aucun document emprunté' : 'Aucun résultat'}
            </h3>
            <p className="empty-description">
              {books.length === 0 
                ? 'Tous les documents sont actuellement disponibles dans la bibliothèque.'
                : searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : 'Aucun document ne correspond aux filtres sélectionnés.'
              }
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button 
                className="btn-secondary"
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
        .borrowed-books {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
        }
        
        .page-header {
          position: relative;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
          padding: 40px 32px;
          overflow: hidden;
        }
        
        .header-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .background-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(243, 238, 217, 0.05) 0%, transparent 50%);
          animation: float 15s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        
        .header-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
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
          background: rgba(243, 238, 217, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }
        
        .page-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 8px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .page-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .status-overview {
          display: flex;
          gap: 20px;
        }
        
        .status-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(243, 238, 217, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.3);
          border-radius: 16px;
          padding: 20px 24px;
          transition: all 0.3s ease;
        }
        
        .status-card:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateY(-2px);
        }
        
        .status-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .status-card.normal .status-icon {
          background: rgba(62, 92, 73, 0.3);
        }
        
        .status-card.warning .status-icon {
          background: rgba(194, 87, 27, 0.3);
        }
        
        .status-card.overdue .status-icon {
          background: rgba(220, 38, 38, 0.3);
        }
        
        .status-count {
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
          display: block;
        }
        
        .status-label {
          font-size: 12px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .controls-section {
          background: #FFFFFF;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          display: flex;
          gap: 24px;
          align-items: center;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.04);
        }
        
        .search-container {
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
          border-color: #C2571B;
          box-shadow: 0 0 0 3px rgba(194, 87, 27, 0.1);
        }
        
        .search-input::placeholder {
          color: #6E6E6E;
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
        
        .filters-container {
          display: flex;
          gap: 16px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #C2571B;
        }
        
        .books-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .borrowed-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .borrowed-card {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid #E5DCC2;
          position: relative;
        }
        
        .borrowed-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #3E5C49;
          transition: background 0.3s ease;
        }
        
        .borrowed-card.warning::before {
          background: #C2571B;
        }
        
        .borrowed-card.overdue::before {
          background: #DC2626;
        }
        
        .borrowed-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 32px rgba(62, 92, 73, 0.12),
            0 4px 16px rgba(62, 92, 73, 0.08);
        }
        
        .card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          gap: 24px;
        }
        
        .book-info {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
          min-width: 0;
        }
        
        .book-cover {
          width: 64px;
          height: 88px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.2);
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-cover-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
        }
        
        .book-details {
          flex: 1;
          min-width: 0;
        }
        
        .book-main {
          margin-bottom: 16px;
        }
        
        .book-title {
          font-size: 20px;
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
        
        .category-badge {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .borrow-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .borrower-name {
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .status-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          flex-shrink: 0;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid currentColor;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .card-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .action-button.view {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 12px;
        }
        
        .action-button.view:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .action-button.return {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-button.return:hover {
          background: #2E453A;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }
        
        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .empty-illustration {
          color: #C2571B;
          margin-bottom: 32px;
          opacity: 0.6;
        }
        
        .empty-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: #2E2E2E;
        }
        
        .empty-description {
          margin: 0 0 32px 0;
          font-size: 16px;
          line-height: 1.6;
          color: #6E6E6E;
        }
        
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary:hover {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        /* Animations */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .status-overview {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
          }
          
          .controls-section {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .search-container {
            max-width: none;
          }
          
          .filters-container {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 768px) {
          .page-header {
            padding: 24px 16px;
          }
          
          .header-main {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          
          .page-title {
            font-size: 28px;
          }
          
          .page-subtitle {
            font-size: 16px;
          }
          
          .status-overview {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .status-card {
            padding: 16px 20px;
          }
          
          .controls-section {
            padding: 16px;
          }
          
          .books-content {
            padding: 16px;
          }
          
          .card-content {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          
          .book-info {
            flex-direction: column;
            text-align: center;
          }
          
          .status-section {
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
          }
          
          .borrow-details {
            align-items: center;
          }
        }
        
        @media (max-width: 480px) {
          .header-icon {
            width: 56px;
            height: 56px;
          }
          
          .status-overview {
            flex-direction: column;
            gap: 12px;
          }
          
          .status-card {
            padding: 12px 16px;
          }
          
          .status-count {
            font-size: 20px;
          }
          
          .filters-container {
            flex-direction: column;
            gap: 12px;
          }
          
          .filter-group {
            flex: 1;
          }
          
          .filter-select {
            flex: 1;
          }
          
          .borrowed-card {
            border-radius: 16px;
          }
          
          .card-content {
            padding: 20px 16px;
          }
          
          .book-cover {
            width: 56px;
            height: 76px;
          }
          
          .book-title {
            font-size: 18px;
          }
          
          .card-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .action-button.return {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};