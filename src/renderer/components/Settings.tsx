import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Building,
  Upload,
  Save,
  X,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Database,
  Download,
  UploadCloud,
  Shield,
  LogOut,
  Trash2,
  RefreshCw,
  HardDrive,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { SupabaseRendererService as SupabaseService, User as SupabaseUser, Institution as SupabaseInstitution } from '../services/SupabaseClient';
import { ConfigService } from '../services/ConfigService';

interface SettingsProps {
  onClose: () => void;
  onLogout: () => void;
  currentUser: SupabaseUser | null;
  currentInstitution: SupabaseInstitution | null;
  supabaseService: SupabaseService;
}

interface InstitutionSettings {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string;
  cloudSync: boolean;
  cloudProvider: 'google' | 'dropbox' | 'onedrive';
}

interface SecuritySettings {
  requireAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}

export const Settings: React.FC<SettingsProps> = ({ onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'institution' | 'backup' | 'security' | 'config' | 'about'>('institution');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettings>({
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

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'weekly',
    lastBackup: new Date().toISOString(),
    cloudSync: false,
    cloudProvider: 'google'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireAuth: true,
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 6,
      requireNumbers: true,
      requireSymbols: false
    }
  });

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
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
    } catch (error) {
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
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInstitutionSettings(prev => ({
          ...prev,
          logo: e.target?.result as string
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
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer une sauvegarde ? Cela remplacera toutes les données actuelles.')) {
      setIsLoading(true);
      try {
        await window.electronAPI.restoreBackup();
        showMessage('success', 'Données restaurées avec succès');
      } catch (error) {
        showMessage('error', 'Erreur lors de la restauration');
      } finally {
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
        } catch (error) {
          showMessage('error', 'Erreur lors de la suppression');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const tabs = [
    { id: 'institution', label: 'Établissement', icon: Building },
    { id: 'backup', label: 'Sauvegardes', icon: Database },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'config', label: 'Configuration', icon: HardDrive },
    { id: 'about', label: 'À propos', icon: SettingsIcon }
  ];

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <SettingsIcon size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Paramètres</h2>
              <p className="modal-subtitle">Configuration de l'application</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="logout-section">
              <button 
                className="logout-button"
                onClick={() => setShowConfirmLogout(true)}
              >
                <LogOut size={18} />
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="settings-main">
            {activeTab === 'institution' && (
              <div className="settings-section">
                <div className="section-header">
                  <Building size={24} />
                  <div>
                    <h3>Informations de l'établissement</h3>
                    <p>Configurez les détails de votre institution</p>
                  </div>
                </div>

                <div className="form-section">
                  <div className="logo-section">
                    <div className="logo-preview">
                      {institutionSettings.logo ? (
                        <img src={institutionSettings.logo} alt="Logo" />
                      ) : (
                        <div className="logo-placeholder">
                          <Camera size={32} />
                          <span>Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="logo-actions">
                      <label className="upload-button">
                        <Upload size={16} />
                        Changer le logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {institutionSettings.logo && (
                        <button
                          className="remove-button"
                          onClick={() => setInstitutionSettings(prev => ({ ...prev, logo: '' }))}
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom de l'établissement</label>
                      <div className="input-wrapper">
                        <Building size={18} />
                        <input
                          type="text"
                          value={institutionSettings.name}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, name: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Téléphone</label>
                      <div className="input-wrapper">
                        <Phone size={18} />
                        <input
                          type="tel"
                          value={institutionSettings.phone}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, phone: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <Mail size={18} />
                        <input
                          type="email"
                          value={institutionSettings.email}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, email: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Site web</label>
                      <div className="input-wrapper">
                        <Globe size={18} />
                        <input
                          type="url"
                          value={institutionSettings.website}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, website: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Adresse</label>
                      <div className="input-wrapper">
                        <MapPin size={18} />
                        <input
                          type="text"
                          value={institutionSettings.address}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, address: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Ville</label>
                      <div className="input-wrapper">
                        <MapPin size={18} />
                        <input
                          type="text"
                          value={institutionSettings.city}
                          onChange={(e) => setInstitutionSettings(prev => ({ ...prev, city: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group span-full">
                      <label>Description</label>
                      <textarea
                        value={institutionSettings.description}
                        onChange={(e) => setInstitutionSettings(prev => ({ ...prev, description: e.target.value }))}
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="settings-section">
                <div className="section-header">
                  <Database size={24} />
                  <div>
                    <h3>Gestion des sauvegardes</h3>
                    <p>Protégez vos données avec des sauvegardes automatiques</p>
                  </div>
                </div>

                <div className="backup-status">
                  <div className="status-card">
                    <div className="status-icon success">
                      <CheckCircle size={24} />
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
                        <input
                          type="checkbox"
                          checked={backupSettings.autoBackup}
                          onChange={(e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Créer automatiquement des sauvegardes selon la fréquence définie</p>
                  </div>

                  {backupSettings.autoBackup && (
                    <div className="setting-group">
                      <h4>Fréquence</h4>
                      <div className="radio-group">
                        {[
                          { value: 'daily', label: 'Quotidienne' },
                          { value: 'weekly', label: 'Hebdomadaire' },
                          { value: 'monthly', label: 'Mensuelle' }
                        ].map((option) => (
                          <label key={option.value} className="radio-option">
                            <input
                              type="radio"
                              name="frequency"
                              value={option.value}
                              checked={backupSettings.backupFrequency === option.value}
                              onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value as any }))}
                            />
                            <span className="radio-label">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="setting-group">
                    <div className="setting-header">
                      <h4>Synchronisation cloud</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={backupSettings.cloudSync}
                          onChange={(e) => setBackupSettings(prev => ({ ...prev, cloudSync: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Synchroniser automatiquement vos sauvegardes avec le cloud</p>
                  </div>

                  <div className="backup-actions">
                    <button 
                      className="action-button primary"
                      onClick={handleBackup}
                      disabled={isLoading}
                    >
                      <HardDrive size={18} />
                      Créer une sauvegarde maintenant
                    </button>
                    
                    <button 
                      className="action-button secondary"
                      onClick={handleRestore}
                      disabled={isLoading}
                    >
                      <Download size={18} />
                      Restaurer une sauvegarde
                    </button>
                    
                    <button 
                      className="action-button danger"
                      onClick={handleClearData}
                      disabled={isLoading}
                    >
                      <Trash2 size={18} />
                      Effacer toutes les données
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <Shield size={24} />
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
                        <input
                          type="checkbox"
                          checked={securitySettings.requireAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireAuth: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Exiger une connexion pour accéder à l'application</p>
                  </div>

                  <div className="setting-group">
                    <h4>Délai d'expiration de session (minutes)</h4>
                    <div className="input-wrapper">
                      <Lock size={18} />
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="setting-group">
                    <h4>Politique de mot de passe</h4>
                    
                    <div className="sub-setting">
                      <label>Longueur minimale</label>
                      <div className="input-wrapper">
                        <Lock size={18} />
                        <input
                          type="number"
                          min="4"
                          max="20"
                          value={securitySettings.passwordPolicy.minLength}
                          onChange={(e) => setSecuritySettings(prev => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              minLength: parseInt(e.target.value)
                            }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordPolicy.requireNumbers}
                          onChange={(e) => setSecuritySettings(prev => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              requireNumbers: e.target.checked
                            }
                          }))}
                        />
                        <span className="checkbox-label">Exiger des chiffres</span>
                      </label>

                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={securitySettings.passwordPolicy.requireSymbols}
                          onChange={(e) => setSecuritySettings(prev => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              requireSymbols: e.target.checked
                            }
                          }))}
                        />
                        <span className="checkbox-label">Exiger des symboles</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="settings-section">
                <div className="section-header">
                  <HardDrive size={24} />
                  <div>
                    <h3>Configuration de l'application</h3>
                    <p>Mode de fonctionnement et paramètres système</p>
                  </div>
                </div>

                <div className="config-content">
                  <div className="config-info-card">
                    <div className="config-header">
                      <div className="config-icon">
                        {ConfigService.getMode() === 'offline' ? (
                          <HardDrive size={24} />
                        ) : (
                          <Cloud size={24} />
                        )}
                      </div>
                      <div className="config-details">
                        <h4>Mode actuel : {ConfigService.getConfigInfo().displayMode}</h4>
                        <p className="config-description">
                          {ConfigService.getMode() === 'offline' 
                            ? 'L\'application utilise une base de données locale SQLite'
                            : 'L\'application utilise Supabase pour la synchronisation cloud'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="config-features">
                      <h5>Fonctionnalités actives :</h5>
                      <div className="feature-list">
                        {ConfigService.getMode() === 'offline' ? (
                          <>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Base de données locale</span>
                            </div>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Fonctionnement hors ligne</span>
                            </div>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Partage réseau local</span>
                            </div>
                            <div className="feature-item">
                              <AlertCircle className="feature-icon disabled" size={16} />
                              <span className="disabled">Synchronisation cloud (désactivée)</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Synchronisation cloud</span>
                            </div>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Multi-établissements</span>
                            </div>
                            <div className="feature-item">
                              <CheckCircle className="feature-icon active" size={16} />
                              <span>Sauvegarde automatique</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="config-actions">
                      <div className="action-note">
                        <AlertCircle size={16} />
                        <span>
                          Le mode en ligne sera disponible dans une prochaine version. 
                          Le mode hors ligne offre toutes les fonctionnalités nécessaires.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="config-stats-card">
                    <h5>Informations système</h5>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Configuré le :</span>
                        <span className="stat-value">
                          {ConfigService.getConfig().configuredAt 
                            ? new Date(ConfigService.getConfig().configuredAt).toLocaleDateString('fr-FR')
                            : 'Non configuré'
                          }
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Version :</span>
                        <span className="stat-value">{ConfigService.getConfig().version}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Mode :</span>
                        <span className="stat-value">{ConfigService.getConfigInfo().displayMode}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Statut :</span>
                        <span className="stat-value success">
                          <CheckCircle size={14} />
                          Opérationnel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="settings-section">
                <div className="section-header">
                  <SettingsIcon size={24} />
                  <div>
                    <h3>À propos de l'application</h3>
                    <p>Informations sur la version et les crédits</p>
                  </div>
                </div>

                <div className="about-content">
                  <div className="app-info">
                    <div className="app-logo">
                      <Building size={48} />
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
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="settings-footer">
          <button 
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            className="btn-primary"
            onClick={saveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="spinning" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="logout-overlay" onClick={() => setShowConfirmLogout(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-header">
              <LogOut size={24} />
              <h3>Confirmer la déconnexion</h3>
            </div>
            <p>Êtes-vous sûr de vouloir vous déconnecter ? Toutes les données non sauvegardées seront perdues.</p>
            <div className="logout-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowConfirmLogout(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-danger"
                onClick={() => {
                  setShowConfirmLogout(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
        
        .config-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .config-info-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 24px;
        }
        
        .config-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .config-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border-radius: 12px;
          color: white;
        }
        
        .config-details h4 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .config-description {
          margin: 0;
          color: #718096;
          line-height: 1.5;
        }
        
        .config-features {
          margin-bottom: 20px;
        }
        
        .config-features h5 {
          margin: 0 0 12px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #4a5568;
        }
        
        .config-features .feature-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .config-features .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .config-features .feature-icon.active {
          color: #48bb78;
        }
        
        .config-features .feature-icon.disabled {
          color: #cbd5e0;
        }
        
        .config-features .feature-item .disabled {
          color: #a0aec0;
        }
        
        .config-actions {
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
        }
        
        .action-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #4a5568;
        }
        
        .config-stats-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }
        
        .config-stats-card h5 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #718096;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 0.95rem;
          color: #2d3748;
          font-weight: 600;
        }
        
        .stat-value.success {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #48bb78;
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
      `}</style>
    </div>
  );
};