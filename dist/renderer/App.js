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
const react_1 = __importStar(require("react"));
const TitleBar_1 = require("./components/TitleBar");
const Sidebar_1 = require("./components/Sidebar");
const Dashboard_1 = require("./components/Dashboard");
const BookList_1 = require("./components/BookList");
const BorrowedBooks_1 = require("./components/BorrowedBooks");
const AddBook_1 = require("./components/AddBook");
const Borrowers_1 = require("./components/Borrowers");
const BorrowHistory_1 = require("./components/BorrowHistory");
const App = () => {
    const [currentView, setCurrentView] = (0, react_1.useState)('dashboard');
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
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [showBorrowModal, setShowBorrowModal] = (0, react_1.useState)(false);
    const [selectedBook, setSelectedBook] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [booksData, authorsData, categoriesData, borrowersData, borrowedBooksData, statsData] = await Promise.all([
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
        }
        catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };
    const handleAddBook = async (book) => {
        try {
            await window.electronAPI.addBook(book);
            await loadData();
            setCurrentView('books');
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du livre:', error);
            throw error;
        }
    };
    const handleBorrowBook = async (bookId, borrowerId, expectedReturnDate) => {
        try {
            await window.electronAPI.borrowBook(bookId, borrowerId, expectedReturnDate);
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
        try {
            await window.electronAPI.returnBook(borrowHistoryId, notes);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors du retour:', error);
            throw error;
        }
    };
    const handleDeleteBook = async (bookId) => {
        try {
            await window.electronAPI.deleteBook(bookId);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw error;
        }
    };
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            try {
                const searchResults = await window.electronAPI.searchBooks(query);
                setBooks(searchResults);
            }
            catch (error) {
                console.error('Erreur lors de la recherche:', error);
            }
        }
        else {
            await loadData();
        }
    };
    const openBorrowModal = (book) => {
        setSelectedBook(book);
        setShowBorrowModal(true);
    };
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
            case 'books':
                return ((0, jsx_runtime_1.jsx)(BookList_1.BookList, { books: books, onBorrow: (book) => openBorrowModal(book), onDelete: handleDeleteBook, onSearch: handleSearch, searchQuery: searchQuery }));
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
                return ((0, jsx_runtime_1.jsx)(Borrowers_1.Borrowers, { onClose: () => setCurrentView('dashboard') }));
            case 'history':
                return ((0, jsx_runtime_1.jsx)(BorrowHistory_1.BorrowHistory, { onClose: () => setCurrentView('dashboard') }));
            default:
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)(TitleBar_1.TitleBar, {}), (0, jsx_runtime_1.jsxs)("div", { className: "app-container", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, { currentView: currentView, onNavigate: setCurrentView, stats: stats }), (0, jsx_runtime_1.jsx)("main", { className: "main-content", children: (0, jsx_runtime_1.jsx)("div", { className: "content-wrapper", children: renderCurrentView() }) })] }), showBorrowModal && selectedBook && ((0, jsx_runtime_1.jsx)("div", { className: "borrow-modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "borrow-modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Emprunter un livre" }), (0, jsx_runtime_1.jsx)("p", { children: "S\u00E9lectionnez l'emprunteur et d\u00E9finissez la date de retour" })] }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowBorrowModal(false), children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)(BorrowForm, { book: selectedBook, borrowers: borrowers, onSubmit: handleBorrowBook, onCancel: () => setShowBorrowModal(false) })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.App = App;
const BorrowForm = ({ book, borrowers, onSubmit, onCancel }) => {
    const [selectedBorrower, setSelectedBorrower] = (0, react_1.useState)(null);
    const [expectedReturnDate, setExpectedReturnDate] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    // Calculer la date par défaut (dans 2 semaines)
    react_1.default.useEffect(() => {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 14);
        setExpectedReturnDate(defaultDate.toISOString().split('T')[0]);
    }, []);
    const filteredBorrowers = borrowers.filter(borrower => `${borrower.firstName} ${borrower.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrower.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (borrower.classe && borrower.classe.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (borrower.position && borrower.position.toLowerCase().includes(searchQuery.toLowerCase())));
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
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "borrow-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-cover", children: book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-placeholder", children: "\uD83D\uDCDA" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-details", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "book-title", children: ["\"", book.title, "\""] }), (0, jsx_runtime_1.jsxs)("p", { className: "book-author", children: ["par ", book.author] }), (0, jsx_runtime_1.jsx)("span", { className: "book-category", children: book.category })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Emprunteur *" }), (0, jsx_runtime_1.jsx)("div", { className: "borrower-search", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher un emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }) }), (0, jsx_runtime_1.jsx)("div", { className: "borrowers-list", children: filteredBorrowers.length > 0 ? (filteredBorrowers.map((borrower) => ((0, jsx_runtime_1.jsxs)("div", { className: `borrower-option ${selectedBorrower === borrower.id ? 'selected' : ''}`, onClick: () => setSelectedBorrower(borrower.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: "borrower-type-badge", children: [borrower.type === 'student' ? '🎓' : '👔', (0, jsx_runtime_1.jsx)("span", { children: borrower.type === 'student' ? 'Étudiant' : 'Personnel' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrower-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "borrower-name", children: [borrower.firstName, " ", borrower.lastName] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrower-details", children: [borrower.matricule, borrower.type === 'student' && borrower.classe && ` • ${borrower.classe}`, borrower.type === 'staff' && borrower.position && ` • ${borrower.position}`] })] }), (0, jsx_runtime_1.jsx)("div", { className: "selection-indicator", children: selectedBorrower === borrower.id && '✓' })] }, borrower.id)))) : ((0, jsx_runtime_1.jsx)("div", { className: "no-borrowers", children: searchQuery ? 'Aucun emprunteur trouvé' : 'Aucun emprunteur disponible' })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Date de retour pr\u00E9vue *" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: expectedReturnDate, onChange: (e) => setExpectedReturnDate(e.target.value), className: "date-input", min: new Date().toISOString().split('T')[0], required: true }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "Date recommand\u00E9e : 2 semaines \u00E0 partir d'aujourd'hui" })] }), selectedBorrowerData && ((0, jsx_runtime_1.jsxs)("div", { className: "selected-summary", children: [(0, jsx_runtime_1.jsx)("h4", { children: "R\u00E9sum\u00E9 de l'emprunt" }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "summary-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Livre :" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: book.title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Emprunteur :" }), (0, jsx_runtime_1.jsxs)("span", { className: "value", children: [selectedBorrowerData.firstName, " ", selectedBorrowerData.lastName, (0, jsx_runtime_1.jsx)("span", { className: "type-badge", children: selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "summary-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Retour pr\u00E9vu :" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-secondary", onClick: onCancel, disabled: isLoading, children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", disabled: !selectedBorrower || !expectedReturnDate || isLoading, children: isLoading ? 'Emprunt en cours...' : 'Confirmer l\'emprunt' })] }), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
