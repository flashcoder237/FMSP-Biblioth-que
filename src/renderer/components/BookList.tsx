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
  X
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
      'Fiction': '#22c55e',
      'Science-Fiction': '#3b82f6',
      'Histoire': '#f59e0b',
      'Biographie': '#ef4444',
      'Sciences': '#8b5cf6',
      'Philosophie': '#06b6d4',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="book-list">
      <div className="book-list-header">
        <div className="header-content">
          <h1 className="page-title">Collection de livres</h1>
          <p className="page-subtitle">{books.length} livre(s) dans la collection</p>
        </div>
        
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
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
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
            </div>
            
            <div className="book-content">
              <div className="book-header">
                <h3 className="book-title">{book.title}</h3>
                <div className="book-actions">
                  <button
                    className="action-button"
                    onClick={() => setActiveDropdown(activeDropdown === book.id ? null : book.id!)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {activeDropdown === book.id && (
                    <div className="dropdown-menu">
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
              
              <div className="book-meta">
                <div className="meta-item">
                  <User size={14} />
                  <span>{book.author}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{book.publishedDate}</span>
                </div>
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
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="empty-state">
          <Book size={48} />
          <h3>Aucun livre trouvé</h3>
          <p>
            {searchQuery 
              ? `Aucun résultat pour "${searchQuery}"`
              : 'Commencez par ajouter des livres à votre collection'
            }
          </p>
        </div>
      )}

      {/* Modal d'emprunt */}
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
              <div className="book-info">
                <div className="book-info-title">"{selectedBook.title}"</div>
                <div className="book-info-author">par {selectedBook.author}</div>
              </div>
              
              <div className="form-group">
                <label htmlFor="borrower-name">Nom de l'emprunteur</label>
                <input
                  id="borrower-name"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Entrez le nom de la personne"
                  className="form-input"
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
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .book-list-header {
          background: white;
          padding: 32px;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .header-content {
          margin-bottom: 24px;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        
        .page-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 16px;
        }
        
        .search-container {
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
          color: #9ca3af;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          background: #f9fafb;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #22c55e;
          background: white;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }
        
        .clear-search:hover {
          color: #6b7280;
        }
        
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 32px;
        }
        
        .book-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .book-cover {
          height: 200px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
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
          color: #9ca3af;
        }
        
        .borrowed-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ef4444;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
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
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.3;
          flex: 1;
          margin-right: 12px;
        }
        
        .book-actions {
          position: relative;
        }
        
        .action-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          z-index: 20;
          min-width: 150px;
        }
        
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: background 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: #f3f4f6;
        }
        
        .dropdown-item.delete {
          color: #ef4444;
        }
        
        .dropdown-item.delete:hover {
          background: #fef2f2;
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
          color: #6b7280;
        }
        
        .category-tag {
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .book-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .borrow-info {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
        }
        
        .borrow-label {
          font-weight: 600;
          color: #92400e;
          margin-right: 8px;
        }
        
        .borrower-name {
          color: #92400e;
          font-weight: 500;
        }
        
        .borrow-date {
          color: #a16207;
          margin-left: 8px;
          font-size: 13px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 32px;
          color: #6b7280;
          text-align: center;
        }
        
        .empty-state h3 {
          font-size: 18px;
          margin: 16px 0 8px 0;
          color: #374151;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 14px;
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          margin: 16px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }
        
        .modal-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-content {
          padding: 24px;
        }
        
        .book-info {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }
        
        .book-info-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .book-info-author {
          font-size: 14px;
          color: #6b7280;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #22c55e;
        }
        
        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
          justify-content: flex-end;
        }
        
        .btn-secondary, .btn-primary {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover {
          background: #16a34a;
        }
        
        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .books-grid {
            grid-template-columns: 1fr;
            padding: 16px;
          }
          
          .book-list-header {
            padding: 16px;
          }
          
          .modal {
            margin: 8px;
          }
        }
      `}</style>
    </div>
  );
};