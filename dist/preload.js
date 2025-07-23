/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/preload.ts":
/*!************************!*\
  !*** ./src/preload.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDocumentFromBook = exports.createBookFromDocument = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
// Debug amélioré
console.log('=== Preload Script Debug ===');
console.log('Process type:', process?.type);
console.log('Process versions:', process?.versions);
console.log('contextBridge available:', typeof electron_1.contextBridge !== 'undefined');
console.log('ipcRenderer available:', typeof electron_1.ipcRenderer !== 'undefined');
console.log('sandbox:', process?.sandboxed);
// Vérification plus robuste du contexte
if (typeof electron_1.contextBridge === 'undefined') {
    console.error('❌ contextBridge is undefined');
    console.error('Current context:', {
        nodeIntegration: process?.env?.ELECTRON_ENABLE_NODE_INTEGRATION,
        contextIsolation: process?.env?.ELECTRON_CONTEXT_ISOLATION,
        sandbox: process?.sandboxed,
        type: process?.type
    });
    // Ne pas lancer d'erreur fatale, permettre de continuer
    console.warn('⚠️ Running without contextBridge - this may indicate a configuration issue');
}
else {
    console.log('✅ contextBridge is available');
}
if (typeof electron_1.ipcRenderer === 'undefined') {
    console.error('❌ ipcRenderer is undefined');
}
else {
    console.log('✅ ipcRenderer is available');
}
// Fonctions utilitaires pour la compatibilité Book/Document
const createBookFromDocument = (document) => {
    const book = { ...document };
    // Ajouter les getters pour la compatibilité
    Object.defineProperties(book, {
        title: {
            get: function () { return this.titre; },
            enumerable: true
        },
        author: {
            get: function () { return this.auteur; },
            enumerable: true
        },
        category: {
            get: function () { return this.descripteurs.split(',')[0]?.trim() || ''; },
            enumerable: true
        },
        publishedDate: {
            get: function () { return this.annee; },
            enumerable: true
        },
        coverUrl: {
            get: function () { return this.couverture; },
            enumerable: true
        },
        isBorrowed: {
            get: function () { return this.estEmprunte; },
            enumerable: true
        },
        borrowerId: {
            get: function () { return this.emprunteurId; },
            enumerable: true
        },
        borrowDate: {
            get: function () { return this.dateEmprunt; },
            enumerable: true
        },
        expectedReturnDate: {
            get: function () { return this.dateRetourPrevu; },
            enumerable: true
        },
        returnDate: {
            get: function () { return this.dateRetour; },
            enumerable: true
        },
        borrowerName: {
            get: function () { return this.nomEmprunteur; },
            enumerable: true
        }
    });
    return book;
};
exports.createBookFromDocument = createBookFromDocument;
const createDocumentFromBook = (book) => {
    const now = new Date().toISOString();
    return {
        auteur: book.author || book.auteur || '',
        titre: book.title || book.titre || '',
        editeur: book.editeur || 'Non spécifié',
        lieuEdition: book.lieuEdition || 'Non spécifié',
        annee: book.publishedDate || book.annee || new Date().getFullYear().toString(),
        descripteurs: book.category || book.descripteurs || 'Général',
        cote: book.cote || `GEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        isbn: book.isbn,
        description: book.description,
        couverture: book.coverUrl || book.couverture,
        estEmprunte: book.isBorrowed || book.estEmprunte || false,
        emprunteurId: book.borrowerId || book.emprunteurId,
        dateEmprunt: book.borrowDate || book.dateEmprunt,
        dateRetourPrevu: book.expectedReturnDate || book.dateRetourPrevu,
        dateRetour: book.returnDate || book.dateRetour,
        nomEmprunteur: book.borrowerName || book.nomEmprunteur,
        localId: book.localId,
        remoteId: book.remoteId,
        syncStatus: book.syncStatus || 'pending',
        lastModified: book.lastModified || now,
        version: book.version || 1,
        deletedAt: book.deletedAt,
        createdAt: book.createdAt || now
    };
};
exports.createDocumentFromBook = createDocumentFromBook;
// API Definition
const electronAPI = {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer?.invoke('window-controls:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer?.invoke('window-controls:maximize'),
    closeWindow: () => electron_1.ipcRenderer?.invoke('window-controls:close'),
    // Authentication
    getAuthStatus: () => electron_1.ipcRenderer?.invoke('auth:status') || Promise.resolve(false),
    login: (credentials) => electron_1.ipcRenderer?.invoke('auth:login', credentials) || Promise.resolve({ success: false, error: 'IPC not available' }),
    logout: () => electron_1.ipcRenderer?.invoke('auth:logout') || Promise.resolve(),
    // Database operations - Books (avec compatibilité Document)
    getBooks: () => electron_1.ipcRenderer?.invoke('db:getBooks').then((documents) => documents.map(exports.createBookFromDocument)) || Promise.resolve([]),
    addBook: (book) => electron_1.ipcRenderer?.invoke('db:addBook', (0, exports.createDocumentFromBook)(book)) || Promise.resolve(0),
    updateBook: (book) => electron_1.ipcRenderer?.invoke('db:updateBook', { ...(0, exports.createDocumentFromBook)(book), id: book.id }) || Promise.resolve(false),
    deleteBook: (id) => electron_1.ipcRenderer?.invoke('db:deleteBook', id) || Promise.resolve(false),
    searchBooks: (query) => electron_1.ipcRenderer?.invoke('db:searchBooks', query).then((documents) => documents.map(exports.createBookFromDocument)) || Promise.resolve([]),
    // Database operations - Documents (nouveau)
    getDocuments: () => electron_1.ipcRenderer?.invoke('db:getDocuments') || Promise.resolve([]),
    addDocument: (document) => electron_1.ipcRenderer?.invoke('db:addDocument', document) || Promise.resolve(0),
    updateDocument: (document) => electron_1.ipcRenderer?.invoke('db:updateDocument', document) || Promise.resolve(false),
    deleteDocument: (id) => electron_1.ipcRenderer?.invoke('db:deleteDocument', id) || Promise.resolve(false),
    searchDocuments: (query) => electron_1.ipcRenderer?.invoke('db:searchDocuments', query) || Promise.resolve([]),
    // Database operations - Authors
    getAuthors: () => electron_1.ipcRenderer?.invoke('db:getAuthors') || Promise.resolve([]),
    addAuthor: (author) => electron_1.ipcRenderer?.invoke('db:addAuthor', {
        ...author,
        localId: author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: author.syncStatus || 'pending',
        lastModified: author.lastModified || new Date().toISOString(),
        version: author.version || 1,
        createdAt: author.createdAt || new Date().toISOString()
    }) || Promise.resolve(0),
    // Database operations - Categories
    getCategories: () => electron_1.ipcRenderer?.invoke('db:getCategories') || Promise.resolve([]),
    addCategory: (category) => electron_1.ipcRenderer?.invoke('db:addCategory', {
        ...category,
        localId: category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: category.syncStatus || 'pending',
        lastModified: category.lastModified || new Date().toISOString(),
        version: category.version || 1,
        createdAt: category.createdAt || new Date().toISOString()
    }) || Promise.resolve(0),
    // Database operations - Borrowers
    getBorrowers: () => electron_1.ipcRenderer?.invoke('db:getBorrowers') || Promise.resolve([]),
    addBorrower: (borrower) => electron_1.ipcRenderer?.invoke('db:addBorrower', {
        ...borrower,
        localId: borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: borrower.syncStatus || 'pending',
        lastModified: borrower.lastModified || new Date().toISOString(),
        version: borrower.version || 1,
        createdAt: borrower.createdAt || new Date().toISOString()
    }) || Promise.resolve(0),
    updateBorrower: (borrower) => electron_1.ipcRenderer?.invoke('db:updateBorrower', {
        ...borrower,
        lastModified: new Date().toISOString(),
        version: (borrower.version || 1) + 1,
        syncStatus: 'pending'
    }) || Promise.resolve(false),
    deleteBorrower: (id) => electron_1.ipcRenderer?.invoke('db:deleteBorrower', id) || Promise.resolve(false),
    searchBorrowers: (query) => electron_1.ipcRenderer?.invoke('db:searchBorrowers', query) || Promise.resolve([]),
    // Borrow operations
    getBorrowedDocuments: () => electron_1.ipcRenderer?.invoke('db:getBorrowedDocuments') || Promise.resolve([]),
    // Compatibility method
    getBorrowedBooks: () => electron_1.ipcRenderer?.invoke('db:getBorrowedDocuments') || Promise.resolve([]),
    borrowDocument: (documentId, borrowerId, expectedReturnDate) => electron_1.ipcRenderer?.invoke('db:borrowDocument', documentId, borrowerId, expectedReturnDate) || Promise.resolve(0),
    // Compatibility method
    borrowBook: (documentId, borrowerId, expectedReturnDate) => electron_1.ipcRenderer?.invoke('db:borrowDocument', documentId, borrowerId, expectedReturnDate) || Promise.resolve(0),
    returnBook: (borrowHistoryId, notes) => electron_1.ipcRenderer?.invoke('db:returnBook', borrowHistoryId, notes) || Promise.resolve(false),
    getBorrowHistory: (filter) => electron_1.ipcRenderer?.invoke('db:getBorrowHistory', filter) || Promise.resolve([]),
    // Statistics
    getStats: () => electron_1.ipcRenderer?.invoke('db:getStats') || Promise.resolve({
        totalDocuments: 0,
        borrowedDocuments: 0,
        availableDocuments: 0,
        totalAuthors: 0,
        totalCategories: 0,
        totalBorrowers: 0,
        totalStudents: 0,
        totalStaff: 0,
        overdueBooks: 0
    }),
    getAdvancedStats: () => electron_1.ipcRenderer?.invoke('stats:advanced') || Promise.resolve({}),
    // Settings management
    getSettings: () => electron_1.ipcRenderer?.invoke('settings:get') || Promise.resolve(null),
    saveSettings: (settings) => electron_1.ipcRenderer?.invoke('settings:save', settings) || Promise.resolve(false),
    // Backup and restore operations
    createBackup: () => electron_1.ipcRenderer?.invoke('backup:create') || Promise.resolve(''),
    restoreBackup: () => electron_1.ipcRenderer?.invoke('backup:restore') || Promise.resolve(false),
    clearAllData: () => electron_1.ipcRenderer?.invoke('db:clearAll') || Promise.resolve(false),
    // Export/Import operations
    exportDatabase: (filePath) => electron_1.ipcRenderer?.invoke('db:export', filePath) || Promise.resolve(),
    importDatabase: (filePath) => electron_1.ipcRenderer?.invoke('db:import', filePath) || Promise.resolve(false),
    // Print operations
    printInventory: (data) => electron_1.ipcRenderer?.invoke('print:inventory', data) || Promise.resolve(false),
    printAvailableBooks: (data) => electron_1.ipcRenderer?.invoke('print:available-books', data) || Promise.resolve(false),
    printBorrowedBooks: (data) => electron_1.ipcRenderer?.invoke('print:borrowed-books', data) || Promise.resolve(false),
    printBorrowHistory: (data) => electron_1.ipcRenderer?.invoke('print:borrow-history', data) || Promise.resolve(false),
    // Export operations
    exportCSV: (data) => electron_1.ipcRenderer?.invoke('export:csv', data) || Promise.resolve(null),
    // File operations
    selectFile: (options) => electron_1.ipcRenderer?.invoke('file:select', options) || Promise.resolve(null),
    selectDirectory: () => electron_1.ipcRenderer?.invoke('file:selectDirectory') || Promise.resolve(null),
    // Notification operations
    showNotification: (title, body) => electron_1.ipcRenderer?.invoke('notification:show', title, body) || Promise.resolve(),
    // System information
    getSystemInfo: () => electron_1.ipcRenderer?.invoke('system:info') || Promise.resolve({}),
    // Application updates
    checkForUpdates: () => electron_1.ipcRenderer?.invoke('system:checkUpdates') || Promise.resolve({}),
    // Theme operations
    setTheme: (theme) => electron_1.ipcRenderer?.invoke('theme:set', theme) || Promise.resolve(),
    getTheme: () => electron_1.ipcRenderer?.invoke('theme:get') || Promise.resolve('light'),
    // Synchronization operations
    getSyncStatus: () => electron_1.ipcRenderer?.invoke('sync:getStatus') || Promise.resolve({
        isOnline: false,
        lastSync: null,
        pendingOperations: 0,
        syncInProgress: false,
        errors: []
    }),
    triggerSync: () => electron_1.ipcRenderer?.invoke('sync:trigger') || Promise.resolve(false),
    clearSyncErrors: () => electron_1.ipcRenderer?.invoke('sync:clearErrors') || Promise.resolve(false),
    retrySyncOperation: (operationId) => electron_1.ipcRenderer?.invoke('sync:retry', operationId) || Promise.resolve(false)
};
// Type guard pour vérifier si nous sommes dans un environnement qui a accès à la fenêtre
function hasWindowAccess() {
    try {
        return typeof globalThis !== 'undefined' &&
            'window' in globalThis &&
            globalThis.window !== undefined;
    }
    catch {
        return false;
    }
}
// Exposer l'API seulement si contextBridge est disponible
if (typeof electron_1.contextBridge !== 'undefined' && typeof electron_1.ipcRenderer !== 'undefined') {
    try {
        electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
        console.log('✅ electronAPI exposed via contextBridge');
    }
    catch (error) {
        console.error('❌ Failed to expose electronAPI:', error);
        // Fallback: exposer directement sur globalThis si disponible
        if (hasWindowAccess()) {
            globalThis.window.electronAPI = electronAPI;
            console.log('⚠️ electronAPI exposed directly on window (fallback)');
        }
    }
}
else {
    console.warn('⚠️ contextBridge or ipcRenderer not available, using fallback');
    // Fallback pour les environnements où contextBridge n'est pas disponible
    if (hasWindowAccess()) {
        globalThis.window.electronAPI = electronAPI;
        console.log('⚠️ electronAPI exposed directly on window (no contextBridge)');
    }
    else {
        console.error('❌ Window object not available');
    }
}


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/preload.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=preload.js.map