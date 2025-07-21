"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Sidebar = function (_a) {
    var currentView = _a.currentView, onNavigate = _a.onNavigate, stats = _a.stats;
    var _b = (0, react_1.useState)(false), isCollapsed = _b[0], setIsCollapsed = _b[1];
    var menuItems = [
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
    var actionItems = [
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
    var reportItems = [
        {
            id: 'history',
            label: 'Historique Complet',
            icon: lucide_react_1.History,
            description: 'Tous les emprunts et retours',
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
        }
    ];
    var supportItems = [
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
    var quickStats = [
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
    var userStats = [
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
    var getPopularityScore = function () {
        if (stats.totalBooks === 0)
            return 0;
        return Math.round((stats.borrowedBooks / stats.totalBooks) * 100);
    };
    return (<div className={"sidebar ".concat(isCollapsed ? 'collapsed' : '')}>
      {/* Enhanced Header */}
      <div className="sidebar-header">
        <div className="sidebar-toggle">
          <button className="toggle-button" onClick={function () { return setIsCollapsed(!isCollapsed); }} title={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}>
            {isCollapsed ? <lucide_react_1.ChevronRight size={18}/> : <lucide_react_1.ChevronLeft size={18}/>}
          </button>
        </div>
        
        {!isCollapsed && (<div className="sidebar-brand">
            <div className="brand-logo">
              <lucide_react_1.Book size={24}/>
            </div>
            <div className="brand-text">
              <h2 className="brand-title">Bibliothèque</h2>
              <p className="brand-subtitle">Système de gestion moderne</p>
            </div>
          </div>)}
      </div>

      <div className="sidebar-content">
        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Principal</h3>}
            <ul className="nav-list">
              {menuItems.map(function (item) { return (<li key={item.id} className="nav-item">
                  <button className={"nav-button ".concat(currentView === item.id ? 'active' : '', " ").concat(item.accent ? 'accent' : '', " ").concat(item.urgent ? 'urgent' : '', " ").concat(item.highlight ? 'highlight' : '')} onClick={function () { return onNavigate(item.id); }} title={isCollapsed ? item.label : ''} style={{
                '--item-gradient': item.gradient
            }}>
                    <div className="nav-icon">
                      <item.icon size={20}/>
                    </div>
                    
                    {!isCollapsed && (<>
                        <div className="nav-content">
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                        
                        {item.count !== undefined && item.count > 0 && (<div className={"nav-count ".concat(item.badge ? 'badge' : '', " ").concat(item.urgent ? 'urgent' : '')}>
                            {item.count}
                          </div>)}
                        
                        {item.highlight && (<div className="nav-highlight">
                            <lucide_react_1.Zap size={14}/>
                          </div>)}
                      </>)}
                    
                    {isCollapsed && item.badge && stats.borrowedBooks > 0 && (<div className={"nav-indicator ".concat(item.urgent ? 'urgent' : '')}></div>)}
                  </button>
                </li>); })}
            </ul>
          </div>

          {/* Actions Section */}
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Actions</h3>}
            <ul className="nav-list">
              {actionItems.map(function (item) { return (<li key={item.id} className="nav-item">
                  <button className={"nav-button ".concat(currentView === item.id ? 'active' : '', " ").concat(item.accent ? 'accent' : '', " ").concat(item.highlight ? 'highlight' : '')} onClick={function () { return onNavigate(item.id); }} title={isCollapsed ? item.label : ''} style={{
                '--item-gradient': item.gradient
            }}>
                    <div className="nav-icon">
                      <item.icon size={20}/>
                    </div>
                    
                    {!isCollapsed && (<>
                        <div className="nav-content">
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                        
                        {item.count !== undefined && item.count > 0 && (<div className={"nav-count ".concat(item.badge ? 'badge' : '')}>
                            {item.count}
                          </div>)}
                        
                        {item.highlight && (<div className="nav-highlight">
                            <lucide_react_1.Zap size={14}/>
                          </div>)}
                      </>)}
                  </button>
                </li>); })}
            </ul>
          </div>

          {/* Reports Section */}
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Rapports</h3>}
            <ul className="nav-list">
              {reportItems.map(function (item) { return (<li key={item.id} className="nav-item">
                  <button className={"nav-button ".concat(currentView === item.id ? 'active' : '')} onClick={function () { return onNavigate(item.id); }} title={isCollapsed ? item.label : ''} style={{
                '--item-gradient': item.gradient
            }}>
                    <div className="nav-icon">
                      <item.icon size={20}/>
                    </div>
                    
                    {!isCollapsed && (<div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>)}
                  </button>
                </li>); })}
            </ul>
          </div>

          {/* Support Section */}
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Communauté</h3>}
            <ul className="nav-list">
              {supportItems.map(function (item) { return (<li key={item.id} className="nav-item">
                  <button className={"nav-button ".concat(currentView === item.id ? 'active' : '', " ").concat(item.support ? 'support' : '')} onClick={function () { return onNavigate(item.id); }} title={isCollapsed ? item.label : ''} style={{
                '--item-gradient': item.gradient
            }}>
                    <div className="nav-icon">
                      <item.icon size={20}/>
                    </div>
                    
                    {!isCollapsed && (<div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>)}
                  </button>
                </li>); })}
            </ul>
          </div>
        </nav>
        
        {!isCollapsed && (<>
            {/* Collection Statistics */}
            <div className="stats-section">
              <div className="stats-header">
                <h3 className="stats-title">Statistiques de collection</h3>
                <div className="popularity-score">
                  <lucide_react_1.TrendingUp size={14}/>
                  <span>{getPopularityScore()}% popularité</span>
                </div>
              </div>
              <div className="stats-grid">
                {quickStats.map(function (stat, index) { return (<div key={index} className={"stat-card ".concat(stat.urgent ? 'urgent' : '')}>
                    <div className="stat-icon" style={{ color: stat.color }}>
                      <stat.icon size={16}/>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                      {stat.trend && (<div className="stat-trend">{stat.trend}</div>)}
                      {stat.percentage !== undefined && (<div className="stat-percentage">{stat.percentage}%</div>)}
                    </div>
                  </div>); })}
              </div>
            </div>

            {/* Users Overview */}
            <div className="stats-section">
              <h3 className="stats-title">Utilisateurs</h3>
              <div className="users-stats">
                {userStats.map(function (stat, index) { return (<div key={index} className="user-stat">
                    <div className="user-stat-icon" style={{ color: stat.color }}>
                      <stat.icon size={18}/>
                    </div>
                    <div className="user-stat-content">
                      <div className="user-stat-value">{stat.value}</div>
                      <div className="user-stat-label">{stat.label}</div>
                    </div>
                  </div>); })}
              </div>
              
              <div className="total-users">
                <span className="total-label">Total des utilisateurs</span>
                <span className="total-value">{stats.totalBorrowers}</span>
              </div>
            </div>

            {/* Activity Indicator */}
            <div className="activity-section">
              <div className="activity-header">
                <h3 className="stats-title">Activité récente</h3>
                <div className="activity-pulse"></div>
              </div>
              <div className="activity-summary">
                <div className="activity-item">
                  <div className="activity-dot available"></div>
                  <span>{stats.availableBooks} livres prêts à emprunter</span>
                </div>
                <div className="activity-item">
                  <div className="activity-dot borrowed"></div>
                  <span>{stats.borrowedBooks} emprunts en cours</span>
                </div>
                {stats.overdueBooks > 0 && (<div className="activity-item urgent">
                    <div className="activity-dot overdue"></div>
                    <span>{stats.overdueBooks} livre(s) en retard</span>
                  </div>)}
              </div>
            </div>
          </>)}
      </div>
      
      <style>{"\n        .sidebar {\n          width: 300px;\n          background: linear-gradient(180deg, #3E5C49 0%, #2E453A 100%);\n          display: flex;\n          flex-direction: column;\n          position: relative;\n          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          border-right: 1px solid rgba(46, 69, 58, 0.3);\n          box-shadow: 4px 0 16px rgba(62, 92, 73, 0.1);\n        }\n        \n        .sidebar.collapsed {\n          width: 72px;\n        }\n        \n        .sidebar::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: \n            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.03) 0%, transparent 50%),\n            radial-gradient(circle at 80% 20%, rgba(194, 87, 27, 0.02) 0%, transparent 50%);\n          pointer-events: none;\n        }\n        \n        .sidebar-header {\n          padding: 24px 20px;\n          border-bottom: 1px solid rgba(243, 238, 217, 0.1);\n          position: relative;\n          z-index: 1;\n        }\n        \n        .sidebar-toggle {\n          display: flex;\n          justify-content: flex-end;\n          margin-bottom: 16px;\n        }\n        \n        .toggle-button {\n          width: 40px;\n          height: 40px;\n          border: none;\n          background: rgba(243, 238, 217, 0.1);\n          color: #F3EED9;\n          border-radius: 12px;\n          cursor: pointer;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          transition: all 0.2s ease;\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.2);\n        }\n        \n        .toggle-button:hover {\n          background: rgba(243, 238, 217, 0.2);\n          transform: scale(1.05);\n        }\n        \n        .sidebar-brand {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          opacity: 1;\n          transition: opacity 0.2s ease;\n        }\n        \n        .collapsed .sidebar-brand {\n          opacity: 0;\n          pointer-events: none;\n        }\n        \n        .brand-logo {\n          width: 48px;\n          height: 48px;\n          background: rgba(243, 238, 217, 0.15);\n          border-radius: 14px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n          border: 1px solid rgba(243, 238, 217, 0.2);\n        }\n        \n        .brand-title {\n          font-size: 20px;\n          font-weight: 800;\n          color: #F3EED9;\n          margin: 0 0 4px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .brand-subtitle {\n          font-size: 13px;\n          color: rgba(243, 238, 217, 0.7);\n          margin: 0;\n          line-height: 1.3;\n        }\n        \n        .sidebar-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 8px 20px 20px;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .collapsed .sidebar-content {\n          padding: 8px 12px 20px;\n        }\n        \n        .nav-section {\n          margin-bottom: 32px;\n        }\n        \n        .nav-title {\n          font-size: 11px;\n          font-weight: 700;\n          text-transform: uppercase;\n          letter-spacing: 1px;\n          color: rgba(243, 238, 217, 0.6);\n          margin-bottom: 16px;\n          margin-top: 0;\n          padding: 0 4px;\n        }\n        \n        .nav-list {\n          list-style: none;\n          padding: 0;\n          margin: 0;\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .nav-item {\n          width: 100%;\n        }\n        \n        .nav-button {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          padding: 16px;\n          border: none;\n          background: transparent;\n          color: #F3EED9;\n          cursor: pointer;\n          border-radius: 16px;\n          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          font-size: 14px;\n          position: relative;\n          text-align: left;\n          overflow: hidden;\n          border: 1px solid transparent;\n        }\n        \n        .collapsed .nav-button {\n          justify-content: center;\n          padding: 16px 12px;\n        }\n        \n        .nav-button::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(243, 238, 217, 0.08);\n          border-radius: 16px;\n          transform: scaleX(0);\n          transform-origin: left;\n          transition: transform 0.3s ease;\n        }\n        \n        .nav-button:hover::before {\n          transform: scaleX(1);\n        }\n        \n        .nav-button:hover {\n          color: #FFFFFF;\n          transform: translateX(4px);\n          border-color: rgba(243, 238, 217, 0.2);\n        }\n        \n        .collapsed .nav-button:hover {\n          transform: scale(1.05);\n        }\n        \n        .nav-button.active {\n          background: var(--item-gradient, rgba(243, 238, 217, 0.15));\n          color: #FFFFFF;\n          box-shadow: \n            0 8px 24px rgba(0, 0, 0, 0.15),\n            0 4px 12px rgba(62, 92, 73, 0.2);\n          border-color: rgba(243, 238, 217, 0.3);\n        }\n        \n        .nav-button.active::before {\n          transform: scaleX(1);\n          background: rgba(243, 238, 217, 0.1);\n        }\n        \n        .nav-button.highlight {\n          background: var(--item-gradient);\n          animation: pulse-highlight 3s ease-in-out infinite;\n        }\n        \n        .nav-button.highlight:hover {\n          background: linear-gradient(135deg, #A8481A 0%, #D84315 100%);\n          transform: translateX(4px) translateY(-2px);\n          box-shadow: 0 12px 32px rgba(194, 87, 27, 0.4);\n        }\n        \n        .nav-button.support {\n          position: relative;\n        }\n        \n        .nav-button.support::after {\n          content: '\u2665';\n          position: absolute;\n          top: 8px;\n          right: 8px;\n          font-size: 12px;\n          color: #E91E63;\n          animation: heartbeat 2s ease-in-out infinite;\n        }\n        \n        @keyframes heartbeat {\n          0%, 100% {\n            transform: scale(1);\n            opacity: 0.8;\n          }\n          50% {\n            transform: scale(1.2);\n            opacity: 1;\n          }\n        }\n        \n        @keyframes pulse-highlight {\n          0%, 100% {\n            box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);\n          }\n          50% {\n            box-shadow: 0 8px 24px rgba(194, 87, 27, 0.5);\n          }\n        }\n        \n        .nav-button.urgent {\n          position: relative;\n        }\n        \n        .nav-button.urgent::after {\n          content: '';\n          position: absolute;\n          top: 12px;\n          right: 12px;\n          width: 8px;\n          height: 8px;\n          background: #DC2626;\n          border-radius: 50%;\n          animation: pulse-urgent 2s infinite;\n        }\n        \n        @keyframes pulse-urgent {\n          0%, 100% {\n            opacity: 1;\n            transform: scale(1);\n          }\n          50% {\n            opacity: 0.7;\n            transform: scale(1.2);\n          }\n        }\n        \n        .nav-icon {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          width: 24px;\n          height: 24px;\n          flex-shrink: 0;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .nav-content {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          min-width: 0;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .nav-label {\n          font-weight: 700;\n          line-height: 1.2;\n          margin-bottom: 3px;\n          font-size: 15px;\n        }\n        \n        .nav-description {\n          font-size: 12px;\n          opacity: 0.8;\n          line-height: 1.2;\n        }\n        \n        .nav-count {\n          background: rgba(243, 238, 217, 0.2);\n          color: #F3EED9;\n          font-size: 12px;\n          font-weight: 700;\n          padding: 4px 8px;\n          border-radius: 10px;\n          min-width: 20px;\n          text-align: center;\n          flex-shrink: 0;\n          position: relative;\n          z-index: 1;\n          border: 1px solid rgba(243, 238, 217, 0.3);\n        }\n        \n        .nav-count.badge {\n          background: #C2571B;\n          color: #FFFFFF;\n          animation: pulse-badge 2s infinite;\n          border-color: rgba(255, 255, 255, 0.3);\n        }\n        \n        .nav-count.urgent {\n          background: #DC2626;\n          color: #FFFFFF;\n          animation: pulse-urgent 1.5s infinite;\n          border-color: rgba(255, 255, 255, 0.3);\n        }\n        \n        @keyframes pulse-badge {\n          0%, 100% {\n            opacity: 1;\n            transform: scale(1);\n          }\n          50% {\n            opacity: 0.8;\n            transform: scale(1.05);\n          }\n        }\n        \n        .nav-highlight {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          width: 28px;\n          height: 28px;\n          background: rgba(255, 255, 255, 0.2);\n          border-radius: 50%;\n          color: #F3EED9;\n          animation: sparkle 2s ease-in-out infinite;\n        }\n        \n        @keyframes sparkle {\n          0%, 100% {\n            opacity: 0.7;\n            transform: rotate(0deg) scale(1);\n          }\n          50% {\n            opacity: 1;\n            transform: rotate(180deg) scale(1.1);\n          }\n        }\n        \n        .nav-indicator {\n          width: 10px;\n          height: 10px;\n          background: #C2571B;\n          border-radius: 50%;\n          position: absolute;\n          top: 12px;\n          right: 12px;\n          animation: pulse-badge 2s infinite;\n          border: 2px solid rgba(243, 238, 217, 0.3);\n        }\n        \n        .nav-indicator.urgent {\n          background: #DC2626;\n          animation: pulse-urgent 1.5s infinite;\n        }\n        \n        .stats-section {\n          margin-bottom: 24px;\n          padding-top: 20px;\n          border-top: 1px solid rgba(243, 238, 217, 0.1);\n          position: relative;\n          isolation: isolate;\n        }\n        \n        .stats-section:first-of-type {\n          border-top: none;\n          padding-top: 0;\n        }\n        \n        .stats-header {\n          display: flex !important;\n          align-items: center !important;\n          justify-content: space-between !important;\n          margin-bottom: 16px !important;\n          position: relative !important;\n          z-index: 10 !important;\n        }\n        \n        .stats-title {\n          font-size: 11px !important;\n          font-weight: 700 !important;\n          text-transform: uppercase !important;\n          letter-spacing: 1px !important;\n          color: rgba(243, 238, 217, 0.6) !important;\n          margin: 0 !important;\n          font-family: inherit !important;\n        }\n        \n        .popularity-score {\n          display: flex;\n          align-items: center;\n          gap: 4px;\n          font-size: 10px;\n          color: rgba(243, 238, 217, 0.8);\n          font-weight: 600;\n        }\n        \n        .stats-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 12px;\n        }\n        \n        .stat-card {\n          background: rgba(243, 238, 217, 0.08) !important;\n          border-radius: 12px !important;\n          padding: 14px 12px !important;\n          display: flex !important;\n          align-items: center !important;\n          gap: 12px !important;\n          transition: all 0.2s ease !important;\n          border: 1px solid rgba(243, 238, 217, 0.1) !important;\n          position: relative !important;\n          overflow: hidden !important;\n          isolation: isolate !important;\n        }\n        \n        .stat-card::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: linear-gradient(135deg, rgba(243, 238, 217, 0.05) 0%, transparent 100%);\n          opacity: 0;\n          transition: opacity 0.2s ease;\n        }\n        \n        .stat-card:hover {\n          background: rgba(243, 238, 217, 0.12);\n          transform: translateY(-1px);\n        }\n        \n        .stat-card:hover::before {\n          opacity: 1;\n        }\n        \n        .stat-card.urgent {\n          background: rgba(220, 38, 38, 0.15);\n          border-color: rgba(220, 38, 38, 0.3);\n          animation: pulse-card 3s ease-in-out infinite;\n        }\n        \n        @keyframes pulse-card {\n          0%, 100% {\n            background: rgba(220, 38, 38, 0.15);\n          }\n          50% {\n            background: rgba(220, 38, 38, 0.2);\n          }\n        }\n        \n        .stat-icon {\n          opacity: 0.9;\n          flex-shrink: 0;\n        }\n        \n        .stat-content {\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .stat-value {\n          font-size: 18px !important;\n          font-weight: 800 !important;\n          line-height: 1.2 !important;\n          color: #F3EED9 !important;\n          margin-bottom: 2px !important;\n          font-family: inherit !important;\n        }\n        \n        .stat-label {\n          font-size: 10px !important;\n          color: rgba(243, 238, 217, 0.7) !important;\n          line-height: 1.2 !important;\n          text-transform: uppercase !important;\n          letter-spacing: 0.5px !important;\n          font-weight: 600 !important;\n          font-family: inherit !important;\n        }\n        \n        .stat-trend {\n          font-size: 9px;\n          color: #4CAF50;\n          font-weight: 600;\n          margin-top: 2px;\n        }\n        \n        .stat-percentage {\n          font-size: 9px;\n          color: rgba(243, 238, 217, 0.8);\n          font-weight: 600;\n          margin-top: 2px;\n        }\n        \n        .users-stats {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n          margin-bottom: 16px;\n        }\n        \n        .user-stat {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          background: rgba(243, 238, 217, 0.06);\n          border-radius: 10px;\n          padding: 12px;\n          border: 1px solid rgba(243, 238, 217, 0.1);\n        }\n        \n        .user-stat-icon {\n          opacity: 0.9;\n        }\n        \n        .user-stat-content {\n          flex: 1;\n        }\n        \n        .user-stat-value {\n          font-size: 16px;\n          font-weight: 700;\n          color: #F3EED9;\n          line-height: 1.2;\n        }\n        \n        .user-stat-label {\n          font-size: 11px;\n          color: rgba(243, 238, 217, 0.7);\n          font-weight: 500;\n        }\n        \n        .total-users {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          padding: 12px 16px;\n          background: rgba(243, 238, 217, 0.1);\n          border-radius: 12px;\n          border: 1px solid rgba(243, 238, 217, 0.2);\n        }\n        \n        .total-label {\n          font-size: 12px;\n          color: rgba(243, 238, 217, 0.8);\n          font-weight: 600;\n        }\n        \n        .total-value {\n          font-size: 16px;\n          font-weight: 800;\n          color: #F3EED9;\n        }\n        \n        .activity-section {\n          margin-top: auto;\n        }\n        \n        .activity-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          margin-bottom: 16px;\n        }\n        \n        .activity-pulse {\n          width: 8px;\n          height: 8px;\n          background: #4CAF50;\n          border-radius: 50%;\n          animation: pulse-activity 2s ease-in-out infinite;\n        }\n        \n        @keyframes pulse-activity {\n          0%, 100% {\n            opacity: 1;\n            transform: scale(1);\n          }\n          50% {\n            opacity: 0.6;\n            transform: scale(1.3);\n          }\n        }\n        \n        .activity-summary {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .activity-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 11px;\n          color: rgba(243, 238, 217, 0.8);\n          line-height: 1.3;\n        }\n        \n        .activity-item.urgent {\n          color: #FFCDD2;\n        }\n        \n        .activity-dot {\n          width: 6px;\n          height: 6px;\n          border-radius: 50%;\n          flex-shrink: 0;\n        }\n        \n        .activity-dot.available {\n          background: #4CAF50;\n        }\n        \n        .activity-dot.borrowed {\n          background: #FF9800;\n        }\n        \n        .activity-dot.overdue {\n          background: #F44336;\n          animation: pulse-urgent 1.5s infinite;\n        }\n        \n        /* Enhanced scrollbar */\n        .sidebar-content::-webkit-scrollbar {\n          width: 4px;\n        }\n        \n        .sidebar-content::-webkit-scrollbar-track {\n          background: rgba(243, 238, 217, 0.1);\n          border-radius: 2px;\n        }\n        \n        .sidebar-content::-webkit-scrollbar-thumb {\n          background: rgba(243, 238, 217, 0.3);\n          border-radius: 2px;\n        }\n        \n        .sidebar-content::-webkit-scrollbar-thumb:hover {\n          background: rgba(243, 238, 217, 0.5);\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 768px) {\n          .sidebar {\n            width: 100%;\n            height: auto;\n            flex-direction: row;\n            border-right: none;\n            border-bottom: 1px solid rgba(46, 69, 58, 0.3);\n            overflow-x: auto;\n            background: linear-gradient(90deg, #3E5C49 0%, #2E453A 100%);\n          }\n          \n          .sidebar.collapsed {\n            width: 100%;\n          }\n          \n          .sidebar-header {\n            display: none;\n          }\n          \n          .sidebar-content {\n            flex: 1;\n            padding: 16px 20px;\n            overflow-x: auto;\n            display: flex;\n            gap: 20px;\n            overflow-y: visible;\n          }\n          \n          .nav-section {\n            margin-bottom: 0;\n            flex-shrink: 0;\n          }\n          \n          .nav-list {\n            flex-direction: row;\n            gap: 12px;\n          }\n          \n          .nav-button {\n            flex-direction: column;\n            gap: 6px;\n            padding: 12px 16px;\n            min-width: 80px;\n            white-space: nowrap;\n            border-radius: 12px;\n          }\n          \n          .nav-content {\n            align-items: center;\n            text-align: center;\n          }\n          \n          .nav-label {\n            font-size: 12px;\n          }\n          \n          .nav-description {\n            display: none;\n          }\n          \n          .nav-count {\n            position: absolute;\n            top: 8px;\n            right: 8px;\n            font-size: 10px;\n            padding: 2px 6px;\n            min-width: 16px;\n          }\n          \n          .stats-section,\n          .activity-section {\n            display: none;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .sidebar-content {\n            padding: 12px 16px;\n            gap: 16px;\n          }\n          \n          .nav-button {\n            min-width: 70px;\n            padding: 10px 12px;\n          }\n          \n          .nav-label {\n            font-size: 11px;\n          }\n          \n          .nav-count {\n            font-size: 9px;\n            padding: 1px 4px;\n          }\n        }\n        \n        /* Performance optimizations */\n        .nav-button {\n          contain: layout style paint;\n        }\n        \n        .stat-card {\n          contain: layout style paint;\n        }\n        \n        /* Accessibility improvements */\n        @media (prefers-reduced-motion: reduce) {\n          .nav-button,\n          .stat-card,\n          .toggle-button,\n          .activity-pulse,\n          .nav-highlight {\n            transition: none;\n            animation: none;\n          }\n          \n          .nav-button:hover {\n            transform: none;\n          }\n        }\n        \n        /* High contrast mode */\n        @media (prefers-contrast: high) {\n          .nav-button {\n            border: 2px solid rgba(243, 238, 217, 0.5);\n          }\n          \n          .nav-button.active {\n            border-color: #F3EED9;\n          }\n          \n          .stat-card {\n            border-width: 2px;\n          }\n        }\n      "}</style>
      
      {/* Emergency Alert for Overdue Books */}
      {!isCollapsed && stats.overdueBooks > 0 && (<div className="emergency-alert">
          <div className="alert-icon">
            <lucide_react_1.Clock size={16}/>
          </div>
          <div className="alert-content">
            <div className="alert-title">Action requise</div>
            <div className="alert-message">
              {stats.overdueBooks} livre(s) en retard
            </div>
          </div>
        </div>)}
      
      <style>{"\n        .emergency-alert {\n          margin: 16px 20px;\n          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);\n          color: #FFFFFF;\n          padding: 16px;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          animation: pulse-alert 3s ease-in-out infinite;\n          border: 1px solid rgba(255, 255, 255, 0.2);\n          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);\n        }\n        \n        @keyframes pulse-alert {\n          0%, 100% {\n            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);\n          }\n          50% {\n            box-shadow: 0 8px 24px rgba(220, 38, 38, 0.5);\n          }\n        }\n        \n        .alert-icon {\n          width: 32px;\n          height: 32px;\n          background: rgba(255, 255, 255, 0.2);\n          border-radius: 50%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          flex-shrink: 0;\n        }\n        \n        .alert-content {\n          flex: 1;\n        }\n        \n        .alert-title {\n          font-size: 12px;\n          font-weight: 700;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n          margin-bottom: 2px;\n          opacity: 0.9;\n        }\n        \n        .alert-message {\n          font-size: 13px;\n          font-weight: 600;\n          line-height: 1.3;\n        }\n      "}</style>
    </div>);
};
exports.Sidebar = Sidebar;
