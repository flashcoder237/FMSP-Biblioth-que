import React, { useState, useEffect } from 'react';
import { 
  Book, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  Award,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Stats } from '../../types';

interface EnhancedStatsProps {
  stats: Stats;
  className?: string;
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(startCount + (end - startCount) * easeOutCubic);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export const EnhancedStats: React.FC<EnhancedStatsProps> = ({ stats, className = '' }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const statsData = [
    {
      id: 'total',
      title: 'Collection Totale',
      value: stats.totalBooks,
      icon: Book,
      color: '#3E5C49',
      gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6A55 100%)',
      description: 'Documents dans la bibliothèque',
      trend: '+12% ce mois',
      trendPositive: true
    },
    {
      id: 'available',
      title: 'Disponibles',
      value: stats.availableBooks,
      icon: BookOpen,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      description: 'Prêts à être empruntés',
      percentage: stats.totalBooks > 0 ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0
    },
    {
      id: 'borrowed',
      title: 'En Circulation',
      value: stats.borrowedBooks,
      icon: Clock,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      description: 'Actuellement empruntés',
      percentage: stats.totalBooks > 0 ? Math.round((stats.borrowedBooks / stats.totalBooks) * 100) : 0
    },
    {
      id: 'borrowers',
      title: 'Emprunteurs Actifs',
      value: stats.totalBorrowers,
      icon: Users,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      description: 'Membres enregistrés',
      breakdown: `${stats.totalStudents} étudiants, ${stats.totalStaff} personnel`
    },
    {
      id: 'authors',
      title: 'Auteurs',
      value: stats.totalAuthors,
      icon: Star,
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      description: 'Auteurs dans la collection'
    },
    {
      id: 'categories',
      title: 'Catégories',
      value: stats.totalCategories,
      icon: Target,
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      description: 'Genres et classifications'
    }
  ];

  // Calculate library efficiency metrics
  const efficiency = {
    utilization: stats.totalBooks > 0 ? Math.round((stats.borrowedBooks / stats.totalBooks) * 100) : 0,
    availability: stats.totalBooks > 0 ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0,
    activity: stats.totalBorrowers > 0 ? Math.round((stats.borrowedBooks / stats.totalBorrowers) * 100) : 0
  };

  return (
    <div className={`enhanced-stats ${className}`}>
      {/* Main Stats Grid */}
      <div className="stats-grid">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className={`stat-card ${hoveredCard === stat.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              '--card-gradient': stat.gradient,
              '--card-color': stat.color
            } as React.CSSProperties}
          >
            <div className="stat-card-bg"></div>
            
            <div className="stat-header">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-trend">
                {stat.trend && (
                  <span className={`trend ${stat.trendPositive ? 'positive' : 'negative'}`}>
                    <TrendingUp size={14} />
                    {stat.trend}
                  </span>
                )}
                {stat.percentage !== undefined && (
                  <span className="percentage">{stat.percentage}%</span>
                )}
              </div>
            </div>

            <div className="stat-content">
              <div className="stat-value">
                <AnimatedCounter end={stat.value} duration={1500} />
              </div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-description">{stat.description}</div>
              {stat.breakdown && (
                <div className="stat-breakdown">{stat.breakdown}</div>
              )}
            </div>

            <div className="stat-decoration">
              <div className="floating-icon">
                <stat.icon size={120} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Efficiency Metrics */}
      <div className="efficiency-panel">
        <div className="efficiency-header">
          <Activity size={20} />
          <h3>Métriques de Performance</h3>
        </div>
        <div className="efficiency-metrics">
          <div className="efficiency-item">
            <div className="efficiency-label">Taux d'Utilisation</div>
            <div className="efficiency-bar">
              <div 
                className="efficiency-fill utilization" 
                style={{ width: `${efficiency.utilization}%` }}
              ></div>
            </div>
            <div className="efficiency-value">{efficiency.utilization}%</div>
          </div>
          <div className="efficiency-item">
            <div className="efficiency-label">Disponibilité</div>
            <div className="efficiency-bar">
              <div 
                className="efficiency-fill availability" 
                style={{ width: `${efficiency.availability}%` }}
              ></div>
            </div>
            <div className="efficiency-value">{efficiency.availability}%</div>
          </div>
          <div className="efficiency-item">
            <div className="efficiency-label">Activité Moyenne</div>
            <div className="efficiency-bar">
              <div 
                className="efficiency-fill activity" 
                style={{ width: `${Math.min(efficiency.activity, 100)}%` }}
              ></div>
            </div>
            <div className="efficiency-value">{efficiency.activity}%</div>
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-stats {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 28px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(10px);
          cursor: pointer;
          min-height: 200px;
        }

        .stat-card-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--card-gradient);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: inherit;
        }

        .stat-card.hovered .stat-card-bg {
          opacity: 0.08;
        }

        .stat-card.hovered {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(62, 92, 73, 0.15),
            0 8px 16px rgba(62, 92, 73, 0.1);
          border-color: var(--card-color);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          background: var(--card-gradient);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .stat-card.hovered .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-trend {
          text-align: right;
          font-size: 12px;
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10B981;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .trend.negative {
          color: #EF4444;
        }

        .percentage {
          background: var(--card-gradient);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 11px;
        }

        .stat-content {
          position: relative;
          z-index: 2;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1A1A1A;
          line-height: 1;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .stat-card.hovered .stat-value {
          color: var(--card-color);
        }

        .stat-title {
          font-size: 16px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 6px;
        }

        .stat-description {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
        }

        .stat-breakdown {
          font-size: 12px;
          color: #9CA3AF;
          font-style: italic;
        }

        .stat-decoration {
          position: absolute;
          top: 0;
          right: -20px;
          width: 140px;
          height: 140px;
          opacity: 0.03;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .floating-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-color);
          transform: rotate(15deg);
        }

        .stat-card.hovered .stat-decoration {
          opacity: 0.08;
          transform: scale(1.1) rotate(-5deg);
        }

        /* Efficiency Panel */
        .efficiency-panel {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(10px);
        }

        .efficiency-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: #374151;
        }

        .efficiency-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .efficiency-metrics {
          display: grid;
          gap: 20px;
        }

        .efficiency-item {
          display: grid;
          grid-template-columns: 1fr 3fr auto;
          align-items: center;
          gap: 16px;
        }

        .efficiency-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .efficiency-bar {
          height: 12px;
          background: rgba(229, 220, 194, 0.3);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .efficiency-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }

        .efficiency-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .efficiency-fill.utilization {
          background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
        }

        .efficiency-fill.availability {
          background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
        }

        .efficiency-fill.activity {
          background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
        }

        .efficiency-value {
          font-size: 16px;
          font-weight: 700;
          color: #1A1A1A;
          min-width: 50px;
          text-align: right;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 20px;
            min-height: 160px;
          }

          .stat-value {
            font-size: 2rem;
          }

          .efficiency-item {
            grid-template-columns: 1fr;
            gap: 8px;
            text-align: center;
          }

          .efficiency-bar {
            order: 2;
          }

          .efficiency-value {
            order: 3;
            text-align: center;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .stat-card {
            border: 2px solid #000;
            background: #fff;
          }

          .stat-value, .stat-title {
            color: #000;
          }

          .efficiency-fill {
            border: 1px solid #000;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .stat-card, .stat-icon, .stat-decoration, .efficiency-fill {
            transition: none;
          }

          .floating-icon {
            transform: none;
          }

          .efficiency-fill::after {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};