import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { SupabaseService } from './SupabaseService';
import { DatabaseService } from './DatabaseService';
import { 
  SyncStatus, 
  SyncError, 
  SyncOperation, 
  NetworkStatus, 
  ConflictResolution,
  Document,
  Author,
  Category,
  Borrower,
  BorrowHistory
} from '../preload';

export class SyncService {
  private supabaseService: SupabaseService;
  private databaseService: DatabaseService;
  private syncStatus: SyncStatus;
  private networkStatus: NetworkStatus;
  private syncQueue: SyncOperation[] = [];
  private isInitialized = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private networkCheckInterval: NodeJS.Timeout | null = null;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
    this.supabaseService = new SupabaseService();
    
    this.syncStatus = {
      isOnline: false,
      lastSync: null,
      pendingOperations: 0,
      syncInProgress: false,
      errors: []
    };

    this.networkStatus = {
      isOnline: false,
      connectionType: 'none',
      lastChecked: new Date().toISOString()
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Charger les opérations en attente depuis la base de données
    await this.loadPendingOperations();
    
    // Démarrer la surveillance réseau
    this.startNetworkMonitoring();
    
    // Démarrer la synchronisation automatique
    this.startAutoSync();
    
    this.isInitialized = true;
    console.log('SyncService initialisé');
  }

  private async loadPendingOperations(): Promise<void> {
    try {
      // Charger les opérations depuis une table sync_queue dans la base
      const operations = await this.databaseService.getSyncQueue();
      this.syncQueue = operations;
      this.syncStatus.pendingOperations = operations.length;
    } catch (error) {
      console.error('Erreur lors du chargement des opérations en attente:', error);
    }
  }

  private startNetworkMonitoring(): void {
    // Vérifier la connectivité toutes les 30 secondes
    this.networkCheckInterval = setInterval(async () => {
      await this.checkNetworkStatus();
    }, 30000);

    // Vérification initiale
    this.checkNetworkStatus();
  }

