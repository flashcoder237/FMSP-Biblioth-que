"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window-controls:maximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window-controls:close'),
    // Database operations
    getBooks: () => electron_1.ipcRenderer.invoke('db:getBooks'),
    addBook: (book) => electron_1.ipcRenderer.invoke('db:addBook', book),
    updateBook: (book) => electron_1.ipcRenderer.invoke('db:updateBook', book),
    deleteBook: (id) => electron_1.ipcRenderer.invoke('db:deleteBook', id),
    getAuthors: () => electron_1.ipcRenderer.invoke('db:getAuthors'),
    addAuthor: (author) => electron_1.ipcRenderer.invoke('db:addAuthor', author),
    getCategories: () => electron_1.ipcRenderer.invoke('db:getCategories'),
    addCategory: (category) => electron_1.ipcRenderer.invoke('db:addCategory', category),
    searchBooks: (query) => electron_1.ipcRenderer.invoke('db:searchBooks', query),
    // Borrowers
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
    getStats: () => electron_1.ipcRenderer.invoke('db:getStats'),
    // Print operations
    printInventory: (data) => electron_1.ipcRenderer.invoke('print:inventory', data),
    printAvailableBooks: (data) => electron_1.ipcRenderer.invoke('print:available-books', data),
    printBorrowedBooks: (data) => electron_1.ipcRenderer.invoke('print:borrowed-books', data),
    printBorrowHistory: (data) => electron_1.ipcRenderer.invoke('print:borrow-history', data),
    exportCSV: (data) => electron_1.ipcRenderer.invoke('export:csv', data),
});
