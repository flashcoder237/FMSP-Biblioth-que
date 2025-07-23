// src/services/SupabaseService.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Book, Author, Category, Stats, Borrower, BorrowHistory, HistoryFilter, Document } from '../preload';
import { configService } from './ConfigService';
import { logger } from './LoggerService';

export interface Institution {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  description: string;
  type: 'school' | 'university' | 'library' | 'other';
  director?: string;
  capacity?: number;
  established_year?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  max_books: number;
  max_users: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'admin' | 'librarian' | 'user';
  institution_id?: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBook extends Omit<Book, 'id'> {
  id: string;
  institution_id: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBorrower extends Omit<Borrower, 'id'> {
  id: string;
  institution_id: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBorrowHistory extends Omit<BorrowHistory, 'id' | 'book' | 'borrower'> {
  id: string;
  institution_id: string;
  book_id: string;
  borrower_id: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Service Supabase pour la gestion de la bibliothèque
export class SupabaseService {
  private supabase!: SupabaseClient; // Sera initialisé dans initializeSupabase
  private currentUser: User | null = null;
  private currentInstitution: Institution | null = null;

  constructor() {
    this.initializeSupabase();
  }

  private async initializeSupabase() {
    try {
      // Vérifier que la configuration est initialisée
      if (!configService.hasSupabaseConfig()) {
        logger.error('Configuration Supabase manquante', 'SupabaseService');
        throw new Error('Configuration Supabase non disponible');
      }

      const supabaseConfig = configService.get('supabase');
      
      // Validation des clés
      if (!supabaseConfig.url.startsWith('https://')) {
        throw new Error('URL Supabase invalide');
      }

      if (supabaseConfig.key.length < 100) {
        logger.warn('Clé Supabase suspicieusement courte', 'SupabaseService');
      }

      this.supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
        auth: {
          persistSession: true,
          detectSessionInUrl: false
        }
      });

      logger.info('Supabase initialisé avec succès', 'SupabaseService');
      await this.initializeAuth();
      
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de Supabase', 'SupabaseService', error as Error);
      throw error;
    }
  }

  private async initializeAuth() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        logger.error('Erreur lors de la récupération de la session', 'SupabaseService', error as Error);
        return;
      }

      if (session?.user) {
        logger.info(`Session utilisateur trouvée: ${session.user.email}`, 'SupabaseService');
        await this.loadUserProfile(session.user.id);
      } else {
        logger.debug('Aucune session utilisateur active', 'SupabaseService');
      }
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de l\'authentification', 'SupabaseService', error as Error);
    }
  }

  // Authentication
  async signUp(email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    institutionCode?: string;
    role?: 'admin' | 'librarian' | 'user';
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'user'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Si un code d'établissement est fourni, associer l'utilisateur
        if (userData.institutionCode) {
          const institution = await this.getInstitutionByCode(userData.institutionCode);
          if (!institution) {
            throw new Error('Code d\'établissement invalide');
          }
        }

        // Créer le profil utilisateur
        const userProfile = await this.createUserProfile(data.user.id, {
          email: data.user.email!,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'user',
          institution_id: userData.institutionCode ? (await this.getInstitutionByCode(userData.institutionCode))?.id : undefined,
          is_active: true
        });

        return { success: true, user: userProfile };
      }

      return { success: false, error: 'Erreur lors de la création du compte' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; institution?: Institution; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = await this.loadUserProfile(data.user.id);
        if (userProfile && userProfile.institution_id) {
          this.currentInstitution = await this.getInstitution(userProfile.institution_id);
        }

        return { 
          success: true, 
          user: userProfile!, 
          institution: this.currentInstitution || undefined 
        };
      }

      return { success: false, error: 'Erreur de connexion' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signOut(): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      
      this.currentUser = null;
      this.currentInstitution = null;
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  }

  // Institution Management
  async createInstitution(institutionData: Omit<Institution, 'id' | 'code' | 'created_at' | 'updated_at'>): Promise<{ institution: Institution; code: string }> {
    const code = this.generateInstitutionCode();
    
    const { data, error } = await this.supabase
      .from('institutions')
      .insert({
        ...institutionData,
        code,
        status: 'active',
        subscription_plan: 'basic',
        max_books: 1000,
        max_users: 10
      })
      .select()
      .single();

    if (error) throw error;

    // Associer l'utilisateur actuel comme admin de cette institution
    if (this.currentUser) {
      await this.supabase
        .from('users')
        .update({
          institution_id: data.id,
          role: 'admin'
        })
        .eq('id', this.currentUser.id);
    }

    return { institution: data, code };
  }

  private generateInstitutionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getInstitutionByCode(code: string): Promise<Institution | null> {
    const { data, error } = await this.supabase
      .from('institutions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error) return null;
    return data;
  }

  async getInstitution(id: string): Promise<Institution | null> {
    const { data, error } = await this.supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // User Profile Management
  private async createUserProfile(userId: string, profileData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        id: userId,
        ...profileData,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async loadUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    
    this.currentUser = data;
    return data;
  }

  // Books Management - Méthodes simplifiées pour le test
  async getBooks(): Promise<Book[]> {
    // Pour l'instant, retourner un tableau vide pour éviter les erreurs de table manquante
    console.log('getBooks appelé - retour de données de test');
    return [];
  }

  async addBook(book: Omit<Book, 'id'>): Promise<number> {
    console.log('addBook appelé avec:', book);
    return 1; // ID fictif pour le test
  }

  async updateBook(book: Book): Promise<boolean> {
    console.log('updateBook appelé avec:', book);
    return true;
  }

  async deleteBook(id: number): Promise<boolean> {
    console.log('deleteBook appelé avec ID:', id);
    return true;
  }

  async searchBooks(query: string): Promise<Book[]> {
    console.log('searchBooks appelé avec query:', query);
    return [];
  }

  // Documents Management - Nouvelles méthodes pour le modèle Document
  async getDocuments(): Promise<Document[]> {
    console.log('getDocuments appelé - retour de données de test');
    return [];
  }

  async addDocument(document: Omit<Document, 'id'>): Promise<number> {
    console.log('addDocument appelé avec:', document);
    return 1; // ID fictif pour le test
  }

  async updateDocument(document: Document): Promise<boolean> {
    console.log('updateDocument appelé avec:', document);
    return true;
  }

  async deleteDocument(id: number): Promise<boolean> {
    console.log('deleteDocument appelé avec ID:', id);
    return true;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    console.log('searchDocuments appelé avec query:', query);
    return [];
  }


  // Borrowers Management - Méthodes simplifiées
  async getBorrowers(): Promise<Borrower[]> {
    console.log('getBorrowers appelé');
    return [];
  }

  async addBorrower(borrower: Omit<Borrower, 'id'>): Promise<number> {
    console.log('addBorrower appelé avec:', borrower);
    return 1;
  }

  async updateBorrower(borrower: Borrower): Promise<boolean> {
    console.log('updateBorrower appelé avec:', borrower);
    return true;
  }

  async deleteBorrower(id: number): Promise<boolean> {
    console.log('deleteBorrower appelé avec ID:', id);
    return true;
  }

  async searchBorrowers(query: string): Promise<Borrower[]> {
    console.log('searchBorrowers appelé avec query:', query);
    return [];
  }

  // Borrow Management - Méthodes simplifiées
  async borrowDocument(documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> {
    console.log('borrowDocument appelé avec:', { documentId, borrowerId, expectedReturnDate });
    return 1;
  }

  // Compatibility method
  async borrowBook(documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> {
    return this.borrowDocument(documentId, borrowerId, expectedReturnDate);
  }

  async returnDocument(borrowHistoryId: number, notes?: string): Promise<boolean> {
    console.log('returnDocument appelé avec:', { borrowHistoryId, notes });
    return true;
  }

  // Compatibility method
  async returnBook(borrowHistoryId: number, notes?: string): Promise<boolean> {
    return this.returnDocument(borrowHistoryId, notes);
  }

  async getBorrowedDocuments(): Promise<BorrowHistory[]> {
    console.log('getBorrowedDocuments appelé');
    return [];
  }

  // Compatibility method
  async getBorrowedBooks(): Promise<BorrowHistory[]> {
    return this.getBorrowedDocuments();
  }

  async getBorrowHistory(filter?: HistoryFilter): Promise<BorrowHistory[]> {
    console.log('getBorrowHistory appelé avec filter:', filter);
    return [];
  }

  // Authors and Categories - Méthodes simplifiées
  async getAuthors(): Promise<Author[]> {
    console.log('getAuthors appelé');
    return [];
  }

  async addAuthor(author: Omit<Author, 'id'>): Promise<number> {
    console.log('addAuthor appelé avec:', author);
    return 1;
  }

  async getCategories(): Promise<Category[]> {
    console.log('getCategories appelé');
    return [];
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<number> {
    console.log('addCategory appelé avec:', category);
    return 1;
  }

  // Statistics - Méthodes simplifiées
  async getStats(): Promise<Stats> {
    console.log('getStats appelé');
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

  // Getters
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentInstitution(): Institution | null {
    return this.currentInstitution;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async switchInstitution(institutionCode: string): Promise<boolean> {
    try {
      const institution = await this.getInstitutionByCode(institutionCode);
      if (!institution) return false;

      // Vérifier que l'utilisateur a accès à cette institution
      if (this.currentUser && this.currentUser.institution_id !== institution.id) {
        // Seuls les super_admin peuvent changer d'institution
        if (this.currentUser.role !== 'super_admin') {
          return false;
        }
      }

      this.currentInstitution = institution;
      return true;
    } catch (error) {
      console.error('Erreur lors du changement d\'institution:', error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    console.log('clearAllData appelé');
    return true;
  }

  // Méthodes CRUD supplémentaires pour la compatibilité
  async createDocument(document: Omit<Document, 'id'>): Promise<Document | null> {
    console.log('createDocument appelé avec:', document);
    return null;
  }


  async createAuthor(author: Omit<Author, 'id'>): Promise<Author | null> {
    console.log('createAuthor appelé avec:', author);
    return null;
  }

  async updateAuthor(author: Author): Promise<boolean> {
    console.log('updateAuthor appelé avec:', author);
    return true;
  }

  async deleteAuthor(id: string): Promise<boolean> {
    console.log('deleteAuthor appelé avec ID:', id);
    return true;
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    console.log('createCategory appelé avec:', category);
    return null;
  }

  async updateCategory(category: Category): Promise<boolean> {
    console.log('updateCategory appelé avec:', category);
    return true;
  }

  async deleteCategory(id: string): Promise<boolean> {
    console.log('deleteCategory appelé avec ID:', id);
    return true;
  }

  async createBorrower(borrower: Omit<Borrower, 'id'>): Promise<Borrower | null> {
    console.log('createBorrower appelé avec:', borrower);
    return null;
  }

  async createBorrowHistory(borrowHistory: Omit<BorrowHistory, 'id'>): Promise<BorrowHistory | null> {
    console.log('createBorrowHistory appelé avec:', borrowHistory);
    return null;
  }

  async updateBorrowHistory(borrowHistory: BorrowHistory): Promise<boolean> {
    console.log('updateBorrowHistory appelé avec:', borrowHistory);
    return true;
  }

  async deleteBorrowHistory(id: string): Promise<boolean> {
    console.log('deleteBorrowHistory appelé avec ID:', id);
    return true;
  }


}
