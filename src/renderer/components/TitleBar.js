"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBar = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var TitleBar = function () {
    var handleMinimize = function () {
        window.electronAPI.minimizeWindow();
    };
    var handleMaximize = function () {
        window.electronAPI.maximizeWindow();
    };
    var handleClose = function () {
        window.electronAPI.closeWindow();
    };
    return (<div className="titlebar">
      <div className="titlebar-content">
        <div className="titlebar-left">
          <div className="app-logo">
            <lucide_react_1.BookOpen size={18}/>
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
            <lucide_react_1.Minus size={12}/>
          </button>
          <button className="control-button maximize" onClick={handleMaximize} title="Agrandir">
            <lucide_react_1.Square size={10}/>
          </button>
          <button className="control-button close" onClick={handleClose} title="Fermer">
            <lucide_react_1.X size={12}/>
          </button>
        </div>
      </div>
      
      <style>{"\n        .titlebar {\n          height: 48px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          border-bottom: 1px solid rgba(46, 69, 58, 0.2);\n          -webkit-app-region: drag;\n          position: relative;\n          z-index: 1000;\n        }\n        \n        .titlebar::after {\n          content: '';\n          position: absolute;\n          bottom: 0;\n          left: 0;\n          right: 0;\n          height: 1px;\n          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.3), transparent);\n        }\n        \n        .titlebar-content {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          height: 100%;\n          padding: 0 8px 0 16px;\n          position: relative;\n        }\n        \n        .titlebar-left {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .app-logo {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          width: 32px;\n          height: 32px;\n          background: rgba(243, 238, 217, 0.15);\n          border-radius: 8px;\n          color: #F3EED9;\n          flex-shrink: 0;\n        }\n        \n        .app-title {\n          font-size: 14px;\n          font-weight: 700;\n          color: #F3EED9;\n          letter-spacing: -0.2px;\n          flex-shrink: 0;\n        }\n        \n        .title-separator {\n          width: 1px;\n          height: 16px;\n          background: rgba(243, 238, 217, 0.3);\n          flex-shrink: 0;\n        }\n        \n        .app-subtitle {\n          font-size: 12px;\n          font-weight: 400;\n          color: rgba(243, 238, 217, 0.8);\n          white-space: nowrap;\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n        \n        .titlebar-center {\n          flex: 2;\n          display: flex;\n          justify-content: center;\n          margin: 0 16px;\n        }\n        \n        .titlebar-controls {\n          display: flex;\n          align-items: center;\n          -webkit-app-region: no-drag;\n          flex-shrink: 0;\n        }\n        \n        .control-button {\n          width: 44px;\n          height: 32px;\n          border: none;\n          background: transparent;\n          color: #F3EED9;\n          cursor: pointer;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          border-radius: 4px;\n          transition: all 0.15s ease;\n          opacity: 0.8;\n          position: relative;\n        }\n        \n        .control-button::before {\n          content: '';\n          position: absolute;\n          inset: 4px;\n          border-radius: 2px;\n          background: transparent;\n          transition: background 0.15s ease;\n        }\n        \n        .control-button:hover {\n          opacity: 1;\n        }\n        \n        .control-button:hover::before {\n          background: rgba(243, 238, 217, 0.1);\n        }\n        \n        .control-button:active::before {\n          background: rgba(243, 238, 217, 0.2);\n        }\n        \n        .control-button.close:hover::before {\n          background: #E81123;\n        }\n        \n        .control-button.close:hover {\n          color: #FFFFFF;\n        }\n        \n        .control-button.close:active::before {\n          background: #C50E1F;\n        }\n        \n        /* Responsive adjustments */\n        @media (max-width: 768px) {\n          .app-subtitle {\n            display: none;\n          }\n          \n          .title-separator {\n            display: none;\n          }\n          \n          .titlebar-content {\n            padding: 0 4px 0 12px;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .titlebar-left {\n            gap: 8px;\n          }\n          \n          .app-title {\n            font-size: 13px;\n          }\n          \n          .control-button {\n            width: 40px;\n            height: 30px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.TitleBar = TitleBar;
