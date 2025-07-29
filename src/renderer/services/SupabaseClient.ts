// Service Supabase pour le renderer (frontend) - Sans dépendances Node.js

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
  firstName: string;
  lastName: string;
  email?: string;
  role?: 'super_admin' | 'admin' | 'librarian' | 'user';
  institution_id?: string;
  avatar_url?: string;
  phone?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

// Service Supabase simplifié pour le renderer - utilise principalement l'authentification locale
export class SupabaseRendererService {
  private currentUser: User | null = null;
  private currentInstitution: Institution | null = null;
  private supabaseUrl: string = '';
  private supabaseKey: string = '';

  constructor() {
    // Récupérer la configuration Supabase depuis les variables d'environnement via Electron
    this.loadSupabaseConfig();
  }

  private async loadSupabaseConfig() {
    try {
      // Essayer de récupérer la config via IPC Electron
      if (window.electronAPI && window.electronAPI.getSupabaseConfig) {
        const config = await window.electronAPI.getSupabaseConfig();
        if (config) {
          this.supabaseUrl = config.url || '';
          this.supabaseKey = config.key || '';
        }
      }
    } catch (error) {
      console.log('Configuration Supabase non disponible, mode local activé');
    }
  }

  private async callSupabaseAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Configuration Supabase manquante');
    }

    const url = `${this.supabaseUrl}/auth/v1${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur API Supabase: ${error}`);
    }

    return response.json();
  }

  // Méthodes d'authentification - utilise Supabase API si disponible, sinon authentification locale
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Essayer l'authentification Supabase en premier
      if (this.supabaseUrl && this.supabaseKey) {
        console.log('Tentative d\'authentification Supabase...');
        
        const result = await this.callSupabaseAPI('/token?grant_type=password', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          })
        });

        if (result.access_token && result.user) {
          // Créer l'utilisateur au format de l'application
          const user: User = {
            id: result.user.id,
            firstName: result.user.user_metadata?.first_name || result.user.user_metadata?.firstName || 'Utilisateur',
            lastName: result.user.user_metadata?.last_name || result.user.user_metadata?.lastName || 'Supabase',
            email: result.user.email,
            role: result.user.user_metadata?.role || 'user'
          };
          
          this.currentUser = user;
          console.log('Authentification Supabase réussie:', user);
          
          return {
            success: true,
            user,
            message: 'Connexion Supabase réussie'
          };
        }
      }
    } catch (supabaseError: any) {
      console.log('Échec authentification Supabase:', supabaseError.message);
      // Continuer vers l'authentification locale
    }

    try {
      // Authentification locale de fallback - simule une connexion réussie
      console.log('Utilisation de l\'authentification locale de fallback...');
      const user: User = {
        id: Date.now().toString(),
        firstName: 'Administrateur',
        lastName: 'Local',
        email: email
      };
      
      this.currentUser = user;
      return {
        success: true,
        user,
        message: 'Connexion locale réussie'
      };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Échec de l\'authentification' };
    }
  }

  async signOut(): Promise<void> {
    try {
      this.currentUser = null;
      this.currentInstitution = null;
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  async signUp(email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    institutionCode: string;
  }): Promise<AuthResponse> {
    try {
      // Authentification locale simplifiée
      const user: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: email
      };
      
      this.currentUser = user;
      return {
        success: true,
        user,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async register(userData: { firstName: string; lastName: string; institutionCode: string; role?: string }): Promise<AuthResponse> {
    try {
      // Utilise l'authentification locale
      const user: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName
      };
      
      this.currentUser = user;
      return {
        success: true,
        user,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  }

  // Document management methods
  async getDocuments(institutionCode?: string): Promise<any[]> {
    try {
      if (window.electronAPI && window.electronAPI.getDocuments) {
        return await window.electronAPI.getDocuments(institutionCode);
      }
      return [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  async addDocument(document: any, institutionCode?: string): Promise<any> {
    try {
      if (window.electronAPI && window.electronAPI.addDocument) {
        return await window.electronAPI.addDocument(document, institutionCode);
      }
      throw new Error('Add document API not available');
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string, institutionCode?: string): Promise<boolean> {
    try {
      if (window.electronAPI && window.electronAPI.deleteDocument) {
        return await window.electronAPI.deleteDocument(parseInt(id, 10), institutionCode);
      }
      return false;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  // Author and category methods
  async getAuthors(institutionCode?: string): Promise<any[]> { // Returns Author[] interface objects
    try {
      if (window.electronAPI && window.electronAPI.getAuthors) {
        return await window.electronAPI.getAuthors(institutionCode);
      }
      return [];
    } catch (error) {
      console.error('Error getting authors:', error);
      return [];
    }
  }

  async getCategories(institutionCode?: string): Promise<any[]> { // Returns Category[] interface objects
    try {
      if (window.electronAPI && window.electronAPI.getCategories) {
        return await window.electronAPI.getCategories(institutionCode);
      }
      return [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Institution management - utilise des données locales simplifiées
  async createInstitution(institutionData: any): Promise<any> {
    try {
      // Créer une institution locale
      const institution: Institution = {
        id: Date.now().toString(),
        code: institutionData.code || Math.random().toString(36).substr(2, 8).toUpperCase(),
        name: institutionData.name || 'Mon Institution',
        address: institutionData.address || '',
        city: institutionData.city || '',
        country: institutionData.country || '',
        phone: institutionData.phone || '',
        email: institutionData.email || '',
        website: institutionData.website || '',
        logo: institutionData.logo || '',
        description: institutionData.description || '',
        type: institutionData.type || 'library',
        status: 'active',
        subscription_plan: 'basic',
        max_books: 1000,
        max_users: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.currentInstitution = institution;
      return {
        success: true,
        institution,
        code: institution.code
      };
    } catch (error) {
      console.error('Error creating institution:', error);
      throw error;
    }
  }

  async switchInstitution(institutionCode: string): Promise<boolean> {
    try {
      console.log('🔍 DEBUG switchInstitution - institutionCode:', institutionCode);
      
      // Toujours créer/mettre à jour l'institution avec le bon code
      const institution: Institution = {
        id: institutionCode,
        code: institutionCode,
        name: `Institution ${institutionCode}`,
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        description: '',
        type: 'library',
        status: 'active',
        subscription_plan: 'basic',
        max_books: 1000,
        max_users: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.currentInstitution = institution;
      console.log('🔍 DEBUG switchInstitution - currentInstitution set:', this.currentInstitution);
      return true;
    } catch (error) {
      console.error('Error switching institution:', error);
      return false;
    }
  }

  // Borrowing system methods
  async borrowDocument(borrowData: any, institutionCode?: string): Promise<any> {
    try {
      if (window.electronAPI && window.electronAPI.borrowDocument) {
        return await window.electronAPI.borrowDocument(
          parseInt(borrowData.documentId, 10),
          parseInt(borrowData.borrowerId, 10), 
          borrowData.expectedReturnDate,
          institutionCode
        );
      }
      throw new Error('Borrow document API not available');
    } catch (error) {
      console.error('Error borrowing document:', error);
      throw error;
    }
  }

  async returnDocument(borrowId: string): Promise<boolean> {
    // Use returnBook method from preload - convert string ID to number if needed
    try {
      if (window.electronAPI && window.electronAPI.returnBook) {
        const borrowIdNum = typeof borrowId === 'string' ? parseInt(borrowId, 10) : borrowId;
        return await window.electronAPI.returnBook(borrowIdNum);
      }
      return false;
    } catch (error) {
      console.error('Error returning document:', error);
      return false;
    }
  }

  async returnBook(borrowId: string, notes?: string): Promise<boolean> {
    try {
      if (window.electronAPI && window.electronAPI.returnBook) {
        const borrowIdNum = typeof borrowId === 'string' ? parseInt(borrowId, 10) : borrowId;
        return await window.electronAPI.returnBook(borrowIdNum, notes);
      }
      return false;
    } catch (error) {
      console.error('Error returning book:', error);
      return false;
    }
  }

  // Additional methods needed by the application
  async getBorrowers(institutionCode?: string): Promise<any[]> {
    try {
      if (window.electronAPI && window.electronAPI.getBorrowers) {
        return await window.electronAPI.getBorrowers(institutionCode);
      }
      return [];
    } catch (error) {
      console.error('Error getting borrowers:', error);
      return [];
    }
  }

  async addBorrower(borrowerData: any, institutionCode?: string): Promise<any> {
    try {
      if (window.electronAPI && window.electronAPI.addBorrower) {
        return await window.electronAPI.addBorrower(borrowerData, institutionCode);
      }
      throw new Error('Add borrower API not available');
    } catch (error) {
      console.error('Error adding borrower:', error);
      throw error;
    }
  }

  async getBorrowedDocuments(institutionCode?: string): Promise<any[]> {
    try {
      if (window.electronAPI && window.electronAPI.getBorrowedDocuments) {
        return await window.electronAPI.getBorrowedDocuments(institutionCode);
      }
      return [];
    } catch (error) {
      console.error('Error getting borrowed documents:', error);
      return [];
    }
  }

  async getStats(institutionCode?: string): Promise<any> {
    try {
      if (window.electronAPI && window.electronAPI.getStats) {
        return await window.electronAPI.getStats(institutionCode);
      }
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
    } catch (error) {
      console.error('Error getting stats:', error);
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
  }

  // Getters
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentInstitution(): Institution | null {
    return this.currentInstitution;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isReady(): boolean {
    return true; // Always ready for local operations
  }

  // Utility methods
  async refreshAuth(): Promise<void> {
    // No-op for local authentication
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    // For local authentication, we don't have real-time auth changes
    return () => {};
  }
}

// Instance singleton pour le renderer
export const supabaseRenderer = new SupabaseRendererService();
export default supabaseRenderer;

// No additional type exports needed - types are already exported above