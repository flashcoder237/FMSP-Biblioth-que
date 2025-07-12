"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const BookList = ({ books, onBorrow, onDelete, onSearch, searchQuery }) => {
    const [selectedBook, setSelectedBook] = (0, react_1.useState)(null);
    const [showBorrowModal, setShowBorrowModal] = (0, react_1.useState)(false);
    const [borrowerName, setBorrowerName] = (0, react_1.useState)('');
    const [activeDropdown, setActiveDropdown] = (0, react_1.useState)(null);
    const handleBorrow = () => {
        if (selectedBook && borrowerName.trim()) {
            onBorrow(selectedBook.id, borrowerName);
            setShowBorrowModal(false);
            setBorrowerName('');
            setSelectedBook(null);
        }
    };
    const openBorrowModal = (book) => {
        setSelectedBook(book);
        setShowBorrowModal(true);
        setActiveDropdown(null);
    };
    const handleDelete = (book) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${book.title}" ?`)) {
            onDelete(book.id);
        }
        setActiveDropdown(null);
    };
    const getCategoryColor = (category) => {
        const colors = {
            'Fiction': '#22c55e',
            'Science-Fiction': '#3b82f6',
            'Histoire': '#f59e0b',
            'Biographie': '#ef4444',
            'Sciences': '#8b5cf6',
            'Philosophie': '#06b6d4',
        };
        return colors[category] || '#6b7280';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "book-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-list-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h1", { className: "page-title", children: "Collection de livres" }), (0, jsx_runtime_1.jsxs)("p", { className: "page-subtitle", children: [books.length, " livre(s) dans la collection"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "search-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "search-input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "search-icon", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher par titre, auteur, cat\u00E9gorie...", value: searchQuery, onChange: (e) => onSearch(e.target.value), className: "search-input" }), searchQuery && ((0, jsx_runtime_1.jsx)("button", { className: "clear-search", onClick: () => onSearch(''), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }) }))] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "books-grid", children: books.map((book) => ((0, jsx_runtime_1.jsxs)("div", { className: "book-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-cover", children: [book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "book-cover-placeholder", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 32 }) })), book.isBorrowed && ((0, jsx_runtime_1.jsx)("div", { className: "borrowed-badge", children: "Emprunt\u00E9" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), (0, jsx_runtime_1.jsxs)("div", { className: "book-actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => setActiveDropdown(activeDropdown === book.id ? null : book.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { size: 16 }) }), activeDropdown === book.id && ((0, jsx_runtime_1.jsxs)("div", { className: "dropdown-menu", children: [!book.isBorrowed && ((0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item", onClick: () => openBorrowModal(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Emprunter"] })), (0, jsx_runtime_1.jsxs)("button", { className: "dropdown-item delete", onClick: () => handleDelete(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-meta", children: [(0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.author })] }), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: book.publishedDate })] }), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { className: "category-tag", style: { backgroundColor: getCategoryColor(book.category) }, children: book.category })] })] }), book.description && ((0, jsx_runtime_1.jsx)("p", { className: "book-description", children: book.description })), book.isBorrowed && book.borrowerName && ((0, jsx_runtime_1.jsxs)("div", { className: "borrow-info", children: [(0, jsx_runtime_1.jsx)("span", { className: "borrow-label", children: "Emprunt\u00E9 par:" }), (0, jsx_runtime_1.jsx)("span", { className: "borrower-name", children: book.borrowerName }), book.borrowDate && ((0, jsx_runtime_1.jsxs)("span", { className: "borrow-date", children: ["le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] }))] }))] })] }, book.id))) }), books.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "empty-state", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 48 }), (0, jsx_runtime_1.jsx)("h3", { children: "Aucun livre trouv\u00E9" }), (0, jsx_runtime_1.jsx)("p", { children: searchQuery
                            ? `Aucun résultat pour "${searchQuery}"`
                            : 'Commencez par ajouter des livres à votre collection' })] })), showBorrowModal && selectedBook && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowBorrowModal(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Emprunter un livre" }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowBorrowModal(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info-title", children: ["\"", selectedBook.title, "\""] }), (0, jsx_runtime_1.jsxs)("div", { className: "book-info-author", children: ["par ", selectedBook.author] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "borrower-name", children: "Nom de l'emprunteur" }), (0, jsx_runtime_1.jsx)("input", { id: "borrower-name", type: "text", value: borrowerName, onChange: (e) => setBorrowerName(e.target.value), placeholder: "Entrez le nom de la personne", className: "form-input", autoFocus: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowBorrowModal(false), children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: handleBorrow, disabled: !borrowerName.trim(), children: "Confirmer l'emprunt" })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.BookList = BookList;
