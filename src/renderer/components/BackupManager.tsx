import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Database,
  HardDrive,
  RotateCcw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Folder,
  X,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Calendar,
  Info
} from 'lucide-react';
import { MicroButton, MicroCard } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';

interface BackupInfo {
  filePath: string;
  fileName: string;
  size: number;
  createdAt: string;
  metadata: {
    version: string;
    timestamp: string;
    appVersion: string;
    platform: string;
    stats: {
      totalDocuments: number;
      totalBorrowers: number;
      totalAuthors: number;
      totalCategories: number;
      totalBorrowHistory: number;
    };
    checksum: string;
  };
}

interface BackupStats {
  totalBackups: number;
  totalSize: number;
  formattedSize: string;
  oldestBackup: BackupInfo | null;
  newestBackup: BackupInfo | null;
}

interface BackupManagerProps {
  onClose: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ onClose }) => {
  const { success, error, info, warning } = useQuickToast();
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupInfo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createBackupName, setCreateBackupName] = useState('');
  const [createBackupDescription, setCreateBackupDescription] = useState('');

  // Charger les données initiales
  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    setIsLoading(true);
    try {
      const [backupResult, statsResult] = await Promise.all([
        window.electronAPI.getBackupList(),
        window.electronAPI.getBackupStats()
      ]);

      if (backupResult.success) {
        setBackups(backupResult.backups);
      } else {
        error('Erreur', 'Impossible de charger la liste des sauvegardes');
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (err) {
      error('Erreur', 'Erreur lors du chargement des données de sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!createBackupName.trim()) {
      warning('Attention', 'Veuillez saisir un nom pour la sauvegarde');
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.createBackup(
        createBackupName.trim(),
        createBackupDescription.trim() || undefined
      );

      if (result.success) {
        success('Succès', 'Sauvegarde créée avec succès');
        setShowCreateModal(false);
        setCreateBackupName('');
        setCreateBackupDescription('');
        await loadBackupData();
      } else {
        error('Erreur', result.error || 'Échec de la création de la sauvegarde');
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de la création de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (backup: BackupInfo) => {
    const confirmRestore = window.confirm(
      `Êtes-vous sûr de vouloir restaurer la sauvegarde "${backup.fileName}" ?\n\n` +
      `Cette action remplacera toutes les données actuelles de l'application.\n` +
      `Une sauvegarde automatique sera créée avant la restauration.`
    );

    if (!confirmRestore) return;

    setIsLoading(true);
    try {
      const result = await window.electronAPI.restoreBackup(backup.filePath);
      
      if (result.success) {
        success('Succès', 'Sauvegarde restaurée avec succès. L\'application va se recharger.');
        // Recharger l'application pour refléter les changements
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        error('Erreur', result.error || 'Échec de la restauration');
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de la restauration de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (backup: BackupInfo) => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la sauvegarde "${backup.fileName}" ?\n\n` +
      `Cette action est irréversible.`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const result = await window.electronAPI.deleteBackup(backup.filePath);
      
      if (result.success) {
        success('Succès', 'Sauvegarde supprimée avec succès');
        await loadBackupData();
      } else {
        error('Erreur', result.error || 'Échec de la suppression');
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de la suppression de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFromFile = async () => {
    try {
      const fileResult = await window.electronAPI.selectBackupFile();
      
      if (!fileResult.success || !fileResult.filePath) {
        if (fileResult.error !== 'Sélection annulée') {
          error('Erreur', fileResult.error || 'Impossible de sélectionner le fichier');
        }
        return;
      }

      // Valider le fichier de sauvegarde
      const validationResult = await window.electronAPI.validateBackup(fileResult.filePath);
      
      if (!validationResult.success || !validationResult.isValid) {
        error('Erreur', 'Le fichier sélectionné n\'est pas une sauvegarde valide');
        return;
      }

      // Confirmer la restauration
      const confirmRestore = window.confirm(
        `Êtes-vous sûr de vouloir restaurer cette sauvegarde ?\n\n` +
        `Cette action remplacera toutes les données actuelles de l'application.\n` +
        `Une sauvegarde automatique sera créée avant la restauration.`
      );

      if (!confirmRestore) return;

      setIsLoading(true);
      const result = await window.electronAPI.restoreBackup(fileResult.filePath);
      
      if (result.success) {
        success('Succès', 'Sauvegarde restaurée avec succès. L\'application va se recharger.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        error('Erreur', result.error || 'Échec de la restauration');
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de la restauration depuis fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDatabase = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.exportDatabase();
      
      if (result.success) {
        success('Succès', `Base de données exportée vers: ${result.path}`);
      } else {
        if (result.error !== 'Export annulé') {
          error('Erreur', result.error || 'Échec de l\'export');
        }
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de l\'export de la base de données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportDatabase = async () => {
    const confirmImport = window.confirm(
      'Êtes-vous sûr de vouloir importer une base de données ?\n\n' +
      'Cette action remplacera la base de données actuelle.\n' +
      'Une sauvegarde automatique sera créée avant l\'import.'
    );

    if (!confirmImport) return;

    setIsLoading(true);
    try {
      const result = await window.electronAPI.importDatabase();
      
      if (result.success) {
        success('Succès', 'Base de données importée avec succès. L\'application va se recharger.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        if (result.error !== 'Import annulé') {
          error('Erreur', result.error || 'Échec de l\'import');
        }
      }
    } catch (err) {
      error('Erreur', 'Erreur lors de l\'import de la base de données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanOldBackups = async () => {
    const keepCount = window.prompt('Combien de sauvegardes récentes souhaitez-vous conserver ?', '10');
    
    if (!keepCount || isNaN(parseInt(keepCount))) return;

    const count = parseInt(keepCount);
    if (count < 1) {
      warning('Attention', 'Le nombre doit être supérieur à 0');
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.cleanOldBackups(count);
      
      if (result.success) {
        success('Succès', `${result.deletedCount} anciennes sauvegardes supprimées`);
        await loadBackupData();
      } else {
        error('Erreur', result.error || 'Échec du nettoyage');
      }
    } catch (err) {
      error('Erreur', 'Erreur lors du nettoyage des sauvegardes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="backup-manager-overlay">
      <div className="backup-manager-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <HardDrive size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Gestionnaire de Sauvegardes</h2>
              <p className="modal-subtitle">Créez et gérez vos sauvegardes de données</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Statistics Section */}
          {stats && (
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Database size={20} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.totalBackups}</div>
                    <div className="stat-label">Sauvegardes</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <HardDrive size={20} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.formattedSize}</div>
                    <div className="stat-label">Espace utilisé</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {stats.newestBackup ? formatDate(stats.newestBackup.createdAt).split(' ')[0] : 'N/A'}
                    </div>
                    <div className="stat-label">Dernière sauvegarde</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="actions-section">
            <div className="actions-grid">
              <MicroButton
                variant="success"
                icon={Plus}
                onClick={() => setShowCreateModal(true)}
                disabled={isLoading}
              >
                Nouvelle Sauvegarde
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                icon={Upload}
                onClick={handleRestoreFromFile}
                disabled={isLoading}
              >
                Restaurer depuis Fichier
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                icon={Download}
                onClick={handleExportDatabase}
                disabled={isLoading}
              >
                Exporter Base de Données
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                icon={Database}
                onClick={handleImportDatabase}
                disabled={isLoading}
              >
                Importer Base de Données
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                icon={RefreshCw}
                onClick={loadBackupData}
                disabled={isLoading}
              >
                Actualiser
              </MicroButton>
              
              <MicroButton
                variant="danger"
                icon={Trash2}
                onClick={handleCleanOldBackups}
                disabled={isLoading}
              >
                Nettoyer Anciennes
              </MicroButton>
            </div>
          </div>

          {/* Backups List */}
          <div className="backups-section">
            <h3 className="section-title">Sauvegardes Disponibles</h3>
            
            {isLoading ? (
              <div className="loading-state">
                <RefreshCw className="loading-spinner" size={24} />
                <p>Chargement des sauvegardes...</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="empty-state">
                <Database size={48} />
                <p>Aucune sauvegarde trouvée</p>
                <small>Créez votre première sauvegarde pour commencer</small>
              </div>
            ) : (
              <div className="backups-list">
                {backups.map((backup, index) => (
                  <div key={backup.filePath} className="backup-card">
                    <div className="backup-header">
                      <div className="backup-icon">
                        <FileText size={20} />
                      </div>
                      <div className="backup-info">
                        <h4 className="backup-name">{backup.fileName}</h4>
                        <p className="backup-date">{formatDate(backup.createdAt)}</p>
                        <p className="backup-size">{formatFileSize(backup.size)}</p>
                      </div>
                      <div className="backup-actions">
                        <MicroButton
                          variant="secondary"
                          size="small"
                          icon={RotateCcw}
                          onClick={() => handleRestoreBackup(backup)}
                          disabled={isLoading}
                        >
                          Restaurer
                        </MicroButton>
                        <MicroButton
                          variant="danger"
                          size="small"
                          icon={Trash2}
                          onClick={() => handleDeleteBackup(backup)}
                          disabled={isLoading}
                        >
                          Supprimer
                        </MicroButton>
                      </div>
                    </div>
                    
                    {backup.metadata && (
                      <div className="backup-metadata">
                        <div className="metadata-grid">
                          <div className="metadata-item">
                            <span className="metadata-label">Documents:</span>
                            <span className="metadata-value">{backup.metadata.stats.totalDocuments}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Emprunteurs:</span>
                            <span className="metadata-value">{backup.metadata.stats.totalBorrowers}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Historique:</span>
                            <span className="metadata-value">{backup.metadata.stats.totalBorrowHistory}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Version:</span>
                            <span className="metadata-value">{backup.metadata.appVersion}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Backup Modal */}
        {showCreateModal && (
          <div className="create-modal-overlay">
            <div className="create-modal">
              <div className="create-modal-header">
                <h3>Créer une Nouvelle Sauvegarde</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="create-modal-content">
                <div className="form-group">
                  <label className="form-label">Nom de la sauvegarde *</label>
                  <input
                    type="text"
                    value={createBackupName}
                    onChange={(e) => setCreateBackupName(e.target.value)}
                    placeholder="Ex: Sauvegarde mensuelle janvier 2024"
                    className="form-input"
                    maxLength={100}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description (optionnel)</label>
                  <textarea
                    value={createBackupDescription}
                    onChange={(e) => setCreateBackupDescription(e.target.value)}
                    placeholder="Description de cette sauvegarde..."
                    className="form-textarea"
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>
              
              <div className="create-modal-footer">
                <MicroButton
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </MicroButton>
                <MicroButton
                  variant="success"
                  onClick={handleCreateBackup}
                  disabled={isLoading || !createBackupName.trim()}
                  icon={isLoading ? RefreshCw : Plus}
                >
                  {isLoading ? 'Création...' : 'Créer Sauvegarde'}
                </MicroButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .backup-manager-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

        .backup-manager-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
          animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header-alt {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: visible; /* Changer de hidden à visible */
          z-index: 10;
          margin-bottom: 20px; /* Ajouter une marge pour éviter le chevauchement */
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%);
          pointer-events: none;
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
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .modal-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 1;
          position: relative;
        }

        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          position: relative;
          z-index: 1; /* Z-index plus bas que le header */
        }

        .stats-section {
          margin-bottom: 32px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(243, 238, 217, 0.1);
          border: 1px solid rgba(243, 238, 217, 0.2);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(62, 92, 73, 0.15);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #2e2e2eff !important;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #4A4A4A !important ;
        }

        .actions-section {
          margin-bottom: 32px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 20px 0;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #4A4A4A;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state svg {
          color: #C2C2C2;
          margin-bottom: 16px;
        }

        .backups-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .backup-card {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .backup-card:hover {
          border-color: #3E5C49;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.1);
        }

        .backup-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .backup-icon {
          width: 40px;
          height: 40px;
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .backup-info {
          flex: 1;
        }

        .backup-name {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }

        .backup-date, .backup-size {
          font-size: 14px;
          color: #4A4A4A;
          margin: 2px 0;
        }

        .backup-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .backup-metadata {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(229, 220, 194, 0.3);
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metadata-label {
          font-size: 12px;
          color: #4A4A4A;
          font-weight: 500;
        }

        .metadata-value {
          font-size: 14px;
          color: #2E2E2E;
          font-weight: 600;
        }

        .create-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
        }

        .create-modal {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .create-modal-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .create-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .create-modal-content {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .create-modal-footer {
          padding: 24px;
          border-top: 1px solid #E5DCC2;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .backup-manager-modal {
            margin: 12px;
          }

          .stats-grid, .actions-grid {
            grid-template-columns: 1fr;
          }

          .backup-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .backup-actions {
            align-self: flex-end;
          }

          .metadata-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Scrollbar personnalisé */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #F3EED9;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #3E5C49;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #2E453A;
        }
      `}</style>
    </div>
  );
};