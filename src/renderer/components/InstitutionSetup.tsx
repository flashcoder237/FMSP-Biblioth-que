// src/renderer/components/InstitutionSetup.tsx - Version redesignée
import React, { useState } from 'react';
import { 
  Building,
  CheckCircle,
  Copy,
  Download,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  BookOpen,
  Users,
  Database,
  WifiOff,
  HardDrive,
  Zap
} from 'lucide-react';
import { Institution } from '../services/SupabaseClient';

interface InstitutionSetupProps {
  institutionCode: string;
  institution: Institution | null;
  onComplete: () => void;
}

export const InstitutionSetup: React.FC<InstitutionSetupProps> = ({
  institutionCode,
  institution,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(institutionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = institutionCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInfo = () => {
    const content = `
INFORMATIONS DE VOTRE ÉTABLISSEMENT (MODE HORS LIGNE)
=====================================================

Nom: ${institution?.name || 'Non spécifié'}
Code d'accès local: ${institutionCode}
Type: ${institution?.type || 'Non spécifié'}
Ville: ${institution?.city || 'Non spécifié'}

MODE DE FONCTIONNEMENT:
======================
✓ Base de données locale (SQLite)
✓ Fonctionne sans Internet
✓ Données stockées sur votre ordinateur
✓ Possibilité de partage en réseau local

INFORMATIONS IMPORTANTES:
========================
- Ce code permet l'accès à votre bibliothèque locale
- Conservez-le précieusement
- Partagez-le uniquement avec des personnes autorisées
- Votre établissement fonctionne entièrement hors ligne

Date de création: ${new Date().toLocaleDateString('fr-FR')}
Heure de création: ${new Date().toLocaleTimeString('fr-FR')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${institution?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'bibliotheque'}_offline_info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendInvitation = () => {
    const subject = encodeURIComponent(`Invitation - ${institution?.name} (Mode Hors Ligne)`);
    const body = encodeURIComponent(`
Bonjour,

Vous êtes invité(e) à rejoindre ${institution?.name} sur notre système de bibliothèque local.

🔑 Code d'accès: ${institutionCode}

📍 Informations importantes:
- Notre bibliothèque fonctionne en mode hors ligne
- Aucune connexion Internet requise
- Accès depuis le réseau local uniquement

📋 Instructions:
1. Connectez-vous au réseau local de l'établissement
2. Lancez l'application Bibliothèque
3. Utilisez le code d'accès ci-dessus pour vous connecter
4. Vos données seront synchronisées localement

Si vous avez des questions, contactez l'administrateur de la bibliothèque.

Cordialement,
L'équipe de ${institution?.name}
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Établissement créé !",
      subtitle: "Configuration réussie",
      icon: CheckCircle
    },
    {
      number: 2,
      title: "Code d'accès",
      subtitle: "Partagez avec vos utilisateurs",
      icon: Shield
    },
    {
      number: 3,
      title: "Prêt à utiliser",
      subtitle: "Commencez dès maintenant",
      icon: BookOpen
    }
  ];

  return (
    <div className="institution-setup">
      <div className="setup-background">
        <div className="pattern-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="setup-container">
        {/* Header */}
        <div className="setup-header">
          <div className="offline-badge">
            <WifiOff size={16} />
            <span>Mode Hors Ligne</span>
          </div>
          
          <div className="header-logo">
            <Building size={40} />
          </div>
          <h1 className="setup-title">Configuration Terminée</h1>
          
          {/* Progress indicator */}
          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div key={step.number} className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}>
                  <div className="step-circle">
                    <step.icon size={16} />
                  </div>
                  <div className="step-info">
                    <span className="step-title">{step.title}</span>
                    <span className="step-subtitle">{step.subtitle}</span>
                  </div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="setup-content">
          {/* Step 1: Success */}
          {currentStep === 1 && (
            <div className="step-content success-step">
              <div className="success-animation">
                <div className="success-circle">
                  <CheckCircle size={48} />
                </div>
                <div className="success-sparkles">
                  <Sparkles className="sparkle sparkle-1" />
                  <Sparkles className="sparkle sparkle-2" />
                  <Sparkles className="sparkle sparkle-3" />
                </div>
              </div>
              
              <h2 className="step-title">Félicitations ! 🎉</h2>
              <p className="step-description">
                Votre établissement <strong>{institution?.name}</strong> a été configuré avec succès 
                en mode hors ligne. Vous pouvez maintenant gérer votre bibliothèque localement.
              </p>

              <div className="institution-card">
                <div className="card-header">
                  <HardDrive size={20} />
                  <h3>Bibliothèque Locale</h3>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Nom:</span>
                    <span className="info-value">{institution?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">
                      {institution?.type === 'school' && '🏫 École/Lycée'}
                      {institution?.type === 'university' && '🎓 Université'}
                      {institution?.type === 'library' && '📚 Bibliothèque'}
                      {institution?.type === 'other' && '🏢 Autre'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ville:</span>
                    <span className="info-value">{institution?.city}</span>
                  </div>
                  <div className="info-row highlight">
                    <span className="info-label">Code d'accès:</span>
                    <span className="info-value code-value">{institutionCode}</span>
                  </div>
                </div>
              </div>

              <div className="features-preview">
                <h3>Fonctionnalités disponibles :</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <Database size={18} />
                    <span>Base de données locale</span>
                  </div>
                  <div className="feature-item">
                    <WifiOff size={18} />
                    <span>Fonctionne hors ligne</span>
                  </div>
                  <div className="feature-item">
                    <BookOpen size={18} />
                    <span>Gestion des livres</span>
                  </div>
                  <div className="feature-item">
                    <Users size={18} />
                    <span>Gestion des utilisateurs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Share Code */}
          {currentStep === 2 && (
            <div className="step-content share-step">
              <div className="share-header">
                <div className="share-icon">
                  <Shield size={40} />
                </div>
                <h2 className="step-title">Code d'Accès Local</h2>
                <p className="step-description">
                  Ce code permet aux utilisateurs locaux d'accéder à votre bibliothèque. 
                  Conservez-le précieusement et partagez-le uniquement avec des personnes autorisées.
                </p>
              </div>

              <div className="code-display">
                <div className="code-container">
                  <div className="code-label">Code d'accès local</div>
                  <div className="code-value-large">{institutionCode}</div>
                  <button 
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    onClick={handleCopyCode}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copié !' : 'Copier le code'}</span>
                  </button>
                </div>
              </div>

              <div className="sharing-options">
                <h3>Options de partage</h3>
                <div className="sharing-grid">
                  <button className="sharing-option" onClick={handleDownloadInfo}>
                    <div className="option-icon">
                      <Download size={20} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Télécharger les infos</span>
                      <span className="option-description">Fichier avec code et instructions</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={sendInvitation}>
                    <div className="option-icon">
                      <Mail size={20} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Envoyer par email</span>
                      <span className="option-description">Invitation pré-rédigée</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="instructions-card">
                <h4>Instructions pour vos utilisateurs :</h4>
                <ol className="instructions-list">
                  <li>Se connecter au réseau local de l'établissement</li>
                  <li>Lancer l'application Bibliothèque</li>
                  <li>Utiliser ce code d'accès : <code>{institutionCode}</code></li>
                  <li>Les données seront synchronisées localement</li>
                </ol>
                
                <div className="offline-note">
                  <WifiOff size={16} />
                  <span>Aucune connexion Internet requise</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ready to Start */}
          {currentStep === 3 && (
            <div className="step-content ready-step">
              <div className="ready-animation">
                <div className="ready-icon">
                  <Zap size={48} />
                </div>
              </div>

              <h2 className="step-title">Tout est prêt ! 🚀</h2>
              <p className="step-description">
                Votre bibliothèque locale est configurée et prête à être utilisée. 
                Vous allez maintenant accéder au tableau de bord administrateur.
              </p>

              <div className="quick-actions">
                <h3>Prochaines étapes recommandées :</h3>
                <div className="actions-list">
                  <div className="action-item">
                    <div className="action-number">1</div>
                    <div className="action-content">
                      <span className="action-title">Ajoutez vos premiers livres</span>
                      <span className="action-description">Construisez votre catalogue local</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">2</div>
                    <div className="action-content">
                      <span className="action-title">Configurez vos paramètres</span>
                      <span className="action-description">Personnalisez votre bibliothèque</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">3</div>
                    <div className="action-content">
                      <span className="action-title">Partagez le code d'accès</span>
                      <span className="action-description">Invitez vos utilisateurs locaux</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">4</div>
                    <div className="action-content">
                      <span className="action-title">Testez le système</span>
                      <span className="action-description">Vérifiez toutes les fonctionnalités</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="offline-advantages">
                <h4>Avantages du mode hors ligne :</h4>
                <div className="advantages-grid">
                  <div className="advantage-item">
                    <Database size={16} />
                    <span>Données locales sécurisées</span>
                  </div>
                  <div className="advantage-item">
                    <WifiOff size={16} />
                    <span>Indépendance Internet</span>
                  </div>
                  <div className="advantage-item">
                    <Zap size={16} />
                    <span>Performance optimale</span>
                  </div>
                  <div className="advantage-item">
                    <Shield size={16} />
                    <span>Contrôle total</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="setup-navigation">
          {currentStep > 1 && (
            <button 
              className="nav-button secondary"
              onClick={previousStep}
              disabled={isLoading}
            >
              Précédent
            </button>
          )}
          
          <button 
            className="nav-button primary"
            onClick={nextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Chargement...
              </>
            ) : (
              <>
                {currentStep === 3 ? 'Accéder à ma bibliothèque' : 'Continuer'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .institution-setup {
          min-height: 100vh;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          position: relative;
          overflow-x: hidden;
        }

        .setup-background {
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
          width: 80px;
          height: 80px;
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
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .setup-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 32px;
          color: #F3EED9;
        }

        .offline-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(194, 87, 27, 0.2);
          color: #C2571B;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(194, 87, 27, 0.3);
          margin-bottom: 24px;
        }

        .header-logo {
          width: 60px;
          height: 60px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }

        .setup-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 24px 0;
          letter-spacing: -0.5px;
        }

        .progress-container {
          margin-bottom: 16px;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: all 0.3s ease;
          position: relative;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step.current {
          transform: scale(1.05);
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(243, 238, 217, 0.15);
          border: 2px solid rgba(243, 238, 217, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: rgba(243, 238, 217, 0.25);
          border-color: rgba(243, 238, 217, 0.5);
        }

        .progress-step.current .step-circle {
          background: #C2571B;
          border-color: #C2571B;
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
        }

        .step-info {
          text-align: center;
        }

        .step-title {
          font-size: 12px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .step-subtitle {
          font-size: 10px;
          opacity: 0.8;
        }

        .step-connector {
          position: absolute;
          top: 20px;
          left: calc(100% + 8px);
          width: 24px;
          height: 2px;
          background: rgba(243, 238, 217, 0.2);
          z-index: -1;
        }

        .setup-content {
          flex: 1;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow-y: auto;
        }

        .step-content {
          max-width: 700px;
          margin: 0 auto;
        }

        /* Success Step */
        .success-step {
          text-align: center;
        }

        .success-animation {
          position: relative;
          margin-bottom: 24px;
        }

        .success-circle {
          color: #3E5C49;
          animation: bounce 0.6s ease-out;
        }

        .success-sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          color: #C2571B;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 20%;
          right: 15%;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          bottom: 15%;
          left: 15%;
          animation-delay: 1s;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -20px, 0); }
          70% { transform: translate3d(0, -10px, 0); }
          90% { transform: translate3d(0, -3px, 0); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .step-title {
          font-size: 24px;
          font-weight: 700;
          color: #3E5C49;
          margin: 0 0 12px 0;
          letter-spacing: -0.3px;
        }

        .step-description {
          font-size: 16px;
          color: #4A4A4A;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .institution-card {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.3);
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          background: rgba(62, 92, 73, 0.1);
          border-bottom: 1px solid rgba(243, 238, 217, 0.3);
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0;
        }

        .card-content {
          padding: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(243, 238, 217, 0.3);
        }

        .info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .info-row.highlight {
          background: rgba(62, 92, 73, 0.05);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(62, 92, 73, 0.2);
          border-bottom: 1px solid rgba(62, 92, 73, 0.2);
        }

        .info-label {
          font-weight: 600;
          color: #4A4A4A;
          font-size: 14px;
        }

        .info-value {
          font-weight: 600;
          color: #3E5C49;
          font-size: 14px;
        }

        .code-value {
          font-family: 'Monaco', 'Consolas', monospace;
          background: #3E5C49;
          color: #F3EED9;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          letter-spacing: 1px;
        }

        .features-preview h3 {
          font-size: 16px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 12px 0;
          text-align: left;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 8px;
          color: #3E5C49;
          font-weight: 500;
          font-size: 14px;
        }

        /* Share Step */
        .share-step {
          text-align: center;
        }

        .share-header {
          margin-bottom: 24px;
        }

        .share-icon {
          color: #C2571B;
          margin-bottom: 16px;
        }

        .code-display {
          margin-bottom: 32px;
        }

        .code-container {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 16px;
          padding: 24px;
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }

        .code-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
        }

        .code-label {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .code-value-large {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(243, 238, 217, 0.2);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          font-size: 14px;
        }

        .copy-button:hover {
          background: rgba(243, 238, 217, 0.3);
          transform: translateY(-1px);
        }

        .copy-button.copied {
          background: rgba(194, 87, 27, 0.8);
          border-color: rgba(194, 87, 27, 0.8);
          color: #F3EED9;
        }

        .sharing-options {
          margin-bottom: 32px;
        }

        .sharing-options h3 {
          font-size: 16px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 16px 0;
        }

        .sharing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .sharing-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #3E5C49;
          font-weight: 600;
        }

        .sharing-option:hover {
          background: rgba(62, 92, 73, 0.1);
          border-color: rgba(62, 92, 73, 0.2);
        }

        .option-icon {
          width: 36px;
          height: 36px;
          background: #C2571B;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .option-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .option-title {
          font-size: 14px;
          font-weight: 600;
        }

        .option-description {
          font-size: 12px;
          color: #4A4A4A;
        }

        .instructions-card {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.3);
          border-radius: 12px;
          padding: 20px;
          color: #3E5C49;
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        .instructions-card h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .instructions-list {
          margin: 0 0 16px 0;
          padding-left: 20px;
          list-style-type: decimal;
        }

        .instructions-list li {
          margin-bottom: 6px;
          font-size: 13px;
          line-height: 1.4;
        }

        .instructions-list code {
          background: #3E5C49;
          color: #F3EED9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 12px;
        }

        .offline-note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(194, 87, 27, 0.1);
          border: 1px solid rgba(194, 87, 27, 0.2);
          color: #C2571B;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Ready Step */
        .ready-step {
          text-align: center;
        }

        .ready-animation {
          margin-bottom: 24px;
        }

        .ready-icon {
          color: #C2571B;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .quick-actions {
          margin-bottom: 24px;
        }

        .quick-actions h3 {
          font-size: 16px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 16px 0;
          text-align: left;
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
        }

        .action-number {
          width: 32px;
          height: 32px;
          background: #C2571B;
          color: #F3EED9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .action-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .action-title {
          font-weight: 600;
          color: #3E5C49;
          font-size: 14px;
        }

        .action-description {
          font-size: 12px;
          color: #4A4A4A;
        }

        .offline-advantages h4 {
          font-size: 14px;
          font-weight: 600;
          color: #3E5C49;
          margin: 0 0 12px 0;
          text-align: left;
        }

        .advantages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        .advantage-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(194, 87, 27, 0.1);
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 8px;
          color: #C2571B;
          font-weight: 500;
          font-size: 13px;
        }

        /* Navigation */
        .setup-navigation {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 0 20px 20px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .nav-button.primary {
          background: #C2571B;
          color: #F3EED9;
        }

        .nav-button.primary:hover:not(:disabled) {
          background: #A8481A;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
        }

        .nav-button.secondary {
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }

        .nav-button.secondary:hover:not(:disabled) {
          background: rgba(243, 238, 217, 0.2);
          border-color: rgba(243, 238, 217, 0.5);
        }

        .nav-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .setup-container {
            padding: 16px;
          }

          .progress-steps {
            gap: 20px;
          }

          .step-connector {
            width: 16px;
            left: calc(100% + 4px);
          }

          .setup-content {
            padding: 24px 16px;
          }

          .features-grid,
          .sharing-grid,
          .advantages-grid {
            grid-template-columns: 1fr;
          }

          .setup-navigation {
            flex-direction: column-reverse;
            padding: 0 16px 16px;
          }

          .code-value-large {
            font-size: 24px;
            letter-spacing: 2px;
          }

          .step-title {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .progress-steps {
            flex-direction: column;
            gap: 16px;
          }

          .step-connector {
            display: none;
          }

          .setup-title {
            font-size: 24px;
          }

          .code-value-large {
            font-size: 20px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </div>
  );
};