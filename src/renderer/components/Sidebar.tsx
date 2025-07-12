import React, { useState } from 'react';
import { 
  Home, 
  Book, 
  BookOpen, 
  Plus, 
  BarChart3,
  Users,
  Tag,
  ChevronLeft,
  ChevronRight,
  History,
  GraduationCap,
  Briefcase,
  Clock
} from 'lucide-react';
import { Stats } from '../../preload';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'books' | 'borrowed' | 'add-book' | 'borrowers' | 'history') => void;
  stats: Stats;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, stats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Accueil', 
      icon: Home,
      description: 'Vue d\'ensemble'
    },
    { 
      id: 'books', 
      label: 'Collection', 
      icon: Book,
      description: 'Tous les livres',
      count: stats.totalBooks
    },
    { 
      id: 'borrowed', 
      label: 'Emprunts', 
      icon: BookOpen,
      description: 'Livres empruntés',
      count: stats.borrowedBooks,
      badge: stats.borrowedBooks > 0,
      urgent: stats.overdueBooks > 0
    },
    { 
      id: 'add-book', 
      label: 'Ajouter', 
      icon: Plus,
      description: 'Nouveau livre',
      accent: true
    }
  ];

  const managementItems = [
    {
      id: 'borrowers',
      label: 'Emprunteurs',
      icon: Users,
      description: 'Gestion des emprunteurs',
      count: stats.totalBorrowers
    },
    {
      id: 'history',
      label: 'Historique',
      icon: History,
      description: 'Historique des emprunts'
    }
  ];

  const quickStats = [
    {
      label: 'Total',
      value: stats.totalBooks,
      icon: Book,
      color: '#3E5C49'
    },
    {
      label: 'Disponibles',
      value: stats.availableBooks,
      icon: BookOpen,
      color: '#3E5C49'
    },
    {
      label: 'Empruntés',
      value: stats.borrowedBooks,
      icon: BarChart3,
      color: '#C2571B'
    },
    {
      label: 'En retard',
      value: stats.overdueBooks,
      icon: Clock,
      color: '#DC2626'
    }
  ];

  const borrowerStats = [
    {
      label: 'Étudiants',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: '#3E5C49'
    },
    {
      label: 'Personnel',
      value: stats.totalStaff,
      icon: Briefcase,
      color: '#C2571B'
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-toggle">
          <button 
            className="toggle-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Développer' : 'Réduire'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="sidebar-brand">
            <h2 className="brand-title">Navigation</h2>
            <p className="brand-subtitle">Gérez votre bibliothèque</p>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {/* Menu Principal */}
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Menu principal</h3>}
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-button ${currentView === item.id ? 'active' : ''} ${item.accent ? 'accent' : ''} ${item.urgent ? 'urgent' : ''}`}
                    onClick={() => onNavigate(item.id as any)}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="nav-icon">
                      <item.icon size={20} />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <div className="nav-content">
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                        
                        {item.count !== undefined && item.count > 0 && (
                          <div className={`nav-count ${item.badge ? 'badge' : ''} ${item.urgent ? 'urgent' : ''}`}>
                            {item.count}
                          </div>
                        )}
                      </>
                    )}
                    
                    {isCollapsed && item.badge && stats.borrowedBooks > 0 && (
                      <div className={`nav-indicator ${item.urgent ? 'urgent' : ''}`}></div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Gestion */}
          <div className="nav-section">
            {!isCollapsed && <h3 className="nav-title">Gestion</h3>}
            <ul className="nav-list">
              {managementItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id as any)}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="nav-icon">
                      <item.icon size={20} />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <div className="nav-content">
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                        
                        {item.count !== undefined && item.count > 0 && (
                          <div className="nav-count">
                            {item.count}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {!isCollapsed && (
          <>
            {/* Statistiques Livres */}
            <div className="stats-section">
              <h3 className="stats-title">Statistiques Livres</h3>
              <div className="stats-grid">
                {quickStats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon" style={{ color: stat.color }}>
                      <stat.icon size={16} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques Emprunteurs */}
            <div className="stats-section">
              <h3 className="stats-title">Emprunteurs</h3>
              <div className="stats-grid">
                {borrowerStats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon" style={{ color: stat.color }}>
                      <stat.icon size={16} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #3E5C49 0%, #2E453A 100%);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-right: 1px solid rgba(46, 69, 58, 0.3);
        }
        
        .sidebar.collapsed {
          width: 64px;
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(243, 238, 217, 0.02);
          backdrop-filter: blur(1px);
          pointer-events: none;
        }
        
        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid rgba(243, 238, 217, 0.1);
          position: relative;
          z-index: 1;
        }
        
        .sidebar-toggle {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
        }
        
        .toggle-button {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .toggle-button:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .sidebar-brand {
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        
        .collapsed .sidebar-brand {
          opacity: 0;
          pointer-events: none;
        }
        
        .brand-title {
          font-size: 16px;
          font-weight: 700;
          color: #F3EED9;
          margin: 0 0 4px 0;
          letter-spacing: -0.2px;
        }
        
        .brand-subtitle {
          font-size: 12px;
          color: rgba(243, 238, 217, 0.7);
          margin: 0;
          line-height: 1.3;
        }
        
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px 16px 16px;
          position: relative;
          z-index: 1;
        }
        
        .collapsed .sidebar-content {
          padding: 8px 8px 16px;
        }
        
        .nav-section {
          margin-bottom: 24px;
        }
        
        .nav-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: rgba(243, 238, 217, 0.6);
          margin-bottom: 12px;
          margin-top: 0;
          padding: 0 4px;
        }
        
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .nav-item {
          width: 100%;
        }
        
        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          color: #F3EED9;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 14px;
          position: relative;
          text-align: left;
          overflow: hidden;
        }
        
        .collapsed .nav-button {
          justify-content: center;
          padding: 12px 8px;
        }
        
        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(243, 238, 217, 0.08);
          border-radius: 12px;
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
        }
        
        .collapsed .nav-button:hover {
          transform: scale(1.05);
        }
        
        .nav-button.active {
          background: rgba(243, 238, 217, 0.15);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .nav-button.active::before {
          transform: scaleX(1);
          background: rgba(243, 238, 217, 0.1);
        }
        
        .nav-button.accent {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
        }
        
        .nav-button.accent:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8B3A15 100%);
          transform: translateX(4px) translateY(-1px);
        }
        
        .nav-button.urgent {
          position: relative;
        }
        
        .nav-button.urgent::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #DC2626;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
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
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        
        .nav-description {
          font-size: 11px;
          opacity: 0.8;
          line-height: 1.2;
        }
        
        .nav-count {
          background: rgba(243, 238, 217, 0.2);
          color: #F3EED9;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 8px;
          min-width: 18px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .nav-count.badge {
          background: #C2571B;
          color: #FFFFFF;
          animation: pulse 2s infinite;
        }
        
        .nav-count.urgent {
          background: #DC2626;
          color: #FFFFFF;
          animation: pulse 1.5s infinite;
        }
        
        .nav-indicator {
          width: 8px;
          height: 8px;
          background: #C2571B;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
          animation: pulse 2s infinite;
        }
        
        .nav-indicator.urgent {
          background: #DC2626;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        .stats-section {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(243, 238, 217, 0.1);
          margin-bottom: 16px;
        }
        
        .stats-section:last-child {
          margin-bottom: 0;
        }
        
        .stats-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: rgba(243, 238, 217, 0.6);
          margin-bottom: 12px;
          margin-top: 0;
          padding: 0 4px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .stat-card {
          background: rgba(243, 238, 217, 0.08);
          border-radius: 8px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          border: 1px solid rgba(243, 238, 217, 0.1);
        }
        
        .stat-card:hover {
          background: rgba(243, 238, 217, 0.12);
          transform: translateY(-1px);
        }
        
        .stat-icon {
          opacity: 0.9;
        }
        
        .stat-content {
          text-align: center;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
          color: #F3EED9;
          margin-bottom: 2px;
        }
        
        .stat-label {
          font-size: 10px;
          color: rgba(243, 238, 217, 0.7);
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        /* Alerte pour les retards */
        .overdue-alert {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: #FFFFFF;
          padding: 12px;
          border-radius: 8px;
          margin: 16px 0;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          animation: pulse 3s infinite;
        }
        
        /* États spéciaux */
        .urgent-section {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin: 16px 0;
        }
        
        .urgent-title {
          font-size: 11px;
          font-weight: 700;
          color: #DC2626;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .urgent-content {
          font-size: 12px;
          color: #FFFFFF;
          line-height: 1.3;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid rgba(46, 69, 58, 0.3);
            overflow-x: auto;
          }
          
          .sidebar.collapsed {
            width: 100%;
          }
          
          .sidebar-header {
            display: none;
          }
          
          .sidebar-content {
            flex: 1;
            padding: 8px 16px;
            overflow-x: auto;
            display: flex;
            gap: 16px;
          }
          
          .nav-section {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          
          .nav-list {
            flex-direction: row;
            gap: 8px;
          }
          
          .nav-button {
            flex-direction: column;
            gap: 4px;
            padding: 8px 12px;
            min-width: 64px;
            white-space: nowrap;
          }
          
          .nav-content {
            align-items: center;
          }
          
          .nav-label {
            font-size: 11px;
          }
          
          .nav-description {
            display: none;
          }
          
          .stats-section {
            display: none;
          }
          
          .urgent-section {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .sidebar-content {
            padding: 8px;
            gap: 8px;
          }
          
          .nav-button {
            min-width: 56px;
            padding: 6px 8px;
          }
          
          .nav-label {
            font-size: 10px;
          }
          
          .nav-count {
            font-size: 9px;
            padding: 1px 4px;
          }
        }
      `}</style>
      
      {/* Alerte pour les livres en retard */}
      {!isCollapsed && stats.overdueBooks > 0 && (
        <div className="urgent-section">
          <div className="urgent-title">
            <Clock size={12} />
            Attention
          </div>
          <div className="urgent-content">
            {stats.overdueBooks} livre(s) en retard
          </div>
        </div>
      )}
    </div>
  );
};