// src/renderer/App.tsx - Version modifiée pour Supabase
import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentList } from './components/DocumentList';
import { BorrowedDocuments } from './components/BorrowedDocuments';
import { AddDocument } from './components/AddDocument';
import { BorrowDocument } from './components/BorrowDocument';
import Borrowers from './components/Borrowers';
import { BorrowHistory } from './components/BorrowHistory';
import { Settings } from './components/Settings';
import { AboutAndSupport } from './components/AboutAndSupport';
import { EnhancedAuthentication } from './components/EnhancedAuthentication';
import { InstitutionSetup } from './components/InstitutionSetup';
import { InitialSetup, AppMode } from './components/InitialSetup';
import { AppPasswordScreen } from './components/AppPasswordScreen';
import { Document, Author, Category, Stats, Borrower, BorrowHistory as BorrowHistoryType } from '../types';
import { SupabaseRendererService, Institution, User } from './services/SupabaseClient';
import { ConfigService } from './services/ConfigService';
import { LocalAuthService } from './services/LocalAuthService';
import { AppSettings } from './components/AppSettings';
import { UserProfile } from './components/UserProfile';
import { InstitutionUserManagement } from './components/InstitutionUserManagement';
import { BackupManager } from './components/BackupManager';
import { ReportsManager } from './components/ReportsManager';
import { StatisticsManager } from './components/StatisticsManager';
import { ToastProvider, useQuickToast } from './components/ToastSystem';
import { KeyboardShortcutsProvider } from './components/KeyboardShortcuts';
import { UnifiedUser, UnifiedInstitution, convertToUnifiedUser, convertToUnifiedInstitution } from './types/UnifiedTypes';

