// src/renderer/components/EnhancedAuthentication.tsx - Version redesignée
import React, { useState } from 'react';
import { 
  Book, 
  BookOpen,
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield,
  Users,
  BarChart3,
  WifiOff,
  Building,
  KeyRound,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  HardDrive,
  Database
} from 'lucide-react';

interface EnhancedAuthenticationProps {
  onLogin: (credentials: { 
    email: string; 
    password: string; 
    institutionCode?: string;
    mode: 'login' | 'register' | 'create_institution';
    userData?: any;
  }) => Promise<void>;
}

export const EnhancedAuthentication: React.FC<EnhancedAuthenticationProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'create_institution'>('login');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Données du formulaire de connexion
  const [loginData, setLoginData] = useState(() => {
    // Charger les informations de dernière connexion
    try {
      const { LocalAuthService } = require('../services/LocalAuthService');
      const lastLogin = LocalAuthService.getLastLoginInfo();
      if (lastLogin) {
        return {
          email: lastLogin.email,
          password: lastLogin.password || '',
          institutionCode: lastLogin.institutionCode
        };
      }
    } catch (error) {
      console.log('Impossible de charger les dernières informations de connexion');
    }
    
    return {
      email: '',
      password: '',
      institutionCode: ''
    };
  });

  // Données pour la création d'établissement
  const [institutionData, setInstitutionData] = useState({
    name: '',
    type: 'library' as 'school' | 'university' | 'library' | 'other',
    city: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await onLogin({
          email: loginData.email,
          password: loginData.password,
          institutionCode: loginData.institutionCode,
          mode: 'login'
        });
      } else if (mode === 'create_institution') {
        if (step === 4) {
          await onLogin({
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
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && institutionData.name) {
      setStep(2);
    } else if (step === 2 && institutionData.type) {
      setStep(3);
    } else if (step === 3 && institutionData.city) {
      setStep(4);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const institutionTypes = [
    { value: 'school', label: 'École/Lycée', icon: Building, color: '#3E5C49' },
    { value: 'university', label: 'Université', icon: BookOpen, color: '#C2571B' },
    { value: 'library', label: 'Bibliothèque', icon: Book, color: '#2E453A' },
    { value: 'other', label: 'Autre', icon: HardDrive, color: '#6E6E6E' }
  ];

  const defaultCredentials = [
    { email: 'admin@local', password: 'admin', role: 'Administrateur' },
    { email: 'bibliothecaire@local', password: 'biblio', role: 'Bibliothécaire' },
    { email: 'test@local', password: 'test', role: 'Utilisateur' },
    { email: 'demo@demo', password: 'demo', role: 'Démo' }
  ];

  const handleQuickLogin = (email: string, password: string) => {
    setLoginData({ 
      email, 
      password, 
      institutionCode: 'BIBLIO2024' // Code par défaut pour les connexions rapides
    });
    setError('');
  };

  return (
    <div className="enhanced-auth-container">
      <div className="auth-background">
        <div className="pattern-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Header simplifié */}
        <div className="auth-header">
          <h1 className="main-title">Bibliothèque Locale</h1>
          <p className="main-subtitle">Connectez-vous ou créez votre établissement</p>
        </div>

        {/* Contenu principal */}
        <div className="main-content">
          <div className="auth-card">
            {/* Navigation des onglets */}
            <div className="auth-tabs">
              <button
                className={`tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setStep(1); setError(''); }}
              >
                <LogIn size={18} />
                <span>Connexion</span>
              </button>
              <button
                className={`tab ${mode === 'create_institution' ? 'active' : ''}`}
                onClick={() => { setMode('create_institution'); setStep(1); setError(''); }}
              >
                <Building size={18} />
                <span>Nouvel Établissement</span>
              </button>
            </div>

            {/* Messages d'erreur/succès */}
            {error && (
              <div className="message error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="message success">
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Formulaire de connexion */}
            {mode === 'login' && (
              <div className="login-section">
                <div className="section-header">
                  <HardDrive size={24} />
                  <h2>Connexion Locale</h2>
                  <p>Connectez-vous avec vos identifiants locaux</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label>Email ou nom d'utilisateur</label>
                    <div className="input-group">
                      <Mail size={20} />
                      <input
                        type="text"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@local"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mot de passe</label>
                    <div className="input-group">
                      <Lock size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Votre mot de passe"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Code d'accès établissement</label>
                    <div className="input-group">
                      <KeyRound size={20} />
                      <input
                        type="text"
                        value={loginData.institutionCode}
                        onChange={(e) => setLoginData(prev => ({ ...prev, institutionCode: e.target.value }))}
                        placeholder="Code d'accès de votre établissement"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={!loginData.email || !loginData.password || !loginData.institutionCode || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Se connecter
                      </>
                    )}
                  </button>
                </form>

                {/* Connexions rapides */}
                <div className="quick-login-section">
                  <div className="divider">
                    <span>Connexions rapides</span>
                  </div>
                  
                  <div className="quick-login-grid">
                    {defaultCredentials.map((cred, index) => (
                      <button
                        key={index}
                        className="quick-login-btn"
                        onClick={() => handleQuickLogin(cred.email, cred.password)}
                        disabled={isLoading}
                      >
                        <div className="credential-icon">
                          {cred.role === 'Administrateur' && <Shield size={16} />}
                          {cred.role === 'Bibliothécaire' && <Users size={16} />}
                          {cred.role === 'Utilisateur' && <User size={16} />}
                          {cred.role === 'Démo' && <Sparkles size={16} />}
                        </div>
                        <div className="credential-info">
                          <span className="role">{cred.role}</span>
                          <span className="email">{cred.email}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="login-hint">
                    <p>💡 <strong>Astuce :</strong> Cliquez sur une carte pour remplir automatiquement les champs</p>
                    <p>🔐 Ou utilisez n'importe quel email avec le mot de passe "demo"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Création d'établissement */}
            {mode === 'create_institution' && (
              <div className="institution-section">
                {/* Progress Header */}
                <div className="progress-header">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                  </div>
                  <div className="progress-steps">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>
                      <div className="step-circle">
                        <Building size={14} />
                      </div>
                      <span className="step-label">Nom</span>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}>
                      <div className="step-circle">
                        <Users size={14} />
                      </div>
                      <span className="step-label">Type</span>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}>
                      <div className="step-circle">
                        <MapPin size={14} />
                      </div>
                      <span className="step-label">Lieu</span>
                    </div>
                    <div className={`progress-step ${step >= 4 ? 'active' : ''} ${step === 4 ? 'current' : ''}`}>
                      <div className="step-circle">
                        <Shield size={14} />
                      </div>
                      <span className="step-label">Admin</span>
                    </div>
                  </div>
                </div>

                {/* Étape 1: Nom de l'établissement */}
                {step === 1 && (
                  <div className="step-content">
                    <div className="section-header">
                      <h2>Nom de votre établissement</h2>
                      <p>Choisissez un nom unique pour identifier votre bibliothèque</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="auth-form">
                      <div className="form-group">
                        <label>
                          <Building size={18} />
                          Nom de l'établissement *
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            value={institutionData.name}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="École Primaire Martin Luther King"
                            required
                            disabled={isLoading}
                            autoFocus
                          />
                        </div>
                        <small>Ce nom apparaîtra dans l'interface de votre bibliothèque</small>
                      </div>

                      <div className="step-info-card">
                        <div className="info-icon">
                          <Sparkles size={20} />
                        </div>
                        <div className="info-content">
                          <h4>Conseils pour le nom</h4>
                          <ul>
                            <li>Utilisez le nom officiel de votre établissement</li>
                            <li>Évitez les abréviations trop complexes</li>
                            <li>Vous pourrez le modifier plus tard si nécessaire</li>
                          </ul>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="submit-btn primary"
                          disabled={!institutionData.name.trim() || isLoading}
                        >
                          <span>Continuer</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Étape 2: Type d'établissement */}
                {step === 2 && (
                  <div className="step-content">
                    <div className="section-header">
                      <h2>Type d'établissement</h2>
                      <p>Sélectionnez le type qui correspond le mieux à votre organisation</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="auth-form">
                      <div className="form-group">
                        <label>
                          <Users size={18} />
                          Choisissez votre type *
                        </label>
                        <div className="type-selector">
                          {institutionTypes.map((type) => {
                            const IconComponent = type.icon;
                            const isSelected = institutionData.type === type.value;
                            
                            return (
                              <label key={type.value} className={`type-option ${isSelected ? 'selected' : ''}`}>
                                <input
                                  type="radio"
                                  name="type"
                                  value={type.value}
                                  checked={isSelected}
                                  onChange={(e) => setInstitutionData(prev => ({ ...prev, type: e.target.value as any }))}
                                  disabled={isLoading}
                                />
                                <div className="type-card-content">
                                  <div className="type-icon-wrapper" style={{ backgroundColor: isSelected ? type.color : 'rgba(110, 110, 110, 0.1)' }}>
                                    <IconComponent size={20} color={isSelected ? '#F3EED9' : type.color} />
                                  </div>
                                  <div className="type-info">
                                    <span className="type-name">{type.label}</span>
                                    <span className="type-description">
                                      {type.value === 'school' && 'Établissement scolaire'}
                                      {type.value === 'university' && 'Enseignement supérieur'}
                                      {type.value === 'library' && 'Bibliothèque publique'}
                                      {type.value === 'other' && 'Autre organisation'}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="selection-indicator">
                                      <CheckCircle size={18} color={type.color} />
                                    </div>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={previousStep}
                          className="submit-btn secondary"
                          disabled={isLoading}
                        >
                          <span>Retour</span>
                        </button>
                        <button
                          type="submit"
                          className="submit-btn primary"
                          disabled={!institutionData.type || isLoading}
                        >
                          <span>Continuer</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Étape 3: Localisation */}
                {step === 3 && (
                  <div className="step-content">
                    <div className="section-header">
                      <h2>Localisation</h2>
                      <p>Indiquez où se trouve votre établissement</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="auth-form">
                      <div className="form-group">
                        <label>
                          <MapPin size={18} />
                          Ville *
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            value={institutionData.city}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Paris"
                            required
                            disabled={isLoading}
                            autoFocus
                          />
                        </div>
                        <small>Ville où se trouve votre établissement</small>
                      </div>

                      <div className="establishment-preview">
                        <div className="preview-card">
                          <div className="preview-header">
                            <Building size={20} />
                            <span>Récapitulatif</span>
                          </div>
                          <div className="preview-content">
                            <div className="preview-item">
                              <span className="preview-label">Nom :</span>
                              <span className="preview-value">{institutionData.name}</span>
                            </div>
                            <div className="preview-item">
                              <span className="preview-label">Type :</span>
                              <span className="preview-value">
                                {institutionTypes.find(t => t.value === institutionData.type)?.label}
                              </span>
                            </div>
                            <div className="preview-item">
                              <span className="preview-label">Ville :</span>
                              <span className="preview-value">{institutionData.city || 'À compléter'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={previousStep}
                          className="submit-btn secondary"
                          disabled={isLoading}
                        >
                          <span>Retour</span>
                        </button>
                        <button
                          type="submit"
                          className="submit-btn primary"
                          disabled={!institutionData.city.trim() || isLoading}
                        >
                          <span>Continuer</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Étape 4: Administrateur */}
                {step === 4 && (
                  <div className="step-content">
                    <div className="section-header">
                      <h2>Compte administrateur</h2>
                      <p>Créez le compte administrateur principal de votre établissement</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <User size={18} />
                            Prénom *
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              value={institutionData.adminFirstName}
                              onChange={(e) => setInstitutionData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                              placeholder="Jean"
                              required
                              disabled={isLoading}
                              autoFocus
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>
                            <User size={18} />
                            Nom *
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              value={institutionData.adminLastName}
                              onChange={(e) => setInstitutionData(prev => ({ ...prev, adminLastName: e.target.value }))}
                              placeholder="Dupont"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          <Mail size={18} />
                          Email administrateur *
                        </label>
                        <div className="input-group">
                          <input
                            type="email"
                            value={institutionData.adminEmail}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminEmail: e.target.value }))}
                            placeholder="admin@etablissement.fr"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <small>Utilisé pour la connexion à votre bibliothèque</small>
                      </div>

                      <div className="form-group">
                        <label>
                          <Lock size={18} />
                          Mot de passe administrateur *
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={institutionData.adminPassword}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminPassword: e.target.value }))}
                            placeholder="Mot de passe sécurisé"
                            required
                            minLength={3}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <small>Minimum 3 caractères requis</small>
                      </div>

                      <div className="final-summary">
                        <div className="summary-card">
                          <div className="summary-header">
                            <CheckCircle size={20} />
                            <span>Récapitulatif final</span>
                          </div>
                          <div className="summary-content">
                            <div className="summary-section">
                              <h5>Établissement</h5>
                              <p><strong>{institutionData.name}</strong></p>
                              <p>{institutionTypes.find(t => t.value === institutionData.type)?.label} • {institutionData.city}</p>
                            </div>
                            <div className="summary-section">
                              <h5>Administrateur</h5>
                              <p>{institutionData.adminFirstName} {institutionData.adminLastName}</p>
                              <p>{institutionData.adminEmail}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="admin-info">
                        <div className="info-card">
                          <Shield size={20} />
                          <div className="info-content">
                            <h4>Privilèges administrateur</h4>
                            <p>Ce compte aura tous les privilèges pour gérer votre bibliothèque locale : ajout de livres, gestion des utilisateurs, paramètres système.</p>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={previousStep}
                          className="submit-btn secondary"
                          disabled={isLoading}
                        >
                          <span>Retour</span>
                        </button>
                        <button
                          type="submit"
                          className="submit-btn primary"
                          disabled={!institutionData.adminFirstName || !institutionData.adminLastName || 
                                   !institutionData.adminEmail || !institutionData.adminPassword || 
                                   institutionData.adminPassword.length < 3 || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="spinner"></div>
                              <span>Création...</span>
                            </>
                          ) : (
                            <>
                              <span>Créer l'établissement</span>
                              <Sparkles size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar avec informations */}
          <div className="info-sidebar">
            <div className="feature-card">
              <Database size={32} />
              <h3>Base de données locale</h3>
              <p>Vos données sont stockées en sécurité sur votre ordinateur</p>
            </div>
            
            <div className="feature-card">
              <WifiOff size={32} />
              <h3>Fonctionne hors ligne</h3>
              <p>Aucune connexion Internet requise pour utiliser l'application</p>
            </div>
            
            <div className="feature-card">
              <BarChart3 size={32} />
              <h3>Gestion complète</h3>
              <p>Gérez vos livres, emprunts et utilisateurs facilement</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-auth-container {
          min-height: calc(100vh - 40px);
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 0;
        }

        .auth-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(243, 238, 217, 0.05) 0%, transparent 50%);
          animation: drift 20s ease-in-out infinite;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(1deg); }
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          background: rgba(243, 238, 217, 0.05);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .auth-content {
          position: relative;
          z-index: 10;
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
          padding: 0 20px;
        }

        .main-title {
          margin: 0 0 8px 0;
          color: #F3EED9;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .main-subtitle {
          margin: 0;
          color: rgba(243, 238, 217, 0.8);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
        }

        .main-content {
          display: flex;
          gap: 40px;
          flex: 1;
          align-items: flex-start;
          min-height: 0;
        }

       .auth-card {
          flex: 1;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          max-width: 700px;
          /* RETIRER: height: calc(100vh - 160px); */
          /* RETIRER: display: flex; */
          /* RETIRER: flex-direction: column; */
          border: 1px solid rgba(229, 220, 194, 0.3);
          /* Ajouter une hauteur minimale si nécessaire */
          min-height: 600px;
        }

        .auth-tabs {
          display: flex;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          flex-shrink: 0;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: rgba(243, 238, 217, 0.7);
          transition: all 0.2s ease;
          position: relative;
        }

        .tab:hover {
          color: #F3EED9;
          background: rgba(243, 238, 217, 0.1);
        }

        .tab.active {
          color: #F3EED9;
          background: rgba(243, 238, 217, 0.15);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #C2571B;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          font-weight: 500;
          border-bottom: 1px solid rgba(229, 220, 194, 0.3);
        }

        .message.error {
          background: rgba(220, 38, 38, 0.1);
          color: #DC2626;
        }

        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .section-header {
          text-align: center;
          padding: 32px 32px 24px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
          background: #FAF9F6;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          color: #3E5C49;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
        }

        .section-header p {
          margin: 0;
          color: #4A4A4A;
          font-size: 14px;
          line-height: 1.5;
        }

        .auth-form {
          padding: 32px;
          /* RETIRER: flex: 1; */
          /* RETIRER: overflow-y: auto; */
          /* RETIRER: min-height: 0; */
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2E2E2E;
          font-size: 14px;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 10px;
          padding: 0 16px;
          transition: all 0.2s ease;
          background: white;
        }

        .input-group:focus-within {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .input-group svg {
          color: #6E6E6E;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .input-group input {
          flex: 1;
          border: none;
          padding: 12px 0;
          font-size: 14px;
          outline: none;
          background: transparent;
          color: #2E2E2E;
        }

        .input-group input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        .input-group input:disabled {
          background: transparent;
          opacity: 0.7;
        }

        .toggle-password {
          background: none;
          border: none;
          color: #6E6E6E;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-password:hover {
          color: #3E5C49;
          background: rgba(62, 92, 73, 0.1);
        }

        .form-group small {
          display: block;
          margin-top: 4px;
          color: #4A4A4A;
          font-size: 12px;
          line-height: 1.4;
        }

        .type-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .type-option {
          display: block;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-option input {
          display: none;
        }

        .type-card-content {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 12px;
          background: white;
          transition: all 0.2s ease;
          position: relative;
        }

        .type-option:hover .type-card-content {
          border-color: #3E5C49;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.1);
          transform: translateY(-1px);
        }

        .type-option.selected .type-card-content {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.02);
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .type-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .type-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .type-name {
          font-weight: 600;
          color: #2E2E2E;
          font-size: 14px;
          line-height: 1.2;
        }

        .type-description {
          font-size: 12px;
          color: #6E6E6E;
          line-height: 1.3;
        }

        .selection-indicator {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: checkIn 0.2s ease-out;
        }

        @keyframes checkIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1F2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .back-btn {
          background: #F3EED9;
          color: #2E2E2E;
          border: 1px solid rgba(229, 220, 194, 0.4);
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover:not(:disabled) {
          background: #E5DCC2;
          color: #2E2E2E;
          transform: translateY(-1px);
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }

        .form-actions .submit-btn {
          flex: 1;
        }

        .submit-btn.primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }

        .submit-btn.secondary {
          background: #F3EED9;
          color: #2E2E2E;
          border: 1px solid rgba(229, 220, 194, 0.4);
        }

        .submit-btn.secondary:hover:not(:disabled) {
          background: #E5DCC2;
          transform: translateY(-1px);
        }

        /* Progress Header */
        .progress-header {
          padding: 24px 32px;
          background: #FAF9F6;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
        }

        .progress-bar {
          height: 4px;
          background: rgba(229, 220, 194, 0.3);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3E5C49 0%, #C2571B 100%);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step.current {
          transform: scale(1.05);
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(229, 220, 194, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: #3E5C49;
          color: #F3EED9;
        }

        .progress-step.current .step-circle {
          background: #C2571B;
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
        }

        .step-label {
          font-size: 12px;
          font-weight: 600;
          color: #2E2E2E;
          text-align: center;
        }

        /* Admin Info Card */
        .admin-info {
          margin: 24px 0;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          color: #3E5C49;
        }

        .info-content h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #3E5C49;
        }

        .info-content p {
          font-size: 13px;
          margin: 0;
          color: #4A4A4A;
          line-height: 1.4;
        }

        /* Step Info Card */
        .step-info-card {
          margin: 24px 0;
          background: rgba(194, 87, 27, 0.05);
          border: 1px solid rgba(194, 87, 27, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        .step-info-card .info-icon {
          color: #C2571B;
          margin-bottom: 8px;
        }

        .step-info-card h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #C2571B;
        }

        .step-info-card ul {
          margin: 0;
          padding-left: 16px;
          color: #4A4A4A;
        }

        .step-info-card li {
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        /* Establishment Preview */
        .establishment-preview {
          margin: 24px 0;
        }

        .preview-card {
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(62, 92, 73, 0.1);
          border-bottom: 1px solid rgba(62, 92, 73, 0.1);
          font-weight: 600;
          font-size: 14px;
          color: #3E5C49;
        }

        .preview-content {
          padding: 16px;
        }

        .preview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .preview-item:last-child {
          margin-bottom: 0;
        }

        .preview-label {
          font-size: 13px;
          color: #6E6E6E;
          font-weight: 500;
        }

        .preview-value {
          font-size: 13px;
          font-weight: 600;
          color: #2E2E2E;
        }

        /* Final Summary */
        .final-summary {
          margin: 24px 0;
        }

        .summary-card {
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.05) 0%, rgba(194, 87, 27, 0.05) 100%);
          border: 1px solid rgba(62, 92, 73, 0.15);
          border-radius: 12px;
          overflow: hidden;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(62, 92, 73, 0.1);
          border-bottom: 1px solid rgba(62, 92, 73, 0.1);
          font-weight: 600;
          font-size: 14px;
          color: #3E5C49;
        }

        .summary-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summary-section h5 {
          font-size: 12px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 6px 0;
        }

        .summary-section p {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #2E2E2E;
          line-height: 1.3;
        }

        .summary-section p:last-child {
          margin-bottom: 0;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }


        /* Connexions rapides */
        .quick-login-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(229, 220, 194, 0.3);
        }

        .divider {
          text-align: center;
          margin-bottom: 24px;
          position: relative;
        }

        .divider span {
          background: #FFFFFF;
          padding: 0 16px;
          color: #4A4A4A;
          font-size: 14px;
          font-weight: 600;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #E5DCC2;
          z-index: -1;
        }

        .quick-login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .quick-login-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(248, 246, 240, 0.8);
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .quick-login-btn:hover:not(:disabled) {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .quick-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .credential-icon {
          width: 36px;
          height: 36px;
          background: #3E5C49;
          color: #F3EED9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .credential-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .credential-info .role {
          font-weight: 600;
          color: #3E5C49;
          font-size: 14px;
        }

        .credential-info .email {
          font-size: 12px;
          color: #4A4A4A;
        }

        .login-hint {
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }

        .login-hint p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #3E5C49;
        }

        .login-hint p:last-child {
          margin-bottom: 0;
        }

        /* Sidebar d'informations */
        .info-sidebar {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-card {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          color: #F3EED9;
          backdrop-filter: blur(10px);
        }

        .feature-card svg {
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .feature-card h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .feature-card p {
          margin: 0;
          opacity: 0.8;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .main-content {
            flex-direction: column;
            align-items: center;
          }

          .info-sidebar {
            flex: none;
            max-width: 600px;
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
          }

          .feature-card {
            flex: 0 0 250px;
          }
        }

        @media (max-width: 768px) {
          .auth-content {
            padding: 16px;
          }

          .auth-header {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
            padding: 0;
          }

          .main-content {
            gap: 24px;
          }

          .auth-card {
            max-width: none;
            min-height: auto; /* Permettre à la carte de s'adapter au contenu */
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .quick-login-grid {
            grid-template-columns: 1fr;
          }

          .type-selector {
            gap: 10px;
          }

          .type-card-content {
            padding: 12px;
            gap: 12px;
          }

          .type-icon-wrapper {
            width: 36px;
            height: 36px;
          }

          .info-sidebar {
            flex-direction: column;
          }

          .feature-card {
            flex: none;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .tab {
            padding: 16px 12px;
            font-size: 14px;
          }

          .section-header {
            padding: 24px 16px 16px;
          }

          .auth-form {
            padding: 24px 16px;
          }
        }

        @media (max-width: 480px) {
          .auth-content {
            padding: 12px;
          }

          .logo-text h1 {
            font-size: 20px;
          }

          .offline-badge {
            font-size: 12px;
            padding: 6px 12px;
          }

          .section-header h2 {
            font-size: 20px;
          }

          .auth-form {
            padding: 20px 12px;
          }

          .input-group input {
            padding: 14px 14px 14px 44px;
            font-size: 14px;
          }

          .submit-btn {
            padding: 14px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};