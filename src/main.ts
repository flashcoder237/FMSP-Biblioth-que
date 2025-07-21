// src/main.ts - Configuration corrigée pour SQLite3
import { app, BrowserWindow, ipcMain, dialog, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseService } from './services/DatabaseService';
import { BackupService } from './services/BackupService';
import { AuthService } from './services/AuthService';
import { ApplicationSettings, SettingsService } from './services/SettingsService';
import { AuthCredentials } from './preload';

let mainWindow: BrowserWindow;
let dbService: DatabaseService;
let backupService: BackupService;
let authService: AuthService;
let settingsService: SettingsService;

function createWindow(): void {
  mainWindow = new BrowserWindow({
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

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
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
        try {
          await backupService.createBackup();
        } catch (error) {
          console.error('Erreur lors de la sauvegarde automatique:', error);
        }
      }
    }
  });
}

app.whenReady().then(async () => {
  // Initialiser les services
  try {
    dbService = new DatabaseService();
    await dbService.initialize();
    
    backupService = new BackupService(dbService);
    authService = new AuthService();
    settingsService = new SettingsService();
    
    console.log('Services initialisés avec succès');
    
    createWindow();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des services:', error);
    // Créer la fenêtre même en cas d'erreur pour afficher l'erreur
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Window Controls
ipcMain.handle('window-controls:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window-controls:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window-controls:close', () => {
  mainWindow.close();
});

// Database Operations - Books
ipcMain.handle('db:getBooks', async () => {
  try {
    return await dbService.getBooks();
  } catch (error) {
    console.error('Erreur getBooks:', error);
    return [];
  }
});

ipcMain.handle('db:addBook', async (_, book) => {
  try {
    return await dbService.addDocument(book);
  } catch (error) {
    console.error('Erreur addBook:', error);
    throw error;
  }
});

ipcMain.handle('db:updateBook', async (_, book) => {
  try {
    return await dbService.updateDocument(book);
  } catch (error) {
    console.error('Erreur updateBook:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteBook', async (_, id) => {
  try {
    return await dbService.deleteDocument(id);
  } catch (error) {
    console.error('Erreur deleteBook:', error);
    throw error;
  }
});

ipcMain.handle('db:searchBooks', async (_, query) => {
  try {
    return await dbService.searchBooks(query);
  } catch (error) {
    console.error('Erreur searchBooks:', error);
    return [];
  }
});

// Database Operations - Authors
ipcMain.handle('db:getAuthors', async () => {
  try {
    return await dbService.getAuthors();
  } catch (error) {
    console.error('Erreur getAuthors:', error);
    return [];
  }
});

ipcMain.handle('db:addAuthor', async (_, author) => {
  try {
    return await dbService.addAuthor(author);
  } catch (error) {
    console.error('Erreur addAuthor:', error);
    throw error;
  }
});

// Database Operations - Categories
ipcMain.handle('db:getCategories', async () => {
  try {
    return await dbService.getCategories();
  } catch (error) {
    console.error('Erreur getCategories:', error);
    return [];
  }
});

ipcMain.handle('db:addCategory', async (_, category) => {
  try {
    return await dbService.addCategory(category);
  } catch (error) {
    console.error('Erreur addCategory:', error);
    throw error;
  }
});

// Database Operations - Borrowers
ipcMain.handle('db:getBorrowers', async () => {
  try {
    return await dbService.getBorrowers();
  } catch (error) {
    console.error('Erreur getBorrowers:', error);
    return [];
  }
});

ipcMain.handle('db:addBorrower', async (_, borrower) => {
  try {
    return await dbService.addBorrower(borrower);
  } catch (error) {
    console.error('Erreur addBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:updateBorrower', async (_, borrower) => {
  try {
    return await dbService.updateBorrower(borrower);
  } catch (error) {
    console.error('Erreur updateBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteBorrower', async (_, id) => {
  try {
    return await dbService.deleteBorrower(id);
  } catch (error) {
    console.error('Erreur deleteBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:searchBorrowers', async (_, query) => {
  try {
    return await dbService.searchBorrowers(query);
  } catch (error) {
    console.error('Erreur searchBorrowers:', error);
    return [];
  }
});

// Database Operations - Borrow Management
ipcMain.handle('db:getBorrowedBooks', async () => {
  try {
    return await dbService.getBorrowedBooks();
  } catch (error) {
    console.error('Erreur getBorrowedBooks:', error);
    return [];
  }
});

ipcMain.handle('db:borrowBook', async (_, bookId, borrowerId, expectedReturnDate) => {
  try {
    return await dbService.borrowBook(bookId, borrowerId, expectedReturnDate);
  } catch (error) {
    console.error('Erreur borrowBook:', error);
    throw error;
  }
});

ipcMain.handle('db:returnBook', async (_, borrowHistoryId, notes) => {
  try {
    return await dbService.returnBook(borrowHistoryId, notes);
  } catch (error) {
    console.error('Erreur returnBook:', error);
    throw error;
  }
});

ipcMain.handle('db:getBorrowHistory', async (_, filter) => {
  try {
    return await dbService.getBorrowHistory(filter);
  } catch (error) {
    console.error('Erreur getBorrowHistory:', error);
    return [];
  }
});

ipcMain.handle('db:getStats', async () => {
  try {
    return await dbService.getStats();
  } catch (error) {
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
ipcMain.handle('db:clearAll', async () => {
  try {
    return await dbService.clearDatabase();
  } catch (error) {
    console.error('Erreur clearAll:', error);
    throw error;
  }
});

ipcMain.handle('db:export', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Exporter la base de données',
    defaultPath: `bibliotheque_backup_${new Date().toISOString().split('T')[0]}.db`,
    filters: [
      { name: 'Base de données', extensions: ['db'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ]
  });

  if (!result.filePath) return null;

  try {
    await backupService.exportDatabase(result.filePath);
    return result.filePath;
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return null;
  }
});

ipcMain.handle('db:import', async (_, filePath) => {
  try {
    await backupService.importDatabase(filePath);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return false;
  }
});

// Settings Operations
ipcMain.handle('settings:get', async () => {
  try {
    return await settingsService.getSettings();
  } catch (error) {
    console.error('Erreur settings:get:', error);
    return null;
  }
});

ipcMain.handle('settings:save', async (_, settings: ApplicationSettings) => {
  try {
    return settingsService.saveUserSettings(settings);
  } catch (error) {
    console.error('Erreur settings:save:', error);
    return false;
  }
});

// Backup Operations
ipcMain.handle('backup:create', async () => {
  try {
    return await backupService.createBackup();
  } catch (error) {
    console.error('Erreur backup:create:', error);
    throw error;
  }
});

ipcMain.handle('backup:restore', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Sélectionner une sauvegarde',
    filters: [
      { name: 'Sauvegardes', extensions: ['bak', 'backup'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths[0]) return false;

  try {
    await backupService.restoreBackup(result.filePaths[0]);
    return true;
  } catch (error) {
    console.error('Erreur lors de la restauration:', error);
    return false;
  }
});

// Authentication Operations
ipcMain.handle('auth:status', async () => {
  try {
    return authService.isAuthenticated();
  } catch (error) {
    console.error('Erreur auth:status:', error);
    return false;
  }
});

ipcMain.handle('auth:login', async (_, credentials: AuthCredentials) => {
  try {
    return await authService.login(credentials);
  } catch (error) {
    console.error('Erreur auth:login:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
});

ipcMain.handle('auth:logout', async () => {
  try {
    return authService.logout();
  } catch (error) {
    console.error('Erreur auth:logout:', error);
    return false;
  }
});

// File Operations
ipcMain.handle('file:select', async (_, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
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

ipcMain.handle('file:selectDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  return result.canceled ? null : result.filePaths[0];
});

// Notification Operations
ipcMain.handle('notification:show', async (_, title: string, body: string) => {
  if (Notification.isSupported()) {
    new Notification({
      title,
      body,
      icon: path.join(__dirname, '../assets/icon.png')
    }).show();
  }
});

// System Operations
ipcMain.handle('system:info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node
  };
});

ipcMain.handle('system:checkUpdates', async () => {
  // Placeholder pour la vérification des mises à jour
  return {
    hasUpdate: false,
    currentVersion: app.getVersion(),
    latestVersion: app.getVersion()
  };
});

// Theme Operations
ipcMain.handle('theme:set', async (_, theme: 'light' | 'dark' | 'auto') => {
  try {
    await settingsService.setTheme(theme);
  } catch (error) {
    console.error('Erreur theme:set:', error);
  }
});

ipcMain.handle('theme:get', async () => {
  try {
    return await settingsService.getTheme();
  } catch (error) {
    console.error('Erreur theme:get:', error);
    return 'light';
  }
});

// Statistics Operations
ipcMain.handle('stats:advanced', async () => {
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
      const returned = new Date(h.actualReturnDate!);
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
  const categoryCounts = books.reduce((acc: { [key: string]: number }, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

async function getTopBorrowers() {
  const history = await dbService.getBorrowHistory();
  const borrowerCounts = history.reduce((acc: { [key: string]: number }, h) => {
    const key = `${h.borrower?.firstName} ${h.borrower?.lastName}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(borrowerCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([borrower, count]) => ({ borrower, count }));
}

async function createPrintWindow(data: any, type: string): Promise<boolean> {
  return new Promise((resolve) => {
    const printWindow = new BrowserWindow({
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

function generatePrintHTML(data: any, type: string): string {
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

function generateInventoryContent(data: any): string {
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
        ${books.map((book: any) => `
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

function generateAvailableBooksContent(data: any): string {
  const { books, stats } = data;
  const availableBooks = books.filter((book: any) => !book.isBorrowed);
  
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
        ${availableBooks.map((book: any) => `
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

function generateBorrowedBooksContent(data: any): string {
  const { history } = data;
  
  return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${history.length}</div>
        <div class="stat-label">Livres Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h: any) => h.status === 'overdue').length}</div>
        <div class="stat-label">En Retard</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h: any) => h.borrower?.type === 'student').length}</div>
        <div class="stat-label">Étudiants</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${history.filter((h: any) => h.borrower?.type === 'staff').length}</div>
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
        ${history.map((item: any) => {
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

function generateHistoryContent(data: any): string {
  const { history, filters, stats } = data;
  
  const filterInfo = [];
  if (filters.startDate) filterInfo.push(`Du ${new Date(filters.startDate).toLocaleDateString('fr-FR')}`);
  if (filters.endDate) filterInfo.push(`Au ${new Date(filters.endDate).toLocaleDateString('fr-FR')}`);
  if (filters.borrowerType && filters.borrowerType !== 'all') {
    filterInfo.push(`Type: ${filters.borrowerType === 'student' ? 'Étudiants' : 'Personnel'}`);
  }
  if (filters.status && filters.status !== 'all') {
    const statusLabels = {
      active: 'En cours',
      returned: 'Rendus',
      overdue: 'En retard'
    };
    filterInfo.push(`Statut: ${statusLabels[filters.status as keyof typeof statusLabels]}`);
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
        ${history.map((item: any) => {
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
    
    ${history.some((item: any) => item.notes) ? `
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
          ${history.filter((item: any) => item.notes).map((item: any) => `
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

async function exportToCSV(data: any): Promise<string | null> {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter en CSV',
      defaultPath: `bibliotheque_export_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.filePath) return null;

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

      const csvRows = data.history.map((item: any) => {
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

      csvContent = [csvHeaders.join(','), ...csvRows.map((row: any) => row.join(','))].join('\n');
    } else {
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

      const csvRows = books.map((book: any) => [
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

      csvContent = [csvHeaders.join(','), ...csvRows.map((row: any) => row.join(','))].join('\n');
    }
    
    fs.writeFileSync(result.filePath, '\ufeff' + csvContent, 'utf8');
    
    return result.filePath;
  } catch (error) {
    console.error('Export CSV failed:', error);
    return null;
  }
}