// src/main.ts - Configuration corrigée pour SQLite3
import { app, BrowserWindow, ipcMain, dialog, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { DatabaseService } from './services/DatabaseService';
import { BackupService } from './services/BackupService';
import { AuthService } from './services/AuthService';
import { ApplicationSettings, SettingsService } from './services/SettingsService';
import { SyncService } from './services/SyncService';
import { configService } from './services/ConfigService';
import { logger } from './services/LoggerService';
import { validationService } from './services/ValidationService';
import { AuthCredentials, createBookFromDocument } from './preload';
import { RunResult } from 'sqlite3';

let mainWindow: BrowserWindow;
let dbService: DatabaseService;
let backupService: BackupService;
let authService: AuthService;
let settingsService: SettingsService;
let syncService: SyncService;

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
        } catch (error) {
          console.error('Erreur lors de la sauvegarde automatique:', error);
        }
      }
    }
  });
}

// Fonction pour enregistrer les handlers backup après l'initialisation des services
function registerBackupHandlers(): void {
  // ====================================================
  // Backup Management - IPC Handlers
  // ====================================================

  // Créer une sauvegarde
  ipcMain.handle('backup:create', async (_, name?: string, description?: string) => {
    try {
      const backupPath = await backupService.createBackup();
      logger.info('Backup créé avec succès', 'BACKUP', { path: backupPath });
      return { success: true, path: backupPath };
    } catch (error) {
      logger.error('Erreur lors de la création du backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Obtenir la liste des sauvegardes
  ipcMain.handle('backup:getList', async () => {
    try {
      const backups = await backupService.getBackupList();
      return { success: true, backups };
    } catch (error) {
      logger.error('Erreur lors de la récupération des backups', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message, backups: [] };
    }
  });

  // Restaurer une sauvegarde
  ipcMain.handle('backup:restore', async (_, backupFilePath: string) => {
    try {
      const success = await backupService.restoreBackup(backupFilePath);
      if (success) {
        logger.info('Backup restauré avec succès', 'BACKUP', { path: backupFilePath });
        
        // Redémarrer les services après restauration
        await dbService.initialize();
        
        return { success: true };
      } else {
        return { success: false, error: 'Échec de la restauration' };
      }
    } catch (error) {
      logger.error('Erreur lors de la restauration du backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Supprimer une sauvegarde
  ipcMain.handle('backup:delete', async (_, backupFilePath: string) => {
    try {
      const success = await backupService.deleteBackup(backupFilePath);
      if (success) {
        logger.info('Backup supprimé avec succès', 'BACKUP', { path: backupFilePath });
        return { success: true };
      } else {
        return { success: false, error: 'Échec de la suppression' };
      }
    } catch (error) {
      logger.error('Erreur lors de la suppression du backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Valider une sauvegarde
  ipcMain.handle('backup:validate', async (_, backupFilePath: string) => {
    try {
      const isValid = await backupService.validateBackup(backupFilePath);
      return { success: true, isValid };
    } catch (error) {
      logger.error('Erreur lors de la validation du backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message, isValid: false };
    }
  });

  // Nettoyer les anciennes sauvegardes
  ipcMain.handle('backup:cleanOld', async (_, keepCount: number = 10) => {
    try {
      const deletedCount = await backupService.cleanOldBackups(keepCount);
      logger.info(`${deletedCount} anciens backups supprimés`, 'BACKUP', { keepCount });
      return { success: true, deletedCount };
    } catch (error) {
      logger.error('Erreur lors du nettoyage des backups', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message, deletedCount: 0 };
    }
  });

  // Obtenir les statistiques des sauvegardes
  ipcMain.handle('backup:getStats', async () => {
    try {
      const totalSize = backupService.getBackupDirectorySize();
      const backups = await backupService.getBackupList();
      
      return {
        success: true,
        stats: {
          totalBackups: backups.length,
          totalSize,
          formattedSize: backupService.formatFileSize(totalSize),
          oldestBackup: backups.length > 0 ? backups[backups.length - 1] : null,
          newestBackup: backups.length > 0 ? backups[0] : null
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des stats backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Export de base de données seule
  ipcMain.handle('backup:exportDatabase', async () => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Exporter la base de données',
        defaultPath: `bibliotheque_db_${new Date().toISOString().split('T')[0]}.db`,
        filters: [
          { name: 'Database Files', extensions: ['db', 'sqlite'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.filePath) return { success: false, error: 'Export annulé' };

      await backupService.exportDatabase(result.filePath);
      logger.info('Base de données exportée', 'BACKUP', { path: result.filePath });
      
      return { success: true, path: result.filePath };
    } catch (error) {
      logger.error('Erreur lors de l\'export de la base de données', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Import de base de données
  ipcMain.handle('backup:importDatabase', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Importer une base de données',
        filters: [
          { name: 'Database Files', extensions: ['db', 'sqlite'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.filePaths || result.filePaths.length === 0) {
        return { success: false, error: 'Import annulé' };
      }

      await backupService.importDatabase(result.filePaths[0]);
      
      // Redémarrer les services après import
      await dbService.initialize();
      
      logger.info('Base de données importée', 'BACKUP', { path: result.filePaths[0] });
      
      return { success: true, path: result.filePaths[0] };
    } catch (error) {
      logger.error('Erreur lors de l\'import de la base de données', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Sélectionner un fichier de sauvegarde pour restauration
  ipcMain.handle('backup:selectFile', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Sélectionner une sauvegarde à restaurer',
        filters: [
          { name: 'Backup Files', extensions: ['bak'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.filePaths || result.filePaths.length === 0) {
        return { success: false, error: 'Sélection annulée' };
      }

      return { success: true, filePath: result.filePaths[0] };
    } catch (error) {
      logger.error('Erreur lors de la sélection du fichier backup', 'BACKUP', error as Error);
      return { success: false, error: (error as Error).message };
    }
  });

  logger.info('Handlers IPC backup enregistrés', 'BACKUP');
}

app.whenReady().then(async () => {
  // Initialiser les services de base d'abord
  try {
    // 1. Initialiser la configuration en premier
    await configService.initialize();
    logger.info('Configuration initialisée', 'Main');
    
    // 2. Initialiser les services principaux
    dbService = new DatabaseService();
    await dbService.initialize();
    logger.info('Base de données initialisée', 'Main');
    
    backupService = new BackupService(dbService);
    authService = new AuthService();
    settingsService = new SettingsService();
    syncService = new SyncService(dbService);
    
    // 3. Initialiser le service de synchronisation
    await syncService.initialize();
    logger.info('Service de synchronisation initialisé', 'Main');
    
    logger.info('Tous les services initialisés avec succès', 'Main');
    
    // Enregistrer les handlers IPC après l'initialisation des services
    registerBackupHandlers();
    
    createWindow();
    
  } catch (error) {
    logger.error('Erreur critique lors de l\'initialisation des services', 'Main', error as Error);
    
    // Essayer de créer la fenêtre même en cas d'erreur pour afficher le problème
    try {
      createWindow();
    } catch (windowError) {
      logger.error('Impossible de créer la fenêtre', 'Main', windowError as Error);
      app.quit();
    }
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

// Database Operations - Documents (API principale)
ipcMain.handle('db:getDocuments', async (_, institutionCode?: string) => {
  try {
    return await dbService.getDocuments(institutionCode);
  } catch (error) {
    console.error('Erreur getDocuments:', error);
    return [];
  }
});

ipcMain.handle('db:addDocument', async (_, document, institutionCode?: string) => {
  try {
    // Valider les données avant l'ajout
    const validation = validationService.validateDocument(document);
    if (!validation.isValid) {
      logger.warn('Tentative d\'ajout de document avec données invalides', 'IPC', {
        errors: validation.errors,
        warnings: validation.warnings
      });
      throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
    }

    // Logger les avertissements s'il y en a
    if (validation.warnings && validation.warnings.length > 0) {
      logger.warn('Avertissements lors de l\'ajout de document', 'IPC', {
        warnings: validation.warnings
      });
    }

    const result = await dbService.addDocument(document, institutionCode);
    logger.info('Document ajouté avec succès', 'IPC', { id: result, institution: institutionCode });
    return result;
  } catch (error) {
    logger.error('Erreur lors de l\'ajout de document', 'IPC', error as Error);
    throw error;
  }
});

ipcMain.handle('db:updateDocument', async (_, document, institutionCode?: string) => {
  try {
    // Valider les données avant la mise à jour
    const validation = validationService.validateDocument(document);
    if (!validation.isValid) {
      logger.warn('Tentative de mise à jour avec données invalides', 'IPC', {
        id: document.id,
        errors: validation.errors
      });
      throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
    }

    const result = await dbService.updateDocument(document, institutionCode);
    logger.info('Document mis à jour avec succès', 'IPC', { id: document.id, institution: institutionCode });
    return result;
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de document', 'IPC', error as Error);
    throw error;
  }
});

ipcMain.handle('db:deleteDocument', async (_, id, institutionCode?: string) => {
  try {
    return await dbService.deleteDocument(id, institutionCode);
  } catch (error) {
    console.error('Erreur deleteDocument:', error);
    throw error;
  }
});

ipcMain.handle('db:searchDocuments', async (_, query, institutionCode?: string) => {
  try {
    return await dbService.searchDocuments(query, institutionCode);
  } catch (error) {
    console.error('Erreur searchDocuments:', error);
    return [];
  }
});

// Database Operations - Books (Compatibilité legacy)
ipcMain.handle('db:getBooks', async (_, institutionCode?: string) => {
  try {
    return await dbService.getBooks(institutionCode);
  } catch (error) {
    console.error('Erreur getBooks:', error);
    return [];
  }
});

ipcMain.handle('db:addBook', async (_, book, institutionCode?: string) => {
  try {
    return await dbService.addDocument(book, institutionCode);
  } catch (error) {
    console.error('Erreur addBook:', error);
    throw error;
  }
});

ipcMain.handle('db:updateBook', async (_, book, institutionCode?: string) => {
  try {
    return await dbService.updateDocument(book, institutionCode);
  } catch (error) {
    console.error('Erreur updateBook:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteBook', async (_, id, institutionCode?: string) => {
  try {
    return await dbService.deleteDocument(id, institutionCode);
  } catch (error) {
    console.error('Erreur deleteBook:', error);
    throw error;
  }
});

ipcMain.handle('db:searchBooks', async (_, query, institutionCode?: string) => {
  try {
    return await dbService.searchDocuments(query, institutionCode).then(docs => docs.map(createBookFromDocument));
  } catch (error) {
    console.error('Erreur searchBooks:', error);
    return [];
  }
});

// Database Operations - Authors
ipcMain.handle('db:getAuthors', async (_, institutionCode?: string) => {
  try {
    return await dbService.getAuthors(institutionCode);
  } catch (error) {
    console.error('Erreur getAuthors:', error);
    return [];
  }
});

ipcMain.handle('db:addAuthor', async (_, author, institutionCode?: string) => {
  try {
    return await dbService.addAuthor(author, institutionCode);
  } catch (error) {
    console.error('Erreur addAuthor:', error);
    throw error;
  }
});

// Database Operations - Categories
ipcMain.handle('db:getCategories', async (_, institutionCode?: string) => {
  try {
    return await dbService.getCategories(institutionCode);
  } catch (error) {
    console.error('Erreur getCategories:', error);
    return [];
  }
});

ipcMain.handle('db:addCategory', async (_, category, institutionCode?: string) => {
  try {
    return await dbService.addCategory(category, institutionCode);
  } catch (error) {
    console.error('Erreur addCategory:', error);
    throw error;
  }
});

// Database Operations - Borrowers
ipcMain.handle('db:getBorrowers', async (_, institutionCode?: string) => {
  try {
    return await dbService.getBorrowers(institutionCode);
  } catch (error) {
    console.error('Erreur getBorrowers:', error);
    return [];
  }
});

ipcMain.handle('db:addBorrower', async (_, borrower, institutionCode?: string) => {
  try {
    return await dbService.addBorrower(borrower, institutionCode);
  } catch (error) {
    console.error('Erreur addBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:updateBorrower', async (_, borrower, institutionCode?: string) => {
  try {
    return await dbService.updateBorrower(borrower, institutionCode);
  } catch (error) {
    console.error('Erreur updateBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteBorrower', async (_, id, institutionCode?: string) => {
  try {
    return await dbService.deleteBorrower(id, institutionCode);
  } catch (error) {
    console.error('Erreur deleteBorrower:', error);
    throw error;
  }
});

ipcMain.handle('db:searchBorrowers', async (_, query, institutionCode?: string) => {
  try {
    return await dbService.searchBorrowers(query, institutionCode);
  } catch (error) {
    console.error('Erreur searchBorrowers:', error);
    return [];
  }
});

// Database Operations - Borrow Management
ipcMain.handle('db:getBorrowedDocuments', async (_, institutionCode?: string) => {
  try {
    return await dbService.getBorrowedDocuments(institutionCode);
  } catch (error) {
    console.error('Erreur getBorrowedDocuments:', error);
    return [];
  }
});

// Compatibility handler
ipcMain.handle('db:getBorrowedBooks', async (_, institutionCode?: string) => {
  try {
    return await dbService.getBorrowedDocuments(institutionCode);
  } catch (error) {
    console.error('Erreur getBorrowedBooks:', error);
    return [];
  }
});

ipcMain.handle('db:borrowDocument', async (_, documentId, borrowerId, expectedReturnDate, institutionCode?: string) => {
  try {
    return await dbService.borrowDocument(documentId, borrowerId, expectedReturnDate, institutionCode);
  } catch (error) {
    console.error('Erreur borrowDocument:', error);
    throw error;
  }
});

// Compatibility handler
ipcMain.handle('db:borrowBook', async (_, documentId, borrowerId, expectedReturnDate, institutionCode?: string) => {
  try {
    return await dbService.borrowDocument(documentId, borrowerId, expectedReturnDate, institutionCode);
  } catch (error) {
    console.error('Erreur borrowBook:', error);
    throw error;
  }
});

ipcMain.handle('db:returnBook', async (_, borrowHistoryId, notes, institutionCode?: string) => {
  try {
    return await dbService.returnBook(borrowHistoryId, notes, institutionCode);
  } catch (error) {
    console.error('Erreur returnBook:', error);
    throw error;
  }
});

ipcMain.handle('db:getBorrowHistory', async (_, filter, institutionCode?: string) => {
  try {
    return await dbService.getBorrowHistory(filter, institutionCode);
  } catch (error) {
    console.error('Erreur getBorrowHistory:', error);
    return [];
  }
});

ipcMain.handle('db:getStats', async (_, institutionCode?: string) => {
  try {
    return await dbService.getStats(institutionCode);
  } catch (error) {
    console.error('Erreur getStats:', error);
    return {
      totalDocuments: 0,
      borrowedDocuments: 0,
      availableDocuments: 0,
      totalAuthors: 0,
      totalCategories: 0,
      totalBorrowers: 0,
      totalStudents: 0,
      totalStaff: 0,
      overdueDocuments: 0
    };
  }
});

// Recent Activity handler
ipcMain.handle('db:getRecentActivity', async (_, limit: number = 10, institutionCode?: string) => {
  try {
    return await dbService.getRecentActivity(limit, institutionCode);
  } catch (error) {
    console.error('Erreur getRecentActivity:', error);
    return [];
  }
});

// Handlers pour la gestion des données orphelines
ipcMain.handle('db:getOrphanDataCount', async () => {
  try {
    return await dbService.getOrphanDataCount();
  } catch (error) {
    console.error('Erreur getOrphanDataCount:', error);
    return {
      documents: 0,
      authors: 0,
      categories: 0,
      borrowers: 0,
      borrowHistory: 0
    };
  }
});

ipcMain.handle('db:assignOrphanDataToInstitution', async (_, institutionCode: string) => {
  try {
    return await dbService.assignOrphanDataToInstitution(institutionCode);
  } catch (error) {
    console.error('Erreur assignOrphanDataToInstitution:', error);
    return {
      documents: 0,
      authors: 0,
      categories: 0,
      borrowers: 0,
      borrowHistory: 0
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

// Configuration Operations
ipcMain.handle('config:getSupabaseConfig', async () => {
  try {
    if (!configService.hasSupabaseConfig()) {
      logger.warn('Configuration Supabase demandée mais non disponible', 'IPC');
      return null;
    }

    const config = configService.get('supabase');
    logger.debug('Configuration Supabase fournie au renderer', 'IPC');
    
    return {
      url: config.url,
      key: config.key
    };
  } catch (error) {
    logger.error('Erreur lors de la récupération de la configuration Supabase', 'IPC', error as Error);
    return null;
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

// Synchronization Operations
ipcMain.handle('sync:getStatus', async () => {
  try {
    return syncService ? await syncService.getStatus() : {
      isOnline: false,
      lastSync: null,
      pendingOperations: 0,
      syncInProgress: false,
      errors: []
    };
  } catch (error) {
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

ipcMain.handle('sync:trigger', async () => {
  try {
    if (syncService) {
      await syncService.startSync();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur sync:trigger:', error);
    return false;
  }
});

ipcMain.handle('sync:clearErrors', async () => {
  try {
    if (syncService) {
      await syncService.clearErrors();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur sync:clearErrors:', error);
    return false;
  }
});

ipcMain.handle('sync:retry', async (_, operationId: string) => {
  try {
    if (syncService) {
      await syncService.retryOperation(operationId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur sync:retry:', error);
    return false;
  }
});

// Print Operations
ipcMain.handle('print:inventory', async (_, data) => {
  try {
    return await createPrintWindow(data, 'inventory');
  } catch (error) {
    console.error('Erreur print:inventory:', error);
    return false;
  }
});

ipcMain.handle('print:available-books', async (_, data) => {
  try {
    return await createPrintWindow(data, 'available');
  } catch (error) {
    console.error('Erreur print:available-books:', error);
    return false;
  }
});

ipcMain.handle('print:borrowed-books', async (_, data) => {
  try {
    return await createPrintWindow(data, 'borrowed');
  } catch (error) {
    console.error('Erreur print:borrowed-books:', error);
    return false;
  }
});

// Print borrow history handler
ipcMain.handle('print:borrow-history', async (_, data) => {
  try {
    return await createPrintWindow(data, 'history');
  } catch (error) {
    console.error('Erreur print:borrow-history:', error);
    return false;
  }
});

// Advanced export handler with Excel support
ipcMain.handle('export:advanced', async (_, config, institutionCode) => {
  try {
    const fileExtension = config.format === 'excel' ? 'xlsx' : 'csv';
    const fileName = `bibliotheque_export_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    
    const result = await dialog.showSaveDialog(mainWindow, {
      title: config.format === 'excel' ? 'Exporter en Excel' : 'Exporter en CSV',
      defaultPath: fileName,
      filters: config.format === 'excel' 
        ? [
            { name: 'Fichiers Excel', extensions: ['xlsx'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
          ]
        : [
            { name: 'Fichiers CSV', extensions: ['csv'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
          ]
    });

    if (result.canceled || !result.filePath) {
      return { success: false, cancelled: true };
    }

    // Fetch data based on configuration
    console.log('🔍 DEBUG EXPORT - Using institutionCode:', institutionCode);
    const exportData = await gatherExportData(config, institutionCode);
    
    // Validate that we have some data to export
    const hasData = Object.values(exportData).some(data => 
      Array.isArray(data) && data.length > 0
    );
    
    if (!hasData) {
      return { success: false, error: 'Aucune donnée à exporter avec les filtres sélectionnés' };
    }
    
    let finalPath = result.filePath;
    
    if (config.format === 'excel') {
      finalPath = await generateExcel(exportData, result.filePath, config);
    } else {
      const csvContent = generateAdvancedCSV(exportData, config);
      // Add UTF-8 BOM for proper Excel encoding
      const csvWithBOM = '\ufeff' + csvContent;
      fs.writeFileSync(result.filePath, csvWithBOM, 'utf8');
    }
    
    return { success: true, path: finalPath };

  } catch (error) {
    console.error('Erreur export:advanced:', error);
    return { success: false, error: (error as Error).message };
  }
});

// Legacy CSV export for backward compatibility
ipcMain.handle('export:csv', async (_, data) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter en CSV',
      defaultPath: `bibliotheque_export_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [
        { name: 'Fichiers CSV', extensions: ['csv'] },
        { name: 'Tous les fichiers', extensions: ['*'] }
      ]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }

    const csvContent = generateCSV(data);
    // Add UTF-8 BOM for proper Excel encoding
    const csvWithBOM = '\ufeff' + csvContent;
    fs.writeFileSync(result.filePath, csvWithBOM, 'utf8');
    return result.filePath;

  } catch (error) {
    console.error('Erreur export:csv:', error);
    return null;
  }
});

// Advanced export data gathering function
async function gatherExportData(config: any, institutionCode?: string): Promise<any> {
  const exportData: any = {};

  try {
    // Gather documents data
    if (config.dataTypes.documents) {
      console.log('🔍 DEBUG EXPORT - Getting documents with institutionCode:', institutionCode);
      const documents = await dbService.getDocuments(institutionCode);
      
      // Apply document status filter
      let filteredDocuments = documents;
      if (config.filters.documentStatus !== 'all') {
        filteredDocuments = documents.filter((doc: any) => {
          if (config.filters.documentStatus === 'borrowed') return doc.estEmprunte;
          if (config.filters.documentStatus === 'available') return !doc.estEmprunte;
          return true;
        });
      }
      
      exportData.documents = filteredDocuments;
    }

    // Gather borrowers data
    if (config.dataTypes.borrowers) {
      console.log('🔍 DEBUG EXPORT - Getting borrowers with institutionCode:', institutionCode);
      const borrowers = await dbService.getBorrowers(institutionCode);
      
      // Apply borrower type filter
      let filteredBorrowers = borrowers;
      if (config.filters.borrowerType !== 'all') {
        filteredBorrowers = borrowers.filter((borrower: any) => 
          borrower.type === config.filters.borrowerType
        );
      }
      
      exportData.borrowers = filteredBorrowers;
    }

    // Gather borrow history data
    if (config.dataTypes.borrowHistory) {
      console.log('🔍 DEBUG EXPORT - Getting borrow history with institutionCode:', institutionCode);
      const borrowHistory = await dbService.getBorrowHistory(undefined, institutionCode);
      
      // Apply history status filter
      let filteredHistory = borrowHistory;
      if (config.filters.historyStatus !== 'all') {
        filteredHistory = borrowHistory.filter((history: any) => 
          history.status === config.filters.historyStatus
        );
      }

      // Apply date range filter
      if (config.dateRange.enabled) {
        const startDate = new Date(config.dateRange.startDate);
        const endDate = new Date(config.dateRange.endDate);
        filteredHistory = filteredHistory.filter((history: any) => {
          const borrowDate = new Date(history.borrowDate);
          return borrowDate >= startDate && borrowDate <= endDate;
        });
      }
      
      exportData.borrowHistory = filteredHistory;
    }

    // Gather authors data
    if (config.dataTypes.authors) {
      console.log('🔍 DEBUG EXPORT - Getting authors with institutionCode:', institutionCode);
      const authors = await dbService.getAuthors(institutionCode);
      exportData.authors = authors;
    }

    // Gather categories data
    if (config.dataTypes.categories) {
      console.log('🔍 DEBUG EXPORT - Getting categories with institutionCode:', institutionCode);
      const categories = await dbService.getCategories(institutionCode);
      exportData.categories = categories;
    }

    // Generate statistics
    if (config.dataTypes.stats) {
      const stats = {
        totalDocuments: exportData.documents?.length || 0,
        totalBorrowers: exportData.borrowers?.length || 0,
        totalBorrowHistory: exportData.borrowHistory?.length || 0,
        totalAuthors: exportData.authors?.length || 0,
        totalCategories: exportData.categories?.length || 0,
        exportDate: new Date().toISOString(),
        exportConfig: {
          format: config.format,
          dataTypes: Object.keys(config.dataTypes).filter(key => config.dataTypes[key]),
          filters: config.filters
        }
      };
      exportData.stats = [stats];
    }

    return exportData;
  } catch (error) {
    console.error('Error gathering export data:', error);
    throw error;
  }
}

// Excel generation function
async function generateExcel(exportData: any, filePath: string, config: any): Promise<string> {
  try {
    const workbook = XLSX.utils.book_new();

    // Add documents sheet
    if (config.dataTypes.documents && exportData.documents && exportData.documents.length > 0) {
      const documentsData = exportData.documents.map((doc: any) => {
      const row: any = {};
      const fieldLabels = {
        titre: 'Titre',
        auteur: 'Auteur',
        editeur: 'Éditeur',
        lieuEdition: 'Lieu d\'édition',
        annee: 'Année',
        descripteurs: 'Catégories',
        cote: 'Cote',
        type: 'Type',
        isbn: 'ISBN',
        description: 'Description',
        estEmprunte: 'Statut d\'emprunt',
        dateEmprunt: 'Date d\'emprunt',
        nomEmprunteur: 'Emprunteur',
        dateRetourPrevu: 'Date retour prévue'
      };

      Object.entries(config.documentFields).forEach(([field, enabled]) => {
        if (enabled) {
          const label = fieldLabels[field as keyof typeof fieldLabels] || field;
          if (field === 'estEmprunte') {
            row[label] = doc[field] ? 'Emprunté' : 'Disponible';
          } else if (field === 'dateEmprunt' || field === 'dateRetourPrevu') {
            row[label] = doc[field] ? new Date(doc[field]).toLocaleDateString('fr-FR') : '';
          } else {
            row[label] = doc[field] || '';
          }
        }
      });

      return row;
    });

    const documentsSheet = XLSX.utils.json_to_sheet(documentsData);
    XLSX.utils.book_append_sheet(workbook, documentsSheet, 'Documents');
  }

    // Add borrowers sheet
    if (config.dataTypes.borrowers && exportData.borrowers && exportData.borrowers.length > 0) {
    const borrowersData = exportData.borrowers.map((borrower: any) => {
      const row: any = {};
      const fieldLabels = {
        firstName: 'Prénom',
        lastName: 'Nom',
        type: 'Type',
        matricule: 'Matricule',
        classe: 'Classe',
        position: 'Poste',
        email: 'Email',
        phone: 'Téléphone',
        cniNumber: 'CNI'
      };

      Object.entries(config.borrowerFields).forEach(([field, enabled]) => {
        if (enabled) {
          const label = fieldLabels[field as keyof typeof fieldLabels] || field;
          row[label] = borrower[field] || '';
        }
      });

      return row;
    });

    const borrowersSheet = XLSX.utils.json_to_sheet(borrowersData);
    XLSX.utils.book_append_sheet(workbook, borrowersSheet, 'Emprunteurs');
  }

    // Add borrow history sheet
    if (config.dataTypes.borrowHistory && exportData.borrowHistory && exportData.borrowHistory.length > 0) {
    const historyData = exportData.borrowHistory.map((history: any) => {
      const row: any = {};
      const fieldLabels = {
        documentTitle: 'Titre du document',
        borrowerName: 'Nom emprunteur',
        borrowDate: 'Date emprunt',
        expectedReturnDate: 'Date retour prévue',
        actualReturnDate: 'Date retour effective',
        status: 'Statut',
        notes: 'Notes',
        duration: 'Durée (jours)',
        overdueDays: 'Retard (jours)'
      };

      Object.entries(config.historyFields).forEach(([field, enabled]) => {
        if (enabled) {
          const label = fieldLabels[field as keyof typeof fieldLabels] || field;
          if (field === 'borrowDate' || field === 'expectedReturnDate' || field === 'actualReturnDate') {
            row[label] = history[field] ? new Date(history[field]).toLocaleDateString('fr-FR') : '';
          } else if (field === 'duration') {
            if (history.borrowDate && history.actualReturnDate) {
              const borrowDate = new Date(history.borrowDate);
              const returnDate = new Date(history.actualReturnDate);
              const diffTime = Math.abs(returnDate.getTime() - borrowDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              row[label] = diffDays;
            } else {
              row[label] = '';
            }
          } else if (field === 'overdueDays') {
            if (history.status === 'overdue' && history.expectedReturnDate) {
              const expectedDate = new Date(history.expectedReturnDate);
              const currentDate = history.actualReturnDate ? new Date(history.actualReturnDate) : new Date();
              const diffTime = currentDate.getTime() - expectedDate.getTime();
              const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              row[label] = diffDays;
            } else {
              row[label] = '';
            }
          } else {
            row[label] = history[field] || '';
          }
        }
      });

      return row;
    });

    const historySheet = XLSX.utils.json_to_sheet(historyData);
    XLSX.utils.book_append_sheet(workbook, historySheet, 'Historique');
  }

    // Add authors sheet
    if (config.dataTypes.authors && exportData.authors && exportData.authors.length > 0) {
      const authorsSheet = XLSX.utils.json_to_sheet(exportData.authors);
      XLSX.utils.book_append_sheet(workbook, authorsSheet, 'Auteurs');
    }

    // Add categories sheet  
    if (config.dataTypes.categories && exportData.categories && exportData.categories.length > 0) {
      const categoriesSheet = XLSX.utils.json_to_sheet(exportData.categories);
      XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Catégories');
    }

    // Add statistics sheet
    if (config.dataTypes.stats && exportData.stats && exportData.stats.length > 0) {
      const statsSheet = XLSX.utils.json_to_sheet(exportData.stats);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistiques');
    }

    // Ensure we have at least one sheet
    if (workbook.SheetNames.length === 0) {
      // Create a default sheet with basic info
      const defaultData = [{ Message: 'Aucune donnée à exporter avec les paramètres sélectionnés' }];
      const defaultSheet = XLSX.utils.json_to_sheet(defaultData);
      XLSX.utils.book_append_sheet(workbook, defaultSheet, 'Info');
    }

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Check if file already exists and is locked
    if (fs.existsSync(filePath)) {
      try {
        // Try to access the file to check if it's locked
        fs.accessSync(filePath, fs.constants.W_OK);
      } catch (error) {
        throw new Error(`Le fichier ${path.basename(filePath)} est peut-être ouvert dans Excel. Fermez-le et réessayez.`);
      }
    }

    // Write the file with error handling using buffer approach
    let finalFilePath = filePath;
    try {
      // Generate buffer with proper UTF-8 encoding for Excel
      const buffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      // Write buffer to file using Node.js fs
      fs.writeFileSync(filePath, buffer);
      
    } catch (writeError) {
      console.error('XLSX write error:', writeError);
      
      // Try alternative approaches
      try {
        // Approach 1: Try without compression
        console.log('Tentative sans compression...');
        const buffer = XLSX.write(workbook, { 
          type: 'buffer', 
          bookType: 'xlsx',
          compression: false
        });
        fs.writeFileSync(filePath, buffer);
        
      } catch (altError1) {
        console.error('Alternative 1 failed:', altError1);
        
        try {
          // Approach 2: Try with different filename (timestamp)
          const timestamp = new Date().getTime();
          const altFilePath = filePath.replace('.xlsx', `_${timestamp}.xlsx`);
          console.log('Tentative avec nom alternatif:', altFilePath);
          
          const buffer = XLSX.write(workbook, { 
            type: 'buffer', 
            bookType: 'xlsx',
            compression: false
          });
          fs.writeFileSync(altFilePath, buffer);
          finalFilePath = altFilePath;
          
        } catch (altError2) {
          console.error('Alternative 2 failed:', altError2);
          
          try {
            // Approach 3: Try saving as CSV instead with UTF-8 BOM
            console.log('Tentative en CSV...');
            const csvFilePath = filePath.replace('.xlsx', '.csv');
            const csvContent = generateFallbackCSV(exportData, config);
            // Add UTF-8 BOM for proper Excel encoding
            const csvWithBOM = '\ufeff' + csvContent;
            fs.writeFileSync(csvFilePath, csvWithBOM, 'utf8');
            finalFilePath = csvFilePath;
            
          } catch (altError3) {
            console.error('CSV fallback failed:', altError3);
            throw new Error(`Toutes les tentatives d'export ont échoué. Vérifiez:\n1. Que le fichier n'est pas ouvert dans Excel\n2. Les permissions du dossier Downloads\n3. L'espace disque disponible\n\nErreur initiale: ${(writeError as Error).message}`);
          }
        }
      }
    }
    
    // Update the return path in the calling function
    if (finalFilePath !== filePath) {
      console.log('Fichier sauvegardé sous:', finalFilePath);
    }

    // Return the final file path
    return finalFilePath;
    
  } catch (error) {
    console.error('Excel generation error:', error);
    throw error;
  }
}

// Fallback CSV generation for when Excel fails
function generateFallbackCSV(exportData: any, config: any): string {
  let csvContent = '';
  
  // Add documents section
  if (config.dataTypes.documents && exportData.documents && exportData.documents.length > 0) {
    csvContent += '=== DOCUMENTS ===\n';
    
    const fieldLabels = {
      titre: 'Titre',
      auteur: 'Auteur',
      editeur: 'Éditeur',
      lieuEdition: 'Lieu d\'édition',
      annee: 'Année',
      descripteurs: 'Catégories',
      cote: 'Cote',
      type: 'Type',
      isbn: 'ISBN',
      description: 'Description',
      estEmprunte: 'Statut d\'emprunt',
      dateEmprunt: 'Date d\'emprunt',
      nomEmprunteur: 'Emprunteur',
      dateRetourPrevu: 'Date retour prévue'
    };

    const headers = Object.entries(config.documentFields)
      .filter(([_, enabled]) => enabled)
      .map(([field, _]) => fieldLabels[field as keyof typeof fieldLabels] || field);

    const rows = exportData.documents.map((doc: any) => {
      return Object.entries(config.documentFields)
        .filter(([_, enabled]) => enabled)
        .map(([field, _]) => {
          if (field === 'estEmprunte') {
            return doc[field] ? 'Emprunté' : 'Disponible';
          } else if (field === 'dateEmprunt' || field === 'dateRetourPrevu') {
            return doc[field] ? new Date(doc[field]).toLocaleDateString('fr-FR') : '';
          } else {
            return doc[field] || '';
          }
        });
    });

    csvContent += [headers, ...rows]
      .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }
  
  // Add borrowers section
  if (config.dataTypes.borrowers && exportData.borrowers && exportData.borrowers.length > 0) {
    csvContent += '=== EMPRUNTEURS ===\n';
    
    const fieldLabels = {
      firstName: 'Prénom',
      lastName: 'Nom',
      type: 'Type',
      matricule: 'Matricule',
      classe: 'Classe',
      position: 'Poste',
      email: 'Email',
      phone: 'Téléphone',
      cniNumber: 'CNI'
    };

    const headers = Object.entries(config.borrowerFields)
      .filter(([_, enabled]) => enabled)
      .map(([field, _]) => fieldLabels[field as keyof typeof fieldLabels] || field);

    const rows = exportData.borrowers.map((borrower: any) => {
      return Object.entries(config.borrowerFields)
        .filter(([_, enabled]) => enabled)
        .map(([field, _]) => borrower[field] || '');
    });

    csvContent += [headers, ...rows]
      .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }
  
  // Add history section
  if (config.dataTypes.borrowHistory && exportData.borrowHistory && exportData.borrowHistory.length > 0) {
    csvContent += '=== HISTORIQUE ===\n';
    
    const fieldLabels = {
      documentTitle: 'Titre du document',
      borrowerName: 'Nom emprunteur',
      borrowDate: 'Date emprunt',
      expectedReturnDate: 'Date retour prévue',
      actualReturnDate: 'Date retour effective',
      status: 'Statut',
      notes: 'Notes',
      duration: 'Durée (jours)',
      overdueDays: 'Retard (jours)'
    };

    const headers = Object.entries(config.historyFields)
      .filter(([_, enabled]) => enabled)
      .map(([field, _]) => fieldLabels[field as keyof typeof fieldLabels] || field);

    const rows = exportData.borrowHistory.map((history: any) => {
      return Object.entries(config.historyFields)
        .filter(([_, enabled]) => enabled)
        .map(([field, _]) => {
          if (field === 'borrowDate' || field === 'expectedReturnDate' || field === 'actualReturnDate') {
            return history[field] ? new Date(history[field]).toLocaleDateString('fr-FR') : '';
          } else {
            return history[field] || '';
          }
        });
    });

    csvContent += [headers, ...rows]
      .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  return csvContent || 'Aucune donnée à exporter';
}

// Advanced CSV generation function
function generateAdvancedCSV(exportData: any, config: any): string {
  let csvContent = '';

  // Add documents section
  if (config.dataTypes.documents && exportData.documents) {
    csvContent += 'DOCUMENTS\n';
    
    const fieldLabels = {
      titre: 'Titre',
      auteur: 'Auteur',
      editeur: 'Éditeur',
      lieuEdition: 'Lieu d\'édition',
      annee: 'Année',
      descripteurs: 'Catégories',
      cote: 'Cote',
      type: 'Type',
      isbn: 'ISBN',
      description: 'Description',
      estEmprunte: 'Statut d\'emprunt',
      dateEmprunt: 'Date d\'emprunt',
      nomEmprunteur: 'Emprunteur',
      dateRetourPrevu: 'Date retour prévue'
    };

    const headers = Object.entries(config.documentFields)
      .filter(([_, enabled]) => enabled)
      .map(([field, _]) => fieldLabels[field as keyof typeof fieldLabels] || field);

    const rows = exportData.documents.map((doc: any) => {
      return Object.entries(config.documentFields)
        .filter(([_, enabled]) => enabled)
        .map(([field, _]) => {
          if (field === 'estEmprunte') {
            return doc[field] ? 'Emprunté' : 'Disponible';
          } else if (field === 'dateEmprunt' || field === 'dateRetourPrevu') {
            return doc[field] ? new Date(doc[field]).toLocaleDateString('fr-FR') : '';
          } else {
            return doc[field] || '';
          }
        });
    });

    csvContent += [headers, ...rows]
      .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    csvContent += '\n\n';
  }

  // Add other data types similarly...
  // (Implementation would continue for borrowers, history, etc.)

  return csvContent;
}

// Legacy CSV function for backward compatibility
function generateCSV(data: any): string {
  if (!data.documents || !Array.isArray(data.documents)) {
    return '';
  }

  const headers = ['Titre', 'Auteur', 'Éditeur', 'Année', 'Catégorie', 'Cote', 'Statut', 'Emprunteur', 'Date d\'emprunt'];
  const rows = data.documents.map((doc: any) => [
    doc.titre || '',
    doc.auteur || '',
    doc.editeur || '',
    doc.annee || '',
    doc.descripteurs || '',
    doc.cote || '',
    doc.estEmprunte ? 'Emprunté' : 'Disponible',
    doc.nomEmprunteur || '',
    doc.dateEmprunt ? new Date(doc.dateEmprunt).toLocaleDateString('fr-FR') : ''
  ]);

  return [headers, ...rows]
    .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
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

function generatePrintHTML(data: any, type: string): string {
  const now = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const institution = data.institution || {};
  
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
          margin: 15mm; 
          size: A4 landscape; 
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0; 
          padding: 0; 
          color: #2E2E2E; 
          line-height: 1.3;
          font-size: 11px;
        }
        .header {
          border-bottom: 3px solid #3E5C49;
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .institution-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #E5DCC2;
        }
        .institution-logo {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #E5DCC2;
        }
        .institution-info h2 {
          color: #3E5C49;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 5px 0;
        }
        .institution-address {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0 0 3px 0;
        }
        .institution-contact {
          font-size: 11px;
          color: #6E6E6E;
          margin: 0;
        }
        .report-title {
          margin-top: 15px;
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
          padding: 12px; 
          margin-bottom: 20px;
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); 
          gap: 12px;
        }
        .stat-item { 
          text-align: center; 
        }
        .stat-value {
          font-size: 18px; 
          font-weight: 700;
          color: #3E5C49; 
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 9px; 
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
        ${institution.name || institution.logo ? `
        <div class="institution-header">
          ${institution.logo ? `<img src="${institution.logo}" alt="Logo" class="institution-logo" />` : ''}
          <div class="institution-info">
            <h2>${institution.name || 'Bibliothèque Numérique'}</h2>
            ${institution.address ? `<div class="institution-address">${institution.address}${institution.city ? ', ' + institution.city : ''}</div>` : ''}
            ${institution.phone || institution.email ? `
            <div class="institution-contact">
              ${institution.phone ? 'Tél: ' + institution.phone : ''}
              ${institution.phone && institution.email ? ' • ' : ''}
              ${institution.email ? institution.email : ''}
            </div>` : ''}
          </div>
        </div>` : ''}
        <div class="report-title">
          <h1>${title}</h1>
          <div class="subtitle">${institution.description || 'Système de Gestion de Bibliothèque'}</div>
          <div class="date">Généré le ${now}</div>
        </div>
      </div>
      ${content}
    </body>
    </html>
    `;
}

function generateInventoryContent(data: any): string {
  const { documents, stats } = data;
  
  return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${documents?.length || 0}</div>
        <div class="stat-label">Total Documents</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${documents?.filter((d: any) => !d.estEmprunte).length || 0}</div>
        <div class="stat-label">Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${documents?.filter((d: any) => d.estEmprunte).length || 0}</div>
        <div class="stat-label">Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${[...new Set(documents?.map((d: any) => d.auteur).filter(Boolean))].length || 0}</div>
        <div class="stat-label">Auteurs</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 22%;">Titre</th>
          <th style="width: 15%;">Auteur</th>
          <th style="width: 12%;">Éditeur</th>
          <th style="width: 6%;">Année</th>
          <th style="width: 8%;">Cote</th>
          <th style="width: 10%;">Descripteurs</th>
          <th style="width: 8%;">Lieu Édition</th>
          <th style="width: 8%;">Statut</th>
          <th style="width: 11%;">Emprunteur/Date</th>
        </tr>
      </thead>
      <tbody>
        ${documents?.map((doc: any) => `
          <tr>
            <td><strong>${doc.titre || '-'}</strong></td>
            <td>${doc.auteur || '-'}</td>
            <td>${doc.editeur || '-'}</td>
            <td>${doc.annee || '-'}</td>
            <td>${doc.cote || '-'}</td>
            <td>${doc.descripteurs || '-'}</td>
            <td>${doc.lieuEdition || '-'}</td>
            <td>
              <span class="${doc.estEmprunte ? 'status-borrowed' : 'status-available'}">
                ${doc.estEmprunte ? 'Emprunté' : 'Disponible'}
              </span>
            </td>
            <td>
              ${doc.nomEmprunteur ? `${doc.nomEmprunteur}<br/>` : '-'}
              ${doc.dateEmprunt ? new Date(doc.dateEmprunt).toLocaleDateString('fr-FR') : ''}
            </td>
          </tr>
        `).join('') || '<tr><td colspan="9">Aucun document trouvé</td></tr>'}
      </tbody>
    </table>
  `;
}

function generateAvailableBooksContent(data: any): string {
  const { documents } = data;
  const availableDocuments = documents?.filter((doc: any) => !doc.estEmprunte) || [];
  
  return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${availableDocuments.length}</div>
        <div class="stat-label">Documents Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${documents?.length || 0}</div>
        <div class="stat-label">Total Documents</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${((availableDocuments.length / (documents?.length || 1)) * 100).toFixed(1)}%</div>
        <div class="stat-label">Taux Disponibilité</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 25%;">Titre</th>
          <th style="width: 18%;">Auteur</th>
          <th style="width: 15%;">Éditeur</th>
          <th style="width: 10%;">Cote</th>
          <th style="width: 8%;">Année</th>
          <th style="width: 12%;">Descripteurs</th>
          <th style="width: 12%;">Lieu Édition</th>
        </tr>
      </thead>
      <tbody>
        ${availableDocuments.map((doc: any) => `
          <tr>
            <td><strong>${doc.titre || '-'}</strong></td>
            <td>${doc.auteur || '-'}</td>
            <td>${doc.editeur || '-'}</td>
            <td>${doc.cote || '-'}</td>
            <td>${doc.annee || '-'}</td>
            <td>${doc.descripteurs || '-'}</td>
            <td>${doc.lieuEdition || '-'}</td>
          </tr>
        `).join('') || '<tr><td colspan="7">Aucun document disponible</td></tr>'}
      </tbody>
    </table>
  `;
}

function generateBorrowedBooksContent(data: any): string {
  const { documents } = data;
  const borrowedDocuments = documents?.filter((doc: any) => doc.estEmprunte) || [];
  
  return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${borrowedDocuments.length}</div>
        <div class="stat-label">Documents Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${borrowedDocuments.filter((doc: any) => {
          const returnDate = new Date(doc.dateRetourPrevu || '');
          return returnDate < new Date();
        }).length}</div>
        <div class="stat-label">En Retard</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${documents?.length || 0}</div>
        <div class="stat-label">Total Documents</div>
      </div>
    </div>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 20%;">Titre</th>
          <th style="width: 15%;">Auteur</th>
          <th style="width: 12%;">Éditeur</th>
          <th style="width: 8%;">Cote</th>
          <th style="width: 15%;">Emprunteur</th>
          <th style="width: 10%;">Date Emprunt</th>
          <th style="width: 10%;">Retour Prévu</th>
          <th style="width: 10%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${borrowedDocuments.map((doc: any) => {
          const borrowDate = doc.dateEmprunt ? new Date(doc.dateEmprunt) : null;
          const expectedDate = doc.dateRetourPrevu ? new Date(doc.dateRetourPrevu) : null;
          const today = new Date();
          const isOverdue = expectedDate && today > expectedDate;
          
          return `
            <tr>
              <td><strong>${doc.titre || '-'}</strong></td>
              <td>${doc.auteur || '-'}</td>
              <td>${doc.editeur || '-'}</td>
              <td>${doc.cote || '-'}</td>
              <td><strong>${doc.nomEmprunteur || '-'}</strong></td>
              <td>${borrowDate ? borrowDate.toLocaleDateString('fr-FR') : '-'}</td>
              <td>${expectedDate ? expectedDate.toLocaleDateString('fr-FR') : '-'}</td>
              <td>
                <span class="${isOverdue ? 'status-overdue' : 'status-borrowed'}">${isOverdue ? 'En retard' : 'En cours'}</span>
              </td>
            </tr>
          `;
        }).join('') || '<tr><td colspan="8">Aucun document emprunté</td></tr>'}
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