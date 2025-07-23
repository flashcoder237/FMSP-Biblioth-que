// src/preload.ts - Version corrigée pour Electron
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}

import { contextBridge, ipcRenderer } from 'electron';

// Debug amélioré
console.log('=== Preload Script Debug ===');
console.log('Process type:', process?.type);
console.log('Process versions:', process?.versions);
console.log('contextBridge available:', typeof contextBridge !== 'undefined');
console.log('ipcRenderer available:', typeof ipcRenderer !== 'undefined');
console.log('sandbox:', process?.sandboxed);

// Vérification plus robuste du contexte
if (typeof contextBridge === 'undefined') {
  console.error('❌ contextBridge is undefined');
  console.error('Current context:', {
    nodeIntegration: process?.env?.ELECTRON_ENABLE_NODE_INTEGRATION,
    contextIsolation: process?.env?.ELECTRON_CONTEXT_ISOLATION,
    sandbox: process?.sandboxed,
    type: process?.type
  });
  
  // Ne pas lancer d'erreur fatale, permettre de continuer
  console.warn('⚠️ Running without contextBridge - this may indicate a configuration issue');
} else {
  console.log('✅ contextBridge is available');
}

if (typeof ipcRenderer === 'undefined') {
  console.error('❌ ipcRenderer is undefined');
} else {
  console.log('✅ ipcRenderer is available');
}

export interface Document {
  id?: number;
  // Champs principaux requis
  auteur: string;           // AUTEUR
  titre: string;            // TITRE  
  editeur: string;          // EDITEUR
  lieuEdition: string;      // LIEU D'EDITION
  annee: string;            // ANNEE
  descripteurs: string;     // DESCRIPTEURS (mots-clés séparés par des virgules)
  cote: string;             // COTE (référence de classification)
  type?: 'book' | 'mémoire' | 'thèse' | 'rapport' | 'article' | 'autre'; // TYPE DE DOCUMENT
  
  // Champs optionnels
  isbn?: string;
  description?: string;
  couverture?: string;      // URL de la couverture
  
  // Statut d'emprunt
  estEmprunte: boolean;
  emprunteurId?: number;
  dateEmprunt?: string;
  dateRetourPrevu?: string;
  dateRetour?: string;
  nomEmprunteur?: string;
  
  // Métadonnées de synchronisation
  localId?: string;         // ID unique local pour la sync
  remoteId?: string;        // ID sur le serveur distant
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;     // Timestamp de dernière modification
  version: number;          // Version pour gérer les conflits
  deletedAt?: string;       // Soft delete
  createdAt?: string;
}

// Alias pour compatibilité ascendante - NOUVEAU MODÈLE
export interface Book extends Document {
  // Propriétés de compatibilité (mappées automatiquement)
  get title(): string;
  get author(): string;
  get category(): string;
  get publishedDate(): string;
  get coverUrl(): string | undefined;
  get isBorrowed(): boolean;
  get borrowerId(): number | undefined;
  get borrowDate(): string | undefined;
  get expectedReturnDate(): string | undefined;
  get returnDate(): string | undefined;
  get borrowerName(): string | undefined;
}

export interface Author {
  id?: number;
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  // Synchronisation
  localId?: string;
  remoteId?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;
  version: number;
  deletedAt?: string;
  createdAt?: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  color?: string;
  // Synchronisation
  localId?: string;
  remoteId?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;
  version: number;
  deletedAt?: string;
  createdAt?: string;
}

export interface Borrower {
  id?: number;
  type: 'student' | 'staff';
  firstName: string;
  lastName: string;
  matricule: string;
  // Spécifique aux étudiants
  classe?: string;
  // Spécifique au personnel
  cniNumber?: string;
  position?: string;
  email?: string;
  phone?: string;
  // Synchronisation
  localId?: string;
  remoteId?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;
  version: number;
  deletedAt?: string;
  createdAt?: string;
}

