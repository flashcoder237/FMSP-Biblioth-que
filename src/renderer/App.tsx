import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BookList } from './components/BookList';
import { BorrowedBooks } from './components/BorrowedBooks';
import { AddBook } from './components/AddBook';
import { Borrowers } from './components/Borrowers';
import { BorrowHistory } from './components/BorrowHistory';
import { Book, Author, Category, Stats, Borrower, BorrowHistory as BorrowHistoryType } from '../preload';

type ViewType = 'dashboard' | 'books' | 'borrowed' | 'add-book' | 'borrowers' | 'history';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowHistoryType[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalBorrowers: 0,
    totalStudents: 0,
    totalStaff: 0,
    overdueBooks: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        booksData, 
        authorsData, 
        categoriesData, 
        borrowersData,
        borrowedBooksData,
        statsData
      ] = await Promise.all([
        window.electronAPI.getBooks(),
        window.electronAPI.getAuthors(),
        window.electronAPI.getCategories(),
        window.electronAPI.getBorrowers(),
        window.electronAPI.getBorrowedBooks(),
        window.electronAPI.getStats()
      ]);

      setBooks(booksData);
      setAuthors(authorsData);
      setCategories(categoriesData);
      setBorrowers(borrowersData);
      setBorrowedBooks(borrowedBooksData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleAddBook = async (book: Omit<Book, 'id'>) => {
    try {
      await window.electronAPI.addBook(book);
      await loadData();
      setCurrentView('books');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre:', error);
      throw error;
    }
  };

  const handleBorrowBook = async (bookId: number, borrowerId: number, expectedReturnDate: string) => {
    try {
      await window.electronAPI.borrowBook(bookId, borrowerId, expectedReturnDate);
      await loadData();
      setShowBorrowModal(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Erreur lors de l\'emprunt:', error);
      throw error;
    }
  };

  const handleReturnBook = async (borrowHistoryId: number, notes?: string) => {
    try {
      await window.electronAPI.returnBook(borrowHistoryId, notes);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du retour:', error);
      throw error;
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await window.electronAPI.deleteBook(bookId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await window.electronAPI.searchBooks(query);
        setBooks(searchResults);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    } else {
      await loadData();
    }
  };

  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            books={books}
            categories={categories}
          />
        );
      case 'books':
        return (
          <BookList
            books={books}
            onBorrow={(book) => openBorrowModal(book)}
            onDelete={handleDeleteBook}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        );
      case 'borrowed':
        return (
          <BorrowedBooks
            books={borrowedBooks.map(bh => ({
                ...bh.book,
                isBorrowed: true,
                borrowerId: bh.borrowerId,
                borrowDate: bh.borrowDate,
                borrowerName: `${bh.borrower?.firstName} ${bh.borrower?.lastName}`
            }))}
            onReturn={(bookId) => {
                const borrowHistory = borrowedBooks.find(bh => bh.bookId === bookId);
                if (borrowHistory) {
                handleReturnBook(borrowHistory.id!, undefined);
                }
            }}
            />
        );
      case 'add-book':
        return (
          <AddBook
            authors={authors}
            categories={categories}
            onAddBook={handleAddBook}
            onCancel={() => setCurrentView('books')}
          />
        );
      case 'borrowers':
        return (
          <Borrowers
            onClose={() => setCurrentView('dashboard')}
          />
        );
      case 'history':
        return (
          <BorrowHistory
            onClose={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            books={books}
            categories={categories}
          />
        );
    }
  };

  return (
    <div className="app">
      <TitleBar />
      <div className="app-container">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          stats={stats}
        />
        <main className="main-content">
          <div className="content-wrapper">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Modern Borrow Modal */}
      {showBorrowModal && selectedBook && (
        <div className="borrow-modal-overlay">
          <div className="borrow-modal">
            <div className="modal-header">
              <div className="header-content">
                <h3>Emprunter un livre</h3>
                <p>Sélectionnez l'emprunteur et définissez la date de retour</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowBorrowModal(false)}
              >
                ×
              </button>
            </div>
            
            <BorrowForm
              book={selectedBook}
              borrowers={borrowers}
              onSubmit={handleBorrowBook}
              onCancel={() => setShowBorrowModal(false)}
            />
          </div>
        </div>
      )}
      
      <style>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
          overflow: hidden;
        }
        
        .app-container {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
          overflow: hidden;
        }
        
        .content-wrapper {
          flex: 1;
          overflow: hidden;
          border-radius: 12px 0 0 0;
          background: #FAF9F6;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
        }

        /* Modern Borrow Modal */
        .borrow-modal-overlay {
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
        
        .borrow-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #F3EED9;
        }
        
        .header-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .header-content p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .modal-close {
          background: rgba(110, 110, 110, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 24px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: rgba(110, 110, 110, 0.2);
          color: #2E2E2E;
        }
        
        /* Smooth animations */
        * {
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Microsoft Store inspired scrollbars */
        ::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F3EED9;
          border-radius: 8px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #3E5C49;
          border-radius: 8px;
          border: 3px solid #F3EED9;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #2E453A;
        }
        
        ::-webkit-scrollbar-corner {
          background: #F3EED9;
        }
        
        /* Modern card shadows */
        .card-shadow {
          box-shadow: 
            0 2px 8px rgba(62, 92, 73, 0.08),
            0 1px 4px rgba(62, 92, 73, 0.12);
        }
        
        .card-shadow:hover {
          box-shadow: 
            0 8px 24px rgba(62, 92, 73, 0.12),
            0 4px 12px rgba(62, 92, 73, 0.16);
        }
        
        /* Focus states */
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
          outline: 2px solid #3E5C49;
          outline-offset: 2px;
        }
        
        /* Selection color */
        ::selection {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .content-wrapper {
            border-radius: 0;
            box-shadow: none;
          }
          
          .borrow-modal {
            margin: 12px;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
};

// Composant pour le formulaire d'emprunt
interface BorrowFormProps {
  book: Book;
  borrowers: Borrower[];
  onSubmit: (bookId: number, borrowerId: number, expectedReturnDate: string) => Promise<void>;
  onCancel: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ book, borrowers, onSubmit, onCancel }) => {
  const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculer la date par défaut (dans 2 semaines)
  React.useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setExpectedReturnDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const filteredBorrowers = borrowers.filter(borrower =>
    `${borrower.firstName} ${borrower.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (borrower.classe && borrower.classe.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (borrower.position && borrower.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrower || !expectedReturnDate) return;

    setIsLoading(true);
    try {
      await onSubmit(book.id!, selectedBorrower, expectedReturnDate);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBorrowerData = borrowers.find(b => b.id === selectedBorrower);

  return (
    <form onSubmit={handleSubmit} className="borrow-form">
      {/* Book Info */}
      <div className="book-info-section">
        <div className="book-cover">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} />
          ) : (
            <div className="book-placeholder">📚</div>
          )}
        </div>
        <div className="book-details">
          <h4 className="book-title">"{book.title}"</h4>
          <p className="book-author">par {book.author}</p>
          <span className="book-category">{book.category}</span>
        </div>
      </div>

      {/* Borrower Selection */}
      <div className="form-section">
        <label className="form-label">Emprunteur *</label>
        <div className="borrower-search">
          <input
            type="text"
            placeholder="Rechercher un emprunteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="borrowers-list">
          {filteredBorrowers.length > 0 ? (
            filteredBorrowers.map((borrower) => (
              <div
                key={borrower.id}
                className={`borrower-option ${selectedBorrower === borrower.id ? 'selected' : ''}`}
                onClick={() => setSelectedBorrower(borrower.id!)}
              >
                <div className="borrower-type-badge">
                  {borrower.type === 'student' ? '🎓' : '👔'}
                  <span>{borrower.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                </div>
                <div className="borrower-info">
                  <div className="borrower-name">
                    {borrower.firstName} {borrower.lastName}
                  </div>
                  <div className="borrower-details">
                    {borrower.matricule}
                    {borrower.type === 'student' && borrower.classe && ` • ${borrower.classe}`}
                    {borrower.type === 'staff' && borrower.position && ` • ${borrower.position}`}
                  </div>
                </div>
                <div className="selection-indicator">
                  {selectedBorrower === borrower.id && '✓'}
                </div>
              </div>
            ))
          ) : (
            <div className="no-borrowers">
              {searchQuery ? 'Aucun emprunteur trouvé' : 'Aucun emprunteur disponible'}
            </div>
          )}
        </div>
      </div>

      {/* Return Date */}
      <div className="form-section">
        <label className="form-label">Date de retour prévue *</label>
        <input
          type="date"
          value={expectedReturnDate}
          onChange={(e) => setExpectedReturnDate(e.target.value)}
          className="date-input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <small className="form-hint">
          Date recommandée : 2 semaines à partir d'aujourd'hui
        </small>
      </div>

      {/* Selected Borrower Summary */}
      {selectedBorrowerData && (
        <div className="selected-summary">
          <h4>Résumé de l'emprunt</h4>
          <div className="summary-content">
            <div className="summary-item">
              <span className="label">Livre :</span>
              <span className="value">{book.title}</span>
            </div>
            <div className="summary-item">
              <span className="label">Emprunteur :</span>
              <span className="value">
                {selectedBorrowerData.firstName} {selectedBorrowerData.lastName}
                <span className="type-badge">
                  {selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel'}
                </span>
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Retour prévu :</span>
              <span className="value">
                {new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!selectedBorrower || !expectedReturnDate || isLoading}
        >
          {isLoading ? 'Emprunt en cours...' : 'Confirmer l\'emprunt'}
        </button>
      </div>

      <style>{`
        .borrow-form {
          padding: 32px;
        }
        
        .book-info-section {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #F3EED9;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        
        .book-cover {
          width: 60px;
          height: 80px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-placeholder {
          font-size: 24px;
        }
        
        .book-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 8px 0;
        }
        
        .book-category {
          background: #3E5C49;
          color: #F3EED9;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .form-section {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
        }
        
        .borrowers-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
        }
        
        .borrower-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #F3EED9;
          transition: all 0.2s ease;
        }
        
        .borrower-option:hover {
          background: #F3EED9;
        }
        
        .borrower-option.selected {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .borrower-option:last-child {
          border-bottom: none;
        }
        
        .borrower-type-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .borrower-info {
          flex: 1;
        }
        
        .borrower-name {
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .borrower-details {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .selection-indicator {
          font-size: 16px;
          font-weight: bold;
        }
        
        .no-borrowers {
          padding: 20px;
          text-align: center;
          color: #6E6E6E;
          font-style: italic;
        }
        
        .date-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .date-input:focus {
          outline: none;
          border-color: #3E5C49;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6E6E6E;
          margin-top: 4px;
          display: block;
        }
        
        .selected-summary {
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .selected-summary h4 {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .summary-item:last-child {
          margin-bottom: 0;
        }
        
        .label {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }
        
        .value {
          font-size: 14px;
          color: #2E2E2E;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .type-badge {
          background: #3E5C49;
          color: #F3EED9;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #E5DCC2;
        }
        
        .btn-secondary, .btn-primary {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2E453A;
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
};