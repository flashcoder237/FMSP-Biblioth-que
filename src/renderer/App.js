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
exports.App = void 0;
// src/renderer/App.tsx - Version modifiée pour Supabase
var react_1 = require("react");
var TitleBar_1 = require("./components/TitleBar");
var Sidebar_1 = require("./components/Sidebar");
var Dashboard_1 = require("./components/Dashboard");
var BookList_1 = require("./components/BookList");
var BorrowedBooks_1 = require("./components/BorrowedBooks");
var AddBook_1 = require("./components/AddBook");
var Borrowers_1 = require("./components/Borrowers");
var BorrowHistory_1 = require("./components/BorrowHistory");
var Settings_1 = require("./components/Settings");
var Donation_1 = require("./components/Donation");
var About_1 = require("./components/About");
var EnhancedAuthentication_1 = require("./components/EnhancedAuthentication");
var InstitutionSetup_1 = require("./components/InstitutionSetup");
var SupabaseService_1 = require("../services/SupabaseService");
var App = function () {
    var _a = (0, react_1.useState)('auth'), currentView = _a[0], setCurrentView = _a[1];
    var _b = (0, react_1.useState)(false), isAuthenticated = _b[0], setIsAuthenticated = _b[1];
    var _c = (0, react_1.useState)(null), currentUser = _c[0], setCurrentUser = _c[1];
    var _d = (0, react_1.useState)(null), currentInstitution = _d[0], setCurrentInstitution = _d[1];
    var _e = (0, react_1.useState)(''), institutionCode = _e[0], setInstitutionCode = _e[1];
    // Data states
    var _f = (0, react_1.useState)([]), books = _f[0], setBooks = _f[1];
    var _g = (0, react_1.useState)([]), authors = _g[0], setAuthors = _g[1];
    var _h = (0, react_1.useState)([]), categories = _h[0], setCategories = _h[1];
    var _j = (0, react_1.useState)([]), borrowers = _j[0], setBorrowers = _j[1];
    var _k = (0, react_1.useState)([]), borrowedBooks = _k[0], setBorrowedBooks = _k[1];
    var _l = (0, react_1.useState)({
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
        totalAuthors: 0,
        totalCategories: 0,
        totalBorrowers: 0,
        totalStudents: 0,
        totalStaff: 0,
        overdueBooks: 0
    }), stats = _l[0], setStats = _l[1];
    // Services
    var supabaseService = (0, react_1.useState)(function () { return new SupabaseService_1.SupabaseService(); })[0];
    var _m = (0, react_1.useState)(false), showBorrowModal = _m[0], setShowBorrowModal = _m[1];
    var _o = (0, react_1.useState)(null), selectedBook = _o[0], setSelectedBook = _o[1];
    var _p = (0, react_1.useState)(false), isLoading = _p[0], setIsLoading = _p[1];
    var _q = (0, react_1.useState)(''), error = _q[0], setError = _q[1];
    (0, react_1.useEffect)(function () {
        checkAuthStatus();
    }, []);
    var checkAuthStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, institution, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    user = supabaseService.getCurrentUser();
                    institution = supabaseService.getCurrentInstitution();
                    if (!(user && institution)) return [3 /*break*/, 2];
                    setCurrentUser(user);
                    setCurrentInstitution(institution);
                    setIsAuthenticated(true);
                    setCurrentView('dashboard');
                    return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    setCurrentView('auth');
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Erreur lors de la vérification de l\'authentification:', error_1);
                    setCurrentView('auth');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, booksData, authorsData, categoriesData, borrowersData, borrowedBooksData, statsData, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!supabaseService.isAuthenticated())
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, Promise.all([
                            supabaseService.getBooks(),
                            supabaseService.getAuthors(),
                            supabaseService.getCategories(),
                            supabaseService.getBorrowers(),
                            supabaseService.getBorrowedBooks(),
                            supabaseService.getStats()
                        ])];
                case 2:
                    _a = _b.sent(), booksData = _a[0], authorsData = _a[1], categoriesData = _a[2], borrowersData = _a[3], borrowedBooksData = _a[4], statsData = _a[5];
                    setBooks(booksData);
                    setAuthors(authorsData);
                    setCategories(categoriesData);
                    setBorrowers(borrowersData);
                    setBorrowedBooks(borrowedBooksData);
                    setStats(statsData);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _b.sent();
                    console.error('Erreur lors du chargement des données:', error_2);
                    setError('Erreur lors du chargement des données');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleAuthentication = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var result, switchSuccess, result, institutionResult, adminResult, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, 12, 13]);
                    setIsLoading(true);
                    setError('');
                    if (!(credentials.mode === 'login')) return [3 /*break*/, 5];
                    return [4 /*yield*/, supabaseService.signIn(credentials.email, credentials.password)];
                case 1:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error);
                    }
                    if (!credentials.institutionCode) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabaseService.switchInstitution(credentials.institutionCode)];
                case 2:
                    switchSuccess = _a.sent();
                    if (!switchSuccess) {
                        throw new Error('Code d\'établissement invalide ou accès non autorisé');
                    }
                    _a.label = 3;
                case 3:
                    setCurrentUser(result.user);
                    setCurrentInstitution(supabaseService.getCurrentInstitution());
                    setIsAuthenticated(true);
                    setCurrentView('dashboard');
                    return [4 /*yield*/, loadData()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 5:
                    if (!(credentials.mode === 'register')) return [3 /*break*/, 7];
                    return [4 /*yield*/, supabaseService.signUp(credentials.email, credentials.password, {
                            firstName: credentials.userData.firstName,
                            lastName: credentials.userData.lastName,
                            institutionCode: credentials.institutionCode,
                            role: credentials.userData.role
                        })];
                case 6:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error);
                    }
                    // Afficher un message de succès et rediriger vers login
                    alert('Compte créé avec succès ! Veuillez vérifier votre email et vous connecter.');
                    return [3 /*break*/, 10];
                case 7:
                    if (!(credentials.mode === 'create_institution')) return [3 /*break*/, 10];
                    return [4 /*yield*/, supabaseService.createInstitution(credentials.userData.institution)];
                case 8:
                    institutionResult = _a.sent();
                    setInstitutionCode(institutionResult.code);
                    return [4 /*yield*/, supabaseService.signUp(credentials.email, credentials.password, {
                            firstName: credentials.userData.admin.firstName,
                            lastName: credentials.userData.admin.lastName,
                            role: 'admin'
                        })];
                case 9:
                    adminResult = _a.sent();
                    if (!adminResult.success) {
                        throw new Error(adminResult.error);
                    }
                    setCurrentView('institution_setup');
                    _a.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11:
                    error_3 = _a.sent();
                    setError(error_3.message || 'Erreur d\'authentification');
                    throw error_3;
                case 12:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseService.signOut()];
                case 1:
                    _a.sent();
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                    setCurrentInstitution(null);
                    setCurrentView('auth');
                    // Réinitialiser les données
                    setBooks([]);
                    setAuthors([]);
                    setCategories([]);
                    setBorrowers([]);
                    setBorrowedBooks([]);
                    setStats({
                        totalBooks: 0,
                        borrowedBooks: 0,
                        availableBooks: 0,
                        totalAuthors: 0,
                        totalCategories: 0,
                        totalBorrowers: 0,
                        totalStudents: 0,
                        totalStaff: 0,
                        overdueBooks: 0
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Erreur lors de la déconnexion:', error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAddBook = function (book) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseService.addBook(book)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 2:
                    _a.sent();
                    setCurrentView('books');
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Erreur lors de l\'ajout du livre:', error_5);
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBorrowBook = function (bookId, borrowerId, expectedReturnDate) { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (bookId === undefined || borrowerId === undefined || !expectedReturnDate) {
                        console.error('Invalid arguments for borrowBook:', { bookId: bookId, borrowerId: borrowerId, expectedReturnDate: expectedReturnDate });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, supabaseService.borrowBook(bookId, borrowerId, expectedReturnDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 3:
                    _a.sent();
                    setShowBorrowModal(false);
                    setSelectedBook(null);
                    return [3 /*break*/, 5];
                case 4:
                    error_6 = _a.sent();
                    console.error('Erreur lors de l\'emprunt:', error_6);
                    throw error_6;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleReturnBook = function (borrowHistoryId, notes) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (borrowHistoryId === undefined) {
                        console.error('Invalid argument for returnBook:', { borrowHistoryId: borrowHistoryId });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, supabaseService.returnBook(borrowHistoryId, notes)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _a.sent();
                    console.error('Erreur lors du retour:', error_7);
                    throw error_7;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteBook = function (bookId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseService.deleteBook(bookId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error('Erreur lors de la suppression:', error_8);
                    throw error_8;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var openBorrowModal = function (book) {
        setSelectedBook(book);
        setShowBorrowModal(true);
    };
    var closeBorrowModal = function () {
        setShowBorrowModal(false);
        setSelectedBook(null);
    };
    var refreshData = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // Affichage de l'écran d'authentification
    if (!isAuthenticated) {
        if (currentView === 'institution_setup') {
            return (<InstitutionSetup_1.InstitutionSetup institutionCode={institutionCode} institution={currentInstitution} onComplete={function () {
                    setCurrentView('auth');
                    alert('Votre établissement a été créé avec succès ! Vous pouvez maintenant vous connecter.');
                }}/>);
        }
        return <EnhancedAuthentication_1.EnhancedAuthentication onLogin={handleAuthentication}/>;
    }
    var renderCurrentView = function () {
        switch (currentView) {
            case 'dashboard':
                return (<Dashboard_1.Dashboard stats={stats} onNavigate={setCurrentView} books={books} categories={categories}/>);
            case 'books':
                return (<BookList_1.BookList books={books} onBorrow={openBorrowModal} onDelete={handleDeleteBook}/>);
            case 'borrowed':
                return (<BorrowedBooks_1.BorrowedBooks books={borrowedBooks.map(function (bh) {
                        var _a, _b;
                        return (__assign(__assign({}, bh.book), { isBorrowed: true, borrowerId: bh.borrowerId, borrowDate: bh.borrowDate, borrowerName: "".concat((_a = bh.borrower) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = bh.borrower) === null || _b === void 0 ? void 0 : _b.lastName) }));
                    })} onReturn={function (bookId) {
                        var borrowHistory = borrowedBooks.find(function (bh) { return bh.bookId === bookId; });
                        if (borrowHistory) {
                            handleReturnBook(borrowHistory.id, undefined);
                        }
                    }}/>);
            case 'add-book':
                return (<AddBook_1.AddBook authors={authors} categories={categories} onAddBook={handleAddBook} onCancel={function () { return setCurrentView('books'); }}/>);
            case 'borrowers':
                return (<Borrowers_1.Borrowers onClose={function () { return setCurrentView('dashboard'); }} onRefreshData={refreshData} supabaseService={supabaseService}/>);
            case 'history':
                return (<BorrowHistory_1.BorrowHistory onClose={function () { return setCurrentView('dashboard'); }} supabaseService={supabaseService}/>);
            case 'settings':
                return (<Settings_1.Settings onClose={function () { return setCurrentView('dashboard'); }} onLogout={handleLogout} currentUser={currentUser} currentInstitution={currentInstitution} supabaseService={supabaseService}/>);
            case 'donation':
                return (<Donation_1.Donation onClose={function () { return setCurrentView('dashboard'); }}/>);
            case 'about':
                return (<About_1.About onClose={function () { return setCurrentView('dashboard'); }}/>);
            default:
                return (<Dashboard_1.Dashboard stats={stats} onNavigate={setCurrentView} books={books} categories={categories}/>);
        }
    };
    return (<div className="app">
      <TitleBar_1.TitleBar />
      <div className="app-container">
        <Sidebar_1.Sidebar currentView={currentView} onNavigate={setCurrentView} stats={stats} currentUser={currentUser} currentInstitution={currentInstitution}/>
        <main className="main-content">
          <div className="content-wrapper">
            {isLoading && (<div className="loading-overlay">
                <div className="loading-spinner"></div>
                <span>Chargement...</span>
              </div>)}
            {error && (<div className="error-banner">
                <span>{error}</span>
                <button onClick={function () { return setError(''); }}>×</button>
              </div>)}
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Enhanced Borrow Modal - utilise le service Supabase */}
      {showBorrowModal && selectedBook && (<div className="borrow-modal-overlay">
          <div className="borrow-modal">
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H13V9H19V21Z"/>
                  </svg>
                </div>
                <div className="header-text">
                  <h3>Nouvel emprunt</h3>
                  <p>Sélectionnez un emprunteur et définissez la durée</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeBorrowModal}>
                ×
              </button>
            </div>
            
            <EnhancedBorrowForm book={selectedBook} borrowers={borrowers} onSubmit={handleBorrowBook} onCancel={closeBorrowModal} onRefreshBorrowers={refreshData} supabaseService={supabaseService}/>
          </div>
        </div>)}
      
      <style>{"\n        .app {\n          height: 100vh;\n          display: flex;\n          flex-direction: column;\n          background: #FAF9F6;\n          overflow: hidden;\n        }\n        \n        .app-container {\n          flex: 1;\n          display: flex;\n          overflow: hidden;\n        }\n        \n        .main-content {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          background: #FAF9F6;\n          overflow: hidden;\n          position: relative;\n        }\n        \n        .content-wrapper {\n          flex: 1;\n          overflow: hidden;\n          border-radius: 12px 0 0 0;\n          background: #FAF9F6;\n          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);\n        }\n\n        .loading-overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(255, 255, 255, 0.9);\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          gap: 16px;\n        }\n\n        .loading-spinner {\n          width: 40px;\n          height: 40px;\n          border: 4px solid #E5DCC2;\n          border-top: 4px solid #3E5C49;\n          border-radius: 50%;\n          animation: spin 1s linear infinite;\n        }\n\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n\n        .error-banner {\n          background: #FEF2F2;\n          border: 1px solid #FECACA;\n          color: #DC2626;\n          padding: 12px 16px;\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          font-size: 14px;\n          font-weight: 500;\n        }\n\n        .error-banner button {\n          background: none;\n          border: none;\n          color: #DC2626;\n          cursor: pointer;\n          font-size: 18px;\n          padding: 0;\n          margin-left: 12px;\n        }\n\n        /* Enhanced Borrow Modal */\n        .borrow-modal-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.75);\n          backdrop-filter: blur(12px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n          animation: fadeIn 0.3s ease-out;\n        }\n        \n        @keyframes fadeIn {\n          from { opacity: 0; backdrop-filter: blur(0px); }\n          to { opacity: 1; backdrop-filter: blur(12px); }\n        }\n        \n        .borrow-modal {\n          background: #FFFFFF;\n          border-radius: 24px;\n          width: 100%;\n          max-width: 700px;\n          max-height: 90vh;\n          overflow-y: auto;\n          box-shadow: \n            0 32px 64px rgba(62, 92, 73, 0.25),\n            0 16px 32px rgba(62, 92, 73, 0.15);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n        }\n        \n        @keyframes slideUp {\n          from { \n            opacity: 0;\n            transform: translateY(32px) scale(0.95);\n          }\n          to { \n            opacity: 1;\n            transform: translateY(0) scale(1);\n          }\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: flex-start;\n          justify-content: space-between;\n          padding: 32px 32px 24px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .modal-header::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          right: 0;\n          width: 200px;\n          height: 100%;\n          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));\n          transform: skewX(-15deg);\n          transform-origin: top;\n        }\n        \n        .header-content {\n          display: flex;\n          align-items: flex-start;\n          gap: 20px;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .header-icon {\n          width: 48px;\n          height: 48px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 14px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n        }\n        \n        .header-text h3 {\n          font-size: 22px;\n          font-weight: 700;\n          color: #F3EED9;\n          margin: 0 0 6px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .header-text p {\n          font-size: 14px;\n          color: rgba(243, 238, 217, 0.9);\n          margin: 0;\n          line-height: 1.4;\n        }\n        \n        .modal-close {\n          background: rgba(243, 238, 217, 0.1);\n          border: 1px solid rgba(243, 238, 217, 0.2);\n          cursor: pointer;\n          padding: 12px;\n          border-radius: 12px;\n          color: #F3EED9;\n          font-size: 24px;\n          width: 44px;\n          height: 44px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          transition: all 0.2s ease;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .modal-close:hover {\n          background: rgba(243, 238, 217, 0.2);\n          transform: scale(1.05);\n        }\n        \n        .modal-close:active {\n          transform: scale(0.95);\n        }\n        \n        /* Responsive enhancements */\n        @media (max-width: 768px) {\n          .app-container {\n            flex-direction: column;\n          }\n          \n          .content-wrapper {\n            border-radius: 0;\n            box-shadow: none;\n          }\n          \n          .borrow-modal {\n            margin: 12px;\n            border-radius: 20px;\n            max-height: calc(100vh - 24px);\n          }\n          \n          .modal-header {\n            padding: 24px 20px 20px;\n          }\n          \n          .header-content {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .header-icon {\n            align-self: center;\n          }\n          \n         .header-text {\n            text-align: center;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .borrow-modal-overlay {\n            padding: 8px;\n          }\n          \n          .borrow-modal {\n            border-radius: 16px;\n          }\n          \n          .modal-header {\n            padding: 20px 16px 16px;\n          }\n          \n          .header-text h3 {\n            font-size: 20px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.App = App;
var EnhancedBorrowForm = function (_a) {
    var book = _a.book, borrowers = _a.borrowers, onSubmit = _a.onSubmit, onCancel = _a.onCancel, onRefreshBorrowers = _a.onRefreshBorrowers, supabaseService = _a.supabaseService;
    var _b = (0, react_1.useState)(null), selectedBorrower = _b[0], setSelectedBorrower = _b[1];
    var _c = (0, react_1.useState)(''), expectedReturnDate = _c[0], setExpectedReturnDate = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = (0, react_1.useState)('all'), filterType = _f[0], setFilterType = _f[1];
    var _g = (0, react_1.useState)('2weeks'), borrowDuration = _g[0], setBorrowDuration = _g[1];
    var _h = (0, react_1.useState)(false), showAddBorrower = _h[0], setShowAddBorrower = _h[1];
    var _j = (0, react_1.useState)({
        type: 'student',
        firstName: '',
        lastName: '',
        matricule: '',
        classe: '',
        cniNumber: '',
        position: '',
        email: '',
        phone: ''
    }), newBorrowerData = _j[0], setNewBorrowerData = _j[1];
    // Calculate default date (in 2 weeks)
    react_1.default.useEffect(function () {
        updateDateFromDuration(borrowDuration);
    }, [borrowDuration]);
    var updateDateFromDuration = function (duration) {
        var today = new Date();
        var targetDate = new Date(today);
        switch (duration) {
            case '1week':
                targetDate.setDate(today.getDate() + 7);
                break;
            case '2weeks':
                targetDate.setDate(today.getDate() + 14);
                break;
            case '1month':
                targetDate.setMonth(today.getMonth() + 1);
                break;
            default:
                return; // For 'custom', don't change
        }
        setExpectedReturnDate(targetDate.toISOString().split('T')[0]);
    };
    var handleAddBorrower = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newId, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, supabaseService.addBorrower(__assign(__assign({}, newBorrowerData), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1, createdAt: new Date().toISOString() }))];
                case 1:
                    newId = _a.sent();
                    setSelectedBorrower(newId);
                    setShowAddBorrower(false);
                    return [4 /*yield*/, onRefreshBorrowers()];
                case 2:
                    _a.sent(); // Refresh the borrowers list
                    setNewBorrowerData({
                        type: 'student',
                        firstName: '',
                        lastName: '',
                        matricule: '',
                        classe: '',
                        cniNumber: '',
                        position: '',
                        email: '',
                        phone: ''
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_9 = _a.sent();
                    alert(error_9.message || 'Erreur lors de l\'ajout de l\'emprunteur');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var filteredBorrowers = borrowers.filter(function (borrower) {
        // Filter by type
        if (filterType !== 'all' && borrower.type !== filterType)
            return false;
        // Filter by search
        if (searchQuery) {
            var query = searchQuery.toLowerCase();
            return (borrower.firstName.toLowerCase().includes(query) ||
                borrower.lastName.toLowerCase().includes(query) ||
                borrower.matricule.toLowerCase().includes(query) ||
                (borrower.classe && borrower.classe.toLowerCase().includes(query)) ||
                (borrower.position && borrower.position.toLowerCase().includes(query)));
        }
        return true;
    });
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedBorrower || !expectedReturnDate)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onSubmit(book.id, selectedBorrower, expectedReturnDate)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_10 = _a.sent();
                    console.error('Erreur:', error_10);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var selectedBorrowerData = borrowers.find(function (b) { return b.id === selectedBorrower; });
    return (<div className="enhanced-borrow-form">
      {/* Book Info Enhanced */}
      <div className="book-info-section">
        <div className="book-cover">
          {book.coverUrl ? (<img src={book.coverUrl} alt={book.title}/>) : (<div className="book-placeholder">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z"/>
              </svg>
            </div>)}
        </div>
        <div className="book-details">
          <h4 className="book-title">"{book.title}"</h4>
          <p className="book-author">par {book.author}</p>
          <div className="book-meta">
            <span className="book-category">{book.category}</span>
            {book.publishedDate && <span className="book-year">{book.publishedDate}</span>}
          </div>
        </div>
      </div>

      {/* Quick Duration Selection */}
      <div className="form-section">
        <label className="form-label">Durée d'emprunt</label>
        <div className="duration-selector">
          {[
            { id: '1week', label: '1 semaine', recommended: false },
            { id: '2weeks', label: '2 semaines', recommended: true },
            { id: '1month', label: '1 mois', recommended: false },
            { id: 'custom', label: 'Personnalisé', recommended: false }
        ].map(function (duration) { return (<button key={duration.id} type="button" className={"duration-button ".concat(borrowDuration === duration.id ? 'selected' : '', " ").concat(duration.recommended ? 'recommended' : '')} onClick={function () { return setBorrowDuration(duration.id); }}>
              {duration.label}
              {duration.recommended && <span className="recommended-badge">Recommandé</span>}
            </button>); })}
        </div>
      </div>

      {/* Return Date */}
      <div className="form-section">
        <label className="form-label">Date de retour prévue *</label>
        <input type="date" value={expectedReturnDate} onChange={function (e) {
            setExpectedReturnDate(e.target.value);
            setBorrowDuration('custom');
        }} className="date-input" min={new Date().toISOString().split('T')[0]} required/>
        <small className="form-hint">
          {borrowDuration !== 'custom' && "Dur\u00E9e s\u00E9lectionn\u00E9e : ".concat(borrowDuration === '1week' ? '7 jours' :
            borrowDuration === '2weeks' ? '14 jours' : '1 mois')}
        </small>
      </div>

      {/* Enhanced Borrower Selection */}
      <div className="form-section">
        <div className="section-header">
          <label className="form-label">Emprunteur *</label>
          <button type="button" className="add-borrower-button" onClick={function () { return setShowAddBorrower(true); }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ajouter emprunteur
          </button>
        </div>
        
        {/* Filters */}
        <div className="borrower-filters">
          <div className="search-container">
            <input type="text" placeholder="Rechercher un emprunteur..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="search-input"/>
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
            </svg>
          </div>
          
          <div className="type-filter">
            <select value={filterType} onChange={function (e) { return setFilterType(e.target.value); }} className="filter-select">
              <option value="all">Tous</option>
              <option value="student">Étudiants</option>
              <option value="staff">Personnel</option>
            </select>
          </div>
        </div>
        
        {/* Borrowers List */}
        <div className="borrowers-list">
          <div className="list-header">
            <span>Nom</span>
            <span>Type</span>
            <span>Matricule</span>
            <span>Classe/Poste</span>
          </div>
          
          <div className="list-content">
            {filteredBorrowers.length > 0 ? (filteredBorrowers.map(function (borrower) { return (<div key={borrower.id} className={"borrower-row ".concat(selectedBorrower === borrower.id ? 'selected' : '')} onClick={function () { return setSelectedBorrower(borrower.id); }}>
                  <div className="borrower-name">
                    <div className="name-main">{borrower.firstName} {borrower.lastName}</div>
                    <div className="name-sub">{borrower.email}</div>
                  </div>
                  <div className="borrower-type">
                    <span className={"type-badge ".concat(borrower.type)}>
                      {borrower.type === 'student' ? 'Étudiant' : 'Personnel'}
                    </span>
                  </div>
                  <div className="borrower-matricule">{borrower.matricule}</div>
                  <div className="borrower-extra">
                    {borrower.type === 'student' ? borrower.classe : borrower.position}
                  </div>
                  <div className="selection-indicator">
                    {selectedBorrower === borrower.id && (<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>)}
                  </div>
                </div>); })) : (<div className="no-borrowers">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
                </svg>
                <p>Aucun emprunteur trouvé</p>
                <small>{searchQuery ? "pour \"".concat(searchQuery, "\"") : 'Essayez de modifier les filtres'}</small>
              </div>)}
          </div>
        </div>
      </div>

      {/* Selected Borrower Summary Enhanced */}
      {selectedBorrowerData && (<div className="selected-summary">
          <h4>Récapitulatif de l'emprunt</h4>
          <div className="summary-card">
            <div className="summary-section">
              <div className="summary-icon book-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Livre</div>
                <div className="summary-value">{book.title}</div>
                <div className="summary-sub">par {book.author}</div>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-icon user-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Emprunteur</div>
                <div className="summary-value">
                  {selectedBorrowerData.firstName} {selectedBorrowerData.lastName}
                </div>
                <div className="summary-sub">
                  {selectedBorrowerData.matricule} • {selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel'}
                </div>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-icon date-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Retour prévu</div>
                <div className="summary-value">
                  {new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
                </div>
                <div className="summary-sub">
                  Dans {Math.ceil((new Date(expectedReturnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Form Actions Enhanced */}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={!selectedBorrower || !expectedReturnDate || isLoading} onClick={handleSubmit}>
          {isLoading ? (<>
              <div className="loading-spinner"></div>
              Traitement...
            </>) : (<>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.58L9 16.17Z"/>
              </svg>
              Confirmer l'emprunt
            </>)}
        </button>
      </div>

      {/* Add Borrower Modal */}
      {showAddBorrower && (<div className="add-borrower-overlay" onClick={function () { return setShowAddBorrower(false); }}>
          <div className="add-borrower-modal" onClick={function (e) { return e.stopPropagation(); }}>
            <div className="add-borrower-header">
              <h3>Ajouter un emprunteur</h3>
              <button className="modal-close-small" onClick={function () { return setShowAddBorrower(false); }}>
                ×
              </button>
            </div>
            
            <div className="add-borrower-content">
              <div className="type-selector">
                <button type="button" className={"type-button ".concat(newBorrowerData.type === 'student' ? 'active' : '')} onClick={function () { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { type: 'student' })); }); }}>
                  🎓 Étudiant
                </button>
                <button type="button" className={"type-button ".concat(newBorrowerData.type === 'staff' ? 'active' : '')} onClick={function () { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { type: 'staff' })); }); }}>
                  👔 Personnel
                </button>
              </div>

              <div className="form-grid-compact">
                <div className="form-group-compact">
                  <label>Prénom *</label>
                  <input type="text" value={newBorrowerData.firstName} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { firstName: e.target.value })); }); }} className="form-input-compact" required/>
                </div>
                
                <div className="form-group-compact">
                  <label>Nom *</label>
                  <input type="text" value={newBorrowerData.lastName} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { lastName: e.target.value })); }); }} className="form-input-compact" required/>
                </div>
                
                <div className="form-group-compact">
                  <label>Matricule *</label>
                  <input type="text" value={newBorrowerData.matricule} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { matricule: e.target.value })); }); }} className="form-input-compact" required/>
                </div>
                
                {newBorrowerData.type === 'student' ? (<div className="form-group-compact">
                    <label>Classe</label>
                    <input type="text" value={newBorrowerData.classe} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { classe: e.target.value })); }); }} className="form-input-compact" placeholder="ex: Terminale C"/>
                  </div>) : (<div className="form-group-compact">
                    <label>Poste</label>
                    <input type="text" value={newBorrowerData.position} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { position: e.target.value })); }); }} className="form-input-compact" placeholder="ex: Professeur"/>
                  </div>)}
                
                <div className="form-group-compact span-full">
                  <label>Email</label>
                  <input type="email" value={newBorrowerData.email} onChange={function (e) { return setNewBorrowerData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className="form-input-compact"/>
                </div>
              </div>
            </div>
            
            <div className="add-borrower-actions">
              <button type="button" className="btn-secondary-small" onClick={function () { return setShowAddBorrower(false); }}>
                Annuler
              </button>
              <button type="button" className="btn-primary-small" onClick={handleAddBorrower} disabled={!newBorrowerData.firstName || !newBorrowerData.lastName || !newBorrowerData.matricule || isLoading}>
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>)}

      {/* Styles pour le formulaire d'emprunt */}
      <style>{"\n        /* Tous les styles CSS du formulaire d'emprunt ici */\n        /* Le CSS est identique \u00E0 celui du fichier pr\u00E9c\u00E9dent */\n        /* ... (ins\u00E9rer ici tous les styles CSS de EnhancedBorrowForm) */\n      "}</style>
    </div>);
};
