"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const About = ({ onClose }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('developer');
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
    const achievements = [
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
    const tabs = [
        { id: 'developer', label: 'Développeur', icon: lucide_react_1.User },
        { id: 'project', label: 'Le Projet', icon: lucide_react_1.BookOpen },
        { id: 'technologies', label: 'Technologies', icon: lucide_react_1.Code }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "about-page", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hero-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-background", children: (0, jsx_runtime_1.jsx)("div", { className: "hero-pattern" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-content", children: [(0, jsx_runtime_1.jsxs)("button", { className: "back-button", onClick: onClose, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Retour" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-main", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 48 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "hero-title", children: "\u00C0 propos du projet" }), (0, jsx_runtime_1.jsx)("p", { className: "hero-subtitle", children: "D\u00E9couvrez l'histoire, les technologies et l'\u00E9quipe derri\u00E8re ce syst\u00E8me de gestion de biblioth\u00E8que" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "project-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: "2024" }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Ann\u00E9e de cr\u00E9ation" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: "100%" }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "TypeScript" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 24 }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-number", children: "MIT" }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Licence libre" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "about-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "tabs-navigation", children: tabs.map((tab) => ((0, jsx_runtime_1.jsxs)("button", { className: `tab-button ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id), children: [(0, jsx_runtime_1.jsx)(tab.icon, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: tab.label })] }, tab.id))) }), activeTab === 'developer' && ((0, jsx_runtime_1.jsxs)("div", { className: "tab-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "developer-hero", children: [(0, jsx_runtime_1.jsx)("div", { className: "developer-avatar", children: (0, jsx_runtime_1.jsx)("span", { className: "avatar-emoji", children: developerInfo.avatar }) }), (0, jsx_runtime_1.jsxs)("div", { className: "developer-info", children: [(0, jsx_runtime_1.jsx)("h2", { className: "developer-name", children: developerInfo.name }), (0, jsx_runtime_1.jsx)("p", { className: "developer-title", children: developerInfo.title }), (0, jsx_runtime_1.jsxs)("div", { className: "developer-meta", children: [(0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: developerInfo.location })] }), (0, jsx_runtime_1.jsxs)("div", { className: "meta-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Briefcase, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: developerInfo.experience })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "content-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "card-title", children: "Contact" }), (0, jsx_runtime_1.jsxs)("div", { className: "contact-list", children: [(0, jsx_runtime_1.jsxs)("a", { href: `mailto:${developerInfo.email}`, className: "contact-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: developerInfo.email }), (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { size: 16 })] }), (0, jsx_runtime_1.jsxs)("a", { href: `tel:${developerInfo.phone}`, className: "contact-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: developerInfo.phone }), (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { size: 16 })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "card-title", children: "Poste actuel" }), (0, jsx_runtime_1.jsxs)("div", { className: "position-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "position-title", children: developerInfo.currentPosition }), (0, jsx_runtime_1.jsx)("p", { className: "position-description", children: "Administration des syst\u00E8mes informatiques, d\u00E9veloppement d'applications de gestion acad\u00E9mique et impl\u00E9mentation de solutions d'IA pour l'optimisation des processus." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "section-title", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GraduationCap, { size: 24 }), "Formation"] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline", children: education.map((edu, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "timeline-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-marker" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-content", children: [(0, jsx_runtime_1.jsx)("h4", { className: "timeline-title", children: edu.degree }), (0, jsx_runtime_1.jsx)("p", { className: "timeline-subtitle", children: edu.institution }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-meta", children: [(0, jsx_runtime_1.jsx)("span", { className: "timeline-year", children: edu.year }), edu.mention && (0, jsx_runtime_1.jsx)("span", { className: "timeline-mention", children: edu.mention })] }), (0, jsx_runtime_1.jsx)("p", { className: "timeline-description", children: edu.specialization })] })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "section-title", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Briefcase, { size: 24 }), "Exp\u00E9rience professionnelle"] }), (0, jsx_runtime_1.jsx)("div", { className: "experience-grid", children: experience.map((exp, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "experience-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "experience-header", children: [(0, jsx_runtime_1.jsx)("h4", { className: "experience-title", children: exp.title }), (0, jsx_runtime_1.jsx)("span", { className: "experience-period", children: exp.period })] }), (0, jsx_runtime_1.jsx)("p", { className: "experience-company", children: exp.company }), (0, jsx_runtime_1.jsx)("p", { className: "experience-description", children: exp.description })] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "section", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "section-title", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 24 }), "R\u00E9alisations"] }), (0, jsx_runtime_1.jsx)("div", { className: "achievements-grid", children: achievements.map((achievement, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "achievement-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "achievement-icon", children: (0, jsx_runtime_1.jsx)(achievement.icon, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h4", { className: "achievement-title", children: achievement.title }), (0, jsx_runtime_1.jsx)("p", { className: "achievement-description", children: achievement.description })] }, index))) })] })] })), activeTab === 'project' && ((0, jsx_runtime_1.jsxs)("div", { className: "tab-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "project-intro", children: [(0, jsx_runtime_1.jsx)("h2", { className: "intro-title", children: "Syst\u00E8me de Gestion de Biblioth\u00E8que" }), (0, jsx_runtime_1.jsx)("p", { className: "intro-description", children: "Une solution moderne et compl\u00E8te pour la gestion des biblioth\u00E8ques, d\u00E9velopp\u00E9e avec les derni\u00E8res technologies web. Ce projet vise \u00E0 simplifier et moderniser la gestion des collections de livres, des emprunteurs et des transactions dans les \u00E9tablissements \u00E9ducatifs." })] }), (0, jsx_runtime_1.jsx)("div", { className: "features-grid", children: projectFeatures.map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "feature-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "feature-icon", children: (0, jsx_runtime_1.jsx)(feature.icon, { size: 24 }) }), (0, jsx_runtime_1.jsx)("h3", { className: "feature-title", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { className: "feature-description", children: feature.description })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "project-details", children: [(0, jsx_runtime_1.jsxs)("div", { className: "detail-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "detail-title", children: "Objectifs du projet" }), (0, jsx_runtime_1.jsxs)("ul", { className: "detail-list", children: [(0, jsx_runtime_1.jsx)("li", { children: "Moderniser la gestion des biblioth\u00E8ques scolaires et universitaires" }), (0, jsx_runtime_1.jsx)("li", { children: "Simplifier les processus d'emprunt et de retour de livres" }), (0, jsx_runtime_1.jsx)("li", { children: "Fournir des statistiques et analyses en temps r\u00E9el" }), (0, jsx_runtime_1.jsx)("li", { children: "Offrir une interface intuitive et accessible" }), (0, jsx_runtime_1.jsx)("li", { children: "Garantir la gratuit\u00E9 et l'open source pour l'\u00E9ducation" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "detail-title", children: "Fonctionnalit\u00E9s principales" }), (0, jsx_runtime_1.jsxs)("ul", { className: "detail-list", children: [(0, jsx_runtime_1.jsx)("li", { children: "Gestion compl\u00E8te des livres (ajout, modification, suppression)" }), (0, jsx_runtime_1.jsx)("li", { children: "Syst\u00E8me d'emprunteurs avec diff\u00E9rents types (\u00E9tudiants, personnel)" }), (0, jsx_runtime_1.jsx)("li", { children: "Processus d'emprunt et de retour simplifi\u00E9s" }), (0, jsx_runtime_1.jsx)("li", { children: "Historique d\u00E9taill\u00E9 des transactions" }), (0, jsx_runtime_1.jsx)("li", { children: "G\u00E9n\u00E9ration de rapports et exports CSV" }), (0, jsx_runtime_1.jsx)("li", { children: "Interface responsive adapt\u00E9e \u00E0 tous les appareils" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "project-mission", children: [(0, jsx_runtime_1.jsx)("div", { className: "mission-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 32 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mission-content", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mission-title", children: "Notre mission" }), (0, jsx_runtime_1.jsx)("p", { className: "mission-description", children: "D\u00E9mocratiser l'acc\u00E8s aux outils de gestion modernes pour les biblioth\u00E8ques, en particulier dans les \u00E9tablissements \u00E9ducatifs. Nous croyons que chaque institution, quelle que soit sa taille ou ses ressources, devrait avoir acc\u00E8s \u00E0 des solutions technologiques de qualit\u00E9 pour am\u00E9liorer l'exp\u00E9rience de ses utilisateurs." })] })] })] })), activeTab === 'technologies' && ((0, jsx_runtime_1.jsxs)("div", { className: "tab-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "tech-intro", children: [(0, jsx_runtime_1.jsx)("h2", { className: "intro-title", children: "Stack Technologique" }), (0, jsx_runtime_1.jsx)("p", { className: "intro-description", children: "Ce projet utilise des technologies modernes et \u00E9prouv\u00E9es pour garantir performance, s\u00E9curit\u00E9 et maintenabilit\u00E9. Voici un aper\u00E7u des outils et frameworks utilis\u00E9s." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-categories", children: [(0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Frontend" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.frontend.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag frontend", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Backend" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.backend.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag backend", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Mobile" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.mobile.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag mobile", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Intelligence Artificielle" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.ai.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag ai", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Design" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.design.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag design", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Base de donn\u00E9es" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.database.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag database", children: tech }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "tech-category", children: [(0, jsx_runtime_1.jsx)("h3", { className: "tech-title", children: "Outils & DevOps" }), (0, jsx_runtime_1.jsx)("div", { className: "tech-tags", children: technologies.tools.map((tech, index) => ((0, jsx_runtime_1.jsx)("span", { className: "tech-tag tools", children: tech }, index))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "architecture-info", children: [(0, jsx_runtime_1.jsx)("h3", { className: "architecture-title", children: "Architecture" }), (0, jsx_runtime_1.jsxs)("div", { className: "architecture-description", children: [(0, jsx_runtime_1.jsx)("p", { children: "Le syst\u00E8me est construit avec une architecture moderne s\u00E9parant clairement les couches de pr\u00E9sentation, logique m\u00E9tier et donn\u00E9es. L'interface utilisateur est d\u00E9velopp\u00E9e en React avec TypeScript pour une meilleure maintenabilit\u00E9." }), (0, jsx_runtime_1.jsx)("p", { children: "L'application utilise Electron pour offrir une exp\u00E9rience desktop native tout en conservant la flexibilit\u00E9 du web. La base de donn\u00E9es SQLite garantit une installation simple et une portabilit\u00E9 maximale." })] })] })] }))] }), (0, jsx_runtime_1.jsx)("style", { children: `
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
          color: #6E6E6E;
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
      ` })] }));
};
exports.About = About;
