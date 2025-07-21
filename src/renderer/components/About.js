"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var About = function (_a) {
    var onClose = _a.onClose;
    var _b = (0, react_1.useState)('developer'), activeTab = _b[0], setActiveTab = _b[1];
    var developerInfo = {
        name: 'CHEUDJEU TEFOYE CÉDRIC BASILIO',
        title: 'Expert en Développement Informatique & Intelligence Artificielle',
        location: 'Douala, Cameroun',
        phone: '+237 652 761 931',
        email: 'cedrictefoye@gmail.com',
        currentPosition: 'Responsable Cellule Informatique - Faculté de Médecine, Université de Douala',
        experience: '4+ ans d\'expérience',
        avatar: '👨‍💻'
    };
    var education = [
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
    var experience = [
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
    var technologies = {
        frontend: ['React.js', 'Vue.js', 'HTML5/CSS3', 'JavaScript', 'TypeScript'],
        backend: ['Node.js', 'PHP/Laravel', 'Python', 'Express.js'],
        mobile: ['React Native', 'Flutter'],
        ai: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Machine Learning', 'NLP'],
        design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
        database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
        tools: ['Git/GitHub', 'Docker', 'AWS']
    };
    var projectFeatures = [
        {
            icon: lucide_react_1.BookOpen,
            title: 'Gestion complète',
            description: 'Système complet de gestion de bibliothèque avec emprunteurs, livres et historique'
        },
        {
            icon: lucide_react_1.Users,
            title: 'Multi-utilisateurs',
            description: 'Support pour étudiants et personnel avec différents types d\'accès'
        },
        {
            icon: lucide_react_1.Zap,
            title: 'Interface moderne',
            description: 'Design contemporain avec animations fluides et expérience utilisateur optimisée'
        },
        {
            icon: lucide_react_1.Heart,
            title: 'Open Source',
            description: 'Code source libre et gratuit pour toute la communauté éducative'
        }
    ];
    var achievements = [
        {
            icon: lucide_react_1.Trophy,
            title: 'Halkaton 2022',
            description: 'Hackathon de 24 heures'
        },
        {
            icon: lucide_react_1.Award,
            title: 'MountainHack 2020',
            description: 'Hackathon de 24 heures, Dschang'
        },
        {
            icon: lucide_react_1.Star,
            title: 'Master avec mention',
            description: 'Intelligence Artificielle - 2023'
        }
    ];
    var tabs = [
        { id: 'developer', label: 'Développeur', icon: lucide_react_1.User },
        { id: 'project', label: 'Le Projet', icon: lucide_react_1.BookOpen },
        { id: 'technologies', label: 'Technologies', icon: lucide_react_1.Code }
    ];
    return (<div className="about-page">
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
              <lucide_react_1.Info size={48}/>
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
              <lucide_react_1.Sparkles size={24}/>
              <div className="stat-content">
                <span className="stat-number">2024</span>
                <span className="stat-label">Année de création</span>
              </div>
            </div>
            <div className="stat-item">
              <lucide_react_1.Code size={24}/>
              <div className="stat-content">
                <span className="stat-number">100%</span>
                <span className="stat-label">TypeScript</span>
              </div>
            </div>
            <div className="stat-item">
              <lucide_react_1.Heart size={24}/>
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
          {tabs.map(function (tab) { return (<button key={tab.id} className={"tab-button ".concat(activeTab === tab.id ? 'active' : '')} onClick={function () { return setActiveTab(tab.id); }}>
              <tab.icon size={20}/>
              <span>{tab.label}</span>
            </button>); })}
        </div>

        {/* Developer Tab */}
        {activeTab === 'developer' && (<div className="tab-content">
            <div className="developer-hero">
              <div className="developer-avatar">
                <span className="avatar-emoji">{developerInfo.avatar}</span>
              </div>
              <div className="developer-info">
                <h2 className="developer-name">{developerInfo.name}</h2>
                <p className="developer-title">{developerInfo.title}</p>
                <div className="developer-meta">
                  <div className="meta-item">
                    <lucide_react_1.MapPin size={16}/>
                    <span>{developerInfo.location}</span>
                  </div>
                  <div className="meta-item">
                    <lucide_react_1.Briefcase size={16}/>
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
                  <a href={"mailto:".concat(developerInfo.email)} className="contact-item">
                    <lucide_react_1.Mail size={20}/>
                    <span>{developerInfo.email}</span>
                    <lucide_react_1.ExternalLink size={16}/>
                  </a>
                  <a href={"tel:".concat(developerInfo.phone)} className="contact-item">
                    <lucide_react_1.Phone size={20}/>
                    <span>{developerInfo.phone}</span>
                    <lucide_react_1.ExternalLink size={16}/>
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
                <lucide_react_1.GraduationCap size={24}/>
                Formation
              </h3>
              <div className="timeline">
                {education.map(function (edu, index) { return (<div key={index} className="timeline-item">
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
                  </div>); })}
              </div>
            </div>

            {/* Experience */}
            <div className="section">
              <h3 className="section-title">
                <lucide_react_1.Briefcase size={24}/>
                Expérience professionnelle
              </h3>
              <div className="experience-grid">
                {experience.map(function (exp, index) { return (<div key={index} className="experience-card">
                    <div className="experience-header">
                      <h4 className="experience-title">{exp.title}</h4>
                      <span className="experience-period">{exp.period}</span>
                    </div>
                    <p className="experience-company">{exp.company}</p>
                    <p className="experience-description">{exp.description}</p>
                  </div>); })}
              </div>
            </div>

            {/* Achievements */}
            <div className="section">
              <h3 className="section-title">
                <lucide_react_1.Award size={24}/>
                Réalisations
              </h3>
              <div className="achievements-grid">
                {achievements.map(function (achievement, index) { return (<div key={index} className="achievement-card">
                    <div className="achievement-icon">
                      <achievement.icon size={24}/>
                    </div>
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>); })}
              </div>
            </div>
          </div>)}

        {/* Project Tab */}
        {activeTab === 'project' && (<div className="tab-content">
            <div className="project-intro">
              <h2 className="intro-title">Système de Gestion de Bibliothèque</h2>
              <p className="intro-description">
                Une solution moderne et complète pour la gestion des bibliothèques, développée avec les 
                dernières technologies web. Ce projet vise à simplifier et moderniser la gestion des 
                collections de livres, des emprunteurs et des transactions dans les établissements éducatifs.
              </p>
            </div>

            <div className="features-grid">
              {projectFeatures.map(function (feature, index) { return (<div key={index} className="feature-card">
                  <div className="feature-icon">
                    <feature.icon size={24}/>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>); })}
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
                <lucide_react_1.Heart size={32}/>
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
          </div>)}

        {/* Technologies Tab */}
        {activeTab === 'technologies' && (<div className="tab-content">
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
                  {technologies.frontend.map(function (tech, index) { return (<span key={index} className="tech-tag frontend">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Backend</h3>
                <div className="tech-tags">
                  {technologies.backend.map(function (tech, index) { return (<span key={index} className="tech-tag backend">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Mobile</h3>
                <div className="tech-tags">
                  {technologies.mobile.map(function (tech, index) { return (<span key={index} className="tech-tag mobile">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Intelligence Artificielle</h3>
                <div className="tech-tags">
                  {technologies.ai.map(function (tech, index) { return (<span key={index} className="tech-tag ai">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Design</h3>
                <div className="tech-tags">
                  {technologies.design.map(function (tech, index) { return (<span key={index} className="tech-tag design">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Base de données</h3>
                <div className="tech-tags">
                  {technologies.database.map(function (tech, index) { return (<span key={index} className="tech-tag database">{tech}</span>); })}
                </div>
              </div>

              <div className="tech-category">
                <h3 className="tech-title">Outils & DevOps</h3>
                <div className="tech-tags">
                  {technologies.tools.map(function (tech, index) { return (<span key={index} className="tech-tag tools">{tech}</span>); })}
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
          </div>)}
      </div>

      <style>{"\n        .about-page {\n          height: 100%;\n          overflow-y: auto;\n          background: #FAF9F6;\n        }\n        \n        .hero-section {\n          position: relative;\n          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);\n          color: #F3EED9;\n          padding: 48px 32px;\n          overflow: hidden;\n        }\n        \n        .hero-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n        \n        .hero-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),\n            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);\n          animation: drift 20s ease-in-out infinite;\n        }\n        \n        @keyframes drift {\n          0%, 100% { transform: translate(0, 0) rotate(0deg); }\n          33% { transform: translate(30px, -30px) rotate(1deg); }\n          66% { transform: translate(-20px, 20px) rotate(-1deg); }\n        }\n        \n        .hero-content {\n          position: relative;\n          z-index: 1;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .back-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px 20px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          font-size: 14px;\n          font-weight: 500;\n          margin-bottom: 32px;\n          width: fit-content;\n        }\n        \n        .back-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: translateX(-4px);\n        }\n        \n        .hero-main {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          margin-bottom: 40px;\n          text-align: center;\n          flex-direction: column;\n        }\n        \n        .hero-icon {\n          width: 96px;\n          height: 96px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 24px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .hero-title {\n          font-size: 42px;\n          font-weight: 800;\n          margin: 0 0 16px 0;\n          line-height: 1.2;\n          letter-spacing: -0.5px;\n        }\n        \n        .hero-subtitle {\n          font-size: 20px;\n          opacity: 0.9;\n          margin: 0;\n          line-height: 1.5;\n          max-width: 600px;\n        }\n        \n        .project-stats {\n          display: flex;\n          justify-content: center;\n          gap: 40px;\n          flex-wrap: wrap;\n        }\n        \n        .stat-item {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          background: rgba(243, 238, 217, 0.1);\n          padding: 20px 24px;\n          border-radius: 16px;\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.2);\n        }\n        \n        .stat-number {\n          font-size: 24px;\n          font-weight: 800;\n          color: #F3EED9;\n          display: block;\n          line-height: 1;\n        }\n        \n        .stat-label {\n          font-size: 14px;\n          color: rgba(243, 238, 217, 0.9);\n          margin-top: 4px;\n        }\n        \n        .about-content {\n          padding: 0 32px 48px;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .tabs-navigation {\n          display: flex;\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 8px;\n          margin-bottom: 32px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          position: sticky;\n          top: 20px;\n          z-index: 10;\n        }\n        \n        .tab-button {\n          flex: 1;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          gap: 8px;\n          padding: 16px 20px;\n          border: none;\n          background: transparent;\n          color: #6E6E6E;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          font-size: 14px;\n          font-weight: 600;\n        }\n        \n        .tab-button:hover {\n          background: rgba(96, 125, 139, 0.1);\n          color: #607D8B;\n        }\n        \n        .tab-button.active {\n          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);\n          color: #F3EED9;\n          box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3);\n        }\n        \n        .tab-content {\n          animation: fadeIn 0.3s ease-out;\n        }\n        \n        @keyframes fadeIn {\n          from { opacity: 0; transform: translateY(20px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        \n        .developer-hero {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          background: #FFFFFF;\n          border-radius: 20px;\n          padding: 32px;\n          margin-bottom: 32px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .developer-avatar {\n          width: 80px;\n          height: 80px;\n          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);\n          border-radius: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 32px;\n          flex-shrink: 0;\n        }\n        \n        .developer-name {\n          font-size: 28px;\n          font-weight: 800;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .developer-title {\n          font-size: 16px;\n          color: #607D8B;\n          margin: 0 0 16px 0;\n          font-weight: 600;\n        }\n        \n        .developer-meta {\n          display: flex;\n          gap: 24px;\n          flex-wrap: wrap;\n        }\n        \n        .meta-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n          font-size: 14px;\n        }\n        \n        .content-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 24px;\n          margin-bottom: 48px;\n        }\n        \n        .info-card {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .card-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 20px 0;\n        }\n        \n        .contact-list {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .contact-item {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 12px 16px;\n          background: rgba(96, 125, 139, 0.05);\n          border-radius: 12px;\n          color: #2E2E2E;\n          text-decoration: none;\n          transition: all 0.2s ease;\n        }\n        \n        .contact-item:hover {\n          background: rgba(96, 125, 139, 0.1);\n          transform: translateY(-1px);\n        }\n        \n        .position-title {\n          font-size: 16px;\n          font-weight: 700;\n          color: #607D8B;\n          margin-bottom: 8px;\n        }\n        \n        .position-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n        }\n        \n        .section {\n          margin-bottom: 48px;\n        }\n        \n        .section-title {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 24px 0;\n        }\n        \n        .timeline {\n          position: relative;\n          padding-left: 32px;\n        }\n        \n        .timeline::before {\n          content: '';\n          position: absolute;\n          left: 16px;\n          top: 0;\n          bottom: 0;\n          width: 2px;\n          background: linear-gradient(to bottom, #607D8B, #455A64);\n        }\n        \n        .timeline-item {\n          position: relative;\n          margin-bottom: 32px;\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .timeline-marker {\n          position: absolute;\n          left: -40px;\n          top: 24px;\n          width: 12px;\n          height: 12px;\n          background: #607D8B;\n          border-radius: 50%;\n          border: 3px solid #FFFFFF;\n          box-shadow: 0 0 0 2px #607D8B;\n        }\n        \n        .timeline-title {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .timeline-subtitle {\n          font-size: 14px;\n          color: #607D8B;\n          margin: 0 0 8px 0;\n          font-weight: 600;\n        }\n        \n        .timeline-meta {\n          display: flex;\n          gap: 16px;\n          margin-bottom: 8px;\n        }\n        \n        .timeline-year {\n          background: rgba(96, 125, 139, 0.1);\n          color: #607D8B;\n          padding: 4px 8px;\n          border-radius: 8px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .timeline-mention {\n          background: #4CAF50;\n          color: #FFFFFF;\n          padding: 4px 8px;\n          border-radius: 8px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .timeline-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n        }\n        \n        .experience-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n          gap: 24px;\n        }\n        \n        .experience-card {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          transition: all 0.3s ease;\n        }\n        \n        .experience-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);\n        }\n        \n        .experience-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: flex-start;\n          margin-bottom: 8px;\n        }\n        \n        .experience-title {\n          font-size: 16px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n          flex: 1;\n        }\n        \n        .experience-period {\n          background: rgba(96, 125, 139, 0.1);\n          color: #607D8B;\n          padding: 4px 8px;\n          border-radius: 8px;\n          font-size: 11px;\n          font-weight: 600;\n          white-space: nowrap;\n        }\n        \n        .experience-company {\n          font-size: 14px;\n          color: #607D8B;\n          font-weight: 600;\n          margin: 0 0 12px 0;\n        }\n        \n        .experience-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n        }\n        \n        .achievements-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n          gap: 20px;\n        }\n        \n        .achievement-card {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 20px;\n          text-align: center;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          transition: all 0.3s ease;\n        }\n        \n        .achievement-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);\n        }\n        \n        .achievement-icon {\n          width: 48px;\n          height: 48px;\n          background: rgba(96, 125, 139, 0.1);\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #607D8B;\n          margin: 0 auto 16px;\n        }\n        \n        .achievement-title {\n          font-size: 16px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n        }\n        \n        .achievement-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .project-intro {\n          background: #FFFFFF;\n          border-radius: 20px;\n          padding: 32px;\n          margin-bottom: 32px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          text-align: center;\n        }\n        \n        .intro-title {\n          font-size: 32px;\n          font-weight: 800;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .intro-description {\n          font-size: 16px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n          max-width: 800px;\n          margin: 0 auto;\n        }\n        \n        .features-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n          gap: 24px;\n          margin-bottom: 48px;\n        }\n        \n        .feature-card {\n          background: #FFFFFF;\n          border-radius: 20px;\n          padding: 28px;\n          text-align: center;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          transition: all 0.3s ease;\n        }\n        \n        .feature-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);\n        }\n        \n        .feature-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(96, 125, 139, 0.1);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #607D8B;\n          margin: 0 auto 20px;\n        }\n        \n        .feature-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 12px 0;\n        }\n        \n        .feature-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n        }\n        \n        .project-details {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 24px;\n          margin-bottom: 48px;\n        }\n        \n        .detail-card {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .detail-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n        }\n        \n        .detail-list {\n          list-style: none;\n          padding: 0;\n          margin: 0;\n        }\n        \n        .detail-list li {\n          padding: 8px 0;\n          border-bottom: 1px solid #F3EED9;\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          position: relative;\n          padding-left: 20px;\n        }\n        \n        .detail-list li::before {\n          content: '\u2022';\n          color: #607D8B;\n          position: absolute;\n          left: 0;\n          font-weight: bold;\n        }\n        \n        .detail-list li:last-child {\n          border-bottom: none;\n        }\n        \n        .project-mission {\n          display: flex;\n          gap: 24px;\n          background: linear-gradient(135deg, rgba(96, 125, 139, 0.05) 0%, rgba(69, 90, 100, 0.05) 100%);\n          border: 1px solid rgba(96, 125, 139, 0.2);\n          border-radius: 20px;\n          padding: 32px;\n        }\n        \n        .mission-icon {\n          width: 64px;\n          height: 64px;\n          background: #607D8B;\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #FFFFFF;\n          flex-shrink: 0;\n        }\n        \n        .mission-title {\n          font-size: 24px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 12px 0;\n        }\n        \n        .mission-description {\n          font-size: 16px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0;\n        }\n        \n        .tech-intro {\n          background: #FFFFFF;\n          border-radius: 20px;\n          padding: 32px;\n          margin-bottom: 32px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n          text-align: center;\n        }\n        \n        .tech-categories {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n          gap: 24px;\n          margin-bottom: 48px;\n        }\n        \n        .tech-category {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .tech-title {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n        }\n        \n        .tech-tags {\n          display: flex;\n          flex-wrap: wrap;\n          gap: 8px;\n        }\n        \n        .tech-tag {\n          padding: 6px 12px;\n          border-radius: 12px;\n          font-size: 12px;\n          font-weight: 600;\n          color: #FFFFFF;\n        }\n        \n        .tech-tag.frontend { background: #3E5C49; }\n        .tech-tag.backend { background: #C2571B; }\n        .tech-tag.mobile { background: #E91E63; }\n        .tech-tag.ai { background: #9C27B0; }\n        .tech-tag.design { background: #FF9800; }\n        .tech-tag.database { background: #607D8B; }\n        .tech-tag.tools { background: #6E6E6E; }\n        \n        .architecture-info {\n          background: #FFFFFF;\n          border-radius: 16px;\n          padding: 24px;\n          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);\n          border: 1px solid #E5DCC2;\n        }\n        \n        .architecture-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n        }\n        \n        .architecture-description p {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.6;\n          margin: 0 0 16px 0;\n        }\n        \n        .architecture-description p:last-child {\n          margin-bottom: 0;\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 768px) {\n          .hero-section {\n            padding: 32px 16px;\n          }\n          \n          .hero-title {\n            font-size: 32px;\n          }\n          \n          .hero-subtitle {\n            font-size: 18px;\n          }\n          \n          .project-stats {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .stat-item {\n            justify-content: center;\n          }\n          \n          .about-content {\n            padding: 0 16px 32px;\n          }\n          \n          .tabs-navigation {\n            flex-direction: column;\n            gap: 8px;\n          }\n          \n          .tab-button {\n            justify-content: flex-start;\n          }\n          \n          .developer-hero {\n            flex-direction: column;\n            text-align: center;\n            gap: 20px;\n          }\n          \n          .developer-meta {\n            justify-content: center;\n          }\n          \n          .content-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .timeline {\n            padding-left: 24px;\n          }\n          \n          .timeline-marker {\n            left: -32px;\n          }\n          \n          .experience-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .achievements-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .features-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .project-details {\n            grid-template-columns: 1fr;\n          }\n          \n          .project-mission {\n            flex-direction: column;\n            text-align: center;\n          }\n          \n          .tech-categories {\n            grid-template-columns: 1fr;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .hero-main {\n            gap: 16px;\n          }\n          \n          .hero-icon {\n            width: 72px;\n            height: 72px;\n          }\n          \n          .hero-title {\n            font-size: 28px;\n          }\n          \n          .intro-title {\n            font-size: 28px;\n          }\n          \n          .developer-name {\n            font-size: 24px;\n          }\n          \n          .experience-header {\n            flex-direction: column;\n            gap: 8px;\n          }\n          \n          .experience-period {\n            align-self: flex-start;\n          }\n          \n          .timeline-item {\n            padding: 20px;\n          }\n          \n          .feature-card,\n          .achievement-card {\n            padding: 20px;\n          }\n          \n          .project-mission {\n            padding: 24px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.About = About;
