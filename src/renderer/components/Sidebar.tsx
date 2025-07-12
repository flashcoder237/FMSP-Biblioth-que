import React from 'react';
import { 
  Home, 
  Book, 
  BookOpen, 
  Plus, 
  BarChart3,
  Users,
  Tag
} from 'lucide-react';
import { Stats } from '../../preload';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'books' | 'borrowed' | 'add-book') => void;
  stats: Stats;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, stats }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'books', label: 'Tous les livres', icon: Book },
    { id: 'borrowed', label: 'Livres empruntés', icon: BookOpen },
    { id: 'add-book', label: 'Ajouter un livre', icon: Plus },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Navigation</h3>
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id as any)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {item.id === 'borrowed' && stats.borrowedBooks > 0 && (
                      <span className="badge">{stats.borrowedBooks}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="nav-section">
            <h3 className="nav-title">Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Book size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalBooks}</div>
                  <div className="stat-label">Livres</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon available">
                  <BookOpen size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.availableBooks}</div>
                  <div className="stat-label">Disponibles</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon borrowed">
                  <BarChart3 size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.borrowedBooks}</div>
                  <div className="stat-label">Empruntés</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalAuthors}</div>
                  <div className="stat-label">Auteurs</div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <style>{`
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
      `}</style>
    </div>
  );
};