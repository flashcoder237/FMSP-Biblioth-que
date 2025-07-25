// src/renderer/components/InitialSetup.tsx - Version redesignée
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
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
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
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.5) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(243, 238, 217, 0.5) 2px, transparent 2px);
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
          color: rgba(243, 238, 217, 0.2);
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
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          max-width: 1000px;
          width: 95%;
          max-height: 95vh;
          overflow-y: auto;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
          position: relative;
          z-index: 1;
          margin: 20px auto;
          animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .setup-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .setup-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3E5C49, #2E453A);
          border-radius: 20px;
          color: #F3EED9;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(62, 92, 73, 0.3);
        }

        .setup-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        }

        .setup-subtitle {
          font-size: 1.1rem;
          color: #4A4A4A;
          margin: 0;
        }

        .mode-selection {
          margin-bottom: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 16px;
        }

        .mode-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .mode-card {
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #FFFFFF;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .mode-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3E5C49, #C2571B);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .mode-card:not(.disabled):hover {
          border-color: #3E5C49;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(62, 92, 73, 0.2);
        }

        .mode-card:not(.disabled):hover::before {
          transform: scaleX(1);
        }

        .mode-card.selected {
          border-color: #3E5C49;
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.05), rgba(243, 238, 217, 0.1));
          box-shadow: 0 10px 30px rgba(62, 92, 73, 0.2);
        }

        .mode-card.selected::before {
          transform: scaleX(1);
        }

        .mode-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(248, 246, 240, 0.5);
        }

        .mode-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mode-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .mode-icon.offline {
          background: linear-gradient(135deg, #3E5C49, #2E453A);
        }

        .mode-icon.online {
          background: linear-gradient(135deg, #C2571B, #A8481A);
        }

        .mode-icon.disabled {
          background: #6E6E6E;
        }

        .mode-info h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }

        .mode-status {
          font-size: 0.85rem;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .mode-status.recommended {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .mode-status.coming-soon {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }

        .mode-description {
          margin-bottom: 12px;
          flex-grow: 1;
        }

        .mode-description p {
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
          font-size: 0.95rem;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .feature:not(.disabled) {
          color: #3E5C49;
        }

        .feature.disabled {
          color: #4A4A4A;
        }

        .mode-ideal {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px;
          background: rgba(248, 246, 240, 0.8);
          border-radius: 6px;
          font-size: 0.8rem;
          color: #4A4A4A;
          margin-top: auto;
        }

        .mode-ideal.disabled {
          background: rgba(229, 220, 194, 0.3);
          color: #4A4A4A;
        }

        .info-panel {
          margin-bottom: 20px;
        }

        .info-card {
          background: rgba(248, 246, 240, 0.8);
          border: 1px solid #E5DCC2;
          border-radius: 10px;
          padding: 16px;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }

        .info-header h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }

        .info-content ul {
          margin: 6px 0 0 0;
          padding-left: 18px;
        }

        .info-content li {
          margin-bottom: 3px;
          color: #4A4A4A;
          font-size: 0.9rem;
        }

        .setup-actions {
          text-align: center;
        }

        .continue-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #3E5C49, #2E453A);
          color: #F3EED9;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }

        .continue-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(62, 92, 73, 0.3);
        }

        .continue-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .setup-note {
          color: #4A4A4A;
          font-size: 0.85rem;
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
            padding: 20px;
            width: 98%;
            margin: 10px auto;
          }

          .mode-options {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .mode-card {
            min-height: auto;
            padding: 16px;
          }

          .setup-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .setup-container {
            padding: 16px;
            width: 99%;
            margin: 5px auto;
          }

          .setup-header {
            margin-bottom: 24px;
          }

          .setup-title {
            font-size: 1.6rem;
          }

          .mode-card {
            padding: 14px;
          }

          .continue-btn {
            padding: 12px 20px;
            font-size: 1rem;
          }
        }

        /* Scrollbar personnalisé */
        .setup-container::-webkit-scrollbar {
          width: 8px;
        }

        .setup-container::-webkit-scrollbar-track {
          background: #F3EED9;
          border-radius: 4px;
        }

        .setup-container::-webkit-scrollbar-thumb {
          background: #3E5C49;
          border-radius: 4px;
        }

        .setup-container::-webkit-scrollbar-thumb:hover {
          background: #2E453A;
        }
      `}</style>
    </div>
  );
};