  private async checkNetworkStatus(): Promise<void> {
    try {
      // Test de connectivité vers Supabase
      const isOnline = await this.testConnectivity();
      const wasOnline = this.networkStatus.isOnline;
      
      this.networkStatus = {
        isOnline,
        connectionType: isOnline ? 'wifi' : 'none', // Simplification
        lastChecked: new Date().toISOString()
      };

      this.syncStatus.isOnline = isOnline;

      // Si on vient de se reconnecter, démarrer la sync
      if (isOnline && !wasOnline && this.syncQueue.length > 0) {
        console.log('Connexion rétablie, démarrage de la synchronisation...');
        await this.processSyncQueue();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification réseau:', error);
      this.networkStatus.isOnline = false;
      this.syncStatus.isOnline = false;
    }
  }

  private async testConnectivity(): Promise<boolean> {
    try {
      // Test simple de ping vers Supabase
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://google.com', {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  private startAutoSync(): void {
    // Synchronisation automatique toutes les 5 minutes si en ligne
    this.syncInterval = setInterval(async () => {
      if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
        await this.processSyncQueue();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  async addOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const syncOp: SyncOperation = {
      ...operation,
      id: this.generateOperationId(),
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    this.syncQueue.push(syncOp);
    this.syncStatus.pendingOperations = this.syncQueue.length;

    // Sauvegarder dans la base
    await this.databaseService.addSyncOperation(syncOp);

    // Si en ligne, essayer de synchroniser immédiatement
    if (this.networkStatus.isOnline && !this.syncStatus.syncInProgress) {
      await this.processSyncQueue();
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.networkStatus.isOnline) {
      return;
    }

    this.syncStatus.syncInProgress = true;
    console.log(`Démarrage de la synchronisation: ${this.syncQueue.length} opérations en attente`);

    const processedOperations: string[] = [];
    const failedOperations: SyncOperation[] = [];

    for (const operation of this.syncQueue) {
      try {
        const success = await this.processOperation(operation);
        if (success) {
          processedOperations.push(operation.id);
          // Supprimer de la base
          await this.databaseService.removeSyncOperation(operation.id);
        } else {
          operation.retryCount++;
          if (operation.retryCount >= operation.maxRetries) {
            // Ajouter à la liste des erreurs
            this.addSyncError(operation, 'Nombre maximum de tentatives atteint');
            processedOperations.push(operation.id);
            await this.databaseService.removeSyncOperation(operation.id);
          } else {
            failedOperations.push(operation);
            await this.databaseService.updateSyncOperation(operation);
          }
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de l'opération ${operation.id}:`, error);
        operation.retryCount++;
        failedOperations.push(operation);
        this.addSyncError(operation, error instanceof Error ? error.message : String(error));
        await this.databaseService.updateSyncOperation(operation);
      }
    }

    // Mettre à jour la queue
    this.syncQueue = this.syncQueue.filter(op => !processedOperations.includes(op.id));
    this.syncStatus.pendingOperations = this.syncQueue.length;
    this.syncStatus.lastSync = new Date().toISOString();
    this.syncStatus.syncInProgress = false;

    console.log(`Synchronisation terminée. Réussies: ${processedOperations.length}, Échouées: ${failedOperations.length}`);
  }

  private async processOperation(operation: SyncOperation): Promise<boolean> {
    try {
      switch (operation.type) {
        case 'document':
          return await this.syncDocument(operation);
        case 'author':
          return await this.syncAuthor(operation);
        case 'category':
          return await this.syncCategory(operation);
        case 'borrower':
          return await this.syncBorrower(operation);
        case 'history':
          return await this.syncBorrowHistory(operation);
        default:
          console.error(`Type d'opération inconnu: ${operation.type}`);
          return false;
      }
    } catch (error) {
      console.error(`Erreur lors de la synchronisation de ${operation.type}:`, error);
      return false;
    }
  }

  private async syncDocument(operation: SyncOperation): Promise<boolean> {
    const { operation: op, data } = operation;
    
    switch (op) {
      case 'create':
        const createdDoc = await this.supabaseService.createDocument(data);
        if (createdDoc) {
          // Mettre à jour l'ID distant local
          await this.databaseService.updateDocumentRemoteId(data.localId, createdDoc.id?.toString() || '');
          return true;
        }
        return false;
        
      case 'update':
        return await this.supabaseService.updateDocument(data);
        
      case 'delete':
        return await this.supabaseService.deleteDocument(data.remoteId);
        
      default:
        return false;
    }
  }

  private async syncAuthor(operation: SyncOperation): Promise<boolean> {
    // Implémentation similaire pour les auteurs
    const { operation: op, data } = operation;
    
    switch (op) {
      case 'create':
        const createdAuthor = await this.supabaseService.createAuthor(data);
        if (createdAuthor) {
          await this.databaseService.updateAuthorRemoteId(data.localId, createdAuthor.id?.toString() || '');
          return true;
        }
        return false;
        
      case 'update':
        return await this.supabaseService.updateAuthor(data);
        
      case 'delete':
        return await this.supabaseService.deleteAuthor(data.remoteId);
        
      default:
        return false;
    }
  }

  private async syncCategory(operation: SyncOperation): Promise<boolean> {
    // Implémentation similaire pour les catégories
    const { operation: op, data } = operation;
    
    switch (op) {
      case 'create':
        const createdCategory = await this.supabaseService.createCategory(data);
        if (createdCategory) {
          await this.databaseService.updateCategoryRemoteId(data.localId, createdCategory.id?.toString() || '');
          return true;
        }
        return false;
        
      case 'update':
        return await this.supabaseService.updateCategory(data);
        
      case 'delete':
        return await this.supabaseService.deleteCategory(data.remoteId);
        
      default:
        return false;
    }
  }

  private async syncBorrower(operation: SyncOperation): Promise<boolean> {
    // Implémentation similaire pour les emprunteurs
    const { operation: op, data } = operation;
    
    switch (op) {
      case 'create':
        const createdBorrower = await this.supabaseService.createBorrower(data);
        if (createdBorrower) {
          await this.databaseService.updateBorrowerRemoteId(data.localId, createdBorrower.id?.toString() || '');
          return true;
        }
        return false;
        
      case 'update':
        return await this.supabaseService.updateBorrower(data);
        
      case 'delete':
        return await this.supabaseService.deleteBorrower(data.remoteId);
        
      default:
        return false;
    }
  }

  private async syncBorrowHistory(operation: SyncOperation): Promise<boolean> {
    // Implémentation similaire pour l'historique
    const { operation: op, data } = operation;
    
    switch (op) {
      case 'create':
        const createdHistory = await this.supabaseService.createBorrowHistory(data);
        if (createdHistory) {
          await this.databaseService.updateBorrowHistoryRemoteId(data.localId, createdHistory.id?.toString() || '');
          return true;
        }
        return false;
        
      case 'update':
        return await this.supabaseService.updateBorrowHistory(data);
        
      case 'delete':
        return await this.supabaseService.deleteBorrowHistory(data.remoteId);
        
      default:
        return false;
    }
  }

  private addSyncError(operation: SyncOperation, errorMessage: string): void {
    const error: SyncError = {
      id: this.generateOperationId(),
      type: operation.type,
      operation: operation.operation,
      entityId: operation.data.localId || operation.data.id,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      retryCount: operation.retryCount
    };

    this.syncStatus.errors.push(error);
    
    // Limiter le nombre d'erreurs stockées
    if (this.syncStatus.errors.length > 100) {
      this.syncStatus.errors = this.syncStatus.errors.slice(-100);
    }
  }

  private generateOperationId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Méthodes publiques pour l'API
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  async startManualSync(): Promise<void> {
    if (this.networkStatus.isOnline) {
      await this.processSyncQueue();
    } else {
      throw new Error('Aucune connexion réseau disponible');
    }
  }

  pauseSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  resumeSync(): void {
    if (!this.syncInterval) {
      this.startAutoSync();
    }
  }

  async retrySyncOperation(operationId: string): Promise<boolean> {
    const operation = this.syncQueue.find(op => op.id === operationId);
    if (!operation) return false;

    operation.retryCount = 0; // Reset retry count
    if (this.networkStatus.isOnline) {
      const success = await this.processOperation(operation);
      if (success) {
        this.syncQueue = this.syncQueue.filter(op => op.id !== operationId);
        this.syncStatus.pendingOperations = this.syncQueue.length;
        await this.databaseService.removeSyncOperation(operationId);
      }
      return success;
    }
    return false;
  }

  getSyncErrors(): SyncError[] {
    return [...this.syncStatus.errors];
  }

  clearSyncErrors(): void {
    this.syncStatus.errors = [];
  }

  async resolveConflict(resolution: ConflictResolution): Promise<boolean> {
    try {
      // Implémentation de la résolution de conflits
      // Cette méthode sera appelée quand l'utilisateur choisit comment résoudre un conflit
      
      switch (resolution.resolution) {
        case 'use_local':
          // Utiliser la version locale et forcer la sync
          return await this.forceUpdateRemote(resolution);
          
        case 'use_remote':
          // Utiliser la version distante et mettre à jour local
          return await this.forceUpdateLocal(resolution);
          
        case 'merge':
          // Fusionner les données (logique spécifique selon le type)
          return await this.mergeVersions(resolution);
          
        case 'manual':
          // L'utilisateur a fourni une version résolue manuellement
          return await this.applyManualResolution(resolution);
          
        default:
          return false;
      }
    } catch (error) {
      console.error('Erreur lors de la résolution de conflit:', error);
      return false;
    }
  }

  private async forceUpdateRemote(resolution: ConflictResolution): Promise<boolean> {
    // Implémenter la mise à jour forcée du distant
    return true;
  }

  private async forceUpdateLocal(resolution: ConflictResolution): Promise<boolean> {
    // Implémenter la mise à jour forcée du local
    return true;
  }

  private async mergeVersions(resolution: ConflictResolution): Promise<boolean> {
    // Implémenter la fusion automatique
    return true;
  }

  private async applyManualResolution(resolution: ConflictResolution): Promise<boolean> {
    // Appliquer la résolution manuelle fournie par l'utilisateur
    return true;
  }

  async shutdown(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.networkCheckInterval) {
      clearInterval(this.networkCheckInterval);
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    console.log('SyncService arrêté');
  }
}