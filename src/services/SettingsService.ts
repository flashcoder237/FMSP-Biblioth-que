import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface InstitutionSettings {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
  establishedYear?: string;
  type: 'school' | 'university' | 'library' | 'other';
  director?: string;
  capacity?: number;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string;
  backupLocation: string;
  keepBackups: number;
  cloudSync: boolean;
  cloudProvider: 'google' | 'dropbox' | 'onedrive' | 'none';
  cloudPath?: string;
}

export interface SecuritySettings {
  requireAuth: boolean;
  sessionTimeout: number; // en minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // en minutes
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    maxAge?: number; // en jours
  };
  twoFactorAuth: boolean;
  auditLog: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'es';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  colorScheme: 'default' | 'green' | 'blue' | 'purple';
}

export interface LibrarySettings {
  defaultLoanPeriod: number; // en jours
  maxRenewals: number;
  maxBooksPerUser: number;
  lateFeesEnabled: boolean;
  lateFeeAmount: number;
  gracePeriod: number; // en jours
  reservationEnabled: boolean;
  reservationPeriod: number; // en jours
  categoriesRequired: boolean;
  isbnRequired: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  overdueReminders: boolean;
  reminderDaysBefore: number;
  returnConfirmation: boolean;
  newBookNotifications: boolean;
  systemNotifications: boolean;
  smtpServer?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
}

export interface ApplicationSettings {
  institution: InstitutionSettings;
  backup: BackupSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  library: LibrarySettings;
  notifications: NotificationSettings;
  version: string;
  lastUpdated: string;
}

export class SettingsService {
  private settingsFilePath: string;
  private settings: ApplicationSettings;
  private defaultSettings: ApplicationSettings;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.settingsFilePath = path.join(userDataPath, 'settings.json');
    
    this.defaultSettings = this.createDefaultSettings();
    this.settings = { ...this.defaultSettings };
    
    this.loadSettings();
  }

  private createDefaultSettings(): ApplicationSettings {
    const userDataPath = app.getPath('userData');
    
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

  private loadSettings(): void {
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        const data = fs.readFileSync(this.settingsFilePath, 'utf8');
        const loadedSettings = JSON.parse(data);
        
        // Fusionner avec les paramètres par défaut pour s'assurer que toutes les propriétés existent
        this.settings = this.mergeSettings(this.defaultSettings, loadedSettings);
        
        // Validation et migration si nécessaire
        this.validateAndMigrateSettings();
      } else {
        // Créer le fichier de paramètres avec les valeurs par défaut
        this.saveSettings();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      this.settings = { ...this.defaultSettings };
      this.saveSettings();
    }
  }

  private mergeSettings(defaultSettings: any, loadedSettings: any): any {
    const merged = { ...defaultSettings };
    
    for (const key in loadedSettings) {
      if (loadedSettings.hasOwnProperty(key)) {
        if (typeof loadedSettings[key] === 'object' && loadedSettings[key] !== null && !Array.isArray(loadedSettings[key])) {
          merged[key] = this.mergeSettings(defaultSettings[key] || {}, loadedSettings[key]);
        } else {
          merged[key] = loadedSettings[key];
        }
      }
    }
    
    return merged;
  }

  private validateAndMigrateSettings(): void {
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

  private saveSettings(): void {
    try {
      this.settings.lastUpdated = new Date().toISOString();
      const data = JSON.stringify(this.settings, null, 2);
      fs.writeFileSync(this.settingsFilePath, data, 'utf8');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  }

  // Méthodes publiques
  getSettings(): ApplicationSettings {
    return { ...this.settings };
  }

  saveUserSettings(newSettings: ApplicationSettings): boolean {
    try {
      if (typeof newSettings !== 'object' || newSettings === null) {
        throw new Error('Invalid settings object');
      }
      this.settings = { ...newSettings };
      this.validateAndMigrateSettings();
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres utilisateur:', error);
      return false;
    }
  }

  // Méthodes spécifiques par section
  getInstitutionSettings(): InstitutionSettings {
    return { ...this.settings.institution };
  }

  saveInstitutionSettings(institutionSettings: InstitutionSettings): boolean {
    try {
      this.settings.institution = { ...institutionSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres d\'établissement:', error);
      return false;
    }
  }

  getBackupSettings(): BackupSettings {
    return { ...this.settings.backup };
  }

  saveBackupSettings(backupSettings: BackupSettings): boolean {
    try {
      this.settings.backup = { ...backupSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres de sauvegarde:', error);
      return false;
    }
  }

  getSecuritySettings(): SecuritySettings {
    return { ...this.settings.security };
  }

  saveSecuritySettings(securitySettings: SecuritySettings): boolean {
    try {
      this.settings.security = { ...securitySettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres de sécurité:', error);
      return false;
    }
  }

  getAppearanceSettings(): AppearanceSettings {
    return { ...this.settings.appearance };
  }

  saveAppearanceSettings(appearanceSettings: AppearanceSettings): boolean {
    try {
      this.settings.appearance = { ...appearanceSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres d\'apparence:', error);
      return false;
    }
  }

  getLibrarySettings(): LibrarySettings {
    return { ...this.settings.library };
  }

  saveLibrarySettings(librarySettings: LibrarySettings): boolean {
    try {
      this.settings.library = { ...librarySettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres de bibliothèque:', error);
      return false;
    }
  }

  getNotificationSettings(): NotificationSettings {
    return { ...this.settings.notifications };
  }

  saveNotificationSettings(notificationSettings: NotificationSettings): boolean {
    try {
      this.settings.notifications = { ...notificationSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
      return false;
    }
  }

  // Méthodes utilitaires
  resetToDefaults(): boolean {
    try {
      this.settings = { ...this.defaultSettings };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des paramètres:', error);
      return false;
    }
  }

  resetSectionToDefault(section: keyof ApplicationSettings): boolean {
    try {
      if (section in this.defaultSettings) {
        (this.settings as any)[section] = { ...(this.defaultSettings[section] as any) };
        this.saveSettings();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erreur lors de la réinitialisation de la section ${section}:`, error);
      return false;
    }
  }

  exportSettings(): string {
    try {
      return JSON.stringify(this.settings, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export des paramètres:', error);
      return '';
    }
  }

  importSettings(settingsJson: string): boolean {
    try {
      const importedSettings = JSON.parse(settingsJson);
      this.settings = this.mergeSettings(this.defaultSettings, importedSettings);
      this.validateAndMigrateSettings();
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import des paramètres:', error);
      return false;
    }
  }

  validateSettings(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

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

  getSettingsInfo(): {
    filePath: string;
    fileSize: number;
    lastModified: string;
    version: string;
  } {
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
    } catch (error) {
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
  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    this.settings.appearance.theme = theme;
    this.saveSettings();
  }

  async getTheme(): Promise<string> {
    return this.settings.appearance.theme;
  }
}