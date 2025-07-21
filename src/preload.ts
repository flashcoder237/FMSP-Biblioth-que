import { contextBridge, ipcRenderer } from 'electron';

// Debug: Check if contextBridge is available
console.log('Preload script loaded');
console.log('contextBridge available:', typeof contextBridge !== 'undefined');
console.log('ipcRenderer available:', typeof ipcRenderer !== 'undefined');

if (typeof contextBridge === 'undefined') {
  console.error('contextBridge is undefined - this indicates the preload script is not running in the correct Electron context');
  throw new Error('contextBridge is not available. Make sure this script is loaded as a preload script in an Electron BrowserWindow.');
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
  bookId: number;
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
  book?: Book;
  borrower?: Borrower;
}

export interface Stats {
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
  totalAuthors: number;
  totalCategories: number;
  totalBorrowers: number;
  totalStudents: number;
  totalStaff: number;
  overdueBooks: number;
}

export interface HistoryFilter {
  startDate?: string;
  endDate?: string;
  borrowerType?: 'all' | 'student' | 'staff';
  status?: 'all' | 'active' | 'returned' | 'overdue';
  borrowerId?: number;
  bookId?: number;
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

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-controls:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-controls:maximize'),
  closeWindow: () => ipcRenderer.invoke('window-controls:close'),

  // Authentication
  getAuthStatus: (): Promise<boolean> => ipcRenderer.invoke('auth:status'),
  login: (credentials: AuthCredentials): Promise<AuthResponse> => ipcRenderer.invoke('auth:login', credentials),
  logout: (): Promise<void> => ipcRenderer.invoke('auth:logout'),

  // Database operations - Books (avec compatibilité Document)
  getBooks: (): Promise<Book[]> => 
    ipcRenderer.invoke('db:getBooks').then((documents: Document[]) => 
      documents.map(createBookFromDocument)
    ),
  addBook: (book: Omit<Book, 'id'>): Promise<number> => 
    ipcRenderer.invoke('db:addBook', createDocumentFromBook(book)),
  updateBook: (book: Book): Promise<boolean> => 
    ipcRenderer.invoke('db:updateBook', { ...createDocumentFromBook(book), id: book.id }),
  deleteBook: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteBook', id),
  searchBooks: (query: string): Promise<Book[]> => 
    ipcRenderer.invoke('db:searchBooks', query).then((documents: Document[]) => 
      documents.map(createBookFromDocument)
    ),
  
  // Database operations - Documents (nouveau)
  getDocuments: (): Promise<Document[]> => ipcRenderer.invoke('db:getDocuments'),
  addDocument: (document: Omit<Document, 'id'>): Promise<number> => ipcRenderer.invoke('db:addDocument', document),
  updateDocument: (document: Document): Promise<boolean> => ipcRenderer.invoke('db:updateDocument', document),
  deleteDocument: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteDocument', id),
  searchDocuments: (query: string): Promise<Document[]> => ipcRenderer.invoke('db:searchDocuments', query),
  
  // Database operations - Authors
  getAuthors: (): Promise<Author[]> => ipcRenderer.invoke('db:getAuthors'),
  addAuthor: (author: Omit<Author, 'id'>): Promise<number> => ipcRenderer.invoke('db:addAuthor', {
    ...author,
    localId: author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: author.syncStatus || 'pending',
    lastModified: author.lastModified || new Date().toISOString(),
    version: author.version || 1,
    createdAt: author.createdAt || new Date().toISOString()
  }),
  
  // Database operations - Categories
  getCategories: (): Promise<Category[]> => ipcRenderer.invoke('db:getCategories'),
  addCategory: (category: Omit<Category, 'id'>): Promise<number> => ipcRenderer.invoke('db:addCategory', {
    ...category,
    localId: category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: category.syncStatus || 'pending',
    lastModified: category.lastModified || new Date().toISOString(),
    version: category.version || 1,
    createdAt: category.createdAt || new Date().toISOString()
  }),
  
