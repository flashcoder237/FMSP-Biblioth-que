import { contextBridge, ipcRenderer } from 'electron';

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
  couverture?: string;
  
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

// Alias pour compatibilité ascendante
export interface Book extends Document {}

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

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-controls:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-controls:maximize'),
  closeWindow: () => ipcRenderer.invoke('window-controls:close'),

  // Authentication
  getAuthStatus: (): Promise<boolean> => ipcRenderer.invoke('auth:status'),
  login: (credentials: AuthCredentials): Promise<AuthResponse> => ipcRenderer.invoke('auth:login', credentials),
  logout: (): Promise<void> => ipcRenderer.invoke('auth:logout'),

  // Database operations - Books
  getBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getBooks'),
  addBook: (book: Omit<Book, 'id'>): Promise<number> => ipcRenderer.invoke('db:addBook', book),
  updateBook: (book: Book): Promise<boolean> => ipcRenderer.invoke('db:updateBook', book),
  deleteBook: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteBook', id),
  searchBooks: (query: string): Promise<Book[]> => ipcRenderer.invoke('db:searchBooks', query),
  
  // Database operations - Authors
  getAuthors: (): Promise<Author[]> => ipcRenderer.invoke('db:getAuthors'),
  addAuthor: (author: Omit<Author, 'id'>): Promise<number> => ipcRenderer.invoke('db:addAuthor', author),
  
  // Database operations - Categories
  getCategories: (): Promise<Category[]> => ipcRenderer.invoke('db:getCategories'),
  addCategory: (category: Omit<Category, 'id'>): Promise<number> => ipcRenderer.invoke('db:addCategory', category),
  
  // Database operations - Borrowers
  getBorrowers: (): Promise<Borrower[]> => ipcRenderer.invoke('db:getBorrowers'),
  addBorrower: (borrower: Omit<Borrower, 'id'>): Promise<number> => ipcRenderer.invoke('db:addBorrower', borrower),
  updateBorrower: (borrower: Borrower): Promise<boolean> => ipcRenderer.invoke('db:updateBorrower', borrower),
  deleteBorrower: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteBorrower', id),
  searchBorrowers: (query: string): Promise<Borrower[]> => ipcRenderer.invoke('db:searchBorrowers', query),
  
  // Borrow operations
  getBorrowedBooks: (): Promise<BorrowHistory[]> => ipcRenderer.invoke('db:getBorrowedBooks'),
  borrowBook: (bookId: number, borrowerId: number, expectedReturnDate: string): Promise<number> => 
    ipcRenderer.invoke('db:borrowBook', bookId, borrowerId, expectedReturnDate),
  returnBook: (borrowHistoryId: number, notes?: string): Promise<boolean> => 
    ipcRenderer.invoke('db:returnBook', borrowHistoryId, notes),
  
  // History
  getBorrowHistory: (filter?: HistoryFilter): Promise<BorrowHistory[]> => 
    ipcRenderer.invoke('db:getBorrowHistory', filter),
  
  // Statistics
  getStats: (): Promise<Stats> => ipcRenderer.invoke('db:getStats'),
  
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
  
  // Advanced statistics
  getAdvancedStats: (): Promise<any> => ipcRenderer.invoke('stats:advanced'),
  
  // Synchronization operations
  getSyncStatus: (): Promise<SyncStatus> => ipcRenderer.invoke('sync:status'),
  startSync: (): Promise<void> => ipcRenderer.invoke('sync:start'),
  pauseSync: (): Promise<void> => ipcRenderer.invoke('sync:pause'),
  getNetworkStatus: (): Promise<NetworkStatus> => ipcRenderer.invoke('network:status'),
  resolveConflict: (resolution: ConflictResolution): Promise<boolean> => ipcRenderer.invoke('sync:resolve-conflict', resolution),
  getSyncErrors: (): Promise<SyncError[]> => ipcRenderer.invoke('sync:errors'),
  retrySyncOperation: (operationId: string): Promise<boolean> => ipcRenderer.invoke('sync:retry', operationId),
  clearSyncErrors: (): Promise<void> => ipcRenderer.invoke('sync:clear-errors'),
  
  // Document operations (remplace Books)
  getDocuments: (): Promise<Document[]> => ipcRenderer.invoke('db:getDocuments'),
  addDocument: (document: Omit<Document, 'id'>): Promise<number> => ipcRenderer.invoke('db:addDocument', document),
  updateDocument: (document: Document): Promise<boolean> => ipcRenderer.invoke('db:updateDocument', document),
  deleteDocument: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteDocument', id),
  searchDocuments: (query: string): Promise<Document[]> => ipcRenderer.invoke('db:searchDocuments', query),
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
      
      // Books
      getBooks: () => Promise<Book[]>;
      addBook: (book: Omit<Book, 'id'>) => Promise<number>;
      updateBook: (book: Book) => Promise<boolean>;
      deleteBook: (id: number) => Promise<boolean>;
      searchBooks: (query: string) => Promise<Book[]>;
      
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
      
      // Documents (nouveau modèle)
      getDocuments: () => Promise<Document[]>;
      addDocument: (document: Omit<Document, 'id'>) => Promise<number>;
      updateDocument: (document: Document) => Promise<boolean>;
      deleteDocument: (id: number) => Promise<boolean>;
      searchDocuments: (query: string) => Promise<Document[]>;
    };
  }
}