"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DatabaseService_1 = require("./services/DatabaseService");
const BackupService_1 = require("./services/BackupService");
const AuthService_1 = require("./services/AuthService");
const SettingsService_1 = require("./services/SettingsService");
let mainWindow;
let dbService;
let backupService;
let authService;
let settingsService;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        titleBarStyle: 'hiddenInset',
        frame: false,
        show: false,
        icon: path.join(__dirname, '../assets/icon.png'), // Ajout d'une icône
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:8080');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    // Gestion de la fermeture de l'application
    mainWindow.on('close', async (event) => {
        if (backupService && settingsService) {
            const settings = await settingsService.getSettings();
            if (settings?.backup.autoBackup) {
                // Créer une sauvegarde automatique à la fermeture
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
    dbService = new DatabaseService_1.DatabaseService();
    await dbService.initialize();
    backupService = new BackupService_1.BackupService(dbService);
    authService = new AuthService_1.AuthService();
    settingsService = new SettingsService_1.SettingsService();
    createWindow();
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
    return await dbService.getBooks();
});
electron_1.ipcMain.handle('db:addBook', async (_, book) => {
    return await dbService.addBook(book);
});
electron_1.ipcMain.handle('db:updateBook', async (_, book) => {
    return await dbService.updateBook(book);
});
electron_1.ipcMain.handle('db:deleteBook', async (_, id) => {
    return await dbService.deleteBook(id);
});
electron_1.ipcMain.handle('db:searchBooks', async (_, query) => {
    return await dbService.searchBooks(query);
});
// Database Operations - Authors
electron_1.ipcMain.handle('db:getAuthors', async () => {
    return await dbService.getAuthors();
});
electron_1.ipcMain.handle('db:addAuthor', async (_, author) => {
    return await dbService.addAuthor(author);
});
// Database Operations - Categories
electron_1.ipcMain.handle('db:getCategories', async () => {
    return await dbService.getCategories();
});
electron_1.ipcMain.handle('db:addCategory', async (_, category) => {
    return await dbService.addCategory(category);
});
// Database Operations - Borrowers
electron_1.ipcMain.handle('db:getBorrowers', async () => {
    return await dbService.getBorrowers();
});
electron_1.ipcMain.handle('db:addBorrower', async (_, borrower) => {
    return await dbService.addBorrower(borrower);
});
electron_1.ipcMain.handle('db:updateBorrower', async (_, borrower) => {
    return await dbService.updateBorrower(borrower);
});
electron_1.ipcMain.handle('db:deleteBorrower', async (_, id) => {
    return await dbService.deleteBorrower(id);
});
electron_1.ipcMain.handle('db:searchBorrowers', async (_, query) => {
    return await dbService.searchBorrowers(query);
});
// Database Operations - Borrow Management
electron_1.ipcMain.handle('db:getBorrowedBooks', async () => {
    return await dbService.getBorrowedBooks();
});
electron_1.ipcMain.handle('db:borrowBook', async (_, bookId, borrowerId, expectedReturnDate) => {
    return await dbService.borrowBook(bookId, borrowerId, expectedReturnDate);
});
electron_1.ipcMain.handle('db:returnBook', async (_, borrowHistoryId, notes) => {
    return await dbService.returnBook(borrowHistoryId, notes);
});
electron_1.ipcMain.handle('db:getBorrowHistory', async (_, filter) => {
    return await dbService.getBorrowHistory(filter);
});
electron_1.ipcMain.handle('db:getStats', async () => {
    return await dbService.getStats();
});
// Nouvelles opérations de base de données
electron_1.ipcMain.handle('db:clearAll', async () => {
    return await dbService.clearDatabase();
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
    return await settingsService.getSettings();
});
electron_1.ipcMain.handle('settings:save', async (_, settings) => {
    return await settingsService.saveSettings(settings);
});
// Backup Operations
electron_1.ipcMain.handle('backup:create', async () => {
    return await backupService.createBackup();
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
    return authService.isAuthenticated();
});
electron_1.ipcMain.handle('auth:login', async (_, credentials) => {
    return await authService.login(credentials);
});
electron_1.ipcMain.handle('auth:logout', async () => {
    return authService.logout();
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
// Print Operations
electron_1.ipcMain.handle('print:inventory', async (_, data) => {
    return await createPrintWindow(data, 'inventory');
});
electron_1.ipcMain.handle('print:available-books', async (_, data) => {
    return await createPrintWindow(data, 'available');
});
electron_1.ipcMain.handle('print:borrowed-books', async (_, data) => {
    return await createPrintWindow(data, 'borrowed');
});
electron_1.ipcMain.handle('print:borrow-history', async (_, data) => {
    return await createPrintWindow(data, 'history');
});
electron_1.ipcMain.handle('export:csv', async (_, data) => {
    return await exportToCSV(data);
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
    await settingsService.setTheme(theme);
});
electron_1.ipcMain.handle('theme:get', async () => {
    return await settingsService.getTheme();
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
async function createPrintWindow(data, type) {
    return new Promise((resolve) => {
        const printWindow = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        });
        const htmlContent = generatePrintHTML(data, type);
        printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: false,
                printBackground: true,
                margins: {
                    marginType: 'default'
                }
            }, (success, failureReason) => {
                printWindow.close();
                if (!success) {
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
            csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
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
            csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        }
        fs.writeFileSync(result.filePath, '\ufeff' + csvContent, 'utf8');
        return result.filePath;
    }
    catch (error) {
        console.error('Export CSV failed:', error);
        return null;
    }
}