  // Database operations - Borrowers
  getBorrowers: (): Promise<Borrower[]> => ipcRenderer.invoke('db:getBorrowers'),
  addBorrower: (borrower: Omit<Borrower, 'id'>): Promise<number> => ipcRenderer.invoke('db:addBorrower', {
    ...borrower,
    localId: borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    syncStatus: borrower.syncStatus || 'pending',
    lastModified: borrower.lastModified || new Date().toISOString(),
    version: borrower.version || 1,
    createdAt: borrower.createdAt || new Date().toISOString()
  }),
  updateBorrower: (borrower: Borrower): Promise<boolean> => ipcRenderer.invoke('db:updateBorrower', {
    ...borrower,
    lastModified: new Date().toISOString(),
    version: (borrower.version || 1) + 1,
    syncStatus: 'pending'
  }),
  deleteBorrower: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteBorrower', id),
  searchBorrowers: (query: string): Promise<Borrower[]> => ipcRenderer.invoke('db:searchBorrowers', query),
  
  // Borrow operations
  getBorrowedBooks: (): Promise<BorrowHistory[]> => ipcRenderer.invoke('db:getBorrowedBooks'),
  borrowBook: (bookId: number, borrowerId: number, expectedReturnDate: string): Promise<number> => 
    ipcRenderer.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate),
  returnBook: (borrowHistoryId: number, notes?: string): Promise<boolean> => 
    ipcRenderer.invoke('db:returnBook', borrowHistoryId, notes),
  getBorrowHistory: (filter?: HistoryFilter): Promise<BorrowHistory[]> => 
    ipcRenderer.invoke('db:getBorrowHistory', filter),
  
  // Statistics
  getStats: (): Promise<Stats> => ipcRenderer.invoke('db:getStats'),
  getAdvancedStats: (): Promise<any> => ipcRenderer.invoke('stats:advanced'),
  
  // Settings management
  getSettings: (): Promise<ApplicationSettings | null> => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: ApplicationSettings): Promise<boolean> => ipcRenderer.invoke('settings:save', settings),
  
  // Backup and restore operations
  createBackup: (): Promise<string> => ipcRenderer.invoke('backup:create'),
  restoreBackup: (): Promise<boolean> => ipcRenderer.invoke('backup:restore'),
  clearAllData: (): Promise<boolean> => ipcRenderer.invoke('db:clearAll'),
  
  // Export/Import operations
  exportDatabase: (filePath: string): Promise<void> => ipcRenderer.invoke('db:export', filePath),
  importDatabase: (filePath: string): Promise<boolean> => ipcRenderer.invoke('db:import', filePath),
  
  // Print operations
  printInventory: (data: any): Promise<boolean> => ipcRenderer.invoke('print:inventory', data),
  printAvailableBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:available-books', data),
  printBorrowedBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:borrowed-books', data),
  printBorrowHistory: (data: any): Promise<boolean> => ipcRenderer.invoke('print:borrow-history', data),
  
  // Export operations
  exportCSV: (data: any): Promise<string | null> => ipcRenderer.invoke('export:csv', data),
  
  // File operations
  selectFile: (options?: any): Promise<string | null> => ipcRenderer.invoke('file:select', options),
  selectDirectory: (): Promise<string | null> => ipcRenderer.invoke('file:selectDirectory'),
  
  // Notification operations
  showNotification: (title: string, body: string): Promise<void> => 
    ipcRenderer.invoke('notification:show', title, body),
  
  // System information
  getSystemInfo: (): Promise<any> => ipcRenderer.invoke('system:info'),
  
  // Application updates
  checkForUpdates: (): Promise<any> => ipcRenderer.invoke('system:checkUpdates'),
  
  // Theme operations
  setTheme: (theme: string): Promise<void> => ipcRenderer.invoke('theme:set', theme),
  getTheme: (): Promise<string> => ipcRenderer.invoke('theme:get'),
  
  // Synchronization operations
  getSyncStatus: (): Promise<SyncStatus> => ipcRenderer.invoke('sync:status'),
  startSync: (): Promise<void> => ipcRenderer.invoke('sync:start'),
  pauseSync: (): Promise<void> => ipcRenderer.invoke('sync:pause'),
  getNetworkStatus: (): Promise<NetworkStatus> => ipcRenderer.invoke('network:status'),
  resolveConflict: (resolution: ConflictResolution): Promise<boolean> => ipcRenderer.invoke('sync:resolve-conflict', resolution),
  getSyncErrors: (): Promise<SyncError[]> => ipcRenderer.invoke('sync:errors'),
  retrySyncOperation: (operationId: string): Promise<boolean> => ipcRenderer.invoke('sync:retry', operationId),
  clearSyncErrors: (): Promise<void> => ipcRenderer.invoke('sync:clear-errors')
});