export interface BorrowHistory {
  id?: number;
  documentId: number;
  borrowerId: number;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
  // Synchronisation
  localId?: string;
  remoteId?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;
  version: number;
  deletedAt?: string;
  createdAt?: string;
  // Relations
  document?: Document;
  borrower?: Borrower;
}

export interface Stats {
  totalDocuments: number;
  borrowedDocuments: number;
  availableDocuments: number;
  totalAuthors: number;
  totalCategories: number;
  totalBorrowers: number;
  totalStudents: number;
  totalStaff: number;
  overdueDocuments: number;
}

export interface HistoryFilter {
  startDate?: string;
  endDate?: string;
  borrowerType?: 'all' | 'student' | 'staff';
  status?: 'all' | 'active' | 'returned' | 'overdue';
  borrowerId?: number;
  documentId?: number;
}

// Interfaces pour les paramètres
export interface InstitutionSettings {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string;
  cloudSync: boolean;
  cloudProvider: 'google' | 'dropbox' | 'onedrive';
}

export interface SecuritySettings {
  requireAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}

export interface ApplicationSettings {
  institution: InstitutionSettings;
  backup: BackupSettings;
  security: SecuritySettings;
}

// Interface pour l'authentification
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    role: string;
    lastLogin: string;
  };
  error?: string;
}

// Interfaces pour la synchronisation
export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingOperations: number;
  syncInProgress: boolean;
  errors: SyncError[];
}

export interface SyncError {
  id: string;
  type: 'document' | 'author' | 'category' | 'borrower' | 'history';
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  error: string;
  timestamp: string;
  retryCount: number;
}

export interface SyncOperation {
  id: string;
  type: 'document' | 'author' | 'category' | 'borrower' | 'history';
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
}

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: 'wifi' | 'ethernet' | 'cellular' | 'none';
  speed?: 'slow' | 'medium' | 'fast';
  lastChecked: string;
}

export interface ConflictResolution {
  entityType: 'document' | 'author' | 'category' | 'borrower' | 'history';
  entityId: string;
  localVersion: any;
  remoteVersion: any;
  resolution: 'use_local' | 'use_remote' | 'merge' | 'manual';
  resolvedData?: any;
}

// Fonctions utilitaires pour la compatibilité Book/Document
export const createBookFromDocument = (document: Document): Book => {
  const book = { ...document } as any;
  
  // Ajouter les getters pour la compatibilité
  Object.defineProperties(book, {
    title: {
      get: function() { return this.titre; },
      enumerable: true
    },
    author: {
      get: function() { return this.auteur; },
      enumerable: true
    },
    category: {
      get: function() { return this.descripteurs.split(',')[0]?.trim() || ''; },
      enumerable: true
    },
    publishedDate: {
      get: function() { return this.annee; },
      enumerable: true
    },
    coverUrl: {
      get: function() { return this.couverture; },
      enumerable: true
    },
    isBorrowed: {
      get: function() { return this.estEmprunte; },
      enumerable: true
    },
    borrowerId: {
      get: function() { return this.emprunteurId; },
      enumerable: true
    },
    borrowDate: {
      get: function() { return this.dateEmprunt; },
      enumerable: true
    },
    expectedReturnDate: {
      get: function() { return this.dateRetourPrevu; },
      enumerable: true
    },
    returnDate: {
      get: function() { return this.dateRetour; },
      enumerable: true
    },
    borrowerName: {
      get: function() { return this.nomEmprunteur; },
      enumerable: true
    }
  });
  
  return book as Book;
};

