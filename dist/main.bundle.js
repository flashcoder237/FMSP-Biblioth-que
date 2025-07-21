/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/App.tsx":
/*!******************************!*\
  !*** ./src/renderer/App.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_TitleBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/TitleBar */ "./src/renderer/components/TitleBar.tsx");
/* harmony import */ var _components_Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Sidebar */ "./src/renderer/components/Sidebar.tsx");
/* harmony import */ var _components_Dashboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Dashboard */ "./src/renderer/components/Dashboard.tsx");
/* harmony import */ var _components_DocumentList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/DocumentList */ "./src/renderer/components/DocumentList.tsx");
/* harmony import */ var _components_BorrowedDocuments__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/BorrowedDocuments */ "./src/renderer/components/BorrowedDocuments.tsx");
/* harmony import */ var _components_AddDocument__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/AddDocument */ "./src/renderer/components/AddDocument.tsx");
/* harmony import */ var _components_Borrowers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/Borrowers */ "./src/renderer/components/Borrowers.tsx");
/* harmony import */ var _components_BorrowHistory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/BorrowHistory */ "./src/renderer/components/BorrowHistory.tsx");
/* harmony import */ var _components_Settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/Settings */ "./src/renderer/components/Settings.tsx");
/* harmony import */ var _components_Donation__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/Donation */ "./src/renderer/components/Donation.tsx");
/* harmony import */ var _components_About__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/About */ "./src/renderer/components/About.tsx");
/* harmony import */ var _components_EnhancedAuthentication__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/EnhancedAuthentication */ "./src/renderer/components/EnhancedAuthentication.tsx");
/* harmony import */ var _components_InstitutionSetup__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/InstitutionSetup */ "./src/renderer/components/InstitutionSetup.tsx");
/* harmony import */ var _services_SupabaseService__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../services/SupabaseService */ "./src/services/SupabaseService.ts");

// src/renderer/App.tsx - Version modifiée pour Supabase















