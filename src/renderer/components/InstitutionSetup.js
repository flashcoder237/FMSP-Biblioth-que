"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionSetup = void 0;
// src/renderer/components/InstitutionSetup.tsx
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var InstitutionSetup = function (_a) {
    var institutionCode = _a.institutionCode, institution = _a.institution, onComplete = _a.onComplete;
    var _b = (0, react_1.useState)(1), currentStep = _b[0], setCurrentStep = _b[1];
    var _c = (0, react_1.useState)(false), copied = _c[0], setCopied = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var handleCopyCode = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(institutionCode)];
                case 1:
                    _a.sent();
                    setCopied(true);
                    setTimeout(function () { return setCopied(false); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erreur lors de la copie:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDownloadInfo = function () {
        var _a;
        var content = "\nINFORMATIONS DE VOTRE \u00C9TABLISSEMENT\n=====================================\n\nNom: ".concat((institution === null || institution === void 0 ? void 0 : institution.name) || 'Non spécifié', "\nCode d'acc\u00E8s: ").concat(institutionCode, "\nType: ").concat((institution === null || institution === void 0 ? void 0 : institution.type) || 'Non spécifié', "\nVille: ").concat((institution === null || institution === void 0 ? void 0 : institution.city) || 'Non spécifié', "\nPays: ").concat((institution === null || institution === void 0 ? void 0 : institution.country) || 'Non spécifié', "\n\nINSTRUCTIONS POUR VOS UTILISATEURS:\n====================================\n\n1. T\u00E9l\u00E9chargez l'application Biblioth\u00E8que Cloud\n2. Choisissez \"Inscription\" \n3. Entrez le code d'\u00E9tablissement: ").concat(institutionCode, "\n4. Remplissez vos informations personnelles\n5. Attendez la validation de votre compte\n\nLIEN DE T\u00C9L\u00C9CHARGEMENT:\n======================\n[Ins\u00E9rez ici le lien de t\u00E9l\u00E9chargement de votre application]\n\nDate de cr\u00E9ation: ").concat(new Date().toLocaleDateString('fr-FR'), "\n    ").trim();
        var blob = new Blob([content], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(((_a = institution === null || institution === void 0 ? void 0 : institution.name) === null || _a === void 0 ? void 0 : _a.replace(/[^a-zA-Z0-9]/g, '_')) || 'institution', "_info.txt");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    var generateQRCode = function () {
        // Simuler la génération d'un QR Code
        // En production, vous utiliseriez une vraie bibliothèque QR
        var qrContent = "Institution: ".concat(institution === null || institution === void 0 ? void 0 : institution.name, "\nCode: ").concat(institutionCode);
        alert("QR Code g\u00E9n\u00E9r\u00E9 pour:\n".concat(qrContent));
    };
    var sendInvitation = function () {
        var subject = encodeURIComponent("Invitation - ".concat(institution === null || institution === void 0 ? void 0 : institution.name));
        var body = encodeURIComponent("\nBonjour,\n\nVous \u00EAtes invit\u00E9(e) \u00E0 rejoindre ".concat(institution === null || institution === void 0 ? void 0 : institution.name, " sur l'application Biblioth\u00E8que Cloud.\n\nCode d'\u00E9tablissement: ").concat(institutionCode, "\n\nInstructions:\n1. T\u00E9l\u00E9chargez l'application Biblioth\u00E8que Cloud\n2. Cr\u00E9ez votre compte en utilisant le code ci-dessus\n3. Attendez la validation de votre acc\u00E8s\n\nCordialement,\nL'\u00E9quipe de ").concat(institution === null || institution === void 0 ? void 0 : institution.name, "\n    "));
        window.open("mailto:?subject=".concat(subject, "&body=").concat(body));
    };
    var nextStep = function () {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
        else {
            onComplete();
        }
    };
    var previousStep = function () {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    var steps = [
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
    return (<div className="institution-setup">
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
            <lucide_react_1.Building size={48}/>
          </div>
          <h1 className="setup-title">Configuration de votre établissement</h1>
          
          {/* Progress indicator */}
          <div className="progress-container">
            <div className="progress-steps">
              {steps.map(function (step, index) { return (<div key={step.number} className={"progress-step ".concat(currentStep >= step.number ? 'active' : '', " ").concat(currentStep === step.number ? 'current' : '')}>
                  <div className="step-circle">
                    <step.icon size={20}/>
                  </div>
                  <div className="step-info">
                    <span className="step-title">{step.title}</span>
                    <span className="step-subtitle">{step.subtitle}</span>
                  </div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>); })}
            </div>
          </div>
        </div>

        <div className="setup-content">
          {/* Step 1: Success */}
          {currentStep === 1 && (<div className="step-content success-step">
              <div className="success-animation">
                <div className="success-circle">
                  <lucide_react_1.CheckCircle size={64}/>
                </div>
                <div className="success-sparkles">
                  <lucide_react_1.Sparkles className="sparkle sparkle-1"/>
                  <lucide_react_1.Sparkles className="sparkle sparkle-2"/>
                  <lucide_react_1.Sparkles className="sparkle sparkle-3"/>
                </div>
              </div>
              
              <h2 className="step-title">Félicitations ! 🎉</h2>
              <p className="step-description">
                Votre établissement <strong>{institution === null || institution === void 0 ? void 0 : institution.name}</strong> a été créé avec succès.
                Vous êtes maintenant l'administrateur principal et pouvez commencer à gérer votre bibliothèque.
              </p>

              <div className="institution-card">
                <div className="card-header">
                  <lucide_react_1.Building size={24}/>
                  <h3>Informations de l'établissement</h3>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Nom:</span>
                    <span className="info-value">{institution === null || institution === void 0 ? void 0 : institution.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">
                      {(institution === null || institution === void 0 ? void 0 : institution.type) === 'school' && '🏫 École/Lycée'}
                      {(institution === null || institution === void 0 ? void 0 : institution.type) === 'university' && '🎓 Université'}
                      {(institution === null || institution === void 0 ? void 0 : institution.type) === 'library' && '📚 Bibliothèque'}
                      {(institution === null || institution === void 0 ? void 0 : institution.type) === 'other' && '🏢 Autre'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Localisation:</span>
                    <span className="info-value">{institution === null || institution === void 0 ? void 0 : institution.city}, {institution === null || institution === void 0 ? void 0 : institution.country}</span>
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
                    <lucide_react_1.BookOpen size={20}/>
                    <span>Gérer vos livres</span>
                  </div>
                  <div className="feature-item">
                    <lucide_react_1.Users size={20}/>
                    <span>Inviter des utilisateurs</span>
                  </div>
                  <div className="feature-item">
                    <lucide_react_1.Shield size={20}/>
                    <span>Contrôler les accès</span>
                  </div>
                  <div className="feature-item">
                    <lucide_react_1.Globe size={20}/>
                    <span>Synchroniser en ligne</span>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Step 2: Share Code */}
          {currentStep === 2 && (<div className="step-content share-step">
              <div className="share-header">
                <div className="share-icon">
                  <lucide_react_1.Key size={48}/>
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
                  <button className={"copy-button ".concat(copied ? 'copied' : '')} onClick={handleCopyCode}>
                    {copied ? <lucide_react_1.CheckCircle size={18}/> : <lucide_react_1.Copy size={18}/>}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              <div className="sharing-options">
                <h3>Options de partage</h3>
                <div className="sharing-grid">
                  <button className="sharing-option" onClick={handleDownloadInfo}>
                    <div className="option-icon">
                      <lucide_react_1.Download size={24}/>
                    </div>
                    <div className="option-content">
                      <span className="option-title">Télécharger les infos</span>
                      <span className="option-description">Fichier avec toutes les informations</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={sendInvitation}>
                    <div className="option-icon">
                      <lucide_react_1.Mail size={24}/>
                    </div>
                    <div className="option-content">
                      <span className="option-title">Envoyer par email</span>
                      <span className="option-description">Invitation pré-rédigée</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={generateQRCode}>
                    <div className="option-icon">
                      <lucide_react_1.QrCode size={24}/>
                    </div>
                    <div className="option-content">
                      <span className="option-title">Générer QR Code</span>
                      <span className="option-description">Pour un partage rapide</span>
                    </div>
                  </button>

                  <button className="sharing-option" onClick={function () { return window.print(); }}>
                    <div className="option-icon">
                      <lucide_react_1.Printer size={24}/>
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
            </div>)}

          {/* Step 3: Ready to Start */}
          {currentStep === 3 && (<div className="step-content ready-step">
              <div className="ready-animation">
                <div className="ready-icon">
                  <lucide_react_1.Zap size={64}/>
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
            </div>)}
        </div>

        {/* Navigation */}
        <div className="setup-navigation">
          {currentStep > 1 && (<button className="nav-button secondary" onClick={previousStep} disabled={isLoading}>
              Précédent
            </button>)}
          
          <button className="nav-button primary" onClick={nextStep} disabled={isLoading}>
            {isLoading ? (<>
                <div className="loading-spinner"></div>
                Chargement...
              </>) : (<>
                {currentStep === 3 ? 'Accéder à ma bibliothèque' : 'Continuer'}
                <lucide_react_1.ArrowRight size={18}/>
              </>)}
          </button>
        </div>
      </div>

      <style>{"\n        .institution-setup {\n          height: 100vh;\n          display: flex;\n          flex-direction: column;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          position: relative;\n          overflow: hidden;\n        }\n\n        .setup-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n\n        .background-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),\n            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);\n          animation: drift 25s ease-in-out infinite;\n        }\n\n        .floating-elements {\n          position: absolute;\n          inset: 0;\n          pointer-events: none;\n        }\n\n        .floating-icon {\n          position: absolute;\n          font-size: 24px;\n          opacity: 0.2;\n          animation: float 8s ease-in-out infinite;\n        }\n\n        .floating-icon:nth-child(1) {\n          top: 20%;\n          left: 10%;\n          animation-delay: 0s;\n        }\n\n        .floating-icon:nth-child(2) {\n          top: 60%;\n          right: 15%;\n          animation-delay: 2s;\n        }\n\n        .floating-icon:nth-child(3) {\n          bottom: 30%;\n          left: 20%;\n          animation-delay: 4s;\n        }\n\n        .floating-icon:nth-child(4) {\n          top: 40%;\n          right: 30%;\n          animation-delay: 6s;\n        }\n\n        @keyframes drift {\n          0%, 100% { transform: translate(0, 0) rotate(0deg); }\n          33% { transform: translate(30px, -30px) rotate(1deg); }\n          66% { transform: translate(-20px, 20px) rotate(-1deg); }\n        }\n\n        @keyframes float {\n          0%, 100% { transform: translateY(0px) rotate(0deg); }\n          50% { transform: translateY(-20px) rotate(5deg); }\n        }\n\n        .setup-container {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          max-width: 1000px;\n          margin: 0 auto;\n          padding: 40px;\n          position: relative;\n          z-index: 1;\n        }\n\n        .setup-header {\n          text-align: center;\n          margin-bottom: 40px;\n          color: #F3EED9;\n        }\n\n        .header-logo {\n          width: 80px;\n          height: 80px;\n          background: rgba(243, 238, 217, 0.15);\n          border-radius: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          margin: 0 auto 24px;\n          border: 1px solid rgba(243, 238, 217, 0.2);\n          backdrop-filter: blur(10px);\n        }\n\n        .setup-title {\n          font-size: 32px;\n          font-weight: 800;\n          margin: 0 0 32px 0;\n          letter-spacing: -0.5px;\n        }\n\n        .progress-container {\n          margin-bottom: 20px;\n        }\n\n        .progress-steps {\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          gap: 40px;\n          position: relative;\n        }\n\n        .progress-step {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          gap: 12px;\n          opacity: 0.5;\n          transition: all 0.3s ease;\n          position: relative;\n        }\n\n        .progress-step.active {\n          opacity: 1;\n        }\n\n        .progress-step.current {\n          transform: scale(1.1);\n        }\n\n        .step-circle {\n          width: 56px;\n          height: 56px;\n          border-radius: 50%;\n          background: rgba(243, 238, 217, 0.15);\n          border: 2px solid rgba(243, 238, 217, 0.3);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          transition: all 0.3s ease;\n        }\n\n        .progress-step.active .step-circle {\n          background: rgba(243, 238, 217, 0.3);\n          border-color: rgba(243, 238, 217, 0.6);\n        }\n\n        .progress-step.current .step-circle {\n          background: #C2571B;\n          border-color: #C2571B;\n          color: #F3EED9;\n          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);\n        }\n\n        .step-info {\n          text-align: center;\n        }\n\n        .step-title {\n          font-size: 14px;\n          font-weight: 600;\n          margin: 0 0 4px 0;\n        }\n\n        .step-subtitle {\n          font-size: 12px;\n          opacity: 0.8;\n        }\n\n        .step-connector {\n          position: absolute;\n          top: 28px;\n          left: 100%;\n          width: 40px;\n          height: 2px;\n          background: rgba(243, 238, 217, 0.2);\n          z-index: -1;\n        }\n\n        .setup-content {\n          flex: 1;\n          background: rgba(255, 255, 255, 0.95);\n          border-radius: 24px;\n          padding: 40px;\n          margin-bottom: 32px;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n          backdrop-filter: blur(20px);\n          overflow-y: auto;\n        }\n\n        .step-content {\n          max-width: 800px;\n          margin: 0 auto;\n        }\n\n        /* Success Step */\n        .success-step {\n          text-align: center;\n        }\n\n        .success-animation {\n          position: relative;\n          margin-bottom: 32px;\n        }\n\n        .success-circle {\n          color: #3E5C49;\n          animation: bounce 0.6s ease-out;\n        }\n\n        .success-sparkles {\n          position: absolute;\n          inset: 0;\n          pointer-events: none;\n        }\n\n        .sparkle {\n          position: absolute;\n          color: #C2571B;\n          animation: sparkle 2s ease-in-out infinite;\n        }\n\n        .sparkle-1 {\n          top: 10%;\n          left: 20%;\n          animation-delay: 0s;\n        }\n\n        .sparkle-2 {\n          top: 20%;\n          right: 15%;\n          animation-delay: 0.5s;\n        }\n\n        .sparkle-3 {\n          bottom: 15%;\n          left: 15%;\n          animation-delay: 1s;\n        }\n\n        @keyframes bounce {\n          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }\n          40%, 43% { transform: translate3d(0, -30px, 0); }\n          70% { transform: translate3d(0, -15px, 0); }\n          90% { transform: translate3d(0, -4px, 0); }\n        }\n\n        @keyframes sparkle {\n          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }\n          50% { opacity: 1; transform: scale(1) rotate(180deg); }\n        }\n\n        .step-title {\n          font-size: 28px;\n          font-weight: 800;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n          letter-spacing: -0.5px;\n        }\n\n        .step-description {\n          font-size: 16px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin-bottom: 32px;\n        }\n\n        .institution-card {\n          background: #F3EED9;\n          border: 1px solid #E5DCC2;\n          border-radius: 16px;\n          margin-bottom: 32px;\n          overflow: hidden;\n        }\n\n        .card-header {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 20px 24px;\n          background: rgba(62, 92, 73, 0.1);\n          border-bottom: 1px solid #E5DCC2;\n        }\n\n        .card-header h3 {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n        }\n\n        .card-content {\n          padding: 24px;\n        }\n\n        .info-row {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 16px;\n          padding-bottom: 16px;\n          border-bottom: 1px solid rgba(229, 220, 194, 0.5);\n        }\n\n        .info-row:last-child {\n          margin-bottom: 0;\n          padding-bottom: 0;\n          border-bottom: none;\n        }\n\n        .info-row.highlight {\n          background: rgba(62, 92, 73, 0.05);\n          padding: 16px;\n          border-radius: 12px;\n          border: 1px solid rgba(62, 92, 73, 0.2);\n          border-bottom: 1px solid rgba(62, 92, 73, 0.2);\n        }\n\n        .info-label {\n          font-weight: 600;\n          color: #6E6E6E;\n        }\n\n        .info-value {\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n\n        .code-value {\n          font-family: 'Monaco', 'Consolas', monospace;\n          background: #3E5C49;\n          color: #F3EED9;\n          padding: 8px 12px;\n          border-radius: 8px;\n          font-size: 16px;\n          letter-spacing: 2px;\n        }\n\n        .features-preview h3 {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n          text-align: left;\n        }\n\n        .features-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n          gap: 16px;\n        }\n\n        .feature-item {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px;\n          background: rgba(62, 92, 73, 0.05);\n          border: 1px solid rgba(62, 92, 73, 0.1);\n          border-radius: 12px;\n          color: #3E5C49;\n          font-weight: 500;\n        }\n\n        /* Share Step */\n        .share-step {\n          text-align: center;\n        }\n\n        .share-header {\n          margin-bottom: 32px;\n        }\n\n        .share-icon {\n          color: #C2571B;\n          margin-bottom: 24px;\n        }\n\n        .code-display {\n          margin-bottom: 40px;\n        }\n\n        .code-container {\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          border-radius: 20px;\n          padding: 32px;\n          color: #F3EED9;\n          position: relative;\n          overflow: hidden;\n        }\n\n        .code-container::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          right: 0;\n          width: 100px;\n          height: 100%;\n          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));\n          transform: skewX(-15deg);\n        }\n\n        .code-label {\n          font-size: 14px;\n          opacity: 0.9;\n          margin-bottom: 16px;\n          text-transform: uppercase;\n          letter-spacing: 1px;\n        }\n\n        .code-value-large {\n          font-size: 48px;\n          font-weight: 800;\n          letter-spacing: 8px;\n          font-family: 'Monaco', 'Consolas', monospace;\n          margin-bottom: 24px;\n          position: relative;\n          z-index: 1;\n        }\n\n        .copy-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          background: rgba(243, 238, 217, 0.2);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px 24px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          font-weight: 600;\n          margin: 0 auto;\n          position: relative;\n          z-index: 1;\n        }\n\n        .copy-button:hover {\n          background: rgba(243, 238, 217, 0.3);\n          transform: translateY(-1px);\n        }\n\n        .copy-button.copied {\n          background: rgba(194, 87, 27, 0.8);\n          border-color: rgba(194, 87, 27, 0.8);\n          color: #F3EED9;\n          cursor: default;\n          pointer-events: none;\n        }\n\n        .sharing-options {\n          margin-bottom: 40px;\n        }\n\n        .sharing-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n          gap: 24px;\n        }\n\n        .sharing-option {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          padding: 20px;\n          background: rgba(62, 92, 73, 0.05);\n          border: 1px solid rgba(62, 92, 73, 0.1);\n          border-radius: 16px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          color: #3E5C49;\n          font-weight: 600;\n        }\n\n        .sharing-option:hover {\n          background: rgba(62, 92, 73, 0.1);\n          border-color: rgba(62, 92, 73, 0.2);\n        }\n\n        .option-icon {\n          width: 48px;\n          height: 48px;\n          background: #C2571B;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n          flex-shrink: 0;\n        }\n\n        .option-content {\n          display: flex;\n          flex-direction: column;\n          gap: 4px;\n        }\n\n        .option-title {\n          font-size: 16px;\n          font-weight: 700;\n        }\n\n        .option-description {\n          font-size: 12px;\n          color: #6E6E6E;\n        }\n\n        .instructions-card {\n          background: #F3EED9;\n          border: 1px solid #E5DCC2;\n          border-radius: 16px;\n          padding: 24px;\n          color: #3E5C49;\n          font-weight: 600;\n          text-align: left;\n          max-width: 600px;\n          margin: 0 auto;\n        }\n\n        .instructions-list {\n          margin: 0;\n          padding-left: 20px;\n          list-style-type: decimal;\n        }\n\n        .instructions-list li {\n          margin-bottom: 8px;\n          font-weight: 500;\n          font-size: 14px;\n        }\n\n        .setup-navigation {\n          display: flex;\n          justify-content: flex-end;\n          gap: 16px;\n          padding: 0 40px 40px;\n        }\n\n        .nav-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 24px;\n          border-radius: 12px;\n          font-weight: 700;\n          font-size: 14px;\n          cursor: pointer;\n          border: none;\n          transition: all 0.2s ease;\n        }\n\n        .nav-button.primary {\n          background: #C2571B;\n          color: #F3EED9;\n        }\n\n        .nav-button.primary:hover:not(:disabled) {\n          background: #A8481A;\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);\n        }\n\n        .nav-button.secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 1px solid #E5DCC2;\n        }\n\n        .nav-button.secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-1px);\n        }\n\n        .nav-button:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          transform: none;\n          box-shadow: none;\n        }\n\n        .loading-spinner {\n          width: 24px;\n          height: 24px;\n          border: 3px solid rgba(243, 238, 217, 0.3);\n          border-top: 3px solid #C2571B;\n          border-radius: 50%;\n          animation: spin 1s linear infinite;\n          margin: 0 auto;\n        }\n\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n      "}</style>
    </div>);
};
exports.InstitutionSetup = InstitutionSetup;
