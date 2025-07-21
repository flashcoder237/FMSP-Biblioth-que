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
exports.Donation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Donation = function (_a) {
    var _b;
    var onClose = _a.onClose;
    var _c = (0, react_1.useState)(1000), selectedAmount = _c[0], setSelectedAmount = _c[1];
    var _d = (0, react_1.useState)(''), customAmount = _d[0], setCustomAmount = _d[1];
    var _e = (0, react_1.useState)('momo'), paymentMethod = _e[0], setPaymentMethod = _e[1];
    var _f = (0, react_1.useState)(null), copied = _f[0], setCopied = _f[1];
    var predefinedAmounts = [
        { value: 500, label: '500 FCFA', icon: lucide_react_1.Coffee, description: 'Un café pour le dev' },
        { value: 1000, label: '1 000 FCFA', icon: lucide_react_1.Heart, description: 'Petit soutien', popular: true },
        { value: 2500, label: '2 500 FCFA', icon: lucide_react_1.Gift, description: 'Généreux donateur' },
        { value: 5000, label: '5 000 FCFA', icon: lucide_react_1.Star, description: 'Super supporter' }
    ];
    var paymentMethods = [
        {
            id: 'momo',
            name: 'Mobile Money',
            icon: lucide_react_1.Smartphone,
            networks: [
                { name: 'MTN MoMo', number: '+237 652 761 931', color: '#FFCC00' },
                { name: 'Orange Money', number: '+237 652 761 931', color: '#FF6600' }
            ]
        },
        {
            id: 'card',
            name: 'Carte bancaire',
            icon: lucide_react_1.CreditCard,
            description: 'Paiement sécurisé via PayPal ou Stripe',
            comingSoon: true
        }
    ];
    var handleCopy = function (text, type) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 1:
                    _a.sent();
                    setCopied(type);
                    setTimeout(function () { return setCopied(null); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('Erreur lors de la copie:', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var finalAmount = selectedAmount || parseInt(customAmount) || 0;
    return (<div className="donation-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <button className="back-button" onClick={onClose}>
            <lucide_react_1.ArrowLeft size={20}/>
            <span>Retour</span>
          </button>
          
          <div className="hero-main">
            <div className="hero-icon">
              <lucide_react_1.Heart size={48}/>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Soutenez le projet Bibliothèque</h1>
              <p className="hero-subtitle">
                Votre contribution aide à maintenir et améliorer ce système de gestion de bibliothèque gratuit
              </p>
            </div>
          </div>
          
          {/* Impact Stats */}
          <div className="impact-stats">
            <div className="impact-item">
              <lucide_react_1.Users size={24}/>
              <div className="impact-content">
                <span className="impact-number">500+</span>
                <span className="impact-label">Bibliothèques utilisatrices</span>
              </div>
            </div>
            <div className="impact-item">
              <lucide_react_1.BookOpen size={24}/>
              <div className="impact-content">
                <span className="impact-number">10K+</span>
                <span className="impact-label">Livres gérés</span>
              </div>
            </div>
            <div className="impact-item">
              <lucide_react_1.Code size={24}/>
              <div className="impact-content">
                <span className="impact-number">100%</span>
                <span className="impact-label">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="donation-content">
        {/* Amount Selection */}
        <div className="section">
          <h2 className="section-title">Choisir le montant</h2>
          <p className="section-description">
            Chaque contribution, même petite, fait une grande différence pour le développement du projet
          </p>
          
          <div className="amounts-grid">
            {predefinedAmounts.map(function (amount) { return (<button key={amount.value} className={"amount-card ".concat(selectedAmount === amount.value ? 'selected' : '', " ").concat(amount.popular ? 'popular' : '')} onClick={function () {
                setSelectedAmount(amount.value);
                setCustomAmount('');
            }}>
                {amount.popular && (<div className="popular-badge">
                    <lucide_react_1.Sparkles size={12}/>
                    Populaire
                  </div>)}
                <div className="amount-icon">
                  <amount.icon size={24}/>
                </div>
                <div className="amount-value">{amount.label}</div>
                <div className="amount-description">{amount.description}</div>
              </button>); })}
          </div>
          
          <div className="custom-amount">
            <label className="custom-label">Ou entrez un montant personnalisé</label>
            <div className="custom-input-group">
              <input type="number" value={customAmount} onChange={function (e) {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
        }} placeholder="0" className="custom-input" min="100"/>
              <span className="currency">FCFA</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="section">
          <h2 className="section-title">Méthode de paiement</h2>
          <p className="section-description">
            Choisissez votre mode de paiement préféré
          </p>
          
          <div className="payment-methods">
            {paymentMethods.map(function (method) { return (<button key={method.id} className={"payment-method ".concat(paymentMethod === method.id ? 'selected' : '', " ").concat(method.comingSoon ? 'disabled' : '')} onClick={function () { return !method.comingSoon && setPaymentMethod(method.id); }} disabled={method.comingSoon}>
                <div className="payment-icon">
                  <method.icon size={24}/>
                </div>
                <div className="payment-content">
                  <div className="payment-name">{method.name}</div>
                  {method.description && (<div className="payment-description">{method.description}</div>)}
                  {method.comingSoon && (<div className="coming-soon-badge">Bientôt disponible</div>)}
                </div>
              </button>); })}
          </div>
        </div>

        {/* Payment Details */}
        {finalAmount > 0 && paymentMethod === 'momo' && (<div className="section">
            <h2 className="section-title">Détails de paiement</h2>
            <p className="section-description">
              Utilisez les informations ci-dessous pour effectuer votre don de {finalAmount.toLocaleString()} FCFA
            </p>
            
            <div className="payment-networks">
              {(_b = paymentMethods[0].networks) === null || _b === void 0 ? void 0 : _b.map(function (network, index) { return (<div key={index} className="network-card">
                  <div className="network-header">
                    <div className="network-indicator" style={{ backgroundColor: network.color }}></div>
                    <span className="network-name">{network.name}</span>
                  </div>
                  
                  <div className="network-details">
                    <div className="detail-item">
                      <span className="detail-label">Numéro</span>
                      <div className="detail-value">
                        <span className="phone-number">{network.number}</span>
                        <button className="copy-button" onClick={function () { return handleCopy(network.number.replace(/\s/g, ''), "".concat(network.name, "-number")); }}>
                          {copied === "".concat(network.name, "-number") ? (<lucide_react_1.Check size={16}/>) : (<lucide_react_1.Copy size={16}/>)}
                        </button>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Nom</span>
                      <div className="detail-value">
                        <span>CHEUDJEU TEFOYE CEDRIC BASILIO</span>
                        <button className="copy-button" onClick={function () { return handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', "".concat(network.name, "-name")); }}>
                          {copied === "".concat(network.name, "-name") ? (<lucide_react_1.Check size={16}/>) : (<lucide_react_1.Copy size={16}/>)}
                        </button>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Montant</span>
                      <div className="detail-value amount-highlight">
                        {finalAmount.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                </div>); })}
            </div>
            
            <div className="payment-note">
              <div className="note-icon">
                <lucide_react_1.Heart size={20}/>
              </div>
              <div className="note-content">
                <h4>Merci pour votre soutien !</h4>
                <p>
                  Après votre transfert, n'hésitez pas à me contacter pour confirmer votre don et recevoir 
                  un reçu si nécessaire. Votre contribution sera utilisée pour améliorer et maintenir 
                  ce projet open source.
                </p>
              </div>
            </div>
          </div>)}

        {/* Why Donate */}
        <div className="section">
          <h2 className="section-title">Pourquoi faire un don ?</h2>
          
          <div className="why-donate-grid">
            <div className="why-card">
              <div className="why-icon">
                <lucide_react_1.Code size={24}/>
              </div>
              <h3>Développement continu</h3>
              <p>Financer de nouvelles fonctionnalités et l'amélioration du système</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <lucide_react_1.Heart size={24}/>
              </div>
              <h3>Gratuit pour tous</h3>
              <p>Maintenir le projet accessible gratuitement pour toutes les bibliothèques</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <lucide_react_1.Users size={24}/>
              </div>
              <h3>Support communautaire</h3>
              <p>Fournir une assistance technique et des formations aux utilisateurs</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <lucide_react_1.Sparkles size={24}/>
              </div>
              <h3>Innovation</h3>
              <p>Intégrer les dernières technologies pour une meilleure expérience</p>
            </div>
          </div>
        </div>
      </div>

      <style>{"\n        .donation-page {\n          height: 100%;\n          overflow-y: auto;\n          background: #FAF9F6;\n        }\n        \n        .hero-section {\n          position: relative;\n          background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);\n          color: #F3EED9;\n          padding: 48px 32px;\n          overflow: hidden;\n        }\n        \n        .hero-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n        \n        .hero-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),\n            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);\n          animation: drift 20s ease-in-out infinite;\n        }\n        \n        @keyframes drift {\n          0%, 100% { transform: translate(0, 0) rotate(0deg); }\n          33% { transform: translate(30px, -30px) rotate(1deg); }\n          66% { transform: translate(-20px, 20px) rotate(-1deg); }\n        }\n        \n        .hero-content {\n          position: relative;\n          z-index: 1;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .back-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px 20px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          font-size: 14px;\n          font-weight: 500;\n          margin-bottom: 32px;\n          width: fit-content;\n        }\n        \n        .back-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: translateX(-4px);\n        }\n        \n        .hero-main {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          margin-bottom: 40px;\n          text-align: center;\n          flex-direction: column;\n        }\n        \n        .hero-icon {\n          width: 96px;\n          height: 96px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 24px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n          animation: heartbeat 3s ease-in-out infinite;\n        }\n        \n        .hero-title {\n          font-size: 42px;\n          font-weight: 800;\n          margin: 0 0 16px 0;\n          line-height: 1.2;\n          letter-spacing: -0.5px;\n        }\n        \n        .hero-subtitle {\n          font-size: 20px;\n          opacity: 0.9;\n          margin: 0;\n          line-height: 1.5;\n          max-width: 600px;\n        }\n        \n        .impact-stats {\n          display: flex;\n          justify-content: center;\n          gap: 40px;\n          flex-wrap: wrap;\n        }\n        \n        .impact-item {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          background: rgba(243, 238, 217, 0.1);\n          padding: 20px 24px;\n          border-radius: 16px;\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.2);\n        }\n        \n        .impact-number {\n          font-size: 24px;\n          font-weight: 800;\n          color: #F3EED9;\n          display: block;\n          line-height: 1;\n        }\n        \n        .impact-label {\n          font-size: 14px;\n          color: rgba(243, 238, 217, 0.9);\n          margin-top: 4px;\n        }\n        \n        .donation-content {\n          padding: 48px 32px;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .section {\n          margin-bottom: 56px;\n        }\n        \n        .section-title {\n          font-size: 28px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .section-description {\n          font-size: 16px;\n          color: #6E6E6E;\n          margin: 0 0 32px 0;\n          line-height: 1.6;\n        }\n        \n        .amounts-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n          gap: 20px;\n          margin-bottom: 32px;\n        }\n        \n        .amount-card {\n          background: #FFFFFF;\n          border: 2px solid #E5DCC2;\n          border-radius: 20px;\n          padding: 24px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          text-align: center;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .amount-card:hover {\n          border-color: #E91E63;\n          transform: translateY(-4px);\n          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.15);\n        }\n        \n        .amount-card.selected {\n          border-color: #E91E63;\n          background: rgba(233, 30, 99, 0.05);\n          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.2);\n        }\n        \n        .amount-card.popular {\n          border-color: #E91E63;\n        }\n        \n        .popular-badge {\n          position: absolute;\n          top: -8px;\n          left: 50%;\n          transform: translateX(-50%);\n          background: #E91E63;\n          color: #FFFFFF;\n          padding: 4px 12px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 700;\n          display: flex;\n          align-items: center;\n          gap: 4px;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .amount-icon {\n          width: 48px;\n          height: 48px;\n          background: rgba(233, 30, 99, 0.1);\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #E91E63;\n          margin: 0 auto 16px;\n        }\n        \n        .amount-value {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin-bottom: 8px;\n        }\n        \n        .amount-description {\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .custom-amount {\n          background: #FFFFFF;\n          border: 2px solid #E5DCC2;\n          border-radius: 16px;\n          padding: 24px;\n        }\n        \n        .custom-label {\n          display: block;\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin-bottom: 12px;\n        }\n        \n        .custom-input-group {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n        }\n        \n        .custom-input {\n          flex: 1;\n          padding: 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 18px;\n          font-weight: 600;\n          text-align: right;\n        }\n        \n        .custom-input:focus {\n          outline: none;\n          border-color: #E91E63;\n        }\n        \n        .currency {\n          font-size: 18px;\n          font-weight: 600;\n          color: #6E6E6E;\n        }\n        \n        .payment-methods {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .payment-method {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          background: #FFFFFF;\n          border: 2px solid #E5DCC2;\n          border-radius: 16px;\n          padding: 20px 24px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          text-align: left;\n        }\n        \n        .payment-method.selected {\n          border-color: #E91E63;\n          background: rgba(233, 30, 99, 0.05);\n        }\n        \n        .payment-method.disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n        }\n        \n        .payment-icon {\n          width: 48px;\n          height: 48px;\n          background: rgba(233, 30, 99, 0.1);\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #E91E63;\n        }\n        \n        .payment-content {\n          flex: 1;\n        }\n        \n        .payment-name {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin-bottom: 4px;\n        }\n        \n        .payment-description {\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .coming-soon-badge {\n          background: #FFB400;\n          color: #FFFFFF;\n          padding: 2px 8px;\n          border-radius: 8px;\n          font-size: 11px;\n          font-weight: 600;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n          margin-top: 8px;\n          display: inline-block;\n        }\n        \n        .payment-networks {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n          gap: 24px;\n        }\n        \n        .network-card {\n          background: #FFFFFF;\n          border: 2px solid #E5DCC2;\n          border-radius: 20px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(233, 30, 99, 0.1);\n        }\n        \n        .network-header {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          margin-bottom: 20px;\n        }\n        \n        .network-indicator {\n          width: 12px;\n          height: 12px;\n          border-radius: 50%;\n        }\n        \n        .network-name {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n        }\n        \n        .network-details {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .detail-item {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n        }\n        \n        .detail-label {\n          font-size: 14px;\n          font-weight: 600;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .detail-value {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 16px;\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .detail-value.amount-highlight {\n          font-size: 20px;\n          color: #E91E63;\n          font-weight: 800;\n        }\n        \n        .phone-number {\n          font-family: 'Courier New', monospace;\n          background: rgba(233, 30, 99, 0.1);\n          padding: 4px 8px;\n          border-radius: 6px;\n        }\n        \n        .copy-button {\n          background: #F3EED9;\n          border: 1px solid #E5DCC2;\n          color: #6E6E6E;\n          padding: 6px;\n          border-radius: 6px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .copy-button:hover {\n          background: #E91E63;\n          color: #FFFFFF;\n          border-color: #E91E63;\n        }\n        \n        .payment-note {\n          display: flex;\n          gap: 16px;\n          background: rgba(233, 30, 99, 0.05);\n          border: 1px solid rgba(233, 30, 99, 0.2);\n          border-radius: 16px;\n          padding: 24px;\n          margin-top: 32px;\n        }\n        \n        .note-icon {\n          width: 40px;\n          height: 40px;\n          background: #E91E63;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #FFFFFF;\n          flex-shrink: 0;\n        }\n        \n        .note-content h4 {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n        }\n        \n        .note-content p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n          line-height: 1.6;\n        }\n        \n        .why-donate-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n          gap: 24px;\n        }\n        \n        .why-card {\n          background: #FFFFFF;\n          border: 1px solid #E5DCC2;\n          border-radius: 20px;\n          padding: 28px;\n          text-align: center;\n          transition: all 0.3s ease;\n        }\n        \n        .why-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.1);\n          border-color: rgba(233, 30, 99, 0.3);\n        }\n        \n        .why-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(233, 30, 99, 0.1);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #E91E63;\n          margin: 0 auto 20px;\n        }\n        \n        .why-card h3 {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 12px 0;\n        }\n        \n        .why-card p {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n          line-height: 1.6;\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 768px) {\n          .hero-section {\n            padding: 32px 16px;\n          }\n          \n          .hero-title {\n            font-size: 32px;\n          }\n          \n          .hero-subtitle {\n            font-size: 18px;\n          }\n          \n          .impact-stats {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .impact-item {\n            justify-content: center;\n          }\n          \n          .donation-content {\n            padding: 32px 16px;\n          }\n          \n          .amounts-grid {\n            grid-template-columns: 1fr 1fr;\n            gap: 16px;\n          }\n          \n          .payment-networks {\n            grid-template-columns: 1fr;\n          }\n          \n          .why-donate-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .detail-item {\n            flex-direction: column;\n            align-items: stretch;\n            gap: 8px;\n          }\n          \n          .detail-value {\n            justify-content: space-between;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .hero-main {\n            gap: 16px;\n          }\n          \n          .hero-icon {\n            width: 72px;\n            height: 72px;\n          }\n          \n          .hero-title {\n            font-size: 28px;\n          }\n          \n          .amounts-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .amount-card {\n            padding: 20px;\n          }\n          \n          .payment-method {\n            padding: 16px 20px;\n          }\n          \n          .network-card {\n            padding: 20px;\n          }\n          \n          .payment-note {\n            flex-direction: column;\n            gap: 12px;\n            text-align: center;\n          }\n        }\n      "}</style>
    </div>);
};
exports.Donation = Donation;
