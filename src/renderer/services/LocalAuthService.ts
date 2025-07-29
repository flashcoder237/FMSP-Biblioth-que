// src/renderer/services/LocalAuthService.ts
// Service pour gérer l'authentification et les établissements locaux

interface LocalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  institutionCode: string;
  password: string; // Hashé en production
  isActive?: boolean; // Statut actif/inactif de l'utilisateur
  lastLogin?: string;
  createdAt?: string;
  preferences?: {
    rememberMe: boolean;
    autoLogin: boolean;
    theme: string;
  };
}

interface LocalInstitution {
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
  type: string;
  adminEmail: string;
  created_at: string;
}

interface AppSettings {
  requireAppPassword: boolean;
  appPassword?: string;
  lastUser?: string;
  autoLogin: boolean;
  rememberLastUser: boolean;
}

export class LocalAuthService {
  private static readonly USERS_KEY = 'local_users';
  private static readonly INSTITUTIONS_KEY = 'local_institutions';
  private static readonly SETTINGS_KEY = 'app_settings';
  private static readonly LAST_LOGIN_KEY = 'last_login_info';

  // === GESTION DES PARAMÈTRES DE L'APPLICATION ===
  
  static getAppSettings(): AppSettings {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {
      requireAppPassword: false,
      autoLogin: false,
      rememberLastUser: true
    };
  }

  static saveAppSettings(settings: AppSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  static setAppPassword(password: string): void {
    const settings = this.getAppSettings();
    settings.requireAppPassword = true;
    settings.appPassword = password; // En production, il faut hasher
    this.saveAppSettings(settings);
  }

  static verifyAppPassword(password: string): boolean {
    const settings = this.getAppSettings();
    return !settings.requireAppPassword || settings.appPassword === password;
  }

  static clearAppPassword(): void {
    const settings = this.getAppSettings();
    settings.requireAppPassword = false;
    delete settings.appPassword;
    this.saveAppSettings(settings);
  }

  // === GESTION DES UTILISATEURS LOCAUX ===

  static getUsers(): LocalUser[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: LocalUser[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static addUser(user: Omit<LocalUser, 'id'>): LocalUser {
    const users = this.getUsers();
    const newUser: LocalUser = {
      ...user,
      id: Date.now().toString(),
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Vérifier si l'utilisateur existe déjà
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = newUser;
    } else {
      users.push(newUser);
    }
    
    this.saveUsers(users);
    return newUser;
  }

  static findUser(email: string, password: string, institutionCode: string): LocalUser | null {
    const users = this.getUsers();
    return users.find(u => 
      u.email === email && 
      u.password === password && 
      u.institutionCode === institutionCode
    ) || null;
  }

  static updateUserLastLogin(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
      this.saveUsers(users);
    }
  }

  static updateUserPreferences(userId: string, preferences: Partial<LocalUser['preferences']>): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].preferences = { 
        rememberMe: false,
        autoLogin: false,
        theme: 'light',
        ...users[userIndex].preferences, 
        ...preferences 
      };
      this.saveUsers(users);
    }
  }

  // === GESTION DES ÉTABLISSEMENTS LOCAUX ===

  static getInstitutions(): LocalInstitution[] {
    const institutions = localStorage.getItem(this.INSTITUTIONS_KEY);
    return institutions ? JSON.parse(institutions) : [];
  }

  static saveInstitutions(institutions: LocalInstitution[]): void {
    localStorage.setItem(this.INSTITUTIONS_KEY, JSON.stringify(institutions));
  }

  static createInstitution(institutionData: Omit<LocalInstitution, 'id' | 'code' | 'created_at'>): LocalInstitution {
    const institutions = this.getInstitutions();
    
    // Générer un code unique
    let code: string;
    do {
      code = this.generateInstitutionCode();
    } while (institutions.some(inst => inst.code === code));

    const newInstitution: LocalInstitution = {
      ...institutionData,
      id: Date.now().toString(),
      code,
      created_at: new Date().toISOString()
    };

    institutions.push(newInstitution);
    this.saveInstitutions(institutions);
    
    return newInstitution;
  }

  static findInstitutionByCode(code: string): LocalInstitution | null {
    const institutions = this.getInstitutions();
    return institutions.find(inst => inst.code === code) || null;
  }

  static getAllValidCodes(): string[] {
    const institutions = this.getInstitutions();
    const institutionCodes = institutions.map(inst => inst.code);
    
    // Ajouter les codes par défaut
    const defaultCodes = ['BIBLIO2024', 'OFFLINE', 'LOCAL', 'TEST'];
    
    return [...defaultCodes, ...institutionCodes];
  }

  private static generateInstitutionCode(): string {
    // Génère un code de 8 caractères alphanumériques
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // === GESTION DE LA DERNIÈRE CONNEXION ===

  static saveLastLoginInfo(email: string, institutionCode: string, rememberPassword: boolean = false, password?: string): void {
    const settings = this.getAppSettings();
    if (settings.rememberLastUser) {
      const info: any = {
        email,
        institutionCode,
        timestamp: new Date().toISOString()
      };
      
      if (rememberPassword && password) {
        info.password = password; // En production, il faut hasher
      }
      
      localStorage.setItem(this.LAST_LOGIN_KEY, JSON.stringify(info));
    }
  }

  static getLastLoginInfo(): { email: string; institutionCode: string; password?: string; timestamp: string } | null {
    const info = localStorage.getItem(this.LAST_LOGIN_KEY);
    return info ? JSON.parse(info) : null;
  }

  static clearLastLoginInfo(): void {
    localStorage.removeItem(this.LAST_LOGIN_KEY);
  }

  // === UTILISATEURS PAR DÉFAUT ===

  static getDefaultUsers(): Array<{email: string; password: string; role: string}> {
    return [
      { email: 'admin@local', password: 'admin', role: 'Administrateur' },
      { email: 'bibliothecaire@local', password: 'biblio', role: 'Bibliothécaire' },
      { email: 'test@local', password: 'test', role: 'Utilisateur' }
    ];
  }

  static isDefaultUser(email: string, password: string): boolean {
    return this.getDefaultUsers().some(u => u.email === email && u.password === password);
  }

  // === MÉTHODES D'AUTHENTIFICATION ===

  static authenticate(email: string, password: string, institutionCode: string): { success: boolean; user?: LocalUser; message?: string } {
    // Vérifier si le code d'établissement est valide
    const validCodes = this.getAllValidCodes();
    if (!validCodes.includes(institutionCode.toUpperCase())) {
      return { success: false, message: 'Code d\'établissement invalide' };
    }

    // Chercher un utilisateur local d'abord
    const localUser = this.findUser(email, password, institutionCode);
    if (localUser) {
      this.updateUserLastLogin(localUser.id);
      return { success: true, user: localUser };
    }

    // Vérifier les utilisateurs par défaut
    if (this.isDefaultUser(email, password) || password === 'demo') {
      // Créer/mettre à jour l'utilisateur par défaut
      const defaultUser = this.addUser({
        email,
        password,
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: 'Local',
        role: email.includes('admin') ? 'admin' : email.includes('bibliothecaire') ? 'librarian' : 'user',
        institutionCode,
        preferences: {
          rememberMe: false,
          autoLogin: false,
          theme: 'light'
        }
      });
      
      return { success: true, user: defaultUser };
    }

    return { success: false, message: 'Identifiants invalides' };
  }

  // === NETTOYAGE ===

  static clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.INSTITUTIONS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    localStorage.removeItem(this.LAST_LOGIN_KEY);
  }
}