const App = () => {
    const [currentView, setCurrentView] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('auth');
    const [isAuthenticated, setIsAuthenticated] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [currentUser, setCurrentUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [currentInstitution, setCurrentInstitution] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [institutionCode, setInstitutionCode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    // Data states
    const [documents, setDocuments] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [authors, setAuthors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [categories, setCategories] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [borrowers, setBorrowers] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [borrowedBooks, setBorrowedBooks] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [stats, setStats] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
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
    // Services
    const [supabaseService] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(() => new _services_SupabaseService__WEBPACK_IMPORTED_MODULE_15__.SupabaseService());
    const [showBorrowModal, setShowBorrowModal] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [selectedDocument, setSelectedDocument] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        checkAuthStatus();
    }, []);
    const checkAuthStatus = async () => {
        try {
            const user = supabaseService.getCurrentUser();
            const institution = supabaseService.getCurrentInstitution();
            if (user && institution) {
                setCurrentUser(user);
                setCurrentInstitution(institution);
                setIsAuthenticated(true);
                setCurrentView('dashboard');
                await loadData();
            }
            else {
                setCurrentView('auth');
            }
        }
        catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            setCurrentView('auth');
        }
    };
    const loadData = async () => {
        if (!supabaseService.isAuthenticated())
            return;
        try {
            setIsLoading(true);
            const [documentsData, authorsData, categoriesData, borrowersData, borrowedBooksData, statsData] = await Promise.all([
                supabaseService.getDocuments(),
                supabaseService.getAuthors(),
                supabaseService.getCategories(),
                supabaseService.getBorrowers(),
                supabaseService.getBorrowedBooks(),
                supabaseService.getStats()
            ]);
            setDocuments(documentsData);
            setAuthors(authorsData);
            setCategories(categoriesData);
            setBorrowers(borrowersData);
            setBorrowedBooks(borrowedBooksData);
            setStats(statsData);
        }
        catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setError('Erreur lors du chargement des données');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAuthentication = async (credentials) => {
        try {
            setIsLoading(true);
            setError('');
            if (credentials.mode === 'login') {
                // Mode développement - connexion simplifiée
                if (credentials.email === 'admin@bibliotheque-dev.local' &&
                    credentials.password === 'dev123456' &&
                    credentials.institutionCode === 'DEV-BIBLIO') {
                    // Simulation d'authentification réussie en mode dev
                    const devUser = {
                        id: 'dev-user-1',
                        email: 'admin@bibliotheque-dev.local',
                        first_name: 'Admin',
                        last_name: 'Dev',
                        role: 'admin',
                        institution_id: 'dev-institution',
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        last_login: new Date().toISOString()
                    };
                    const devInstitution = {
                        id: 'dev-institution',
                        name: 'Bibliothèque de Développement',
                        code: 'DEV-BIBLIO',
                        address: '123 Rue du Code',
                        city: 'DevVille',
                        country: 'France',
                        phone: '+33 1 23 45 67 89',
                        email: 'contact@dev-biblio.local',
                        website: 'https://dev-biblio.local',
                        logo: '',
                        description: 'Bibliothèque de développement pour tests',
                        type: 'school',
                        status: 'active',
                        subscription_plan: 'enterprise',
                        max_books: 10000,
                        max_users: 100,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    setCurrentUser(devUser);
                    setCurrentInstitution(devInstitution);
                    setIsAuthenticated(true);
                    setCurrentView('dashboard');
                    await loadData();
                    return;
                }
                // Connexion normale via Supabase
                const result = await supabaseService.signIn(credentials.email, credentials.password);
                if (!result.success) {
                    throw new Error(result.error);
                }
                // Vérifier le code d'établissement
                if (credentials.institutionCode) {
                    const switchSuccess = await supabaseService.switchInstitution(credentials.institutionCode);
                    if (!switchSuccess) {
                        throw new Error('Code d\'établissement invalide ou accès non autorisé');
                    }
                }
                setCurrentUser(result.user);
                setCurrentInstitution(supabaseService.getCurrentInstitution());
                setIsAuthenticated(true);
                setCurrentView('dashboard');
                await loadData();
            }
            else if (credentials.mode === 'register') {
                // Inscription avec code d'établissement
                const result = await supabaseService.signUp(credentials.email, credentials.password, {
                    firstName: credentials.userData.firstName,
                    lastName: credentials.userData.lastName,
                    institutionCode: credentials.institutionCode,
                    role: credentials.userData.role
                });
                if (!result.success) {
                    throw new Error(result.error);
                }
                // Afficher un message de succès et rediriger vers login
                alert('Compte créé avec succès ! Veuillez vérifier votre email et vous connecter.');
            }
            else if (credentials.mode === 'create_institution') {
                // Création d'institution
                const institutionResult = await supabaseService.createInstitution(credentials.userData.institution);
                setInstitutionCode(institutionResult.code);
                // Créer le compte administrateur
                const adminResult = await supabaseService.signUp(credentials.email, credentials.password, {
                    firstName: credentials.userData.admin.firstName,
                    lastName: credentials.userData.admin.lastName,
                    role: 'admin'
                });
                if (!adminResult.success) {
                    throw new Error(adminResult.error);
                }
                setCurrentView('institution_setup');
            }
        }
        catch (error) {
            setError(error.message || 'Erreur d\'authentification');
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            await supabaseService.signOut();
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentInstitution(null);
            setCurrentView('auth');
            // Réinitialiser les données
            setDocuments([]);
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
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };
    const handleAddDocument = async (document) => {
        try {
            await supabaseService.addDocument(document);
            await loadData();
            setCurrentView('documents');
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du document:', error);
            throw error;
        }
    };
    const handleBorrowDocument = async (documentId, borrowerId, expectedReturnDate) => {
        if (documentId === undefined || borrowerId === undefined || !expectedReturnDate) {
            console.error('Invalid arguments for borrowDocument:', { documentId, borrowerId, expectedReturnDate });
            return;
        }
        try {
            await supabaseService.borrowDocument(documentId, borrowerId, expectedReturnDate);
            await loadData();
            setShowBorrowModal(false);
            setSelectedDocument(null);
        }
        catch (error) {
            console.error('Erreur lors de l\'emprunt:', error);
            throw error;
        }
    };
    const handleReturnBook = async (borrowHistoryId, notes) => {
        if (borrowHistoryId === undefined) {
            console.error('Invalid argument for returnBook:', { borrowHistoryId });
            return;
        }
        try {
            await supabaseService.returnBook(borrowHistoryId, notes);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors du retour:', error);
            throw error;
        }
    };
    const handleDeleteDocument = async (documentId) => {
        try {
            await supabaseService.deleteDocument(documentId);
            await loadData();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw error;
        }
    };
    const openBorrowModal = (document) => {
        setSelectedDocument(document);
        setShowBorrowModal(true);
    };
    const closeBorrowModal = () => {
        setShowBorrowModal(false);
        setSelectedDocument(null);
    };
    const refreshData = async () => {
        await loadData();
    };
    // Affichage de l'écran d'authentification
    if (!isAuthenticated) {
        if (currentView === 'institution_setup') {
            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_InstitutionSetup__WEBPACK_IMPORTED_MODULE_14__.InstitutionSetup, { institutionCode: institutionCode, institution: currentInstitution, onComplete: () => {
                    setCurrentView('auth');
                    alert('Votre établissement a été créé avec succès ! Vous pouvez maintenant vous connecter.');
                } }));
        }
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_EnhancedAuthentication__WEBPACK_IMPORTED_MODULE_13__.EnhancedAuthentication, { onLogin: handleAuthentication });
    }
    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Dashboard__WEBPACK_IMPORTED_MODULE_4__.Dashboard, { stats: stats, onNavigate: setCurrentView, documents: documents, categories: categories }));
            case 'documents':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_DocumentList__WEBPACK_IMPORTED_MODULE_5__.DocumentList, { documents: documents, onAdd: () => setCurrentView('add-document'), onEdit: openBorrowModal, onDelete: handleDeleteDocument, onRefresh: refreshData, syncStatus: {}, networkStatus: {} }));
            case 'borrowed':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_BorrowedDocuments__WEBPACK_IMPORTED_MODULE_6__.BorrowedDocuments, { documents: borrowedBooks.map(bh => ({
                        ...bh.book,
                        nomEmprunteur: `${bh.borrower?.firstName} ${bh.borrower?.lastName}`,
                        dateEmprunt: bh.borrowDate,
                        dateRetourPrevu: bh.expectedReturnDate
                    })), onReturn: (documentId) => {
                        const borrowHistory = borrowedBooks.find(bh => bh.bookId === documentId);
                        if (borrowHistory) {
                            handleReturnBook(borrowHistory.id, undefined);
                        }
                    } }));
            case 'add-document':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_AddDocument__WEBPACK_IMPORTED_MODULE_7__.AddDocument, { onAdd: handleAddDocument, onCancel: () => setCurrentView('documents') }));
            case 'borrowers':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Borrowers__WEBPACK_IMPORTED_MODULE_8__.Borrowers, { onClose: () => setCurrentView('dashboard'), onRefreshData: refreshData, supabaseService: supabaseService }));
            case 'history':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_BorrowHistory__WEBPACK_IMPORTED_MODULE_9__.BorrowHistory, { onClose: () => setCurrentView('dashboard'), supabaseService: supabaseService }));
            case 'settings':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Settings__WEBPACK_IMPORTED_MODULE_10__.Settings, { onClose: () => setCurrentView('dashboard'), onLogout: handleLogout, currentUser: currentUser, currentInstitution: currentInstitution, supabaseService: supabaseService }));
            case 'donation':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Donation__WEBPACK_IMPORTED_MODULE_11__.Donation, { onClose: () => setCurrentView('dashboard') }));
            case 'about':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_About__WEBPACK_IMPORTED_MODULE_12__.About, { onClose: () => setCurrentView('dashboard') }));
            default:
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Dashboard__WEBPACK_IMPORTED_MODULE_4__.Dashboard, { stats: stats, onNavigate: setCurrentView, documents: documents, categories: categories }));
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "app", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_TitleBar__WEBPACK_IMPORTED_MODULE_2__.TitleBar, {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "app-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Sidebar__WEBPACK_IMPORTED_MODULE_3__.Sidebar, { currentView: currentView, onNavigate: setCurrentView, stats: stats, currentUser: currentUser, currentInstitution: currentInstitution }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("main", { className: "main-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "content-wrapper", children: [isLoading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "loading-overlay", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Chargement..." })] })), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "error-banner", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: error }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => setError(''), children: "\u00D7" })] })), renderCurrentView()] }) })] }), showBorrowModal && selectedDocument && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrow-modal-overlay", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrow-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H13V9H19V21Z" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Nouvel emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "S\u00E9lectionnez un emprunteur et d\u00E9finissez la dur\u00E9e" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: closeBorrowModal, children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(EnhancedBorrowForm, { document: selectedDocument, borrowers: borrowers, onSubmit: handleBorrowDocument, onCancel: closeBorrowModal, onRefreshBorrowers: refreshData, supabaseService: supabaseService })] }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
          overflow: hidden;
        }
        
        .app-container {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
          overflow: hidden;
          position: relative;
        }
        
        .content-wrapper {
          flex: 1;
          overflow: hidden;
          border-radius: 12px 0 0 0;
          background: #FAF9F6;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #E5DCC2;
          border-top: 4px solid #3E5C49;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-banner {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 500;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #DC2626;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          margin-left: 12px;
        }

        /* Enhanced Borrow Modal */
        .borrow-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.75);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        
        .borrow-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 
            0 32px 64px rgba(62, 92, 73, 0.25),
            0 16px 32px rgba(62, 92, 73, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(32px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .header-text h3 {
          font-size: 22px;
          font-weight: 700;
          color: #F3EED9;
          margin: 0 0 6px 0;
          letter-spacing: -0.3px;
        }
        
        .header-text p {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin: 0;
          line-height: 1.4;
        }
        
        .modal-close {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.2);
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #F3EED9;
          font-size: 24px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
        }
        
        .modal-close:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .modal-close:active {
          transform: scale(0.95);
        }
        
        /* Responsive enhancements */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .content-wrapper {
            border-radius: 0;
            box-shadow: none;
          }
          
          .borrow-modal {
            margin: 12px;
            border-radius: 20px;
            max-height: calc(100vh - 24px);
          }
          
          .modal-header {
            padding: 24px 20px 20px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .header-icon {
            align-self: center;
          }
          
         .header-text {
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .borrow-modal-overlay {
            padding: 8px;
          }
          
          .borrow-modal {
            border-radius: 16px;
          }
          
          .modal-header {
            padding: 20px 16px 16px;
          }
          
          .header-text h3 {
            font-size: 20px;
          }
        }
      ` })] }));
};
const EnhancedBorrowForm = ({ document, borrowers, onSubmit, onCancel, onRefreshBorrowers, supabaseService }) => {
    const [selectedBorrower, setSelectedBorrower] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [expectedReturnDate, setExpectedReturnDate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [filterType, setFilterType] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const [borrowDuration, setBorrowDuration] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('2weeks');
    const [showAddBorrower, setShowAddBorrower] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [newBorrowerData, setNewBorrowerData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
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
    // Calculate default date (in 2 weeks)
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        updateDateFromDuration(borrowDuration);
    }, [borrowDuration]);
    const updateDateFromDuration = (duration) => {
        const today = new Date();
        let targetDate = new Date(today);
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
    const handleAddBorrower = async () => {
        try {
            setIsLoading(true);
            const newId = await supabaseService.addBorrower({
                ...newBorrowerData,
                syncStatus: 'pending',
                lastModified: new Date().toISOString(),
                version: 1,
                createdAt: new Date().toISOString()
            });
            setSelectedBorrower(newId);
            setShowAddBorrower(false);
            await onRefreshBorrowers(); // Refresh the borrowers list
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
        }
        catch (error) {
            alert(error.message || 'Erreur lors de l\'ajout de l\'emprunteur');
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredBorrowers = borrowers.filter(borrower => {
        // Filter by type
        if (filterType !== 'all' && borrower.type !== filterType)
            return false;
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (borrower.firstName.toLowerCase().includes(query) ||
                borrower.lastName.toLowerCase().includes(query) ||
                borrower.matricule.toLowerCase().includes(query) ||
                (borrower.classe && borrower.classe.toLowerCase().includes(query)) ||
                (borrower.position && borrower.position.toLowerCase().includes(query)));
        }
        return true;
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBorrower || !expectedReturnDate)
            return;
        setIsLoading(true);
        try {
            await onSubmit(document.id, selectedBorrower, expectedReturnDate);
        }
        catch (error) {
            console.error('Erreur:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const selectedBorrowerData = borrowers.find(b => b.id === selectedBorrower);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "enhanced-borrow-form", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "document-info-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "document-cover", children: document.couverture ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: document.couverture, alt: document.titre })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "document-placeholder", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "32", height: "32", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z" }) }) })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "document-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "document-title", children: ["\"", document.titre, "\""] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "document-author", children: ["par ", document.auteur] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "document-meta", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "document-category", children: document.descripteurs }), document.annee && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "document-year", children: document.annee })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Dur\u00E9e d'emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "duration-selector", children: [
                            { id: '1week', label: '1 semaine', recommended: false },
                            { id: '2weeks', label: '2 semaines', recommended: true },
                            { id: '1month', label: '1 mois', recommended: false },
                            { id: 'custom', label: 'Personnalisé', recommended: false }
                        ].map((duration) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: `duration-button ${borrowDuration === duration.id ? 'selected' : ''} ${duration.recommended ? 'recommended' : ''}`, onClick: () => setBorrowDuration(duration.id), children: [duration.label, duration.recommended && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "recommended-badge", children: "Recommand\u00E9" })] }, duration.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Date de retour pr\u00E9vue *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: expectedReturnDate, onChange: (e) => {
                            setExpectedReturnDate(e.target.value);
                            setBorrowDuration('custom');
                        }, className: "date-input", min: new Date().toISOString().split('T')[0], required: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { className: "form-hint", children: borrowDuration !== 'custom' && `Durée sélectionnée : ${borrowDuration === '1week' ? '7 jours' :
                            borrowDuration === '2weeks' ? '14 jours' : '1 mois'}` })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Emprunteur *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: "add-borrower-button", onClick: () => setShowAddBorrower(true), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" }) }), "Ajouter emprunteur"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-filters", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Rechercher un emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: "search-icon", viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "type-filter", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "student", children: "\u00C9tudiants" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "staff", children: "Personnel" })] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrowers-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "list-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Nom" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Type" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Matricule" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Classe/Poste" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "list-content", children: filteredBorrowers.length > 0 ? (filteredBorrowers.map((borrower) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `borrower-row ${selectedBorrower === borrower.id ? 'selected' : ''}`, onClick: () => setSelectedBorrower(borrower.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-name", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "name-main", children: [borrower.firstName, " ", borrower.lastName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "name-sub", children: borrower.email })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrower-type", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `type-badge ${borrower.type}`, children: borrower.type === 'student' ? 'Étudiant' : 'Personnel' }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrower-matricule", children: borrower.matricule }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrower-extra", children: borrower.type === 'student' ? borrower.classe : borrower.position }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "selection-indicator", children: selectedBorrower === borrower.id && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" }) })) })] }, borrower.id)))) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "no-borrowers", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "48", height: "48", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9Z" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Aucun emprunteur trouv\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { children: searchQuery ? `pour "${searchQuery}"` : 'Essayez de modifier les filtres' })] })) })] })] }), selectedBorrowerData && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "selected-summary", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "R\u00E9capitulatif de l'emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-icon book-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-label", children: "Document" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-value", children: document.titre }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-sub", children: ["par ", document.auteur] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-icon user-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-label", children: "Emprunteur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-value", children: [selectedBorrowerData.firstName, " ", selectedBorrowerData.lastName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-sub", children: [selectedBorrowerData.matricule, " \u2022 ", selectedBorrowerData.type === 'student' ? 'Étudiant' : 'Personnel'] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-icon date-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-label", children: "Retour pr\u00E9vu" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "summary-value", children: new Date(expectedReturnDate).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "summary-sub", children: ["Dans ", Math.ceil((new Date(expectedReturnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), " jour(s)"] })] })] })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: "btn-secondary", onClick: onCancel, disabled: isLoading, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" }) }), "Annuler"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", className: "btn-primary", disabled: !selectedBorrower || !expectedReturnDate || isLoading, onClick: handleSubmit, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Traitement..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.58L9 16.17Z" }) }), "Confirmer l'emprunt"] })) })] }), showAddBorrower && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "add-borrower-overlay", onClick: () => setShowAddBorrower(false), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-borrower-modal", onClick: (e) => e.stopPropagation(), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-borrower-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Ajouter un emprunteur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close-small", onClick: () => setShowAddBorrower(false), children: "\u00D7" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-borrower-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "type-selector", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: `type-button ${newBorrowerData.type === 'student' ? 'active' : ''}`, onClick: () => setNewBorrowerData(prev => ({ ...prev, type: 'student' })), children: "\uD83C\uDF93 \u00C9tudiant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: `type-button ${newBorrowerData.type === 'staff' ? 'active' : ''}`, onClick: () => setNewBorrowerData(prev => ({ ...prev, type: 'staff' })), children: "\uD83D\uDC54 Personnel" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Pr\u00E9nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newBorrowerData.firstName, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, firstName: e.target.value })), className: "form-input-compact", required: true })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newBorrowerData.lastName, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, lastName: e.target.value })), className: "form-input-compact", required: true })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Matricule *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newBorrowerData.matricule, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, matricule: e.target.value })), className: "form-input-compact", required: true })] }), newBorrowerData.type === 'student' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Classe" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newBorrowerData.classe, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, classe: e.target.value })), className: "form-input-compact", placeholder: "ex: Terminale C" })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Poste" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: newBorrowerData.position, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, position: e.target.value })), className: "form-input-compact", placeholder: "ex: Professeur" })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group-compact span-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: newBorrowerData.email, onChange: (e) => setNewBorrowerData(prev => ({ ...prev, email: e.target.value })), className: "form-input-compact" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-borrower-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "btn-secondary-small", onClick: () => setShowAddBorrower(false), children: "Annuler" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "btn-primary-small", onClick: handleAddBorrower, disabled: !newBorrowerData.firstName || !newBorrowerData.lastName || !newBorrowerData.matricule || isLoading, children: isLoading ? 'Ajout...' : 'Ajouter' })] })] }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        /* Tous les styles CSS du formulaire d'emprunt ici */
        /* Le CSS est identique à celui du fichier précédent */
        /* ... (insérer ici tous les styles CSS de EnhancedBorrowForm) */
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/About.tsx":
/*!*******************************************!*\
  !*** ./src/renderer/components/About.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   About: () => (/* binding */ About)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/zap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/heart.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trophy.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/award.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/star.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/code.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-left.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/info.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sparkles.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/map-pin.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/briefcase.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/external-link.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/phone.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs");



const About = ({ onClose }) => {
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('developer');
    const developerInfo = {
        name: 'CHEUDJEU TEFOYE CÉDRIC BASILIO',
        title: 'Expert en Développement Informatique & Intelligence Artificielle',
        location: 'Douala, Cameroun',
        phone: '+237 652 761 931',
        email: 'cedrictefoye@gmail.com',
        currentPosition: 'Responsable Cellule Informatique - Faculté de Médecine, Université de Douala',
        experience: '4+ ans d\'expérience',
        avatar: '👨‍💻'
    };
    const education = [
        {
            degree: 'Master en Intelligence Artificielle',
            institution: 'Université de Dschang, Faculté des Sciences',
            year: '2022-2023',
            mention: 'Mention obtenue',
            specialization: 'Machine Learning, NLP, Computer Vision'
        },
        {
            degree: 'Licence en Informatique Fondamentale',
            institution: 'Université de Dschang, Faculté des Sciences',
            year: '2020-2021',
            specialization: 'Génie Logiciel et Systèmes d\'Information'
        }
    ];
    const experience = [
        {
            title: 'Responsable Cellule Informatique',
            company: 'Faculté de Médecine - Université de Douala',
            period: 'Jan. 2024 - Présent',
            description: 'Administration des systèmes, développement d\'applications de gestion académique, implémentation de solutions d\'IA'
        },
        {
            title: 'Co-fondateur',
            company: 'OVERBRAND',
            period: 'Août 2021 - Présent',
            description: 'Direction stratégique et technique, supervision de projets web/mobile'
        },
        {
            title: 'Designer - Projet Help to Win',
            company: 'VISIBILITY CAM SARL',
            period: 'Mars 2023 - Présent',
            description: 'Conception UI/UX d\'application mobile éducative'
        }
    ];
    const technologies = {
        frontend: ['React.js', 'Vue.js', 'HTML5/CSS3', 'JavaScript', 'TypeScript'],
        backend: ['Node.js', 'PHP/Laravel', 'Python', 'Express.js'],
        mobile: ['React Native', 'Flutter'],
        ai: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Machine Learning', 'NLP'],
        design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
        database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
        tools: ['Git/GitHub', 'Docker', 'AWS']
    };
    const projectFeatures = [
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
            title: 'Gestion complète',
            description: 'Système complet de gestion de bibliothèque avec emprunteurs, livres et historique'
        },
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
            title: 'Multi-utilisateurs',
            description: 'Support pour étudiants et personnel avec différents types d\'accès'
        },
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"],
            title: 'Interface moderne',
            description: 'Design contemporain avec animations fluides et expérience utilisateur optimisée'
        },
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"],
            title: 'Open Source',
            description: 'Code source libre et gratuit pour toute la communauté éducative'
        }
    ];
    const achievements = [
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"],
            title: 'Halkaton 2022',
            description: 'Hackathon de 24 heures'
        },
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
            title: 'MountainHack 2020',
            description: 'Hackathon de 24 heures, Dschang'
        },
        {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"],
            title: 'Master avec mention',
            description: 'Intelligence Artificielle - 2023'
        }
    ];
    const tabs = [
        { id: 'developer', label: 'Développeur', icon: lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"] },
        { id: 'project', label: 'Le Projet', icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"] },
        { id: 'technologies', label: 'Technologies', icon: lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"] }
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "about-page", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-background", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-pattern" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "back-button", onClick: onClose, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Retour" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-main", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "hero-title", children: "\u00C0 propos du projet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "hero-subtitle", children: "D\u00E9couvrez l'histoire, les technologies et l'\u00E9quipe derri\u00E8re ce syst\u00E8me de gestion de biblioth\u00E8que" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-number", children: "2024" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Ann\u00E9e de cr\u00E9ation" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-number", children: "100%" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "TypeScript" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-number", children: "MIT" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Licence libre" })] })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "about-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tabs-navigation", children: tabs.map((tab) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `tab-button ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(tab.icon, { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: tab.label })] }, tab.id))) }), activeTab === 'developer' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tab-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "developer-hero", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "developer-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "avatar-emoji", children: developerInfo.avatar }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "developer-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "developer-name", children: developerInfo.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "developer-title", children: developerInfo.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "developer-meta", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "meta-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: developerInfo.location })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "meta-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: developerInfo.experience })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "content-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "card-title", children: "Contact" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "contact-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", { href: `mailto:${developerInfo.email}`, className: "contact-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: developerInfo.email }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 16 })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", { href: `tel:${developerInfo.phone}`, className: "contact-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: developerInfo.phone }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 16 })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "card-title", children: "Poste actuel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "position-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "position-title", children: developerInfo.currentPosition }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "position-description", children: "Administration des syst\u00E8mes informatiques, d\u00E9veloppement d'applications de gestion acad\u00E9mique et impl\u00E9mentation de solutions d'IA pour l'optimisation des processus." })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "section-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_19__["default"], { size: 24 }), "Formation"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline", children: education.map((edu, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-marker" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "timeline-title", children: edu.degree }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "timeline-subtitle", children: edu.institution }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-meta", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "timeline-year", children: edu.year }), edu.mention && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "timeline-mention", children: edu.mention })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "timeline-description", children: edu.specialization })] })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "section-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 24 }), "Exp\u00E9rience professionnelle"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "experience-grid", children: experience.map((exp, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "experience-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "experience-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "experience-title", children: exp.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "experience-period", children: exp.period })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "experience-company", children: exp.company }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "experience-description", children: exp.description })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "section-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 24 }), "R\u00E9alisations"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "achievements-grid", children: achievements.map((achievement, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "achievement-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "achievement-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(achievement.icon, { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "achievement-title", children: achievement.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "achievement-description", children: achievement.description })] }, index))) })] })] })), activeTab === 'project' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tab-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-intro", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "intro-title", children: "Syst\u00E8me de Gestion de Biblioth\u00E8que" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "intro-description", children: "Une solution moderne et compl\u00E8te pour la gestion des biblioth\u00E8ques, d\u00E9velopp\u00E9e avec les derni\u00E8res technologies web. Ce projet vise \u00E0 simplifier et moderniser la gestion des collections de livres, des emprunteurs et des transactions dans les \u00E9tablissements \u00E9ducatifs." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "features-grid", children: projectFeatures.map((feature, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "feature-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(feature.icon, { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "feature-title", children: feature.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "feature-description", children: feature.description })] }, index))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "detail-title", children: "Objectifs du projet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { className: "detail-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Moderniser la gestion des biblioth\u00E8ques scolaires et universitaires" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Simplifier les processus d'emprunt et de retour de livres" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Fournir des statistiques et analyses en temps r\u00E9el" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Offrir une interface intuitive et accessible" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Garantir la gratuit\u00E9 et l'open source pour l'\u00E9ducation" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "detail-title", children: "Fonctionnalit\u00E9s principales" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { className: "detail-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Gestion compl\u00E8te des livres (ajout, modification, suppression)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Syst\u00E8me d'emprunteurs avec diff\u00E9rents types (\u00E9tudiants, personnel)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Processus d'emprunt et de retour simplifi\u00E9s" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Historique d\u00E9taill\u00E9 des transactions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "G\u00E9n\u00E9ration de rapports et exports CSV" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Interface responsive adapt\u00E9e \u00E0 tous les appareils" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "project-mission", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mission-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 32 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mission-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "mission-title", children: "Notre mission" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "mission-description", children: "D\u00E9mocratiser l'acc\u00E8s aux outils de gestion modernes pour les biblioth\u00E8ques, en particulier dans les \u00E9tablissements \u00E9ducatifs. Nous croyons que chaque institution, quelle que soit sa taille ou ses ressources, devrait avoir acc\u00E8s \u00E0 des solutions technologiques de qualit\u00E9 pour am\u00E9liorer l'exp\u00E9rience de ses utilisateurs." })] })] })] })), activeTab === 'technologies' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tab-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-intro", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "intro-title", children: "Stack Technologique" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "intro-description", children: "Ce projet utilise des technologies modernes et \u00E9prouv\u00E9es pour garantir performance, s\u00E9curit\u00E9 et maintenabilit\u00E9. Voici un aper\u00E7u des outils et frameworks utilis\u00E9s." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-categories", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Frontend" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.frontend.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag frontend", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Backend" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.backend.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag backend", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Mobile" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.mobile.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag mobile", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Intelligence Artificielle" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.ai.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag ai", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Design" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.design.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag design", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Base de donn\u00E9es" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.database.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag database", children: tech }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-category", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "tech-title", children: "Outils & DevOps" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tech-tags", children: technologies.tools.map((tech, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "tech-tag tools", children: tech }, index))) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "architecture-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "architecture-title", children: "Architecture" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "architecture-description", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Le syst\u00E8me est construit avec une architecture moderne s\u00E9parant clairement les couches de pr\u00E9sentation, logique m\u00E9tier et donn\u00E9es. L'interface utilisateur est d\u00E9velopp\u00E9e en React avec TypeScript pour une meilleure maintenabilit\u00E9." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "L'application utilise Electron pour offrir une exp\u00E9rience desktop native tout en conservant la flexibilit\u00E9 du web. La base de donn\u00E9es SQLite garantit une installation simple et une portabilit\u00E9 maximale." })] })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .about-page {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
          color: #F3EED9;
          padding: 48px 32px;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          animation: drift 20s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          width: fit-content;
        }
        
        .back-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateX(-4px);
        }
        
        .hero-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          text-align: center;
          flex-direction: column;
        }
        
        .hero-icon {
          width: 96px;
          height: 96px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .hero-title {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
          max-width: 600px;
        }
        
        .project-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(243, 238, 217, 0.1);
          padding: 20px 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #F3EED9;
          display: block;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin-top: 4px;
        }
        
        .about-content {
          padding: 0 32px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .tabs-navigation {
          display: flex;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          position: sticky;
          top: 20px;
          z-index: 10;
        }
        
        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }
        
        .tab-button:hover {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
        }
        
        .tab-button.active {
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
          color: #F3EED9;
          box-shadow: 0 4px 12px rgba(96, 125, 139, 0.3);
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .developer-hero {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .developer-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }
        
        .developer-name {
          font-size: 28px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        
        .developer-title {
          font-size: 16px;
          color: #607D8B;
          margin: 0 0 16px 0;
          font-weight: 600;
        }
        
        .developer-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
          font-size: 14px;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .info-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 20px 0;
        }
        
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(96, 125, 139, 0.05);
          border-radius: 12px;
          color: #2E2E2E;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .contact-item:hover {
          background: rgba(96, 125, 139, 0.1);
          transform: translateY(-1px);
        }
        
        .position-title {
          font-size: 16px;
          font-weight: 700;
          color: #607D8B;
          margin-bottom: 8px;
        }
        
        .position-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
        }
        
        .section {
          margin-bottom: 48px;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 24px 0;
        }
        
        .timeline {
          position: relative;
          padding-left: 32px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 16px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #607D8B, #455A64);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 32px;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .timeline-marker {
          position: absolute;
          left: -40px;
          top: 24px;
          width: 12px;
          height: 12px;
          background: #607D8B;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 0 2px #607D8B;
        }
        
        .timeline-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .timeline-subtitle {
          font-size: 14px;
          color: #607D8B;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        
        .timeline-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }
        
        .timeline-year {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .timeline-mention {
          background: #4CAF50;
          color: #FFFFFF;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .timeline-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
        }
        
        .experience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .experience-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .experience-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .experience-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
          flex: 1;
        }
        
        .experience-period {
          background: rgba(96, 125, 139, 0.1);
          color: #607D8B;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .experience-company {
          font-size: 14px;
          color: #607D8B;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .experience-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
        }
        
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .achievement-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .achievement-icon {
          width: 48px;
          height: 48px;
          background: rgba(96, 125, 139, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #607D8B;
          margin: 0 auto 16px;
        }
        
        .achievement-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .achievement-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .project-intro {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          text-align: center;
        }
        
        .intro-title {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          letter-spacing: -0.3px;
        }
        
        .intro-description {
          font-size: 16px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .feature-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 125, 139, 0.15);
        }
        
        .feature-icon {
          width: 56px;
          height: 56px;
          background: rgba(96, 125, 139, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #607D8B;
          margin: 0 auto 20px;
        }
        
        .feature-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .feature-description {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
        }
        
        .project-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .detail-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .detail-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .detail-list li {
          padding: 8px 0;
          border-bottom: 1px solid #F3EED9;
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          position: relative;
          padding-left: 20px;
        }
        
        .detail-list li::before {
          content: '•';
          color: #607D8B;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .detail-list li:last-child {
          border-bottom: none;
        }
        
        .project-mission {
          display: flex;
          gap: 24px;
          background: linear-gradient(135deg, rgba(96, 125, 139, 0.05) 0%, rgba(69, 90, 100, 0.05) 100%);
          border: 1px solid rgba(96, 125, 139, 0.2);
          border-radius: 20px;
          padding: 32px;
        }
        
        .mission-icon {
          width: 64px;
          height: 64px;
          background: #607D8B;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        
        .mission-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .mission-description {
          font-size: 16px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0;
        }
        
        .tech-intro {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
          text-align: center;
        }
        
        .tech-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .tech-category {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .tech-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tech-tag {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #FFFFFF;
        }
        
        .tech-tag.frontend { background: #3E5C49; }
        .tech-tag.backend { background: #C2571B; }
        .tech-tag.mobile { background: #E91E63; }
        .tech-tag.ai { background: #9C27B0; }
        .tech-tag.design { background: #FF9800; }
        .tech-tag.database { background: #607D8B; }
        .tech-tag.tools { background: #6E6E6E; }
        
        .architecture-info {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(96, 125, 139, 0.1);
          border: 1px solid #E5DCC2;
        }
        
        .architecture-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .architecture-description p {
          font-size: 14px;
          color: #6E6E6E;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }
        
        .architecture-description p:last-child {
          margin-bottom: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 18px;
          }
          
          .project-stats {
            flex-direction: column;
            gap: 16px;
          }
          
          .stat-item {
            justify-content: center;
          }
          
          .about-content {
            padding: 0 16px 32px;
          }
          
          .tabs-navigation {
            flex-direction: column;
            gap: 8px;
          }
          
          .tab-button {
            justify-content: flex-start;
          }
          
          .developer-hero {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .developer-meta {
            justify-content: center;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline {
            padding-left: 24px;
          }
          
          .timeline-marker {
            left: -32px;
          }
          
          .experience-grid {
            grid-template-columns: 1fr;
          }
          
          .achievements-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .project-details {
            grid-template-columns: 1fr;
          }
          
          .project-mission {
            flex-direction: column;
            text-align: center;
          }
          
          .tech-categories {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .hero-main {
            gap: 16px;
          }
          
          .hero-icon {
            width: 72px;
            height: 72px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .intro-title {
            font-size: 28px;
          }
          
          .developer-name {
            font-size: 24px;
          }
          
          .experience-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .experience-period {
            align-self: flex-start;
          }
          
          .timeline-item {
            padding: 20px;
          }
          
          .feature-card,
          .achievement-card {
            padding: 20px;
          }
          
          .project-mission {
            padding: 24px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/AddDocument.tsx":
/*!*************************************************!*\
  !*** ./src/renderer/components/AddDocument.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddDocument: () => (/* binding */ AddDocument)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/map-pin.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/hash.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/tag.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/image.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/save.mjs");



const AddDocument = ({ onAdd, onCancel, editingDocument }) => {
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        auteur: '',
        titre: '',
        editeur: '',
        lieuEdition: '',
        annee: new Date().getFullYear().toString(),
        descripteurs: '',
        cote: '',
        isbn: '',
        description: '',
        couverture: ''
    });
    const [authors, setAuthors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [categories, setCategories] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadAuthors();
        loadCategories();
        if (editingDocument) {
            setFormData({
                auteur: editingDocument.auteur,
                titre: editingDocument.titre,
                editeur: editingDocument.editeur,
                lieuEdition: editingDocument.lieuEdition,
                annee: editingDocument.annee,
                descripteurs: editingDocument.descripteurs,
                cote: editingDocument.cote,
                isbn: editingDocument.isbn || '',
                description: editingDocument.description || '',
                couverture: editingDocument.couverture || ''
            });
        }
    }, [editingDocument]);
    const loadAuthors = async () => {
        try {
            const authorsList = await window.electronAPI.getAuthors();
            setAuthors(authorsList);
        }
        catch (error) {
            console.error('Erreur lors du chargement des auteurs:', error);
        }
    };
    const loadCategories = async () => {
        try {
            const categoriesList = await window.electronAPI.getCategories();
            setCategories(categoriesList);
        }
        catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
        }
    };
    const generateCote = () => {
        if (formData.descripteurs && formData.auteur && formData.annee) {
            const category = formData.descripteurs.split(',')[0].trim().toUpperCase();
            const authorCode = formData.auteur.split(' ').map(name => name.substring(0, 3).toUpperCase()).join('-');
            const yearCode = formData.annee.substring(-2);
            const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
            const generatedCote = `${category.substring(0, 3)}-${authorCode}-${yearCode}${randomNum}`;
            setFormData(prev => ({ ...prev, cote: generatedCote }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        // Champs obligatoires
        if (!formData.auteur.trim())
            newErrors.auteur = 'L\'auteur est obligatoire';
        if (!formData.titre.trim())
            newErrors.titre = 'Le titre est obligatoire';
        if (!formData.editeur.trim())
            newErrors.editeur = 'L\'éditeur est obligatoire';
        if (!formData.lieuEdition.trim())
            newErrors.lieuEdition = 'Le lieu d\'édition est obligatoire';
        if (!formData.annee.trim())
            newErrors.annee = 'L\'année est obligatoire';
        if (!formData.descripteurs.trim())
            newErrors.descripteurs = 'Les descripteurs sont obligatoires';
        if (!formData.cote.trim())
            newErrors.cote = 'La cote est obligatoire';
        // Validation de l'année
        const year = parseInt(formData.annee);
        if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
            newErrors.annee = 'Année invalide';
        }
        // Validation ISBN (optionnel mais si fourni, doit être valide)
        if (formData.isbn && !/^(978|979)?[0-9]{9}[0-9X]$/.test(formData.isbn.replace(/-/g, ''))) {
            newErrors.isbn = 'Format ISBN invalide';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const documentData = {
                ...formData,
                estEmprunte: false,
                syncStatus: 'pending',
                lastModified: new Date().toISOString(),
                version: editingDocument ? editingDocument.version + 1 : 1
            };
            await onAdd(documentData);
            // Reset form si ce n'est pas une édition
            if (!editingDocument) {
                setFormData({
                    auteur: '',
                    titre: '',
                    editeur: '',
                    lieuEdition: '',
                    annee: new Date().getFullYear().toString(),
                    descripteurs: '',
                    cote: '',
                    isbn: '',
                    description: '',
                    couverture: ''
                });
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du document:', error);
            setErrors({ submit: 'Erreur lors de l\'enregistrement du document' });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Effacer l'erreur pour ce champ
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const selectCoverImage = async () => {
        try {
            const filePath = await window.electronAPI.selectFile({
                filters: [
                    { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
                ]
            });
            if (filePath) {
                setFormData(prev => ({ ...prev, couverture: filePath }));
            }
        }
        catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h2", { className: "text-xl font-semibold text-gray-800 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "w-5 h-5" }), editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: onCancel, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "w-5 h-5" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [errors.submit && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg", children: errors.submit })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-gray-50 p-4 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "text-lg font-medium text-gray-800 mb-4 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "w-5 h-5" }), "Informations principales"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "w-4 h-4 inline mr-1" }), "Auteur *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.auteur, onChange: (e) => handleInputChange('auteur', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.auteur ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Nom de l'auteur", list: "authors-list" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("datalist", { id: "authors-list", children: authors.map(author => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: author.name }, author.id))) }), errors.auteur && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.auteur })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "w-4 h-4 inline mr-1" }), "Titre *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.titre, onChange: (e) => handleInputChange('titre', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.titre ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Titre du document" }), errors.titre && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.titre })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "w-4 h-4 inline mr-1" }), "\u00C9diteur *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.editeur, onChange: (e) => handleInputChange('editeur', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.editeur ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Nom de l'\u00E9diteur" }), errors.editeur && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.editeur })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "w-4 h-4 inline mr-1" }), "Lieu d'\u00E9dition *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.lieuEdition, onChange: (e) => handleInputChange('lieuEdition', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lieuEdition ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Ville d'\u00E9dition" }), errors.lieuEdition && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.lieuEdition })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "w-4 h-4 inline mr-1" }), "Ann\u00E9e *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", value: formData.annee, onChange: (e) => handleInputChange('annee', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.annee ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Ann\u00E9e de publication", min: "1000", max: new Date().getFullYear() + 10 }), errors.annee && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.annee })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "w-4 h-4 inline mr-1" }), "Cote *"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.cote, onChange: (e) => handleInputChange('cote', e.target.value), className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cote ? 'border-red-300' : 'border-gray-300'}`, placeholder: "Code de classification" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: generateCote, className: "px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", title: "G\u00E9n\u00E9rer automatiquement", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { className: "w-4 h-4" }) })] }), errors.cote && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.cote })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-gray-50 p-4 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "text-lg font-medium text-gray-800 mb-4 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { className: "w-5 h-5" }), "M\u00E9tadonn\u00E9es et classification"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descripteurs / Mots-cl\u00E9s *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.descripteurs, onChange: (e) => handleInputChange('descripteurs', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.descripteurs ? 'border-red-300' : 'border-gray-300'}`, placeholder: "ex: Fiction, Roman historique, XIXe si\u00E8cle (s\u00E9par\u00E9s par des virgules)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "S\u00E9parez les mots-cl\u00E9s par des virgules. Ces descripteurs aideront \u00E0 la recherche et au classement." }), errors.descripteurs && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.descripteurs })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "ISBN (optionnel)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.isbn, onChange: (e) => handleInputChange('isbn', e.target.value), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isbn ? 'border-red-300' : 'border-gray-300'}`, placeholder: "978-2-123456-78-9" }), errors.isbn && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.isbn })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { className: "w-4 h-4 inline mr-1" }), "Couverture (optionnel)"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: formData.couverture, onChange: (e) => handleInputChange('couverture', e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Chemin vers l'image", readOnly: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: selectCoverImage, className: "px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Parcourir" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description (optionnel)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", rows: 4, placeholder: "Description d\u00E9taill\u00E9e du document..." })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: onCancel, className: "px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors", children: "Annuler" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", disabled: isLoading, className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { className: "w-4 h-4" }), isLoading ? 'Enregistrement...' : (editingDocument ? 'Modifier' : 'Ajouter')] })] })] })] }) }));
};


