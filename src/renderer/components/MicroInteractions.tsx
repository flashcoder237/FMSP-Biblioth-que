import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart,
  Star,
  Sparkles,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Users,
  Plus,
  Search,
  Settings,
  Home
} from 'lucide-react';

// Hook pour gérer les micro-interactions
export const useMicroInteractions = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerSuccess = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return {
    isHovered,
    isPressed,
    isAnimating,
    setIsHovered,
    setIsPressed,
    triggerSuccess,
    animationProps: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onMouseDown: () => setIsPressed(true),
      onMouseUp: () => setIsPressed(false),
    }
  };
};

// Composant de particules animées
interface ParticleSystemProps {
  isActive: boolean;
  color?: string;
  count?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  isActive, 
  color = '#10B981',
  count = 8 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      const particles = Array.from({ length: count }, (_, i) => {
        const particle = document.createElement('div');
        particle.className = 'micro-particle';
        particle.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
        `;
        
        const angle = (360 / count) * i;
        const distance = 30 + Math.random() * 20;
        const endX = Math.cos(angle * Math.PI / 180) * distance;
        const endY = Math.sin(angle * Math.PI / 180) * distance;
        
        particle.animate([
          { 
            transform: 'translate(0, 0) scale(0)',
            opacity: 1
          },
          { 
            transform: `translate(${endX}px, ${endY}px) scale(1)`,
            opacity: 0
          }
        ], {
          duration: 600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        containerRef.current?.appendChild(particle);
        
        setTimeout(() => {
          particle.remove();
        }, 600);
      });
    }
  }, [isActive, color, count]);

  return <div ref={containerRef} className="particle-container" />;
};

// Bouton avec micro-interactions
interface MicroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: any;
  disabled?: boolean;
  className?: string;
}

export const MicroButton: React.FC<MicroButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  disabled = false,
  className = ''
}) => {
  const { isHovered, isPressed, isAnimating, animationProps, triggerSuccess } = useMicroInteractions();
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setShowParticles(true);
    triggerSuccess();
    onClick?.();
    
    setTimeout(() => setShowParticles(false), 100);
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: '#3E5C49',
          hover: '#2E453A',
          particles: '#10B981'
        };
      case 'secondary':
        return {
          bg: '#F3F4F6',
          hover: '#E5E7EB',
          particles: '#6B7280'
        };
      case 'success':
        return {
          bg: '#10B981',
          hover: '#059669',
          particles: '#34D399'
        };
      case 'danger':
        return {
          bg: '#EF4444',
          hover: '#DC2626',
          particles: '#F87171'
        };
      default:
        return {
          bg: '#3E5C49',
          hover: '#2E453A',
          particles: '#10B981'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <button
      className={`micro-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...animationProps}
      style={{
        '--button-bg': colors.bg,
        '--button-hover': colors.hover,
        '--button-particles': colors.particles,
        '--scale': isPressed ? '0.95' : isHovered ? '1.02' : '1',
        '--shadow': isHovered ? '0 8px 25px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
        '--brightness': isPressed ? '0.9' : '1'
      } as React.CSSProperties}
    >
      <div className="button-content">
        {Icon && (
          <div className={`button-icon ${isAnimating ? 'success-bounce' : ''}`}>
            <Icon size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
          </div>
        )}
        <span className="button-text">{children}</span>
      </div>
      
      <ParticleSystem isActive={showParticles} color={colors.particles} />
      
      {/* Ripple effect */}
      <div className={`ripple-effect ${isPressed ? 'active' : ''}`} />
      
      <style>{`
        .micro-button {
          position: relative;
          background: var(--button-bg);
          color: ${variant === 'secondary' ? '#374151' : 'white'};
          border: none;
          border-radius: 12px;
          padding: ${size === 'small' ? '8px 16px' : size === 'large' ? '16px 24px' : '12px 20px'};
          font-size: ${size === 'small' ? '14px' : size === 'large' ? '16px' : '15px'};
          font-weight: 600;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(var(--scale));
          box-shadow: var(--shadow);
          filter: brightness(var(--brightness));
          opacity: ${disabled ? '0.6' : '1'};
        }

        .micro-button:hover:not(:disabled) {
          background: var(--button-hover);
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .button-icon.success-bounce {
          animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .button-text {
          position: relative;
        }

        .ripple-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .ripple-effect.active {
          width: 300px;
          height: 300px;
        }

        .particle-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        @keyframes successBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        /* Glow effect pour les boutons primaires */
        .micro-button.primary:hover:not(:disabled) {
          box-shadow: 
            var(--shadow),
            0 0 20px rgba(62, 92, 73, 0.3);
        }

        /* Animation de pulse pour les boutons success */
        .micro-button.success {
          animation: ${isAnimating ? 'successPulse 0.6s ease' : 'none'};
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
};

// Card avec micro-interactions
interface MicroCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const MicroCard: React.FC<MicroCardProps> = ({
  children,
  onClick,
  className = '',
  hoverable = true
}) => {
  const { isHovered, animationProps } = useMicroInteractions();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      className={`micro-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      {...(hoverable ? animationProps : {})}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
        '--scale': isHovered ? '1.02' : '1',
        '--shadow': isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.12)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        '--border-opacity': isHovered ? '0.3' : '0.1'
      } as React.CSSProperties}
    >
      {hoverable && (
        <div 
          className={`card-glow ${isHovered ? 'active' : ''}`}
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(62, 92, 73, 0.1), transparent 40%)`
          }}
        />
      )}
      
      <div className="card-content">
        {children}
      </div>

      <style>{`
        .micro-card {
          position: relative;
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(229, 220, 194, var(--border-opacity, 0.1));
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(var(--scale));
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .micro-card.clickable {
          cursor: pointer;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .card-glow.active {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        /* Animation d'apparition */
        .micro-card {
          animation: cardSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Floating Action Button avec micro-interactions
interface FloatingButtonProps {
  icon: any;
  onClick: () => void;
  tooltip?: string;
  color?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon: Icon,
  onClick,
  tooltip,
  color = '#3E5C49'
}) => {
  const { isHovered, isPressed, animationProps } = useMicroInteractions();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="floating-button-container">
      <button
        className="floating-button"
        onClick={onClick}
        onMouseEnter={() => {
          animationProps.onMouseEnter();
          if (tooltip) setShowTooltip(true);
        }}
        onMouseLeave={() => {
          animationProps.onMouseLeave();
          setShowTooltip(false);
        }}
        onMouseDown={animationProps.onMouseDown}
        onMouseUp={animationProps.onMouseUp}
        style={{
          '--button-color': color,
          '--scale': isPressed ? '0.9' : isHovered ? '1.1' : '1',
          '--shadow': isHovered 
            ? `0 12px 30px ${color}40` 
            : `0 6px 20px ${color}20`,
          '--rotation': isHovered ? '5deg' : '0deg'
        } as React.CSSProperties}
      >
        <Icon size={20} />
        
        {/* Pulse ring */}
        <div className={`pulse-ring ${isHovered ? 'active' : ''}`} />
      </button>

      {/* Tooltip */}
      {tooltip && (
        <div className={`floating-tooltip ${showTooltip ? 'visible' : ''}`}>
          {tooltip}
        </div>
      )}

      <style>{`
        .floating-button-container {
          position: relative;
        }

        .floating-button {
          position: relative;
          width: 56px;
          height: 56px;
          background: var(--button-color);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(var(--scale)) rotate(var(--rotation));
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid var(--button-color);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .pulse-ring.active {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0.3;
        }

        .floating-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 1000;
        }

        .floating-tooltip.visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(-12px);
        }

        .floating-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

// Loading avec micro-interactions
export const MicroLoader: React.FC<{ size?: number; color?: string }> = ({ 
  size = 24, 
  color = '#3E5C49' 
}) => {
  return (
    <div className="micro-loader" style={{ width: size, height: size }}>
      <div className="loader-ring" style={{ borderColor: `${color}20`, borderTopColor: color }} />
      <div className="loader-pulse" style={{ backgroundColor: `${color}30` }} />
      
      <style>{`
        .micro-loader {
          position: relative;
          display: inline-block;
        }

        .loader-ring {
          width: 100%;
          height: 100%;
          border: 2px solid;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loader-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60%;
          height: 60%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};