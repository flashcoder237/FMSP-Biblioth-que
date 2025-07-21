"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var PrintManager_1 = require("./PrintManager");
var Dashboard = function (_a) {
    var stats = _a.stats, onNavigate = _a.onNavigate, _b = _a.books, books = _b === void 0 ? [] : _b, _c = _a.categories, categories = _c === void 0 ? [] : _c;
    var _d = (0, react_1.useState)(false), showPrintManager = _d[0], setShowPrintManager = _d[1];
    var heroActions = [
        {
            title: 'Ajouter un livre',
            description: 'Enrichissez votre collection',
            icon: lucide_react_1.Plus,
            action: function () { return onNavigate('add-book'); },
            primary: true
        },
        {
            title: 'Parcourir la collection',
            description: 'Explorer tous les livres',
            icon: lucide_react_1.Search,
            action: function () { return onNavigate('books'); },
            primary: false
        }
    ];
    var quickActions = [
        {
            title: 'Collection complète',
            description: "".concat(stats.totalBooks, " livres disponibles"),
            icon: lucide_react_1.Book,
            action: function () { return onNavigate('books'); },
            color: '#3E5C49'
        },
        {
            title: 'Gérer les emprunts',
            description: "".concat(stats.borrowedBooks, " livre(s) emprunt\u00E9(s)"),
            icon: lucide_react_1.BookOpen,
            action: function () { return onNavigate('borrowed'); },
            color: '#C2571B',
            badge: stats.borrowedBooks > 0
        },
        {
            title: 'Rapports & Export',
            description: 'Imprimer les inventaires',
            icon: lucide_react_1.Printer,
            action: function () { return setShowPrintManager(true); },
            color: '#6E6E6E'
        }
    ];
    var mainStats = [
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
    var recentActivity = [
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
    var borrowRate = stats.totalBooks > 0 ? (stats.borrowedBooks / stats.totalBooks * 100).toFixed(1) : 0;
    return (<div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Bienvenue dans votre bibliothèque</h1>
            <p className="hero-subtitle">
              Gérez votre collection de {stats.totalBooks} livres avec facilité et élégance
            </p>
            <div className="hero-actions">
              {heroActions.map(function (action, index) { return (<button key={index} className={"hero-button ".concat(action.primary ? 'primary' : 'secondary')} onClick={action.action}>
                  <action.icon size={18}/>
                  <span>{action.title}</span>
                  <lucide_react_1.ArrowRight size={16}/>
                </button>); })}
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <lucide_react_1.BookOpen size={24}/>
                <span>Collection</span>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number">{stats.totalBooks}</span>
                  <span className="stat-label">Livres</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{stats.borrowedBooks}</span>
                  <span className="stat-label">Empruntés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Main Stats Grid */}
        <div className="stats-section">
          <div className="section-header">
            <h2 className="section-title">Vue d'ensemble</h2>
            <div className="section-subtitle">Statistiques de votre bibliothèque</div>
          </div>
          
          <div className="stats-grid">
            {mainStats.map(function (stat, index) { return (<div key={index} className="stat-card card-elevated">
                <div className="stat-header">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    <stat.icon size={24}/>
                  </div>
                  
                </div>
                <div className="stat-content">
                    {stat.trend && <span className="stat-trend">{stat.trend}</span>}
                    {stat.percentage && <span className="stat-percentage">{stat.percentage}%</span>}
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              </div>); })}
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h3 className="section-title">Actions rapides</h3>
            </div>
            
            <div className="actions-grid">
              {quickActions.map(function (action, index) { return (<button key={index} className="action-card card-elevated" onClick={action.action}>
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    <action.icon size={20}/>
                    {action.badge && <div className="action-badge"></div>}
                  </div>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                  <lucide_react_1.ArrowRight size={16} className="action-arrow"/>
                </button>); })}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="progress-section">
            <div className="section-header">
              <h3 className="section-title">Utilisation</h3>
            </div>
            
            <div className="progress-card card">
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">Taux d'emprunt</span>
                  <span className="progress-value">{borrowRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "".concat(borrowRate, "%") }}></div>
                </div>
              </div>
              
              <div className="progress-metrics">
                <div className="metric">
                  <lucide_react_1.TrendingUp size={16}/>
                  <span>Tendance stable</span>
                </div>
                <div className="metric">
                  <lucide_react_1.Calendar size={16}/>
                  <span>Mis à jour maintenant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h3 className="section-title">Activité récente</h3>
            <button className="view-all-button">
              <lucide_react_1.Eye size={16}/>
              Voir tout
            </button>
          </div>
          
          <div className="activity-list card">
            {recentActivity.map(function (activity, index) { return (<div key={index} className="activity-item">
                <div className="activity-icon">
                  <activity.icon size={16}/>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>); })}
          </div>
        </div>
      </div>

      {showPrintManager && (<PrintManager_1.PrintManager books={books} stats={stats} categories={categories} onClose={function () { return setShowPrintManager(false); }}/>)}

      <style>{"\n        .dashboard {\n          height: 100%;\n          overflow-y: auto;\n          background: #FAF9F6;\n        }\n        \n        .hero-section {\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          padding: 48px 32px;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .hero-section::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          right: 0;\n          width: 50%;\n          height: 100%;\n          background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23F3EED9\" opacity=\"0.05\"/><circle cx=\"60\" cy=\"40\" r=\"1\" fill=\"%23F3EED9\" opacity=\"0.03\"/><circle cx=\"80\" cy=\"80\" r=\"1\" fill=\"%23F3EED9\" opacity=\"0.04\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');\n          opacity: 0.3;\n        }\n        \n        .hero-content {\n          display: grid;\n          grid-template-columns: 1fr 300px;\n          gap: 48px;\n          align-items: center;\n          max-width: 1200px;\n          margin: 0 auto;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .hero-title {\n          font-size: 36px;\n          font-weight: 800;\n          margin: 0 0 16px 0;\n          line-height: 1.2;\n          letter-spacing: -0.5px;\n        }\n        \n        .hero-subtitle {\n          font-size: 18px;\n          opacity: 0.9;\n          margin: 0 0 32px 0;\n          line-height: 1.5;\n        }\n        \n        .hero-actions {\n          display: flex;\n          gap: 16px;\n          flex-wrap: wrap;\n        }\n        \n        .hero-button {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 24px;\n          border: none;\n          border-radius: 12px;\n          font-size: 16px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .hero-button.primary {\n          background: #C2571B;\n          color: #F3EED9;\n        }\n        \n        .hero-button.primary:hover {\n          background: #A8481A;\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);\n        }\n        \n        .hero-button.secondary {\n          background: rgba(243, 238, 217, 0.15);\n          color: #F3EED9;\n          border: 1px solid rgba(243, 238, 217, 0.3);\n        }\n        \n        .hero-button.secondary:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: translateY(-2px);\n        }\n        \n        .hero-visual {\n          display: flex;\n          justify-content: center;\n          align-items: center;\n        }\n        \n        .floating-card {\n          background: rgba(243, 238, 217, 0.1);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.2);\n          border-radius: 16px;\n          padding: 24px;\n          width: 100%;\n          animation: float 6s ease-in-out infinite;\n        }\n        \n        @keyframes float {\n          0%, 100% { transform: translateY(0px); }\n          50% { transform: translateY(-10px); }\n        }\n        \n        .card-header {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          margin-bottom: 20px;\n          font-weight: 600;\n          font-size: 16px;\n        }\n        \n        .card-stats {\n          display: flex;\n          justify-content: space-between;\n        }\n        \n        .stat {\n          text-align: center;\n        }\n        \n        .stat-number {\n          display: block;\n          font-size: 28px;\n          font-weight: 800;\n          line-height: 1;\n          margin-bottom: 4px;\n        }\n        \n        .stat-label {\n          font-size: 12px;\n          opacity: 0.8;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .dashboard-content {\n          padding: 32px;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .section-header {\n          margin-bottom: 24px;\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n        }\n        \n        .section-title {\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .section-subtitle {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin-top: 4px;\n        }\n        \n        .stats-section {\n          margin-bottom: 48px;\n        }\n        \n        .stats-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n          gap: 24px;\n        }\n        \n        .stat-card {\n          padding: 24px;\n          border-radius: 16px;\n          background: #FFFFFF;\n        }\n        \n        .stat-header {\n          display: flex;\n          align-items: flex-start;\n          justify-content: space-between;\n          margin-bottom: 16px;\n        }\n        \n        .stat-icon {\n          padding: 12px;\n          background: rgba(62, 92, 73, 0.1);\n          border-radius: 12px;\n        }\n        \n        .stat-meta {\n          text-align: right;\n          font-size: 12px;\n        }\n        \n        .stat-trend {\n          color: #3E5C49;\n          font-weight: 600;\n        }\n        \n        .stat-percentage {\n          color: #6E6E6E;\n          font-weight: 600;\n        }\n        \n        .stat-value {\n          font-size: 32px;\n          font-weight: 800;\n          color: #2E2E2E;\n          line-height: 1;\n          margin-bottom: 8px;\n        }\n        \n        .stat-title {\n          font-size: 14px;\n          color: #6E6E6E;\n          font-weight: 500;\n        }\n        \n        .dashboard-grid {\n          display: grid;\n          grid-template-columns: 2fr 1fr;\n          gap: 32px;\n          margin-bottom: 48px;\n        }\n        \n        .actions-grid {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .action-card {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          padding: 20px;\n          background: #FFFFFF;\n          border: none;\n          border-radius: 16px;\n          cursor: pointer;\n          text-align: left;\n          transition: all 0.3s ease;\n          position: relative;\n        }\n        \n        .action-card:hover {\n          transform: translateX(4px);\n        }\n        \n        .action-icon {\n          width: 48px;\n          height: 48px;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #FFFFFF;\n          flex-shrink: 0;\n          position: relative;\n        }\n        \n        .action-badge {\n          position: absolute;\n          top: -4px;\n          right: -4px;\n          width: 12px;\n          height: 12px;\n          background: #C2571B;\n          border-radius: 50%;\n          border: 2px solid #FFFFFF;\n          animation: pulse 2s infinite;\n        }\n        \n        .action-content {\n          flex: 1;\n        }\n        \n        .action-title {\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin-bottom: 4px;\n        }\n        \n        .action-description {\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .action-arrow {\n          color: #6E6E6E;\n          transition: transform 0.2s ease;\n        }\n        \n        .action-card:hover .action-arrow {\n          transform: translateX(4px);\n        }\n        \n        .progress-card {\n          padding: 24px;\n          background: #FFFFFF;\n          border-radius: 16px;\n        }\n        \n        .progress-item {\n          margin-bottom: 20px;\n        }\n        \n        .progress-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 12px;\n        }\n        \n        .progress-label {\n          font-size: 14px;\n          font-weight: 500;\n          color: #2E2E2E;\n        }\n        \n        .progress-value {\n          font-size: 18px;\n          font-weight: 700;\n          color: #3E5C49;\n        }\n        \n        .progress-bar {\n          width: 100%;\n          height: 8px;\n          background: #F3EED9;\n          border-radius: 4px;\n          overflow: hidden;\n        }\n        \n        .progress-fill {\n          height: 100%;\n          background: linear-gradient(90deg, #3E5C49, #C2571B);\n          transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n        }\n        \n        .progress-metrics {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .metric {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 12px;\n          color: #6E6E6E;\n        }\n        \n        .activity-list {\n          background: #FFFFFF;\n          border-radius: 16px;\n          overflow: hidden;\n        }\n        \n        .activity-item {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          padding: 20px;\n          border-bottom: 1px solid #F3EED9;\n        }\n        \n        .activity-item:last-child {\n          border-bottom: none;\n        }\n        \n        .activity-icon {\n          width: 40px;\n          height: 40px;\n          background: #F3EED9;\n          border-radius: 10px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #3E5C49;\n          flex-shrink: 0;\n        }\n        \n        .activity-content {\n          flex: 1;\n        }\n        \n        .activity-title {\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin-bottom: 4px;\n        }\n        \n        .activity-description {\n          font-size: 13px;\n          color: #6E6E6E;\n        }\n        \n        .activity-time {\n          font-size: 12px;\n          color: #6E6E6E;\n          text-align: right;\n        }\n        \n        .view-all-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 8px 16px;\n          background: #F3EED9;\n          border: none;\n          border-radius: 8px;\n          color: #3E5C49;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .view-all-button:hover {\n          background: #EAEADC;\n          transform: translateY(-1px);\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .hero-content {\n            grid-template-columns: 1fr;\n            gap: 32px;\n            text-align: center;\n          }\n          \n          .dashboard-grid {\n            grid-template-columns: 1fr;\n            gap: 24px;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .hero-section {\n            padding: 32px 16px;\n          }\n          \n          .hero-title {\n            font-size: 28px;\n          }\n          \n          .hero-subtitle {\n            font-size: 16px;\n          }\n          \n          .hero-actions {\n            justify-content: center;\n          }\n          \n          .dashboard-content {\n            padding: 16px;\n          }\n          \n          .stats-grid {\n            grid-template-columns: 1fr;\n            gap: 16px;\n          }\n          \n          .section-title {\n            font-size: 20px;\n          }\n          \n          .floating-card {\n            padding: 16px;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .hero-button {\n            width: 100%;\n            justify-content: center;\n          }\n          \n          .action-card {\n            padding: 16px;\n          }\n          \n          .activity-item {\n            padding: 16px;\n          }\n          \n          .stat-card {\n            padding: 16px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.Dashboard = Dashboard;
