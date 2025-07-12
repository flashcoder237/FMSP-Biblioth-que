import React, { useState } from 'react';
import { 
  Book, 
  BookOpen, 
  Users, 
  Tag, 
  TrendingUp, 
  Clock,
  Plus,
  Search,
  Printer
} from 'lucide-react';
import { Stats } from '../../preload';
import { PrintManager } from './PrintManager';

interface DashboardProps {
  stats: Stats;
  onNavigate: (view: 'dashboard' | 'books' | 'borrowed' | 'add-book') => void;
  books?: any[];
  categories?: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  onNavigate, 
  books = [], 
  categories = [] 
}) => {
  const [showPrintManager, setShowPrintManager] = useState(false);

  const quickActions = [
    {
      title: 'Ajouter un livre',
      description: 'Enrichir la collection',
      icon: Plus,
      action: () => onNavigate('add-book'),
      color: 'bg-green-500'
    },
    {
      title: 'Voir tous les livres',
      description: 'Parcourir la collection',
      icon: Book,
      action: () => onNavigate('books'),
      color: 'bg-blue-500'
    },
    {
      title: 'Livres empruntés',
      description: 'Gérer les emprunts',
      icon: BookOpen,
      action: () => onNavigate('borrowed'),
      color: 'bg-orange-500'
    },
    {
      title: 'Imprimer & Exporter',
      description: 'Rapports et inventaires',
      icon: Printer,
      action: () => setShowPrintManager(true),
      color: 'bg-purple-500'
    }
  ];

  const mainStats = [
    {
      title: 'Total des livres',
      value: stats.totalBooks,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Livres disponibles',
      value: stats.availableBooks,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Livres empruntés',
      value: stats.borrowedBooks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Auteurs',
      value: stats.totalAuthors,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const borrowRate = stats.totalBooks > 0 ? (stats.borrowedBooks / stats.totalBooks * 100).toFixed(1) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">
            Bienvenue dans votre système de gestion de bibliothèque
          </p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle small"></div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stats-grid">
            {mainStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-section">
          <div className="overview-card">
            <div className="overview-header">
              <h3 className="overview-title">Aperçu de la collection</h3>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="overview-content">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Taux d'emprunt</span>
                  <span className="progress-value">{borrowRate}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${borrowRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="overview-stats">
                <div className="overview-stat">
                  <div className="overview-stat-label">Disponibilité</div>
                  <div className="overview-stat-value">
                    {stats.totalBooks > 0 ? ((stats.availableBooks / stats.totalBooks) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="overview-stat">
                  <div className="overview-stat-label">Catégories</div>
                  <div className="overview-stat-value">{stats.totalCategories}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="actions-card">
            <h3 className="actions-title">Actions rapides</h3>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-button"
                  onClick={action.action}
                >
                  <div className={`action-icon ${action.color}`}>
                    <action.icon size={20} />
                  </div>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPrintManager && (
        <PrintManager
          books={books}
          stats={stats}
          categories={categories}
          onClose={() => setShowPrintManager(false)}
        />
      )}

      <style>{`
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
      `}</style>
    </div>
  );
};