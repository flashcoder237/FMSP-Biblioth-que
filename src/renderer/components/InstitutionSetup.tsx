// src/renderer/components/InstitutionSetup.tsx
import React, { useState } from 'react';
import { 
  Building,
  Key,
  Users,
  CheckCircle,
  Copy,
  Download,
  Mail,
  Share,
  QrCode,
  Printer,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  BookOpen,
  User,
  Zap
} from 'lucide-react';
import { Institution } from '../../services/SupabaseService';

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
      console.error('Erreur lors de la copie:', error);
    }
  };

  const handleDownloadInfo = () => {
    const content = `
INFORMATIONS DE VOTRE ÉTABLISSEMENT
=====================================

Nom: ${institution?.name || 'Non spécifié'}
Code d'accès: ${institutionCode}
Type: ${institution?.type || 'Non spécifié'}
Ville: ${institution?.city || 'Non spécifié'}
Pays: ${institution?.country || 'Non spécifié'}

INSTRUCTIONS POUR VOS UTILISATEURS:
====================================

1. Téléchargez l'application Bibliothèque Cloud
2. Choisissez "Inscription" 
3. Entrez le code d'établissement: ${institutionCode}
4. Remplissez vos informations personnelles
5. Attendez la validation de votre compte

LIEN DE TÉLÉCHARGEMENT:
======================
[Insérez ici le lien de téléchargement de votre application]

Date de création: ${new Date().toLocaleDateString('fr-FR')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${institution?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'institution'}_info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateQRCode = () => {
    // Simuler la génération d'un QR Code
    // En production, vous utiliseriez une vraie bibliothèque QR
    const qrContent = `Institution: ${institution?.name}\nCode: ${institutionCode}`;
    alert(`QR Code généré pour:\n${qrContent}`);
  };

  const sendInvitation = () => {
    const subject = encodeURIComponent(`Invitation - ${institution?.name}`);
    const body = encodeURIComponent(`
Bonjour,

Vous êtes invité(e) à rejoindre ${institution?.name} sur l'application Bibliothèque Cloud.

Code d'établissement: ${institutionCode}

Instructions:
1. Téléchargez l'application Bibliothèque Cloud
2. Créez votre compte en utilisant le code ci-dessus
3. Attendez la validation de votre accès

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
      title: "Félicitations !",
      subtitle: "Votre établissement a été créé",
      icon: CheckCircle
    },
    {
      number: 2,
      title: "Partagez le code",
      subtitle: "Invitez vos utilisateurs",
      icon: Users
    },
    {
      number: 3,
      title: "Prêt à commencer",
      subtitle: "Accédez à votre bibliothèque",
      icon: BookOpen
    }
  ];

  return (
    <div className="institution-setup">
      <div className="setup-background">
        <div className="background-pattern"></div>
        <div className="floating-elements">
          <div className="floating-icon">📚</div>
          <div className="floating-icon">🎓</div>
          <div className="floating-icon">👥</div>
          <div className="floating-icon">🔑</div>
        </div>
      </div>

      <div className="setup-container">
        <div className="setup-header">
          <div className="header-logo">
            <Building size={48} />
          </div>
          <h1 className="setup-title">Configuration de votre établissement</h1>
          
          {/* Progress indicator */}
          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div key={step.number} className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}>
                  <div className="step-circle">
                    <step.icon size={20} />
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

        <div className="setup-content">
          {/* Step 1: Success */}
          {currentStep === 1 && (
            <div className="step-content success-step">
              <div className="success-animation">
                <div className="success-circle">
                  <CheckCircle size={64} />
                </div>
                <div className="success-sparkles">
                  <Sparkles className="sparkle sparkle-1" />
                  <Sparkles className="sparkle sparkle-2" />
                  <Sparkles className="sparkle sparkle-3" />
                </div>
              </div>
              
              <h2 className="step-title">Félicitations ! 🎉</h2>
              <p className="step-description">
                Votre établissement <strong>{institution?.name}</strong> a été créé avec succès.
                Vous êtes maintenant l'administrateur principal et pouvez commencer à gérer votre bibliothèque.
              </p>

              <div className="institution-card">
                <div className="card-header">
                  <Building size={24} />
                  <h3>Informations de l'établissement</h3>
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
                    <span className="info-label">Localisation:</span>
                    <span className="info-value">{institution?.city}, {institution?.country}</span>
                  </div>
                  <div className="info-row highlight">
                    <span className="info-label">Code d'accès:</span>
                    <span className="info-value code-value">{institutionCode}</span>
                  </div>
                </div>
              </div>

              <div className="features-preview">
                <h3>Ce que vous pouvez faire maintenant :</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <BookOpen size={20} />
                    <span>Gérer vos livres</span>
                  </div>
                  <div className="feature-item">
                    <Users size={20} />
                    <span>Inviter des utilisateurs</span>
                  </div>
                  <div className="feature-item">
                    <Shield size={20} />
                    <span>Contrôler les accès</span>
                  </div>
                  <div className="feature-item">
                    <Globe size={20} />
                    <span>Synchroniser en ligne</span>
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
                  <Key size={48} />
                </div>
                <h2 className="step-title">Partagez votre code d'établissement</h2>
                <p className="step-description">
                  Utilisez ce code unique pour permettre à vos utilisateurs de rejoindre votre établissement.
                  Gardez-le confidentiel et ne le partagez qu'avec les personnes autorisées.
                </p>
              </div>

              <div className="code-display">
                <div className="code-container">
                  <div className="code-label">Code d'établissement</div>
                  <div className="code-value-large">{institutionCode}</div>
                  <button 
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    onClick={handleCopyCode}
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              <div className="sharing-options">
                <h3>Options de partage</h3>
                <div className="sharing-grid">
                  <button className="sharing-option" onClick={handleDownloadInfo}>
                    <div className="option-icon">
                      <Download size={24} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Télécharger les infos</span>
                      <span className="option-description">Fichier avec toutes les informations</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={sendInvitation}>
                    <div className="option-icon">
                      <Mail size={24} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Envoyer par email</span>
                      <span className="option-description">Invitation pré-rédigée</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={generateQRCode}>
                    <div className="option-icon">
                      <QrCode size={24} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Générer QR Code</span>
                      <span className="option-description">Pour un partage rapide</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={() => window.print()}>
                    <div className="option-icon">
                      <Printer size={24} />
                    </div>
                    <div className="option-content">
                      <span className="option-title">Imprimer</span>
                      <span className="option-description">Affichage physique</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="instructions-card">
                <h4>Instructions pour vos utilisateurs :</h4>
                <ol className="instructions-list">
                  <li>Télécharger l'application Bibliothèque Cloud</li>
                  <li>Choisir "Inscription" sur l'écran de connexion</li>
                  <li>Entrer le code d'établissement : <code>{institutionCode}</code></li>
                  <li>Remplir leurs informations personnelles</li>
                  <li>Attendre la validation de leur compte par un administrateur</li>
                </ol>
              </div>
            </div>
          )}

          {/* Step 3: Ready to Start */}
          {currentStep === 3 && (
            <div className="step-content ready-step">
              <div className="ready-animation">
                <div className="ready-icon">
                  <Zap size={64} />
                </div>
              </div>

              <h2 className="step-title">Tout est prêt ! 🚀</h2>
              <p className="step-description">
                Votre établissement est configuré et prêt à être utilisé. 
                Vous allez maintenant être connecté en tant qu'administrateur principal.
              </p>

              <div className="quick-actions">
                <h3>Prochaines étapes recommandées :</h3>
                <div className="actions-list">
                  <div className="action-item">
                    <div className="action-number">1</div>
                    <div className="action-content">
                      <span className="action-title">Ajoutez vos premiers livres</span>
                      <span className="action-description">Commencez à construire votre catalogue</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">2</div>
                    <div className="action-content">
                      <span className="action-title">Invitez vos bibliothécaires</span>
                      <span className="action-description">Donnez-leur un accès administrateur</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">3</div>
                    <div className="action-content">
                      <span className="action-title">Configurez vos paramètres</span>
                      <span className="action-description">Personnalisez selon vos besoins</span>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-number">4</div>
                    <div className="action-content">
                      <span className="action-title">Partagez le code d'accès</span>
                      <span className="action-description">Permettez aux utilisateurs de s'inscrire</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="support-info">
                <h4>Besoin d'aide ?</h4>
                <p>
                  Consultez notre documentation en ligne ou contactez notre support technique 
                  pour vous accompagner dans la prise en main de votre nouvelle bibliothèque.
                </p>
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
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .institution-setup {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          position: relative;
          overflow: hidden;
        }

        .setup-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .background-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          font-size: 24px;
          opacity: 0.2;
          animation: float 8s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .floating-icon:nth-child(4) {
          top: 40%;
          right: 30%;
          animation-delay: 6s;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .setup-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 40px;
          color: #F3EED9;
        }

        .header-logo {
          width: 80px;
          height: 80px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          border: 1px solid rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
        }

        .setup-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 32px 0;
          letter-spacing: -0.5px;
        }

        .progress-container {
          margin-bottom: 20px;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          position: relative;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          opacity: 0.5;
          transition: all 0.3s ease;
          position: relative;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step.current {
          transform: scale(1.1);
        }

        .step-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(243, 238, 217, 0.15);
          border: 2px solid rgba(243, 238, 217, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: rgba(243, 238, 217, 0.3);
          border-color: rgba(243, 238, 217, 0.6);
        }

        .progress-step.current .step-circle {
          background: #C2571B;
          border-color: #C2571B;
          color: #F3EED9;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .step-info {
          text-align: center;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .step-subtitle {
          font-size: 12px;
          opacity: 0.8;
        }

        .step-connector {
          position: absolute;
          top: 28px;
          left: 100%;
          width: 40px;
          height: 2px;
          background: rgba(243, 238, 217, 0.2);
          z-index: -1;
        }

        .setup-content {
          flex: 1;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 32px;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow-y: auto;
        }

        .step-content {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Success Step */
        .success-step {
          text-align: center;
        }

        .success-animation {
          position: relative;
          margin-bottom: 32px;
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
          40%, 43% { transform: translate3d(0, -30px, 0); }
          70% { transform: translate3d(0, -15px, 0); }
          90% { transform: translate3d(0, -4px, 0); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .step-title {
          font-size: 28px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .step-description {
          font-size: 16px;
          color: #6E6E6E;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .institution-card {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: rgba(62, 92, 73, 0.1);
          border-bottom: 1px solid #E5DCC2;
        }

        .card-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }

        .card-content {
          padding: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.5);
        }

        .info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .info-row.highlight {
          background: rgba(62, 92, 73, 0.05);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(62, 92, 73, 0.2);
          border-bottom: 1px solid rgba(62, 92, 73, 0.2);
        }

        .info-label {
          font-weight: 600;
          color: #6E6E6E;
        }

        .info-value {
          font-weight: 600;
          color: #2E2E2E;
        }

        .code-value {
          font-family: 'Monaco', 'Consolas', monospace;
          background: #3E5C49;
          color: #F3EED9;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 16px;
          letter-spacing: 2px;
        }

        .features-preview h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          text-align: left;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          color: #3E5C49;
          font-weight: 500;
        }

        /* Share Step */
        .share-step {
          text-align: center;
        }

        .share-header {
          margin-bottom: 32px;
        }

        .share-icon {
          color: #C2571B;
          margin-bottom: 24px;
        }

        .code-display {
          margin-bottom: 40px;
        }

        .code-container {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 20px;
          padding: 32px;
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }

        .code-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
        }

        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .code-value-large {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: 8px;
          font-family: 'Monaco', 'Consolas', monospace;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(243, 238, 217, 0.2);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .copy-button:hover {
          background: rgba(243, 238, 217, 0.3);
          transform: translateY(-1px);
        }

        .copy-button.copied {
          background: rgba(194, 87, 27, 0.8);
          border-color: rgba(194, 87, 27, 0.8);
          color: #F3EED9;
          cursor: default;
          pointer-events: none;
        }

        .sharing-options {
          margin-bottom: 40px;
        }

        .sharing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .sharing-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 16px;
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
          width: 48px;
          height: 48px;
          background: #C2571B;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .option-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-title {
          font-size: 16px;
          font-weight: 700;
        }

        .option-description {
          font-size: 12px;
          color: #6E6E6E;
        }

        .instructions-card {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
          color: #3E5C49;
          font-weight: 600;
          text-align: left;
          max-width: 600px;
          margin: 0 auto;
        }

        .instructions-list {
          margin: 0;
          padding-left: 20px;
          list-style-type: decimal;
        }

        .instructions-list li {
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
        }

        .setup-navigation {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 0 40px 40px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
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
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .nav-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }

        .nav-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }

        .nav-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(243, 238, 217, 0.3);
          border-top: 3px solid #C2571B;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
