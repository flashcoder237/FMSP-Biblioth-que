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
exports.EnhancedAuthentication = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/renderer/components/EnhancedAuthentication.tsx
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const EnhancedAuthentication = ({ onLogin }) => {
    const [mode, setMode] = (0, react_1.useState)('login');
    const [step, setStep] = (0, react_1.useState)(1);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [success, setSuccess] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [isOnline, setIsOnline] = (0, react_1.useState)(navigator.onLine);
    // Données du formulaire
    const [loginData, setLoginData] = (0, react_1.useState)({
        email: '',
        password: '',
        institutionCode: ''
    });
    const [registerData, setRegisterData] = (0, react_1.useState)({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        institutionCode: '',
        role: 'user'
    });
    const [institutionData, setInstitutionData] = (0, react_1.useState)({
        name: '',
        type: 'library',
        address: '',
        city: '',
        country: 'Cameroun',
        phone: '',
        email: '',
        website: '',
        description: '',
        director: '',
        adminEmail: '',
        adminPassword: '',
        adminFirstName: '',
        adminLastName: ''
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await onLogin({
                    email: loginData.email,
                    password: loginData.password,
                    institutionCode: loginData.institutionCode,
                    mode: 'login'
                });
            }
            else if (mode === 'register') {
                if (registerData.password !== registerData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }
                await onLogin({
                    email: registerData.email,
                    password: registerData.password,
                    institutionCode: registerData.institutionCode,
                    mode: 'register',
                    userData: {
                        firstName: registerData.firstName,
                        lastName: registerData.lastName,
                        role: registerData.role
                    }
                });
            }
            else if (mode === 'create_institution') {
                if (step === 2) {
                    await onLogin({
                        email: institutionData.adminEmail,
                        password: institutionData.adminPassword,
                        mode: 'create_institution',
                        userData: {
                            institution: institutionData,
                            admin: {
                                firstName: institutionData.adminFirstName,
                                lastName: institutionData.adminLastName
                            }
                        }
                    });
                }
            }
        }
        catch (err) {
            setError(err.message || 'Erreur de connexion');
        }
        finally {
            setIsLoading(false);
        }
    };
    const validateStep1 = () => {
        return institutionData.name &&
            institutionData.type &&
            institutionData.city &&
            institutionData.country;
    };
    const validateStep2 = () => {
        return institutionData.adminEmail &&
            institutionData.adminPassword &&
            institutionData.adminFirstName &&
            institutionData.adminLastName &&
            institutionData.adminPassword.length >= 6;
    };
    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };
    const previousStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };
    const institutionTypes = [
        { value: 'school', label: 'École/Lycée', icon: '🏫' },
        { value: 'university', label: 'Université', icon: '🎓' },
        { value: 'library', label: 'Bibliothèque', icon: '📚' },
        { value: 'other', label: 'Autre', icon: '🏢' }
    ];
    const roles = [
        { value: 'user', label: 'Utilisateur', description: 'Accès de base à la bibliothèque' },
        { value: 'librarian', label: 'Bibliothécaire', description: 'Gestion des livres et emprunts' },
        { value: 'admin', label: 'Administrateur', description: 'Accès complet au système' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "enhanced-auth", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-background", children: [(0, jsx_runtime_1.jsx)("div", { className: "auth-pattern" }), (0, jsx_runtime_1.jsxs)("div", { className: "floating-elements", children: [(0, jsx_runtime_1.jsx)("div", { className: "floating-book" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-book" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-book" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "auth-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-branding", children: [(0, jsx_runtime_1.jsx)("div", { className: "brand-logo", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h1", { className: "brand-title", children: "Biblioth\u00E8que Cloud" }), (0, jsx_runtime_1.jsx)("p", { className: "brand-subtitle", children: "Syst\u00E8me de gestion moderne et collaboratif" }), (0, jsx_runtime_1.jsxs)("div", { className: "features-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Multi-\u00E9tablissements" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Synchronisation cloud" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "S\u00E9curis\u00E9 et fiable" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Accessible partout" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: `connection-status ${isOnline ? 'online' : 'offline'}`, children: [isOnline ? (0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { size: 16 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: isOnline ? 'En ligne' : 'Hors ligne' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "auth-form-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "auth-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-tabs", children: [(0, jsx_runtime_1.jsxs)("button", { className: `auth-tab ${mode === 'login' ? 'active' : ''}`, onClick: () => { setMode('login'); setStep(1); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogIn, { size: 16 }), "Connexion"] }), (0, jsx_runtime_1.jsxs)("button", { className: `auth-tab ${mode === 'register' ? 'active' : ''}`, onClick: () => { setMode('register'); setStep(1); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 16 }), "Inscription"] }), (0, jsx_runtime_1.jsxs)("button", { className: `auth-tab ${mode === 'create_institution' ? 'active' : ''}`, onClick: () => { setMode('create_institution'); setStep(1); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 16 }), "Cr\u00E9er \u00E9tablissement"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mode-indicator", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 16 }), (0, jsx_runtime_1.jsxs)("span", { children: [mode === 'login' && 'Connectez-vous à votre établissement', mode === 'register' && 'Rejoignez un établissement existant', mode === 'create_institution' && `Créez votre établissement ${step === 2 ? '- Administrateur' : '- Informations'}`] })] }), mode === 'create_institution' && ((0, jsx_runtime_1.jsx)("div", { className: "progress-bar", children: (0, jsx_runtime_1.jsxs)("div", { className: "progress-steps", children: [(0, jsx_runtime_1.jsxs)("div", { className: `progress-step ${step >= 1 ? 'active' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "step-number", children: "1" }), (0, jsx_runtime_1.jsx)("span", { children: "\u00C9tablissement" })] }), (0, jsx_runtime_1.jsx)("div", { className: "progress-line" }), (0, jsx_runtime_1.jsxs)("div", { className: `progress-step ${step >= 2 ? 'active' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "step-number", children: "2" }), (0, jsx_runtime_1.jsx)("span", { children: "Administrateur" })] })] }) }))] }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "error-message", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: error })] })), success && ((0, jsx_runtime_1.jsxs)("div", { className: "success-message", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: success })] })), mode === 'login' && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: loginData.email, onChange: (e) => setLoginData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "votre@email.com", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: loginData.password, onChange: (e) => setLoginData(prev => ({ ...prev, password: e.target.value })), className: "auth-input", placeholder: "Votre mot de passe", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Code de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.KeyRound, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: loginData.institutionCode, onChange: (e) => setLoginData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() })), className: "auth-input", placeholder: "CODE123", required: true, disabled: isLoading, maxLength: 8 })] }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "8 caract\u00E8res fournis par votre \u00E9tablissement" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !loginData.email || !loginData.password || !loginData.institutionCode, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Connexion..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogIn, { size: 18 }), "Se connecter", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16 })] })) })] })), mode === 'register' && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Pr\u00E9nom" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.firstName, onChange: (e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value })), className: "auth-input", placeholder: "Votre pr\u00E9nom", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.lastName, onChange: (e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value })), className: "auth-input", placeholder: "Votre nom", required: true, disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: registerData.email, onChange: (e) => setRegisterData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "votre@email.com", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "R\u00F4le souhait\u00E9" }), (0, jsx_runtime_1.jsx)("div", { className: "role-selector", children: roles.map((role) => ((0, jsx_runtime_1.jsxs)("label", { className: "role-option", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "role", value: role.value, checked: registerData.role === role.value, onChange: (e) => setRegisterData(prev => ({ ...prev, role: e.target.value })), disabled: isLoading }), (0, jsx_runtime_1.jsxs)("div", { className: "role-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "role-title", children: role.label }), (0, jsx_runtime_1.jsx)("span", { className: "role-description", children: role.description })] })] }, role.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Code de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.KeyRound, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: registerData.institutionCode, onChange: (e) => setRegisterData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() })), className: "auth-input", placeholder: "CODE123", required: true, disabled: isLoading, maxLength: 8 })] }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "Demandez ce code \u00E0 votre administrateur" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.password, onChange: (e) => setRegisterData(prev => ({ ...prev, password: e.target.value })), className: "auth-input", placeholder: "Mot de passe", required: true, disabled: isLoading, minLength: 6 })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Confirmer" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.confirmPassword, onChange: (e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value })), className: "auth-input", placeholder: "Confirmer", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !registerData.institutionCode, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Cr\u00E9ation..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { size: 18 }), "Cr\u00E9er le compte", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16 })] })) })] })), mode === 'create_institution' && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [step === 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "institution-step", children: [(0, jsx_runtime_1.jsxs)("div", { className: "step-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Informations de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsx)("p", { children: "Cr\u00E9ez votre \u00E9tablissement et obtenez votre code unique" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de l'\u00E9tablissement *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.name, onChange: (e) => setInstitutionData(prev => ({ ...prev, name: e.target.value })), className: "auth-input", placeholder: "Lyc\u00E9e Moderne de Douala", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Type d'\u00E9tablissement *" }), (0, jsx_runtime_1.jsx)("div", { className: "type-selector", children: institutionTypes.map((type) => ((0, jsx_runtime_1.jsxs)("label", { className: "type-option", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "type", value: type.value, checked: institutionData.type === type.value, onChange: (e) => setInstitutionData(prev => ({ ...prev, type: e.target.value })), disabled: isLoading }), (0, jsx_runtime_1.jsxs)("div", { className: "type-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "type-icon", children: type.icon }), (0, jsx_runtime_1.jsx)("span", { className: "type-label", children: type.label })] })] }, type.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Ville *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.city, onChange: (e) => setInstitutionData(prev => ({ ...prev, city: e.target.value })), className: "auth-input", placeholder: "Douala", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Pays *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.country, onChange: (e) => setInstitutionData(prev => ({ ...prev, country: e.target.value })), className: "auth-input", placeholder: "Cameroun", required: true, disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Adresse" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.address, onChange: (e) => setInstitutionData(prev => ({ ...prev, address: e.target.value })), className: "auth-input", placeholder: "Avenue de la Libert\u00E9", disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "T\u00E9l\u00E9phone" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: institutionData.phone, onChange: (e) => setInstitutionData(prev => ({ ...prev, phone: e.target.value })), className: "auth-input", placeholder: "+237 XXX XXX XXX", disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: institutionData.email, onChange: (e) => setInstitutionData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "contact@etablissement.com", disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: institutionData.description, onChange: (e) => setInstitutionData(prev => ({ ...prev, description: e.target.value })), className: "auth-textarea", placeholder: "Br\u00E8ve description de votre \u00E9tablissement...", rows: 3, disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "auth-button primary", onClick: nextStep, disabled: !validateStep1() || isLoading, children: ["Continuer", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16 })] })] })), step === 2 && ((0, jsx_runtime_1.jsxs)("div", { className: "admin-step", children: [(0, jsx_runtime_1.jsxs)("div", { className: "step-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Compte administrateur" }), (0, jsx_runtime_1.jsx)("p", { children: "Cr\u00E9ez le compte administrateur principal" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Pr\u00E9nom *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.adminFirstName, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminFirstName: e.target.value })), className: "auth-input", placeholder: "Pr\u00E9nom", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionData.adminLastName, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminLastName: e.target.value })), className: "auth-input", placeholder: "Nom", required: true, disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Email administrateur *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: institutionData.adminEmail, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminEmail: e.target.value })), className: "auth-input", placeholder: "admin@etablissement.com", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Mot de passe *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: institutionData.adminPassword, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminPassword: e.target.value })), className: "auth-input", placeholder: "Mot de passe s\u00E9curis\u00E9", required: true, disabled: isLoading, minLength: 6 }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 18 }) })] }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "Minimum 6 caract\u00E8res" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "auth-button secondary", onClick: previousStep, disabled: isLoading, children: "Pr\u00E9c\u00E9dent" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "auth-button primary", disabled: !validateStep2() || isLoading, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Cr\u00E9ation..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 18 }), "Cr\u00E9er l'\u00E9tablissement"] })) })] })] }))] }))] }) })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .enhanced-auth {
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
          max-width: 500px;
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
          max-width: 600px;
        }
        
        .auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 0;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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
          margin-bottom: 16px;
        }
        
        .progress-bar {
          margin-top: 16px;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        .progress-step.active {
          opacity: 1;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(62, 92, 73, 0.2);
          color: #3E5C49;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .progress-step.active .step-number {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .progress-line {
          width: 40px;
          height: 2px;
          background: rgba(62, 92, 73, 0.2);
        }
        
        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .error-message {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .success-message {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
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
        
        .input-wrapper svg {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .auth-input,
        .auth-textarea {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .auth-textarea {
          padding: 16px;
          resize: vertical;
          min-height: 80px;
        }
        
        .auth-input:focus,
        .auth-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .auth-input:disabled,
        .auth-textarea:disabled {
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
        
        .role-selector,
        .type-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .role-option,
        .type-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FFFFFF;
        }
        
        .role-option:hover,
        .type-option:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }
        
        .role-option input:checked + .role-content,
        .type-option input:checked + .type-content {
          color: #3E5C49;
        }
        
        .role-option input:checked,
        .type-option input:checked {
          accent-color: #3E5C49;
        }
        
        .role-content,
        .type-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .type-content {
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }
        
        .role-title,
        .type-label {
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .role-description {
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .type-icon {
          font-size: 20px;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6E6E6E;
          font-style: italic;
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
        
        .institution-step,
        .admin-step {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .step-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 16px 0 8px 0;
        }
        
        .step-header p {
          color: #6E6E6E;
          margin: 0;
          font-size: 16px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        
        .form-actions .auth-button {
          margin-bottom: 0;
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
            max-width: none;
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
          
          .auth-form-container {
            max-width: none;
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
            max-height: none;
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
          
          .auth-tabs {
            flex-direction: column;
            gap: 8px;
          }
          
          .auth-tab {
            flex: none;
          }
          
          .progress-steps {
            gap: 12px;
          }
          
          .progress-line {
            width: 30px;
          }
          
          .type-selector {
            grid-template-columns: 1fr 1fr;
            display: grid;
            gap: 12px;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
        }
        
        @media (max-width: 480px) {
          .auth-branding {
            padding: 24px 16px;
          }
          
          .auth-form-container {
            padding: 16px;
          }
          
          .auth-header,
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
          
          .auth-input,
          .auth-textarea {
            font-size: 14px;
          }
          
          .type-selector {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 16px;
          }
          
          .progress-line {
            width: 2px;
            height: 20px;
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
          .role-option,
          .type-option {
            transition: none;
          }
          
          .auth-button:hover,
          .role-option:hover,
          .type-option:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .auth-input,
          .auth-textarea,
          .auth-button {
            border-width: 3px;
          }
          
          .auth-tab.active {
            border: 2px solid #F3EED9;
          }
          
          .role-option,
          .type-option {
            border-width: 3px;
          }
        }
      ` })] }));
};
exports.EnhancedAuthentication = EnhancedAuthentication;
