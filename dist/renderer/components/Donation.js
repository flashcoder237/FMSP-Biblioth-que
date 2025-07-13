"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Donation = ({ onClose }) => {
    const [selectedAmount, setSelectedAmount] = (0, react_1.useState)(1000);
    const [customAmount, setCustomAmount] = (0, react_1.useState)('');
    const [paymentMethod, setPaymentMethod] = (0, react_1.useState)('momo');
    const [copied, setCopied] = (0, react_1.useState)(null);
    const predefinedAmounts = [
        { value: 500, label: '500 FCFA', icon: lucide_react_1.Coffee, description: 'Un café pour le dev' },
        { value: 1000, label: '1 000 FCFA', icon: lucide_react_1.Heart, description: 'Petit soutien', popular: true },
        { value: 2500, label: '2 500 FCFA', icon: lucide_react_1.Gift, description: 'Généreux donateur' },
        { value: 5000, label: '5 000 FCFA', icon: lucide_react_1.Star, description: 'Super supporter' }
    ];
    const paymentMethods = [
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
    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        }
        catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };
    const finalAmount = selectedAmount || parseInt(customAmount) || 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "donation-page", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hero-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-background", children: (0, jsx_runtime_1.jsx)("div", { className: "hero-pattern" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-content", children: [(0, jsx_runtime_1.jsxs)("button", { className: "back-button", onClick: onClose, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Retour" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-main", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 48 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "hero-title", children: "Soutenez le projet Biblioth\u00E8que" }), (0, jsx_runtime_1.jsx)("p", { className: "hero-subtitle", children: "Votre contribution aide \u00E0 maintenir et am\u00E9liorer ce syst\u00E8me de gestion de biblioth\u00E8que gratuit" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "impact-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "impact-number", children: "500+" }), (0, jsx_runtime_1.jsx)("span", { className: "impact-label", children: "Biblioth\u00E8ques utilisatrices" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "impact-number", children: "10K+" }), (0, jsx_runtime_1.jsx)("span", { className: "impact-label", children: "Livres g\u00E9r\u00E9s" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "impact-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "impact-number", children: "100%" }), (0, jsx_runtime_1.jsx)("span", { className: "impact-label", children: "Open Source" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "donation-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "Choisir le montant" }), (0, jsx_runtime_1.jsx)("p", { className: "section-description", children: "Chaque contribution, m\u00EAme petite, fait une grande diff\u00E9rence pour le d\u00E9veloppement du projet" }), (0, jsx_runtime_1.jsx)("div", { className: "amounts-grid", children: predefinedAmounts.map((amount) => ((0, jsx_runtime_1.jsxs)("button", { className: `amount-card ${selectedAmount === amount.value ? 'selected' : ''} ${amount.popular ? 'popular' : ''}`, onClick: () => {
                                        setSelectedAmount(amount.value);
                                        setCustomAmount('');
                                    }, children: [amount.popular && ((0, jsx_runtime_1.jsxs)("div", { className: "popular-badge", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 12 }), "Populaire"] })), (0, jsx_runtime_1.jsx)("div", { className: "amount-icon", children: (0, jsx_runtime_1.jsx)(amount.icon, { size: 24 }) }), (0, jsx_runtime_1.jsx)("div", { className: "amount-value", children: amount.label }), (0, jsx_runtime_1.jsx)("div", { className: "amount-description", children: amount.description })] }, amount.value))) }), (0, jsx_runtime_1.jsxs)("div", { className: "custom-amount", children: [(0, jsx_runtime_1.jsx)("label", { className: "custom-label", children: "Ou entrez un montant personnalis\u00E9" }), (0, jsx_runtime_1.jsxs)("div", { className: "custom-input-group", children: [(0, jsx_runtime_1.jsx)("input", { type: "number", value: customAmount, onChange: (e) => {
                                                    setCustomAmount(e.target.value);
                                                    setSelectedAmount(null);
                                                }, placeholder: "0", className: "custom-input", min: "100" }), (0, jsx_runtime_1.jsx)("span", { className: "currency", children: "FCFA" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "M\u00E9thode de paiement" }), (0, jsx_runtime_1.jsx)("p", { className: "section-description", children: "Choisissez votre mode de paiement pr\u00E9f\u00E9r\u00E9" }), (0, jsx_runtime_1.jsx)("div", { className: "payment-methods", children: paymentMethods.map((method) => ((0, jsx_runtime_1.jsxs)("button", { className: `payment-method ${paymentMethod === method.id ? 'selected' : ''} ${method.comingSoon ? 'disabled' : ''}`, onClick: () => !method.comingSoon && setPaymentMethod(method.id), disabled: method.comingSoon, children: [(0, jsx_runtime_1.jsx)("div", { className: "payment-icon", children: (0, jsx_runtime_1.jsx)(method.icon, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "payment-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "payment-name", children: method.name }), method.description && ((0, jsx_runtime_1.jsx)("div", { className: "payment-description", children: method.description })), method.comingSoon && ((0, jsx_runtime_1.jsx)("div", { className: "coming-soon-badge", children: "Bient\u00F4t disponible" }))] })] }, method.id))) })] }), finalAmount > 0 && paymentMethod === 'momo' && ((0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "D\u00E9tails de paiement" }), (0, jsx_runtime_1.jsxs)("p", { className: "section-description", children: ["Utilisez les informations ci-dessous pour effectuer votre don de ", finalAmount.toLocaleString(), " FCFA"] }), (0, jsx_runtime_1.jsx)("div", { className: "payment-networks", children: paymentMethods[0].networks?.map((network, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "network-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "network-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "network-indicator", style: { backgroundColor: network.color } }), (0, jsx_runtime_1.jsx)("span", { className: "network-name", children: network.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "network-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "detail-label", children: "Num\u00E9ro" }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-value", children: [(0, jsx_runtime_1.jsx)("span", { className: "phone-number", children: network.number }), (0, jsx_runtime_1.jsx)("button", { className: "copy-button", onClick: () => handleCopy(network.number.replace(/\s/g, ''), `${network.name}-number`), children: copied === `${network.name}-number` ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { size: 16 })) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "detail-label", children: "Nom" }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-value", children: [(0, jsx_runtime_1.jsx)("span", { children: "CHEUDJEU TEFOYE CEDRIC BASILIO" }), (0, jsx_runtime_1.jsx)("button", { className: "copy-button", onClick: () => handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', `${network.name}-name`), children: copied === `${network.name}-name` ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { size: 16 })) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "detail-label", children: "Montant" }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-value amount-highlight", children: [finalAmount.toLocaleString(), " FCFA"] })] })] })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "payment-note", children: [(0, jsx_runtime_1.jsx)("div", { className: "note-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "note-content", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Merci pour votre soutien !" }), (0, jsx_runtime_1.jsx)("p", { children: "Apr\u00E8s votre transfert, n'h\u00E9sitez pas \u00E0 me contacter pour confirmer votre don et recevoir un re\u00E7u si n\u00E9cessaire. Votre contribution sera utilis\u00E9e pour am\u00E9liorer et maintenir ce projet open source." })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "Pourquoi faire un don ?" }), (0, jsx_runtime_1.jsxs)("div", { className: "why-donate-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "why-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "why-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Code, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h3", { children: "D\u00E9veloppement continu" }), (0, jsx_runtime_1.jsx)("p", { children: "Financer de nouvelles fonctionnalit\u00E9s et l'am\u00E9lioration du syst\u00E8me" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "why-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "why-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h3", { children: "Gratuit pour tous" }), (0, jsx_runtime_1.jsx)("p", { children: "Maintenir le projet accessible gratuitement pour toutes les biblioth\u00E8ques" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "why-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "why-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h3", { children: "Support communautaire" }), (0, jsx_runtime_1.jsx)("p", { children: "Fournir une assistance technique et des formations aux utilisateurs" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "why-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "why-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h3", { children: "Innovation" }), (0, jsx_runtime_1.jsx)("p", { children: "Int\u00E9grer les derni\u00E8res technologies pour une meilleure exp\u00E9rience" })] })] })] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .donation-page {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
          color: #F3EED9;
          padding: 48px 32px;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          animation: drift 20s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          width: fit-content;
        }
        
        .back-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateX(-4px);
        }
        
        .hero-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          text-align: center;
          flex-direction: column;
        }
        
        .hero-icon {
          width: 96px;
          height: 96px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          animation: heartbeat 3s ease-in-out infinite;
        }
        
        .hero-title {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
          max-width: 600px;
        }
        
        .impact-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        
        .impact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(243, 238, 217, 0.1);
          padding: 20px 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .impact-number {
          font-size: 24px;
          font-weight: 800;
          color: #F3EED9;
          display: block;
          line-height: 1;
        }
        
        .impact-label {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin-top: 4px;
        }
        
        .donation-content {
          padding: 48px 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section {
          margin-bottom: 56px;
        }
        
        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        
        .section-description {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }
        
        .amounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .amount-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .amount-card:hover {
          border-color: #E91E63;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.15);
        }
        
        .amount-card.selected {
          border-color: #E91E63;
          background: rgba(233, 30, 99, 0.05);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.2);
        }
        
        .amount-card.popular {
          border-color: #E91E63;
        }
        
        .popular-badge {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #E91E63;
          color: #FFFFFF;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .amount-icon {
          width: 48px;
          height: 48px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
          margin: 0 auto 16px;
        }
        
        .amount-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .amount-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .custom-amount {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
        }
        
        .custom-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 12px;
        }
        
        .custom-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .custom-input {
          flex: 1;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          text-align: right;
        }
        
        .custom-input:focus {
          outline: none;
          border-color: #E91E63;
        }
        
        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #6E6E6E;
        }
        
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .payment-method {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .payment-method.selected {
          border-color: #E91E63;
          background: rgba(233, 30, 99, 0.05);
        }
        
        .payment-method.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .payment-icon {
          width: 48px;
          height: 48px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
        }
        
        .payment-content {
          flex: 1;
        }
        
        .payment-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .payment-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .coming-soon-badge {
          background: #FFB400;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
          display: inline-block;
        }
        
        .payment-networks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .network-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(233, 30, 99, 0.1);
        }
        
        .network-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .network-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .network-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
        }
        
        .network-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .detail-label {
          font-size: 14px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .detail-value.amount-highlight {
          font-size: 20px;
          color: #E91E63;
          font-weight: 800;
        }
        
        .phone-number {
          font-family: 'Courier New', monospace;
          background: rgba(233, 30, 99, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }
        
        .copy-button {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          color: #6E6E6E;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .copy-button:hover {
          background: #E91E63;
          color: #FFFFFF;
          border-color: #E91E63;
        }
        
        .payment-note {
          display: flex;
          gap: 16px;
          background: rgba(233, 30, 99, 0.05);
          border: 1px solid rgba(233, 30, 99, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-top: 32px;
        }
        
        .note-icon {
          width: 40px;
          height: 40px;
          background: #E91E63;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        
        .note-content h4 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .note-content p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.6;
        }
        
        .why-donate-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        
        .why-card {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.1);
          border-color: rgba(233, 30, 99, 0.3);
        }
        
        .why-icon {
          width: 56px;
          height: 56px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
          margin: 0 auto 20px;
        }
        
        .why-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .why-card p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.6;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 18px;
          }
          
          .impact-stats {
            flex-direction: column;
            gap: 16px;
          }
          
          .impact-item {
            justify-content: center;
          }
          
          .donation-content {
            padding: 32px 16px;
          }
          
          .amounts-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          
          .payment-networks {
            grid-template-columns: 1fr;
          }
          
          .why-donate-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .detail-value {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .hero-main {
            gap: 16px;
          }
          
          .hero-icon {
            width: 72px;
            height: 72px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .amounts-grid {
            grid-template-columns: 1fr;
          }
          
          .amount-card {
            padding: 20px;
          }
          
          .payment-method {
            padding: 16px 20px;
          }
          
          .network-card {
            padding: 20px;
          }
          
          .payment-note {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      ` })] }));
};
exports.Donation = Donation;
