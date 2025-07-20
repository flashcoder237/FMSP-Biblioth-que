"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionSetup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/renderer/components/InstitutionSetup.tsx
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const InstitutionSetup = ({ institutionCode, institution, onComplete }) => {
    const [currentStep, setCurrentStep] = (0, react_1.useState)(1);
    const [copied, setCopied] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(institutionCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
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
        }
        else {
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
            icon: lucide_react_1.CheckCircle
        },
        {
            number: 2,
            title: "Partagez le code",
            subtitle: "Invitez vos utilisateurs",
            icon: lucide_react_1.Users
        },
        {
            number: 3,
            title: "Prêt à commencer",
            subtitle: "Accédez à votre bibliothèque",
            icon: lucide_react_1.BookOpen
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "institution-setup", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setup-background", children: [(0, jsx_runtime_1.jsx)("div", { className: "background-pattern" }), (0, jsx_runtime_1.jsxs)("div", { className: "floating-elements", children: [(0, jsx_runtime_1.jsx)("div", { className: "floating-icon", children: "\uD83D\uDCDA" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-icon", children: "\uD83C\uDF93" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-icon", children: "\uD83D\uDC65" }), (0, jsx_runtime_1.jsx)("div", { className: "floating-icon", children: "\uD83D\uDD11" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "setup-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setup-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-logo", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h1", { className: "setup-title", children: "Configuration de votre \u00E9tablissement" }), (0, jsx_runtime_1.jsx)("div", { className: "progress-container", children: (0, jsx_runtime_1.jsx)("div", { className: "progress-steps", children: steps.map((step, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "step-circle", children: (0, jsx_runtime_1.jsx)(step.icon, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "step-info", children: [(0, jsx_runtime_1.jsx)("span", { className: "step-title", children: step.title }), (0, jsx_runtime_1.jsx)("span", { className: "step-subtitle", children: step.subtitle })] }), index < steps.length - 1 && (0, jsx_runtime_1.jsx)("div", { className: "step-connector" })] }, step.number))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "setup-content", children: [currentStep === 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "step-content success-step", children: [(0, jsx_runtime_1.jsxs)("div", { className: "success-animation", children: [(0, jsx_runtime_1.jsx)("div", { className: "success-circle", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 64 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "success-sparkles", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "sparkle sparkle-1" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "sparkle sparkle-2" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "sparkle sparkle-3" })] })] }), (0, jsx_runtime_1.jsx)("h2", { className: "step-title", children: "F\u00E9licitations ! \uD83C\uDF89" }), (0, jsx_runtime_1.jsxs)("p", { className: "step-description", children: ["Votre \u00E9tablissement ", (0, jsx_runtime_1.jsx)("strong", { children: institution?.name }), " a \u00E9t\u00E9 cr\u00E9\u00E9 avec succ\u00E8s. Vous \u00EAtes maintenant l'administrateur principal et pouvez commencer \u00E0 g\u00E9rer votre biblioth\u00E8que."] }), (0, jsx_runtime_1.jsxs)("div", { className: "institution-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Informations de l'\u00E9tablissement" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "info-label", children: "Nom:" }), (0, jsx_runtime_1.jsx)("span", { className: "info-value", children: institution?.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "info-label", children: "Type:" }), (0, jsx_runtime_1.jsxs)("span", { className: "info-value", children: [institution?.type === 'school' && '🏫 École/Lycée', institution?.type === 'university' && '🎓 Université', institution?.type === 'library' && '📚 Bibliothèque', institution?.type === 'other' && '🏢 Autre'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row", children: [(0, jsx_runtime_1.jsx)("span", { className: "info-label", children: "Localisation:" }), (0, jsx_runtime_1.jsxs)("span", { className: "info-value", children: [institution?.city, ", ", institution?.country] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-row highlight", children: [(0, jsx_runtime_1.jsx)("span", { className: "info-label", children: "Code d'acc\u00E8s:" }), (0, jsx_runtime_1.jsx)("span", { className: "info-value code-value", children: institutionCode })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "features-preview", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Ce que vous pouvez faire maintenant :" }), (0, jsx_runtime_1.jsxs)("div", { className: "features-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "G\u00E9rer vos livres" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Inviter des utilisateurs" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Contr\u00F4ler les acc\u00E8s" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "feature-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Synchroniser en ligne" })] })] })] })] })), currentStep === 2 && ((0, jsx_runtime_1.jsxs)("div", { className: "step-content share-step", children: [(0, jsx_runtime_1.jsxs)("div", { className: "share-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "share-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Key, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h2", { className: "step-title", children: "Partagez votre code d'\u00E9tablissement" }), (0, jsx_runtime_1.jsx)("p", { className: "step-description", children: "Utilisez ce code unique pour permettre \u00E0 vos utilisateurs de rejoindre votre \u00E9tablissement. Gardez-le confidentiel et ne le partagez qu'avec les personnes autoris\u00E9es." })] }), (0, jsx_runtime_1.jsx)("div", { className: "code-display", children: (0, jsx_runtime_1.jsxs)("div", { className: "code-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "code-label", children: "Code d'\u00E9tablissement" }), (0, jsx_runtime_1.jsx)("div", { className: "code-value-large", children: institutionCode }), (0, jsx_runtime_1.jsxs)("button", { className: `copy-button ${copied ? 'copied' : ''}`, onClick: handleCopyCode, children: [copied ? (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 18 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { size: 18 }), (0, jsx_runtime_1.jsx)("span", { children: copied ? 'Copié !' : 'Copier' })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "sharing-options", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Options de partage" }), (0, jsx_runtime_1.jsxs)("div", { className: "sharing-grid", children: [(0, jsx_runtime_1.jsxs)("button", { className: "sharing-option", onClick: handleDownloadInfo, children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "option-title", children: "T\u00E9l\u00E9charger les infos" }), (0, jsx_runtime_1.jsx)("span", { className: "option-description", children: "Fichier avec toutes les informations" })] })] }), (0, jsx_runtime_1.jsxs)("button", { className: "sharing-option", onClick: sendInvitation, children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "option-title", children: "Envoyer par email" }), (0, jsx_runtime_1.jsx)("span", { className: "option-description", children: "Invitation pr\u00E9-r\u00E9dig\u00E9e" })] })] }), (0, jsx_runtime_1.jsxs)("button", { className: "sharing-option", onClick: generateQRCode, children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.QrCode, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "option-title", children: "G\u00E9n\u00E9rer QR Code" }), (0, jsx_runtime_1.jsx)("span", { className: "option-description", children: "Pour un partage rapide" })] })] }), (0, jsx_runtime_1.jsxs)("button", { className: "sharing-option", onClick: () => window.print(), children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "option-title", children: "Imprimer" }), (0, jsx_runtime_1.jsx)("span", { className: "option-description", children: "Affichage physique" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "instructions-card", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Instructions pour vos utilisateurs :" }), (0, jsx_runtime_1.jsxs)("ol", { className: "instructions-list", children: [(0, jsx_runtime_1.jsx)("li", { children: "T\u00E9l\u00E9charger l'application Biblioth\u00E8que Cloud" }), (0, jsx_runtime_1.jsx)("li", { children: "Choisir \"Inscription\" sur l'\u00E9cran de connexion" }), (0, jsx_runtime_1.jsxs)("li", { children: ["Entrer le code d'\u00E9tablissement : ", (0, jsx_runtime_1.jsx)("code", { children: institutionCode })] }), (0, jsx_runtime_1.jsx)("li", { children: "Remplir leurs informations personnelles" }), (0, jsx_runtime_1.jsx)("li", { children: "Attendre la validation de leur compte par un administrateur" })] })] })] })), currentStep === 3 && ((0, jsx_runtime_1.jsxs)("div", { className: "step-content ready-step", children: [(0, jsx_runtime_1.jsx)("div", { className: "ready-animation", children: (0, jsx_runtime_1.jsx)("div", { className: "ready-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 64 }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "step-title", children: "Tout est pr\u00EAt ! \uD83D\uDE80" }), (0, jsx_runtime_1.jsx)("p", { className: "step-description", children: "Votre \u00E9tablissement est configur\u00E9 et pr\u00EAt \u00E0 \u00EAtre utilis\u00E9. Vous allez maintenant \u00EAtre connect\u00E9 en tant qu'administrateur principal." }), (0, jsx_runtime_1.jsxs)("div", { className: "quick-actions", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Prochaines \u00E9tapes recommand\u00E9es :" }), (0, jsx_runtime_1.jsxs)("div", { className: "actions-list", children: [(0, jsx_runtime_1.jsxs)("div", { className: "action-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-number", children: "1" }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "action-title", children: "Ajoutez vos premiers livres" }), (0, jsx_runtime_1.jsx)("span", { className: "action-description", children: "Commencez \u00E0 construire votre catalogue" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "action-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-number", children: "2" }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "action-title", children: "Invitez vos biblioth\u00E9caires" }), (0, jsx_runtime_1.jsx)("span", { className: "action-description", children: "Donnez-leur un acc\u00E8s administrateur" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "action-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-number", children: "3" }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "action-title", children: "Configurez vos param\u00E8tres" }), (0, jsx_runtime_1.jsx)("span", { className: "action-description", children: "Personnalisez selon vos besoins" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "action-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "action-number", children: "4" }), (0, jsx_runtime_1.jsxs)("div", { className: "action-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "action-title", children: "Partagez le code d'acc\u00E8s" }), (0, jsx_runtime_1.jsx)("span", { className: "action-description", children: "Permettez aux utilisateurs de s'inscrire" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "support-info", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Besoin d'aide ?" }), (0, jsx_runtime_1.jsx)("p", { children: "Consultez notre documentation en ligne ou contactez notre support technique pour vous accompagner dans la prise en main de votre nouvelle biblioth\u00E8que." })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "setup-navigation", children: [currentStep > 1 && ((0, jsx_runtime_1.jsx)("button", { className: "nav-button secondary", onClick: previousStep, disabled: isLoading, children: "Pr\u00E9c\u00E9dent" })), (0, jsx_runtime_1.jsx)("button", { className: "nav-button primary", onClick: nextStep, disabled: isLoading, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), "Chargement..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [currentStep === 3 ? 'Accéder à ma bibliothèque' : 'Continuer', (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 18 })] })) })] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
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
      ` })] }));
};
exports.InstitutionSetup = InstitutionSetup;
