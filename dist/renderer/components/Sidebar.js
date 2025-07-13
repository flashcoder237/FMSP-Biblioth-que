"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Sidebar = ({ currentView, onNavigate, stats }) => {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Tableau de bord',
            icon: lucide_react_1.Home,
            description: 'Vue d\'ensemble et statistiques',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)'
        },
        {
            id: 'books',
            label: 'Ma Collection',
            icon: lucide_react_1.Book,
            description: 'Parcourir tous les livres',
            count: stats.totalBooks,
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6B57 100%)'
        },
        {
            id: 'borrowed',
            label: 'Emprunts Actifs',
            icon: lucide_react_1.BookOpen,
            description: 'Livres actuellement empruntés',
            count: stats.borrowedBooks,
            badge: stats.borrowedBooks > 0,
            urgent: stats.overdueBooks > 0,
            gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)'
        }
    ];
    const actionItems = [
        {
            id: 'add-book',
            label: 'Nouveau Livre',
            icon: lucide_react_1.Plus,
            description: 'Ajouter à la collection',
            accent: true,
            gradient: 'linear-gradient(135deg, #C2571B 0%, #E65100 100%)',
            highlight: true
        },
        {
            id: 'borrowers',
            label: 'Gestion Emprunteurs',
            icon: lucide_react_1.Users,
            description: 'Gérer les utilisateurs',
            count: stats.totalBorrowers,
            badge: stats.totalBorrowers > 0,
            gradient: 'linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%)'
        }
    ];
    const reportItems = [
        {
            id: 'history',
            label: 'Historique Complet',
            icon: lucide_react_1.History,
            description: 'Tous les emprunts et retours',
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
        }
    ];
    const supportItems = [
        {
            id: 'donation',
            label: 'Soutenir le projet',
            icon: lucide_react_1.Heart,
            description: 'Faire une donation',
            gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            support: true
        },
        {
            id: 'about',
            label: 'À propos',
            icon: lucide_react_1.Info,
            description: 'Développeur & crédits',
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
        }
    ];
    const quickStats = [
        {
            label: 'Collection',
            value: stats.totalBooks,
            icon: lucide_react_1.Book,
            color: '#3E5C49',
            trend: '+2 ce mois'
        },
        {
            label: 'Disponibles',
            value: stats.availableBooks,
            icon: lucide_react_1.BookOpen,
            color: '#3E5C49',
            percentage: stats.totalBooks > 0 ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0
        },
        {
            label: 'Empruntés',
            value: stats.borrowedBooks,
            icon: lucide_react_1.BarChart3,
            color: '#C2571B',
            percentage: stats.totalBooks > 0 ? Math.round((stats.borrowedBooks / stats.totalBooks) * 100) : 0
        },
        {
            label: 'En retard',
            value: stats.overdueBooks,
            icon: lucide_react_1.Clock,
            color: '#DC2626',
            urgent: stats.overdueBooks > 0
        }
    ];
    const userStats = [
        {
            label: 'Étudiants',
            value: stats.totalStudents,
            icon: lucide_react_1.GraduationCap,
            color: '#3E5C49'
        },
        {
            label: 'Personnel',
            value: stats.totalStaff,
            icon: lucide_react_1.Briefcase,
            color: '#C2571B'
        }
    ];
    const getPopularityScore = () => {
        if (stats.totalBooks === 0)
            return 0;
        return Math.round((stats.borrowedBooks / stats.totalBooks) * 100);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `sidebar ${isCollapsed ? 'collapsed' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "sidebar-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "sidebar-toggle", children: (0, jsx_runtime_1.jsx)("button", { className: "toggle-button", onClick: () => setIsCollapsed(!isCollapsed), title: isCollapsed ? 'Développer le menu' : 'Réduire le menu', children: isCollapsed ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { size: 18 }) }) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "sidebar-brand", children: [(0, jsx_runtime_1.jsx)("div", { className: "brand-logo", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "brand-text", children: [(0, jsx_runtime_1.jsx)("h2", { className: "brand-title", children: "Biblioth\u00E8que" }), (0, jsx_runtime_1.jsx)("p", { className: "brand-subtitle", children: "Syst\u00E8me de gestion moderne" })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "sidebar-content", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "sidebar-nav", children: [(0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Principal" }), (0, jsx_runtime_1.jsx)("ul", { className: "nav-list", children: menuItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: (0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.accent ? 'accent' : ''} ${item.urgent ? 'urgent' : ''} ${item.highlight ? 'highlight' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "nav-icon", children: (0, jsx_runtime_1.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "nav-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "nav-label", children: item.label }), (0, jsx_runtime_1.jsx)("span", { className: "nav-description", children: item.description })] }), item.count !== undefined && item.count > 0 && ((0, jsx_runtime_1.jsx)("div", { className: `nav-count ${item.badge ? 'badge' : ''} ${item.urgent ? 'urgent' : ''}`, children: item.count })), item.highlight && ((0, jsx_runtime_1.jsx)("div", { className: "nav-highlight", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }) }))] })), isCollapsed && item.badge && stats.borrowedBooks > 0 && ((0, jsx_runtime_1.jsx)("div", { className: `nav-indicator ${item.urgent ? 'urgent' : ''}` }))] }) }, item.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Actions" }), (0, jsx_runtime_1.jsx)("ul", { className: "nav-list", children: actionItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: (0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.accent ? 'accent' : ''} ${item.highlight ? 'highlight' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "nav-icon", children: (0, jsx_runtime_1.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "nav-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "nav-label", children: item.label }), (0, jsx_runtime_1.jsx)("span", { className: "nav-description", children: item.description })] }), item.count !== undefined && item.count > 0 && ((0, jsx_runtime_1.jsx)("div", { className: `nav-count ${item.badge ? 'badge' : ''}`, children: item.count })), item.highlight && ((0, jsx_runtime_1.jsx)("div", { className: "nav-highlight", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }) }))] }))] }) }, item.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Rapports" }), (0, jsx_runtime_1.jsx)("ul", { className: "nav-list", children: reportItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: (0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "nav-icon", children: (0, jsx_runtime_1.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "nav-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "nav-label", children: item.label }), (0, jsx_runtime_1.jsx)("span", { className: "nav-description", children: item.description })] }))] }) }, item.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0, jsx_runtime_1.jsx)("h3", { className: "nav-title", children: "Communaut\u00E9" }), (0, jsx_runtime_1.jsx)("ul", { className: "nav-list", children: supportItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: "nav-item", children: (0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.support ? 'support' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "nav-icon", children: (0, jsx_runtime_1.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "nav-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "nav-label", children: item.label }), (0, jsx_runtime_1.jsx)("span", { className: "nav-description", children: item.description })] }))] }) }, item.id))) })] })] }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "stats-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stats-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "stats-title", children: "Statistiques de collection" }), (0, jsx_runtime_1.jsxs)("div", { className: "popularity-score", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { size: 14 }), (0, jsx_runtime_1.jsxs)("span", { children: [getPopularityScore(), "% popularit\u00E9"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "stats-grid", children: quickStats.map((stat, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `stat-card ${stat.urgent ? 'urgent' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon", style: { color: stat.color }, children: (0, jsx_runtime_1.jsx)(stat.icon, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: stat.label }), stat.trend && ((0, jsx_runtime_1.jsx)("div", { className: "stat-trend", children: stat.trend })), stat.percentage !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "stat-percentage", children: [stat.percentage, "%"] }))] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stats-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "stats-title", children: "Utilisateurs" }), (0, jsx_runtime_1.jsx)("div", { className: "users-stats", children: userStats.map((stat, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "user-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "user-stat-icon", style: { color: stat.color }, children: (0, jsx_runtime_1.jsx)(stat.icon, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "user-stat-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "user-stat-value", children: stat.value }), (0, jsx_runtime_1.jsx)("div", { className: "user-stat-label", children: stat.label })] })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "total-users", children: [(0, jsx_runtime_1.jsx)("span", { className: "total-label", children: "Total des utilisateurs" }), (0, jsx_runtime_1.jsx)("span", { className: "total-value", children: stats.totalBorrowers })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "activity-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "activity-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "stats-title", children: "Activit\u00E9 r\u00E9cente" }), (0, jsx_runtime_1.jsx)("div", { className: "activity-pulse" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "activity-summary", children: [(0, jsx_runtime_1.jsxs)("div", { className: "activity-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "activity-dot available" }), (0, jsx_runtime_1.jsxs)("span", { children: [stats.availableBooks, " livres pr\u00EAts \u00E0 emprunter"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "activity-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "activity-dot borrowed" }), (0, jsx_runtime_1.jsxs)("span", { children: [stats.borrowedBooks, " emprunts en cours"] })] }), stats.overdueBooks > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "activity-item urgent", children: [(0, jsx_runtime_1.jsx)("div", { className: "activity-dot overdue" }), (0, jsx_runtime_1.jsxs)("span", { children: [stats.overdueBooks, " livre(s) en retard"] })] }))] })] })] }))] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .sidebar {
          width: 300px;
          background: linear-gradient(180deg, #3E5C49 0%, #2E453A 100%);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-right: 1px solid rgba(46, 69, 58, 0.3);
          box-shadow: 4px 0 16px rgba(62, 92, 73, 0.1);
        }
        
        .sidebar.collapsed {
          width: 72px;
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(194, 87, 27, 0.02) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(243, 238, 217, 0.1);
          position: relative;
          z-index: 1;
        }
        
        .sidebar-toggle {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }
        
        .toggle-button {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .toggle-button:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        
        .collapsed .sidebar-brand {
          opacity: 0;
          pointer-events: none;
        }
        
        .brand-logo {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .brand-title {
          font-size: 20px;
          font-weight: 800;
          color: #F3EED9;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        
        .brand-subtitle {
          font-size: 13px;
          color: rgba(243, 238, 217, 0.7);
          margin: 0;
          line-height: 1.3;
        }
        
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px 20px 20px;
          position: relative;
          z-index: 1;
        }
        
        .collapsed .sidebar-content {
          padding: 8px 12px 20px;
        }
        
        .nav-section {
          margin-bottom: 32px;
        }
        
        .nav-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(243, 238, 217, 0.6);
          margin-bottom: 16px;
          margin-top: 0;
          padding: 0 4px;
        }
        
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .nav-item {
          width: 100%;
        }
        
        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: none;
          background: transparent;
          color: #F3EED9;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 14px;
          position: relative;
          text-align: left;
          overflow: hidden;
          border: 1px solid transparent;
        }
        
        .collapsed .nav-button {
          justify-content: center;
          padding: 16px 12px;
        }
        
        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(243, 238, 217, 0.08);
          border-radius: 16px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .nav-button:hover::before {
          transform: scaleX(1);
        }
        
        .nav-button:hover {
          color: #FFFFFF;
          transform: translateX(4px);
          border-color: rgba(243, 238, 217, 0.2);
        }
        
        .collapsed .nav-button:hover {
          transform: scale(1.05);
        }
        
        .nav-button.active {
          background: var(--item-gradient, rgba(243, 238, 217, 0.15));
          color: #FFFFFF;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(62, 92, 73, 0.2);
          border-color: rgba(243, 238, 217, 0.3);
        }
        
        .nav-button.active::before {
          transform: scaleX(1);
          background: rgba(243, 238, 217, 0.1);
        }
        
        .nav-button.highlight {
          background: var(--item-gradient);
          animation: pulse-highlight 3s ease-in-out infinite;
        }
        
        .nav-button.highlight:hover {
          background: linear-gradient(135deg, #A8481A 0%, #D84315 100%);
          transform: translateX(4px) translateY(-2px);
          box-shadow: 0 12px 32px rgba(194, 87, 27, 0.4);
        }
        
        .nav-button.support {
          position: relative;
        }
        
        .nav-button.support::after {
          content: '♥';
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 12px;
          color: #E91E63;
          animation: heartbeat 2s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
          }
          50% {
            box-shadow: 0 8px 24px rgba(194, 87, 27, 0.5);
          }
        }
        
        .nav-button.urgent {
          position: relative;
        }
        
        .nav-button.urgent::after {
          content: '';
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          background: #DC2626;
          border-radius: 50%;
          animation: pulse-urgent 2s infinite;
        }
        
        @keyframes pulse-urgent {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        
        .nav-label {
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 3px;
          font-size: 15px;
        }
        
        .nav-description {
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.2;
        }
        
        .nav-count {
          background: rgba(243, 238, 217, 0.2);
          color: #F3EED9;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .nav-count.badge {
          background: #C2571B;
          color: #FFFFFF;
          animation: pulse-badge 2s infinite;
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .nav-count.urgent {
          background: #DC2626;
          color: #FFFFFF;
          animation: pulse-urgent 1.5s infinite;
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes pulse-badge {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .nav-highlight {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: #F3EED9;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.7;
            transform: rotate(0deg) scale(1);
          }
          50% {
            opacity: 1;
            transform: rotate(180deg) scale(1.1);
          }
        }
        
        .nav-indicator {
          width: 10px;
          height: 10px;
          background: #C2571B;
          border-radius: 50%;
          position: absolute;
          top: 12px;
          right: 12px;
          animation: pulse-badge 2s infinite;
          border: 2px solid rgba(243, 238, 217, 0.3);
        }
        
        .nav-indicator.urgent {
          background: #DC2626;
          animation: pulse-urgent 1.5s infinite;
        }
        
        .stats-section {
          margin-bottom: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(243, 238, 217, 0.1);
          position: relative;
          isolation: isolate;
        }
        
        .stats-section:first-of-type {
          border-top: none;
          padding-top: 0;
        }
        
        .stats-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 16px !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .stats-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          color: rgba(243, 238, 217, 0.6) !important;
          margin: 0 !important;
          font-family: inherit !important;
        }
        
        .popularity-score {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .stat-card {
          background: rgba(243, 238, 217, 0.08) !important;
          border-radius: 12px !important;
          padding: 14px 12px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          transition: all 0.2s ease !important;
          border: 1px solid rgba(243, 238, 217, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(243, 238, 217, 0.05) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .stat-card:hover {
          background: rgba(243, 238, 217, 0.12);
          transform: translateY(-1px);
        }
        
        .stat-card:hover::before {
          opacity: 1;
        }
        
        .stat-card.urgent {
          background: rgba(220, 38, 38, 0.15);
          border-color: rgba(220, 38, 38, 0.3);
          animation: pulse-card 3s ease-in-out infinite;
        }
        
        @keyframes pulse-card {
          0%, 100% {
            background: rgba(220, 38, 38, 0.15);
          }
          50% {
            background: rgba(220, 38, 38, 0.2);
          }
        }
        
        .stat-icon {
          opacity: 0.9;
          flex-shrink: 0;
        }
        
        .stat-content {
          flex: 1;
          min-width: 0;
        }
        
        .stat-value {
          font-size: 18px !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          color: #F3EED9 !important;
          margin-bottom: 2px !important;
          font-family: inherit !important;
        }
        
        .stat-label {
          font-size: 10px !important;
          color: rgba(243, 238, 217, 0.7) !important;
          line-height: 1.2 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
          font-family: inherit !important;
        }
        
        .stat-trend {
          font-size: 9px;
          color: #4CAF50;
          font-weight: 600;
          margin-top: 2px;
        }
        
        .stat-percentage {
          font-size: 9px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
          margin-top: 2px;
        }
        
        .users-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .user-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(243, 238, 217, 0.06);
          border-radius: 10px;
          padding: 12px;
          border: 1px solid rgba(243, 238, 217, 0.1);
        }
        
        .user-stat-icon {
          opacity: 0.9;
        }
        
        .user-stat-content {
          flex: 1;
        }
        
        .user-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #F3EED9;
          line-height: 1.2;
        }
        
        .user-stat-label {
          font-size: 11px;
          color: rgba(243, 238, 217, 0.7);
          font-weight: 500;
        }
        
        .total-users {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .total-label {
          font-size: 12px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
        }
        
        .total-value {
          font-size: 16px;
          font-weight: 800;
          color: #F3EED9;
        }
        
        .activity-section {
          margin-top: auto;
        }
        
        .activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .activity-pulse {
          width: 8px;
          height: 8px;
          background: #4CAF50;
          border-radius: 50%;
          animation: pulse-activity 2s ease-in-out infinite;
        }
        
        @keyframes pulse-activity {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
        
        .activity-summary {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(243, 238, 217, 0.8);
          line-height: 1.3;
        }
        
        .activity-item.urgent {
          color: #FFCDD2;
        }
        
        .activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .activity-dot.available {
          background: #4CAF50;
        }
        
        .activity-dot.borrowed {
          background: #FF9800;
        }
        
        .activity-dot.overdue {
          background: #F44336;
          animation: pulse-urgent 1.5s infinite;
        }
        
        /* Enhanced scrollbar */
        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(243, 238, 217, 0.1);
          border-radius: 2px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(243, 238, 217, 0.3);
          border-radius: 2px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(243, 238, 217, 0.5);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid rgba(46, 69, 58, 0.3);
            overflow-x: auto;
            background: linear-gradient(90deg, #3E5C49 0%, #2E453A 100%);
          }
          
          .sidebar.collapsed {
            width: 100%;
          }
          
          .sidebar-header {
            display: none;
          }
          
          .sidebar-content {
            flex: 1;
            padding: 16px 20px;
            overflow-x: auto;
            display: flex;
            gap: 20px;
            overflow-y: visible;
          }
          
          .nav-section {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          
          .nav-list {
            flex-direction: row;
            gap: 12px;
          }
          
          .nav-button {
            flex-direction: column;
            gap: 6px;
            padding: 12px 16px;
            min-width: 80px;
            white-space: nowrap;
            border-radius: 12px;
          }
          
          .nav-content {
            align-items: center;
            text-align: center;
          }
          
          .nav-label {
            font-size: 12px;
          }
          
          .nav-description {
            display: none;
          }
          
          .nav-count {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 10px;
            padding: 2px 6px;
            min-width: 16px;
          }
          
          .stats-section,
          .activity-section {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .sidebar-content {
            padding: 12px 16px;
            gap: 16px;
          }
          
          .nav-button {
            min-width: 70px;
            padding: 10px 12px;
          }
          
          .nav-label {
            font-size: 11px;
          }
          
          .nav-count {
            font-size: 9px;
            padding: 1px 4px;
          }
        }
        
        /* Performance optimizations */
        .nav-button {
          contain: layout style paint;
        }
        
        .stat-card {
          contain: layout style paint;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .nav-button,
          .stat-card,
          .toggle-button,
          .activity-pulse,
          .nav-highlight {
            transition: none;
            animation: none;
          }
          
          .nav-button:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .nav-button {
            border: 2px solid rgba(243, 238, 217, 0.5);
          }
          
          .nav-button.active {
            border-color: #F3EED9;
          }
          
          .stat-card {
            border-width: 2px;
          }
        }
      ` }), !isCollapsed && stats.overdueBooks > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "emergency-alert", children: [(0, jsx_runtime_1.jsx)("div", { className: "alert-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "alert-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "alert-title", children: "Action requise" }), (0, jsx_runtime_1.jsxs)("div", { className: "alert-message", children: [stats.overdueBooks, " livre(s) en retard"] })] })] })), (0, jsx_runtime_1.jsx)("style", { children: `
        .emergency-alert {
          margin: 16px 20px;
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: #FFFFFF;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: pulse-alert 3s ease-in-out infinite;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
        }
        
        @keyframes pulse-alert {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 8px 24px rgba(220, 38, 38, 0.5);
          }
        }
        
        .alert-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .alert-content {
          flex: 1;
        }
        
        .alert-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
          opacity: 0.9;
        }
        
        .alert-message {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
        }
      ` })] }));
};
exports.Sidebar = Sidebar;