/***/ }),

/***/ "./src/renderer/components/BorrowHistory.tsx":
/*!***************************************************!*\
  !*** ./src/renderer/components/BorrowHistory.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BorrowHistory: () => (/* binding */ BorrowHistory)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-triangle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/history.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/filter.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/printer.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/briefcase.mjs");



const BorrowHistory = ({ onClose }) => {
    const [history, setHistory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [filteredHistory, setFilteredHistory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [filters, setFilters] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        startDate: '',
        endDate: '',
        borrowerType: 'all',
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadHistory();
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        applyFilters();
    }, [history, filters, searchQuery]);
    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await window.electronAPI.getBorrowHistory();
            setHistory(data);
        }
        catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const applyFilters = () => {
        let filtered = [...history];
        // Appliquer les filtres de date
        if (filters.startDate) {
            filtered = filtered.filter(item => new Date(item.borrowDate) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            filtered = filtered.filter(item => new Date(item.borrowDate) <= new Date(filters.endDate + ' 23:59:59'));
        }
        // Filtre par type d'emprunteur
        if (filters.borrowerType !== 'all') {
            filtered = filtered.filter(item => item.borrower?.type === filters.borrowerType);
        }
        // Filtre par statut
        if (filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === filters.status);
        }
        // Recherche textuelle
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.book?.title.toLowerCase().includes(query) ||
                item.book?.author.toLowerCase().includes(query) ||
                `${item.borrower?.firstName} ${item.borrower?.lastName}`.toLowerCase().includes(query) ||
                item.borrower?.matricule.toLowerCase().includes(query));
        }
        setFilteredHistory(filtered);
    };
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            borrowerType: 'all',
            status: 'all'
        });
        setSearchQuery('');
    };
    const handlePrint = async () => {
        try {
            const printData = {
                history: filteredHistory,
                filters,
                stats: getFilteredStats()
            };
            await window.electronAPI.printBorrowHistory(printData);
        }
        catch (error) {
            console.error('Erreur lors de l\'impression:', error);
        }
    };
    const handleExport = async () => {
        try {
            const exportData = {
                history: filteredHistory,
                filters,
                stats: getFilteredStats()
            };
            const filePath = await window.electronAPI.exportCSV(exportData);
            if (filePath) {
                alert(`Fichier exporté : ${filePath.split(/[/\\]/).pop()}`);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };
    const getFilteredStats = () => {
        const total = filteredHistory.length;
        const active = filteredHistory.filter(h => h.status === 'active').length;
        const returned = filteredHistory.filter(h => h.status === 'returned').length;
        const overdue = filteredHistory.filter(h => h.status === 'overdue').length;
        const students = filteredHistory.filter(h => h.borrower?.type === 'student').length;
        const staff = filteredHistory.filter(h => h.borrower?.type === 'staff').length;
        return { total, active, returned, overdue, students, staff };
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 16, className: "text-blue-500" });
            case 'returned':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 16, className: "text-green-500" });
            case 'overdue':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 16, className: "text-red-500" });
            default:
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 16 });
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'En cours';
            case 'returned':
                return 'Rendu';
            case 'overdue':
                return 'En retard';
            default:
                return status;
        }
    };
    const stats = getFilteredStats();
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "history-overlay", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "history-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 28 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "modal-title", children: "Historique des Emprunts" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "modal-subtitle", children: [stats.total, " emprunt(s) \u2022 ", stats.active, " actif(s) \u2022 ", stats.returned, " rendu(s)"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-button", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 20 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon total", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: stats.total }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Total" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon active", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: stats.active }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "En cours" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon returned", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: stats.returned }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Rendus" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon overdue", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: stats.overdue }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "En retard" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filters-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filters-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "search-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "search-icon", size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Rechercher par document, auteur, emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-search", onClick: () => setSearchQuery(''), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 16 }) }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filter-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filter-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: filters.startDate, onChange: (e) => handleFilterChange('startDate', e.target.value), className: "date-input", placeholder: "Date d\u00E9but" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "filter-separator", children: "\u00E0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: filters.endDate, onChange: (e) => handleFilterChange('endDate', e.target.value), className: "date-input", placeholder: "Date fin" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filter-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filters.borrowerType, onChange: (e) => handleFilterChange('borrowerType', e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous les emprunteurs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "student", children: "\u00C9tudiants" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "staff", children: "Personnel" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "filter-group", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filters.status, onChange: (e) => handleFilterChange('status', e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous les statuts" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "active", children: "En cours" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "returned", children: "Rendus" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "overdue", children: "En retard" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "reset-filters-btn", onClick: resetFilters, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 16 }), "R\u00E9initialiser"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "actions-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "results-info", children: [filteredHistory.length, " r\u00E9sultat(s) affich\u00E9(s)"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "export-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "btn-secondary", onClick: handleExport, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 16 }), "Exporter CSV"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "btn-primary", onClick: handlePrint, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }), "Imprimer"] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "history-content", children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "loading-state", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Chargement de l'historique..." })] })) : filteredHistory.length > 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "history-list", children: filteredHistory.map((item) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `history-item ${item.status}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "item-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-section", children: [getStatusIcon(item.status), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "status-label", children: getStatusLabel(item.status) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dates-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "borrow-date", children: ["Emprunt\u00E9 le ", new Date(item.borrowDate).toLocaleDateString('fr-FR')] }), item.actualReturnDate && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "return-date", children: ["Rendu le ", new Date(item.actualReturnDate).toLocaleDateString('fr-FR')] }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "item-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "book-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "book-cover", children: item.book?.coverUrl ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: item.book.coverUrl, alt: item.book.title })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 24 })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "book-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "book-title", children: item.book?.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "book-author", children: ["par ", item.book?.author] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "book-category", children: item.book?.category })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-type", children: [item.borrower?.type === 'student' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 16 })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h4", { className: "borrower-name", children: [item.borrower?.firstName, " ", item.borrower?.lastName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "borrower-details", children: [item.borrower?.matricule, item.borrower?.type === 'student' && item.borrower.classe &&
                                                                        ` • ${item.borrower.classe}`, item.borrower?.type === 'staff' && item.borrower.position &&
                                                                        ` • ${item.borrower.position}`] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-dot borrow" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-label", children: "Emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-date", children: [new Date(item.borrowDate).toLocaleDateString('fr-FR'), " \u00E0", ' ', new Date(item.borrowDate).toLocaleTimeString('fr-FR', {
                                                                                hour: '2-digit', minute: '2-digit'
                                                                            })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-dot expected" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-label", children: "Retour pr\u00E9vu" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-date", children: new Date(item.expectedReturnDate).toLocaleDateString('fr-FR') })] })] }), item.actualReturnDate && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-dot return" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "timeline-label", children: "Retour effectu\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "timeline-date", children: [new Date(item.actualReturnDate).toLocaleDateString('fr-FR'), " \u00E0", ' ', new Date(item.actualReturnDate).toLocaleTimeString('fr-FR', {
                                                                                hour: '2-digit', minute: '2-digit'
                                                                            })] })] })] }))] })] }), item.notes && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "item-notes", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Notes :" }), " ", item.notes] }))] }, item.id))) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "empty-state", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 64 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Aucun historique trouv\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: Object.values(filters).some(f => f && f !== 'all') || searchQuery
                                        ? 'Aucun résultat pour les critères sélectionnés'
                                        : 'L\'historique des emprunts apparaîtra ici' }), (Object.values(filters).some(f => f && f !== 'all') || searchQuery) && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: resetFilters, children: "Effacer les filtres" }))] })) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .history-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .history-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);
          color: #F3EED9;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .stats-section {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);
          flex: 1;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .stat-icon.total { background: #6E6E6E; }
        .stat-icon.active { background: #3B82F6; }
        .stat-icon.returned { background: #3E5C49; }
        .stat-icon.overdue { background: #DC2626; }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filters-section {
          padding: 24px 32px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .filters-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6E6E6E;
          box-shadow: 0 0 0 3px rgba(110, 110, 110, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2E2E2E;
          background: #F3EED9;
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .date-input, .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-separator {
          margin: 0 8px;
          color: #6E6E6E;
          font-size: 14px;
        }
        
        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-filters-btn:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .results-info {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .export-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .btn-secondary:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #6E6E6E;
          color: #F3EED9;
        }
        
        .btn-primary:hover {
          background: #5A5A5A;
        }
        
        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E5DCC2;
          border-top: 3px solid #6E6E6E;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .history-item {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .history-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #6E6E6E;
        }
        
        .history-item.active::before { background: #3B82F6; }
        .history-item.returned::before { background: #3E5C49; }
        .history-item.overdue::before { background: #DC2626; }
        
        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F9FAFB;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .status-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dates-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        
        .borrow-date, .return-date {
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .return-date {
          font-weight: 600;
          color: #3E5C49;
        }
        
        .item-content {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 24px;
          padding: 20px;
        }
        
        .book-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .book-cover {
          width: 48px;
          height: 64px;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
          flex-shrink: 0;
          overflow: hidden;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 8px 0;
        }
        
        .book-category {
          background: #6E6E6E;
          color: #F3EED9;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .borrower-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .borrower-name {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .borrower-details {
          font-size: 13px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .timeline-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .timeline-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .timeline-dot.borrow { background: #3B82F6; }
        .timeline-dot.expected { background: #F59E0B; }
        .timeline-dot.return { background: #3E5C49; }
        
        .timeline-label {
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .timeline-date {
          font-size: 12px;
          color: #2E2E2E;
          margin-top: 2px;
        }
        
        .item-notes {
          padding: 16px 20px;
          background: #FEF7F0;
          border-top: 1px solid #E5DCC2;
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #2E2E2E;
        }
        
        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }
        
        .text-blue-500 { color: #3B82F6; }
        .text-green-500 { color: #3E5C49; }
        .text-red-500 { color: #DC2626; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .item-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .filter-controls {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 768px) {
          .history-modal {
            margin: 12px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-section {
            padding: 16px 20px;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .stat-card {
            flex: 1;
            min-width: calc(50% - 6px);
          }
          
          .filters-section {
            padding: 16px 20px;
          }
          
          .history-content {
            padding: 16px 20px;
          }
          
          .book-section {
            flex-direction: column;
            text-align: center;
          }
          
          .timeline-section {
            align-items: center;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/BorrowedDocuments.tsx":
/*!*******************************************************!*\
  !*** ./src/renderer/components/BorrowedDocuments.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BorrowedDocuments: () => (/* binding */ BorrowedDocuments)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-triangle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs");



const BorrowedDocuments = ({ documents, onReturn }) => {
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [sortBy, setSortBy] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('date');
    const [filterStatus, setFilterStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const handleReturn = (document) => {
        if (window.confirm(`Confirmer le retour de "${document.titre}" emprunté par ${document.nomEmprunteur} ?`)) {
            onReturn(document.id);
        }
    };
    // Filter and sort documents
    const processedDocuments = documents
        .filter(doc => {
        if (!searchQuery)
            return true;
        const query = searchQuery.toLowerCase();
        return (doc.titre.toLowerCase().includes(query) ||
            doc.auteur.toLowerCase().includes(query) ||
            doc.nomEmprunteur?.toLowerCase().includes(query));
    })
        .filter(doc => {
        if (filterStatus === 'all')
            return true;
        const borrowDate = new Date(doc.dateEmprunt);
        const expectedDate = new Date(doc.dateRetourPrevu);
        const today = new Date();
        const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        switch (filterStatus) {
            case 'overdue': return diffDays < 0;
            case 'warning': return diffDays >= 0 && diffDays <= 3;
            case 'normal': return diffDays > 3;
            default: return true;
        }
    })
        .sort((a, b) => {
        switch (sortBy) {
            case 'title': return a.titre.localeCompare(b.titre);
            case 'borrower': return (a.nomEmprunteur || '').localeCompare(b.nomEmprunteur || '');
            case 'date': return new Date(a.dateEmprunt).getTime() - new Date(b.dateEmprunt).getTime();
            case 'status':
                const getStatusPriority = (doc) => {
                    const expectedDate = new Date(doc.dateRetourPrevu);
                    const today = new Date();
                    const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays < 0)
                        return 3; // overdue
                    if (diffDays <= 3)
                        return 2; // warning
                    return 1; // normal
                };
                return getStatusPriority(b) - getStatusPriority(a);
            default: return 0;
        }
    });
    const getStatusInfo = (document) => {
        const borrowDate = new Date(document.dateEmprunt);
        const expectedDate = new Date(document.dateRetourPrevu);
        const today = new Date();
        const diffDays = Math.floor((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            return {
                status: 'overdue',
                label: `En retard de ${Math.abs(diffDays)} jour(s)`,
                className: 'status-overdue',
                icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"]
            };
        }
        else if (diffDays <= 3) {
            return {
                status: 'warning',
                label: diffDays === 0 ? 'À rendre aujourd\'hui' : `${diffDays} jour(s) restant(s)`,
                className: 'status-warning',
                icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"]
            };
        }
        else {
            return {
                status: 'normal',
                label: `${diffDays} jour(s) restant(s)`,
                className: 'status-normal',
                icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"]
            };
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrowed-documents-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "page-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "page-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-main", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 36 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "page-title", children: "Documents emprunt\u00E9s" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "page-subtitle", children: [documents.length, " document(s) actuellement en circulation"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "enhanced-controls", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "controls-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "search-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "search-icon", size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Rechercher par document, auteur, emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-search", onClick: () => setSearchQuery(''), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 18 }) }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filter-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "date", children: "Trier par date d'emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "title", children: "Trier par titre" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "borrower", children: "Trier par emprunteur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "status", children: "Trier par statut" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous les statuts" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "overdue", children: "En retard" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "warning", children: "\u00C0 rendre bient\u00F4t" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "normal", children: "Dans les temps" })] })] })] }) })] }), searchQuery && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "results-summary", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "results-count", children: [processedDocuments.length, " r\u00E9sultat(s) pour \"", searchQuery, "\""] }) })), processedDocuments.length > 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "documents-grid", children: processedDocuments.map(document => {
                            const statusInfo = getStatusInfo(document);
                            const StatusIcon = statusInfo.icon;
                            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `document-card ${statusInfo.className}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "document-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "document-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "document-title", children: document.titre }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "document-author", children: document.auteur }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "document-details", children: [document.editeur, " \u2022 ", document.annee] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "document-status", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StatusIcon, { size: 20 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrower-info", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-name", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: document.nomEmprunteur })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrow-dates", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "date-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Emprunt\u00E9 le ", new Date(document.dateEmprunt).toLocaleDateString('fr-FR')] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "date-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["\u00C0 rendre le ", new Date(document.dateRetourPrevu).toLocaleDateString('fr-FR')] })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "document-status-bar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `status-badge ${statusInfo.className}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StatusIcon, { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: statusInfo.label })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "document-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => handleReturn(document), className: "return-button", title: "Marquer comme rendu", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 16 }), "Retour"] }) })] }, document.id));
                        }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "empty-state", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "empty-icon", children: searchQuery ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 80 })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 80 })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "empty-title", children: documents.length === 0 ? 'Aucun document emprunté' : 'Aucun résultat' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "empty-description", children: documents.length === 0
                                    ? 'Tous les documents sont actuellement disponibles dans la bibliothèque.'
                                    : searchQuery
                                        ? `Aucun résultat pour "${searchQuery}"`
                                        : 'Aucun document ne correspond aux filtres sélectionnés.' }), (searchQuery || filterStatus !== 'all') && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-filters", onClick: () => {
                                    setSearchQuery('');
                                    setFilterStatus('all');
                                }, children: "Effacer les filtres" }))] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .borrowed-documents-container {
          padding: 24px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
        }

        .page-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #C2571B 0%, #E65100 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0;
        }

        .enhanced-controls {
          border-top: 1px solid #E5DCC2;
          padding-top: 24px;
        }

        .controls-row {
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 300px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #C2571B;
          box-shadow: 0 0 0 3px rgba(194, 87, 27, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          padding: 4px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: #f5f5f5;
          color: #2E2E2E;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #2E2E2E;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #C2571B;
          box-shadow: 0 0 0 3px rgba(194, 87, 27, 0.1);
        }

        .results-summary {
          background: white;
          border-radius: 12px;
          padding: 16px 24px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .results-count {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .document-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border-left: 4px solid #E5DCC2;
        }

        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .document-card.status-overdue {
          border-left-color: #DC2626;
          background: linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%);
        }

        .document-card.status-warning {
          border-left-color: #F59E0B;
          background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%);
        }

        .document-card.status-normal {
          border-left-color: #10B981;
          background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .document-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .document-author {
          font-size: 14px;
          color: #3E5C49;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .document-details {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }

        .document-status {
          padding: 8px;
          border-radius: 8px;
          background: rgba(243, 238, 217, 0.5);
        }

        .borrower-info {
          padding: 16px;
          background: rgba(243, 238, 217, 0.3);
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .borrower-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 12px;
        }

        .borrow-dates {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6E6E6E;
        }

        .document-status-bar {
          margin-bottom: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.status-overdue {
          background: #FEE2E2;
          color: #DC2626;
        }

        .status-badge.status-warning {
          background: #FEF3C7;
          color: #F59E0B;
        }

        .status-badge.status-normal {
          background: #D1FAE5;
          color: #10B981;
        }

        .document-actions {
          display: flex;
          justify-content: flex-end;
        }

        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .return-button:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }

        .empty-icon {
          margin-bottom: 24px;
          color: #E5DCC2;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }

        .empty-description {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .clear-filters {
          padding: 12px 24px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194, 87, 27, 0.3);
        }

        @media (max-width: 768px) {
          .borrowed-documents-container {
            padding: 16px;
          }

          .page-header {
            padding: 20px;
          }

          .header-main {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .controls-row {
            flex-direction: column;
            gap: 16px;
          }

          .search-container {
            min-width: unset;
          }

          .filter-controls {
            width: 100%;
            justify-content: space-between;
          }

          .filter-select {
            flex: 1;
            min-width: unset;
          }

          .documents-grid {
            grid-template-columns: 1fr;
          }

          .document-card {
            padding: 20px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/Borrowers.tsx":
/*!***********************************************!*\
  !*** ./src/renderer/components/Borrowers.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Borrowers: () => (/* binding */ Borrowers)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/briefcase.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/filter.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/pen-square.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash-2.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/hash.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/school.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/save.mjs");



const Borrowers = ({ onClose, onRefreshData }) => {
    const [borrowers, setBorrowers] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [filterType, setFilterType] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const [showAddModal, setShowAddModal] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [editingBorrower, setEditingBorrower] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [borrower, setBorrower] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        type: 'student',
        firstName: '',
        lastName: '',
        matricule: '',
        classe: '',
        cniNumber: '',
        position: '',
        email: '',
        phone: '',
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: 1
    });
    const [formErrors, setFormErrors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadBorrowers();
    }, []);
    const loadBorrowers = async () => {
        try {
            const data = await window.electronAPI.getBorrowers();
            setBorrowers(data);
        }
        catch (error) {
            console.error('Erreur lors du chargement des emprunteurs:', error);
        }
    };
    const validateForm = () => {
        const errors = {};
        if (!borrower.firstName.trim()) {
            errors.firstName = 'Le prénom est requis';
        }
        if (!borrower.lastName.trim()) {
            errors.lastName = 'Le nom est requis';
        }
        if (!borrower.matricule.trim()) {
            errors.matricule = 'Le matricule est requis';
        }
        if (borrower.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(borrower.email)) {
            errors.email = 'Format email invalide';
        }
        if (borrower.phone && !/^[\d\s\+\-\(\)]{6,}$/.test(borrower.phone)) {
            errors.phone = 'Format téléphone invalide';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            try {
                const results = await window.electronAPI.searchBorrowers(query);
                setBorrowers(results);
            }
            catch (error) {
                console.error('Erreur lors de la recherche:', error);
            }
        }
        else {
            loadBorrowers();
        }
    };
    const resetForm = () => {
        setBorrower({
            type: 'student',
            firstName: '',
            lastName: '',
            matricule: '',
            classe: '',
            cniNumber: '',
            position: '',
            email: '',
            phone: '',
            syncStatus: 'pending',
            lastModified: new Date().toISOString(),
            version: 1
        });
        setFormErrors({});
        setEditingBorrower(null);
    };
    const handleAddBorrower = () => {
        resetForm();
        setShowAddModal(true);
    };
    const handleEditBorrower = (editBorrower) => {
        setBorrower({
            type: editBorrower.type,
            firstName: editBorrower.firstName,
            lastName: editBorrower.lastName,
            matricule: editBorrower.matricule,
            classe: editBorrower.classe || '',
            cniNumber: editBorrower.cniNumber || '',
            position: editBorrower.position || '',
            email: editBorrower.email || '',
            phone: editBorrower.phone || '',
            syncStatus: editBorrower.syncStatus,
            lastModified: new Date().toISOString(),
            version: (editBorrower.version || 1) + 1
        });
        setFormErrors({});
        setEditingBorrower(editBorrower);
        setShowAddModal(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            if (editingBorrower) {
                await window.electronAPI.updateBorrower({ ...borrower, id: editingBorrower.id });
            }
            else {
                await window.electronAPI.addBorrower(borrower);
            }
            setShowAddModal(false);
            resetForm();
            await loadBorrowers();
            // Rafraîchir les données dans le parent si callback fourni
            if (onRefreshData) {
                await onRefreshData();
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            if (error.message && error.message.includes('matricule')) {
                setFormErrors({ matricule: 'Un emprunteur avec ce matricule existe déjà' });
            }
            else {
                alert(error.message || 'Erreur lors de l\'opération');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (borrower) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${borrower.firstName} ${borrower.lastName} ?`)) {
            try {
                await window.electronAPI.deleteBorrower(borrower.id);
                await loadBorrowers();
                // Rafraîchir les données dans le parent si callback fourni
                if (onRefreshData) {
                    await onRefreshData();
                }
            }
            catch (error) {
                alert(error.message || 'Erreur lors de la suppression');
            }
        }
    };
    const filteredBorrowers = borrowers.filter(borrower => {
        if (filterType !== 'all' && borrower.type !== filterType)
            return false;
        return true;
    });
    const studentCount = borrowers.filter(b => b.type === 'student').length;
    const staffCount = borrowers.filter(b => b.type === 'staff').length;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrowers-overlay", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrowers-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 28 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "modal-title", children: "Gestion des Emprunteurs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "modal-subtitle", children: [borrowers.length, " emprunteur(s) \u2022 ", studentCount, " \u00E9tudiant(s) \u2022 ", staffCount, " personnel(s)"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-button", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon student", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: studentCount }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "\u00C9tudiants" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon staff", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: staffCount }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Personnel" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon total", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-value", children: borrowers.length }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Total" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "controls-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "search-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "search-icon", size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", placeholder: "Rechercher par nom, pr\u00E9nom, matricule...", value: searchQuery, onChange: (e) => handleSearch(e.target.value), className: "search-input" }), searchQuery && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "clear-search", onClick: () => handleSearch(''), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 16 }) }))] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "controls-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "filter-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "filter-select", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "student", children: "\u00C9tudiants" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "staff", children: "Personnel" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "btn-primary", onClick: handleAddBorrower, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 18 }), "Ajouter"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrowers-content", children: filteredBorrowers.length > 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "borrowers-grid", children: filteredBorrowers.map((borrower) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `borrower-card ${borrower.type}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-type", children: [borrower.type === 'student' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 20 })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: borrower.type === 'student' ? 'Étudiant' : 'Personnel' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn view", onClick: () => { }, title: "Voir d\u00E9tails", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn edit", onClick: () => handleEditBorrower(borrower), title: "Modifier", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "action-btn delete", onClick: () => handleDelete(borrower), title: "Supprimer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "borrower-name", children: [borrower.firstName, " ", borrower.lastName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "borrower-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: borrower.matricule })] }), borrower.type === 'student' && borrower.classe && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: borrower.classe })] })), borrower.type === 'staff' && borrower.position && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: borrower.position })] })), borrower.email && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: borrower.email })] }))] })] })] }, borrower.id))) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "empty-state", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 64 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Aucun emprunteur trouv\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: searchQuery || filterType !== 'all'
                                        ? 'Aucun résultat pour les critères sélectionnés'
                                        : 'Commencez par ajouter des emprunteurs' })] })) }), showAddModal && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "add-modal-overlay", onClick: () => setShowAddModal(false), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-modal", onClick: (e) => e.stopPropagation(), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "add-modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { children: [editingBorrower ? 'Modifier' : 'Ajouter', " un emprunteur"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "modal-close", onClick: () => setShowAddModal(false), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "add-form", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Type d'emprunteur *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "type-selector", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: `type-button ${borrower.type === 'student' ? 'active' : ''}`, onClick: () => setBorrower(prev => ({ ...prev, type: 'student' })), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 }), "\u00C9tudiant"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: `type-button ${borrower.type === 'staff' ? 'active' : ''}`, onClick: () => setBorrower(prev => ({ ...prev, type: 'staff' })), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 20 }), "Personnel"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Pr\u00E9nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.firstName, onChange: (e) => {
                                                                setBorrower(prev => ({ ...prev, firstName: e.target.value }));
                                                                if (formErrors.firstName) {
                                                                    setFormErrors(prev => ({ ...prev, firstName: '' }));
                                                                }
                                                            }, className: `form-input ${formErrors.firstName ? 'error' : ''}`, required: true }), formErrors.firstName && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "error-text", children: formErrors.firstName })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.lastName, onChange: (e) => {
                                                                setBorrower(prev => ({ ...prev, lastName: e.target.value }));
                                                                if (formErrors.lastName) {
                                                                    setFormErrors(prev => ({ ...prev, lastName: '' }));
                                                                }
                                                            }, className: `form-input ${formErrors.lastName ? 'error' : ''}`, required: true }), formErrors.lastName && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "error-text", children: formErrors.lastName })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Matricule *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.matricule, onChange: (e) => {
                                                                setBorrower(prev => ({ ...prev, matricule: e.target.value }));
                                                                if (formErrors.matricule) {
                                                                    setFormErrors(prev => ({ ...prev, matricule: '' }));
                                                                }
                                                            }, className: `form-input ${formErrors.matricule ? 'error' : ''}`, required: true }), formErrors.matricule && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "error-text", children: formErrors.matricule })] }), borrower.type === 'student' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Classe" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.classe, onChange: (e) => setBorrower(prev => ({ ...prev, classe: e.target.value })), className: "form-input", placeholder: "ex: Terminale C" })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "N\u00B0 CNI" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.cniNumber, onChange: (e) => setBorrower(prev => ({ ...prev, cniNumber: e.target.value })), className: "form-input" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group span-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Poste" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: borrower.position, onChange: (e) => setBorrower(prev => ({ ...prev, position: e.target.value })), className: "form-input", placeholder: "ex: Professeur de Math\u00E9matiques" })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: borrower.email, onChange: (e) => {
                                                                setBorrower(prev => ({ ...prev, email: e.target.value }));
                                                                if (formErrors.email) {
                                                                    setFormErrors(prev => ({ ...prev, email: '' }));
                                                                }
                                                            }, className: `form-input ${formErrors.email ? 'error' : ''}` }), formErrors.email && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "error-text", children: formErrors.email })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "T\u00E9l\u00E9phone" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "tel", value: borrower.phone, onChange: (e) => {
                                                                setBorrower(prev => ({ ...prev, phone: e.target.value }));
                                                                if (formErrors.phone) {
                                                                    setFormErrors(prev => ({ ...prev, phone: '' }));
                                                                }
                                                            }, className: `form-input ${formErrors.phone ? 'error' : ''}` }), formErrors.phone && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "error-text", children: formErrors.phone })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "btn-secondary", onClick: () => setShowAddModal(false), disabled: isLoading, children: "Annuler" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "submit", className: "btn-primary", disabled: isLoading, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 16 }), isLoading ? 'Enregistrement...' : editingBorrower ? 'Modifier' : 'Ajouter'] })] })] })] }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .borrowers-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .borrowers-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .stats-section {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);
          flex: 1;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .stat-icon.student {
          background: #3E5C49;
        }
        
        .stat-icon.staff {
          background: #C2571B;
        }
        
        .stat-icon.total {
          background: #6E6E6E;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .controls-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #FFFFFF;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2E2E2E;
          background: #F3EED9;
        }
        
        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #3E5C49;
        }
        
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
        }
        
        .borrowers-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .borrowers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .borrower-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .borrower-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #3E5C49;
        }
        
        .borrower-card.staff::before {
          background: #C2571B;
        }
        
        .borrower-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .card-actions {
          display: flex;
          gap: 4px;
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .action-btn.view {
          background: #F3EED9;
          color: #6E6E6E;
        }
        
        .action-btn.view:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .action-btn.edit {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .action-btn.edit:hover {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-btn.delete {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .action-btn.delete:hover {
          background: #C2571B;
          color: #F3EED9;
        }
        
        .card-content {
          padding: 20px;
        }
        
        .borrower-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .borrower-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #2E2E2E;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 14px;
        }
        
        /* Add Modal */
        .add-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }
        
        .add-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
        }
        
        .add-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #F3EED9;
        }
        
        .add-modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }
        
        .modal-close {
          background: rgba(110, 110, 110, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: rgba(110, 110, 110, 0.2);
          color: #2E2E2E;
        }
        
        .add-form {
          padding: 32px;
        }
        
        .form-section {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .type-selector {
          display: flex;
          gap: 12px;
        }
        
        .type-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          background: #FFFFFF;
          color: #6E6E6E;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          flex: 1;
          justify-content: center;
        }
        
        .type-button:hover {
          border-color: #3E5C49;
          color: #3E5C49;
        }
        
        .type-button.active {
          border-color: #3E5C49;
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group.span-full {
          grid-column: 1 / -1;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .form-input.error {
          border-color: #C2571B;
          background: rgba(194, 87, 27, 0.05);
        }
        
        .error-text {
          font-size: 12px;
          color: #C2571B;
          font-weight: 500;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #E5DCC2;
        }
        
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .borrowers-modal {
            margin: 12px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-section {
            padding: 16px 20px;
            flex-direction: column;
            gap: 12px;
          }
          
          .controls-section {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .controls-right {
            justify-content: space-between;
          }
          
          .borrowers-content {
            padding: 16px 20px;
          }
          
          .borrowers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .type-selector {
            flex-direction: column;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .add-modal {
            margin: 8px;
            border-radius: 16px;
          }
          
          .add-modal-header,
          .add-form {
            padding: 20px 16px;
          }
          
          .borrower-card {
            border-radius: 12px;
          }
          
          .card-header,
          .card-content {
            padding: 16px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/Dashboard.tsx":
/*!***********************************************!*\
  !*** ./src/renderer/components/Dashboard.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dashboard: () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/printer.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/activity.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-right.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trending-up.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.mjs");
/* harmony import */ var _PrintManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PrintManager */ "./src/renderer/components/PrintManager.tsx");




const Dashboard = ({ stats, onNavigate, documents = [], categories = [] }) => {
    const [showPrintManager, setShowPrintManager] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const heroActions = [
        {
            title: 'Ajouter un document',
            description: 'Enrichissez votre collection',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
            action: () => onNavigate('add-document'),
            primary: true
        },
        {
            title: 'Parcourir la collection',
            description: 'Explorer tous les documents',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"],
            action: () => onNavigate('documents'),
            primary: false
        }
    ];
    const quickActions = [
        {
            title: 'Collection complète',
            description: `${stats.totalBooks} documents disponibles`,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"],
            action: () => onNavigate('documents'),
            color: '#3E5C49'
        },
        {
            title: 'Gérer les emprunts',
            description: `${stats.borrowedBooks} document(s) emprunté(s)`,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"],
            action: () => onNavigate('borrowed'),
            color: '#C2571B',
            badge: stats.borrowedBooks > 0
        },
        {
            title: 'Rapports & Export',
            description: 'Imprimer les inventaires',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
            action: () => setShowPrintManager(true),
            color: '#6E6E6E'
        }
    ];
    const mainStats = [
        {
            title: 'Total des documents',
            value: stats.totalBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"],
            color: '#3E5C49',
            trend: '+2 ce mois'
        },
        {
            title: 'Disponibles',
            value: stats.availableBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"],
            color: '#3E5C49',
            percentage: stats.totalBooks > 0 ? ((stats.availableBooks / stats.totalBooks) * 100).toFixed(0) : 0
        },
        {
            title: 'Empruntés',
            value: stats.borrowedBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"],
            color: '#C2571B',
            percentage: stats.totalBooks > 0 ? ((stats.borrowedBooks / stats.totalBooks) * 100).toFixed(0) : 0
        },
        {
            title: 'Auteurs',
            value: stats.totalAuthors,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"],
            color: '#6E6E6E',
            trend: 'Actifs'
        }
    ];
    const recentActivity = [
        {
            type: 'add',
            title: 'Nouveau document ajouté',
            description: 'Les Misérables par Victor Hugo',
            time: 'Il y a 2 heures',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"]
        },
        {
            type: 'borrow',
            title: 'Document emprunté',
            description: 'Fondation par Isaac Asimov',
            time: 'Il y a 1 jour',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"]
        },
        {
            type: 'return',
            title: 'Document rendu',
            description: 'L\'Étranger par Albert Camus',
            time: 'Il y a 2 jours',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"]
        }
    ];
    const borrowRate = stats.totalBooks > 0 ? (stats.borrowedBooks / stats.totalBooks * 100).toFixed(1) : 0;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dashboard", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-section", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "hero-title", children: "Bienvenue dans votre biblioth\u00E8que" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "hero-subtitle", children: ["G\u00E9rez votre collection de ", stats.totalBooks, " documents avec facilit\u00E9 et \u00E9l\u00E9gance"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-actions", children: heroActions.map((action, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `hero-button ${action.primary ? 'primary' : 'secondary'}`, onClick: action.action, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(action.icon, { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: action.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-visual", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "floating-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Collection" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-number", children: stats.totalBooks }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Documents" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-number", children: stats.borrowedBooks }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-label", children: "Emprunt\u00E9s" })] })] })] }) })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dashboard-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "section-title", children: "Vue d'ensemble" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-subtitle", children: "Statistiques de votre biblioth\u00E8que" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stats-grid", children: mainStats.map((stat, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-card card-elevated", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-header", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon", style: { color: stat.color }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(stat.icon, { size: 24 }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [stat.trend && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "stat-trend", children: stat.trend }), stat.percentage && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "stat-percentage", children: [stat.percentage, "%"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-value", children: stat.value }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-title", children: stat.title })] })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dashboard-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "quick-actions-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-header", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "section-title", children: "Actions rapides" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "actions-grid", children: quickActions.map((action, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "action-card card-elevated", onClick: action.action, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-icon", style: { backgroundColor: action.color }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(action.icon, { size: 20 }), action.badge && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-badge" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-title", children: action.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-description", children: action.description })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16, className: "action-arrow" })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-header", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "section-title", children: "Utilisation" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-card card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "progress-label", children: "Taux d'emprunt" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "progress-value", children: [borrowRate, "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-bar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-fill", style: { width: `${borrowRate}%` } }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-metrics", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "metric", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Tendance stable" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "metric", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Mis \u00E0 jour maintenant" })] })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "section-title", children: "Activit\u00E9 r\u00E9cente" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "view-all-button", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 }), "Voir tout"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-list card", children: recentActivity.map((activity, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(activity.icon, { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-title", children: activity.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-description", children: activity.description })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-time", children: activity.time })] }, index))) })] })] }), showPrintManager && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_PrintManager__WEBPACK_IMPORTED_MODULE_2__.PrintManager, { books: documents, stats: stats, categories: categories, onClose: () => setShowPrintManager(false) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .dashboard {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 48px 32px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23F3EED9" opacity="0.05"/><circle cx="60" cy="40" r="1" fill="%23F3EED9" opacity="0.03"/><circle cx="80" cy="80" r="1" fill="%23F3EED9" opacity="0.04"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .hero-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .hero-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .hero-button.primary {
          background: #C2571B;
          color: #F3EED9;
        }
        
        .hero-button.primary:hover {
          background: #A8481A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }
        
        .hero-button.secondary {
          background: rgba(243, 238, 217, 0.15);
          color: #F3EED9;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .hero-button.secondary:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateY(-2px);
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .floating-card {
          background: rgba(243, 238, 217, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 16px;
        }
        
        .card-stats {
          display: flex;
          justify-content: space-between;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dashboard-content {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
          letter-spacing: -0.3px;
        }
        
        .section-subtitle {
          font-size: 14px;
          color: #6E6E6E;
          margin-top: 4px;
        }
        
        .stats-section {
          margin-bottom: 48px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        
        .stat-card {
          padding: 24px;
          border-radius: 16px;
          background: #FFFFFF;
        }
        
        .stat-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .stat-icon {
          padding: 12px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
        }
        
        .stat-meta {
          text-align: right;
          font-size: 12px;
        }
        
        .stat-trend {
          color: #3E5C49;
          font-weight: 600;
        }
        
        .stat-percentage {
          color: #6E6E6E;
          font-weight: 600;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #2E2E2E;
          line-height: 1;
          margin-bottom: 8px;
        }
        
        .stat-title {
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }
        
        .actions-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .action-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #FFFFFF;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .action-card:hover {
          transform: translateX(4px);
        }
        
        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
          position: relative;
        }
        
        .action-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background: #C2571B;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          animation: pulse 2s infinite;
        }
        
        .action-content {
          flex: 1;
        }
        
        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .action-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .action-arrow {
          color: #6E6E6E;
          transition: transform 0.2s ease;
        }
        
        .action-card:hover .action-arrow {
          transform: translateX(4px);
        }
        
        .progress-card {
          padding: 24px;
          background: #FFFFFF;
          border-radius: 16px;
        }
        
        .progress-item {
          margin-bottom: 20px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .progress-label {
          font-size: 14px;
          font-weight: 500;
          color: #2E2E2E;
        }
        
        .progress-value {
          font-size: 18px;
          font-weight: 700;
          color: #3E5C49;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #F3EED9;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3E5C49, #C2571B);
          transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .progress-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .activity-list {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-bottom: 1px solid #F3EED9;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          width: 40px;
          height: 40px;
          background: #F3EED9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
          flex-shrink: 0;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-title {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .activity-description {
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .activity-time {
          font-size: 12px;
          color: #6E6E6E;
          text-align: right;
        }
        
        .view-all-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F3EED9;
          border: none;
          border-radius: 8px;
          color: #3E5C49;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-all-button:hover {
          background: #EAEADC;
          transform: translateY(-1px);
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .dashboard-content {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .section-title {
            font-size: 20px;
          }
          
          .floating-card {
            padding: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-button {
            width: 100%;
            justify-content: center;
          }
          
          .action-card {
            padding: 16px;
          }
          
          .activity-item {
            padding: 16px;
          }
          
          .stat-card {
            padding: 16px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/DocumentList.tsx":
/*!**************************************************!*\
  !*** ./src/renderer/components/DocumentList.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentList: () => (/* binding */ DocumentList)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/wifi.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/wifi-off.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/loader-2.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/map-pin.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/calendar.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/hash.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/tag.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/pen-square.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash-2.mjs");



const DocumentList = ({ documents, onAdd, onEdit, onDelete, onRefresh, syncStatus, networkStatus }) => {
    const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [selectedCategory, setSelectedCategory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const [selectedSyncStatus, setSelectedSyncStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    const [filteredDocuments, setFilteredDocuments] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        filterDocuments();
    }, [documents, searchTerm, selectedCategory, selectedSyncStatus]);
    const filterDocuments = () => {
        let filtered = documents;
        // Filtrage par terme de recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(doc => doc.titre.toLowerCase().includes(term) ||
                doc.auteur.toLowerCase().includes(term) ||
                doc.editeur.toLowerCase().includes(term) ||
                doc.descripteurs.toLowerCase().includes(term) ||
                doc.cote.toLowerCase().includes(term) ||
                (doc.isbn && doc.isbn.toLowerCase().includes(term)));
        }
        // Filtrage par catégorie (utilise les descripteurs)
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(doc => doc.descripteurs.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
        // Filtrage par statut de sync
        if (selectedSyncStatus !== 'all') {
            filtered = filtered.filter(doc => doc.syncStatus === selectedSyncStatus);
        }
        setFilteredDocuments(filtered);
    };
    const getUniqueCategories = () => {
        const categories = new Set();
        documents.forEach(doc => {
            doc.descripteurs.split(',').forEach(desc => {
                categories.add(desc.trim());
            });
        });
        return Array.from(categories).sort();
    };
    const getSyncStatusIcon = (status) => {
        switch (status) {
            case 'synced':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { className: "w-4 h-4 text-green-500" });
            case 'pending':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "w-4 h-4 text-yellow-500" });
            case 'error':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "w-4 h-4 text-red-500" });
            case 'conflict':
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { className: "w-4 h-4 text-orange-500" });
            default:
                return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getNetworkStatusDisplay = () => {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [networkStatus.isOnline ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 text-green-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "w-4 h-4" }), "En ligne"] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 text-red-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "w-4 h-4" }), "Hors ligne"] })), syncStatus.syncInProgress && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 text-blue-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { className: "w-4 h-4 animate-spin" }), "Synchronisation..."] })), syncStatus.pendingOperations > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-orange-600", children: [syncStatus.pendingOperations, " en attente"] }))] }));
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", { className: "text-2xl font-bold text-gray-800 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "w-6 h-6 text-blue-500" }), "Documents (", filteredDocuments.length, ")"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-1", children: "Gestion de la collection documentaire" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [getNetworkStatusDisplay(), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: onAdd, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "w-4 h-4" }), "Nouveau document"] })] })] }), syncStatus.lastSync && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-2 text-sm text-gray-500", children: ["Derni\u00E8re synchronisation: ", new Date(syncStatus.lastSync).toLocaleString('fr-FR')] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "md:col-span-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Rechercher" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Titre, auteur, \u00E9diteur, cote, ISBN..." })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cat\u00E9gorie" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Toutes les cat\u00E9gories" }), getUniqueCategories().map(category => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: category, children: category }, category)))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut sync" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { value: selectedSyncStatus, onChange: (e) => setSelectedSyncStatus(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "all", children: "Tous les statuts" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "synced", children: "Synchronis\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "pending", children: "En attente" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "error", children: "Erreur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "conflict", children: "Conflit" })] })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredDocuments.map((document) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow", children: [document.couverture && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-48 bg-gray-100 rounded-t-lg overflow-hidden", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: document.couverture, alt: `Couverture de ${document.titre}`, className: "w-full h-full object-cover", onError: (e) => {
                                    e.currentTarget.style.display = 'none';
                                } }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "font-semibold text-gray-800 truncate", title: document.titre, children: document.titre }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-600 truncate", title: document.auteur, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { className: "w-3 h-3 inline mr-1" }), document.auteur] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 ml-2", children: [getSyncStatusIcon(document.syncStatus), document.estEmprunte && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full", title: "Emprunt\u00E9" }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-2 text-sm text-gray-600", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { className: "w-3 h-3 flex-shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "truncate", children: document.editeur })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { className: "w-3 h-3 flex-shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "truncate", children: document.lieuEdition })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { className: "w-3 h-3 flex-shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: document.annee })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-1 truncate", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { className: "w-3 h-3 flex-shrink-0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "font-mono text-xs truncate", children: document.cote })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start gap-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { className: "w-3 h-3 flex-shrink-0 mt-0.5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-wrap gap-1 min-w-0", children: [document.descripteurs.split(',').slice(0, 3).map((desc, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full truncate max-w-20", title: desc.trim(), children: desc.trim() }, index))), document.descripteurs.split(',').length > 3 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-500", children: ["+", document.descripteurs.split(',').length - 3] }))] })] })] }), document.description && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mt-3 line-clamp-2", title: document.description, children: document.description })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center mt-4 pt-3 border-t", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-xs text-gray-500", children: ["v", document.version, " \u2022 ", new Date(document.lastModified).toLocaleDateString('fr-FR')] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => onEdit(document), className: "p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors", title: "Modifier", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { className: "w-4 h-4" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => document.id && onDelete(document.id), className: "p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors", title: "Supprimer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { className: "w-4 h-4" }) })] })] })] })] }, document.id))) }), filteredDocuments.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                            ? 'Aucun document trouvé'
                            : 'Aucun document dans la collection' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-500 mb-6", children: searchTerm || selectedCategory !== 'all' || selectedSyncStatus !== 'all'
                            ? 'Essayez de modifier vos critères de recherche'
                            : 'Commencez par ajouter votre premier document à la bibliothèque' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: onAdd, className: "bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { className: "w-4 h-4" }), "Ajouter un document"] })] }))] }));
};