export const createDocumentFromBook = (book: Partial<Book>): Omit<Document, 'id'> => {
  const now = new Date().toISOString();
  
  return {
    auteur: (book as any).author || book.auteur || '',
    titre: (book as any).title || book.titre || '',
    editeur: book.editeur || 'Non spécifié',
    lieuEdition: book.lieuEdition || 'Non spécifié',
    annee: (book as any).publishedDate || book.annee || new Date().getFullYear().toString(),
    descripteurs: (book as any).category || book.descripteurs || 'Général',
    cote: book.cote || `GEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    isbn: book.isbn,
    description: book.description,
    couverture: (book as any).coverUrl || book.couverture,
    estEmprunte: (book as any).isBorrowed || book.estEmprunte || false,
    emprunteurId: (book as any).borrowerId || book.emprunteurId,
    dateEmprunt: (book as any).borrowDate || book.dateEmprunt,
    dateRetourPrevu: (book as any).expectedReturnDate || book.dateRetourPrevu,
    dateRetour: (book as any).returnDate || book.dateRetour,
    nomEmprunteur: (book as any).borrowerName || book.nomEmprunteur,
    localId: book.localId,
    remoteId: book.remoteId,
    syncStatus: book.syncStatus || 'pending',
    lastModified: book.lastModified || now,
    version: book.version || 1,
    deletedAt: book.deletedAt,
    createdAt: book.createdAt || now
  };
};

// API Definition
const electronAPI = {
  // Window controls
  minimizeWindow: () => ipcRenderer?.invoke('window-controls:minimize'),
  maximizeWindow: () => ipcRenderer?.invoke('window-controls:maximize'),
  closeWindow: () => ipcRenderer?.invoke('window-controls:close'),

  // Authentication
  getAuthStatus: (): Promise<boolean> => ipcRenderer?.invoke('auth:status') || Promise.resolve(false),
  login: (credentials: AuthCredentials): Promise<AuthResponse> => ipcRenderer?.invoke('auth:login', credentials) || Promise.resolve({ success: false, error: 'IPC not available' }),
  logout: (): Promise<void> => ipcRenderer?.invoke('auth:logout') || Promise.resolve(),

  // Database operations - Books (avec compatibilité Document)
  getBooks: (): Promise<Book[]> => 
    ipcRenderer?.invoke('db:getBooks').then((documents: Document[]) => 
      documents.map(createBookFromDocument)
    ) || Promise.resolve([]),
  addBook: (book: Omit<Book, 'id'>): Promise<number> => 
    ipcRenderer?.invoke('db:addBook', createDocumentFromBook(book)) || Promise.resolve(0),
  updateBook: (book: Book): Promise<boolean> => 
    ipcRenderer?.invoke('db:updateBook', { ...createDocumentFromBook(book), id: book.id }) || Promise.resolve(false),
  deleteBook: (id: number): Promise<boolean> => ipcRenderer?.invoke('db:deleteBook', id) || Promise.resolve(false),
  searchBooks: (query: string): Promise<Book[]> => 
    ipcRenderer?.invoke('db:searchBooks', query).then((documents: Document[]) => 
      documents.map(createBookFromDocument)
    ) || Promise.resolve([]),
  
  // Database operations - Documents (nouveau)
  getDocuments: (): Promise<Document[]> => ipcRenderer?.invoke('db:getDocuments') || Promise.resolve([]),
  addDocument: (document: Omit<Document, 'id'>): Promise<number> => ipcRenderer?.invoke('db:addDocument', document) || Promise.resolve(0),
  updateDocument: (document: Document): Promise<boolean> => ipcRenderer?.invoke('db:updateDocument', document) || Promise.resolve(false),
  deleteDocument: (id: number): Promise<boolean> => ipcRenderer?.invoke('db:deleteDocument', id) || Promise.resolve(false),
  searchDocuments: (query: string): Promise<Document[]> => ipcRenderer?.invoke('db:searchDocuments', query) || Promise.resolve([]),
  
  // Database operations - Authors
  getAuthors: (): Promise<Author[]> => ipcRenderer?.invoke('db:getAuthors') || Promise.resolve([]),
  addAuthor: (author: Omit<Author, 'id'>): Promise<number> => ipcRenderer?.invoke('db:addAuthor', {
    ...author,
    localId: author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: author.syncStatus || 'pending',
    lastModified: author.lastModified || new Date().toISOString(),
    version: author.version || 1,
    createdAt: author.createdAt || new Date().toISOString()
  }) || Promise.resolve(0),
  
  // Database operations - Categories
  getCategories: (): Promise<Category[]> => ipcRenderer?.invoke('db:getCategories') || Promise.resolve([]),
  addCategory: (category: Omit<Category, 'id'>): Promise<number> => ipcRenderer?.invoke('db:addCategory', {
    ...category,
    localId: category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: category.syncStatus || 'pending',
    lastModified: category.lastModified || new Date().toISOString(),
    version: category.version || 1,
    createdAt: category.createdAt || new Date().toISOString()
  }) || Promise.resolve(0),
  
  // Database operations - Borrowers
  getBorrowers: (): Promise<Borrower[]> => ipcRenderer?.invoke('db:getBorrowers') || Promise.resolve([]),
  addBorrower: (borrower: Omit<Borrower, 'id'>): Promise<number> => ipcRenderer?.invoke('db:addBorrower', {
    ...borrower,
    localId: borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: borrower.syncStatus || 'pending',
    lastModified: borrower.lastModified || new Date().toISOString(),
    version: borrower.version || 1,
    createdAt: borrower.createdAt || new Date().toISOString()
  }) || Promise.resolve(0),
  updateBorrower: (borrower: Borrower): Promise<boolean> => ipcRenderer?.invoke('db:updateBorrower', {
    ...borrower,
    lastModified: new Date().toISOString(),
    version: (borrower.version || 1) + 1,
    syncStatus: 'pending'
  }) || Promise.resolve(false),
  deleteBorrower: (id: number): Promise<boolean> => ipcRenderer?.invoke('db:deleteBorrower', id) || Promise.resolve(false),
  searchBorrowers: (query: string): Promise<Borrower[]> => ipcRenderer?.invoke('db:searchBorrowers', query) || Promise.resolve([]),
  
  // Borrow operations
  getBorrowedDocuments: (): Promise<BorrowHistory[]> => ipcRenderer?.invoke('db:getBorrowedDocuments') || Promise.resolve([]),
  // Compatibility method
  getBorrowedBooks: (): Promise<BorrowHistory[]> => ipcRenderer?.invoke('db:getBorrowedDocuments') || Promise.resolve([]),
  borrowDocument: (documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> => 
    ipcRenderer?.invoke('db:borrowDocument', documentId, borrowerId, expectedReturnDate) || Promise.resolve(0),
  // Compatibility method
  borrowBook: (documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> => 
    ipcRenderer?.invoke('db:borrowDocument', documentId, borrowerId, expectedReturnDate) || Promise.resolve(0),
  returnBook: (borrowHistoryId: number, notes?: string): Promise<boolean> => 
    ipcRenderer?.invoke('db:returnBook', borrowHistoryId, notes) || Promise.resolve(false),
  getBorrowHistory: (filter?: HistoryFilter): Promise<BorrowHistory[]> => 
    ipcRenderer?.invoke('db:getBorrowHistory', filter) || Promise.resolve([]),
  
  // Statistics
  getStats: (): Promise<Stats> => ipcRenderer?.invoke('db:getStats') || Promise.resolve({
    totalDocuments: 0,
    borrowedDocuments: 0,
    availableDocuments: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalBorrowers: 0,
    totalStudents: 0,
    totalStaff: 0,
    overdueBooks: 0
  }),
  getAdvancedStats: (): Promise<any> => ipcRenderer?.invoke('stats:advanced') || Promise.resolve({}),
  
  // Settings management
  getSettings: (): Promise<ApplicationSettings | null> => ipcRenderer?.invoke('settings:get') || Promise.resolve(null),
  saveSettings: (settings: ApplicationSettings): Promise<boolean> => ipcRenderer?.invoke('settings:save', settings) || Promise.resolve(false),
  
  // Backup and restore operations
  createBackup: (): Promise<string> => ipcRenderer?.invoke('backup:create') || Promise.resolve(''),
  restoreBackup: (): Promise<boolean> => ipcRenderer?.invoke('backup:restore') || Promise.resolve(false),
  clearAllData: (): Promise<boolean> => ipcRenderer?.invoke('db:clearAll') || Promise.resolve(false),
  
  // Export/Import operations
  exportDatabase: (filePath: string): Promise<void> => ipcRenderer?.invoke('db:export', filePath) || Promise.resolve(),
  importDatabase: (filePath: string): Promise<boolean> => ipcRenderer?.invoke('db:import', filePath) || Promise.resolve(false),
  
  // Print operations
  printInventory: (data: any): Promise<boolean> => ipcRenderer?.invoke('print:inventory', data) || Promise.resolve(false),
  printAvailableBooks: (data: any): Promise<boolean> => ipcRenderer?.invoke('print:available-books', data) || Promise.resolve(false),
  printBorrowedBooks: (data: any): Promise<boolean> => ipcRenderer?.invoke('print:borrowed-books', data) || Promise.resolve(false),
  printBorrowHistory: (data: any): Promise<boolean> => ipcRenderer?.invoke('print:borrow-history', data) || Promise.resolve(false),
  
  // Export operations
  exportCSV: (data: any): Promise<string | null> => ipcRenderer?.invoke('export:csv', data) || Promise.resolve(null),
  
  // File operations
  selectFile: (options?: any): Promise<string | null> => ipcRenderer?.invoke('file:select', options) || Promise.resolve(null),
  selectDirectory: (): Promise<string | null> => ipcRenderer?.invoke('file:selectDirectory') || Promise.resolve(null),
  
  // Notification operations
  showNotification: (title: string, body: string): Promise<void> => 
    ipcRenderer?.invoke('notification:show', title, body) || Promise.resolve(),
  
  // System information
  getSystemInfo: (): Promise<any> => ipcRenderer?.invoke('system:info') || Promise.resolve({}),
  
  // Application updates
  checkForUpdates: (): Promise<any> => ipcRenderer?.invoke('system:checkUpdates') || Promise.resolve({}),
  
  // Theme operations
  setTheme: (theme: string): Promise<void> => ipcRenderer?.invoke('theme:set', theme) || Promise.resolve(),
  getTheme: (): Promise<string> => ipcRenderer?.invoke('theme:get') || Promise.resolve('light'),
  
  // Synchronization operations
  getSyncStatus: (): Promise<SyncStatus> => ipcRenderer?.invoke('sync:getStatus') || Promise.resolve({
    isOnline: false,
    lastSync: null,
    pendingOperations: 0,
    syncInProgress: false,
    errors: []
  }),
  triggerSync: (): Promise<boolean> => ipcRenderer?.invoke('sync:trigger') || Promise.resolve(false),
  clearSyncErrors: (): Promise<boolean> => ipcRenderer?.invoke('sync:clearErrors') || Promise.resolve(false),
  retrySyncOperation: (operationId: string): Promise<boolean> => ipcRenderer?.invoke('sync:retry', operationId) || Promise.resolve(false)
};

// Type guard pour vérifier si nous sommes dans un environnement qui a accès à la fenêtre
function hasWindowAccess(): boolean {
  try {
    return typeof globalThis !== 'undefined' && 
           'window' in globalThis && 
           (globalThis as any).window !== undefined;
  } catch {
    return false;
  }
}

// Exposer l'API seulement si contextBridge est disponible
if (typeof contextBridge !== 'undefined' && typeof ipcRenderer !== 'undefined') {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
    console.log('✅ electronAPI exposed via contextBridge');
  } catch (error) {
    console.error('❌ Failed to expose electronAPI:', error);
    // Fallback: exposer directement sur globalThis si disponible
    if (hasWindowAccess()) {
      (globalThis as any).window.electronAPI = electronAPI;
      console.log('⚠️ electronAPI exposed directly on window (fallback)');
    }
  }
} else {
  console.warn('⚠️ contextBridge or ipcRenderer not available, using fallback');
  // Fallback pour les environnements où contextBridge n'est pas disponible
  if (hasWindowAccess()) {
    (globalThis as any).window.electronAPI = electronAPI;
    console.log('⚠️ electronAPI exposed directly on window (no contextBridge)');
  } else {
    console.error('❌ Window object not available');
  }
}