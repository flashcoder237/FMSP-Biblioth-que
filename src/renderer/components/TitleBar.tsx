import React from 'react';
import { Minus, Square, X, BookOpen } from 'lucide-react';

export const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="titlebar">
      <div className="titlebar-content">
        <div className="titlebar-left">
          <div className="app-logo">
            <BookOpen size={18} />
          </div>
          <span className="app-title">Bibliothèque</span>
          <div className="title-separator"></div>
          <span className="app-subtitle">Gestion moderne de collection</span>
        </div>
        
        <div className="titlebar-center">
          {/* Search bar could go here in future */}
        </div>
        
        <div className="titlebar-controls">
          <button className="control-button minimize" onClick={handleMinimize} title="Réduire">
            <Minus size={12} />
          </button>
          <button className="control-button maximize" onClick={handleMaximize} title="Agrandir">
            <Square size={10} />
          </button>
          <button className="control-button close" onClick={handleClose} title="Fermer">
            <X size={12} />
          </button>
        </div>
      </div>
      
      <style>{`
        .titlebar {
          height: 48px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-bottom: 1px solid rgba(46, 69, 58, 0.2);
          -webkit-app-region: drag;
          position: relative;
          z-index: 1000;
        }
        
        .titlebar::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.3), transparent);
        }
        
        .titlebar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 8px 0 16px;
          position: relative;
        }
        
        .titlebar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        
        .app-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 8px;
          color: #F3EED9;
          flex-shrink: 0;
        }
        
        .app-title {
          font-size: 14px;
          font-weight: 700;
          color: #F3EED9;
          letter-spacing: -0.2px;
          flex-shrink: 0;
        }
        
        .title-separator {
          width: 1px;
          height: 16px;
          background: rgba(243, 238, 217, 0.3);
          flex-shrink: 0;
        }
        
        .app-subtitle {
          font-size: 12px;
          font-weight: 400;
          color: rgba(243, 238, 217, 0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .titlebar-center {
          flex: 2;
          display: flex;
          justify-content: center;
          margin: 0 16px;
        }
        
        .titlebar-controls {
          display: flex;
          align-items: center;
          -webkit-app-region: no-drag;
          flex-shrink: 0;
        }
        
        .control-button {
          width: 44px;
          height: 32px;
          border: none;
          background: transparent;
          color: #F3EED9;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.15s ease;
          opacity: 0.8;
          position: relative;
        }
        
        .control-button::before {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 2px;
          background: transparent;
          transition: background 0.15s ease;
        }
        
        .control-button:hover {
          opacity: 1;
        }
        
        .control-button:hover::before {
          background: rgba(243, 238, 217, 0.1);
        }
        
        .control-button:active::before {
          background: rgba(243, 238, 217, 0.2);
        }
        
        .control-button.close:hover::before {
          background: #E81123;
        }
        
        .control-button.close:hover {
          color: #FFFFFF;
        }
        
        .control-button.close:active::before {
          background: #C50E1F;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .app-subtitle {
            display: none;
          }
          
          .title-separator {
            display: none;
          }
          
          .titlebar-content {
            padding: 0 4px 0 12px;
          }
        }
        
        @media (max-width: 480px) {
          .titlebar-left {
            gap: 8px;
          }
          
          .app-title {
            font-size: 13px;
          }
          
          .control-button {
            width: 40px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};