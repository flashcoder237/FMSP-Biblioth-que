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
exports.AddDocument = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AddDocument = function (_a) {
    var onAdd = _a.onAdd, onCancel = _a.onCancel, editingDocument = _a.editingDocument;
    var _b = (0, react_1.useState)({
        auteur: '',
        titre: '',
        editeur: '',
        lieuEdition: '',
        annee: new Date().getFullYear().toString(),
        descripteurs: '',
        cote: '',
        isbn: '',
        description: '',
        couverture: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)([]), authors = _c[0], setAuthors = _c[1];
    var _d = (0, react_1.useState)([]), categories = _d[0], setCategories = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)({}), errors = _f[0], setErrors = _f[1];
    (0, react_1.useEffect)(function () {
        loadAuthors();
        loadCategories();
        if (editingDocument) {
            setFormData({
                auteur: editingDocument.auteur,
                titre: editingDocument.titre,
                editeur: editingDocument.editeur,
                lieuEdition: editingDocument.lieuEdition,
                annee: editingDocument.annee,
                descripteurs: editingDocument.descripteurs,
                cote: editingDocument.cote,
                isbn: editingDocument.isbn || '',
                description: editingDocument.description || '',
                couverture: editingDocument.couverture || ''
            });
        }
    }, [editingDocument]);
    var loadAuthors = function () { return __awaiter(void 0, void 0, void 0, function () {
        var authorsList, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.electronAPI.getAuthors()];
                case 1:
                    authorsList = _a.sent();
                    setAuthors(authorsList);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erreur lors du chargement des auteurs:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var loadCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var categoriesList, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.electronAPI.getCategories()];
                case 1:
                    categoriesList = _a.sent();
                    setCategories(categoriesList);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Erreur lors du chargement des catégories:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var generateCote = function () {
        if (formData.descripteurs && formData.auteur && formData.annee) {
            var category = formData.descripteurs.split(',')[0].trim().toUpperCase();
            var authorCode = formData.auteur.split(' ').map(function (name) { return name.substring(0, 3).toUpperCase(); }).join('-');
            var yearCode = formData.annee.substring(-2);
            var randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
            var generatedCote_1 = "".concat(category.substring(0, 3), "-").concat(authorCode, "-").concat(yearCode).concat(randomNum);
            setFormData(function (prev) { return (__assign(__assign({}, prev), { cote: generatedCote_1 })); });
        }
    };
    var validateForm = function () {
        var newErrors = {};
        // Champs obligatoires
        if (!formData.auteur.trim())
            newErrors.auteur = 'L\'auteur est obligatoire';
        if (!formData.titre.trim())
            newErrors.titre = 'Le titre est obligatoire';
        if (!formData.editeur.trim())
            newErrors.editeur = 'L\'éditeur est obligatoire';
        if (!formData.lieuEdition.trim())
            newErrors.lieuEdition = 'Le lieu d\'édition est obligatoire';
        if (!formData.annee.trim())
            newErrors.annee = 'L\'année est obligatoire';
        if (!formData.descripteurs.trim())
            newErrors.descripteurs = 'Les descripteurs sont obligatoires';
        if (!formData.cote.trim())
            newErrors.cote = 'La cote est obligatoire';
        // Validation de l'année
        var year = parseInt(formData.annee);
        if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
            newErrors.annee = 'Année invalide';
        }
        // Validation ISBN (optionnel mais si fourni, doit être valide)
        if (formData.isbn && !/^(978|979)?[0-9]{9}[0-9X]$/.test(formData.isbn.replace(/-/g, ''))) {
            newErrors.isbn = 'Format ISBN invalide';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var documentData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    documentData = __assign(__assign({}, formData), { estEmprunte: false, syncStatus: 'pending', lastModified: new Date().toISOString(), version: editingDocument ? editingDocument.version + 1 : 1 });
                    return [4 /*yield*/, onAdd(documentData)];
                case 2:
                    _a.sent();
                    // Reset form si ce n'est pas une édition
                    if (!editingDocument) {
                        setFormData({
                            auteur: '',
                            titre: '',
                            editeur: '',
                            lieuEdition: '',
                            annee: new Date().getFullYear().toString(),
                            descripteurs: '',
                            cote: '',
                            isbn: '',
                            description: '',
                            couverture: ''
                        });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Erreur lors de l\'ajout du document:', error_3);
                    setErrors({ submit: 'Erreur lors de l\'enregistrement du document' });
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
        // Effacer l'erreur pour ce champ
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var selectCoverImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var filePath_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.electronAPI.selectFile({
                            filters: [
                                { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
                            ]
                        })];
                case 1:
                    filePath_1 = _a.sent();
                    if (filePath_1) {
                        setFormData(function (prev) { return (__assign(__assign({}, prev), { couverture: filePath_1 })); });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Erreur lors de la sélection de l\'image:', error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <lucide_react_1.BookOpen className="w-5 h-5"/>
            {editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <lucide_react_1.X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>)}

          {/* Section 1: Informations principales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <lucide_react_1.FileText className="w-5 h-5"/>
              Informations principales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.User className="w-4 h-4 inline mr-1"/>
                  Auteur *
                </label>
                <input type="text" value={formData.auteur} onChange={function (e) { return handleInputChange('auteur', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.auteur ? 'border-red-300' : 'border-gray-300')} placeholder="Nom de l'auteur" list="authors-list"/>
                <datalist id="authors-list">
                  {authors.map(function (author) { return (<option key={author.id} value={author.name}/>); })}
                </datalist>
                {errors.auteur && <p className="text-red-500 text-sm mt-1">{errors.auteur}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.BookOpen className="w-4 h-4 inline mr-1"/>
                  Titre *
                </label>
                <input type="text" value={formData.titre} onChange={function (e) { return handleInputChange('titre', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.titre ? 'border-red-300' : 'border-gray-300')} placeholder="Titre du document"/>
                {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.Building className="w-4 h-4 inline mr-1"/>
                  Éditeur *
                </label>
                <input type="text" value={formData.editeur} onChange={function (e) { return handleInputChange('editeur', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.editeur ? 'border-red-300' : 'border-gray-300')} placeholder="Nom de l'éditeur"/>
                {errors.editeur && <p className="text-red-500 text-sm mt-1">{errors.editeur}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.MapPin className="w-4 h-4 inline mr-1"/>
                  Lieu d'édition *
                </label>
                <input type="text" value={formData.lieuEdition} onChange={function (e) { return handleInputChange('lieuEdition', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.lieuEdition ? 'border-red-300' : 'border-gray-300')} placeholder="Ville d'édition"/>
                {errors.lieuEdition && <p className="text-red-500 text-sm mt-1">{errors.lieuEdition}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.Calendar className="w-4 h-4 inline mr-1"/>
                  Année *
                </label>
                <input type="number" value={formData.annee} onChange={function (e) { return handleInputChange('annee', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.annee ? 'border-red-300' : 'border-gray-300')} placeholder="Année de publication" min="1000" max={new Date().getFullYear() + 10}/>
                {errors.annee && <p className="text-red-500 text-sm mt-1">{errors.annee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <lucide_react_1.Hash className="w-4 h-4 inline mr-1"/>
                  Cote *
                </label>
                <div className="flex gap-2">
                  <input type="text" value={formData.cote} onChange={function (e) { return handleInputChange('cote', e.target.value); }} className={"flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.cote ? 'border-red-300' : 'border-gray-300')} placeholder="Code de classification"/>
                  <button type="button" onClick={generateCote} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" title="Générer automatiquement">
                    <lucide_react_1.Plus className="w-4 h-4"/>
                  </button>
                </div>
                {errors.cote && <p className="text-red-500 text-sm mt-1">{errors.cote}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Métadonnées */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <lucide_react_1.Tag className="w-5 h-5"/>
              Métadonnées et classification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripteurs / Mots-clés *
                </label>
                <input type="text" value={formData.descripteurs} onChange={function (e) { return handleInputChange('descripteurs', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.descripteurs ? 'border-red-300' : 'border-gray-300')} placeholder="ex: Fiction, Roman historique, XIXe siècle (séparés par des virgules)"/>
                <p className="text-sm text-gray-500 mt-1">
                  Séparez les mots-clés par des virgules. Ces descripteurs aideront à la recherche et au classement.
                </p>
                {errors.descripteurs && <p className="text-red-500 text-sm mt-1">{errors.descripteurs}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN (optionnel)
                  </label>
                  <input type="text" value={formData.isbn} onChange={function (e) { return handleInputChange('isbn', e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.isbn ? 'border-red-300' : 'border-gray-300')} placeholder="978-2-123456-78-9"/>
                  {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <lucide_react_1.Image className="w-4 h-4 inline mr-1"/>
                    Couverture (optionnel)
                  </label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.couverture} onChange={function (e) { return handleInputChange('couverture', e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Chemin vers l'image" readOnly/>
                    <button type="button" onClick={selectCoverImage} className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Parcourir
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea value={formData.description} onChange={function (e) { return handleInputChange('description', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} placeholder="Description détaillée du document..."/>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <lucide_react_1.Save className="w-4 h-4"/>
              {isLoading ? 'Enregistrement...' : (editingDocument ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
exports.AddDocument = AddDocument;
