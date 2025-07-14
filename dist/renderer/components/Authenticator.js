"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const Authentication = ({ onLogin }) => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [mode, setMode] = (0, react_1.useState)('login');
    const [isOnline, setIsOnline] = (0, react_1.useState)(navigator.onLine);
    const [registerData, setRegisterData] = (0, react_1.useState)({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        institutionName: '',
        fullName: ''
    });
    react_1.default.useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            onLogin({ username, password });
        }
        catch (err) {
            setError(err.message || 'Erreur de connexion');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (registerData.password !== registerData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (registerData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            setMode('login');
            setUsername(registerData.username);
            alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        }
        catch (err) {
            setError(err.message || 'Erreur lors de la création du compte');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOfflineMode = () => {
        onLogin({ username: 'offline', password: 'offline' });
    };
    const demoCredentials = [
        { username: 'admin', password: 'admin', role: 'Administrateur' },
        { username: 'biblio', password: 'biblio', role: 'Bibliothécaire' },
        { username: 'demo', password: 'demo', role: 'Utilisateur' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "auth-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-background", children: [(0, jsx_runtime_1.jsx)("div", { className: "auth-pattern" }), (0, jsx_runtime_1.jsxs)("div", { className: "floating-elements", children: [(0, jsx_runtime_1.jsx)("div", { className: "floating-book" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-book" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-book" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "auth-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-branding", children: [(0, jsx_runtime_1.jsx)("div", { className: "brand-logo", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h1", { className: "brand-title", children: "Biblioth\u00E8que" }), (0, jsx_runtime_1.jsx)("p", { className: "brand-subtitle", children: "Syst\u00E8me de gestion moderne et intuitif" }), (0, jsx_runtime_1.jsxs)("div", { className: "features-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Gestion des emprunteurs" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Statistiques en temps r\u00E9el" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "S\u00E9curis\u00E9 et fiable" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Synchronisation cloud" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: `connection-status ${isOnline ? 'online' : 'offline'}`, children: [isOnline ? (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { size: 16 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: isOnline ? 'En ligne' : 'Hors ligne' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "auth-form-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "auth-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-tabs", children: [(0, jsx_runtime_1.jsx)("button", { className: `auth-tab ${mode === 'login' ? 'active' : ''}`, onClick: () => setMode('login'), children: "Connexion" }), (0, jsx_runtime_1.jsx)("button", { className: `auth-tab ${mode === 'register' ? 'active' : ''}`, onClick: () => setMode('register'), children: "Inscription" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mode-indicator", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: mode === 'login' ? 'Connectez-vous' : 'Créez votre compte' })] })] }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "error-message", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: error })] })), mode === 'login' ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleLogin, className: "auth-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom d'utilisateur" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "auth-input", placeholder: "Entrez votre nom d'utilisateur", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "auth-input", placeholder: "Entrez votre mot de passe", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !username || !password, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Connexion..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 18 }), "Se connecter"] })) }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "auth-button secondary", onClick: handleOfflineMode, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { size: 18 }), "Mode hors ligne"] })] })) : ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleRegister, className: "auth-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom complet" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.fullName, onChange: (e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value })), className: "auth-input", placeholder: "Votre nom complet", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom d'utilisateur" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.username, onChange: (e) => setRegisterData(prev => ({ ...prev, username: e.target.value })), className: "auth-input", placeholder: "Nom d'utilisateur", required: true, disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "@" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: registerData.email, onChange: (e) => setRegisterData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "votre@email.com", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.institutionName, onChange: (e) => setRegisterData(prev => ({ ...prev, institutionName: e.target.value })), className: "auth-input", placeholder: "Nom de votre \u00E9cole/universit\u00E9", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.password, onChange: (e) => setRegisterData(prev => ({ ...prev, password: e.target.value })), className: "auth-input", placeholder: "Mot de passe", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Confirmer le mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.confirmPassword, onChange: (e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value })), className: "auth-input", placeholder: "Confirmer", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !registerData.username || !registerData.password || !registerData.email, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Cr\u00E9ation..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 18 }), "Cr\u00E9er le compte"] })) })] })), mode === 'login' && ((0, jsx_runtime_1.jsxs)("div", { className: "demo-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "demo-header", children: (0, jsx_runtime_1.jsx)("span", { children: "Comptes de d\u00E9monstration" }) }), (0, jsx_runtime_1.jsx)("div", { className: "demo-credentials", children: demoCredentials.map((cred, index) => ((0, jsx_runtime_1.jsxs)("button", { className: "demo-credential", onClick: () => {
                                                    setUsername(cred.username);
                                                    setPassword(cred.password);
                                                }, disabled: isLoading, children: [(0, jsx_runtime_1.jsxs)("div", { className: "demo-info", children: [(0, jsx_runtime_1.jsx)("span", { className: "demo-username", children: cred.username }), (0, jsx_runtime_1.jsx)("span", { className: "demo-role", children: cred.role })] }), (0, jsx_runtime_1.jsx)("span", { className: "demo-password", children: cred.password })] }, index))) })] }))] }) })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .auth-container {
          height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
        }
        
        .auth-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .auth-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .floating-book {
          position: absolute;
          width: 24px;
          height: 32px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 4px;
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-book:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-book:nth-child(2) {
          top: 60%;
          left: 15%;
          animation-delay: 2s;
        }
        
        .floating-book:nth-child(3) {
          top: 40%;
          left: 5%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        .auth-content {
          display: flex;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .auth-branding {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          color: #F3EED9;
        }
        
        .brand-logo {
          width: 80px;
          height: 80px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          border: 1px solid rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .brand-title {
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }
        
        .brand-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0 0 48px 0;
          line-height: 1.5;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 16px;
          opacity: 0.9;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          width: fit-content;
        }
        
        .connection-status.online {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .connection-status.offline {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
          border: 1px solid rgba(255, 152, 0, 0.3);
        }
        
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        
        .auth-card {
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 0;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow: hidden;
        }
        
        .auth-header {
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, #F3EED9 0%, #EAEADC 100%);
          border-bottom: 1px solid #E5DCC2;
        }
        
        .auth-tabs {
          display: flex;
          gap: 4px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
        }
        
        .auth-tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .auth-tab.active {
          background: #3E5C49;
          color: #F3EED9;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.2);
        }
        
        .mode-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #3E5C49;
          font-size: 16px;
          font-weight: 600;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 12px;
          margin: 0 32px 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .auth-form {
          padding: 32px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-wrapper svg,
        .input-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
          pointer-events: none;
        }
        
        .input-icon {
          font-size: 16px;
          font-weight: 600;
        }
        
        .auth-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .auth-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .auth-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #F3EED9;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .password-toggle:hover {
          color: #2E2E2E;
          background: rgba(110, 110, 110, 0.1);
        }
        
        .auth-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          margin-bottom: 12px;
        }
        
        .auth-button.primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .auth-button.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .auth-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .auth-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .demo-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #E5DCC2;
        }
        
        .demo-header {
          font-size: 12px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .demo-credentials {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .demo-credential {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .demo-credential:hover:not(:disabled) {
          background: rgba(62, 92, 73, 0.1);
          border-color: rgba(62, 92, 73, 0.2);
          transform: translateY(-1px);
        }
        
        .demo-credential:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .demo-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .demo-username {
          font-size: 14px;
          font-weight: 600;
          color: #3E5C49;
        }
        
        .demo-role {
          font-size: 11px;
          color: #6E6E6E;
        }
        
        .demo-password {
          font-size: 12px;
          font-family: 'Courier New', monospace;
          background: rgba(110, 110, 110, 0.1);
          color: #6E6E6E;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .auth-content {
            flex-direction: column;
          }
          
          .auth-branding {
            padding: 40px;
            text-align: center;
            flex: none;
          }
          
          .brand-title {
            font-size: 36px;
          }
          
          .brand-subtitle {
            font-size: 18px;
          }
          
          .features-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
          
          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 8px;
            min-width: 120px;
          }
        }
        
        @media (max-width: 768px) {
          .auth-branding {
            padding: 32px 20px;
          }
          
          .auth-form-container {
            padding: 20px;
          }
          
          .auth-card {
            max-width: none;
            border-radius: 20px;
          }
          
          .auth-header {
            padding: 24px 20px 20px;
          }
          
          .auth-form {
            padding: 24px 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .brand-title {
            font-size: 28px;
          }
          
          .brand-subtitle {
            font-size: 16px;
          }
          
          .features-list {
            flex-direction: column;
            gap: 12px;
          }
          
          .feature-item {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .auth-branding {
            padding: 24px 16px;
          }
          
          .auth-form-container {
            padding: 16px;
          }
          
          .auth-header {
            padding: 20px 16px;
          }
          
          .auth-form {
            padding: 20px 16px;
          }
          
          .brand-logo {
            width: 64px;
            height: 64px;
            margin-bottom: 24px;
          }
          
          .brand-title {
            font-size: 24px;
          }
          
          .demo-credential {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
        
        /* Animation enhancements */
        .auth-card {
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .auth-branding {
          animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .auth-card,
          .auth-branding,
          .floating-book,
          .auth-pattern {
            animation: none;
          }
          
          .auth-button,
          .demo-credential {
            transition: none;
          }
          
          .auth-button:hover,
          .demo-credential:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .auth-input,
          .auth-button {
            border-width: 3px;
          }
          
          .auth-tab.active {
            border: 2px solid #F3EED9;
          }
          
          .demo-credential {
            border-width: 2px;
          }
        }
        
        /* Dark mode support (future enhancement) */
        @media (prefers-color-scheme: dark) {
          .auth-card {
            background: rgba(30, 30, 30, 0.95);
            border-color: rgba(60, 60, 60, 0.3);
          }
          
          .auth-header {
            background: linear-gradient(135deg, #2D2D2D 0%, #252525 100%);
          }
          
          .auth-input {
            background: #1E1E1E;
            border-color: #404040;
            color: #E0E0E0;
          }
          
          .form-label,
          .mode-indicator {
            color: #E0E0E0;
          }
        }
      ` })] }));
};
exports.Authentication = Authentication;
