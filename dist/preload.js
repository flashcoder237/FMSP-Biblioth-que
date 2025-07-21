"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentFromBook = exports.createBookFromDocument = void 0;
const electron_1 = require("electron");
// Debug: Check if contextBridge is available
console.log('Preload script loaded');
console.log('contextBridge available:', typeof electron_1.contextBridge !== 'undefined');
console.log('ipcRenderer available:', typeof electron_1.ipcRenderer !== 'undefined');
if (typeof electron_1.contextBridge === 'undefined') {
    console.error('contextBridge is undefined - this indicates the preload script is not running in the correct Electron context');
    throw new Error('contextBridge is not available. Make sure this script is loaded as a preload script in an Electron BrowserWindow.');
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
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:maximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window-controls:close'),
    // Authentication
    getAuthStatus: () => electron_1.ipcRenderer.invoke('auth:status'),
    login: (credentials) => electron_1.ipcRenderer.invoke('auth:login', credentials),
    logout: () => electron_1.ipcRenderer.invoke('auth:logout'),
    // Database operations - Books (avec compatibilité Document)
    getBooks: () => electron_1.ipcRenderer.invoke('db:getBooks').then((documents) => documents.map(exports.createBookFromDocument)),
    addBook: (book) => electron_1.ipcRenderer.invoke('db:addBook', (0, exports.createDocumentFromBook)(book)),
    updateBook: (book) => electron_1.ipcRenderer.invoke('db:updateBook', { ...(0, exports.createDocumentFromBook)(book), id: book.id }),
    deleteBook: (id) => electron_1.ipcRenderer.invoke('db:deleteBook', id),
    searchBooks: (query) => electron_1.ipcRenderer.invoke('db:searchBooks', query).then((documents) => documents.map(exports.createBookFromDocument)),
    // Database operations - Documents (nouveau)
    getDocuments: () => electron_1.ipcRenderer.invoke('db:getDocuments'),
    addDocument: (document) => electron_1.ipcRenderer.invoke('db:addDocument', document),
    updateDocument: (document) => electron_1.ipcRenderer.invoke('db:updateDocument', document),
    deleteDocument: (id) => electron_1.ipcRenderer.invoke('db:deleteDocument', id),
    searchDocuments: (query) => electron_1.ipcRenderer.invoke('db:searchDocuments', query),
    // Database operations - Authors
    getAuthors: () => electron_1.ipcRenderer.invoke('db:getAuthors'),
    addAuthor: (author) => electron_1.ipcRenderer.invoke('db:addAuthor', {
        ...author,
        localId: author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: author.syncStatus || 'pending',
        lastModified: author.lastModified || new Date().toISOString(),
        version: author.version || 1,
        createdAt: author.createdAt || new Date().toISOString()
    }),
    // Database operations - Categories
    getCategories: () => electron_1.ipcRenderer.invoke('db:getCategories'),
    addCategory: (category) => electron_1.ipcRenderer.invoke('db:addCategory', {
        ...category,
        localId: category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: category.syncStatus || 'pending',
        lastModified: category.lastModified || new Date().toISOString(),
        version: category.version || 1,
        createdAt: category.createdAt || new Date().toISOString()
    }),
    // Database operations - Borrowers
    getBorrowers: () => electron_1.ipcRenderer.invoke('db:getBorrowers'),
    addBorrower: (borrower) => electron_1.ipcRenderer.invoke('db:addBorrower', {
        ...borrower,
        localId: borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: borrower.syncStatus || 'pending',
        lastModified: borrower.lastModified || new Date().toISOString(),
        version: borrower.version || 1,
        createdAt: borrower.createdAt || new Date().toISOString()
    }),
    updateBorrower: (borrower) => electron_1.ipcRenderer.invoke('db:updateBorrower', {
        ...borrower,
        lastModified: new Date().toISOString(),
        version: (borrower.version || 1) + 1,
        syncStatus: 'pending'
    }),
    deleteBorrower: (id) => electron_1.ipcRenderer.invoke('db:deleteBorrower', id),
    searchBorrowers: (query) => electron_1.ipcRenderer.invoke('db:searchBorrowers', query),
    // Borrow operations
    getBorrowedBooks: () => electron_1.ipcRenderer.invoke('db:getBorrowedBooks'),
    borrowBook: (bookId, borrowerId, expectedReturnDate) => electron_1.ipcRenderer.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate),
    returnBook: (borrowHistoryId, notes) => electron_1.ipcRenderer.invoke('db:returnBook', borrowHistoryId, notes),
    getBorrowHistory: (filter) => electron_1.ipcRenderer.invoke('db:getBorrowHistory', filter),
    // Statistics
    getStats: () => electron_1.ipcRenderer.invoke('db:getStats'),
    getAdvancedStats: () => electron_1.ipcRenderer.invoke('stats:advanced'),
    // Settings management
    getSettings: () => electron_1.ipcRenderer.invoke('settings:get'),
    saveSettings: (settings) => electron_1.ipcRenderer.invoke('settings:save', settings),
    // Backup and restore operations
    createBackup: () => electron_1.ipcRenderer.invoke('backup:create'),
    restoreBackup: () => electron_1.ipcRenderer.invoke('backup:restore'),
    clearAllData: () => electron_1.ipcRenderer.invoke('db:clearAll'),
    // Export/Import operations
    exportDatabase: (filePath) => electron_1.ipcRenderer.invoke('db:export', filePath),
    importDatabase: (filePath) => electron_1.ipcRenderer.invoke('db:import', filePath),
    // Print operations
    printInventory: (data) => electron_1.ipcRenderer.invoke('print:inventory', data),
    printAvailableBooks: (data) => electron_1.ipcRenderer.invoke('print:available-books', data),
    printBorrowedBooks: (data) => electron_1.ipcRenderer.invoke('print:borrowed-books', data),
    printBorrowHistory: (data) => electron_1.ipcRenderer.invoke('print:borrow-history', data),
    // Export operations
    exportCSV: (data) => electron_1.ipcRenderer.invoke('export:csv', data),
    // File operations
    selectFile: (options) => electron_1.ipcRenderer.invoke('file:select', options),
    selectDirectory: () => electron_1.ipcRenderer.invoke('file:selectDirectory'),
    // Notification operations
    showNotification: (title, body) => electron_1.ipcRenderer.invoke('notification:show', title, body),
    // System information
    getSystemInfo: () => electron_1.ipcRenderer.invoke('system:info'),
    // Application updates
    checkForUpdates: () => electron_1.ipcRenderer.invoke('system:checkUpdates'),
    // Theme operations
    setTheme: (theme) => electron_1.ipcRenderer.invoke('theme:set', theme),
    getTheme: () => electron_1.ipcRenderer.invoke('theme:get'),
    // Synchronization operations
    getSyncStatus: () => electron_1.ipcRenderer.invoke('sync:status'),
    startSync: () => electron_1.ipcRenderer.invoke('sync:start'),
    pauseSync: () => electron_1.ipcRenderer.invoke('sync:pause'),
    getNetworkStatus: () => electron_1.ipcRenderer.invoke('network:status'),
    resolveConflict: (resolution) => electron_1.ipcRenderer.invoke('sync:resolve-conflict', resolution),
    getSyncErrors: () => electron_1.ipcRenderer.invoke('sync:errors'),
    retrySyncOperation: (operationId) => electron_1.ipcRenderer.invoke('sync:retry', operationId),
    clearSyncErrors: () => electron_1.ipcRenderer.invoke('sync:clear-errors')
});
//# sourceMappingURL=preload.js.map