"use strict";
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
exports.BackupService = void 0;
var fs = require("fs");
var path = require("path");
var archiver_1 = require("archiver");
var extract_zip_1 = require("extract-zip");
var electron_1 = require("electron");
var BackupService = /** @class */ (function () {
    function BackupService(databaseService) {
        this.databaseService = databaseService;
        var userDataPath = electron_1.app.getPath('userData');
        this.backupDir = path.join(userDataPath, 'backups');
        this.tempDir = path.join(userDataPath, 'temp');
        // Créer les dossiers s'ils n'existent pas
        this.ensureDirectories();
    }
    BackupService.prototype.ensureDirectories = function () {
        try {
            if (!fs.existsSync(this.backupDir)) {
                fs.mkdirSync(this.backupDir, { recursive: true });
            }
            if (!fs.existsSync(this.tempDir)) {
                fs.mkdirSync(this.tempDir, { recursive: true });
            }
        }
        catch (error) {
            console.error('Erreur lors de la création des dossiers:', error);
        }
    };
    BackupService.prototype.calculateChecksum = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var crypto = require('crypto');
                        var hash = crypto.createHash('sha256');
                        var stream = fs.createReadStream(filePath);
                        stream.on('data', function (data) { return hash.update(Buffer.from(data)); });
                        stream.on('end', function () { return resolve(hash.digest('hex')); });
                        stream.on('error', reject);
                    })];
            });
        });
    };
    BackupService.prototype.getBackupStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats, borrowHistory, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.databaseService.getStats()];
                    case 1:
                        stats = _a.sent();
                        return [4 /*yield*/, this.databaseService.getBorrowHistory()];
                    case 2:
                        borrowHistory = _a.sent();
                        return [2 /*return*/, {
                                totalBooks: stats.totalBooks,
                                totalBorrowers: stats.totalBorrowers,
                                totalAuthors: stats.totalAuthors,
                                totalCategories: stats.totalCategories,
                                totalBorrowHistory: borrowHistory.length
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Erreur lors de la récupération des statistiques:', error_1);
                        return [2 /*return*/, {
                                totalBooks: 0,
                                totalBorrowers: 0,
                                totalAuthors: 0,
                                totalCategories: 0,
                                totalBorrowHistory: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.createBackup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var timestamp, backupFileName_1, backupFilePath_1, output, archive, dbPath, usersPath, sessionsPath, settingsPath, stats, backupInfo, error_2;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                    backupFileName_1 = "bibliotheque_backup_".concat(timestamp, ".bak");
                                    backupFilePath_1 = path.join(this.backupDir, backupFileName_1);
                                    output = fs.createWriteStream(backupFilePath_1);
                                    archive = (0, archiver_1.default)('zip', {
                                        zlib: { level: 9 } // Compression maximale
                                    });
                                    output.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var checksum, stats_1, metadata, metadataPath, error_3;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 3, , 4]);
                                                    return [4 /*yield*/, this.calculateChecksum(backupFilePath_1)];
                                                case 1:
                                                    checksum = _a.sent();
                                                    return [4 /*yield*/, this.getBackupStats()];
                                                case 2:
                                                    stats_1 = _a.sent();
                                                    metadata = {
                                                        version: '1.0',
                                                        timestamp: new Date().toISOString(),
                                                        appVersion: electron_1.app.getVersion(),
                                                        platform: process.platform,
                                                        stats: stats_1,
                                                        checksum: checksum
                                                    };
                                                    metadataPath = path.join(this.backupDir, "".concat(backupFileName_1, ".meta"));
                                                    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
                                                    console.log('Sauvegarde créée:', backupFilePath_1);
                                                    resolve(backupFilePath_1);
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_3 = _a.sent();
                                                    reject(error_3);
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    output.on('error', reject);
                                    archive.on('error', reject);
                                    archive.pipe(output);
                                    dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
                                    if (fs.existsSync(dbPath)) {
                                        archive.file(dbPath, { name: 'bibliotheque.db' });
                                    }
                                    usersPath = path.join(electron_1.app.getPath('userData'), 'users.json');
                                    if (fs.existsSync(usersPath)) {
                                        archive.file(usersPath, { name: 'users.json' });
                                    }
                                    sessionsPath = path.join(electron_1.app.getPath('userData'), 'sessions.json');
                                    if (fs.existsSync(sessionsPath)) {
                                        archive.file(sessionsPath, { name: 'sessions.json' });
                                    }
                                    settingsPath = path.join(electron_1.app.getPath('userData'), 'settings.json');
                                    if (fs.existsSync(settingsPath)) {
                                        archive.file(settingsPath, { name: 'settings.json' });
                                    }
                                    return [4 /*yield*/, this.getBackupStats()];
                                case 1:
                                    stats = _a.sent();
                                    backupInfo = {
                                        version: '1.0',
                                        timestamp: new Date().toISOString(),
                                        appVersion: electron_1.app.getVersion(),
                                        platform: process.platform,
                                        stats: stats
                                    };
                                    archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup_info.json' });
                                    // Finaliser l'archive
                                    return [4 /*yield*/, archive.finalize()];
                                case 2:
                                    // Finaliser l'archive
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    reject(error_2);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    BackupService.prototype.restoreBackup = function (backupFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var extractPath_1, backupInfoPath, backupInfo, userDataPath_1, backupCurrentPath_1, filesToBackup, extractError_1, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    // Vérifier que le fichier existe
                                    if (!fs.existsSync(backupFilePath)) {
                                        reject(new Error('Fichier de sauvegarde introuvable'));
                                        return [2 /*return*/];
                                    }
                                    extractPath_1 = path.join(this.tempDir, "restore_".concat(Date.now()));
                                    fs.mkdirSync(extractPath_1, { recursive: true });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    // Extraire l'archive
                                    return [4 /*yield*/, (0, extract_zip_1.default)(backupFilePath, { dir: extractPath_1 })];
                                case 2:
                                    // Extraire l'archive
                                    _a.sent();
                                    backupInfoPath = path.join(extractPath_1, 'backup_info.json');
                                    if (!fs.existsSync(backupInfoPath)) {
                                        throw new Error('Structure de sauvegarde invalide');
                                    }
                                    backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
                                    console.log('Restauration de la sauvegarde:', backupInfo);
                                    userDataPath_1 = electron_1.app.getPath('userData');
                                    backupCurrentPath_1 = path.join(this.tempDir, "current_backup_".concat(Date.now()));
                                    fs.mkdirSync(backupCurrentPath_1, { recursive: true });
                                    filesToBackup = [
                                        'bibliotheque.db',
                                        'users.json',
                                        'sessions.json',
                                        'settings.json'
                                    ];
                                    filesToBackup.forEach(function (fileName) {
                                        var currentFile = path.join(userDataPath_1, fileName);
                                        if (fs.existsSync(currentFile)) {
                                            fs.copyFileSync(currentFile, path.join(backupCurrentPath_1, fileName));
                                        }
                                    });
                                    // Restaurer les fichiers
                                    filesToBackup.forEach(function (fileName) {
                                        var extractedFile = path.join(extractPath_1, fileName);
                                        var targetFile = path.join(userDataPath_1, fileName);
                                        if (fs.existsSync(extractedFile)) {
                                            fs.copyFileSync(extractedFile, targetFile);
                                            console.log("Fichier restaur\u00E9: ".concat(fileName));
                                        }
                                    });
                                    // Nettoyer le dossier temporaire d'extraction
                                    fs.rmSync(extractPath_1, { recursive: true, force: true });
                                    console.log('Restauration terminée avec succès');
                                    resolve(true);
                                    return [3 /*break*/, 4];
                                case 3:
                                    extractError_1 = _a.sent();
                                    // Nettoyer en cas d'erreur
                                    if (fs.existsSync(extractPath_1)) {
                                        fs.rmSync(extractPath_1, { recursive: true, force: true });
                                    }
                                    throw extractError_1;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_4 = _a.sent();
                                    console.error('Erreur lors de la restauration:', error_4);
                                    reject(error_4);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    BackupService.prototype.getBackupList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var backups, files, _i, files_1, file, filePath, metadataPath, stats, metadata, error_5, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        backups = [];
                        files = fs.readdirSync(this.backupDir);
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 8];
                        file = files_1[_i];
                        if (!file.endsWith('.bak')) return [3 /*break*/, 7];
                        filePath = path.join(this.backupDir, file);
                        metadataPath = path.join(this.backupDir, "".concat(file, ".meta"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        stats = fs.statSync(filePath);
                        metadata = null;
                        if (!fs.existsSync(metadataPath)) return [3 /*break*/, 3];
                        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.extractBackupMetadata(filePath)];
                    case 4:
                        // Essayer de lire les métadonnées depuis l'archive
                        metadata = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (metadata) {
                            backups.push({
                                filePath: filePath,
                                fileName: file,
                                size: stats.size,
                                createdAt: stats.birthtime.toISOString(),
                                metadata: metadata
                            });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        console.error("Erreur lors de la lecture de la sauvegarde ".concat(file, ":"), error_5);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: 
                    // Trier par date de création (plus récent en premier)
                    return [2 /*return*/, backups.sort(function (a, b) {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })];
                    case 9:
                        error_6 = _a.sent();
                        console.error('Erreur lors de la récupération de la liste des sauvegardes:', error_6);
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.extractBackupMetadata = function (backupFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var tempExtractPath, backupInfoPath, backupInfo, checksum, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempExtractPath = path.join(this.tempDir, "meta_extract_".concat(Date.now()));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, (0, extract_zip_1.default)(backupFilePath, {
                                dir: tempExtractPath,
                                onEntry: function (entry, zipFile) {
                                    // Ne extraire que le fichier backup_info.json
                                    if (entry.fileName !== 'backup_info.json') {
                                        zipFile.readEntry();
                                    }
                                }
                            })];
                    case 2:
                        _a.sent();
                        backupInfoPath = path.join(tempExtractPath, 'backup_info.json');
                        if (!fs.existsSync(backupInfoPath)) return [3 /*break*/, 4];
                        backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
                        return [4 /*yield*/, this.calculateChecksum(backupFilePath)];
                    case 3:
                        checksum = _a.sent();
                        return [2 /*return*/, {
                                version: backupInfo.version || '1.0',
                                timestamp: backupInfo.timestamp,
                                appVersion: backupInfo.appVersion,
                                platform: backupInfo.platform,
                                stats: backupInfo.stats,
                                checksum: checksum
                            }];
                    case 4: return [2 /*return*/, null];
                    case 5:
                        error_7 = _a.sent();
                        console.error('Erreur lors de l\'extraction des métadonnées:', error_7);
                        return [2 /*return*/, null];
                    case 6:
                        // Nettoyer
                        if (fs.existsSync(tempExtractPath)) {
                            fs.rmSync(tempExtractPath, { recursive: true, force: true });
                        }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.deleteBackup = function (backupFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var metadataPath;
            return __generator(this, function (_a) {
                try {
                    if (fs.existsSync(backupFilePath)) {
                        fs.unlinkSync(backupFilePath);
                        metadataPath = "".concat(backupFilePath, ".meta");
                        if (fs.existsSync(metadataPath)) {
                            fs.unlinkSync(metadataPath);
                        }
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                }
                catch (error) {
                    console.error('Erreur lors de la suppression de la sauvegarde:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    BackupService.prototype.validateBackup = function (backupFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var metadataPath, metadata, currentChecksum, tempExtractPath_1, requiredFiles, hasRequiredFiles, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        metadataPath = "".concat(backupFilePath, ".meta");
                        if (!fs.existsSync(backupFilePath)) {
                            return [2 /*return*/, false];
                        }
                        if (!fs.existsSync(metadataPath)) return [3 /*break*/, 2];
                        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                        return [4 /*yield*/, this.calculateChecksum(backupFilePath)];
                    case 1:
                        currentChecksum = _a.sent();
                        if (metadata.checksum !== currentChecksum) {
                            console.error('Checksum invalide pour la sauvegarde:', backupFilePath);
                            return [2 /*return*/, false];
                        }
                        _a.label = 2;
                    case 2:
                        tempExtractPath_1 = path.join(this.tempDir, "validate_".concat(Date.now()));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, , 5, 6]);
                        return [4 /*yield*/, (0, extract_zip_1.default)(backupFilePath, { dir: tempExtractPath_1 })];
                    case 4:
                        _a.sent();
                        requiredFiles = ['backup_info.json'];
                        hasRequiredFiles = requiredFiles.every(function (file) {
                            return fs.existsSync(path.join(tempExtractPath_1, file));
                        });
                        return [2 /*return*/, hasRequiredFiles];
                    case 5:
                        if (fs.existsSync(tempExtractPath_1)) {
                            fs.rmSync(tempExtractPath_1, { recursive: true, force: true });
                        }
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_8 = _a.sent();
                        console.error('Erreur lors de la validation de la sauvegarde:', error_8);
                        return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.exportDatabase = function (outputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dbPath;
            return __generator(this, function (_a) {
                try {
                    dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
                    if (!fs.existsSync(dbPath)) {
                        throw new Error('Base de données introuvable');
                    }
                    fs.copyFileSync(dbPath, outputPath);
                }
                catch (error) {
                    console.error('Erreur lors de l\'export de la base de données:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    BackupService.prototype.importDatabase = function (sourcePath) {
        return __awaiter(this, void 0, void 0, function () {
            var dbPath, backupDbPath;
            return __generator(this, function (_a) {
                try {
                    if (!fs.existsSync(sourcePath)) {
                        throw new Error('Fichier source introuvable');
                    }
                    dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
                    backupDbPath = path.join(electron_1.app.getPath('userData'), "bibliotheque_backup_".concat(Date.now(), ".db"));
                    if (fs.existsSync(dbPath)) {
                        fs.copyFileSync(dbPath, backupDbPath);
                    }
                    // Importer la nouvelle base de données
                    fs.copyFileSync(sourcePath, dbPath);
                }
                catch (error) {
                    console.error('Erreur lors de l\'import de la base de données:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    BackupService.prototype.scheduleAutoBackup = function (frequency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Cette méthode peut être étendue pour implémenter des sauvegardes automatiques
                // Pour l'instant, c'est un placeholder
                console.log("Sauvegarde automatique programm\u00E9e: ".concat(frequency));
                return [2 /*return*/];
            });
        });
    };
    BackupService.prototype.cleanOldBackups = function () {
        return __awaiter(this, arguments, void 0, function (keepCount) {
            var backups, backupsToDelete, deletedCount, _i, backupsToDelete_1, backup, success, error_9;
            if (keepCount === void 0) { keepCount = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getBackupList()];
                    case 1:
                        backups = _a.sent();
                        if (backups.length <= keepCount) {
                            return [2 /*return*/, 0]; // Rien à nettoyer
                        }
                        backupsToDelete = backups.slice(keepCount);
                        deletedCount = 0;
                        _i = 0, backupsToDelete_1 = backupsToDelete;
                        _a.label = 2;
                    case 2:
                        if (!(_i < backupsToDelete_1.length)) return [3 /*break*/, 5];
                        backup = backupsToDelete_1[_i];
                        return [4 /*yield*/, this.deleteBackup(backup.filePath)];
                    case 3:
                        success = _a.sent();
                        if (success) {
                            deletedCount++;
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, deletedCount];
                    case 6:
                        error_9 = _a.sent();
                        console.error('Erreur lors du nettoyage des sauvegardes:', error_9);
                        return [2 /*return*/, 0];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BackupService.prototype.getBackupDirectorySize = function () {
        try {
            var files = fs.readdirSync(this.backupDir);
            var totalSize = 0;
            for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                var file = files_2[_i];
                var filePath = path.join(this.backupDir, file);
                var stats = fs.statSync(filePath);
                totalSize += stats.size;
            }
            return totalSize;
        }
        catch (error) {
            console.error('Erreur lors du calcul de la taille du dossier de sauvegarde:', error);
            return 0;
        }
    };
    BackupService.prototype.formatFileSize = function (bytes) {
        var units = ['B', 'KB', 'MB', 'GB'];
        var size = bytes;
        var unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return "".concat(size.toFixed(1), " ").concat(units[unitIndex]);
    };
    return BackupService;
}());
exports.BackupService = BackupService;
