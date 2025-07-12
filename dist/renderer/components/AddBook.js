"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBook = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const AddBook = ({ authors, categories, onAddBook, onCancel }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        title: '',
        author: '',
        isbn: '',
        category: '',
        publishedDate: '',
        description: '',
        coverUrl: ''
    });
    const [showNewAuthor, setShowNewAuthor] = (0, react_1.useState)(false);
    const [showNewCategory, setShowNewCategory] = (0, react_1.useState)(false);
    const [newAuthor, setNewAuthor] = (0, react_1.useState)({
        name: '',
        biography: '',
        nationality: ''
    });
    const [newCategory, setNewCategory] = (0, react_1.useState)({
        name: '',
        description: '',
        color: '#3E5C49'
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [submitError, setSubmitError] = (0, react_1.useState)('');
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est requis';
        }
        if (!formData.author.trim()) {
            newErrors.author = 'L\'auteur est requis';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'La catégorie est requise';
        }
        if (formData.isbn && formData.isbn.trim() && !isValidISBN(formData.isbn)) {
            newErrors.isbn = 'Format ISBN invalide (ex: 978-2-123456-78-9)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const isValidISBN = (isbn) => {
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        return /^(978|979)\d{10}$/.test(cleanISBN) || /^\d{10}$/.test(cleanISBN);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const bookData = {
                ...formData,
                isbn: formData.isbn.trim() || '',
                isBorrowed: false,
                createdAt: new Date().toISOString()
            };
            await onAddBook(bookData);
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du livre:', error);
            if (error.message && error.message.includes('ISBN existe déjà')) {
                setErrors({ isbn: 'Un livre avec cet ISBN existe déjà' });
            }
            else {
                setSubmitError('Erreur lors de l\'ajout du livre. Veuillez réessayer.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSubmitError('');
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handleAddNewAuthor = async () => {
        if (!newAuthor.name.trim())
            return;
        try {
            await window.electronAPI.addAuthor(newAuthor);
            setFormData(prev => ({ ...prev, author: newAuthor.name }));
            setNewAuthor({ name: '', biography: '', nationality: '' });
            setShowNewAuthor(false);
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout de l\'auteur:', error);
        }
    };
    const handleAddNewCategory = async () => {
        if (!newCategory.name.trim())
            return;
        try {
            await window.electronAPI.addCategory(newCategory);
            setFormData(prev => ({ ...prev, category: newCategory.name }));
            setNewCategory({ name: '', description: '', color: '#3E5C49' });
            setShowNewCategory(false);
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
    };
    const predefinedColors = [
        '#3E5C49', '#C2571B', '#6E6E6E', '#2E453A',
        '#A8481A', '#8B7355', '#5D4037', '#795548'
    ];
    const progressSteps = [
        { id: 'basic', label: 'Informations', completed: formData.title && formData.author && formData.category },
        { id: 'details', label: 'Détails', completed: true },
        { id: 'finish', label: 'Finaliser', completed: false }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "add-book", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hero-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-background", children: (0, jsx_runtime_1.jsx)("div", { className: "hero-pattern" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-content", children: [(0, jsx_runtime_1.jsxs)("button", { className: "back-button", onClick: onCancel, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Retour" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-main", children: [(0, jsx_runtime_1.jsx)("div", { className: "hero-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 32 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hero-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "hero-title", children: "Ajouter un nouveau livre" }), (0, jsx_runtime_1.jsx)("p", { className: "hero-subtitle", children: "Enrichissez votre collection avec un nouveau titre" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "progress-steps", children: progressSteps.map((step, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `progress-step ${step.completed ? 'completed' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "step-indicator", children: step.completed ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16 }) : (0, jsx_runtime_1.jsx)("span", { children: index + 1 }) }), (0, jsx_runtime_1.jsx)("span", { className: "step-label", children: step.label })] }, step.id))) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "form-container", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "book-form", children: [submitError && ((0, jsx_runtime_1.jsxs)("div", { className: "alert alert-error", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: submitError })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-sections", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "section-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "section-info", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "Informations principales" }), (0, jsx_runtime_1.jsx)("p", { className: "section-description", children: "Les d\u00E9tails essentiels de votre livre" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group span-full", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "title", className: "form-label", children: "Titre du livre *" }), (0, jsx_runtime_1.jsx)("input", { id: "title", type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), className: `form-input ${errors.title ? 'error' : ''}`, placeholder: "Entrez le titre complet du livre", disabled: isLoading }), errors.title && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "author", className: "form-label", children: "Auteur *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsxs)("select", { id: "author", value: formData.author, onChange: (e) => handleInputChange('author', e.target.value), className: `form-input ${errors.author ? 'error' : ''}`, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionner un auteur" }), authors.map((author) => ((0, jsx_runtime_1.jsx)("option", { value: author.name, children: author.name }, author.id)))] }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "add-button", onClick: () => setShowNewAuthor(true), disabled: isLoading, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }) })] }), errors.author && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.author })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "category", className: "form-label", children: "Cat\u00E9gorie *" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsxs)("select", { id: "category", value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: `form-input ${errors.category ? 'error' : ''}`, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionner une cat\u00E9gorie" }), categories.map((category) => ((0, jsx_runtime_1.jsx)("option", { value: category.name, children: category.name }, category.id)))] }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "add-button", onClick: () => setShowNewCategory(true), disabled: isLoading, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }) })] }), errors.category && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.category })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "section-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "section-info", children: [(0, jsx_runtime_1.jsx)("h2", { className: "section-title", children: "D\u00E9tails suppl\u00E9mentaires" }), (0, jsx_runtime_1.jsx)("p", { className: "section-description", children: "Informations compl\u00E9mentaires (optionnelles)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "isbn", className: "form-label", children: "ISBN" }), (0, jsx_runtime_1.jsx)("input", { id: "isbn", type: "text", value: formData.isbn, onChange: (e) => handleInputChange('isbn', e.target.value), className: `form-input ${errors.isbn ? 'error' : ''}`, placeholder: "978-2-123456-78-9", disabled: isLoading }), errors.isbn && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.isbn }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "Laissez vide si vous ne connaissez pas l'ISBN" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "publishedDate", className: "form-label", children: "Date de publication" }), (0, jsx_runtime_1.jsx)("input", { id: "publishedDate", type: "text", value: formData.publishedDate, onChange: (e) => handleInputChange('publishedDate', e.target.value), className: "form-input", placeholder: "2023 ou 01/01/2023", disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group span-full", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "coverUrl", className: "form-label", children: "URL de la couverture" }), (0, jsx_runtime_1.jsx)("input", { id: "coverUrl", type: "url", value: formData.coverUrl, onChange: (e) => handleInputChange('coverUrl', e.target.value), className: "form-input", placeholder: "https://exemple.com/couverture.jpg", disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group span-full", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "description", className: "form-label", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { id: "description", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "form-textarea", placeholder: "R\u00E9sum\u00E9 ou description du livre...", rows: 4, disabled: isLoading })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "btn-secondary", onClick: onCancel, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 18 }), "Annuler"] }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", className: "btn-primary", disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { size: 18 }), isLoading ? 'Ajout en cours...' : 'Ajouter le livre'] })] })] }) }), showNewAuthor && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowNewAuthor(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-title-section", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Ajouter un nouvel auteur" })] }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowNewAuthor(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de l'auteur *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newAuthor.name, onChange: (e) => setNewAuthor(prev => ({ ...prev, name: e.target.value })), className: "form-input", placeholder: "Nom complet de l'auteur" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nationalit\u00E9" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newAuthor.nationality, onChange: (e) => setNewAuthor(prev => ({ ...prev, nationality: e.target.value })), className: "form-input", placeholder: "Nationalit\u00E9 de l'auteur" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Biographie" }), (0, jsx_runtime_1.jsx)("textarea", { value: newAuthor.biography, onChange: (e) => setNewAuthor(prev => ({ ...prev, biography: e.target.value })), className: "form-textarea", placeholder: "Courte biographie...", rows: 3 })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowNewAuthor(false), children: "Annuler" }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-primary", onClick: handleAddNewAuthor, disabled: !newAuthor.name.trim(), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }), "Ajouter l'auteur"] })] })] }) })), showNewCategory && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowNewCategory(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-title-section", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { size: 24 }), (0, jsx_runtime_1.jsx)("h3", { children: "Ajouter une nouvelle cat\u00E9gorie" })] }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowNewCategory(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de la cat\u00E9gorie *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newCategory.name, onChange: (e) => setNewCategory(prev => ({ ...prev, name: e.target.value })), className: "form-input", placeholder: "Nom de la cat\u00E9gorie" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: newCategory.description, onChange: (e) => setNewCategory(prev => ({ ...prev, description: e.target.value })), className: "form-textarea", placeholder: "Description de la cat\u00E9gorie...", rows: 2 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Couleur" }), (0, jsx_runtime_1.jsx)("div", { className: "color-picker", children: predefinedColors.map((color) => ((0, jsx_runtime_1.jsx)("button", { type: "button", className: `color-option ${newCategory.color === color ? 'selected' : ''}`, style: { backgroundColor: color }, onClick: () => setNewCategory(prev => ({ ...prev, color })) }, color))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowNewCategory(false), children: "Annuler" }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-primary", onClick: handleAddNewCategory, disabled: !newCategory.name.trim(), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 16 }), "Ajouter la cat\u00E9gorie"] })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
        .add-book {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-header {
          position: relative;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 32px;
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
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.1) 0%, transparent 50%);
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
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .hero-icon {
          width: 64px;
          height: 64px;
          background: rgba(194, 87, 27, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .hero-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 8px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .progress-steps {
          display: flex;
          gap: 32px;
        }
        
        .progress-step {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        
        .progress-step.completed {
          opacity: 1;
        }
        
        .step-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(243, 238, 217, 0.2);
          border: 2px solid rgba(243, 238, 217, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .progress-step.completed .step-indicator {
          background: #C2571B;
          border-color: #C2571B;
          color: #FFFFFF;
        }
        
        .step-label {
          font-size: 14px;
          font-weight: 500;
        }
        
        .form-container {
          padding: 40px 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .book-form {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 
            0 8px 32px rgba(62, 92, 73, 0.08),
            0 2px 16px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 32px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .alert-error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
        }
        
        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 48px;
          margin-bottom: 40px;
        }
        
        .form-section {
          border-radius: 16px;
          border: 1px solid #E5DCC2;
          background: #FEFEFE;
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .section-icon {
          width: 48px;
          height: 48px;
          background: #3E5C49;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 32px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group.span-full {
          grid-column: 1 / -1;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .form-input.error {
          border-color: #C2571B;
          background: rgba(194, 87, 27, 0.05);
        }
        
        .form-input:disabled, .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #F3EED9;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }
        
        .input-group {
          display: flex;
          gap: 8px;
        }
        
        .input-group .form-input {
          flex: 1;
        }
        
        .add-button {
          width: 48px;
          height: 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          background: #F3EED9;
          color: #3E5C49;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .add-button:hover:not(:disabled) {
          background: #3E5C49;
          color: #F3EED9;
          border-color: #3E5C49;
        }
        
        .add-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6E6E6E;
          font-style: italic;
        }
        
        .error-message {
          font-size: 12px;
          color: #C2571B;
          font-weight: 500;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 32px;
          border-top: 1px solid #E5DCC2;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-2px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.3);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #F3EED9;
        }
        
        .modal-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .modal-title-section h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }
        
        .modal-close {
          background: rgba(110, 110, 110, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: rgba(110, 110, 110, 0.2);
          color: #2E2E2E;
        }
        
        .modal-content {
          padding: 32px;
        }
        
        .modal-footer {
          display: flex;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
          justify-content: flex-end;
        }
        
        .color-picker {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .color-option:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .color-option.selected {
          border-color: #2E2E2E;
          transform: scale(1.1);
        }
        
        .color-option.selected::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            padding: 0 16px;
          }
          
          .form-container {
            padding: 24px 16px;
          }
          
          .book-form {
            padding: 24px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 24px;
          }
          
          .section-header {
            padding: 20px 24px;
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-header {
            padding: 24px 16px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .hero-main {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          
          .progress-steps {
            justify-content: center;
            gap: 20px;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .btn-secondary, .btn-primary {
            width: 100%;
            justify-content: center;
          }
          
          .modal {
            margin: 16px;
            border-radius: 16px;
          }
          
          .modal-header, .modal-content, .modal-footer {
            padding: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .progress-steps {
            flex-direction: column;
            gap: 12px;
          }
          
          .progress-step {
            justify-content: center;
          }
          
          .section-icon {
            width: 40px;
            height: 40px;
          }
          
          .hero-icon {
            width: 56px;
            height: 56px;
          }
          
          .color-picker {
            justify-content: center;
          }
          
          .input-group {
            flex-direction: column;
          }
          
          .add-button {
            width: 100%;
            height: 40px;
          }
        }
      ` })] }));
};
exports.AddBook = AddBook;
