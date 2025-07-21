// Types pour l'application de bibliothèque
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
  classe?: string;
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
  // Données jointes
  book?: Book;
  borrower?: Borrower;
  // Synchronisation
  localId?: string;
  remoteId?: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastModified: string;
  version: number;
  deletedAt?: string;
  createdAt?: string;
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

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingOperations: number;
  syncInProgress: boolean;
  errors: SyncError[];
}

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  lastChecked: string;
}

export interface SyncError {
  id: string;
  type: string;
  operation: string;
  error: string;
  entityId: string;
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
  lastError?: string;
}

export interface ConflictResolution {
  operationId: string;
  resolution: 'local' | 'remote' | 'merge';
  mergedData?: any;
}

export interface HistoryFilter {
  status?: 'all' | 'active' | 'returned' | 'overdue';
  borrowerType?: 'all' | 'student' | 'staff';
  startDate?: string;
  endDate?: string;
  borrowerId?: number;
  bookId?: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
}

// Fonction utilitaire pour créer un Book depuis un Document
export function createBookFromDocument(doc: Document): Book {
  const book: any = {
    ...doc,
    get title() { return this.titre; },
    get author() { return this.auteur; },
    get category() { return this.descripteurs; },
    get publishedDate() { return this.annee; },
    get coverUrl() { return this.couverture; },
    get isBorrowed() { return this.estEmprunte; },
    get borrowerId() { return this.emprunteurId; },
    get borrowDate() { return this.dateEmprunt; },
    get expectedReturnDate() { return this.dateRetourPrevu; },
    get returnDate() { return this.dateRetour; },
    get borrowerName() { return this.nomEmprunteur; },
  };
  
  return book as Book;
}