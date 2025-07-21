"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedAuthentication = void 0;
// src/renderer/components/EnhancedAuthentication.tsx
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var EnhancedAuthentication = function (_a) {
    var onLogin = _a.onLogin;
    var _b = (0, react_1.useState)('login'), mode = _b[0], setMode = _b[1];
    var _c = (0, react_1.useState)(1), step = _c[0], setStep = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(''), success = _f[0], setSuccess = _f[1];
    var _g = (0, react_1.useState)(false), showPassword = _g[0], setShowPassword = _g[1];
    var _h = (0, react_1.useState)(navigator.onLine), isOnline = _h[0], setIsOnline = _h[1];
    // Données du formulaire
    var _j = (0, react_1.useState)({
        email: '',
        password: '',
        institutionCode: ''
    }), loginData = _j[0], setLoginData = _j[1];
    var _k = (0, react_1.useState)({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        institutionCode: '',
        role: 'user'
    }), registerData = _k[0], setRegisterData = _k[1];
    var _l = (0, react_1.useState)({
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
    }), institutionData = _l[0], setInstitutionData = _l[1];
    react_1.default.useEffect(function () {
        var handleOnlineStatus = function () {
            setIsOnline(navigator.onLine);
        };
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        return function () {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError('');
                    setSuccess('');
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    if (!(mode === 'login')) return [3 /*break*/, 3];
                    return [4 /*yield*/, onLogin({
                            email: loginData.email,
                            password: loginData.password,
                            institutionCode: loginData.institutionCode,
                            mode: 'login'
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(mode === 'register')) return [3 /*break*/, 5];
                    if (registerData.password !== registerData.confirmPassword) {
                        throw new Error('Les mots de passe ne correspondent pas');
                    }
                    return [4 /*yield*/, onLogin({
                            email: registerData.email,
                            password: registerData.password,
                            institutionCode: registerData.institutionCode,
                            mode: 'register',
                            userData: {
                                firstName: registerData.firstName,
                                lastName: registerData.lastName,
                                role: registerData.role
                            }
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    if (!(mode === 'create_institution')) return [3 /*break*/, 7];
                    if (!(step === 2)) return [3 /*break*/, 7];
                    return [4 /*yield*/, onLogin({
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
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Erreur de connexion');
                    return [3 /*break*/, 10];
                case 9:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var validateStep1 = function () {
        return institutionData.name &&
            institutionData.type &&
            institutionData.city &&
            institutionData.country;
    };
    var validateStep2 = function () {
        return institutionData.adminEmail &&
            institutionData.adminPassword &&
            institutionData.adminFirstName &&
            institutionData.adminLastName &&
            institutionData.adminPassword.length >= 6;
    };
    var nextStep = function () {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };
    var previousStep = function () {
        if (step === 2) {
            setStep(1);
        }
    };
    var institutionTypes = [
        { value: 'school', label: 'École/Lycée', icon: '🏫' },
        { value: 'university', label: 'Université', icon: '🎓' },
        { value: 'library', label: 'Bibliothèque', icon: '📚' },
        { value: 'other', label: 'Autre', icon: '🏢' }
    ];
    var roles = [
        { value: 'user', label: 'Utilisateur', description: 'Accès de base à la bibliothèque' },
        { value: 'librarian', label: 'Bibliothécaire', description: 'Gestion des livres et emprunts' },
        { value: 'admin', label: 'Administrateur', description: 'Accès complet au système' }
    ];
    return (<div className="enhanced-auth">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-elements">
          <div className="floating-book"></div>
          <div className="floating-book"></div>
          <div className="floating-book"></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-logo">
            <lucide_react_1.Book size={48}/>
          </div>
          <h1 className="brand-title">Bibliothèque Cloud</h1>
          <p className="brand-subtitle">Système de gestion moderne et collaboratif</p>
          
          <div className="features-list">
            <div className="feature-item">
              <lucide_react_1.Users size={20}/>
              <span>Multi-établissements</span>
            </div>
            <div className="feature-item">
              <lucide_react_1.BarChart3 size={20}/>
              <span>Synchronisation cloud</span>
            </div>
            <div className="feature-item">
              <lucide_react_1.Shield size={20}/>
              <span>Sécurisé et fiable</span>
            </div>
            <div className="feature-item">
              <lucide_react_1.Globe size={20}/>
              <span>Accessible partout</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className={"connection-status ".concat(isOnline ? 'online' : 'offline')}>
            {isOnline ? <lucide_react_1.Wifi size={16}/> : <lucide_react_1.WifiOff size={16}/>}
            <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-tabs">
                <button className={"auth-tab ".concat(mode === 'login' ? 'active' : '')} onClick={function () { setMode('login'); setStep(1); }}>
                  <lucide_react_1.LogIn size={16}/>
                  Connexion
                </button>
                <button className={"auth-tab ".concat(mode === 'register' ? 'active' : '')} onClick={function () { setMode('register'); setStep(1); }}>
                  <lucide_react_1.UserPlus size={16}/>
                  Inscription
                </button>
                <button className={"auth-tab ".concat(mode === 'create_institution' ? 'active' : '')} onClick={function () { setMode('create_institution'); setStep(1); }}>
                  <lucide_react_1.Building size={16}/>
                  Créer établissement
                </button>
              </div>
              
              <div className="mode-indicator">
                <lucide_react_1.Sparkles size={16}/>
                <span>
                  {mode === 'login' && 'Connectez-vous à votre établissement'}
                  {mode === 'register' && 'Rejoignez un établissement existant'}
                  {mode === 'create_institution' && "Cr\u00E9ez votre \u00E9tablissement ".concat(step === 2 ? '- Administrateur' : '- Informations')}
                </span>
              </div>

              {/* Progress bar for institution creation */}
              {mode === 'create_institution' && (<div className="progress-bar">
                  <div className="progress-steps">
                    <div className={"progress-step ".concat(step >= 1 ? 'active' : '')}>
                      <div className="step-number">1</div>
                      <span>Établissement</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={"progress-step ".concat(step >= 2 ? 'active' : '')}>
                      <div className="step-number">2</div>
                      <span>Administrateur</span>
                    </div>
                  </div>
                </div>)}
            </div>

            {error && (<div className="error-message">
                <lucide_react_1.AlertCircle size={16}/>
                <span>{error}</span>
              </div>)}

            {success && (<div className="success-message">
                <lucide_react_1.CheckCircle size={16}/>
                <span>{success}</span>
              </div>)}

            {/* Login Form */}
            {mode === 'login' && (<form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <lucide_react_1.Mail size={20}/>
                    <input type="email" value={loginData.email} onChange={function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className="auth-input" placeholder="votre@email.com" required disabled={isLoading}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <div className="input-wrapper">
                    <lucide_react_1.Lock size={20}/>
                    <input type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} className="auth-input" placeholder="Votre mot de passe" required disabled={isLoading}/>
                    <button type="button" className="password-toggle" onClick={function () { return setShowPassword(!showPassword); }}>
                      {showPassword ? <lucide_react_1.EyeOff size={18}/> : <lucide_react_1.Eye size={18}/>}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Code de l'établissement</label>
                  <div className="input-wrapper">
                    <lucide_react_1.KeyRound size={20}/>
                    <input type="text" value={loginData.institutionCode} onChange={function (e) { return setLoginData(function (prev) { return (__assign(__assign({}, prev), { institutionCode: e.target.value.toUpperCase() })); }); }} className="auth-input" placeholder="CODE123" required disabled={isLoading} maxLength={8}/>
                  </div>
                  <small className="form-hint">
                    8 caractères fournis par votre établissement
                  </small>
                </div>

                <button type="submit" className="auth-button primary" disabled={isLoading || !loginData.email || !loginData.password || !loginData.institutionCode}>
                  {isLoading ? (<>
                      <div className="loading-spinner"></div>
                      Connexion...
                    </>) : (<>
                      <lucide_react_1.LogIn size={18}/>
                      Se connecter
                      <lucide_react_1.ArrowRight size={16}/>
                    </>)}
                </button>
              </form>)}

            {/* Register Form */}
            {mode === 'register' && (<form onSubmit={handleSubmit} className="auth-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <div className="input-wrapper">
                      <lucide_react_1.User size={20}/>
                      <input type="text" value={registerData.firstName} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { firstName: e.target.value })); }); }} className="auth-input" placeholder="Votre prénom" required disabled={isLoading}/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <div className="input-wrapper">
                      <lucide_react_1.User size={20}/>
                      <input type="text" value={registerData.lastName} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { lastName: e.target.value })); }); }} className="auth-input" placeholder="Votre nom" required disabled={isLoading}/>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <lucide_react_1.Mail size={20}/>
                    <input type="email" value={registerData.email} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className="auth-input" placeholder="votre@email.com" required disabled={isLoading}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rôle souhaité</label>
                  <div className="role-selector">
                    {roles.map(function (role) { return (<label key={role.value} className="role-option">
                        <input type="radio" name="role" value={role.value} checked={registerData.role === role.value} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { role: e.target.value })); }); }} disabled={isLoading}/>
                        <div className="role-content">
                          <span className="role-title">{role.label}</span>
                          <span className="role-description">{role.description}</span>
                        </div>
                      </label>); })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Code de l'établissement</label>
                  <div className="input-wrapper">
                    <lucide_react_1.KeyRound size={20}/>
                    <input type="text" value={registerData.institutionCode} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { institutionCode: e.target.value.toUpperCase() })); }); }} className="auth-input" placeholder="CODE123" required disabled={isLoading} maxLength={8}/>
                  </div>
                  <small className="form-hint">
                    Demandez ce code à votre administrateur
                  </small>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Mot de passe</label>
                    <div className="input-wrapper">
                      <lucide_react_1.Lock size={20}/>
                      <input type={showPassword ? 'text' : 'password'} value={registerData.password} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} className="auth-input" placeholder="Mot de passe" required disabled={isLoading} minLength={6}/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmer</label>
                    <div className="input-wrapper">
                      <lucide_react_1.Lock size={20}/>
                      <input type={showPassword ? 'text' : 'password'} value={registerData.confirmPassword} onChange={function (e) { return setRegisterData(function (prev) { return (__assign(__assign({}, prev), { confirmPassword: e.target.value })); }); }} className="auth-input" placeholder="Confirmer" required disabled={isLoading}/>
                      <button type="button" className="password-toggle" onClick={function () { return setShowPassword(!showPassword); }}>
                        {showPassword ? <lucide_react_1.EyeOff size={18}/> : <lucide_react_1.Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="auth-button primary" disabled={isLoading || !registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !registerData.institutionCode}>
                  {isLoading ? (<>
                      <div className="loading-spinner"></div>
                      Création...
                    </>) : (<>
                      <lucide_react_1.UserPlus size={18}/>
                      Créer le compte
                      <lucide_react_1.ArrowRight size={16}/>
                    </>)}
                </button>
              </form>)}

            {/* Create Institution Form */}
            {mode === 'create_institution' && (<form onSubmit={handleSubmit} className="auth-form">
                {step === 1 && (<div className="institution-step">
                    <div className="step-header">
                      <lucide_react_1.Building size={24}/>
                      <h3>Informations de l'établissement</h3>
                      <p>Créez votre établissement et obtenez votre code unique</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nom de l'établissement *</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Building size={20}/>
                        <input type="text" value={institutionData.name} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="auth-input" placeholder="Lycée Moderne de Douala" required disabled={isLoading}/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Type d'établissement *</label>
                      <div className="type-selector">
                        {institutionTypes.map(function (type) { return (<label key={type.value} className="type-option">
                            <input type="radio" name="type" value={type.value} checked={institutionData.type === type.value} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { type: e.target.value })); }); }} disabled={isLoading}/>
                            <div className="type-content">
                              <span className="type-icon">{type.icon}</span>
                              <span className="type-label">{type.label}</span>
                            </div>
                          </label>); })}
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Ville *</label>
                        <div className="input-wrapper">
                          <lucide_react_1.MapPin size={20}/>
                          <input type="text" value={institutionData.city} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { city: e.target.value })); }); }} className="auth-input" placeholder="Douala" required disabled={isLoading}/>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pays *</label>
                        <div className="input-wrapper">
                          <lucide_react_1.Globe size={20}/>
                          <input type="text" value={institutionData.country} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { country: e.target.value })); }); }} className="auth-input" placeholder="Cameroun" required disabled={isLoading}/>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Adresse</label>
                      <div className="input-wrapper">
                        <lucide_react_1.MapPin size={20}/>
                        <input type="text" value={institutionData.address} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { address: e.target.value })); }); }} className="auth-input" placeholder="Avenue de la Liberté" disabled={isLoading}/>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Téléphone</label>
                        <div className="input-wrapper">
                          <lucide_react_1.Phone size={20}/>
                          <input type="tel" value={institutionData.phone} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); }} className="auth-input" placeholder="+237 XXX XXX XXX" disabled={isLoading}/>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                          <lucide_react_1.Mail size={20}/>
                          <input type="email" value={institutionData.email} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className="auth-input" placeholder="contact@etablissement.com" disabled={isLoading}/>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea value={institutionData.description} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} className="auth-textarea" placeholder="Brève description de votre établissement..." rows={3} disabled={isLoading}/>
                    </div>

                    <button type="button" className="auth-button primary" onClick={nextStep} disabled={!validateStep1() || isLoading}>
                      Continuer
                      <lucide_react_1.ArrowRight size={16}/>
                    </button>
                  </div>)}

                {step === 2 && (<div className="admin-step">
                    <div className="step-header">
                      <lucide_react_1.Shield size={24}/>
                      <h3>Compte administrateur</h3>
                      <p>Créez le compte administrateur principal</p>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Prénom *</label>
                        <div className="input-wrapper">
                          <lucide_react_1.User size={20}/>
                          <input type="text" value={institutionData.adminFirstName} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { adminFirstName: e.target.value })); }); }} className="auth-input" placeholder="Prénom" required disabled={isLoading}/>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nom *</label>
                        <div className="input-wrapper">
                          <lucide_react_1.User size={20}/>
                          <input type="text" value={institutionData.adminLastName} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { adminLastName: e.target.value })); }); }} className="auth-input" placeholder="Nom" required disabled={isLoading}/>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email administrateur *</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Mail size={20}/>
                        <input type="email" value={institutionData.adminEmail} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { adminEmail: e.target.value })); }); }} className="auth-input" placeholder="admin@etablissement.com" required disabled={isLoading}/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mot de passe *</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Lock size={20}/>
                        <input type={showPassword ? 'text' : 'password'} value={institutionData.adminPassword} onChange={function (e) { return setInstitutionData(function (prev) { return (__assign(__assign({}, prev), { adminPassword: e.target.value })); }); }} className="auth-input" placeholder="Mot de passe sécurisé" required disabled={isLoading} minLength={6}/>
                        <button type="button" className="password-toggle" onClick={function () { return setShowPassword(!showPassword); }}>
                          {showPassword ? <lucide_react_1.EyeOff size={18}/> : <lucide_react_1.Eye size={18}/>}
                        </button>
                      </div>
                      <small className="form-hint">
                        Minimum 6 caractères
                      </small>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="auth-button secondary" onClick={previousStep} disabled={isLoading}>
                        Précédent
                      </button>
                      <button type="submit" className="auth-button primary" disabled={!validateStep2() || isLoading}>
                        {isLoading ? (<>
                            <div className="loading-spinner"></div>
                            Création...
                          </>) : (<>
                            <lucide_react_1.Building size={18}/>
                            Créer l'établissement
                          </>)}
                      </button>
                    </div>
                  </div>)}
              </form>)}
          </div>
        </div>
      </div>

      <style>{"\n        .enhanced-auth {\n          height: 100vh;\n          display: flex;\n          position: relative;\n          overflow: hidden;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n        }\n        \n        .auth-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n        \n        .auth-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),\n            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);\n          animation: drift 25s ease-in-out infinite;\n        }\n        \n        @keyframes drift {\n          0%, 100% { transform: translate(0, 0) rotate(0deg); }\n          33% { transform: translate(30px, -30px) rotate(1deg); }\n          66% { transform: translate(-20px, 20px) rotate(-1deg); }\n        }\n        \n        .floating-elements {\n          position: absolute;\n          inset: 0;\n          pointer-events: none;\n        }\n        \n        .floating-book {\n          position: absolute;\n          width: 24px;\n          height: 32px;\n          background: rgba(243, 238, 217, 0.1);\n          border-radius: 4px;\n          animation: float 8s ease-in-out infinite;\n        }\n        \n        .floating-book:nth-child(1) {\n          top: 20%;\n          left: 10%;\n          animation-delay: 0s;\n        }\n        \n        .floating-book:nth-child(2) {\n          top: 60%;\n          left: 15%;\n          animation-delay: 2s;\n        }\n        \n        .floating-book:nth-child(3) {\n          top: 40%;\n          left: 5%;\n          animation-delay: 4s;\n        }\n        \n        @keyframes float {\n          0%, 100% { transform: translateY(0px) rotate(0deg); }\n          50% { transform: translateY(-20px) rotate(2deg); }\n        }\n        \n        .auth-content {\n          display: flex;\n          width: 100%;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .auth-branding {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          padding: 60px;\n          color: #F3EED9;\n          max-width: 500px;\n        }\n        \n        .brand-logo {\n          width: 80px;\n          height: 80px;\n          background: rgba(243, 238, 217, 0.15);\n          border-radius: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          margin-bottom: 32px;\n          border: 1px solid rgba(243, 238, 217, 0.2);\n          backdrop-filter: blur(10px);\n        }\n        \n        .brand-title {\n          font-size: 48px;\n          font-weight: 800;\n          margin: 0 0 16px 0;\n          letter-spacing: -1px;\n        }\n        \n        .brand-subtitle {\n          font-size: 20px;\n          opacity: 0.9;\n          margin: 0 0 48px 0;\n          line-height: 1.5;\n        }\n        \n        .features-list {\n          display: flex;\n          flex-direction: column;\n          gap: 20px;\n          margin-bottom: 40px;\n        }\n        \n        .feature-item {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          font-size: 16px;\n          opacity: 0.9;\n        }\n        \n        .connection-status {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 16px;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          width: fit-content;\n        }\n        \n        .connection-status.online {\n          background: rgba(76, 175, 80, 0.2);\n          color: #4CAF50;\n          border: 1px solid rgba(76, 175, 80, 0.3);\n        }\n        \n        .connection-status.offline {\n          background: rgba(255, 152, 0, 0.2);\n          color: #FF9800;\n          border: 1px solid rgba(255, 152, 0, 0.3);\n        }\n        \n        .auth-form-container {\n          flex: 1;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          padding: 40px;\n          background: rgba(255, 255, 255, 0.05);\n          backdrop-filter: blur(10px);\n          max-width: 600px;\n        }\n        \n        .auth-card {\n          width: 100%;\n          background: rgba(255, 255, 255, 0.95);\n          border-radius: 24px;\n          padding: 0;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n          backdrop-filter: blur(20px);\n          overflow: hidden;\n          max-height: 90vh;\n          overflow-y: auto;\n        }\n        \n        .auth-header {\n          padding: 32px 32px 24px;\n          background: linear-gradient(135deg, #F3EED9 0%, #EAEADC 100%);\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .auth-tabs {\n          display: flex;\n          gap: 4px;\n          background: rgba(62, 92, 73, 0.1);\n          border-radius: 12px;\n          padding: 4px;\n          margin-bottom: 20px;\n        }\n        \n        .auth-tab {\n          flex: 1;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          gap: 8px;\n          padding: 12px 16px;\n          border: none;\n          background: transparent;\n          color: #6E6E6E;\n          font-size: 14px;\n          font-weight: 600;\n          border-radius: 8px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .auth-tab.active {\n          background: #3E5C49;\n          color: #F3EED9;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.2);\n        }\n        \n        .mode-indicator {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #3E5C49;\n          font-size: 16px;\n          font-weight: 600;\n          margin-bottom: 16px;\n        }\n        \n        .progress-bar {\n          margin-top: 16px;\n        }\n        \n        .progress-steps {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          gap: 16px;\n        }\n        \n        .progress-step {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          gap: 8px;\n          opacity: 0.5;\n          transition: opacity 0.3s ease;\n        }\n        \n        .progress-step.active {\n          opacity: 1;\n        }\n        \n        .step-number {\n          width: 32px;\n          height: 32px;\n          border-radius: 50%;\n          background: rgba(62, 92, 73, 0.2);\n          color: #3E5C49;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-weight: 600;\n          font-size: 14px;\n        }\n        \n        .progress-step.active .step-number {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .progress-line {\n          width: 40px;\n          height: 2px;\n          background: rgba(62, 92, 73, 0.2);\n        }\n        \n        .error-message,\n        .success-message {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 32px;\n          font-size: 14px;\n          font-weight: 600;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .error-message {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .success-message {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .auth-form {\n          padding: 32px;\n        }\n        \n        .form-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 20px;\n        }\n        \n        .form-group {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n          margin-bottom: 20px;\n        }\n        \n        .form-label {\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .input-wrapper svg {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .auth-input,\n        .auth-textarea {\n          width: 100%;\n          padding: 16px 16px 16px 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .auth-textarea {\n          padding: 16px;\n          resize: vertical;\n          min-height: 80px;\n        }\n        \n        .auth-input:focus,\n        .auth-textarea:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .auth-input:disabled,\n        .auth-textarea:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          background: #F3EED9;\n        }\n        \n        .password-toggle {\n          position: absolute;\n          right: 16px;\n          background: none;\n          border: none;\n          cursor: pointer;\n          color: #6E6E6E;\n          padding: 4px;\n          border-radius: 4px;\n          transition: all 0.2s ease;\n          z-index: 2;\n        }\n        \n        .password-toggle:hover {\n          color: #2E2E2E;\n          background: rgba(110, 110, 110, 0.1);\n        }\n        \n        .role-selector,\n        .type-selector {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .role-option,\n        .type-option {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          background: #FFFFFF;\n        }\n        \n        .role-option:hover,\n        .type-option:hover {\n          border-color: #3E5C49;\n          background: rgba(62, 92, 73, 0.05);\n        }\n        \n        .role-option input:checked + .role-content,\n        .type-option input:checked + .type-content {\n          color: #3E5C49;\n        }\n        \n        .role-option input:checked,\n        .type-option input:checked {\n          accent-color: #3E5C49;\n        }\n        \n        .role-content,\n        .type-content {\n          display: flex;\n          flex-direction: column;\n          gap: 4px;\n        }\n        \n        .type-content {\n          flex-direction: row;\n          align-items: center;\n          gap: 12px;\n        }\n        \n        .role-title,\n        .type-label {\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .role-description {\n          font-size: 13px;\n          color: #6E6E6E;\n        }\n        \n        .type-icon {\n          font-size: 20px;\n        }\n        \n        .form-hint {\n          font-size: 12px;\n          color: #6E6E6E;\n          font-style: italic;\n        }\n        \n        .auth-button {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          gap: 8px;\n          padding: 16px 24px;\n          border-radius: 12px;\n          font-size: 16px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          border: none;\n          margin-bottom: 12px;\n        }\n        \n        .auth-button.primary {\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);\n        }\n        \n        .auth-button.primary:hover:not(:disabled) {\n          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);\n        }\n        \n        .auth-button.secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n        }\n        \n        .auth-button.secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-1px);\n        }\n        \n        .auth-button:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          transform: none;\n          box-shadow: none;\n        }\n        \n        .loading-spinner {\n          width: 18px;\n          height: 18px;\n          border: 2px solid rgba(243, 238, 217, 0.3);\n          border-top: 2px solid #F3EED9;\n          border-radius: 50%;\n          animation: spin 1s linear infinite;\n        }\n        \n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        \n        .institution-step,\n        .admin-step {\n          display: flex;\n          flex-direction: column;\n          gap: 24px;\n        }\n        \n        .step-header {\n          text-align: center;\n          margin-bottom: 24px;\n        }\n        \n        .step-header h3 {\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 16px 0 8px 0;\n        }\n        \n        .step-header p {\n          color: #6E6E6E;\n          margin: 0;\n          font-size: 16px;\n        }\n        \n        .form-actions {\n          display: flex;\n          gap: 16px;\n          margin-top: 24px;\n        }\n        \n        .form-actions .auth-button {\n          margin-bottom: 0;\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .auth-content {\n            flex-direction: column;\n          }\n          \n          .auth-branding {\n            padding: 40px;\n            text-align: center;\n            flex: none;\n            max-width: none;\n          }\n          \n          .brand-title {\n            font-size: 36px;\n          }\n          \n          .brand-subtitle {\n            font-size: 18px;\n          }\n          \n          .features-list {\n            flex-direction: row;\n            flex-wrap: wrap;\n            justify-content: center;\n            gap: 16px;\n          }\n          \n          .feature-item {\n            flex-direction: column;\n            text-align: center;\n            gap: 8px;\n            min-width: 120px;\n          }\n          \n          .auth-form-container {\n            max-width: none;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .auth-branding {\n            padding: 32px 20px;\n          }\n          \n          .auth-form-container {\n            padding: 20px;\n          }\n          \n          .auth-card {\n            max-width: none;\n            border-radius: 20px;\n            max-height: none;\n          }\n          \n          .auth-header {\n            padding: 24px 20px 20px;\n          }\n          \n          .auth-form {\n            padding: 24px 20px;\n          }\n          \n          .form-grid {\n            grid-template-columns: 1fr;\n            gap: 16px;\n          }\n          \n          .brand-title {\n            font-size: 28px;\n          }\n          \n          .brand-subtitle {\n            font-size: 16px;\n          }\n          \n          .features-list {\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .feature-item {\n            flex-direction: row;\n            justify-content: center;\n          }\n          \n          .auth-tabs {\n            flex-direction: column;\n            gap: 8px;\n          }\n          \n          .auth-tab {\n            flex: none;\n          }\n          \n          .progress-steps {\n            gap: 12px;\n          }\n          \n          .progress-line {\n            width: 30px;\n          }\n          \n          .type-selector {\n            grid-template-columns: 1fr 1fr;\n            display: grid;\n            gap: 12px;\n          }\n          \n          .form-actions {\n            flex-direction: column-reverse;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .auth-branding {\n            padding: 24px 16px;\n          }\n          \n          .auth-form-container {\n            padding: 16px;\n          }\n          \n          .auth-header,\n          .auth-form {\n            padding: 20px 16px;\n          }\n          \n          .brand-logo {\n            width: 64px;\n            height: 64px;\n            margin-bottom: 24px;\n          }\n          \n          .brand-title {\n            font-size: 24px;\n          }\n          \n          .auth-input,\n          .auth-textarea {\n            font-size: 14px;\n          }\n          \n          .type-selector {\n            grid-template-columns: 1fr;\n          }\n          \n          .progress-steps {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .progress-line {\n            width: 2px;\n            height: 20px;\n          }\n        }\n        \n        /* Animation enhancements */\n        .auth-card {\n          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n        }\n        \n        @keyframes slideUp {\n          from {\n            opacity: 0;\n            transform: translateY(40px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n        \n        .auth-branding {\n          animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n        }\n        \n        @keyframes fadeInLeft {\n          from {\n            opacity: 0;\n            transform: translateX(-40px);\n          }\n          to {\n            opacity: 1;\n            transform: translateX(0);\n          }\n        }\n        \n        /* Accessibility improvements */\n        @media (prefers-reduced-motion: reduce) {\n          .auth-card,\n          .auth-branding,\n          .floating-book,\n          .auth-pattern {\n            animation: none;\n          }\n          \n          .auth-button,\n          .role-option,\n          .type-option {\n            transition: none;\n          }\n          \n          .auth-button:hover,\n          .role-option:hover,\n          .type-option:hover {\n            transform: none;\n          }\n        }\n        \n        /* High contrast mode */\n        @media (prefers-contrast: high) {\n          .auth-input,\n          .auth-textarea,\n          .auth-button {\n            border-width: 3px;\n          }\n          \n          .auth-tab.active {\n            border: 2px solid #F3EED9;\n          }\n          \n          .role-option,\n          .type-option {\n            border-width: 3px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.EnhancedAuthentication = EnhancedAuthentication;