declare global {
  interface Window {
    electronAPI: {
      // Window controls
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      
      // Authentication
      getAuthStatus: () => Promise<boolean>;
      login: (credentials: AuthCredentials) => Promise<AuthResponse>;
      logout: () => Promise<void>;
      
      // Books (avec compatibilité Document)
      getBooks: () => Promise<Book[]>;
      addBook: (book: Omit<Book, 'id'>) => Promise<number>;
      updateBook: (book: Book) => Promise<boolean>;
      deleteBook: (id: number) => Promise<boolean>;
      searchBooks: (query: string) => Promise<Book[]>;
      
      // Documents (nouveau modèle)
      getDocuments: () => Promise<Document[]>;
      addDocument: (document: Omit<Document, 'id'>) => Promise<number>;
      updateDocument: (document: Document) => Promise<boolean>;
      deleteDocument: (id: number) => Promise<boolean>;
      searchDocuments: (query: string) => Promise<Document[]>;
      
      // Authors
      getAuthors: () => Promise<Author[]>;
      addAuthor: (author: Omit<Author, 'id'>) => Promise<number>;
      
      // Categories
      getCategories: () => Promise<Category[]>;
      addCategory: (category: Omit<Category, 'id'>) => Promise<number>;
      
      // Borrowers
      getBorrowers: () => Promise<Borrower[]>;
      addBorrower: (borrower: Omit<Borrower, 'id'>) => Promise<number>;
      updateBorrower: (borrower: Borrower) => Promise<boolean>;
      deleteBorrower: (id: number) => Promise<boolean>;
      searchBorrowers: (query: string) => Promise<Borrower[]>;
      
      // Borrow operations
      getBorrowedBooks: () => Promise<BorrowHistory[]>;
      borrowBook: (bookId: number, borrowerId: number, expectedReturnDate: string) => Promise<number>;
      returnBook: (borrowHistoryId: number, notes?: string) => Promise<boolean>;
      getBorrowHistory: (filter?: HistoryFilter) => Promise<BorrowHistory[]>;
      
      // Statistics
      getStats: () => Promise<Stats>;
      getAdvancedStats: () => Promise<any>;
      
      // Settings
      getSettings: () => Promise<ApplicationSettings | null>;
      saveSettings: (settings: ApplicationSettings) => Promise<boolean>;
      
      // Backup operations
      createBackup: () => Promise<string>;
      restoreBackup: () => Promise<boolean>;
      clearAllData: () => Promise<boolean>;
      exportDatabase: (filePath: string) => Promise<void>;
      importDatabase: (filePath: string) => Promise<boolean>;
      
      // Print operations
      printInventory: (data: any) => Promise<boolean>;
      printAvailableBooks: (data: any) => Promise<boolean>;
      printBorrowedBooks: (data: any) => Promise<boolean>;
      printBorrowHistory: (data: any) => Promise<boolean>;
      
      // Export
      exportCSV: (data: any) => Promise<string | null>;
      
      // File operations
      selectFile: (options?: any) => Promise<string | null>;
      selectDirectory: () => Promise<string | null>;
      
      // Notifications
      showNotification: (title: string, body: string) => Promise<void>;
      
      // System
      getSystemInfo: () => Promise<any>;
      checkForUpdates: () => Promise<any>;
      
      // Theme
      setTheme: (theme: string) => Promise<void>;
      getTheme: () => Promise<string>;
      
      // Synchronization
      getSyncStatus: () => Promise<SyncStatus>;
      startSync: () => Promise<void>;
      pauseSync: () => Promise<void>;
      getNetworkStatus: () => Promise<NetworkStatus>;
      resolveConflict: (resolution: ConflictResolution) => Promise<boolean>;
      getSyncErrors: () => Promise<SyncError[]>;
      retrySyncOperation: (operationId: string) => Promise<boolean>;
      clearSyncErrors: () => Promise<void>;
    };
  }
}