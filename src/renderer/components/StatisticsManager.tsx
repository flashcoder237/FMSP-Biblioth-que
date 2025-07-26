import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Award,
  Target,
  Zap,
  Download,
  X,
  RefreshCw,
  Filter,
  Eye,
  FileText,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { StatisticsService, DetailedStatistics } from '../services/StatisticsService';
import { Document, Borrower, BorrowHistory } from '../../types';
import { useQuickToast } from './ToastSystem';

interface StatisticsManagerProps {
  documents: Document[];
  borrowers: Borrower[];
  borrowHistory: BorrowHistory[];
  onClose: () => void;
}

export const StatisticsManager: React.FC<StatisticsManagerProps> = ({
  documents,
  borrowers,
  borrowHistory,
  onClose
}) => {
  const [statistics, setStatistics] = useState<DetailedStatistics | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'documents' | 'borrowers' | 'trends' | 'insights'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useQuickToast();

  const generateStatistics = () => {
    setIsLoading(true);
    try {
      const stats = StatisticsService.generateDetailedStatistics(documents, borrowers, borrowHistory);
      setStatistics(stats);
      toast.success('Statistiques générées', 'Les statistiques ont été calculées avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la génération des statistiques:', error);
      toast.error('Erreur de génération', 'Impossible de générer les statistiques: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateStatistics();
  }, [documents, borrowers, borrowHistory]);

  const exportStatistics = (format: 'csv' | 'pdf') => {
    if (!statistics) return;
    
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        content = StatisticsService.exportToCSV(statistics);
        filename = `statistiques_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8';
      } else {
        content = StatisticsService.exportToPDF(statistics);
        filename = `statistiques_${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html;charset=utf-8';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export réussi', `Statistiques exportées en ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error('Erreur d\'export', 'Impossible d\'exporter: ' + error.message);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { key: 'documents', label: 'Documents', icon: BookOpen },
    { key: 'borrowers', label: 'Emprunteurs', icon: Users },
    { key: 'trends', label: 'Tendances', icon: TrendingUp },
    { key: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  if (isLoading || !statistics) {
    return (
      <div className="statistics-manager">
        <div className="statistics-overlay" onClick={onClose} />
        <div className="statistics-container">
          <div className="loading-state">
            <RefreshCw size={48} className="spinning" />
            <h3>Génération des statistiques...</h3>
            <p>Analyse des données en cours</p>
          </div>
        </div>
        <style>{getStyles()}</style>
      </div>
    );
  }

  return (
    <div className="statistics-manager">
      <div className="statistics-overlay" onClick={onClose} />
      
      <div className="statistics-container">
        {/* Header */}
        <div className="statistics-header">
          <div className="header-info">
            <BarChart3 size={24} />
            <div>
              <h2>Statistiques Avancées</h2>
              <p>Analyse détaillée des données de votre bibliothèque</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="action-btn"
              onClick={() => exportStatistics('csv')}
              title="Exporter en CSV"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              className="action-btn"
              onClick={() => exportStatistics('pdf')}
              title="Exporter en PDF"
            >
              <FileText size={16} />
              PDF
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="statistics-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${selectedTab === tab.key ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab.key as any)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="statistics-content">
          {selectedTab === 'overview' && (
            <OverviewTab statistics={statistics} />
          )}
          {selectedTab === 'documents' && (
            <DocumentsTab statistics={statistics} />
          )}
          {selectedTab === 'borrowers' && (
            <BorrowersTab statistics={statistics} />
          )}
          {selectedTab === 'trends' && (
            <TrendsTab statistics={statistics} />
          )}
          {selectedTab === 'insights' && (
            <InsightsTab statistics={statistics} />
          )}
        </div>
      </div>

      <style>{getStyles()}</style>
    </div>
  );
};

// Composants des onglets
const OverviewTab: React.FC<{ statistics: DetailedStatistics }> = ({ statistics }) => (
  <div className="tab-content">
    <div className="metrics-grid">
      <MetricCard
        title="Documents"
        value={statistics.overview.totalDocuments}
        icon={BookOpen}
        color="#3E5C49"
      />
      <MetricCard
        title="Emprunteurs"
        value={statistics.overview.totalBorrowers}
        icon={Users}
        color="#C2571B"
      />
      <MetricCard
        title="Emprunts Actifs"
        value={statistics.overview.activeLoans}
        icon={Activity}
        color="#2E453A"
      />
      <MetricCard
        title="Taux d'Utilisation"
        value={`${statistics.overview.utilizationRate.toFixed(1)}%`}
        icon={Target}
        color="#6B7280"
      />
    </div>

    <div className="overview-charts">
      <div className="chart-card">
        <h3><PieChart size={20} /> Répartition des Emprunts</h3>
        <div className="chart-content">
          <div className="status-breakdown">
            <div className="status-item">
              <div className="status-indicator available"></div>
              <span>Disponibles: {statistics.overview.availableDocuments}</span>
            </div>
            <div className="status-item">
              <div className="status-indicator borrowed"></div>
              <span>Empruntés: {statistics.overview.activeLoans}</span>
            </div>
            <div className="status-item">
              <div className="status-indicator overdue"></div>
              <span>En retard: {statistics.overview.overdueLoans}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3><Clock size={20} /> Performance</h3>
        <div className="performance-metrics">
          <div className="perf-item">
            <span className="perf-label">Durée moyenne d'emprunt</span>
            <span className="perf-value">{statistics.overview.averageLoanDuration} jours</span>
          </div>
          <div className="perf-item">
            <span className="perf-label">Santé globale</span>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${statistics.insights.performance.overallHealth}%` }}
              ></div>
            </div>
            <span className="perf-value">{statistics.insights.performance.overallHealth}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentsTab: React.FC<{ statistics: DetailedStatistics }> = ({ statistics }) => (
  <div className="tab-content">
    <div className="section">
      <h3><Star size={20} /> Documents les Plus Populaires</h3>
      <div className="list-container">
        {statistics.documents.mostBorrowedDocuments.slice(0, 10).map((item, index) => (
          <div key={index} className="list-item">
            <div className="item-rank">{index + 1}</div>
            <div className="item-info">
              <div className="item-title">{item.document.titre}</div>
              <div className="item-subtitle">{item.document.auteur}</div>
            </div>
            <div className="item-value">{item.borrowCount} emprunts</div>
          </div>
        ))}
      </div>
    </div>

    <div className="section">
      <h3><AlertTriangle size={20} /> Documents Jamais Empruntés</h3>
      <div className="stat-highlight">
        <span className="stat-number">{statistics.documents.neverBorrowedDocuments.length}</span>
        <span className="stat-text">documents n'ont jamais été empruntés</span>
      </div>
      {statistics.documents.neverBorrowedDocuments.length > 0 && (
        <div className="mini-list">
          {statistics.documents.neverBorrowedDocuments.slice(0, 5).map((doc, index) => (
            <div key={index} className="mini-item">
              <BookOpen size={14} />
              <span>{doc.titre} - {doc.auteur}</span>
            </div>
          ))}
          {statistics.documents.neverBorrowedDocuments.length > 5 && (
            <div className="mini-item more">
              +{statistics.documents.neverBorrowedDocuments.length - 5} autres...
            </div>
          )}
        </div>
      )}
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <h4>Par Type</h4>
        {Object.entries(statistics.documents.totalByType).map(([type, count]) => (
          <div key={type} className="stat-row">
            <span>{type}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
      <div className="stat-card">
        <h4>Âge Moyen</h4>
        <div className="big-stat">
          {statistics.documents.averageDocumentAge} ans
        </div>
      </div>
    </div>
  </div>
);

const BorrowersTab: React.FC<{ statistics: DetailedStatistics }> = ({ statistics }) => (
  <div className="tab-content">
    <div className="section">
      <h3><Award size={20} /> Top Emprunteurs</h3>
      <div className="list-container">
        {statistics.borrowers.topBorrowers.slice(0, 10).map((item, index) => (
          <div key={index} className="list-item">
            <div className="item-rank">{index + 1}</div>
            <div className="item-info">
              <div className="item-title">{item.borrower.firstName} {item.borrower.lastName}</div>
              <div className="item-subtitle">
                {item.borrower.type === 'student' ? 'Étudiant' : 'Personnel'} - {item.borrower.matricule}
              </div>
            </div>
            <div className="item-stats">
              <div className="stat-chip">{item.borrowCount} emprunts</div>
              <div className="stat-chip active">{item.activeLoans} actifs</div>
              {item.overdueLoans > 0 && (
                <div className="stat-chip overdue">{item.overdueLoans} retard</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="section">
      <h3><Activity size={20} /> Activité des Emprunteurs</h3>
      <div className="activity-chart">
        <div className="activity-bar">
          <div className="activity-segment very-active" style={{ width: `${(statistics.borrowers.borrowerActivity.veryActive / statistics.overview.totalBorrowers) * 100}%` }}>
            <span>Très Actifs ({statistics.borrowers.borrowerActivity.veryActive})</span>
          </div>
          <div className="activity-segment active" style={{ width: `${(statistics.borrowers.borrowerActivity.active / statistics.overview.totalBorrowers) * 100}%` }}>
            <span>Actifs ({statistics.borrowers.borrowerActivity.active})</span>
          </div>
          <div className="activity-segment moderate" style={{ width: `${(statistics.borrowers.borrowerActivity.moderate / statistics.overview.totalBorrowers) * 100}%` }}>
            <span>Modérés ({statistics.borrowers.borrowerActivity.moderate})</span>
          </div>
          <div className="activity-segment low" style={{ width: `${(statistics.borrowers.borrowerActivity.low / statistics.overview.totalBorrowers) * 100}%` }}>
            <span>Faibles ({statistics.borrowers.borrowerActivity.low})</span>
          </div>
          <div className="activity-segment inactive" style={{ width: `${(statistics.borrowers.borrowerActivity.inactive / statistics.overview.totalBorrowers) * 100}%` }}>
            <span>Inactifs ({statistics.borrowers.borrowerActivity.inactive})</span>
          </div>
        </div>
      </div>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <h4>Répartition</h4>
        <div className="stat-row">
          <span>Étudiants</span>
          <span>{statistics.borrowers.totalByType.students}</span>
        </div>
        <div className="stat-row">
          <span>Personnel</span>
          <span>{statistics.borrowers.totalByType.staff}</span>
        </div>
      </div>
      <div className="stat-card">
        <h4>Moyenne</h4>
        <div className="big-stat">
          {statistics.borrowers.averageBorrowsPerBorrower.toFixed(1)} emprunts/personne
        </div>
      </div>
    </div>
  </div>
);

const TrendsTab: React.FC<{ statistics: DetailedStatistics }> = ({ statistics }) => (
  <div className="tab-content">
    <div className="section">
      <h3><TrendingUp size={20} /> Tendances d'Emprunts</h3>
      <div className="trend-card">
        <div className="trend-metric">
          <span className="trend-label">Ce mois</span>
          <span className="trend-value">{statistics.trends.borrowingTrends.thisMonth}</span>
        </div>
        <div className="trend-indicator">
          {statistics.trends.borrowingTrends.trend === 'up' ? (
            <TrendingUp className="trend-up" />
          ) : statistics.trends.borrowingTrends.trend === 'down' ? (
            <TrendingDown className="trend-down" />
          ) : (
            <div className="trend-stable">→</div>
          )}
          <span className={`trend-growth ${statistics.trends.borrowingTrends.trend}`}>
            {statistics.trends.borrowingTrends.growth > 0 ? '+' : ''}{statistics.trends.borrowingTrends.growth.toFixed(1)}%
          </span>
        </div>
        <div className="trend-metric">
          <span className="trend-label">Mois dernier</span>
          <span className="trend-value">{statistics.trends.borrowingTrends.lastMonth}</span>
        </div>
      </div>
    </div>

    <div className="section">
      <h3><Calendar size={20} /> Modèles Quotidiens</h3>
      <div className="daily-pattern">
        {Object.entries(statistics.trends.dailyPatterns).map(([day, count]) => (
          <div key={day} className="day-bar">
            <div className="day-label">{day.slice(0, 3)}</div>
            <div className="day-bar-container">
              <div 
                className="day-bar-fill" 
                style={{ height: `${(count / Math.max(...Object.values(statistics.trends.dailyPatterns))) * 100}%` }}
              ></div>
            </div>
            <div className="day-count">{count}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="section">
      <h3><Star size={20} /> Catégories Populaires</h3>
      <div className="category-list">
        {statistics.trends.popularCategories.slice(0, 8).map((category, index) => (
          <div key={index} className="category-item">
            <span className="category-name">{category.category}</span>
            <div className="category-bar">
              <div 
                className="category-fill" 
                style={{ width: `${(category.borrowCount / statistics.trends.popularCategories[0]?.borrowCount || 1) * 100}%` }}
              ></div>
            </div>
            <span className="category-count">{category.borrowCount}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InsightsTab: React.FC<{ statistics: DetailedStatistics }> = ({ statistics }) => (
  <div className="tab-content">
    <div className="section">
      <h3><Lightbulb size={20} /> Recommandations</h3>
      <div className="insights-container">
        {statistics.insights.recommendations.map((rec, index) => (
          <div key={index} className={`insight-card recommendation ${rec.priority}`}>
            <div className="insight-header">
              <Lightbulb size={16} />
              <span className="insight-title">{rec.title}</span>
              <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
            </div>
            <p className="insight-description">{rec.description}</p>
            <div className="insight-impact">
              <strong>Impact:</strong> {rec.impact}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="section">
      <h3><AlertCircle size={20} /> Alertes</h3>
      <div className="insights-container">
        {statistics.insights.alerts.map((alert, index) => (
          <div key={index} className={`insight-card alert ${alert.severity}`}>
            <div className="insight-header">
              <AlertCircle size={16} />
              <span className="insight-title">{alert.title}</span>
              <span className="alert-count">{alert.count}</span>
            </div>
            <p className="insight-description">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="section">
      <h3><Zap size={20} /> Performance Globale</h3>
      <div className="performance-grid">
        <div className="perf-card">
          <div className="perf-title">Utilisation Collection</div>
          <div className="perf-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="circle" 
                strokeDasharray={`${statistics.insights.performance.collectionUtilization}, 100`}
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <text x="18" y="20.35" className="percentage">{statistics.insights.performance.collectionUtilization}%</text>
            </svg>
          </div>
        </div>
        <div className="perf-card">
          <div className="perf-title">Engagement Emprunteurs</div>
          <div className="perf-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="circle" 
                strokeDasharray={`${statistics.insights.performance.borrowerEngagement}, 100`}
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <text x="18" y="20.35" className="percentage">{statistics.insights.performance.borrowerEngagement}%</text>
            </svg>
          </div>
        </div>
        <div className="perf-card">
          <div className="perf-title">Conformité Retours</div>
          <div className="perf-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="circle" 
                strokeDasharray={`${statistics.insights.performance.returnCompliance}, 100`}
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <text x="18" y="20.35" className="percentage">{statistics.insights.performance.returnCompliance}%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant MetricCard
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, icon: Icon, color }) => (
  <div className="metric-card">
    <div className="metric-icon" style={{ backgroundColor: color }}>
      <Icon size={24} />
    </div>
    <div className="metric-content">
      <div className="metric-value">{value}</div>
      <div className="metric-title">{title}</div>
    </div>
  </div>
);

// Styles CSS
const getStyles = () => `
  .statistics-manager {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .statistics-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }

  .statistics-container {
    position: relative;
    background: white;
    border-radius: 20px;
    max-width: 1200px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(229, 220, 194, 0.3);
    overflow: hidden;
  }

  .statistics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 1px solid rgba(229, 220, 194, 0.3);
    background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
    color: #F3EED9;
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-info h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }

  .header-info p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(243, 238, 217, 0.1);
    border: 1px solid rgba(243, 238, 217, 0.2);
    color: #F3EED9;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
  }

  .action-btn:hover {
    background: rgba(243, 238, 217, 0.2);
    transform: translateY(-1px);
  }

  .close-btn {
    background: rgba(243, 238, 217, 0.1);
    border: none;
    color: #F3EED9;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(220, 38, 38, 0.2);
    color: #DC2626;
  }

  .statistics-tabs {
    display: flex;
    background: #F8F9FA;
    border-bottom: 1px solid rgba(229, 220, 194, 0.3);
    overflow-x: auto;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    border: none;
    background: none;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    font-weight: 500;
  }

  .tab-btn:hover {
    background: rgba(62, 92, 73, 0.05);
    color: #3E5C49;
  }

  .tab-btn.active {
    color: #3E5C49;
    border-bottom-color: #3E5C49;
    background: rgba(62, 92, 73, 0.05);
  }

  .statistics-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
  }

  .tab-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
    color: #3E5C49;
  }

  .loading-state h3 {
    margin: 20px 0 8px 0;
    font-size: 18px;
  }

  .loading-state p {
    margin: 0;
    color: #6B7280;
  }

  .spinning {
    animation: spin 1s linear infinite;
    color: #C2571B;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Métriques */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .metric-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(62, 92, 73, 0.1);
  }

  .metric-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .metric-content {
    flex: 1;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #2E2E2E;
    line-height: 1;
  }

  .metric-title {
    font-size: 14px;
    color: #6B7280;
    margin-top: 4px;
  }

  /* Charts et Graphiques */
  .overview-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
  }

  .chart-card {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 24px;
  }

  .chart-card h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 20px 0;
    color: #3E5C49;
    font-size: 16px;
  }

  .status-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .status-indicator.available { background: #10B981; }
  .status-indicator.borrowed { background: #F59E0B; }
  .status-indicator.overdue { background: #EF4444; }

  .performance-metrics {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .perf-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .perf-label {
    font-weight: 500;
    color: #374151;
  }

  .perf-value {
    font-weight: 600;
    color: #3E5C49;
  }

  .health-bar {
    flex: 1;
    height: 8px;
    background: #E5E7EB;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 12px;
  }

  .health-fill {
    height: 100%;
    background: linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* Sections et Listes */
  .section {
    margin-bottom: 32px;
  }

  .section h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    color: #3E5C49;
    font-size: 18px;
    font-weight: 600;
  }

  .list-container {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    overflow: hidden;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(229, 220, 194, 0.2);
    transition: background 0.2s ease;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .list-item:hover {
    background: rgba(62, 92, 73, 0.02);
  }

  .item-rank {
    width: 32px;
    height: 32px;
    background: #3E5C49;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
  }

  .item-title {
    font-weight: 600;
    color: #2E2E2E;
    margin-bottom: 2px;
  }

  .item-subtitle {
    font-size: 13px;
    color: #6B7280;
  }

  .item-value {
    font-weight: 600;
    color: #C2571B;
  }

  .item-stats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .stat-chip {
    background: #E5DCC2;
    color: #6B7280;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .stat-chip.active {
    background: #3E5C49;
    color: white;
  }

  .stat-chip.overdue {
    background: #FEE2E2;
    color: #DC2626;
  }

  /* Activité et Tendances */
  .activity-chart {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 20px;
  }

  .activity-bar {
    display: flex;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: #F3F4F6;
  }

  .activity-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .activity-segment:hover {
    filter: brightness(1.1);
  }

  .activity-segment.very-active { background: #059669; }
  .activity-segment.active { background: #10B981; }
  .activity-segment.moderate { background: #F59E0B; }
  .activity-segment.low { background: #EF4444; }
  .activity-segment.inactive { background: #6B7280; }

  .trend-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 24px;
  }

  .trend-metric {
    text-align: center;
  }

  .trend-label {
    display: block;
    font-size: 14px;
    color: #6B7280;
    margin-bottom: 4px;
  }

  .trend-value {
    font-size: 32px;
    font-weight: 700;
    color: #2E2E2E;
  }

  .trend-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .trend-up { color: #10B981; }
  .trend-down { color: #EF4444; }
  .trend-stable { color: #6B7280; font-size: 24px; font-weight: bold; }

  .trend-growth {
    font-weight: 600;
    font-size: 18px;
  }

  .trend-growth.up { color: #10B981; }
  .trend-growth.down { color: #EF4444; }
  .trend-growth.stable { color: #6B7280; }

  .daily-pattern {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 24px;
  }

  .day-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .day-label {
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
  }

  .day-bar-container {
    height: 80px;
    width: 20px;
    background: #F3F4F6;
    border-radius: 10px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .day-bar-fill {
    width: 100%;
    background: linear-gradient(to top, #3E5C49, #C2571B);
    border-radius: 10px;
    transition: height 0.3s ease;
  }

  .day-count {
    font-size: 12px;
    font-weight: 600;
    color: #2E2E2E;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 8px;
    padding: 12px 16px;
  }

  .category-name {
    min-width: 120px;
    font-weight: 500;
    color: #2E2E2E;
  }

  .category-bar {
    flex: 1;
    height: 8px;
    background: #F3F4F6;
    border-radius: 4px;
    overflow: hidden;
  }

  .category-fill {
    height: 100%;
    background: #3E5C49;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .category-count {
    min-width: 40px;
    text-align: right;
    font-weight: 600;
    color: #C2571B;
  }

  /* Insights */
  .insights-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .insight-card {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 20px;
    border-left: 4px solid #3E5C49;
  }

  .insight-card.recommendation.high {
    border-left-color: #EF4444;
    background: rgba(239, 68, 68, 0.02);
  }

  .insight-card.recommendation.medium {
    border-left-color: #F59E0B;
    background: rgba(245, 158, 11, 0.02);
  }

  .insight-card.recommendation.low {
    border-left-color: #10B981;
    background: rgba(16, 185, 129, 0.02);
  }

  .insight-card.alert.critical {
    border-left-color: #DC2626;
    background: rgba(220, 38, 38, 0.02);
  }

  .insight-card.alert.warning {
    border-left-color: #D97706;
    background: rgba(217, 119, 6, 0.02);
  }

  .insight-card.alert.info {
    border-left-color: #2563EB;
    background: rgba(37, 99, 235, 0.02);
  }

  .insight-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .insight-title {
    flex: 1;
    font-weight: 600;
    color: #2E2E2E;
  }

  .priority-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .priority-badge.high {
    background: #FEE2E2;
    color: #DC2626;
  }

  .priority-badge.medium {
    background: #FEF3C7;
    color: #D97706;
  }

  .priority-badge.low {
    background: #D1FAE5;
    color: #059669;
  }

  .alert-count {
    background: #DC2626;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .insight-description {
    margin: 0 0 12px 0;
    color: #4B5563;
    line-height: 1.5;
  }

  .insight-impact {
    font-size: 14px;
    color: #6B7280;
  }

  /* Performance Circles */
  .performance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
  }

  .perf-card {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
  }

  .perf-title {
    font-weight: 600;
    color: #2E2E2E;
    margin-bottom: 16px;
  }

  .perf-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }

  .circular-chart {
    width: 100%;
    height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: #E5E7EB;
    stroke-width: 2.8;
  }

  .circle {
    fill: none;
    stroke: #3E5C49;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }

  .percentage {
    fill: #2E2E2E;
    font-size: 0.5em;
    text-anchor: middle;
    font-weight: 600;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }

  /* Utilitaires */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .stat-card {
    background: white;
    border: 1px solid rgba(229, 220, 194, 0.3);
    border-radius: 12px;
    padding: 20px;
  }

  .stat-card h4 {
    margin: 0 0 16px 0;
    color: #3E5C49;
    font-size: 16px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(229, 220, 194, 0.2);
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .big-stat {
    font-size: 32px;
    font-weight: 700;
    color: #C2571B;
    text-align: center;
    margin: 20px 0;
  }

  .stat-highlight {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-number {
    font-size: 48px;
    font-weight: 700;
    color: #C2571B;
  }

  .stat-text {
    color: #6B7280;
    font-weight: 500;
  }

  .mini-list {
    max-height: 200px;
    overflow-y: auto;
  }

  .mini-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: 13px;
    color: #6B7280;
  }

  .mini-item.more {
    font-style: italic;
    color: #9CA3AF;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .statistics-container {
      margin: 10px;
      max-height: calc(100vh - 20px);
    }

    .statistics-header {
      padding: 20px;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .header-actions {
      align-self: flex-end;
    }

    .statistics-content {
      padding: 20px;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .overview-charts {
      grid-template-columns: 1fr;
    }

    .daily-pattern {
      flex-wrap: wrap;
      gap: 8px;
    }

    .performance-grid {
      grid-template-columns: 1fr;
    }

    .tab-btn {
      padding: 12px 16px;
    }
  }
`;