/***/ }),

/***/ "./src/renderer/components/Donation.tsx":
/*!**********************************************!*\
  !*** ./src/renderer/components/Donation.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Donation: () => (/* binding */ Donation)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/coffee.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/heart.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/gift.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/star.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/smartphone.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/credit-card.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-left.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/code.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sparkles.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/copy.mjs");



const Donation = ({ onClose }) => {
    const [selectedAmount, setSelectedAmount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1000);
    const [customAmount, setCustomAmount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [paymentMethod, setPaymentMethod] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('momo');
    const [copied, setCopied] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const predefinedAmounts = [
        { value: 500, label: '500 FCFA', icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], description: 'Un café pour le dev' },
        { value: 1000, label: '1 000 FCFA', icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], description: 'Petit soutien', popular: true },
        { value: 2500, label: '2 500 FCFA', icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], description: 'Généreux donateur' },
        { value: 5000, label: '5 000 FCFA', icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], description: 'Super supporter' }
    ];
    const paymentMethods = [
        {
            id: 'momo',
            name: 'Mobile Money',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"],
            networks: [
                { name: 'MTN MoMo', number: '+237 652 761 931', color: '#FFCC00' },
                { name: 'Orange Money', number: '+237 652 761 931', color: '#FF6600' }
            ]
        },
        {
            id: 'card',
            name: 'Carte bancaire',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
            description: 'Paiement sécurisé via PayPal ou Stripe',
            comingSoon: true
        }
    ];
    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        }
        catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };
    const finalAmount = selectedAmount || parseInt(customAmount) || 0;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "donation-page", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-background", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-pattern" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "back-button", onClick: onClose, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Retour" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-main", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "hero-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "hero-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "hero-title", children: "Soutenez le projet Biblioth\u00E8que" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "hero-subtitle", children: "Votre contribution aide \u00E0 maintenir et am\u00E9liorer ce syst\u00E8me de gestion de biblioth\u00E8que gratuit" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-number", children: "500+" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-label", children: "Biblioth\u00E8ques utilisatrices" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-number", children: "10K+" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-label", children: "Livres g\u00E9r\u00E9s" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "impact-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-number", children: "100%" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "impact-label", children: "Open Source" })] })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "donation-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "section-title", children: "Choisir le montant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "section-description", children: "Chaque contribution, m\u00EAme petite, fait une grande diff\u00E9rence pour le d\u00E9veloppement du projet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "amounts-grid", children: predefinedAmounts.map((amount) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `amount-card ${selectedAmount === amount.value ? 'selected' : ''} ${amount.popular ? 'popular' : ''}`, onClick: () => {
                                        setSelectedAmount(amount.value);
                                        setCustomAmount('');
                                    }, children: [amount.popular && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "popular-badge", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 12 }), "Populaire"] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "amount-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(amount.icon, { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "amount-value", children: amount.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "amount-description", children: amount.description })] }, amount.value))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "custom-amount", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "custom-label", children: "Ou entrez un montant personnalis\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "custom-input-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", value: customAmount, onChange: (e) => {
                                                    setCustomAmount(e.target.value);
                                                    setSelectedAmount(null);
                                                }, placeholder: "0", className: "custom-input", min: "100" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "currency", children: "FCFA" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "section-title", children: "M\u00E9thode de paiement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "section-description", children: "Choisissez votre mode de paiement pr\u00E9f\u00E9r\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "payment-methods", children: paymentMethods.map((method) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `payment-method ${paymentMethod === method.id ? 'selected' : ''} ${method.comingSoon ? 'disabled' : ''}`, onClick: () => !method.comingSoon && setPaymentMethod(method.id), disabled: method.comingSoon, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "payment-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(method.icon, { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "payment-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "payment-name", children: method.name }), method.description && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "payment-description", children: method.description })), method.comingSoon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "coming-soon-badge", children: "Bient\u00F4t disponible" }))] })] }, method.id))) })] }), finalAmount > 0 && paymentMethod === 'momo' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "section-title", children: "D\u00E9tails de paiement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "section-description", children: ["Utilisez les informations ci-dessous pour effectuer votre don de ", finalAmount.toLocaleString(), " FCFA"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "payment-networks", children: paymentMethods[0].networks?.map((network, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "network-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "network-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "network-indicator", style: { backgroundColor: network.color } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "network-name", children: network.name })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "network-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "detail-label", children: "Num\u00E9ro" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-value", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "phone-number", children: network.number }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "copy-button", onClick: () => handleCopy(network.number.replace(/\s/g, ''), `${network.name}-number`), children: copied === `${network.name}-number` ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 16 })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 })) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "detail-label", children: "Nom" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-value", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CHEUDJEU TEFOYE CEDRIC BASILIO" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "copy-button", onClick: () => handleCopy('CHEUDJEU TEFOYE CEDRIC BASILIO', `${network.name}-name`), children: copied === `${network.name}-name` ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 16 })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 })) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "detail-label", children: "Montant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-value amount-highlight", children: [finalAmount.toLocaleString(), " FCFA"] })] })] })] }, index))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "payment-note", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "note-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "note-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Merci pour votre soutien !" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Apr\u00E8s votre transfert, n'h\u00E9sitez pas \u00E0 me contacter pour confirmer votre don et recevoir un re\u00E7u si n\u00E9cessaire. Votre contribution sera utilis\u00E9e pour am\u00E9liorer et maintenir ce projet open source." })] })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "section-title", children: "Pourquoi faire un don ?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "why-donate-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "why-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "why-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "D\u00E9veloppement continu" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Financer de nouvelles fonctionnalit\u00E9s et l'am\u00E9lioration du syst\u00E8me" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "why-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "why-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Gratuit pour tous" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Maintenir le projet accessible gratuitement pour toutes les biblioth\u00E8ques" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "why-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "why-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Support communautaire" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Fournir une assistance technique et des formations aux utilisateurs" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "why-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "why-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Innovation" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Int\u00E9grer les derni\u00E8res technologies pour une meilleure exp\u00E9rience" })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .donation-page {
          height: 100%;
          overflow-y: auto;
          background: #FAF9F6;
        }
        
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
          color: #F3EED9;
          padding: 48px 32px;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          animation: drift 20s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          width: fit-content;
        }
        
        .back-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: translateX(-4px);
        }
        
        .hero-main {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          text-align: center;
          flex-direction: column;
        }
        
        .hero-icon {
          width: 96px;
          height: 96px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          animation: heartbeat 3s ease-in-out infinite;
        }
        
        .hero-title {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .hero-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
          max-width: 600px;
        }
        
        .impact-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        
        .impact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(243, 238, 217, 0.1);
          padding: 20px 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .impact-number {
          font-size: 24px;
          font-weight: 800;
          color: #F3EED9;
          display: block;
          line-height: 1;
        }
        
        .impact-label {
          font-size: 14px;
          color: rgba(243, 238, 217, 0.9);
          margin-top: 4px;
        }
        
        .donation-content {
          padding: 48px 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section {
          margin-bottom: 56px;
        }
        
        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        
        .section-description {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }
        
        .amounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .amount-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .amount-card:hover {
          border-color: #E91E63;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.15);
        }
        
        .amount-card.selected {
          border-color: #E91E63;
          background: rgba(233, 30, 99, 0.05);
          box-shadow: 0 8px 24px rgba(233, 30, 99, 0.2);
        }
        
        .amount-card.popular {
          border-color: #E91E63;
        }
        
        .popular-badge {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #E91E63;
          color: #FFFFFF;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .amount-icon {
          width: 48px;
          height: 48px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
          margin: 0 auto 16px;
        }
        
        .amount-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .amount-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .custom-amount {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
        }
        
        .custom-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 12px;
        }
        
        .custom-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .custom-input {
          flex: 1;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          text-align: right;
        }
        
        .custom-input:focus {
          outline: none;
          border-color: #E91E63;
        }
        
        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #6E6E6E;
        }
        
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .payment-method {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .payment-method.selected {
          border-color: #E91E63;
          background: rgba(233, 30, 99, 0.05);
        }
        
        .payment-method.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .payment-icon {
          width: 48px;
          height: 48px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
        }
        
        .payment-content {
          flex: 1;
        }
        
        .payment-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin-bottom: 4px;
        }
        
        .payment-description {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .coming-soon-badge {
          background: #FFB400;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
          display: inline-block;
        }
        
        .payment-networks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .network-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(233, 30, 99, 0.1);
        }
        
        .network-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .network-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .network-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
        }
        
        .network-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .detail-label {
          font-size: 14px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .detail-value.amount-highlight {
          font-size: 20px;
          color: #E91E63;
          font-weight: 800;
        }
        
        .phone-number {
          font-family: 'Courier New', monospace;
          background: rgba(233, 30, 99, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }
        
        .copy-button {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          color: #6E6E6E;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .copy-button:hover {
          background: #E91E63;
          color: #FFFFFF;
          border-color: #E91E63;
        }
        
        .payment-note {
          display: flex;
          gap: 16px;
          background: rgba(233, 30, 99, 0.05);
          border: 1px solid rgba(233, 30, 99, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-top: 32px;
        }
        
        .note-icon {
          width: 40px;
          height: 40px;
          background: #E91E63;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        
        .note-content h4 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .note-content p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.6;
        }
        
        .why-donate-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        
        .why-card {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(233, 30, 99, 0.1);
          border-color: rgba(233, 30, 99, 0.3);
        }
        
        .why-icon {
          width: 56px;
          height: 56px;
          background: rgba(233, 30, 99, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E91E63;
          margin: 0 auto 20px;
        }
        
        .why-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .why-card p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.6;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 16px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 18px;
          }
          
          .impact-stats {
            flex-direction: column;
            gap: 16px;
          }
          
          .impact-item {
            justify-content: center;
          }
          
          .donation-content {
            padding: 32px 16px;
          }
          
          .amounts-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          
          .payment-networks {
            grid-template-columns: 1fr;
          }
          
          .why-donate-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .detail-value {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 480px) {
          .hero-main {
            gap: 16px;
          }
          
          .hero-icon {
            width: 72px;
            height: 72px;
          }
          
          .hero-title {
            font-size: 28px;
          }
          
          .amounts-grid {
            grid-template-columns: 1fr;
          }
          
          .amount-card {
            padding: 20px;
          }
          
          .payment-method {
            padding: 16px 20px;
          }
          
          .network-card {
            padding: 20px;
          }
          
          .payment-note {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/EnhancedAuthentication.tsx":
/*!************************************************************!*\
  !*** ./src/renderer/components/EnhancedAuthentication.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EnhancedAuthentication: () => (/* binding */ EnhancedAuthentication)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bar-chart-3.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/globe.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/wifi.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/wifi-off.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/log-in.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user-plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sparkles.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/lock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye-off.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/key-round.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-right.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/map-pin.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/phone.mjs");

// src/renderer/components/EnhancedAuthentication.tsx


const EnhancedAuthentication = ({ onLogin }) => {
    const [mode, setMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('login');
    const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [success, setSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [showPassword, setShowPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isOnline, setIsOnline] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(navigator.onLine);
    // Données du formulaire
    const [loginData, setLoginData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        email: '',
        password: '',
        institutionCode: ''
    });
    const [registerData, setRegisterData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        institutionCode: '',
        role: 'user'
    });
    const [institutionData, setInstitutionData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        name: '',
        type: 'library',
        address: '',
        city: '',
        country: 'Cameroun',
        phone: '',
        email: '',
        website: '',
        description: '',
        director: '',
        adminEmail: '',
        adminPassword: '',
        adminFirstName: '',
        adminLastName: ''
    });
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);
    // Connexion rapide pour le développement
    const handleDevLogin = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await onLogin({
                email: 'admin@bibliotheque-dev.local',
                password: 'dev123456',
                institutionCode: 'DEV-BIBLIO',
                mode: 'login'
            });
        }
        catch (error) {
            console.error('Connexion dev échouée:', error);
            setError('Erreur de connexion développement');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await onLogin({
                    email: loginData.email,
                    password: loginData.password,
                    institutionCode: loginData.institutionCode,
                    mode: 'login'
                });
            }
            else if (mode === 'register') {
                if (registerData.password !== registerData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }
                await onLogin({
                    email: registerData.email,
                    password: registerData.password,
                    institutionCode: registerData.institutionCode,
                    mode: 'register',
                    userData: {
                        firstName: registerData.firstName,
                        lastName: registerData.lastName,
                        role: registerData.role
                    }
                });
            }
            else if (mode === 'create_institution') {
                if (step === 2) {
                    await onLogin({
                        email: institutionData.adminEmail,
                        password: institutionData.adminPassword,
                        mode: 'create_institution',
                        userData: {
                            institution: institutionData,
                            admin: {
                                firstName: institutionData.adminFirstName,
                                lastName: institutionData.adminLastName
                            }
                        }
                    });
                }
            }
        }
        catch (err) {
            setError(err.message || 'Erreur de connexion');
        }
        finally {
            setIsLoading(false);
        }
    };
    const validateStep1 = () => {
        return institutionData.name &&
            institutionData.type &&
            institutionData.city &&
            institutionData.country;
    };
    const validateStep2 = () => {
        return institutionData.adminEmail &&
            institutionData.adminPassword &&
            institutionData.adminFirstName &&
            institutionData.adminLastName &&
            institutionData.adminPassword.length >= 6;
    };
    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };
    const previousStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };
    const institutionTypes = [
        { value: 'school', label: 'École/Lycée', icon: '🏫' },
        { value: 'university', label: 'Université', icon: '🎓' },
        { value: 'library', label: 'Bibliothèque', icon: '📚' },
        { value: 'other', label: 'Autre', icon: '🏢' }
    ];
    const roles = [
        { value: 'user', label: 'Utilisateur', description: 'Accès de base à la bibliothèque' },
        { value: 'librarian', label: 'Bibliothécaire', description: 'Gestion des livres et emprunts' },
        { value: 'admin', label: 'Administrateur', description: 'Accès complet au système' }
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "enhanced-auth", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-background", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "auth-pattern" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "floating-elements", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-book" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-book" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-book" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-branding", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "brand-logo", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "brand-title", children: "Biblioth\u00E8que Cloud" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "brand-subtitle", children: "Syst\u00E8me de gestion moderne et collaboratif" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "features-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Multi-\u00E9tablissements" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Synchronisation cloud" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "S\u00E9curis\u00E9 et fiable" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Accessible partout" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `connection-status ${isOnline ? 'online' : 'offline'}`, children: [isOnline ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 16 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: isOnline ? 'En ligne' : 'Hors ligne' })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "auth-form-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "auth-tabs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `auth-tab ${mode === 'login' ? 'active' : ''}`, onClick: () => { setMode('login'); setStep(1); }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 16 }), "Connexion"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `auth-tab ${mode === 'register' ? 'active' : ''}`, onClick: () => { setMode('register'); setStep(1); }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 16 }), "Inscription"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `auth-tab ${mode === 'create_institution' ? 'active' : ''}`, onClick: () => { setMode('create_institution'); setStep(1); }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }), "Cr\u00E9er \u00E9tablissement"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mode-indicator", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [mode === 'login' && 'Connectez-vous à votre établissement', mode === 'register' && 'Rejoignez un établissement existant', mode === 'create_institution' && `Créez votre établissement ${step === 2 ? '- Administrateur' : '- Informations'}`] })] }), mode === 'create_institution' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-bar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "progress-steps", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `progress-step ${step >= 1 ? 'active' : ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "step-number", children: "1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u00C9tablissement" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-line" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `progress-step ${step >= 2 ? 'active' : ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "step-number", children: "2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Administrateur" })] })] }) }))] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "error-message", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: error })] })), success && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "success-message", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: success })] })), mode === 'login' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: loginData.email, onChange: (e) => setLoginData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "votre@email.com", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: showPassword ? 'text' : 'password', value: loginData.password, onChange: (e) => setLoginData(prev => ({ ...prev, password: e.target.value })), className: "auth-input", placeholder: "Votre mot de passe", required: true, disabled: isLoading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 18 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { size: 18 }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Code de l'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_19__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: loginData.institutionCode, onChange: (e) => setLoginData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() })), className: "auth-input", placeholder: "CODE123", required: true, disabled: isLoading, maxLength: 8 })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { className: "form-hint", children: "8 caract\u00E8res fournis par votre \u00E9tablissement" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !loginData.email || !loginData.password || !loginData.institutionCode, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Connexion..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 18 }), "Se connecter", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_20__["default"], { size: 16 })] })) }),  true && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "dev-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "dev-separator", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "MODE D\u00C9VELOPPEMENT" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: handleDevLogin, className: "auth-button dev-button", disabled: isLoading, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Connexion..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 18 }), "Connexion rapide (Dev)", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_20__["default"], { size: 16 })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { className: "dev-hint", children: "Compte : admin@bibliotheque-dev.local | Code : DEV-BIBLIO" })] }))] })), mode === 'register' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Pr\u00E9nom" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_21__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: registerData.firstName, onChange: (e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value })), className: "auth-input", placeholder: "Votre pr\u00E9nom", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Nom" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_21__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: registerData.lastName, onChange: (e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value })), className: "auth-input", placeholder: "Votre nom", required: true, disabled: isLoading })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: registerData.email, onChange: (e) => setRegisterData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "votre@email.com", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "R\u00F4le souhait\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "role-selector", children: roles.map((role) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "role-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "radio", name: "role", value: role.value, checked: registerData.role === role.value, onChange: (e) => setRegisterData(prev => ({ ...prev, role: e.target.value })), disabled: isLoading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "role-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "role-title", children: role.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "role-description", children: role.description })] })] }, role.value))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Code de l'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_19__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: registerData.institutionCode, onChange: (e) => setRegisterData(prev => ({ ...prev, institutionCode: e.target.value.toUpperCase() })), className: "auth-input", placeholder: "CODE123", required: true, disabled: isLoading, maxLength: 8 })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { className: "form-hint", children: "Demandez ce code \u00E0 votre administrateur" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Mot de passe" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.password, onChange: (e) => setRegisterData(prev => ({ ...prev, password: e.target.value })), className: "auth-input", placeholder: "Mot de passe", required: true, disabled: isLoading, minLength: 6 })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Confirmer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: showPassword ? 'text' : 'password', value: registerData.confirmPassword, onChange: (e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value })), className: "auth-input", placeholder: "Confirmer", required: true, disabled: isLoading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 18 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { size: 18 }) })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", className: "auth-button primary", disabled: isLoading || !registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !registerData.institutionCode, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Cr\u00E9ation..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 18 }), "Cr\u00E9er le compte", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_20__["default"], { size: 16 })] })) })] })), mode === 'create_institution' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "auth-form", children: [step === 1 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "institution-step", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Informations de l'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Cr\u00E9ez votre \u00E9tablissement et obtenez votre code unique" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Nom de l'\u00E9tablissement *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.name, onChange: (e) => setInstitutionData(prev => ({ ...prev, name: e.target.value })), className: "auth-input", placeholder: "Lyc\u00E9e Moderne de Douala", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Type d'\u00E9tablissement *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "type-selector", children: institutionTypes.map((type) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "type-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "radio", name: "type", value: type.value, checked: institutionData.type === type.value, onChange: (e) => setInstitutionData(prev => ({ ...prev, type: e.target.value })), disabled: isLoading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "type-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "type-icon", children: type.icon }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "type-label", children: type.label })] })] }, type.value))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Ville *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_22__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.city, onChange: (e) => setInstitutionData(prev => ({ ...prev, city: e.target.value })), className: "auth-input", placeholder: "Douala", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Pays *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.country, onChange: (e) => setInstitutionData(prev => ({ ...prev, country: e.target.value })), className: "auth-input", placeholder: "Cameroun", required: true, disabled: isLoading })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Adresse" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_22__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.address, onChange: (e) => setInstitutionData(prev => ({ ...prev, address: e.target.value })), className: "auth-input", placeholder: "Avenue de la Libert\u00E9", disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "T\u00E9l\u00E9phone" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_23__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "tel", value: institutionData.phone, onChange: (e) => setInstitutionData(prev => ({ ...prev, phone: e.target.value })), className: "auth-input", placeholder: "+237 XXX XXX XXX", disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: institutionData.email, onChange: (e) => setInstitutionData(prev => ({ ...prev, email: e.target.value })), className: "auth-input", placeholder: "contact@etablissement.com", disabled: isLoading })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Description" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: institutionData.description, onChange: (e) => setInstitutionData(prev => ({ ...prev, description: e.target.value })), className: "auth-textarea", placeholder: "Br\u00E8ve description de votre \u00E9tablissement...", rows: 3, disabled: isLoading })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", className: "auth-button primary", onClick: nextStep, disabled: !validateStep1() || isLoading, children: ["Continuer", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_20__["default"], { size: 16 })] })] })), step === 2 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "admin-step", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Compte administrateur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Cr\u00E9ez le compte administrateur principal" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Pr\u00E9nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_21__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.adminFirstName, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminFirstName: e.target.value })), className: "auth-input", placeholder: "Pr\u00E9nom", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Nom *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_21__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionData.adminLastName, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminLastName: e.target.value })), className: "auth-input", placeholder: "Nom", required: true, disabled: isLoading })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Email administrateur *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: institutionData.adminEmail, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminEmail: e.target.value })), className: "auth-input", placeholder: "admin@etablissement.com", required: true, disabled: isLoading })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "form-label", children: "Mot de passe *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: showPassword ? 'text' : 'password', value: institutionData.adminPassword, onChange: (e) => setInstitutionData(prev => ({ ...prev, adminPassword: e.target.value })), className: "auth-input", placeholder: "Mot de passe s\u00E9curis\u00E9", required: true, disabled: isLoading, minLength: 6 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "password-toggle", onClick: () => setShowPassword(!showPassword), children: showPassword ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 18 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { size: 18 }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("small", { className: "form-hint", children: "Minimum 6 caract\u00E8res" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", className: "auth-button secondary", onClick: previousStep, disabled: isLoading, children: "Pr\u00E9c\u00E9dent" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", className: "auth-button primary", disabled: !validateStep2() || isLoading, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Cr\u00E9ation..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 18 }), "Cr\u00E9er l'\u00E9tablissement"] })) })] })] }))] }))] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .enhanced-auth {
          height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
        }
        
        .auth-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .auth-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }
        
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        
        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .floating-book {
          position: absolute;
          width: 24px;
          height: 32px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 4px;
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-book:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-book:nth-child(2) {
          top: 60%;
          left: 15%;
          animation-delay: 2s;
        }
        
        .floating-book:nth-child(3) {
          top: 40%;
          left: 5%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        .auth-content {
          display: flex;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .auth-branding {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          color: #F3EED9;
          max-width: 500px;
        }
        
        .brand-logo {
          width: 80px;
          height: 80px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          border: 1px solid rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .brand-title {
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }
        
        .brand-subtitle {
          font-size: 20px;
          opacity: 0.9;
          margin: 0 0 48px 0;
          line-height: 1.5;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 16px;
          opacity: 0.9;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          width: fit-content;
        }
        
        .connection-status.online {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .connection-status.offline {
          background: rgba(255, 152, 0, 0.2);
          color: #FF9800;
          border: 1px solid rgba(255, 152, 0, 0.3);
        }
        
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          max-width: 600px;
        }
        
        .auth-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 0;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .auth-header {
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, #F3EED9 0%, #EAEADC 100%);
          border-bottom: 1px solid #E5DCC2;
        }
        
        .auth-tabs {
          display: flex;
          gap: 4px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
        }
        
        .auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .auth-tab.active {
          background: #3E5C49;
          color: #F3EED9;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.2);
        }
        
        .mode-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #3E5C49;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .progress-bar {
          margin-top: 16px;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        .progress-step.active {
          opacity: 1;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(62, 92, 73, 0.2);
          color: #3E5C49;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .progress-step.active .step-number {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .progress-line {
          width: 40px;
          height: 2px;
          background: rgba(62, 92, 73, 0.2);
        }
        
        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .error-message {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .success-message {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .auth-form {
          padding: 32px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-wrapper svg {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .auth-input,
        .auth-textarea {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .auth-textarea {
          padding: 16px;
          resize: vertical;
          min-height: 80px;
        }
        
        .auth-input:focus,
        .auth-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .auth-input:disabled,
        .auth-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #F3EED9;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          z-index: 2;
        }
        
        .password-toggle:hover {
          color: #2E2E2E;
          background: rgba(110, 110, 110, 0.1);
        }
        
        .role-selector,
        .type-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .role-option,
        .type-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FFFFFF;
        }
        
        .role-option:hover,
        .type-option:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }
        
        .role-option input:checked + .role-content,
        .type-option input:checked + .type-content {
          color: #3E5C49;
        }
        
        .role-option input:checked,
        .type-option input:checked {
          accent-color: #3E5C49;
        }
        
        .role-content,
        .type-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .type-content {
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }
        
        .role-title,
        .type-label {
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .role-description {
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .type-icon {
          font-size: 20px;
        }
        
        .form-hint {
          font-size: 12px;
          color: #6E6E6E;
          font-style: italic;
        }
        
        .auth-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          margin-bottom: 12px;
        }
        
        .auth-button.primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .auth-button.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .auth-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .auth-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Styles pour le mode développement */
        .dev-section {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(62, 92, 73, 0.1);
        }

        .dev-separator {
          text-align: center;
          margin-bottom: 16px;
          position: relative;
        }

        .dev-separator span {
          background: #F3EED9;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 600;
          color: #C2571B;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .dev-separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C2571B, transparent);
          z-index: -1;
        }

        .auth-button.dev-button {
          background: linear-gradient(135deg, #C2571B 0%, #A3461A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
          border: 2px solid rgba(194, 87, 27, 0.2);
        }

        .auth-button.dev-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #A3461A 0%, #8A3C18 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.4);
        }

        .dev-hint {
          display: block;
          text-align: center;
          margin-top: 8px;
          font-size: 10px;
          color: #6E6E6E;
          background: rgba(194, 87, 27, 0.05);
          padding: 6px 12px;
          border-radius: 16px;
          border: 1px solid rgba(194, 87, 27, 0.1);
        }
        
        .institution-step,
        .admin-step {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .step-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 16px 0 8px 0;
        }
        
        .step-header p {
          color: #6E6E6E;
          margin: 0;
          font-size: 16px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }
        
        .form-actions .auth-button {
          margin-bottom: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .auth-content {
            flex-direction: column;
          }
          
          .auth-branding {
            padding: 40px;
            text-align: center;
            flex: none;
            max-width: none;
          }
          
          .brand-title {
            font-size: 36px;
          }
          
          .brand-subtitle {
            font-size: 18px;
          }
          
          .features-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
          
          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 8px;
            min-width: 120px;
          }
          
          .auth-form-container {
            max-width: none;
          }
        }
        
        @media (max-width: 768px) {
          .auth-branding {
            padding: 32px 20px;
          }
          
          .auth-form-container {
            padding: 20px;
          }
          
          .auth-card {
            max-width: none;
            border-radius: 20px;
            max-height: none;
          }
          
          .auth-header {
            padding: 24px 20px 20px;
          }
          
          .auth-form {
            padding: 24px 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .brand-title {
            font-size: 28px;
          }
          
          .brand-subtitle {
            font-size: 16px;
          }
          
          .features-list {
            flex-direction: column;
            gap: 12px;
          }
          
          .feature-item {
            flex-direction: row;
            justify-content: center;
          }
          
          .auth-tabs {
            flex-direction: column;
            gap: 8px;
          }
          
          .auth-tab {
            flex: none;
          }
          
          .progress-steps {
            gap: 12px;
          }
          
          .progress-line {
            width: 30px;
          }
          
          .type-selector {
            grid-template-columns: 1fr 1fr;
            display: grid;
            gap: 12px;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
        }
        
        @media (max-width: 480px) {
          .auth-branding {
            padding: 24px 16px;
          }
          
          .auth-form-container {
            padding: 16px;
          }
          
          .auth-header,
          .auth-form {
            padding: 20px 16px;
          }
          
          .brand-logo {
            width: 64px;
            height: 64px;
            margin-bottom: 24px;
          }
          
          .brand-title {
            font-size: 24px;
          }
          
          .auth-input,
          .auth-textarea {
            font-size: 14px;
          }
          
          .type-selector {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 16px;
          }
          
          .progress-line {
            width: 2px;
            height: 20px;
          }
        }
        
        /* Animation enhancements */
        .auth-card {
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .auth-branding {
          animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .auth-card,
          .auth-branding,
          .floating-book,
          .auth-pattern {
            animation: none;
          }
          
          .auth-button,
          .role-option,
          .type-option {
            transition: none;
          }
          
          .auth-button:hover,
          .role-option:hover,
          .type-option:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .auth-input,
          .auth-textarea,
          .auth-button {
            border-width: 3px;
          }
          
          .auth-tab.active {
            border: 2px solid #F3EED9;
          }
          
          .role-option,
          .type-option {
            border-width: 3px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/InstitutionSetup.tsx":
/*!******************************************************!*\
  !*** ./src/renderer/components/InstitutionSetup.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InstitutionSetup: () => (/* binding */ InstitutionSetup)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sparkles.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/globe.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/key.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/copy.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/qr-code.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/printer.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/zap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-right.mjs");

// src/renderer/components/InstitutionSetup.tsx


const InstitutionSetup = ({ institutionCode, institution, onComplete }) => {
    const [currentStep, setCurrentStep] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [copied, setCopied] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(institutionCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error('Erreur lors de la copie:', error);
        }
    };
    const handleDownloadInfo = () => {
        const content = `
INFORMATIONS DE VOTRE ÉTABLISSEMENT
=====================================

Nom: ${institution?.name || 'Non spécifié'}
Code d'accès: ${institutionCode}
Type: ${institution?.type || 'Non spécifié'}
Ville: ${institution?.city || 'Non spécifié'}
Pays: ${institution?.country || 'Non spécifié'}

INSTRUCTIONS POUR VOS UTILISATEURS:
====================================

1. Téléchargez l'application Bibliothèque Cloud
2. Choisissez "Inscription" 
3. Entrez le code d'établissement: ${institutionCode}
4. Remplissez vos informations personnelles
5. Attendez la validation de votre compte

LIEN DE TÉLÉCHARGEMENT:
======================
[Insérez ici le lien de téléchargement de votre application]

Date de création: ${new Date().toLocaleDateString('fr-FR')}
    `.trim();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${institution?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'institution'}_info.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const generateQRCode = () => {
        // Simuler la génération d'un QR Code
        // En production, vous utiliseriez une vraie bibliothèque QR
        const qrContent = `Institution: ${institution?.name}\nCode: ${institutionCode}`;
        alert(`QR Code généré pour:\n${qrContent}`);
    };
    const sendInvitation = () => {
        const subject = encodeURIComponent(`Invitation - ${institution?.name}`);
        const body = encodeURIComponent(`
Bonjour,

Vous êtes invité(e) à rejoindre ${institution?.name} sur l'application Bibliothèque Cloud.

Code d'établissement: ${institutionCode}

Instructions:
1. Téléchargez l'application Bibliothèque Cloud
2. Créez votre compte en utilisant le code ci-dessus
3. Attendez la validation de votre accès

Cordialement,
L'équipe de ${institution?.name}
    `);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };
    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
        else {
            onComplete();
        }
    };
    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const steps = [
        {
            number: 1,
            title: "Félicitations !",
            subtitle: "Votre établissement a été créé",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"]
        },
        {
            number: 2,
            title: "Partagez le code",
            subtitle: "Invitez vos utilisateurs",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"]
        },
        {
            number: 3,
            title: "Prêt à commencer",
            subtitle: "Accédez à votre bibliothèque",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"]
        }
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "institution-setup", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setup-background", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "background-pattern" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "floating-elements", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-icon", children: "\uD83D\uDCDA" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-icon", children: "\uD83C\uDF93" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-icon", children: "\uD83D\uDC65" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "floating-icon", children: "\uD83D\uDD11" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setup-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setup-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-logo", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "setup-title", children: "Configuration de votre \u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "progress-steps", children: steps.map((step, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "step-circle", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(step.icon, { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "step-title", children: step.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "step-subtitle", children: step.subtitle })] }), index < steps.length - 1 && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "step-connector" })] }, step.number))) }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setup-content", children: [currentStep === 1 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-content success-step", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "success-animation", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "success-circle", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 64 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "success-sparkles", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "sparkle sparkle-1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "sparkle sparkle-2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { className: "sparkle sparkle-3" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "step-title", children: "F\u00E9licitations ! \uD83C\uDF89" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "step-description", children: ["Votre \u00E9tablissement ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: institution?.name }), " a \u00E9t\u00E9 cr\u00E9\u00E9 avec succ\u00E8s. Vous \u00EAtes maintenant l'administrateur principal et pouvez commencer \u00E0 g\u00E9rer votre biblioth\u00E8que."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "institution-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Informations de l'\u00E9tablissement" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "card-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-label", children: "Nom:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-value", children: institution?.name })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-label", children: "Type:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "info-value", children: [institution?.type === 'school' && '🏫 École/Lycée', institution?.type === 'university' && '🎓 Université', institution?.type === 'library' && '📚 Bibliothèque', institution?.type === 'other' && '🏢 Autre'] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-label", children: "Localisation:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "info-value", children: [institution?.city, ", ", institution?.country] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-row highlight", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-label", children: "Code d'acc\u00E8s:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "info-value code-value", children: institutionCode })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "features-preview", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Ce que vous pouvez faire maintenant :" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "features-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "G\u00E9rer vos livres" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Inviter des utilisateurs" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Contr\u00F4ler les acc\u00E8s" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "feature-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Synchroniser en ligne" })] })] })] })] })), currentStep === 2 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-content share-step", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "share-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "share-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "step-title", children: "Partagez votre code d'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "step-description", children: "Utilisez ce code unique pour permettre \u00E0 vos utilisateurs de rejoindre votre \u00E9tablissement. Gardez-le confidentiel et ne le partagez qu'avec les personnes autoris\u00E9es." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "code-display", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "code-container", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "code-label", children: "Code d'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "code-value-large", children: institutionCode }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `copy-button ${copied ? 'copied' : ''}`, onClick: handleCopyCode, children: [copied ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 18 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: copied ? 'Copié !' : 'Copier' })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sharing-options", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Options de partage" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sharing-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "sharing-option", onClick: handleDownloadInfo, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-title", children: "T\u00E9l\u00E9charger les infos" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-description", children: "Fichier avec toutes les informations" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "sharing-option", onClick: sendInvitation, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-title", children: "Envoyer par email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-description", children: "Invitation pr\u00E9-r\u00E9dig\u00E9e" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "sharing-option", onClick: generateQRCode, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-title", children: "G\u00E9n\u00E9rer QR Code" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-description", children: "Pour un partage rapide" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "sharing-option", onClick: () => window.print(), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-title", children: "Imprimer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "option-description", children: "Affichage physique" })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "instructions-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Instructions pour vos utilisateurs :" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ol", { className: "instructions-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "T\u00E9l\u00E9charger l'application Biblioth\u00E8que Cloud" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Choisir \"Inscription\" sur l'\u00E9cran de connexion" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", { children: ["Entrer le code d'\u00E9tablissement : ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", { children: institutionCode })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Remplir leurs informations personnelles" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "Attendre la validation de leur compte par un administrateur" })] })] })] })), currentStep === 3 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "step-content ready-step", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ready-animation", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ready-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 64 }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "step-title", children: "Tout est pr\u00EAt ! \uD83D\uDE80" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "step-description", children: "Votre \u00E9tablissement est configur\u00E9 et pr\u00EAt \u00E0 \u00EAtre utilis\u00E9. Vous allez maintenant \u00EAtre connect\u00E9 en tant qu'administrateur principal." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "quick-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Prochaines \u00E9tapes recommand\u00E9es :" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "actions-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-number", children: "1" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-title", children: "Ajoutez vos premiers livres" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-description", children: "Commencez \u00E0 construire votre catalogue" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-number", children: "2" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-title", children: "Invitez vos biblioth\u00E9caires" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-description", children: "Donnez-leur un acc\u00E8s administrateur" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-number", children: "3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-title", children: "Configurez vos param\u00E8tres" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-description", children: "Personnalisez selon vos besoins" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "action-number", children: "4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "action-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-title", children: "Partagez le code d'acc\u00E8s" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "action-description", children: "Permettez aux utilisateurs de s'inscrire" })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "support-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Besoin d'aide ?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Consultez notre documentation en ligne ou contactez notre support technique pour vous accompagner dans la prise en main de votre nouvelle biblioth\u00E8que." })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setup-navigation", children: [currentStep > 1 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "nav-button secondary", onClick: previousStep, disabled: isLoading, children: "Pr\u00E9c\u00E9dent" })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "nav-button primary", onClick: nextStep, disabled: isLoading, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "loading-spinner" }), "Chargement..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [currentStep === 3 ? 'Accéder à ma bibliothèque' : 'Continuer', (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 18 })] })) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .institution-setup {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          position: relative;
          overflow: hidden;
        }

        .setup-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .background-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(243, 238, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(194, 87, 27, 0.06) 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          font-size: 24px;
          opacity: 0.2;
          animation: float 8s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .floating-icon:nth-child(4) {
          top: 40%;
          right: 30%;
          animation-delay: 6s;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .setup-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 40px;
          color: #F3EED9;
        }

        .header-logo {
          width: 80px;
          height: 80px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          border: 1px solid rgba(243, 238, 217, 0.2);
          backdrop-filter: blur(10px);
        }

        .setup-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 32px 0;
          letter-spacing: -0.5px;
        }

        .progress-container {
          margin-bottom: 20px;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          position: relative;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          opacity: 0.5;
          transition: all 0.3s ease;
          position: relative;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step.current {
          transform: scale(1.1);
        }

        .step-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(243, 238, 217, 0.15);
          border: 2px solid rgba(243, 238, 217, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: rgba(243, 238, 217, 0.3);
          border-color: rgba(243, 238, 217, 0.6);
        }

        .progress-step.current .step-circle {
          background: #C2571B;
          border-color: #C2571B;
          color: #F3EED9;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .step-info {
          text-align: center;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .step-subtitle {
          font-size: 12px;
          opacity: 0.8;
        }

        .step-connector {
          position: absolute;
          top: 28px;
          left: 100%;
          width: 40px;
          height: 2px;
          background: rgba(243, 238, 217, 0.2);
          z-index: -1;
        }

        .setup-content {
          flex: 1;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 32px;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
          backdrop-filter: blur(20px);
          overflow-y: auto;
        }

        .step-content {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Success Step */
        .success-step {
          text-align: center;
        }

        .success-animation {
          position: relative;
          margin-bottom: 32px;
        }

        .success-circle {
          color: #3E5C49;
          animation: bounce 0.6s ease-out;
        }

        .success-sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          color: #C2571B;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 20%;
          right: 15%;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          bottom: 15%;
          left: 15%;
          animation-delay: 1s;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -30px, 0); }
          70% { transform: translate3d(0, -15px, 0); }
          90% { transform: translate3d(0, -4px, 0); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .step-title {
          font-size: 28px;
          font-weight: 800;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .step-description {
          font-size: 16px;
          color: #6E6E6E;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .institution-card {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: rgba(62, 92, 73, 0.1);
          border-bottom: 1px solid #E5DCC2;
        }

        .card-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }

        .card-content {
          padding: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.5);
        }

        .info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .info-row.highlight {
          background: rgba(62, 92, 73, 0.05);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(62, 92, 73, 0.2);
          border-bottom: 1px solid rgba(62, 92, 73, 0.2);
        }

        .info-label {
          font-weight: 600;
          color: #6E6E6E;
        }

        .info-value {
          font-weight: 600;
          color: #2E2E2E;
        }

        .code-value {
          font-family: 'Monaco', 'Consolas', monospace;
          background: #3E5C49;
          color: #F3EED9;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 16px;
          letter-spacing: 2px;
        }

        .features-preview h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          text-align: left;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          color: #3E5C49;
          font-weight: 500;
        }

        /* Share Step */
        .share-step {
          text-align: center;
        }

        .share-header {
          margin-bottom: 32px;
        }

        .share-icon {
          color: #C2571B;
          margin-bottom: 24px;
        }

        .code-display {
          margin-bottom: 40px;
        }

        .code-container {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 20px;
          padding: 32px;
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }

        .code-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
        }

        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .code-value-large {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: 8px;
          font-family: 'Monaco', 'Consolas', monospace;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(243, 238, 217, 0.2);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .copy-button:hover {
          background: rgba(243, 238, 217, 0.3);
          transform: translateY(-1px);
        }

        .copy-button.copied {
          background: rgba(194, 87, 27, 0.8);
          border-color: rgba(194, 87, 27, 0.8);
          color: #F3EED9;
          cursor: default;
          pointer-events: none;
        }

        .sharing-options {
          margin-bottom: 40px;
        }

        .sharing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .sharing-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #3E5C49;
          font-weight: 600;
        }

        .sharing-option:hover {
          background: rgba(62, 92, 73, 0.1);
          border-color: rgba(62, 92, 73, 0.2);
        }

        .option-icon {
          width: 48px;
          height: 48px;
          background: #C2571B;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          flex-shrink: 0;
        }

        .option-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-title {
          font-size: 16px;
          font-weight: 700;
        }

        .option-description {
          font-size: 12px;
          color: #6E6E6E;
        }

        .instructions-card {
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
          color: #3E5C49;
          font-weight: 600;
          text-align: left;
          max-width: 600px;
          margin: 0 auto;
        }

        .instructions-list {
          margin: 0;
          padding-left: 20px;
          list-style-type: decimal;
        }

        .instructions-list li {
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
        }

        .setup-navigation {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 0 40px 40px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .nav-button.primary {
          background: #C2571B;
          color: #F3EED9;
        }

        .nav-button.primary:hover:not(:disabled) {
          background: #A8481A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .nav-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }

        .nav-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }

        .nav-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(243, 238, 217, 0.3);
          border-top: 3px solid #C2571B;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/PrintManager.tsx":
/*!**************************************************!*\
  !*** ./src/renderer/components/PrintManager.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrintManager: () => (/* binding */ PrintManager)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bar-chart-3.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/printer.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/zap.mjs");



