import React, { useState } from 'react';
import { 
  Info, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Star,
  Award,
  ExternalLink,
  ArrowLeft,
  Github,
  Linkedin,
  Globe,
  Heart,
  BookOpen,
  Zap,
  Users,
  Trophy,
  Sparkles
} from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export const About: React.FC<AboutProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'developer' | 'project' | 'technologies'>('developer');

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

  const education = [
    {
      degree: 'Master en Intelligence Artificielle',
      institution: 'Université de Dschang, Faculté des Sciences',
      year: '2022-2023',
      mention: 'Mention obtenue',
      specialization: 'Machine Learning, NLP, Computer Vision'
    },
    {
      degree: 'Licence en Informatique Fondamentale',
      institution: 'Université de Dschang, Faculté des Sciences',
      year: '2020-2021',
      specialization: 'Génie Logiciel et Systèmes d\'Information'
    }
  ];

  const experience = [
    {
      title: 'Responsable Cellule Informatique',
      company: 'Faculté de Médecine - Université de Douala',
      period: 'Jan. 2024 - Présent',
      description: 'Administration des systèmes, développement d\'applications de gestion académique, implémentation de solutions d\'IA'
    },
    {
      title: 'Co-fondateur',
      company: 'OVERBRAND',
      period: 'Août 2021 - Présent',
      description: 'Direction stratégique et technique, supervision de projets web/mobile'
    },
    {
      title: 'Designer - Projet Help to Win',
      company: 'VISIBILITY CAM SARL',
      period: 'Mars 2023 - Présent',
      description: 'Conception UI/UX d\'application mobile éducative'
    }
  ];

  const technologies = {
    frontend: ['React.js', 'Vue.js', 'HTML5/CSS3', 'JavaScript', 'TypeScript'],
    backend: ['Node.js', 'PHP/Laravel', 'Python', 'Express.js'],
    mobile: ['React Native', 'Flutter'],
    ai: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Machine Learning', 'NLP'],
    design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
    database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
    tools: ['Git/GitHub', 'Docker', 'AWS']
  };

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
      icon: Heart,
      title: 'Open Source',
      description: 'Code source libre et gratuit pour toute la communauté éducative'
    }
  ];

  const achievements = [
    {
      icon: Trophy,
      title: 'Halkaton 2022',
      description: 'Hackathon de 24 heures'
    },
    {
      icon: Award,
      title: 'MountainHack 2020',
      description: 'Hackathon de 24 heures, Dschang'
    },
    {
      icon: Star,
      title: 'Master avec mention',
      description: 'Intelligence Artificielle - 2023'
    }
  ];

  const tabs = [
    { id: 'developer' as const, label: 'Développeur', icon: User },
    { id: 'project' as const, label: 'Le Projet', icon: BookOpen },
    { id: 'technologies' as const, label: 'Technologies', icon: Code }
  ];

  return (
    <div className="about-page">
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
              <Info size={48} />
            </div>
            <div className="hero-text">
              <h1 className="hero-title">À propos du projet</h1>
              <p className="hero-subtitle">
                Découvrez l'histoire, les technologies et l'équipe derrière ce système de gestion de bibliothèque
              </p>
            </div>
          </div>
          
          {/* Project Stats */}
          <div className="project-stats">
            <div className="stat-item">
              <Sparkles size={24} />
              <div className="stat-content">
                <span className="stat-number">2024</span>
                <span className="stat-label">Année de création</span>
              </div>
            </div>
            <div className="stat-item">
              <Code size={24} />
              <div className="stat-content">
                <span className="stat-number">100%</span>
                <span className="stat-label">TypeScript</span>
              </div>
            </div>
            <div className="stat-item">
              <Heart size={24} />
              <div className="stat-content">
                <span className="stat-number">MIT</span>
                <span className="stat-label">Licence libre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-content">
        {/* Navigation Tabs */}
        <div className="tabs-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Developer Tab */}
        {activeTab === 'developer' && (
          <div className="tab-content">
            <div className="developer-hero">
              <div className="developer-avatar">
                <span className="avatar-emoji">{developerInfo.avatar}</span>
              </div>
              <div className="developer-info">
                <h2 className="developer-name">{developerInfo.name}</h2>
                <p className="developer-title">{developerInfo.title}</p>
                <div className="developer-meta">
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

            <div className="content-grid">
              {/* Contact */}
              <div className="info-card">
                <h3 className="card-title">Contact</h3>
                <div className="contact-list">
                  <a href={`mailto:${developerInfo.email}`} className="contact-item">
                    <Mail size={20} />
                    <span>{developerInfo.email}</span>
                    <ExternalLink size={16} />
                  </a>
                  <a href={`tel:${developerInfo.phone}`} className="contact-item">
                    <Phone size={20} />
                    <span>{developerInfo.phone}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* Current Position */}
              <div className="info-card">
                <h3 className="card-title">Poste actuel</h3>
                <div className="position-info">
                  <div className="position-title">{developerInfo.currentPosition}</div>
                  <p className="position-description">
                    Administration des systèmes informatiques, développement d'applications de gestion 
                    académique et implémentation de solutions d'IA pour l'optimisation des processus.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="section">
              <h3 className="section-title">
                <GraduationCap size={24} />
                Formation
              </h3>
              <div className="timeline">
                {education.map((edu, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">{edu.degree}</h4>
                      <p className="timeline-subtitle">{edu.institution}</p>
                      <div className="timeline-meta">
                        <span className="timeline-year">{edu.year}</span>
                        {edu.mention && <span className="timeline-mention">{edu.mention}</span>}
                      </div>
                      <p className="timeline-description">{edu.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="section">
              <h3 className="section-title">
                <Briefcase size={24} />
                Expérience professionnelle
              </h3>
              <div className="experience-grid">
                {experience.map((exp, index) => (
                  <div key={index} className="experience-card">
                    <div className="experience-header">
                      <h4 className="experience-title">{exp.title}</h4>
                      <span className="experience-period">{exp.period}</span>
                    </div>
                    <p className="experience-company">{exp.company}</p>
                    <p className="experience-description">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="section">
              <h3 className="section-title">
                <Award size={24} />
                Réalisations
              </h3>
              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-icon">
                      <achievement.icon size={24} />
                    </div>
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Tab */}
        {activeTab === 'project' && (
          <div className="tab-content">
            <div className="project-intro">
              <h2 className="intro-title">Système de Gestion de Bibliothèque</h2>
              <p className="intro-description">
                Une solution moderne et complète pour la gestion des bibliothèques, développée avec les 
                dernières technologies web. Ce projet vise à simplifier et moderniser la gestion des 
                collections de livres, des emprunteurs et des transactions dans les établissements éducatifs.
              </p>
            </div>

            <div className="features-grid">
              {projectFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="project-details">
              <div className="detail-card">
                <h3 className="detail-title">Objectifs du projet</h3>
                <ul className="detail-list">
                  <li>Moderniser la gestion des bibliothèques scolaires et universitaires</li>
                  <li>Simplifier les processus d'emprunt et de retour de livres</li>
                  <li>Fournir des statistiques et analyses en temps réel</li>
                  <li>Offrir une interface intuitive et accessible</li>
                  <li>Garantir la gratuité et l'open source pour l'éducation</li>
                </ul>
              </div>

              <div className="detail-card">
                <h3 className="detail-title">Fonctionnalités principales</h3>
                <ul className="detail-list">
                  <li>Gestion complète des livres (ajout, modification, suppression)</li>
                  <li>Système d'emprunteurs avec différents types (étudiants, personnel)</li>
                  <li>Processus d'emprunt et de retour simplifiés</li>
                  <li>Historique détaillé des transactions</li>
                  <li>Génération de rapports et exports CSV</li>
                  <li>Interface responsive adaptée à tous les appareils</li>
                </ul>
              </div>
            </div>

            <div className="project-mission">
              <div className="mission-icon">
                <Heart size={32} />
              </div>
              <div className="mission-content">
                <h3 className="mission-title">Notre mission</h3>
                <p className="mission-description">
                  Démocratiser l'accès aux outils de gestion modernes pour les bibliothèques, 
                  en particulier dans les établissements éducatifs. Nous croyons que chaque 
                  institution, quelle que soit sa taille ou ses ressources, devrait avoir accès 
                  à des solutions technologiques de qualité pour améliorer l'expérience de ses utilisateurs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Technologies Tab */}
        {activeTab === 'technologies' && (
          <div className="tab-content">
            <div className="tech-intro">
              <h2 className="intro-title">Stack Technologique</h2>
              <p className="intro-description">
                Ce projet utilise des technologies modernes et éprouvées pour garantir performance, 
                sécurité et maintenabilité. Voici un aperçu des outils et frameworks utilisés.
              </p>
            </div>

            <div className="tech-categories">
              <div className="tech-category">
                <h3 className="tech-title">Frontend</h3>
                <div className="tech-tags">
                  {technologies.frontend.map((tech, index) => (
                    <span key={index} className="tech-tag frontend">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Backend</h3>
                <div className="tech-tags">
                  {technologies.backend.map((tech, index) => (
                    <span key={index} className="tech-tag backend">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Mobile</h3>
                <div className="tech-tags">
                  {technologies.mobile.map((tech, index) => (
                    <span key={index} className="tech-tag mobile">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Intelligence Artificielle</h3>
                <div className="tech-tags">
                  {technologies.ai.map((tech, index) => (
                    <span key={index} className="tech-tag ai">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Design</h3>
                <div className="tech-tags">
                  {technologies.design.map((tech, index) => (
                    <span key={index} className="tech-tag design">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Base de données</h3>
                <div className="tech-tags">
                  {technologies.database.map((tech, index) => (
                    <span key={index} className="tech-tag database">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Outils & DevOps</h3>
                <div className="tech-tags">
                  {technologies.tools.map((tech, index) => (
                    <span key={index} className="tech-tag tools">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="architecture-info">
              <h3 className="architecture-title">Architecture</h3>
              <div className="architecture-description">
                <p>
                  Le système est construit avec une architecture moderne séparant clairement 
                  les couches de présentation, logique métier et données. L'interface utilisateur 
                  est développée en React avec TypeScript pour une meilleure maintenabilité.
                </p>
                <p>
                  L'application utilise Electron pour offrir une expérience desktop native 
                  tout en conservant la flexibilité du web. La base de données SQLite garantit 
                  une installation simple et une portabilité maximale.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .about-page {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
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
        
        .project-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(243, 238, 217, 0.1);
          padding: 20px 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #F3EED9;
          display: block;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin-top: 4px;
        }
        
        .about-content {
          padding: 0 32px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .tabs-navigation {
          display: flex;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          position: sticky;
          top: 20px;
          z-index: 10;
        }
        
        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: #4A4A4A;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }
        
        .tab-button:hover {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
        }
        
        .tab-button.active {
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
          color: #F3EED9;
          box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3);
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .developer-hero {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .developer-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }
        
        .developer-name {
          font-size: 28px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        
        .developer-title {
          font-size: 16px;
          color: #607D8B;
          margin: 0 0 16px 0;
          font-weight: 600;
        }
        
        .developer-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4A4A4A;
          font-size: 14px;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .info-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 20px 0;
        }
        
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .contact-item {
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
        
        .contact-item:hover {
          background: rgba(96, 125, 139, 0.1);
          transform: translateY(-1px);
        }
        
        .position-title {
          font-size: 16px;
          font-weight: 700;
          color: #607D8B;
          margin-bottom: 8px;
        }
        
        .position-description {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }
        
        .section {
          margin-bottom: 48px;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 24px 0;
        }
        
        .timeline {
          position: relative;
          padding-left: 32px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 16px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #607D8B, #455A64);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 32px;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .timeline-marker {
          position: absolute;
          left: -40px;
          top: 24px;
          width: 12px;
          height: 12px;
          background: #607D8B;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 0 2px #607D8B;
        }
        
        .timeline-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .timeline-subtitle {
          font-size: 14px;
          color: #607D8B;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        
        .timeline-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }
        
        .timeline-year {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .timeline-mention {
          background: #4CAF50;
          color: #FFFFFF;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .timeline-description {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }
        
        .experience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .experience-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .experience-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .experience-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
          flex: 1;
        }
        
        .experience-period {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .experience-company {
          font-size: 14px;
          color: #607D8B;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .experience-description {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }
        
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .achievement-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .achievement-icon {
          width: 48px;
          height: 48px;
          background: rgba(96, 125, 139, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #607D8B;
          margin: 0 auto 16px;
        }
        
        .achievement-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .achievement-description {
          font-size: 14px;
          color: #4A4A4A;
          margin: 0;
        }
        
        .project-intro {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          text-align: center;
        }
        
        .intro-title {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          letter-spacing: -0.3px;
        }
        
        .intro-description {
          font-size: 16px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .feature-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .feature-icon {
          width: 56px;
          height: 56px;
          background: rgba(96, 125, 139, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #607D8B;
          margin: 0 auto 20px;
        }
        
        .feature-title {
          font-size: 20px;
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
        
        .project-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .detail-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .detail-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .detail-list li {
          padding: 8px 0;
          border-bottom: 1px solid #F3EED9;
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          position: relative;
          padding-left: 20px;
        }
        
        .detail-list li::before {
          content: '•';
          color: #607D8B;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .detail-list li:last-child {
          border-bottom: none;
        }
        
        .project-mission {
          display: flex;
          gap: 24px;
          background: linear-gradient(135deg, rgba(96, 125, 139, 0.05) 0%, rgba(69, 90, 100, 0.05) 100%);
          border: 1px solid rgba(96, 125, 139, 0.2);
          border-radius: 20px;
          padding: 32px;
        }
        
        .mission-icon {
          width: 64px;
          height: 64px;
          background: #607D8B;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        
        .mission-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .mission-description {
          font-size: 16px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0;
        }
        
        .tech-intro {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          text-align: center;
        }
        
        .tech-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .tech-category {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .tech-title {
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
        .tech-tag.mobile { background: #E91E63; }
        .tech-tag.ai { background: #9C27B0; }
        .tech-tag.design { background: #FF9800; }
        .tech-tag.database { background: #607D8B; }
        .tech-tag.tools { background: #6E6E6E; }
        
        .architecture-info {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .architecture-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .architecture-description p {
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }
        
        .architecture-description p:last-child {
          margin-bottom: 0;
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
          
          .project-stats {
            flex-direction: column;
            gap: 16px;
          }
          
          .stat-item {
            justify-content: center;
          }
          
          .about-content {
            padding: 0 16px 32px;
          }
          
          .tabs-navigation {
            flex-direction: column;
            gap: 8px;
          }
          
          .tab-button {
            justify-content: flex-start;
          }
          
          .developer-hero {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .developer-meta {
            justify-content: center;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline {
            padding-left: 24px;
          }
          
          .timeline-marker {
            left: -32px;
          }
          
          .experience-grid {
            grid-template-columns: 1fr;
          }
          
          .achievements-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .project-details {
            grid-template-columns: 1fr;
          }
          
          .project-mission {
            flex-direction: column;
            text-align: center;
          }
          
          .tech-categories {
            grid-template-columns: 1fr;
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
          
          .intro-title {
            font-size: 28px;
          }
          
          .developer-name {
            font-size: 24px;
          }
          
          .experience-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .experience-period {
            align-self: flex-start;
          }
          
          .timeline-item {
            padding: 20px;
          }
          
          .feature-card,
          .achievement-card {
            padding: 20px;
          }
          
          .project-mission {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};