import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import extract, { Options } from 'extract-zip';
import { Entry, ZipFile } from 'yauzl';
import { app } from 'electron';
import { DatabaseService } from './DatabaseService';

export interface BackupMetadata {
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
}

export interface BackupInfo {
  filePath: string;
  fileName: string;
  size: number;
  createdAt: string;
  metadata: BackupMetadata;
}

export class BackupService {
  private readonly backupDir: string;
  private readonly tempDir: string;
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
    const userDataPath = app.getPath('userData');
    this.backupDir = path.join(userDataPath, 'backups');
    this.tempDir = path.join(userDataPath, 'temp');
    
    // Créer les dossiers s'ils n'existent pas
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
      }
    } catch (error) {
      console.error('Erreur lors de la création des dossiers:', error);
    }
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data: string | Buffer) => hash.update(Buffer.from(data)));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private async getBackupStats(): Promise<BackupMetadata['stats']> {
    try {
      const stats = await this.databaseService.getStats();
      const borrowHistory = await this.databaseService.getBorrowHistory();
      
      return {
        totalDocuments: stats.totalDocuments,
        totalBorrowers: stats.totalBorrowers,
        totalAuthors: stats.totalAuthors,
        totalCategories: stats.totalCategories,
        totalBorrowHistory: borrowHistory.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalDocuments: 0,
        totalBorrowers: 0,
        totalAuthors: 0,
        totalCategories: 0,
        totalBorrowHistory: 0
      };
    }
  }

  async createBackup(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `bibliotheque_backup_${timestamp}.bak`;
        const backupFilePath = path.join(this.backupDir, backupFileName);
        
        // Créer l'archive
        const output = fs.createWriteStream(backupFilePath);
        const archive = archiver('zip', {
          zlib: { level: 9 } // Compression maximale
        });

        output.on('close', async () => {
          try {
            // Calculer le checksum
            const checksum = await this.calculateChecksum(backupFilePath);
            
            // Créer les métadonnées
            const stats = await this.getBackupStats();
            const metadata: BackupMetadata = {
              version: '1.0',
              timestamp: new Date().toISOString(),
              appVersion: app.getVersion(),
              platform: process.platform,
              stats,
              checksum
            };

            // Sauvegarder les métadonnées dans un fichier séparé
            const metadataPath = path.join(this.backupDir, `${backupFileName}.meta`);
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

            console.log('Sauvegarde créée:', backupFilePath);
            resolve(backupFilePath);
          } catch (error) {
            reject(error);
          }
        });

        output.on('error', reject);
        archive.on('error', reject);

        archive.pipe(output);

        // Ajouter la base de données
        const dbPath = path.join(app.getPath('userData'), 'bibliotheque.db');
        if (fs.existsSync(dbPath)) {
          archive.file(dbPath, { name: 'bibliotheque.db' });
        }

        // Ajouter les fichiers de configuration
        const usersPath = path.join(app.getPath('userData'), 'users.json');
        if (fs.existsSync(usersPath)) {
          archive.file(usersPath, { name: 'users.json' });
        }

        const sessionsPath = path.join(app.getPath('userData'), 'sessions.json');
        if (fs.existsSync(sessionsPath)) {
          archive.file(sessionsPath, { name: 'sessions.json' });
        }

        const settingsPath = path.join(app.getPath('userData'), 'settings.json');
        if (fs.existsSync(settingsPath)) {
          archive.file(settingsPath, { name: 'settings.json' });
        }

        // Ajouter un fichier d'informations sur la sauvegarde
        const stats = await this.getBackupStats();
        const backupInfo = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          appVersion: app.getVersion(),
          platform: process.platform,
          stats
        };
        
        archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup_info.json' });

        // Finaliser l'archive
        await archive.finalize();
      } catch (error) {
        reject(error);
      }
    });
  }

  async restoreBackup(backupFilePath: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier que le fichier existe
        if (!fs.existsSync(backupFilePath)) {
          reject(new Error('Fichier de sauvegarde introuvable'));
          return;
        }

        // Créer un dossier temporaire pour l'extraction
        const extractPath = path.join(this.tempDir, `restore_${Date.now()}`);
        fs.mkdirSync(extractPath, { recursive: true });

        try {
          // Extraire l'archive
          await extract(backupFilePath, { dir: extractPath });

          // Vérifier la structure de la sauvegarde
          const backupInfoPath = path.join(extractPath, 'backup_info.json');
          if (!fs.existsSync(backupInfoPath)) {
            throw new Error('Structure de sauvegarde invalide');
          }

          // Lire les informations de sauvegarde
          const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
          console.log('Restauration de la sauvegarde:', backupInfo);

          const userDataPath = app.getPath('userData');

          // Sauvegarder les fichiers actuels
          const backupCurrentPath = path.join(this.tempDir, `current_backup_${Date.now()}`);
          fs.mkdirSync(backupCurrentPath, { recursive: true });

          const filesToBackup = [
            'bibliotheque.db',
            'users.json',
            'sessions.json',
            'settings.json'
          ];

          filesToBackup.forEach(fileName => {
            const currentFile = path.join(userDataPath, fileName);
            if (fs.existsSync(currentFile)) {
              fs.copyFileSync(currentFile, path.join(backupCurrentPath, fileName));
            }
          });

          // Restaurer les fichiers
          filesToBackup.forEach(fileName => {
            const extractedFile = path.join(extractPath, fileName);
            const targetFile = path.join(userDataPath, fileName);
            
            if (fs.existsSync(extractedFile)) {
              fs.copyFileSync(extractedFile, targetFile);
              console.log(`Fichier restauré: ${fileName}`);
            }
          });

          // Nettoyer le dossier temporaire d'extraction
          fs.rmSync(extractPath, { recursive: true, force: true });

          console.log('Restauration terminée avec succès');
          resolve(true);

        } catch (extractError) {
          // Nettoyer en cas d'erreur
          if (fs.existsSync(extractPath)) {
            fs.rmSync(extractPath, { recursive: true, force: true });
          }
          throw extractError;
        }

      } catch (error) {
        console.error('Erreur lors de la restauration:', error);
        reject(error);
      }
    });
  }

  async getBackupList(): Promise<BackupInfo[]> {
    try {
      const backups: BackupInfo[] = [];
      const files = fs.readdirSync(this.backupDir);
      
      for (const file of files) {
        if (file.endsWith('.bak')) {
          const filePath = path.join(this.backupDir, file);
          const metadataPath = path.join(this.backupDir, `${file}.meta`);
          
          try {
            const stats = fs.statSync(filePath);
            let metadata: BackupMetadata | null = null;
            
            // Essayer de lire les métadonnées
            if (fs.existsSync(metadataPath)) {
              metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            } else {
              // Essayer de lire les métadonnées depuis l'archive
              metadata = await this.extractBackupMetadata(filePath);
            }
            
            if (metadata) {
              backups.push({
                filePath,
                fileName: file,
                size: stats.size,
                createdAt: stats.birthtime.toISOString(),
                metadata
              });
            }
          } catch (error) {
            console.error(`Erreur lors de la lecture de la sauvegarde ${file}:`, error);
          }
        }
      }
      
      // Trier par date de création (plus récent en premier)
      return backups.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des sauvegardes:', error);
      return [];
    }
  }

  private async extractBackupMetadata(backupFilePath: string): Promise<BackupMetadata | null> {
    const tempExtractPath = path.join(this.tempDir, `meta_extract_${Date.now()}`);
    
    try {
      await extract(backupFilePath, { 
        dir: tempExtractPath,
        onEntry: (entry: Entry, zipFile: ZipFile) => {
          // Ne extraire que le fichier backup_info.json
          if (entry.fileName !== 'backup_info.json') {
            zipFile.readEntry();
          }
        }
      });
      
      const backupInfoPath = path.join(tempExtractPath, 'backup_info.json');
      if (fs.existsSync(backupInfoPath)) {
        const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
        
        // Calculer le checksum
        const checksum = await this.calculateChecksum(backupFilePath);
        
        return {
          version: backupInfo.version || '1.0',
          timestamp: backupInfo.timestamp,
          appVersion: backupInfo.appVersion,
          platform: backupInfo.platform,
          stats: backupInfo.stats,
          checksum
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'extraction des métadonnées:', error);
      return null;
    } finally {
      // Nettoyer
      if (fs.existsSync(tempExtractPath)) {
        fs.rmSync(tempExtractPath, { recursive: true, force: true });
      }
    }
  }

  async deleteBackup(backupFilePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(backupFilePath)) {
        fs.unlinkSync(backupFilePath);
        
        // Supprimer aussi le fichier de métadonnées s'il existe
        const metadataPath = `${backupFilePath}.meta`;
        if (fs.existsSync(metadataPath)) {
          fs.unlinkSync(metadataPath);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression de la sauvegarde:', error);
      return false;
    }
  }

  async validateBackup(backupFilePath: string): Promise<boolean> {
    try {
      const metadataPath = `${backupFilePath}.meta`;
      
      if (!fs.existsSync(backupFilePath)) {
        return false;
      }
      
      // Vérifier le checksum si les métadonnées existent
      if (fs.existsSync(metadataPath)) {
        const metadata: BackupMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const currentChecksum = await this.calculateChecksum(backupFilePath);
        
        if (metadata.checksum !== currentChecksum) {
          console.error('Checksum invalide pour la sauvegarde:', backupFilePath);
          return false;
        }
      }
      
      // Vérifier que l'archive peut être ouverte et contient les fichiers essentiels
      const tempExtractPath = path.join(this.tempDir, `validate_${Date.now()}`);
      
      try {
        await extract(backupFilePath, { dir: tempExtractPath });
        
        const requiredFiles = ['backup_info.json'];
        const hasRequiredFiles = requiredFiles.every(file => 
          fs.existsSync(path.join(tempExtractPath, file))
        );
        
        return hasRequiredFiles;
      } finally {
        if (fs.existsSync(tempExtractPath)) {
          fs.rmSync(tempExtractPath, { recursive: true, force: true });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la sauvegarde:', error);
      return false;
    }
  }

  async exportDatabase(outputPath: string): Promise<void> {
    try {
      const dbPath = path.join(app.getPath('userData'), 'bibliotheque.db');
      
      if (!fs.existsSync(dbPath)) {
        throw new Error('Base de données introuvable');
      }
      
      fs.copyFileSync(dbPath, outputPath);
    } catch (error) {
      console.error('Erreur lors de l\'export de la base de données:', error);
      throw error;
    }
  }

  async importDatabase(sourcePath: string): Promise<void> {
    try {
      if (!fs.existsSync(sourcePath)) {
        throw new Error('Fichier source introuvable');
      }
      
      const dbPath = path.join(app.getPath('userData'), 'bibliotheque.db');
      
      // Sauvegarder la base de données actuelle
      const backupDbPath = path.join(app.getPath('userData'), `bibliotheque_backup_${Date.now()}.db`);
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, backupDbPath);
      }
      
      // Importer la nouvelle base de données
      fs.copyFileSync(sourcePath, dbPath);
      
    } catch (error) {
      console.error('Erreur lors de l\'import de la base de données:', error);
      throw error;
    }
  }

  async scheduleAutoBackup(frequency: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    // Cette méthode peut être étendue pour implémenter des sauvegardes automatiques
    // Pour l'instant, c'est un placeholder
    console.log(`Sauvegarde automatique programmée: ${frequency}`);
  }

  async cleanOldBackups(keepCount: number = 10): Promise<number> {
    try {
      const backups = await this.getBackupList();
      
      if (backups.length <= keepCount) {
        return 0; // Rien à nettoyer
      }
      
      // Garder les plus récents, supprimer les anciens
      const backupsToDelete = backups.slice(keepCount);
      let deletedCount = 0;
      
      for (const backup of backupsToDelete) {
        const success = await this.deleteBackup(backup.filePath);
        if (success) {
          deletedCount++;
        }
      }
      
      return deletedCount;
    } catch (error) {
      console.error('Erreur lors du nettoyage des sauvegardes:', error);
      return 0;
    }
  }

  getBackupDirectorySize(): number {
    try {
      const files = fs.readdirSync(this.backupDir);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
      
      return totalSize;
    } catch (error) {
      console.error('Erreur lors du calcul de la taille du dossier de sauvegarde:', error);
      return 0;
    }
  }

  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  
}