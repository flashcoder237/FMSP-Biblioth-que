"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AddBook = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var preload_1 = require("../../preload");
var AddBook = function (_a) {
    var authors = _a.authors, categories = _a.categories, onAddBook = _a.onAddBook, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)({
        title: '',
        author: '',
        isbn: '',
        category: '',
        publishedDate: '',
        description: '',
        coverUrl: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), showNewAuthor = _c[0], setShowNewAuthor = _c[1];
    var _d = (0, react_1.useState)(false), showNewCategory = _d[0], setShowNewCategory = _d[1];
    var _e = (0, react_1.useState)({
        name: '',
        biography: '',
        nationality: ''
    }), newAuthor = _e[0], setNewAuthor = _e[1];
    var _f = (0, react_1.useState)({
        name: '',
        description: '',
        color: '#3E5C49'
    }), newCategory = _f[0], setNewCategory = _f[1];
    var _g = (0, react_1.useState)({}), errors = _g[0], setErrors = _g[1];
    var _h = (0, react_1.useState)(false), isLoading = _h[0], setIsLoading = _h[1];
    var _j = (0, react_1.useState)(''), submitError = _j[0], setSubmitError = _j[1];
    var validateForm = function () {
        var newErrors = {};
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
    var isValidISBN = function (isbn) {
        var cleanISBN = isbn.replace(/[-\s]/g, '');
        return /^(978|979)\d{10}$/.test(cleanISBN) || /^\d{10}$/.test(cleanISBN);
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var bookData, bookForCallback, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setSubmitError('');
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    bookData = {
                        auteur: formData.author,
                        titre: formData.title,
                        editeur: 'Non spécifié',
                        lieuEdition: 'Non spécifié',
                        annee: formData.publishedDate || new Date().getFullYear().toString(),
                        descripteurs: formData.category,
                        cote: "".concat(formData.category.substring(0, 3), "-").concat(formData.author.substring(0, 3), "-").concat(Math.random().toString(36).substr(2, 3)).toUpperCase(),
                        isbn: formData.isbn.trim() || undefined,
                        description: formData.description,
                        couverture: formData.coverUrl,
                        estEmprunte: false,
                        syncStatus: 'pending',
                        lastModified: new Date().toISOString(),
                        version: 1,
                        createdAt: new Date().toISOString()
                    };
                    bookForCallback = (0, preload_1.createBookFromDocument)(bookData);
                    return [4 /*yield*/, onAddBook(bookForCallback)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Erreur lors de l\'ajout du livre:', error_1);
                    if (error_1.message && error_1.message.includes('ISBN existe déjà')) {
                        setErrors({ isbn: 'Un livre avec cet ISBN existe déjà' });
                    }
                    else {
                        setSubmitError('Erreur lors de l\'ajout du livre. Veuillez réessayer.');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        setSubmitError('');
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var handleAddNewAuthor = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newAuthor.name.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, window.electronAPI.addAuthor(__assign(__assign({}, newAuthor), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1 }))];
                case 2:
                    _a.sent();
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { author: newAuthor.name })); });
                    setNewAuthor({ name: '', biography: '', nationality: '' });
                    setShowNewAuthor(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Erreur lors de l\'ajout de l\'auteur:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddNewCategory = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newCategory.name.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, window.electronAPI.addCategory(__assign(__assign({}, newCategory), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1 }))];
                case 2:
                    _a.sent();
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { category: newCategory.name })); });
                    setNewCategory({ name: '', description: '', color: '#3E5C49' });
                    setShowNewCategory(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Erreur lors de l\'ajout de la catégorie:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var predefinedColors = [
        '#3E5C49', '#C2571B', '#6E6E6E', '#2E453A',
        '#A8481A', '#8B7355', '#5D4037', '#795548'
    ];
    var progressSteps = [
        { id: 'basic', label: 'Informations', completed: formData.title && formData.author && formData.category },
        { id: 'details', label: 'Détails', completed: true },
        { id: 'finish', label: 'Finaliser', completed: false }
    ];
    return (<div className="add-book">
      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <button className="back-button" onClick={onCancel}>
            <lucide_react_1.ArrowLeft size={20}/>
            <span>Retour</span>
          </button>
          
          <div className="hero-main">
            <div className="hero-icon">
              <lucide_react_1.Sparkles size={32}/>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Ajouter un nouveau livre</h1>
              <p className="hero-subtitle">Enrichissez votre collection avec un nouveau titre</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            {progressSteps.map(function (step, index) { return (<div key={step.id} className={"progress-step ".concat(step.completed ? 'completed' : '')}>
                <div className="step-indicator">
                  {step.completed ? <lucide_react_1.Check size={16}/> : <span>{index + 1}</span>}
                </div>
                <span className="step-label">{step.label}</span>
              </div>); })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="book-form">
          {submitError && (<div className="alert alert-error">
              <lucide_react_1.AlertCircle size={20}/>
              <span>{submitError}</span>
            </div>)}

          <div className="form-sections">
            {/* Section 1: Informations principales */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <lucide_react_1.Book size={24}/>
                </div>
                <div className="section-info">
                  <h2 className="section-title">Informations principales</h2>
                  <p className="section-description">Les détails essentiels de votre livre</p>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group span-full">
                  <label htmlFor="title" className="form-label">
                    Titre du livre *
                  </label>
                  <input id="title" type="text" value={formData.title} onChange={function (e) { return handleInputChange('title', e.target.value); }} className={"form-input ".concat(errors.title ? 'error' : '')} placeholder="Entrez le titre complet du livre" disabled={isLoading}/>
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="author" className="form-label">
                    Auteur *
                  </label>
                  <div className="input-group">
                    <select id="author" value={formData.author} onChange={function (e) { return handleInputChange('author', e.target.value); }} className={"form-input ".concat(errors.author ? 'error' : '')} disabled={isLoading}>
                      <option value="">Sélectionner un auteur</option>
                      {authors.map(function (author) { return (<option key={author.id} value={author.name}>
                          {author.name}
                        </option>); })}
                    </select>
                    <button type="button" className="add-button" onClick={function () { return setShowNewAuthor(true); }} disabled={isLoading}>
                      <lucide_react_1.Plus size={16}/>
                    </button>
                  </div>
                  {errors.author && <span className="error-message">{errors.author}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Catégorie *
                  </label>
                  <div className="input-group">
                    <select id="category" value={formData.category} onChange={function (e) { return handleInputChange('category', e.target.value); }} className={"form-input ".concat(errors.category ? 'error' : '')} disabled={isLoading}>
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(function (category) { return (<option key={category.id} value={category.name}>
                          {category.name}
                        </option>); })}
                    </select>
                    <button type="button" className="add-button" onClick={function () { return setShowNewCategory(true); }} disabled={isLoading}>
                      <lucide_react_1.Plus size={16}/>
                    </button>
                  </div>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Détails supplémentaires */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <lucide_react_1.FileText size={24}/>
                </div>
                <div className="section-info">
                  <h2 className="section-title">Détails supplémentaires</h2>
                  <p className="section-description">Informations complémentaires (optionnelles)</p>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="isbn" className="form-label">
                    ISBN
                  </label>
                  <input id="isbn" type="text" value={formData.isbn} onChange={function (e) { return handleInputChange('isbn', e.target.value); }} className={"form-input ".concat(errors.isbn ? 'error' : '')} placeholder="978-2-123456-78-9" disabled={isLoading}/>
                  {errors.isbn && <span className="error-message">{errors.isbn}</span>}
                  <small className="form-hint">
                    Laissez vide si vous ne connaissez pas l'ISBN
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="publishedDate" className="form-label">
                    Date de publication
                  </label>
                  <input id="publishedDate" type="text" value={formData.publishedDate} onChange={function (e) { return handleInputChange('publishedDate', e.target.value); }} className="form-input" placeholder="2023 ou 01/01/2023" disabled={isLoading}/>
                </div>

                <div className="form-group span-full">
                  <label htmlFor="coverUrl" className="form-label">
                    URL de la couverture
                  </label>
                  <input id="coverUrl" type="url" value={formData.coverUrl} onChange={function (e) { return handleInputChange('coverUrl', e.target.value); }} className="form-input" placeholder="https://exemple.com/couverture.jpg" disabled={isLoading}/>
                </div>

                <div className="form-group span-full">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea id="description" value={formData.description} onChange={function (e) { return handleInputChange('description', e.target.value); }} className="form-textarea" placeholder="Résumé ou description du livre..." rows={4} disabled={isLoading}/>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
              <lucide_react_1.X size={18}/>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <lucide_react_1.Save size={18}/>
              {isLoading ? 'Ajout en cours...' : 'Ajouter le livre'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Nouvel Auteur */}
      {showNewAuthor && (<div className="modal-overlay" onClick={function () { return setShowNewAuthor(false); }}>
          <div className="modal" onClick={function (e) { return e.stopPropagation(); }}>
            <div className="modal-header">
              <div className="modal-title-section">
                <lucide_react_1.User size={24}/>
                <h3>Ajouter un nouvel auteur</h3>
              </div>
              <button className="modal-close" onClick={function () { return setShowNewAuthor(false); }}>
                <lucide_react_1.X size={20}/>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Nom de l'auteur *</label>
                <input type="text" value={newAuthor.name} onChange={function (e) { return setNewAuthor(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="form-input" placeholder="Nom complet de l'auteur"/>
              </div>
              
              <div className="form-group">
                <label className="form-label">Nationalité</label>
                <input type="text" value={newAuthor.nationality} onChange={function (e) { return setNewAuthor(function (prev) { return (__assign(__assign({}, prev), { nationality: e.target.value })); }); }} className="form-input" placeholder="Nationalité de l'auteur"/>
              </div>
              
              <div className="form-group">
                <label className="form-label">Biographie</label>
                <textarea value={newAuthor.biography} onChange={function (e) { return setNewAuthor(function (prev) { return (__assign(__assign({}, prev), { biography: e.target.value })); }); }} className="form-textarea" placeholder="Courte biographie..." rows={3}/>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={function () { return setShowNewAuthor(false); }}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleAddNewAuthor} disabled={!newAuthor.name.trim()}>
                <lucide_react_1.Plus size={16}/>
                Ajouter l'auteur
              </button>
            </div>
          </div>
        </div>)}

      {/* Modal Nouvelle Catégorie */}
      {showNewCategory && (<div className="modal-overlay" onClick={function () { return setShowNewCategory(false); }}>
          <div className="modal" onClick={function (e) { return e.stopPropagation(); }}>
            <div className="modal-header">
              <div className="modal-title-section">
                <lucide_react_1.Tag size={24}/>
                <h3>Ajouter une nouvelle catégorie</h3>
              </div>
              <button className="modal-close" onClick={function () { return setShowNewCategory(false); }}>
                <lucide_react_1.X size={20}/>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Nom de la catégorie *</label>
                <input type="text" value={newCategory.name} onChange={function (e) { return setNewCategory(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="form-input" placeholder="Nom de la catégorie"/>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={newCategory.description} onChange={function (e) { return setNewCategory(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} className="form-textarea" placeholder="Description de la catégorie..." rows={2}/>
              </div>
              
              <div className="form-group">
                <label className="form-label">Couleur</label>
                <div className="color-picker">
                  {predefinedColors.map(function (color) { return (<button key={color} type="button" className={"color-option ".concat(newCategory.color === color ? 'selected' : '')} style={{ backgroundColor: color }} onClick={function () { return setNewCategory(function (prev) { return (__assign(__assign({}, prev), { color: color })); }); }}/>); })}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={function () { return setShowNewCategory(false); }}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleAddNewCategory} disabled={!newCategory.name.trim()}>
                <lucide_react_1.Plus size={16}/>
                Ajouter la catégorie
              </button>
            </div>
          </div>
        </div>)}

      <style>{"\n        .add-book {\n          height: 100%;\n          overflow-y: auto;\n          background: #FAF9F6;\n        }\n        \n        .hero-header {\n          position: relative;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          padding: 32px;\n          overflow: hidden;\n        }\n        \n        .hero-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n        \n        .hero-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),\n            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.1) 0%, transparent 50%);\n          animation: drift 20s ease-in-out infinite;\n        }\n        \n        @keyframes drift {\n          0%, 100% { transform: translate(0, 0) rotate(0deg); }\n          33% { transform: translate(30px, -30px) rotate(1deg); }\n          66% { transform: translate(-20px, 20px) rotate(-1deg); }\n        }\n        \n        .hero-content {\n          position: relative;\n          z-index: 1;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .back-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px 20px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          font-size: 14px;\n          font-weight: 500;\n          margin-bottom: 32px;\n          width: fit-content;\n        }\n        \n        .back-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: translateX(-4px);\n        }\n        \n        .hero-main {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          margin-bottom: 32px;\n        }\n        \n        .hero-icon {\n          width: 64px;\n          height: 64px;\n          background: rgba(194, 87, 27, 0.2);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .hero-title {\n          font-size: 36px;\n          font-weight: 800;\n          margin: 0 0 8px 0;\n          line-height: 1.2;\n          letter-spacing: -0.5px;\n        }\n        \n        .hero-subtitle {\n          font-size: 18px;\n          opacity: 0.9;\n          margin: 0;\n          line-height: 1.4;\n        }\n        \n        .progress-steps {\n          display: flex;\n          gap: 32px;\n        }\n        \n        .progress-step {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          opacity: 0.6;\n          transition: opacity 0.3s ease;\n        }\n        \n        .progress-step.completed {\n          opacity: 1;\n        }\n        \n        .step-indicator {\n          width: 32px;\n          height: 32px;\n          border-radius: 50%;\n          background: rgba(243, 238, 217, 0.2);\n          border: 2px solid rgba(243, 238, 217, 0.4);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.3s ease;\n        }\n        \n        .progress-step.completed .step-indicator {\n          background: #C2571B;\n          border-color: #C2571B;\n          color: #FFFFFF;\n        }\n        \n        .step-label {\n          font-size: 14px;\n          font-weight: 500;\n        }\n        \n        .form-container {\n          padding: 40px 32px;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .book-form {\n          background: #FFFFFF;\n          border-radius: 20px;\n          padding: 40px;\n          box-shadow: \n            0 8px 32px rgba(62, 92, 73, 0.08),\n            0 2px 16px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .alert {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 20px;\n          border-radius: 12px;\n          margin-bottom: 32px;\n          font-size: 14px;\n          font-weight: 500;\n        }\n        \n        .alert-error {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n          border: 1px solid rgba(194, 87, 27, 0.2);\n        }\n        \n        .form-sections {\n          display: flex;\n          flex-direction: column;\n          gap: 48px;\n          margin-bottom: 40px;\n        }\n        \n        .form-section {\n          border-radius: 16px;\n          border: 1px solid #E5DCC2;\n          background: #FEFEFE;\n          overflow: hidden;\n        }\n        \n        .section-header {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          padding: 24px 32px;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .section-icon {\n          width: 48px;\n          height: 48px;\n          background: #3E5C49;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .section-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .section-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .form-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 24px;\n          padding: 32px;\n        }\n        \n        .form-group {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .form-group.span-full {\n          grid-column: 1 / -1;\n        }\n        \n        .form-label {\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .form-input, .form-textarea {\n          width: 100%;\n          padding: 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .form-input:focus, .form-textarea:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .form-input.error {\n          border-color: #C2571B;\n          background: rgba(194, 87, 27, 0.05);\n        }\n        \n        .form-input:disabled, .form-textarea:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          background: #F3EED9;\n        }\n        \n        .form-textarea {\n          resize: vertical;\n          min-height: 120px;\n          line-height: 1.5;\n        }\n        \n        .input-group {\n          display: flex;\n          gap: 8px;\n        }\n        \n        .input-group .form-input {\n          flex: 1;\n        }\n        \n        .add-button {\n          width: 48px;\n          height: 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          background: #F3EED9;\n          color: #3E5C49;\n          cursor: pointer;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          transition: all 0.2s ease;\n          flex-shrink: 0;\n        }\n        \n        .add-button:hover:not(:disabled) {\n          background: #3E5C49;\n          color: #F3EED9;\n          border-color: #3E5C49;\n        }\n        \n        .add-button:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n        }\n        \n        .form-hint {\n          font-size: 12px;\n          color: #6E6E6E;\n          font-style: italic;\n        }\n        \n        .error-message {\n          font-size: 12px;\n          color: #C2571B;\n          font-weight: 500;\n        }\n        \n        .form-actions {\n          display: flex;\n          gap: 16px;\n          justify-content: flex-end;\n          padding-top: 32px;\n          border-top: 1px solid #E5DCC2;\n        }\n        \n        .btn-secondary, .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 16px 32px;\n          border-radius: 12px;\n          font-size: 16px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          border: none;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .btn-secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n        }\n        \n        .btn-secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-2px);\n        }\n        \n        .btn-primary {\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n        }\n        \n        .btn-primary:hover:not(:disabled) {\n          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.3);\n        }\n        \n        .btn-secondary:disabled,\n        .btn-primary:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          transform: none;\n        }\n        \n        /* Modal Styles */\n        .modal-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.6);\n          backdrop-filter: blur(4px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n        }\n        \n        .modal {\n          background: #FFFFFF;\n          border-radius: 20px;\n          width: 100%;\n          max-width: 600px;\n          max-height: 90vh;\n          overflow-y: auto;\n          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 24px 32px;\n          border-bottom: 1px solid #E5DCC2;\n          background: #F3EED9;\n        }\n        \n        .modal-title-section {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n        }\n        \n        .modal-title-section h3 {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n        }\n        \n        .modal-close {\n          background: rgba(110, 110, 110, 0.1);\n          border: none;\n          cursor: pointer;\n          padding: 8px;\n          border-radius: 8px;\n          color: #6E6E6E;\n          transition: all 0.2s ease;\n        }\n        \n        .modal-close:hover {\n          background: rgba(110, 110, 110, 0.2);\n          color: #2E2E2E;\n        }\n        \n        .modal-content {\n          padding: 32px;\n        }\n        \n        .modal-footer {\n          display: flex;\n          gap: 16px;\n          padding: 24px 32px;\n          border-top: 1px solid #E5DCC2;\n          background: #FEFEFE;\n          justify-content: flex-end;\n        }\n        \n        .color-picker {\n          display: flex;\n          gap: 12px;\n          flex-wrap: wrap;\n        }\n        \n        .color-option {\n          width: 40px;\n          height: 40px;\n          border-radius: 12px;\n          border: 2px solid transparent;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          position: relative;\n        }\n        \n        .color-option:hover {\n          transform: scale(1.1);\n          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n        }\n        \n        .color-option.selected {\n          border-color: #2E2E2E;\n          transform: scale(1.1);\n        }\n        \n        .color-option.selected::after {\n          content: '';\n          position: absolute;\n          top: 50%;\n          left: 50%;\n          transform: translate(-50%, -50%);\n          width: 16px;\n          height: 16px;\n          background: #FFFFFF;\n          border-radius: 50%;\n          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .hero-content {\n            padding: 0 16px;\n          }\n          \n          .form-container {\n            padding: 24px 16px;\n          }\n          \n          .book-form {\n            padding: 24px;\n          }\n          \n          .form-grid {\n            grid-template-columns: 1fr;\n            gap: 20px;\n            padding: 24px;\n          }\n          \n          .section-header {\n            padding: 20px 24px;\n            flex-direction: column;\n            text-align: center;\n            gap: 16px;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .hero-header {\n            padding: 24px 16px;\n          }\n          \n          .hero-title {\n            font-size: 28px;\n          }\n          \n          .hero-subtitle {\n            font-size: 16px;\n          }\n          \n          .hero-main {\n            flex-direction: column;\n            text-align: center;\n            gap: 16px;\n          }\n          \n          .progress-steps {\n            justify-content: center;\n            gap: 20px;\n          }\n          \n          .form-actions {\n            flex-direction: column-reverse;\n          }\n          \n          .btn-secondary, .btn-primary {\n            width: 100%;\n            justify-content: center;\n          }\n          \n          .modal {\n            margin: 16px;\n            border-radius: 16px;\n          }\n          \n          .modal-header, .modal-content, .modal-footer {\n            padding: 20px;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .progress-steps {\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .progress-step {\n            justify-content: center;\n          }\n          \n          .section-icon {\n            width: 40px;\n            height: 40px;\n          }\n          \n          .hero-icon {\n            width: 56px;\n            height: 56px;\n          }\n          \n          .color-picker {\n            justify-content: center;\n          }\n          \n          .input-group {\n            flex-direction: column;\n          }\n          \n          .add-button {\n            width: 100%;\n            height: 40px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.AddBook = AddBook;
