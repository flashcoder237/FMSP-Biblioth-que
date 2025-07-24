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
          borrowedDocumentsData
        ] = await Promise.all([
          window.electronAPI.getDocuments(),
          window.electronAPI.getAuthors(),
          window.electronAPI.getCategories(),
          window.electronAPI.getBorrowers(),
          window.electronAPI.getBorrowHistory()
        ]);

        setDocuments(documentsData || []);
        setAuthors(authorsData || []);
        setCategories(categoriesData || []);
        setBorrowers(borrowersData || []);
        setBorrowedDocuments(borrowedDocumentsData || []);
        
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
                refreshData={refreshData}
                supabaseService={supabaseService}
                borrowers={borrowers}
                stats={stats}
                currentUser={currentUser}
                currentInstitution={currentInstitution}
                unifiedUser={unifiedUser}
                unifiedInstitution={unifiedInstitution}
                isAuthenticated={isAuthenticated}
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
  refreshData: () => Promise<void>;
  supabaseService: SupabaseRendererService;
  borrowers: Borrower[];
  stats: Stats;
  currentUser: User | null;
  currentInstitution: Institution | null;
  unifiedUser: UnifiedUser | null;
  unifiedInstitution: UnifiedInstitution | null;
  isAuthenticated: boolean;
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
  refreshData,
  supabaseService,
  borrowers,
  stats,
  currentUser,
  currentInstitution,
  unifiedUser,
  unifiedInstitution,
  isAuthenticated
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

// Enhanced Borrow Form Component avec Supabase
interface EnhancedBorrowFormProps {
  document: Document;
  borrowers: Borrower[];
  onSubmit: (documentId: number, borrowerId: number, expectedReturnDate: string) => Promise<void>;
  onCancel: () => void;
  onRefreshBorrowers: () => Promise<void>;
  supabaseService: SupabaseRendererService;
}

