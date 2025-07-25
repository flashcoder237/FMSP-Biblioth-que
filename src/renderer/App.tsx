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
import { Donation } from './components/Donation';
import { About } from './components/About';
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
import { BackupManager } from './components/BackupManager';
import { ToastProvider, useQuickToast } from './components/ToastSystem';
import { KeyboardShortcutsProvider } from './components/KeyboardShortcuts';
import { UnifiedUser, UnifiedInstitution, convertToUnifiedUser, convertToUnifiedInstitution } from './types/UnifiedTypes';

type ViewType = 'initial_setup' | 'dashboard' | 'documents' | 'borrowed' | 'add-document' | 'borrowers' | 'history' | 'settings' | 'app-settings' | 'user-profile' | 'backup-manager' | 'donation' | 'about' | 'auth' | 'institution_setup';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
        // Mode offline - charger les données depuis SQLite via electronAPI
        const [
          documentsData, 
          authorsData, 
          categoriesData, 
          borrowersData,
          borrowedDocumentsData,
          recentActivityData
        ] = await Promise.all([
          window.electronAPI.getDocuments(),
          window.electronAPI.getAuthors(),
          window.electronAPI.getCategories(),
          window.electronAPI.getBorrowers(),
          window.electronAPI.getBorrowHistory(),
          window.electronAPI.getRecentActivity(5)
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
        // Mode online - utiliser Supabase
        const [
          documentsData, 
          authorsData, 
          categoriesData, 
          borrowersData,
          borrowedDocumentsData,
          statsData
        ] = await Promise.all([
          supabaseService.getDocuments(),
          supabaseService.getAuthors(),
          supabaseService.getCategories(),
          supabaseService.getBorrowers(),
          supabaseService.getBorrowedDocuments(),
          supabaseService.getStats()
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
      
      // Données de démonstration
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
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "Robert C. Martin",
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "Gang of Four",
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
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "Programmation",
          syncStatus: 'synced',
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "Architecture logicielle",
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
          const authResult = LocalAuthService.authenticate(
            credentials.email,
            credentials.password,
            credentials.institutionCode || ''
          );
          
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
            const institution = LocalAuthService.findInstitutionByCode(localUser.institutionCode);
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
        // Mode offline - utiliser l'API électron pour SQLite
        if (editingDocument) {
          // Modification d'un document existant
          const documentToUpdate = { ...document, id: editingDocument.id } as Document;
          await window.electronAPI.updateDocument(documentToUpdate);
          console.log('Document modifié en mode offline:', editingDocument.id);
        } else {
          // Ajout d'un nouveau document
          const documentId = await window.electronAPI.addDocument(document);
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
          });
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
          });
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
        // Mode online - utiliser Supabase
        await supabaseService.addDocument(document);
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
        // Mode offline - utiliser l'API électron pour SQLite
        await window.electronAPI.returnBook(borrowHistoryId, notes);
        console.log('Document retourné en mode offline:', borrowHistoryId);
      } else {
        // Mode online - utiliser Supabase
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
        // Mode offline - utiliser l'API électron pour SQLite
        await window.electronAPI.deleteDocument(documentId);
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
        // Mode online - utiliser Supabase
        await supabaseService.deleteDocument(documentId.toString());
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
        // Mode offline - utiliser l'API électron pour SQLite
        await window.electronAPI.borrowDocument(documentId, borrowerId, returnDate);
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
        // Mode online - utiliser Supabase
        await supabaseService.borrowDocument({
          documentId: documentId.toString(),
          borrowerId: borrowerId.toString(),
          expectedReturnDate: returnDate
        });
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
          await window.electronAPI.returnBook(activeBorrow.id);
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
        // Mode offline - utiliser l'API électron pour SQLite
        const newId = await window.electronAPI.addBorrower(borrower);
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
        // Mode online - utiliser Supabase
        const newId = await supabaseService.addBorrower(borrower);
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

  // Gérer l'affichage avec TitleBar toujours visible
  const renderAuthenticatedContent = () => {
    // Écran de configuration initiale
    if (currentView === 'initial_setup') {
      return <InitialSetup onComplete={handleInitialSetup} />;
    }

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
        return (
          <BorrowedDocuments
            documents={borrowedDocuments
              .filter(bh => bh.status === 'active') // Seulement les emprunts actifs
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
      case 'donation':
        return (
          <Donation onClose={() => setCurrentView('dashboard')} />
        );
      case 'about':
        return (
          <About onClose={() => setCurrentView('dashboard')} />
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
                stats={stats}
                currentUser={currentUser}
                currentInstitution={currentInstitution}
                unifiedUser={unifiedUser}
                unifiedInstitution={unifiedInstitution}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
            ) : (
              <div className="auth-container">
                {renderAuthenticatedContent()}
              </div>
            )}
          </div>
        </div>
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
  stats: Stats;
  currentUser: User | null;
  currentInstitution: Institution | null;
  unifiedUser: UnifiedUser | null;
  unifiedInstitution: UnifiedInstitution | null;
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
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
  stats,
  currentUser,
  currentInstitution,
  unifiedUser,
  unifiedInstitution,
  isAuthenticated,
  onLogout
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
        onNavigate={setCurrentView}
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
      
      <style>{`
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
      `}</style>
    </>
  );
};

