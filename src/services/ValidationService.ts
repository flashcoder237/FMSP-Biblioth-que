// Service de validation sécurisé
import { configService } from './ConfigService';
import { logger } from './LoggerService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface PasswordValidationOptions {
  allowCommonPatterns?: boolean;
  checkDictionary?: boolean;
}

class ValidationService {
  
  /**
   * Valide un mot de passe selon la politique de sécurité
   */
  validatePassword(password: string, options: PasswordValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const policy = configService.getPasswordPolicy();

    // Longueur minimale
    if (password.length < policy.minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${policy.minLength} caractères`);
    }

    // Vérification des caractères majuscules
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    }

    // Vérification des caractères minuscules
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }

    // Vérification des chiffres
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    // Vérification des caractères spéciaux
    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    // Vérifications de sécurité avancées
    if (!options.allowCommonPatterns) {
      // Vérifier les patterns communs
      if (this.containsCommonPatterns(password)) {
        errors.push('Le mot de passe contient des patterns trop prévisibles');
      }

      // Vérifier les mots de passe couramment utilisés
      if (this.isCommonPassword(password)) {
        errors.push('Ce mot de passe est trop commun et facilement devinable');
      }
    }

    // Vérifier la répétition de caractères
    if (this.hasExcessiveRepetition(password)) {
      warnings.push('Évitez les répétitions excessives de caractères');
    }

    // Vérifier les séquences
    if (this.hasSequentialChars(password)) {
      warnings.push('Évitez les séquences de caractères (123, abc, etc.)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide une adresse email
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    // Pattern RFC 5322 simplifié mais robuste
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email) {
      errors.push('L\'adresse email est requise');
    } else if (!emailRegex.test(email)) {
      errors.push('Format d\'adresse email invalide');
    } else {
      // Vérifications supplémentaires
      if (email.length > 254) {
        errors.push('L\'adresse email est trop longue');
      }

      // Vérifier les caractères suspects
      if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
        errors.push('Format d\'adresse email invalide');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un nom d'utilisateur
   */
  validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    if (!username) {
      errors.push('Le nom d\'utilisateur est requis');
    } else {
      if (username.length < 3) {
        errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      }

      if (username.length > 50) {
        errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
      }

      // Caractères autorisés : lettres, chiffres, tirets, underscores
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
      }

      // Ne peut pas commencer ou finir par un tiret ou underscore
      if (/^[-_]|[-_]$/.test(username)) {
        errors.push('Le nom d\'utilisateur ne peut pas commencer ou finir par un tiret ou underscore');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide les données d'un document
   */
  validateDocument(document: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Champs requis
    const requiredFields = ['titre', 'auteur', 'editeur', 'annee', 'cote'];
    
    for (const field of requiredFields) {
      if (!document[field] || String(document[field]).trim() === '') {
        errors.push(`Le champ "${field}" est requis`);
      }
    }

    // Validation spécifique des champs
    if (document.titre && document.titre.length > 500) {
      errors.push('Le titre ne peut pas dépasser 500 caractères');
    }

    if (document.auteur && document.auteur.length > 200) {
      errors.push('Le nom de l\'auteur ne peut pas dépasser 200 caractères');
    }

    if (document.annee) {
      const year = parseInt(document.annee);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year) || year < 1000 || year > currentYear + 1) {
        errors.push('L\'année doit être une année valide');
      }
    }

    // Validation de l'ISBN si présent
    if (document.isbn && !this.validateISBN(document.isbn)) {
      warnings.push('Le format ISBN semble incorrect');
    }

    // Validation de la cote (doit être unique)
    if (document.cote && document.cote.length > 50) {
      errors.push('La cote ne peut pas dépasser 50 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide un ISBN
   */
  private validateISBN(isbn: string): boolean {
    // Nettoyer l'ISBN
    const cleanISBN = isbn.replace(/[-\s]/g, '');

    // ISBN-10
    if (cleanISBN.length === 10) {
      return this.validateISBN10(cleanISBN);
    }

    // ISBN-13
    if (cleanISBN.length === 13) {
      return this.validateISBN13(cleanISBN);
    }

    return false;
  }

  /**
   * Valide un ISBN-10
   */
  private validateISBN10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i]);
      if (isNaN(digit)) return false;
      sum += digit * (10 - i);
    }

    const checkDigit = isbn[9];
    const calculatedCheck = (11 - (sum % 11)) % 11;
    
    return (calculatedCheck === 10 ? 'X' : calculatedCheck.toString()) === checkDigit;
  }

  /**
   * Valide un ISBN-13
   */
  private validateISBN13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i]);
      if (isNaN(digit)) return false;
      sum += digit * (i % 2 === 0 ? 1 : 3);
    }

    const checkDigit = parseInt(isbn[12]);
    const calculatedCheck = (10 - (sum % 10)) % 10;
    
    return calculatedCheck === checkDigit;
  }

  /**
   * Vérifie si le mot de passe contient des patterns communs
   */
  private containsCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /password/i,
      /123456/,
      /qwerty/i,
      /admin/i,
      /letmein/i,
      /welcome/i,
      /monkey/i,
      /dragon/i
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Vérifie si c'est un mot de passe couramment utilisé
   */
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      '123456', 'password', '123456789', '12345678', '12345',
      '1234567', '1234567890', 'qwerty', 'abc123', 'password1',
      'admin', 'letmein', 'welcome', '123123', 'Password',
      'password123', '000000', '111111', '666666', '121212'
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Vérifie la répétition excessive de caractères
   */
  private hasExcessiveRepetition(password: string): boolean {
    // Plus de 2 caractères identiques consécutifs
    return /(.)\1{2,}/.test(password);
  }

  /**
   * Vérifie les séquences de caractères
   */
  private hasSequentialChars(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'qwertyuiopasdfghjklzxcvbnm'
    ];

    const lowerPassword = password.toLowerCase();
    
    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const seq = sequence.substring(i, i + 3);
        const reverseSeq = seq.split('').reverse().join('');
        
        if (lowerPassword.includes(seq) || lowerPassword.includes(reverseSeq)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Sanitise une chaîne pour éviter les injections
   */
  sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Supprime les balises HTML basiques
      .replace(/['"]/g, '') // Supprime les guillemets pour éviter les injections SQL
      .substring(0, 1000); // Limite la longueur
  }

  /**
   * Valide et sanitise une entrée utilisateur
   */
  validateAndSanitizeInput(input: string, maxLength: number = 255): { value: string; isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input) {
      errors.push('La valeur est requise');
      return { value: '', isValid: false, errors };
    }

    const sanitized = this.sanitizeString(input);

    if (sanitized.length === 0) {
      errors.push('La valeur contient des caractères non autorisés');
    }

    if (sanitized.length > maxLength) {
      errors.push(`La valeur ne peut pas dépasser ${maxLength} caractères`);
    }

    return {
      value: sanitized,
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un numéro de téléphone
   */
  validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];

    if (!phone) {
      return { isValid: true, errors }; // Optionnel
    }

    // Pattern pour numéros internationaux
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Format de numéro de téléphone invalide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Instance singleton
export const validationService = new ValidationService();
export default validationService;