const PrintManager = ({ books, stats, categories, onClose }) => {
    const [selectedType, setSelectedType] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('inventory');
    const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const printOptions = [
        {
            id: 'inventory',
            title: 'Inventaire Complet',
            description: 'Liste détaillée de tous les documents avec statuts',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
            color: '#3E5C49',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
            count: stats.totalBooks,
            features: ['Informations complètes', 'Statuts des emprunts', 'Métadonnées']
        },
        {
            id: 'available',
            title: 'Documents Disponibles',
            description: 'Collection des ouvrages disponibles à l\'emprunt',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
            color: '#3E5C49',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6B57 100%)',
            count: stats.availableBooks,
            features: ['Documents en rayon', 'Prêts à emprunter', 'Tri par catégorie']
        },
        {
            id: 'borrowed',
            title: 'Documents Empruntés',
            description: 'Suivi des emprunts en cours avec emprunteurs',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"],
            color: '#C2571B',
            gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)',
            count: stats.borrowedBooks,
            features: ['Noms des emprunteurs', 'Dates d\'emprunt', 'Alertes retard']
        }
    ];
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };
    const handlePrint = async () => {
        setIsProcessing(true);
        try {
            const printData = { books, stats, categories };
            let success = false;
            switch (selectedType) {
                case 'inventory':
                    success = await window.electronAPI.printInventory(printData);
                    break;
                case 'available':
                    success = await window.electronAPI.printAvailableBooks(printData);
                    break;
                case 'borrowed':
                    success = await window.electronAPI.printBorrowedBooks(printData);
                    break;
            }
            if (success) {
                showMessage('success', 'Document envoyé à l\'imprimante avec succès');
            }
            else {
                showMessage('error', 'Erreur lors de l\'impression');
            }
        }
        catch (error) {
            console.error('Print error:', error);
            showMessage('error', 'Erreur lors de l\'impression');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleExportCSV = async () => {
        setIsProcessing(true);
        try {
            const exportData = { books, stats, categories };
            const filePath = await window.electronAPI.exportCSV(exportData);
            if (filePath) {
                showMessage('success', `Fichier CSV exporté : ${filePath.split(/[/\\]/).pop()}`);
            }
            else {
                showMessage('error', 'Export annulé ou erreur');
            }
        }
        catch (error) {
            console.error('Export error:', error);
            showMessage('error', 'Erreur lors de l\'export CSV');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const getPreviewData = () => {
        switch (selectedType) {
            case 'inventory':
                return {
                    title: 'Inventaire Complet',
                    items: books,
                    description: `${stats.totalBooks} document(s) au total`,
                    icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"]
                };
            case 'available':
                return {
                    title: 'Documents Disponibles',
                    items: books.filter(book => !book.isBorrowed),
                    description: `${stats.availableBooks} document(s) disponible(s)`,
                    icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"]
                };
            case 'borrowed':
                return {
                    title: 'Documents Empruntés',
                    items: books.filter(book => book.isBorrowed),
                    description: `${stats.borrowedBooks} document(s) emprunté(s)`,
                    icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"]
                };
        }
    };
    const previewData = getPreviewData();
    const selectedOption = printOptions.find(opt => opt.id === selectedType);
    if (!selectedOption) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: "Erreur: option s\u00E9lectionn\u00E9e invalide" });
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "print-manager-overlay", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "print-manager-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 28 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "modal-title", children: "Impression & Export" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "modal-subtitle", children: "G\u00E9n\u00E9rez des rapports professionnels de votre biblioth\u00E8que" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-button", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 20 }) })] }), message && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `message ${message.type}`, children: [message.type === 'success' ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 20 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: message.text })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "options-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "section-title", children: "Choisir le type de rapport" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "section-description", children: "S\u00E9lectionnez le contenu \u00E0 inclure dans votre document" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "print-options", children: printOptions.map((option) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `option-card ${selectedType === option.id ? 'selected' : ''}`, onClick: () => setSelectedType(option.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-icon", style: { background: option.gradient }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(option.icon, { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-badge", children: [option.count, " \u00E9l\u00E9ment", option.count > 1 ? 's' : ''] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "option-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "option-title", children: option.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "option-description", children: option.description }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-features", children: option.features.map((feature, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "feature-tag", children: feature }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "option-indicator", children: selectedType === option.id && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 16 }) })] }, option.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-title-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "section-title", children: "Aper\u00E7u du contenu" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-stats", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(previewData.icon, { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: previewData.description })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "preview-button", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 16 }), "Pr\u00E9visualiser"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "preview-icon", style: { background: selectedOption?.gradient }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(selectedOption.icon, { size: 20 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "preview-title", children: previewData.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "preview-subtitle", children: ["G\u00E9n\u00E9r\u00E9 le ", new Date().toLocaleDateString('fr-FR')] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "preview-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "preview-table", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "table-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Titre" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Auteur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Cat\u00E9gorie" }), selectedType === 'borrowed' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Emprunteur" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Date" })] })), selectedType !== 'borrowed' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-cell", children: "Statut" }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "table-body", children: [previewData.items.slice(0, 4).map((book, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "table-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "cell-content", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "book-title", children: book.title }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: book.author }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "category-badge", children: book.category }) }), selectedType === 'borrowed' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: book.borrowerName }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '-' })] })), selectedType !== 'borrowed' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-cell", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `status-badge ${book.isBorrowed ? 'borrowed' : 'available'}`, children: book.isBorrowed ? 'Emprunté' : 'Disponible' }) }))] }, index))), previewData.items.length > 4 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "table-row more-items", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "table-cell more-text", children: ["... et ", previewData.items.length - 4, " autre(s) \u00E9l\u00E9ment(s)"] }) }))] })] }) })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "footer-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Format PDF professionnel" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Export CSV pour donn\u00E9es" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "footer-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "btn-secondary", onClick: handleExportCSV, disabled: isProcessing, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 18 }), isProcessing ? 'Export...' : 'Exporter CSV'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: handlePrint, disabled: isProcessing, children: isProcessing ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 18 }), "G\u00E9n\u00E9ration..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 18 }), "Imprimer"] })) })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .print-manager-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .print-manager-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: scale(1.05);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .message.error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-title-section {
          flex: 1;
        }
        
        .preview-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
          margin-top: 4px;
        }
        
        .preview-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preview-button:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .option-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(62, 92, 73, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .option-card:hover::before {
          opacity: 1;
        }
        
        .option-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
          border-color: #3E5C49;
        }
        
        .option-card.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.02);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .option-card.selected::before {
          opacity: 1;
        }
        
        .option-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .option-badge {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .option-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .option-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        
        .option-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .feature-tag {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .option-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 24px;
          height: 24px;
          background: #3E5C49;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }
        
        .option-card.selected .option-indicator {
          opacity: 1;
          transform: scale(1);
        }
        
        .preview-card {
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .preview-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .preview-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 2px 0;
        }
        
        .preview-subtitle {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-content {
          padding: 24px;
        }
        
        .preview-table {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #E5DCC2;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .header-cell {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #2E2E2E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-body {
          max-height: 240px;
          overflow-y: auto;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          border-bottom: 1px solid #F3EED9;
          transition: background 0.2s ease;
        }
        
        .table-row:hover {
          background: #FEFEFE;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .table-row.more-items {
          grid-template-columns: 1fr;
          background: #F3EED9;
        }
        
        .table-cell {
          padding: 16px 20px;
          font-size: 14px;
          color: #2E2E2E;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .cell-content {
          width: 100%;
        }
        
        .book-title {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .more-text {
          text-align: center;
          font-style: italic;
          color: #6E6E6E;
          justify-content: center;
        }
        
        .category-badge {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge.available {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .status-badge.borrowed {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
        }
        
        .footer-info {
          display: flex;
          gap: 32px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .footer-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .print-options {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
          
          .header-cell,
          .table-cell {
            padding: 12px 16px;
          }
          
          .modal-content {
            padding: 24px;
            gap: 32px;
          }
        }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 12px;
          }
          
          .print-manager-modal {
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 24px 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .footer-info {
            display: none;
          }
          
          .footer-actions {
            width: 100%;
            justify-content: stretch;
          }
          
          .btn-secondary,
          .btn-primary {
            flex: 1;
            justify-content: center;
          }
          
          .option-card {
            padding: 20px;
          }
          
          .preview-content {
            padding: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .modal-header {
            padding: 20px 16px;
          }
          
          .modal-content {
            padding: 16px;
            gap: 24px;
          }
          
          .modal-footer {
            padding: 16px;
            flex-direction: column;
            gap: 16px;
          }
          
          .footer-actions {
            flex-direction: column;
          }
          
          .option-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .option-badge {
            text-align: center;
          }
          
          .table-header,
          .table-row {
            display: block;
          }
          
          .header-cell,
          .table-cell {
            display: block;
            padding: 8px 16px;
            border-bottom: 1px solid #F3EED9;
          }
          
          .header-cell {
            background: #E5DCC2;
            font-weight: 700;
          }
          
          .table-cell:last-child {
            border-bottom: none;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/Settings.tsx":
/*!**********************************************!*\
  !*** ./src/renderer/components/Settings.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Settings: () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/building.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/database.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/alert-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/log-out.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/camera.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/upload.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash-2.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/phone.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/globe.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/map-pin.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/hard-drive.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/lock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/save.mjs");



const Settings = ({ onClose, onLogout }) => {
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('institution');
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [institutionSettings, setInstitutionSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        name: 'Lycée Moderne de Douala',
        address: 'Avenue de la Liberté',
        city: 'Douala',
        country: 'Cameroun',
        phone: '+237 233 42 15 67',
        email: 'contact@lyceemoderne.cm',
        website: 'www.lyceemoderne.cm',
        logo: '',
        description: 'Établissement d\'enseignement secondaire général et technique'
    });
    const [backupSettings, setBackupSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        autoBackup: true,
        backupFrequency: 'weekly',
        lastBackup: new Date().toISOString(),
        cloudSync: false,
        cloudProvider: 'google'
    });
    const [securitySettings, setSecuritySettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        requireAuth: true,
        sessionTimeout: 60,
        passwordPolicy: {
            minLength: 6,
            requireNumbers: true,
            requireSymbols: false
        }
    });
    const [showConfirmLogout, setShowConfirmLogout] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadSettings();
    }, []);
    const loadSettings = async () => {
        try {
            // Simulate loading settings from storage
            const settings = await window.electronAPI.getSettings();
            if (settings) {
                setInstitutionSettings(settings.institution || institutionSettings);
                setBackupSettings(settings.backup || backupSettings);
                setSecuritySettings(settings.security || securitySettings);
            }
        }
        catch (error) {
            console.error('Error loading settings:', error);
        }
    };
    const saveSettings = async () => {
        setIsLoading(true);
        try {
            await window.electronAPI.saveSettings({
                institution: institutionSettings,
                backup: backupSettings,
                security: securitySettings
            });
            showMessage('success', 'Paramètres sauvegardés avec succès');
        }
        catch (error) {
            showMessage('error', 'Erreur lors de la sauvegarde');
            console.error('Error saving settings:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };
    const handleLogoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInstitutionSettings(prev => ({
                    ...prev,
                    logo: e.target?.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleBackup = async () => {
        setIsLoading(true);
        try {
            await window.electronAPI.createBackup();
            setBackupSettings(prev => ({
                ...prev,
                lastBackup: new Date().toISOString()
            }));
            showMessage('success', 'Sauvegarde créée avec succès');
        }
        catch (error) {
            showMessage('error', 'Erreur lors de la sauvegarde');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRestore = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir restaurer une sauvegarde ? Cela remplacera toutes les données actuelles.')) {
            setIsLoading(true);
            try {
                await window.electronAPI.restoreBackup();
                showMessage('success', 'Données restaurées avec succès');
            }
            catch (error) {
                showMessage('error', 'Erreur lors de la restauration');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    const handleClearData = async () => {
        if (window.confirm('⚠️ ATTENTION: Cette action supprimera définitivement toutes les données. Êtes-vous absolument sûr ?')) {
            if (window.confirm('Dernière confirmation: Voulez-vous vraiment supprimer TOUTES les données ?')) {
                setIsLoading(true);
                try {
                    await window.electronAPI.clearAllData();
                    showMessage('success', 'Toutes les données ont été supprimées');
                }
                catch (error) {
                    showMessage('error', 'Erreur lors de la suppression');
                }
                finally {
                    setIsLoading(false);
                }
            }
        }
    };
    const tabs = [
        { id: 'institution', label: 'Établissement', icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"] },
        { id: 'backup', label: 'Sauvegardes', icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"] },
        { id: 'security', label: 'Sécurité', icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"] },
        { id: 'about', label: 'À propos', icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"] }
    ];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-overlay", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-modal", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "modal-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "header-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 28 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "header-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "modal-title", children: "Param\u00E8tres" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "modal-subtitle", children: "Configuration de l'application" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "close-button", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], { size: 20 }) })] }), message && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `message ${message.type}`, children: [message.type === 'success' ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 20 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: message.text })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-sidebar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", { className: "settings-nav", children: tabs.map((tab) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `nav-button ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(tab.icon, { size: 20 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: tab.label })] }, tab.id))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "logout-section", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "logout-button", onClick: () => setShowConfirmLogout(true), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 18 }), "Se d\u00E9connecter"] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-main", children: [activeTab === 'institution' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Informations de l'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Configurez les d\u00E9tails de votre institution" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logo-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "logo-preview", children: institutionSettings.logo ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: institutionSettings.logo, alt: "Logo" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logo-placeholder", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], { size: 32 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Logo" })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logo-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "upload-button", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }), "Changer le logo", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "file", accept: "image/*", onChange: handleLogoUpload, style: { display: 'none' } })] }), institutionSettings.logo && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "remove-button", onClick: () => setInstitutionSettings(prev => ({ ...prev, logo: '' })), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 16 }), "Supprimer"] }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-grid", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Nom de l'\u00E9tablissement" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionSettings.name, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, name: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "T\u00E9l\u00E9phone" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "tel", value: institutionSettings.phone, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, phone: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", value: institutionSettings.email, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, email: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Site web" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "url", value: institutionSettings.website, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, website: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Adresse" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionSettings.address, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, address: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Ville" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", value: institutionSettings.city, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, city: e.target.value })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-group span-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Description" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: institutionSettings.description, onChange: (e) => setInstitutionSettings(prev => ({ ...prev, description: e.target.value })), className: "form-textarea", rows: 3 })] })] })] })] })), activeTab === 'backup' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Gestion des sauvegardes" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Prot\u00E9gez vos donn\u00E9es avec des sauvegardes automatiques" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "backup-status", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "status-icon success", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "status-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Derni\u00E8re sauvegarde" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: new Date(backupSettings.lastBackup).toLocaleDateString('fr-FR', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    }) })] })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Sauvegarde automatique" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "toggle-switch", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: backupSettings.autoBackup, onChange: (e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "toggle-slider" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Cr\u00E9er automatiquement des sauvegardes selon la fr\u00E9quence d\u00E9finie" })] }), backupSettings.autoBackup && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Fr\u00E9quence" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "radio-group", children: [
                                                                    { value: 'daily', label: 'Quotidienne' },
                                                                    { value: 'weekly', label: 'Hebdomadaire' },
                                                                    { value: 'monthly', label: 'Mensuelle' }
                                                                ].map((option) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "radio-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "radio", name: "frequency", value: option.value, checked: backupSettings.backupFrequency === option.value, onChange: (e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "radio-label", children: option.label })] }, option.value))) })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Synchronisation cloud" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "toggle-switch", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: backupSettings.cloudSync, onChange: (e) => setBackupSettings(prev => ({ ...prev, cloudSync: e.target.checked })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "toggle-slider" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Synchroniser automatiquement vos sauvegardes avec le cloud" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "backup-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "action-button primary", onClick: handleBackup, disabled: isLoading, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 18 }), "Cr\u00E9er une sauvegarde maintenant"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "action-button secondary", onClick: handleRestore, disabled: isLoading, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_18__["default"], { size: 18 }), "Restaurer une sauvegarde"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "action-button danger", onClick: handleClearData, disabled: isLoading, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], { size: 18 }), "Effacer toutes les donn\u00E9es"] })] })] })] })), activeTab === 'security' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Param\u00E8tres de s\u00E9curit\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Configurez la s\u00E9curit\u00E9 et l'authentification" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "form-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Authentification requise" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "toggle-switch", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: securitySettings.requireAuth, onChange: (e) => setSecuritySettings(prev => ({ ...prev, requireAuth: e.target.checked })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "toggle-slider" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Exiger une connexion pour acc\u00E9der \u00E0 l'application" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "D\u00E9lai d'expiration de session (minutes)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_19__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", min: "5", max: "480", value: securitySettings.sessionTimeout, onChange: (e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "setting-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Politique de mot de passe" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sub-setting", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { children: "Longueur minimale" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "input-wrapper", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_19__["default"], { size: 18 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", min: "4", max: "20", value: securitySettings.passwordPolicy.minLength, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        minLength: parseInt(e.target.value)
                                                                                    }
                                                                                })), className: "form-input" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "checkbox-group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: securitySettings.passwordPolicy.requireNumbers, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        requireNumbers: e.target.checked
                                                                                    }
                                                                                })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkbox-label", children: "Exiger des chiffres" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { className: "checkbox-option", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: securitySettings.passwordPolicy.requireSymbols, onChange: (e) => setSecuritySettings(prev => ({
                                                                                    ...prev,
                                                                                    passwordPolicy: {
                                                                                        ...prev.passwordPolicy,
                                                                                        requireSymbols: e.target.checked
                                                                                    }
                                                                                })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "checkbox-label", children: "Exiger des symboles" })] })] })] })] })] })), activeTab === 'about' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "section-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "\u00C0 propos de l'application" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Informations sur la version et les cr\u00E9dits" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "about-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "app-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "app-logo", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 48 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Biblioth\u00E8que v2.0.0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Syst\u00E8me de gestion moderne pour biblioth\u00E8ques" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-cards", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "D\u00E9velopp\u00E9 par" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Votre \u00E9quipe de d\u00E9veloppement" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Technologies utilis\u00E9es" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "tech-list", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Electron" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "React" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "TypeScript" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "SQLite" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "info-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Licence" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "MIT License" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "system-info", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { children: "Informations syst\u00E8me" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "system-details", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Version de l'application" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "2.0.0" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Base de donn\u00E9es" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "SQLite v3.39.0" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "detail-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Plateforme" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Windows/macOS/Linux" })] })] })] })] })] }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "settings-footer", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: onClose, disabled: isLoading, children: "Annuler" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-primary", onClick: saveSettings, disabled: isLoading, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_20__["default"], { size: 16, className: "spinning" }), "Sauvegarde..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_21__["default"], { size: 16 }), "Sauvegarder"] })) })] })] }), showConfirmLogout && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "logout-overlay", onClick: () => setShowConfirmLogout(false), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logout-modal", onClick: (e) => e.stopPropagation(), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logout-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 24 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Confirmer la d\u00E9connexion" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "\u00CAtes-vous s\u00FBr de vouloir vous d\u00E9connecter ? Toutes les donn\u00E9es non sauvegard\u00E9es seront perdues." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "logout-actions", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-secondary", onClick: () => setShowConfirmLogout(false), children: "Annuler" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "btn-danger", onClick: () => {
                                        setShowConfirmLogout(false);
                                        onLogout();
                                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], { size: 16 }), "Se d\u00E9connecter"] })] })] }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .settings-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .message.error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .settings-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .settings-sidebar {
          width: 280px;
          background: #F3EED9;
          border-right: 1px solid #E5DCC2;
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 24px;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: #6E6E6E;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }
        
        .nav-button:hover {
          background: rgba(62, 92, 73, 0.08);
          color: #3E5C49;
        }
        
        .nav-button.active {
          background: #3E5C49;
          color: #F3EED9;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.2);
        }
        
        .logout-section {
          padding: 0 24px;
          border-top: 1px solid #E5DCC2;
          padding-top: 24px;
        }
        
        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 600;
        }
        
        .logout-button:hover {
          background: rgba(194, 87, 27, 0.15);
          color: #A8481A;
        }
        
        .settings-main {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .settings-section {
          max-width: 800px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E5DCC2;
        }
        
        .section-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-header p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          background: #F3EED9;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
          margin-bottom: 32px;
        }
        
        .logo-preview {
          width: 120px;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid #E5DCC2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }
        
        .logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
          text-align: center;
        }
        
        .logo-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .upload-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #3E5C49;
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .upload-button:hover {
          background: #2E453A;
        }
        
        .remove-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background: rgba(194, 87, 27, 0.15);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group.span-full {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-wrapper svg {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
          resize: vertical;
          min-height: 80px;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .backup-status {
          margin-bottom: 32px;
        }
        
        .status-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(62, 92, 73, 0.05);
          border: 1px solid rgba(62, 92, 73, 0.1);
          border-radius: 12px;
        }
        
        .status-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .status-icon.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .status-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .status-content p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .setting-group {
          padding: 20px;
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .setting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .setting-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }
        
        .setting-group p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
          line-height: 1.4;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #E5DCC2;
          transition: 0.3s;
          border-radius: 24px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background: #FFFFFF;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        input:checked + .toggle-slider {
          background: #3E5C49;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .radio-option input {
          margin: 0;
        }
        
        .radio-label {
          font-size: 14px;
          color: #2E2E2E;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }
        
        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .checkbox-option input {
          margin: 0;
        }
        
        .checkbox-label {
          font-size: 14px;
          color: #2E2E2E;
        }
        
        .sub-setting {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        
        .sub-setting label {
          font-size: 13px;
          font-weight: 500;
          color: #6E6E6E;
        }
        
        .backup-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .action-button.primary {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-button.primary:hover:not(:disabled) {
          background: #2E453A;
        }
        
        .action-button.secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .action-button.secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .action-button.danger {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border: 1px solid rgba(194, 87, 27, 0.2);
        }
        
        .action-button.danger:hover:not(:disabled) {
          background: rgba(194, 87, 27, 0.15);
        }
        
        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .app-info {
          text-align: center;
          padding: 32px;
          background: #F3EED9;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
        }
        
        .app-logo {
          width: 80px;
          height: 80px;
          background: #3E5C49;
          color: #F3EED9;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .app-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .app-info p {
          font-size: 16px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .info-card {
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 12px 0;
        }
        
        .info-card p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tech-list span {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .system-info {
          padding: 24px;
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
        }
        
        .system-info h4 {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .system-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #F3EED9;
        }
        
        .detail-item:last-child {
          border-bottom: none;
        }
        
        .detail-item span:first-child {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .detail-item span:last-child {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }
        
        .settings-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2E453A;
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Logout Modal */
        .logout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          padding: 20px;
        }
        
        .logout-modal {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .logout-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #C2571B;
        }
        
        .logout-header h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }
        
        .logout-modal p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
        
        .logout-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #C2571B;
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-danger:hover {
          background: #A8481A;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .settings-content {
            flex-direction: column;
          }
          
          .settings-sidebar {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            padding: 16px 24px;
            border-right: none;
            border-bottom: 1px solid #E5DCC2;
          }
          
          .settings-nav {
            flex-direction: row;
            gap: 12px;
            padding: 0;
            overflow-x: auto;
          }
          
          .nav-button {
            white-space: nowrap;
            min-width: 120px;
            justify-content: center;
          }
          
          .logout-section {
            border-top: none;
            border-left: 1px solid #E5DCC2;
            padding-top: 0;
            padding-left: 24px;
          }
          
          .logout-button {
            width: auto;
            min-width: 140px;
          }
        }
        
        @media (max-width: 768px) {
          .settings-modal {
            margin: 12px;
            border-radius: 20px;
            max-height: calc(100vh - 24px);
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .settings-main {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .logo-section {
            flex-direction: column;
            text-align: center;
          }
          
          .info-cards {
            grid-template-columns: 1fr;
          }
          
          .settings-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }
          
          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .settings-sidebar {
            flex-direction: column;
            gap: 16px;
          }
          
          .settings-nav {
            flex-direction: column;
          }
          
          .logout-section {
            border-left: none;
            border-top: 1px solid #E5DCC2;
            padding-left: 0;
            padding-top: 16px;
          }
          
          .backup-actions {
            gap: 8px;
          }
          
          .action-button {
            padding: 12px 16px;
            font-size: 13px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/Sidebar.tsx":
/*!*********************************************!*\
  !*** ./src/renderer/components/Sidebar.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sidebar: () => (/* binding */ Sidebar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/home.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/history.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/heart.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/info.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bar-chart-3.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/clock.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/briefcase.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-right.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-left.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/zap.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trending-up.mjs");



const Sidebar = ({ currentView, onNavigate, stats }) => {
    const [isCollapsed, setIsCollapsed] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Tableau de bord',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
            description: 'Vue d\'ensemble et statistiques',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)'
        },
        {
            id: 'documents',
            label: 'Ma Collection',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
            description: 'Parcourir tous les documents',
            count: stats.totalBooks,
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6B57 100%)'
        },
        {
            id: 'borrowed',
            label: 'Emprunts Actifs',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"],
            description: 'Documents actuellement empruntés',
            count: stats.borrowedBooks,
            badge: stats.borrowedBooks > 0,
            urgent: stats.overdueBooks > 0,
            gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)'
        }
    ];
    const actionItems = [
        {
            id: 'add-document',
            label: 'Nouveau Document',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"],
            description: 'Ajouter à la collection',
            accent: true,
            gradient: 'linear-gradient(135deg, #C2571B 0%, #E65100 100%)',
            highlight: true
        },
        {
            id: 'borrowers',
            label: 'Gestion Emprunteurs',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"],
            description: 'Gérer les utilisateurs',
            count: stats.totalBorrowers,
            badge: stats.totalBorrowers > 0,
            gradient: 'linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%)'
        }
    ];
    const reportItems = [
        {
            id: 'history',
            label: 'Historique Complet',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
            description: 'Tous les emprunts et retours',
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
        }
    ];
    const supportItems = [
        {
            id: 'donation',
            label: 'Soutenir le projet',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"],
            description: 'Faire une donation',
            gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            support: true
        },
        {
            id: 'about',
            label: 'À propos',
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"],
            description: 'Développeur & crédits',
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
        }
    ];
    const quickStats = [
        {
            label: 'Collection',
            value: stats.totalBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
            color: '#3E5C49',
            trend: '+2 ce mois'
        },
        {
            label: 'Disponibles',
            value: stats.availableBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"],
            color: '#3E5C49',
            percentage: stats.totalBooks > 0 ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0
        },
        {
            label: 'Empruntés',
            value: stats.borrowedBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"],
            color: '#C2571B',
            percentage: stats.totalBooks > 0 ? Math.round((stats.borrowedBooks / stats.totalBooks) * 100) : 0
        },
        {
            label: 'En retard',
            value: stats.overdueBooks,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"],
            color: '#DC2626',
            urgent: stats.overdueBooks > 0
        }
    ];
    const userStats = [
        {
            label: 'Étudiants',
            value: stats.totalStudents,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"],
            color: '#3E5C49'
        },
        {
            label: 'Personnel',
            value: stats.totalStaff,
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"],
            color: '#C2571B'
        }
    ];
    const getPopularityScore = () => {
        if (stats.totalBooks === 0)
            return 0;
        return Math.round((stats.borrowedBooks / stats.totalBooks) * 100);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `sidebar ${isCollapsed ? 'collapsed' : ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sidebar-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "sidebar-toggle", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "toggle-button", onClick: () => setIsCollapsed(!isCollapsed), title: isCollapsed ? 'Développer le menu' : 'Réduire le menu', children: isCollapsed ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"], { size: 18 }) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"], { size: 18 }) }) }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sidebar-brand", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "brand-logo", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 24 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "brand-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "brand-title", children: "Biblioth\u00E8que" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "brand-subtitle", children: "Syst\u00E8me de gestion moderne" })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sidebar-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", { className: "sidebar-nav", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "nav-title", children: "Principal" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { className: "nav-list", children: menuItems.map((item) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "nav-item", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.accent ? 'accent' : ''} ${item.urgent ? 'urgent' : ''} ${item.highlight ? 'highlight' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-label", children: item.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-description", children: item.description })] }), item.count !== undefined && item.count > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `nav-count ${item.badge ? 'badge' : ''} ${item.urgent ? 'urgent' : ''}`, children: item.count })), item.highlight && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-highlight", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 14 }) }))] })), isCollapsed && item.badge && stats.borrowedBooks > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `nav-indicator ${item.urgent ? 'urgent' : ''}` }))] }) }, item.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "nav-title", children: "Actions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { className: "nav-list", children: actionItems.map((item) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "nav-item", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.accent ? 'accent' : ''} ${item.highlight ? 'highlight' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-label", children: item.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-description", children: item.description })] }), item.count !== undefined && item.count > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `nav-count ${item.badge ? 'badge' : ''}`, children: item.count })), item.highlight && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-highlight", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_16__["default"], { size: 14 }) }))] }))] }) }, item.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "nav-title", children: "Rapports" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { className: "nav-list", children: reportItems.map((item) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "nav-item", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-label", children: item.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-description", children: item.description })] }))] }) }, item.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-section", children: [!isCollapsed && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "nav-title", children: "Communaut\u00E9" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { className: "nav-list", children: supportItems.map((item) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "nav-item", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: `nav-button ${currentView === item.id ? 'active' : ''} ${item.support ? 'support' : ''}`, onClick: () => onNavigate(item.id), title: isCollapsed ? item.label : '', style: {
                                                    '--item-gradient': item.gradient
                                                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "nav-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(item.icon, { size: 20 }) }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "nav-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-label", children: item.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "nav-description", children: item.description })] }))] }) }, item.id))) })] })] }), !isCollapsed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "stats-title", children: "Statistiques de collection" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "popularity-score", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_17__["default"], { size: 14 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [getPopularityScore(), "% popularit\u00E9"] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stats-grid", children: quickStats.map((stat, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `stat-card ${stat.urgent ? 'urgent' : ''}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-icon", style: { color: stat.color }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(stat.icon, { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-value", children: stat.value }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-label", children: stat.label }), stat.trend && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "stat-trend", children: stat.trend })), stat.percentage !== undefined && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stat-percentage", children: [stat.percentage, "%"] }))] })] }, index))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "stats-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "stats-title", children: "Utilisateurs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "users-stats", children: userStats.map((stat, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "user-stat", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "user-stat-icon", style: { color: stat.color }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(stat.icon, { size: 18 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "user-stat-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "user-stat-value", children: stat.value }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "user-stat-label", children: stat.label })] })] }, index))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "total-users", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "total-label", children: "Total des utilisateurs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "total-value", children: stats.totalBorrowers })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-section", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "stats-title", children: "Activit\u00E9 r\u00E9cente" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-pulse" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-summary", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-dot available" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [stats.availableBooks, " documents pr\u00EAts \u00E0 emprunter"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-item", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-dot borrowed" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [stats.borrowedBooks, " emprunts en cours"] })] }), stats.overdueBooks > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "activity-item urgent", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "activity-dot overdue" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [stats.overdueBooks, " document(s) en retard"] })] }))] })] })] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .sidebar {
          width: 300px;
          background: linear-gradient(180deg, #3E5C49 0%, #2E453A 100%);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-right: 1px solid rgba(46, 69, 58, 0.3);
          box-shadow: 4px 0 16px rgba(62, 92, 73, 0.1);
        }
        
        .sidebar.collapsed {
          width: 72px;
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(194, 87, 27, 0.02) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(243, 238, 217, 0.1);
          position: relative;
          z-index: 1;
        }
        
        .sidebar-toggle {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }
        
        .toggle-button {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .toggle-button:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        
        .collapsed .sidebar-brand {
          opacity: 0;
          pointer-events: none;
        }
        
        .brand-logo {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .brand-title {
          font-size: 20px;
          font-weight: 800;
          color: #F3EED9;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        
        .brand-subtitle {
          font-size: 13px;
          color: rgba(243, 238, 217, 0.7);
          margin: 0;
          line-height: 1.3;
        }
        
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px 20px 20px;
          position: relative;
          z-index: 1;
        }
        
        .collapsed .sidebar-content {
          padding: 8px 12px 20px;
        }
        
        .nav-section {
          margin-bottom: 32px;
        }
        
        .nav-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(243, 238, 217, 0.6);
          margin-bottom: 16px;
          margin-top: 0;
          padding: 0 4px;
        }
        
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .nav-item {
          width: 100%;
        }
        
        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: none;
          background: transparent;
          color: #F3EED9;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 14px;
          position: relative;
          text-align: left;
          overflow: hidden;
          border: 1px solid transparent;
        }
        
        .collapsed .nav-button {
          justify-content: center;
          padding: 16px 12px;
        }
        
        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(243, 238, 217, 0.08);
          border-radius: 16px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .nav-button:hover::before {
          transform: scaleX(1);
        }
        
        .nav-button:hover {
          color: #FFFFFF;
          transform: translateX(4px);
          border-color: rgba(243, 238, 217, 0.2);
        }
        
        .collapsed .nav-button:hover {
          transform: scale(1.05);
        }
        
        .nav-button.active {
          background: var(--item-gradient, rgba(243, 238, 217, 0.15));
          color: #FFFFFF;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(62, 92, 73, 0.2);
          border-color: rgba(243, 238, 217, 0.3);
        }
        
        .nav-button.active::before {
          transform: scaleX(1);
          background: rgba(243, 238, 217, 0.1);
        }
        
        .nav-button.highlight {
          background: var(--item-gradient);
          animation: pulse-highlight 3s ease-in-out infinite;
        }
        
        .nav-button.highlight:hover {
          background: linear-gradient(135deg, #A8481A 0%, #D84315 100%);
          transform: translateX(4px) translateY(-2px);
          box-shadow: 0 12px 32px rgba(194, 87, 27, 0.4);
        }
        
        .nav-button.support {
          position: relative;
        }
        
        .nav-button.support::after {
          content: '♥';
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 12px;
          color: #E91E63;
          animation: heartbeat 2s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(194, 87, 27, 0.3);
          }
          50% {
            box-shadow: 0 8px 24px rgba(194, 87, 27, 0.5);
          }
        }
        
        .nav-button.urgent {
          position: relative;
        }
        
        .nav-button.urgent::after {
          content: '';
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          background: #DC2626;
          border-radius: 50%;
          animation: pulse-urgent 2s infinite;
        }
        
        @keyframes pulse-urgent {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        
        .nav-label {
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 3px;
          font-size: 15px;
        }
        
        .nav-description {
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.2;
        }
        
        .nav-count {
          background: rgba(243, 238, 217, 0.2);
          color: #F3EED9;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .nav-count.badge {
          background: #C2571B;
          color: #FFFFFF;
          animation: pulse-badge 2s infinite;
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .nav-count.urgent {
          background: #DC2626;
          color: #FFFFFF;
          animation: pulse-urgent 1.5s infinite;
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes pulse-badge {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .nav-highlight {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: #F3EED9;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.7;
            transform: rotate(0deg) scale(1);
          }
          50% {
            opacity: 1;
            transform: rotate(180deg) scale(1.1);
          }
        }
        
        .nav-indicator {
          width: 10px;
          height: 10px;
          background: #C2571B;
          border-radius: 50%;
          position: absolute;
          top: 12px;
          right: 12px;
          animation: pulse-badge 2s infinite;
          border: 2px solid rgba(243, 238, 217, 0.3);
        }
        
        .nav-indicator.urgent {
          background: #DC2626;
          animation: pulse-urgent 1.5s infinite;
        }
        
        .stats-section {
          margin-bottom: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(243, 238, 217, 0.1);
          position: relative;
          isolation: isolate;
        }
        
        .stats-section:first-of-type {
          border-top: none;
          padding-top: 0;
        }
        
        .stats-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 16px !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .stats-title {
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          color: rgba(243, 238, 217, 0.6) !important;
          margin: 0 !important;
          font-family: inherit !important;
        }
        
        .popularity-score {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .stat-card {
          background: rgba(243, 238, 217, 0.08) !important;
          border-radius: 12px !important;
          padding: 14px 12px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          transition: all 0.2s ease !important;
          border: 1px solid rgba(243, 238, 217, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(243, 238, 217, 0.05) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .stat-card:hover {
          background: rgba(243, 238, 217, 0.12);
          transform: translateY(-1px);
        }
        
        .stat-card:hover::before {
          opacity: 1;
        }
        
        .stat-card.urgent {
          background: rgba(220, 38, 38, 0.15);
          border-color: rgba(220, 38, 38, 0.3);
          animation: pulse-card 3s ease-in-out infinite;
        }
        
        @keyframes pulse-card {
          0%, 100% {
            background: rgba(220, 38, 38, 0.15);
          }
          50% {
            background: rgba(220, 38, 38, 0.2);
          }
        }
        
        .stat-icon {
          opacity: 0.9;
          flex-shrink: 0;
        }
        
        .stat-content {
          flex: 1;
          min-width: 0;
        }
        
        .stat-value {
          font-size: 18px !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          color: #F3EED9 !important;
          margin-bottom: 2px !important;
          font-family: inherit !important;
        }
        
        .stat-label {
          font-size: 10px !important;
          color: rgba(243, 238, 217, 0.7) !important;
          line-height: 1.2 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
          font-family: inherit !important;
        }
        
        .stat-trend {
          font-size: 9px;
          color: #4CAF50;
          font-weight: 600;
          margin-top: 2px;
        }
        
        .stat-percentage {
          font-size: 9px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
          margin-top: 2px;
        }
        
        .users-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .user-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(243, 238, 217, 0.06);
          border-radius: 10px;
          padding: 12px;
          border: 1px solid rgba(243, 238, 217, 0.1);
        }
        
        .user-stat-icon {
          opacity: 0.9;
        }
        
        .user-stat-content {
          flex: 1;
        }
        
        .user-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #F3EED9;
          line-height: 1.2;
        }
        
        .user-stat-label {
          font-size: 11px;
          color: rgba(243, 238, 217, 0.7);
          font-weight: 500;
        }
        
        .total-users {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .total-label {
          font-size: 12px;
          color: rgba(243, 238, 217, 0.8);
          font-weight: 600;
        }
        
        .total-value {
          font-size: 16px;
          font-weight: 800;
          color: #F3EED9;
        }
        
        .activity-section {
          margin-top: auto;
        }
        
        .activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .activity-pulse {
          width: 8px;
          height: 8px;
          background: #4CAF50;
          border-radius: 50%;
          animation: pulse-activity 2s ease-in-out infinite;
        }
        
        @keyframes pulse-activity {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
        
        .activity-summary {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(243, 238, 217, 0.8);
          line-height: 1.3;
        }
        
        .activity-item.urgent {
          color: #FFCDD2;
        }
        
        .activity-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .activity-dot.available {
          background: #4CAF50;
        }
        
        .activity-dot.borrowed {
          background: #FF9800;
        }
        
        .activity-dot.overdue {
          background: #F44336;
          animation: pulse-urgent 1.5s infinite;
        }
        
        /* Enhanced scrollbar */
        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(243, 238, 217, 0.1);
          border-radius: 2px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(243, 238, 217, 0.3);
          border-radius: 2px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(243, 238, 217, 0.5);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            flex-direction: row;
            border-right: none;
            border-bottom: 1px solid rgba(46, 69, 58, 0.3);
            overflow-x: auto;
            background: linear-gradient(90deg, #3E5C49 0%, #2E453A 100%);
          }
          
          .sidebar.collapsed {
            width: 100%;
          }
          
          .sidebar-header {
            display: none;
          }
          
          .sidebar-content {
            flex: 1;
            padding: 16px 20px;
            overflow-x: auto;
            display: flex;
            gap: 20px;
            overflow-y: visible;
          }
          
          .nav-section {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          
          .nav-list {
            flex-direction: row;
            gap: 12px;
          }
          
          .nav-button {
            flex-direction: column;
            gap: 6px;
            padding: 12px 16px;
            min-width: 80px;
            white-space: nowrap;
            border-radius: 12px;
          }
          
          .nav-content {
            align-items: center;
            text-align: center;
          }
          
          .nav-label {
            font-size: 12px;
          }
          
          .nav-description {
            display: none;
          }
          
          .nav-count {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 10px;
            padding: 2px 6px;
            min-width: 16px;
          }
          
          .stats-section,
          .activity-section {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .sidebar-content {
            padding: 12px 16px;
            gap: 16px;
          }
          
          .nav-button {
            min-width: 70px;
            padding: 10px 12px;
          }
          
          .nav-label {
            font-size: 11px;
          }
          
          .nav-count {
            font-size: 9px;
            padding: 1px 4px;
          }
        }
        
        /* Performance optimizations */
        .nav-button {
          contain: layout style paint;
        }
        
        .stat-card {
          contain: layout style paint;
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .nav-button,
          .stat-card,
          .toggle-button,
          .activity-pulse,
          .nav-highlight {
            transition: none;
            animation: none;
          }
          
          .nav-button:hover {
            transform: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .nav-button {
            border: 2px solid rgba(243, 238, 217, 0.5);
          }
          
          .nav-button.active {
            border-color: #F3EED9;
          }
          
          .stat-card {
            border-width: 2px;
          }
        }
      ` }), !isCollapsed && stats.overdueBooks > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "emergency-alert", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "alert-icon", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], { size: 16 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "alert-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "alert-title", children: "Action requise" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "alert-message", children: [stats.overdueBooks, " document(s) en retard"] })] })] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .emergency-alert {
          margin: 16px 20px;
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: #FFFFFF;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: pulse-alert 3s ease-in-out infinite;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
        }
        
        @keyframes pulse-alert {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 8px 24px rgba(220, 38, 38, 0.5);
          }
        }
        
        .alert-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .alert-content {
          flex: 1;
        }
        
        .alert-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
          opacity: 0.9;
        }
        
        .alert-message {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/components/TitleBar.tsx":
/*!**********************************************!*\
  !*** ./src/renderer/components/TitleBar.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TitleBar: () => (/* binding */ TitleBar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/minus.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");


const TitleBar = () => {
    const handleMinimize = () => {
        try {
            if (window.electronAPI && window.electronAPI.minimizeWindow) {
                window.electronAPI.minimizeWindow();
            }
            else {
                console.warn('electronAPI.minimizeWindow non disponible');
            }
        }
        catch (error) {
            console.error('Erreur lors de la minimisation:', error);
        }
    };
    const handleMaximize = () => {
        try {
            if (window.electronAPI && window.electronAPI.maximizeWindow) {
                window.electronAPI.maximizeWindow();
            }
            else {
                console.warn('electronAPI.maximizeWindow non disponible');
            }
        }
        catch (error) {
            console.error('Erreur lors de la maximisation:', error);
        }
    };
    const handleClose = () => {
        try {
            if (window.electronAPI && window.electronAPI.closeWindow) {
                window.electronAPI.closeWindow();
            }
            else {
                console.warn('electronAPI.closeWindow non disponible');
                // Fallback pour fermer la fenêtre
                if (window.close) {
                    window.close();
                }
            }
        }
        catch (error) {
            console.error('Erreur lors de la fermeture:', error);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "titlebar", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "titlebar-content", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "titlebar-left", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "app-logo", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], { size: 18 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "app-title", children: "Biblioth\u00E8que" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "title-separator" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "app-subtitle", children: "Gestion moderne de collection" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "titlebar-center" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "titlebar-controls", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-button minimize", onClick: handleMinimize, title: "R\u00E9duire", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], { size: 12 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-button maximize", onClick: handleMaximize, title: "Agrandir", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], { size: 10 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "control-button close", onClick: handleClose, title: "Fermer", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], { size: 12 }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .titlebar {
          height: 48px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-bottom: 1px solid rgba(46, 69, 58, 0.2);
          -webkit-app-region: drag;
          position: relative;
          z-index: 1000;
        }
        
        .titlebar::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.3), transparent);
        }
        
        .titlebar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 8px 0 16px;
          position: relative;
        }
        
        .titlebar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        
        .app-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(243, 238, 217, 0.15);
          border-radius: 8px;
          color: #F3EED9;
          flex-shrink: 0;
        }
        
        .app-title {
          font-size: 14px;
          font-weight: 700;
          color: #F3EED9;
          letter-spacing: -0.2px;
          flex-shrink: 0;
        }
        
        .title-separator {
          width: 1px;
          height: 16px;
          background: rgba(243, 238, 217, 0.3);
          flex-shrink: 0;
        }
        
        .app-subtitle {
          font-size: 12px;
          font-weight: 400;
          color: rgba(243, 238, 217, 0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .titlebar-center {
          flex: 2;
          display: flex;
          justify-content: center;
          margin: 0 16px;
        }
        
        .titlebar-controls {
          display: flex;
          align-items: center;
          -webkit-app-region: no-drag;
          flex-shrink: 0;
        }
        
        .control-button {
          width: 44px;
          height: 32px;
          border: none;
          background: transparent;
          color: #F3EED9;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.15s ease;
          opacity: 0.8;
          position: relative;
        }
        
        .control-button::before {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 2px;
          background: transparent;
          transition: background 0.15s ease;
        }
        
        .control-button:hover {
          opacity: 1;
        }
        
        .control-button:hover::before {
          background: rgba(243, 238, 217, 0.1);
        }
        
        .control-button:active::before {
          background: rgba(243, 238, 217, 0.2);
        }
        
        .control-button.close:hover::before {
          background: #E81123;
        }
        
        .control-button.close:hover {
          color: #FFFFFF;
        }
        
        .control-button.close:active::before {
          background: #C50E1F;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .app-subtitle {
            display: none;
          }
          
          .title-separator {
            display: none;
          }
          
          .titlebar-content {
            padding: 0 4px 0 12px;
          }
        }
        
        @media (max-width: 480px) {
          .titlebar-left {
            gap: 8px;
          }
          
          .app-title {
            font-size: 13px;
          }
          
          .control-button {
            width: 40px;
            height: 30px;
          }
        }
      ` })] }));
};


/***/ }),

