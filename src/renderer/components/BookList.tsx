import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Calendar, 
  User, 
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  X,
  Filter,
  Grid,
  List,
  SortAsc,
  Eye
} from 'lucide-react';
import { Book as BookType } from '../../preload';

interface BookListProps {
  books: BookType[];
  onBorrow: (bookId: number, borrowerName: string) => void;
  onDelete: (bookId: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  onBorrow, 
  onDelete, 
  onSearch, 
  searchQuery 
}) => {
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'date'>('title');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'borrowed'>('all');

  const handleBorrow = () => {
    if (selectedBook && borrowerName.trim()) {
      onBorrow(selectedBook.id!, borrowerName);
      setShowBorrowModal(false);
      setBorrowerName('');
      setSelectedBook(null);
    }
  };

  const openBorrowModal = (book: BookType) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (book: BookType) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)) {
      onDelete(book.id!);
    }
    setActiveDropdown(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Fiction': '#3E5C49',
      'Science-Fiction': '#C2571B',
      'Histoire': '#6E6E6E',
      'Biographie': '#3E5C49',
      'Sciences': '#C2571B',
      'Philosophie': '#6E6E6E',
    };
    return colors[category] || '#6E6E6E';
  };

  const filteredBooks = books.filter(book => {
    if (filterStatus === 'available') return !book.isBorrowed;
    if (filterStatus === 'borrowed') return book.isBorrowed;
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'author':
        return a.author.localeCompare(b.author);
      case 'date':
        return (b.publishedDate || '').localeCompare(a.publishedDate || '');
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="book-list">
      {/* Header */}
      <div className="page-header">
        <div className="header-main">
          <div className="header-text">
            <h1 className="page-title">Collection de livres</h1>
            <p className="page-subtitle">
              {filteredBooks.length} livre(s) {filterStatus !== 'all' ? `(${filterStatus === 'available' ? 'disponibles' : 'empruntés'})` : 'au total'}
            </p>
          </div>
          
          <div className="header-actions">
            <div className="view-controls">
              <button 
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vue grille"
              >
                <Grid size={16} />
              </button>
              <button 
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Vue liste"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, catégorie..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => onSearch('')}
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
                <option value="all">Tous les livres</option>
                <option value="available">Disponibles</option>
                <option value="borrowed">Empruntés</option>
              </select>
            </div>
            
            <div className="filter-group">
              <SortAsc size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="filter-select"
              >
                <option value="title">Trier par titre</option>
                <option value="author">Trier par auteur</option>
                <option value="date">Trier par date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Content */}
      <div className="books-content">
        {sortedBooks.length > 0 ? (
          <div className={`books-container ${viewMode}`}>
            {sortedBooks.map((book) => (
              <div key={book.id} className="book-item card-elevated">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="book-cover">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} />
                      ) : (
                        <div className="book-cover-placeholder">
                          <Book size={32} />
                        </div>
                      )}
                      {book.isBorrowed && (
                        <div className="borrowed-badge">Emprunté</div>
                      )}
                      <div className="book-overlay">
                        <button
                          className="overlay-button"
                          onClick={() => setActiveDropdown(activeDropdown === book.id ? null : book.id!)}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="book-content">
                      <div className="book-header">
                        <h3 className="book-title">{book.title}</h3>
                        {activeDropdown === book.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => {}}>
                              <Eye size={16} />
                              Voir détails
                            </button>
                            {!book.isBorrowed && (
                              <button
                                className="dropdown-item"
                                onClick={() => openBorrowModal(book)}
                              >
                                <UserPlus size={16} />
                                Emprunter
                              </button>
                            )}
                            <button
                              className="dropdown-item delete"
                              onClick={() => handleDelete(book)}
                            >
                              <Trash2 size={16} />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="book-meta">
                        <div className="meta-item">
                          <User size={14} />
                          <span>{book.author}</span>
                        </div>
                        {book.publishedDate && (
                          <div className="meta-item">
                            <Calendar size={14} />
                            <span>{book.publishedDate}</span>
                          </div>
                        )}
                        <div className="meta-item">
                          <Tag size={14} />
                          <span 
                            className="category-tag"
                            style={{ backgroundColor: getCategoryColor(book.category) }}
                          >
                            {book.category}
                          </span>
                        </div>
                      </div>
                      
                      {book.description && (
                        <p className="book-description">{book.description}</p>
                      )}
                      
                      {book.isBorrowed && book.borrowerName && (
                        <div className="borrow-info">
                          <span className="borrow-label">Emprunté par:</span>
                          <span className="borrower-name">{book.borrowerName}</span>
                          {book.borrowDate && (
                            <span className="borrow-date">
                              le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="book-list-content">
                    <div className="book-list-cover">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} />
                      ) : (
                        <div className="book-cover-placeholder small">
                          <Book size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="book-list-details">
                      <div className="book-list-main">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">par {book.author}</p>
                        <div className="book-tags">
                          <span 
                            className="category-tag small"
                            style={{ backgroundColor: getCategoryColor(book.category) }}
                          >
                            {book.category}
                          </span>
                          {book.publishedDate && (
                            <span className="year-tag">{book.publishedDate}</span>
                          )}
                          {book.isBorrowed && (
                            <span className="status-tag borrowed">Emprunté</span>
                          )}
                        </div>
                      </div>
                      
                      {book.description && (
                        <p className="book-list-description">{book.description}</p>
                      )}
                      
                      {book.isBorrowed && book.borrowerName && (
                        <div className="borrow-info compact">
                          <User size={14} />
                          <span>Emprunté par <strong>{book.borrowerName}</strong></span>
                          {book.borrowDate && (
                            <span>le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="book-list-actions">
                      <button
                        className="action-button"
                        onClick={() => setActiveDropdown(activeDropdown === book.id ? null : book.id!)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdown === book.id && (
                        <div className="dropdown-menu right">
                          <button className="dropdown-item" onClick={() => {}}>
                            <Eye size={16} />
                            Voir détails
                          </button>
                          {!book.isBorrowed && (
                            <button
                              className="dropdown-item"
                              onClick={() => openBorrowModal(book)}
                            >
                              <UserPlus size={16} />
                              Emprunter
                            </button>
                          )}
                          <button
                            className="dropdown-item delete"
                            onClick={() => handleDelete(book)}
                          >
                            <Trash2 size={16} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Book size={64} />
            </div>
            <h3 className="empty-title">Aucun livre trouvé</h3>
            <p className="empty-description">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : filterStatus !== 'all'
                ? `Aucun livre ${filterStatus === 'available' ? 'disponible' : 'emprunté'} pour le moment`
                : 'Commencez par ajouter des livres à votre collection'
              }
            </p>
            {searchQuery && (
              <button 
                className="btn-secondary"
                onClick={() => onSearch('')}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowBorrowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Emprunter un livre</h3>
              <button
                className="modal-close"
                onClick={() => setShowBorrowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="book-info-card">
                <div className="book-info-cover">
                  {selectedBook.coverUrl ? (
                    <img src={selectedBook.coverUrl} alt={selectedBook.title} />
                  ) : (
                    <Book size={24} />
                  )}
                </div>
                <div className="book-info-details">
                  <div className="book-info-title">"{selectedBook.title}"</div>
                  <div className="book-info-author">par {selectedBook.author}</div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="borrower-name">Nom de l'emprunteur</label>
                <input
                  id="borrower-name"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Entrez le nom de la personne"
                  className="input"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowBorrowModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={handleBorrow}
                disabled={!borrowerName.trim()}
              >
                Confirmer l'emprunt
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .book-list {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
        }
        
        .page-header {
          background: #FFFFFF;
          padding: 32px;
          border-bottom: 1px solid #E5DCC2;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.04);
        }
        
        .header-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }
        
        .page-subtitle {
          color: #6E6E6E;
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .view-controls {
          display: flex;
          background: #F3EED9;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }
        
        .view-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: #6E6E6E;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-button.active {
          background: #FFFFFF;
          color: #3E5C49;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.1);
        }
        
        .search-section {
          display: flex;
          gap: 24px;
          align-items: center;
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
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
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
          border-color: #3E5C49;
        }
        
        .books-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .books-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .books-container.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .book-item {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .book-item:hover {
          transform: translateY(-4px);
        }
        
        /* Grid View Styles */
        .book-cover {
          height: 220px;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-cover-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6E6E6E;
        }
        
        .book-cover-placeholder.small {
          width: 60px;
          height: 80px;
          border-radius: 8px;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
        }
        
        .borrowed-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #C2571B;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .book-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .book-item:hover .book-overlay {
          opacity: 1;
        }
        
        .overlay-button {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .overlay-button:hover {
          background: #FFFFFF;
          transform: scale(1.05);
        }
        
        .book-content {
          padding: 20px;
        }
        
        .book-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          position: relative;
        }
        
        .book-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
          line-height: 1.3;
          flex: 1;
          margin-right: 12px;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.15);
          z-index: 20;
          min-width: 160px;
          overflow: hidden;
        }
        
        .dropdown-menu.right {
          right: 0;
          left: auto;
        }
        
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          color: #2E2E2E;
          transition: background 0.2s ease;
          text-align: left;
        }
        
        .dropdown-item:hover {
          background: #F3EED9;
        }
        
        .dropdown-item.delete {
          color: #C2571B;
        }
        
        .dropdown-item.delete:hover {
          background: rgba(194, 87, 27, 0.1);
        }
        
        .book-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .category-tag {
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .category-tag.small {
          padding: 2px 8px;
          font-size: 11px;
        }
        
        .book-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.5;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .borrow-info {
          background: rgba(194, 87, 27, 0.1);
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
        }
        
        .borrow-info.compact {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .borrow-label {
          font-weight: 600;
          color: #C2571B;
          margin-right: 8px;
        }
        
        .borrower-name {
          color: #C2571B;
          font-weight: 600;
        }
        
        .borrow-date {
          color: #6E6E6E;
          margin-left: 8px;
          font-size: 13px;
        }
        
        /* List View Styles */
        .book-list-content {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          position: relative;
        }
        
        .book-list-cover {
          flex-shrink: 0;
        }
        
        .book-list-details {
          flex: 1;
          min-width: 0;
        }
        
        .book-list-main {
          margin-bottom: 12px;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 4px 0 8px 0;
        }
        
        .book-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .year-tag {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .status-tag {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-tag.borrowed {
          background: #C2571B;
          color: #FFFFFF;
        }
        
        .book-list-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.5;
          margin: 12px 0 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .book-list-actions {
          flex-shrink: 0;
          position: relative;
        }
        
        .action-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background: #F3EED9;
          color: #2E2E2E;
        }
        
        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-icon {
          color: #C2571B;
          margin-bottom: 24px;
          opacity: 0.6;
        }
        
        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #2E2E2E;
        }
        
        .empty-description {
          margin: 0 0 24px 0;
          font-size: 16px;
          line-height: 1.5;
          max-width: 400px;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }
        
        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }
        
        .modal-close {
          background: #F3EED9;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .modal-content {
          padding: 24px;
        }
        
        .book-info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #F3EED9;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }
        
        .book-info-cover {
          width: 48px;
          height: 64px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
          overflow: hidden;
        }
        
        .book-info-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-info-details {
          flex: 1;
          min-width: 0;
        }
        
        .book-info-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        
        .book-info-author {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
          justify-content: flex-end;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .books-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .page-header {
            padding: 20px 16px;
          }
          
          .header-main {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .search-section {
            flex-direction: column;
            gap: 16px;
          }
          
          .filters-container {
            justify-content: space-between;
          }
          
          .books-content {
            padding: 16px;
          }
          
          .books-container.grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .book-list-content {
            flex-direction: column;
            gap: 12px;
          }
          
          .book-list-cover {
            align-self: center;
          }
          
          .book-list-actions {
            align-self: flex-end;
          }
          
          .modal {
            margin: 8px;
            border-radius: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          
          .search-input {
            height: 44px;
            font-size: 14px;
          }
          
          .view-controls {
            order: -1;
            align-self: flex-start;
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
          
          .book-item {
            border-radius: 12px;
          }
          
          .book-content {
            padding: 16px;
          }
          
          .dropdown-menu {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 16px 16px 0 0;
            max-width: none;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};