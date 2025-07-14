"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Settings = ({ onClose, onLogout }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('institution');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    const [institutionSettings, setInstitutionSettings] = (0, react_1.useState)({
        name: 'Lycée Moderne de Douala',
        address: 'Avenue de la Liberté',
        city: 'Douala',
        country: 'Cameroun',
        phone: '+237 233 42 15 67',
        email: 'contact@lyceemoderne.cm',
        website: 'www.lyceemoderne.cm',
        logo: '',
        description: 'Établissement d\'enseignement secondaire général et technique'
    });
    const [backupSettings, setBackupSettings] = (0, react_1.useState)({
        autoBackup: true,
        backupFrequency: 'weekly',
        lastBackup: new Date().toISOString(),
        cloudSync: false,
        cloudProvider: 'google'
    });
    const [securitySettings, setSecuritySettings] = (0, react_1.useState)({
        requireAuth: true,
        sessionTimeout: 60,
        passwordPolicy: {
            minLength: 6,
            requireNumbers: true,
            requireSymbols: false
        }
    });
    const [showConfirmLogout, setShowConfirmLogout] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        try {
            // Simulate loading settings from storage
            const settings = await window.electronAPI.getSettings();
            if (settings) {
                setInstitutionSettings(settings.institution || institutionSettings);
                setBackupSettings(settings.backup || backupSettings);
                setSecuritySettings(settings.security || securitySettings);
            }
        }
        catch (error) {
            console.error('Error loading settings:', error);
        }
    };
    const saveSettings = async () => {
        setIsLoading(true);
        try {
            await window.electronAPI.saveSettings({
                institution: institutionSettings,
                backup: backupSettings,
                security: securitySettings
            });
            showMessage('success', 'Paramètres sauvegardés avec succès');
        }
        catch (error) {
            showMessage('error', 'Erreur lors de la sauvegarde');
            console.error('Error saving settings:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };
    const handleLogoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInstitutionSettings(prev => ({
                    ...prev,
                    logo: e.target?.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleBackup = async () => {
        setIsLoading(true);
        try {
            await window.electronAPI.createBackup();
            setBackupSettings(prev => ({
                ...prev,
                lastBackup: new Date().toISOString()
            }));
            showMessage('success', 'Sauvegarde créée avec succès');
        }
        catch (error) {
            showMessage('error', 'Erreur lors de la sauvegarde');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRestore = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir restaurer une sauvegarde ? Cela remplacera toutes les données actuelles.')) {
            setIsLoading(true);
            try {
                await window.electronAPI.restoreBackup();
                showMessage('success', 'Données restaurées avec succès');
            }
            catch (error) {
                showMessage('error', 'Erreur lors de la restauration');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    const handleClearData = async () => {
        if (window.confirm('⚠️ ATTENTION: Cette action supprimera définitivement toutes les données. Êtes-vous absolument sûr ?')) {
            if (window.confirm('Dernière confirmation: Voulez-vous vraiment supprimer TOUTES les données ?')) {
                setIsLoading(true);
                try {
                    await window.electronAPI.clearAllData();
                    showMessage('success', 'Toutes les données ont été supprimées');
                }
                catch (error) {
                    showMessage('error', 'Erreur lors de la suppression');
                }
                finally {
                    setIsLoading(false);
                }
            }
        }
    };
    const tabs = [
        { id: 'institution', label: 'Établissement', icon: lucide_react_1.Building },
        { id: 'backup', label: 'Sauvegardes', icon: lucide_react_1.Database },
        { id: 'security', label: 'Sécurité', icon: lucide_react_1.Shield },
        { id: 'about', label: 'À propos', icon: lucide_react_1.Settings }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "settings-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { className: "settings-modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { size: 28 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h2", { className: "modal-title", children: "Param\u00E8tres" }), (0, jsx_runtime_1.jsx)("p", { className: "modal-subtitle", children: "Configuration de l'application" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "close-button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), message && ((0, jsx_runtime_1.jsxs)("div", { className: `message ${message.type}`, children: [message.type === 'success' ? (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: message.text })] })), (0, jsx_runtime_1.jsxs)("div", { className: "settings-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "settings-sidebar", children: [(0, jsx_runtime_1.jsx)("nav", { className: "settings-nav", children: tabs.map((tab) => ((0, jsx_runtime_1.jsxs)("button", { className: `nav-button ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id), children: [(0, jsx_runtime_1.jsx)(tab.icon, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: tab.label })] }, tab.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "logout-section", children: (0, jsx_runtime_1.jsxs)("button", { className: "logout-button", onClick: () => setShowConfirmLogout(true), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 18 }), "Se d\u00E9connecter"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "settings-main", children: [activeTab === 'institution' && ((0, jsx_runtime_1.jsxs)("div", { className: "settings-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Informations de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsx)("p", { children: "Configurez les d\u00E9tails de votre institution" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "logo-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "logo-preview", children: institutionSettings.logo ? ((0, jsx_runtime_1.jsx)("img", { src: institutionSettings.logo, alt: "Logo" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "logo-placeholder", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { size: 32 }), (0, jsx_runtime_1.jsx)("span", { children: "Logo" })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "logo-actions", children: [(0, jsx_runtime_1.jsxs)("label", { className: "upload-button", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 16 }), "Changer le logo", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", onChange: handleLogoUpload, style: { display: 'none' } })] }), institutionSettings.logo && ((0, jsx_runtime_1.jsxs)("button", { className: "remove-button", onClick: () => setInstitutionSettings(prev => ({ ...prev, logo: '' })), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16 }), "Supprimer"] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Nom de l'\u00E9tablissement" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionSettings.name, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, name: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "T\u00E9l\u00E9phone" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: institutionSettings.phone, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, phone: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: institutionSettings.email, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, email: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Site web" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: institutionSettings.website, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, website: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Adresse" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionSettings.address, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, address: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Ville" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: institutionSettings.city, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, city: e.target.value })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group span-full", children: [(0, jsx_runtime_1.jsx)("label", { children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: institutionSettings.description, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, description: e.target.value })), className: "form-textarea", rows: 3 })] })] })] })] })), activeTab === 'backup' && ((0, jsx_runtime_1.jsxs)("div", { className: "settings-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Database, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Gestion des sauvegardes" }), (0, jsx_runtime_1.jsx)("p", { children: "Prot\u00E9gez vos donn\u00E9es avec des sauvegardes automatiques" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "backup-status", children: (0, jsx_runtime_1.jsxs)("div", { className: "status-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "status-icon success", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "status-content", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Derni\u00E8re sauvegarde" }), (0, jsx_runtime_1.jsx)("p", { children: new Date(backupSettings.lastBackup).toLocaleDateString('fr-FR', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-header", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Sauvegarde automatique" }), (0, jsx_runtime_1.jsxs)("label", { className: "toggle-switch", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: backupSettings.autoBackup, onChange: (e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked })) }), (0, jsx_runtime_1.jsx)("span", { className: "toggle-slider" })] })] }), (0, jsx_runtime_1.jsx)("p", { children: "Cr\u00E9er automatiquement des sauvegardes selon la fr\u00E9quence d\u00E9finie" })] }), backupSettings.autoBackup && ((0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Fr\u00E9quence" }), (0, jsx_runtime_1.jsx)("div", { className: "radio-group", children: [
                                                                    { value: 'daily', label: 'Quotidienne' },
                                                                    { value: 'weekly', label: 'Hebdomadaire' },
                                                                    { value: 'monthly', label: 'Mensuelle' }
                                                                ].map((option) => ((0, jsx_runtime_1.jsxs)("label", { className: "radio-option", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "frequency", value: option.value, checked: backupSettings.backupFrequency === option.value, onChange: (e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value })) }), (0, jsx_runtime_1.jsx)("span", { className: "radio-label", children: option.label })] }, option.value))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-header", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Synchronisation cloud" }), (0, jsx_runtime_1.jsxs)("label", { className: "toggle-switch", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: backupSettings.cloudSync, onChange: (e) => setBackupSettings(prev => ({ ...prev, cloudSync: e.target.checked })) }), (0, jsx_runtime_1.jsx)("span", { className: "toggle-slider" })] })] }), (0, jsx_runtime_1.jsx)("p", { children: "Synchroniser automatiquement vos sauvegardes avec le cloud" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "backup-actions", children: [(0, jsx_runtime_1.jsxs)("button", { className: "action-button primary", onClick: handleBackup, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HardDrive, { size: 18 }), "Cr\u00E9er une sauvegarde maintenant"] }), (0, jsx_runtime_1.jsxs)("button", { className: "action-button secondary", onClick: handleRestore, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 18 }), "Restaurer une sauvegarde"] }), (0, jsx_runtime_1.jsxs)("button", { className: "action-button danger", onClick: handleClearData, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 18 }), "Effacer toutes les donn\u00E9es"] })] })] })] })), activeTab === 'security' && ((0, jsx_runtime_1.jsxs)("div", { className: "settings-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Param\u00E8tres de s\u00E9curit\u00E9" }), (0, jsx_runtime_1.jsx)("p", { children: "Configurez la s\u00E9curit\u00E9 et l'authentification" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-header", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Authentification requise" }), (0, jsx_runtime_1.jsxs)("label", { className: "toggle-switch", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: securitySettings.requireAuth, onChange: (e) => setSecuritySettings(prev => ({ ...prev, requireAuth: e.target.checked })) }), (0, jsx_runtime_1.jsx)("span", { className: "toggle-slider" })] })] }), (0, jsx_runtime_1.jsx)("p", { children: "Exiger une connexion pour acc\u00E9der \u00E0 l'application" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsx)("h4", { children: "D\u00E9lai d'expiration de session (minutes)" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "5", max: "480", value: securitySettings.sessionTimeout, onChange: (e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "setting-group", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Politique de mot de passe" }), (0, jsx_runtime_1.jsxs)("div", { className: "sub-setting", children: [(0, jsx_runtime_1.jsx)("label", { children: "Longueur minimale" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "4", max: "20", value: securitySettings.passwordPolicy.minLength, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        minLength: parseInt(e.target.value)
                                                                                    }
                                                                                })), className: "form-input" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "checkbox-group", children: [(0, jsx_runtime_1.jsxs)("label", { className: "checkbox-option", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: securitySettings.passwordPolicy.requireNumbers, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        requireNumbers: e.target.checked
                                                                                    }
                                                                                })) }), (0, jsx_runtime_1.jsx)("span", { className: "checkbox-label", children: "Exiger des chiffres" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "checkbox-option", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: securitySettings.passwordPolicy.requireSymbols, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        requireSymbols: e.target.checked
                                                                                    }
                                                                                })) }), (0, jsx_runtime_1.jsx)("span", { className: "checkbox-label", children: "Exiger des symboles" })] })] })] })] })] })), activeTab === 'about' && ((0, jsx_runtime_1.jsxs)("div", { className: "settings-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\u00C0 propos de l'application" }), (0, jsx_runtime_1.jsx)("p", { children: "Informations sur la version et les cr\u00E9dits" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "about-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "app-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "app-logo", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h3", { children: "Biblioth\u00E8que v2.0.0" }), (0, jsx_runtime_1.jsx)("p", { children: "Syst\u00E8me de gestion moderne pour biblioth\u00E8ques" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-cards", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-card", children: [(0, jsx_runtime_1.jsx)("h4", { children: "D\u00E9velopp\u00E9 par" }), (0, jsx_runtime_1.jsx)("p", { children: "Votre \u00E9quipe de d\u00E9veloppement" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-card", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Technologies utilis\u00E9es" }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-list", children: [(0, jsx_runtime_1.jsx)("span", { children: "Electron" }), (0, jsx_runtime_1.jsx)("span", { children: "React" }), (0, jsx_runtime_1.jsx)("span", { children: "TypeScript" }), (0, jsx_runtime_1.jsx)("span", { children: "SQLite" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-card", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Licence" }), (0, jsx_runtime_1.jsx)("p", { children: "MIT License" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "system-info", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Informations syst\u00E8me" }), (0, jsx_runtime_1.jsxs)("div", { className: "system-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { children: "Version de l'application" }), (0, jsx_runtime_1.jsx)("span", { children: "2.0.0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { children: "Base de donn\u00E9es" }), (0, jsx_runtime_1.jsx)("span", { children: "SQLite v3.39.0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { children: "Plateforme" }), (0, jsx_runtime_1.jsx)("span", { children: "Windows/macOS/Linux" })] })] })] })] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "settings-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: onClose, disabled: isLoading, children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: saveSettings, disabled: isLoading, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { size: 16, className: "spinning" }), "Sauvegarde..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { size: 16 }), "Sauvegarder"] })) })] })] }), showConfirmLogout && ((0, jsx_runtime_1.jsx)("div", { className: "logout-overlay", onClick: () => setShowConfirmLogout(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "logout-modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "logout-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Confirmer la d\u00E9connexion" })] }), (0, jsx_runtime_1.jsx)("p", { children: "\u00CAtes-vous s\u00FBr de vouloir vous d\u00E9connecter ? Toutes les donn\u00E9es non sauvegard\u00E9es seront perdues." }), (0, jsx_runtime_1.jsxs)("div", { className: "logout-actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowConfirmLogout(false), children: "Annuler" }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-danger", onClick: () => {
                                        setShowConfirmLogout(false);
                                        onLogout();
                                    }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 16 }), "Se d\u00E9connecter"] })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .settings-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .message.error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .settings-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .settings-sidebar {
          width: 280px;
          background: #F3EED9;
          border-right: 1px solid #E5DCC2;
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 24px;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }
        
        .nav-button:hover {
          background: rgba(62, 92, 73, 0.08);
          color: #3E5C49;
        }
        
        .nav-button.active {
          background: #3E5C49;
          color: #F3EED9;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.2);
        }
        
        .logout-section {
          padding: 0 24px;
          border-top: 1px solid #E5DCC2;
          padding-top: 24px;
        }
        
        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 600;
        }
        
        .logout-button:hover {
          background: rgba(194, 87, 27, 0.15);
          color: #A8481A;
        }
        
        .settings-main {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .settings-section {
          max-width: 800px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E5DCC2;
        }
        
        .section-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-header p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          background: #F3EED9;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
          margin-bottom: 32px;
        }
        
        .logo-preview {
          width: 120px;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid #E5DCC2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }
        
        .logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
          text-align: center;
        }
        
        .logo-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .upload-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #3E5C49;
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .upload-button:hover {
          background: #2E453A;
        }
        
        .remove-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background: rgba(194, 87, 27, 0.15);
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
        }
        
        .form-group.span-full {
          grid-column: 1 / -1;
        }
        
        .form-group label {
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
        
        .form-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
          resize: vertical;
          min-height: 80px;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .backup-status {
          margin-bottom: 32px;
        }
        
        .status-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
        }
        
        .status-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .status-icon.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .status-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .status-content p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .setting-group {
          padding: 20px;
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .setting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .setting-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }
        
        .setting-group p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.4;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #E5DCC2;
          transition: 0.3s;
          border-radius: 24px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background: #FFFFFF;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        input:checked + .toggle-slider {
          background: #3E5C49;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .radio-option input {
          margin: 0;
        }
        
        .radio-label {
          font-size: 14px;
          color: #2E2E2E;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        
        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .checkbox-option input {
          margin: 0;
        }
        
        .checkbox-label {
          font-size: 14px;
          color: #2E2E2E;
        }
        
        .sub-setting {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        
        .sub-setting label {
          font-size: 13px;
          font-weight: 500;
          color: #6E6E6E;
        }
        
        .backup-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .action-button.primary {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-button.primary:hover:not(:disabled) {
          background: #2E453A;
        }
        
        .action-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .action-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .action-button.danger {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
        }
        
        .action-button.danger:hover:not(:disabled) {
          background: rgba(194, 87, 27, 0.15);
        }
        
        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .app-info {
          text-align: center;
          padding: 32px;
          background: #F3EED9;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
        }
        
        .app-logo {
          width: 80px;
          height: 80px;
          background: #3E5C49;
          color: #F3EED9;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .app-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .app-info p {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .info-card {
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .info-card p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tech-list span {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .system-info {
          padding: 24px;
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .system-info h4 {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .system-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #F3EED9;
        }
        
        .detail-item:last-child {
          border-bottom: none;
        }
        
        .detail-item span:first-child {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .detail-item span:last-child {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .settings-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2E453A;
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Logout Modal */
        .logout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          padding: 20px;
        }
        
        .logout-modal {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .logout-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #C2571B;
        }
        
        .logout-header h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }
        
        .logout-modal p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
        
        .logout-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #C2571B;
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-danger:hover {
          background: #A8481A;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .settings-content {
            flex-direction: column;
          }
          
          .settings-sidebar {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            padding: 16px 24px;
            border-right: none;
            border-bottom: 1px solid #E5DCC2;
          }
          
          .settings-nav {
            flex-direction: row;
            gap: 12px;
            padding: 0;
            overflow-x: auto;
          }
          
          .nav-button {
            white-space: nowrap;
            min-width: 120px;
            justify-content: center;
          }
          
          .logout-section {
            border-top: none;
            border-left: 1px solid #E5DCC2;
            padding-top: 0;
            padding-left: 24px;
          }
          
          .logout-button {
            width: auto;
            min-width: 140px;
          }
        }
        
        @media (max-width: 768px) {
          .settings-modal {
            margin: 12px;
            border-radius: 20px;
            max-height: calc(100vh - 24px);
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .settings-main {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .logo-section {
            flex-direction: column;
            text-align: center;
          }
          
          .info-cards {
            grid-template-columns: 1fr;
          }
          
          .settings-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }
          
          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .settings-sidebar {
            flex-direction: column;
            gap: 16px;
          }
          
          .settings-nav {
            flex-direction: column;
          }
          
          .logout-section {
            border-left: none;
            border-top: 1px solid #E5DCC2;
            padding-left: 0;
            padding-top: 16px;
          }
          
          .backup-actions {
            gap: 8px;
          }
          
          .action-button {
            padding: 12px 16px;
            font-size: 13px;
          }
        }
      ` })] }));
};
exports.Settings = Settings;
