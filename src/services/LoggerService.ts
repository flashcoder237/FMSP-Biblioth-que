// Service de logging sécurisé et centralisé
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { configService } from './ConfigService';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  stack?: string;
}

class LoggerService {
  private logDirectory: string;
  private maxLogFiles = 10;
  private maxLogSizeBytes = 10 * 1024 * 1024; // 10MB

  constructor() {
    this.logDirectory = path.join(app.getPath('userData'), 'logs');
    this.ensureLogDirectory();
  }

  /**
   * Assure que le répertoire de logs existe
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Vérifie si le niveau de log doit être enregistré
   */
  private shouldLog(level: LogLevel): boolean {
    const configuredLevel = configService.getLogLevel();
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    
    const configuredIndex = levels.indexOf(configuredLevel as LogLevel);
    const messageIndex = levels.indexOf(level);
    
    return messageIndex <= configuredIndex;
  }

  /**
   * Sanitise les données sensibles avant logging
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'credential',
      'supabaseKey', 'apiKey', 'accessToken', 'refreshToken'
    ];

    if (typeof data === 'string') {
      // Masquer les patterns d'URLs avec tokens
      return data.replace(/([?&])(token|key|secret)=([^&]*)/gi, '$1$2=***');
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => 
          key.toLowerCase().includes(sensitive.toLowerCase())
        )) {
          sanitized[key] = '***';
        } else if (typeof sanitized[key] === 'object') {
          sanitized[key] = this.sanitizeData(sanitized[key]);
        }
      }
      
      return sanitized;
    }

    return data;
  }

  /**
   * Formate une entrée de log
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, data, stack } = entry;
    
    let formatted = `[${timestamp}] ${level.toUpperCase()}`;
    
    if (context) {
      formatted += ` [${context}]`;
    }
    
    formatted += `: ${message}`;
    
    if (data) {
      formatted += `\nData: ${JSON.stringify(this.sanitizeData(data), null, 2)}`;
    }
    
    if (stack && level === 'error') {
      formatted += `\nStack: ${stack}`;
    }
    
    return formatted + '\n';
  }

  /**
   * Écrit dans le fichier de log
   */
  private writeToFile(level: LogLevel, formattedMessage: string): void {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDirectory, `${today}.log`);
    
    try {
      // Rotation des logs si nécessaire
      this.rotateLogsIfNeeded(logFile);
      
      fs.appendFileSync(logFile, formattedMessage, 'utf8');
    } catch (error) {
      // En cas d'erreur de fichier, utiliser console comme fallback
      console.error('Erreur d\'écriture dans le log:', error);
      console.log(formattedMessage);
    }
  }

  /**
   * Gère la rotation des fichiers de log
   */
  private rotateLogsIfNeeded(logFile: string): void {
    if (!fs.existsSync(logFile)) return;
    
    const stats = fs.statSync(logFile);
    if (stats.size > this.maxLogSizeBytes) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = logFile.replace('.log', `-${timestamp}.log`);
      fs.renameSync(logFile, rotatedFile);
      
      // Nettoyer les anciens logs
      this.cleanupOldLogs();
    }
  }

  /**
   * Nettoie les anciens fichiers de log
   */
  private cleanupOldLogs(): void {
    try {
      const files = fs.readdirSync(this.logDirectory)
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDirectory, file),
          mtime: fs.statSync(path.join(this.logDirectory, file)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      if (files.length > this.maxLogFiles) {
        const filesToDelete = files.slice(this.maxLogFiles);
        filesToDelete.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des logs:', error);
    }
  }

  /**
   * Log générique
   */
  private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      stack: error?.stack
    };

    const formatted = this.formatLogEntry(entry);

    // En mode debug, aussi logger dans la console
    if (configService.isDebugMode()) {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           console.log;
      consoleMethod(formatted);
    }

    // Écrire dans le fichier sauf en mode test
    if (configService.get('app').environment !== 'test') {
      this.writeToFile(level, formatted);
    }
  }

  /**
   * Log d'erreur
   */
  error(message: string, context?: string, error?: Error, data?: any): void {
    this.log('error', message, context, data, error);
  }

  /**
   * Log d'avertissement
   */
  warn(message: string, context?: string, data?: any): void {
    this.log('warn', message, context, data);
  }

  /**
   * Log d'information
   */
  info(message: string, context?: string, data?: any): void {
    this.log('info', message, context, data);
  }

  /**
   * Log de debug
   */
  debug(message: string, context?: string, data?: any): void {
    this.log('debug', message, context, data);
  }

  /**
   * Log de performance
   */
  performance(operation: string, duration: number, context?: string): void {
    this.info(`Performance: ${operation} completed in ${duration}ms`, context);
  }

  /**
   * Log de sécurité
   */
  security(message: string, data?: any): void {
    this.warn(`SECURITY: ${message}`, 'Security', data);
  }

  /**
   * Récupère les logs récents
   */
  getRecentLogs(hours: number = 24): LogEntry[] {
    const logs: LogEntry[] = [];
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    try {
      const files = fs.readdirSync(this.logDirectory)
        .filter(file => file.endsWith('.log'))
        .sort()
        .reverse(); // Plus récents en premier

      for (const file of files.slice(0, 3)) { // Lire max 3 fichiers
        const filePath = path.join(this.logDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parser basique pour extraire les logs structurés
        const lines = content.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const match = line.match(/^\[(.+?)\] (\w+)(?: \[(.+?)\])?: (.+)$/);
            if (match) {
              const [, timestamp, level, context, message] = match;
              const logTime = new Date(timestamp);
              
              if (logTime >= cutoffTime) {
                logs.push({
                  timestamp,
                  level: level.toLowerCase() as LogLevel,
                  message,
                  context
                });
              }
            }
          } catch (parseError) {
            // Ignorer les lignes non parsables
          }
        }
      }
    } catch (error) {
      this.error('Erreur lors de la récupération des logs', 'LoggerService', error as Error);
    }

    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

// Instance singleton
export const logger = new LoggerService();
export default logger;