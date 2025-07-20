"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
// src/services/SupabaseService.ts
const supabase_js_1 = require("@supabase/supabase-js");
class SupabaseService {
    constructor() {
        this.currentUser = null;
        this.currentInstitution = null;
        // Remplacez par vos vraies clés Supabase
        const supabaseUrl = process.env.SUPABASE_URL || 'https://krojphsvzuwtgxxkjklj.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_secret_JNPF92fpKY4ndSFx37dwNA_jS77-XEw';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.initializeAuth();
    }
    async initializeAuth() {
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session?.user) {
            await this.loadUserProfile(session.user.id);
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
    // Books Management
    async getBooks() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('books')
            .select(`
        *,
        borrower:borrowers(id, firstName, lastName, type, matricule)
      `)
            .eq('institution_id', this.currentInstitution.id)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data.map(book => ({
            id: parseInt(book.id),
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            publishedDate: book.publishedDate,
            description: book.description,
            coverUrl: book.coverUrl,
            isBorrowed: book.isBorrowed,
            borrowerId: book.borrowerId ? parseInt(book.borrowerId) : undefined,
            borrowDate: book.borrowDate,
            expectedReturnDate: book.expectedReturnDate,
            returnDate: book.returnDate,
            borrowerName: book.borrower ? `${book.borrower.firstName} ${book.borrower.lastName}` : undefined,
            createdAt: book.created_at
        }));
    }
    async addBook(book) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const { data, error } = await this.supabase
            .from('books')
            .insert({
            ...book,
            institution_id: this.currentInstitution.id,
            created_by: this.currentUser.id,
            isBorrowed: book.isBorrowed || false
        })
            .select()
            .single();
        if (error) {
            if (error.code === '23505' && error.message.includes('isbn')) {
                throw new Error('Un livre avec cet ISBN existe déjà');
            }
            throw error;
        }
        return parseInt(data.id);
    }
    async updateBook(book) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        if (book.id === undefined) {
            throw new Error('Book id is undefined');
        }
        const { error } = await this.supabase
            .from('books')
            .update({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            publishedDate: book.publishedDate,
            description: book.description,
            coverUrl: book.coverUrl,
            isBorrowed: book.isBorrowed,
            borrowerId: book.borrowerId?.toString(),
            borrowDate: book.borrowDate,
            expectedReturnDate: book.expectedReturnDate,
            returnDate: book.returnDate,
            updated_by: this.currentUser.id,
            updated_at: new Date().toISOString()
        })
            .eq('id', book.id.toString())
            .eq('institution_id', this.currentInstitution.id);
        if (error)
            throw error;
        return true;
    }
    async deleteBook(id) {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        // Vérifier s'il n'y a pas d'emprunts actifs
        const { data: activeLoans } = await this.supabase
            .from('borrow_history')
            .select('id')
            .eq('book_id', id.toString())
            .eq('status', 'active')
            .eq('institution_id', this.currentInstitution.id);
        if (activeLoans && activeLoans.length > 0) {
            throw new Error('Impossible de supprimer : ce livre est actuellement emprunté');
        }
        const { error } = await this.supabase
            .from('books')
            .delete()
            .eq('id', id.toString())
            .eq('institution_id', this.currentInstitution.id);
        if (error)
            throw error;
        return true;
    }
    async searchBooks(query) {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('books')
            .select('*')
            .eq('institution_id', this.currentInstitution.id)
            .or(`title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`);
        if (error)
            throw error;
        return data.map(book => ({
            id: parseInt(book.id),
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            publishedDate: book.publishedDate,
            description: book.description,
            coverUrl: book.coverUrl,
            isBorrowed: book.isBorrowed,
            borrowerId: book.borrowerId ? parseInt(book.borrowerId) : undefined,
            borrowDate: book.borrowDate,
            expectedReturnDate: book.expectedReturnDate,
            returnDate: book.returnDate,
            createdAt: book.created_at
        }));
    }
    // Borrowers Management
    async getBorrowers() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('borrowers')
            .select('*')
            .eq('institution_id', this.currentInstitution.id)
            .order('lastName', { ascending: true });
        if (error)
            throw error;
        return data.map(borrower => ({
            id: parseInt(borrower.id),
            type: borrower.type,
            firstName: borrower.firstName,
            lastName: borrower.lastName,
            matricule: borrower.matricule,
            classe: borrower.classe,
            cniNumber: borrower.cniNumber,
            position: borrower.position,
            email: borrower.email,
            phone: borrower.phone,
            createdAt: borrower.created_at
        }));
    }
    async addBorrower(borrower) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const { data, error } = await this.supabase
            .from('borrowers')
            .insert({
            ...borrower,
            institution_id: this.currentInstitution.id,
            created_by: this.currentUser.id
        })
            .select()
            .single();
        if (error) {
            if (error.code === '23505' && error.message.includes('matricule')) {
                throw new Error('Un emprunteur avec ce matricule existe déjà');
            }
            throw error;
        }
        return parseInt(data.id);
    }
    async updateBorrower(borrower) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        if (borrower.id === undefined) {
            throw new Error('Borrower id is undefined');
        }
        const { error } = await this.supabase
            .from('borrowers')
            .update({
            type: borrower.type,
            firstName: borrower.firstName,
            lastName: borrower.lastName,
            matricule: borrower.matricule,
            classe: borrower.classe,
            cniNumber: borrower.cniNumber,
            position: borrower.position,
            email: borrower.email,
            phone: borrower.phone,
            updated_by: this.currentUser.id,
            updated_at: new Date().toISOString()
        })
            .eq('id', borrower.id.toString())
            .eq('institution_id', this.currentInstitution.id);
        if (error)
            throw error;
        return true;
    }
    async deleteBorrower(id) {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        // Vérifier s'il n'y a pas d'emprunts actifs
        const { data: activeLoans } = await this.supabase
            .from('borrow_history')
            .select('id')
            .eq('borrower_id', id.toString())
            .eq('status', 'active')
            .eq('institution_id', this.currentInstitution.id);
        if (activeLoans && activeLoans.length > 0) {
            throw new Error('Impossible de supprimer : cet emprunteur a des livres non rendus');
        }
        const { error } = await this.supabase
            .from('borrowers')
            .delete()
            .eq('id', id.toString())
            .eq('institution_id', this.currentInstitution.id);
        if (error)
            throw error;
        return true;
    }
    async searchBorrowers(query) {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('borrowers')
            .select('*')
            .eq('institution_id', this.currentInstitution.id)
            .or(`firstName.ilike.%${query}%,lastName.ilike.%${query}%,matricule.ilike.%${query}%,classe.ilike.%${query}%,position.ilike.%${query}%`);
        if (error)
            throw error;
        return data.map(borrower => ({
            id: parseInt(borrower.id),
            type: borrower.type,
            firstName: borrower.firstName,
            lastName: borrower.lastName,
            matricule: borrower.matricule,
            classe: borrower.classe,
            cniNumber: borrower.cniNumber,
            position: borrower.position,
            email: borrower.email,
            phone: borrower.phone,
            createdAt: borrower.created_at
        }));
    }
    // Borrow Management
    async borrowBook(bookId, borrowerId, expectedReturnDate) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const borrowDate = new Date().toISOString();
        // Transaction pour mettre à jour le livre et créer l'historique
        const { data, error } = await this.supabase.rpc('borrow_book_transaction', {
            p_book_id: bookId.toString(),
            p_borrower_id: borrowerId.toString(),
            p_borrow_date: borrowDate,
            p_expected_return_date: expectedReturnDate,
            p_institution_id: this.currentInstitution.id,
            p_created_by: this.currentUser.id
        });
        if (error)
            throw error;
        return parseInt(data);
    }
    async returnBook(borrowHistoryId, notes) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const returnDate = new Date().toISOString();
        const { error } = await this.supabase.rpc('return_book_transaction', {
            p_history_id: borrowHistoryId.toString(),
            p_return_date: returnDate,
            p_notes: notes || null,
            p_institution_id: this.currentInstitution.id,
            p_updated_by: this.currentUser.id
        });
        if (error)
            throw error;
        return true;
    }
    async getBorrowedBooks() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('borrow_history')
            .select(`
        *,
        book:books(id, title, author, category, coverUrl, isbn, publishedDate, description),
        borrower:borrowers(id, firstName, lastName, type, matricule, classe, position)
      `)
            .eq('institution_id', this.currentInstitution.id)
            .eq('status', 'active')
            .order('borrowDate', { ascending: false });
        if (error)
            throw error;
        return data.map(item => ({
            id: parseInt(item.id),
            bookId: parseInt(item.book_id),
            borrowerId: parseInt(item.borrower_id),
            borrowDate: item.borrowDate,
            expectedReturnDate: item.expectedReturnDate,
            actualReturnDate: item.actualReturnDate,
            status: item.status,
            notes: item.notes,
            createdAt: item.created_at,
            book: item.book ? {
                id: parseInt(item.book.id),
                title: item.book.title,
                author: item.book.author,
                category: item.book.category,
                coverUrl: item.book.coverUrl,
                isbn: item.book.isbn,
                publishedDate: item.book.publishedDate,
                description: item.book.description,
                isBorrowed: true
            } : undefined,
            borrower: item.borrower ? {
                id: parseInt(item.borrower.id),
                firstName: item.borrower.firstName,
                lastName: item.borrower.lastName,
                type: item.borrower.type,
                matricule: item.borrower.matricule,
                classe: item.borrower.classe,
                position: item.borrower.position
            } : undefined
        }));
    }
    async getBorrowHistory(filter) {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        let query = this.supabase
            .from('borrow_history')
            .select(`
        *,
        book:books(id, title, author, category, coverUrl, isbn, publishedDate, description),
        borrower:borrowers(id, firstName, lastName, type, matricule, classe, position)
      `)
            .eq('institution_id', this.currentInstitution.id);
        if (filter) {
            if (filter.startDate) {
                query = query.gte('borrowDate', filter.startDate);
            }
            if (filter.endDate) {
                query = query.lte('borrowDate', filter.endDate + ' 23:59:59');
            }
            if (filter.borrowerType && filter.borrowerType !== 'all') {
                query = query.eq('borrower.type', filter.borrowerType);
            }
            if (filter.status && filter.status !== 'all') {
                query = query.eq('status', filter.status);
            }
            if (filter.borrowerId) {
                query = query.eq('borrower_id', filter.borrowerId.toString());
            }
            if (filter.bookId) {
                query = query.eq('book_id', filter.bookId.toString());
            }
        }
        const { data, error } = await query.order('borrowDate', { ascending: false });
        if (error)
            throw error;
        return data.map(item => ({
            id: parseInt(item.id),
            bookId: parseInt(item.book_id),
            borrowerId: parseInt(item.borrower_id),
            borrowDate: item.borrowDate,
            expectedReturnDate: item.expectedReturnDate,
            actualReturnDate: item.actualReturnDate,
            status: item.status,
            notes: item.notes,
            createdAt: item.created_at,
            book: item.book ? {
                id: parseInt(item.book.id),
                title: item.book.title,
                author: item.book.author,
                category: item.book.category,
                coverUrl: item.book.coverUrl,
                isbn: item.book.isbn,
                publishedDate: item.book.publishedDate,
                description: item.book.description,
                isBorrowed: true
            } : undefined,
            borrower: item.borrower ? {
                id: parseInt(item.borrower.id),
                firstName: item.borrower.firstName,
                lastName: item.borrower.lastName,
                type: item.borrower.type,
                matricule: item.borrower.matricule,
                classe: item.borrower.classe,
                position: item.borrower.position
            } : undefined
        }));
    }
    // Authors and Categories
    async getAuthors() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('authors')
            .select('*')
            .eq('institution_id', this.currentInstitution.id)
            .order('name', { ascending: true });
        if (error)
            throw error;
        return data.map(author => ({
            id: parseInt(author.id),
            name: author.name,
            biography: author.biography,
            birthDate: author.birthDate,
            nationality: author.nationality
        }));
    }
    async addAuthor(author) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const { data, error } = await this.supabase
            .from('authors')
            .insert({
            ...author,
            institution_id: this.currentInstitution.id,
            created_by: this.currentUser.id
        })
            .select()
            .single();
        if (error)
            throw error;
        return parseInt(data.id);
    }
    async getCategories() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('institution_id', this.currentInstitution.id)
            .order('name', { ascending: true });
        if (error)
            throw error;
        return data.map(category => ({
            id: parseInt(category.id),
            name: category.name,
            description: category.description,
            color: category.color
        }));
    }
    async addCategory(category) {
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        const { data, error } = await this.supabase
            .from('categories')
            .insert({
            ...category,
            institution_id: this.currentInstitution.id,
            created_by: this.currentUser.id
        })
            .select()
            .single();
        if (error)
            throw error;
        return parseInt(data.id);
    }
    // Statistics
    async getStats() {
        if (!this.currentInstitution)
            throw new Error('Aucune institution sélectionnée');
        const [{ count: totalBooks }, { count: borrowedBooks }, { count: totalAuthors }, { count: totalCategories }, { count: totalBorrowers }, { count: totalStudents }, { count: totalStaff }, { count: overdueBooks }] = await Promise.all([
            this.supabase.from('books').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id),
            this.supabase.from('books').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id).eq('isBorrowed', true),
            this.supabase.from('authors').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id),
            this.supabase.from('categories').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id),
            this.supabase.from('borrowers').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id),
            this.supabase.from('borrowers').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id).eq('type', 'student'),
            this.supabase.from('borrowers').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id).eq('type', 'staff'),
            this.supabase.from('borrow_history').select('*', { count: 'exact', head: true }).eq('institution_id', this.currentInstitution.id).eq('status', 'active').lt('expectedReturnDate', new Date().toISOString())
        ]);
        return {
            totalBooks: totalBooks || 0,
            borrowedBooks: borrowedBooks || 0,
            availableBooks: (totalBooks || 0) - (borrowedBooks || 0),
            totalAuthors: totalAuthors || 0,
            totalCategories: totalCategories || 0,
            totalBorrowers: totalBorrowers || 0,
            totalStudents: totalStudents || 0,
            totalStaff: totalStaff || 0,
            overdueBooks: overdueBooks || 0
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
        if (!this.currentInstitution || !this.currentUser) {
            throw new Error('Utilisateur ou institution non connecté');
        }
        // Seuls les admins peuvent effacer toutes les données
        if (this.currentUser.role !== 'admin' && this.currentUser.role !== 'super_admin') {
            throw new Error('Permissions insuffisantes');
        }
        try {
            // Supprimer dans l'ordre inverse des dépendances
            await this.supabase.from('borrow_history').delete().eq('institution_id', this.currentInstitution.id);
            await this.supabase.from('books').delete().eq('institution_id', this.currentInstitution.id);
            await this.supabase.from('borrowers').delete().eq('institution_id', this.currentInstitution.id);
            await this.supabase.from('authors').delete().eq('institution_id', this.currentInstitution.id);
            await this.supabase.from('categories').delete().eq('institution_id', this.currentInstitution.id);
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la suppression des données:', error);
            return false;
        }
    }
}
exports.SupabaseService = SupabaseService;
