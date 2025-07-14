"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:maximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window-controls:close'),
    // Authentication
    getAuthStatus: () => electron_1.ipcRenderer.invoke('auth:getStatus'),
    login: (credentials) => electron_1.ipcRenderer.invoke('auth:login', credentials),
    logout: () => electron_1.ipcRenderer.invoke('auth:logout'),
    register: (userData) => electron_1.ipcRenderer.invoke('auth:register', userData),
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
    clearAllData: () => electron_1.ipcRenderer.invoke('backup:clearAllData'),
    // Print operations
    printInventory: (data) => electron_1.ipcRenderer.invoke('print:inventory', data),
    printAvailableBooks: (data) => electron_1.ipcRenderer.invoke('print:available-books', data),
    printBorrowedBooks: (data) => electron_1.ipcRenderer.invoke('print:borrowed-books', data),
    printBorrowHistory: (data) => electron_1.ipcRenderer.invoke('print:borrow-history', data),
    // Export operations
    exportCSV: (data) => electron_1.ipcRenderer.invoke('export:csv', data),
    // File operations for institution logo
    selectFile: (options) => electron_1.ipcRenderer.invoke('file:select', options),
    saveFile: (data, filename) => electron_1.ipcRenderer.invoke('file:save', data, filename),
    // System information
    getSystemInfo: () => electron_1.ipcRenderer.invoke('system:info'),
    // Application updates
    checkForUpdates: () => electron_1.ipcRenderer.invoke('app:checkUpdates'),
    downloadUpdate: () => electron_1.ipcRenderer.invoke('app:downloadUpdate'),
    installUpdate: () => electron_1.ipcRenderer.invoke('app:installUpdate'),
});
