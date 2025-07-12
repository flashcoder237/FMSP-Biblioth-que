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
        color: '#22c55e'
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
                isbn: formData.isbn.trim() || '', // ISBN vide si non renseigné
                isBorrowed: false,
                createdAt: new Date().toISOString()
            };
            await onAddBook(bookData);
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du livre:', error);
            // Gestion spécifique de l'erreur d'ISBN dupliqué
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
            setNewCategory({ name: '', description: '', color: '#22c55e' });
            setShowNewCategory(false);
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
    };
    const predefinedColors = [
        '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
        '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "add-book", children: [(0, jsx_runtime_1.jsx)("div", { className: "page-header", children: (0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("button", { className: "back-button", onClick: onCancel, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-title-section", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "header-icon", size: 28 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "page-title", children: "Ajouter un livre" }), (0, jsx_runtime_1.jsx)("p", { className: "page-subtitle", children: "Enrichissez votre collection" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "form-container", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "book-form", children: [submitError && ((0, jsx_runtime_1.jsxs)("div", { className: "error-banner", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: submitError })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Informations principales" }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "title", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 16 }), "Titre du livre *"] }), (0, jsx_runtime_1.jsx)("input", { id: "title", type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), className: `form-input ${errors.title ? 'error' : ''}`, placeholder: "Entrez le titre du livre", disabled: isLoading }), errors.title && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "author", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 16 }), "Auteur *"] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-with-action", children: [(0, jsx_runtime_1.jsxs)("select", { id: "author", value: formData.author, onChange: (e) => handleInputChange('author', e.target.value), className: `form-input ${errors.author ? 'error' : ''}`, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionner un auteur" }), authors.map((author) => ((0, jsx_runtime_1.jsx)("option", { value: author.name, children: author.name }, author.id)))] }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "action-link", onClick: () => setShowNewAuthor(true), disabled: isLoading, children: "Nouvel auteur" })] }), errors.author && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.author })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "category", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { size: 16 }), "Cat\u00E9gorie *"] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-with-action", children: [(0, jsx_runtime_1.jsxs)("select", { id: "category", value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: `form-input ${errors.category ? 'error' : ''}`, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionner une cat\u00E9gorie" }), categories.map((category) => ((0, jsx_runtime_1.jsx)("option", { value: category.name, children: category.name }, category.id)))] }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "action-link", onClick: () => setShowNewCategory(true), disabled: isLoading, children: "Nouvelle cat\u00E9gorie" })] }), errors.category && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.category })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "D\u00E9tails suppl\u00E9mentaires" }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "isbn", className: "form-label", children: "ISBN (optionnel)" }), (0, jsx_runtime_1.jsx)("input", { id: "isbn", type: "text", value: formData.isbn, onChange: (e) => handleInputChange('isbn', e.target.value), className: `form-input ${errors.isbn ? 'error' : ''}`, placeholder: "978-2-123456-78-9", disabled: isLoading }), errors.isbn && (0, jsx_runtime_1.jsx)("span", { className: "error-message", children: errors.isbn }), (0, jsx_runtime_1.jsx)("small", { className: "form-hint", children: "Laissez vide si vous ne connaissez pas l'ISBN" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "publishedDate", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 16 }), "Date de publication"] }), (0, jsx_runtime_1.jsx)("input", { id: "publishedDate", type: "text", value: formData.publishedDate, onChange: (e) => handleInputChange('publishedDate', e.target.value), className: "form-input", placeholder: "2023 ou 01/01/2023", disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "coverUrl", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Link, { size: 16 }), "URL de la couverture"] }), (0, jsx_runtime_1.jsx)("input", { id: "coverUrl", type: "url", value: formData.coverUrl, onChange: (e) => handleInputChange('coverUrl', e.target.value), className: "form-input", placeholder: "https://exemple.com/couverture.jpg", disabled: isLoading })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section full-width", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "description", className: "form-label", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 16 }), "Description"] }), (0, jsx_runtime_1.jsx)("textarea", { id: "description", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "form-textarea", placeholder: "R\u00E9sum\u00E9 ou description du livre...", rows: 4, disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-secondary", onClick: onCancel, disabled: isLoading, children: "Annuler" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", className: "btn-primary", disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { size: 16 }), isLoading ? 'Ajout en cours...' : 'Ajouter le livre'] })] })] }) }), showNewAuthor && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowNewAuthor(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Ajouter un nouvel auteur" }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowNewAuthor(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de l'auteur *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newAuthor.name, onChange: (e) => setNewAuthor(prev => ({ ...prev, name: e.target.value })), className: "form-input", placeholder: "Nom complet de l'auteur" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Biographie" }), (0, jsx_runtime_1.jsx)("textarea", { value: newAuthor.biography, onChange: (e) => setNewAuthor(prev => ({ ...prev, biography: e.target.value })), className: "form-textarea", placeholder: "Courte biographie...", rows: 3 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nationalit\u00E9" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newAuthor.nationality, onChange: (e) => setNewAuthor(prev => ({ ...prev, nationality: e.target.value })), className: "form-input", placeholder: "Nationalit\u00E9 de l'auteur" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowNewAuthor(false), children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: handleAddNewAuthor, disabled: !newAuthor.name.trim(), children: "Ajouter" })] })] }) })), showNewCategory && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: () => setShowNewCategory(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Ajouter une nouvelle cat\u00E9gorie" }), (0, jsx_runtime_1.jsx)("button", { className: "modal-close", onClick: () => setShowNewCategory(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Nom de la cat\u00E9gorie *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newCategory.name, onChange: (e) => setNewCategory(prev => ({ ...prev, name: e.target.value })), className: "form-input", placeholder: "Nom de la cat\u00E9gorie" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: newCategory.description, onChange: (e) => setNewCategory(prev => ({ ...prev, description: e.target.value })), className: "form-textarea", placeholder: "Description de la cat\u00E9gorie...", rows: 2 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "form-label", children: "Couleur" }), (0, jsx_runtime_1.jsx)("div", { className: "color-picker", children: predefinedColors.map((color) => ((0, jsx_runtime_1.jsx)("button", { type: "button", className: `color-option ${newCategory.color === color ? 'selected' : ''}`, style: { backgroundColor: color }, onClick: () => setNewCategory(prev => ({ ...prev, color })) }, color))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: () => setShowNewCategory(false), children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: handleAddNewCategory, disabled: !newCategory.name.trim(), children: "Ajouter" })] })] }) })), (0, jsx_runtime_1.jsx)("style", { children: `
        .add-book {
          height: 100%;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .page-header {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 2;
        }
        
        .back-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-2px);
        }
        
        .back-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          opacity: 0.9;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }
        
        .page-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .form-container {
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .book-form {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 32px;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .form-section.full-width {
          grid-column: 1 / -1;
          margin-top: 8px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: #fafbfc;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #22c55e;
          background: white;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        
        .form-input.error {
          border-color: #ef4444;
          background: #fef2f2;
        }
        
        .form-input:disabled, .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
        }
        
        .input-with-action {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .input-with-action .form-input {
          flex: 1;
        }
        
        .action-link {
          background: none;
          border: none;
          color: #22c55e;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: underline;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        
        .action-link:hover:not(:disabled) {
          color: #16a34a;
        }
        
        .action-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #16a34a;
          transform: translateY(-1px);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          margin: 16px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }
        
        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-content {
          padding: 24px;
        }
        
        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
          justify-content: flex-end;
        }
        
        .color-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .color-option:hover {
          transform: scale(1.1);
        }
        
        .color-option.selected {
          border-color: #374151;
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 16px;
          }
          
          .book-form {
            padding: 24px 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .page-header {
            padding: 24px 16px;
          }
          
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .input-with-action {
            flex-direction: column;
            align-items: stretch;
          }
          
          .modal {
            margin: 8px;
          }
        }
      ` })] }));
};
exports.AddBook = AddBook;
