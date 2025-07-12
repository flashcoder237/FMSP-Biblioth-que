"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const Sidebar = ({ currentView, onNavigate, stats }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: lucide_react_1.Home },
        { id: 'books', label: 'Tous les livres', icon: lucide_react_1.Book },
        { id: 'borrowed', label: 'Livres empruntés', icon: lucide_react_1.BookOpen },
        { id: 'add-book', label: 'Ajouter un livre', icon: lucide_react_1.Plus },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "sidebar", children: [(0, jsx_runtime_1.jsx)("div", { className: "sidebar-content", children: (0, jsx_runtime_1.jsxs)("nav", { className: "sidebar-nav", children: [(0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Navigation" }), (0, jsx_runtime_1.jsx)("ul", { className: "nav-list", children: menuItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: (0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''}`, onClick: () => onNavigate(item.id), children: [(0, jsx_runtime_1.jsx)(item.icon, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: item.label }), item.id === 'borrowed' && stats.borrowedBooks > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "badge", children: stats.borrowedBooks }))] }) }, item.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Statistiques" }), (0, jsx_runtime_1.jsxs)("div", { className: "stats-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stats.totalBooks }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Livres" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon available", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stats.availableBooks }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Disponibles" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon borrowed", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stats.borrowedBooks }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Emprunt\u00E9s" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stats.totalAuthors }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Auteurs" })] })] })] })] })] }) }), (0, jsx_runtime_1.jsx)("style", { children: `
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #16a34a 0%, #15803d 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        
        .sidebar-content {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }
        
        .nav-section {
          margin-bottom: 32px;
        }
        
        .nav-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.7;
          margin-bottom: 16px;
          margin-top: 0;
        }
        
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          margin-bottom: 4px;
        }
        
        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          position: relative;
        }
        
        .nav-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }
        
        .nav-button.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .badge {
          background: #ef4444;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: auto;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }
        
        .stat-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .stat-icon.available {
          background: rgba(34, 197, 94, 0.3);
        }
        
        .stat-icon.borrowed {
          background: rgba(249, 115, 22, 0.3);
        }
        
        .stat-content {
          flex: 1;
          min-width: 0;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.2;
        }
      ` })] }));
};
exports.Sidebar = Sidebar;
