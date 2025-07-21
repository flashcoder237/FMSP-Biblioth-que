"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
// src/services/SupabaseService.ts
const supabase_js_1 = require("@supabase/supabase-js");
// Service Supabase pour la gestion de la bibliothèque
class SupabaseService {
    constructor() {
        this.currentUser = null;
        this.currentInstitution = null;
        // Configuration Supabase avec les vraies clés
        const supabaseUrl = 'https://krojphsvzuwtgxxkjklj.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2pwaHN2enV3dGd4eGtqa2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzMwMTMsImV4cCI6MjA2ODA0OTAxM30.U8CvDXnn84ow2984GIiZqMcAE1-Pc6lGavTVqm_fLtQ';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.initializeAuth();
    }
    async initializeAuth() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session?.user) {
                await this.loadUserProfile(session.user.id);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        }
    }
    // Authentication
    async signUp(email, password, userData) {
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
            if (error)
                throw error;
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
                    email: data.user.email,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    role: userData.role || 'user',
                    institution_id: userData.institutionCode ? (await this.getInstitutionByCode(userData.institutionCode))?.id : undefined,
                    is_active: true
                });
                return { success: true, user: userProfile };
            }
            return { success: false, error: 'Erreur lors de la création du compte' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error)
                throw error;
            if (data.user) {
                const userProfile = await this.loadUserProfile(data.user.id);
                if (userProfile && userProfile.institution_id) {
                    this.currentInstitution = await this.getInstitution(userProfile.institution_id);
                }
                return {
                    success: true,
                    user: userProfile,
                    institution: this.currentInstitution || undefined
                };
            }
            return { success: false, error: 'Erreur de connexion' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error)
                throw error;
            this.currentUser = null;
            this.currentInstitution = null;
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return false;
        }
    }
    // Institution Management
    async createInstitution(institutionData) {
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
        if (error)
            throw error;
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
    generateInstitutionCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async getInstitutionByCode(code) {
        const { data, error } = await this.supabase
            .from('institutions')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('status', 'active')
            .single();
        if (error)
            return null;
        return data;
    }
    async getInstitution(id) {
        const { data, error } = await this.supabase
            .from('institutions')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    }
    // User Profile Management
    async createUserProfile(userId, profileData) {
        const { data, error } = await this.supabase
            .from('users')
            .insert({
            id: userId,
            ...profileData,
            is_active: true
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async loadUserProfile(userId) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error)
            return null;
        this.currentUser = data;
        return data;
    }
    // Books Management - Méthodes simplifiées pour le test
    async getBooks() {
        // Pour l'instant, retourner un tableau vide pour éviter les erreurs de table manquante
        console.log('getBooks appelé - retour de données de test');
        return [];
    }
    async addBook(book) {
        console.log('addBook appelé avec:', book);
        return 1; // ID fictif pour le test
    }
    async updateBook(book) {
        console.log('updateBook appelé avec:', book);
        return true;
    }
    async deleteBook(id) {
        console.log('deleteBook appelé avec ID:', id);
        return true;
    }
    async searchBooks(query) {
        console.log('searchBooks appelé avec query:', query);
        return [];
    }
    // Borrowers Management - Méthodes simplifiées
    async getBorrowers() {
        console.log('getBorrowers appelé');
        return [];
    }
    async addBorrower(borrower) {
        console.log('addBorrower appelé avec:', borrower);
        return 1;
    }
    async updateBorrower(borrower) {
        console.log('updateBorrower appelé avec:', borrower);
        return true;
    }
    async deleteBorrower(id) {
        console.log('deleteBorrower appelé avec ID:', id);
        return true;
    }
    async searchBorrowers(query) {
        console.log('searchBorrowers appelé avec query:', query);
        return [];
    }
    // Borrow Management - Méthodes simplifiées
    async borrowBook(bookId, borrowerId, expectedReturnDate) {
        console.log('borrowBook appelé avec:', { bookId, borrowerId, expectedReturnDate });
        return 1;
    }
    async returnBook(borrowHistoryId, notes) {
        console.log('returnBook appelé avec:', { borrowHistoryId, notes });
        return true;
    }
    async getBorrowedBooks() {
        console.log('getBorrowedBooks appelé');
        return [];
    }
    async getBorrowHistory(filter) {
        console.log('getBorrowHistory appelé avec filter:', filter);
        return [];
    }
    // Authors and Categories - Méthodes simplifiées
    async getAuthors() {
        console.log('getAuthors appelé');
        return [];
    }
    async addAuthor(author) {
        console.log('addAuthor appelé avec:', author);
        return 1;
    }
    async getCategories() {
        console.log('getCategories appelé');
        return [];
    }
    async addCategory(category) {
        console.log('addCategory appelé avec:', category);
        return 1;
    }
    // Statistics - Méthodes simplifiées
    async getStats() {
        console.log('getStats appelé');
        return {
            totalBooks: 0,
            borrowedBooks: 0,
            availableBooks: 0,
            totalAuthors: 0,
            totalCategories: 0,
            totalBorrowers: 0,
            totalStudents: 0,
            totalStaff: 0,
            overdueBooks: 0
        };
    }
    // Getters
    getCurrentUser() {
        return this.currentUser;
    }
    getCurrentInstitution() {
        return this.currentInstitution;
    }
    // Utility methods
    isAuthenticated() {
        return this.currentUser !== null;
    }
    async switchInstitution(institutionCode) {
        try {
            const institution = await this.getInstitutionByCode(institutionCode);
            if (!institution)
                return false;
            // Vérifier que l'utilisateur a accès à cette institution
            if (this.currentUser && this.currentUser.institution_id !== institution.id) {
                // Seuls les super_admin peuvent changer d'institution
                if (this.currentUser.role !== 'super_admin') {
                    return false;
                }
            }
            this.currentInstitution = institution;
            return true;
        }
        catch (error) {
            console.error('Erreur lors du changement d\'institution:', error);
            return false;
        }
    }
    async clearAllData() {
        console.log('clearAllData appelé');
        return true;
    }
    // Méthodes CRUD supplémentaires pour la compatibilité
    async createDocument(document) {
        console.log('createDocument appelé avec:', document);
        return null;
    }
    async updateDocument(document) {
        console.log('updateDocument appelé avec:', document);
        return true;
    }
    async deleteDocument(id) {
        console.log('deleteDocument appelé avec ID:', id);
        return true;
    }
    async createAuthor(author) {
        console.log('createAuthor appelé avec:', author);
        return null;
    }
    async updateAuthor(author) {
        console.log('updateAuthor appelé avec:', author);
        return true;
    }
    async deleteAuthor(id) {
        console.log('deleteAuthor appelé avec ID:', id);
        return true;
    }
    async createCategory(category) {
        console.log('createCategory appelé avec:', category);
        return null;
    }
    async updateCategory(category) {
        console.log('updateCategory appelé avec:', category);
        return true;
    }
    async deleteCategory(id) {
        console.log('deleteCategory appelé avec ID:', id);
        return true;
    }
    async createBorrower(borrower) {
        console.log('createBorrower appelé avec:', borrower);
        return null;
    }
    async createBorrowHistory(borrowHistory) {
        console.log('createBorrowHistory appelé avec:', borrowHistory);
        return null;
    }
    async updateBorrowHistory(borrowHistory) {
        console.log('updateBorrowHistory appelé avec:', borrowHistory);
        return true;
    }
    async deleteBorrowHistory(id) {
        console.log('deleteBorrowHistory appelé avec ID:', id);
        return true;
    }
}
exports.SupabaseService = SupabaseService;
//# sourceMappingURL=SupabaseService.js.map