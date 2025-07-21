"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
var SupabaseService_1 = require("./SupabaseService");
var SyncService = /** @class */ (function () {
    function SyncService(databaseService) {
        this.syncQueue = [];
        this.isInitialized = false;
        this.syncInterval = null;
        this.networkCheckInterval = null;
        this.retryTimeout = null;
        this.databaseService = databaseService;
        this.supabaseService = new SupabaseService_1.SupabaseService();
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
    SyncService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isInitialized)
                            return [2 /*return*/];
                        // Charger les opérations en attente depuis la base de données
                        return [4 /*yield*/, this.loadPendingOperations()];
                    case 1:
                        // Charger les opérations en attente depuis la base de données
                        _a.sent();
                        // Démarrer la surveillance réseau
                        this.startNetworkMonitoring();
                        // Démarrer la synchronisation automatique
                        this.startAutoSync();
                        this.isInitialized = true;
                        console.log('SyncService initialisé');
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.loadPendingOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var operations, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.databaseService.getSyncQueue()];
                    case 1:
                        operations = _a.sent();
                        this.syncQueue = operations;
                        this.syncStatus.pendingOperations = operations.length;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Erreur lors du chargement des opérations en attente:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.startNetworkMonitoring = function () {
        var _this = this;
        // Vérifier la connectivité toutes les 30 secondes
        this.networkCheckInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkNetworkStatus()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 30000);
        // Vérification initiale
        this.checkNetworkStatus();
    };
    SyncService.prototype.checkNetworkStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isOnline, wasOnline, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.testConnectivity()];
                    case 1:
                        isOnline = _a.sent();
                        wasOnline = this.networkStatus.isOnline;
                        this.networkStatus = {
                            isOnline: isOnline,
                            connectionType: isOnline ? 'wifi' : 'none', // Simplification
                            lastChecked: new Date().toISOString()
                        };
                        this.syncStatus.isOnline = isOnline;
                        if (!(isOnline && !wasOnline && this.syncQueue.length > 0)) return [3 /*break*/, 3];
                        console.log('Connexion rétablie, démarrage de la synchronisation...');
                        return [4 /*yield*/, this.processSyncQueue()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Erreur lors de la vérification réseau:', error_2);
                        this.networkStatus.isOnline = false;
                        this.syncStatus.isOnline = false;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.testConnectivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var controller_1, timeoutId, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        controller_1 = new AbortController();
                        timeoutId = setTimeout(function () { return controller_1.abort(); }, 5000);
                        return [4 /*yield*/, fetch('https://google.com', {
                                method: 'HEAD',
                                signal: controller_1.signal
                            })];
                    case 1:
                        response = _b.sent();
                        clearTimeout(timeoutId);
                        return [2 /*return*/, response.ok];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.startAutoSync = function () {
        var _this = this;
        // Synchronisation automatique toutes les 5 minutes si en ligne
        this.syncInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.networkStatus.isOnline && !this.syncStatus.syncInProgress)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processSyncQueue()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, 5 * 60 * 1000); // 5 minutes
    };
    SyncService.prototype.addOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var syncOp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        syncOp = __assign(__assign({}, operation), { id: this.generateOperationId(), timestamp: new Date().toISOString(), retryCount: 0 });
                        this.syncQueue.push(syncOp);
                        this.syncStatus.pendingOperations = this.syncQueue.length;
                        // Sauvegarder dans la base
                        return [4 /*yield*/, this.databaseService.addSyncOperation(syncOp)];
                    case 1:
                        // Sauvegarder dans la base
                        _a.sent();
                        if (!(this.networkStatus.isOnline && !this.syncStatus.syncInProgress)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.processSyncQueue()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.processSyncQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var processedOperations, failedOperations, _i, _a, operation, success, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.syncStatus.syncInProgress || !this.networkStatus.isOnline) {
                            return [2 /*return*/];
                        }
                        this.syncStatus.syncInProgress = true;
                        console.log("D\u00E9marrage de la synchronisation: ".concat(this.syncQueue.length, " op\u00E9rations en attente"));
                        processedOperations = [];
                        failedOperations = [];
                        _i = 0, _a = this.syncQueue;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 13];
                        operation = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, , 12]);
                        return [4 /*yield*/, this.processOperation(operation)];
                    case 3:
                        success = _b.sent();
                        if (!success) return [3 /*break*/, 5];
                        processedOperations.push(operation.id);
                        // Supprimer de la base
                        return [4 /*yield*/, this.databaseService.removeSyncOperation(operation.id)];
                    case 4:
                        // Supprimer de la base
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        operation.retryCount++;
                        if (!(operation.retryCount >= operation.maxRetries)) return [3 /*break*/, 7];
                        // Ajouter à la liste des erreurs
                        this.addSyncError(operation, 'Nombre maximum de tentatives atteint');
                        processedOperations.push(operation.id);
                        return [4 /*yield*/, this.databaseService.removeSyncOperation(operation.id)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        failedOperations.push(operation);
                        return [4 /*yield*/, this.databaseService.updateSyncOperation(operation)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        error_3 = _b.sent();
                        console.error("Erreur lors du traitement de l'op\u00E9ration ".concat(operation.id, ":"), error_3);
                        operation.retryCount++;
                        failedOperations.push(operation);
                        this.addSyncError(operation, error_3 instanceof Error ? error_3.message : String(error_3));
                        return [4 /*yield*/, this.databaseService.updateSyncOperation(operation)];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 1];
                    case 13:
                        // Mettre à jour la queue
                        this.syncQueue = this.syncQueue.filter(function (op) { return !processedOperations.includes(op.id); });
                        this.syncStatus.pendingOperations = this.syncQueue.length;
                        this.syncStatus.lastSync = new Date().toISOString();
                        this.syncStatus.syncInProgress = false;
                        console.log("Synchronisation termin\u00E9e. R\u00E9ussies: ".concat(processedOperations.length, ", \u00C9chou\u00E9es: ").concat(failedOperations.length));
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.processOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        _a = operation.type;
                        switch (_a) {
                            case 'document': return [3 /*break*/, 1];
                            case 'author': return [3 /*break*/, 3];
                            case 'category': return [3 /*break*/, 5];
                            case 'borrower': return [3 /*break*/, 7];
                            case 'history': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this.syncDocument(operation)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.syncAuthor(operation)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.syncCategory(operation)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.syncBorrower(operation)];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9: return [4 /*yield*/, this.syncBorrowHistory(operation)];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11:
                        console.error("Type d'op\u00E9ration inconnu: ".concat(operation.type));
                        return [2 /*return*/, false];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_4 = _b.sent();
                        console.error("Erreur lors de la synchronisation de ".concat(operation.type, ":"), error_4);
                        return [2 /*return*/, false];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.syncDocument = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var op, data, _a, createdDoc;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        op = operation.operation, data = operation.data;
                        _a = op;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 1];
                            case 'update': return [3 /*break*/, 5];
                            case 'delete': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.supabaseService.createDocument(data)];
                    case 2:
                        createdDoc = _c.sent();
                        if (!createdDoc) return [3 /*break*/, 4];
                        // Mettre à jour l'ID distant local
                        return [4 /*yield*/, this.databaseService.updateDocumentRemoteId(data.localId, ((_b = createdDoc.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
                    case 3:
                        // Mettre à jour l'ID distant local
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.supabaseService.updateDocument(data)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this.supabaseService.deleteDocument(data.remoteId)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.syncAuthor = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var op, data, _a, createdAuthor;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        op = operation.operation, data = operation.data;
                        _a = op;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 1];
                            case 'update': return [3 /*break*/, 5];
                            case 'delete': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.supabaseService.createAuthor(data)];
                    case 2:
                        createdAuthor = _c.sent();
                        if (!createdAuthor) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.databaseService.updateAuthorRemoteId(data.localId, ((_b = createdAuthor.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.supabaseService.updateAuthor(data)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this.supabaseService.deleteAuthor(data.remoteId)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.syncCategory = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var op, data, _a, createdCategory;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        op = operation.operation, data = operation.data;
                        _a = op;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 1];
                            case 'update': return [3 /*break*/, 5];
                            case 'delete': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.supabaseService.createCategory(data)];
                    case 2:
                        createdCategory = _c.sent();
                        if (!createdCategory) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.databaseService.updateCategoryRemoteId(data.localId, ((_b = createdCategory.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.supabaseService.updateCategory(data)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this.supabaseService.deleteCategory(data.remoteId)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.syncBorrower = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var op, data, _a, createdBorrower;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        op = operation.operation, data = operation.data;
                        _a = op;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 1];
                            case 'update': return [3 /*break*/, 5];
                            case 'delete': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.supabaseService.createBorrower(data)];
                    case 2:
                        createdBorrower = _c.sent();
                        if (!createdBorrower) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.databaseService.updateBorrowerRemoteId(data.localId, ((_b = createdBorrower.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.supabaseService.updateBorrower(data)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this.supabaseService.deleteBorrower(data.remoteId)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.syncBorrowHistory = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var op, data, _a, createdHistory;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        op = operation.operation, data = operation.data;
                        _a = op;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 1];
                            case 'update': return [3 /*break*/, 5];
                            case 'delete': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.supabaseService.createBorrowHistory(data)];
                    case 2:
                        createdHistory = _c.sent();
                        if (!createdHistory) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.databaseService.updateBorrowHistoryRemoteId(data.localId, ((_b = createdHistory.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.supabaseService.updateBorrowHistory(data)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, this.supabaseService.deleteBorrowHistory(data.remoteId)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.addSyncError = function (operation, errorMessage) {
        var error = {
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
    };
    SyncService.prototype.generateOperationId = function () {
        return "sync_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    // Méthodes publiques pour l'API
    SyncService.prototype.getSyncStatus = function () {
        return __assign({}, this.syncStatus);
    };
    SyncService.prototype.getNetworkStatus = function () {
        return __assign({}, this.networkStatus);
    };
    SyncService.prototype.startManualSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.networkStatus.isOnline) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processSyncQueue()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: throw new Error('Aucune connexion réseau disponible');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.pauseSync = function () {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    };
    SyncService.prototype.resumeSync = function () {
        if (!this.syncInterval) {
            this.startAutoSync();
        }
    };
    SyncService.prototype.retrySyncOperation = function (operationId) {
        return __awaiter(this, void 0, void 0, function () {
            var operation, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operation = this.syncQueue.find(function (op) { return op.id === operationId; });
                        if (!operation)
                            return [2 /*return*/, false];
                        operation.retryCount = 0; // Reset retry count
                        if (!this.networkStatus.isOnline) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.processOperation(operation)];
                    case 1:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 3];
                        this.syncQueue = this.syncQueue.filter(function (op) { return op.id !== operationId; });
                        this.syncStatus.pendingOperations = this.syncQueue.length;
                        return [4 /*yield*/, this.databaseService.removeSyncOperation(operationId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, success];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    SyncService.prototype.getSyncErrors = function () {
        return __spreadArray([], this.syncStatus.errors, true);
    };
    SyncService.prototype.clearSyncErrors = function () {
        this.syncStatus.errors = [];
    };
    SyncService.prototype.resolveConflict = function (resolution) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        _a = resolution.resolution;
                        switch (_a) {
                            case 'use_local': return [3 /*break*/, 1];
                            case 'use_remote': return [3 /*break*/, 3];
                            case 'merge': return [3 /*break*/, 5];
                            case 'manual': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.forceUpdateRemote(resolution)];
                    case 2: 
                    // Utiliser la version locale et forcer la sync
                    return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.forceUpdateLocal(resolution)];
                    case 4: 
                    // Utiliser la version distante et mettre à jour local
                    return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.mergeVersions(resolution)];
                    case 6: 
                    // Fusionner les données (logique spécifique selon le type)
                    return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.applyManualResolution(resolution)];
                    case 8: 
                    // L'utilisateur a fourni une version résolue manuellement
                    return [2 /*return*/, _b.sent()];
                    case 9: return [2 /*return*/, false];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_5 = _b.sent();
                        console.error('Erreur lors de la résolution de conflit:', error_5);
                        return [2 /*return*/, false];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.forceUpdateRemote = function (resolution) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implémenter la mise à jour forcée du distant
                return [2 /*return*/, true];
            });
        });
    };
    SyncService.prototype.forceUpdateLocal = function (resolution) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implémenter la mise à jour forcée du local
                return [2 /*return*/, true];
            });
        });
    };
    SyncService.prototype.mergeVersions = function (resolution) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implémenter la fusion automatique
                return [2 /*return*/, true];
            });
        });
    };
    SyncService.prototype.applyManualResolution = function (resolution) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Appliquer la résolution manuelle fournie par l'utilisateur
                return [2 /*return*/, true];
            });
        });
    };
    SyncService.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                return [2 /*return*/];
            });
        });
    };
    return SyncService;
}());
exports.SyncService = SyncService;
