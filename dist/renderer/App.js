"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/renderer/App.tsx - Version modifiée pour Supabase
const react_1 = __importStar(require("react"));
const TitleBar_1 = require("./components/TitleBar");
const Sidebar_1 = require("./components/Sidebar");
const Dashboard_1 = require("./components/Dashboard");
const BookList_1 = require("./components/BookList");
const BorrowedBooks_1 = require("./components/BorrowedBooks");
const AddBook_1 = require("./components/AddBook");
const Borrowers_1 = require("./components/Borrowers");
const BorrowHistory_1 = require("./components/BorrowHistory");
const Settings_1 = require("./components/Settings");
const Donation_1 = require("./components/Donation");
const About_1 = require("./components/About");
const EnhancedAuthentication_1 = require("./components/EnhancedAuthentication");
const InstitutionSetup_1 = require("./components/InstitutionSetup");
const SupabaseService_1 = require("../services/SupabaseService");
const App = () => {
    const [currentView, setCurrentView] = (0, react_1.useState)('auth');
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    const [currentInstitution, setCurrentInstitution] = (0, react_1.useState)(null);
    const [institutionCode, setInstitutionCode] = (0, react_1.useState)('');
    // Data states
    const [books, setBooks] = (0, react_1.useState)([]);
    const [authors, setAuthors] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [borrowers, setBorrowers] = (0, react_1.useState)([]);
    const [borrowedBooks, setBorrowedBooks] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)({
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
    const [supabaseService] = (0, react_1.useState)(() => new SupabaseService_1.SupabaseService());
    const [showBorrowModal, setShowBorrowModal] = (0, react_1.useState)(false);
    const [selectedBook, setSelectedBook] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
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
            }
            else {
                setCurrentView('auth');
            }
        }
        catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            setCurrentView('auth');
        }
    };
    const loadData = async () => {
        if (!supabaseService.isAuthenticated())
            return;
        try {
            setIsLoading(true);
            const [booksData, authorsData, categoriesData, borrowersData, borrowedBooksData, statsData] = await Promise.all([
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
        }
        catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setError('Erreur lors du chargement des données');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAuthentication = async (credentials) => {
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
                setCurrentUser(result.user);
                setCurrentInstitution(supabaseService.getCurrentInstitution());
                setIsAuthenticated(true);
                setCurrentView('dashboard');
                await loadData();
            }
            else if (credentials.mode === 'register') {
                // Inscription avec code d'établissement
                const result = await supabaseService.signUp(credentials.email, credentials.password, {
                    firstName: credentials.userData.firstName,
                    lastName: credentials.userData.lastName,
                    institutionCode: credentials.institutionCode,
                    role: credentials.userData.role
                });
                if (!result.success) {
                    throw new Error(result.error);
                }
                // Afficher un message de succès et rediriger vers login
                alert('Compte créé avec succès ! Veuillez vérifier votre email et vous connecter.');
            }
            else if (credentials.mode === 'create_institution') {
                // Création d'institution
                const institutionResult = await supabaseService.createInstitution(credentials.userData.institution);
                setInstitutionCode(institutionResult.code);
                // Créer le compte administrateur
                const adminResult = await supabaseService.signUp(credentials.email, credentials.password, {
                    firstName: credentials.userData.admin.firstName,
                    lastName: credentials.userData.admin.lastName,
                    role: 'admin'
                });
                if (!adminResult.success) {
                    throw new Error(adminResult.error);
                }
                setCurrentView('institution_setup');
            }
        }
        catch (error) {
            setError(error.message || 'Erreur d\'authentification');
            throw error;
        }
        finally {
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
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };
    const handleAddBook = async (book) => {
        try {
            await supabaseService.addBook(book);
            await loadData();
            setCurrentView('books');
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du livre:', error);
            throw error;
        }
    };
    const handleBorrowBook = async (bookId, borrowerId, expectedReturnDate) => {
        if (bookId === undefined || borrowerId === undefined || !expectedReturnDate) {
            console.error('Invalid arguments for borrowBook:', { bookId, borrowerId, expectedReturnDate });
            return;
        }
        try {
            await supabaseService.borrowBook(bookId, borrowerId, expectedReturnDate);
            await loadData();
            setShowBorrowModal(false);
            setSelectedBook(null);
        }
        catch (error) {
            console.error('Erreur lors de l\'emprunt:', error);
            throw error;
        }
    };
    const handleReturnBook = async (borrowHistoryId, notes) => {
        if (borrowHistoryId === undefined) {
            console.error('Invalid argument for returnBook:', { borrowHistoryId });
            return;
        }
        try {
            await supabaseService.returnBook(borrowHistoryId, notes);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors du retour:', error);
            throw error;
        }
    };
    const handleDeleteBook = async (bookId) => {
        try {
            await supabaseService.deleteBook(bookId);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw error;
        }
    };
    const openBorrowModal = (book) => {
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
            return ((0, jsx_runtime_1.jsx)(InstitutionSetup_1.InstitutionSetup, { institutionCode: institutionCode, institution: currentInstitution, onComplete: () => {
                    setCurrentView('auth');
                    alert('Votre établissement a été créé avec succès ! Vous pouvez maintenant vous connecter.');
                } }));
        }
        return (0, jsx_runtime_1.jsx)(EnhancedAuthentication_1.EnhancedAuthentication, { onLogin: handleAuthentication });
    }
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
            case 'books':
                return ((0, jsx_runtime_1.jsx)(BookList_1.BookList, { books: books, onBorrow: openBorrowModal, onDelete: handleDeleteBook }));
            case 'borrowed':
                return ((0, jsx_runtime_1.jsx)(BorrowedBooks_1.BorrowedBooks, { books: borrowedBooks.map(bh => ({
                        ...bh.book,
                        isBorrowed: true,
                        borrowerId: bh.borrowerId,
                        borrowDate: bh.borrowDate,
                        borrowerName: `${bh.borrower?.firstName} ${bh.borrower?.lastName}`
                    })), onReturn: (bookId) => {
                        const borrowHistory = borrowedBooks.find(bh => bh.bookId === bookId);
                        if (borrowHistory) {
                            handleReturnBook(borrowHistory.id, undefined);
                        }
                    } }));
            case 'add-book':
                return ((0, jsx_runtime_1.jsx)(AddBook_1.AddBook, { authors: authors, categories: categories, onAddBook: handleAddBook, onCancel: () => setCurrentView('books') }));
            case 'borrowers':
                return ((0, jsx_runtime_1.jsx)(Borrowers_1.Borrowers, { onClose: () => setCurrentView('dashboard'), onRefreshData: refreshData, supabaseService: supabaseService }));
            case 'history':
                return ((0, jsx_runtime_1.jsx)(BorrowHistory_1.BorrowHistory, { onClose: () => setCurrentView('dashboard'), supabaseService: supabaseService }));
            case 'settings':
                return ((0, jsx_runtime_1.jsx)(Settings_1.Settings, { onClose: () => setCurrentView('dashboard'), onLogout: handleLogout, currentUser: currentUser, currentInstitution: currentInstitution, supabaseService: supabaseService }));
            case 'donation':
                return ((0, jsx_runtime_1.jsx)(Donation_1.Donation, { onClose: () => setCurrentView('dashboard') }));
            case 'about':
                return ((0, jsx_runtime_1.jsx)(About_1.About, { onClose: () => setCurrentView('dashboard') }));
            default:
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)(TitleBar_1.TitleBar, {}), (0, jsx_runtime_1.jsxs)("div", { className: "app-container", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, { currentView: currentView, onNavigate: setCurrentView, stats: stats, currentUser: currentUser, currentInstitution: currentInstitution }), (0, jsx_runtime_1.jsx)("main", { className: "main-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "content-wrapper", children: [isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "loading-overlay", children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), (0, jsx_runtime_1.jsx)("span", { children: "Chargement..." })] })), error && ((0, jsx_runtime_1.jsxs)("div", { className: "error-banner", children: [(0, jsx_runtime_1.jsx)("span", { children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setError(''), children: "\u00D7" })] })), renderCurrentView()] }) })] }), showBorrowModal && selectedBook && ((0, jsx_runtime_1.jsx)("div", { className: "borrow-modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "borrow-modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-icon", children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H13V9H19V21Z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Nouvel emprunt" }), (0, jsx_runtime_1.jsx)("p", { children: "S\u00E9lectionnez un emprunteur et d\u00E9finissez la dur\u00E9e" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: closeBorrowModal, children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)(EnhancedBorrowForm, { book: selectedBook, borrowers: borrowers, onSubmit: handleBorrowBook, onCancel: closeBorrowModal, onRefreshBorrowers: refreshData, supabaseService: supabaseService })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.App = App;
const EnhancedBorrowForm = ({ book, borrowers, onSubmit, onCancel, onRefreshBorrowers, supabaseService }) => {
    const [selectedBorrower, setSelectedBorrower] = (0, react_1.useState)(null);
    const [expectedReturnDate, setExpectedReturnDate] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [filterType, setFilterType] = (0, react_1.useState)('all');
    const [borrowDuration, setBorrowDuration] = (0, react_1.useState)('2weeks');
    const [showAddBorrower, setShowAddBorrower] = (0, react_1.useState)(false);
    const [newBorrowerData, setNewBorrowerData] = (0, react_1.useState)({
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
    react_1.default.useEffect(() => {
        updateDateFromDuration(borrowDuration);
    }, [borrowDuration]);
    const updateDateFromDuration = (duration) => {
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
            const newId = await supabaseService.addBorrower(newBorrowerData);
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
        }
        catch (error) {
            alert(error.message || 'Erreur lors de l\'ajout de l\'emprunteur');
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredBorrowers = borrowers.filter(borrower => {
        // Filter by type
        if (filterType !== 'all' && borrower.type !== filterType)
            return false;
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (borrower.firstName.toLowerCase().includes(query) ||
                borrower.lastName.toLowerCase().includes(query) ||
                borrower.matricule.toLowerCase().includes(query) ||
                (borrower.classe && borrower.classe.toLowerCase().includes(query)) ||
                (borrower.position && borrower.position.toLowerCase().includes(query)));
        }
        return true;
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBorrower || !expectedReturnDate)
            return;
        setIsLoading(true);
        try {
            await onSubmit(book.id, selectedBorrower, expectedReturnDate);
        }
        catch (error) {
            console.error('Erreur:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const selectedBorrowerData = borrowers.find(b => b.id === selectedBorrower);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "enhanced-borrow-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-cover", children: book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-placeholder", children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "32", height: "32", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z" }) }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-details", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "book-title", children: ["\"", book.title, "\""] }), (0, jsx_runtime_1.jsxs)("p", { className: "book-author", children: ["par ", book.author] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-meta", children: [(0, jsx_runtime_1.jsx)("span", { className: "book-category", children: book.category }), book.publishedDate && (0, jsx_runtime_1.jsx)("span", { className: "book-year", children: book.publishedDate })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Dur\u00E9e d'emprunt" }), (0, jsx_runtime_1.jsx)("div", { className: "duration-selector", children: [
                            { id: '1week', label: '1 semaine', recommended: false },
                            { id: '2weeks', label: '2 semaines', recommended: true },
                            { id: '1month', label: '1 mois', recommended: false },
                            { id: 'custom', label: 'Personnalisé', recommended: false }
                        ].map((duration) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", className: `duration-button ${borrowDuration === duration.id ? 'selected' : ''} ${duration.recommended ? 'recommended' : ''}`, onClick: () => setBorrowDuration(duration.id), children: [duration.label, duration.recommended && (0, jsx_runtime_1.jsx)("span", { className: "recommended-badge", children: "Recommand\u00E9" })] }, duration.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Date de retour pr\u00E9vue *" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: expectedReturnDate, onChange: (e) => {
                            setExpectedReturnDate(e.target.value);
                            setBorrowDuration('custom');
                        }, className: "date-input", min: new Date().toISOString().split('T')[0], required: true }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: borrowDuration !== 'custom' && `Durée sélectionnée : ${borrowDuration === '1week' ? '7 jours' :
                            borrowDuration === '2weeks' ? '14 jours' : '1 mois'}` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Emprunteur *" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "add-borrower-button", onClick: () => setShowAddBorrower(true), children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" }) }), "Ajouter emprunteur"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrower-filters", children: [(0, jsx_runtime_1.jsxs)("div", { className: "search-container", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher un emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), (0, jsx_runtime_1.jsx)("svg", { className: "search-icon", viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "type-filter", children: (0, jsx_runtime_1.jsxs)("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous" }), (0, jsx_runtime_1.jsx)("option", { value: "student", children: "\u00C9tudiants" }), (0, jsx_runtime_1.jsx)("option", { value: "staff", children: "Personnel" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrowers-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "list-header", children: [(0, jsx_runtime_1.jsx)("span", { children: "Nom" }), (0, jsx_runtime_1.jsx)("span", { children: "Type" }), (0, jsx_runtime_1.jsx)("span", { children: "Matricule" }), (0, jsx_runtime_1.jsx)("span", { children: "Classe/Poste" })] }), (0, jsx_runtime_1.jsx)("div", { className: "list-content", children: filteredBorrowers.length > 0 ? (filteredBorrowers.map((borrower) => ((0, jsx_runtime_1.jsxs)("div", { className: `borrower-row ${selectedBorrower === borrower.id ? 'selected' : ''}`, onClick: () => setSelectedBorrower(borrower.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: "borrower-name", children: [(0, jsx_runtime_1.jsxs)("div", { className: "name-main", children: [borrower.firstName, " ", borrower.lastName] }), (0, jsx_runtime_1.jsx)("div", { className: "name-sub", children: borrower.email })] }), (0, jsx_runtime_1.jsx)("div", { className: "borrower-type", children: (0, jsx_runtime_1.jsx)("span", { className: `type-badge ${borrower.type}`, children: borrower.type === 'student' ? 'Étudiant' : 'Personnel' }) }), (0, jsx_runtime_1.jsx)("div", { className: "borrower-matricule", children: borrower.matricule }), (0, jsx_runtime_1.jsx)("div", { className: "borrower-extra", children: borrower.type === 'student' ? borrower.classe : borrower.position }), (0, jsx_runtime_1.jsx)("div", { className: "selection-indicator", children: selectedBorrower === borrower.id && ((0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" }) })) })] }, borrower.id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "no-borrowers", children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "48", height: "48", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9Z" }) }), (0, jsx_runtime_1.jsx)("p", { children: "Aucun emprunteur trouv\u00E9" }), (0, jsx_runtime_1.jsx)("small", { children: searchQuery ? `pour "${searchQuery}"` : 'Essayez de modifier les filtres' })] })) })] })] }), selectedBorrowerData && ((0, jsx_runtime_1.jsxs)("div", { className: "selected-summary", children: [(0, jsx_runtime_1.jsx)("h4", { children: "R\u00E9capitulatif de l'emprunt" }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "summary-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-icon book-icon", children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-label", children: "Livre" }), (0, jsx_runtime_1.jsx)("div", { className: "summary-value", children: book.title }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-sub", children: ["par ", book.author] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-icon user-icon", children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-label", children: "Emprunteur" }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-value", children: [selectedBorrowerData.firstName, " ", selectedBorrowerData.lastName] }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-sub", children: [selectedBorrowerData.matricule, " \u2022 ", selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-icon date-icon", children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "summary-label", children: "Retour pr\u00E9vu" }), (0, jsx_runtime_1.jsx)("div", { className: "summary-value", children: new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-sub", children: ["Dans ", Math.ceil((new Date(expectedReturnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), " jour(s)"] })] })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "btn-secondary", onClick: onCancel, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" }) }), "Annuler"] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", disabled: !selectedBorrower || !expectedReturnDate || isLoading, onClick: handleSubmit, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Traitement..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.58L9 16.17Z" }) }), "Confirmer l'emprunt"] })) })] }), showAddBorrower && ((0, jsx_runtime_1.jsx)("div", { className: "add-borrower-overlay", onClick: () => setShowAddBorrower(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "add-borrower-modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "add-borrower-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Ajouter un emprunteur" }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close-small", onClick: () => setShowAddBorrower(false), children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "add-borrower-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "type-selector", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: `type-button ${newBorrowerData.type === 'student' ? 'active' : ''}`, onClick: () => setNewBorrowerData(prev => ({ ...prev, type: 'student' })), children: "\uD83C\uDF93 \u00C9tudiant" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: `type-button ${newBorrowerData.type === 'staff' ? 'active' : ''}`, onClick: () => setNewBorrowerData(prev => ({ ...prev, type: 'staff' })), children: "\uD83D\uDC54 Personnel" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid-compact", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact", children: [(0, jsx_runtime_1.jsx)("label", { children: "Pr\u00E9nom *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newBorrowerData.firstName, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, firstName: e.target.value })), className: "form-input-compact", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact", children: [(0, jsx_runtime_1.jsx)("label", { children: "Nom *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newBorrowerData.lastName, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, lastName: e.target.value })), className: "form-input-compact", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact", children: [(0, jsx_runtime_1.jsx)("label", { children: "Matricule *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newBorrowerData.matricule, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, matricule: e.target.value })), className: "form-input-compact", required: true })] }), newBorrowerData.type === 'student' ? ((0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact", children: [(0, jsx_runtime_1.jsx)("label", { children: "Classe" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newBorrowerData.classe, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, classe: e.target.value })), className: "form-input-compact", placeholder: "ex: Terminale C" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact", children: [(0, jsx_runtime_1.jsx)("label", { children: "Poste" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newBorrowerData.position, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, position: e.target.value })), className: "form-input-compact", placeholder: "ex: Professeur" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-group-compact span-full", children: [(0, jsx_runtime_1.jsx)("label", { children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: newBorrowerData.email, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, email: e.target.value })), className: "form-input-compact" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "add-borrower-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-secondary-small", onClick: () => setShowAddBorrower(false), children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-primary-small", onClick: handleAddBorrower, disabled: !newBorrowerData.firstName || !newBorrowerData.lastName || !newBorrowerData.matricule || isLoading, children: isLoading ? 'Ajout...' : 'Ajouter' })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
        /* Tous les styles CSS du formulaire d'emprunt ici */
        /* Le CSS est identique à celui du fichier précédent */
        /* ... (insérer ici tous les styles CSS de EnhancedBorrowForm) */
      ` })] }));
};
