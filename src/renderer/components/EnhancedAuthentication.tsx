// src/renderer/components/EnhancedAuthentication.tsx - Version simplifiée pour mode offline
import React, { useState } from 'react';
import { 
  Book, 
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

  const nextStep = () => {
    if (step === 1 && institutionData.name && institutionData.type && institutionData.city) {
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
    <div className="offline-auth">
      <div className="auth-background">
        <div className="pattern-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        {/* Header avec logo et status offline */}
        <div className="auth-header">
          <div className="app-logo">
            <div className="logo-icon">
              <Book size={32} />
            </div>
            <div className="logo-text">
              <h1>Bibliothèque</h1>
              <span>Gestion Locale</span>
            </div>
          </div>
          
          <div className="offline-badge">
            <WifiOff size={16} />
            <span>Mode Hors Ligne</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="auth-content">
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
                {step === 1 && (
                  <div className="step-content">
                    <div className="section-header">
                      <Building size={24} />
                      <h2>Nouvel Établissement</h2>
                      <p>Créez votre établissement local</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="auth-form">
                      <div className="form-group">
                        <label>Nom de l'établissement *</label>
                        <div className="input-group">
                          <Building size={20} />
                          <input
                            type="text"
                            value={institutionData.name}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ma Bibliothèque"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Type d'établissement *</label>
                        <div className="type-grid">
                          {institutionTypes.map((type) => (
                            <label key={type.value} className="type-card">
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

                      <div className="form-group">
                        <label>Ville *</label>
                        <div className="input-group">
                          <MapPin size={20} />
                          <input
                            type="text"
                            value={institutionData.city}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Votre ville"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="submit-btn"
                        disabled={!institutionData.name || !institutionData.type || !institutionData.city || isLoading}
                      >
                        Continuer
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <div className="section-header">
                      <Shield size={24} />
                      <h2>Compte Administrateur</h2>
                      <p>Créez le compte administrateur principal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Prénom *</label>
                          <div className="input-group">
                            <User size={20} />
                            <input
                              type="text"
                              value={institutionData.adminFirstName}
                              onChange={(e) => setInstitutionData(prev => ({ ...prev, adminFirstName: e.target.value }))}
                              placeholder="Prénom"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Nom *</label>
                          <div className="input-group">
                            <User size={20} />
                            <input
                              type="text"
                              value={institutionData.adminLastName}
                              onChange={(e) => setInstitutionData(prev => ({ ...prev, adminLastName: e.target.value }))}
                              placeholder="Nom"
                              required
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Email administrateur *</label>
                        <div className="input-group">
                          <Mail size={20} />
                          <input
                            type="email"
                            value={institutionData.adminEmail}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminEmail: e.target.value }))}
                            placeholder="admin@monorganisation.com"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Mot de passe *</label>
                        <div className="input-group">
                          <Lock size={20} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={institutionData.adminPassword}
                            onChange={(e) => setInstitutionData(prev => ({ ...prev, adminPassword: e.target.value }))}
                            placeholder="Mot de passe sécurisé"
                            required
                            disabled={isLoading}
                            minLength={3}
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <small>Minimum 3 caractères</small>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="back-btn"
                          onClick={previousStep}
                          disabled={isLoading}
                        >
                          Précédent
                        </button>
                        <button
                          type="submit"
                          className="submit-btn"
                          disabled={!institutionData.adminFirstName || !institutionData.adminLastName || 
                                   !institutionData.adminEmail || !institutionData.adminPassword || 
                                   institutionData.adminPassword.length < 3 || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="spinner"></div>
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
                    </form>
                  </div>
                )}

                {/* Indicateur de progression */}
                <div className="step-indicator">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                    <label>Établissement</label>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                    <label>Administrateur</label>
                  </div>
                </div>
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
        .offline-auth {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3a2e 0%, #2d5a45 50%, #1e3a2e 100%);
          position: relative;
          overflow-x: hidden;
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
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
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
          background: rgba(255, 255, 255, 0.05);
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

        .auth-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .auth-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 0 20px;
        }

        .app-logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo-text h1 {
          margin: 0;
          color: white;
          font-size: 24px;
          font-weight: 700;
        }

        .logo-text span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .offline-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 152, 0, 0.2);
          color: #ffa726;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(255, 152, 0, 0.3);
        }

        .auth-content {
          display: flex;
          gap: 40px;
          flex: 1;
          align-items: flex-start;
        }

        .auth-card {
          flex: 1;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
        }

        .auth-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: white;
          color: #2d5a45;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          font-weight: 500;
          border-bottom: 1px solid #e9ecef;
        }

        .message.error {
          background: #ffeaea;
          color: #d32f2f;
        }

        .message.success {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .section-header {
          text-align: center;
          padding: 32px 24px 24px;
          border-bottom: 1px solid #f1f3f4;
        }

        .section-header h2 {
          margin: 16px 0 8px;
          color: #2d5a45;
          font-size: 24px;
          font-weight: 700;
        }

        .section-header p {
          margin: 0;
          color: #6c757d;
          font-size: 16px;
        }

        .auth-form {
          padding: 32px 24px;
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
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d5a45;
          font-size: 14px;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group svg {
          position: absolute;
          left: 16px;
          color: #6c757d;
          z-index: 2;
        }

        .input-group input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #2d5a45;
          box-shadow: 0 0 0 3px rgba(45, 90, 69, 0.1);
        }

        .input-group input:disabled {
          background: #f8f9fa;
          opacity: 0.7;
        }

        .toggle-password {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .toggle-password:hover {
          color: #2d5a45;
          background: rgba(45, 90, 69, 0.1);
        }

        .form-group small {
          display: block;
          margin-top: 4px;
          color: #6c757d;
          font-size: 12px;
        }

        .type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .type-card {
          display: block;
          cursor: pointer;
        }

        .type-card input {
          display: none;
        }

        .type-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-align: center;
        }

        .type-card input:checked + .type-content {
          border-color: #2d5a45;
          background: rgba(45, 90, 69, 0.05);
        }

        .type-content:hover {
          border-color: #2d5a45;
        }

        .type-icon {
          font-size: 24px;
        }

        .type-label {
          font-weight: 600;
          color: #2d5a45;
          font-size: 14px;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #2d5a45 0%, #1e3a2e 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(45, 90, 69, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .back-btn {
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #e9ecef;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover:not(:disabled) {
          background: #e9ecef;
          color: #495057;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .form-actions .submit-btn {
          flex: 1;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step span {
          width: 32px;
          height: 32px;
          background: #e9ecef;
          color: #6c757d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .step.active span {
          background: #2d5a45;
          color: white;
        }

        .step label {
          font-size: 12px;
          font-weight: 600;
          color: #6c757d;
          text-align: center;
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: #e9ecef;
        }

        /* Connexions rapides */
        .quick-login-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f1f3f4;
        }

        .divider {
          text-align: center;
          margin-bottom: 24px;
          position: relative;
        }

        .divider span {
          background: white;
          padding: 0 16px;
          color: #6c757d;
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
          background: #e9ecef;
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
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .quick-login-btn:hover:not(:disabled) {
          border-color: #2d5a45;
          background: rgba(45, 90, 69, 0.05);
        }

        .quick-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .credential-icon {
          width: 36px;
          height: 36px;
          background: #2d5a45;
          color: white;
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
          color: #2d5a45;
          font-size: 14px;
        }

        .credential-info .email {
          font-size: 12px;
          color: #6c757d;
        }

        .login-hint {
          background: rgba(45, 90, 69, 0.05);
          border: 1px solid rgba(45, 90, 69, 0.1);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }

        .login-hint p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #2d5a45;
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
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          color: white;
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
          .auth-content {
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
          .auth-container {
            padding: 16px;
          }

          .auth-header {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
            padding: 0;
          }

          .auth-content {
            gap: 24px;
          }

          .auth-card {
            max-width: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .quick-login-grid {
            grid-template-columns: 1fr;
          }

          .type-grid {
            grid-template-columns: 1fr;
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
          .auth-container {
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