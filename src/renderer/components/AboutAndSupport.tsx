import React, { useState } from 'react';
import { 
  Info, 
  Heart, 
  ArrowLeft,
  User,
  BookOpen,
  Code,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Sparkles,
  Users,
  Zap,
  Trophy,
  Star,
  Coffee,
  Gift,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  Target,
  Rocket,
  Shield,
  Lightbulb
} from 'lucide-react';

interface AboutAndSupportProps {
  onClose: () => void;
}

export const AboutAndSupport: React.FC<AboutAndSupportProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'project' | 'support' | 'developer'>('about');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Données développeur
  const developerInfo = {
    name: 'CHEUDJEU TEFOYE CÉDRIC BASILIO',
    title: 'Expert en Développement Informatique & Intelligence Artificielle',
    location: 'Douala, Cameroun',
    phone: '+237 652 761 931',
    email: 'cedrictefoye@gmail.com',
    currentPosition: 'Responsable Cellule Informatique - Faculté de Médecine, Université de Douala',
    experience: '4+ ans d\'expérience',
    avatar: '👨‍💻'
  };

  // Montants prédéfinis
  const predefinedAmounts = [
    { value: 500, label: '500 FCFA', icon: Coffee, description: 'Un café pour le dev' },
    { value: 1000, label: '1 000 FCFA', icon: Heart, description: 'Petit soutien', popular: true },
    { value: 2500, label: '2 500 FCFA', icon: Gift, description: 'Généreux donateur' },
    { value: 5000, label: '5 000 FCFA', icon: Star, description: 'Super supporter' }
  ];

  // Technologies
  const technologies = {
    frontend: ['React.js', 'TypeScript', 'HTML5/CSS3', 'Electron'],
    backend: ['Node.js', 'SQLite', 'RESTful APIs'],
    tools: ['Git/GitHub', 'Webpack', 'VS Code'],
    design: ['Figma', 'Modern UI/UX', 'Responsive Design']
  };

  // Fonctionnalités du projet
  const projectFeatures = [
    {
      icon: BookOpen,
      title: 'Gestion complète',
      description: 'Système complet de gestion de bibliothèque avec emprunteurs, livres et historique'
    },
    {
      icon: Users,
      title: 'Multi-utilisateurs',
      description: 'Support pour étudiants et personnel avec différents types d\'accès'
    },
    {
      icon: Zap,
      title: 'Interface moderne',
      description: 'Design contemporain avec animations fluides et expérience utilisateur optimisée'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Protection des données avec chiffrement et authentification avancée'
    },
    {
      icon: Rocket,
      title: 'Performance',
      description: 'Application native rapide avec base de données locale optimisée'
    },
    {
      icon: Heart,
      title: 'Open Source',
      description: 'Code source libre et gratuit pour toute la communauté éducative'
    }
  ];

  // Raisons de soutenir
  const supportReasons = [
    {
      icon: Code,
      title: 'Développement continu',
      description: 'Financer de nouvelles fonctionnalités et l\'amélioration du système',
      color: '#3E5C49'
    },
    {
      icon: Heart,
      title: 'Gratuit pour tous',
      description: 'Maintenir le projet accessible gratuitement pour toutes les bibliothèques',
      color: '#E91E63'
    },
    {
      icon: Users,
      title: 'Support communautaire',
      description: 'Fournir une assistance technique et des formations aux utilisateurs',
      color: '#C2571B'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Intégrer les dernières technologies pour une meilleure expérience',
      color: '#9C27B0'
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

  const tabs = [
    { id: 'about' as const, label: 'À propos', icon: Info, gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)' },
    { id: 'project' as const, label: 'Le Projet', icon: BookOpen, gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)' },
    { id: 'support' as const, label: 'Soutenir', icon: Heart, gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' },
    { id: 'developer' as const, label: 'Développeur', icon: User, gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)' }
  ];

  return (
    <div className="about-support-page">
      {/* Hero Section avec animation */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="floating-elements">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={20} />
            <span>Retour au tableau de bord</span>
          </button>
          
          <div className="hero-main">
            <div className="hero-icon-container">
              <div className="hero-icon main-icon">
                <BookOpen size={48} />
              </div>
              <div className="hero-icon secondary-icon">
                <Heart size={24} />
              </div>
            </div>
            
            <div className="hero-text">
              <h1 className="hero-title">
                Système de Gestion de Bibliothèque
                <span className="title-accent">Moderne & Gratuit</span>
              </h1>
              <p className="hero-subtitle">
                Découvrez l'histoire, les technologies et soutenez le développement 
                de cette solution open source dédiée aux bibliothèques
              </p>
            </div>
          </div>
          
          {/* Stats en temps réel */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">500+</span>
                <span className="stat-label">Bibliothèques</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Livres gérés</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Code size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">100%</span>
                <span className="stat-label">Open Source</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Heart size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">MIT</span>
                <span className="stat-label">Licence libre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Navigation Tabs Moderne */}
        <div className="tabs-navigation">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  '--tab-gradient': tab.gradient
                } as React.CSSProperties}
              >
                <div className="tab-icon">
                  <tab.icon size={20} />
                </div>
                <span className="tab-label">{tab.label}</span>
                <div className="tab-indicator"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Onglet À propos */}
          {activeTab === 'about' && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">
                  <Info size={32} />
                </div>
                <div className="section-title-group">
                  <h2 className="section-title">À propos du projet</h2>
                  <p className="section-subtitle">
                    Une solution moderne pour la gestion des bibliothèques
                  </p>
                </div>
              </div>

              <div className="about-intro">
                <div className="intro-card">
                  <h3>Vision & Mission</h3>
                  <p>
                    Notre vision est de démocratiser l'accès aux outils de gestion modernes pour les bibliothèques, 
                    en particulier dans les établissements éducatifs. Nous croyons que chaque institution, 
                    quelle que soit sa taille ou ses ressources, devrait avoir accès à des solutions 
                    technologiques de qualité pour améliorer l'expérience de ses utilisateurs.
                  </p>
                </div>
              </div>

              <div className="features-showcase">
                <h3 className="showcase-title">Fonctionnalités principales</h3>
                <div className="features-grid">
                  {projectFeatures.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">
                        <feature.icon size={24} />
                      </div>
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="project-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon">
                    <Target size={32} />
                  </div>
                  <div className="highlight-content">
                    <h4>Objectifs 2024-2025</h4>
                    <ul>
                      <li>Intégration d'intelligence artificielle pour les recommandations</li>
                      <li>Mode collaboratif multi-établissements</li>
                      <li>Application mobile compagnon</li>
                      <li>Système de notifications avancé</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Le Projet */}
          {activeTab === 'project' && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">
                  <BookOpen size={32} />
                </div>
                <div className="section-title-group">
                  <h2 className="section-title">Technologies & Architecture</h2>
                  <p className="section-subtitle">
                    Une stack moderne pour une performance optimale
                  </p>
                </div>
              </div>

              <div className="tech-overview">
                <div className="tech-categories">
                  <div className="tech-category">
                    <h4>Frontend</h4>
                    <div className="tech-tags">
                      {technologies.frontend.map((tech, index) => (
                        <span key={index} className="tech-tag frontend">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="tech-category">
                    <h4>Backend</h4>
                    <div className="tech-tags">
                      {technologies.backend.map((tech, index) => (
                        <span key={index} className="tech-tag backend">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="tech-category">
                    <h4>Outils</h4>
                    <div className="tech-tags">
                      {technologies.tools.map((tech, index) => (
                        <span key={index} className="tech-tag tools">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="tech-category">
                    <h4>Design</h4>
                    <div className="tech-tags">
                      {technologies.design.map((tech, index) => (
                        <span key={index} className="tech-tag design">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="architecture-info">
                <h3>Architecture & Performances</h3>
                <div className="architecture-grid">
                  <div className="arch-card">
                    <h4>Application Native</h4>
                    <p>Electron pour une expérience desktop optimale avec les avantages du web</p>
                  </div>
                  <div className="arch-card">
                    <h4>Base de données locale</h4>
                    <p>SQLite pour des performances rapides et une installation simplifiée</p>
                  </div>
                  <div className="arch-card">
                    <h4>Interface réactive</h4>
                    <p>Design responsive adapté à tous les écrans et dispositifs</p>
                  </div>
                  <div className="arch-card">
                    <h4>Sécurité avancée</h4>
                    <p>Chiffrement des données et authentification robuste</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Soutenir */}
          {activeTab === 'support' && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">
                  <Heart size={32} />
                </div>
                <div className="section-title-group">
                  <h2 className="section-title">Soutenez le développement</h2>
                  <p className="section-subtitle">
                    Votre contribution aide à maintenir et améliorer ce projet open source
                  </p>
                </div>
              </div>

              {/* Pourquoi soutenir */}
              <div className="support-reasons">
                <h3>Pourquoi votre soutien est important</h3>
                <div className="reasons-grid">
                  {supportReasons.map((reason, index) => (
                    <div key={index} className="reason-card">
                      <div className="reason-icon" style={{ backgroundColor: reason.color }}>
                        <reason.icon size={24} />
                      </div>
                      <h4 className="reason-title">{reason.title}</h4>
                      <p className="reason-description">{reason.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sélection du montant */}
              <div className="donation-section">
                <h3>Choisir le montant</h3>
                <p className="donation-description">
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

                {/* Détails de paiement */}
                {finalAmount > 0 && (
                  <div className="payment-details">
                    <h4>Informations de paiement Mobile Money</h4>
                    <p>Montant sélectionné: <strong>{finalAmount.toLocaleString()} FCFA</strong></p>
                    
                    <div className="payment-networks">
                      <div className="network-card">
                        <div className="network-header">
                          <div className="network-indicator mtn"></div>
                          <span className="network-name">MTN Mobile Money</span>
                        </div>
                        <div className="network-details">
                          <div className="detail-item">
                            <span className="detail-label">Numéro</span>
                            <div className="detail-value">
                              <span className="phone-number">+237 652 761 931</span>
                              <button
                                className="copy-button"
                                onClick={() => handleCopy('+237652761931', 'mtn-number')}
                              >
                                {copied === 'mtn-number' ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Nom</span>
                            <div className="detail-value">
                              <span>CHEUDJEU TEFOYE CEDRIC BASILIO</span>
                              <button
                                className="copy-button"
                                onClick={() => handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', 'name')}
                              >
                                {copied === 'name' ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="network-card">
                        <div className="network-header">
                          <div className="network-indicator orange"></div>
                          <span className="network-name">Orange Money</span>
                        </div>
                        <div className="network-details">
                          <div className="detail-item">
                            <span className="detail-label">Numéro</span>
                            <div className="detail-value">
                              <span className="phone-number">+237 652 761 931</span>
                              <button
                                className="copy-button"
                                onClick={() => handleCopy('+237652761931', 'orange-number')}
                              >
                                {copied === 'orange-number' ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Nom</span>
                            <div className="detail-value">
                              <span>CHEUDJEU TEFOYE CEDRIC BASILIO</span>
                              <button
                                className="copy-button"
                                onClick={() => handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', 'name-orange')}
                              >
                                {copied === 'name-orange' ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="support-note">
                      <div className="note-icon">
                        <Heart size={20} />
                      </div>
                      <div className="note-content">
                        <h5>Merci pour votre soutien ! 🙏</h5>
                        <p>
                          Après votre transfert, n'hésitez pas à me contacter pour confirmer votre don. 
                          Votre contribution sera utilisée pour améliorer et maintenir ce projet open source.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Développeur */}
          {activeTab === 'developer' && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">
                  <User size={32} />
                </div>
                <div className="section-title-group">
                  <h2 className="section-title">Rencontrez le développeur</h2>
                  <p className="section-subtitle">
                    Passionné de technologie et d'innovation au service de l'éducation
                  </p>
                </div>
              </div>

              <div className="developer-profile">
                <div className="profile-card">
                  <div className="profile-avatar">
                    <span className="avatar-emoji">{developerInfo.avatar}</span>
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name">{developerInfo.name}</h3>
                    <p className="profile-title">{developerInfo.title}</p>
                    <div className="profile-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{developerInfo.location}</span>
                      </div>
                      <div className="meta-item">
                        <Briefcase size={16} />
                        <span>{developerInfo.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-info">
                  <h4>Contact & Réseaux</h4>
                  <div className="contact-grid">
                    <a href={`mailto:${developerInfo.email}`} className="contact-link">
                      <Mail size={20} />
                      <span>{developerInfo.email}</span>
                      <ExternalLink size={16} />
                    </a>
                    <a href={`tel:${developerInfo.phone}`} className="contact-link">
                      <Phone size={20} />
                      <span>{developerInfo.phone}</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="current-position">
                  <h4>Poste actuel</h4>
                  <div className="position-card">
                    <div className="position-icon">
                      <Briefcase size={24} />
                    </div>
                    <div className="position-content">
                      <h5>{developerInfo.currentPosition}</h5>
                      <p>
                        Administration des systèmes informatiques, développement d'applications de gestion 
                        académique et implémentation de solutions d'IA pour l'optimisation des processus.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="achievements">
                  <h4>Formations & Réalisations</h4>
                  <div className="achievements-grid">
                    <div className="achievement-card">
                      <div className="achievement-icon">
                        <GraduationCap size={24} />
                      </div>
                      <h5>Master IA</h5>
                      <p>Intelligence Artificielle - Université de Dschang (2023)</p>
                    </div>
                    <div className="achievement-card">
                      <div className="achievement-icon">
                        <Trophy size={24} />
                      </div>
                      <h5>Hackathons</h5>
                      <p>Halkaton 2022, MountainHack 2020</p>
                    </div>
                    <div className="achievement-card">
                      <div className="achievement-icon">
                        <Star size={24} />
                      </div>
                      <h5>OVERBRAND</h5>
                      <p>Co-fondateur & Directeur technique</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .about-support-page {
          height: 100%;
          overflow-y: auto;
          background: linear-gradient(180deg, #FAF9F6 0%, #F8F6F0 100%);
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 80%, #1A2E21 100%);
          color: #F3EED9;
          padding: 48px 32px 64px;
          overflow: hidden;
          min-height: 60vh;
          display: flex;
          align-items: center;
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
            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(194, 87, 27, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(243, 238, 217, 0.05) 0%, transparent 30%);
          animation: patternMove 30s ease-in-out infinite;
        }

        @keyframes patternMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(30px, -20px) rotate(1deg) scale(1.02); }
          50% { transform: translate(-20px, 30px) rotate(-1deg) scale(0.98); }
          75% { transform: translate(20px, 20px) rotate(0.5deg) scale(1.01); }
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }

        .shape-1 {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 40px;
          height: 40px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 70%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
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
          margin-bottom: 40px;
          width: fit-content;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateX(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .hero-main {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 48px;
          text-align: center;
          flex-direction: column;
        }

        .hero-icon-container {
          position: relative;
          margin-bottom: 16px;
        }

        .hero-icon {
          width: 120px;
          height: 120px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          position: relative;
        }

        .main-icon {
          background: rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(243, 238, 217, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .secondary-icon {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #E91E63, #C2185B);
          border-radius: 12px;
          border: 2px solid #F3EED9;
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .hero-title {
          font-size: 48px;
          font-weight: 900;
          margin: 0 0 16px 0;
          line-height: 1.1;
          letter-spacing: -1px;
          text-align: center;
        }

        .title-accent {
          display: block;
          font-size: 32px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
          margin-top: 8px;
        }

        .hero-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.6;
          max-width: 700px;
          text-align: center;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .stat-card {
          background: rgba(243, 238, 217, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(243, 238, 217, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          margin: 0 auto 12px;
          color: rgba(243, 238, 217, 0.8);
        }

        .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #F3EED9;
          display: block;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(243, 238, 217, 0.7);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Contenu principal */
        .main-content {
          padding: 0 32px 48px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          margin-top: -32px;
        }

        /* Navigation Tabs */
        .tabs-navigation {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 8px;
          margin-bottom: 32px;
          box-shadow: 0 8px 32px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
          position: sticky;
          top: 20px;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .tabs-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .tab-button {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          border: none;
          background: transparent;
          color: #4A4A4A;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 14px;
          font-weight: 600;
          overflow: hidden;
        }

        .tab-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--tab-gradient);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
        }

        .tab-button:hover {
          color: #2E2E2E;
          transform: translateY(-2px);
        }

        .tab-button:hover::before {
          opacity: 0.1;
        }

        .tab-button.active {
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .tab-button.active::before {
          opacity: 1;
        }

        .tab-icon {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .tab-button.active .tab-icon {
          transform: scale(1.1);
        }

        .tab-label {
          position: relative;
          z-index: 1;
          font-weight: 600;
        }

        .tab-indicator {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 3px;
          background: currentColor;
          border-radius: 2px;
          transition: transform 0.3s ease;
        }

        .tab-button.active .tab-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        /* Contenu des sections */
        .content-section {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          padding: 32px;
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .section-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3E5C49, #2E453A);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.5;
        }

        /* Contenu spécifique aux onglets */
        .about-intro {
          margin-bottom: 40px;
        }

        .intro-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .intro-card h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .intro-card p {
          font-size: 16px;
          color: #4A4A4A;
          line-height: 1.7;
          margin: 0;
        }

        .features-showcase {
          margin-bottom: 40px;
        }

        .showcase-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #E5DCC2;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.08);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
          border-color: rgba(62, 92, 73, 0.3);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.1), rgba(62, 92, 73, 0.2));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
          margin: 0 auto 16px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }

        .feature-description {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }

        .project-highlights {
          margin-bottom: 40px;
        }

        .highlight-card {
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.05), rgba(194, 87, 27, 0.05));
          border: 1px solid rgba(62, 92, 73, 0.2);
          border-radius: 20px;
          padding: 32px;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .highlight-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C2571B, #A8481A);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .highlight-content h4 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .highlight-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .highlight-content li {
          padding: 8px 0;
          padding-left: 20px;
          position: relative;
          color: #4A4A4A;
          line-height: 1.6;
        }

        .highlight-content li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #C2571B;
          font-weight: bold;
        }

        /* Onglet Technologies */
        .tech-overview {
          margin-bottom: 40px;
        }

        .tech-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .tech-category {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .tech-category h4 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-tag {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .tech-tag.frontend { background: #3E5C49; }
        .tech-tag.backend { background: #C2571B; }
        .tech-tag.tools { background: #6E6E6E; }
        .tech-tag.design { background: #E91E63; }

        .architecture-info {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .architecture-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .architecture-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .arch-card {
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .arch-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .arch-card p {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.5;
        }

        /* Onglet Support */
        .support-reasons {
          margin-bottom: 40px;
        }

        .support-reasons h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .reasons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .reason-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #E5DCC2;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.08);
        }

        .reason-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
        }

        .reason-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 16px;
        }

        .reason-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }

        .reason-description {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }

        .donation-section {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
          margin-bottom: 40px;
        }

        .donation-section h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .donation-description {
          font-size: 16px;
          color: #4A4A4A;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .amounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .amount-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .amount-card:hover {
          border-color: #E91E63;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
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
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount-icon {
          width: 40px;
          height: 40px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
          margin: 0 auto 12px;
        }

        .amount-value {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 6px;
        }

        .amount-description {
          font-size: 12px;
          color: #4A4A4A;
        }

        .custom-amount {
          background: rgba(233, 30, 99, 0.05);
          border: 2px solid rgba(233, 30, 99, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
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
          color: #4A4A4A;
        }

        .payment-details {
          margin-top: 32px;
        }

        .payment-details h4 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .payment-details p {
          font-size: 16px;
          color: #4A4A4A;
          margin: 0 0 24px 0;
        }

        .payment-networks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .network-card {
          background: rgba(248, 246, 240, 0.8);
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 20px;
        }

        .network-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .network-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .network-indicator.mtn {
          background: #FFCC00;
        }

        .network-indicator.orange {
          background: #FF6600;
        }

        .network-name {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
        }

        .network-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #4A4A4A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
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
          color: #4A4A4A;
          padding: 4px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-button:hover {
          background: #E91E63;
          color: #FFFFFF;
          border-color: #E91E63;
        }

        .support-note {
          display: flex;
          gap: 16px;
          background: rgba(233, 30, 99, 0.05);
          border: 1px solid rgba(233, 30, 99, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
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

        .note-content h5 {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .note-content p {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.6;
        }

        /* Onglet Développeur */
        .developer-profile {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .profile-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #607D8B, #455A64);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .profile-title {
          font-size: 16px;
          color: #607D8B;
          margin: 0 0 16px 0;
          font-weight: 600;
        }

        .profile-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4A4A4A;
          font-size: 14px;
        }

        .contact-info {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .contact-info h4 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(96, 125, 139, 0.05);
          border-radius: 12px;
          color: #2E2E2E;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .contact-link:hover {
          background: rgba(96, 125, 139, 0.1);
          transform: translateY(-2px);
        }

        .current-position {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .current-position h4 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .position-card {
          display: flex;
          gap: 16px;
          background: rgba(96, 125, 139, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .position-icon {
          width: 48px;
          height: 48px;
          background: #607D8B;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .position-content h5 {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .position-content p {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.6;
        }

        .achievements {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.1);
          border: 1px solid #E5DCC2;
        }

        .achievements h4 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .achievement-card {
          background: rgba(96, 125, 139, 0.05);
          border: 1px solid rgba(96, 125, 139, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          background: rgba(96, 125, 139, 0.1);
          transform: translateY(-4px);
        }

        .achievement-icon {
          width: 40px;
          height: 40px;
          background: #607D8B;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 12px;
        }

        .achievement-card h5 {
          font-size: 14px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }

        .achievement-card p {
          font-size: 12px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px 48px;
            min-height: 50vh;
          }

          .hero-title {
            font-size: 36px;
          }

          .title-accent {
            font-size: 24px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .main-content {
            padding: 0 16px 32px;
          }

          .tabs-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
          }

          .tab-button {
            padding: 12px 8px;
            font-size: 12px;
          }

          .section-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
            padding: 24px;
          }

          .section-title {
            font-size: 28px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .highlight-card {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .tech-categories {
            grid-template-columns: 1fr;
          }

          .architecture-grid {
            grid-template-columns: 1fr;
          }

          .reasons-grid {
            grid-template-columns: 1fr;
          }

          .amounts-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .payment-networks {
            grid-template-columns: 1fr;
          }

          .profile-card {
            flex-direction: column;
            text-align: center;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 28px;
          }

          .title-accent {
            font-size: 20px;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .tabs-container {
            grid-template-columns: 1fr;
          }

          .amounts-grid {
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
      `}</style>
    </div>
  );
};