/***/ "./src/renderer/index.tsx":
/*!********************************!*\
  !*** ./src/renderer/index.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./src/renderer/App.tsx");



const container = document.getElementById('root');
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
root.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_App__WEBPACK_IMPORTED_MODULE_2__.App, {}));


/***/ }),

/***/ "./src/services/SupabaseService.ts":
/*!*****************************************!*\
  !*** ./src/services/SupabaseService.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SupabaseService: () => (/* binding */ SupabaseService)
/* harmony export */ });
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ "./node_modules/@supabase/supabase-js/dist/module/index.js");
// src/services/SupabaseService.ts

// Service Supabase pour la gestion de la bibliothèque
class SupabaseService {
    constructor() {
        this.currentUser = null;
        this.currentInstitution = null;
        // Configuration Supabase avec les vraies clés
        const supabaseUrl = 'https://krojphsvzuwtgxxkjklj.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2pwaHN2enV3dGd4eGtqa2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzMwMTMsImV4cCI6MjA2ODA0OTAxM30.U8CvDXnn84ow2984GIiZqMcAE1-Pc6lGavTVqm_fLtQ';
        this.supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseKey);
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
    // Documents Management - Nouvelles méthodes pour le modèle Document
    async getDocuments() {
        console.log('getDocuments appelé - retour de données de test');
        return [];
    }
    async addDocument(document) {
        console.log('addDocument appelé avec:', document);
        return 1; // ID fictif pour le test
    }
    async updateDocument(document) {
        console.log('updateDocument appelé avec:', document);
        return true;
    }
    async deleteDocument(id) {
        console.log('deleteDocument appelé avec ID:', id);
        return true;
    }
    async searchDocuments(query) {
        console.log('searchDocuments appelé avec query:', query);
        return [];
    }
    async borrowDocument(documentId, borrowerId, expectedReturnDate) {
        console.log('borrowDocument appelé avec:', { documentId, borrowerId, expectedReturnDate });
        return 1; // ID de l'emprunt fictif
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = global["webpackChunkbibliotheque_app"] = global["webpackChunkbibliotheque_app"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/renderer/index.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map