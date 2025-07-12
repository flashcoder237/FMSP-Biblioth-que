"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TitleBar_1 = require("./components/TitleBar");
const Sidebar_1 = require("./components/Sidebar");
const Dashboard_1 = require("./components/Dashboard");
const BookList_1 = require("./components/BookList");
const BorrowedBooks_1 = require("./components/BorrowedBooks");
const AddBook_1 = require("./components/AddBook");
const App = () => {
    const [currentView, setCurrentView] = (0, react_1.useState)('dashboard');
    const [books, setBooks] = (0, react_1.useState)([]);
    const [authors, setAuthors] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)({
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
        totalAuthors: 0,
        totalCategories: 0
    });
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [booksData, authorsData, categoriesData, statsData] = await Promise.all([
                window.electronAPI.getBooks(),
                window.electronAPI.getAuthors(),
                window.electronAPI.getCategories(),
                window.electronAPI.getStats()
            ]);
            setBooks(booksData);
            setAuthors(authorsData);
            setCategories(categoriesData);
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
        }
    };
    const handleBorrowBook = async (bookId, borrowerName) => {
        try {
            await window.electronAPI.borrowBook(bookId, borrowerName);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors de l\'emprunt:', error);
        }
    };
    const handleReturnBook = async (bookId) => {
        try {
            await window.electronAPI.returnBook(bookId);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors du retour:', error);
        }
    };
    const handleDeleteBook = async (bookId) => {
        try {
            await window.electronAPI.deleteBook(bookId);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
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
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
            case 'books':
                return ((0, jsx_runtime_1.jsx)(BookList_1.BookList, { books: books, onBorrow: handleBorrowBook, onDelete: handleDeleteBook, onSearch: handleSearch, searchQuery: searchQuery }));
            case 'borrowed':
                return ((0, jsx_runtime_1.jsx)(BorrowedBooks_1.BorrowedBooks, { books: books.filter(book => book.isBorrowed), onReturn: handleReturnBook }));
            case 'add-book':
                return ((0, jsx_runtime_1.jsx)(AddBook_1.AddBook, { authors: authors, categories: categories, onAddBook: handleAddBook, onCancel: () => setCurrentView('books') }));
            default:
                return ((0, jsx_runtime_1.jsx)(Dashboard_1.Dashboard, { stats: stats, onNavigate: setCurrentView, books: books, categories: categories }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)(TitleBar_1.TitleBar, {}), (0, jsx_runtime_1.jsxs)("div", { className: "app-content", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.Sidebar, { currentView: currentView, onNavigate: setCurrentView, stats: stats }), (0, jsx_runtime_1.jsx)("main", { className: "main-content", children: renderCurrentView() })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        
        .app-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .main-content {
          flex: 1;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px 0 0 0;
          margin-left: 1px;
        }
      ` })] }));
};
exports.App = App;
