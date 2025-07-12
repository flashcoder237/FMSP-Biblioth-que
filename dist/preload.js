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
    getBorrowedBooks: () => electron_1.ipcRenderer.invoke('db:getBorrowedBooks'),
    borrowBook: (bookId, borrowerName) => electron_1.ipcRenderer.invoke('db:borrowBook', bookId, borrowerName),
    returnBook: (bookId) => electron_1.ipcRenderer.invoke('db:returnBook', bookId),
    getStats: () => electron_1.ipcRenderer.invoke('db:getStats'),
    // Print operations
    printInventory: (data) => electron_1.ipcRenderer.invoke('print:inventory', data),
    printAvailableBooks: (data) => electron_1.ipcRenderer.invoke('print:available-books', data),
    printBorrowedBooks: (data) => electron_1.ipcRenderer.invoke('print:borrowed-books', data),
    exportCSV: (data) => electron_1.ipcRenderer.invoke('export:csv', data),
});
