// src/renderer/components/InitialSetup.tsx
import React, { useState } from 'react';
import { 
  Monitor, 
  Wifi, 
  WifiOff, 
  Database, 
  Cloud, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Info,
  Settings,
  Globe,
  HardDrive,
  Network,
  Users
} from 'lucide-react';

export type AppMode = 'offline' | 'online';

interface InitialSetupProps {
  onComplete: (mode: AppMode) => void;
}

export const InitialSetup: React.FC<InitialSetupProps> = ({ onComplete }) => {
  const [selectedMode, setSelectedMode] = useState<AppMode>('offline');
  
  return (
    <div className="initial-setup">
      {/* Background Pattern */}
      <div className="setup-background">
        <div className="setup-pattern"></div>
        <div className="floating-elements">
          <div className="floating-icon"><Database /></div>
          <div className="floating-icon"><Cloud /></div>
          <div className="floating-icon"><Network /></div>
        </div>
      </div>

      <div className="setup-container">
        {/* Header */}
        <div className="setup-header">
          <div className="setup-logo">
            <Monitor size={48} />
          </div>
          <h1 className="setup-title">Configuration Initiale</h1>
          <p className="setup-subtitle">
            Configurez le mode de fonctionnement de votre bibliothèque
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mode-selection">
          <h2 className="section-title">
            <Settings size={24} />
            Choisissez votre mode de fonctionnement
          </h2>

          <div className="mode-options">
            {/* Mode Offline */}
            <div 
              className={`mode-card ${selectedMode === 'offline' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('offline')}
            >
              <div className="mode-header">
                <div className="mode-icon offline">
                  <HardDrive size={32} />
                </div>
                <div className="mode-info">
                  <h3>Mode Hors Ligne</h3>
                  <span className="mode-status recommended">Recommandé</span>
                </div>
              </div>

              <div className="mode-description">
                <p>
                  Utilise une base de données locale (SQLite) pour stocker toutes les données. 
                  Fonctionne sans connexion Internet et peut être partagé en réseau local.
                </p>
              </div>

              <div className="mode-features">
                <div className="feature-list">
                  <div className="feature">
                    <CheckCircle size={16} />
                    <span>Fonctionne sans Internet</span>
                  </div>
                  <div className="feature">
                    <CheckCircle size={16} />
                    <span>Données stockées localement</span>
                  </div>
                  <div className="feature">
                    <CheckCircle size={16} />
                    <span>Partage en réseau local</span>
                  </div>
                  <div className="feature">
                    <CheckCircle size={16} />
                    <span>Performance optimale</span>
                  </div>
                  <div className="feature">
                    <CheckCircle size={16} />
                    <span>Contrôle total des données</span>
                  </div>
                </div>
              </div>

              <div className="mode-ideal">
                <Info size={16} />
                <span>Idéal pour : Bibliothèques locales, établissements scolaires, usage privé</span>
              </div>
            </div>

            {/* Mode Online - Disabled */}
            <div className="mode-card disabled">
              <div className="mode-header">
                <div className="mode-icon online disabled">
                  <Cloud size={32} />
                </div>
                <div className="mode-info">
                  <h3>Mode En Ligne</h3>
                  <span className="mode-status coming-soon">Bientôt disponible</span>
                </div>
              </div>

              <div className="mode-description">
                <p>
                  Utilise Supabase pour la synchronisation cloud et le partage multi-établissements. 
                  Nécessite une connexion Internet stable.
                </p>
              </div>

              <div className="mode-features">
                <div className="feature-list">
                  <div className="feature disabled">
                    <Globe size={16} />
                    <span>Synchronisation cloud</span>
                  </div>
                  <div className="feature disabled">
                    <Users size={16} />
                    <span>Multi-établissements</span>
                  </div>
                  <div className="feature disabled">
                    <Wifi size={16} />
                    <span>Accès depuis partout</span>
                  </div>
                  <div className="feature disabled">
                    <Database size={16} />
                    <span>Sauvegarde automatique</span>
                  </div>
                </div>
              </div>

              <div className="mode-ideal disabled">
                <AlertCircle size={16} />
                <span>Cette fonctionnalité sera disponible dans une prochaine version</span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="info-panel">
          <div className="info-card">
            <div className="info-header">
              <Info size={20} />
              <h3>Informations importantes</h3>
            </div>
            <div className="info-content">
              {selectedMode === 'offline' ? (
                <div className="info-details">
                  <p><strong>Mode Hors Ligne sélectionné :</strong></p>
                  <ul>
                    <li>Vos données seront stockées localement sur cet ordinateur</li>
                    <li>L'application fonctionnera sans connexion Internet</li>
                    <li>Vous pouvez partager la base de données sur votre réseau local</li>
                    <li>Ce choix peut être modifié ultérieurement dans les paramètres</li>
                  </ul>
                </div>
              ) : (
                <div className="info-details">
                  <p><strong>Mode En Ligne :</strong></p>
                  <ul>
                    <li>Fonctionnalité en cours de développement</li>
                    <li>Permettra la synchronisation cloud via Supabase</li>
                    <li>Gestion multi-établissements</li>
                    <li>Disponible dans une prochaine mise à jour</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="setup-actions">
          <button 
            className="continue-btn"
            onClick={() => onComplete(selectedMode)}
            disabled={selectedMode === 'online'}
          >
            <span>Continuer avec le mode {selectedMode === 'offline' ? 'Hors Ligne' : 'En Ligne'}</span>
            <ArrowRight size={20} />
          </button>
          
          <p className="setup-note">
            Vous pourrez modifier ce choix plus tard dans les paramètres de l'application
          </p>
        </div>
      </div>

      <style>{`
        .initial-setup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
          z-index: 1000;
        }

        .setup-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
        }

        .setup-pattern {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
          background-size: 50px 50px;
          animation: patternMove 20s linear infinite;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .floating-icon {
          position: absolute;
          color: rgba(255, 255, 255, 0.2);
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 20%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        .setup-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .setup-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          color: white;
          margin-bottom: 20px;
        }

        .setup-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d3748;
          margin: 0 0 10px 0;
        }

        .setup-subtitle {
          font-size: 1.1rem;
          color: #718096;
          margin: 0;
        }

        .mode-selection {
          margin-bottom: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 20px;
        }

        .mode-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .mode-card {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .mode-card:not(.disabled):hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .mode-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea05, #764ba205);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .mode-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f7fafc;
        }

        .mode-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .mode-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .mode-icon.offline {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        .mode-icon.online {
          background: linear-gradient(135deg, #4299e1, #3182ce);
        }

        .mode-icon.disabled {
          background: #cbd5e0;
        }

        .mode-info h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 4px 0;
        }

        .mode-status {
          font-size: 0.85rem;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .mode-status.recommended {
          background: #c6f6d5;
          color: #22543d;
        }

        .mode-status.coming-soon {
          background: #fed7d7;
          color: #742a2a;
        }

        .mode-description {
          margin-bottom: 16px;
        }

        .mode-description p {
          color: #4a5568;
          margin: 0;
          line-height: 1.5;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .feature:not(.disabled) {
          color: #48bb78;
        }

        .feature.disabled {
          color: #a0aec0;
        }

        .mode-ideal {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .mode-ideal.disabled {
          background: #edf2f7;
          color: #a0aec0;
        }

        .info-panel {
          margin-bottom: 30px;
        }

        .info-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .info-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }

        .info-content ul {
          margin: 8px 0 0 0;
          padding-left: 20px;
        }

        .info-content li {
          margin-bottom: 4px;
          color: #6c757d;
        }

        .setup-actions {
          text-align: center;
        }

        .continue-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .continue-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .continue-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .setup-note {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
        }

        @keyframes patternMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(50px) translateY(50px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .setup-container {
            padding: 24px;
            width: 95%;
          }

          .mode-options {
            grid-template-columns: 1fr;
          }

          .setup-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};