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
  Eye,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react';
import { Book as BookType } from '../../preload';

interface BookListProps {
  books: BookType[];
  onBorrow: (book: BookType) => void; // Simplifié - plus besoin du borrowerName
  onDelete: (bookId: number) => void;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  onBorrow, 
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'date' | 'popularity'>('title');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'borrowed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      'Romance': '#E91E63',
      'Thriller': '#9C27B0',
      'Jeunesse': '#FF9800',
      'Art': '#607D8B'
    };
    return colors[category] || '#6E6E6E';
  };

  // Obtenir toutes les catégories uniques
  const categories = Array.from(new Set(books.map(book => book.category)));

  const filteredBooks = books.filter(book => {
    // Filtre par statut
    if (filterStatus === 'available') return !book.isBorrowed;
    if (filterStatus === 'borrowed') return book.isBorrowed;
    
    // Filtre par catégorie
    if (selectedCategory !== 'all' && book.category !== selectedCategory) return false;
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'author':
        return a.author.localeCompare(b.author);
      case 'date':
        return (b.publishedDate || '').localeCompare(a.publishedDate || '');
      case 'popularity':
        // Simuler la popularité basée sur le statut d'emprunt et la date
        const scoreA = (a.isBorrowed ? 10 : 5) + (a.publishedDate ? parseInt(a.publishedDate) / 100 : 0);
        const scoreB = (b.isBorrowed ? 10 : 5) + (b.publishedDate ? parseInt(b.publishedDate) / 100 : 0);
        return scoreB - scoreA;
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const getBookStats = () => {
    return {
      total: books.length,
      available: books.filter(b => !b.isBorrowed).length,
      borrowed: books.filter(b => b.isBorrowed).length,
      filtered: filteredBooks.length
    };
  };

  const stats = getBookStats();

  return (
    <div className="book-list">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="header-main">
          <div className="header-text">
            <h1 className="page-title">Collection de livres</h1>
            <p className="page-subtitle">
              {stats.filtered} livre(s) affiché(s) sur {stats.total} au total
            </p>
          </div>
          
          <div className="header-actions">
            <div className="quick-stats">
              <div className="quick-stat available">
                <span className="stat-number">{stats.available}</span>
                <span className="stat-label">Disponibles</span>
              </div>
              <div className="quick-stat borrowed">
                <span className="stat-number">{stats.borrowed}</span>
                <span className="stat-label">Empruntés</span>
              </div>
            </div>
            
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
        
        {/* Enhanced Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, catégorie..."
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
                <option value="all">Tous les livres</option>
                <option value="available">Disponibles</option>
                <option value="borrowed">Empruntés</option>
              </select>
            </div>
            
            <div className="filter-group">
              <Tag size={16} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
                <option value="popularity">Trier par popularité</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Quick Filters */}
        {categories.length > 0 && (
          <div className="category-filters">
            <button
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Toutes
            </button>
            {categories.slice(0, 6).map((category) => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  '--category-color': getCategoryColor(category)
                } as React.CSSProperties}
              >
                {category}
              </button>
            ))}
            {categories.length > 6 && (
              <span className="more-categories">+{categories.length - 6} autres</span>
            )}
          </div>
        )}
      </div>

      {/* Books Content */}
      <div className="books-content">
        {sortedBooks.length > 0 ? (
          <div className={`books-container ${viewMode}`}>
            {sortedBooks.map((book) => (
              <div key={book.id} className="book-item card-elevated">
                {viewMode === 'grid' ? (
                  // Enhanced Grid View
                  <>
                    <div className="book-cover">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} />
                      ) : (
                        <div className="book-cover-placeholder">
                          <Book size={32} />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`status-badge ${book.isBorrowed ? 'borrowed' : 'available'}`}>
                        {book.isBorrowed ? 'Emprunté' : 'Disponible'}
                      </div>
                      
                      {/* Quick Actions Overlay */}
                      <div className="book-overlay">
                        <div className="overlay-actions">
                          <button
                            className="overlay-button view"
                            onClick={() => {}}
                            title="Voir détails"
                          >
                            <Eye size={16} />
                          </button>
                          {!book.isBorrowed && (
                            <button
                              className="overlay-button borrow"
                              onClick={() => onBorrow(book)}
                              title="Emprunter"
                            >
                              <UserPlus size={16} />
                            </button>
                          )}
                          <button
                            className="overlay-button menu"
                            onClick={() => setActiveDropdown(activeDropdown === book.id ? null : book.id!)}
                            title="Plus d'options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        
                        {activeDropdown === book.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => {}}>
                              <Eye size={16} />
                              Voir détails
                            </button>
                            <button className="dropdown-item" onClick={() => {}}>
                              <Edit size={16} />
                              Modifier
                            </button>
                            {!book.isBorrowed && (
                              <button
                                className="dropdown-item primary"
                                onClick={() => onBorrow(book)}
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
                    
                    <div className="book-content">
                      <div className="book-header">
                        <h3 className="book-title">{book.title}</h3>
                        <div className="book-rating">
                          <Star size={14} fill="currentColor" />
                          <span>4.2</span>
                        </div>
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
                      </div>
                      
                      <div className="book-category-section">
                        <span 
                          className="category-tag"
                          style={{ backgroundColor: getCategoryColor(book.category) }}
                        >
                          {book.category}
                        </span>
                        {book.isBorrowed && (
                          <span className="trending-badge">
                            <TrendingUp size={12} />
                            Populaire
                          </span>
                        )}
                      </div>
                      
                      {book.description && (
                        <p className="book-description">{book.description}</p>
                      )}
                      
                      {book.isBorrowed && book.borrowerName && (
                        <div className="borrow-info">
                          <div className="borrower-avatar">
                            {book.borrowerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="borrow-details">
                            <span className="borrow-label">Emprunté par</span>
                            <span className="borrower-name">{book.borrowerName}</span>
                            {book.borrowDate && (
                              <span className="borrow-date">
                                le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      {!book.isBorrowed && (
                        <button
                          className="primary-action-btn"
                          onClick={() => onBorrow(book)}
                        >
                          <UserPlus size={16} />
                          Emprunter maintenant
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // Enhanced List View
                  <div className="book-list-content">
                    <div className="book-list-cover">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} />
                      ) : (
                        <div className="book-cover-placeholder small">
                          <Book size={20} />
                        </div>
                      )}
                      <div className={`list-status-indicator ${book.isBorrowed ? 'borrowed' : 'available'}`}>
                        {book.isBorrowed ? '●' : '●'}
                      </div>
                    </div>
                    
                    <div className="book-list-details">
                      <div className="book-list-main">
                        <div className="list-title-section">
                          <h3 className="book-title">{book.title}</h3>
                          <div className="book-rating small">
                            <Star size={12} fill="currentColor" />
                            <span>4.2</span>
                          </div>
                        </div>
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
                      {!book.isBorrowed && (
                        <button
                          className="action-button borrow"
                          onClick={() => onBorrow(book)}
                        >
                          <UserPlus size={16} />
                          Emprunter
                        </button>
                      )}
                      <button
                        className="action-button menu"
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
                          <button className="dropdown-item" onClick={() => {}}>
                            <Edit size={16} />
                            Modifier
                          </button>
                          {!book.isBorrowed && (
                            <button
                              className="dropdown-item primary"
                              onClick={() => onBorrow(book)}
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
              {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all' ? (
                <Search size={64} />
              ) : (
                <Book size={64} />
              )}
            </div>
            <h3 className="empty-title">
              {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all' 
                ? 'Aucun livre trouvé' 
                : 'Aucun livre dans la collection'
              }
            </h3>
            <p className="empty-description">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : filterStatus !== 'all'
                ? `Aucun livre ${filterStatus === 'available' ? 'disponible' : 'emprunté'} pour le moment`
                : selectedCategory !== 'all'
                ? `Aucun livre dans la catégorie "${selectedCategory}"`
                : 'Commencez par ajouter des livres à votre collection'
              }
            </p>
            {(searchQuery || filterStatus !== 'all' || selectedCategory !== 'all') && (
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setSelectedCategory('all');
                }}
              >
                Effacer tous les filtres
              </button>
            )}
          </div>
        )}
      </div>

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
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .quick-stats {
          display: flex;
          gap: 16px;
        }
        
        .quick-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          min-width: 80px;
        }
        
        .quick-stat.available {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .quick-stat.borrowed {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          margin-bottom: 20px;
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
        
        .category-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .category-chip {
          padding: 8px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 20px;
          background: #FFFFFF;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .category-chip:hover {
          border-color: var(--category-color, #3E5C49);
          color: var(--category-color, #3E5C49);
        }
        
        .category-chip.active {
          background: var(--category-color, #3E5C49);
          border-color: var(--category-color, #3E5C49);
          color: #FFFFFF;
        }
        
        .more-categories {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }
        
        .books-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .books-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        
        .books-container.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .book-item {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .book-item:hover {
          transform: translateY(-6px);
          box-shadow: 
            0 16px 40px rgba(62, 92, 73, 0.15),
            0 8px 24px rgba(62, 92, 73, 0.1);
        }
        
        /* Enhanced Grid View */
        .book-cover {
          height: 240px;
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
        
        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        .status-badge.available {
          background: rgba(62, 92, 73, 0.9);
          color: #F3EED9;
        }
        
        .status-badge.borrowed {
          background: rgba(194, 87, 27, 0.9);
          color: #F3EED9;
        }
        
        .book-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
        }
        
        .book-item:hover .book-overlay {
          opacity: 1;
        }
        
        .overlay-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          align-self: flex-start;
        }
        
        .overlay-button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .overlay-button.view {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }
        
        .overlay-button.borrow {
          background: rgba(62, 92, 73, 0.9);
          color: #F3EED9;
        }
        
        .overlay-button.menu {
          background: rgba(110, 110, 110, 0.9);
          color: #FFFFFF;
        }
        
        .overlay-button:hover {
          transform: scale(1.1);
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
          margin-top: 8px;
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
        
        .dropdown-item.primary {
          color: #3E5C49;
          font-weight: 600;
        }
        
        .dropdown-item.primary:hover {
          background: rgba(62, 92, 73, 0.1);
        }
        
        .dropdown-item.delete {
          color: #C2571B;
        }
        
        .dropdown-item.delete:hover {
          background: rgba(194, 87, 27, 0.1);
        }
        
        .book-content {
          padding: 24px;
        }
        
        .book-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
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
        
        .book-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #FFB400;
          font-size: 14px;
          font-weight: 600;
        }
        
        .book-rating.small {
          font-size: 12px;
        }
        
        .book-rating.small svg {
          width: 12px;
          height: 12px;
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
        
        .book-category-section {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .category-tag {
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .category-tag.small {
          padding: 4px 8px;
          font-size: 11px;
        }
        
        .trending-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 180, 0, 0.1);
          color: #FFB400;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .book-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.5;
          margin: 0 0 20px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .borrow-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(194, 87, 27, 0.05);
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }
        
        .borrow-info.compact {
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 0;
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .borrower-avatar {
          width: 32px;
          height: 32px;
          background: #C2571B;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        
        .borrow-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .borrow-label {
          font-size: 12px;
          color: #6E6E6E;
          font-weight: 500;
        }
        
        .borrower-name {
          font-size: 14px;
          color: #C2571B;
          font-weight: 600;
        }
        
        .borrow-date {
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .primary-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .primary-action-btn:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }
        
        /* Enhanced List View */
        .book-list-content {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          position: relative;
        }
        
        .book-list-cover {
          flex-shrink: 0;
          position: relative;
        }
        
        .list-status-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .list-status-indicator.available {
          color: #3E5C49;
        }
        
        .list-status-indicator.borrowed {
          color: #C2571B;
        }
        
        .book-list-details {
          flex: 1;
          min-width: 0;
        }
        
        .book-list-main {
          margin-bottom: 12px;
        }
        
        .list-title-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 8px 0;
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
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
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
        
        .action-button.borrow {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-button.borrow:hover {
          background: #2E453A;
          transform: translateY(-1px);
        }
        
        .action-button.menu {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 12px;
        }
        
        .action-button.menu:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        /* Empty State Enhanced */
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
        
        /* Enhanced Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .book-item {
          animation: slideIn 0.3s ease-out;
        }
        
        .book-item:nth-child(1) { animation-delay: 0ms; }
        .book-item:nth-child(2) { animation-delay: 50ms; }
        .book-item:nth-child(3) { animation-delay: 100ms; }
        .book-item:nth-child(4) { animation-delay: 150ms; }
        .book-item:nth-child(5) { animation-delay: 200ms; }
        .book-item:nth-child(6) { animation-delay: 250ms; }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .books-container.grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
          
          .header-actions {
            flex-direction: column;
            gap: 16px;
          }
          
          .quick-stats {
            order: 2;
          }
          
          .view-controls {
            order: 1;
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
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .category-filters {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 8px;
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
            text-align: center;
          }
          
          .book-list-cover {
            align-self: center;
          }
          
          .book-list-actions {
            align-self: center;
            justify-content: center;
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
          
          .book-content {
            padding: 20px;
          }
          
          .book-cover {
            height: 200px;
          }
          
          .overlay-actions {
            gap: 6px;
          }
          
          .overlay-button {
            width: 32px;
            height: 32px;
          }
          
          .primary-action-btn {
            padding: 12px 16px;
            font-size: 13px;
          }
          
          .action-button {
            padding: 10px 12px;
            font-size: 13px;
          }
          
          .category-chip {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
        
        /* Performance optimizations */
        .book-item {
          contain: layout style paint;
        }
        
        .book-cover img {
          will-change: transform;
        }
        
        .book-overlay {
          will-change: opacity;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .book-item,
          .overlay-button,
          .primary-action-btn,
          .action-button {
            transition: none;
            animation: none;
          }
          
          .book-item:hover {
            transform: none;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .book-item {
            border: 2px solid;
          }
          
          .search-input,
          .filter-select {
            border-width: 3px;
          }
          
          .category-chip {
            border-width: 3px;
          }
        }
        
        /* Dark mode support (future-proofing) */
        @media (prefers-color-scheme: dark) {
          .book-list {
            background: #1a1a1a;
          }
          
          .page-header,
          .book-item {
            background: #2d2d2d;
            border-color: #404040;
          }
          
          .page-title,
          .book-title {
            color: #ffffff;
          }
          
          .page-subtitle,
          .book-author,
          .meta-item {
            color: #a0a0a0;
          }
          
          .search-input,
          .filter-select {
            background: #2d2d2d;
            border-color: #404040;
            color: #ffffff;
          }
        }
      `}</style>
    </div>
  );
};