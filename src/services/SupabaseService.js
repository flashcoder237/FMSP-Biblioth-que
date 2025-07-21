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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
// src/services/SupabaseService.ts
var supabase_js_1 = require("@supabase/supabase-js");
// Service Supabase pour la gestion de la bibliothèque
var SupabaseService = /** @class */ (function () {
    function SupabaseService() {
        this.currentUser = null;
        this.currentInstitution = null;
        // Configuration Supabase avec les vraies clés
        var supabaseUrl = 'https://krojphsvzuwtgxxkjklj.supabase.co';
        var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2pwaHN2enV3dGd4eGtqa2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzMwMTMsImV4cCI6MjA2ODA0OTAxM30.U8CvDXnn84ow2984GIiZqMcAE1-Pc6lGavTVqm_fLtQ';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.initializeAuth();
    }
    SupabaseService.prototype.initializeAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var session, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.supabase.auth.getSession()];
                    case 1:
                        session = (_a.sent()).data.session;
                        if (!(session === null || session === void 0 ? void 0 : session.user)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadUserProfile(session.user.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Erreur lors de l\'initialisation de l\'authentification:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Authentication
    SupabaseService.prototype.signUp = function (email, password, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, institution, userProfile, _b, _c, _d, error_2;
            var _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.supabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                    data: {
                                        first_name: userData.firstName,
                                        last_name: userData.lastName,
                                        role: userData.role || 'user'
                                    }
                                }
                            })];
                    case 1:
                        _a = _g.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user) return [3 /*break*/, 8];
                        if (!userData.institutionCode) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getInstitutionByCode(userData.institutionCode)];
                    case 2:
                        institution = _g.sent();
                        if (!institution) {
                            throw new Error('Code d\'établissement invalide');
                        }
                        _g.label = 3;
                    case 3:
                        _b = this.createUserProfile;
                        _c = [data.user.id];
                        _e = {
                            email: data.user.email,
                            first_name: userData.firstName,
                            last_name: userData.lastName,
                            role: userData.role || 'user'
                        };
                        if (!userData.institutionCode) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getInstitutionByCode(userData.institutionCode)];
                    case 4:
                        _d = (_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.id;
                        return [3 /*break*/, 6];
                    case 5:
                        _d = undefined;
                        _g.label = 6;
                    case 6: return [4 /*yield*/, _b.apply(this, _c.concat([(_e.institution_id = _d,
                                _e.is_active = true,
                                _e)]))];
                    case 7:
                        userProfile = _g.sent();
                        return [2 /*return*/, { success: true, user: userProfile }];
                    case 8: return [2 /*return*/, { success: false, error: 'Erreur lors de la création du compte' }];
                    case 9:
                        error_2 = _g.sent();
                        return [2 /*return*/, { success: false, error: error_2.message }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SupabaseService.prototype.signIn = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, userProfile, _b, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.supabase.auth.signInWithPassword({
                                email: email,
                                password: password
                            })];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.loadUserProfile(data.user.id)];
                    case 2:
                        userProfile = _c.sent();
                        if (!(userProfile && userProfile.institution_id)) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, this.getInstitution(userProfile.institution_id)];
                    case 3:
                        _b.currentInstitution = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, {
                            success: true,
                            user: userProfile,
                            institution: this.currentInstitution || undefined
                        }];
                    case 5: return [2 /*return*/, { success: false, error: 'Erreur de connexion' }];
                    case 6:
                        error_3 = _c.sent();
                        return [2 /*return*/, { success: false, error: error_3.message }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SupabaseService.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.supabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        this.currentUser = null;
                        this.currentInstitution = null;
                        return [2 /*return*/, true];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Erreur lors de la déconnexion:', error_4);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Institution Management
    SupabaseService.prototype.createInstitution = function (institutionData) {
        return __awaiter(this, void 0, void 0, function () {
            var code, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        code = this.generateInstitutionCode();
                        return [4 /*yield*/, this.supabase
                                .from('institutions')
                                .insert(__assign(__assign({}, institutionData), { code: code, status: 'active', subscription_plan: 'basic', max_books: 1000, max_users: 10 }))
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!this.currentUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.supabase
                                .from('users')
                                .update({
                                institution_id: data.id,
                                role: 'admin'
                            })
                                .eq('id', this.currentUser.id)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, { institution: data, code: code }];
                }
            });
        });
    };
    SupabaseService.prototype.generateInstitutionCode = function () {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = '';
        for (var i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    SupabaseService.prototype.getInstitutionByCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase
                            .from('institutions')
                            .select('*')
                            .eq('code', code.toUpperCase())
                            .eq('status', 'active')
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, null];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SupabaseService.prototype.getInstitution = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase
                            .from('institutions')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, null];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    // User Profile Management
    SupabaseService.prototype.createUserProfile = function (userId, profileData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase
                            .from('users')
                            .insert(__assign(__assign({ id: userId }, profileData), { is_active: true }))
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SupabaseService.prototype.loadUserProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase
                            .from('users')
                            .select('*')
                            .eq('id', userId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, null];
                        this.currentUser = data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    // Books Management - Méthodes simplifiées pour le test
    SupabaseService.prototype.getBooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Pour l'instant, retourner un tableau vide pour éviter les erreurs de table manquante
                console.log('getBooks appelé - retour de données de test');
                return [2 /*return*/, []];
            });
        });
    };
    SupabaseService.prototype.addBook = function (book) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('addBook appelé avec:', book);
                return [2 /*return*/, 1]; // ID fictif pour le test
            });
        });
    };
    SupabaseService.prototype.updateBook = function (book) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateBook appelé avec:', book);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteBook = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteBook appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.searchBooks = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('searchBooks appelé avec query:', query);
                return [2 /*return*/, []];
            });
        });
    };
    // Borrowers Management - Méthodes simplifiées
    SupabaseService.prototype.getBorrowers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getBorrowers appelé');
                return [2 /*return*/, []];
            });
        });
    };
    SupabaseService.prototype.addBorrower = function (borrower) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('addBorrower appelé avec:', borrower);
                return [2 /*return*/, 1];
            });
        });
    };
    SupabaseService.prototype.updateBorrower = function (borrower) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateBorrower appelé avec:', borrower);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteBorrower = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteBorrower appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.searchBorrowers = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('searchBorrowers appelé avec query:', query);
                return [2 /*return*/, []];
            });
        });
    };
    // Borrow Management - Méthodes simplifiées
    SupabaseService.prototype.borrowBook = function (bookId, borrowerId, expectedReturnDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('borrowBook appelé avec:', { bookId: bookId, borrowerId: borrowerId, expectedReturnDate: expectedReturnDate });
                return [2 /*return*/, 1];
            });
        });
    };
    SupabaseService.prototype.returnBook = function (borrowHistoryId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('returnBook appelé avec:', { borrowHistoryId: borrowHistoryId, notes: notes });
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.getBorrowedBooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getBorrowedBooks appelé');
                return [2 /*return*/, []];
            });
        });
    };
    SupabaseService.prototype.getBorrowHistory = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getBorrowHistory appelé avec filter:', filter);
                return [2 /*return*/, []];
            });
        });
    };
    // Authors and Categories - Méthodes simplifiées
    SupabaseService.prototype.getAuthors = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getAuthors appelé');
                return [2 /*return*/, []];
            });
        });
    };
    SupabaseService.prototype.addAuthor = function (author) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('addAuthor appelé avec:', author);
                return [2 /*return*/, 1];
            });
        });
    };
    SupabaseService.prototype.getCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getCategories appelé');
                return [2 /*return*/, []];
            });
        });
    };
    SupabaseService.prototype.addCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('addCategory appelé avec:', category);
                return [2 /*return*/, 1];
            });
        });
    };
    // Statistics - Méthodes simplifiées
    SupabaseService.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('getStats appelé');
                return [2 /*return*/, {
                        totalBooks: 0,
                        borrowedBooks: 0,
                        availableBooks: 0,
                        totalAuthors: 0,
                        totalCategories: 0,
                        totalBorrowers: 0,
                        totalStudents: 0,
                        totalStaff: 0,
                        overdueBooks: 0
                    }];
            });
        });
    };
    // Getters
    SupabaseService.prototype.getCurrentUser = function () {
        return this.currentUser;
    };
    SupabaseService.prototype.getCurrentInstitution = function () {
        return this.currentInstitution;
    };
    // Utility methods
    SupabaseService.prototype.isAuthenticated = function () {
        return this.currentUser !== null;
    };
    SupabaseService.prototype.switchInstitution = function (institutionCode) {
        return __awaiter(this, void 0, void 0, function () {
            var institution, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getInstitutionByCode(institutionCode)];
                    case 1:
                        institution = _a.sent();
                        if (!institution)
                            return [2 /*return*/, false];
                        // Vérifier que l'utilisateur a accès à cette institution
                        if (this.currentUser && this.currentUser.institution_id !== institution.id) {
                            // Seuls les super_admin peuvent changer d'institution
                            if (this.currentUser.role !== 'super_admin') {
                                return [2 /*return*/, false];
                            }
                        }
                        this.currentInstitution = institution;
                        return [2 /*return*/, true];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Erreur lors du changement d\'institution:', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SupabaseService.prototype.clearAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('clearAllData appelé');
                return [2 /*return*/, true];
            });
        });
    };
    // Méthodes CRUD supplémentaires pour la compatibilité
    SupabaseService.prototype.createDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('createDocument appelé avec:', document);
                return [2 /*return*/, null];
            });
        });
    };
    SupabaseService.prototype.updateDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateDocument appelé avec:', document);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteDocument = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteDocument appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.createAuthor = function (author) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('createAuthor appelé avec:', author);
                return [2 /*return*/, null];
            });
        });
    };
    SupabaseService.prototype.updateAuthor = function (author) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateAuthor appelé avec:', author);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteAuthor = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteAuthor appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.createCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('createCategory appelé avec:', category);
                return [2 /*return*/, null];
            });
        });
    };
    SupabaseService.prototype.updateCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateCategory appelé avec:', category);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteCategory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteCategory appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.createBorrower = function (borrower) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('createBorrower appelé avec:', borrower);
                return [2 /*return*/, null];
            });
        });
    };
    SupabaseService.prototype.createBorrowHistory = function (borrowHistory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('createBorrowHistory appelé avec:', borrowHistory);
                return [2 /*return*/, null];
            });
        });
    };
    SupabaseService.prototype.updateBorrowHistory = function (borrowHistory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('updateBorrowHistory appelé avec:', borrowHistory);
                return [2 /*return*/, true];
            });
        });
    };
    SupabaseService.prototype.deleteBorrowHistory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('deleteBorrowHistory appelé avec ID:', id);
                return [2 /*return*/, true];
            });
        });
    };
    return SupabaseService;
}());
exports.SupabaseService = SupabaseService;
