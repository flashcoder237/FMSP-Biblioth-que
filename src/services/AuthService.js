"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var electron_1 = require("electron");
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.users = [];
        this.sessions = [];
        this.currentSession = null;
        var userDataPath = electron_1.app.getPath('userData');
        this.usersFilePath = path.join(userDataPath, 'users.json');
        this.sessionsFilePath = path.join(userDataPath, 'sessions.json');
        this.loadUsers();
        this.loadSessions();
        this.createDefaultAdmin();
    }
    AuthService.prototype.loadUsers = function () {
        try {
            if (fs.existsSync(this.usersFilePath)) {
                var data = fs.readFileSync(this.usersFilePath, 'utf8');
                this.users = JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            this.users = [];
        }
    };
    AuthService.prototype.saveUsers = function () {
        try {
            fs.writeFileSync(this.usersFilePath, JSON.stringify(this.users, null, 2));
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        }
    };
    AuthService.prototype.loadSessions = function () {
        try {
            if (fs.existsSync(this.sessionsFilePath)) {
                var data = fs.readFileSync(this.sessionsFilePath, 'utf8');
                this.sessions = JSON.parse(data);
                // Nettoyer les sessions expirées
                this.cleanExpiredSessions();
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des sessions:', error);
            this.sessions = [];
        }
    };
    AuthService.prototype.saveSessions = function () {
        try {
            fs.writeFileSync(this.sessionsFilePath, JSON.stringify(this.sessions, null, 2));
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde des sessions:', error);
        }
    };
    AuthService.prototype.createDefaultAdmin = function () {
        // Vérifier si un administrateur existe déjà
        var adminExists = this.users.some(function (user) { return user.role === 'admin'; });
        if (!adminExists) {
            // Créer l'utilisateur admin par défaut
            var defaultAdmin = {
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
            var _a = this.hashPassword('admin'), hash = _a.hash, salt = _a.salt;
            defaultAdmin.passwordHash = hash;
            defaultAdmin.salt = salt;
            this.users.push(__assign(__assign({}, defaultAdmin), { id: this.users.length + 1 }));
            // Créer aussi un utilisateur démo
            var demoUser = {
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
            var demoPass = this.hashPassword('demo');
            demoUser.passwordHash = demoPass.hash;
            demoUser.salt = demoPass.salt;
            this.users.push(__assign(__assign({}, demoUser), { id: this.users.length + 1 }));
            // Créer l'utilisateur biblio
            var biblioUser = {
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
            var biblioPass = this.hashPassword('biblio');
            biblioUser.passwordHash = biblioPass.hash;
            biblioUser.salt = biblioPass.salt;
            this.users.push(__assign(__assign({}, biblioUser), { id: this.users.length + 1 }));
            this.saveUsers();
        }
    };
    AuthService.prototype.hashPassword = function (password, salt) {
        var passwordSalt = salt || crypto.randomBytes(32).toString('hex');
        var hash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');
        return {
            hash: hash,
            salt: passwordSalt
        };
    };
    AuthService.prototype.verifyPassword = function (password, hash, salt) {
        var verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === verifyHash;
    };
    AuthService.prototype.generateSessionId = function () {
        return crypto.randomBytes(32).toString('hex');
    };
    AuthService.prototype.cleanExpiredSessions = function () {
        var now = new Date();
        this.sessions = this.sessions.filter(function (session) {
            var expiresAt = new Date(session.expiresAt);
            return expiresAt > now && session.isActive;
        });
        this.saveSessions();
    };
    AuthService.prototype.isUserLocked = function (user) {
        if (user.lockedUntil) {
            var lockExpires = new Date(user.lockedUntil);
            if (new Date() < lockExpires) {
                return true;
            }
            else {
                // Le verrouillage a expiré, réinitialiser
                user.lockedUntil = undefined;
                user.loginAttempts = 0;
                this.saveUsers();
                return false;
            }
        }
        return false;
    };
    AuthService.prototype.lockUser = function (user) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            // Verrouiller pour 15 minutes
            var lockDuration = 15 * 60 * 1000; // 15 minutes en millisecondes
            user.lockedUntil = new Date(Date.now() + lockDuration).toISOString();
        }
        this.saveUsers();
    };
    AuthService.prototype.resetLoginAttempts = function (user) {
        user.loginAttempts = 0;
        user.lockedUntil = undefined;
        this.saveUsers();
    };
    AuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var user, lockExpires, minutesLeft, isValidPassword, sessionId, expiresAt, session;
            return __generator(this, function (_a) {
                try {
                    // Nettoyer les sessions expirées
                    this.cleanExpiredSessions();
                    user = this.users.find(function (u) {
                        return u.username === credentials.username && u.isActive;
                    });
                    if (!user) {
                        return [2 /*return*/, {
                                success: false,
                                error: 'Nom d\'utilisateur ou mot de passe incorrect'
                            }];
                    }
                    // Vérifier si l'utilisateur est verrouillé
                    if (this.isUserLocked(user)) {
                        lockExpires = new Date(user.lockedUntil);
                        minutesLeft = Math.ceil((lockExpires.getTime() - Date.now()) / (60 * 1000));
                        return [2 /*return*/, {
                                success: false,
                                error: "Compte verrouill\u00E9. R\u00E9essayez dans ".concat(minutesLeft, " minute(s)")
                            }];
                    }
                    isValidPassword = this.verifyPassword(credentials.password, user.passwordHash, user.salt);
                    if (!isValidPassword) {
                        this.lockUser(user);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Nom d\'utilisateur ou mot de passe incorrect'
                            }];
                    }
                    // Réinitialiser les tentatives de connexion
                    this.resetLoginAttempts(user);
                    // Mettre à jour la dernière connexion
                    user.lastLogin = new Date().toISOString();
                    this.saveUsers();
                    sessionId = this.generateSessionId();
                    expiresAt = new Date(Date.now() + (60 * 60 * 1000));
                    session = {
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
                    return [2 /*return*/, {
                            success: true,
                            user: {
                                id: user.id,
                                username: user.username,
                                role: user.role,
                                lastLogin: user.lastLogin || user.createdAt
                            }
                        }];
                }
                catch (error) {
                    console.error('Erreur lors de la connexion:', error);
                    return [2 /*return*/, {
                            success: false,
                            error: 'Erreur interne du serveur'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        try {
            if (this.currentSession) {
                // Marquer la session comme inactive
                var session = this.sessions.find(function (s) { return s.id === _this.currentSession.id; });
                if (session) {
                    session.isActive = false;
                }
                this.currentSession = null;
                this.saveSessions();
            }
            return true;
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return false;
        }
    };
    AuthService.prototype.isAuthenticated = function () {
        if (!this.currentSession) {
            return false;
        }
        // Vérifier si la session est encore valide
        var expiresAt = new Date(this.currentSession.expiresAt);
        var now = new Date();
        if (now >= expiresAt || !this.currentSession.isActive) {
            this.currentSession = null;
            return false;
        }
        return true;
    };
    AuthService.prototype.getCurrentUser = function () {
        var _this = this;
        if (!this.isAuthenticated() || !this.currentSession) {
            return null;
        }
        return this.users.find(function (u) { return u.id === _this.currentSession.userId; }) || null;
    };
    AuthService.prototype.getCurrentSession = function () {
        return this.isAuthenticated() ? this.currentSession : null;
    };
    // Méthodes d'administration des utilisateurs
    AuthService.prototype.createUser = function (userData) {
        try {
            // Vérifier si l'utilisateur existe déjà
            var existingUser = this.users.find(function (u) { return u.username === userData.username; });
            if (existingUser) {
                return {
                    success: false,
                    error: 'Un utilisateur avec ce nom existe déjà'
                };
            }
            // Hasher le mot de passe
            var _a = this.hashPassword(userData.password), hash = _a.hash, salt = _a.salt;
            var newUser = {
                id: Math.max.apply(Math, __spreadArray(__spreadArray([], this.users.map(function (u) { return u.id; }), false), [0], false)) + 1,
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
            var passwordHash = newUser.passwordHash, userSalt = newUser.salt, safeUser = __rest(newUser, ["passwordHash", "salt"]);
            return {
                success: true,
                user: safeUser
            };
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la création de l\'utilisateur'
            };
        }
    };
    AuthService.prototype.updateUser = function (userId, userData) {
        try {
            var user = this.users.find(function (u) { return u.id === userId; });
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Vérifier l'unicité du nom d'utilisateur si modifié
            if (userData.username && userData.username !== user.username) {
                var existingUser = this.users.find(function (u) { return u.username === userData.username; });
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
                var _a = this.hashPassword(userData.password), hash = _a.hash, salt = _a.salt;
                user.passwordHash = hash;
                user.salt = salt;
                user.loginAttempts = 0; // Réinitialiser les tentatives
                user.lockedUntil = undefined;
            }
            // Mettre à jour les autres champs
            if (userData.role !== undefined)
                user.role = userData.role;
            if (userData.email !== undefined)
                user.email = userData.email;
            if (userData.firstName !== undefined)
                user.firstName = userData.firstName;
            if (userData.lastName !== undefined)
                user.lastName = userData.lastName;
            if (userData.isActive !== undefined)
                user.isActive = userData.isActive;
            this.saveUsers();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la mise à jour'
            };
        }
    };
    AuthService.prototype.deleteUser = function (userId) {
        try {
            var userIndex = this.users.findIndex(function (u) { return u.id === userId; });
            if (userIndex === -1) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Ne pas supprimer le dernier administrateur
            var user = this.users[userIndex];
            if (user.role === 'admin') {
                var adminCount = this.users.filter(function (u) { return u.role === 'admin' && u.isActive; }).length;
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
            this.sessions = this.sessions.filter(function (s) { return s.userId !== userId; });
            this.saveSessions();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors de la suppression'
            };
        }
    };
    AuthService.prototype.getAllUsers = function () {
        return this.users.map(function (_a) {
            var passwordHash = _a.passwordHash, salt = _a.salt, user = __rest(_a, ["passwordHash", "salt"]);
            return user;
        });
    };
    AuthService.prototype.getActiveSessions = function () {
        this.cleanExpiredSessions();
        return this.sessions.filter(function (s) { return s.isActive; });
    };
    AuthService.prototype.invalidateSession = function (sessionId) {
        var session = this.sessions.find(function (s) { return s.id === sessionId; });
        if (session) {
            session.isActive = false;
            this.saveSessions();
            return true;
        }
        return false;
    };
    AuthService.prototype.invalidateAllUserSessions = function (userId) {
        this.sessions = this.sessions.map(function (session) {
            if (session.userId === userId) {
                session.isActive = false;
            }
            return session;
        });
        this.saveSessions();
    };
    // Méthodes utilitaires
    AuthService.prototype.validatePassword = function (password) {
        var errors = [];
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
            errors: errors
        };
    };
    AuthService.prototype.changePassword = function (userId, currentPassword, newPassword) {
        try {
            var user = this.users.find(function (u) { return u.id === userId; });
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Vérifier le mot de passe actuel
            var isCurrentPasswordValid = this.verifyPassword(currentPassword, user.passwordHash, user.salt);
            if (!isCurrentPasswordValid) {
                return {
                    success: false,
                    error: 'Mot de passe actuel incorrect'
                };
            }
            // Valider le nouveau mot de passe
            var validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Mettre à jour le mot de passe
            var _a = this.hashPassword(newPassword), hash = _a.hash, salt = _a.salt;
            user.passwordHash = hash;
            user.salt = salt;
            user.loginAttempts = 0;
            user.lockedUntil = undefined;
            this.saveUsers();
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            return {
                success: false,
                error: 'Erreur lors du changement de mot de passe'
            };
        }
    };
    AuthService.prototype.resetPassword = function (userId, newPassword) {
        try {
            var user = this.users.find(function (u) { return u.id === userId; });
            if (!user) {
                return {
                    success: false,
                    error: 'Utilisateur non trouvé'
                };
            }
            // Valider le nouveau mot de passe
            var validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Mettre à jour le mot de passe
            var _a = this.hashPassword(newPassword), hash = _a.hash, salt = _a.salt;
            user.passwordHash = hash;
            user.salt = salt;
            user.loginAttempts = 0;
            user.lockedUntil = undefined;
            this.saveUsers();
            // Invalider toutes les sessions de cet utilisateur
            this.invalidateAllUserSessions(userId);
            return { success: true };
        }
        catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            return {
                success: false,
                error: 'Erreur lors de la réinitialisation du mot de passe'
            };
        }
    };
    AuthService.prototype.getLoginAttempts = function (username) {
        var user = this.users.find(function (u) { return u.username === username; });
        return user ? user.loginAttempts : 0;
    };
    AuthService.prototype.unlockUser = function (userId) {
        try {
            var user = this.users.find(function (u) { return u.id === userId; });
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
        }
        catch (error) {
            console.error('Erreur lors du déverrouillage de l\'utilisateur:', error);
            return {
                success: false,
                error: 'Erreur lors du déverrouillage'
            };
        }
    };
    // Méthodes d'audit et de sécurité
    AuthService.prototype.getLoginHistory = function (limit) {
        if (limit === void 0) { limit = 50; }
        // Pour l'instant, retourner les dernières connexions des sessions
        return this.sessions
            .slice(-limit)
            .map(function (session) { return ({
            username: session.username,
            loginTime: session.createdAt,
            success: true
        }); });
    };
    AuthService.prototype.getSecurityStats = function () {
        var now = new Date();
        var lockedUsers = this.users.filter(function (user) {
            if (user.lockedUntil) {
                var lockExpires = new Date(user.lockedUntil);
                return now < lockExpires;
            }
            return false;
        });
        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(function (u) { return u.isActive; }).length,
            lockedUsers: lockedUsers.length,
            activeSessions: this.getActiveSessions().length,
            adminUsers: this.users.filter(function (u) { return u.role === 'admin' && u.isActive; }).length
        };
    };
    // Méthodes de maintenance
    AuthService.prototype.cleanupInactiveSessions = function () {
        var initialCount = this.sessions.length;
        this.cleanExpiredSessions();
        return initialCount - this.sessions.length;
    };
    AuthService.prototype.exportUsers = function () {
        var safeUsers = this.users.map(function (_a) {
            var passwordHash = _a.passwordHash, salt = _a.salt, user = __rest(_a, ["passwordHash", "salt"]);
            return user;
        });
        return JSON.stringify(safeUsers, null, 2);
    };
    // Méthode pour vérifier l'intégrité des données
    AuthService.prototype.validateDataIntegrity = function () {
        var _this = this;
        var errors = [];
        // Vérifier qu'il y a au moins un administrateur actif
        var activeAdmins = this.users.filter(function (u) { return u.role === 'admin' && u.isActive; });
        if (activeAdmins.length === 0) {
            errors.push('Aucun administrateur actif trouvé');
        }
        // Vérifier l'unicité des noms d'utilisateur
        var usernames = this.users.map(function (u) { return u.username; });
        var uniqueUsernames = new Set(usernames);
        if (usernames.length !== uniqueUsernames.size) {
            errors.push('Noms d\'utilisateur en double détectés');
        }
        // Vérifier la validité des sessions
        var validSessions = this.sessions.filter(function (session) {
            var user = _this.users.find(function (u) { return u.id === session.userId; });
            return user && user.isActive;
        });
        if (validSessions.length !== this.sessions.filter(function (s) { return s.isActive; }).length) {
            errors.push('Sessions orphelines détectées');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
    return AuthService;
}());
exports.AuthService = AuthService;
