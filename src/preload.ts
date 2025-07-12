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
  borrowerName?: string;
  borrowDate?: string;
  returnDate?: string;
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

export interface Stats {
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
  totalAuthors: number;
  totalCategories: number;
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
  
  getBorrowedBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getBorrowedBooks'),
  borrowBook: (bookId: number, borrowerName: string): Promise<boolean> => ipcRenderer.invoke('db:borrowBook', bookId, borrowerName),
  returnBook: (bookId: number): Promise<boolean> => ipcRenderer.invoke('db:returnBook', bookId),
  
  getStats: (): Promise<Stats> => ipcRenderer.invoke('db:getStats'),
  
  // Print operations
  printInventory: (data: any): Promise<boolean> => ipcRenderer.invoke('print:inventory', data),
  printAvailableBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:available-books', data),
  printBorrowedBooks: (data: any): Promise<boolean> => ipcRenderer.invoke('print:borrowed-books', data),
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
      getBorrowedBooks: () => Promise<Book[]>;
      borrowBook: (bookId: number, borrowerName: string) => Promise<boolean>;
      returnBook: (bookId: number) => Promise<boolean>;
      getStats: () => Promise<Stats>;
      printInventory: (data: any) => Promise<boolean>;
      printAvailableBooks: (data: any) => Promise<boolean>;
      printBorrowedBooks: (data: any) => Promise<boolean>;
      exportCSV: (data: any) => Promise<string | null>;
    };
  }
}