import { contextBridge, ipcRenderer } from 'electron';

export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedDate: string;
  description: string;
  coverUrl?: string;
  isBorrowed: boolean;
  borrowerId?: number;
  borrowDate?: string;
  expectedReturnDate?: string;
  returnDate?: string;
  borrowerName?: string;
  createdAt?: string;
}

export interface Author {
  id?: number;
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  color?: string;
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
    };
  }
}