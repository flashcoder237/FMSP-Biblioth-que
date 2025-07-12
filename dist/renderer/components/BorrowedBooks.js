"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowedBooks = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const BorrowedBooks = ({ books, onReturn }) => {
    const handleReturn = (book) => {
        if (window.confirm(`Confirmer le retour de "${book.title}" ?`)) {
            onReturn(book.id);
        }
    };
    const getDaysOverdue = (borrowDate) => {
        const borrowed = new Date(borrowDate);
        const today = new Date();
        const diffTime = today.getTime() - borrowed.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const getStatusInfo = (borrowDate) => {
        const days = getDaysOverdue(borrowDate);
        if (days <= 14) {
            return { status: 'ok', color: '#22c55e', text: `${days} jour(s)` };
        }
        else if (days <= 30) {
            return { status: 'warning', color: '#f59e0b', text: `${days} jour(s) - Bientôt en retard` };
        }
        else {
            return { status: 'overdue', color: '#ef4444', text: `${days} jour(s) - En retard` };
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "borrowed-books", children: [(0, jsx_runtime_1.jsx)("div", { className: "page-header", children: (0, jsx_runtime_1.jsx)("div", { className: "header-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "header-title-section", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "header-icon", size: 28 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "page-title", children: "Livres emprunt\u00E9s" }), (0, jsx_runtime_1.jsxs)("p", { className: "page-subtitle", children: [books.length, " livre(s) actuellement emprunt\u00E9(s)"] })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "borrowed-content", children: books.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "borrowed-list", children: books.map((book) => {
                        const statusInfo = getStatusInfo(book.borrowDate);
                        return ((0, jsx_runtime_1.jsx)("div", { className: "borrowed-card", children: (0, jsx_runtime_1.jsxs)("div", { className: "card-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-cover-small", children: book.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: book.coverUrl, alt: book.title })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 24 })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-details", children: [(0, jsx_runtime_1.jsx)("h3", { className: "book-title", children: book.title }), (0, jsx_runtime_1.jsx)("p", { className: "book-author", children: book.author }), (0, jsx_runtime_1.jsxs)("div", { className: "borrow-meta", children: [(0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 14 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Emprunt\u00E9 par: ", (0, jsx_runtime_1.jsx)("strong", { children: book.borrowerName })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 14 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Le ", new Date(book.borrowDate).toLocaleDateString('fr-FR')] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item status", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 14 }), (0, jsx_runtime_1.jsx)("span", { className: "status-text", style: { color: statusInfo.color }, children: statusInfo.text })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card-actions", children: [(0, jsx_runtime_1.jsx)("div", { className: "status-indicator", style: { backgroundColor: statusInfo.color } }), (0, jsx_runtime_1.jsxs)("button", { className: "return-button", onClick: () => handleReturn(book), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 18 }), "Marquer comme rendu"] })] })] }) }, book.id));
                    }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "empty-state", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 64 }) }), (0, jsx_runtime_1.jsx)("h3", { className: "empty-title", children: "Aucun livre emprunt\u00E9" }), (0, jsx_runtime_1.jsx)("p", { className: "empty-description", children: "Tous les livres sont actuellement disponibles dans la biblioth\u00E8que." })] })) }), (0, jsx_runtime_1.jsx)("style", { children: `
        .borrowed-books {
          height: 100%;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .page-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
        }
        
        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          opacity: 0.9;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }
        
        .page-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .borrowed-content {
          padding: 32px;
        }
        
        .borrowed-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .borrowed-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
        }
        
        .borrowed-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #e2e8f0;
        }
        
        .card-content {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        
        .book-info {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }
        
        .book-cover-small {
          width: 60px;
          height: 80px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .book-cover-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-details {
          flex: 1;
          min-width: 0;
        }
        
        .book-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        .book-author {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px 0;
        }
        
        .borrow-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }
        
        .meta-item.status .status-text {
          font-weight: 500;
        }
        
        .card-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .return-button:hover {
          background: #16a34a;
          transform: translateY(-1px);
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
        }
        
        .empty-icon {
          color: #22c55e;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        
        .empty-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }
        
        .empty-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
          max-width: 400px;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .borrowed-content {
            padding: 16px;
          }
          
          .page-header {
            padding: 24px 16px;
          }
          
          .card-content {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          
          .book-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
          
          .card-actions {
            justify-content: center;
          }
          
          .borrow-meta {
            align-items: center;
          }
        }
        
        @media (max-width: 480px) {
          .header-title-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }
          
          .book-info {
            gap: 12px;
          }
          
          .return-button {
            width: 100%;
            justify-content: center;
          }
        }
      ` })] }));
};
exports.BorrowedBooks = BorrowedBooks;
