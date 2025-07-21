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
exports.Settings = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Settings = function (_a) {
    var onClose = _a.onClose, onLogout = _a.onLogout;
    var _b = (0, react_1.useState)('institution'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), message = _d[0], setMessage = _d[1];
    var _e = (0, react_1.useState)({
        name: 'Lycée Moderne de Douala',
        address: 'Avenue de la Liberté',
        city: 'Douala',
        country: 'Cameroun',
        phone: '+237 233 42 15 67',
        email: 'contact@lyceemoderne.cm',
        website: 'www.lyceemoderne.cm',
        logo: '',
        description: 'Établissement d\'enseignement secondaire général et technique'
    }), institutionSettings = _e[0], setInstitutionSettings = _e[1];
    var _f = (0, react_1.useState)({
        autoBackup: true,
        backupFrequency: 'weekly',
        lastBackup: new Date().toISOString(),
        cloudSync: false,
        cloudProvider: 'google'
    }), backupSettings = _f[0], setBackupSettings = _f[1];
    var _g = (0, react_1.useState)({
        requireAuth: true,
        sessionTimeout: 60,
        passwordPolicy: {
            minLength: 6,
            requireNumbers: true,
            requireSymbols: false
        }
    }), securitySettings = _g[0], setSecuritySettings = _g[1];
    var _h = (0, react_1.useState)(false), showConfirmLogout = _h[0], setShowConfirmLogout = _h[1];
    (0, react_1.useEffect)(function () {
        loadSettings();
    }, []);
    var loadSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var settings, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.electronAPI.getSettings()];
                case 1:
                    settings = _a.sent();
                    if (settings) {
                        setInstitutionSettings(settings.institution || institutionSettings);
                        setBackupSettings(settings.backup || backupSettings);
                        setSecuritySettings(settings.security || securitySettings);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading settings:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var saveSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, window.electronAPI.saveSettings({
                            institution: institutionSettings,
                            backup: backupSettings,
                            security: securitySettings
                        })];
                case 2:
                    _a.sent();
                    showMessage('success', 'Paramètres sauvegardés avec succès');
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    showMessage('error', 'Erreur lors de la sauvegarde');
                    console.error('Error saving settings:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var showMessage = function (type, text) {
        setMessage({ type: type, text: text });
        setTimeout(function () { return setMessage(null); }, 5000);
    };
    var handleLogoUpload = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var file, reader;
        var _a;
        return __generator(this, function (_b) {
            file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                reader = new FileReader();
                reader.onload = function (e) {
                    setInstitutionSettings(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), { logo: (_a = e.target) === null || _a === void 0 ? void 0 : _a.result }));
                    });
                };
                reader.readAsDataURL(file);
            }
            return [2 /*return*/];
        });
    }); };
    var handleBackup = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, window.electronAPI.createBackup()];
                case 2:
                    _a.sent();
                    setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { lastBackup: new Date().toISOString() })); });
                    showMessage('success', 'Sauvegarde créée avec succès');
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    showMessage('error', 'Erreur lors de la sauvegarde');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRestore = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Êtes-vous sûr de vouloir restaurer une sauvegarde ? Cela remplacera toutes les données actuelles.')) return [3 /*break*/, 5];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, window.electronAPI.restoreBackup()];
                case 2:
                    _a.sent();
                    showMessage('success', 'Données restaurées avec succès');
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    showMessage('error', 'Erreur lors de la restauration');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleClearData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('⚠️ ATTENTION: Cette action supprimera définitivement toutes les données. Êtes-vous absolument sûr ?')) return [3 /*break*/, 5];
                    if (!window.confirm('Dernière confirmation: Voulez-vous vraiment supprimer TOUTES les données ?')) return [3 /*break*/, 5];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, window.electronAPI.clearAllData()];
                case 2:
                    _a.sent();
                    showMessage('success', 'Toutes les données ont été supprimées');
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    showMessage('error', 'Erreur lors de la suppression');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var tabs = [
        { id: 'institution', label: 'Établissement', icon: lucide_react_1.Building },
        { id: 'backup', label: 'Sauvegardes', icon: lucide_react_1.Database },
        { id: 'security', label: 'Sécurité', icon: lucide_react_1.Shield },
        { id: 'about', label: 'À propos', icon: lucide_react_1.Settings }
    ];
    return (<div className="settings-overlay">
      <div className="settings-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <lucide_react_1.Settings size={28}/>
            </div>
            <div className="header-text">
              <h2 className="modal-title">Paramètres</h2>
              <p className="modal-subtitle">Configuration de l'application</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <lucide_react_1.X size={20}/>
          </button>
        </div>

        {/* Message */}
        {message && (<div className={"message ".concat(message.type)}>
            {message.type === 'success' ? <lucide_react_1.CheckCircle size={20}/> : <lucide_react_1.AlertCircle size={20}/>}
            <span>{message.text}</span>
          </div>)}

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(function (tab) { return (<button key={tab.id} className={"nav-button ".concat(activeTab === tab.id ? 'active' : '')} onClick={function () { return setActiveTab(tab.id); }}>
                  <tab.icon size={20}/>
                  <span>{tab.label}</span>
                </button>); })}
            </nav>

            <div className="logout-section">
              <button className="logout-button" onClick={function () { return setShowConfirmLogout(true); }}>
                <lucide_react_1.LogOut size={18}/>
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {activeTab === 'institution' && (<div className="settings-section">
                <div className="section-header">
                  <lucide_react_1.Building size={24}/>
                  <div>
                    <h3>Informations de l'établissement</h3>
                    <p>Configurez les détails de votre institution</p>
                  </div>
                </div>

                <div className="form-section">
                  <div className="logo-section">
                    <div className="logo-preview">
                      {institutionSettings.logo ? (<img src={institutionSettings.logo} alt="Logo"/>) : (<div className="logo-placeholder">
                          <lucide_react_1.Camera size={32}/>
                          <span>Logo</span>
                        </div>)}
                    </div>
                    <div className="logo-actions">
                      <label className="upload-button">
                        <lucide_react_1.Upload size={16}/>
                        Changer le logo
                        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }}/>
                      </label>
                      {institutionSettings.logo && (<button className="remove-button" onClick={function () { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { logo: '' })); }); }}>
                          <lucide_react_1.Trash2 size={16}/>
                          Supprimer
                        </button>)}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom de l'établissement</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Building size={18}/>
                        <input type="text" value={institutionSettings.name} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Téléphone</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Phone size={18}/>
                        <input type="tel" value={institutionSettings.phone} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Mail size={18}/>
                        <input type="email" value={institutionSettings.email} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Site web</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Globe size={18}/>
                        <input type="url" value={institutionSettings.website} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { website: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Adresse</label>
                      <div className="input-wrapper">
                        <lucide_react_1.MapPin size={18}/>
                        <input type="text" value={institutionSettings.address} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { address: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Ville</label>
                      <div className="input-wrapper">
                        <lucide_react_1.MapPin size={18}/>
                        <input type="text" value={institutionSettings.city} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { city: e.target.value })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="form-group span-full">
                      <label>Description</label>
                      <textarea value={institutionSettings.description} onChange={function (e) { return setInstitutionSettings(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} className="form-textarea" rows={3}/>
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === 'backup' && (<div className="settings-section">
                <div className="section-header">
                  <lucide_react_1.Database size={24}/>
                  <div>
                    <h3>Gestion des sauvegardes</h3>
                    <p>Protégez vos données avec des sauvegardes automatiques</p>
                  </div>
                </div>

                <div className="backup-status">
                  <div className="status-card">
                    <div className="status-icon success">
                      <lucide_react_1.CheckCircle size={24}/>
                    </div>
                    <div className="status-content">
                      <h4>Dernière sauvegarde</h4>
                      <p>{new Date(backupSettings.lastBackup).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="setting-group">
                    <div className="setting-header">
                      <h4>Sauvegarde automatique</h4>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={backupSettings.autoBackup} onChange={function (e) { return setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { autoBackup: e.target.checked })); }); }}/>
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Créer automatiquement des sauvegardes selon la fréquence définie</p>
                  </div>

                  {backupSettings.autoBackup && (<div className="setting-group">
                      <h4>Fréquence</h4>
                      <div className="radio-group">
                        {[
                    { value: 'daily', label: 'Quotidienne' },
                    { value: 'weekly', label: 'Hebdomadaire' },
                    { value: 'monthly', label: 'Mensuelle' }
                ].map(function (option) { return (<label key={option.value} className="radio-option">
                            <input type="radio" name="frequency" value={option.value} checked={backupSettings.backupFrequency === option.value} onChange={function (e) { return setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { backupFrequency: e.target.value })); }); }}/>
                            <span className="radio-label">{option.label}</span>
                          </label>); })}
                      </div>
                    </div>)}

                  <div className="setting-group">
                    <div className="setting-header">
                      <h4>Synchronisation cloud</h4>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={backupSettings.cloudSync} onChange={function (e) { return setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { cloudSync: e.target.checked })); }); }}/>
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Synchroniser automatiquement vos sauvegardes avec le cloud</p>
                  </div>

                  <div className="backup-actions">
                    <button className="action-button primary" onClick={handleBackup} disabled={isLoading}>
                      <lucide_react_1.HardDrive size={18}/>
                      Créer une sauvegarde maintenant
                    </button>
                    
                    <button className="action-button secondary" onClick={handleRestore} disabled={isLoading}>
                      <lucide_react_1.Download size={18}/>
                      Restaurer une sauvegarde
                    </button>
                    
                    <button className="action-button danger" onClick={handleClearData} disabled={isLoading}>
                      <lucide_react_1.Trash2 size={18}/>
                      Effacer toutes les données
                    </button>
                  </div>
                </div>
              </div>)}

            {activeTab === 'security' && (<div className="settings-section">
                <div className="section-header">
                  <lucide_react_1.Shield size={24}/>
                  <div>
                    <h3>Paramètres de sécurité</h3>
                    <p>Configurez la sécurité et l'authentification</p>
                  </div>
                </div>

                <div className="form-section">
                  <div className="setting-group">
                    <div className="setting-header">
                      <h4>Authentification requise</h4>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={securitySettings.requireAuth} onChange={function (e) { return setSecuritySettings(function (prev) { return (__assign(__assign({}, prev), { requireAuth: e.target.checked })); }); }}/>
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Exiger une connexion pour accéder à l'application</p>
                  </div>

                  <div className="setting-group">
                    <h4>Délai d'expiration de session (minutes)</h4>
                    <div className="input-wrapper">
                      <lucide_react_1.Lock size={18}/>
                      <input type="number" min="5" max="480" value={securitySettings.sessionTimeout} onChange={function (e) { return setSecuritySettings(function (prev) { return (__assign(__assign({}, prev), { sessionTimeout: parseInt(e.target.value) })); }); }} className="form-input"/>
                    </div>
                  </div>

                  <div className="setting-group">
                    <h4>Politique de mot de passe</h4>
                    
                    <div className="sub-setting">
                      <label>Longueur minimale</label>
                      <div className="input-wrapper">
                        <lucide_react_1.Lock size={18}/>
                        <input type="number" min="4" max="20" value={securitySettings.passwordPolicy.minLength} onChange={function (e) { return setSecuritySettings(function (prev) { return (__assign(__assign({}, prev), { passwordPolicy: __assign(__assign({}, prev.passwordPolicy), { minLength: parseInt(e.target.value) }) })); }); }} className="form-input"/>
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-option">
                        <input type="checkbox" checked={securitySettings.passwordPolicy.requireNumbers} onChange={function (e) { return setSecuritySettings(function (prev) { return (__assign(__assign({}, prev), { passwordPolicy: __assign(__assign({}, prev.passwordPolicy), { requireNumbers: e.target.checked }) })); }); }}/>
                        <span className="checkbox-label">Exiger des chiffres</span>
                      </label>

                      <label className="checkbox-option">
                        <input type="checkbox" checked={securitySettings.passwordPolicy.requireSymbols} onChange={function (e) { return setSecuritySettings(function (prev) { return (__assign(__assign({}, prev), { passwordPolicy: __assign(__assign({}, prev.passwordPolicy), { requireSymbols: e.target.checked }) })); }); }}/>
                        <span className="checkbox-label">Exiger des symboles</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === 'about' && (<div className="settings-section">
                <div className="section-header">
                  <lucide_react_1.Settings size={24}/>
                  <div>
                    <h3>À propos de l'application</h3>
                    <p>Informations sur la version et les crédits</p>
                  </div>
                </div>

                <div className="about-content">
                  <div className="app-info">
                    <div className="app-logo">
                      <lucide_react_1.Building size={48}/>
                    </div>
                    <h3>Bibliothèque v2.0.0</h3>
                    <p>Système de gestion moderne pour bibliothèques</p>
                  </div>

                  <div className="info-cards">
                    <div className="info-card">
                      <h4>Développé par</h4>
                      <p>Votre équipe de développement</p>
                    </div>
                    
                    <div className="info-card">
                      <h4>Technologies utilisées</h4>
                      <div className="tech-list">
                        <span>Electron</span>
                        <span>React</span>
                        <span>TypeScript</span>
                        <span>SQLite</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <h4>Licence</h4>
                      <p>MIT License</p>
                    </div>
                  </div>

                  <div className="system-info">
                    <h4>Informations système</h4>
                    <div className="system-details">
                      <div className="detail-item">
                        <span>Version de l'application</span>
                        <span>2.0.0</span>
                      </div>
                      <div className="detail-item">
                        <span>Base de données</span>
                        <span>SQLite v3.39.0</span>
                      </div>
                      <div className="detail-item">
                        <span>Plateforme</span>
                        <span>Windows/macOS/Linux</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="settings-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="btn-primary" onClick={saveSettings} disabled={isLoading}>
            {isLoading ? (<>
                <lucide_react_1.RefreshCw size={16} className="spinning"/>
                Sauvegarde...
              </>) : (<>
                <lucide_react_1.Save size={16}/>
                Sauvegarder
              </>)}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (<div className="logout-overlay" onClick={function () { return setShowConfirmLogout(false); }}>
          <div className="logout-modal" onClick={function (e) { return e.stopPropagation(); }}>
            <div className="logout-header">
              <lucide_react_1.LogOut size={24}/>
              <h3>Confirmer la déconnexion</h3>
            </div>
            <p>Êtes-vous sûr de vouloir vous déconnecter ? Toutes les données non sauvegardées seront perdues.</p>
            <div className="logout-actions">
              <button className="btn-secondary" onClick={function () { return setShowConfirmLogout(false); }}>
                Annuler
              </button>
              <button className="btn-danger" onClick={function () {
                setShowConfirmLogout(false);
                onLogout();
            }}>
                <lucide_react_1.LogOut size={16}/>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>)}

      <style>{"\n        .settings-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.7);\n          backdrop-filter: blur(8px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n        }\n        \n        .settings-modal {\n          background: #FFFFFF;\n          border-radius: 24px;\n          width: 100%;\n          max-width: 1200px;\n          max-height: 90vh;\n          overflow: hidden;\n          display: flex;\n          flex-direction: column;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 32px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n        }\n        \n        .header-content {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n        }\n        \n        .header-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        \n        .modal-title {\n          font-size: 24px;\n          font-weight: 800;\n          margin: 0 0 4px 0;\n        }\n        \n        .modal-subtitle {\n          font-size: 14px;\n          opacity: 0.9;\n          margin: 0;\n        }\n        \n        .close-button {\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n        }\n        \n        .close-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n        }\n        \n        .message {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 32px;\n          font-size: 14px;\n          font-weight: 600;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .message.success {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .message.error {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .settings-content {\n          flex: 1;\n          display: flex;\n          overflow: hidden;\n        }\n        \n        .settings-sidebar {\n          width: 280px;\n          background: #F3EED9;\n          border-right: 1px solid #E5DCC2;\n          padding: 24px 0;\n          display: flex;\n          flex-direction: column;\n          justify-content: space-between;\n        }\n        \n        .settings-nav {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n          padding: 0 24px;\n        }\n        \n        .nav-button {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 20px;\n          border: none;\n          background: transparent;\n          color: #6E6E6E;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          font-size: 14px;\n          font-weight: 500;\n          text-align: left;\n        }\n        \n        .nav-button:hover {\n          background: rgba(62, 92, 73, 0.08);\n          color: #3E5C49;\n        }\n        \n        .nav-button.active {\n          background: #3E5C49;\n          color: #F3EED9;\n          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.2);\n        }\n        \n        .logout-section {\n          padding: 0 24px;\n          border-top: 1px solid #E5DCC2;\n          padding-top: 24px;\n        }\n        \n        .logout-button {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 20px;\n          border: none;\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          font-size: 14px;\n          font-weight: 600;\n        }\n        \n        .logout-button:hover {\n          background: rgba(194, 87, 27, 0.15);\n          color: #A8481A;\n        }\n        \n        .settings-main {\n          flex: 1;\n          overflow-y: auto;\n          padding: 32px;\n        }\n        \n        .settings-section {\n          max-width: 800px;\n        }\n        \n        .section-header {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          margin-bottom: 32px;\n          padding-bottom: 16px;\n          border-bottom: 2px solid #E5DCC2;\n        }\n        \n        .section-header h3 {\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .section-header p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .form-section {\n          display: flex;\n          flex-direction: column;\n          gap: 24px;\n        }\n        \n        .logo-section {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          padding: 24px;\n          background: #F3EED9;\n          border-radius: 16px;\n          border: 1px solid #E5DCC2;\n          margin-bottom: 32px;\n        }\n        \n        .logo-preview {\n          width: 120px;\n          height: 120px;\n          border-radius: 16px;\n          overflow: hidden;\n          border: 2px solid #E5DCC2;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          background: #FFFFFF;\n        }\n        \n        .logo-preview img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        \n        .logo-placeholder {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n          text-align: center;\n        }\n        \n        .logo-actions {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .upload-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 16px;\n          background: #3E5C49;\n          color: #F3EED9;\n          border: none;\n          border-radius: 8px;\n          cursor: pointer;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.2s ease;\n        }\n        \n        .upload-button:hover {\n          background: #2E453A;\n        }\n        \n        .remove-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 16px;\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n          border: 1px solid rgba(194, 87, 27, 0.2);\n          border-radius: 8px;\n          cursor: pointer;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.2s ease;\n        }\n        \n        .remove-button:hover {\n          background: rgba(194, 87, 27, 0.15);\n        }\n        \n        .form-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 20px;\n        }\n        \n        .form-group {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .form-group.span-full {\n          grid-column: 1 / -1;\n        }\n        \n        .form-group label {\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .input-wrapper svg {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .form-input {\n          width: 100%;\n          padding: 12px 16px 12px 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          font-size: 14px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .form-input:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .form-textarea {\n          width: 100%;\n          padding: 12px 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          font-size: 14px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n          resize: vertical;\n          min-height: 80px;\n        }\n        \n        .form-textarea:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .backup-status {\n          margin-bottom: 32px;\n        }\n        \n        .status-card {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          padding: 20px;\n          background: rgba(62, 92, 73, 0.05);\n          border: 1px solid rgba(62, 92, 73, 0.1);\n          border-radius: 12px;\n        }\n        \n        .status-icon {\n          width: 48px;\n          height: 48px;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        \n        .status-icon.success {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .status-content h4 {\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .status-content p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .setting-group {\n          padding: 20px;\n          background: #FEFEFE;\n          border: 1px solid #E5DCC2;\n          border-radius: 12px;\n        }\n        \n        .setting-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 8px;\n        }\n        \n        .setting-header h4 {\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin: 0;\n        }\n        \n        .setting-group p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n          line-height: 1.4;\n        }\n        \n        .toggle-switch {\n          position: relative;\n          display: inline-block;\n          width: 44px;\n          height: 24px;\n        }\n        \n        .toggle-switch input {\n          opacity: 0;\n          width: 0;\n          height: 0;\n        }\n        \n        .toggle-slider {\n          position: absolute;\n          cursor: pointer;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: #E5DCC2;\n          transition: 0.3s;\n          border-radius: 24px;\n        }\n        \n        .toggle-slider:before {\n          position: absolute;\n          content: \"\";\n          height: 20px;\n          width: 20px;\n          left: 2px;\n          bottom: 2px;\n          background: #FFFFFF;\n          transition: 0.3s;\n          border-radius: 50%;\n          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n        }\n        \n        input:checked + .toggle-slider {\n          background: #3E5C49;\n        }\n        \n        input:checked + .toggle-slider:before {\n          transform: translateX(20px);\n        }\n        \n        .radio-group {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n          margin-top: 12px;\n        }\n        \n        .radio-option {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          cursor: pointer;\n        }\n        \n        .radio-option input {\n          margin: 0;\n        }\n        \n        .radio-label {\n          font-size: 14px;\n          color: #2E2E2E;\n        }\n        \n        .checkbox-group {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n          margin-top: 12px;\n        }\n        \n        .checkbox-option {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          cursor: pointer;\n        }\n        \n        .checkbox-option input {\n          margin: 0;\n        }\n        \n        .checkbox-label {\n          font-size: 14px;\n          color: #2E2E2E;\n        }\n        \n        .sub-setting {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n          margin-top: 16px;\n        }\n        \n        .sub-setting label {\n          font-size: 13px;\n          font-weight: 500;\n          color: #6E6E6E;\n        }\n        \n        .backup-actions {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n          margin-top: 24px;\n        }\n        \n        .action-button {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 20px;\n          border: none;\n          border-radius: 12px;\n          cursor: pointer;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.2s ease;\n          text-align: left;\n        }\n        \n        .action-button.primary {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .action-button.primary:hover:not(:disabled) {\n          background: #2E453A;\n        }\n        \n        .action-button.secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 1px solid #E5DCC2;\n        }\n        \n        .action-button.secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .action-button.danger {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n          border: 1px solid rgba(194, 87, 27, 0.2);\n        }\n        \n        .action-button.danger:hover:not(:disabled) {\n          background: rgba(194, 87, 27, 0.15);\n        }\n        \n        .action-button:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n        }\n        \n        .about-content {\n          display: flex;\n          flex-direction: column;\n          gap: 32px;\n        }\n        \n        .app-info {\n          text-align: center;\n          padding: 32px;\n          background: #F3EED9;\n          border-radius: 16px;\n          border: 1px solid #E5DCC2;\n        }\n        \n        .app-logo {\n          width: 80px;\n          height: 80px;\n          background: #3E5C49;\n          color: #F3EED9;\n          border-radius: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          margin: 0 auto 20px;\n        }\n        \n        .app-info h3 {\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n        }\n        \n        .app-info p {\n          font-size: 16px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .info-cards {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n          gap: 20px;\n        }\n        \n        .info-card {\n          padding: 20px;\n          background: #FFFFFF;\n          border: 1px solid #E5DCC2;\n          border-radius: 12px;\n        }\n        \n        .info-card h4 {\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin: 0 0 12px 0;\n        }\n        \n        .info-card p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .tech-list {\n          display: flex;\n          flex-wrap: wrap;\n          gap: 8px;\n        }\n        \n        .tech-list span {\n          background: #3E5C49;\n          color: #F3EED9;\n          padding: 4px 12px;\n          border-radius: 16px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .system-info {\n          padding: 24px;\n          background: #FEFEFE;\n          border: 1px solid #E5DCC2;\n          border-radius: 12px;\n        }\n        \n        .system-info h4 {\n          font-size: 18px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n        }\n        \n        .system-details {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .detail-item {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          padding: 12px 0;\n          border-bottom: 1px solid #F3EED9;\n        }\n        \n        .detail-item:last-child {\n          border-bottom: none;\n        }\n        \n        .detail-item span:first-child {\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .detail-item span:last-child {\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .settings-footer {\n          display: flex;\n          justify-content: flex-end;\n          gap: 16px;\n          padding: 24px 32px;\n          border-top: 1px solid #E5DCC2;\n          background: #FEFEFE;\n        }\n        \n        .btn-secondary, .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 24px;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          border: none;\n        }\n        \n        .btn-secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n        }\n        \n        .btn-secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .btn-primary {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .btn-primary:hover:not(:disabled) {\n          background: #2E453A;\n        }\n        \n        .btn-secondary:disabled,\n        .btn-primary:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n        }\n        \n        .spinning {\n          animation: spin 1s linear infinite;\n        }\n        \n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        \n        /* Logout Modal */\n        .logout-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.8);\n          backdrop-filter: blur(4px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1001;\n          padding: 20px;\n        }\n        \n        .logout-modal {\n          background: #FFFFFF;\n          border-radius: 16px;\n          width: 100%;\n          max-width: 400px;\n          padding: 24px;\n          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .logout-header {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          margin-bottom: 16px;\n          color: #C2571B;\n        }\n        \n        .logout-header h3 {\n          font-size: 18px;\n          font-weight: 700;\n          margin: 0;\n        }\n        \n        .logout-modal p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0 0 24px 0;\n          line-height: 1.5;\n        }\n        \n        .logout-actions {\n          display: flex;\n          gap: 12px;\n          justify-content: flex-end;\n        }\n        \n        .btn-danger {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 20px;\n          background: #C2571B;\n          color: #F3EED9;\n          border: none;\n          border-radius: 8px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .btn-danger:hover {\n          background: #A8481A;\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .settings-content {\n            flex-direction: column;\n          }\n          \n          .settings-sidebar {\n            width: 100%;\n            flex-direction: row;\n            justify-content: space-between;\n            padding: 16px 24px;\n            border-right: none;\n            border-bottom: 1px solid #E5DCC2;\n          }\n          \n          .settings-nav {\n            flex-direction: row;\n            gap: 12px;\n            padding: 0;\n            overflow-x: auto;\n          }\n          \n          .nav-button {\n            white-space: nowrap;\n            min-width: 120px;\n            justify-content: center;\n          }\n          \n          .logout-section {\n            border-top: none;\n            border-left: 1px solid #E5DCC2;\n            padding-top: 0;\n            padding-left: 24px;\n          }\n          \n          .logout-button {\n            width: auto;\n            min-width: 140px;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .settings-modal {\n            margin: 12px;\n            border-radius: 20px;\n            max-height: calc(100vh - 24px);\n          }\n          \n          .modal-header {\n            padding: 20px;\n            flex-direction: column;\n            gap: 16px;\n            text-align: center;\n          }\n          \n          .settings-main {\n            padding: 20px;\n          }\n          \n          .form-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .logo-section {\n            flex-direction: column;\n            text-align: center;\n          }\n          \n          .info-cards {\n            grid-template-columns: 1fr;\n          }\n          \n          .settings-footer {\n            padding: 16px 20px;\n            flex-direction: column-reverse;\n          }\n          \n          .btn-secondary,\n          .btn-primary {\n            width: 100%;\n            justify-content: center;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .settings-sidebar {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .settings-nav {\n            flex-direction: column;\n          }\n          \n          .logout-section {\n            border-left: none;\n            border-top: 1px solid #E5DCC2;\n            padding-left: 0;\n            padding-top: 16px;\n          }\n          \n          .backup-actions {\n            gap: 8px;\n          }\n          \n          .action-button {\n            padding: 12px 16px;\n            font-size: 13px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.Settings = Settings;
