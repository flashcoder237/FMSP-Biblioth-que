"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentList = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var DocumentList = function (_a) {
    var documents = _a.documents, onAdd = _a.onAdd, onEdit = _a.onEdit, onDelete = _a.onDelete, onRefresh = _a.onRefresh, syncStatus = _a.syncStatus, networkStatus = _a.networkStatus;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), selectedCategory = _c[0], setSelectedCategory = _c[1];
    var _d = (0, react_1.useState)('all'), selectedSyncStatus = _d[0], setSelectedSyncStatus = _d[1];
    var _e = (0, react_1.useState)([]), filteredDocuments = _e[0], setFilteredDocuments = _e[1];
    (0, react_1.useEffect)(function () {
        filterDocuments();
    }, [documents, searchTerm, selectedCategory, selectedSyncStatus]);
    var filterDocuments = function () {
        var filtered = documents;
        // Filtrage par terme de recherche
        if (searchTerm) {
            var term_1 = searchTerm.toLowerCase();
            filtered = filtered.filter(function (doc) {
                return doc.titre.toLowerCase().includes(term_1) ||
                    doc.auteur.toLowerCase().includes(term_1) ||
                    doc.editeur.toLowerCase().includes(term_1) ||
                    doc.descripteurs.toLowerCase().includes(term_1) ||
                    doc.cote.toLowerCase().includes(term_1) ||
                    (doc.isbn && doc.isbn.toLowerCase().includes(term_1));
            });
        }
        // Filtrage par catégorie (utilise les descripteurs)
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(function (doc) {
                return doc.descripteurs.toLowerCase().includes(selectedCategory.toLowerCase());
            });
        }
        // Filtrage par statut de sync
        if (selectedSyncStatus !== 'all') {
            filtered = filtered.filter(function (doc) { return doc.syncStatus === selectedSyncStatus; });
        }
        setFilteredDocuments(filtered);
    };
    var getUniqueCategories = function () {
        var categories = new Set();
        documents.forEach(function (doc) {
            doc.descripteurs.split(',').forEach(function (desc) {
                categories.add(desc.trim());
            });
        });
        return Array.from(categories).sort();
    };
    var getSyncStatusIcon = function (status) {
        switch (status) {
            case 'synced':
                return <lucide_react_1.CheckCircle className="w-4 h-4 text-green-500"/>;
            case 'pending':
                return <lucide_react_1.Clock className="w-4 h-4 text-yellow-500"/>;
            case 'error':
                return <lucide_react_1.AlertCircle className="w-4 h-4 text-red-500"/>;
            case 'conflict':
                return <lucide_react_1.AlertCircle className="w-4 h-4 text-orange-500"/>;
            default:
                return <lucide_react_1.Clock className="w-4 h-4 text-gray-500"/>;
        }
    };
    var getNetworkStatusDisplay = function () {
        return (<div className="flex items-center gap-2 text-sm">
        {networkStatus.isOnline ? (<div className="flex items-center gap-1 text-green-600">
            <lucide_react_1.Wifi className="w-4 h-4"/>
            En ligne
          </div>) : (<div className="flex items-center gap-1 text-red-600">
            <lucide_react_1.WifiOff className="w-4 h-4"/>
            Hors ligne
          </div>)}
        
        {syncStatus.syncInProgress && (<div className="flex items-center gap-1 text-blue-600">
            <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>
            Synchronisation...
          </div>)}
        
        {syncStatus.pendingOperations > 0 && (<div className="text-orange-600">
            {syncStatus.pendingOperations} en attente
          </div>)}
      </div>);
    };
    return (<div className="space-y-6">
      {/* En-tête avec statuts */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <lucide_react_1.BookOpen className="w-6 h-6 text-blue-500"/>
              Documents ({filteredDocuments.length})
            </h1>
            <p className="text-gray-600 mt-1">
              Gestion de la collection documentaire
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {getNetworkStatusDisplay()}
            
            <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <lucide_react_1.Plus className="w-4 h-4"/>
              Nouveau document
            </button>
          </div>
        </div>
        
        {syncStatus.lastSync && (<div className="mt-2 text-sm text-gray-500">
            Dernière synchronisation: {new Date(syncStatus.lastSync).toLocaleString('fr-FR')}
          </div>)}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
              <input type="text" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Titre, auteur, éditeur, cote, ISBN..."/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select value={selectedCategory} onChange={function (e) { return setSelectedCategory(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Toutes les catégories</option>
              {getUniqueCategories().map(function (category) { return (<option key={category} value={category}>{category}</option>); })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut sync
            </label>
            <select value={selectedSyncStatus} onChange={function (e) { return setSelectedSyncStatus(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Tous les statuts</option>
              <option value="synced">Synchronisé</option>
              <option value="pending">En attente</option>
              <option value="error">Erreur</option>
              <option value="conflict">Conflit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(function (document) { return (<div key={document.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Image de couverture */}
            {document.couverture && (<div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                <img src={document.couverture} alt={"Couverture de ".concat(document.titre)} className="w-full h-full object-cover" onError={function (e) {
                    e.currentTarget.style.display = 'none';
                }}/>
              </div>)}
            
            <div className="p-4">
              {/* En-tête avec statut de sync */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate" title={document.titre}>
                    {document.titre}
                  </h3>
                  <p className="text-sm text-gray-600 truncate" title={document.auteur}>
                    <lucide_react_1.User className="w-3 h-3 inline mr-1"/>
                    {document.auteur}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {getSyncStatusIcon(document.syncStatus)}
                  {document.estEmprunte && (<div className="w-2 h-2 bg-orange-500 rounded-full" title="Emprunté"/>)}
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1 truncate">
                  <lucide_react_1.Building className="w-3 h-3 flex-shrink-0"/>
                  <span className="truncate">{document.editeur}</span>
                </div>
                
                <div className="flex items-center gap-1 truncate">
                  <lucide_react_1.MapPin className="w-3 h-3 flex-shrink-0"/>
                  <span className="truncate">{document.lieuEdition}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <lucide_react_1.Calendar className="w-3 h-3 flex-shrink-0"/>
                  <span>{document.annee}</span>
                </div>
                
                <div className="flex items-center gap-1 truncate">
                  <lucide_react_1.Hash className="w-3 h-3 flex-shrink-0"/>
                  <span className="font-mono text-xs truncate">{document.cote}</span>
                </div>
                
                <div className="flex items-start gap-1">
                  <lucide_react_1.Tag className="w-3 h-3 flex-shrink-0 mt-0.5"/>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {document.descripteurs.split(',').slice(0, 3).map(function (desc, index) { return (<span key={index} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full truncate max-w-20" title={desc.trim()}>
                        {desc.trim()}
                      </span>); })}
                    {document.descripteurs.split(',').length > 3 && (<span className="text-xs text-gray-500">
                        +{document.descripteurs.split(',').length - 3}
                      </span>)}
                  </div>
                </div>
              </div>

              {/* Description si disponible */}
              {document.description && (<p className="text-sm text-gray-600 mt-3 line-clamp-2" title={document.description}>
                  {document.description}
                </p>)}

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="text-xs text-gray-500">
                  v{document.version} • {new Date(document.lastModified).toLocaleDateString('fr-FR')}
                </div>
                
                <div className="flex gap-2">
                  <button onClick={function () { return onEdit(document); }} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Modifier">
                    <lucide_react_1.Edit className="w-4 h-4"/>
                  </button>
                  <button onClick={function () { return document.id && onDelete(document.id); }} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
          </div>); })}
      </div>

      {/* Message si aucun document */}
      {filteredDocuments.length === 0 && (<div className="text-center py-12">
          <lucide_react_1.BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                ? 'Aucun document trouvé'
                : 'Aucun document dans la collection'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier document à la bibliothèque'}
          </p>
          <button onClick={onAdd} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto">
            <lucide_react_1.Plus className="w-4 h-4"/>
            Ajouter un document
          </button>
        </div>)}
    </div>);
};
exports.DocumentList = DocumentList;
