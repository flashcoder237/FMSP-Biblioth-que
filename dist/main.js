/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
// src/main.ts - Configuration corrigée pour SQLite3
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const DatabaseService_1 = __webpack_require__(/*! ./services/DatabaseService */ "./src/services/DatabaseService.ts");
const BackupService_1 = __webpack_require__(/*! ./services/BackupService */ "./src/services/BackupService.ts");
const AuthService_1 = __webpack_require__(/*! ./services/AuthService */ "./src/services/AuthService.ts");
const SettingsService_1 = __webpack_require__(/*! ./services/SettingsService */ "./src/services/SettingsService.ts");
const SyncService_1 = __webpack_require__(/*! ./services/SyncService */ "./src/services/SyncService.ts");
let mainWindow;
let dbService;
let backupService;
let authService;
let settingsService;
let syncService;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // IMPORTANT: Désactiver sandbox pour SQLite3
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            // Sécurité adaptée pour les modules natifs
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            webSecurity: true
        },
        titleBarStyle: 'hiddenInset',
        frame: false,
        show: false,
        icon: path.join(__dirname, '../assets/icon.png'),
    });
    // Vérifier que le fichier preload existe
    const preloadPath = path.join(__dirname, 'preload.js');
    console.log('Preload path:', preloadPath);
    console.log('Preload exists:', fs.existsSync(preloadPath));
    // Always use the built files
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    // Gestion de la fermeture de l'application
    mainWindow.on('close', async (event) => {
        if (backupService && settingsService) {
            const settings = await settingsService.getSettings();
            if (settings?.backup.autoBackup) {
                try {
                    await backupService.createBackup();
                }
                catch (error) {
                    console.error('Erreur lors de la sauvegarde automatique:', error);
                }
            }
        }
    });
}
electron_1.app.whenReady().then(async () => {
    // Initialiser les services
    try {
        dbService = new DatabaseService_1.DatabaseService();
        await dbService.initialize();
        backupService = new BackupService_1.BackupService(dbService);
        authService = new AuthService_1.AuthService();
        settingsService = new SettingsService_1.SettingsService();
        syncService = new SyncService_1.SyncService(dbService);
        // Initialiser le service de synchronisation
        await syncService.initialize();
        console.log('Services initialisés avec succès');
        createWindow();
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation des services:', error);
        // Créer la fenêtre même en cas d'erreur pour afficher l'erreur
        createWindow();
    }
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Window Controls
electron_1.ipcMain.handle('window-controls:minimize', () => {
    mainWindow.minimize();
});
electron_1.ipcMain.handle('window-controls:maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.handle('window-controls:close', () => {
    mainWindow.close();
});
// Database Operations - Books
electron_1.ipcMain.handle('db:getBooks', async () => {
    try {
        return await dbService.getBooks();
    }
    catch (error) {
        console.error('Erreur getBooks:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:addBook', async (_, book) => {
    try {
        return await dbService.addDocument(book);
    }
    catch (error) {
        console.error('Erreur addBook:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:updateBook', async (_, book) => {
    try {
        return await dbService.updateDocument(book);
    }
    catch (error) {
        console.error('Erreur updateBook:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:deleteBook', async (_, id) => {
    try {
        return await dbService.deleteDocument(id);
    }
    catch (error) {
        console.error('Erreur deleteBook:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:searchBooks', async (_, query) => {
    try {
        return await dbService.searchBooks(query);
    }
    catch (error) {
        console.error('Erreur searchBooks:', error);
        return [];
    }
});
// Database Operations - Authors
electron_1.ipcMain.handle('db:getAuthors', async () => {
    try {
        return await dbService.getAuthors();
    }
    catch (error) {
        console.error('Erreur getAuthors:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:addAuthor', async (_, author) => {
    try {
        return await dbService.addAuthor(author);
    }
    catch (error) {
        console.error('Erreur addAuthor:', error);
        throw error;
    }
});
// Database Operations - Categories
electron_1.ipcMain.handle('db:getCategories', async () => {
    try {
        return await dbService.getCategories();
    }
    catch (error) {
        console.error('Erreur getCategories:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:addCategory', async (_, category) => {
    try {
        return await dbService.addCategory(category);
    }
    catch (error) {
        console.error('Erreur addCategory:', error);
        throw error;
    }
});
// Database Operations - Borrowers
electron_1.ipcMain.handle('db:getBorrowers', async () => {
    try {
        return await dbService.getBorrowers();
    }
    catch (error) {
        console.error('Erreur getBorrowers:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:addBorrower', async (_, borrower) => {
    try {
        return await dbService.addBorrower(borrower);
    }
    catch (error) {
        console.error('Erreur addBorrower:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:updateBorrower', async (_, borrower) => {
    try {
        return await dbService.updateBorrower(borrower);
    }
    catch (error) {
        console.error('Erreur updateBorrower:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:deleteBorrower', async (_, id) => {
    try {
        return await dbService.deleteBorrower(id);
    }
    catch (error) {
        console.error('Erreur deleteBorrower:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:searchBorrowers', async (_, query) => {
    try {
        return await dbService.searchBorrowers(query);
    }
    catch (error) {
        console.error('Erreur searchBorrowers:', error);
        return [];
    }
});
// Database Operations - Borrow Management
electron_1.ipcMain.handle('db:getBorrowedBooks', async () => {
    try {
        return await dbService.getBorrowedBooks();
    }
    catch (error) {
        console.error('Erreur getBorrowedBooks:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:borrowBook', async (_, bookId, borrowerId, expectedReturnDate) => {
    try {
        return await dbService.borrowBook(bookId, borrowerId, expectedReturnDate);
    }
    catch (error) {
        console.error('Erreur borrowBook:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:returnBook', async (_, borrowHistoryId, notes) => {
    try {
        return await dbService.returnBook(borrowHistoryId, notes);
    }
    catch (error) {
        console.error('Erreur returnBook:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:getBorrowHistory', async (_, filter) => {
    try {
        return await dbService.getBorrowHistory(filter);
    }
    catch (error) {
        console.error('Erreur getBorrowHistory:', error);
        return [];
    }
});
electron_1.ipcMain.handle('db:getStats', async () => {
    try {
        return await dbService.getStats();
    }
    catch (error) {
        console.error('Erreur getStats:', error);
        return {
            totalBooks: 0,
            borrowedBooks: 0,
            availableBooks: 0,
            totalAuthors: 0,
            totalCategories: 0,
            totalBorrowers: 0,
            totalStudents: 0,
            totalStaff: 0,
            overdueBooks: 0
        };
    }
});
// Nouvelles opérations de base de données
electron_1.ipcMain.handle('db:clearAll', async () => {
    try {
        return await dbService.clearDatabase();
    }
    catch (error) {
        console.error('Erreur clearAll:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('db:export', async () => {
    const result = await electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Exporter la base de données',
        defaultPath: `bibliotheque_backup_${new Date().toISOString().split('T')[0]}.db`,
        filters: [
            { name: 'Base de données', extensions: ['db'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ]
    });
    if (!result.filePath)
        return null;
    try {
        await backupService.exportDatabase(result.filePath);
        return result.filePath;
    }
    catch (error) {
        console.error('Erreur lors de l\'export:', error);
        return null;
    }
});
electron_1.ipcMain.handle('db:import', async (_, filePath) => {
    try {
        await backupService.importDatabase(filePath);
        return true;
    }
    catch (error) {
        console.error('Erreur lors de l\'import:', error);
        return false;
    }
});
// Settings Operations
electron_1.ipcMain.handle('settings:get', async () => {
    try {
        return await settingsService.getSettings();
    }
    catch (error) {
        console.error('Erreur settings:get:', error);
        return null;
    }
});
electron_1.ipcMain.handle('settings:save', async (_, settings) => {
    try {
        return settingsService.saveUserSettings(settings);
    }
    catch (error) {
        console.error('Erreur settings:save:', error);
        return false;
    }
});
// Backup Operations
electron_1.ipcMain.handle('backup:create', async () => {
    try {
        return await backupService.createBackup();
    }
    catch (error) {
        console.error('Erreur backup:create:', error);
        throw error;
    }
});
electron_1.ipcMain.handle('backup:restore', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        title: 'Sélectionner une sauvegarde',
        filters: [
            { name: 'Sauvegardes', extensions: ['bak', 'backup'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ],
        properties: ['openFile']
    });
    if (result.canceled || !result.filePaths[0])
        return false;
    try {
        await backupService.restoreBackup(result.filePaths[0]);
        return true;
    }
    catch (error) {
        console.error('Erreur lors de la restauration:', error);
        return false;
    }
});
// Authentication Operations
electron_1.ipcMain.handle('auth:status', async () => {
    try {
        return authService.isAuthenticated();
    }
    catch (error) {
        console.error('Erreur auth:status:', error);
        return false;
    }
});
electron_1.ipcMain.handle('auth:login', async (_, credentials) => {
    try {
        return await authService.login(credentials);
    }
    catch (error) {
        console.error('Erreur auth:login:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
});
electron_1.ipcMain.handle('auth:logout', async () => {
    try {
        return authService.logout();
    }
    catch (error) {
        console.error('Erreur auth:logout:', error);
        return false;
    }
});
// File Operations
electron_1.ipcMain.handle('file:select', async (_, options = {}) => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
            { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ],
        ...options
    });
    return result.canceled ? null : result.filePaths[0];
});
electron_1.ipcMain.handle('file:selectDirectory', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
});
// Notification Operations
electron_1.ipcMain.handle('notification:show', async (_, title, body) => {
    if (electron_1.Notification.isSupported()) {
        new electron_1.Notification({
            title,
            body,
            icon: path.join(__dirname, '../assets/icon.png')
        }).show();
    }
});
// System Operations
electron_1.ipcMain.handle('system:info', async () => {
    return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        appVersion: electron_1.app.getVersion(),
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        nodeVersion: process.versions.node
    };
});
electron_1.ipcMain.handle('system:checkUpdates', async () => {
    // Placeholder pour la vérification des mises à jour
    return {
        hasUpdate: false,
        currentVersion: electron_1.app.getVersion(),
        latestVersion: electron_1.app.getVersion()
    };
});
// Theme Operations
electron_1.ipcMain.handle('theme:set', async (_, theme) => {
    try {
        await settingsService.setTheme(theme);
    }
    catch (error) {
        console.error('Erreur theme:set:', error);
    }
});
electron_1.ipcMain.handle('theme:get', async () => {
    try {
        return await settingsService.getTheme();
    }
    catch (error) {
        console.error('Erreur theme:get:', error);
        return 'light';
    }
});
// Statistics Operations
electron_1.ipcMain.handle('stats:advanced', async () => {
    const basicStats = await dbService.getStats();
    const borrowHistory = await dbService.getBorrowHistory();
    // Calculer des statistiques avancées
    const now = new Date();
    const monthlyBorrows = borrowHistory.filter(h => {
        const borrowDate = new Date(h.borrowDate);
        return borrowDate.getMonth() === now.getMonth() && borrowDate.getFullYear() === now.getFullYear();
    }).length;
    const averageBorrowDuration = borrowHistory
        .filter(h => h.actualReturnDate)
        .reduce((acc, h) => {
        const borrowed = new Date(h.borrowDate);
        const returned = new Date(h.actualReturnDate);
        const duration = (returned.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24);
        return acc + duration;
    }, 0) / borrowHistory.filter(h => h.actualReturnDate).length || 0;
    const topCategories = await getTopCategories();
    const topBorrowers = await getTopBorrowers();
    return {
        ...basicStats,
        monthlyBorrows,
        averageBorrowDuration: Math.round(averageBorrowDuration),
        topCategories,
        topBorrowers
    };
});
async function getTopCategories() {
    const books = await dbService.getBooks();
    const categoryCounts = books.reduce((acc, book) => {
        acc[book.category] = (acc[book.category] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));
}
async function getTopBorrowers() {
    const history = await dbService.getBorrowHistory();
    const borrowerCounts = history.reduce((acc, h) => {
        const key = `${h.borrower?.firstName} ${h.borrower?.lastName}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(borrowerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([borrower, count]) => ({ borrower, count }));
}
// Synchronization Operations
electron_1.ipcMain.handle('sync:getStatus', async () => {
    try {
        return syncService ? await syncService.getStatus() : {
            isOnline: false,
            lastSync: null,
            pendingOperations: 0,
            syncInProgress: false,
            errors: []
        };
    }
    catch (error) {
        console.error('Erreur sync:getStatus:', error);
        return {
            isOnline: false,
            lastSync: null,
            pendingOperations: 0,
            syncInProgress: false,
            errors: []
        };
    }
});
electron_1.ipcMain.handle('sync:trigger', async () => {
    try {
        if (syncService) {
            await syncService.startSync();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Erreur sync:trigger:', error);
        return false;
    }
});
electron_1.ipcMain.handle('sync:clearErrors', async () => {
    try {
        if (syncService) {
            await syncService.clearErrors();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Erreur sync:clearErrors:', error);
        return false;
    }
});
electron_1.ipcMain.handle('sync:retry', async (_, operationId) => {
    try {
        if (syncService) {
            await syncService.retryOperation(operationId);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Erreur sync:retry:', error);
        return false;
    }
});
async function createPrintWindow(data, type) {
    return new Promise((resolve) => {
        const printWindow = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                // IMPORTANT: Garder sandbox: false pour SQLite3
                sandbox: false
            }
        });
        const htmlContent = generatePrintHTML(data, type);
        printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: false,
                printBackground: true,
            }, (success, failureReason) => {
                printWindow.close();
                if (!success && failureReason) {
                    console.error('Print failed:', failureReason);
                }
                resolve(success);
            });
        });
    });
}
function generatePrintHTML(data, type) {
    const now = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    let title = '';
    let content = '';
    switch (type) {
        case 'inventory':
            title = 'Inventaire Complet de la Bibliothèque';
            content = generateInventoryContent(data);
            break;
        case 'available':
            title = 'Liste des Livres Disponibles';
            content = generateAvailableBooksContent(data);
            break;
        case 'borrowed':
            title = 'Liste des Livres Empruntés';
            content = generateBorrowedBooksContent(data);
            break;
        case 'history':
            title = 'Historique des Emprunts';
            content = generateHistoryContent(data);
            break;
    }
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page { 
          margin: 20mm; 
          size: A4; 
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0; 
          padding: 0; 
          color: #2E2E2E; 
          line-height: 1.4;
          font-size: 12px;
        }
        .header {
          border-bottom: 3px solid #3E5C49;
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .header h1 {
          color: #3E5C49; 
          margin: 0 0 10px 0;
          font-size: 24px; 
          font-weight: 700;
        }
        .header .subtitle { 
          color: #6E6E6E; 
          font-size: 14px; 
          margin: 5px 0; 
        }
        .header .date { 
          color: #6E6E6E; 
          font-size: 11px; 
          margin-top: 10px; 
        }
        .stats-summary {
          background: #F3EED9; 
          border: 1px solid #E5DCC2;
          border-radius: 8px; 
          padding: 15px; 
          margin-bottom: 25px;
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
          gap: 15px;
        }
        .stat-item { 
          text-align: center; 
        }
        .stat-value {
          font-size: 20px; 
          font-weight: 700;
          color: #3E5C49; 
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 10px; 
          color: #6E6E6E;
          text-transform: uppercase; 
          letter-spacing: 0.5px;
        }
        .content-table {
          width: 100%; 
          border-collapse: collapse;
          margin-bottom: 20px; 
          font-size: 10px;
        }
        .content-table th, .content-table td {
          padding: 8px 6px; 
          text-align: left; 
          border-bottom: 1px solid #E5DCC2;
          word-wrap: break-word;
        }
        .content-table th {
          background: #F3EED9; 
          font-weight: 600;
          color: #2E2E2E; 
          border-bottom: 2px solid #E5DCC2;
          font-size: 9px;
        }
        .content-table tr:nth-child(even) { 
          background: #FAF9F6; 
        }
        .category-tag {
          background: #3E5C49; 
          color: white;
          padding: 1px 6px; 
          border-radius: 10px;
          font-size: 8px; 
          font-weight: 500;
        }
        .status-available { 
          color: #3E5C49; 
          font-weight: 600; 
        }
        .status-borrowed { 
          color: #C2571B; 
          font-weight: 600; 
        }
        .status-returned { 
          color: #3E5C49; 
          font-weight: 600; 
        }
        .status-overdue { 
          color: #DC2626; 
          font-weight: 600; 
        }
        .borrower-type {
          font-size: 8px;
          text-transform: uppercase;
          font-weight: 600;
          color: #6E6E6E;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="subtitle">Système de Gestion de Bibliothèque</div>
        <div class="date">Généré le ${now}</div>
      </div>
      ${content}
    </body>
    </html>
    `;
}
function generateInventoryContent(data) {
    const { books, stats } = data;
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${stats.totalBooks}</div>
        <div class="stat-label">Total Livres</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.availableBooks}</div>
        <div class="stat-label">Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.borrowedBooks}</div>
        <div class="stat-label">Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalAuthors}</div>
        <div class="stat-label">Auteurs</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 25%;">Titre</th>
          <th style="width: 20%;">Auteur</th>
          <th style="width: 15%;">Catégorie</th>
          <th style="width: 10%;">ISBN</th>
          <th style="width: 8%;">Année</th>
          <th style="width: 10%;">Statut</th>
          <th style="width: 12%;">Emprunteur/Date</th>
        </tr>
      </thead>
      <tbody>
        ${books.map((book) => `
          <tr>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td><span class="category-tag">${book.category}</span></td>
            <td>${book.isbn || '-'}</td>
            <td>${book.publishedDate || '-'}</td>
            <td>
              <span class="${book.isBorrowed ? 'status-borrowed' : 'status-available'}">
                ${book.isBorrowed ? 'Emprunté' : 'Disponible'}
              </span>
            </td>
            <td>
              ${book.borrowerId ? `${book.borrower?.firstName || ''} ${book.borrower?.lastName || ''}<br/>` : '-'}
              ${book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function generateAvailableBooksContent(data) {
    const { books, stats } = data;
    const availableBooks = books.filter((book) => !book.isBorrowed);
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${availableBooks.length}</div>
        <div class="stat-label">Livres Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalBooks}</div>
        <div class="stat-label">Total Livres</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${((availableBooks.length / (stats.totalBooks || 1)) * 100).toFixed(1)}%</div>
        <div class="stat-label">Taux Disponibilité</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 30%;">Titre</th>
          <th style="width: 25%;">Auteur</th>
          <th style="width: 15%;">Catégorie</th>
          <th style="width: 15%;">ISBN</th>
          <th style="width: 15%;">Année Publication</th>
        </tr>
      </thead>
      <tbody>
        ${availableBooks.map((book) => `
          <tr>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td><span class="category-tag">${book.category}</span></td>
            <td>${book.isbn || '-'}</td>
            <td>${book.publishedDate || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function generateBorrowedBooksContent(data) {
    const { history } = data;
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${history.length}</div>
        <div class="stat-label">Livres Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h) => h.status === 'overdue').length}</div>
        <div class="stat-label">En Retard</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h) => h.borrower?.type === 'student').length}</div>
        <div class="stat-label">Étudiants</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h) => h.borrower?.type === 'staff').length}</div>
        <div class="stat-label">Personnel</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 20%;">Livre</th>
          <th style="width: 15%;">Auteur</th>
          <th style="width: 15%;">Emprunteur</th>
          <th style="width: 10%;">Type</th>
          <th style="width: 12%;">Matricule/Classe</th>
          <th style="width: 10%;">Date Emprunt</th>
          <th style="width: 10%;">Retour Prévu</th>
          <th style="width: 8%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${history.map((item) => {
        const borrowDate = new Date(item.borrowDate);
        const expectedDate = new Date(item.expectedReturnDate);
        const today = new Date();
        const isOverdue = today > expectedDate && item.status === 'active';
        return `
            <tr>
              <td><strong>${item.book?.title}</strong></td>
              <td>${item.book?.author}</td>
              <td><strong>${item.borrower?.firstName} ${item.borrower?.lastName}</strong></td>
              <td>
                <span class="borrower-type">
                  ${item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel'}
                </span>
              </td>
              <td>
                ${item.borrower?.matricule}<br/>
                <small>${item.borrower?.type === 'student' ? item.borrower?.classe || '' : item.borrower?.position || ''}</small>
              </td>
              <td>${borrowDate.toLocaleDateString('fr-FR')}</td>
              <td>${expectedDate.toLocaleDateString('fr-FR')}</td>
              <td>
                <span class="${isOverdue ? 'status-overdue' : item.status === 'returned' ? 'status-returned' : 'status-borrowed'}">
                  ${isOverdue ? 'En retard' : item.status === 'returned' ? 'Rendu' : 'En cours'}
                </span>
              </td>
            </tr>
          `;
    }).join('')}
      </tbody>
    </table>
  `;
}
function generateHistoryContent(data) {
    const { history, filters, stats } = data;
    const filterInfo = [];
    if (filters.startDate)
        filterInfo.push(`Du ${new Date(filters.startDate).toLocaleDateString('fr-FR')}`);
    if (filters.endDate)
        filterInfo.push(`Au ${new Date(filters.endDate).toLocaleDateString('fr-FR')}`);
    if (filters.borrowerType && filters.borrowerType !== 'all') {
        filterInfo.push(`Type: ${filters.borrowerType === 'student' ? 'Étudiants' : 'Personnel'}`);
    }
    if (filters.status && filters.status !== 'all') {
        const statusLabels = {
            active: 'En cours',
            returned: 'Rendus',
            overdue: 'En retard'
        };
        filterInfo.push(`Statut: ${statusLabels[filters.status]}`);
    }
    return `
    ${filterInfo.length > 0 ? `
      <div style="background: #F3EED9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #E5DCC2;">
        <strong>Filtres appliqués:</strong> ${filterInfo.join(' • ')}
      </div>
    ` : ''}
    
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Total Emprunts</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.active}</div>
        <div class="stat-label">En Cours</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.returned}</div>
        <div class="stat-label">Rendus</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.overdue}</div>
        <div class="stat-label">En Retard</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.students}</div>
        <div class="stat-label">Étudiants</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.staff}</div>
        <div class="stat-label">Personnel</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 18%;">Livre</th>
          <th style="width: 12%;">Auteur</th>
          <th style="width: 15%;">Emprunteur</th>
          <th style="width: 8%;">Type</th>
          <th style="width: 10%;">Matricule</th>
          <th style="width: 10%;">Date Emprunt</th>
          <th style="width: 10%;">Retour Prévu</th>
          <th style="width: 10%;">Retour Effectué</th>
          <th style="width: 7%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${history.map((item) => {
        const borrowDate = new Date(item.borrowDate);
        const expectedDate = new Date(item.expectedReturnDate);
        const actualDate = item.actualReturnDate ? new Date(item.actualReturnDate) : null;
        return `
            <tr>
              <td><strong>${item.book?.title}</strong></td>
              <td>${item.book?.author}</td>
              <td><strong>${item.borrower?.firstName} ${item.borrower?.lastName}</strong></td>
              <td>
                <span class="borrower-type">
                  ${item.borrower?.type === 'student' ? 'ÉTU' : 'PERS'}
                </span>
              </td>
              <td>
                ${item.borrower?.matricule}<br/>
                <small>${item.borrower?.type === 'student' ? item.borrower?.classe || '' : item.borrower?.position || ''}</small>
              </td>
              <td>
                ${borrowDate.toLocaleDateString('fr-FR')}<br/>
                <small>${borrowDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small>
              </td>
              <td>${expectedDate.toLocaleDateString('fr-FR')}</td>
              <td>
                ${actualDate ? `
                  ${actualDate.toLocaleDateString('fr-FR')}<br/>
                  <small>${actualDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small>
                ` : '-'}
              </td>
              <td>
                <span class="status-${item.status}">
                  ${item.status === 'active' ? 'En cours' :
            item.status === 'returned' ? 'Rendu' : 'En retard'}
                </span>
              </td>
            </tr>
          `;
    }).join('')}
      </tbody>
    </table>
    
    ${history.some((item) => item.notes) ? `
      <div class="page-break"></div>
      <h2 style="color: #3E5C49; margin-top: 30px;">Notes et Observations</h2>
      <table class="content-table">
        <thead>
          <tr>
            <th style="width: 25%;">Livre</th>
            <th style="width: 20%;">Emprunteur</th>
            <th style="width: 15%;">Date Retour</th>
            <th style="width: 40%;">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${history.filter((item) => item.notes).map((item) => `
            <tr>
              <td><strong>${item.book?.title}</strong></td>
              <td>${item.borrower?.firstName} ${item.borrower?.lastName}</td>
              <td>${item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString('fr-FR') : '-'}</td>
              <td>${item.notes}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  `;
}
async function exportToCSV(data) {
    try {
        const result = await electron_1.dialog.showSaveDialog(mainWindow, {
            title: 'Exporter en CSV',
            defaultPath: `bibliotheque_export_${new Date().toISOString().split('T')[0]}.csv`,
            filters: [
                { name: 'CSV Files', extensions: ['csv'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (!result.filePath)
            return null;
        let csvContent = '';
        // Déterminer le type de données à exporter
        if (data.history) {
            // Export historique
            const csvHeaders = [
                'Date Emprunt',
                'Heure Emprunt',
                'Livre',
                'Auteur',
                'Catégorie',
                'ISBN',
                'Emprunteur',
                'Type Emprunteur',
                'Matricule',
                'Classe/Poste',
                'Date Retour Prévue',
                'Date Retour Effective',
                'Heure Retour',
                'Statut',
                'Durée (jours)',
                'Retard (jours)',
                'Notes'
            ];
            const csvRows = data.history.map((item) => {
                const borrowDate = new Date(item.borrowDate);
                const expectedDate = new Date(item.expectedReturnDate);
                const actualDate = item.actualReturnDate ? new Date(item.actualReturnDate) : null;
                const duration = actualDate ?
                    Math.ceil((actualDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)) :
                    Math.ceil((new Date().getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
                const overdue = item.status === 'overdue' || (item.status === 'active' && new Date() > expectedDate) ?
                    Math.ceil((new Date().getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                return [
                    `"${borrowDate.toLocaleDateString('fr-FR')}"`,
                    `"${borrowDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}"`,
                    `"${(item.book?.title || '').replace(/"/g, '""')}"`,
                    `"${(item.book?.author || '').replace(/"/g, '""')}"`,
                    `"${(item.book?.category || '').replace(/"/g, '""')}"`,
                    `"${(item.book?.isbn || '').replace(/"/g, '""')}"`,
                    `"${(item.borrower?.firstName || '')} ${(item.borrower?.lastName || '')}"`,
                    `"${item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel'}"`,
                    `"${(item.borrower?.matricule || '').replace(/"/g, '""')}"`,
                    `"${item.borrower?.type === 'student' ? (item.borrower?.classe || '') : (item.borrower?.position || '')}"`,
                    `"${expectedDate.toLocaleDateString('fr-FR')}"`,
                    `"${actualDate ? actualDate.toLocaleDateString('fr-FR') : ''}"`,
                    `"${actualDate ? actualDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}"`,
                    `"${item.status === 'active' ? 'En cours' : item.status === 'returned' ? 'Rendu' : 'En retard'}"`,
                    `"${duration}"`,
                    `"${overdue > 0 ? overdue : ''}"`,
                    `"${(item.notes || '').replace(/"/g, '""')}"`
                ];
            });
            csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');
        }
        else {
            // Export livres
            const { books } = data;
            const csvHeaders = [
                'Titre',
                'Auteur',
                'Catégorie',
                'ISBN',
                'Année Publication',
                'Description',
                'Statut',
                'Emprunteur',
                'Date Emprunt',
                'Date Retour Prévue'
            ];
            const csvRows = books.map((book) => [
                `"${(book.title || '').replace(/"/g, '""')}"`,
                `"${(book.author || '').replace(/"/g, '""')}"`,
                `"${(book.category || '').replace(/"/g, '""')}"`,
                `"${(book.isbn || '').replace(/"/g, '""')}"`,
                `"${(book.publishedDate || '').replace(/"/g, '""')}"`,
                `"${(book.description || '').replace(/"/g, '""')}"`,
                `"${book.isBorrowed ? 'Emprunté' : 'Disponible'}"`,
                `"${book.borrower ? `${book.borrower.firstName} ${book.borrower.lastName}` : ''}"`,
                `"${book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : ''}"`,
                `"${book.expectedReturnDate ? new Date(book.expectedReturnDate).toLocaleDateString('fr-FR') : ''}"`
            ]);
            csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');
        }
        fs.writeFileSync(result.filePath, '\ufeff' + csvContent, 'utf8');
        return result.filePath;
    }
    catch (error) {
        console.error('Export CSV failed:', error);
        return null;
    }
}


/***/ }),

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
    getBorrowedBooks: () => electron_1.ipcRenderer?.invoke('db:getBorrowedBooks') || Promise.resolve([]),
    borrowBook: (bookId, borrowerId, expectedReturnDate) => electron_1.ipcRenderer?.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate) || Promise.resolve(0),
    returnBook: (borrowHistoryId, notes) => electron_1.ipcRenderer?.invoke('db:returnBook', borrowHistoryId, notes) || Promise.resolve(false),
    getBorrowHistory: (filter) => electron_1.ipcRenderer?.invoke('db:getBorrowHistory', filter) || Promise.resolve([]),
    // Statistics
    getStats: () => electron_1.ipcRenderer?.invoke('db:getStats') || Promise.resolve({
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
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

/***/ "./src/services/AuthService.ts":
/*!*************************************!*\
  !*** ./src/services/AuthService.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const crypto = __importStar(__webpack_require__(/*! crypto */ "crypto"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
class AuthService {
    constructor() {
        this.users = [];
        this.sessions = [];
        this.currentSession = null;
        const userDataPath = electron_1.app.getPath('userData');
        this.usersFilePath = path.join(userDataPath, 'users.json');
        this.sessionsFilePath = path.join(userDataPath, 'sessions.json');
        this.loadUsers();
        this.loadSessions();
        this.createDefaultAdmin();
    }
    loadUsers() {
        try {
            if (fs.existsSync(this.usersFilePath)) {
                const data = fs.readFileSync(this.usersFilePath, 'utf8');
                this.users = JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            this.users = [];
        }
    }
    saveUsers() {
        try {
            fs.writeFileSync(this.usersFilePath, JSON.stringify(this.users, null, 2));
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        }
    }
    loadSessions() {
        try {
            if (fs.existsSync(this.sessionsFilePath)) {
                const data = fs.readFileSync(this.sessionsFilePath, 'utf8');
                this.sessions = JSON.parse(data);
                // Nettoyer les sessions expirées
                this.cleanExpiredSessions();
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des sessions:', error);
            this.sessions = [];
        }
    }
    saveSessions() {
        try {
            fs.writeFileSync(this.sessionsFilePath, JSON.stringify(this.sessions, null, 2));
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des sessions:', error);
        }
    }
    createDefaultAdmin() {
        // Vérifier si un administrateur existe déjà
        const adminExists = this.users.some(user => user.role === 'admin');
        if (!adminExists) {
            // Créer l'utilisateur admin par défaut
            const defaultAdmin = {
                username: 'admin',
                passwordHash: '',
                salt: '',
                role: 'admin',
                email: 'admin@bibliotheque.local',
                firstName: 'Administrateur',
                lastName: 'Système',
                isActive: true,
                createdAt: new Date().toISOString(),
                loginAttempts: 0
            };
            // Hasher le mot de passe par défaut
            const { hash, salt } = this.hashPassword('admin');
            defaultAdmin.passwordHash = hash;
            defaultAdmin.salt = salt;
            this.users.push({
                ...defaultAdmin,
                id: this.users.length + 1
            });
            // Créer aussi un utilisateur de développement
            const devUser = {
                username: 'dev',
                passwordHash: '',
                salt: '',
                role: 'admin',
                email: 'admin@bibliotheque-dev.local',
                firstName: 'Développement',
                lastName: 'Admin',
                isActive: true,
                createdAt: new Date().toISOString(),
                loginAttempts: 0
            };
            const devPasswordData = this.hashPassword('dev123456');
            devUser.passwordHash = devPasswordData.hash;
            devUser.salt = devPasswordData.salt;
            this.users.push({
                ...devUser,
                id: this.users.length + 1
            });
            // Créer aussi un utilisateur démo
            const demoUser = {
                username: 'demo',
                passwordHash: '',
                salt: '',
                role: 'librarian',
                email: 'demo@bibliotheque.local',
                firstName: 'Démo',
                lastName: 'Utilisateur',
                isActive: true,
                createdAt: new Date().toISOString(),
                loginAttempts: 0
            };
            const demoPass = this.hashPassword('demo');
            demoUser.passwordHash = demoPass.hash;
            demoUser.salt = demoPass.salt;
            this.users.push({
                ...demoUser,
                id: this.users.length + 1
            });
            // Créer l'utilisateur biblio
            const biblioUser = {
                username: 'biblio',
                passwordHash: '',
                salt: '',
                role: 'librarian',
                email: 'biblio@bibliotheque.local',
                firstName: 'Bibliothécaire',
                lastName: 'Principal',
                isActive: true,
                createdAt: new Date().toISOString(),
                loginAttempts: 0
            };
            const biblioPass = this.hashPassword('biblio');
            biblioUser.passwordHash = biblioPass.hash;
            biblioUser.salt = biblioPass.salt;
            this.users.push({
                ...biblioUser,
                id: this.users.length + 1
            });
            this.saveUsers();
        }
    }
    hashPassword(password, salt) {
        const passwordSalt = salt || crypto.randomBytes(32).toString('hex');
        const hash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');
        return {
            hash,
            salt: passwordSalt
        };
    }
    verifyPassword(password, hash, salt) {
        const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === verifyHash;
    }
    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }
    cleanExpiredSessions() {
        const now = new Date();
        this.sessions = this.sessions.filter(session => {
            const expiresAt = new Date(session.expiresAt);
            return expiresAt > now && session.isActive;
        });
        this.saveSessions();
    }
    isUserLocked(user) {
        if (user.lockedUntil) {
            const lockExpires = new Date(user.lockedUntil);
            if (new Date() < lockExpires) {
                return true;
            }
            else {
                // Le verrouillage a expiré, réinitialiser
                user.lockedUntil = undefined;
                user.loginAttempts = 0;
                this.saveUsers();
                return false;
            }
        }
        return false;
    }
    lockUser(user) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            // Verrouiller pour 15 minutes
            const lockDuration = 15 * 60 * 1000; // 15 minutes en millisecondes
            user.lockedUntil = new Date(Date.now() + lockDuration).toISOString();
        }
        this.saveUsers();
    }
    resetLoginAttempts(user) {
        user.loginAttempts = 0;
        user.lockedUntil = undefined;
        this.saveUsers();
    }
    async login(credentials) {
        try {
            // Nettoyer les sessions expirées
            this.cleanExpiredSessions();
            const user = this.users.find(u => (u.username === credentials.username || u.email === credentials.username) && u.isActive);
            if (!user) {
                return {
                    success: false,
                    error: 'Nom d\'utilisateur ou mot de passe incorrect'
                };
            }
            // Vérifier si l'utilisateur est verrouillé
            if (this.isUserLocked(user)) {
                const lockExpires = new Date(user.lockedUntil);
                const minutesLeft = Math.ceil((lockExpires.getTime() - Date.now()) / (60 * 1000));
                return {
                    success: false,
                    error: `Compte verrouillé. Réessayez dans ${minutesLeft} minute(s)`
                };
            }
            // Vérifier le mot de passe
            const isValidPassword = this.verifyPassword(credentials.password, user.passwordHash, user.salt);
            if (!isValidPassword) {
                this.lockUser(user);
                return {
                    success: false,
                    error: 'Nom d\'utilisateur ou mot de passe incorrect'
                };
            }
            // Réinitialiser les tentatives de connexion
            this.resetLoginAttempts(user);
            // Mettre à jour la dernière connexion
            user.lastLogin = new Date().toISOString();
            this.saveUsers();
            // Créer une nouvelle session
            const sessionId = this.generateSessionId();
            const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 heure
            const session = {
                id: sessionId,
                userId: user.id,
                username: user.username,
                role: user.role,
                createdAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString(),
                isActive: true
            };
            this.sessions.push(session);
            this.currentSession = session;
            this.saveSessions();
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    lastLogin: user.lastLogin || user.createdAt
                }
            };
        }
        catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return {
                success: false,
                error: 'Erreur interne du serveur'
            };
        }
    }
    logout() {
        try {
            if (this.currentSession) {
                // Marquer la session comme inactive
                const session = this.sessions.find(s => s.id === this.currentSession.id);
                if (session) {
                    session.isActive = false;
                }
                this.currentSession = null;
                this.saveSessions();
            }
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return false;
        }
    }
    isAuthenticated() {
        if (!this.currentSession) {
            return false;
        }
        // Vérifier si la session est encore valide
        const expiresAt = new Date(this.currentSession.expiresAt);
        const now = new Date();
        if (now >= expiresAt || !this.currentSession.isActive) {
            this.currentSession = null;
            return false;
        }
        return true;
    }
    getCurrentUser() {
        if (!this.isAuthenticated() || !this.currentSession) {
            return null;
        }
        return this.users.find(u => u.id === this.currentSession.userId) || null;
    }
    getCurrentSession() {
        return this.isAuthenticated() ? this.currentSession : null;
    }
    // Méthodes d'administration des utilisateurs
    createUser(userData) {
        try {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = this.users.find(u => u.username === userData.username);
            if (existingUser) {
                return {
                    success: false,
                    error: 'Un utilisateur avec ce nom existe déjà'
                };
            }
            // Hasher le mot de passe
            const { hash, salt } = this.hashPassword(userData.password);
            const newUser = {
                id: Math.max(...this.users.map(u => u.id), 0) + 1,
                username: userData.username,
                passwordHash: hash,
                salt: salt,
                role: userData.role,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isActive: true,
                createdAt: new Date().toISOString(),
                loginAttempts: 0
            };
            this.users.push(newUser);
            this.saveUsers();
            // Retourner l'utilisateur sans les données sensibles
            const { passwordHash, salt: userSalt, ...safeUser } = newUser;
            return {
                success: true,
                user: safeUser
            };
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la création de l\'utilisateur'
            };
        }
    }
    updateUser(userId, userData) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Vérifier l'unicité du nom d'utilisateur si modifié
            if (userData.username && userData.username !== user.username) {
                const existingUser = this.users.find(u => u.username === userData.username);
                if (existingUser) {
                    return {
                        success: false,
                        error: 'Ce nom d\'utilisateur est déjà utilisé'
                    };
                }
                user.username = userData.username;
            }
            // Mettre à jour le mot de passe si fourni
            if (userData.password) {
                const { hash, salt } = this.hashPassword(userData.password);
                user.passwordHash = hash;
                user.salt = salt;
                user.loginAttempts = 0; // Réinitialiser les tentatives
                user.lockedUntil = undefined;
            }
            // Mettre à jour les autres champs
            if (userData.role !== undefined)
                user.role = userData.role;
            if (userData.email !== undefined)
                user.email = userData.email;
            if (userData.firstName !== undefined)
                user.firstName = userData.firstName;
            if (userData.lastName !== undefined)
                user.lastName = userData.lastName;
            if (userData.isActive !== undefined)
                user.isActive = userData.isActive;
            this.saveUsers();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la mise à jour'
            };
        }
    }
    deleteUser(userId) {
        try {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Ne pas supprimer le dernier administrateur
            const user = this.users[userIndex];
            if (user.role === 'admin') {
                const adminCount = this.users.filter(u => u.role === 'admin' && u.isActive).length;
                if (adminCount <= 1) {
                    return {
                        success: false,
                        error: 'Impossible de supprimer le dernier administrateur'
                    };
                }
            }
            this.users.splice(userIndex, 1);
            this.saveUsers();
            // Invalider les sessions de cet utilisateur
            this.sessions = this.sessions.filter(s => s.userId !== userId);
            this.saveSessions();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression'
            };
        }
    }
    getAllUsers() {
        return this.users.map(({ passwordHash, salt, ...user }) => user);
    }
    getActiveSessions() {
        this.cleanExpiredSessions();
        return this.sessions.filter(s => s.isActive);
    }
    invalidateSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.isActive = false;
            this.saveSessions();
            return true;
        }
        return false;
    }
    invalidateAllUserSessions(userId) {
        this.sessions = this.sessions.map(session => {
            if (session.userId === userId) {
                session.isActive = false;
            }
            return session;
        });
        this.saveSessions();
    }
    // Méthodes utilitaires
    validatePassword(password) {
        const errors = [];
        if (password.length < 6) {
            errors.push('Le mot de passe doit contenir au moins 6 caractères');
        }
        if (!/\d/.test(password)) {
            errors.push('Le mot de passe doit contenir au moins un chiffre');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    changePassword(userId, currentPassword, newPassword) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Vérifier le mot de passe actuel
            const isCurrentPasswordValid = this.verifyPassword(currentPassword, user.passwordHash, user.salt);
            if (!isCurrentPasswordValid) {
                return {
                    success: false,
                    error: 'Mot de passe actuel incorrect'
                };
            }
            // Valider le nouveau mot de passe
            const validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Mettre à jour le mot de passe
            const { hash, salt } = this.hashPassword(newPassword);
            user.passwordHash = hash;
            user.salt = salt;
            user.loginAttempts = 0;
            user.lockedUntil = undefined;
            this.saveUsers();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            return {
                success: false,
                error: 'Erreur lors du changement de mot de passe'
            };
        }
    }
    resetPassword(userId, newPassword) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Valider le nouveau mot de passe
            const validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Mettre à jour le mot de passe
            const { hash, salt } = this.hashPassword(newPassword);
            user.passwordHash = hash;
            user.salt = salt;
            user.loginAttempts = 0;
            user.lockedUntil = undefined;
            this.saveUsers();
            // Invalider toutes les sessions de cet utilisateur
            this.invalidateAllUserSessions(userId);
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            return {
                success: false,
                error: 'Erreur lors de la réinitialisation du mot de passe'
            };
        }
    }
    getLoginAttempts(username) {
        const user = this.users.find(u => u.username === username);
        return user ? user.loginAttempts : 0;
    }
    unlockUser(userId) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            user.loginAttempts = 0;
            user.lockedUntil = undefined;
            this.saveUsers();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors du déverrouillage de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors du déverrouillage'
            };
        }
    }
    // Méthodes d'audit et de sécurité
    getLoginHistory(limit = 50) {
        // Pour l'instant, retourner les dernières connexions des sessions
        return this.sessions
            .slice(-limit)
            .map(session => ({
            username: session.username,
            loginTime: session.createdAt,
            success: true
        }));
    }
    getSecurityStats() {
        const now = new Date();
        const lockedUsers = this.users.filter(user => {
            if (user.lockedUntil) {
                const lockExpires = new Date(user.lockedUntil);
                return now < lockExpires;
            }
            return false;
        });
        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(u => u.isActive).length,
            lockedUsers: lockedUsers.length,
            activeSessions: this.getActiveSessions().length,
            adminUsers: this.users.filter(u => u.role === 'admin' && u.isActive).length
        };
    }
    // Méthodes de maintenance
    cleanupInactiveSessions() {
        const initialCount = this.sessions.length;
        this.cleanExpiredSessions();
        return initialCount - this.sessions.length;
    }
    exportUsers() {
        const safeUsers = this.users.map(({ passwordHash, salt, ...user }) => user);
        return JSON.stringify(safeUsers, null, 2);
    }
    // Méthode pour vérifier l'intégrité des données
    validateDataIntegrity() {
        const errors = [];
        // Vérifier qu'il y a au moins un administrateur actif
        const activeAdmins = this.users.filter(u => u.role === 'admin' && u.isActive);
        if (activeAdmins.length === 0) {
            errors.push('Aucun administrateur actif trouvé');
        }
        // Vérifier l'unicité des noms d'utilisateur
        const usernames = this.users.map(u => u.username);
        const uniqueUsernames = new Set(usernames);
        if (usernames.length !== uniqueUsernames.size) {
            errors.push('Noms d\'utilisateur en double détectés');
        }
        // Vérifier la validité des sessions
        const validSessions = this.sessions.filter(session => {
            const user = this.users.find(u => u.id === session.userId);
            return user && user.isActive;
        });
        if (validSessions.length !== this.sessions.filter(s => s.isActive).length) {
            errors.push('Sessions orphelines détectées');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.AuthService = AuthService;


/***/ }),