type ViewType = 'initial_setup' | 'dashboard' | 'documents' | 'borrowed' | 'add-document' | 'borrowers' | 'history' | 'reports' | 'statistics' | 'settings' | 'app-settings' | 'user-profile' | 'user-management' | 'backup-manager' | 'about-support' | 'auth' | 'institution_setup';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('initial_setup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
  const [unifiedUser, setUnifiedUser] = useState<UnifiedUser | null>(null);
  const [unifiedInstitution, setUnifiedInstitution] = useState<UnifiedInstitution | null>(null);
  const [institutionCode, setInstitutionCode] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('offline');
  const [isAppConfigured, setIsAppConfigured] = useState(false);
  
  // App security states
  const [isAppLocked, setIsAppLocked] = useState(true);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  
  // Data states
  const [documents, setDocuments] = useState<Document[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [borrowedDocuments, setBorrowedDocuments] = useState<BorrowHistoryType[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDocuments: 0,
    borrowedDocuments: 0,
    availableDocuments: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalBorrowers: 0,
    totalStudents: 0,
    totalStaff: 0,
    overdueDocuments: 0
  });

  // Services
  const [supabaseService] = useState(() => new SupabaseRendererService());
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedDocumentForBorrow, setSelectedDocumentForBorrow] = useState<Document | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showOrphanDataDialog, setShowOrphanDataDialog] = useState(false);
  const [orphanDataCount, setOrphanDataCount] = useState({ documents: 0, authors: 0, categories: 0, borrowers: 0, borrowHistory: 0 });

  useEffect(() => {
    checkAppSecurity();
  }, []);

  const checkAppSecurity = async () => {
    try {
      // Vérifier si un mot de passe d'application est requis
      const appSettings = LocalAuthService.getAppSettings();
      
      if (appSettings.requireAppPassword) {
        setIsAppLocked(true);
        setNeedsPasswordSetup(false);
      } else {
        setIsAppLocked(false);
        await checkInitialConfiguration();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de sécurité:', error);
      setIsAppLocked(false);
      await checkInitialConfiguration();
    }
  };

  const handleAppUnlock = async () => {
    setIsAppLocked(false);
    await checkInitialConfiguration();
  };

  const handlePasswordSetup = async () => {
    setNeedsPasswordSetup(false);
    setIsAppLocked(false);
    await checkInitialConfiguration();
  };

  const checkInitialConfiguration = async () => {
    try {
      // Vérifier si l'application a été configurée
      const configured = ConfigService.isConfigured();
      const mode = ConfigService.getMode();
      
      setIsAppConfigured(configured);
      setAppMode(mode);

      // Charger les informations de dernière connexion si disponibles
      const lastLogin = LocalAuthService.getLastLoginInfo();
      
      if (configured) {
        console.log(`Application configurée en mode: ${mode}`);
        
        // Si auto-login activé et informations disponibles
        if (lastLogin && lastLogin.password && LocalAuthService.getAppSettings().autoLogin) {
          console.log('Tentative de connexion automatique...');
          try {
            await handleAuthentication({
              email: lastLogin.email,
              password: lastLogin.password,
              institutionCode: lastLogin.institutionCode,
              mode: 'login'
            });
            return;
          } catch (error) {
            console.log('Échec de la connexion automatique:', error);
          }
        }
        
        setCurrentView('auth');
        await checkAuthStatus();
      } else {
        console.log('Première exécution - configuration nécessaire');
        setCurrentView('initial_setup');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la configuration:', error);
      setCurrentView('initial_setup');
    }
  };

  const handleInitialSetup = async (mode: AppMode) => {
    try {
      console.log(`Configuration initiale: mode ${mode}`);
      
      // Sauvegarder la configuration
      ConfigService.configureApp(mode);
      
      // Mettre à jour l'état local
      setAppMode(mode);
      setIsAppConfigured(true);
      
      // Rediriger vers l'authentification
      setCurrentView('auth');
      
      // Si mode offline, charger les données de démo par défaut
      if (mode === 'offline') {
        setIsDemoMode(false); // Mode offline avec vraies données locales
      }
      
    } catch (error) {
      console.error('Erreur lors de la configuration initiale:', error);
      setError('Erreur lors de la sauvegarde de la configuration');
    }
  };

  const checkAuthStatus = async () => {
    try {
      // En mode offline, on utilise uniquement l'authentification locale
      if (appMode === 'offline') {
        setCurrentView('auth');
        return;
      }
      
      const user = supabaseService.getCurrentUser();
      const institution = supabaseService.getCurrentInstitution();
      
      if (user && institution) {
        setCurrentUser(user);
        setCurrentInstitution(institution);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        await loadData();
      } else {
        setCurrentView('auth');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setCurrentView('auth');
    }
  };

  const loadData = async () => {
    if (appMode === 'online' && !supabaseService.isAuthenticated()) return;

    try {
      setIsLoading(true);
      
      if (appMode === 'offline') {
        // Mode offline - charger les données depuis SQLite via electronAPI avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code || '';
        console.log('🔍 DEBUG App.tsx loadData - currentInstitution from state:', currentInstitution);
        console.log('🔍 DEBUG App.tsx loadData - currentInstitution from service:', supabaseService.getCurrentInstitution());
        console.log('🔍 DEBUG App.tsx loadData - institutionCode:', institutionCode);
        const [
          documentsData, 
          authorsData, 
          categoriesData, 
          borrowersData,
          borrowedDocumentsData,
          recentActivityData
        ] = await Promise.all([
          window.electronAPI.getDocuments(institutionCode),
          window.electronAPI.getAuthors(institutionCode),
          window.electronAPI.getCategories(institutionCode),
          window.electronAPI.getBorrowers(institutionCode),
          window.electronAPI.getBorrowHistory(undefined, institutionCode),
          window.electronAPI.getRecentActivity(5, institutionCode)
        ]);

        setDocuments(documentsData || []);
        setAuthors(authorsData || []);
        setCategories(categoriesData || []);
        setBorrowers(borrowersData || []);
        setBorrowedDocuments(borrowedDocumentsData || []);
        setRecentActivity(recentActivityData || []);
        
        // Calculer les statistiques manuellement pour le mode offline
        const totalDocuments = documentsData?.length || 0;
        const borrowedCount = borrowedDocumentsData?.filter(bh => bh.status === 'active').length || 0;
        const availableDocuments = totalDocuments - borrowedCount;
        const totalAuthors = authorsData?.length || 0;
        const totalCategories = categoriesData?.length || 0;
        const totalBorrowers = borrowersData?.length || 0;
        const totalStudents = borrowersData?.filter(b => b.type === 'student').length || 0;
        const totalStaff = borrowersData?.filter(b => b.type === 'staff').length || 0;
        const overdueDocuments = borrowedDocumentsData?.filter(bh => {
          if (bh.status !== 'active') return false;
          const expectedReturnDate = new Date(bh.expectedReturnDate);
          return expectedReturnDate < new Date();
        }).length || 0;
        
        setStats({
          totalDocuments,
          borrowedDocuments: borrowedCount,
          availableDocuments,
          totalAuthors,
          totalCategories,
          totalBorrowers,
          totalStudents,
          totalStaff,
          overdueDocuments
        });
      } else {
        // Mode online - utiliser Supabase avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code || '';
        console.log('🔍 DEBUG App.tsx loadData ONLINE - institutionCode:', institutionCode);
        const [
          documentsData, 
          authorsData, 
          categoriesData, 
          borrowersData,
          borrowedDocumentsData,
          statsData
        ] = await Promise.all([
          supabaseService.getDocuments(institutionCode),
          supabaseService.getAuthors(institutionCode),
          supabaseService.getCategories(institutionCode),
          supabaseService.getBorrowers(institutionCode),
          supabaseService.getBorrowedDocuments(institutionCode),
          supabaseService.getStats(institutionCode)
        ]);

        setDocuments(documentsData);
        setAuthors(authorsData);
        setCategories(categoriesData);
        setBorrowers(borrowersData);
        setBorrowedDocuments(borrowedDocumentsData);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = async () => {
    try {
      setIsLoading(true);
      
      // Obtenir le code d'institution courant pour les données démo
      const institutionCode = supabaseService.getCurrentInstitution()?.code || 'DEMO';
      console.log('🔍 DEBUG loadDemoData - Using institutionCode:', institutionCode);
      
      // Données de démonstration avec isolation par institution
      const demoDocuments: Document[] = [
        {
          id: 1,
          titre: "L'Art de la Programmation",
          auteur: "Donald Knuth",
          editeur: "Addison-Wesley",
          lieuEdition: "Reading, MA",
          annee: "1968",
          descripteurs: "Informatique, Programmation",
          cote: "004.01 KNU",
          couverture: "",
          estEmprunte: false,
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          titre: "Clean Code",
          auteur: "Robert C. Martin",
          editeur: "Prentice Hall",
          lieuEdition: "Upper Saddle River, NJ",
          annee: "2008",
          descripteurs: "Développement, Bonnes pratiques",
          cote: "005.1 MAR",
          couverture: "",
          estEmprunte: false,
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          titre: "Design Patterns",
          auteur: "Gang of Four",
          editeur: "Addison-Wesley",
          lieuEdition: "Reading, MA",
          annee: "1994",
          descripteurs: "Architecture logicielle",
          cote: "005.1 GAM",
          couverture: "",
          estEmprunte: false,
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        }
      ];

      const demoAuthors: Author[] = [
        { 
          id: 1, 
          name: "Donald Knuth",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "Robert C. Martin",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "Gang of Four",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        }
      ];

      const demoCategories: Category[] = [
        { 
          id: 1, 
          name: "Informatique",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "Programmation",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "Architecture logicielle",
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        }
      ];

      const demoBorrowers: Borrower[] = [
        {
          id: 1,
          type: 'student',
          firstName: 'Jean',
          lastName: 'Dupont',
          matricule: 'ETU001',
          classe: 'Master 2 Info',
          cniNumber: '',
          position: '',
          email: 'jean.dupont@demo.local',
          phone: '+33 6 12 34 56 78',
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          type: 'staff',
          firstName: 'Marie',
          lastName: 'Martin',
          matricule: 'PROF001',
          classe: '',
          cniNumber: '',
          position: 'Professeur',
          email: 'marie.martin@demo.local',
          phone: '+33 6 87 65 43 21',
          institution_code: institutionCode,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        }
      ];

      const demoStats: Stats = {
        totalDocuments: demoDocuments.length,
        borrowedDocuments: 0,
        availableDocuments: demoDocuments.length,
        totalAuthors: demoAuthors.length,
        totalCategories: demoCategories.length,
        totalBorrowers: demoBorrowers.length,
        totalStudents: 1,
        totalStaff: 1,
        overdueDocuments: 0
      };

      setDocuments(demoDocuments);
      setAuthors(demoAuthors);
      setCategories(demoCategories);
      setBorrowers(demoBorrowers);
      setBorrowedDocuments([]);
      setStats(demoStats);
    } catch (error) {
      console.error('Erreur lors du chargement des données démo:', error);
      setError('Erreur lors du chargement des données démo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthentication = async (credentials: {
    email: string;
    password: string;
    institutionCode?: string;
    mode: 'login' | 'register' | 'create_institution';
    userData?: any;
  }) => {
    try {
      setIsLoading(true);
      setError('');

      if (credentials.mode === 'login') {
        // En mode offline, utiliser le nouveau service d'authentification
        if (appMode === 'offline') {
          console.log('Mode offline - authentification avec LocalAuthService');
          
          // Utiliser le service d'authentification local
          console.log('🔍 DEBUG App.tsx - Authentication attempt with:', {
            email: credentials.email,
            institutionCode: credentials.institutionCode || ''
          });
          const authResult = LocalAuthService.authenticate(
            credentials.email,
            credentials.password,
            credentials.institutionCode || ''
          );
          console.log('🔍 DEBUG App.tsx - Authentication result:', authResult);
          
          if (!authResult.success) {
            throw new Error(authResult.message || 'Échec de l\'authentification');
          }
          
          const localUser = authResult.user!;
          
          // Sauvegarder les informations de connexion si demandé
          LocalAuthService.saveLastLoginInfo(
            credentials.email,
            credentials.institutionCode || '',
            true, // Toujours mémoriser le mot de passe en mode offline
            credentials.password
          );
          
          if (localUser) {
            // Convertir l'utilisateur local au format User
            const appUser: User = {
              id: localUser.id,
              firstName: localUser.firstName,
              lastName: localUser.lastName,
              email: localUser.email,
              role: localUser.role as 'super_admin' | 'admin' | 'librarian' | 'user'
            };

            // Chercher l'institution correspondante ou créer une par défaut
            console.log('🔍 DEBUG App.tsx - Looking for institution with code:', localUser.institutionCode);
            const institution = LocalAuthService.findInstitutionByCode(localUser.institutionCode);
            console.log('🔍 DEBUG App.tsx - Found institution:', institution);
            const appInstitution: Institution = institution ? {
              id: institution.id,
              name: institution.name,
              code: institution.code,
              address: institution.address,
              city: institution.city,
              country: institution.country,
              phone: institution.phone,
              email: institution.email,
              website: institution.website,
              logo: institution.logo,
              description: institution.description,
              type: institution.type as 'school' | 'university' | 'library' | 'other',
              status: 'active',
              subscription_plan: 'basic',
              max_books: 10000,
              max_users: 100,
              created_at: institution.created_at,
              updated_at: new Date().toISOString()
            } : {
              id: 'default-offline',
              name: 'Ma Bibliothèque',
              code: localUser.institutionCode,
              address: '',
              city: '',
              country: '',
              phone: '',
              email: '',
              website: '',
              logo: '',
              description: 'Institution locale par défaut',
              type: 'library',
              status: 'active',
              subscription_plan: 'basic',
              max_books: 10000,
              max_users: 100,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            setCurrentUser(appUser);
            setCurrentInstitution(appInstitution);
            
            // CRITICAL: Switch the SupabaseService to the correct institution
            console.log('🔍 DEBUG App.tsx - Switching SupabaseService institution to:', appInstitution.code);
            await supabaseService.switchInstitution(appInstitution.code);
            
            // Créer les versions unifiées
            setUnifiedUser(convertToUnifiedUser(localUser, 'offline'));
            setUnifiedInstitution(convertToUnifiedInstitution(institution || {
              id: 'default-offline',
              name: 'Ma Bibliothèque',
              code: localUser.institutionCode,
              address: '',
              city: '',
              country: '',
              phone: '',
              email: '',
              website: '',
              logo: '',
              description: 'Bibliothèque locale',
              type: 'library',
              adminEmail: localUser.email,
              created_at: new Date().toISOString()
            }, 'offline'));
            
            setIsAuthenticated(true);
            setIsDemoMode(false);
            setCurrentView('dashboard');
            await loadData();
            
            // Vérifier s'il y a des données orphelines à assigner
            setTimeout(() => checkForOrphanData(), 1000);
            return;
          }
        }

        // Mode online (désactivé pour cette version)
        throw new Error('Le mode en ligne n\'est pas encore disponible dans cette version.');

      } else if (credentials.mode === 'register') {
        // Inscription avec code d'établissement
        const result = await supabaseService.signUp(
          credentials.email, 
          credentials.password, 
          {
            firstName: credentials.userData.firstName,
            lastName: credentials.userData.lastName,
            institutionCode: credentials.institutionCode || 'DEFAULT'
          }
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        // Afficher un message de succès et rediriger vers login
        alert('Compte créé avec succès ! Veuillez vérifier votre email et vous connecter.');
        
      } else if (credentials.mode === 'create_institution') {
        // Création d'institution locale
        const institutionData = credentials.userData.institution;
        
        // Créer l'institution avec le service local
        const newInstitution = LocalAuthService.createInstitution({
          name: institutionData.name,
          address: institutionData.address || '',
          city: institutionData.city || '',
          country: institutionData.country || '',
          phone: institutionData.phone || '',
          email: institutionData.email || '',
          website: institutionData.website || '',
          logo: institutionData.logo || '',
          description: institutionData.description || '',
          type: institutionData.type || 'library',
          adminEmail: credentials.email
        });
        
        setInstitutionCode(newInstitution.code);
        
        // Créer le compte administrateur local
        const adminUser = LocalAuthService.addUser({
          email: credentials.email,
          password: credentials.password,
          firstName: credentials.userData.admin.firstName,
          lastName: credentials.userData.admin.lastName,
          role: 'admin',
          institutionCode: newInstitution.code,
          preferences: {
            rememberMe: true,
            autoLogin: false,
            theme: 'light'
          }
        });

        if (!adminUser) {
          throw new Error('Erreur lors de la création du compte administrateur');
        }

        setCurrentView('institution_setup');
      }

    } catch (error: any) {
      setError(error.message || 'Erreur d\'authentification');
      throw error;
    } finally {
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
      setBorrowedDocuments([]);
      setStats({
        totalDocuments: 0,
        borrowedDocuments: 0,
        availableDocuments: 0,
        totalAuthors: 0,
        totalCategories: 0,
        totalBorrowers: 0,
        totalStudents: 0,
        totalStaff: 0,
        overdueDocuments: 0
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleUserUpdate = (updatedUser: UnifiedUser) => {
    setUnifiedUser(updatedUser);
    
    // Mettre à jour aussi currentUser pour la compatibilité
    if (appMode === 'offline') {
      const appUser: User = {
        id: updatedUser.id as string,
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email,
        role: updatedUser.role as 'super_admin' | 'admin' | 'librarian' | 'user'
      };
      setCurrentUser(appUser);
    }
  };

  const handleAddDocument = async (document: Omit<Document, 'id'>) => {
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser l'API électron pour SQLite avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        if (editingDocument) {
          // Modification d'un document existant
          const documentToUpdate = { ...document, id: editingDocument.id } as Document;
          await window.electronAPI.updateDocument(documentToUpdate, institutionCode);
          console.log('Document modifié en mode offline:', editingDocument.id);
        } else {
          // Ajout d'un nouveau document
          const documentId = await window.electronAPI.addDocument(document, institutionCode);
          console.log('Document ajouté en mode offline avec ID:', documentId);
        }
        
        // Ajouter l'auteur s'il n'existe pas
        if (!authors.find(a => a.name === document.auteur)) {
          await window.electronAPI.addAuthor({
            name: document.auteur,
            biography: '',
            birthDate: '',
            nationality: '',
            syncStatus: 'pending',
            lastModified: new Date().toISOString(),
            version: 1,
            createdAt: new Date().toISOString()
          }, institutionCode);
        }
        
        // Ajouter la catégorie si elle n'existe pas (basée sur les descripteurs)
        const categoryName = document.descripteurs.split(',')[0]?.trim();
        if (categoryName && !categories.find(c => c.name === categoryName)) {
          await window.electronAPI.addCategory({
            name: categoryName,
            description: `Catégorie créée automatiquement pour ${categoryName}`,
            color: '#3E5C49',
            syncStatus: 'pending',
            lastModified: new Date().toISOString(),
            version: 1,
            createdAt: new Date().toISOString()
          }, institutionCode);
        }
        
        // Recharger les données pour mettre à jour l'interface
        await loadData();
        
      } else if (isDemoMode) {
        // Mode démo - ajouter localement en mémoire
        const newId = Math.max(...documents.map(d => d.id || 0)) + 1;
        const newDocument: Document = {
          ...document,
          id: newId,
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        };
        
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        
        // Mettre à jour les statistiques
        setStats(prev => ({
          ...prev,
          totalDocuments: updatedDocuments.length,
          availableDocuments: updatedDocuments.length - prev.borrowedDocuments
        }));
        
        // Ajouter l'auteur s'il n'existe pas
        if (!authors.find(a => a.name === document.auteur)) {
          const newAuthorId = Math.max(...authors.map(a => a.id || 0)) + 1;
          const newAuthor: Author = {
            id: newAuthorId, 
            name: document.auteur,
            syncStatus: 'synced',
            lastModified: new Date().toISOString(),
            version: 1,
            createdAt: new Date().toISOString()
          };
          setAuthors(prev => [...prev, newAuthor]);
          setStats(prev => ({ ...prev, totalAuthors: prev.totalAuthors + 1 }));
        }
        
        console.log('Document ajouté en mode démo:', newDocument);
        
      } else {
        // Mode online - utiliser Supabase avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        await supabaseService.addDocument(document, institutionCode);
        await loadData();
      }
      
      // Nettoyer l'état d'édition et retourner à la liste des documents
      setEditingDocument(null);
      setCurrentView('documents');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du document:', error);
      throw error;
    }
  };


  const handleReturnDocument = async (borrowHistoryId: number, notes?: string) => {
    if (borrowHistoryId === undefined) {
      console.error('Invalid argument for returnBook:', { borrowHistoryId });
      return;
    }
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser l'API électron pour SQLite avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code || '';
        await window.electronAPI.returnBook(borrowHistoryId, notes, institutionCode);
        console.log('Document retourné en mode offline:', borrowHistoryId);
      } else {
        // Mode online - utiliser Supabase
        // Note: returnBook ne nécessite pas institutionCode car il utilise l'ID d'historique
        await supabaseService.returnBook(borrowHistoryId.toString(), notes);
      }
      await loadData();
    } catch (error: any) {
      console.error('Erreur lors du retour:', error);
      throw error;
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser l'API électron pour SQLite avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        await window.electronAPI.deleteDocument(documentId, institutionCode);
        console.log('Document supprimé en mode offline:', documentId);
        
        // Recharger les données pour mettre à jour l'interface
        await loadData();
        
      } else if (isDemoMode) {
        // Mode démo - supprimer localement en mémoire
        const updatedDocuments = documents.filter(d => d.id !== documentId);
        setDocuments(updatedDocuments);
        
        // Mettre à jour les statistiques
        setStats(prev => ({
          ...prev,
          totalDocuments: updatedDocuments.length,
          availableDocuments: updatedDocuments.length - prev.borrowedDocuments
        }));
        
        console.log('Document supprimé en mode démo:', documentId);
      } else {
        // Mode online - utiliser Supabase avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code || '';
        await supabaseService.deleteDocument(documentId.toString(), institutionCode);
        await loadData();
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setCurrentView('add-document');
  };

  const handleBorrowDocument = (document: Document) => {
    setSelectedDocumentForBorrow(document);
    setShowBorrowModal(true);
  };

  const closeBorrowModal = () => {
    setSelectedDocumentForBorrow(null);
    setShowBorrowModal(false);
  };

  const handleBorrow = async (documentId: number, borrowerId: number, returnDate: string) => {
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser l'API électron pour SQLite avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        await window.electronAPI.borrowDocument(documentId, borrowerId, returnDate, institutionCode);
        console.log('Document emprunté en mode offline:', { documentId, borrowerId, returnDate });
      } else if (isDemoMode) {
        // Mode démo - simuler l'emprunt
        const updatedDocuments = documents.map(doc => 
          doc.id === documentId 
            ? { ...doc, estEmprunte: true, syncStatus: 'synced' as const }
            : doc
        );
        setDocuments(updatedDocuments);
        
        // Créer l'entrée d'historique d'emprunt
        const borrower = borrowers.find(b => b.id === borrowerId);
        const document = documents.find(d => d.id === documentId);
        
        if (borrower && document) {
          const newBorrowHistory: typeof borrowedDocuments[0] = {
            id: Math.max(...borrowedDocuments.map(b => b.id || 0)) + 1,
            documentId: documentId,
            borrowerId,
            borrowDate: new Date().toISOString(),
            expectedReturnDate: returnDate,
            actualReturnDate: undefined,
            status: 'active' as const,
            document: document,
            borrower,
            syncStatus: 'synced' as const,
            lastModified: new Date().toISOString(),
            version: 1,
            createdAt: new Date().toISOString()
          };
          
          setBorrowedDocuments(prev => [...prev, newBorrowHistory]);
          
          // Mettre à jour les statistiques
          setStats(prev => ({
            ...prev,
            borrowedDocuments: prev.borrowedDocuments + 1,
            availableDocuments: prev.availableDocuments - 1
          }));
        }
      } else {
        // Mode online - utiliser Supabase avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        await supabaseService.borrowDocument({
          documentId: documentId.toString(),
          borrowerId: borrowerId.toString(),
          expectedReturnDate: returnDate
        }, institutionCode);
      }
      
      // Recharger les données après l'opération
      await loadData();
      closeBorrowModal();
    } catch (error) {
      console.error('Erreur lors de l\'emprunt:', error);
      throw error;
    }
  };

  const handleReturn = async (documentId: number) => {
    try {
      if (appMode === 'offline') {
        // Mode offline - trouver l'emprunt actif et le retourner
        const activeBorrow = borrowedDocuments.find(bh => 
          bh.documentId === documentId && bh.status === 'active'
        );
        
        if (activeBorrow && activeBorrow.id) {
          const institutionCode = supabaseService.getCurrentInstitution()?.code || '';
          await window.electronAPI.returnBook(activeBorrow.id, undefined, institutionCode);
          console.log('Document retourné en mode offline:', documentId);
        } else {
          console.error('Aucun emprunt actif trouvé pour le document:', documentId);
          return;
        }
      } else if (isDemoMode) {
        // Mode démo - simuler le retour
        const updatedDocuments = documents.map(doc => 
          doc.id === documentId 
            ? { ...doc, estEmprunte: false, syncStatus: 'synced' as const }
            : doc
        );
        setDocuments(updatedDocuments);
        
        // Marquer comme retourné dans l'historique
        const updatedBorrowHistory = borrowedDocuments.map(bh => 
          bh.documentId === documentId && bh.status === 'active'
            ? { ...bh, actualReturnDate: new Date().toISOString(), status: 'returned' as const }
            : bh
        );
        setBorrowedDocuments(updatedBorrowHistory);
        
        // Mettre à jour les statistiques
        setStats(prev => ({
          ...prev,
          borrowedDocuments: prev.borrowedDocuments - 1,
          availableDocuments: prev.availableDocuments + 1
        }));
      } else {
        // Mode online - utiliser Supabase
        await supabaseService.returnDocument(documentId.toString());
      }
      
      // Recharger les données après l'opération
      await loadData();
      closeBorrowModal();
    } catch (error) {
      console.error('Erreur lors du retour:', error);
      throw error;
    }
  };

  const handleAddBorrower = async (borrower: Omit<Borrower, 'id'>): Promise<number> => {
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser l'API électron pour SQLite avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        const newId = await window.electronAPI.addBorrower(borrower, institutionCode);
        await loadData(); // Refresh data
        return newId;
      } else if (isDemoMode) {
        // Mode démo - simuler l'ajout
        const newId = Math.max(...borrowers.map(b => b.id || 0), 0) + 1;
        const newBorrower = { ...borrower, id: newId };
        setBorrowers((prev: Borrower[]) => [...prev, newBorrower]);
        
        // Mettre à jour les statistiques
        setStats((prev: Stats) => ({
          ...prev,
          totalBorrowers: prev.totalBorrowers + 1,
          totalStudents: borrower.type === 'student' ? prev.totalStudents + 1 : prev.totalStudents,
          totalStaff: borrower.type === 'staff' ? prev.totalStaff + 1 : prev.totalStaff
        }));
        
        return newId;
      } else {
        // Mode online - utiliser Supabase avec filtrage par institution
        const institutionCode = supabaseService.getCurrentInstitution()?.code;
        if (!institutionCode) {
          throw new Error('Code d\'institution manquant. Veuillez vous reconnecter.');
        }
        const newId = await supabaseService.addBorrower(borrower, institutionCode);
        await loadData(); // Refresh data
        return newId;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'emprunteur:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (isDemoMode) {
      await loadDemoData();
    } else {
      await loadData();
    }
  };

  const checkForOrphanData = async () => {
    try {
      if (appMode === 'offline' && supabaseService.getCurrentInstitution()?.code) {
        const count = await window.electronAPI.getOrphanDataCount();
        const totalOrphans = count.documents + count.authors + count.categories + count.borrowers + count.borrowHistory;
        
        if (totalOrphans > 0) {
          setOrphanDataCount(count);
          setShowOrphanDataDialog(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des données orphelines:', error);
    }
  };

  const handleAssignOrphanData = async () => {
    try {
      if (!supabaseService.getCurrentInstitution()?.code) return;
      
      setIsLoading(true);
      const result = await window.electronAPI.assignOrphanDataToInstitution(supabaseService.getCurrentInstitution()?.code || '');
      
      const totalAssigned = result.documents + result.authors + result.categories + result.borrowers + result.borrowHistory;
      
      if (totalAssigned > 0) {
        await loadData(); // Recharger les données
        setError(''); // Effacer les erreurs précédentes
        console.log(`${totalAssigned} éléments assignés à l'établissement ${supabaseService.getCurrentInstitution()?.code}`);
      }
      
      setShowOrphanDataDialog(false);
    } catch (error) {
      console.error('Erreur lors de l\'assignation des données:', error);
      setError('Erreur lors de l\'assignation des données à l\'établissement');
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'affichage avec TitleBar toujours visible
  const renderAuthenticatedContent = () => {
    // Écran de configuration initiale - sans TitleBar
    if (currentView === 'initial_setup') {
      return <InitialSetup onComplete={handleInitialSetup} onClose={() => window.electronAPI?.closeWindow?.()} />;
    }

    // Tous les autres écrans auront la TitleBar
    return null; // Sera géré dans renderMainContent
  };

  // Gérer le contenu principal avec TitleBar
  const renderMainContent = () => {
    if (!isAuthenticated) {
      if (currentView === 'institution_setup') {
        return (
          <InstitutionSetup
            institutionCode={institutionCode}
            institution={currentInstitution}
            onComplete={() => {
              setCurrentView('auth');
              alert('Votre établissement a été créé avec succès ! Vous pouvez maintenant vous connecter.');
            }}
            onClose={() => window.electronAPI?.closeWindow?.()}
          />
        );
      }
      
      return <EnhancedAuthentication onLogin={handleAuthentication} />;
    }

    return renderCurrentView();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            documents={documents}
            categories={categories}
            recentActivity={recentActivity}
          />
        );
      case 'documents':
        return (
          <DocumentList
            documents={documents}
            onAdd={() => setCurrentView('add-document')}
            onEdit={handleEditDocument}
            onBorrow={handleBorrowDocument}
            onDelete={handleDeleteDocument}
            onRefresh={refreshData}
            syncStatus={{} as any}
            networkStatus={{} as any}
          />
        );
      case 'borrowed':
        // Debug: vérifier l'isolation des emprunts actifs
        const currentInstitutionCode = supabaseService.getCurrentInstitution()?.code;
        const activeBorrows = borrowedDocuments.filter(bh => bh.status === 'active');
        console.log('🔍 DEBUG EMPRUNTS ACTIFS - Institution courante:', currentInstitutionCode);
        console.log('🔍 DEBUG EMPRUNTS ACTIFS - Nombre total d\'emprunts actifs:', activeBorrows.length);
        console.log('🔍 DEBUG EMPRUNTS ACTIFS - Détails des emprunts:', activeBorrows.map(bh => ({
          id: bh.id,
          documentTitle: bh.document?.titre,
          borrowerName: `${bh.borrower?.firstName} ${bh.borrower?.lastName}`,
          institutionCode: bh.institution_code || 'VIDE'
        })));
        
        return (
          <BorrowedDocuments
            documents={activeBorrows
              .map(bh => ({
                ...bh.document!,
                nomEmprunteur: `${bh.borrower?.firstName} ${bh.borrower?.lastName}`,
                dateEmprunt: bh.borrowDate,
                dateRetourPrevu: bh.expectedReturnDate
              }))}
            onReturn={(documentId) => {
              const borrowHistory = borrowedDocuments.find(bh => bh.documentId === documentId && bh.status === 'active');
              if (borrowHistory) {
                handleReturnDocument(borrowHistory.id!, undefined);
              }
            }}
          />
        );
      case 'add-document':
        return (
          <AddDocument
            onAdd={handleAddDocument}
            onCancel={() => {
              setEditingDocument(null);
              setCurrentView('documents');
            }}
            editingDocument={editingDocument || undefined}
          />
        );
      case 'borrowers':
        return (
          <Borrowers 
            onClose={() => setCurrentView('dashboard')} 
            onRefreshData={refreshData}
            supabaseService={supabaseService}
          />
        );
      case 'history':
        return (
          <BorrowHistory 
            onClose={() => setCurrentView('dashboard')}
            supabaseService={supabaseService}
          />
        );
      case 'settings':
        return (
          <Settings 
            onClose={() => setCurrentView('dashboard')}
            onLogout={handleLogout}
            currentUser={currentUser}
            currentInstitution={currentInstitution}
            supabaseService={supabaseService}
          />
        );
      case 'about-support':
        return (
          <AboutAndSupport onClose={() => setCurrentView('dashboard')} />
        );
      case 'app-settings':
        return (
          <AppSettings onClose={() => setCurrentView('dashboard')} />
        );
      case 'user-profile':
        return (
          <UserProfile 
            currentUser={unifiedUser}
            currentInstitution={unifiedInstitution}
            appMode={appMode}
            onClose={() => setCurrentView('dashboard')}
            onUserUpdate={handleUserUpdate}
          />
        );
      case 'user-management':
        return (
          <InstitutionUserManagement
            currentUser={unifiedUser}
            currentInstitution={unifiedInstitution}
            appMode={appMode}
            onClose={() => setCurrentView('dashboard')}
          />
        );
      case 'backup-manager':
        return (
          <BackupManager 
            onClose={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            documents={documents}
            categories={categories}
            recentActivity={recentActivity}
          />
        );
    }
  };

  // Rendu des écrans de sécurité
  if (isAppLocked || needsPasswordSetup) {
    return (
      <AppPasswordScreen
        onUnlock={handleAppUnlock}
        onSkip={needsPasswordSetup ? handlePasswordSetup : undefined}
        onClose={() => window.electronAPI?.closeWindow?.()}
        isSetup={needsPasswordSetup}
      />
    );
  }

  // Vérifier si on doit afficher l'écran de configuration initiale sans TitleBar
  const initialSetupContent = renderAuthenticatedContent();
  if (initialSetupContent) {
    return (
      <ToastProvider>
        <KeyboardShortcutsProvider
          onNavigate={setCurrentView}
          onOpenAddDocument={() => setCurrentView('add-document')}
          onOpenSettings={() => setCurrentView('settings')}
        >
          <div className="app">
            {initialSetupContent}
          </div>
        </KeyboardShortcutsProvider>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <KeyboardShortcutsProvider
        onNavigate={setCurrentView}
        onOpenAddDocument={() => setCurrentView('add-document')}
        onOpenSettings={() => setCurrentView('settings')}
      >
        <div className="app">
          <TitleBar onRefresh={refreshData} isAuthenticated={isAuthenticated} />
          <div className="app-container">
            {isAuthenticated ? (
              <AppContent 
                isDemoMode={isDemoMode}
                currentView={currentView}
                setCurrentView={setCurrentView}
                isLoading={isLoading}
                error={error}
                setError={setError}
                renderCurrentView={renderCurrentView}
                showBorrowModal={showBorrowModal}
                selectedDocumentForBorrow={selectedDocumentForBorrow}
                closeBorrowModal={closeBorrowModal}
                handleBorrow={handleBorrow}
                handleReturn={handleReturn}
                handleAddBorrower={handleAddBorrower}
                refreshData={refreshData}
                supabaseService={supabaseService}
                borrowers={borrowers}
                documents={documents}
                borrowedDocuments={borrowedDocuments}
                showReportsModal={showReportsModal}
                setShowReportsModal={setShowReportsModal}
                showStatisticsModal={showStatisticsModal}
                setShowStatisticsModal={setShowStatisticsModal}
                stats={stats}
                currentUser={currentUser}
                currentInstitution={currentInstitution}
                unifiedUser={unifiedUser}
                unifiedInstitution={unifiedInstitution}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                showOrphanDataDialog={showOrphanDataDialog}
                setShowOrphanDataDialog={setShowOrphanDataDialog}
                orphanDataCount={orphanDataCount}
                handleAssignOrphanData={handleAssignOrphanData}
                showUserManagementModal={showUserManagementModal}
                setShowUserManagementModal={setShowUserManagementModal}
              />
            ) : (
              <div className="auth-container">
                {renderMainContent()}
              </div>
            )}
          </div>
        </div>
        {/* User Management Modal */}
        {showUserManagementModal && (
          <InstitutionUserManagement
            currentUser={unifiedUser}
            currentInstitution={unifiedInstitution}
            appMode={appMode}
            onClose={() => setShowUserManagementModal(false)}
          />
        )}
      </KeyboardShortcutsProvider>
    </ToastProvider>
  );
};

interface AppContentProps {
  isDemoMode: boolean;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isLoading: boolean;
  error: string;
  setError: (error: string) => void;
  renderCurrentView: () => React.ReactNode;
  showBorrowModal: boolean;
  selectedDocumentForBorrow: Document | null;
  closeBorrowModal: () => void;
  handleBorrow: (documentId: number, borrowerId: number, returnDate: string) => Promise<void>;
  handleReturn: (documentId: number) => Promise<void>;
  handleAddBorrower: (borrower: Omit<Borrower, 'id'>) => Promise<number>;
  refreshData: () => Promise<void>;
  supabaseService: SupabaseRendererService;
  borrowers: Borrower[];
  documents: Document[];
  borrowedDocuments: BorrowHistoryType[];
  showReportsModal: boolean;
  setShowReportsModal: (show: boolean) => void;
  showStatisticsModal: boolean;
  setShowStatisticsModal: (show: boolean) => void;
  stats: Stats;
  currentUser: User | null;
  currentInstitution: Institution | null;
  unifiedUser: UnifiedUser | null;
  unifiedInstitution: UnifiedInstitution | null;
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
  showOrphanDataDialog: boolean;
  setShowOrphanDataDialog: (show: boolean) => void;
  orphanDataCount: { documents: number; authors: number; categories: number; borrowers: number; borrowHistory: number };
  handleAssignOrphanData: () => Promise<void>;
  showUserManagementModal: boolean;
  setShowUserManagementModal: (show: boolean) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  isDemoMode,
  currentView,
  setCurrentView,
  isLoading,
  error,
  setError,
  renderCurrentView,
  showBorrowModal,
  selectedDocumentForBorrow,
  closeBorrowModal,
  handleBorrow,
  handleReturn,
  handleAddBorrower,
  refreshData,
  supabaseService,
  borrowers,
  documents,
  borrowedDocuments,
  showReportsModal,
  setShowReportsModal,
  showStatisticsModal,
  setShowStatisticsModal,
  stats,
  currentUser,
  currentInstitution,
  unifiedUser,
  unifiedInstitution,
  isAuthenticated,
  onLogout,
  showOrphanDataDialog,
  setShowOrphanDataDialog,
  orphanDataCount,
  handleAssignOrphanData,
  showUserManagementModal,
  setShowUserManagementModal
}) => {
  const { info } = useQuickToast();
  const [demoNotificationShown, setDemoNotificationShown] = React.useState(false);

  React.useEffect(() => {
    if (isDemoMode && !demoNotificationShown) {
      // Afficher une notification pour informer que c'est le mode démo
      setTimeout(() => {
        info(
          "Mode Démonstration",
          "Vous êtes en mode démo. Toutes les modifications sont temporaires et ne seront pas sauvegardées."
        );
        setDemoNotificationShown(true);
      }, 1000);
    }
  }, [isDemoMode, demoNotificationShown, info]);

  return (
    <>
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'reports') {
            setShowReportsModal(true);
          } else if (view === 'statistics') {
            setShowStatisticsModal(true);
          } else if (view === 'user-management') {
            setShowUserManagementModal(true);
          } else {
            setCurrentView(view);
          }
        }}
        stats={stats}
        currentUser={unifiedUser}
        currentInstitution={unifiedInstitution}
        onLogout={onLogout}
      />
      <main className="main-content">
        <div className="content-wrapper">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span>Chargement...</span>
            </div>
          )}
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}
          {renderCurrentView()}
        </div>
      </main>

      {/* Beautiful Borrow Modal */}
      {showBorrowModal && selectedDocumentForBorrow && (
        <BorrowDocument
          document={selectedDocumentForBorrow}
          borrowers={borrowers}
          onBorrow={handleBorrow}
          onReturn={handleReturn}
          onCancel={closeBorrowModal}
          onAddBorrower={handleAddBorrower}
        />
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <ReportsManager
          documents={documents}
          borrowers={borrowers}
          borrowHistory={borrowedDocuments}
          onClose={() => setShowReportsModal(false)}
        />
      )}

      {/* Statistics Modal */}
      {showStatisticsModal && (
        <StatisticsManager
          documents={documents}
          borrowers={borrowers}
          borrowHistory={borrowedDocuments}
          onClose={() => setShowStatisticsModal(false)}
        />
      )}

      {/* Dialogue pour les données orphelines */}
      {showOrphanDataDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#FAF9F6',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: '#3E5C49',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Données existantes détectées
            </h3>
            
            <p style={{ 
              color: '#6E6E6E', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Nous avons détecté des données qui ne sont pas encore assignées à votre établissement :
            </p>
            
            <div style={{
              backgroundColor: '#F5F5F5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {orphanDataCount.documents > 0 && (
                <div style={{ marginBottom: '8px', color: '#3E5C49' }}>
                  📚 {orphanDataCount.documents} document(s)
                </div>
              )}
              {orphanDataCount.authors > 0 && (
                <div style={{ marginBottom: '8px', color: '#3E5C49' }}>
                  👤 {orphanDataCount.authors} auteur(s)
                </div>
              )}
              {orphanDataCount.categories > 0 && (
                <div style={{ marginBottom: '8px', color: '#3E5C49' }}>
                  🏷️ {orphanDataCount.categories} catégorie(s)
                </div>
              )}
              {orphanDataCount.borrowers > 0 && (
                <div style={{ marginBottom: '8px', color: '#3E5C49' }}>
                  👥 {orphanDataCount.borrowers} emprunteur(s)
                </div>
              )}
              {orphanDataCount.borrowHistory > 0 && (
                <div style={{ color: '#3E5C49' }}>
                  📊 {orphanDataCount.borrowHistory} historique(s) d'emprunt
                </div>
              )}
            </div>
            
            <p style={{ 
              color: '#6E6E6E', 
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              Voulez-vous assigner ces données à votre établissement "<strong>{currentInstitution?.name}</strong>" ?
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowOrphanDataDialog(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#E5DCC2',
                  color: '#6E6E6E',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Plus tard
              </button>
              
              <button
                onClick={handleAssignOrphanData}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isLoading ? '#C2571B80' : '#C2571B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {isLoading ? 'Assignation...' : 'Assigner maintenant'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FAF9F6;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .app-container {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .auth-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: visible;
          overflow-x: hidden;
          background: #FAF9F6;
          height: 100%;
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
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 12px 0 0 0;
          background: #FAF9F6;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
          max-height: 100vh;
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
      `}</style>
    </>
  );
};

