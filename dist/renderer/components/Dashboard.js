"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const PrintManager_1 = require("./PrintManager");
const Dashboard = ({ stats, onNavigate, books = [], categories = [] }) => {
    const [showPrintManager, setShowPrintManager] = (0, react_1.useState)(false);
    const quickActions = [
        {
            title: 'Ajouter un livre',
            description: 'Enrichir la collection',
            icon: lucide_react_1.Plus,
            action: () => onNavigate('add-book'),
            color: 'bg-green-500'
        },
        {
            title: 'Voir tous les livres',
            description: 'Parcourir la collection',
            icon: lucide_react_1.Book,
            action: () => onNavigate('books'),
            color: 'bg-blue-500'
        },
        {
            title: 'Livres empruntés',
            description: 'Gérer les emprunts',
            icon: lucide_react_1.BookOpen,
            action: () => onNavigate('borrowed'),
            color: 'bg-orange-500'
        },
        {
            title: 'Imprimer & Exporter',
            description: 'Rapports et inventaires',
            icon: lucide_react_1.Printer,
            action: () => setShowPrintManager(true),
            color: 'bg-purple-500'
        }
    ];
    const mainStats = [
        {
            title: 'Total des livres',
            value: stats.totalBooks,
            icon: lucide_react_1.Book,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Livres disponibles',
            value: stats.availableBooks,
            icon: lucide_react_1.BookOpen,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Livres empruntés',
            value: stats.borrowedBooks,
            icon: lucide_react_1.Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Auteurs',
            value: stats.totalAuthors,
            icon: lucide_react_1.Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];
    const borrowRate = stats.totalBooks > 0 ? (stats.borrowedBooks / stats.totalBooks * 100).toFixed(1) : 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "dashboard-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h1", { className: "dashboard-title", children: "Tableau de bord" }), (0, jsx_runtime_1.jsx)("p", { className: "dashboard-subtitle", children: "Bienvenue dans votre syst\u00E8me de gestion de biblioth\u00E8que" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "header-decoration", children: [(0, jsx_runtime_1.jsx)("div", { className: "decoration-circle" }), (0, jsx_runtime_1.jsx)("div", { className: "decoration-circle small" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stats-section", children: (0, jsx_runtime_1.jsx)("div", { className: "stats-grid", children: mainStats.map((stat, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: `stat-icon ${stat.bgColor}`, children: (0, jsx_runtime_1.jsx)(stat.icon, { className: stat.color, size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "stat-title", children: stat.title })] })] }, index))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overview-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overview-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "overview-title", children: "Aper\u00E7u de la collection" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "text-green-500", size: 20 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "progress-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "progress-label", children: [(0, jsx_runtime_1.jsx)("span", { children: "Taux d'emprunt" }), (0, jsx_runtime_1.jsxs)("span", { className: "progress-value", children: [borrowRate, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "progress-bar", children: (0, jsx_runtime_1.jsx)("div", { className: "progress-fill", style: { width: `${borrowRate}%` } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overview-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "overview-stat-label", children: "Disponibilit\u00E9" }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-stat-value", children: [stats.totalBooks > 0 ? ((stats.availableBooks / stats.totalBooks) * 100).toFixed(1) : 0, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "overview-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "overview-stat-label", children: "Cat\u00E9gories" }), (0, jsx_runtime_1.jsx)("div", { className: "overview-stat-value", children: stats.totalCategories })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "actions-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "actions-title", children: "Actions rapides" }), (0, jsx_runtime_1.jsx)("div", { className: "actions-grid", children: quickActions.map((action, index) => ((0, jsx_runtime_1.jsxs)("button", { className: "action-button", onClick: action.action, children: [(0, jsx_runtime_1.jsx)("div", { className: `action-icon ${action.color}`, children: (0, jsx_runtime_1.jsx)(action.icon, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-title", children: action.title }), (0, jsx_runtime_1.jsx)("div", { className: "action-description", children: action.description })] })] }, index))) })] })] })] }), showPrintManager && ((0, jsx_runtime_1.jsx)(PrintManager_1.PrintManager, { books: books, stats: stats, categories: categories, onClose: () => setShowPrintManager(false) })), (0, jsx_runtime_1.jsx)("style", { children: `
        .dashboard {
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .dashboard-header {
          position: relative;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 40px 32px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .dashboard-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }
        
        .dashboard-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .header-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          pointer-events: none;
        }
        
        .decoration-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          width: 120px;
          height: 120px;
          top: -20px;
          right: -20px;
        }
        
        .decoration-circle.small {
          width: 60px;
          height: 60px;
          top: 60px;
          right: 40px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .dashboard-content {
          padding: 0 32px 32px;
        }
        
        .stats-section {
          margin-bottom: 32px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }
        
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .stat-title {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .overview-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .overview-card, .actions-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .overview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .overview-title, .actions-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .actions-title {
          margin-bottom: 20px;
        }
        
        .progress-item {
          margin-bottom: 24px;
        }
        
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        
        .progress-value {
          color: #22c55e;
          font-weight: 600;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          transition: width 0.3s ease;
        }
        
        .overview-stats {
          display: flex;
          gap: 32px;
        }
        
        .overview-stat {
          flex: 1;
        }
        
        .overview-stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .overview-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .actions-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .action-button:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
        }
        
        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .action-content {
          flex: 1;
          text-align: left;
        }
        
        .action-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
        }
        
        .action-description {
          font-size: 12px;
          color: #6b7280;
        }
        
        .bg-green-500 { background-color: #22c55e; }
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-orange-500 { background-color: #f97316; }
        .bg-purple-500 { background-color: #8b5cf6; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-orange-50 { background-color: #fff7ed; }
        .bg-purple-50 { background-color: #faf5ff; }
        .text-blue-600 { color: #2563eb; }
        .text-green-600 { color: #16a34a; }
        .text-orange-600 { color: #ea580c; }
        .text-purple-600 { color: #9333ea; }
        .text-green-500 { color: #22c55e; }
        
        @media (max-width: 768px) {
          .overview-section {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-content {
            padding: 0 16px 16px;
          }
          
          .dashboard-header {
            padding: 24px 16px;
          }
        }
      ` })] }));
};
exports.Dashboard = Dashboard;
