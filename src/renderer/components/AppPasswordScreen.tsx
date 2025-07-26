// src/renderer/components/AppPasswordScreen.tsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, KeyRound, AlertCircle, X } from 'lucide-react';

interface AppPasswordScreenProps {
  onUnlock: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  isSetup?: boolean;
}

export const AppPasswordScreen: React.FC<AppPasswordScreenProps> = ({ 
  onUnlock, 
  onSkip, 
  onClose,
  isSetup = false 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSetup) {
        // Configuration d'un nouveau mot de passe
        if (password.length < 4) {
          throw new Error('Le mot de passe doit contenir au moins 4 caractères');
        }
        if (password !== confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        
        // Sauvegarder le mot de passe (via le service LocalAuthService)
        const { LocalAuthService } = await import('../services/LocalAuthService');
        LocalAuthService.setAppPassword(password);
        onUnlock();
      } else {
        // Vérification du mot de passe existant
        const { LocalAuthService } = await import('../services/LocalAuthService');
        if (LocalAuthService.verifyAppPassword(password)) {
          onUnlock();
        } else {
          throw new Error('Mot de passe incorrect');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-password-screen">
      <div className="password-background">
        <div className="pattern-overlay"></div>
        <div className="floating-locks">
          <div className="floating-lock"><Lock size={24} /></div>
          <div className="floating-lock"><Shield size={32} /></div>
          <div className="floating-lock"><KeyRound size={28} /></div>
        </div>
      </div>

      <div className="password-container">
        {onClose && (
          <button className="close-app-btn" onClick={onClose} title="Fermer l'application">
            <X size={20} />
          </button>
        )}
        <div className="password-header">
          <div className="lock-icon">
            <Shield size={48} />
          </div>
          <h1>{isSetup ? 'Sécuriser l\'Application' : 'Application Verrouillée'}</h1>
          <p>
            {isSetup 
              ? 'Définissez un mot de passe pour sécuriser l\'accès à l\'application'
              : 'Entrez le mot de passe pour déverrouiller l\'application'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>{isSetup ? 'Nouveau mot de passe' : 'Mot de passe'}</label>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSetup ? 'Créez un mot de passe' : 'Entrez votre mot de passe'}
                required
                disabled={isLoading}
                autoFocus
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

          {isSetup && (
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="input-group">
                <Lock size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="password-actions">
            <button
              type="submit"
              className="unlock-btn"
              disabled={!password || isLoading || (isSetup && !confirmPassword)}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <KeyRound size={20} />
                  <span>{isSetup ? 'Définir le mot de passe' : 'Déverrouiller'}</span>
                </>
              )}
            </button>

            {(isSetup || onSkip) && (
              <button
                type="button"
                className="skip-btn"
                onClick={onSkip}
                disabled={isLoading}
              >
                {isSetup ? 'Ignorer (non sécurisé)' : 'Réinitialiser'}
              </button>
            )}
          </div>

          {isSetup && (
            <div className="security-notice">
              <div className="notice-icon">
                <Shield size={16} />
              </div>
              <div className="notice-content">
                <p><strong>Conseil de sécurité :</strong></p>
                <ul>
                  <li>Utilisez un mot de passe unique</li>
                  <li>Conservez-le en lieu sûr</li>
                  <li>Ne le partagez pas</li>
                </ul>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .app-password-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .password-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
        }

        .pattern-overlay {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, #F3EED9 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #F3EED9 2px, transparent 2px);
          background-size: 60px 60px;
          animation: patternMove 25s linear infinite;
        }

        .floating-locks {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .floating-lock {
          position: absolute;
          color: rgba(243, 238, 217, 0.15);
          animation: float 8s ease-in-out infinite;
        }

        .floating-lock:nth-child(1) {
          top: 15%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-lock:nth-child(2) {
          top: 25%;
          right: 15%;
          animation-delay: 3s;
        }

        .floating-lock:nth-child(3) {
          bottom: 25%;
          left: 25%;
          animation-delay: 6s;
        }

        .password-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          position: relative;
          z-index: 1;
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .close-app-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #6E6E6E;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .close-app-btn:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #DC2626;
          transform: scale(1.05);
        }

        .password-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .lock-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 20px;
          color: #F3EED9;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.3);
        }

        .password-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .password-header p {
          color: #4A4A4A;
          margin: 0;
          line-height: 1.5;
          font-size: 14px;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
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

        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #dc2626;
          background: #fef2f2;
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fecaca;
        }

        .password-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .unlock-btn {
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

        .unlock-btn:not(:disabled):hover {
          background: linear-gradient(135deg, #2E453A 0%, #1F2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }

        .unlock-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .skip-btn {
          background: #F3EED9;
          border: 1px solid rgba(229, 220, 194, 0.4);
          color: #2E2E2E;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .skip-btn:hover {
          background: #E5DCC2;
          transform: translateY(-1px);
        }

        .security-notice {
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 16px;
          margin-top: 8px;
        }

        .notice-icon {
          color: #3E5C49;
          margin-bottom: 8px;
        }

        .notice-content p {
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 12px 0;
          font-size: 14px;
        }

        .notice-content ul {
          margin: 0;
          padding-left: 20px;
          color: #2E453A;
          font-size: 13px;
          line-height: 1.5;
        }

        .notice-content li {
          margin-bottom: 4px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes patternMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(60px) translateY(60px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .password-container {
            padding: 32px 24px;
            width: 95%;
            margin: 16px;
          }

          .password-header h1 {
            font-size: 20px;
          }

          .lock-icon {
            width: 64px;
            height: 64px;
          }
        }

        @media (max-width: 480px) {
          .password-container {
            padding: 24px 20px;
            border-radius: 16px;
          }

          .password-header h1 {
            font-size: 18px;
          }

          .lock-icon {
            width: 56px;
            height: 56px;
          }

          .password-header p {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};