"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const BookList = ({ books, onBorrow, onDelete }) => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [activeDropdown, setActiveDropdown] = (0, react_1.useState)(null);
    const [viewMode, setViewMode] = (0, react_1.useState)('grid');
    const [sortBy, setSortBy] = (0, react_1.useState)('title');
    const [filterStatus, setFilterStatus] = (0, react_1.useState)('all');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
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
        if (filterStatus === 'available')
            return !book.isBorrowed;
        if (filterStatus === 'borrowed')
            return book.isBorrowed;
        // Filtre par catégorie
        if (selectedCategory !== 'all' && book.category !== selectedCategory)
            return false;
        // Filtre par recherche
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query) ||
                (book.description && book.description.toLowerCase().includes(query)));
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "book-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-main", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "page-title", children: "Collection de livres" }), (0, jsx_runtime_1.jsxs)("p", { className: "page-subtitle", children: [stats.filtered, " livre(s) affich\u00E9(s) sur ", stats.total, " au total"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "header-actions", children: [(0, jsx_runtime_1.jsxs)("div", { className: "quick-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "quick-stat available", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: stats.available }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Disponibles" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "quick-stat borrowed", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: stats.borrowed }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Emprunt\u00E9s" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "view-controls", children: [(0, jsx_runtime_1.jsx)("button", { className: `view-button ${viewMode === 'grid' ? 'active' : ''}`, onClick: () => setViewMode('grid'), title: "Vue grille", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { size: 16 }) }), (0, jsx_runtime_1.jsx)("button", { className: `view-button ${viewMode === 'list' ? 'active' : ''}`, onClick: () => setViewMode('list'), title: "Vue liste", children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { size: 16 }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "search-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "search-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "search-input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "search-icon", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher par titre, auteur, cat\u00E9gorie...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && ((0, jsx_runtime_1.jsx)("button", { className: "clear-search", onClick: () => setSearchQuery(''), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }) }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "filters-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les livres" }), (0, jsx_runtime_1.jsx)("option", { value: "available", children: "Disponibles" }), (0, jsx_runtime_1.jsx)("option", { value: "borrowed", children: "Emprunt\u00E9s" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Toutes les cat\u00E9gories" }), categories.map((category) => ((0, jsx_runtime_1.jsx)("option", { value: category, children: category }, category)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SortAsc, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "title", children: "Trier par titre" }), (0, jsx_runtime_1.jsx)("option", { value: "author", children: "Trier par auteur" }), (0, jsx_runtime_1.jsx)("option", { value: "date", children: "Trier par date" }), (0, jsx_runtime_1.jsx)("option", { value: "popularity", children: "Trier par popularit\u00E9" })] })] })] })] }), categories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "category-filters", children: [(0, jsx_runtime_1.jsx)("button", { className: `category-chip ${selectedCategory === 'all' ? 'active' : ''}`, onClick: () => setSelectedCategory('all'), children: "Toutes" }), categories.slice(0, 6).map((category) => ((0, jsx_runtime_1.jsx)("button", { className: `category-chip ${selectedCategory === category ? 'active' : ''}`, onClick: () => setSelectedCategory(category), style: {
                                    '--category-color': getCategoryColor(category)
                                }, children: category }, category))), categories.length > 6 && ((0, jsx_runtime_1.jsxs)("span", { className: "more-categories", children: ["+", categories.length - 6, " autres"] }))] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "books-content", children: sortedBooks.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: `books-container ${viewMode}`, children: sortedBooks.map((book) => ((0, jsx_runtime_1.jsx)("div", { className: "book-item card-elevated", children: viewMode === 'grid' ? (
                        // Enhanced Grid View
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-cover", children: [book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-cover-placeholder", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 32 }) })), (0, jsx_runtime_1.jsx)("div", { className: `status-badge ${book.isBorrowed ? 'borrowed' : 'available'}`, children: book.isBorrowed ? 'Emprunté' : 'Disponible' }), (0, jsx_runtime_1.jsxs)("div", { className: "book-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overlay-actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "overlay-button view", onClick: () => { }, title: "Voir d\u00E9tails", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }) }), !book.isBorrowed && ((0, jsx_runtime_1.jsx)("button", { className: "overlay-button borrow", onClick: () => onBorrow(book), title: "Emprunter", children: (0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }) })), (0, jsx_runtime_1.jsx)("button", { className: "overlay-button menu", onClick: () => setActiveDropdown(activeDropdown === book.id ? null : book.id), title: "Plus d'options", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { size: 16 }) })] }), activeDropdown === book.id && ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown-menu", children: [(0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Voir d\u00E9tails"] }), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { size: 16 }), "Modifier"] }), !book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item primary", onClick: () => onBorrow(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item delete", onClick: () => handleDelete(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), (0, jsx_runtime_1.jsxs)("div", { className: "book-rating", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { size: 14, fill: "currentColor" }), (0, jsx_runtime_1.jsx)("span", { children: "4.2" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-meta", children: [(0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.author })] }), book.publishedDate && ((0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.publishedDate })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-category-section", children: [(0, jsx_runtime_1.jsx)("span", { className: "category-tag", style: { backgroundColor: getCategoryColor(book.category) }, children: book.category }), book.isBorrowed && ((0, jsx_runtime_1.jsxs)("span", { className: "trending-badge", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { size: 12 }), "Populaire"] }))] }), book.description && ((0, jsx_runtime_1.jsx)("p", { className: "book-description", children: book.description })), book.isBorrowed && book.borrowerName && ((0, jsx_runtime_1.jsxs)("div", { className: "borrow-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "borrower-avatar", children: book.borrowerName.charAt(0).toUpperCase() }), (0, jsx_runtime_1.jsxs)("div", { className: "borrow-details", children: [(0, jsx_runtime_1.jsx)("span", { className: "borrow-label", children: "Emprunt\u00E9 par" }), (0, jsx_runtime_1.jsx)("span", { className: "borrower-name", children: book.borrowerName }), book.borrowDate && ((0, jsx_runtime_1.jsxs)("span", { className: "borrow-date", children: ["le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] }))] })] })), !book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "primary-action-btn", onClick: () => onBorrow(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter maintenant"] }))] })] })) : (
                        // Enhanced List View
                        (0, jsx_runtime_1.jsxs)("div", { className: "book-list-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-list-cover", children: [book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-cover-placeholder small", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 20 }) })), (0, jsx_runtime_1.jsx)("div", { className: `list-status-indicator ${book.isBorrowed ? 'borrowed' : 'available'}`, children: book.isBorrowed ? '●' : '●' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-list-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-list-main", children: [(0, jsx_runtime_1.jsxs)("div", { className: "list-title-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), (0, jsx_runtime_1.jsxs)("div", { className: "book-rating small", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { size: 12, fill: "currentColor" }), (0, jsx_runtime_1.jsx)("span", { children: "4.2" })] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "book-author", children: ["par ", book.author] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-tags", children: [(0, jsx_runtime_1.jsx)("span", { className: "category-tag small", style: { backgroundColor: getCategoryColor(book.category) }, children: book.category }), book.publishedDate && ((0, jsx_runtime_1.jsx)("span", { className: "year-tag", children: book.publishedDate })), book.isBorrowed && ((0, jsx_runtime_1.jsx)("span", { className: "status-tag borrowed", children: "Emprunt\u00E9" }))] })] }), book.description && ((0, jsx_runtime_1.jsx)("p", { className: "book-list-description", children: book.description })), book.isBorrowed && book.borrowerName && ((0, jsx_runtime_1.jsxs)("div", { className: "borrow-info compact", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Emprunt\u00E9 par ", (0, jsx_runtime_1.jsx)("strong", { children: book.borrowerName })] }), book.borrowDate && ((0, jsx_runtime_1.jsxs)("span", { children: ["le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] }))] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-list-actions", children: [!book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "action-button borrow", onClick: () => onBorrow(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsx)("button", { className: "action-button menu", onClick: () => setActiveDropdown(activeDropdown === book.id ? null : book.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { size: 16 }) }), activeDropdown === book.id && ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown-menu right", children: [(0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Voir d\u00E9tails"] }), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => { }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { size: 16 }), "Modifier"] }), !book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item primary", onClick: () => onBorrow(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item delete", onClick: () => handleDelete(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] })] }))] })] })) }, book.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "empty-state", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-icon", children: searchQuery || filterStatus !== 'all' || selectedCategory !== 'all' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 64 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 64 })) }), (0, jsx_runtime_1.jsx)("h3", { className: "empty-title", children: searchQuery || filterStatus !== 'all' || selectedCategory !== 'all'
                                ? 'Aucun livre trouvé'
                                : 'Aucun livre dans la collection' }), (0, jsx_runtime_1.jsx)("p", { className: "empty-description", children: searchQuery
                                ? `Aucun résultat pour "${searchQuery}"`
                                : filterStatus !== 'all'
                                    ? `Aucun livre ${filterStatus === 'available' ? 'disponible' : 'emprunté'} pour le moment`
                                    : selectedCategory !== 'all'
                                        ? `Aucun livre dans la catégorie "${selectedCategory}"`
                                        : 'Commencez par ajouter des livres à votre collection' }), (searchQuery || filterStatus !== 'all' || selectedCategory !== 'all') && ((0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => {
                                setSearchQuery('');
                                setFilterStatus('all');
                                setSelectedCategory('all');
                            }, children: "Effacer tous les filtres" }))] })) }), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.BookList = BookList;
