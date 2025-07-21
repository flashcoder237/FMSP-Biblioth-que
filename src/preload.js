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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentFromBook = exports.createBookFromDocument = void 0;
var electron_1 = require("electron");
// Fonctions utilitaires pour la compatibilité Book/Document
var createBookFromDocument = function (document) {
    var book = __assign({}, document);
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
            get: function () { var _a; return ((_a = this.descripteurs.split(',')[0]) === null || _a === void 0 ? void 0 : _a.trim()) || ''; },
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
var createDocumentFromBook = function (book) {
    var now = new Date().toISOString();
    return {
        auteur: book.author || book.auteur || '',
        titre: book.title || book.titre || '',
        editeur: book.editeur || 'Non spécifié',
        lieuEdition: book.lieuEdition || 'Non spécifié',
        annee: book.publishedDate || book.annee || new Date().getFullYear().toString(),
        descripteurs: book.category || book.descripteurs || 'Général',
        cote: book.cote || "GEN-".concat(Math.random().toString(36).substr(2, 6).toUpperCase()),
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
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: function () { return electron_1.ipcRenderer.invoke('window-controls:minimize'); },
    maximizeWindow: function () { return electron_1.ipcRenderer.invoke('window-controls:maximize'); },
    closeWindow: function () { return electron_1.ipcRenderer.invoke('window-controls:close'); },
    // Authentication
    getAuthStatus: function () { return electron_1.ipcRenderer.invoke('auth:status'); },
    login: function (credentials) { return electron_1.ipcRenderer.invoke('auth:login', credentials); },
    logout: function () { return electron_1.ipcRenderer.invoke('auth:logout'); },
    // Database operations - Books (avec compatibilité Document)
    getBooks: function () {
        return electron_1.ipcRenderer.invoke('db:getBooks').then(function (documents) {
            return documents.map(exports.createBookFromDocument);
        });
    },
    addBook: function (book) {
        return electron_1.ipcRenderer.invoke('db:addBook', (0, exports.createDocumentFromBook)(book));
    },
    updateBook: function (book) {
        return electron_1.ipcRenderer.invoke('db:updateBook', __assign(__assign({}, (0, exports.createDocumentFromBook)(book)), { id: book.id }));
    },
    deleteBook: function (id) { return electron_1.ipcRenderer.invoke('db:deleteBook', id); },
    searchBooks: function (query) {
        return electron_1.ipcRenderer.invoke('db:searchBooks', query).then(function (documents) {
            return documents.map(exports.createBookFromDocument);
        });
    },
    // Database operations - Documents (nouveau)
    getDocuments: function () { return electron_1.ipcRenderer.invoke('db:getDocuments'); },
    addDocument: function (document) { return electron_1.ipcRenderer.invoke('db:addDocument', document); },
    updateDocument: function (document) { return electron_1.ipcRenderer.invoke('db:updateDocument', document); },
    deleteDocument: function (id) { return electron_1.ipcRenderer.invoke('db:deleteDocument', id); },
    searchDocuments: function (query) { return electron_1.ipcRenderer.invoke('db:searchDocuments', query); },
    // Database operations - Authors
    getAuthors: function () { return electron_1.ipcRenderer.invoke('db:getAuthors'); },
    addAuthor: function (author) { return electron_1.ipcRenderer.invoke('db:addAuthor', __assign(__assign({}, author), { localId: author.localId || "author_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), syncStatus: author.syncStatus || 'pending', lastModified: author.lastModified || new Date().toISOString(), version: author.version || 1, createdAt: author.createdAt || new Date().toISOString() })); },
    // Database operations - Categories
    getCategories: function () { return electron_1.ipcRenderer.invoke('db:getCategories'); },
    addCategory: function (category) { return electron_1.ipcRenderer.invoke('db:addCategory', __assign(__assign({}, category), { localId: category.localId || "category_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), syncStatus: category.syncStatus || 'pending', lastModified: category.lastModified || new Date().toISOString(), version: category.version || 1, createdAt: category.createdAt || new Date().toISOString() })); },
    // Database operations - Borrowers
    getBorrowers: function () { return electron_1.ipcRenderer.invoke('db:getBorrowers'); },
    addBorrower: function (borrower) { return electron_1.ipcRenderer.invoke('db:addBorrower', __assign(__assign({}, borrower), { localId: borrower.localId || "borrower_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), syncStatus: borrower.syncStatus || 'pending', lastModified: borrower.lastModified || new Date().toISOString(), version: borrower.version || 1, createdAt: borrower.createdAt || new Date().toISOString() })); },
    updateBorrower: function (borrower) { return electron_1.ipcRenderer.invoke('db:updateBorrower', __assign(__assign({}, borrower), { lastModified: new Date().toISOString(), version: (borrower.version || 1) + 1, syncStatus: 'pending' })); },
    deleteBorrower: function (id) { return electron_1.ipcRenderer.invoke('db:deleteBorrower', id); },
    searchBorrowers: function (query) { return electron_1.ipcRenderer.invoke('db:searchBorrowers', query); },
    // Borrow operations
    getBorrowedBooks: function () { return electron_1.ipcRenderer.invoke('db:getBorrowedBooks'); },
    borrowBook: function (bookId, borrowerId, expectedReturnDate) {
        return electron_1.ipcRenderer.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate);
    },
    returnBook: function (borrowHistoryId, notes) {
        return electron_1.ipcRenderer.invoke('db:returnBook', borrowHistoryId, notes);
    },
    getBorrowHistory: function (filter) {
        return electron_1.ipcRenderer.invoke('db:getBorrowHistory', filter);
    },
    // Statistics
    getStats: function () { return electron_1.ipcRenderer.invoke('db:getStats'); },
    getAdvancedStats: function () { return electron_1.ipcRenderer.invoke('stats:advanced'); },
    // Settings management
    getSettings: function () { return electron_1.ipcRenderer.invoke('settings:get'); },
    saveSettings: function (settings) { return electron_1.ipcRenderer.invoke('settings:save', settings); },
    // Backup and restore operations
    createBackup: function () { return electron_1.ipcRenderer.invoke('backup:create'); },
    restoreBackup: function () { return electron_1.ipcRenderer.invoke('backup:restore'); },
    clearAllData: function () { return electron_1.ipcRenderer.invoke('db:clearAll'); },
    // Export/Import operations
    exportDatabase: function (filePath) { return electron_1.ipcRenderer.invoke('db:export', filePath); },
    importDatabase: function (filePath) { return electron_1.ipcRenderer.invoke('db:import', filePath); },
    // Print operations
    printInventory: function (data) { return electron_1.ipcRenderer.invoke('print:inventory', data); },
    printAvailableBooks: function (data) { return electron_1.ipcRenderer.invoke('print:available-books', data); },
    printBorrowedBooks: function (data) { return electron_1.ipcRenderer.invoke('print:borrowed-books', data); },
    printBorrowHistory: function (data) { return electron_1.ipcRenderer.invoke('print:borrow-history', data); },
    // Export operations
    exportCSV: function (data) { return electron_1.ipcRenderer.invoke('export:csv', data); },
    // File operations
    selectFile: function (options) { return electron_1.ipcRenderer.invoke('file:select', options); },
    selectDirectory: function () { return electron_1.ipcRenderer.invoke('file:selectDirectory'); },
    // Notification operations
    showNotification: function (title, body) {
        return electron_1.ipcRenderer.invoke('notification:show', title, body);
    },
    // System information
    getSystemInfo: function () { return electron_1.ipcRenderer.invoke('system:info'); },
    // Application updates
    checkForUpdates: function () { return electron_1.ipcRenderer.invoke('system:checkUpdates'); },
    // Theme operations
    setTheme: function (theme) { return electron_1.ipcRenderer.invoke('theme:set', theme); },
    getTheme: function () { return electron_1.ipcRenderer.invoke('theme:get'); },
    // Synchronization operations
    getSyncStatus: function () { return electron_1.ipcRenderer.invoke('sync:status'); },
    startSync: function () { return electron_1.ipcRenderer.invoke('sync:start'); },
    pauseSync: function () { return electron_1.ipcRenderer.invoke('sync:pause'); },
    getNetworkStatus: function () { return electron_1.ipcRenderer.invoke('network:status'); },
    resolveConflict: function (resolution) { return electron_1.ipcRenderer.invoke('sync:resolve-conflict', resolution); },
    getSyncErrors: function () { return electron_1.ipcRenderer.invoke('sync:errors'); },
    retrySyncOperation: function (operationId) { return electron_1.ipcRenderer.invoke('sync:retry', operationId); },
    clearSyncErrors: function () { return electron_1.ipcRenderer.invoke('sync:clear-errors'); }
});
