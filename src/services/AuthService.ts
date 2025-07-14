import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { app } from 'electron';
import { AuthCredentials, AuthResponse } from '../preload';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'librarian' | 'user';
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
}

export interface Session {
  id: string;
  userId: number;
  username: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export class AuthService {
  private usersFilePath: string;
  private sessionsFilePath: string;
  private users: User[] = [];
  private sessions: Session[] = [];
  private currentSession: Session | null = null;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.usersFilePath = path.join(userDataPath, 'users.json');
    this.sessionsFilePath = path.join(userDataPath, 'sessions.json');
    
    this.loadUsers();
    this.loadSessions();
    this.createDefaultAdmin();
  }

  private loadUsers(): void {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const data = fs.readFileSync(this.usersFilePath, 'utf8');
        this.users = JSON.parse(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      this.users = [];
    }
  }

  private saveUsers(): void {
    try {
      fs.writeFileSync(this.usersFilePath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
  }

  private loadSessions(): void {
    try {
      if (fs.existsSync(this.sessionsFilePath)) {
        const data = fs.readFileSync(this.sessionsFilePath, 'utf8');
        this.sessions = JSON.parse(data);
        
        // Nettoyer les sessions expirées
        this.cleanExpiredSessions();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
      this.sessions = [];
    }
  }

  private saveSessions(): void {
    try {
      fs.writeFileSync(this.sessionsFilePath, JSON.stringify(this.sessions, null, 2));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sessions:', error);
    }
  }

  private createDefaultAdmin(): void {
    // Vérifier si un administrateur existe déjà
    const adminExists = this.users.some(user => user.role === 'admin');
    
    if (!adminExists) {
      // Créer l'utilisateur admin par défaut
      const defaultAdmin: Omit<User, 'id'> = {
        username: 'admin',
        passwordHash: '',
        salt: '',
        role: 'admin',
        email: 'admin@bibliotheque.local',
        firstName: 'Administrateur',
        lastName: 'Système',
        isActive: true,
        createdAt: new Date().toISOString(),
        loginAttempts: 0
      };

      // Hasher le mot de passe par défaut
      const { hash, salt } = this.hashPassword('admin');
      defaultAdmin.passwordHash = hash;
      defaultAdmin.salt = salt;

      this.users.push({
        ...defaultAdmin,
        id: this.users.length + 1
      });

      // Créer aussi un utilisateur démo
      const demoUser: Omit<User, 'id'> = {
        username: 'demo',
        passwordHash: '',
        salt: '',
        role: 'librarian',
        email: 'demo@bibliotheque.local',
        firstName: 'Démo',
        lastName: 'Utilisateur',
        isActive: true,
        createdAt: new Date().toISOString(),
        loginAttempts: 0
      };

      const demoPass = this.hashPassword('demo');
      demoUser.passwordHash = demoPass.hash;
      demoUser.salt = demoPass.salt;

      this.users.push({
        ...demoUser,
        id: this.users.length + 1
      });

      // Créer l'utilisateur biblio
      const biblioUser: Omit<User, 'id'> = {
        username: 'biblio',
        passwordHash: '',
        salt: '',
        role: 'librarian',
        email: 'biblio@bibliotheque.local',
        firstName: 'Bibliothécaire',
        lastName: 'Principal',
        isActive: true,
        createdAt: new Date().toISOString(),
        loginAttempts: 0
      };

      const biblioPass = this.hashPassword('biblio');
      biblioUser.passwordHash = biblioPass.hash;
      biblioUser.salt = biblioPass.salt;

      this.users.push({
        ...biblioUser,
        id: this.users.length + 1
      });

      this.saveUsers();
    }
  }

  private hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const passwordSalt = salt || crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');
    
    return {
      hash,
      salt: passwordSalt
    };
  }

  private verifyPassword(password: string, hash: string, salt: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private cleanExpiredSessions(): void {
    const now = new Date();
    this.sessions = this.sessions.filter(session => {
      const expiresAt = new Date(session.expiresAt);
      return expiresAt > now && session.isActive;
    });
    this.saveSessions();
  }

  private isUserLocked(user: User): boolean {
    if (user.lockedUntil) {
      const lockExpires = new Date(user.lockedUntil);
      if (new Date() < lockExpires) {
        return true;
      } else {
        // Le verrouillage a expiré, réinitialiser
        user.lockedUntil = undefined;
        user.loginAttempts = 0;
        this.saveUsers();
        return false;
      }
    }
    return false;
  }

  private lockUser(user: User): void {
    user.loginAttempts += 1;
    
    if (user.loginAttempts >= 5) {
      // Verrouiller pour 15 minutes
      const lockDuration = 15 * 60 * 1000; // 15 minutes en millisecondes
      user.lockedUntil = new Date(Date.now() + lockDuration).toISOString();
    }
    
    this.saveUsers();
  }

  private resetLoginAttempts(user: User): void {
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    this.saveUsers();
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Nettoyer les sessions expirées
      this.cleanExpiredSessions();

      const user = this.users.find(u => 
        u.username === credentials.username && u.isActive
      );

      if (!user) {
        return {
          success: false,
          error: 'Nom d\'utilisateur ou mot de passe incorrect'
        };
      }

      // Vérifier si l'utilisateur est verrouillé
      if (this.isUserLocked(user)) {
        const lockExpires = new Date(user.lockedUntil!);
        const minutesLeft = Math.ceil((lockExpires.getTime() - Date.now()) / (60 * 1000));
        return {
          success: false,
          error: `Compte verrouillé. Réessayez dans ${minutesLeft} minute(s)`
        };
      }

      // Vérifier le mot de passe
      const isValidPassword = this.verifyPassword(
        credentials.password, 
        user.passwordHash, 
        user.salt
      );

      if (!isValidPassword) {
        this.lockUser(user);
        return {
          success: false,
          error: 'Nom d\'utilisateur ou mot de passe incorrect'
        };
      }

      // Réinitialiser les tentatives de connexion
      this.resetLoginAttempts(user);

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      this.saveUsers();

      // Créer une nouvelle session
      const sessionId = this.generateSessionId();
      const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 heure
      
      const session: Session = {
        id: sessionId,
        userId: user.id,
        username: user.username,
        role: user.role,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true
      };

      this.sessions.push(session);
      this.currentSession = session;
      this.saveSessions();

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          lastLogin: user.lastLogin || user.createdAt
        }
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur'
      };
    }
  }

