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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
var sqlite3 = require("sqlite3");
var path = require("path");
var electron_1 = require("electron");
var preload_1 = require("../preload");
var DatabaseService = /** @class */ (function () {
    function DatabaseService() {
        var dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
        this.db = new sqlite3.Database(dbPath);
    }
    DatabaseService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.serialize(function () {
                            // Table des auteurs avec support sync
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS authors (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            name TEXT NOT NULL UNIQUE,\n            biography TEXT,\n            birthDate TEXT,\n            nationality TEXT,\n            -- M\u00E9tadonn\u00E9es de synchronisation\n            localId TEXT UNIQUE,\n            remoteId TEXT,\n            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),\n            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,\n            version INTEGER DEFAULT 1,\n            deletedAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n          )\n        ");
                            // Table des catégories avec support sync
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS categories (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            name TEXT NOT NULL UNIQUE,\n            description TEXT,\n            color TEXT DEFAULT '#3E5C49',\n            -- M\u00E9tadonn\u00E9es de synchronisation\n            localId TEXT UNIQUE,\n            remoteId TEXT,\n            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),\n            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,\n            version INTEGER DEFAULT 1,\n            deletedAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n          )\n        ");
                            // Table des emprunteurs avec support sync
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS borrowers (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            type TEXT NOT NULL CHECK (type IN ('student', 'staff')),\n            firstName TEXT NOT NULL,\n            lastName TEXT NOT NULL,\n            matricule TEXT NOT NULL UNIQUE,\n            classe TEXT,\n            cniNumber TEXT,\n            position TEXT,\n            email TEXT,\n            phone TEXT,\n            -- M\u00E9tadonn\u00E9es de synchronisation\n            localId TEXT UNIQUE,\n            remoteId TEXT,\n            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),\n            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,\n            version INTEGER DEFAULT 1,\n            deletedAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n          )\n        ");
                            // Table des documents (nouvelle structure)
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS documents (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            \n            -- Champs principaux requis\n            auteur TEXT NOT NULL,\n            titre TEXT NOT NULL,\n            editeur TEXT NOT NULL,\n            lieuEdition TEXT NOT NULL,\n            annee TEXT NOT NULL,\n            descripteurs TEXT NOT NULL,\n            cote TEXT NOT NULL UNIQUE,\n            \n            -- Champs optionnels\n            isbn TEXT,\n            description TEXT,\n            couverture TEXT,\n            \n            -- Statut d'emprunt\n            estEmprunte BOOLEAN DEFAULT 0,\n            emprunteurId INTEGER,\n            dateEmprunt TEXT,\n            dateRetourPrevu TEXT,\n            dateRetour TEXT,\n            \n            -- M\u00E9tadonn\u00E9es de synchronisation\n            localId TEXT UNIQUE,\n            remoteId TEXT,\n            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),\n            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,\n            version INTEGER DEFAULT 1,\n            deletedAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            \n            FOREIGN KEY (emprunteurId) REFERENCES borrowers(id)\n          )\n        ");
                            // Vue pour compatibilité avec l'ancienne table books
                            _this.db.run("\n          CREATE VIEW IF NOT EXISTS books_view AS\n          SELECT \n            id,\n            titre AS title,\n            auteur AS author,\n            isbn,\n            descripteurs AS category,\n            annee AS publishedDate,\n            description,\n            couverture AS coverUrl,\n            estEmprunte AS isBorrowed,\n            emprunteurId AS borrowerId,\n            dateEmprunt AS borrowDate,\n            dateRetourPrevu AS expectedReturnDate,\n            dateRetour AS returnDate,\n            createdAt\n          FROM documents\n          WHERE deletedAt IS NULL\n        ");
                            // Table historique des emprunts avec support sync
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS borrow_history (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            bookId INTEGER NOT NULL,\n            borrowerId INTEGER NOT NULL,\n            borrowDate DATETIME NOT NULL,\n            expectedReturnDate DATETIME NOT NULL,\n            actualReturnDate DATETIME,\n            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),\n            notes TEXT,\n            -- M\u00E9tadonn\u00E9es de synchronisation\n            localId TEXT UNIQUE,\n            remoteId TEXT,\n            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),\n            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,\n            version INTEGER DEFAULT 1,\n            deletedAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (bookId) REFERENCES documents(id),\n            FOREIGN KEY (borrowerId) REFERENCES borrowers(id)\n          )\n        ");
                            // Table de queue de synchronisation
                            _this.db.run("\n          CREATE TABLE IF NOT EXISTS sync_queue (\n            id TEXT PRIMARY KEY,\n            type TEXT NOT NULL CHECK (type IN ('document', 'author', 'category', 'borrower', 'history')),\n            operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),\n            data TEXT NOT NULL,\n            timestamp DATETIME NOT NULL,\n            retryCount INTEGER DEFAULT 0,\n            maxRetries INTEGER DEFAULT 3,\n            lastError TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n          )\n        ", function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    _this.seedInitialData().then(resolve).catch(reject);
                                }
                            });
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.seedInitialData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var existingDocuments, categories, authors, borrowers, documents, _i, categories_1, category, _a, authors_1, author, _b, borrowers_1, borrower, _c, documents_1, document_1, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 18, , 19]);
                        return [4 /*yield*/, this.getDocuments()];
                    case 1:
                        existingDocuments = _d.sent();
                        if (existingDocuments.length > 0) {
                            console.log('Base de données déjà initialisée');
                            return [2 /*return*/];
                        }
                        categories = [
                            { name: 'Fiction', description: 'Romans et nouvelles', color: '#3E5C49' },
                            { name: 'Science-Fiction', description: 'Littérature futuriste', color: '#C2571B' },
                            { name: 'Histoire', description: 'Livres historiques', color: '#6E6E6E' },
                            { name: 'Biographie', description: 'Vies de personnalités', color: '#3E5C49' },
                            { name: 'Sciences', description: 'Ouvrages scientifiques', color: '#C2571B' },
                            { name: 'Philosophie', description: 'Réflexions philosophiques', color: '#6E6E6E' },
                        ];
                        authors = [
                            { name: 'Victor Hugo', biography: 'Écrivain français du XIXe siècle', nationality: 'Française' },
                            { name: 'Albert Camus', biography: 'Philosophe et écrivain français', nationality: 'Française' },
                            { name: 'Isaac Asimov', biography: 'Auteur de science-fiction', nationality: 'Américaine' },
                            { name: 'Marie Curie', biography: 'Physicienne et chimiste', nationality: 'Française' },
                            { name: 'Jules Verne', biography: 'Écrivain français de science-fiction', nationality: 'Française' },
                        ];
                        borrowers = [
                            {
                                type: 'student',
                                firstName: 'Jean',
                                lastName: 'Dupont',
                                matricule: 'ET001',
                                classe: 'Terminale C',
                                email: 'jean.dupont@ecole.cm'
                            },
                            {
                                type: 'student',
                                firstName: 'Marie',
                                lastName: 'Martin',
                                matricule: 'ET002',
                                classe: 'Première D',
                                email: 'marie.martin@ecole.cm'
                            },
                            {
                                type: 'staff',
                                firstName: 'Paul',
                                lastName: 'Nguyen',
                                matricule: 'ENS001',
                                position: 'Professeur de Mathématiques',
                                cniNumber: '123456789',
                                email: 'paul.nguyen@ecole.cm'
                            }
                        ];
                        documents = [
                            {
                                auteur: 'Victor Hugo',
                                titre: 'Les Misérables',
                                editeur: 'Gallimard',
                                lieuEdition: 'Paris',
                                annee: '1862',
                                descripteurs: 'Fiction, Roman historique, XIXe siècle, France',
                                cote: 'FIC-HUG-001',
                                isbn: '978-2-253-00001-1',
                                description: 'Roman historique français décrivant la vie de divers personnages français dans la première moitié du XIXe siècle.',
                                estEmprunte: false,
                                syncStatus: 'synced',
                                lastModified: new Date().toISOString(),
                                version: 1
                            },
                            {
                                auteur: 'Albert Camus',
                                titre: 'L\'Étranger',
                                editeur: 'Gallimard',
                                lieuEdition: 'Paris',
                                annee: '1942',
                                descripteurs: 'Fiction, Philosophie, Absurde, Littérature française',
                                cote: 'FIC-CAM-001',
                                isbn: '978-2-253-00002-2',
                                description: 'Premier roman d\'Albert Camus, publié en 1942. Il prend place dans la lignée des récits qui illustrent la philosophie de l\'absurde.',
                                estEmprunte: false,
                                syncStatus: 'synced',
                                lastModified: new Date().toISOString(),
                                version: 1
                            },
                            {
                                auteur: 'Isaac Asimov',
                                titre: 'Fondation',
                                editeur: 'Denoël',
                                lieuEdition: 'Paris',
                                annee: '1951',
                                descripteurs: 'Science-Fiction, Futur, Empire galactique, Psychohistoire',
                                cote: 'SF-ASI-001',
                                isbn: '978-2-253-00003-3',
                                description: 'Premier tome du cycle de Fondation, une saga de science-fiction se déroulant dans un futur lointain.',
                                estEmprunte: false,
                                syncStatus: 'synced',
                                lastModified: new Date().toISOString(),
                                version: 1
                            },
                            {
                                auteur: 'Marie Curie',
                                titre: 'La Radioactivité',
                                editeur: 'Dunod',
                                lieuEdition: 'Paris',
                                annee: '1935',
                                descripteurs: 'Sciences, Physique, Radioactivité, Chimie',
                                cote: 'SCI-CUR-001',
                                description: 'Ouvrage fondamental sur la découverte et les applications de la radioactivité.',
                                estEmprunte: false,
                                syncStatus: 'synced',
                                lastModified: new Date().toISOString(),
                                version: 1
                            },
                            {
                                auteur: 'Jules Verne',
                                titre: 'Vingt mille lieues sous les mers',
                                editeur: 'Hetzel',
                                lieuEdition: 'Paris',
                                annee: '1870',
                                descripteurs: 'Science-Fiction, Aventure, Sous-marins, Océan',
                                cote: 'SF-VER-001',
                                isbn: '978-2-253-00004-4',
                                description: 'Roman d\'aventures de Jules Verne décrivant les exploits du capitaine Nemo à bord du Nautilus.',
                                estEmprunte: false,
                                syncStatus: 'synced',
                                lastModified: new Date().toISOString(),
                                version: 1
                            }
                        ];
                        _i = 0, categories_1 = categories;
                        _d.label = 2;
                    case 2:
                        if (!(_i < categories_1.length)) return [3 /*break*/, 5];
                        category = categories_1[_i];
                        return [4 /*yield*/, this.addCategory(__assign(__assign({}, category), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1, createdAt: new Date().toISOString() }))];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _a = 0, authors_1 = authors;
                        _d.label = 6;
                    case 6:
                        if (!(_a < authors_1.length)) return [3 /*break*/, 9];
                        author = authors_1[_a];
                        return [4 /*yield*/, this.addAuthor(__assign(__assign({}, author), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1, createdAt: new Date().toISOString() }))];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 6];
                    case 9:
                        _b = 0, borrowers_1 = borrowers;
                        _d.label = 10;
                    case 10:
                        if (!(_b < borrowers_1.length)) return [3 /*break*/, 13];
                        borrower = borrowers_1[_b];
                        return [4 /*yield*/, this.addBorrower(__assign(__assign({}, borrower), { syncStatus: 'pending', lastModified: new Date().toISOString(), version: 1, createdAt: new Date().toISOString() }))];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12:
                        _b++;
                        return [3 /*break*/, 10];
                    case 13:
                        _c = 0, documents_1 = documents;
                        _d.label = 14;
                    case 14:
                        if (!(_c < documents_1.length)) return [3 /*break*/, 17];
                        document_1 = documents_1[_c];
                        return [4 /*yield*/, this.addDocument(document_1)];
                    case 15:
                        _d.sent();
                        _d.label = 16;
                    case 16:
                        _c++;
                        return [3 /*break*/, 14];
                    case 17:
                        console.log('Données d\'exemple ajoutées avec succès');
                        return [3 /*break*/, 19];
                    case 18:
                        error_1 = _d.sent();
                        console.error('Erreur lors de l\'initialisation des données:', error_1);
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    // CRUD Borrowers
    DatabaseService.prototype.getBorrowers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all('SELECT * FROM borrowers ORDER BY lastName, firstName', function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.addBorrower = function (borrower) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        INSERT INTO borrowers (type, firstName, lastName, matricule, classe, cniNumber, position, email, phone)\n        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\n      ");
                        stmt.run([
                            borrower.type,
                            borrower.firstName,
                            borrower.lastName,
                            borrower.matricule,
                            borrower.classe || null,
                            borrower.cniNumber || null,
                            borrower.position || null,
                            borrower.email || null,
                            borrower.phone || null
                        ], function (err) {
                            if (err) {
                                if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: borrowers.matricule')) {
                                    reject(new Error('Un emprunteur avec ce matricule existe déjà'));
                                }
                                else {
                                    reject(err);
                                }
                            }
                            else {
                                resolve(this.lastID || 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.updateBorrower = function (borrower) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        UPDATE borrowers SET \n          type = ?, firstName = ?, lastName = ?, matricule = ?, \n          classe = ?, cniNumber = ?, position = ?, email = ?, phone = ?\n        WHERE id = ?\n      ");
                        stmt.run([
                            borrower.type,
                            borrower.firstName,
                            borrower.lastName,
                            borrower.matricule,
                            borrower.classe || null,
                            borrower.cniNumber || null,
                            borrower.position || null,
                            borrower.email || null,
                            borrower.phone || null,
                            borrower.id
                        ], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(this.changes > 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.deleteBorrower = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // Vérifier s'il n'y a pas d'emprunts actifs
                        _this.db.get('SELECT COUNT(*) as count FROM borrow_history WHERE borrowerId = ? AND status = "active"', [id], function (err, row) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (row.count > 0) {
                                reject(new Error('Impossible de supprimer : cet emprunteur a des livres non rendus'));
                                return;
                            }
                            _this.db.run('DELETE FROM borrowers WHERE id = ?', [id], function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(this.changes > 0);
                                }
                            });
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.searchBorrowers = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var searchQuery = "%".concat(query, "%");
                        _this.db.all("\n        SELECT * FROM borrowers \n        WHERE firstName LIKE ? OR lastName LIKE ? OR matricule LIKE ? OR classe LIKE ? OR position LIKE ?\n        ORDER BY lastName, firstName\n      ", [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    })];
            });
        });
    };
    // Books CRUD mis à jour
    DatabaseService.prototype.getBooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all("\n        SELECT \n          d.*,\n          b.firstName as borrower_firstName,\n          b.lastName as borrower_lastName\n        FROM documents d\n        LEFT JOIN borrowers b ON d.emprunteurId = b.id\n        WHERE d.deletedAt IS NULL\n        ORDER BY d.createdAt DESC\n      ", function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var books = rows.map(function (row) { return (0, preload_1.createBookFromDocument)(row); });
                                resolve(books);
                            }
                        });
                    })];
            });
        });
    };
    // Gestion des emprunts
    DatabaseService.prototype.borrowBook = function (bookId, borrowerId, expectedReturnDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var borrowDate = new Date().toISOString();
                        var db = _this.db; // capture this.db
                        _this.db.serialize(function () {
                            db.run('BEGIN TRANSACTION');
                            // Use function expression for callback to access stmt1.lastID
                            var stmt1 = db.prepare("\n        INSERT INTO borrow_history (bookId, borrowerId, borrowDate, expectedReturnDate, status)\n        VALUES (?, ?, ?, ?, 'active')\n      ");
                            stmt1.run([bookId, borrowerId, borrowDate, expectedReturnDate], function (err) {
                                if (err) {
                                    db.run('ROLLBACK'); // use captured db
                                    reject(err);
                                    return;
                                }
                                var historyId = this.lastID; // this refers to Statement
                                var stmt2 = db.prepare("\n          UPDATE books SET \n            isBorrowed = 1, \n            borrowerId = ?, \n            borrowDate = ?, \n            expectedReturnDate = ?\n          WHERE id = ?\n        ");
                                stmt2.run([borrowerId, borrowDate, expectedReturnDate, bookId], function (err) {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        reject(err);
                                    }
                                    else {
                                        db.run('COMMIT');
                                        resolve(historyId);
                                    }
                                });
                                stmt2.finalize();
                            });
                            stmt1.finalize();
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.returnBook = function (borrowHistoryId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var returnDate = new Date().toISOString();
                        var db = _this.db; // capture this.db
                        db.serialize(function () {
                            db.run('BEGIN TRANSACTION');
                            // Récupérer les infos de l'emprunt
                            db.get('SELECT bookId FROM borrow_history WHERE id = ?', [borrowHistoryId], function (err, row) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    reject(err);
                                    return;
                                }
                                if (!row) {
                                    db.run('ROLLBACK');
                                    reject(new Error('Emprunt non trouvé'));
                                    return;
                                }
                                var bookId = row.bookId;
                                // Mettre à jour l'historique
                                var stmt1 = db.prepare("\n            UPDATE borrow_history SET \n              actualReturnDate = ?, \n              status = 'returned',\n              notes = ?\n            WHERE id = ?\n          ");
                                stmt1.run([returnDate, notes || null, borrowHistoryId], function (err) {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        reject(err);
                                        return;
                                    }
                                    // Mettre à jour le livre
                                    var stmt2 = db.prepare("\n                UPDATE books SET \n                  isBorrowed = 0, \n                  borrowerId = NULL, \n                  borrowDate = NULL,\n                  expectedReturnDate = NULL,\n                  returnDate = ?\n                WHERE id = ?\n              ");
                                    stmt2.run([returnDate, bookId], function (err) {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            reject(err);
                                        }
                                        else {
                                            db.run('COMMIT');
                                            resolve((this.changes || 0) > 0);
                                        }
                                    });
                                    stmt2.finalize();
                                });
                                stmt1.finalize();
                            });
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.getBorrowedBooks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all("\n        SELECT \n          bh.*,\n          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, \n          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,\n          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,\n          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,\n          d.version as bookVersion, d.createdAt as bookCreatedAt,\n          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,\n          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,\n          br.lastModified as borrowerLastModified, br.version as borrowerVersion,\n          br.createdAt as borrowerCreatedAt\n        FROM borrow_history bh\n        JOIN documents d ON bh.bookId = d.id\n        JOIN borrowers br ON bh.borrowerId = br.id\n        WHERE bh.status = 'active' AND d.deletedAt IS NULL\n        ORDER BY bh.borrowDate DESC\n      ", function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var history_1 = rows.map(function (row) { return ({
                                    id: row.id,
                                    bookId: row.bookId,
                                    borrowerId: row.borrowerId,
                                    borrowDate: row.borrowDate,
                                    expectedReturnDate: row.expectedReturnDate,
                                    actualReturnDate: row.actualReturnDate,
                                    status: row.status,
                                    notes: row.notes,
                                    syncStatus: row.syncStatus || 'synced',
                                    lastModified: row.lastModified || new Date().toISOString(),
                                    version: row.version || 1,
                                    createdAt: row.createdAt,
                                    book: {
                                        id: row.bookId,
                                        // English properties (Book interface)
                                        title: row.title,
                                        author: row.author,
                                        isbn: row.isbn,
                                        category: row.category,
                                        publishedDate: row.publishedDate,
                                        description: row.description,
                                        coverUrl: row.coverUrl,
                                        isBorrowed: Boolean(row.isBorrowed),
                                        borrowerId: row.borrowerId,
                                        borrowDate: row.borrowDate,
                                        expectedReturnDate: row.expectedReturnDate,
                                        returnDate: row.returnDate,
                                        borrowerName: "".concat(row.firstName, " ").concat(row.lastName),
                                        // French properties (Document interface)
                                        auteur: row.author,
                                        titre: row.title,
                                        editeur: 'Non spécifié',
                                        lieuEdition: 'Non spécifié',
                                        annee: row.publishedDate,
                                        descripteurs: row.category,
                                        cote: "".concat(row.category.substring(0, 3), "-").concat(row.author.substring(0, 3), "-001").toUpperCase(),
                                        couverture: row.coverUrl,
                                        estEmprunte: Boolean(row.isBorrowed),
                                        emprunteurId: row.borrowerId,
                                        dateEmprunt: row.borrowDate,
                                        dateRetourPrevu: row.expectedReturnDate,
                                        dateRetour: row.returnDate,
                                        nomEmprunteur: "".concat(row.firstName, " ").concat(row.lastName),
                                        // Sync properties
                                        syncStatus: row.bookSyncStatus || 'synced',
                                        lastModified: row.bookLastModified || new Date().toISOString(),
                                        version: row.bookVersion || 1,
                                        createdAt: row.bookCreatedAt
                                    },
                                    borrower: {
                                        id: row.borrowerId,
                                        type: row.type,
                                        firstName: row.firstName,
                                        lastName: row.lastName,
                                        matricule: row.matricule,
                                        classe: row.classe,
                                        cniNumber: row.cniNumber,
                                        position: row.position,
                                        email: row.email,
                                        phone: row.phone,
                                        syncStatus: row.borrowerSyncStatus || 'synced',
                                        lastModified: row.borrowerLastModified || new Date().toISOString(),
                                        version: row.borrowerVersion || 1,
                                        createdAt: row.borrowerCreatedAt
                                    }
                                }); });
                                resolve(history_1);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.getBorrowHistory = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var query = "\n        SELECT \n          bh.*,\n          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, \n          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,\n          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,\n          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,\n          d.version as bookVersion, d.createdAt as bookCreatedAt,\n          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,\n          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,\n          br.lastModified as borrowerLastModified, br.version as borrowerVersion,\n          br.createdAt as borrowerCreatedAt\n        FROM borrow_history bh\n        JOIN documents d ON bh.bookId = d.id\n        JOIN borrowers br ON bh.borrowerId = br.id\n      ";
                        var conditions = ['d.deletedAt IS NULL'];
                        var params = [];
                        if (filter) {
                            if (filter.startDate) {
                                conditions.push('bh.borrowDate >= ?');
                                params.push(filter.startDate);
                            }
                            if (filter.endDate) {
                                conditions.push('bh.borrowDate <= ?');
                                params.push(filter.endDate + ' 23:59:59');
                            }
                            if (filter.borrowerType && filter.borrowerType !== 'all') {
                                conditions.push('br.type = ?');
                                params.push(filter.borrowerType);
                            }
                            if (filter.status && filter.status !== 'all') {
                                conditions.push('bh.status = ?');
                                params.push(filter.status);
                            }
                            if (filter.borrowerId) {
                                conditions.push('bh.borrowerId = ?');
                                params.push(filter.borrowerId);
                            }
                            if (filter.bookId) {
                                conditions.push('bh.bookId = ?');
                                params.push(filter.bookId);
                            }
                        }
                        if (conditions.length > 0) {
                            query += ' WHERE ' + conditions.join(' AND ');
                        }
                        query += ' ORDER BY bh.borrowDate DESC';
                        _this.db.all(query, params, function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var history_2 = rows.map(function (row) { return ({
                                    id: row.id,
                                    bookId: row.bookId,
                                    borrowerId: row.borrowerId,
                                    borrowDate: row.borrowDate,
                                    expectedReturnDate: row.expectedReturnDate,
                                    actualReturnDate: row.actualReturnDate,
                                    status: row.status,
                                    notes: row.notes,
                                    syncStatus: row.syncStatus || 'synced',
                                    lastModified: row.lastModified || new Date().toISOString(),
                                    version: row.version || 1,
                                    createdAt: row.createdAt,
                                    book: {
                                        id: row.bookId,
                                        // English properties (Book interface)
                                        title: row.title,
                                        author: row.author,
                                        isbn: row.isbn,
                                        category: row.category,
                                        publishedDate: row.publishedDate,
                                        description: row.description,
                                        coverUrl: row.coverUrl,
                                        isBorrowed: Boolean(row.isBorrowed),
                                        borrowerId: row.borrowerId,
                                        borrowDate: row.borrowDate,
                                        expectedReturnDate: row.expectedReturnDate,
                                        returnDate: row.returnDate,
                                        borrowerName: "".concat(row.firstName, " ").concat(row.lastName),
                                        // French properties (Document interface)
                                        auteur: row.author,
                                        titre: row.title,
                                        editeur: 'Non spécifié',
                                        lieuEdition: 'Non spécifié',
                                        annee: row.publishedDate,
                                        descripteurs: row.category,
                                        cote: "".concat(row.category.substring(0, 3), "-").concat(row.author.substring(0, 3), "-001").toUpperCase(),
                                        couverture: row.coverUrl,
                                        estEmprunte: Boolean(row.isBorrowed),
                                        emprunteurId: row.borrowerId,
                                        dateEmprunt: row.borrowDate,
                                        dateRetourPrevu: row.expectedReturnDate,
                                        dateRetour: row.returnDate,
                                        nomEmprunteur: "".concat(row.firstName, " ").concat(row.lastName),
                                        // Sync properties
                                        syncStatus: row.bookSyncStatus || 'synced',
                                        lastModified: row.bookLastModified || new Date().toISOString(),
                                        version: row.bookVersion || 1,
                                        createdAt: row.bookCreatedAt
                                    },
                                    borrower: {
                                        id: row.borrowerId,
                                        type: row.type,
                                        firstName: row.firstName,
                                        lastName: row.lastName,
                                        matricule: row.matricule,
                                        classe: row.classe,
                                        cniNumber: row.cniNumber,
                                        position: row.position,
                                        email: row.email,
                                        phone: row.phone,
                                        syncStatus: row.borrowerSyncStatus || 'synced',
                                        lastModified: row.borrowerLastModified || new Date().toISOString(),
                                        version: row.borrowerVersion || 1,
                                        createdAt: row.borrowerCreatedAt
                                    }
                                }); });
                                resolve(history_2);
                            }
                        });
                    })];
            });
        });
    };
    // Autres méthodes existantes
    DatabaseService.prototype.getAuthors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all('SELECT * FROM authors ORDER BY name', function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.addAuthor = function (author) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        INSERT OR IGNORE INTO authors (name, biography, birthDate, nationality)\n        VALUES (?, ?, ?, ?)\n      ");
                        stmt.run([
                            author.name,
                            author.biography,
                            author.birthDate,
                            author.nationality
                        ], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(this.lastID || 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.getCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all('SELECT * FROM categories ORDER BY name', function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.addCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        INSERT OR IGNORE INTO categories (name, description, color)\n        VALUES (?, ?, ?)\n      ");
                        stmt.run([
                            category.name,
                            category.description,
                            category.color
                        ], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(this.lastID || 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.searchBooks = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var searchQuery = "%".concat(query, "%");
                        _this.db.all("\n        SELECT * FROM books \n        WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR description LIKE ?\n        ORDER BY title\n      ", [searchQuery, searchQuery, searchQuery, searchQuery], function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.serialize(function () {
                            var stats = {};
                            _this.db.get('SELECT COUNT(*) as count FROM books', function (err, row) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                stats.totalBooks = row.count || 0;
                                _this.db.get('SELECT COUNT(*) as count FROM books WHERE isBorrowed = 1', function (err, row) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    stats.borrowedBooks = row.count || 0;
                                    stats.availableBooks = (stats.totalBooks || 0) - (stats.borrowedBooks || 0);
                                    _this.db.get('SELECT COUNT(*) as count FROM authors', function (err, row) {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        stats.totalAuthors = row.count || 0;
                                        _this.db.get('SELECT COUNT(*) as count FROM categories', function (err, row) {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            stats.totalCategories = row.count || 0;
                                            _this.db.get('SELECT COUNT(*) as count FROM borrowers', function (err, row) {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                stats.totalBorrowers = row.count || 0;
                                                _this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "student"', function (err, row) {
                                                    if (err) {
                                                        reject(err);
                                                        return;
                                                    }
                                                    stats.totalStudents = row.count || 0;
                                                    _this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "staff"', function (err, row) {
                                                        if (err) {
                                                            reject(err);
                                                            return;
                                                        }
                                                        stats.totalStaff = row.count || 0;
                                                        // Compter les livres en retard
                                                        var now = new Date().toISOString();
                                                        _this.db.get("\n                        SELECT COUNT(*) as count FROM borrow_history \n                        WHERE status = 'active' AND expectedReturnDate < ?\n                      ", [now], function (err, row) {
                                                            if (err) {
                                                                reject(err);
                                                                return;
                                                            }
                                                            stats.overdueBooks = row.count || 0;
                                                            resolve(stats);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    })];
            });
        });
    };
    // Méthode pour nettoyer la base de données (utile pour les tests)
    DatabaseService.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.serialize(function () {
                            _this.db.run('DELETE FROM borrow_history', function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                _this.db.run('DELETE FROM books', function (err) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    _this.db.run('DELETE FROM borrowers', function (err) {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        _this.db.run('DELETE FROM authors', function (err) {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            _this.db.run('DELETE FROM categories', function (err) {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                resolve();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    })];
            });
        });
    };
    // ===============================
    // NOUVELLES MÉTHODES POUR DOCUMENTS
    // ===============================
    DatabaseService.prototype.getDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all("\n        SELECT \n          d.*,\n          b.firstName as borrower_firstName,\n          b.lastName as borrower_lastName\n        FROM documents d\n        LEFT JOIN borrowers b ON d.emprunteurId = b.id\n        WHERE d.deletedAt IS NULL\n        ORDER BY d.lastModified DESC\n      ", function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var documents = rows.map(function (row) { return ({
                                    id: row.id,
                                    auteur: row.auteur,
                                    titre: row.titre,
                                    editeur: row.editeur,
                                    lieuEdition: row.lieuEdition,
                                    annee: row.annee,
                                    descripteurs: row.descripteurs,
                                    cote: row.cote,
                                    isbn: row.isbn,
                                    description: row.description,
                                    couverture: row.couverture,
                                    estEmprunte: Boolean(row.estEmprunte),
                                    emprunteurId: row.emprunteurId,
                                    dateEmprunt: row.dateEmprunt,
                                    dateRetourPrevu: row.dateRetourPrevu,
                                    dateRetour: row.dateRetour,
                                    nomEmprunteur: row.borrower_firstName && row.borrower_lastName
                                        ? "".concat(row.borrower_firstName, " ").concat(row.borrower_lastName)
                                        : undefined,
                                    localId: row.localId,
                                    remoteId: row.remoteId,
                                    syncStatus: row.syncStatus,
                                    lastModified: row.lastModified,
                                    version: row.version,
                                    deletedAt: row.deletedAt,
                                    createdAt: row.createdAt
                                }); });
                                resolve(documents);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.addDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var localId = "doc_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                        var now = new Date().toISOString();
                        var stmt = _this.db.prepare("\n        INSERT INTO documents (\n          auteur, titre, editeur, lieuEdition, annee, descripteurs, cote,\n          isbn, description, couverture, estEmprunte,\n          localId, syncStatus, lastModified, version, createdAt\n        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n      ");
                        stmt.run([
                            document.auteur,
                            document.titre,
                            document.editeur,
                            document.lieuEdition,
                            document.annee,
                            document.descripteurs,
                            document.cote,
                            document.isbn || null,
                            document.description || null,
                            document.couverture || null,
                            document.estEmprunte ? 1 : 0,
                            localId,
                            'pending',
                            now,
                            1,
                            now
                        ], function (err) {
                            if (err) {
                                if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
                                    reject(new Error('Un document avec cette cote existe déjà'));
                                }
                                else {
                                    reject(err);
                                }
                            }
                            else {
                                resolve(this.lastID || 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.updateDocument = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var now = new Date().toISOString();
                        var stmt = _this.db.prepare("\n        UPDATE documents SET \n          auteur = ?, titre = ?, editeur = ?, lieuEdition = ?, annee = ?, \n          descripteurs = ?, cote = ?, isbn = ?, description = ?, couverture = ?,\n          lastModified = ?, version = version + 1, syncStatus = 'pending'\n        WHERE id = ? AND deletedAt IS NULL\n      ");
                        stmt.run([
                            document.auteur,
                            document.titre,
                            document.editeur,
                            document.lieuEdition,
                            document.annee,
                            document.descripteurs,
                            document.cote,
                            document.isbn || null,
                            document.description || null,
                            document.couverture || null,
                            now,
                            document.id
                        ], function (err) {
                            if (err) {
                                if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
                                    reject(new Error('Un autre document avec cette cote existe déjà'));
                                }
                                else {
                                    reject(err);
                                }
                            }
                            else {
                                resolve((this.changes || 0) > 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.deleteDocument = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var now = new Date().toISOString();
                        // Soft delete
                        var stmt = _this.db.prepare("\n        UPDATE documents \n        SET deletedAt = ?, lastModified = ?, syncStatus = 'pending', version = version + 1\n        WHERE id = ? AND deletedAt IS NULL\n      ");
                        stmt.run([now, now, id], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve((this.changes || 0) > 0);
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.searchDocuments = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var searchTerm = "%".concat(query.toLowerCase(), "%");
                        _this.db.all("\n        SELECT \n          d.*,\n          b.firstName as borrower_firstName,\n          b.lastName as borrower_lastName\n        FROM documents d\n        LEFT JOIN borrowers b ON d.emprunteurId = b.id\n        WHERE d.deletedAt IS NULL\n        AND (\n          LOWER(d.titre) LIKE ? OR \n          LOWER(d.auteur) LIKE ? OR \n          LOWER(d.editeur) LIKE ? OR\n          LOWER(d.descripteurs) LIKE ? OR\n          LOWER(d.cote) LIKE ? OR\n          LOWER(d.isbn) LIKE ?\n        )\n        ORDER BY d.lastModified DESC\n      ", [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var documents = rows.map(function (row) { return ({
                                    id: row.id,
                                    auteur: row.auteur,
                                    titre: row.titre,
                                    editeur: row.editeur,
                                    lieuEdition: row.lieuEdition,
                                    annee: row.annee,
                                    descripteurs: row.descripteurs,
                                    cote: row.cote,
                                    isbn: row.isbn,
                                    description: row.description,
                                    couverture: row.couverture,
                                    estEmprunte: Boolean(row.estEmprunte),
                                    emprunteurId: row.emprunteurId,
                                    dateEmprunt: row.dateEmprunt,
                                    dateRetourPrevu: row.dateRetourPrevu,
                                    dateRetour: row.dateRetour,
                                    nomEmprunteur: row.borrower_firstName && row.borrower_lastName
                                        ? "".concat(row.borrower_firstName, " ").concat(row.borrower_lastName)
                                        : undefined,
                                    localId: row.localId,
                                    remoteId: row.remoteId,
                                    syncStatus: row.syncStatus,
                                    lastModified: row.lastModified,
                                    version: row.version,
                                    deletedAt: row.deletedAt,
                                    createdAt: row.createdAt
                                }); });
                                resolve(documents);
                            }
                        });
                    })];
            });
        });
    };
    // ===============================
    // MÉTHODES DE SYNCHRONISATION
    // ===============================
    DatabaseService.prototype.getSyncQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.all('SELECT * FROM sync_queue ORDER BY timestamp ASC', function (err, rows) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                var operations = rows.map(function (row) { return ({
                                    id: row.id,
                                    type: row.type,
                                    operation: row.operation,
                                    data: JSON.parse(row.data),
                                    timestamp: row.timestamp,
                                    retryCount: row.retryCount,
                                    maxRetries: row.maxRetries
                                }); });
                                resolve(operations);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.addSyncOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        INSERT INTO sync_queue (id, type, operation, data, timestamp, retryCount, maxRetries)\n        VALUES (?, ?, ?, ?, ?, ?, ?)\n      ");
                        stmt.run([
                            operation.id,
                            operation.type,
                            operation.operation,
                            JSON.stringify(operation.data),
                            operation.timestamp,
                            operation.retryCount,
                            operation.maxRetries
                        ], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.updateSyncOperation = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stmt = _this.db.prepare("\n        UPDATE sync_queue \n        SET retryCount = ?, data = ?, lastError = ?\n        WHERE id = ?\n      ");
                        stmt.run([
                            operation.retryCount,
                            JSON.stringify(operation.data),
                            '', // lastError sera ajouté plus tard si nécessaire
                            operation.id
                        ], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                        stmt.finalize();
                    })];
            });
        });
    };
    DatabaseService.prototype.removeSyncOperation = function (operationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('DELETE FROM sync_queue WHERE id = ?', [operationId], function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    })];
            });
        });
    };
    // Méthodes pour mettre à jour les IDs distants
    DatabaseService.prototype.updateDocumentRemoteId = function (localId, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('UPDATE documents SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.updateAuthorRemoteId = function (localId, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('UPDATE authors SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.updateCategoryRemoteId = function (localId, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('UPDATE categories SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.updateBorrowerRemoteId = function (localId, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('UPDATE borrowers SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.updateBorrowHistoryRemoteId = function (localId, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.run('UPDATE borrow_history SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
