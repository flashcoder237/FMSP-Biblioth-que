import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Coffee, 
  Gift, 
  Star,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Users,
  BookOpen,
  Code
} from 'lucide-react';

interface DonationProps {
  onClose: () => void;
}

export const Donation: React.FC<DonationProps> = ({ onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [copied, setCopied] = useState<string | null>(null);

  const predefinedAmounts = [
    { value: 500, label: '500 FCFA', icon: Coffee, description: 'Un café pour le dev' },
    { value: 1000, label: '1 000 FCFA', icon: Heart, description: 'Petit soutien', popular: true },
    { value: 2500, label: '2 500 FCFA', icon: Gift, description: 'Généreux donateur' },
    { value: 5000, label: '5 000 FCFA', icon: Star, description: 'Super supporter' }
  ];

  const paymentMethods = [
    {
      id: 'momo' as const,
      name: 'Mobile Money',
      icon: Smartphone,
      networks: [
        { name: 'MTN MoMo', number: '+237 652 761 931', color: '#FFCC00' },
        { name: 'Orange Money', number: '+237 652 761 931', color: '#FF6600' }
      ]
    },
    {
      id: 'card' as const,
      name: 'Carte bancaire',
      icon: CreditCard,
      description: 'Paiement sécurisé via PayPal ou Stripe',
      comingSoon: true
    }
  ];

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  return (
    <div className="donation-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          
          <div className="hero-main">
            <div className="hero-icon">
              <Heart size={48} />
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
              <Users size={24} />
              <div className="impact-content">
                <span className="impact-number">500+</span>
                <span className="impact-label">Bibliothèques utilisatrices</span>
              </div>
            </div>
            <div className="impact-item">
              <BookOpen size={24} />
              <div className="impact-content">
                <span className="impact-number">10K+</span>
                <span className="impact-label">Livres gérés</span>
              </div>
            </div>
            <div className="impact-item">
              <Code size={24} />
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
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                className={`amount-card ${selectedAmount === amount.value ? 'selected' : ''} ${amount.popular ? 'popular' : ''}`}
                onClick={() => {
                  setSelectedAmount(amount.value);
                  setCustomAmount('');
                }}
              >
                {amount.popular && (
                  <div className="popular-badge">
                    <Sparkles size={12} />
                    Populaire
                  </div>
                )}
                <div className="amount-icon">
                  <amount.icon size={24} />
                </div>
                <div className="amount-value">{amount.label}</div>
                <div className="amount-description">{amount.description}</div>
              </button>
            ))}
          </div>
          
          <div className="custom-amount">
            <label className="custom-label">Ou entrez un montant personnalisé</label>
            <div className="custom-input-group">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="0"
                className="custom-input"
                min="100"
              />
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
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`payment-method ${paymentMethod === method.id ? 'selected' : ''} ${method.comingSoon ? 'disabled' : ''}`}
                onClick={() => !method.comingSoon && setPaymentMethod(method.id)}
                disabled={method.comingSoon}
              >
                <div className="payment-icon">
                  <method.icon size={24} />
                </div>
                <div className="payment-content">
                  <div className="payment-name">{method.name}</div>
                  {method.description && (
                    <div className="payment-description">{method.description}</div>
                  )}
                  {method.comingSoon && (
                    <div className="coming-soon-badge">Bientôt disponible</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {finalAmount > 0 && paymentMethod === 'momo' && (
          <div className="section">
            <h2 className="section-title">Détails de paiement</h2>
            <p className="section-description">
              Utilisez les informations ci-dessous pour effectuer votre don de {finalAmount.toLocaleString()} FCFA
            </p>
            
            <div className="payment-networks">
              {paymentMethods[0].networks?.map((network, index) => (
                <div key={index} className="network-card">
                  <div className="network-header">
                    <div 
                      className="network-indicator"
                      style={{ backgroundColor: network.color }}
                    ></div>
                    <span className="network-name">{network.name}</span>
                  </div>
                  
                  <div className="network-details">
                    <div className="detail-item">
                      <span className="detail-label">Numéro</span>
                      <div className="detail-value">
                        <span className="phone-number">{network.number}</span>
                        <button
                          className="copy-button"
                          onClick={() => handleCopy(network.number.replace(/\s/g, ''), `${network.name}-number`)}
                        >
                          {copied === `${network.name}-number` ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Nom</span>
                      <div className="detail-value">
                        <span>CHEUDJEU TEFOYE CEDRIC BASILIO</span>
                        <button
                          className="copy-button"
                          onClick={() => handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', `${network.name}-name`)}
                        >
                          {copied === `${network.name}-name` ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
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
                </div>
              ))}
            </div>
            
            <div className="payment-note">
              <div className="note-icon">
                <Heart size={20} />
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
          </div>
        )}

        {/* Why Donate */}
        <div className="section">
          <h2 className="section-title">Pourquoi faire un don ?</h2>
          
          <div className="why-donate-grid">
            <div className="why-card">
              <div className="why-icon">
                <Code size={24} />
              </div>
              <h3>Développement continu</h3>
              <p>Financer de nouvelles fonctionnalités et l'amélioration du système</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <Heart size={24} />
              </div>
              <h3>Gratuit pour tous</h3>
              <p>Maintenir le projet accessible gratuitement pour toutes les bibliothèques</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <Users size={24} />
              </div>
              <h3>Support communautaire</h3>
              <p>Fournir une assistance technique et des formations aux utilisateurs</p>
            </div>
            
            <div className="why-card">
              <div className="why-icon">
                <Sparkles size={24} />
              </div>
              <h3>Innovation</h3>
              <p>Intégrer les dernières technologies pour une meilleure expérience</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};