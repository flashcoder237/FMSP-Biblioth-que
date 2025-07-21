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
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var DatabaseService_1 = require("./services/DatabaseService");
var BackupService_1 = require("./services/BackupService");
var AuthService_1 = require("./services/AuthService");
var SettingsService_1 = require("./services/SettingsService");
var mainWindow;
var dbService;
var backupService;
var authService;
var settingsService;
function createWindow() {
    var _this = this;
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        titleBarStyle: 'hiddenInset',
        frame: false,
        show: false,
        icon: path.join(__dirname, '../assets/icon.png'), // Ajout d'une icône
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:8080');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });
    // Gestion de la fermeture de l'application
    mainWindow.on('close', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var settings, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(backupService && settingsService)) return [3 /*break*/, 5];
                    return [4 /*yield*/, settingsService.getSettings()];
                case 1:
                    settings = _a.sent();
                    if (!(settings === null || settings === void 0 ? void 0 : settings.backup.autoBackup)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, backupService.createBackup()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Erreur lors de la sauvegarde automatique:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
}
electron_1.app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Initialiser les services
                dbService = new DatabaseService_1.DatabaseService();
                return [4 /*yield*/, dbService.initialize()];
            case 1:
                _a.sent();
                backupService = new BackupService_1.BackupService(dbService);
                authService = new AuthService_1.AuthService();
                settingsService = new SettingsService_1.SettingsService();
                createWindow();
                electron_1.app.on('activate', function () {
                    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                        createWindow();
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Window Controls
electron_1.ipcMain.handle('window-controls:minimize', function () {
    mainWindow.minimize();
});
electron_1.ipcMain.handle('window-controls:maximize', function () {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.handle('window-controls:close', function () {
    mainWindow.close();
});
// Database Operations - Books
electron_1.ipcMain.handle('db:getBooks', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getBooks()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:addBook', function (_, book) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.addDocument(book)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:updateBook', function (_, book) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.updateDocument(book)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:deleteBook', function (_, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.deleteDocument(id)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:searchBooks', function (_, query) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.searchBooks(query)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Database Operations - Authors
electron_1.ipcMain.handle('db:getAuthors', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getAuthors()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:addAuthor', function (_, author) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.addAuthor(author)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Database Operations - Categories
electron_1.ipcMain.handle('db:getCategories', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getCategories()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:addCategory', function (_, category) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.addCategory(category)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Database Operations - Borrowers
electron_1.ipcMain.handle('db:getBorrowers', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getBorrowers()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:addBorrower', function (_, borrower) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.addBorrower(borrower)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:updateBorrower', function (_, borrower) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.updateBorrower(borrower)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:deleteBorrower', function (_, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.deleteBorrower(id)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:searchBorrowers', function (_, query) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.searchBorrowers(query)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Database Operations - Borrow Management
electron_1.ipcMain.handle('db:getBorrowedBooks', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getBorrowedBooks()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:borrowBook', function (_, bookId, borrowerId, expectedReturnDate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.borrowBook(bookId, borrowerId, expectedReturnDate)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:returnBook', function (_, borrowHistoryId, notes) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.returnBook(borrowHistoryId, notes)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:getBorrowHistory', function (_, filter) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getBorrowHistory(filter)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:getStats', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getStats()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Nouvelles opérations de base de données
electron_1.ipcMain.handle('db:clearAll', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.clearDatabase()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('db:export', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showSaveDialog(mainWindow, {
                    title: 'Exporter la base de données',
                    defaultPath: "bibliotheque_backup_".concat(new Date().toISOString().split('T')[0], ".db"),
                    filters: [
                        { name: 'Base de données', extensions: ['db'] },
                        { name: 'Tous les fichiers', extensions: ['*'] }
                    ]
                })];
            case 1:
                result = _a.sent();
                if (!result.filePath)
                    return [2 /*return*/, null];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, backupService.exportDatabase(result.filePath)];
            case 3:
                _a.sent();
                return [2 /*return*/, result.filePath];
            case 4:
                error_2 = _a.sent();
                console.error('Erreur lors de l\'export:', error_2);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('db:import', function (_, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, backupService.importDatabase(filePath)];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                error_3 = _a.sent();
                console.error('Erreur lors de l\'import:', error_3);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Settings Operations
electron_1.ipcMain.handle('settings:get', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, settingsService.getSettings()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('settings:save', function (_, settings) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, settingsService.saveUserSettings(settings)];
    });
}); });
// Backup Operations
electron_1.ipcMain.handle('backup:create', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, backupService.createBackup()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('backup:restore', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, {
                    title: 'Sélectionner une sauvegarde',
                    filters: [
                        { name: 'Sauvegardes', extensions: ['bak', 'backup'] },
                        { name: 'Tous les fichiers', extensions: ['*'] }
                    ],
                    properties: ['openFile']
                })];
            case 1:
                result = _a.sent();
                if (result.canceled || !result.filePaths[0])
                    return [2 /*return*/, false];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, backupService.restoreBackup(result.filePaths[0])];
            case 3:
                _a.sent();
                return [2 /*return*/, true];
            case 4:
                error_4 = _a.sent();
                console.error('Erreur lors de la restauration:', error_4);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Authentication Operations
electron_1.ipcMain.handle('auth:status', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, authService.isAuthenticated()];
    });
}); });
electron_1.ipcMain.handle('auth:login', function (_, credentials) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authService.login(credentials)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('auth:logout', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, authService.logout()];
    });
}); });
// File Operations
electron_1.ipcMain.handle('file:select', function (_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([_1], args_1, true), void 0, function (_, options) {
        var result;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, __assign({ properties: ['openFile'], filters: [
                            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
                            { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] },
                            { name: 'Tous les fichiers', extensions: ['*'] }
                        ] }, options))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.canceled ? null : result.filePaths[0]];
            }
        });
    });
});
electron_1.ipcMain.handle('file:selectDirectory', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, {
                    properties: ['openDirectory']
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.canceled ? null : result.filePaths[0]];
        }
    });
}); });
// Print Operations
electron_1.ipcMain.handle('print:inventory', function (_, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPrintWindow(data, 'inventory')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('print:available-books', function (_, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPrintWindow(data, 'available')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('print:borrowed-books', function (_, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPrintWindow(data, 'borrowed')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('print:borrow-history', function (_, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPrintWindow(data, 'history')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('export:csv', function (_, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exportToCSV(data)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Notification Operations
electron_1.ipcMain.handle('notification:show', function (_, title, body) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (electron_1.Notification.isSupported()) {
            new electron_1.Notification({
                title: title,
                body: body,
                icon: path.join(__dirname, '../assets/icon.png')
            }).show();
        }
        return [2 /*return*/];
    });
}); });
// System Operations
electron_1.ipcMain.handle('system:info', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                platform: process.platform,
                arch: process.arch,
                version: process.version,
                appVersion: electron_1.app.getVersion(),
                electronVersion: process.versions.electron,
                chromeVersion: process.versions.chrome,
                nodeVersion: process.versions.node
            }];
    });
}); });
electron_1.ipcMain.handle('system:checkUpdates', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Placeholder pour la vérification des mises à jour
        return [2 /*return*/, {
                hasUpdate: false,
                currentVersion: electron_1.app.getVersion(),
                latestVersion: electron_1.app.getVersion()
            }];
    });
}); });
// Theme Operations
electron_1.ipcMain.handle('theme:set', function (_, theme) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, settingsService.setTheme(theme)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('theme:get', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, settingsService.getTheme()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// Statistics Operations
electron_1.ipcMain.handle('stats:advanced', function () { return __awaiter(void 0, void 0, void 0, function () {
    var basicStats, borrowHistory, now, monthlyBorrows, averageBorrowDuration, topCategories, topBorrowers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dbService.getStats()];
            case 1:
                basicStats = _a.sent();
                return [4 /*yield*/, dbService.getBorrowHistory()];
            case 2:
                borrowHistory = _a.sent();
                now = new Date();
                monthlyBorrows = borrowHistory.filter(function (h) {
                    var borrowDate = new Date(h.borrowDate);
                    return borrowDate.getMonth() === now.getMonth() && borrowDate.getFullYear() === now.getFullYear();
                }).length;
                averageBorrowDuration = borrowHistory
                    .filter(function (h) { return h.actualReturnDate; })
                    .reduce(function (acc, h) {
                    var borrowed = new Date(h.borrowDate);
                    var returned = new Date(h.actualReturnDate);
                    var duration = (returned.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24);
                    return acc + duration;
                }, 0) / borrowHistory.filter(function (h) { return h.actualReturnDate; }).length || 0;
                return [4 /*yield*/, getTopCategories()];
            case 3:
                topCategories = _a.sent();
                return [4 /*yield*/, getTopBorrowers()];
            case 4:
                topBorrowers = _a.sent();
                return [2 /*return*/, __assign(__assign({}, basicStats), { monthlyBorrows: monthlyBorrows, averageBorrowDuration: Math.round(averageBorrowDuration), topCategories: topCategories, topBorrowers: topBorrowers })];
        }
    });
}); });
function getTopCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var books, categoryCounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbService.getBooks()];
                case 1:
                    books = _a.sent();
                    categoryCounts = books.reduce(function (acc, book) {
                        acc[book.category] = (acc[book.category] || 0) + 1;
                        return acc;
                    }, {});
                    return [2 /*return*/, Object.entries(categoryCounts)
                            .sort(function (_a, _b) {
                            var a = _a[1];
                            var b = _b[1];
                            return b - a;
                        })
                            .slice(0, 5)
                            .map(function (_a) {
                            var category = _a[0], count = _a[1];
                            return ({ category: category, count: count });
                        })];
            }
        });
    });
}
function getTopBorrowers() {
    return __awaiter(this, void 0, void 0, function () {
        var history, borrowerCounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbService.getBorrowHistory()];
                case 1:
                    history = _a.sent();
                    borrowerCounts = history.reduce(function (acc, h) {
                        var _a, _b;
                        var key = "".concat((_a = h.borrower) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = h.borrower) === null || _b === void 0 ? void 0 : _b.lastName);
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                    }, {});
                    return [2 /*return*/, Object.entries(borrowerCounts)
                            .sort(function (_a, _b) {
                            var a = _a[1];
                            var b = _b[1];
                            return b - a;
                        })
                            .slice(0, 5)
                            .map(function (_a) {
                            var borrower = _a[0], count = _a[1];
                            return ({ borrower: borrower, count: count });
                        })];
            }
        });
    });
}
function createPrintWindow(data, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var printWindow = new electron_1.BrowserWindow({
                        width: 800,
                        height: 600,
                        show: false,
                        webPreferences: {
                            nodeIntegration: false,
                            contextIsolation: true,
                        }
                    });
                    var htmlContent = generatePrintHTML(data, type);
                    printWindow.loadURL("data:text/html;charset=utf-8,".concat(encodeURIComponent(htmlContent)));
                    printWindow.webContents.once('did-finish-load', function () {
                        printWindow.webContents.print({
                            silent: false,
                            printBackground: true,
                            margins: {
                                marginType: 'default'
                            }
                        }, function (success, failureReason) {
                            printWindow.close();
                            if (!success) {
                                console.error('Print failed:', failureReason);
                            }
                            resolve(success);
                        });
                    });
                })];
        });
    });
}
function generatePrintHTML(data, type) {
    var now = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    var title = '';
    var content = '';
    switch (type) {
        case 'inventory':
            title = 'Inventaire Complet de la Bibliothèque';
            content = generateInventoryContent(data);
            break;
        case 'available':
            title = 'Liste des Livres Disponibles';
            content = generateAvailableBooksContent(data);
            break;
        case 'borrowed':
            title = 'Liste des Livres Empruntés';
            content = generateBorrowedBooksContent(data);
            break;
        case 'history':
            title = 'Historique des Emprunts';
            content = generateHistoryContent(data);
            break;
    }
    return "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"UTF-8\">\n      <title>".concat(title, "</title>\n      <style>\n        @page { \n          margin: 20mm; \n          size: A4; \n        }\n        body {\n          font-family: 'Segoe UI', Arial, sans-serif;\n          margin: 0; \n          padding: 0; \n          color: #2E2E2E; \n          line-height: 1.4;\n          font-size: 12px;\n        }\n        .header {\n          border-bottom: 3px solid #3E5C49;\n          padding-bottom: 20px; \n          margin-bottom: 30px;\n        }\n        .header h1 {\n          color: #3E5C49; \n          margin: 0 0 10px 0;\n          font-size: 24px; \n          font-weight: 700;\n        }\n        .header .subtitle { \n          color: #6E6E6E; \n          font-size: 14px; \n          margin: 5px 0; \n        }\n        .header .date { \n          color: #6E6E6E; \n          font-size: 11px; \n          margin-top: 10px; \n        }\n        .stats-summary {\n          background: #F3EED9; \n          border: 1px solid #E5DCC2;\n          border-radius: 8px; \n          padding: 15px; \n          margin-bottom: 25px;\n          display: grid; \n          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); \n          gap: 15px;\n        }\n        .stat-item { \n          text-align: center; \n        }\n        .stat-value {\n          font-size: 20px; \n          font-weight: 700;\n          color: #3E5C49; \n          margin-bottom: 5px;\n        }\n        .stat-label {\n          font-size: 10px; \n          color: #6E6E6E;\n          text-transform: uppercase; \n          letter-spacing: 0.5px;\n        }\n        .content-table {\n          width: 100%; \n          border-collapse: collapse;\n          margin-bottom: 20px; \n          font-size: 10px;\n        }\n        .content-table th, .content-table td {\n          padding: 8px 6px; \n          text-align: left; \n          border-bottom: 1px solid #E5DCC2;\n          word-wrap: break-word;\n        }\n        .content-table th {\n          background: #F3EED9; \n          font-weight: 600;\n          color: #2E2E2E; \n          border-bottom: 2px solid #E5DCC2;\n          font-size: 9px;\n        }\n        .content-table tr:nth-child(even) { \n          background: #FAF9F6; \n        }\n        .category-tag {\n          background: #3E5C49; \n          color: white;\n          padding: 1px 6px; \n          border-radius: 10px;\n          font-size: 8px; \n          font-weight: 500;\n        }\n        .status-available { \n          color: #3E5C49; \n          font-weight: 600; \n        }\n        .status-borrowed { \n          color: #C2571B; \n          font-weight: 600; \n        }\n        .status-returned { \n          color: #3E5C49; \n          font-weight: 600; \n        }\n        .status-overdue { \n          color: #DC2626; \n          font-weight: 600; \n        }\n        .borrower-type {\n          font-size: 8px;\n          text-transform: uppercase;\n          font-weight: 600;\n          color: #6E6E6E;\n        }\n        .page-break {\n          page-break-before: always;\n        }\n      </style>\n    </head>\n    <body>\n      <div class=\"header\">\n        <h1>").concat(title, "</h1>\n        <div class=\"subtitle\">Syst\u00E8me de Gestion de Biblioth\u00E8que</div>\n        <div class=\"date\">G\u00E9n\u00E9r\u00E9 le ").concat(now, "</div>\n      </div>\n      ").concat(content, "\n    </body>\n    </html>\n    ");
}
function generateInventoryContent(data) {
    var books = data.books, stats = data.stats;
    return "\n    <div class=\"stats-summary\">\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">".concat(stats.totalBooks, "</div>\n        <div class=\"stat-label\">Total Livres</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.availableBooks, "</div>\n        <div class=\"stat-label\">Disponibles</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.borrowedBooks, "</div>\n        <div class=\"stat-label\">Emprunt\u00E9s</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.totalAuthors, "</div>\n        <div class=\"stat-label\">Auteurs</div>\n      </div>\n    </div>\n    \n    <table class=\"content-table\">\n      <thead>\n        <tr>\n          <th style=\"width: 25%;\">Titre</th>\n          <th style=\"width: 20%;\">Auteur</th>\n          <th style=\"width: 15%;\">Cat\u00E9gorie</th>\n          <th style=\"width: 10%;\">ISBN</th>\n          <th style=\"width: 8%;\">Ann\u00E9e</th>\n          <th style=\"width: 10%;\">Statut</th>\n          <th style=\"width: 12%;\">Emprunteur/Date</th>\n        </tr>\n      </thead>\n      <tbody>\n        ").concat(books.map(function (book) {
        var _a, _b;
        return "\n          <tr>\n            <td><strong>".concat(book.title, "</strong></td>\n            <td>").concat(book.author, "</td>\n            <td><span class=\"category-tag\">").concat(book.category, "</span></td>\n            <td>").concat(book.isbn || '-', "</td>\n            <td>").concat(book.publishedDate || '-', "</td>\n            <td>\n              <span class=\"").concat(book.isBorrowed ? 'status-borrowed' : 'status-available', "\">\n                ").concat(book.isBorrowed ? 'Emprunté' : 'Disponible', "\n              </span>\n            </td>\n            <td>\n              ").concat(book.borrowerId ? "".concat(((_a = book.borrower) === null || _a === void 0 ? void 0 : _a.firstName) || '', " ").concat(((_b = book.borrower) === null || _b === void 0 ? void 0 : _b.lastName) || '', "<br/>") : '-', "\n              ").concat(book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '', "\n            </td>\n          </tr>\n        ");
    }).join(''), "\n      </tbody>\n    </table>\n  ");
}
function generateAvailableBooksContent(data) {
    var books = data.books, stats = data.stats;
    var availableBooks = books.filter(function (book) { return !book.isBorrowed; });
    return "\n    <div class=\"stats-summary\">\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">".concat(availableBooks.length, "</div>\n        <div class=\"stat-label\">Livres Disponibles</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.totalBooks, "</div>\n        <div class=\"stat-label\">Total Livres</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(((availableBooks.length / (stats.totalBooks || 1)) * 100).toFixed(1), "%</div>\n        <div class=\"stat-label\">Taux Disponibilit\u00E9</div>\n      </div>\n    </div>\n    \n    <table class=\"content-table\">\n      <thead>\n        <tr>\n          <th style=\"width: 30%;\">Titre</th>\n          <th style=\"width: 25%;\">Auteur</th>\n          <th style=\"width: 15%;\">Cat\u00E9gorie</th>\n          <th style=\"width: 15%;\">ISBN</th>\n          <th style=\"width: 15%;\">Ann\u00E9e Publication</th>\n        </tr>\n      </thead>\n      <tbody>\n        ").concat(availableBooks.map(function (book) { return "\n          <tr>\n            <td><strong>".concat(book.title, "</strong></td>\n            <td>").concat(book.author, "</td>\n            <td><span class=\"category-tag\">").concat(book.category, "</span></td>\n            <td>").concat(book.isbn || '-', "</td>\n            <td>").concat(book.publishedDate || '-', "</td>\n          </tr>\n        "); }).join(''), "\n      </tbody>\n    </table>\n  ");
}
function generateBorrowedBooksContent(data) {
    var history = data.history;
    return "\n    <div class=\"stats-summary\">\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">".concat(history.length, "</div>\n        <div class=\"stat-label\">Livres Emprunt\u00E9s</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(history.filter(function (h) { return h.status === 'overdue'; }).length, "</div>\n        <div class=\"stat-label\">En Retard</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(history.filter(function (h) { var _a; return ((_a = h.borrower) === null || _a === void 0 ? void 0 : _a.type) === 'student'; }).length, "</div>\n        <div class=\"stat-label\">\u00C9tudiants</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(history.filter(function (h) { var _a; return ((_a = h.borrower) === null || _a === void 0 ? void 0 : _a.type) === 'staff'; }).length, "</div>\n        <div class=\"stat-label\">Personnel</div>\n      </div>\n    </div>\n    \n    <table class=\"content-table\">\n      <thead>\n        <tr>\n          <th style=\"width: 20%;\">Livre</th>\n          <th style=\"width: 15%;\">Auteur</th>\n          <th style=\"width: 15%;\">Emprunteur</th>\n          <th style=\"width: 10%;\">Type</th>\n          <th style=\"width: 12%;\">Matricule/Classe</th>\n          <th style=\"width: 10%;\">Date Emprunt</th>\n          <th style=\"width: 10%;\">Retour Pr\u00E9vu</th>\n          <th style=\"width: 8%;\">Statut</th>\n        </tr>\n      </thead>\n      <tbody>\n        ").concat(history.map(function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var borrowDate = new Date(item.borrowDate);
        var expectedDate = new Date(item.expectedReturnDate);
        var today = new Date();
        var isOverdue = today > expectedDate && item.status === 'active';
        return "\n            <tr>\n              <td><strong>".concat((_a = item.book) === null || _a === void 0 ? void 0 : _a.title, "</strong></td>\n              <td>").concat((_b = item.book) === null || _b === void 0 ? void 0 : _b.author, "</td>\n              <td><strong>").concat((_c = item.borrower) === null || _c === void 0 ? void 0 : _c.firstName, " ").concat((_d = item.borrower) === null || _d === void 0 ? void 0 : _d.lastName, "</strong></td>\n              <td>\n                <span class=\"borrower-type\">\n                  ").concat(((_e = item.borrower) === null || _e === void 0 ? void 0 : _e.type) === 'student' ? 'Étudiant' : 'Personnel', "\n                </span>\n              </td>\n              <td>\n                ").concat((_f = item.borrower) === null || _f === void 0 ? void 0 : _f.matricule, "<br/>\n                <small>").concat(((_g = item.borrower) === null || _g === void 0 ? void 0 : _g.type) === 'student' ? ((_h = item.borrower) === null || _h === void 0 ? void 0 : _h.classe) || '' : ((_j = item.borrower) === null || _j === void 0 ? void 0 : _j.position) || '', "</small>\n              </td>\n              <td>").concat(borrowDate.toLocaleDateString('fr-FR'), "</td>\n              <td>").concat(expectedDate.toLocaleDateString('fr-FR'), "</td>\n              <td>\n                <span class=\"").concat(isOverdue ? 'status-overdue' : item.status === 'returned' ? 'status-returned' : 'status-borrowed', "\">\n                  ").concat(isOverdue ? 'En retard' : item.status === 'returned' ? 'Rendu' : 'En cours', "\n                </span>\n              </td>\n            </tr>\n          ");
    }).join(''), "\n      </tbody>\n    </table>\n  ");
}
function generateHistoryContent(data) {
    var history = data.history, filters = data.filters, stats = data.stats;
    var filterInfo = [];
    if (filters.startDate)
        filterInfo.push("Du ".concat(new Date(filters.startDate).toLocaleDateString('fr-FR')));
    if (filters.endDate)
        filterInfo.push("Au ".concat(new Date(filters.endDate).toLocaleDateString('fr-FR')));
    if (filters.borrowerType && filters.borrowerType !== 'all') {
        filterInfo.push("Type: ".concat(filters.borrowerType === 'student' ? 'Étudiants' : 'Personnel'));
    }
    if (filters.status && filters.status !== 'all') {
        var statusLabels = {
            active: 'En cours',
            returned: 'Rendus',
            overdue: 'En retard'
        };
        filterInfo.push("Statut: ".concat(statusLabels[filters.status]));
    }
    return "\n    ".concat(filterInfo.length > 0 ? "\n      <div style=\"background: #F3EED9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #E5DCC2;\">\n        <strong>Filtres appliqu\u00E9s:</strong> ".concat(filterInfo.join(' • '), "\n      </div>\n    ") : '', "\n    \n    <div class=\"stats-summary\">\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.total, "</div>\n        <div class=\"stat-label\">Total Emprunts</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.active, "</div>\n        <div class=\"stat-label\">En Cours</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.returned, "</div>\n        <div class=\"stat-label\">Rendus</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.overdue, "</div>\n        <div class=\"stat-label\">En Retard</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.students, "</div>\n        <div class=\"stat-label\">\u00C9tudiants</div>\n      </div>\n      <div class=\"stat-item\">\n        <div class=\"stat-value\">").concat(stats.staff, "</div>\n        <div class=\"stat-label\">Personnel</div>\n      </div>\n    </div>\n    \n    <table class=\"content-table\">\n      <thead>\n        <tr>\n          <th style=\"width: 18%;\">Livre</th>\n          <th style=\"width: 12%;\">Auteur</th>\n          <th style=\"width: 15%;\">Emprunteur</th>\n          <th style=\"width: 8%;\">Type</th>\n          <th style=\"width: 10%;\">Matricule</th>\n          <th style=\"width: 10%;\">Date Emprunt</th>\n          <th style=\"width: 10%;\">Retour Pr\u00E9vu</th>\n          <th style=\"width: 10%;\">Retour Effectu\u00E9</th>\n          <th style=\"width: 7%;\">Statut</th>\n        </tr>\n      </thead>\n      <tbody>\n        ").concat(history.map(function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var borrowDate = new Date(item.borrowDate);
        var expectedDate = new Date(item.expectedReturnDate);
        var actualDate = item.actualReturnDate ? new Date(item.actualReturnDate) : null;
        return "\n            <tr>\n              <td><strong>".concat((_a = item.book) === null || _a === void 0 ? void 0 : _a.title, "</strong></td>\n              <td>").concat((_b = item.book) === null || _b === void 0 ? void 0 : _b.author, "</td>\n              <td><strong>").concat((_c = item.borrower) === null || _c === void 0 ? void 0 : _c.firstName, " ").concat((_d = item.borrower) === null || _d === void 0 ? void 0 : _d.lastName, "</strong></td>\n              <td>\n                <span class=\"borrower-type\">\n                  ").concat(((_e = item.borrower) === null || _e === void 0 ? void 0 : _e.type) === 'student' ? 'ÉTU' : 'PERS', "\n                </span>\n              </td>\n              <td>\n                ").concat((_f = item.borrower) === null || _f === void 0 ? void 0 : _f.matricule, "<br/>\n                <small>").concat(((_g = item.borrower) === null || _g === void 0 ? void 0 : _g.type) === 'student' ? ((_h = item.borrower) === null || _h === void 0 ? void 0 : _h.classe) || '' : ((_j = item.borrower) === null || _j === void 0 ? void 0 : _j.position) || '', "</small>\n              </td>\n              <td>\n                ").concat(borrowDate.toLocaleDateString('fr-FR'), "<br/>\n                <small>").concat(borrowDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), "</small>\n              </td>\n              <td>").concat(expectedDate.toLocaleDateString('fr-FR'), "</td>\n              <td>\n                ").concat(actualDate ? "\n                  ".concat(actualDate.toLocaleDateString('fr-FR'), "<br/>\n                  <small>").concat(actualDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), "</small>\n                ") : '-', "\n              </td>\n              <td>\n                <span class=\"status-").concat(item.status, "\">\n                  ").concat(item.status === 'active' ? 'En cours' :
            item.status === 'returned' ? 'Rendu' : 'En retard', "\n                </span>\n              </td>\n            </tr>\n          ");
    }).join(''), "\n      </tbody>\n    </table>\n    \n    ").concat(history.some(function (item) { return item.notes; }) ? "\n      <div class=\"page-break\"></div>\n      <h2 style=\"color: #3E5C49; margin-top: 30px;\">Notes et Observations</h2>\n      <table class=\"content-table\">\n        <thead>\n          <tr>\n            <th style=\"width: 25%;\">Livre</th>\n            <th style=\"width: 20%;\">Emprunteur</th>\n            <th style=\"width: 15%;\">Date Retour</th>\n            <th style=\"width: 40%;\">Notes</th>\n          </tr>\n        </thead>\n        <tbody>\n          ".concat(history.filter(function (item) { return item.notes; }).map(function (item) {
        var _a, _b, _c;
        return "\n            <tr>\n              <td><strong>".concat((_a = item.book) === null || _a === void 0 ? void 0 : _a.title, "</strong></td>\n              <td>").concat((_b = item.borrower) === null || _b === void 0 ? void 0 : _b.firstName, " ").concat((_c = item.borrower) === null || _c === void 0 ? void 0 : _c.lastName, "</td>\n              <td>").concat(item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString('fr-FR') : '-', "</td>\n              <td>").concat(item.notes, "</td>\n            </tr>\n          ");
    }).join(''), "\n        </tbody>\n      </table>\n    ") : '', "\n  ");
}
function exportToCSV(data) {
    return __awaiter(this, void 0, void 0, function () {
        var result, csvContent, csvHeaders, csvRows, books, csvHeaders, csvRows, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, electron_1.dialog.showSaveDialog(mainWindow, {
                            title: 'Exporter en CSV',
                            defaultPath: "bibliotheque_export_".concat(new Date().toISOString().split('T')[0], ".csv"),
                            filters: [
                                { name: 'CSV Files', extensions: ['csv'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        })];
                case 1:
                    result = _a.sent();
                    if (!result.filePath)
                        return [2 /*return*/, null];
                    csvContent = '';
                    // Déterminer le type de données à exporter
                    if (data.history) {
                        csvHeaders = [
                            'Date Emprunt',
                            'Heure Emprunt',
                            'Livre',
                            'Auteur',
                            'Catégorie',
                            'ISBN',
                            'Emprunteur',
                            'Type Emprunteur',
                            'Matricule',
                            'Classe/Poste',
                            'Date Retour Prévue',
                            'Date Retour Effective',
                            'Heure Retour',
                            'Statut',
                            'Durée (jours)',
                            'Retard (jours)',
                            'Notes'
                        ];
                        csvRows = data.history.map(function (item) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                            var borrowDate = new Date(item.borrowDate);
                            var expectedDate = new Date(item.expectedReturnDate);
                            var actualDate = item.actualReturnDate ? new Date(item.actualReturnDate) : null;
                            var duration = actualDate ?
                                Math.ceil((actualDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)) :
                                Math.ceil((new Date().getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
                            var overdue = item.status === 'overdue' || (item.status === 'active' && new Date() > expectedDate) ?
                                Math.ceil((new Date().getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                            return [
                                "\"".concat(borrowDate.toLocaleDateString('fr-FR'), "\""),
                                "\"".concat(borrowDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), "\""),
                                "\"".concat((((_a = item.book) === null || _a === void 0 ? void 0 : _a.title) || '').replace(/"/g, '""'), "\""),
                                "\"".concat((((_b = item.book) === null || _b === void 0 ? void 0 : _b.author) || '').replace(/"/g, '""'), "\""),
                                "\"".concat((((_c = item.book) === null || _c === void 0 ? void 0 : _c.category) || '').replace(/"/g, '""'), "\""),
                                "\"".concat((((_d = item.book) === null || _d === void 0 ? void 0 : _d.isbn) || '').replace(/"/g, '""'), "\""),
                                "\"".concat((((_e = item.borrower) === null || _e === void 0 ? void 0 : _e.firstName) || ''), " ").concat((((_f = item.borrower) === null || _f === void 0 ? void 0 : _f.lastName) || ''), "\""),
                                "\"".concat(((_g = item.borrower) === null || _g === void 0 ? void 0 : _g.type) === 'student' ? 'Étudiant' : 'Personnel', "\""),
                                "\"".concat((((_h = item.borrower) === null || _h === void 0 ? void 0 : _h.matricule) || '').replace(/"/g, '""'), "\""),
                                "\"".concat(((_j = item.borrower) === null || _j === void 0 ? void 0 : _j.type) === 'student' ? (((_k = item.borrower) === null || _k === void 0 ? void 0 : _k.classe) || '') : (((_l = item.borrower) === null || _l === void 0 ? void 0 : _l.position) || ''), "\""),
                                "\"".concat(expectedDate.toLocaleDateString('fr-FR'), "\""),
                                "\"".concat(actualDate ? actualDate.toLocaleDateString('fr-FR') : '', "\""),
                                "\"".concat(actualDate ? actualDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '', "\""),
                                "\"".concat(item.status === 'active' ? 'En cours' : item.status === 'returned' ? 'Rendu' : 'En retard', "\""),
                                "\"".concat(duration, "\""),
                                "\"".concat(overdue > 0 ? overdue : '', "\""),
                                "\"".concat((item.notes || '').replace(/"/g, '""'), "\"")
                            ];
                        });
                        csvContent = __spreadArray([csvHeaders.join(',')], csvRows.map(function (row) { return row.join(','); }), true).join('\n');
                    }
                    else {
                        books = data.books;
                        csvHeaders = [
                            'Titre',
                            'Auteur',
                            'Catégorie',
                            'ISBN',
                            'Année Publication',
                            'Description',
                            'Statut',
                            'Emprunteur',
                            'Date Emprunt',
                            'Date Retour Prévue'
                        ];
                        csvRows = books.map(function (book) { return [
                            "\"".concat((book.title || '').replace(/"/g, '""'), "\""),
                            "\"".concat((book.author || '').replace(/"/g, '""'), "\""),
                            "\"".concat((book.category || '').replace(/"/g, '""'), "\""),
                            "\"".concat((book.isbn || '').replace(/"/g, '""'), "\""),
                            "\"".concat((book.publishedDate || '').replace(/"/g, '""'), "\""),
                            "\"".concat((book.description || '').replace(/"/g, '""'), "\""),
                            "\"".concat(book.isBorrowed ? 'Emprunté' : 'Disponible', "\""),
                            "\"".concat(book.borrower ? "".concat(book.borrower.firstName, " ").concat(book.borrower.lastName) : '', "\""),
                            "\"".concat(book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '', "\""),
                            "\"".concat(book.expectedReturnDate ? new Date(book.expectedReturnDate).toLocaleDateString('fr-FR') : '', "\"")
                        ]; });
                        csvContent = __spreadArray([csvHeaders.join(',')], csvRows.map(function (row) { return row.join(','); }), true).join('\n');
                    }
                    fs.writeFileSync(result.filePath, '\ufeff' + csvContent, 'utf8');
                    return [2 /*return*/, result.filePath];
                case 2:
                    error_5 = _a.sent();
                    console.error('Export CSV failed:', error_5);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