  logout(): boolean {
    try {
      if (this.currentSession) {
        // Marquer la session comme inactive
        const session = this.sessions.find(s => s.id === this.currentSession!.id);
        if (session) {
          session.isActive = false;
        }
        
        this.currentSession = null;
        this.saveSessions();
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    if (!this.currentSession) {
      return false;
    }

    // Vérifier si la session est encore valide
    const expiresAt = new Date(this.currentSession.expiresAt);
    const now = new Date();

    if (now >= expiresAt || !this.currentSession.isActive) {
      this.currentSession = null;
      return false;
    }

    return true;
  }

  getCurrentUser(): User | null {
    if (!this.isAuthenticated() || !this.currentSession) {
      return null;
    }

    return this.users.find(u => u.id === this.currentSession!.userId) || null;
  }

  getCurrentSession(): Session | null {
    return this.isAuthenticated() ? this.currentSession : null;
  }

  // Méthodes d'administration des utilisateurs
  createUser(userData: {
    username: string;
    password: string;
    role: 'admin' | 'librarian' | 'user';
    email?: string;
    firstName?: string;
    lastName?: string;
  }): { success: boolean; user?: User; error?: string } {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = this.users.find(u => u.username === userData.username);
      if (existingUser) {
        return {
          success: false,
          error: 'Un utilisateur avec ce nom existe déjà'
        };
      }

      // Hasher le mot de passe
      const { hash, salt } = this.hashPassword(userData.password);

      const newUser: User = {
        id: Math.max(...this.users.map(u => u.id), 0) + 1,
        username: userData.username,
        passwordHash: hash,
        salt: salt,
        role: userData.role,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: true,
        createdAt: new Date().toISOString(),
        loginAttempts: 0
      };

      this.users.push(newUser);
      this.saveUsers();

      // Retourner l'utilisateur sans les données sensibles
      const { passwordHash, salt: userSalt, ...safeUser } = newUser;
      
      return {
        success: true,
        user: safeUser as User
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur'
      };
    }
  }

  updateUser(userId: number, userData: Partial<{
    username: string;
    password: string;
    role: 'admin' | 'librarian' | 'user';
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  }>): { success: boolean; error?: string } {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Vérifier l'unicité du nom d'utilisateur si modifié
      if (userData.username && userData.username !== user.username) {
        const existingUser = this.users.find(u => u.username === userData.username);
        if (existingUser) {
          return {
            success: false,
            error: 'Ce nom d\'utilisateur est déjà utilisé'
          };
        }
        user.username = userData.username;
      }

      // Mettre à jour le mot de passe si fourni
      if (userData.password) {
        const { hash, salt } = this.hashPassword(userData.password);
        user.passwordHash = hash;
        user.salt = salt;
        user.loginAttempts = 0; // Réinitialiser les tentatives
        user.lockedUntil = undefined;
      }

      // Mettre à jour les autres champs
      if (userData.role !== undefined) user.role = userData.role;
      if (userData.email !== undefined) user.email = userData.email;
      if (userData.firstName !== undefined) user.firstName = userData.firstName;
      if (userData.lastName !== undefined) user.lastName = userData.lastName;
      if (userData.isActive !== undefined) user.isActive = userData.isActive;

      this.saveUsers();

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour'
      };
    }
  }

  deleteUser(userId: number): { success: boolean; error?: string } {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Ne pas supprimer le dernier administrateur
      const user = this.users[userIndex];
      if (user.role === 'admin') {
        const adminCount = this.users.filter(u => u.role === 'admin' && u.isActive).length;
        if (adminCount <= 1) {
          return {
            success: false,
            error: 'Impossible de supprimer le dernier administrateur'
          };
        }
      }

      this.users.splice(userIndex, 1);
      this.saveUsers();

      // Invalider les sessions de cet utilisateur
      this.sessions = this.sessions.filter(s => s.userId !== userId);
      this.saveSessions();

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression'
      };
    }
  }

  getAllUsers(): Omit<User, 'passwordHash' | 'salt'>[] {
    return this.users.map(({ passwordHash, salt, ...user }) => user);
  }

  getActiveSessions(): Session[] {
    this.cleanExpiredSessions();
    return this.sessions.filter(s => s.isActive);
  }

  invalidateSession(sessionId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.isActive = false;
      this.saveSessions();
      return true;
    }
    return false;
  }

  invalidateAllUserSessions(userId: number): void {
    this.sessions = this.sessions.map(session => {
      if (session.userId === userId) {
        session.isActive = false;
      }
      return session;
    });
    this.saveSessions();
  }

  // Méthodes utilitaires
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = this.verifyPassword(currentPassword, user.passwordHash, user.salt);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Mot de passe actuel incorrect'
        };
      }

      // Valider le nouveau mot de passe
      const validation = this.validatePassword(newPassword);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Mettre à jour le mot de passe
      const { hash, salt } = this.hashPassword(newPassword);
      user.passwordHash = hash;
      user.salt = salt;
      user.loginAttempts = 0;
      user.lockedUntil = undefined;

      this.saveUsers();

      return { success: true };
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return {
        success: false,
        error: 'Erreur lors du changement de mot de passe'
      };
    }
  }

  resetPassword(userId: number, newPassword: string): { success: boolean; error?: string } {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Valider le nouveau mot de passe
      const validation = this.validatePassword(newPassword);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Mettre à jour le mot de passe
      const { hash, salt } = this.hashPassword(newPassword);
      user.passwordHash = hash;
      user.salt = salt;
      user.loginAttempts = 0;
      user.lockedUntil = undefined;

      this.saveUsers();

      // Invalider toutes les sessions de cet utilisateur
      this.invalidateAllUserSessions(userId);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      return {
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe'
      };
    }
  }

  getLoginAttempts(username: string): number {
    const user = this.users.find(u => u.username === username);
    return user ? user.loginAttempts : 0;
  }

  unlockUser(userId: number): { success: boolean; error?: string } {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      user.loginAttempts = 0;
      user.lockedUntil = undefined;
      this.saveUsers();

      return { success: true };
    } catch (error) {
      console.error('Erreur lors du déverrouillage de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur lors du déverrouillage'
      };
    }
  }

  // Méthodes d'audit et de sécurité
  getLoginHistory(limit: number = 50): Array<{
    username: string;
    loginTime: string;
    success: boolean;
    ip?: string;
  }> {
    // Pour l'instant, retourner les dernières connexions des sessions
    return this.sessions
      .slice(-limit)
      .map(session => ({
        username: session.username,
        loginTime: session.createdAt,
        success: true
      }));
  }

  getSecurityStats(): {
    totalUsers: number;
    activeUsers: number;
    lockedUsers: number;
    activeSessions: number;
    adminUsers: number;
  } {
    const now = new Date();
    const lockedUsers = this.users.filter(user => {
      if (user.lockedUntil) {
        const lockExpires = new Date(user.lockedUntil);
        return now < lockExpires;
      }
      return false;
    });

    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.isActive).length,
      lockedUsers: lockedUsers.length,
      activeSessions: this.getActiveSessions().length,
      adminUsers: this.users.filter(u => u.role === 'admin' && u.isActive).length
    };
  }

  // Méthodes de maintenance
  cleanupInactiveSessions(): number {
    const initialCount = this.sessions.length;
    this.cleanExpiredSessions();
    return initialCount - this.sessions.length;
  }

  exportUsers(): string {
    const safeUsers = this.users.map(({ passwordHash, salt, ...user }) => user);
    return JSON.stringify(safeUsers, null, 2);
  }

  // Méthode pour vérifier l'intégrité des données
  validateDataIntegrity(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier qu'il y a au moins un administrateur actif
    const activeAdmins = this.users.filter(u => u.role === 'admin' && u.isActive);
    if (activeAdmins.length === 0) {
      errors.push('Aucun administrateur actif trouvé');
    }

    // Vérifier l'unicité des noms d'utilisateur
    const usernames = this.users.map(u => u.username);
    const uniqueUsernames = new Set(usernames);
    if (usernames.length !== uniqueUsernames.size) {
      errors.push('Noms d\'utilisateur en double détectés');
    }

    // Vérifier la validité des sessions
    const validSessions = this.sessions.filter(session => {
      const user = this.users.find(u => u.id === session.userId);
      return user && user.isActive;
    });

    if (validSessions.length !== this.sessions.filter(s => s.isActive).length) {
      errors.push('Sessions orphelines détectées');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}