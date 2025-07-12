"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const TitleBar = () => {
    const handleMinimize = () => {
        window.electronAPI.minimizeWindow();
    };
    const handleMaximize = () => {
        window.electronAPI.maximizeWindow();
    };
    const handleClose = () => {
        window.electronAPI.closeWindow();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "titlebar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "titlebar-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "titlebar-left", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "app-icon", size: 20 }), (0, jsx_runtime_1.jsx)("span", { className: "app-title", children: "Biblioth\u00E8que" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "titlebar-controls", children: [(0, jsx_runtime_1.jsx)("button", { className: "control-button minimize", onClick: handleMinimize, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { size: 14 }) }), (0, jsx_runtime_1.jsx)("button", { className: "control-button maximize", onClick: handleMaximize, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Square, { size: 12 }) }), (0, jsx_runtime_1.jsx)("button", { className: "control-button close", onClick: handleClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 14 }) })] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.TitleBar = TitleBar;
