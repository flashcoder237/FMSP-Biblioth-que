import React, { useState, useEffect } from 'react';
import { SyncStatus, NetworkStatus, SyncError } from '../../types';
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  RefreshCw,
  Settings,
  X,
  AlertTriangle
} from 'lucide-react';

interface SyncStatusBarProps {
  syncStatus: SyncStatus;
  networkStatus: NetworkStatus;
  onManualSync: () => void;
  onRetrySync: (operationId: string) => void;
  onClearErrors: () => void;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({
  syncStatus,
  networkStatus,
  onManualSync,
  onRetrySync,
  onClearErrors
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  // Vérifier si on est en mode offline
  const isOfflineMode = !networkStatus.isOnline || networkStatus.connectionType === 'none';

  useEffect(() => {
    const updateTime = () => {
      if (syncStatus.lastSync) {
        const now = new Date();
        const lastSync = new Date(syncStatus.lastSync);
        const diffMs = now.getTime() - lastSync.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) {
          setLastUpdateTime('À l\'instant');
        } else if (diffMins < 60) {
          setLastUpdateTime(`Il y a ${diffMins} min`);
        } else {
          const diffHours = Math.floor(diffMins / 60);
          setLastUpdateTime(`Il y a ${diffHours}h${diffMins % 60}min`);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Mettre à jour toutes les 30s

    return () => clearInterval(interval);
  }, [syncStatus.lastSync]);

  const getConnectionStatusDisplay = () => {
    if (isOfflineMode) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <CloudOff className="w-4 h-4" />
          <span className="text-sm font-medium">Mode Hors Ligne</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Local</span>
        </div>
      );
    }

    if (syncStatus.syncInProgress) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Synchronisation...</span>
        </div>
      );
    }

    if (syncStatus.errors.length > 0) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Erreurs de sync</span>
        </div>
      );
    }

    if (syncStatus.pendingOperations > 0) {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {syncStatus.pendingOperations} en attente
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Synchronisé</span>
      </div>
    );
  };

  const getSyncButtonState = () => {
    if (isOfflineMode) {
      return {
        disabled: true,
        text: 'Mode Local',
        className: 'bg-blue-100 text-blue-700 cursor-not-allowed'
      };
    }

    if (syncStatus.syncInProgress) {
      return {
        disabled: true,
        text: 'Sync...',
        className: 'bg-blue-500 text-white cursor-not-allowed'
      };
    }

    return {
      disabled: false,
      text: 'Synchroniser',
      className: 'bg-blue-500 text-white hover:bg-blue-600'
    };
  };

  const buttonState = getSyncButtonState();

  return (
    <>
      {/* Barre de statut principale */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Statut de connexion */}
            {getConnectionStatusDisplay()}
            
            {/* Dernière synchronisation ou info locale */}
            {isOfflineMode ? (
              <div className="text-sm text-blue-600">
                Données sauvegardées localement
              </div>
            ) : syncStatus.lastSync && (
              <div className="text-sm text-gray-500">
                Dernière sync: {lastUpdateTime}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Indicateur d'erreurs */}
            {syncStatus.errors.length > 0 && (
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                {syncStatus.errors.length} erreur{syncStatus.errors.length > 1 ? 's' : ''}
              </button>
            )}

            {/* Bouton de synchronisation manuelle */}
            <button
              onClick={onManualSync}
              disabled={buttonState.disabled}
              className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${buttonState.className}`}
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
              {buttonState.text}
            </button>

            {/* Bouton détails */}
            <button
              onClick={() => setShowDetails(true)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded"
              title="Voir les détails"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal des détails */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Statut de synchronisation
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Statut général */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Statut général</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connexion réseau:</span>
                    <span className={networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
                      {networkStatus.isOnline ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type de connexion:</span>
                    <span className="text-gray-800">{networkStatus.connectionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Synchronisation en cours:</span>
                    <span className={syncStatus.syncInProgress ? 'text-blue-600' : 'text-gray-600'}>
                      {syncStatus.syncInProgress ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opérations en attente:</span>
                    <span className="text-orange-600 font-medium">
                      {syncStatus.pendingOperations}
                    </span>
                  </div>
                  {syncStatus.lastSync && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière synchronisation:</span>
                      <span className="text-gray-800">
                        {new Date(syncStatus.lastSync).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Erreurs de synchronisation */}
              {syncStatus.errors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Erreurs de synchronisation ({syncStatus.errors.length})
                    </h4>
                    <button
                      onClick={onClearErrors}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Effacer toutes
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {syncStatus.errors.map((error) => (
                      <div key={error.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-800">
                                {error.type} - {error.operation}
                              </span>
                            </div>
                            <p className="text-sm text-red-700 mb-2">{error.error}</p>
                            <div className="text-xs text-red-600">
                              Tentatives: {error.retryCount} • {new Date(error.timestamp).toLocaleString('fr-FR')}
                            </div>
                          </div>
                          <button
                            onClick={() => onRetrySync(error.entityId)}
                            className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Réessayer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations sur la connectivité */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Connectivité</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {networkStatus.isOnline ? (
                      <Cloud className="w-8 h-8 text-green-500" />
                    ) : (
                      <CloudOff className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium text-gray-800">
                        {networkStatus.isOnline ? 'Connecté au cloud' : 'Mode hors ligne'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {networkStatus.isOnline 
                          ? 'Toutes les données sont synchronisées automatiquement'
                          : 'Les modifications sont sauvegardées localement en attente de connexion'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {!networkStatus.isOnline && syncStatus.pendingOperations > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-3">
                      <div className="flex items-center gap-2 text-orange-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {syncStatus.pendingOperations} modification{syncStatus.pendingOperations > 1 ? 's' : ''} en attente
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Ces modifications seront synchronisées automatiquement dès la reconnexion.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};