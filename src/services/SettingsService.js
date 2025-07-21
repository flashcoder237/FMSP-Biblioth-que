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
exports.SettingsService = void 0;
var fs = require("fs");
var path = require("path");
var electron_1 = require("electron");
var SettingsService = /** @class */ (function () {
    function SettingsService() {
        var userDataPath = electron_1.app.getPath('userData');
        this.settingsFilePath = path.join(userDataPath, 'settings.json');
        this.defaultSettings = this.createDefaultSettings();
        this.settings = __assign({}, this.defaultSettings);
        this.loadSettings();
    }
    SettingsService.prototype.createDefaultSettings = function () {
        var userDataPath = electron_1.app.getPath('userData');
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
    };
    SettingsService.prototype.loadSettings = function () {
        try {
            if (fs.existsSync(this.settingsFilePath)) {
                var data = fs.readFileSync(this.settingsFilePath, 'utf8');
                var loadedSettings = JSON.parse(data);
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
            this.settings = __assign({}, this.defaultSettings);
            this.saveSettings();
        }
    };
    SettingsService.prototype.mergeSettings = function (defaultSettings, loadedSettings) {
        var merged = __assign({}, defaultSettings);
        for (var key in loadedSettings) {
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
    };
    SettingsService.prototype.validateAndMigrateSettings = function () {
        var needsSave = false;
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
        var validThemes = ['light', 'dark', 'auto'];
        if (!validThemes.includes(this.settings.appearance.theme)) {
            this.settings.appearance.theme = 'light';
            needsSave = true;
        }
        var validLanguages = ['fr', 'en', 'es'];
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
    };
    SettingsService.prototype.saveSettings = function () {
        try {
            this.settings.lastUpdated = new Date().toISOString();
            var data = JSON.stringify(this.settings, null, 2);
            fs.writeFileSync(this.settingsFilePath, data, 'utf8');
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
        }
    };
    // Méthodes publiques
    SettingsService.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    SettingsService.prototype.saveUserSettings = function (newSettings) {
        try {
            if (typeof newSettings !== 'object' || newSettings === null) {
                throw new Error('Invalid settings object');
            }
            this.settings = __assign({}, newSettings);
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres utilisateur:', error);
            return false;
        }
    };
    // Méthodes spécifiques par section
    SettingsService.prototype.getInstitutionSettings = function () {
        return __assign({}, this.settings.institution);
    };
    SettingsService.prototype.saveInstitutionSettings = function (institutionSettings) {
        try {
            this.settings.institution = __assign({}, institutionSettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'établissement:', error);
            return false;
        }
    };
    SettingsService.prototype.getBackupSettings = function () {
        return __assign({}, this.settings.backup);
    };
    SettingsService.prototype.saveBackupSettings = function (backupSettings) {
        try {
            this.settings.backup = __assign({}, backupSettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sauvegarde:', error);
            return false;
        }
    };
    SettingsService.prototype.getSecuritySettings = function () {
        return __assign({}, this.settings.security);
    };
    SettingsService.prototype.saveSecuritySettings = function (securitySettings) {
        try {
            this.settings.security = __assign({}, securitySettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sécurité:', error);
            return false;
        }
    };
    SettingsService.prototype.getAppearanceSettings = function () {
        return __assign({}, this.settings.appearance);
    };
    SettingsService.prototype.saveAppearanceSettings = function (appearanceSettings) {
        try {
            this.settings.appearance = __assign({}, appearanceSettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'apparence:', error);
            return false;
        }
    };
    SettingsService.prototype.getLibrarySettings = function () {
        return __assign({}, this.settings.library);
    };
    SettingsService.prototype.saveLibrarySettings = function (librarySettings) {
        try {
            this.settings.library = __assign({}, librarySettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de bibliothèque:', error);
            return false;
        }
    };
    SettingsService.prototype.getNotificationSettings = function () {
        return __assign({}, this.settings.notifications);
    };
    SettingsService.prototype.saveNotificationSettings = function (notificationSettings) {
        try {
            this.settings.notifications = __assign({}, notificationSettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
            return false;
        }
    };
    // Méthodes utilitaires
    SettingsService.prototype.resetToDefaults = function () {
        try {
            this.settings = __assign({}, this.defaultSettings);
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la réinitialisation des paramètres:', error);
            return false;
        }
    };
    SettingsService.prototype.resetSectionToDefault = function (section) {
        try {
            if (section in this.defaultSettings) {
                this.settings[section] = __assign({}, this.defaultSettings[section]);
                this.saveSettings();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Erreur lors de la r\u00E9initialisation de la section ".concat(section, ":"), error);
            return false;
        }
    };
    SettingsService.prototype.exportSettings = function () {
        try {
            return JSON.stringify(this.settings, null, 2);
        }
        catch (error) {
            console.error('Erreur lors de l\'export des paramètres:', error);
            return '';
        }
    };
    SettingsService.prototype.importSettings = function (settingsJson) {
        try {
            var importedSettings = JSON.parse(settingsJson);
            this.settings = this.mergeSettings(this.defaultSettings, importedSettings);
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de l\'import des paramètres:', error);
            return false;
        }
    };
    SettingsService.prototype.validateSettings = function () {
        var errors = [];
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
            errors: errors
        };
    };
    SettingsService.prototype.getSettingsInfo = function () {
        try {
            var stats = fs.existsSync(this.settingsFilePath)
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
    };
    // Méthodes de compatibilité pour l'ancien système
    SettingsService.prototype.setTheme = function (theme) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.settings.appearance.theme = theme;
                this.saveSettings();
                return [2 /*return*/];
            });
        });
    };
    SettingsService.prototype.getTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.settings.appearance.theme];
            });
        });
    };
    return SettingsService;
}());
exports.SettingsService = SettingsService;
