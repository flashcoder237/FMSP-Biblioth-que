"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const BookList = ({ books, onBorrow, onDelete, onSearch, searchQuery }) => {
    const [selectedBook, setSelectedBook] = (0, react_1.useState)(null);
    const [showBorrowModal, setShowBorrowModal] = (0, react_1.useState)(false);
    const [activeDropdown, setActiveDropdown] = (0, react_1.useState)(null);
    const [viewMode, setViewMode] = (0, react_1.useState)('grid');
    const [sortBy, setSortBy] = (0, react_1.useState)('title');
    const [filterStatus, setFilterStatus] = (0, react_1.useState)('all');
    const [borrowerName, setBorrowerName] = (0, react_1.useState)(''); // Added borrowerName state
    const handleBorrow = () => {
        if (selectedBook && borrowerName.trim()) {
            onBorrow(selectedBook, borrowerName); // Pass borrowerName as second argument
            setShowBorrowModal(false);
            setSelectedBook(null);
            setBorrowerName(''); // Clear borrowerName after borrow
        }
    };
    const openBorrowModal = (book) => {
        setSelectedBook(book);
        setShowBorrowModal(true);
        setActiveDropdown(null);
        setBorrowerName(''); // Clear borrowerName when opening modal
    };
    const closeBorrowModal = () => {
        setShowBorrowModal(false);
        setSelectedBook(null);
        setBorrowerName(''); // Clear borrowerName when closing modal
    };
    const handleDelete = (book) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)) {
            onDelete(book.id);
        }
        setActiveDropdown(null);
    };
    const getCategoryColor = (category) => {
        const colors = {
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
        if (filterStatus === 'available')
            return !book.isBorrowed;
        if (filterStatus === 'borrowed')
            return book.isBorrowed;
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "book-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-main", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "page-title", children: "Collection de livres" }), (0, jsx_runtime_1.jsxs)("p", { className: "page-subtitle", children: [filteredBooks.length, " livre(s) ", filterStatus !== 'all' ? `(${filterStatus === 'available' ? 'disponibles' : 'empruntés'})` : 'au total'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "header-actions", children: (0, jsx_runtime_1.jsxs)("div", { className: "view-controls", children: [(0, jsx_runtime_1.jsx)("button", { className: `view-button ${viewMode === 'grid' ? 'active' : ''}`, onClick: () => setViewMode('grid'), title: "Vue grille", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { size: 16 }) }), (0, jsx_runtime_1.jsx)("button", { className: `view-button ${viewMode === 'list' ? 'active' : ''}`, onClick: () => setViewMode('list'), title: "Vue liste", children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { size: 16 }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "search-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "search-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "search-input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "search-icon", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher par titre, auteur, cat\u00E9gorie...", value: searchQuery, onChange: (e) => onSearch(e.target.value), className: "search-input" }), searchQuery && ((0, jsx_runtime_1.jsx)("button", { className: "clear-search", onClick: () => onSearch(''), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }) }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "filters-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les livres" }), (0, jsx_runtime_1.jsx)("option", { value: "available", children: "Disponibles" }), (0, jsx_runtime_1.jsx)("option", { value: "borrowed", children: "Emprunt\u00E9s" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SortAsc, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "title", children: "Trier par titre" }), (0, jsx_runtime_1.jsx)("option", { value: "author", children: "Trier par auteur" }), (0, jsx_runtime_1.jsx)("option", { value: "date", children: "Trier par date" })] })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "books-content", children: sortedBooks.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: `books-container ${viewMode}`, children: sortedBooks.map((book) => ((0, jsx_runtime_1.jsx)("div", { className: "book-item card-elevated", children: viewMode === 'grid' ? (
                        // Grid View
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-cover", children: [book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-cover-placeholder", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 32 }) })), book.isBorrowed && ((0, jsx_runtime_1.jsx)("div", { className: "borrowed-badge", children: "Emprunt\u00E9" })), (0, jsx_runtime_1.jsx)("div", { className: "book-overlay", children: (0, jsx_runtime_1.jsx)("button", { className: "overlay-button", onClick: () => setActiveDropdown(activeDropdown === book.id ? null : book.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { size: 16 }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), activeDropdown === book.id && ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown-menu", children: [(0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Voir d\u00E9tails"] }), !book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => openBorrowModal(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item delete", onClick: () => handleDelete(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-meta", children: [(0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.author })] }), book.publishedDate && ((0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.publishedDate })] })), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { className: "category-tag", style: { backgroundColor: getCategoryColor(book.category) }, children: book.category })] })] }), book.description && ((0, jsx_runtime_1.jsx)("p", { className: "book-description", children: book.description })), book.isBorrowed && book.borrowerName && ((0, jsx_runtime_1.jsxs)("div", { className: "borrow-info", children: [(0, jsx_runtime_1.jsx)("span", { className: "borrow-label", children: "Emprunt\u00E9 par:" }), (0, jsx_runtime_1.jsx)("span", { className: "borrower-name", children: book.borrowerName }), book.borrowDate && ((0, jsx_runtime_1.jsxs)("span", { className: "borrow-date", children: ["le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] }))] }))] })] })) : (
                        // List View
                        (0, jsx_runtime_1.jsxs)("div", { className: "book-list-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-list-cover", children: book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-cover-placeholder small", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 20 }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-list-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-list-main", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), (0, jsx_runtime_1.jsxs)("p", { className: "book-author", children: ["par ", book.author] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-tags", children: [(0, jsx_runtime_1.jsx)("span", { className: "category-tag small", style: { backgroundColor: getCategoryColor(book.category) }, children: book.category }), book.publishedDate && ((0, jsx_runtime_1.jsx)("span", { className: "year-tag", children: book.publishedDate })), book.isBorrowed && ((0, jsx_runtime_1.jsx)("span", { className: "status-tag borrowed", children: "Emprunt\u00E9" }))] })] }), book.description && ((0, jsx_runtime_1.jsx)("p", { className: "book-list-description", children: book.description })), book.isBorrowed && book.borrowerName && ((0, jsx_runtime_1.jsxs)("div", { className: "borrow-info compact", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Emprunt\u00E9 par ", (0, jsx_runtime_1.jsx)("strong", { children: book.borrowerName })] }), book.borrowDate && ((0, jsx_runtime_1.jsxs)("span", { children: ["le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] }))] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-list-actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => setActiveDropdown(activeDropdown === book.id ? null : book.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { size: 16 }) }), activeDropdown === book.id && ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown-menu right", children: [(0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Voir d\u00E9tails"] }), !book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => openBorrowModal(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item delete", onClick: () => handleDelete(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] })] }))] })] })) }, book.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "empty-state", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 64 }) }), (0, jsx_runtime_1.jsx)("h3", { className: "empty-title", children: "Aucun livre trouv\u00E9" }), (0, jsx_runtime_1.jsx)("p", { className: "empty-description", children: searchQuery
                                ? `Aucun résultat pour "${searchQuery}"`
                                : filterStatus !== 'all'
                                    ? `Aucun livre ${filterStatus === 'available' ? 'disponible' : 'emprunté'} pour le moment`
                                    : 'Commencez par ajouter des livres à votre collection' }), searchQuery && ((0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => onSearch(''), children: "Effacer la recherche" }))] })) }), showBorrowModal && selectedBook && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: closeBorrowModal, children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Emprunter un livre" }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: closeBorrowModal, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-info-cover", children: selectedBook.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: selectedBook.coverUrl, alt: selectedBook.title })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 24 })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-info-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info-title", children: ["\"", selectedBook.title, "\""] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-info-author", children: ["par ", selectedBook.author] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "borrowerName", children: "Nom de l'emprunteur" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "borrowerName", value: borrowerName, onChange: (e) => setBorrowerName(e.target.value), placeholder: "Entrez le nom de l'emprunteur", className: "form-control" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: closeBorrowModal, children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: handleBorrow, disabled: !borrowerName.trim(), children: "Continuer vers l'emprunt" })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
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
        }
      ` })] }));
};
exports.BookList = BookList;
