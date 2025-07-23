// Service de configuration sécurisé pour l'application
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface AppConfig {
  supabase: {
    url: string;
    key: string;
  };
  database: {
    path: string;
    backupInterval: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  app: {
    environment: 'development' | 'production' | 'test';
    debug: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
}

class ConfigService {
  private config: AppConfig | null = null;
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
  }

  /**
   * Initialise la configuration
   */
  async initialize(): Promise<void> {
    try {
      await this.loadConfig();
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      await this.createDefaultConfig();
    }
  }

  /**
   * Charge la configuration depuis le fichier
   */
  private async loadConfig(): Promise<void> {
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Fichier de configuration introuvable');
    }

    const configData = fs.readFileSync(this.configPath, 'utf8');
    const parsedConfig = JSON.parse(configData);
    
    // Validation de la configuration
    this.validateConfig(parsedConfig);
    this.config = parsedConfig;
  }

  /**
   * Crée une configuration par défaut
   */
  private async createDefaultConfig(): Promise<void> {
    const defaultConfig: AppConfig = {
      supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || ''
      },
      database: {
        path: path.join(app.getPath('userData'), 'database.db'),
        backupInterval: 24 * 60 * 60 * 1000 // 24 heures
      },
      security: {
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxLoginAttempts: 5,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true
        }
      },
      app: {
        environment: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
        debug: process.env.NODE_ENV !== 'production',
        logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
      }
    };

    this.config = defaultConfig;
    await this.saveConfig();
  }

  /**
   * Valide la structure de la configuration
   */
  private validateConfig(config: any): void {
    const requiredFields = [
      'supabase.url',
      'supabase.key',
      'database.path',
      'security.passwordPolicy.minLength'
    ];

    for (const field of requiredFields) {
      const fieldValue = this.getNestedValue(config, field);
      if (fieldValue === undefined || fieldValue === null) {
        throw new Error(`Champ de configuration manquant: ${field}`);
      }
    }

    // Validation des clés Supabase
    if (config.supabase.url && !config.supabase.url.startsWith('https://')) {
      throw new Error('URL Supabase invalide');
    }

    if (config.supabase.key && config.supabase.key.length < 100) {
      console.warn('Clé Supabase suspicieusement courte');
    }
  }

  /**
   * Récupère une valeur imbriquée dans un objet
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Sauvegarde la configuration
   */
  private async saveConfig(): Promise<void> {
    if (!this.config) {
      throw new Error('Aucune configuration à sauvegarder');
    }

    // Créer le répertoire s'il n'existe pas
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  /**
   * Récupère la configuration complète
   */
  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration non initialisée');
    }
    return this.config;
  }

  /**
   * Récupère une section spécifique de la configuration
   */
  get<K extends keyof AppConfig>(section: K): AppConfig[K] {
    return this.getConfig()[section];
  }

  /**
   * Met à jour une section de la configuration
   */
  async updateConfig<K extends keyof AppConfig>(
    section: K, 
    updates: Partial<AppConfig[K]>
  ): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration non initialisée');
    }

    this.config[section] = { ...this.config[section], ...updates };
    await this.saveConfig();
  }

  /**
   * Vérifie si l'application est en mode debug
   */
  isDebugMode(): boolean {
    return this.get('app').debug;
  }

  /**
   * Vérifie si l'application est en production
   */
  isProduction(): boolean {
    return this.get('app').environment === 'production';
  }

  /**
   * Récupère le niveau de log configuré
   */
  getLogLevel(): string {
    return this.get('app').logLevel;
  }

  /**
   * Vérifie si les clés Supabase sont configurées
   */
  hasSupabaseConfig(): boolean {
    const supabaseConfig = this.get('supabase');
    return !!(supabaseConfig.url && supabaseConfig.key);
  }

  /**
   * Récupère la configuration de sécurité pour les mots de passe
   */
  getPasswordPolicy() {
    return this.get('security').passwordPolicy;
  }
}

// Instance singleton
export const configService = new ConfigService();
export default configService;