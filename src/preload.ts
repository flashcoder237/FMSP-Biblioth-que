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
  borrowerName?: string; // Add this line
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

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-controls:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-controls:maximize'),
  closeWindow: () => ipcRenderer.invoke('window-controls:close'),

  // Database operations
  getBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getBooks'),
  addBook: (book: Omit<Book, 'id'>): Promise<number> => ipcRenderer.invoke('db:addBook', book),
  updateBook: (book: Book): Promise<boolean> => ipcRenderer.invoke('db:updateBook', book),
  deleteBook: (id: number): Promise<boolean> => ipcRenderer.invoke('db:deleteBook', id),
  
  getAuthors: (): Promise<Author[]> => ipcRenderer.invoke('db:getAuthors'),
  addAuthor: (author: Omit<Author, 'id'>): Promise<number> => ipcRenderer.invoke('db:addAuthor', author),
  
  getCategories: (): Promise<Category[]> => ipcRenderer.invoke('db:getCategories'),
  addCategory: (category: Omit<Category, 'id'>): Promise<number> => ipcRenderer.invoke('db:addCategory', category),
  
  searchBooks: (query: string): Promise<Book[]> => ipcRenderer.invoke('db:searchBooks', query),
  
  // Borrowers
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
  
  getStats: (): Promise<Stats> => ipcRenderer.invoke('db:getStats'),
  
  // Print operations
  printInventory: (data: any): Promise<boolean> => ipcRenderer.invoke('print:inventory', data),
  printAvailableBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:available-books', data),
  printBorrowedBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:borrowed-books', data),
  printBorrowHistory: (data: any): Promise<boolean> => ipcRenderer.invoke('print:borrow-history', data),
  exportCSV: (data: any): Promise<string | null> => ipcRenderer.invoke('export:csv', data),
});

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      getBooks: () => Promise<Book[]>;
      addBook: (book: Omit<Book, 'id'>) => Promise<number>;
      updateBook: (book: Book) => Promise<boolean>;
      deleteBook: (id: number) => Promise<boolean>;
      getAuthors: () => Promise<Author[]>;
      addAuthor: (author: Omit<Author, 'id'>) => Promise<number>;
      getCategories: () => Promise<Category[]>;
      addCategory: (category: Omit<Category, 'id'>) => Promise<number>;
      searchBooks: (query: string) => Promise<Book[]>;
      getBorrowers: () => Promise<Borrower[]>;
      addBorrower: (borrower: Omit<Borrower, 'id'>) => Promise<number>;
      updateBorrower: (borrower: Borrower) => Promise<boolean>;
      deleteBorrower: (id: number) => Promise<boolean>;
      searchBorrowers: (query: string) => Promise<Borrower[]>;
      getBorrowedBooks: () => Promise<BorrowHistory[]>;
      borrowBook: (bookId: number, borrowerId: number, expectedReturnDate: string) => Promise<number>;
      returnBook: (borrowHistoryId: number, notes?: string) => Promise<boolean>;
      getBorrowHistory: (filter?: HistoryFilter) => Promise<BorrowHistory[]>;
      getStats: () => Promise<Stats>;
      printInventory: (data: any) => Promise<boolean>;
      printAvailableBooks: (data: any) => Promise<boolean>;
      printBorrowedBooks: (data: any) => Promise<boolean>;
      printBorrowHistory: (data: any) => Promise<boolean>;
      exportCSV: (data: any) => Promise<string | null>;
    };
  }
}