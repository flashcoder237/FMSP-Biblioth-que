import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Save, 
  Wifi, 
  WifiOff, 
  Database, 
  Shield,
  User,
  Building,
  Info,
  RotateCcw,
  Check,
  Upload,
  Globe
} from 'lucide-react';
import { MicroButton, MicroCard } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';
import { InstitutionSettings } from '../../preload';

interface AppSettingsProps {
  onClose: () => void;
}

interface AppConfig {
  mode: 'offline' | 'online';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  requireAppPassword: boolean;
  sessionTimeout: number;
  theme: 'light' | 'dark';
}

export const AppSettings: React.FC<AppSettingsProps> = ({ onClose }) => {
  const { success, error } = useQuickToast();
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'security' | 'institution' | 'about'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
    mode: 'offline',
    autoBackup: false,
    backupFrequency: 'weekly',
    requireAppPassword: false,
    sessionTimeout: 30,
    theme: 'light'
  });
  const [appPassword, setAppPassword] = useState<string>('');
  const [showPasswordSection, setShowPasswordSection] = useState<boolean>(false);
  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettings>({
    name: 'Bibliothèque Numérique',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    description: 'Système de gestion de bibliothèque moderne'
  });

  useEffect(() => {
    loadConfig();
    checkAdminStatus();
    loadAppPasswordSettings();
  }, []);

  const loadConfig = () => {
    // Charger la configuration depuis localStorage
    const storedMode = localStorage.getItem('appMode') || 'offline';
    const storedConfig = localStorage.getItem('appConfig');
    
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        setConfig({ ...config, mode: storedMode as 'offline' | 'online', ...parsed });
      } catch (e) {
        console.warn('Could not parse stored config:', e);
      }
    } else {
      setConfig(prev => ({ ...prev, mode: storedMode as 'offline' | 'online' }));
    }

    // Charger les paramètres d'institution
    const storedInstitution = localStorage.getItem('institutionSettings');
    if (storedInstitution) {
      try {
        const parsed = JSON.parse(storedInstitution);
        setInstitutionSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.warn('Could not parse institution settings:', e);
      }
    }
  };

  const loadAppPasswordSettings = () => {
    try {
      const appSettings = localStorage.getItem('app_settings');
      if (appSettings) {
        const parsed = JSON.parse(appSettings);
        setConfig(prev => ({ 
          ...prev, 
          requireAppPassword: parsed.requireAppPassword || false 
        }));
        setShowPasswordSection(parsed.requireAppPassword || false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres de mot de passe:', error);
    }
  };

  const checkAdminStatus = () => {
    // Vérifier si l'utilisateur connecté est un admin
    const currentUser = localStorage.getItem('currentUser');
    const appMode = localStorage.getItem('appMode');
    
    // En mode offline, permettre l'accès admin par défaut si aucun utilisateur spécifique n'est défini
    if (appMode === 'offline') {
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          setIsAdmin(user.role === 'admin' || user.isAdmin === true);
        } catch (e) {
          console.warn('Could not parse current user:', e);
          // En mode offline, donner accès admin par défaut
          setIsAdmin(true);
        }
      } else {
        // Pas d'utilisateur défini en mode offline, donner accès admin
        setIsAdmin(true);
      }
    } else {
      // Mode online, vérification stricte
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          setIsAdmin(user.role === 'admin' || user.isAdmin === true);
        } catch (e) {
          console.warn('Could not parse current user:', e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      // Sauvegarder la configuration
      localStorage.setItem('appMode', config.mode);
      localStorage.setItem('appConfig', JSON.stringify({
        autoBackup: config.autoBackup,
        backupFrequency: config.backupFrequency,
        requireAppPassword: config.requireAppPassword,
        sessionTimeout: config.sessionTimeout,
        theme: config.theme
      }));

      // Sauvegarder les paramètres de mot de passe d'application via LocalAuthService
      if (config.requireAppPassword && appPassword.trim()) {
        const appSettings = JSON.parse(localStorage.getItem('app_settings') || '{}');
        appSettings.requireAppPassword = true;
        appSettings.appPassword = appPassword; // En production, il faudrait hasher
        localStorage.setItem('app_settings', JSON.stringify(appSettings));
      } else if (!config.requireAppPassword) {
        const appSettings = JSON.parse(localStorage.getItem('app_settings') || '{}');
        appSettings.requireAppPassword = false;
        delete appSettings.appPassword;
        localStorage.setItem('app_settings', JSON.stringify(appSettings));
      }

      // Sauvegarder les paramètres d'institution si admin
      if (isAdmin) {
        localStorage.setItem('institutionSettings', JSON.stringify(institutionSettings));
      }

      success('Configuration sauvegardée', 'Les paramètres ont été enregistrés avec succès');
      
      // Redémarrer l'application si le mode a changé
      if (config.mode !== localStorage.getItem('appMode')) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      error('Erreur de sauvegarde', 'Impossible de sauvegarder la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setConfig({
        mode: 'offline',
        autoBackup: false,
        backupFrequency: 'weekly',
        requireAppPassword: false,
        sessionTimeout: 30,
        theme: 'light'
      });
    }
  };

  const resetDatabase = async () => {
    if (window.confirm('🔧 Réinitialiser la base de données ?\n\nCela va corriger les problèmes de schéma mais supprimera toutes les données.')) {
      try {
        // Supprimer toutes les données
        await window.electronAPI?.clearAllData();
        
        success('Base de données réinitialisée', 'Le schéma de la base de données a été corrigé. L\'application va redémarrer.');
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        error('Erreur', 'Impossible de réinitialiser la base de données');
        console.error('Erreur de réinitialisation:', err);
      }
    }
  };

  const clearAllData = async () => {
    if (window.confirm('⚠️ ATTENTION: Cette action supprimera TOUTES les données de l\'application. Êtes-vous absolument sûr ?')) {
      if (window.confirm('Cette action est IRRÉVERSIBLE. Tapez "CONFIRMER" dans la prochaine boîte pour continuer.')) {
        const confirmation = window.prompt('Tapez "CONFIRMER" pour supprimer toutes les données:');
        if (confirmation === 'CONFIRMER') {
          try {
            // Nettoyer la base de données
            await window.electronAPI?.clearAllData();
            
            // Nettoyer le localStorage
            localStorage.clear();
            
            success('Données supprimées', 'Toutes les données ont été supprimées. L\'application va redémarrer.');
            
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (err) {
            error('Erreur', 'Impossible de supprimer les données');
          }
        }
      }
    }
  };

  const handleInputChange = (field: keyof AppConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleInstitutionChange = (field: keyof InstitutionSettings, value: string) => {
    setInstitutionSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInstitutionSettings(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'general' as const, label: 'Général', icon: Settings },
    { id: 'database' as const, label: 'Base de données', icon: Database },
    { id: 'security' as const, label: 'Sécurité', icon: Shield },
    ...(isAdmin ? [{ id: 'institution' as const, label: 'Institution', icon: Building }] : []),
    { id: 'about' as const, label: 'À propos', icon: Info }
  ];

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Settings size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Paramètres de l'application</h2>
              <p className="modal-subtitle">Configurez votre bibliothèque numérique</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          {/* Tabs */}
          <div className="tabs-container">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'general' && (
              <div className="tab-panel">
                <div className="setting-group">
                  <h3 className="group-title">Mode de fonctionnement</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Mode de l'application</label>
                      <p className="setting-description">
                        Choisissez entre le mode hors ligne (SQLite local) ou en ligne (Supabase)
                      </p>
                    </div>
                    <div className="setting-control">
                      <select
                        value={config.mode}
                        onChange={(e) => handleInputChange('mode', e.target.value)}
                        className="setting-select"
                      >
                        <option value="offline">🔒 Hors ligne (SQLite)</option>
                        <option value="online">🌐 En ligne (Supabase)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <h3 className="group-title">Thème</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Apparence</label>
                      <p className="setting-description">Choisissez le thème de l'interface</p>
                    </div>
                    <div className="setting-control">
                      <select
                        value={config.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        className="setting-select"
                      >
                        <option value="light">☀️ Clair</option>
                        <option value="dark">🌙 Sombre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="tab-panel">
                <div className="setting-group">
                  <h3 className="group-title">Sauvegarde automatique</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Activer la sauvegarde automatique</label>
                      <p className="setting-description">
                        Sauvegarder automatiquement la base de données
                      </p>
                    </div>
                    <div className="setting-control">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={config.autoBackup}
                          onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {config.autoBackup && (
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Fréquence de sauvegarde</label>
                        <p className="setting-description">À quelle fréquence sauvegarder</p>
                      </div>
                      <div className="setting-control">
                        <select
                          value={config.backupFrequency}
                          onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                          className="setting-select"
                        >
                          <option value="daily">Quotidienne</option>
                          <option value="weekly">Hebdomadaire</option>
                          <option value="monthly">Mensuelle</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="setting-group danger">
                  <h3 className="group-title">Zone de danger</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Réinitialiser la base de données</label>
                      <p className="setting-description">
                        🔧 Corrige les problèmes de schéma de base de données en recréant les tables
                      </p>
                    </div>
                    <div className="setting-control">
                      <button
                        className="btn-warning"
                        onClick={resetDatabase}
                      >
                        Réinitialiser DB
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Supprimer toutes les données</label>
                      <p className="setting-description">
                        ⚠️ Supprime définitivement tous les documents, emprunteurs et historiques
                      </p>
                    </div>
                    <div className="setting-control">
                      <button
                        className="btn-danger"
                        onClick={clearAllData}
                      >
                        Supprimer tout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-panel">
                <div className="setting-group">
                  <h3 className="group-title">Mot de passe d'application</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Exiger un mot de passe au démarrage</label>
                      <p className="setting-description">
                        Protégez l'accès à l'application avec un mot de passe
                      </p>
                    </div>
                    <div className="setting-control">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={config.requireAppPassword}
                          onChange={(e) => {
                            handleInputChange('requireAppPassword', e.target.checked);
                            setShowPasswordSection(e.target.checked);
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {showPasswordSection && (
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Mot de passe de l'application</label>
                        <p className="setting-description">
                          Définissez le mot de passe requis au démarrage de l'application
                        </p>
                      </div>
                      <div className="setting-control">
                        <input
                          type="password"
                          value={appPassword}
                          onChange={(e) => setAppPassword(e.target.value)}
                          className="setting-input password-input"
                          placeholder="Mot de passe"
                          required={config.requireAppPassword}
                        />
                      </div>
                    </div>
                  )}

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Délai d'expiration de session (minutes)</label>
                      <p className="setting-description">
                        Durée avant verrouillage automatique de l'application
                      </p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={config.sessionTimeout}
                        onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                        className="setting-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'institution' && isAdmin && (
              <div className="tab-panel">
                <div className="setting-group">
                  <h3 className="group-title">Informations générales</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Logo de l'institution</label>
                      <p className="setting-description">
                        Logo qui apparaîtra sur les rapports et documents officiels
                      </p>
                    </div>
                    <div className="setting-control">
                      <div className="logo-upload-container">
                        {institutionSettings.logo && (
                          <div className="logo-preview">
                            <img src={institutionSettings.logo} alt="Logo" />
                          </div>
                        )}
                        <div className="upload-actions">
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="logo-upload" className="upload-button">
                            <Upload size={16} />
                            {institutionSettings.logo ? 'Changer' : 'Ajouter'}
                          </label>
                          {institutionSettings.logo && (
                            <button
                              type="button"
                              onClick={() => setInstitutionSettings(prev => ({ ...prev, logo: '' }))}
                              className="remove-button"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Nom de l'institution</label>
                      <p className="setting-description">Nom officiel de votre établissement</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="text"
                        value={institutionSettings.name}
                        onChange={(e) => handleInstitutionChange('name', e.target.value)}
                        className="setting-input"
                        placeholder="Nom de l'institution"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Description</label>
                      <p className="setting-description">Brève description de l'institution</p>
                    </div>
                    <div className="setting-control">
                      <textarea
                        value={institutionSettings.description}
                        onChange={(e) => handleInstitutionChange('description', e.target.value)}
                        className="setting-textarea"
                        placeholder="Description de l'institution"
                      />
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <h3 className="group-title">Coordonnées</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Adresse</label>
                      <p className="setting-description">Adresse postale complète</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="text"
                        value={institutionSettings.address}
                        onChange={(e) => handleInstitutionChange('address', e.target.value)}
                        className="setting-input"
                        placeholder="Adresse"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Ville</label>
                      <p className="setting-description">Ville et code postal</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="text"
                        value={institutionSettings.city}
                        onChange={(e) => handleInstitutionChange('city', e.target.value)}
                        className="setting-input"
                        placeholder="Ville"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Pays</label>
                      <p className="setting-description">Pays de l'institution</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="text"
                        value={institutionSettings.country}
                        onChange={(e) => handleInstitutionChange('country', e.target.value)}
                        className="setting-input"
                        placeholder="Pays"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Téléphone</label>
                      <p className="setting-description">Numéro de téléphone principal</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="tel"
                        value={institutionSettings.phone}
                        onChange={(e) => handleInstitutionChange('phone', e.target.value)}
                        className="setting-input"
                        placeholder="Téléphone"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Email</label>
                      <p className="setting-description">Adresse email officielle</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="email"
                        value={institutionSettings.email}
                        onChange={(e) => handleInstitutionChange('email', e.target.value)}
                        className="setting-input"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">Site web</label>
                      <p className="setting-description">URL du site web institutionnel</p>
                    </div>
                    <div className="setting-control">
                      <input
                        type="url"
                        value={institutionSettings.website}
                        onChange={(e) => handleInstitutionChange('website', e.target.value)}
                        className="setting-input"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="tab-panel">
                <div className="about-content">
                  <div className="app-info">
                    <div className="app-icon">
                      <Building size={48} />
                    </div>
                    <h3>Bibliothèque Numérique</h3>
                    <p className="version">Version 1.0.0</p>
                    <p className="description">
                      Système de gestion de bibliothèque moderne pour établissements scolaires
                    </p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Mode actuel:</strong>
                      <span className={`mode-badge ${config.mode}`}>
                        {config.mode === 'offline' ? (
                          <>
                            <WifiOff size={14} />
                            Hors ligne
                          </>
                        ) : (
                          <>
                            <Wifi size={14} />
                            En ligne
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Base de données:</strong>
                      <span>{config.mode === 'offline' ? 'SQLite locale' : 'Supabase cloud'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <MicroButton
            variant="secondary"
            onClick={resetToDefaults}
            icon={RotateCcw}
          >
            Réinitialiser
          </MicroButton>
          <MicroButton
            variant="success"
            onClick={saveConfig}
            disabled={isLoading}
            icon={Save}
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </MicroButton>
        </div>
      </div>

      <style>{`
        .settings-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

        .settings-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
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
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .modal-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 1001;
        }

        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
        }

        .settings-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .tabs-container {
          width: 200px;
          background: #F3EED9;
          border-right: 1px solid #E5DCC2;
          padding: 24px 0;
        }

        .tab-button {
          width: 100%;
          padding: 16px 24px;
          border: none;
          background: transparent;
          color: #4A4A4A;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .tab-button.active {
          background: #3E5C49;
          color: #F3EED9;
          font-weight: 600;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .tab-panel {
          max-width: 600px;
        }

        .setting-group {
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }

        .setting-group.danger {
          background: rgba(220, 38, 38, 0.05);
          border-color: rgba(220, 38, 38, 0.2);
        }

        .group-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 20px 0;
        }

        .setting-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 20px;
        }

        .setting-item:last-child {
          margin-bottom: 0;
        }

        .setting-info {
          flex: 1;
        }

        .setting-label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 4px 0;
          display: block;
        }

        .setting-description {
          font-size: 12px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
        }

        .setting-control {
          flex-shrink: 0;
        }

        .setting-select, .setting-input {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
        }

        .setting-input {
          width: 80px;
          text-align: center;
        }

        .password-input {
          width: 200px;
          text-align: left;
        }

        .setting-textarea {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          width: 200px;
          min-height: 60px;
          resize: vertical;
          font-family: inherit;
        }

        .logo-upload-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .logo-preview {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #E5DCC2;
          background: #F3EED9;
        }

        .logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-actions {
          display: flex;
          gap: 8px;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #3E5C49;
          color: #F3EED9;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-button:hover {
          background: #2E453A;
        }

        .remove-button {
          padding: 8px 12px;
          background: #DC2626;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-button:hover {
          background: #B91C1C;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #3E5C49;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .btn-warning {
          background: #F59E0B;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-warning:hover {
          background: #D97706;
        }

        .btn-danger {
          background: #DC2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-danger:hover {
          background: #B91C1C;
        }

        .about-content {
          text-align: center;
        }

        .app-info {
          margin-bottom: 32px;
        }

        .app-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          margin: 0 auto 16px;
        }

        .app-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .version {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0 0 16px 0;
        }

        .description {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.5;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          text-align: left;
        }

        .info-item {
          background: rgba(243, 238, 217, 0.1);
          padding: 16px;
          border-radius: 8px;
        }

        .info-item strong {
          display: block;
          font-size: 12px;
          color: #4A4A4A;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mode-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .mode-badge.offline {
          color: #3E5C49;
        }

        .mode-badge.online {
          color: #2563EB;
        }

        .modal-actions {
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .settings-modal {
            margin: 12px;
          }

          .settings-content {
            flex-direction: column;
          }

          .tabs-container {
            width: 100%;
            display: flex;
            overflow-x: auto;
            padding: 16px 24px;
          }

          .tab-button {
            white-space: nowrap;
            padding: 12px 16px;
          }

          .setting-item {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};