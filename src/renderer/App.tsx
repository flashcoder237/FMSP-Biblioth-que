// src/renderer/App.tsx - Version modifiée pour Supabase
import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BookList } from './components/BookList';
import { BorrowedBooks } from './components/BorrowedBooks';
import { AddBook } from './components/AddBook';
import { Borrowers } from './components/Borrowers';
import { BorrowHistory } from './components/BorrowHistory';
import { Settings } from './components/Settings';
import { Donation } from './components/Donation';
import { About } from './components/About';
import { EnhancedAuthentication } from './components/EnhancedAuthentication';
import { InstitutionSetup } from './components/InstitutionSetup';
import { Book, Author, Category, Stats, Borrower, BorrowHistory as BorrowHistoryType } from '../preload';
import { SupabaseService, Institution, User } from '../services/SupabaseService';

type ViewType = 'dashboard' | 'books' | 'borrowed' | 'add-book' | 'borrowers' | 'history' | 'settings' | 'donation' | 'about' | 'auth' | 'institution_setup';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
  const [institutionCode, setInstitutionCode] = useState<string>('');
  
  // Data states
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

  // Services
  const [supabaseService] = useState(() => new SupabaseService());
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = supabaseService.getCurrentUser();
      const institution = supabaseService.getCurrentInstitution();
      
      if (user && institution) {
        setCurrentUser(user);
        setCurrentInstitution(institution);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        await loadData();
      } else {
        setCurrentView('auth');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setCurrentView('auth');
    }
  };

  const loadData = async () => {
    if (!supabaseService.isAuthenticated()) return;

    try {
      setIsLoading(true);
      const [
        booksData, 
        authorsData, 
        categoriesData, 
        borrowersData,
        borrowedBooksData,
        statsData
      ] = await Promise.all([
        supabaseService.getBooks(),
        supabaseService.getAuthors(),
        supabaseService.getCategories(),
        supabaseService.getBorrowers(),
        supabaseService.getBorrowedBooks(),
        supabaseService.getStats()
      ]);

      setBooks(booksData);
      setAuthors(authorsData);
      setCategories(categoriesData);
      setBorrowers(borrowersData);
      setBorrowedBooks(borrowedBooksData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthentication = async (credentials: {
    email: string;
    password: string;
    institutionCode?: string;
    mode: 'login' | 'register' | 'create_institution';
    userData?: any;
  }) => {
    try {
      setIsLoading(true);
      setError('');

      if (credentials.mode === 'login') {
        // Connexion normale
        const result = await supabaseService.signIn(credentials.email, credentials.password);
        if (!result.success) {
          throw new Error(result.error);
        }

        // Vérifier le code d'établissement
        if (credentials.institutionCode) {
          const switchSuccess = await supabaseService.switchInstitution(credentials.institutionCode);
          if (!switchSuccess) {
            throw new Error('Code d\'établissement invalide ou accès non autorisé');
          }
        }

        setCurrentUser(result.user!);
        setCurrentInstitution(supabaseService.getCurrentInstitution());
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        await loadData();

      } else if (credentials.mode === 'register') {
        // Inscription avec code d'établissement
        const result = await supabaseService.signUp(
          credentials.email, 
          credentials.password, 
          {
            firstName: credentials.userData.firstName,
            lastName: credentials.userData.lastName,
            institutionCode: credentials.institutionCode,
            role: credentials.userData.role
          }
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        // Afficher un message de succès et rediriger vers login
        alert('Compte créé avec succès ! Veuillez vérifier votre email et vous connecter.');
        
      } else if (credentials.mode === 'create_institution') {
        // Création d'institution
        const institutionResult = await supabaseService.createInstitution(credentials.userData.institution);
        setInstitutionCode(institutionResult.code);
        
        // Créer le compte administrateur
        const adminResult = await supabaseService.signUp(
          credentials.email,
          credentials.password,
          {
            firstName: credentials.userData.admin.firstName,
            lastName: credentials.userData.admin.lastName,
            role: 'admin'
          }
        );

        if (!adminResult.success) {
          throw new Error(adminResult.error);
        }

        setCurrentView('institution_setup');
      }

    } catch (error: any) {
      setError(error.message || 'Erreur d\'authentification');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentInstitution(null);
      setCurrentView('auth');
      
      // Réinitialiser les données
      setBooks([]);
      setAuthors([]);
      setCategories([]);
      setBorrowers([]);
      setBorrowedBooks([]);
      setStats({
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
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleAddBook = async (book: Omit<Book, 'id'>) => {
    try {
      await supabaseService.addBook(book);
      await loadData();
      setCurrentView('books');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du livre:', error);
      throw error;
    }
  };

  const handleBorrowBook = async (bookId: number, borrowerId: number, expectedReturnDate: string) => {
    if (bookId === undefined || borrowerId === undefined || !expectedReturnDate) {
      console.error('Invalid arguments for borrowBook:', { bookId, borrowerId, expectedReturnDate });
      return;
    }
    try {
      await supabaseService.borrowBook(bookId, borrowerId, expectedReturnDate);
      await loadData();
      setShowBorrowModal(false);
      setSelectedBook(null);
    } catch (error: any) {
      console.error('Erreur lors de l\'emprunt:', error);
      throw error;
    }
  };

  const handleReturnBook = async (borrowHistoryId: number, notes?: string) => {
    if (borrowHistoryId === undefined) {
      console.error('Invalid argument for returnBook:', { borrowHistoryId });
      return;
    }
    try {
      await supabaseService.returnBook(borrowHistoryId, notes);
      await loadData();
    } catch (error: any) {
      console.error('Erreur lors du retour:', error);
      throw error;
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await supabaseService.deleteBook(bookId);
      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  };

  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const closeBorrowModal = () => {
    setShowBorrowModal(false);
    setSelectedBook(null);
  };

  const refreshData = async () => {
    await loadData();
  };

  // Affichage de l'écran d'authentification
  if (!isAuthenticated) {
    if (currentView === 'institution_setup') {
      return (
        <InstitutionSetup
          institutionCode={institutionCode}
          institution={currentInstitution}
          onComplete={() => {
            setCurrentView('auth');
            alert('Votre établissement a été créé avec succès ! Vous pouvez maintenant vous connecter.');
          }}
        />
      );
    }
    
    return <EnhancedAuthentication onLogin={handleAuthentication} />;
  }

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
            onBorrow={openBorrowModal}
            onDelete={handleDeleteBook}
          />
        );
      case 'borrowed':
        return (
          <BorrowedBooks
            books={borrowedBooks.map(bh => ({
              ...bh.book!,
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
            onRefreshData={refreshData}
            supabaseService={supabaseService}
          />
        );
      case 'history':
        return (
          <BorrowHistory 
            onClose={() => setCurrentView('dashboard')}
            supabaseService={supabaseService}
          />
        );
      case 'settings':
        return (
          <Settings 
            onClose={() => setCurrentView('dashboard')}
            onLogout={handleLogout}
            currentUser={currentUser}
            currentInstitution={currentInstitution}
            supabaseService={supabaseService}
          />
        );
      case 'donation':
        return (
          <Donation onClose={() => setCurrentView('dashboard')} />
        );
      case 'about':
        return (
          <About onClose={() => setCurrentView('dashboard')} />
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
          currentUser={currentUser}
          currentInstitution={currentInstitution}
        />
        <main className="main-content">
          <div className="content-wrapper">
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <span>Chargement...</span>
              </div>
            )}
            {error && (
              <div className="error-banner">
                <span>{error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Enhanced Borrow Modal - utilise le service Supabase */}
      {showBorrowModal && selectedBook && (
        <div className="borrow-modal-overlay">
          <div className="borrow-modal">
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H13V9H19V21Z"/>
                  </svg>
                </div>
                <div className="header-text">
                  <h3>Nouvel emprunt</h3>
                  <p>Sélectionnez un emprunteur et définissez la durée</p>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={closeBorrowModal}
              >
                ×
              </button>
            </div>
            
            <EnhancedBorrowForm
              book={selectedBook}
              borrowers={borrowers}
              onSubmit={handleBorrowBook}
              onCancel={closeBorrowModal}
              onRefreshBorrowers={refreshData}
              supabaseService={supabaseService}
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
          position: relative;
        }
        
        .content-wrapper {
          flex: 1;
          overflow: hidden;
          border-radius: 12px 0 0 0;
          background: #FAF9F6;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #E5DCC2;
          border-top: 4px solid #3E5C49;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-banner {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 500;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #DC2626;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          margin-left: 12px;
        }

        /* Enhanced Borrow Modal */
        .borrow-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.75);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        
        .borrow-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 
            0 32px 64px rgba(62, 92, 73, 0.25),
            0 16px 32px rgba(62, 92, 73, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(32px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .header-text h3 {
          font-size: 22px;
          font-weight: 700;
          color: #F3EED9;
          margin: 0 0 6px 0;
          letter-spacing: -0.3px;
        }
        
        .header-text p {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin: 0;
          line-height: 1.4;
        }
        
        .modal-close {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.2);
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #F3EED9;
          font-size: 24px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
        }
        
        .modal-close:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .modal-close:active {
          transform: scale(0.95);
        }
        
        /* Responsive enhancements */
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
            border-radius: 20px;
            max-height: calc(100vh - 24px);
          }
          
          .modal-header {
            padding: 24px 20px 20px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .header-icon {
            align-self: center;
          }
          
         .header-text {
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .borrow-modal-overlay {
            padding: 8px;
          }
          
          .borrow-modal {
            border-radius: 16px;
          }
          
          .modal-header {
            padding: 20px 16px 16px;
          }
          
          .header-text h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Borrow Form Component avec Supabase
interface EnhancedBorrowFormProps {
  book: Book;
  borrowers: Borrower[];
  onSubmit: (bookId: number, borrowerId: number, expectedReturnDate: string) => Promise<void>;
  onCancel: () => void;
  onRefreshBorrowers: () => Promise<void>;
  supabaseService: SupabaseService;
}

const EnhancedBorrowForm: React.FC<EnhancedBorrowFormProps> = ({ 
  book, 
  borrowers, 
  onSubmit, 
  onCancel, 
  onRefreshBorrowers,
  supabaseService 
}) => {
  const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [borrowDuration, setBorrowDuration] = useState<'1week' | '2weeks' | '1month' | 'custom'>('2weeks');
  const [showAddBorrower, setShowAddBorrower] = useState(false);

  const [newBorrowerData, setNewBorrowerData] = useState<{
    type: 'student' | 'staff';
    firstName: string;
    lastName: string;
    matricule: string;
    classe: string;
    cniNumber: string;
    position: string;
    email: string;
    phone: string;
  }>({
    type: 'student',
    firstName: '',
    lastName: '',
    matricule: '',
    classe: '',
    cniNumber: '',
    position: '',
    email: '',
    phone: ''
  });

  // Calculate default date (in 2 weeks)
  React.useEffect(() => {
    updateDateFromDuration(borrowDuration);
  }, [borrowDuration]);

  const updateDateFromDuration = (duration: string) => {
    const today = new Date();
    let targetDate = new Date(today);
    
    switch (duration) {
      case '1week':
        targetDate.setDate(today.getDate() + 7);
        break;
      case '2weeks':
        targetDate.setDate(today.getDate() + 14);
        break;
      case '1month':
        targetDate.setMonth(today.getMonth() + 1);
        break;
      default:
        return; // For 'custom', don't change
    }
    
    setExpectedReturnDate(targetDate.toISOString().split('T')[0]);
  };

  const handleAddBorrower = async () => {
    try {
      setIsLoading(true);
      const newId = await supabaseService.addBorrower({
        ...newBorrowerData,
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: 1,
        createdAt: new Date().toISOString()
      });
      setSelectedBorrower(newId);
      setShowAddBorrower(false);
      await onRefreshBorrowers(); // Refresh the borrowers list
      setNewBorrowerData({
        type: 'student',
        firstName: '',
        lastName: '',
        matricule: '',
        classe: '',
        cniNumber: '',
        position: '',
        email: '',
        phone: ''
      });
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'ajout de l\'emprunteur');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    // Filter by type
    if (filterType !== 'all' && borrower.type !== filterType) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        borrower.firstName.toLowerCase().includes(query) ||
        borrower.lastName.toLowerCase().includes(query) ||
        borrower.matricule.toLowerCase().includes(query) ||
        (borrower.classe && borrower.classe.toLowerCase().includes(query)) ||
        (borrower.position && borrower.position.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

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
    <div className="enhanced-borrow-form">
      {/* Book Info Enhanced */}
      <div className="book-info-section">
        <div className="book-cover">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} />
          ) : (
            <div className="book-placeholder">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="book-details">
          <h4 className="book-title">"{book.title}"</h4>
          <p className="book-author">par {book.author}</p>
          <div className="book-meta">
            <span className="book-category">{book.category}</span>
            {book.publishedDate && <span className="book-year">{book.publishedDate}</span>}
          </div>
        </div>
      </div>

      {/* Quick Duration Selection */}
      <div className="form-section">
        <label className="form-label">Durée d'emprunt</label>
        <div className="duration-selector">
          {[
            { id: '1week', label: '1 semaine', recommended: false },
            { id: '2weeks', label: '2 semaines', recommended: true },
            { id: '1month', label: '1 mois', recommended: false },
            { id: 'custom', label: 'Personnalisé', recommended: false }
          ].map((duration) => (
            <button
              key={duration.id}
              type="button"
              className={`duration-button ${borrowDuration === duration.id ? 'selected' : ''} ${duration.recommended ? 'recommended' : ''}`}
              onClick={() => setBorrowDuration(duration.id as any)}
            >
              {duration.label}
              {duration.recommended && <span className="recommended-badge">Recommandé</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Return Date */}
      <div className="form-section">
        <label className="form-label">Date de retour prévue *</label>
        <input
          type="date"
          value={expectedReturnDate}
          onChange={(e) => {
            setExpectedReturnDate(e.target.value);
            setBorrowDuration('custom');
          }}
          className="date-input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <small className="form-hint">
          {borrowDuration !== 'custom' && `Durée sélectionnée : ${
            borrowDuration === '1week' ? '7 jours' : 
            borrowDuration === '2weeks' ? '14 jours' : '1 mois'
          }`}
        </small>
      </div>

      {/* Enhanced Borrower Selection */}
      <div className="form-section">
        <div className="section-header">
          <label className="form-label">Emprunteur *</label>
          <button
            type="button"
            className="add-borrower-button"
            onClick={() => setShowAddBorrower(true)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ajouter emprunteur
          </button>
        </div>
        
        {/* Filters */}
        <div className="borrower-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un emprunteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
            </svg>
          </div>
          
          <div className="type-filter">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">Tous</option>
              <option value="student">Étudiants</option>
              <option value="staff">Personnel</option>
            </select>
          </div>
        </div>
        
        {/* Borrowers List */}
        <div className="borrowers-list">
          <div className="list-header">
            <span>Nom</span>
            <span>Type</span>
            <span>Matricule</span>
            <span>Classe/Poste</span>
          </div>
          
          <div className="list-content">
            {filteredBorrowers.length > 0 ? (
              filteredBorrowers.map((borrower) => (
                <div
                  key={borrower.id}
                  className={`borrower-row ${selectedBorrower === borrower.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBorrower(borrower.id!)}
                >
                  <div className="borrower-name">
                    <div className="name-main">{borrower.firstName} {borrower.lastName}</div>
                    <div className="name-sub">{borrower.email}</div>
                  </div>
                  <div className="borrower-type">
                    <span className={`type-badge ${borrower.type}`}>
                      {borrower.type === 'student' ? 'Étudiant' : 'Personnel'}
                    </span>
                  </div>
                  <div className="borrower-matricule">{borrower.matricule}</div>
                  <div className="borrower-extra">
                    {borrower.type === 'student' ? borrower.classe : borrower.position}
                  </div>
                  <div className="selection-indicator">
                    {selectedBorrower === borrower.id && (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-borrowers">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
                </svg>
                <p>Aucun emprunteur trouvé</p>
                <small>{searchQuery ? `pour "${searchQuery}"` : 'Essayez de modifier les filtres'}</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Borrower Summary Enhanced */}
      {selectedBorrowerData && (
        <div className="selected-summary">
          <h4>Récapitulatif de l'emprunt</h4>
          <div className="summary-card">
            <div className="summary-section">
              <div className="summary-icon book-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Livre</div>
                <div className="summary-value">{book.title}</div>
                <div className="summary-sub">par {book.author}</div>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-icon user-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Emprunteur</div>
                <div className="summary-value">
                  {selectedBorrowerData.firstName} {selectedBorrowerData.lastName}
                </div>
                <div className="summary-sub">
                  {selectedBorrowerData.matricule} • {selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel'}
                </div>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-icon date-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Retour prévu</div>
                <div className="summary-value">
                  {new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="summary-sub">
                  Dans {Math.ceil((new Date(expectedReturnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions Enhanced */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!selectedBorrower || !expectedReturnDate || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Traitement...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.58L9 16.17Z"/>
              </svg>
              Confirmer l'emprunt
            </>
          )}
        </button>
      </div>

      {/* Add Borrower Modal */}
      {showAddBorrower && (
        <div className="add-borrower-overlay" onClick={() => setShowAddBorrower(false)}>
          <div className="add-borrower-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-borrower-header">
              <h3>Ajouter un emprunteur</h3>
              <button
                className="modal-close-small"
                onClick={() => setShowAddBorrower(false)}
              >
                ×
              </button>
            </div>
            
            <div className="add-borrower-content">
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-button ${newBorrowerData.type === 'student' ? 'active' : ''}`}
                  onClick={() => setNewBorrowerData(prev => ({ ...prev, type: 'student' }))}
                >
                  🎓 Étudiant
                </button>
                <button
                  type="button"
                  className={`type-button ${newBorrowerData.type === 'staff' ? 'active' : ''}`}
                  onClick={() => setNewBorrowerData(prev => ({ ...prev, type: 'staff' }))}
                >
                  👔 Personnel
                </button>
              </div>

              <div className="form-grid-compact">
                <div className="form-group-compact">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.firstName}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                <div className="form-group-compact">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.lastName}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                <div className="form-group-compact">
                  <label>Matricule *</label>
                  <input
                    type="text"
                    value={newBorrowerData.matricule}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, matricule: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                {newBorrowerData.type === 'student' ? (
                  <div className="form-group-compact">
                    <label>Classe</label>
                    <input
                      type="text"
                      value={newBorrowerData.classe}
                      onChange={(e) => setNewBorrowerData(prev => ({ ...prev, classe: e.target.value }))}
                      className="form-input-compact"
                      placeholder="ex: Terminale C"
                    />
                  </div>
                ) : (
                  <div className="form-group-compact">
                    <label>Poste</label>
                    <input
                      type="text"
                      value={newBorrowerData.position}
                      onChange={(e) => setNewBorrowerData(prev => ({ ...prev, position: e.target.value }))}
                      className="form-input-compact"
                      placeholder="ex: Professeur"
                    />
                  </div>
                )}
                
                <div className="form-group-compact span-full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newBorrowerData.email}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input-compact"
                  />
                </div>
              </div>
            </div>
            
            <div className="add-borrower-actions">
              <button
                type="button"
                className="btn-secondary-small"
                onClick={() => setShowAddBorrower(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-primary-small"
                onClick={handleAddBorrower}
                disabled={!newBorrowerData.firstName || !newBorrowerData.lastName || !newBorrowerData.matricule || isLoading}
              >
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles pour le formulaire d'emprunt */}
      <style>{`
        /* Tous les styles CSS du formulaire d'emprunt ici */
        /* Le CSS est identique à celui du fichier précédent */
        /* ... (insérer ici tous les styles CSS de EnhancedBorrowForm) */
      `}</style>
    </div>
  );
};