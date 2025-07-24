// src/renderer/components/AppPasswordScreen.tsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, KeyRound, AlertCircle } from 'lucide-react';

interface AppPasswordScreenProps {
  onUnlock: () => void;
  onSkip?: () => void;
  isSetup?: boolean;
}

export const AppPasswordScreen: React.FC<AppPasswordScreenProps> = ({ 
  onUnlock, 
  onSkip, 
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
          background: linear-gradient(135deg, #3E5C49 0%, #399b5dff 100%);
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
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
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
          color: rgba(255, 255, 255, 0.15);
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
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
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
          background: linear-gradient(135deg, #3E5C49, #399b5dff);
          border-radius: 20px;
          color: white;
          margin-bottom: 20px;
        }

        .password-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .password-header p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 0 16px;
          transition: border-color 0.3s ease;
        }

        .input-group:focus-within {
          border-color: #399b5dff;
          box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
        }

        .input-group svg {
          color: #9ca3af;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .input-group input {
          flex: 1;
          border: none;
          padding: 16px 0;
          font-size: 1rem;
          outline: none;
          background: transparent;
        }

        .toggle-password {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
          border-radius: 4px;
          transition: color 0.3s ease;
        }

        .toggle-password:hover {
          color: #6b7280;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          background: #fef2f2;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
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
          gap: 10px;
          background: linear-gradient(135deg, #3E5C49, #399b5dff);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .unlock-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(30, 138, 100, 0.3);
        }

        .unlock-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .skip-btn {
          background: none;
          border: 2px solid #e5e7eb;
          color: #6b7280;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .skip-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .security-notice {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 12px;
          padding: 16px;
          margin-top: 8px;
        }

        .notice-icon {
          color: #02c78fff;
          margin-bottom: 8px;
        }

        .notice-content p {
          font-weight: 600;
          color: #0c6e52ff;
          margin: 0 0 8px 0;
          font-size: 0.9rem;
        }

        .notice-content ul {
          margin: 0;
          padding-left: 20px;
          color: #078561ff;
          font-size: 0.85rem;
        }

        .notice-content li {
          margin-bottom: 4px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
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

        @media (max-width: 500px) {
          .password-container {
            padding: 24px;
            width: 95%;
          }

          .password-header h1 {
            font-size: 1.6rem;
          }

          .lock-icon {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};