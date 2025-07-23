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
  Activity
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
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 420px;
          width: 100%;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 80px;
            left: 20px;
            right: 20px;
            max-width: none;
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
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
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
        return { background: '#10B98115', border: '#10B98140', accent: '#10B981' };
      case 'error':
        return { background: '#EF444415', border: '#EF444440', accent: '#EF4444' };
      case 'warning':
        return { background: '#F59E0B15', border: '#F59E0B40', accent: '#F59E0B' };
      case 'info':
        return { background: '#3B82F615', border: '#3B82F640', accent: '#3B82F6' };
      default:
        return { background: '#6B728015', border: '#6B728040', accent: '#6B7280' };
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
        '--toast-accent': colors.accent
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
          background: var(--toast-bg);
          border: 1px solid var(--toast-border);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: auto;
          position: relative;
        }

        .toast-item.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-item.removing {
          transform: translateX(100%);
          opacity: 0;
        }

        .toast-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px;
          position: relative;
        }

        .toast-icon {
          width: 40px;
          height: 40px;
          background: var(--toast-accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .toast-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .toast-text {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .toast-message {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.4;
        }

        .toast-progress-container {
          margin-top: 12px;
        }

        .toast-progress-label {
          font-size: 12px;
          color: #9CA3AF;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .toast-progress-bar {
          height: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .toast-progress-fill {
          height: 100%;
          background: var(--toast-accent);
          border-radius: inherit;
          transition: width 0.3s ease;
          position: relative;
        }

        .toast-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: progressShimmer 1.5s infinite;
        }

        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .toast-action {
          background: var(--toast-accent);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toast-action:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .toast-close {
          background: rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #6B7280;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: rgba(0, 0, 0, 0.2);
          color: #374151;
        }

        .toast-timer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
        }

        .toast-timer-fill {
          height: 100%;
          background: var(--toast-accent);
          transition: width 0.1s linear;
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .toast-title {
            color: #F3F4F6;
          }
          
          .toast-message {
            color: #D1D5DB;
          }
          
          .toast-close {
            color: #9CA3AF;
          }
          
          .toast-close:hover {
            color: #F3F4F6;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .toast-item {
            border: 2px solid var(--toast-accent);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .toast-item {
            transition: opacity 0.2s ease;
          }

          .toast-icon::before,
          .toast-progress-fill::after {
            animation: none;
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
        title: 'Document ajouté !', 
        message: `"${title}" a été ajouté à votre collection`,
        icon: BookOpen,
        color: '#10B981'
      }),

    documentBorrowed: (title: string, borrower: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Document emprunté', 
        message: `"${title}" emprunté par ${borrower}`,
        icon: Users,
        color: '#F59E0B'
      }),

    documentReturned: (title: string) => 
      addToast({ 
        type: 'custom', 
        title: 'Document rendu', 
        message: `"${title}" a été rendu avec succès`,
        icon: CheckCircle,
        color: '#10B981'
      }),

    syncProgress: (progress: number) => {
      const id = 'sync-progress';
      if (progress === 100) {
        addToast({
          type: 'custom',
          title: 'Synchronisation terminée',
          message: 'Toutes vos données sont à jour',
          icon: CheckCircle,
          color: '#10B981'
        });
      } else {
        addToast({
          type: 'custom',
          title: 'Synchronisation en cours...',
          message: 'Mise à jour de vos données',
          icon: Activity,
          color: '#3B82F6',
          progress,
          sticky: true
        });
      }
    }
  };
};