/***/ "./src/services/BackupService.ts":
/*!***************************************!*\
  !*** ./src/services/BackupService.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupService = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const archiver_1 = __importDefault(__webpack_require__(/*! archiver */ "archiver"));
const extract_zip_1 = __importDefault(__webpack_require__(/*! extract-zip */ "extract-zip"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
class BackupService {
    constructor(databaseService) {
        this.databaseService = databaseService;
        const userDataPath = electron_1.app.getPath('userData');
        this.backupDir = path.join(userDataPath, 'backups');
        this.tempDir = path.join(userDataPath, 'temp');
        // Créer les dossiers s'ils n'existent pas
        this.ensureDirectories();
    }
    ensureDirectories() {
        try {
            if (!fs.existsSync(this.backupDir)) {
                fs.mkdirSync(this.backupDir, { recursive: true });
            }
            if (!fs.existsSync(this.tempDir)) {
                fs.mkdirSync(this.tempDir, { recursive: true });
            }
        }
        catch (error) {
            console.error('Erreur lors de la création des dossiers:', error);
        }
    }
    async calculateChecksum(filePath) {
        return new Promise((resolve, reject) => {
            const crypto = __webpack_require__(/*! crypto */ "crypto");
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (data) => hash.update(Buffer.from(data)));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }
    async getBackupStats() {
        try {
            const stats = await this.databaseService.getStats();
            const borrowHistory = await this.databaseService.getBorrowHistory();
            return {
                totalBooks: stats.totalBooks,
                totalBorrowers: stats.totalBorrowers,
                totalAuthors: stats.totalAuthors,
                totalCategories: stats.totalCategories,
                totalBorrowHistory: borrowHistory.length
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            return {
                totalBooks: 0,
                totalBorrowers: 0,
                totalAuthors: 0,
                totalCategories: 0,
                totalBorrowHistory: 0
            };
        }
    }
    async createBackup() {
        return new Promise(async (resolve, reject) => {
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupFileName = `bibliotheque_backup_${timestamp}.bak`;
                const backupFilePath = path.join(this.backupDir, backupFileName);
                // Créer l'archive
                const output = fs.createWriteStream(backupFilePath);
                const archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 } // Compression maximale
                });
                output.on('close', async () => {
                    try {
                        // Calculer le checksum
                        const checksum = await this.calculateChecksum(backupFilePath);
                        // Créer les métadonnées
                        const stats = await this.getBackupStats();
                        const metadata = {
                            version: '1.0',
                            timestamp: new Date().toISOString(),
                            appVersion: electron_1.app.getVersion(),
                            platform: process.platform,
                            stats,
                            checksum
                        };
                        // Sauvegarder les métadonnées dans un fichier séparé
                        const metadataPath = path.join(this.backupDir, `${backupFileName}.meta`);
                        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
                        console.log('Sauvegarde créée:', backupFilePath);
                        resolve(backupFilePath);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                output.on('error', reject);
                archive.on('error', reject);
                archive.pipe(output);
                // Ajouter la base de données
                const dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
                if (fs.existsSync(dbPath)) {
                    archive.file(dbPath, { name: 'bibliotheque.db' });
                }
                // Ajouter les fichiers de configuration
                const usersPath = path.join(electron_1.app.getPath('userData'), 'users.json');
                if (fs.existsSync(usersPath)) {
                    archive.file(usersPath, { name: 'users.json' });
                }
                const sessionsPath = path.join(electron_1.app.getPath('userData'), 'sessions.json');
                if (fs.existsSync(sessionsPath)) {
                    archive.file(sessionsPath, { name: 'sessions.json' });
                }
                const settingsPath = path.join(electron_1.app.getPath('userData'), 'settings.json');
                if (fs.existsSync(settingsPath)) {
                    archive.file(settingsPath, { name: 'settings.json' });
                }
                // Ajouter un fichier d'informations sur la sauvegarde
                const stats = await this.getBackupStats();
                const backupInfo = {
                    version: '1.0',
                    timestamp: new Date().toISOString(),
                    appVersion: electron_1.app.getVersion(),
                    platform: process.platform,
                    stats
                };
                archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup_info.json' });
                // Finaliser l'archive
                await archive.finalize();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async restoreBackup(backupFilePath) {
        return new Promise(async (resolve, reject) => {
            try {
                // Vérifier que le fichier existe
                if (!fs.existsSync(backupFilePath)) {
                    reject(new Error('Fichier de sauvegarde introuvable'));
                    return;
                }
                // Créer un dossier temporaire pour l'extraction
                const extractPath = path.join(this.tempDir, `restore_${Date.now()}`);
                fs.mkdirSync(extractPath, { recursive: true });
                try {
                    // Extraire l'archive
                    await (0, extract_zip_1.default)(backupFilePath, { dir: extractPath });
                    // Vérifier la structure de la sauvegarde
                    const backupInfoPath = path.join(extractPath, 'backup_info.json');
                    if (!fs.existsSync(backupInfoPath)) {
                        throw new Error('Structure de sauvegarde invalide');
                    }
                    // Lire les informations de sauvegarde
                    const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
                    console.log('Restauration de la sauvegarde:', backupInfo);
                    const userDataPath = electron_1.app.getPath('userData');
                    // Sauvegarder les fichiers actuels
                    const backupCurrentPath = path.join(this.tempDir, `current_backup_${Date.now()}`);
                    fs.mkdirSync(backupCurrentPath, { recursive: true });
                    const filesToBackup = [
                        'bibliotheque.db',
                        'users.json',
                        'sessions.json',
                        'settings.json'
                    ];
                    filesToBackup.forEach(fileName => {
                        const currentFile = path.join(userDataPath, fileName);
                        if (fs.existsSync(currentFile)) {
                            fs.copyFileSync(currentFile, path.join(backupCurrentPath, fileName));
                        }
                    });
                    // Restaurer les fichiers
                    filesToBackup.forEach(fileName => {
                        const extractedFile = path.join(extractPath, fileName);
                        const targetFile = path.join(userDataPath, fileName);
                        if (fs.existsSync(extractedFile)) {
                            fs.copyFileSync(extractedFile, targetFile);
                            console.log(`Fichier restauré: ${fileName}`);
                        }
                    });
                    // Nettoyer le dossier temporaire d'extraction
                    fs.rmSync(extractPath, { recursive: true, force: true });
                    console.log('Restauration terminée avec succès');
                    resolve(true);
                }
                catch (extractError) {
                    // Nettoyer en cas d'erreur
                    if (fs.existsSync(extractPath)) {
                        fs.rmSync(extractPath, { recursive: true, force: true });
                    }
                    throw extractError;
                }
            }
            catch (error) {
                console.error('Erreur lors de la restauration:', error);
                reject(error);
            }
        });
    }
    async getBackupList() {
        try {
            const backups = [];
            const files = fs.readdirSync(this.backupDir);
            for (const file of files) {
                if (file.endsWith('.bak')) {
                    const filePath = path.join(this.backupDir, file);
                    const metadataPath = path.join(this.backupDir, `${file}.meta`);
                    try {
                        const stats = fs.statSync(filePath);
                        let metadata = null;
                        // Essayer de lire les métadonnées
                        if (fs.existsSync(metadataPath)) {
                            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                        }
                        else {
                            // Essayer de lire les métadonnées depuis l'archive
                            metadata = await this.extractBackupMetadata(filePath);
                        }
                        if (metadata) {
                            backups.push({
                                filePath,
                                fileName: file,
                                size: stats.size,
                                createdAt: stats.birthtime.toISOString(),
                                metadata
                            });
                        }
                    }
                    catch (error) {
                        console.error(`Erreur lors de la lecture de la sauvegarde ${file}:`, error);
                    }
                }
            }
            // Trier par date de création (plus récent en premier)
            return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la liste des sauvegardes:', error);
            return [];
        }
    }
    async extractBackupMetadata(backupFilePath) {
        const tempExtractPath = path.join(this.tempDir, `meta_extract_${Date.now()}`);
        try {
            await (0, extract_zip_1.default)(backupFilePath, {
                dir: tempExtractPath,
                onEntry: (entry, zipFile) => {
                    // Ne extraire que le fichier backup_info.json
                    if (entry.fileName !== 'backup_info.json') {
                        zipFile.readEntry();
                    }
                }
            });
            const backupInfoPath = path.join(tempExtractPath, 'backup_info.json');
            if (fs.existsSync(backupInfoPath)) {
                const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
                // Calculer le checksum
                const checksum = await this.calculateChecksum(backupFilePath);
                return {
                    version: backupInfo.version || '1.0',
                    timestamp: backupInfo.timestamp,
                    appVersion: backupInfo.appVersion,
                    platform: backupInfo.platform,
                    stats: backupInfo.stats,
                    checksum
                };
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lors de l\'extraction des métadonnées:', error);
            return null;
        }
        finally {
            // Nettoyer
            if (fs.existsSync(tempExtractPath)) {
                fs.rmSync(tempExtractPath, { recursive: true, force: true });
            }
        }
    }
    async deleteBackup(backupFilePath) {
        try {
            if (fs.existsSync(backupFilePath)) {
                fs.unlinkSync(backupFilePath);
                // Supprimer aussi le fichier de métadonnées s'il existe
                const metadataPath = `${backupFilePath}.meta`;
                if (fs.existsSync(metadataPath)) {
                    fs.unlinkSync(metadataPath);
                }
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la sauvegarde:', error);
            return false;
        }
    }
    async validateBackup(backupFilePath) {
        try {
            const metadataPath = `${backupFilePath}.meta`;
            if (!fs.existsSync(backupFilePath)) {
                return false;
            }
            // Vérifier le checksum si les métadonnées existent
            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                const currentChecksum = await this.calculateChecksum(backupFilePath);
                if (metadata.checksum !== currentChecksum) {
                    console.error('Checksum invalide pour la sauvegarde:', backupFilePath);
                    return false;
                }
            }
            // Vérifier que l'archive peut être ouverte et contient les fichiers essentiels
            const tempExtractPath = path.join(this.tempDir, `validate_${Date.now()}`);
            try {
                await (0, extract_zip_1.default)(backupFilePath, { dir: tempExtractPath });
                const requiredFiles = ['backup_info.json'];
                const hasRequiredFiles = requiredFiles.every(file => fs.existsSync(path.join(tempExtractPath, file)));
                return hasRequiredFiles;
            }
            finally {
                if (fs.existsSync(tempExtractPath)) {
                    fs.rmSync(tempExtractPath, { recursive: true, force: true });
                }
            }
        }
        catch (error) {
            console.error('Erreur lors de la validation de la sauvegarde:', error);
            return false;
        }
    }
    async exportDatabase(outputPath) {
        try {
            const dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
            if (!fs.existsSync(dbPath)) {
                throw new Error('Base de données introuvable');
            }
            fs.copyFileSync(dbPath, outputPath);
        }
        catch (error) {
            console.error('Erreur lors de l\'export de la base de données:', error);
            throw error;
        }
    }
    async importDatabase(sourcePath) {
        try {
            if (!fs.existsSync(sourcePath)) {
                throw new Error('Fichier source introuvable');
            }
            const dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
            // Sauvegarder la base de données actuelle
            const backupDbPath = path.join(electron_1.app.getPath('userData'), `bibliotheque_backup_${Date.now()}.db`);
            if (fs.existsSync(dbPath)) {
                fs.copyFileSync(dbPath, backupDbPath);
            }
            // Importer la nouvelle base de données
            fs.copyFileSync(sourcePath, dbPath);
        }
        catch (error) {
            console.error('Erreur lors de l\'import de la base de données:', error);
            throw error;
        }
    }
    async scheduleAutoBackup(frequency) {
        // Cette méthode peut être étendue pour implémenter des sauvegardes automatiques
        // Pour l'instant, c'est un placeholder
        console.log(`Sauvegarde automatique programmée: ${frequency}`);
    }
    async cleanOldBackups(keepCount = 10) {
        try {
            const backups = await this.getBackupList();
            if (backups.length <= keepCount) {
                return 0; // Rien à nettoyer
            }
            // Garder les plus récents, supprimer les anciens
            const backupsToDelete = backups.slice(keepCount);
            let deletedCount = 0;
            for (const backup of backupsToDelete) {
                const success = await this.deleteBackup(backup.filePath);
                if (success) {
                    deletedCount++;
                }
            }
            return deletedCount;
        }
        catch (error) {
            console.error('Erreur lors du nettoyage des sauvegardes:', error);
            return 0;
        }
    }
    getBackupDirectorySize() {
        try {
            const files = fs.readdirSync(this.backupDir);
            let totalSize = 0;
            for (const file of files) {
                const filePath = path.join(this.backupDir, file);
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
            }
            return totalSize;
        }
        catch (error) {
            console.error('Erreur lors du calcul de la taille du dossier de sauvegarde:', error);
            return 0;
        }
    }
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
}
exports.BackupService = BackupService;


/***/ }),

/***/ "./src/services/DatabaseService.ts":
/*!*****************************************!*\
  !*** ./src/services/DatabaseService.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const sqlite3 = __importStar(__webpack_require__(/*! sqlite3 */ "sqlite3"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const preload_1 = __webpack_require__(/*! ../preload */ "./src/preload.ts");
class DatabaseService {
    constructor() {
        const dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
        this.db = new sqlite3.Database(dbPath);
    }
    async initialize() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Table des auteurs avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            biography TEXT,
            birthDate TEXT,
            nationality TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des catégories avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            color TEXT DEFAULT '#3E5C49',
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des emprunteurs avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS borrowers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK (type IN ('student', 'staff')),
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            matricule TEXT NOT NULL UNIQUE,
            classe TEXT,
            cniNumber TEXT,
            position TEXT,
            email TEXT,
            phone TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des documents (nouvelle structure)
                this.db.run(`
          CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Champs principaux requis
            auteur TEXT NOT NULL,
            titre TEXT NOT NULL,
            editeur TEXT NOT NULL,
            lieuEdition TEXT NOT NULL,
            annee TEXT NOT NULL,
            descripteurs TEXT NOT NULL,
            cote TEXT NOT NULL UNIQUE,
            
            -- Champs optionnels
            isbn TEXT,
            description TEXT,
            couverture TEXT,
            
            -- Statut d'emprunt
            estEmprunte BOOLEAN DEFAULT 0,
            emprunteurId INTEGER,
            dateEmprunt TEXT,
            dateRetourPrevu TEXT,
            dateRetour TEXT,
            
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (emprunteurId) REFERENCES borrowers(id)
          )
        `);
                // Vue pour compatibilité avec l'ancienne table books
                this.db.run(`
          CREATE VIEW IF NOT EXISTS books_view AS
          SELECT 
            id,
            titre AS title,
            auteur AS author,
            isbn,
            descripteurs AS category,
            annee AS publishedDate,
            description,
            couverture AS coverUrl,
            estEmprunte AS isBorrowed,
            emprunteurId AS borrowerId,
            dateEmprunt AS borrowDate,
            dateRetourPrevu AS expectedReturnDate,
            dateRetour AS returnDate,
            createdAt
          FROM documents
          WHERE deletedAt IS NULL
        `);
                // Table historique des emprunts avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS borrow_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId INTEGER NOT NULL,
            borrowerId INTEGER NOT NULL,
            borrowDate DATETIME NOT NULL,
            expectedReturnDate DATETIME NOT NULL,
            actualReturnDate DATETIME,
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
            notes TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bookId) REFERENCES documents(id),
            FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
          )
        `);
                // Table de queue de synchronisation
                this.db.run(`
          CREATE TABLE IF NOT EXISTS sync_queue (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL CHECK (type IN ('document', 'author', 'category', 'borrower', 'history')),
            operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
            data TEXT NOT NULL,
            timestamp DATETIME NOT NULL,
            retryCount INTEGER DEFAULT 0,
            maxRetries INTEGER DEFAULT 3,
            lastError TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.seedInitialData().then(resolve).catch(reject);
                    }
                });
            });
        });
    }
    async seedInitialData() {
        try {
            // Vérifier si des données existent déjà
            const existingDocuments = await this.getDocuments();
            if (existingDocuments.length > 0) {
                console.log('Base de données déjà initialisée');
                return;
            }
            const categories = [
                { name: 'Fiction', description: 'Romans et nouvelles', color: '#3E5C49' },
                { name: 'Science-Fiction', description: 'Littérature futuriste', color: '#C2571B' },
                { name: 'Histoire', description: 'Livres historiques', color: '#6E6E6E' },
                { name: 'Biographie', description: 'Vies de personnalités', color: '#3E5C49' },
                { name: 'Sciences', description: 'Ouvrages scientifiques', color: '#C2571B' },
                { name: 'Philosophie', description: 'Réflexions philosophiques', color: '#6E6E6E' },
            ];
            const authors = [
                { name: 'Victor Hugo', biography: 'Écrivain français du XIXe siècle', nationality: 'Française' },
                { name: 'Albert Camus', biography: 'Philosophe et écrivain français', nationality: 'Française' },
                { name: 'Isaac Asimov', biography: 'Auteur de science-fiction', nationality: 'Américaine' },
                { name: 'Marie Curie', biography: 'Physicienne et chimiste', nationality: 'Française' },
                { name: 'Jules Verne', biography: 'Écrivain français de science-fiction', nationality: 'Française' },
            ];
            const borrowers = [
                {
                    type: 'student',
                    firstName: 'Jean',
                    lastName: 'Dupont',
                    matricule: 'ET001',
                    classe: 'Terminale C',
                    email: 'jean.dupont@ecole.cm'
                },
                {
                    type: 'student',
                    firstName: 'Marie',
                    lastName: 'Martin',
                    matricule: 'ET002',
                    classe: 'Première D',
                    email: 'marie.martin@ecole.cm'
                },
                {
                    type: 'staff',
                    firstName: 'Paul',
                    lastName: 'Nguyen',
                    matricule: 'ENS001',
                    position: 'Professeur de Mathématiques',
                    cniNumber: '123456789',
                    email: 'paul.nguyen@ecole.cm'
                }
            ];
            const documents = [
                {
                    auteur: 'Victor Hugo',
                    titre: 'Les Misérables',
                    editeur: 'Gallimard',
                    lieuEdition: 'Paris',
                    annee: '1862',
                    descripteurs: 'Fiction, Roman historique, XIXe siècle, France',
                    cote: 'FIC-HUG-001',
                    isbn: '978-2-253-00001-1',
                    description: 'Roman historique français décrivant la vie de divers personnages français dans la première moitié du XIXe siècle.',
                    estEmprunte: false,
                    syncStatus: 'synced',
                    lastModified: new Date().toISOString(),
                    version: 1
                },
                {
                    auteur: 'Albert Camus',
                    titre: 'L\'Étranger',
                    editeur: 'Gallimard',
                    lieuEdition: 'Paris',
                    annee: '1942',
                    descripteurs: 'Fiction, Philosophie, Absurde, Littérature française',
                    cote: 'FIC-CAM-001',
                    isbn: '978-2-253-00002-2',
                    description: 'Premier roman d\'Albert Camus, publié en 1942. Il prend place dans la lignée des récits qui illustrent la philosophie de l\'absurde.',
                    estEmprunte: false,
                    syncStatus: 'synced',
                    lastModified: new Date().toISOString(),
                    version: 1
                },
                {
                    auteur: 'Isaac Asimov',
                    titre: 'Fondation',
                    editeur: 'Denoël',
                    lieuEdition: 'Paris',
                    annee: '1951',
                    descripteurs: 'Science-Fiction, Futur, Empire galactique, Psychohistoire',
                    cote: 'SF-ASI-001',
                    isbn: '978-2-253-00003-3',
                    description: 'Premier tome du cycle de Fondation, une saga de science-fiction se déroulant dans un futur lointain.',
                    estEmprunte: false,
                    syncStatus: 'synced',
                    lastModified: new Date().toISOString(),
                    version: 1
                },
                {
                    auteur: 'Marie Curie',
                    titre: 'La Radioactivité',
                    editeur: 'Dunod',
                    lieuEdition: 'Paris',
                    annee: '1935',
                    descripteurs: 'Sciences, Physique, Radioactivité, Chimie',
                    cote: 'SCI-CUR-001',
                    description: 'Ouvrage fondamental sur la découverte et les applications de la radioactivité.',
                    estEmprunte: false,
                    syncStatus: 'synced',
                    lastModified: new Date().toISOString(),
                    version: 1
                },
                {
                    auteur: 'Jules Verne',
                    titre: 'Vingt mille lieues sous les mers',
                    editeur: 'Hetzel',
                    lieuEdition: 'Paris',
                    annee: '1870',
                    descripteurs: 'Science-Fiction, Aventure, Sous-marins, Océan',
                    cote: 'SF-VER-001',
                    isbn: '978-2-253-00004-4',
                    description: 'Roman d\'aventures de Jules Verne décrivant les exploits du capitaine Nemo à bord du Nautilus.',
                    estEmprunte: false,
                    syncStatus: 'synced',
                    lastModified: new Date().toISOString(),
                    version: 1
                }
            ];
            // Ajouter les catégories
            for (const category of categories) {
                await this.addCategory({
                    ...category,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les auteurs
            for (const author of authors) {
                await this.addAuthor({
                    ...author,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les emprunteurs
            for (const borrower of borrowers) {
                await this.addBorrower({
                    ...borrower,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les documents
            for (const document of documents) {
                await this.addDocument(document);
            }
            console.log('Données d\'exemple ajoutées avec succès');
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation des données:', error);
        }
    }
    // CRUD Borrowers
    async getBorrowers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM borrowers ORDER BY lastName, firstName', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addBorrower(borrower) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT INTO borrowers (type, firstName, lastName, matricule, classe, cniNumber, position, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                borrower.type,
                borrower.firstName,
                borrower.lastName,
                borrower.matricule,
                borrower.classe || null,
                borrower.cniNumber || null,
                borrower.position || null,
                borrower.email || null,
                borrower.phone || null
            ], function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: borrowers.matricule')) {
                        reject(new Error('Un emprunteur avec ce matricule existe déjà'));
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve(this.lastID || 0);
                }
            });
            stmt.finalize();
        });
    }
    async updateBorrower(borrower) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        UPDATE borrowers SET 
          type = ?, firstName = ?, lastName = ?, matricule = ?, 
          classe = ?, cniNumber = ?, position = ?, email = ?, phone = ?
        WHERE id = ?
      `);
            stmt.run([
                borrower.type,
                borrower.firstName,
                borrower.lastName,
                borrower.matricule,
                borrower.classe || null,
                borrower.cniNumber || null,
                borrower.position || null,
                borrower.email || null,
                borrower.phone || null,
                borrower.id
            ], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
            stmt.finalize();
        });
    }
    async deleteBorrower(id) {
        return new Promise((resolve, reject) => {
            // Vérifier s'il n'y a pas d'emprunts actifs
            this.db.get('SELECT COUNT(*) as count FROM borrow_history WHERE borrowerId = ? AND status = "active"', [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row.count > 0) {
                    reject(new Error('Impossible de supprimer : cet emprunteur a des livres non rendus'));
                    return;
                }
                this.db.run('DELETE FROM borrowers WHERE id = ?', [id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(this.changes > 0);
                    }
                });
            });
        });
    }
    async searchBorrowers(query) {
        return new Promise((resolve, reject) => {
            const searchQuery = `%${query}%`;
            this.db.all(`
        SELECT * FROM borrowers 
        WHERE firstName LIKE ? OR lastName LIKE ? OR matricule LIKE ? OR classe LIKE ? OR position LIKE ?
        ORDER BY lastName, firstName
      `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    // Books CRUD mis à jour
    async getBooks() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        ORDER BY d.createdAt DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const books = rows.map((row) => (0, preload_1.createBookFromDocument)(row));
                    resolve(books);
                }
            });
        });
    }
    // Gestion des emprunts
    async borrowBook(bookId, borrowerId, expectedReturnDate) {
        return new Promise((resolve, reject) => {
            const borrowDate = new Date().toISOString();
            const database = this.db; // Capturer this.db dans une variable locale
            database.serialize(() => {
                database.run('BEGIN TRANSACTION');
                const stmt1 = database.prepare(`
        INSERT INTO borrow_history (bookId, borrowerId, borrowDate, expectedReturnDate, status)
        VALUES (?, ?, ?, ?, 'active')
      `);
                stmt1.run([bookId, borrowerId, borrowDate, expectedReturnDate], function (err) {
                    if (err) {
                        database.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    const historyId = this.lastID;
                    const stmt2 = database.prepare(`
          UPDATE documents SET 
            estEmprunte = 1, 
            emprunteurId = ?, 
            dateEmprunt = ?, 
            dateRetourPrevu = ?
          WHERE id = ?
        `);
                    stmt2.run([borrowerId, borrowDate, expectedReturnDate, bookId], (err) => {
                        if (err) {
                            database.run('ROLLBACK');
                            reject(err);
                        }
                        else {
                            database.run('COMMIT');
                            resolve(historyId);
                        }
                    });
                    stmt2.finalize();
                });
                stmt1.finalize();
            });
        });
    }
    async returnBook(borrowHistoryId, notes) {
        return new Promise((resolve, reject) => {
            const returnDate = new Date().toISOString();
            const database = this.db; // Capturer this.db dans une variable locale
            database.serialize(() => {
                database.run('BEGIN TRANSACTION');
                database.get('SELECT bookId FROM borrow_history WHERE id = ?', [borrowHistoryId], (err, row) => {
                    if (err) {
                        database.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    if (!row) {
                        database.run('ROLLBACK');
                        reject(new Error('Emprunt non trouvé'));
                        return;
                    }
                    const bookId = row.bookId;
                    const stmt1 = database.prepare(`
          UPDATE borrow_history SET 
            actualReturnDate = ?, 
            status = 'returned',
            notes = ?
          WHERE id = ?
        `);
                    stmt1.run([returnDate, notes || null, borrowHistoryId], function (err) {
                        if (err) {
                            database.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        const stmt2 = database.prepare(`
            UPDATE documents SET 
              estEmprunte = 0, 
              emprunteurId = NULL, 
              dateEmprunt = NULL,
              dateRetourPrevu = NULL,
              dateRetour = ?
            WHERE id = ?
          `);
                        stmt2.run([returnDate, bookId], function (err) {
                            if (err) {
                                database.run('ROLLBACK');
                                reject(err);
                            }
                            else {
                                database.run('COMMIT');
                                resolve((this.changes || 0) > 0);
                            }
                        });
                        stmt2.finalize();
                    });
                    stmt1.finalize();
                });
            });
        });
    }
    async getBorrowedBooks() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          bh.*,
          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, 
          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,
          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,
          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,
          d.version as bookVersion, d.createdAt as bookCreatedAt,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,
          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,
          br.lastModified as borrowerLastModified, br.version as borrowerVersion,
          br.createdAt as borrowerCreatedAt
        FROM borrow_history bh
        JOIN documents d ON bh.bookId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.status = 'active' AND d.deletedAt IS NULL
        ORDER BY bh.borrowDate DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const history = rows.map(row => ({
                        id: row.id,
                        bookId: row.bookId,
                        borrowerId: row.borrowerId,
                        borrowDate: row.borrowDate,
                        expectedReturnDate: row.expectedReturnDate,
                        actualReturnDate: row.actualReturnDate,
                        status: row.status,
                        notes: row.notes,
                        syncStatus: row.syncStatus || 'synced',
                        lastModified: row.lastModified || new Date().toISOString(),
                        version: row.version || 1,
                        createdAt: row.createdAt,
                        book: {
                            id: row.bookId,
                            // English properties (Book interface)
                            title: row.title,
                            author: row.author,
                            isbn: row.isbn,
                            category: row.category,
                            publishedDate: row.publishedDate,
                            description: row.description,
                            coverUrl: row.coverUrl,
                            isBorrowed: Boolean(row.isBorrowed),
                            borrowerId: row.borrowerId,
                            borrowDate: row.borrowDate,
                            expectedReturnDate: row.expectedReturnDate,
                            returnDate: row.returnDate,
                            borrowerName: `${row.firstName} ${row.lastName}`,
                            // French properties (Document interface)
                            auteur: row.author,
                            titre: row.title,
                            editeur: 'Non spécifié',
                            lieuEdition: 'Non spécifié',
                            annee: row.publishedDate,
                            descripteurs: row.category,
                            cote: `${row.category.substring(0, 3)}-${row.author.substring(0, 3)}-001`.toUpperCase(),
                            couverture: row.coverUrl,
                            estEmprunte: Boolean(row.isBorrowed),
                            emprunteurId: row.borrowerId,
                            dateEmprunt: row.borrowDate,
                            dateRetourPrevu: row.expectedReturnDate,
                            dateRetour: row.returnDate,
                            nomEmprunteur: `${row.firstName} ${row.lastName}`,
                            // Sync properties
                            syncStatus: row.bookSyncStatus || 'synced',
                            lastModified: row.bookLastModified || new Date().toISOString(),
                            version: row.bookVersion || 1,
                            createdAt: row.bookCreatedAt
                        },
                        borrower: {
                            id: row.borrowerId,
                            type: row.type,
                            firstName: row.firstName,
                            lastName: row.lastName,
                            matricule: row.matricule,
                            classe: row.classe,
                            cniNumber: row.cniNumber,
                            position: row.position,
                            email: row.email,
                            phone: row.phone,
                            syncStatus: row.borrowerSyncStatus || 'synced',
                            lastModified: row.borrowerLastModified || new Date().toISOString(),
                            version: row.borrowerVersion || 1,
                            createdAt: row.borrowerCreatedAt
                        }
                    }));
                    resolve(history);
                }
            });
        });
    }
    async getBorrowHistory(filter) {
        return new Promise((resolve, reject) => {
            let query = `
        SELECT 
          bh.*,
          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, 
          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,
          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,
          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,
          d.version as bookVersion, d.createdAt as bookCreatedAt,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,
          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,
          br.lastModified as borrowerLastModified, br.version as borrowerVersion,
          br.createdAt as borrowerCreatedAt
        FROM borrow_history bh
        JOIN documents d ON bh.bookId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
      `;
            const conditions = ['d.deletedAt IS NULL'];
            const params = [];
            if (filter) {
                if (filter.startDate) {
                    conditions.push('bh.borrowDate >= ?');
                    params.push(filter.startDate);
                }
                if (filter.endDate) {
                    conditions.push('bh.borrowDate <= ?');
                    params.push(filter.endDate + ' 23:59:59');
                }
                if (filter.borrowerType && filter.borrowerType !== 'all') {
                    conditions.push('br.type = ?');
                    params.push(filter.borrowerType);
                }
                if (filter.status && filter.status !== 'all') {
                    conditions.push('bh.status = ?');
                    params.push(filter.status);
                }
                if (filter.borrowerId) {
                    conditions.push('bh.borrowerId = ?');
                    params.push(filter.borrowerId);
                }
                if (filter.bookId) {
                    conditions.push('bh.bookId = ?');
                    params.push(filter.bookId);
                }
            }
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            query += ' ORDER BY bh.borrowDate DESC';
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const history = rows.map(row => ({
                        id: row.id,
                        bookId: row.bookId,
                        borrowerId: row.borrowerId,
                        borrowDate: row.borrowDate,
                        expectedReturnDate: row.expectedReturnDate,
                        actualReturnDate: row.actualReturnDate,
                        status: row.status,
                        notes: row.notes,
                        syncStatus: row.syncStatus || 'synced',
                        lastModified: row.lastModified || new Date().toISOString(),
                        version: row.version || 1,
                        createdAt: row.createdAt,
                        book: {
                            id: row.bookId,
                            // English properties (Book interface)
                            title: row.title,
                            author: row.author,
                            isbn: row.isbn,
                            category: row.category,
                            publishedDate: row.publishedDate,
                            description: row.description,
                            coverUrl: row.coverUrl,
                            isBorrowed: Boolean(row.isBorrowed),
                            borrowerId: row.borrowerId,
                            borrowDate: row.borrowDate,
                            expectedReturnDate: row.expectedReturnDate,
                            returnDate: row.returnDate,
                            borrowerName: `${row.firstName} ${row.lastName}`,
                            // French properties (Document interface)
                            auteur: row.author,
                            titre: row.title,
                            editeur: 'Non spécifié',
                            lieuEdition: 'Non spécifié',
                            annee: row.publishedDate,
                            descripteurs: row.category,
                            cote: `${row.category.substring(0, 3)}-${row.author.substring(0, 3)}-001`.toUpperCase(),
                            couverture: row.coverUrl,
                            estEmprunte: Boolean(row.isBorrowed),
                            emprunteurId: row.borrowerId,
                            dateEmprunt: row.borrowDate,
                            dateRetourPrevu: row.expectedReturnDate,
                            dateRetour: row.returnDate,
                            nomEmprunteur: `${row.firstName} ${row.lastName}`,
                            // Sync properties
                            syncStatus: row.bookSyncStatus || 'synced',
                            lastModified: row.bookLastModified || new Date().toISOString(),
                            version: row.bookVersion || 1,
                            createdAt: row.bookCreatedAt
                        },
                        borrower: {
                            id: row.borrowerId,
                            type: row.type,
                            firstName: row.firstName,
                            lastName: row.lastName,
                            matricule: row.matricule,
                            classe: row.classe,
                            cniNumber: row.cniNumber,
                            position: row.position,
                            email: row.email,
                            phone: row.phone,
                            syncStatus: row.borrowerSyncStatus || 'synced',
                            lastModified: row.borrowerLastModified || new Date().toISOString(),
                            version: row.borrowerVersion || 1,
                            createdAt: row.borrowerCreatedAt
                        }
                    }));
                    resolve(history);
                }
            });
        });
    }
    // Autres méthodes existantes
    async getAuthors() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM authors ORDER BY name', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addAuthor(author) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO authors (name, biography, birthDate, nationality)
        VALUES (?, ?, ?, ?)
      `);
            stmt.run([
                author.name,
                author.biography,
                author.birthDate,
                author.nationality
            ], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID || 0);
                }
            });
            stmt.finalize();
        });
    }
    async getCategories() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addCategory(category) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO categories (name, description, color)
        VALUES (?, ?, ?)
      `);
            stmt.run([
                category.name,
                category.description,
                category.color
            ], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID || 0);
                }
            });
            stmt.finalize();
        });
    }
    async searchBooks(query) {
        return new Promise((resolve, reject) => {
            const searchQuery = `%${query}%`;
            this.db.all(`
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR description LIKE ?
        ORDER BY title
      `, [searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async getStats() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                const stats = {};
                // Utiliser documents au lieu de books
                this.db.get('SELECT COUNT(*) as count FROM documents WHERE deletedAt IS NULL', (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stats.totalBooks = row.count || 0;
                    this.db.get('SELECT COUNT(*) as count FROM documents WHERE estEmprunte = 1 AND deletedAt IS NULL', (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats.borrowedBooks = row.count || 0;
                        stats.availableBooks = (stats.totalBooks || 0) - (stats.borrowedBooks || 0);
                        this.db.get('SELECT COUNT(*) as count FROM authors WHERE deletedAt IS NULL', (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            stats.totalAuthors = row.count || 0;
                            this.db.get('SELECT COUNT(*) as count FROM categories WHERE deletedAt IS NULL', (err, row) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                stats.totalCategories = row.count || 0;
                                this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE deletedAt IS NULL', (err, row) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    stats.totalBorrowers = row.count || 0;
                                    this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "student" AND deletedAt IS NULL', (err, row) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        stats.totalStudents = row.count || 0;
                                        this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "staff" AND deletedAt IS NULL', (err, row) => {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            stats.totalStaff = row.count || 0;
                                            // Compter les livres en retard
                                            const now = new Date().toISOString();
                                            this.db.get(`
                      SELECT COUNT(*) as count FROM borrow_history 
                      WHERE status = 'active' AND expectedReturnDate < ? AND deletedAt IS NULL
                    `, [now], (err, row) => {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                stats.overdueBooks = row.count || 0;
                                                resolve(stats);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    // Méthode pour nettoyer la base de données (utile pour les tests)
    async clearDatabase() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('DELETE FROM borrow_history', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.db.run('DELETE FROM books', (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.db.run('DELETE FROM borrowers', (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            this.db.run('DELETE FROM authors', (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                this.db.run('DELETE FROM categories', (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    // ===============================
    // NOUVELLES MÉTHODES POUR DOCUMENTS
    // ===============================
    async getDocuments() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        ORDER BY d.lastModified DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const documents = rows.map((row) => ({
                        id: row.id,
                        auteur: row.auteur,
                        titre: row.titre,
                        editeur: row.editeur,
                        lieuEdition: row.lieuEdition,
                        annee: row.annee,
                        descripteurs: row.descripteurs,
                        cote: row.cote,
                        isbn: row.isbn,
                        description: row.description,
                        couverture: row.couverture,
                        estEmprunte: Boolean(row.estEmprunte),
                        emprunteurId: row.emprunteurId,
                        dateEmprunt: row.dateEmprunt,
                        dateRetourPrevu: row.dateRetourPrevu,
                        dateRetour: row.dateRetour,
                        nomEmprunteur: row.borrower_firstName && row.borrower_lastName
                            ? `${row.borrower_firstName} ${row.borrower_lastName}`
                            : undefined,
                        localId: row.localId,
                        remoteId: row.remoteId,
                        syncStatus: row.syncStatus,
                        lastModified: row.lastModified,
                        version: row.version,
                        deletedAt: row.deletedAt,
                        createdAt: row.createdAt
                    }));
                    resolve(documents);
                }
            });
        });
    }
    async addDocument(document) {
        return new Promise((resolve, reject) => {
            const localId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const now = new Date().toISOString();
            const stmt = this.db.prepare(`
        INSERT INTO documents (
          auteur, titre, editeur, lieuEdition, annee, descripteurs, cote,
          isbn, description, couverture, estEmprunte,
          localId, syncStatus, lastModified, version, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                document.auteur,
                document.titre,
                document.editeur,
                document.lieuEdition,
                document.annee,
                document.descripteurs,
                document.cote,
                document.isbn || null,
                document.description || null,
                document.couverture || null,
                document.estEmprunte ? 1 : 0,
                localId,
                'pending',
                now,
                1,
                now
            ], function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
                        reject(new Error('Un document avec cette cote existe déjà'));
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve(this.lastID || 0);
                }
            });
            stmt.finalize();
        });
    }
    async updateDocument(document) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            const stmt = this.db.prepare(`
        UPDATE documents SET 
          auteur = ?, titre = ?, editeur = ?, lieuEdition = ?, annee = ?, 
          descripteurs = ?, cote = ?, isbn = ?, description = ?, couverture = ?,
          lastModified = ?, version = version + 1, syncStatus = 'pending'
        WHERE id = ? AND deletedAt IS NULL
      `);
            stmt.run([
                document.auteur,
                document.titre,
                document.editeur,
                document.lieuEdition,
                document.annee,
                document.descripteurs,
                document.cote,
                document.isbn || null,
                document.description || null,
                document.couverture || null,
                now,
                document.id
            ], function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
                        reject(new Error('Un autre document avec cette cote existe déjà'));
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve((this.changes || 0) > 0);
                }
            });
            stmt.finalize();
        });
    }
    async deleteDocument(id) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            // Soft delete
            const stmt = this.db.prepare(`
        UPDATE documents 
        SET deletedAt = ?, lastModified = ?, syncStatus = 'pending', version = version + 1
        WHERE id = ? AND deletedAt IS NULL
      `);
            stmt.run([now, now, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve((this.changes || 0) > 0);
                }
            });
            stmt.finalize();
        });
    }
    async searchDocuments(query) {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${query.toLowerCase()}%`;
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        AND (
          LOWER(d.titre) LIKE ? OR 
          LOWER(d.auteur) LIKE ? OR 
          LOWER(d.editeur) LIKE ? OR
          LOWER(d.descripteurs) LIKE ? OR
          LOWER(d.cote) LIKE ? OR
          LOWER(d.isbn) LIKE ?
        )
        ORDER BY d.lastModified DESC
      `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const documents = rows.map((row) => ({
                        id: row.id,
                        auteur: row.auteur,
                        titre: row.titre,
                        editeur: row.editeur,
                        lieuEdition: row.lieuEdition,
                        annee: row.annee,
                        descripteurs: row.descripteurs,
                        cote: row.cote,
                        isbn: row.isbn,
                        description: row.description,
                        couverture: row.couverture,
                        estEmprunte: Boolean(row.estEmprunte),
                        emprunteurId: row.emprunteurId,
                        dateEmprunt: row.dateEmprunt,
                        dateRetourPrevu: row.dateRetourPrevu,
                        dateRetour: row.dateRetour,
                        nomEmprunteur: row.borrower_firstName && row.borrower_lastName
                            ? `${row.borrower_firstName} ${row.borrower_lastName}`
                            : undefined,
                        localId: row.localId,
                        remoteId: row.remoteId,
                        syncStatus: row.syncStatus,
                        lastModified: row.lastModified,
                        version: row.version,
                        deletedAt: row.deletedAt,
                        createdAt: row.createdAt
                    }));
                    resolve(documents);
                }
            });
        });
    }
    // ===============================
    // MÉTHODES DE SYNCHRONISATION
    // ===============================
    async getSyncQueue() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM sync_queue ORDER BY timestamp ASC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const operations = rows.map((row) => ({
                        id: row.id,
                        type: row.type,
                        operation: row.operation,
                        data: JSON.parse(row.data),
                        timestamp: row.timestamp,
                        retryCount: row.retryCount,
                        maxRetries: row.maxRetries
                    }));
                    resolve(operations);
                }
            });
        });
    }
    async addSyncOperation(operation) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT INTO sync_queue (id, type, operation, data, timestamp, retryCount, maxRetries)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                operation.id,
                operation.type,
                operation.operation,
                JSON.stringify(operation.data),
                operation.timestamp,
                operation.retryCount,
                operation.maxRetries
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }
    async updateSyncOperation(operation) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        UPDATE sync_queue 
        SET retryCount = ?, data = ?, lastError = ?
        WHERE id = ?
      `);
            stmt.run([
                operation.retryCount,
                JSON.stringify(operation.data),
                '', // lastError sera ajouté plus tard si nécessaire
                operation.id
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }
    async removeSyncOperation(operationId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM sync_queue WHERE id = ?', [operationId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    // Méthodes pour mettre à jour les IDs distants
    async updateDocumentRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE documents SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateAuthorRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE authors SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateCategoryRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE categories SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateBorrowerRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE borrowers SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateBorrowHistoryRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE borrow_history SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
exports.DatabaseService = DatabaseService;


/***/ }),

/***/ "./src/services/SettingsService.ts":
/*!*****************************************!*\
  !*** ./src/services/SettingsService.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsService = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
class SettingsService {
    constructor() {
        const userDataPath = electron_1.app.getPath('userData');
        this.settingsFilePath = path.join(userDataPath, 'settings.json');
        this.defaultSettings = this.createDefaultSettings();
        this.settings = { ...this.defaultSettings };
        this.loadSettings();
    }
    createDefaultSettings() {
        const userDataPath = electron_1.app.getPath('userData');
        return {
            institution: {
                name: 'Ma Bibliothèque',
                address: '',
                city: 'Douala',
                country: 'Cameroun',
                phone: '',
                email: '',
                website: '',
                logo: '',
                description: 'Système de gestion de bibliothèque moderne',
                type: 'library'
            },
            backup: {
                autoBackup: true,
                backupFrequency: 'weekly',
                lastBackup: '',
                backupLocation: path.join(userDataPath, 'backups'),
                keepBackups: 10,
                cloudSync: false,
                cloudProvider: 'none'
            },
            security: {
                requireAuth: true,
                sessionTimeout: 60, // 1 heure
                maxLoginAttempts: 5,
                lockoutDuration: 15, // 15 minutes
                passwordPolicy: {
                    minLength: 6,
                    requireNumbers: true,
                    requireSymbols: false,
                    requireUppercase: false,
                    requireLowercase: true
                },
                twoFactorAuth: false,
                auditLog: true
            },
            appearance: {
                theme: 'light',
                language: 'fr',
                fontSize: 'medium',
                compactMode: false,
                animations: true,
                colorScheme: 'default'
            },
            library: {
                defaultLoanPeriod: 14, // 2 semaines
                maxRenewals: 2,
                maxBooksPerUser: 5,
                lateFeesEnabled: false,
                lateFeeAmount: 0,
                gracePeriod: 3,
                reservationEnabled: true,
                reservationPeriod: 7,
                categoriesRequired: true,
                isbnRequired: false
            },
            notifications: {
                emailNotifications: false,
                overdueReminders: true,
                reminderDaysBefore: 3,
                returnConfirmation: true,
                newBookNotifications: false,
                systemNotifications: true
            },
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };
    }
    loadSettings() {
        try {
            if (fs.existsSync(this.settingsFilePath)) {
                const data = fs.readFileSync(this.settingsFilePath, 'utf8');
                const loadedSettings = JSON.parse(data);
                // Fusionner avec les paramètres par défaut pour s'assurer que toutes les propriétés existent
                this.settings = this.mergeSettings(this.defaultSettings, loadedSettings);
                // Validation et migration si nécessaire
                this.validateAndMigrateSettings();
            }
            else {
                // Créer le fichier de paramètres avec les valeurs par défaut
                this.saveSettings();
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
        }
    }
    mergeSettings(defaultSettings, loadedSettings) {
        const merged = { ...defaultSettings };
        for (const key in loadedSettings) {
            if (loadedSettings.hasOwnProperty(key)) {
                if (typeof loadedSettings[key] === 'object' && loadedSettings[key] !== null && !Array.isArray(loadedSettings[key])) {
                    merged[key] = this.mergeSettings(defaultSettings[key] || {}, loadedSettings[key]);
                }
                else {
                    merged[key] = loadedSettings[key];
                }
            }
        }
        return merged;
    }
    validateAndMigrateSettings() {
        let needsSave = false;
        // Validation des valeurs numériques
        if (this.settings.security.sessionTimeout < 5) {
            this.settings.security.sessionTimeout = 5;
            needsSave = true;
        }
        if (this.settings.security.passwordPolicy.minLength < 4) {
            this.settings.security.passwordPolicy.minLength = 4;
            needsSave = true;
        }
        if (this.settings.library.defaultLoanPeriod < 1) {
            this.settings.library.defaultLoanPeriod = 7;
            needsSave = true;
        }
        if (this.settings.backup.keepBackups < 1) {
            this.settings.backup.keepBackups = 5;
            needsSave = true;
        }
        // Validation des énumérations
        const validThemes = ['light', 'dark', 'auto'];
        if (!validThemes.includes(this.settings.appearance.theme)) {
            this.settings.appearance.theme = 'light';
            needsSave = true;
        }
        const validLanguages = ['fr', 'en', 'es'];
        if (!validLanguages.includes(this.settings.appearance.language)) {
            this.settings.appearance.language = 'fr';
            needsSave = true;
        }
        // Mettre à jour la version et la date si nécessaire
        if (this.settings.version !== this.defaultSettings.version) {
            this.settings.version = this.defaultSettings.version;
            this.settings.lastUpdated = new Date().toISOString();
            needsSave = true;
        }
        if (needsSave) {
            this.saveSettings();
        }
    }
    saveSettings() {
        try {
            this.settings.lastUpdated = new Date().toISOString();
            const data = JSON.stringify(this.settings, null, 2);
            fs.writeFileSync(this.settingsFilePath, data, 'utf8');
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
        }
    }
    // Méthodes publiques
    getSettings() {
        return { ...this.settings };
    }
    saveUserSettings(newSettings) {
        try {
            if (typeof newSettings !== 'object' || newSettings === null) {
                throw new Error('Invalid settings object');
            }
            this.settings = { ...newSettings };
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres utilisateur:', error);
            return false;
        }
    }
    // Méthodes spécifiques par section
    getInstitutionSettings() {
        return { ...this.settings.institution };
    }
    saveInstitutionSettings(institutionSettings) {
        try {
            this.settings.institution = { ...institutionSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'établissement:', error);
            return false;
        }
    }
    getBackupSettings() {
        return { ...this.settings.backup };
    }
    saveBackupSettings(backupSettings) {
        try {
            this.settings.backup = { ...backupSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sauvegarde:', error);
            return false;
        }
    }
    getSecuritySettings() {
        return { ...this.settings.security };
    }
    saveSecuritySettings(securitySettings) {
        try {
            this.settings.security = { ...securitySettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de sécurité:', error);
            return false;
        }
    }
    getAppearanceSettings() {
        return { ...this.settings.appearance };
    }
    saveAppearanceSettings(appearanceSettings) {
        try {
            this.settings.appearance = { ...appearanceSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres d\'apparence:', error);
            return false;
        }
    }
    getLibrarySettings() {
        return { ...this.settings.library };
    }
    saveLibrarySettings(librarySettings) {
        try {
            this.settings.library = { ...librarySettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de bibliothèque:', error);
            return false;
        }
    }
    getNotificationSettings() {
        return { ...this.settings.notifications };
    }
    saveNotificationSettings(notificationSettings) {
        try {
            this.settings.notifications = { ...notificationSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
            return false;
        }
    }
    // Méthodes utilitaires
    resetToDefaults() {
        try {
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la réinitialisation des paramètres:', error);
            return false;
        }
    }
    resetSectionToDefault(section) {
        try {
            if (section in this.defaultSettings) {
                this.settings[section] = { ...this.defaultSettings[section] };
                this.saveSettings();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`Erreur lors de la réinitialisation de la section ${section}:`, error);
            return false;
        }
    }
    exportSettings() {
        try {
            return JSON.stringify(this.settings, null, 2);
        }
        catch (error) {
            console.error('Erreur lors de l\'export des paramètres:', error);
            return '';
        }
    }
    importSettings(settingsJson) {
        try {
            const importedSettings = JSON.parse(settingsJson);
            this.settings = this.mergeSettings(this.defaultSettings, importedSettings);
            this.validateAndMigrateSettings();
            this.saveSettings();
            return true;
        }
        catch (error) {
            console.error('Erreur lors de l\'import des paramètres:', error);
            return false;
        }
    }
    validateSettings() {
        const errors = [];
        // Validation de l'établissement
        if (!this.settings.institution.name.trim()) {
            errors.push('Le nom de l\'établissement est requis');
        }
        // Validation de la sécurité
        if (this.settings.security.sessionTimeout < 5 || this.settings.security.sessionTimeout > 1440) {
            errors.push('Le délai d\'expiration de session doit être entre 5 et 1440 minutes');
        }
        if (this.settings.security.passwordPolicy.minLength < 4 || this.settings.security.passwordPolicy.minLength > 50) {
            errors.push('La longueur minimale du mot de passe doit être entre 4 et 50 caractères');
        }
        // Validation de la bibliothèque
        if (this.settings.library.defaultLoanPeriod < 1 || this.settings.library.defaultLoanPeriod > 365) {
            errors.push('La période d\'emprunt par défaut doit être entre 1 et 365 jours');
        }
        if (this.settings.library.maxBooksPerUser < 1 || this.settings.library.maxBooksPerUser > 100) {
            errors.push('Le nombre maximum de livres par utilisateur doit être entre 1 et 100');
        }
        // Validation des sauvegardes
        if (this.settings.backup.keepBackups < 1 || this.settings.backup.keepBackups > 100) {
            errors.push('Le nombre de sauvegardes à conserver doit être entre 1 et 100');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    getSettingsInfo() {
        try {
            const stats = fs.existsSync(this.settingsFilePath)
                ? fs.statSync(this.settingsFilePath)
                : null;
            return {
                filePath: this.settingsFilePath,
                fileSize: stats ? stats.size : 0,
                lastModified: stats ? stats.mtime.toISOString() : '',
                version: this.settings.version
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des informations de paramètres:', error);
            return {
                filePath: this.settingsFilePath,
                fileSize: 0,
                lastModified: '',
                version: this.settings.version
            };
        }
    }
    // Méthodes de compatibilité pour l'ancien système
    async setTheme(theme) {
        this.settings.appearance.theme = theme;
        this.saveSettings();
    }
    async getTheme() {
        return this.settings.appearance.theme;
    }
}
exports.SettingsService = SettingsService;


/***/ }),

/***/ "./src/services/SupabaseService.ts":
/*!*****************************************!*\
  !*** ./src/services/SupabaseService.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SupabaseService = void 0;
// src/services/SupabaseService.ts
const supabase_js_1 = __webpack_require__(/*! @supabase/supabase-js */ "@supabase/supabase-js");
// Service Supabase pour la gestion de la bibliothèque
class SupabaseService {
    constructor() {
        this.currentUser = null;
        this.currentInstitution = null;
        // Configuration Supabase avec les vraies clés
        const supabaseUrl = 'https://krojphsvzuwtgxxkjklj.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2pwaHN2enV3dGd4eGtqa2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzMwMTMsImV4cCI6MjA2ODA0OTAxM30.U8CvDXnn84ow2984GIiZqMcAE1-Pc6lGavTVqm_fLtQ';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.initializeAuth();
    }
    async initializeAuth() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session?.user) {
                await this.loadUserProfile(session.user.id);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        }
    }
    // Authentication
    async signUp(email, password, userData) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        role: userData.role || 'user'
                    }
                }
            });
            if (error)
                throw error;
            if (data.user) {
                // Si un code d'établissement est fourni, associer l'utilisateur
                if (userData.institutionCode) {
                    const institution = await this.getInstitutionByCode(userData.institutionCode);
                    if (!institution) {
                        throw new Error('Code d\'établissement invalide');
                    }
                }
                // Créer le profil utilisateur
                const userProfile = await this.createUserProfile(data.user.id, {
                    email: data.user.email,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    role: userData.role || 'user',
                    institution_id: userData.institutionCode ? (await this.getInstitutionByCode(userData.institutionCode))?.id : undefined,
                    is_active: true
                });
                return { success: true, user: userProfile };
            }
            return { success: false, error: 'Erreur lors de la création du compte' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error)
                throw error;
            if (data.user) {
                const userProfile = await this.loadUserProfile(data.user.id);
                if (userProfile && userProfile.institution_id) {
                    this.currentInstitution = await this.getInstitution(userProfile.institution_id);
                }
                return {
                    success: true,
                    user: userProfile,
                    institution: this.currentInstitution || undefined
                };
            }
            return { success: false, error: 'Erreur de connexion' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error)
                throw error;
            this.currentUser = null;
            this.currentInstitution = null;
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return false;
        }
    }
    // Institution Management
    async createInstitution(institutionData) {
        const code = this.generateInstitutionCode();
        const { data, error } = await this.supabase
            .from('institutions')
            .insert({
            ...institutionData,
            code,
            status: 'active',
            subscription_plan: 'basic',
            max_books: 1000,
            max_users: 10
        })
            .select()
            .single();
        if (error)
            throw error;
        // Associer l'utilisateur actuel comme admin de cette institution
        if (this.currentUser) {
            await this.supabase
                .from('users')
                .update({
                institution_id: data.id,
                role: 'admin'
            })
                .eq('id', this.currentUser.id);
        }
        return { institution: data, code };
    }
    generateInstitutionCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async getInstitutionByCode(code) {
        const { data, error } = await this.supabase
            .from('institutions')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('status', 'active')
            .single();
        if (error)
            return null;
        return data;
    }
    async getInstitution(id) {
        const { data, error } = await this.supabase
            .from('institutions')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    }
    // User Profile Management
    async createUserProfile(userId, profileData) {
        const { data, error } = await this.supabase
            .from('users')
            .insert({
            id: userId,
            ...profileData,
            is_active: true
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async loadUserProfile(userId) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error)
            return null;
        this.currentUser = data;
        return data;
    }
    // Books Management - Méthodes simplifiées pour le test
    async getBooks() {
        // Pour l'instant, retourner un tableau vide pour éviter les erreurs de table manquante
        console.log('getBooks appelé - retour de données de test');
        return [];
    }
    async addBook(book) {
        console.log('addBook appelé avec:', book);
        return 1; // ID fictif pour le test
    }
    async updateBook(book) {
        console.log('updateBook appelé avec:', book);
        return true;
    }
    async deleteBook(id) {
        console.log('deleteBook appelé avec ID:', id);
        return true;
    }
    async searchBooks(query) {
        console.log('searchBooks appelé avec query:', query);
        return [];
    }
    // Borrowers Management - Méthodes simplifiées
    async getBorrowers() {
        console.log('getBorrowers appelé');
        return [];
    }
    async addBorrower(borrower) {
        console.log('addBorrower appelé avec:', borrower);
        return 1;
    }
    async updateBorrower(borrower) {
        console.log('updateBorrower appelé avec:', borrower);
        return true;
    }
    async deleteBorrower(id) {
        console.log('deleteBorrower appelé avec ID:', id);
        return true;
    }
    async searchBorrowers(query) {
        console.log('searchBorrowers appelé avec query:', query);
        return [];
    }
    // Borrow Management - Méthodes simplifiées
    async borrowBook(bookId, borrowerId, expectedReturnDate) {
        console.log('borrowBook appelé avec:', { bookId, borrowerId, expectedReturnDate });
        return 1;
    }
    async returnBook(borrowHistoryId, notes) {
        console.log('returnBook appelé avec:', { borrowHistoryId, notes });
        return true;
    }
    async getBorrowedBooks() {
        console.log('getBorrowedBooks appelé');
        return [];
    }
    async getBorrowHistory(filter) {
        console.log('getBorrowHistory appelé avec filter:', filter);
        return [];
    }
    // Authors and Categories - Méthodes simplifiées
    async getAuthors() {
        console.log('getAuthors appelé');
        return [];
    }
    async addAuthor(author) {
        console.log('addAuthor appelé avec:', author);
        return 1;
    }
    async getCategories() {
        console.log('getCategories appelé');
        return [];
    }
    async addCategory(category) {
        console.log('addCategory appelé avec:', category);
        return 1;
    }
    // Statistics - Méthodes simplifiées
    async getStats() {
        console.log('getStats appelé');
        return {
            totalBooks: 0,
            borrowedBooks: 0,
            availableBooks: 0,
            totalAuthors: 0,
            totalCategories: 0,
            totalBorrowers: 0,
            totalStudents: 0,
            totalStaff: 0,
            overdueBooks: 0
        };
    }
    // Getters
    getCurrentUser() {
        return this.currentUser;
    }
    getCurrentInstitution() {
        return this.currentInstitution;
    }
    // Utility methods
    isAuthenticated() {
        return this.currentUser !== null;
    }
    async switchInstitution(institutionCode) {
        try {
            const institution = await this.getInstitutionByCode(institutionCode);
            if (!institution)
                return false;
            // Vérifier que l'utilisateur a accès à cette institution
            if (this.currentUser && this.currentUser.institution_id !== institution.id) {
                // Seuls les super_admin peuvent changer d'institution
                if (this.currentUser.role !== 'super_admin') {
                    return false;
                }
            }
            this.currentInstitution = institution;
            return true;
        }
        catch (error) {
            console.error('Erreur lors du changement d\'institution:', error);
            return false;
        }
    }
    async clearAllData() {
        console.log('clearAllData appelé');
        return true;
    }
    // Méthodes CRUD supplémentaires pour la compatibilité
    async createDocument(document) {
        console.log('createDocument appelé avec:', document);
        return null;
    }
    async updateDocument(document) {
        console.log('updateDocument appelé avec:', document);
        return true;
    }
    async deleteDocument(id) {
        console.log('deleteDocument appelé avec ID:', id);
        return true;
    }
    async createAuthor(author) {
        console.log('createAuthor appelé avec:', author);
        return null;
    }
    async updateAuthor(author) {
        console.log('updateAuthor appelé avec:', author);
        return true;
    }
    async deleteAuthor(id) {
        console.log('deleteAuthor appelé avec ID:', id);
        return true;
    }
    async createCategory(category) {
        console.log('createCategory appelé avec:', category);
        return null;
    }
    async updateCategory(category) {
        console.log('updateCategory appelé avec:', category);
        return true;
    }
    async deleteCategory(id) {
        console.log('deleteCategory appelé avec ID:', id);
        return true;
    }
    async createBorrower(borrower) {
        console.log('createBorrower appelé avec:', borrower);
        return null;
    }
    async createBorrowHistory(borrowHistory) {
        console.log('createBorrowHistory appelé avec:', borrowHistory);
        return null;
    }
    async updateBorrowHistory(borrowHistory) {
        console.log('updateBorrowHistory appelé avec:', borrowHistory);
        return true;
    }
    async deleteBorrowHistory(id) {
        console.log('deleteBorrowHistory appelé avec ID:', id);
        return true;
    }
}
exports.SupabaseService = SupabaseService;


/***/ }),

/***/ "./src/services/SyncService.ts":
/*!*************************************!*\
  !*** ./src/services/SyncService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncService = void 0;
const SupabaseService_1 = __webpack_require__(/*! ./SupabaseService */ "./src/services/SupabaseService.ts");
class SyncService {
    constructor(databaseService) {
        this.syncQueue = [];
        this.isInitialized = false;
        this.syncInterval = null;
        this.networkCheckInterval = null;
        this.retryTimeout = null;
        this.databaseService = databaseService;
        this.supabaseService = new SupabaseService_1.SupabaseService();
        this.syncStatus = {
            isOnline: false,
            lastSync: null,
            pendingOperations: 0,
            syncInProgress: false,
            errors: []
        };
        this.networkStatus = {
            isOnline: false,
            connectionType: 'none',
            lastChecked: new Date().toISOString()
        };
    }
    async initialize() {
        if (this.isInitialized)
            return;
        // Charger les opérations en attente depuis la base de données
        await this.loadPendingOperations();
        // Démarrer la surveillance réseau
        this.startNetworkMonitoring();
        // Démarrer la synchronisation automatique
        this.startAutoSync();
        this.isInitialized = true;
        console.log('SyncService initialisé');
    }
    async loadPendingOperations() {
        try {
            // Charger les opérations depuis une table sync_queue dans la base
            const operations = await this.databaseService.getSyncQueue();
            this.syncQueue = operations;
            this.syncStatus.pendingOperations = operations.length;
        }
        catch (error) {
            console.error('Erreur lors du chargement des opérations en attente:', error);
        }
    }
    startNetworkMonitoring() {
        // Vérifier la connectivité toutes les 30 secondes
        this.networkCheckInterval = setInterval(async () => {
            await this.checkNetworkStatus();
        }, 30000);
        // Vérification initiale
        this.checkNetworkStatus();
    }
    async checkNetworkStatus() {
        try {
            // Test de connectivité vers Supabase
            const isOnline = await this.testConnectivity();
            const wasOnline = this.networkStatus.isOnline;
            this.networkStatus = {
                isOnline,
                connectionType: isOnline ? 'wifi' : 'none', // Simplification
                lastChecked: new Date().toISOString()
            };
            this.syncStatus.isOnline = isOnline;
            // Si on vient de se reconnecter, démarrer la sync
            if (isOnline && !wasOnline && !this.syncStatus.syncInProgress) {
                console.log('Connexion rétablie - démarrage de la synchronisation');
                this.startSync();
            }
            if (isOnline && !wasOnline && this.syncQueue.length > 0) {
                console.log('Connexion rétablie, démarrage de la synchronisation...');
                await this.processSyncQueue();
            }
        }
        catch (error) {
            console.error('Erreur lors de la vérification réseau:', error);
            this.networkStatus.isOnline = false;
            this.syncStatus.isOnline = false;
        }
    }
    async testConnectivity() {
        try {
            // Test simple de ping vers Supabase
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch('https://google.com', {
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        }
        catch {
            return false;
        }
    }
    startAutoSync() {
        // Synchronisation automatique toutes les 5 minutes si en ligne
        this.syncInterval = setInterval(async () => {
            if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
                await this.processSyncQueue();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }
    async addOperation(operation) {
        const syncOp = {
            ...operation,
            id: this.generateOperationId(),
            timestamp: new Date().toISOString(),
            retryCount: 0
        };
        this.syncQueue.push(syncOp);
        this.syncStatus.pendingOperations = this.syncQueue.length;
        // Sauvegarder dans la base
        await this.databaseService.addSyncOperation(syncOp);
        // Si en ligne, essayer de synchroniser immédiatement
        if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
            await this.processSyncQueue();
        }
    }
    async processSyncQueue() {
        if (this.syncStatus.syncInProgress || !this.networkStatus.isOnline) {
            return;
        }
        this.syncStatus.syncInProgress = true;
        console.log(`Démarrage de la synchronisation: ${this.syncQueue.length} opérations en attente`);
        const processedOperations = [];
        const failedOperations = [];
        for (const operation of this.syncQueue) {
            try {
                const success = await this.processOperation(operation);
                if (success) {
                    processedOperations.push(operation.id);
                    // Supprimer de la base
                    await this.databaseService.removeSyncOperation(operation.id);
                }
                else {
                    operation.retryCount++;
                    if (operation.retryCount >= operation.maxRetries) {
                        // Ajouter à la liste des erreurs
                        this.addSyncError(operation, 'Nombre maximum de tentatives atteint');
                        processedOperations.push(operation.id);
                        await this.databaseService.removeSyncOperation(operation.id);
                    }
                    else {
                        failedOperations.push(operation);
                        await this.databaseService.updateSyncOperation(operation);
                    }
                }
            }
            catch (error) {
                console.error(`Erreur lors du traitement de l'opération ${operation.id}:`, error);
                operation.retryCount++;
                failedOperations.push(operation);
                this.addSyncError(operation, error instanceof Error ? error.message : String(error));
                await this.databaseService.updateSyncOperation(operation);
            }
        }
        // Mettre à jour la queue
        this.syncQueue = this.syncQueue.filter(op => !processedOperations.includes(op.id));
        this.syncStatus.pendingOperations = this.syncQueue.length;
        this.syncStatus.lastSync = new Date().toISOString();
        this.syncStatus.syncInProgress = false;
        console.log(`Synchronisation terminée. Réussies: ${processedOperations.length}, Échouées: ${failedOperations.length}`);
    }
    async processOperation(operation) {
        try {
            switch (operation.type) {
                case 'document':
                    return await this.syncDocument(operation);
                case 'author':
                    return await this.syncAuthor(operation);
                case 'category':
                    return await this.syncCategory(operation);
                case 'borrower':
                    return await this.syncBorrower(operation);
                case 'history':
                    return await this.syncBorrowHistory(operation);
                default:
                    console.error(`Type d'opération inconnu: ${operation.type}`);
                    return false;
            }
        }
        catch (error) {
            console.error(`Erreur lors de la synchronisation de ${operation.type}:`, error);
            return false;
        }
    }
    async syncDocument(operation) {
        const { operation: op, data } = operation;
        switch (op) {
            case 'create':
                const createdDoc = await this.supabaseService.createDocument(data);
                if (createdDoc) {
                    // Mettre à jour l'ID distant local
                    await this.databaseService.updateDocumentRemoteId(data.localId, createdDoc.id?.toString() || '');
                    return true;
                }
                return false;
            case 'update':
                return await this.supabaseService.updateDocument(data);
            case 'delete':
                return await this.supabaseService.deleteDocument(data.remoteId);
            default:
                return false;
        }
    }
    async syncAuthor(operation) {
        // Implémentation similaire pour les auteurs
        const { operation: op, data } = operation;
        switch (op) {
            case 'create':
                const createdAuthor = await this.supabaseService.createAuthor(data);
                if (createdAuthor) {
                    await this.databaseService.updateAuthorRemoteId(data.localId, createdAuthor.id?.toString() || '');
                    return true;
                }
                return false;
            case 'update':
                return await this.supabaseService.updateAuthor(data);
            case 'delete':
                return await this.supabaseService.deleteAuthor(data.remoteId);
            default:
                return false;
        }
    }
    async syncCategory(operation) {
        // Implémentation similaire pour les catégories
        const { operation: op, data } = operation;
        switch (op) {
            case 'create':
                const createdCategory = await this.supabaseService.createCategory(data);
                if (createdCategory) {
                    await this.databaseService.updateCategoryRemoteId(data.localId, createdCategory.id?.toString() || '');
                    return true;
                }
                return false;
            case 'update':
                return await this.supabaseService.updateCategory(data);
            case 'delete':
                return await this.supabaseService.deleteCategory(data.remoteId);
            default:
                return false;
        }
    }
    async syncBorrower(operation) {
        // Implémentation similaire pour les emprunteurs
        const { operation: op, data } = operation;
        switch (op) {
            case 'create':
                const createdBorrower = await this.supabaseService.createBorrower(data);
                if (createdBorrower) {
                    await this.databaseService.updateBorrowerRemoteId(data.localId, createdBorrower.id?.toString() || '');
                    return true;
                }
                return false;
            case 'update':
                return await this.supabaseService.updateBorrower(data);
            case 'delete':
                return await this.supabaseService.deleteBorrower(data.remoteId);
            default:
                return false;
        }
    }
    async syncBorrowHistory(operation) {
        // Implémentation similaire pour l'historique
        const { operation: op, data } = operation;
        switch (op) {
            case 'create':
                const createdHistory = await this.supabaseService.createBorrowHistory(data);
                if (createdHistory) {
                    await this.databaseService.updateBorrowHistoryRemoteId(data.localId, createdHistory.id?.toString() || '');
                    return true;
                }
                return false;
            case 'update':
                return await this.supabaseService.updateBorrowHistory(data);
            case 'delete':
                return await this.supabaseService.deleteBorrowHistory(data.remoteId);
            default:
                return false;
        }
    }
    addSyncError(operation, errorMessage) {
        const error = {
            id: this.generateOperationId(),
            type: operation.type,
            operation: operation.operation,
            entityId: operation.data.localId || operation.data.id,
            error: errorMessage,
            timestamp: new Date().toISOString(),
            retryCount: operation.retryCount
        };
        this.syncStatus.errors.push(error);
        // Limiter le nombre d'erreurs stockées
        if (this.syncStatus.errors.length > 100) {
            this.syncStatus.errors = this.syncStatus.errors.slice(-100);
        }
    }
    async getStatus() {
        await this.loadPendingOperations();
        return {
            ...this.syncStatus,
            pendingOperations: this.syncQueue.length
        };
    }
    async startSync() {
        if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
            await this.processSyncQueue();
        }
    }
    async clearErrors() {
        this.syncStatus.errors = [];
        // Optionnel: supprimer aussi de la base de données si nécessaire
    }
    async retryOperation(operationId) {
        const operation = this.syncQueue.find(op => op.id === operationId);
        if (operation) {
            operation.retryCount = 0; // Reset les tentatives
            if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
                await this.processSyncQueue();
            }
        }
    }
    generateOperationId() {
        return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    // Méthodes publiques pour l'API
    getSyncStatus() {
        return { ...this.syncStatus };
    }
    getNetworkStatus() {
        return { ...this.networkStatus };
    }
    async startManualSync() {
        if (this.networkStatus.isOnline) {
            await this.processSyncQueue();
        }
        else {
            throw new Error('Aucune connexion réseau disponible');
        }
    }
    pauseSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    resumeSync() {
        if (!this.syncInterval) {
            this.startAutoSync();
        }
    }
    async retrySyncOperation(operationId) {
        const operation = this.syncQueue.find(op => op.id === operationId);
        if (!operation)
            return false;
        operation.retryCount = 0; // Reset retry count
        if (this.networkStatus.isOnline) {
            const success = await this.processOperation(operation);
            if (success) {
                this.syncQueue = this.syncQueue.filter(op => op.id !== operationId);
                this.syncStatus.pendingOperations = this.syncQueue.length;
                await this.databaseService.removeSyncOperation(operationId);
            }
            return success;
        }
        return false;
    }
    getSyncErrors() {
        return [...this.syncStatus.errors];
    }
    clearSyncErrors() {
        this.syncStatus.errors = [];
    }
    async resolveConflict(resolution) {
        try {
            // Implémentation de la résolution de conflits
            // Cette méthode sera appelée quand l'utilisateur choisit comment résoudre un conflit
            switch (resolution.resolution) {
                case 'use_local':
                    // Utiliser la version locale et forcer la sync
                    return await this.forceUpdateRemote(resolution);
                case 'use_remote':
                    // Utiliser la version distante et mettre à jour local
                    return await this.forceUpdateLocal(resolution);
                case 'merge':
                    // Fusionner les données (logique spécifique selon le type)
                    return await this.mergeVersions(resolution);
                case 'manual':
                    // L'utilisateur a fourni une version résolue manuellement
                    return await this.applyManualResolution(resolution);
                default:
                    return false;
            }
        }
        catch (error) {
            console.error('Erreur lors de la résolution de conflit:', error);
            return false;
        }
    }
    async forceUpdateRemote(resolution) {
        // Implémenter la mise à jour forcée du distant
        return true;
    }
    async forceUpdateLocal(resolution) {
        // Implémenter la mise à jour forcée du local
        return true;
    }
    async mergeVersions(resolution) {
        // Implémenter la fusion automatique
        return true;
    }
    async applyManualResolution(resolution) {
        // Appliquer la résolution manuelle fournie par l'utilisateur
        return true;
    }
    async shutdown() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        if (this.networkCheckInterval) {
            clearInterval(this.networkCheckInterval);
        }
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
        console.log('SyncService arrêté');
    }
}
exports.SyncService = SyncService;


/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "archiver":
/*!***************************!*\
  !*** external "archiver" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("archiver");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "extract-zip":
/*!******************************!*\
  !*** external "extract-zip" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("extract-zip");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("sqlite3");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map