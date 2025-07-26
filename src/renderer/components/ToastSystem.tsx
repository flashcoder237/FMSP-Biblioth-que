import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  BookOpen,
  Download,
  Upload,
  Zap,
  Bell,
  Star,
  Users,
  Activity,
  Check,
  AlertCircle,
  FileText,
  Shield,
  Settings,
  Heart
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'custom';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: any;
  color?: string;
  progress?: number;
  sticky?: boolean;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toastData: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      duration: 5000,
      ...toastData
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove if not sticky
    if (!toast.sticky && toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, updateToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={() => removeToast(toast.id)}
          index={index}
        />
      ))}
      
      <style>{`
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 450px;
          width: 100%;
          pointer-events: none;
        }

        .toast-container::before {
          content: '';
          position: fixed;
          top: 0;
          right: 0;
          width: 500px;
          height: 100vh;
          background: linear-gradient(135deg, 
            rgba(62, 92, 73, 0.01) 0%, 
            rgba(194, 87, 27, 0.005) 50%, 
            transparent 100%);
          pointer-events: none;
          z-index: -1;
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 80px;
            left: 16px;
            right: 16px;
            max-width: none;
            gap: 12px;
          }
          
          .toast-container::before {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 70px;
            left: 12px;
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
  index: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50 * index);
  }, [index]);

  useEffect(() => {
    // Progress bar animation
    if (toast.duration && !toast.sticky) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, (toast.duration! - elapsed) / toast.duration! * 100);
        setProgress(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.sticky]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(onRemove, 300);
  };

  const getIcon = () => {
    if (toast.icon) return toast.icon;
    
    switch (toast.type) {
      case 'success': return Check;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getColors = () => {
    if (toast.color) {
      return {
        background: `${toast.color}15`,
        border: `${toast.color}40`,
        accent: toast.color
      };
    }

    switch (toast.type) {
      case 'success':
        return { 
          background: 'rgba(62, 92, 73, 0.1)', 
          border: 'rgba(62, 92, 73, 0.25)', 
          accent: '#3E5C49',
          secondaryAccent: '#C2571B'
        };
      case 'error':
        return { 
          background: 'rgba(194, 87, 27, 0.1)', 
          border: 'rgba(194, 87, 27, 0.25)', 
          accent: '#C2571B',
          secondaryAccent: '#3E5C49'
        };
      case 'warning':
        return { 
          background: 'rgba(194, 87, 27, 0.08)', 
          border: 'rgba(194, 87, 27, 0.2)', 
          accent: '#C2571B',
          secondaryAccent: '#3E5C49'
        };
      case 'info':
        return { 
          background: 'rgba(62, 92, 73, 0.08)', 
          border: 'rgba(62, 92, 73, 0.2)', 
          accent: '#3E5C49',
          secondaryAccent: '#C2571B'
        };
      default:
        return { 
          background: 'rgba(62, 92, 73, 0.05)', 
          border: 'rgba(62, 92, 73, 0.15)', 
          accent: '#3E5C49',
          secondaryAccent: '#C2571B'
        };
    }
  };

  const Icon = getIcon();
  const colors = getColors();

  return (
    <div 
      className={`toast-item ${isVisible ? 'visible' : ''} ${isRemoving ? 'removing' : ''}`}
      style={{
        '--toast-bg': colors.background,
        '--toast-border': colors.border,
        '--toast-accent': colors.accent,
        '--toast-secondary': colors.secondaryAccent || colors.accent
      } as React.CSSProperties}
    >
      <div className="toast-content">
        <div className="toast-icon">
          <Icon size={20} />
        </div>
        
        <div className="toast-text">
          <div className="toast-title">{toast.title}</div>
          <div className="toast-message">{toast.message}</div>
          
          {toast.progress !== undefined && (
            <div className="toast-progress-container">
              <div className="toast-progress-label">
                Progression: {Math.round(toast.progress)}%
              </div>
              <div className="toast-progress-bar">
                <div 
                  className="toast-progress-fill"
                  style={{ width: `${toast.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {toast.action && (
          <button 
            className="toast-action"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}

        <button className="toast-close" onClick={handleRemove}>
          <X size={16} />
        </button>
      </div>

      {!toast.sticky && toast.duration && (
        <div className="toast-timer">
          <div 
            className="toast-timer-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <style>{`
        .toast-item {
          background: #F3EED9;
          border: 2px solid var(--toast-border);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 25px 50px rgba(62, 92, 73, 0.15),
            0 10px 30px rgba(194, 87, 27, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          overflow: hidden;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          position: relative;
          border-left: 6px solid var(--toast-accent);
        }

        .toast-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(62, 92, 73, 0.03) 0%, 
            rgba(194, 87, 27, 0.02) 50%, 
            rgba(243, 238, 217, 0.05) 100%);
          pointer-events: none;
        }

        .toast-item.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-item.removing {
          transform: translateX(100%) scale(0.9);
          opacity: 0;
        }

        .toast-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        .toast-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--toast-accent) 0%, var(--toast-secondary) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 20px rgba(62, 92, 73, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .toast-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.4), transparent);
          animation: shimmer 3s infinite ease-in-out;
        }

        .toast-icon::after {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 12px;
          background: linear-gradient(135deg, 
            rgba(243, 238, 217, 0.2) 0%, 
            transparent 50%, 
            rgba(243, 238, 217, 0.1) 100%);
        }

        @keyframes shimmer {
          0%, 100% { left: -100%; opacity: 0; }
          50% { left: 100%; opacity: 1; }
        }

        .toast-text {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 17px;
          font-weight: 700;
          color: #3E5C49;
          margin-bottom: 6px;
          line-height: 1.3;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .toast-message {
          font-size: 15px;
          color: #5A6B5D;
          line-height: 1.5;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .toast-progress-container {
          margin-top: 16px;
          padding: 12px;
          background: rgba(62, 92, 73, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(62, 92, 73, 0.1);
        }

        .toast-progress-label {
          font-size: 13px;
          color: #3E5C49;
          margin-bottom: 8px;
          font-weight: 600;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .toast-progress-bar {
          height: 8px;
          background: rgba(62, 92, 73, 0.15);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(62, 92, 73, 0.1);
        }

        .toast-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--toast-accent) 0%, var(--toast-secondary) 100%);
          border-radius: inherit;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          box-shadow: 
            0 2px 8px rgba(62, 92, 73, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .toast-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.5), transparent);
          animation: progressShimmer 2s infinite ease-in-out;
        }

        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .toast-action {
          background: linear-gradient(135deg, var(--toast-accent) 0%, var(--toast-secondary) 100%);
          color: #F3EED9;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 
            0 4px 15px rgba(62, 92, 73, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .toast-action:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(62, 92, 73, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .toast-action:active {
          transform: translateY(0) scale(0.98);
        }

        .toast-close {
          background: rgba(62, 92, 73, 0.1);
          border: none;
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          color: #5A6B5D;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .toast-close:hover {
          background: rgba(194, 87, 27, 0.15);
          color: #C2571B;
          transform: scale(1.1);
          box-shadow: 
            0 4px 12px rgba(194, 87, 27, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .toast-close:active {
          transform: scale(0.95);
        }

        .toast-timer {
          position: absolute;
          bottom: 0;
          left: 6px;
          right: 0;
          height: 4px;
          background: rgba(62, 92, 73, 0.15);
          border-radius: 0 0 16px 0;
        }

        .toast-timer-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--toast-accent) 0%, var(--toast-secondary) 100%);
          transition: width 0.1s linear;
          border-radius: inherit;
          box-shadow: 
            0 -2px 8px rgba(62, 92, 73, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        /* Animation d'entrée en cascade */
        .toast-item:nth-child(1) { animation-delay: 0s; }
        .toast-item:nth-child(2) { animation-delay: 0.1s; }
        .toast-item:nth-child(3) { animation-delay: 0.2s; }
        .toast-item:nth-child(4) { animation-delay: 0.3s; }

        /* Responsive design */
        @media (max-width: 768px) {
          .toast-content {
            padding: 20px;
            gap: 14px;
          }
          
          .toast-icon {
            width: 44px;
            height: 44px;
          }
          
          .toast-title {
            font-size: 16px;
          }
          
          .toast-message {
            font-size: 14px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .toast-item {
            border: 3px solid var(--toast-accent);
            background: #FFFFFF;
          }
          
          .toast-title {
            color: #000000;
          }
          
          .toast-message {
            color: #333333;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .toast-item {
            transition: opacity 0.3s ease;
          }

          .toast-icon::before,
          .toast-progress-fill::after {
            animation: none;
          }
          
          .toast-action:hover,
          .toast-close:hover {
            transform: none;
          }
        }

        /* Dark mode adaptation */
        @media (prefers-color-scheme: dark) {
          .toast-item {
            background: #2A3B2E;
            border-color: rgba(243, 238, 217, 0.2);
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.3),
              0 10px 30px rgba(62, 92, 73, 0.2),
              inset 0 1px 0 rgba(243, 238, 217, 0.1);
          }
          
          .toast-title {
            color: #F3EED9;
          }
          
          .toast-message {
            color: #C5D0C7;
          }
          
          .toast-close {
            background: rgba(243, 238, 217, 0.1);
            color: #C5D0C7;
          }
          
          .toast-close:hover {
            background: rgba(194, 87, 27, 0.2);
            color: #F3EED9;
          }
        }
      `}</style>
    </div>
  );
};

// Convenience hooks for common toast types
export const useQuickToast = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message: string, action?: Toast['action']) => 
      addToast({ type: 'success', title, message, action }),
    
    error: (title: string, message: string, action?: Toast['action']) => 
      addToast({ type: 'error', title, message, action, duration: 8000 }),
    
    warning: (title: string, message: string, action?: Toast['action']) => 
      addToast({ type: 'warning', title, message, action, duration: 6000 }),
    
    info: (title: string, message: string, action?: Toast['action']) => 
      addToast({ type: 'info', title, message, action }),

    documentAdded: (title: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Document ajouté avec succès !', 
        message: `"${title}" a été ajouté à votre bibliothèque`,
        icon: BookOpen,
        color: '#3E5C49'
      }),

    documentBorrowed: (title: string, borrower: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Emprunt enregistré', 
        message: `"${title}" emprunté par ${borrower}`,
        icon: Users,
        color: '#C2571B'
      }),

    documentReturned: (title: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Retour confirmé', 
        message: `"${title}" a été retourné avec succès`,
        icon: CheckCircle,
        color: '#3E5C49'
      }),

    borrowerAdded: (name: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Emprunteur ajouté', 
        message: `${name} a été ajouté au système`,
        icon: Users,
        color: '#3E5C49'
      }),

    exportCompleted: (format: string, filename: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Export terminé', 
        message: `Fichier ${format.toUpperCase()} "${filename}" généré avec succès`,
        icon: Download,
        color: '#3E5C49',
        duration: 7000
      }),

    backupCreated: (filename: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Sauvegarde créée', 
        message: `Sauvegarde "${filename}" créée avec succès`,
        icon: Upload,
        color: '#3E5C49'
      }),

    syncProgress: (progress: number) => {
      const id = 'sync-progress';
      if (progress === 100) {
        addToast({
          type: 'custom',
          title: 'Synchronisation terminée',
          message: 'Toutes vos données sont à jour',
          icon: CheckCircle,
          color: '#3E5C49'
        });
      } else {
        addToast({
          type: 'custom',
          title: 'Synchronisation en cours...',
          message: `Mise à jour de vos données (${Math.round(progress)}%)`,
          icon: Activity,
          color: '#C2571B',
          progress,
          sticky: true
        });
      }
    },

    overdueAlert: (count: number) => 
      addToast({ 
        type: 'warning', 
        title: 'Documents en retard !', 
        message: `${count} document${count > 1 ? 's' : ''} en retard de retour`,
        icon: AlertTriangle,
        duration: 10000,
        action: {
          label: 'Voir',
          onClick: () => {
            // Navigation vers les documents en retard
            console.log('Navigate to overdue documents');
          }
        }
      }),

    systemUpdate: (version: string) => 
      addToast({ 
        type: 'info', 
        title: 'Mise à jour disponible', 
        message: `Version ${version} disponible au téléchargement`,
        icon: Star,
        duration: 15000,
        action: {
          label: 'Télécharger',
          onClick: () => {
            // Ouvrir la page de téléchargement
            console.log('Open download page');
          }
        }
      }),

    settingsUpdated: () => 
      addToast({ 
        type: 'success', 
        title: 'Paramètres sauvegardés', 
        message: 'Vos préférences ont été mises à jour',
        icon: Settings,
        color: '#3E5C49'
      }),

    securityAlert: (message: string) => 
      addToast({ 
        type: 'warning', 
        title: 'Alerte de sécurité', 
        message: message,
        icon: Shield,
        duration: 12000,
        sticky: true
      }),

    welcome: (username: string) => 
      addToast({ 
        type: 'custom', 
        title: `Bienvenue ${username} !`, 
        message: 'Votre bibliothèque numérique est prête',
        icon: Heart,
        color: '#C2571B',
        duration: 6000
      }),

    reportGenerated: (reportType: string, itemCount: number) => 
      addToast({ 
        type: 'success', 
        title: 'Rapport généré', 
        message: `Rapport ${reportType} créé avec ${itemCount} élément${itemCount > 1 ? 's' : ''}`,
        icon: FileText,
        color: '#3E5C49'
      }),

    maintenance: (message: string) => 
      addToast({ 
        type: 'info', 
        title: 'Maintenance programmée', 
        message: message,
        icon: Settings,
        color: '#C2571B',
        duration: 20000,
        sticky: true
      })
  };
};