// src/renderer/services/ConfigService.ts
export type AppMode = 'offline' | 'online';

export interface AppConfig {
  mode: AppMode;
  isConfigured: boolean;
  configuredAt: string;
  version: string;
}

export class ConfigService {
  private static readonly CONFIG_KEY = 'bibliotheque_app_config';
  private static readonly DEFAULT_CONFIG: AppConfig = {
    mode: 'offline',
    isConfigured: false,
    configuredAt: '',
    version: '1.0.0'
  };

  /**
   * Charge la configuration depuis localStorage
   */
  static getConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        return { ...this.DEFAULT_CONFIG, ...config };
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
    return this.DEFAULT_CONFIG;
  }

  /**
   * Sauvegarde la configuration dans localStorage
   */
  static saveConfig(config: Partial<AppConfig>): void {
    try {
      const currentConfig = this.getConfig();
      const newConfig: AppConfig = {
        ...currentConfig,
        ...config,
        configuredAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
      console.log('Configuration sauvegardée:', newConfig);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'application a été configurée
   */
  static isConfigured(): boolean {
    return this.getConfig().isConfigured;
  }

  /**
   * Obtient le mode de fonctionnement actuel
   */
  static getMode(): AppMode {
    return this.getConfig().mode;
  }

  /**
   * Configure l'application avec le mode choisi
   */
  static configureApp(mode: AppMode): void {
    this.saveConfig({
      mode,
      isConfigured: true
    });
  }

  /**
   * Réinitialise la configuration (pour les tests ou la reconfiguration)
   */
  static resetConfig(): void {
    try {
      localStorage.removeItem(this.CONFIG_KEY);
      console.log('Configuration réinitialisée');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  /**
   * Met à jour uniquement le mode sans affecter les autres paramètres
   */
  static updateMode(mode: AppMode): void {
    this.saveConfig({ mode });
  }

  /**
   * Obtient les informations de configuration pour l'affichage
   */
  static getConfigInfo(): { 
    mode: AppMode; 
    isConfigured: boolean; 
    configuredAt: string; 
    displayMode: string 
  } {
    const config = this.getConfig();
    return {
      ...config,
      displayMode: config.mode === 'offline' ? 'Hors Ligne' : 'En Ligne'
    };
  }

  /**
   * Valide si le mode est supporté
   */
  static isModeSupported(mode: AppMode): boolean {
    // Pour cette version, seul le mode offline est supporté
    return mode === 'offline';
  }

  /**
   * Obtient la liste des modes disponibles
   */
  static getAvailableModes(): Array<{ value: AppMode; label: string; supported: boolean }> {
    return [
      { value: 'offline', label: 'Hors Ligne', supported: true },
      { value: 'online', label: 'En Ligne', supported: false }
    ];
  }
}