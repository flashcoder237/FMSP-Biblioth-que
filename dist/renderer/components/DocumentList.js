"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const DocumentList = ({ documents, onAdd, onEdit, onDelete, onRefresh, syncStatus, networkStatus }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [selectedSyncStatus, setSelectedSyncStatus] = (0, react_1.useState)('all');
    const [filteredDocuments, setFilteredDocuments] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        filterDocuments();
    }, [documents, searchTerm, selectedCategory, selectedSyncStatus]);
    const filterDocuments = () => {
        let filtered = documents;
        // Filtrage par terme de recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(doc => doc.titre.toLowerCase().includes(term) ||
                doc.auteur.toLowerCase().includes(term) ||
                doc.editeur.toLowerCase().includes(term) ||
                doc.descripteurs.toLowerCase().includes(term) ||
                doc.cote.toLowerCase().includes(term) ||
                (doc.isbn && doc.isbn.toLowerCase().includes(term)));
        }
        // Filtrage par catégorie (utilise les descripteurs)
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(doc => doc.descripteurs.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
        // Filtrage par statut de sync
        if (selectedSyncStatus !== 'all') {
            filtered = filtered.filter(doc => doc.syncStatus === selectedSyncStatus);
        }
        setFilteredDocuments(filtered);
    };
    const getUniqueCategories = () => {
        const categories = new Set();
        documents.forEach(doc => {
            doc.descripteurs.split(',').forEach(desc => {
                categories.add(desc.trim());
            });
        });
        return Array.from(categories).sort();
    };
    const getSyncStatusIcon = (status) => {
        switch (status) {
            case 'synced':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500", title: "Synchronis\u00E9" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-yellow-500", title: "En attente de synchronisation" });
            case 'error':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500", title: "Erreur de synchronisation" });
            case 'conflict':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-orange-500", title: "Conflit de synchronisation" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getNetworkStatusDisplay = () => {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [networkStatus.isOnline ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-4 h-4" }), "En ligne"] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4" }), "Hors ligne"] })), syncStatus.syncInProgress && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-blue-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" }), "Synchronisation..."] })), syncStatus.pendingOperations > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-orange-600", children: [syncStatus.pendingOperations, " en attente"] }))] }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-gray-800 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-6 h-6 text-blue-500" }), "Documents (", filteredDocuments.length, ")"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Gestion de la collection documentaire" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [getNetworkStatusDisplay(), (0, jsx_runtime_1.jsxs)("button", { onClick: onAdd, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Nouveau document"] })] })] }), syncStatus.lastSync && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-sm text-gray-500", children: ["Derni\u00E8re synchronisation: ", new Date(syncStatus.lastSync).toLocaleString('fr-FR')] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Rechercher" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Titre, auteur, \u00E9diteur, cote, ISBN..." })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cat\u00E9gorie" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Toutes les cat\u00E9gories" }), getUniqueCategories().map(category => ((0, jsx_runtime_1.jsx)("option", { value: category, children: category }, category)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut sync" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedSyncStatus, onChange: (e) => setSelectedSyncStatus(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les statuts" }), (0, jsx_runtime_1.jsx)("option", { value: "synced", children: "Synchronis\u00E9" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "En attente" }), (0, jsx_runtime_1.jsx)("option", { value: "error", children: "Erreur" }), (0, jsx_runtime_1.jsx)("option", { value: "conflict", children: "Conflit" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredDocuments.map((document) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow", children: [document.couverture && ((0, jsx_runtime_1.jsx)("div", { className: "h-48 bg-gray-100 rounded-t-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: document.couverture, alt: `Couverture de ${document.titre}`, className: "w-full h-full object-cover", onError: (e) => {
                                    e.currentTarget.style.display = 'none';
                                } }) })), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-800 truncate", title: document.titre, children: document.titre }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 truncate", title: document.auteur, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-3 h-3 inline mr-1" }), document.auteur] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ml-2", children: [getSyncStatusIcon(document.syncStatus), document.estEmprunte && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full", title: "Emprunt\u00E9" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "w-3 h-3 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: document.editeur })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "w-3 h-3 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: document.lieuEdition })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-3 h-3 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: document.annee })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hash, { className: "w-3 h-3 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-xs truncate", children: document.cote })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "w-3 h-3 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1 min-w-0", children: [document.descripteurs.split(',').slice(0, 3).map((desc, index) => ((0, jsx_runtime_1.jsx)("span", { className: "inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full truncate max-w-20", title: desc.trim(), children: desc.trim() }, index))), document.descripteurs.split(',').length > 3 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["+", document.descripteurs.split(',').length - 3] }))] })] })] }), document.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-3 line-clamp-2", title: document.description, children: document.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mt-4 pt-3 border-t", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["v", document.version, " \u2022 ", new Date(document.lastModified).toLocaleDateString('fr-FR')] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onEdit(document), className: "p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors", title: "Modifier", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => document.id && onDelete(document.id), className: "p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors", title: "Supprimer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] })] })] })] }, document.id))) }), filteredDocuments.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                            ? 'Aucun document trouvé'
                            : 'Aucun document dans la collection' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6", children: searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                            ? 'Essayez de modifier vos critères de recherche'
                            : 'Commencez par ajouter votre premier document à la bibliothèque' }), (0, jsx_runtime_1.jsxs)("button", { onClick: onAdd, className: "bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Ajouter un document"] })] }))] }));
};
exports.DocumentList = DocumentList;