const EnhancedBorrowForm: React.FC<EnhancedBorrowFormProps> = ({ 
  document, 
  borrowers, 
  onSubmit, 
  onCancel, 
  onRefreshBorrowers,
  supabaseService 
}) => {
  const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [borrowDuration, setBorrowDuration] = useState<'1week' | '2weeks' | '1month' | 'custom'>('2weeks');
  const [showAddBorrower, setShowAddBorrower] = useState(false);

  const [newBorrowerData, setNewBorrowerData] = useState<{
    type: 'student' | 'staff';
    firstName: string;
    lastName: string;
    matricule: string;
    classe: string;
    cniNumber: string;
    position: string;
    email: string;
    phone: string;
  }>({
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
  React.useEffect(() => {
    updateDateFromDuration(borrowDuration);
  }, [borrowDuration]);

  const updateDateFromDuration = (duration: string) => {
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
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'ajout de l\'emprunteur');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    // Filter by type
    if (filterType !== 'all' && borrower.type !== filterType) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        borrower.firstName.toLowerCase().includes(query) ||
        borrower.lastName.toLowerCase().includes(query) ||
        borrower.matricule.toLowerCase().includes(query) ||
        (borrower.classe && borrower.classe.toLowerCase().includes(query)) ||
        (borrower.position && borrower.position.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrower || !expectedReturnDate) return;

    setIsLoading(true);
    try {
      await onSubmit(document.id!, selectedBorrower, expectedReturnDate);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBorrowerData = borrowers.find(b => b.id === selectedBorrower);

  return (
    <div className="enhanced-borrow-form">
      {/* Document Info Enhanced */}
      <div className="document-info-section">
        <div className="document-cover">
          {document.couverture ? (
            <img src={document.couverture} alt={document.titre} />
          ) : (
            <div className="document-placeholder">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="document-details">
          <h4 className="document-title">"{document.titre}"</h4>
          <p className="document-author">par {document.auteur}</p>
          <div className="document-meta">
            <span className="document-category">{document.descripteurs}</span>
            {document.annee && <span className="document-year">{document.annee}</span>}
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
          ].map((duration) => (
            <button
              key={duration.id}
              type="button"
              className={`duration-button ${borrowDuration === duration.id ? 'selected' : ''} ${duration.recommended ? 'recommended' : ''}`}
              onClick={() => setBorrowDuration(duration.id as any)}
            >
              {duration.label}
              {duration.recommended && <span className="recommended-badge">Recommandé</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Return Date */}
      <div className="form-section">
        <label className="form-label">Date de retour prévue *</label>
        <input
          type="date"
          value={expectedReturnDate}
          onChange={(e) => {
            setExpectedReturnDate(e.target.value);
            setBorrowDuration('custom');
          }}
          className="date-input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <small className="form-hint">
          {borrowDuration !== 'custom' && `Durée sélectionnée : ${
            borrowDuration === '1week' ? '7 jours' : 
            borrowDuration === '2weeks' ? '14 jours' : '1 mois'
          }`}
        </small>
      </div>

      {/* Enhanced Borrower Selection */}
      <div className="form-section">
        <div className="section-header">
          <label className="form-label">Emprunteur *</label>
          <button
            type="button"
            className="add-borrower-button"
            onClick={() => setShowAddBorrower(true)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Ajouter emprunteur
          </button>
        </div>
        
        {/* Filters */}
        <div className="borrower-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un emprunteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
            </svg>
          </div>
          
          <div className="type-filter">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="filter-select"
            >
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
            {filteredBorrowers.length > 0 ? (
              filteredBorrowers.map((borrower) => (
                <div
                  key={borrower.id}
                  className={`borrower-row ${selectedBorrower === borrower.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBorrower(borrower.id!)}
                >
                  <div className="borrower-name">
                    <div className="name-main">{borrower.firstName} {borrower.lastName}</div>
                    <div className="name-sub">{borrower.email}</div>
                  </div>
                  <div className="borrower-type">
                    <span className={`type-badge ${borrower.type}`}>
                      {borrower.type === 'student' ? 'Étudiant' : 'Personnel'}
                    </span>
                  </div>
                  <div className="borrower-matricule">{borrower.matricule}</div>
                  <div className="borrower-extra">
                    {borrower.type === 'student' ? borrower.classe : borrower.position}
                  </div>
                  <div className="selection-indicator">
                    {selectedBorrower === borrower.id && (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-borrowers">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
                </svg>
                <p>Aucun emprunteur trouvé</p>
                <small>{searchQuery ? `pour "${searchQuery}"` : 'Essayez de modifier les filtres'}</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Borrower Summary Enhanced */}
      {selectedBorrowerData && (
        <div className="selected-summary">
          <h4>Récapitulatif de l'emprunt</h4>
          <div className="summary-card">
            <div className="summary-section">
              <div className="summary-icon book-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Document</div>
                <div className="summary-value">{document.titre}</div>
                <div className="summary-sub">par {document.auteur}</div>
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
        </div>
      )}

      {/* Form Actions Enhanced */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!selectedBorrower || !expectedReturnDate || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Traitement...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.58L9 16.17Z"/>
              </svg>
              Confirmer l'emprunt
            </>
          )}
        </button>
      </div>

      {/* Add Borrower Modal */}
      {showAddBorrower && (
        <div className="add-borrower-overlay" onClick={() => setShowAddBorrower(false)}>
          <div className="add-borrower-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-borrower-header">
              <h3>Ajouter un emprunteur</h3>
              <button
                className="modal-close-small"
                onClick={() => setShowAddBorrower(false)}
              >
                ×
              </button>
            </div>
            
            <div className="add-borrower-content">
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-button ${newBorrowerData.type === 'student' ? 'active' : ''}`}
                  onClick={() => setNewBorrowerData(prev => ({ ...prev, type: 'student' }))}
                >
                  🎓 Étudiant
                </button>
                <button
                  type="button"
                  className={`type-button ${newBorrowerData.type === 'staff' ? 'active' : ''}`}
                  onClick={() => setNewBorrowerData(prev => ({ ...prev, type: 'staff' }))}
                >
                  👔 Personnel
                </button>
              </div>

              <div className="form-grid-compact">
                <div className="form-group-compact">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.firstName}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                <div className="form-group-compact">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.lastName}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                <div className="form-group-compact">
                  <label>Matricule *</label>
                  <input
                    type="text"
                    value={newBorrowerData.matricule}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, matricule: e.target.value }))}
                    className="form-input-compact"
                    required
                  />
                </div>
                
                {newBorrowerData.type === 'student' ? (
                  <div className="form-group-compact">
                    <label>Classe</label>
                    <input
                      type="text"
                      value={newBorrowerData.classe}
                      onChange={(e) => setNewBorrowerData(prev => ({ ...prev, classe: e.target.value }))}
                      className="form-input-compact"
                      placeholder="ex: Terminale C"
                    />
                  </div>
                ) : (
                  <div className="form-group-compact">
                    <label>Poste</label>
                    <input
                      type="text"
                      value={newBorrowerData.position}
                      onChange={(e) => setNewBorrowerData(prev => ({ ...prev, position: e.target.value }))}
                      className="form-input-compact"
                      placeholder="ex: Professeur"
                    />
                  </div>
                )}
                
                <div className="form-group-compact span-full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newBorrowerData.email}
                    onChange={(e) => setNewBorrowerData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input-compact"
                  />
                </div>
              </div>
            </div>
            
            <div className="add-borrower-actions">
              <button
                type="button"
                className="btn-secondary-small"
                onClick={() => setShowAddBorrower(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-primary-small"
                onClick={handleAddBorrower}
                disabled={!newBorrowerData.firstName || !newBorrowerData.lastName || !newBorrowerData.matricule || isLoading}
              >
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles pour le formulaire d'emprunt */}
      <style>{`
        /* Tous les styles CSS du formulaire d'emprunt ici */
        /* Le CSS est identique à celui du fichier précédent */
        /* ... (insérer ici tous les styles CSS de EnhancedBorrowForm) */
      `}</style>
    </div>
  );
};