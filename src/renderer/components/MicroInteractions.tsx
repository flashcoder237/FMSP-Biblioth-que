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
  color = '#3E5C49',
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
          box-shadow: 0 0 8px ${color}80;
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

// Bouton avec micro-interactions amélioré
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
          hover: 'linear-gradient(135deg, #2E453A 0%, #1E2F25 100%)',
          text: '#F3EED9',
          particles: '#3E5C49',
          shadow: 'rgba(62, 92, 73, 0.3)',
          border: 'none'
        };
      case 'secondary':
        return {
          bg: 'linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%)',
          hover: 'linear-gradient(135deg, #E5DCC2 0%, #D4C9A8 100%)',
          text: '#2E2E2E',
          particles: '#6E6E6E',
          shadow: 'rgba(110, 110, 110, 0.2)',
          border: '2px solid #E5DCC2'
        };
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
          hover: 'linear-gradient(135deg, #2E453A 0%, #1E2F25 100%)',
          text: '#F3EED9',
          particles: '#34D399',
          shadow: 'rgba(62, 92, 73, 0.4)',
          border: 'none'
        };
      case 'danger':
        return {
          bg: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
          hover: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)',
          text: '#F3EED9',
          particles: '#F87171',
          shadow: 'rgba(220, 38, 38, 0.3)',
          border: 'none'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
          hover: 'linear-gradient(135deg, #2E453A 0%, #1E2F25 100%)',
          text: '#F3EED9',
          particles: '#3E5C49',
          shadow: 'rgba(62, 92, 73, 0.3)',
          border: 'none'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      className={`micro-button ${variant} ${size} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...animationProps}
      style={{
        '--button-bg': styles.bg,
        '--button-hover': styles.hover,
        '--button-text': styles.text,
        '--button-particles': styles.particles,
        '--button-shadow': styles.shadow,
        '--button-border': styles.border,
        '--scale': isPressed ? '0.95' : isHovered ? '1.02' : '1',
        '--shadow': isHovered 
          ? `0 8px 25px ${styles.shadow}, 0 0 20px ${styles.shadow}` 
          : `0 2px 10px ${styles.shadow}`,
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
      
      <ParticleSystem isActive={showParticles} color={styles.particles} />
      
      {/* Ripple effect */}
      <div className={`ripple-effect ${isPressed ? 'active' : ''}`} />
      
      {/* Shine effect */}
      <div className="shine-effect" />
      
      <style>{`
        .micro-button {
          position: relative;
          background: var(--button-bg);
          color: var(--button-text);
          border: var(--button-border);
          border-radius: 12px;
          font-weight: 600;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(var(--scale));
          box-shadow: var(--shadow);
          filter: brightness(var(--brightness));
          opacity: ${disabled ? '0.6' : '1'};
          text-shadow: ${variant === 'secondary' ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
        }

        .micro-button.small {
          padding: 8px 16px;
          font-size: 13px;
          border-radius: 8px;
        }

        .micro-button.medium {
          padding: 12px 20px;
          font-size: 14px;
        }

        .micro-button.large {
          padding: 16px 24px;
          font-size: 16px;
          border-radius: 14px;
        }

        .micro-button:hover:not(:disabled) {
          background: var(--button-hover);
          letter-spacing: 0.3px;
        }

        .micro-button.secondary:hover:not(:disabled) {
          border-color: #2E2E2E;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 2;
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
          font-weight: 600;
          line-height: 1.2;
        }

        .ripple-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .ripple-effect.active {
          width: 300px;
          height: 300px;
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
          pointer-events: none;
        }

        .micro-button:hover:not(:disabled) .shine-effect {
          left: 100%;
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
            0 0 30px rgba(62, 92, 73, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Animation de pulse pour les boutons success */
        .micro-button.success {
          animation: ${isAnimating ? 'successPulse 0.6s ease' : 'none'};
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 30px rgba(62, 92, 73, 0.6);
          }
          100% { transform: scale(1); }
        }

        /* États de focus pour l'accessibilité */
        .micro-button:focus-visible {
          outline: 2px solid #C2571B;
          outline-offset: 2px;
        }

        /* Amélioration pour les petits écrans */
        @media (max-width: 768px) {
          .micro-button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </button>
  );
};

// Card avec micro-interactions améliorée
interface MicroCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const MicroCard: React.FC<MicroCardProps> = ({
  children,
  onClick,
  className = '',
  hoverable = true,
  variant = 'default'
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          border: '1px solid rgba(229, 220, 194, 0.2)',
          shadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          hoverShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
        };
      case 'outlined':
        return {
          background: 'transparent',
          border: '2px solid #E5DCC2',
          shadow: 'none',
          hoverShadow: '0 8px 25px rgba(62, 92, 73, 0.1)'
        };
      default:
        return {
          background: '#FFFFFF',
          border: '1px solid rgba(229, 220, 194, 0.15)',
          shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          hoverShadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`micro-card ${variant} ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      {...(hoverable ? animationProps : {})}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
        '--scale': isHovered ? '1.02' : '1',
        '--shadow': isHovered ? styles.hoverShadow : styles.shadow,
        '--border-opacity': isHovered ? '0.4' : '0.15',
        '--background': styles.background,
        '--border': styles.border
      } as React.CSSProperties}
    >
      {hoverable && (
        <div 
          className={`card-glow ${isHovered ? 'active' : ''}`}
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(62, 92, 73, 0.08), transparent 40%)`
          }}
        />
      )}
      
      <div className="card-border-gradient" />
      
      <div className="card-content">
        {children}
      </div>

      <style>{`
        .micro-card {
          position: relative;
          background: var(--background);
          border-radius: 16px;
          border: var(--border);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(var(--scale));
          box-shadow: var(--shadow);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .micro-card.elevated {
          border-radius: 20px;
        }

        .micro-card.outlined:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.02);
        }

        .micro-card.clickable {
          cursor: pointer;
        }

        .micro-card.clickable:active {
          transform: scale(0.98);
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

        .card-border-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(62, 92, 73, 0.3), 
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .micro-card:hover .card-border-gradient {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        /* Animation d'apparition améliorée */
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

        /* Focus visible pour l'accessibilité */
        .micro-card.clickable:focus-visible {
          outline: 2px solid #C2571B;
          outline-offset: 2px;
        }

        /* Amélioration pour les écrans tactiles */
        @media (hover: none) {
          .micro-card:hover {
            transform: none;
          }
          
          .micro-card.clickable:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

// Floating Action Button avec micro-interactions amélioré
interface FloatingButtonProps {
  icon: any;
  onClick: () => void;
  tooltip?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon: Icon,
  onClick,
  tooltip,
  color = '#3E5C49',
  size = 'medium'
}) => {
  const { isHovered, isPressed, animationProps } = useMicroInteractions();
  const [showTooltip, setShowTooltip] = useState(false);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '48px', height: '48px', iconSize: 18 };
      case 'large':
        return { width: '64px', height: '64px', iconSize: 24 };
      default:
        return { width: '56px', height: '56px', iconSize: 20 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div className="floating-button-container">
      <button
        className={`floating-button ${size}`}
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
          '--button-size': sizeStyles.width,
          '--scale': isPressed ? '0.9' : isHovered ? '1.1' : '1',
          '--shadow': isHovered 
            ? `0 12px 30px ${color}50, 0 0 20px ${color}30` 
            : `0 6px 20px ${color}30`,
          '--rotation': isHovered ? '5deg' : '0deg'
        } as React.CSSProperties}
      >
        <Icon size={sizeStyles.iconSize} />
        
        {/* Pulse ring */}
        <div className={`pulse-ring ${isHovered ? 'active' : ''}`} />
        
        {/* Shine effect */}
        <div className="fab-shine" />
      </button>

      {/* Tooltip amélioré */}
      {tooltip && (
        <div className={`floating-tooltip ${showTooltip ? 'visible' : ''}`}>
          {tooltip}
          <div className="tooltip-arrow" />
        </div>
      )}

      <style>{`
        .floating-button-container {
          position: relative;
        }

        .floating-button {
          position: relative;
          width: var(--button-size);
          height: var(--button-size);
          background: linear-gradient(135deg, var(--button-color) 0%, ${color}dd 100%);
          color: #F3EED9;
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
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .floating-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.2) 0%, 
            transparent 50%, 
            rgba(0, 0, 0, 0.1) 100%
          );
          border-radius: 50%;
          pointer-events: none;
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
          transition: all 0.4s ease;
        }

        .pulse-ring.active {
          transform: translate(-50%, -50%) scale(1.6);
          opacity: 0.4;
        }

        .fab-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, 
            transparent 30%, 
            rgba(255, 255, 255, 0.3) 50%, 
            transparent 70%
          );
          transform: rotate(-45deg) translate(-100%, -100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .floating-button:hover .fab-shine {
          transform: rotate(-45deg) translate(100%, 100%);
        }

        .floating-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: rgba(46, 46, 46, 0.95);
          color: #F3EED9;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: 1000;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .floating-tooltip.visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0px);
        }

        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid rgba(46, 46, 46, 0.95);
        }

        /* Tailles spécifiques */
        .floating-button.small {
          --button-size: 48px;
        }

        .floating-button.large {
          --button-size: 64px;
        }

        /* Focus visible pour l'accessibilité */
        .floating-button:focus-visible {
          outline: 2px solid #C2571B;
          outline-offset: 3px;
        }

        /* Animation d'apparition */
        .floating-button {
          animation: fabSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes fabSlideIn {
          from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        /* Amélioration pour les écrans tactiles */
        @media (hover: none) {
          .floating-button:hover {
            transform: scale(1);
          }
          
          .floating-button:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

// Loading avec micro-interactions amélioré
export const MicroLoader: React.FC<{ 
  size?: number; 
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}> = ({ 
  size = 24, 
  color = '#3E5C49',
  variant = 'spinner'
}) => {
  
  if (variant === 'dots') {
    return (
      <div className="micro-loader dots" style={{ width: size * 2, height: size / 2 }}>
        <div className="dot" style={{ backgroundColor: color }} />
        <div className="dot" style={{ backgroundColor: color }} />
        <div className="dot" style={{ backgroundColor: color }} />
        
        <style>{`
          .micro-loader.dots {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .dot {
            width: ${size / 4}px;
            height: ${size / 4}px;
            border-radius: 50%;
            animation: dotPulse 1.4s ease-in-out infinite both;
          }

          .dot:nth-child(1) { animation-delay: -0.32s; }
          .dot:nth-child(2) { animation-delay: -0.16s; }
          .dot:nth-child(3) { animation-delay: 0s; }

          @keyframes dotPulse {
            0%, 80%, 100% { 
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="micro-loader pulse" style={{ width: size, height: size }}>
        <div className="pulse-circle" style={{ backgroundColor: `${color}40` }} />
        <div className="pulse-circle" style={{ backgroundColor: `${color}60` }} />
        <div className="pulse-circle" style={{ backgroundColor: color }} />
        
        <style>{`
          .micro-loader.pulse {
            position: relative;
            display: inline-block;
          }

          .pulse-circle {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }

          .pulse-circle:nth-child(1) { animation-delay: 0s; }
          .pulse-circle:nth-child(2) { animation-delay: 0.4s; }
          .pulse-circle:nth-child(3) { animation-delay: 0.8s; }

          @keyframes pulse {
            0% { 
              transform: scale(0);
              opacity: 1;
            }
            100% { 
              transform: scale(1);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className="micro-loader spinner" style={{ width: size, height: size }}>
      <div className="spinner-ring" style={{ borderTopColor: color }} />
      
      <style>{`
        .micro-loader.spinner {
          position: relative;
          display: inline-block;
        }

        .spinner-ring {
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-top: 2px solid ${color};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};