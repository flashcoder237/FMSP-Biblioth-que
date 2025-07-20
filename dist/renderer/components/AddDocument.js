"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDocument = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const AddDocument = ({ onAdd, onCancel, editingDocument }) => {
    const [formData, setFormData] = (0, react_1.useState)({
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
    const [authors, setAuthors] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errors, setErrors] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
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
    const loadAuthors = async () => {
        try {
            const authorsList = await window.electronAPI.getAuthors();
            setAuthors(authorsList);
        }
        catch (error) {
            console.error('Erreur lors du chargement des auteurs:', error);
        }
    };
    const loadCategories = async () => {
        try {
            const categoriesList = await window.electronAPI.getCategories();
            setCategories(categoriesList);
        }
        catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
        }
    };
    const generateCote = () => {
        if (formData.descripteurs && formData.auteur && formData.annee) {
            const category = formData.descripteurs.split(',')[0].trim().toUpperCase();
            const authorCode = formData.auteur.split(' ').map(name => name.substring(0, 3).toUpperCase()).join('-');
            const yearCode = formData.annee.substring(-2);
            const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
            const generatedCote = `${category.substring(0, 3)}-${authorCode}-${yearCode}${randomNum}`;
            setFormData(prev => ({ ...prev, cote: generatedCote }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
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
        const year = parseInt(formData.annee);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const documentData = {
                ...formData,
                estEmprunte: false,
                syncStatus: 'pending',
                lastModified: new Date().toISOString(),
                version: editingDocument ? editingDocument.version + 1 : 1
            };
            await onAdd(documentData);
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
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du document:', error);
            setErrors({ submit: 'Erreur lors de l\'enregistrement du document' });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Effacer l'erreur pour ce champ
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const selectCoverImage = async () => {
        try {
            const filePath = await window.electronAPI.selectFile({
                filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
                ]
            });
            if (filePath) {
                setFormData(prev => ({ ...prev, couverture: filePath }));
            }
        }
        catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-semibold text-gray-800 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-5 h-5" }), editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'] }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [errors.submit && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg", children: errors.submit })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-4 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-medium text-gray-800 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5" }), "Informations principales"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4 inline mr-1" }), "Auteur *"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.auteur, onChange: (e) => handleInputChange('auteur', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.auteur ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Nom de l'auteur", list: "authors-list" }), (0, jsx_runtime_1.jsx)("datalist", { id: "authors-list", children: authors.map(author => ((0, jsx_runtime_1.jsx)("option", { value: author.name }, author.id))) }), errors.auteur && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.auteur })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-4 h-4 inline mr-1" }), "Titre *"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.titre, onChange: (e) => handleInputChange('titre', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.titre ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Titre du document" }), errors.titre && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.titre })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-4 h-4 inline mr-1" }), "\u00C9diteur *"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.editeur, onChange: (e) => handleInputChange('editeur', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.editeur ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Nom de l'\u00E9diteur" }), errors.editeur && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.editeur })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-4 h-4 inline mr-1" }), "Lieu d'\u00E9dition *"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.lieuEdition, onChange: (e) => handleInputChange('lieuEdition', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lieuEdition ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Ville d'\u00E9dition" }), errors.lieuEdition && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.lieuEdition })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4 inline mr-1" }), "Ann\u00E9e *"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formData.annee, onChange: (e) => handleInputChange('annee', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.annee ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Ann\u00E9e de publication", min: "1000", max: new Date().getFullYear() + 10 }), errors.annee && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.annee })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hash, { className: "w-4 h-4 inline mr-1" }), "Cote *"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.cote, onChange: (e) => handleInputChange('cote', e.target.value), className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cote ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Code de classification" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: generateCote, className: "px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", title: "G\u00E9n\u00E9rer automatiquement", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }) })] }), errors.cote && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.cote })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-4 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-medium text-gray-800 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "w-5 h-5" }), "M\u00E9tadonn\u00E9es et classification"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descripteurs / Mots-cl\u00E9s *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.descripteurs, onChange: (e) => handleInputChange('descripteurs', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.descripteurs ? 'border-red-300' : 'border-gray-300'}`, placeholder: "ex: Fiction, Roman historique, XIXe si\u00E8cle (s\u00E9par\u00E9s par des virgules)" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "S\u00E9parez les mots-cl\u00E9s par des virgules. Ces descripteurs aideront \u00E0 la recherche et au classement." }), errors.descripteurs && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.descripteurs })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "ISBN (optionnel)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.isbn, onChange: (e) => handleInputChange('isbn', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isbn ? 'border-red-300' : 'border-gray-300'}`, placeholder: "978-2-123456-78-9" }), errors.isbn && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.isbn })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-4 h-4 inline mr-1" }), "Couverture (optionnel)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.couverture, onChange: (e) => handleInputChange('couverture', e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Chemin vers l'image", readOnly: true }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: selectCoverImage, className: "px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Parcourir" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description (optionnel)" }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", rows: 4, placeholder: "Description d\u00E9taill\u00E9e du document..." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors", children: "Annuler" }), (0, jsx_runtime_1.jsxs)("button", { type: "submit", disabled: isLoading, className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), isLoading ? 'Enregistrement...' : (editingDocument ? 'Modifier' : 'Ajouter')] })] })] })] }) }));
};
exports.AddDocument = AddDocument;
