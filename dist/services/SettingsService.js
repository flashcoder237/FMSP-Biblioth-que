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
exports.SettingsService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const electron_1 = require("electron");
class SettingsService {
    constructor() {
        const userDataPath = electron_1.app.getPath('userData');
        this.settingsFilePath = path.join(userDataPath, 'settings.json');
        this.defaultSettings = this.createDefaultSettings();
        this.settings = { ...this.defaultSettings };
        this.loadSettings();
    }
    createDefaultSettings() {
        const userDataPath = electron_1.app.getPath('userData');
        return {
            institution: {
                name: 'Ma Bibliothèque',
                address: '',
                city: 'Douala',
                country: 'Cameroun',
                phone: '',
                email: '',
                website: '',
                logo: '',
                description: 'Système de gestion de bibliothèque moderne',
                type: 'library'
            },
            backup: {
                autoBackup: true,
                backupFrequency: 'weekly',
                lastBackup: '',
                backupLocation: path.join(userDataPath, 'backups'),
                keepBackups: 10,
                cloudSync: false,
                cloudProvider: 'none'
            },
            security: {
                requireAuth: true,
                sessionTimeout: 60, // 1 heure
                maxLoginAttempts: 5,
                lockoutDuration: 15, // 15 minutes
                passwordPolicy: {
                    minLength: 6,
                    requireNumbers: true,
                    requireSymbols: false,
                    requireUppercase: false,
                    requireLowercase: true
                },
                twoFactorAuth: false,
                auditLog: true
            },
            appearance: {
                theme: 'light',
                language: 'fr',
                fontSize: 'medium',
                compactMode: false,
                animations: true,
                colorScheme: 'default'
            },
            library: {
                defaultLoanPeriod: 14, // 2 semaines
                maxRenewals: 2,
                maxBooksPerUser: 5,
                lateFeesEnabled: false,
                lateFeeAmount: 0,
                gracePeriod: 3,
                reservationEnabled: true,
                reservationPeriod: 7,
                categoriesRequired: true,
                isbnRequired: false
            },
            notifications: {
                emailNotifications: false,
                overdueReminders: true,
                reminderDaysBefore: 3,
                returnConfirmation: true,
                newBookNotifications: false,
                systemNotifications: true
            },
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };
    }
    loadSettings() {
        try {
            if (fs.existsSync(this.settingsFilePath)) {
                const data = fs.readFileSync(this.settingsFilePath, 'utf8');
                const loadedSettings = JSON.parse(data);
                // Fusionner avec les paramètres par défaut pour s'assurer que toutes les propriétés existent
                this.settings = this.mergeSettings(this.defaultSettings, loadedSettings);
                // Validation et migration si nécessaire
                this.validateAndMigrateSettings();
            }
            else {
                // Créer le fichier de paramètres avec les valeurs par défaut
                this.saveSettings();
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
        }
    }
    mergeSettings(defaultSettings, loadedSettings) {
        const merged = { ...defaultSettings };
        for (const key in loadedSettings) {
            if (loadedSettings.hasOwnProperty(key)) {
                if (typeof loadedSettings[key] === 'object' && loadedSettings[key] !== null && !Array.isArray(loadedSettings[key])) {
                    merged[key] = this.mergeSettings(defaultSettings[key] || {}, loadedSettings[key]);
                }
                else {
                    merged[key] = loadedSettings[key];
                }
            }
        }
        return merged;
    }
    validateAndMigrateSettings() {
        let needsSave = false;
        // Validation des valeurs numériques
        if (this.settings.security.sessionTimeout < 5) {
            this.settings.security.sessionTimeout = 5;
            needsSave = true;
        }
        if (this.settings.security.passwordPolicy.minLength < 4) {
            this.settings.security.passwordPolicy.minLength = 4;
            needsSave = true;
        }
        if (this.settings.library.defaultLoanPeriod < 1) {
            this.settings.library.defaultLoanPeriod = 7;
            needsSave = true;
        }
        if (this.settings.backup.keepBackups < 1) {
            this.settings.backup.keepBackups = 5;
            needsSave = true;
        }
        // Validation des énumérations
        const validThemes = ['light', 'dark', 'auto'];
        if (!validThemes.includes(this.settings.appearance.theme)) {
            this.settings.appearance.theme = 'light';
            needsSave = true;
        }
        const validLanguages = ['fr', 'en', 'es'];
        if (!validLanguages.includes(this.settings.appearance.language)) {
            this.settings.appearance.language = 'fr';
            needsSave = true;
        }
        // Mettre à jour la version et la date si nécessaire
        if (this.settings.version !== this.defaultSettings.version) {
            this.settings.version = this.defaultSettings.version;
            this.settings.lastUpdated = new Date().toISOString();
            needsSave = true;
        }
        if (needsSave) {
            this.saveSettings();
        }
    }
    saveSettings() {
        try {
            this.settings.lastUpdated = new Date().toISOString();
            const data = JSON.stringify(this.settings, null, 2);
            fs.writeFileSync(this.settingsFilePath, data, 'utf8');
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
        }
    }
    // Méthodes publiques
    getSettings() {
        return { ...this.settings };
    }
    saveUserSettings(newSettings) {
        try {
            if (typeof newSettings !== 'object' || newSettings === null) {
                throw new Error('Invalid settings object');
            }
            this.settings = { ...newSettings };
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres utilisateur:', error);
            return false;
        }
    }
    // Méthodes spécifiques par section
    getInstitutionSettings() {
        return { ...this.settings.institution };
    }
    saveInstitutionSettings(institutionSettings) {
        try {
            this.settings.institution = { ...institutionSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'établissement:', error);
            return false;
        }
    }
    getBackupSettings() {
        return { ...this.settings.backup };
    }
    saveBackupSettings(backupSettings) {
        try {
            this.settings.backup = { ...backupSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sauvegarde:', error);
            return false;
        }
    }
    getSecuritySettings() {
        return { ...this.settings.security };
    }
    saveSecuritySettings(securitySettings) {
        try {
            this.settings.security = { ...securitySettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sécurité:', error);
            return false;
        }
    }
    getAppearanceSettings() {
        return { ...this.settings.appearance };
    }
    saveAppearanceSettings(appearanceSettings) {
        try {
            this.settings.appearance = { ...appearanceSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'apparence:', error);
            return false;
        }
    }
    getLibrarySettings() {
        return { ...this.settings.library };
    }
    saveLibrarySettings(librarySettings) {
        try {
            this.settings.library = { ...librarySettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de bibliothèque:', error);
            return false;
        }
    }
    getNotificationSettings() {
        return { ...this.settings.notifications };
    }
    saveNotificationSettings(notificationSettings) {
        try {
            this.settings.notifications = { ...notificationSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
            return false;
        }
    }
    // Méthodes utilitaires
    resetToDefaults() {
        try {
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la réinitialisation des paramètres:', error);
            return false;
        }
    }
    resetSectionToDefault(section) {
        try {
            if (section in this.defaultSettings) {
                this.settings[section] = { ...this.defaultSettings[section] };
                this.saveSettings();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`Erreur lors de la réinitialisation de la section ${section}:`, error);
            return false;
        }
    }
    exportSettings() {
        try {
            return JSON.stringify(this.settings, null, 2);
        }
        catch (error) {
            console.error('Erreur lors de l\'export des paramètres:', error);
            return '';
        }
    }
    importSettings(settingsJson) {
        try {
            const importedSettings = JSON.parse(settingsJson);
            this.settings = this.mergeSettings(this.defaultSettings, importedSettings);
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de l\'import des paramètres:', error);
            return false;
        }
    }
    validateSettings() {
        const errors = [];
        // Validation de l'établissement
        if (!this.settings.institution.name.trim()) {
            errors.push('Le nom de l\'établissement est requis');
        }
        // Validation de la sécurité
        if (this.settings.security.sessionTimeout < 5 || this.settings.security.sessionTimeout > 1440) {
            errors.push('Le délai d\'expiration de session doit être entre 5 et 1440 minutes');
        }
        if (this.settings.security.passwordPolicy.minLength < 4 || this.settings.security.passwordPolicy.minLength > 50) {
            errors.push('La longueur minimale du mot de passe doit être entre 4 et 50 caractères');
        }
        // Validation de la bibliothèque
        if (this.settings.library.defaultLoanPeriod < 1 || this.settings.library.defaultLoanPeriod > 365) {
            errors.push('La période d\'emprunt par défaut doit être entre 1 et 365 jours');
        }
        if (this.settings.library.maxBooksPerUser < 1 || this.settings.library.maxBooksPerUser > 100) {
            errors.push('Le nombre maximum de livres par utilisateur doit être entre 1 et 100');
        }
        // Validation des sauvegardes
        if (this.settings.backup.keepBackups < 1 || this.settings.backup.keepBackups > 100) {
            errors.push('Le nombre de sauvegardes à conserver doit être entre 1 et 100');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    getSettingsInfo() {
        try {
            const stats = fs.existsSync(this.settingsFilePath)
                ? fs.statSync(this.settingsFilePath)
                : null;
            return {
                filePath: this.settingsFilePath,
                fileSize: stats ? stats.size : 0,
                lastModified: stats ? stats.mtime.toISOString() : '',
                version: this.settings.version
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des informations de paramètres:', error);
            return {
                filePath: this.settingsFilePath,
                fileSize: 0,
                lastModified: '',
                version: this.settings.version
            };
        }
    }
    // Méthodes de compatibilité pour l'ancien système
    async setTheme(theme) {
        this.settings.appearance.theme = theme;
        this.saveSettings();
    }
    async getTheme() {
        return this.settings.appearance.theme;
    }
}
exports.SettingsService = SettingsService;
