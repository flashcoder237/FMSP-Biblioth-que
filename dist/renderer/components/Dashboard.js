"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const PrintManager_1 = require("./PrintManager");
const Dashboard = ({ stats, onNavigate, books = [], categories = [] }) => {
    const [showPrintManager, setShowPrintManager] = (0, react_1.useState)(false);
    const heroActions = [
        {
            title: 'Ajouter un livre',
            description: 'Enrichissez votre collection',
            icon: lucide_react_1.Plus,
            action: () => onNavigate('add-book'),
            primary: true
        },
        {
            title: 'Parcourir la collection',
            description: 'Explorer tous les livres',
            icon: lucide_react_1.Search,
            action: () => onNavigate('books'),
            primary: false
        }
    ];
    const quickActions = [
        {
            title: 'Collection complète',
            description: `${stats.totalBooks} livres disponibles`,
            icon: lucide_react_1.Book,
            action: () => onNavigate('books'),
            color: '#3E5C49'
        },
        {
            title: 'Gérer les emprunts',
            description: `${stats.borrowedBooks} livre(s) emprunté(s)`,
            icon: lucide_react_1.BookOpen,
            action: () => onNavigate('borrowed'),
            color: '#C2571B',
            badge: stats.borrowedBooks > 0
        },
        {
            title: 'Rapports & Export',
            description: 'Imprimer les inventaires',
            icon: lucide_react_1.Printer,
            action: () => setShowPrintManager(true),
            color: '#6E6E6E'
        }
    ];
    const mainStats = [
        {
            title: 'Total des livres',
            value: stats.totalBooks,
            icon: lucide_react_1.Book,
            color: '#3E5C49',
            trend: '+2 ce mois'
        },
        {
            title: 'Disponibles',
            value: stats.availableBooks,
            icon: lucide_react_1.BookOpen,
            color: '#3E5C49',
            percentage: stats.totalBooks > 0 ? ((stats.availableBooks / stats.totalBooks) * 100).toFixed(0) : 0
        },
        {
            title: 'Empruntés',
            value: stats.borrowedBooks,
            icon: lucide_react_1.Clock,
            color: '#C2571B',
            percentage: stats.totalBooks > 0 ? ((stats.borrowedBooks / stats.totalBooks) * 100).toFixed(0) : 0
        },
        {
            title: 'Auteurs',
            value: stats.totalAuthors,
            icon: lucide_react_1.Users,
            color: '#6E6E6E',
            trend: 'Actifs'
        }
    ];
    const recentActivity = [
        {
            type: 'add',
            title: 'Nouveau livre ajouté',
            description: 'Les Misérables par Victor Hugo',
            time: 'Il y a 2 heures',
            icon: lucide_react_1.Plus
        },
        {
            type: 'borrow',
            title: 'Livre emprunté',
            description: 'Fondation par Isaac Asimov',
            time: 'Il y a 1 jour',
            icon: lucide_react_1.BookOpen
        },
        {
            type: 'return',
            title: 'Livre rendu',
            description: 'L\'Étranger par Albert Camus',
            time: 'Il y a 2 jours',
            icon: lucide_react_1.Activity
        }
    ];
    const borrowRate = stats.totalBooks > 0 ? (stats.borrowedBooks / stats.totalBooks * 100).toFixed(1) : 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-section", children: (0, jsx_runtime_1.jsxs)("div", { className: "hero-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hero-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "hero-title", children: "Bienvenue dans votre biblioth\u00E8que" }), (0, jsx_runtime_1.jsxs)("p", { className: "hero-subtitle", children: ["G\u00E9rez votre collection de ", stats.totalBooks, " livres avec facilit\u00E9 et \u00E9l\u00E9gance"] }), (0, jsx_runtime_1.jsx)("div", { className: "hero-actions", children: heroActions.map((action, index) => ((0, jsx_runtime_1.jsxs)("button", { className: `hero-button ${action.primary ? 'primary' : 'secondary'}`, onClick: action.action, children: [(0, jsx_runtime_1.jsx)(action.icon, { size: 18 }), (0, jsx_runtime_1.jsx)("span", { children: action.title }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16 })] }, index))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "hero-visual", children: (0, jsx_runtime_1.jsxs)("div", { className: "floating-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { size: 24 }), (0, jsx_runtime_1.jsx)("span", { children: "Collection" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: stats.totalBooks }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Livres" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: stats.borrowedBooks }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Emprunt\u00E9s" })] })] })] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stats-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "Vue d'ensemble" }), (0, jsx_runtime_1.jsx)("div", { className: "section-subtitle", children: "Statistiques de votre biblioth\u00E8que" })] }), (0, jsx_runtime_1.jsx)("div", { className: "stats-grid", children: mainStats.map((stat, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "stat-card card-elevated", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon", style: { color: stat.color }, children: (0, jsx_runtime_1.jsx)(stat.icon, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-meta", children: [stat.trend && (0, jsx_runtime_1.jsx)("span", { className: "stat-trend", children: stat.trend }), stat.percentage && (0, jsx_runtime_1.jsxs)("span", { className: "stat-percentage", children: [stat.percentage, "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "stat-title", children: stat.title })] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "quick-actions-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "section-header", children: (0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Actions rapides" }) }), (0, jsx_runtime_1.jsx)("div", { className: "actions-grid", children: quickActions.map((action, index) => ((0, jsx_runtime_1.jsxs)("button", { className: "action-card card-elevated", onClick: action.action, children: [(0, jsx_runtime_1.jsxs)("div", { className: "action-icon", style: { backgroundColor: action.color }, children: [(0, jsx_runtime_1.jsx)(action.icon, { size: 20 }), action.badge && (0, jsx_runtime_1.jsx)("div", { className: "action-badge" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-title", children: action.title }), (0, jsx_runtime_1.jsx)("div", { className: "action-description", children: action.description })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, className: "action-arrow" })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "progress-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "section-header", children: (0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Utilisation" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "progress-card card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "progress-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "progress-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "progress-label", children: "Taux d'emprunt" }), (0, jsx_runtime_1.jsxs)("span", { className: "progress-value", children: [borrowRate, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "progress-bar", children: (0, jsx_runtime_1.jsx)("div", { className: "progress-fill", style: { width: `${borrowRate}%` } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "progress-metrics", children: [(0, jsx_runtime_1.jsxs)("div", { className: "metric", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: "Tendance stable" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "metric", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: "Mis \u00E0 jour maintenant" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "activity-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Activit\u00E9 r\u00E9cente" }), (0, jsx_runtime_1.jsxs)("button", { className: "view-all-button", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Voir tout"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "activity-list card", children: recentActivity.map((activity, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "activity-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "activity-icon", children: (0, jsx_runtime_1.jsx)(activity.icon, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "activity-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "activity-title", children: activity.title }), (0, jsx_runtime_1.jsx)("div", { className: "activity-description", children: activity.description })] }), (0, jsx_runtime_1.jsx)("div", { className: "activity-time", children: activity.time })] }, index))) })] })] }), showPrintManager && ((0, jsx_runtime_1.jsx)(PrintManager_1.PrintManager, { books: books, stats: stats, categories: categories, onClose: () => setShowPrintManager(false) })), (0, jsx_runtime_1.jsx)("style", { children: `
        .dashboard {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 48px 32px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23F3EED9" opacity="0.05"/><circle cx="60" cy="40" r="1" fill="%23F3EED9" opacity="0.03"/><circle cx="80" cy="80" r="1" fill="%23F3EED9" opacity="0.04"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .hero-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .hero-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .hero-button.primary {
          background: #C2571B;
          color: #F3EED9;
        }
        
        .hero-button.primary:hover {
          background: #A8481A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }
        
        .hero-button.secondary {
          background: rgba(243, 238, 217, 0.15);
          color: #F3EED9;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .hero-button.secondary:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateY(-2px);
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .floating-card {
          background: rgba(243, 238, 217, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 16px;
        }
        
        .card-stats {
          display: flex;
          justify-content: space-between;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dashboard-content {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
          letter-spacing: -0.3px;
        }
        
        .section-subtitle {
          font-size: 14px;
          color: #6E6E6E;
          margin-top: 4px;
        }
        
        .stats-section {
          margin-bottom: 48px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        
        .stat-card {
          padding: 24px;
          border-radius: 16px;
          background: #FFFFFF;
        }
        
        .stat-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .stat-icon {
          padding: 12px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
        }
        
        .stat-meta {
          text-align: right;
          font-size: 12px;
        }
        
        .stat-trend {
          color: #3E5C49;
          font-weight: 600;
        }
        
        .stat-percentage {
          color: #6E6E6E;
          font-weight: 600;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          line-height: 1;
          margin-bottom: 8px;
        }
        
        .stat-title {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }
        
        .actions-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .action-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #FFFFFF;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .action-card:hover {
          transform: translateX(4px);
        }
        
        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
          position: relative;
        }
        
        .action-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background: #C2571B;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          animation: pulse 2s infinite;
        }
        
        .action-content {
          flex: 1;
        }
        
        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .action-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .action-arrow {
          color: #6E6E6E;
          transition: transform 0.2s ease;
        }
        
        .action-card:hover .action-arrow {
          transform: translateX(4px);
        }
        
        .progress-card {
          padding: 24px;
          background: #FFFFFF;
          border-radius: 16px;
        }
        
        .progress-item {
          margin-bottom: 20px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .progress-label {
          font-size: 14px;
          font-weight: 500;
          color: #2E2E2E;
        }
        
        .progress-value {
          font-size: 18px;
          font-weight: 700;
          color: #3E5C49;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #F3EED9;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3E5C49, #C2571B);
          transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .progress-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .activity-list {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-bottom: 1px solid #F3EED9;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          width: 40px;
          height: 40px;
          background: #F3EED9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
          flex-shrink: 0;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-title {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .activity-description {
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .activity-time {
          font-size: 12px;
          color: #6E6E6E;
          text-align: right;
        }
        
        .view-all-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F3EED9;
          border: none;
          border-radius: 8px;
          color: #3E5C49;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-all-button:hover {
          background: #EAEADC;
          transform: translateY(-1px);
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .dashboard-content {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .section-title {
            font-size: 20px;
          }
          
          .floating-card {
            padding: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-button {
            width: 100%;
            justify-content: center;
          }
          
          .action-card {
            padding: 16px;
          }
          
          .activity-item {
            padding: 16px;
          }
          
          .stat-card {
            padding: 16px;
          }
        }
      ` })] }));
};
exports.Dashboard = Dashboard;
