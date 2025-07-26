// src/renderer/components/EnhancedAuthentication.tsx - Version redesignée moderne
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
  HardDrive,
  Database,
  Library,
  GraduationCap,
  School,
  Zap
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
    { value: 'school', label: 'École/Lycée', icon: School, color: '#3E5C49', description: 'Établissement scolaire primaire ou secondaire' },
    { value: 'university', label: 'Université', icon: GraduationCap, color: '#C2571B', description: 'Enseignement supérieur et recherche' },
    { value: 'library', label: 'Bibliothèque', icon: Library, color: '#2E453A', description: 'Bibliothèque publique ou municipale' },
    { value: 'other', label: 'Organisation', icon: Building, color: '#5A6B5D', description: 'Autre type d\'organisation' }
  ];


  return (
    <div className="enhanced-auth-container">
      {/* Background moderne avec dégradé animé */}
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-elements">
          <div className="element element-1"><Book size={24} /></div>
          <div className="element element-2"><BookOpen size={20} /></div>
          <div className="element element-3"><Library size={28} /></div>
          <div className="element element-4"><GraduationCap size={22} /></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Header avec logo moderne */}
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Library size={32} />
            </div>
            <div className="logo-text">
              <h1>Bibliothèque</h1>
              <span>Système de gestion local</span>
            </div>
          </div>
        </div>

        {/* Contenu principal avec design glass */}
        <div className="main-content">
          <div className="auth-card glass-effect">
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

            {/* Formulaire de connexion moderne */}
            {mode === 'login' && (
              <div className="login-section">
                <div className="section-header">
                  <div className="header-icon">
                    <Zap size={24} />
                  </div>
                  <h2>Connexion Rapide</h2>
                  <p>Accédez à votre bibliothèque en quelques secondes</p>
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
                          <Zap size={20} />
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
                              <Zap size={16} />
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

          {/* Sidebar moderne avec avantages */}
          <div className="features-sidebar">
            <div className="features-header">
              <h3>Pourquoi choisir notre solution ?</h3>
            </div>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon security">
                  <Shield size={20} />
                </div>
                <div className="feature-content">
                  <h4>100% Local</h4>
                  <p>Vos données restent sur votre ordinateur, sécurisées et privées</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon offline">
                  <WifiOff size={20} />
                </div>
                <div className="feature-content">
                  <h4>Hors ligne</h4>
                  <p>Fonctionne sans Internet, disponible 24h/24</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon management">
                  <Users size={20} />
                </div>
                <div className="feature-content">
                  <h4>Gestion complète</h4>
                  <p>Documents, emprunts, utilisateurs et statistiques</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon analytics">
                  <BarChart3 size={20} />
                </div>
                <div className="feature-content">
                  <h4>Rapports détaillés</h4>
                  <p>Analyses et exports pour le suivi de votre bibliothèque</p>
                </div>
              </div>
            </div>
            
            <div className="trust-indicators">
              <div className="indicator">
                <CheckCircle size={16} />
                <span>Installation simple</span>
              </div>
              <div className="indicator">
                <CheckCircle size={16} />
                <span>Interface intuitive</span>
              </div>
              <div className="indicator">
                <CheckCircle size={16} />
                <span>Support français</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-auth-container {
          min-height: 100vh;
          height: auto;
          background: linear-gradient(135deg, 
            #1a2e1f 0%, 
            #2a3f2f 25%, 
            #3E5C49 50%, 
            #2E453A 75%, 
            #1f3024 100%
          );
          background-size: 300% 300%;
          animation: gradientShift 15s ease infinite;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .auth-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #C2571B 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #3E5C49 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
          animation-delay: 4s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, #F3EED9 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 2s;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .element {
          position: absolute;
          color: rgba(243, 238, 217, 0.1);
          animation: drift 12s ease-in-out infinite;
        }

        .element-1 {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .element-2 {
          top: 60%;
          right: 20%;
          animation-delay: 3s;
        }

        .element-3 {
          bottom: 25%;
          left: 25%;
          animation-delay: 6s;
        }

        .element-4 {
          top: 40%;
          right: 40%;
          animation-delay: 9s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.1; }
          50% { transform: translate(20px, -15px) rotate(3deg); opacity: 0.2; }
        }

        .auth-content {
          position: relative;
          z-index: 10;
          min-height: calc(100vh - 80px);
          height: auto;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 1500px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .logo-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C2571B 0%, #3E5C49 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 
            0 20px 40px rgba(194, 87, 27, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .logo-text h1 {
          margin: 0;
          color: #F3EED9;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.8px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .logo-text span {
          color: rgba(243, 238, 217, 0.8);
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .main-content {
          display: flex;
          gap: 48px;
          flex: 1;
          align-items: flex-start;
          min-height: 0;
          width: 100%;
        }

        .auth-card {
          flex: 1;
          max-width: 750px;
          height: auto;
          position: relative;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
        }

        .glass-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(243, 238, 217, 0.1) 0%, 
            rgba(194, 87, 27, 0.05) 50%, 
            rgba(62, 92, 73, 0.1) 100%
          );
          pointer-events: none;
        }

        .auth-tabs {
          display: flex;
          background: rgba(62, 92, 73, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: rgba(243, 238, 217, 0.7);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(194, 87, 27, 0.2) 0%, 
            rgba(62, 92, 73, 0.2) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab:hover::before {
          opacity: 1;
        }

        .tab:hover {
          color: #F3EED9;
          transform: translateY(-2px);
        }

        .tab.active {
          color: #F3EED9;
          background: rgba(194, 87, 27, 0.2);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #C2571B, transparent);
          border-radius: 2px;
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
          padding: 40px 32px 32px;
          background: rgba(243, 238, 217, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #C2571B 0%, #3E5C49 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          margin: 0 auto 20px;
          box-shadow: 
            0 10px 30px rgba(194, 87, 27, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .section-header h2 {
          margin: 0 0 12px 0;
          color: #F3EED9;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .section-header p {
          margin: 0;
          color: rgba(243, 238, 217, 0.8);
          font-size: 16px;
          line-height: 1.5;
          font-weight: 400;
        }

        .auth-form {
          padding: 40px;
          position: relative;
          z-index: 2;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #F3EED9;
          font-size: 15px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 0 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .input-group:focus-within {
          border-color: rgba(194, 87, 27, 0.6);
          box-shadow: 
            0 0 0 3px rgba(194, 87, 27, 0.2),
            0 8px 25px rgba(194, 87, 27, 0.15);
          transform: translateY(-2px);
        }

        .input-group svg {
          color: rgba(243, 238, 217, 0.7);
          margin-right: 12px;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }

        .input-group:focus-within svg {
          color: #C2571B;
        }

        .input-group input {
          flex: 1;
          border: none;
          padding: 16px 0;
          font-size: 15px;
          outline: none;
          background: transparent;
          color: #F3EED9;
          font-weight: 500;
        }

        .input-group input::placeholder {
          color: rgba(243, 238, 217, 0.5);
          opacity: 1;
        }

        .input-group input:disabled {
          background: transparent;
          opacity: 0.6;
        }

        .toggle-password {
          background: none;
          border: none;
          color: rgba(243, 238, 217, 0.7);
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
          color: #F3EED9;
          background: rgba(243, 238, 217, 0.1);
        }

        .form-group small {
          display: block;
          margin-top: 4px;
          color: rgba(243, 238, 217, 0.9);
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
          color: rgba(243, 238, 217, 0.8);
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
          gap: 12px;
          background: linear-gradient(135deg, #C2571B 0%, #3E5C49 100%);
          color: #F3EED9;
          border: none;
          padding: 18px 24px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 140px;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 25px rgba(194, 87, 27, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 
            0 12px 35px rgba(194, 87, 27, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.5;
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
          color: rgba(243, 238, 217, 0.8);
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
          color: rgba(243, 238, 217, 0.9);
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
          color: rgba(243, 238, 217, 0.9);
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
          color: rgba(243, 238, 217, 0.8);
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
          color: rgba(243, 238, 217, 0.8);
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




        /* Sidebar moderne */
        .features-sidebar {
          flex: 0 0 350px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .features-header h3 {
          color: #F3EED9;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 24px 0;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-item:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(194, 87, 27, 0.3);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(194, 87, 27, 0.1);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .feature-icon.security {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
        }

        .feature-icon.offline {
          background: linear-gradient(135deg, #C2571B 0%, #A0471A 100%);
        }

        .feature-icon.management {
          background: linear-gradient(135deg, #5A6B5D 0%, #3E5C49 100%);
        }

        .feature-icon.analytics {
          background: linear-gradient(135deg, #8B6B47 0%, #C2571B 100%);
        }

        .feature-content h4 {
          margin: 0 0 8px 0;
          color: #F3EED9;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
        }

        .feature-content p {
          margin: 0;
          color: rgba(243, 238, 217, 0.8);
          font-size: 14px;
          line-height: 1.5;
        }

        .trust-indicators {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          background: rgba(194, 87, 27, 0.1);
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(20px);
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #F3EED9;
          font-size: 14px;
          font-weight: 500;
        }

        .indicator svg {
          color: #C2571B;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .enhanced-auth-container {
            padding: 16px;
            height: auto;
            min-height: 100vh;
          }

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
          .enhanced-auth-container {
            padding: 12px;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
          }

          .auth-content {
            padding: 16px;
            min-height: auto;
          }

          .auth-header {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
            padding: 0;
          }

          .main-content {
            gap: 24px;
            flex-direction: column;
          }

          .auth-card {
            max-width: none;
            min-height: auto;
            height: auto;
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