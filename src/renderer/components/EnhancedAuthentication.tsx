// src/renderer/components/EnhancedAuthentication.tsx
import React, { useState } from 'react';
import { 
  Book, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield,
  Sparkles,
  Users,
  BarChart3,
  Globe,
  Wifi,
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
  MapPin
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
  const [mode, setMode] = useState<'login' | 'register' | 'create_institution'>('login');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Données du formulaire
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    institutionCode: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    institutionCode: '',
    role: 'user' as 'admin' | 'librarian' | 'user'
  });

  const [institutionData, setInstitutionData] = useState({
    name: '',
    type: 'library' as 'school' | 'university' | 'library' | 'other',
    address: '',
    city: '',
    country: 'Cameroun',
    phone: '',
    email: '',
    website: '',
    description: '',
    director: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: ''
  });

  React.useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

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
      } else if (mode === 'register') {
        if (registerData.password !== registerData.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        
        await onLogin({
          email: registerData.email,
          password: registerData.password,
          institutionCode: registerData.institutionCode,
          mode: 'register',
          userData: {
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            role: registerData.role
          }
        });
      } else if (mode === 'create_institution') {
        if (step === 2) {
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

  const validateStep1 = () => {
    return institutionData.name && 
           institutionData.type && 
           institutionData.city && 
           institutionData.country;
  };

  const validateStep2 = () => {
    return institutionData.adminEmail &&
           institutionData.adminPassword &&
           institutionData.adminFirstName &&
           institutionData.adminLastName &&
           institutionData.adminPassword.length >= 6;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const previousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const institutionTypes = [
    { value: 'school', label: 'École/Lycée', icon: '🏫' },
    { value: 'university', label: 'Université', icon: '🎓' },
    { value: 'library', label: 'Bibliothèque', icon: '📚' },
    { value: 'other', label: 'Autre', icon: '🏢' }
  ];

  const roles = [
    { value: 'user', label: 'Utilisateur', description: 'Accès de base à la bibliothèque' },
    { value: 'librarian', label: 'Bibliothécaire', description: 'Gestion des livres et emprunts' },
    { value: 'admin', label: 'Administrateur', description: 'Accès complet au système' }
  ];

  return (
    <div className="enhanced-auth">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-elements">
          <div className="floating-book"></div>
          <div className="floating-book"></div>
          <div className="floating-book"></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-logo">
            <Book size={48} />
          </div>
          <h1 className="brand-title">Bibliothèque Cloud</h1>
          <p className="brand-subtitle">Système de gestion moderne et collaboratif</p>
          
          <div className="features-list">
            <div className="feature-item">
              <Users size={20} />
              <span>Multi-établissements</span>
            </div>
            <div className="feature-item">
              <BarChart3 size={20} />
              <span>Synchronisation cloud</span>
            </div>
            <div className="feature-item">
              <Shield size={20} />
              <span>Sécurisé et fiable</span>
            </div>
            <div className="feature-item">
              <Globe size={20} />
              <span>Accessible partout</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setStep(1); }}
                >
                  <LogIn size={16} />
                  Connexion
                </button>
                <button
                  className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => { setMode('register'); setStep(1); }}
                >
                  <UserPlus size={16} />
                  Inscription
                </button>
                <button
                  className={`auth-tab ${mode === 'create_institution' ? 'active' : ''}`}
                  onClick={() => { setMode('create_institution'); setStep(1); }}
                >
                  <Building size={16} />
                  Créer établissement
                </button>
              </div>
              
              <div className="mode-indicator">
                <Sparkles size={16} />
                <span>
                  {mode === 'login' && 'Connectez-vous à votre établissement'}
                  {mode === 'register' && 'Rejoignez un établissement existant'}
                  {mode === 'create_institution' && `Créez votre établissement ${step === 2 ? '- Administrateur' : '- Informations'}`}
                </span>
              </div>

              {/* Progress bar for institution creation */}
              {mode === 'create_institution' && (
                <div className="progress-bar">
                  <div className="progress-steps">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                      <div className="step-number">1</div>
                      <span>Établissement</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                      <div className="step-number">2</div>
                      <span>Administrateur</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <Mail size={20} />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="auth-input"
                      placeholder="votre@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <div className="input-wrapper">
                    <Lock size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="auth-input"
                      placeholder="Votre mot de passe"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Code de l'établissement</label>
                  <div className="input-wrapper">
                    <KeyRound size={20} />
                    <input
                      type="text"
                      value={loginData.institutionCode}
                      onChange={(e) => setLoginData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() }))}
                      className="auth-input"
                      placeholder="CODE123"
                      required
                      disabled={isLoading}
                      maxLength={8}
                    />
                  </div>
                  <small className="form-hint">
                    8 caractères fournis par votre établissement
                  </small>
                </div>

                <button
                  type="submit"
                  className="auth-button primary"
                  disabled={isLoading || !loginData.email || !loginData.password || !loginData.institutionCode}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Se connecter
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <div className="input-wrapper">
                      <User size={20} />
                      <input
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="auth-input"
                        placeholder="Votre prénom"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <div className="input-wrapper">
                      <User size={20} />
                      <input
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="auth-input"
                        placeholder="Votre nom"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <Mail size={20} />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="auth-input"
                      placeholder="votre@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rôle souhaité</label>
                  <div className="role-selector">
                    {roles.map((role) => (
                      <label key={role.value} className="role-option">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={registerData.role === role.value}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value as any }))}
                          disabled={isLoading}
                        />
                        <div className="role-content">
                          <span className="role-title">{role.label}</span>
                          <span className="role-description">{role.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Code de l'établissement</label>
                  <div className="input-wrapper">
                    <KeyRound size={20} />
                    <input
                      type="text"
                      value={registerData.institutionCode}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() }))}
                      className="auth-input"
                      placeholder="CODE123"
                      required
                      disabled={isLoading}
                      maxLength={8}
                    />
                  </div>
                  <small className="form-hint">
                    Demandez ce code à votre administrateur
                  </small>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Mot de passe</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        className="auth-input"
                        placeholder="Mot de passe"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmer</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="auth-input"
                        placeholder="Confirmer"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button primary"
                  disabled={isLoading || !registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !registerData.institutionCode}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Créer le compte
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Create Institution Form */}
            {mode === 'create_institution' && (
              <form onSubmit={handleSubmit} className="auth-form">
                {step === 1 && (
                  <div className="institution-step">
                    <div className="step-header">
                      <Building size={24} />
                      <h3>Informations de l'établissement</h3>
                      <p>Créez votre établissement et obtenez votre code unique</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nom de l'établissement *</label>
                      <div className="input-wrapper">
                        <Building size={20} />
                        <input
                          type="text"
                          value={institutionData.name}
                          onChange={(e) => setInstitutionData(prev => ({ ...prev, name: e.target.value }))}
                          className="auth-input"
                          placeholder="Lycée Moderne de Douala"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Type d'établissement *</label>
                      <div className="type-selector">
                        {institutionTypes.map((type) => (
                          <label key={type.value} className="type-option">
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={institutionData.type === type.value}
                              onChange={(e) => setInstitutionData(prev => ({ ...prev, type: e.target.value as any }))}
                              disabled={isLoading}
                            />
                            <div className="type-content">
                              <span className="type-icon">{type.icon}</span>
                              <span className="type-label">{type.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Ville *</label>
                        <div className="input-wrapper">
                          <MapPin size={20} />
                          <input
                            type="text"
                            value={institutionData.city}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, city: e.target.value }))}
                            className="auth-input"
                            placeholder="Douala"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pays *</label>
                        <div className="input-wrapper">
                          <Globe size={20} />
                          <input
                            type="text"
                            value={institutionData.country}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, country: e.target.value }))}
                            className="auth-input"
                            placeholder="Cameroun"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Adresse</label>
                      <div className="input-wrapper">
                        <MapPin size={20} />
                        <input
                          type="text"
                          value={institutionData.address}
                          onChange={(e) => setInstitutionData(prev => ({ ...prev, address: e.target.value }))}
                          className="auth-input"
                          placeholder="Avenue de la Liberté"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Téléphone</label>
                        <div className="input-wrapper">
                          <Phone size={20} />
                          <input
                            type="tel"
                            value={institutionData.phone}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, phone: e.target.value }))}
                            className="auth-input"
                            placeholder="+237 XXX XXX XXX"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                          <Mail size={20} />
                          <input
                            type="email"
                            value={institutionData.email}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, email: e.target.value }))}
                            className="auth-input"
                            placeholder="contact@etablissement.com"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        value={institutionData.description}
                        onChange={(e) => setInstitutionData(prev => ({ ...prev, description: e.target.value }))}
                        className="auth-textarea"
                        placeholder="Brève description de votre établissement..."
                        rows={3}
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="button"
                      className="auth-button primary"
                      onClick={nextStep}
                      disabled={!validateStep1() || isLoading}
                    >
                      Continuer
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="admin-step">
                    <div className="step-header">
                      <Shield size={24} />
                      <h3>Compte administrateur</h3>
                      <p>Créez le compte administrateur principal</p>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Prénom *</label>
                        <div className="input-wrapper">
                          <User size={20} />
                          <input
                            type="text"
                            value={institutionData.adminFirstName}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                            className="auth-input"
                            placeholder="Prénom"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nom *</label>
                        <div className="input-wrapper">
                          <User size={20} />
                          <input
                            type="text"
                            value={institutionData.adminLastName}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminLastName: e.target.value }))}
                            className="auth-input"
                            placeholder="Nom"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email administrateur *</label>
                      <div className="input-wrapper">
                        <Mail size={20} />
                        <input
                          type="email"
                          value={institutionData.adminEmail}
                          onChange={(e) => setInstitutionData(prev => ({ ...prev, adminEmail: e.target.value }))}
                          className="auth-input"
                          placeholder="admin@etablissement.com"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mot de passe *</label>
                      <div className="input-wrapper">
                        <Lock size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={institutionData.adminPassword}
                          onChange={(e) => setInstitutionData(prev => ({ ...prev, adminPassword: e.target.value }))}
                          className="auth-input"
                          placeholder="Mot de passe sécurisé"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <small className="form-hint">
                        Minimum 6 caractères
                      </small>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="auth-button secondary"
                        onClick={previousStep}
                        disabled={isLoading}
                      >
                        Précédent
                      </button>
                      <button
                        type="submit"
                        className="auth-button primary"
                        disabled={!validateStep2() || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="loading-spinner"></div>
                            Création...
                          </>
                        ) : (
                          <>
                            <Building size={18} />
                            Créer l'établissement
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-auth {
          height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
        }
        
        .auth-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .auth-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .floating-book {
          position: absolute;
          width: 24px;
          height: 32px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 4px;
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-book:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-book:nth-child(2) {
          top: 60%;
          left: 15%;
          animation-delay: 2s;
        }
        
        .floating-book:nth-child(3) {
          top: 40%;
          left: 5%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        .auth-content {
          display: flex;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .auth-branding {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          color: #F3EED9;
          max-width: 500px;
        }
        
        .brand-logo {
          width: 80px;
          height: 80px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          border: 1px solid rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .brand-title {
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }
        
        .brand-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0 0 48px 0;
          line-height: 1.5;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 16px;
          opacity: 0.9;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          width: fit-content;
        }
        
        .connection-status.online {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .connection-status.offline {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
          border: 1px solid rgba(255, 152, 0, 0.3);
        }
        
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          max-width: 600px;
        }
        
        .auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 0;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .auth-header {
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, #F3EED9 0%, #EAEADC 100%);
          border-bottom: 1px solid #E5DCC2;
        }
        
        .auth-tabs {
          display: flex;
          gap: 4px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
        }
        
        .auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .auth-tab.active {
          background: #3E5C49;
          color: #F3EED9;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.2);
        }
        
        .mode-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #3E5C49;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .progress-bar {
          margin-top: 16px;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        .progress-step.active {
          opacity: 1;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(62, 92, 73, 0.2);
          color: #3E5C49;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .progress-step.active .step-number {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .progress-line {
          width: 40px;
          height: 2px;
          background: rgba(62, 92, 73, 0.2);
        }
        
        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .error-message {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .success-message {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .auth-form {
          padding: 32px;
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
          margin-bottom: 20px;
        }
        
        .form-label {
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
        
        .auth-input,
        .auth-textarea {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .auth-textarea {
          padding: 16px;
          resize: vertical;
          min-height: 80px;
        }
        
        .auth-input:focus,
        .auth-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .auth-input:disabled,
        .auth-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #F3EED9;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .password-toggle:hover {
          color: #2E2E2E;
          background: rgba(110, 110, 110, 0.1);
        }
        
        .role-selector,
        .type-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .role-option,
        .type-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FFFFFF;
        }
        
        .role-option:hover,
        .type-option:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }
        
        .role-option input:checked + .role-content,
        .type-option input:checked + .type-content {
          color: #3E5C49;
        }
        
        .role-option input:checked,
        .type-option input:checked {
          accent-color: #3E5C49;
        }
        
        .role-content,
        .type-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .type-content {
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }
        
        .role-title,
        .type-label {
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .role-description {
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .type-icon {
          font-size: 20px;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6E6E6E;
          font-style: italic;
        }
        
        .auth-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          margin-bottom: 12px;
        }
        
        .auth-button.primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .auth-button.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .auth-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .auth-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .loading-spinner {
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
        
        .institution-step,
        .admin-step {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .step-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 16px 0 8px 0;
        }
        
        .step-header p {
          color: #6E6E6E;
          margin: 0;
          font-size: 16px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        
        .form-actions .auth-button {
          margin-bottom: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .auth-content {
            flex-direction: column;
          }
          
          .auth-branding {
            padding: 40px;
            text-align: center;
            flex: none;
            max-width: none;
          }
          
          .brand-title {
            font-size: 36px;
          }
          
          .brand-subtitle {
            font-size: 18px;
          }
          
          .features-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
          
          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 8px;
            min-width: 120px;
          }
          
          .auth-form-container {
            max-width: none;
          }
        }
        
        @media (max-width: 768px) {
          .auth-branding {
            padding: 32px 20px;
          }
          
          .auth-form-container {
            padding: 20px;
          }
          
          .auth-card {
            max-width: none;
            border-radius: 20px;
            max-height: none;
          }
          
          .auth-header {
            padding: 24px 20px 20px;
          }
          
          .auth-form {
            padding: 24px 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .brand-title {
            font-size: 28px;
          }
          
          .brand-subtitle {
            font-size: 16px;
          }
          
          .features-list {
            flex-direction: column;
            gap: 12px;
          }
          
          .feature-item {
            flex-direction: row;
            justify-content: center;
          }
          
          .auth-tabs {
            flex-direction: column;
            gap: 8px;
          }
          
          .auth-tab {
            flex: none;
          }
          
          .progress-steps {
            gap: 12px;
          }
          
          .progress-line {
            width: 30px;
          }
          
          .type-selector {
            grid-template-columns: 1fr 1fr;
            display: grid;
            gap: 12px;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
        }
        
        @media (max-width: 480px) {
          .auth-branding {
            padding: 24px 16px;
          }
          
          .auth-form-container {
            padding: 16px;
          }
          
          .auth-header,
          .auth-form {
            padding: 20px 16px;
          }
          
          .brand-logo {
            width: 64px;
            height: 64px;
            margin-bottom: 24px;
          }
          
          .brand-title {
            font-size: 24px;
          }
          
          .auth-input,
          .auth-textarea {
            font-size: 14px;
          }
          
          .type-selector {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 16px;
          }
          
          .progress-line {
            width: 2px;
            height: 20px;
          }
        }
        
        /* Animation enhancements */
        .auth-card {
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .auth-branding {
          animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .auth-card,
          .auth-branding,
          .floating-book,
          .auth-pattern {
            animation: none;
          }
          
          .auth-button,
          .role-option,
          .type-option {
            transition: none;
          }
          
          .auth-button:hover,
          .role-option:hover,
          .type-option:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .auth-input,
          .auth-textarea,
          .auth-button {
            border-width: 3px;
          }
          
          .auth-tab.active {
            border: 2px solid #F3EED9;
          }
          
          .role-option,
          .type-option {
            border-width: 3px;
          }
        }
      `}</style>
    </div>
  );
};