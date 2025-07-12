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
          <BookOpen className="app-icon" size={20} />
          <span className="app-title">Bibliothèque</span>
        </div>
        <div className="titlebar-controls">
          <button className="control-button minimize" onClick={handleMinimize}>
            <Minus size={14} />
          </button>
          <button className="control-button maximize" onClick={handleMaximize}>
            <Square size={12} />
          </button>
          <button className="control-button close" onClick={handleClose}>
            <X size={14} />
          </button>
        </div>
      </div>
      
      <style>{`
        .titlebar {
          height: 40px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          -webkit-app-region: drag;
        }
        
        .titlebar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          padding: 0 16px;
        }
        
        .titlebar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
        }
        
        .app-icon {
          opacity: 0.9;
        }
        
        .app-title {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }
        
        .titlebar-controls {
          display: flex;
          -webkit-app-region: no-drag;
        }
        
        .control-button {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          opacity: 0.8;
        }
        
        .control-button:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .control-button.close:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
};