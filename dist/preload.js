"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:maximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window-controls:close'),
    // Authentication
    getAuthStatus: () => electron_1.ipcRenderer.invoke('auth:status'),
    login: (credentials) => electron_1.ipcRenderer.invoke('auth:login', credentials),
    logout: () => electron_1.ipcRenderer.invoke('auth:logout'),
    // Database operations - Books
    getBooks: () => electron_1.ipcRenderer.invoke('db:getBooks'),
    addBook: (book) => electron_1.ipcRenderer.invoke('db:addBook', book),
    updateBook: (book) => electron_1.ipcRenderer.invoke('db:updateBook', book),
    deleteBook: (id) => electron_1.ipcRenderer.invoke('db:deleteBook', id),
    searchBooks: (query) => electron_1.ipcRenderer.invoke('db:searchBooks', query),
    // Database operations - Authors
    getAuthors: () => electron_1.ipcRenderer.invoke('db:getAuthors'),
    addAuthor: (author) => electron_1.ipcRenderer.invoke('db:addAuthor', author),
    // Database operations - Categories
    getCategories: () => electron_1.ipcRenderer.invoke('db:getCategories'),
    addCategory: (category) => electron_1.ipcRenderer.invoke('db:addCategory', category),
    // Database operations - Borrowers
    getBorrowers: () => electron_1.ipcRenderer.invoke('db:getBorrowers'),
    addBorrower: (borrower) => electron_1.ipcRenderer.invoke('db:addBorrower', borrower),
    updateBorrower: (borrower) => electron_1.ipcRenderer.invoke('db:updateBorrower', borrower),
    deleteBorrower: (id) => electron_1.ipcRenderer.invoke('db:deleteBorrower', id),
    searchBorrowers: (query) => electron_1.ipcRenderer.invoke('db:searchBorrowers', query),
    // Borrow operations
    getBorrowedBooks: () => electron_1.ipcRenderer.invoke('db:getBorrowedBooks'),
    borrowBook: (bookId, borrowerId, expectedReturnDate) => electron_1.ipcRenderer.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate),
    returnBook: (borrowHistoryId, notes) => electron_1.ipcRenderer.invoke('db:returnBook', borrowHistoryId, notes),
    // History
    getBorrowHistory: (filter) => electron_1.ipcRenderer.invoke('db:getBorrowHistory', filter),
    // Statistics
    getStats: () => electron_1.ipcRenderer.invoke('db:getStats'),
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
    // Advanced statistics
    getAdvancedStats: () => electron_1.ipcRenderer.invoke('stats:advanced'),
    // Synchronization operations
    getSyncStatus: () => electron_1.ipcRenderer.invoke('sync:status'),
    startSync: () => electron_1.ipcRenderer.invoke('sync:start'),
    pauseSync: () => electron_1.ipcRenderer.invoke('sync:pause'),
    getNetworkStatus: () => electron_1.ipcRenderer.invoke('network:status'),
    resolveConflict: (resolution) => electron_1.ipcRenderer.invoke('sync:resolve-conflict', resolution),
    getSyncErrors: () => electron_1.ipcRenderer.invoke('sync:errors'),
    retrySyncOperation: (operationId) => electron_1.ipcRenderer.invoke('sync:retry', operationId),
    clearSyncErrors: () => electron_1.ipcRenderer.invoke('sync:clear-errors'),
    // Document operations (remplace Books)
    getDocuments: () => electron_1.ipcRenderer.invoke('db:getDocuments'),
    addDocument: (document) => electron_1.ipcRenderer.invoke('db:addDocument', document),
    updateDocument: (document) => electron_1.ipcRenderer.invoke('db:updateDocument', document),
    deleteDocument: (id) => electron_1.ipcRenderer.invoke('db:deleteDocument', id),
    searchDocuments: (query) => electron_1.ipcRenderer.invoke('db:searchDocuments', query),
});
