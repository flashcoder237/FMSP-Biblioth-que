"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const sqlite3 = __importStar(require("sqlite3"));
const path = __importStar(require("path"));
const electron_1 = require("electron");
const preload_1 = require("../preload");
class DatabaseService {
    constructor() {
        const dbPath = path.join(electron_1.app.getPath('userData'), 'bibliotheque.db');
        this.db = new sqlite3.Database(dbPath);
    }
    async initialize() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Table des auteurs avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            biography TEXT,
            birthDate TEXT,
            nationality TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des catégories avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            color TEXT DEFAULT '#3E5C49',
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des emprunteurs avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS borrowers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK (type IN ('student', 'staff')),
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            matricule TEXT NOT NULL UNIQUE,
            classe TEXT,
            cniNumber TEXT,
            position TEXT,
            email TEXT,
            phone TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
                // Table des documents (nouvelle structure)
                this.db.run(`
          CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Champs principaux requis
            auteur TEXT NOT NULL,
            titre TEXT NOT NULL,
            editeur TEXT NOT NULL,
            lieuEdition TEXT NOT NULL,
            annee TEXT NOT NULL,
            descripteurs TEXT NOT NULL,
            cote TEXT NOT NULL UNIQUE,
            
            -- Champs optionnels
            isbn TEXT,
            description TEXT,
            couverture TEXT,
            
            -- Statut d'emprunt
            estEmprunte BOOLEAN DEFAULT 0,
            emprunteurId INTEGER,
            dateEmprunt TEXT,
            dateRetourPrevu TEXT,
            dateRetour TEXT,
            
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (emprunteurId) REFERENCES borrowers(id)
          )
        `);
                // Vue pour compatibilité avec l'ancienne table books
                this.db.run(`
          CREATE VIEW IF NOT EXISTS books_view AS
          SELECT 
            id,
            titre AS title,
            auteur AS author,
            isbn,
            descripteurs AS category,
            annee AS publishedDate,
            description,
            couverture AS coverUrl,
            estEmprunte AS isBorrowed,
            emprunteurId AS borrowerId,
            dateEmprunt AS borrowDate,
            dateRetourPrevu AS expectedReturnDate,
            dateRetour AS returnDate,
            createdAt
          FROM documents
          WHERE deletedAt IS NULL
        `);
                // Table historique des emprunts avec support sync
                this.db.run(`
          CREATE TABLE IF NOT EXISTS borrow_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId INTEGER NOT NULL,
            borrowerId INTEGER NOT NULL,
            borrowDate DATETIME NOT NULL,
            expectedReturnDate DATETIME NOT NULL,
            actualReturnDate DATETIME,
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
            notes TEXT,
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bookId) REFERENCES documents(id),
            FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
          )
        `);
                // Table de queue de synchronisation
                this.db.run(`
          CREATE TABLE IF NOT EXISTS sync_queue (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL CHECK (type IN ('document', 'author', 'category', 'borrower', 'history')),
            operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
            data TEXT NOT NULL,
            timestamp DATETIME NOT NULL,
            retryCount INTEGER DEFAULT 0,
            maxRetries INTEGER DEFAULT 3,
            lastError TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.seedInitialData().then(resolve).catch(reject);
                    }
                });
            });
        });
    }
    async seedInitialData() {
        try {
            // Vérifier si des données existent déjà
            const existingDocuments = await this.getDocuments();
            if (existingDocuments.length > 0) {
                console.log('Base de données déjà initialisée');
                return;
            }
            const categories = [
                { name: 'Fiction', description: 'Romans et nouvelles', color: '#3E5C49' },
                { name: 'Science-Fiction', description: 'Littérature futuriste', color: '#C2571B' },
                { name: 'Histoire', description: 'Livres historiques', color: '#6E6E6E' },
                { name: 'Biographie', description: 'Vies de personnalités', color: '#3E5C49' },
                { name: 'Sciences', description: 'Ouvrages scientifiques', color: '#C2571B' },
                { name: 'Philosophie', description: 'Réflexions philosophiques', color: '#6E6E6E' },
            ];
            const authors = [
                { name: 'Victor Hugo', biography: 'Écrivain français du XIXe siècle', nationality: 'Française' },
                { name: 'Albert Camus', biography: 'Philosophe et écrivain français', nationality: 'Française' },
                { name: 'Isaac Asimov', biography: 'Auteur de science-fiction', nationality: 'Américaine' },
                { name: 'Marie Curie', biography: 'Physicienne et chimiste', nationality: 'Française' },
                { name: 'Jules Verne', biography: 'Écrivain français de science-fiction', nationality: 'Française' },
            ];
            const borrowers = [
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
            const documents = [
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
            // Ajouter les catégories
            for (const category of categories) {
                await this.addCategory({
                    ...category,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les auteurs
            for (const author of authors) {
                await this.addAuthor({
                    ...author,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les emprunteurs
            for (const borrower of borrowers) {
                await this.addBorrower({
                    ...borrower,
                    syncStatus: 'pending',
                    lastModified: new Date().toISOString(),
                    version: 1,
                    createdAt: new Date().toISOString()
                });
            }
            // Ajouter les documents
            for (const document of documents) {
                await this.addDocument(document);
            }
            console.log('Données d\'exemple ajoutées avec succès');
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation des données:', error);
        }
    }
    // CRUD Borrowers
    async getBorrowers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM borrowers ORDER BY lastName, firstName', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addBorrower(borrower) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT INTO borrowers (type, firstName, lastName, matricule, classe, cniNumber, position, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
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
        });
    }
    async updateBorrower(borrower) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        UPDATE borrowers SET 
          type = ?, firstName = ?, lastName = ?, matricule = ?, 
          classe = ?, cniNumber = ?, position = ?, email = ?, phone = ?
        WHERE id = ?
      `);
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
        });
    }
    async deleteBorrower(id) {
        return new Promise((resolve, reject) => {
            // Vérifier s'il n'y a pas d'emprunts actifs
            this.db.get('SELECT COUNT(*) as count FROM borrow_history WHERE borrowerId = ? AND status = "active"', [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row.count > 0) {
                    reject(new Error('Impossible de supprimer : cet emprunteur a des livres non rendus'));
                    return;
                }
                this.db.run('DELETE FROM borrowers WHERE id = ?', [id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(this.changes > 0);
                    }
                });
            });
        });
    }
    async searchBorrowers(query) {
        return new Promise((resolve, reject) => {
            const searchQuery = `%${query}%`;
            this.db.all(`
        SELECT * FROM borrowers 
        WHERE firstName LIKE ? OR lastName LIKE ? OR matricule LIKE ? OR classe LIKE ? OR position LIKE ?
        ORDER BY lastName, firstName
      `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    // Books CRUD mis à jour
    async getBooks() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        ORDER BY d.createdAt DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const books = rows.map((row) => (0, preload_1.createBookFromDocument)(row));
                    resolve(books);
                }
            });
        });
    }
    // Gestion des emprunts
    async borrowBook(bookId, borrowerId, expectedReturnDate) {
        return new Promise((resolve, reject) => {
            const borrowDate = new Date().toISOString();
            const database = this.db; // Capturer this.db dans une variable locale
            database.serialize(() => {
                database.run('BEGIN TRANSACTION');
                const stmt1 = database.prepare(`
        INSERT INTO borrow_history (bookId, borrowerId, borrowDate, expectedReturnDate, status)
        VALUES (?, ?, ?, ?, 'active')
      `);
                stmt1.run([bookId, borrowerId, borrowDate, expectedReturnDate], function (err) {
                    if (err) {
                        database.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    const historyId = this.lastID;
                    const stmt2 = database.prepare(`
          UPDATE documents SET 
            estEmprunte = 1, 
            emprunteurId = ?, 
            dateEmprunt = ?, 
            dateRetourPrevu = ?
          WHERE id = ?
        `);
                    stmt2.run([borrowerId, borrowDate, expectedReturnDate, bookId], (err) => {
                        if (err) {
                            database.run('ROLLBACK');
                            reject(err);
                        }
                        else {
                            database.run('COMMIT');
                            resolve(historyId);
                        }
                    });
                    stmt2.finalize();
                });
                stmt1.finalize();
            });
        });
    }
    async returnBook(borrowHistoryId, notes) {
        return new Promise((resolve, reject) => {
            const returnDate = new Date().toISOString();
            const database = this.db; // Capturer this.db dans une variable locale
            database.serialize(() => {
                database.run('BEGIN TRANSACTION');
                database.get('SELECT bookId FROM borrow_history WHERE id = ?', [borrowHistoryId], (err, row) => {
                    if (err) {
                        database.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    if (!row) {
                        database.run('ROLLBACK');
                        reject(new Error('Emprunt non trouvé'));
                        return;
                    }
                    const bookId = row.bookId;
                    const stmt1 = database.prepare(`
          UPDATE borrow_history SET 
            actualReturnDate = ?, 
            status = 'returned',
            notes = ?
          WHERE id = ?
        `);
                    stmt1.run([returnDate, notes || null, borrowHistoryId], function (err) {
                        if (err) {
                            database.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        const stmt2 = database.prepare(`
            UPDATE documents SET 
              estEmprunte = 0, 
              emprunteurId = NULL, 
              dateEmprunt = NULL,
              dateRetourPrevu = NULL,
              dateRetour = ?
            WHERE id = ?
          `);
                        stmt2.run([returnDate, bookId], function (err) {
                            if (err) {
                                database.run('ROLLBACK');
                                reject(err);
                            }
                            else {
                                database.run('COMMIT');
                                resolve((this.changes || 0) > 0);
                            }
                        });
                        stmt2.finalize();
                    });
                    stmt1.finalize();
                });
            });
        });
    }
    async getBorrowedBooks() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          bh.*,
          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, 
          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,
          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,
          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,
          d.version as bookVersion, d.createdAt as bookCreatedAt,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,
          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,
          br.lastModified as borrowerLastModified, br.version as borrowerVersion,
          br.createdAt as borrowerCreatedAt
        FROM borrow_history bh
        JOIN documents d ON bh.bookId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.status = 'active' AND d.deletedAt IS NULL
        ORDER BY bh.borrowDate DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const history = rows.map(row => ({
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
                            borrowerName: `${row.firstName} ${row.lastName}`,
                            // French properties (Document interface)
                            auteur: row.author,
                            titre: row.title,
                            editeur: 'Non spécifié',
                            lieuEdition: 'Non spécifié',
                            annee: row.publishedDate,
                            descripteurs: row.category,
                            cote: `${row.category.substring(0, 3)}-${row.author.substring(0, 3)}-001`.toUpperCase(),
                            couverture: row.coverUrl,
                            estEmprunte: Boolean(row.isBorrowed),
                            emprunteurId: row.borrowerId,
                            dateEmprunt: row.borrowDate,
                            dateRetourPrevu: row.expectedReturnDate,
                            dateRetour: row.returnDate,
                            nomEmprunteur: `${row.firstName} ${row.lastName}`,
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
                    }));
                    resolve(history);
                }
            });
        });
    }
    async getBorrowHistory(filter) {
        return new Promise((resolve, reject) => {
            let query = `
        SELECT 
          bh.*,
          d.titre as title, d.auteur as author, d.descripteurs as category, d.couverture as coverUrl, 
          d.isbn, d.annee as publishedDate, d.description, d.estEmprunte as isBorrowed,
          d.emprunteurId as borrowerId, d.dateEmprunt as borrowDate, d.dateRetourPrevu as expectedReturnDate,
          d.dateRetour as returnDate, d.syncStatus as bookSyncStatus, d.lastModified as bookLastModified,
          d.version as bookVersion, d.createdAt as bookCreatedAt,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position,
          br.email, br.phone, br.cniNumber, br.syncStatus as borrowerSyncStatus,
          br.lastModified as borrowerLastModified, br.version as borrowerVersion,
          br.createdAt as borrowerCreatedAt
        FROM borrow_history bh
        JOIN documents d ON bh.bookId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
      `;
            const conditions = ['d.deletedAt IS NULL'];
            const params = [];
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
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const history = rows.map(row => ({
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
                            borrowerName: `${row.firstName} ${row.lastName}`,
                            // French properties (Document interface)
                            auteur: row.author,
                            titre: row.title,
                            editeur: 'Non spécifié',
                            lieuEdition: 'Non spécifié',
                            annee: row.publishedDate,
                            descripteurs: row.category,
                            cote: `${row.category.substring(0, 3)}-${row.author.substring(0, 3)}-001`.toUpperCase(),
                            couverture: row.coverUrl,
                            estEmprunte: Boolean(row.isBorrowed),
                            emprunteurId: row.borrowerId,
                            dateEmprunt: row.borrowDate,
                            dateRetourPrevu: row.expectedReturnDate,
                            dateRetour: row.returnDate,
                            nomEmprunteur: `${row.firstName} ${row.lastName}`,
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
                    }));
                    resolve(history);
                }
            });
        });
    }
    // Autres méthodes existantes
    async getAuthors() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM authors ORDER BY name', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addAuthor(author) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO authors (name, biography, birthDate, nationality)
        VALUES (?, ?, ?, ?)
      `);
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
        });
    }
    async getCategories() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async addCategory(category) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO categories (name, description, color)
        VALUES (?, ?, ?)
      `);
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
        });
    }
    async searchBooks(query) {
        return new Promise((resolve, reject) => {
            const searchQuery = `%${query}%`;
            this.db.all(`
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR description LIKE ?
        ORDER BY title
      `, [searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async getStats() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                const stats = {};
                // Utiliser documents au lieu de books
                this.db.get('SELECT COUNT(*) as count FROM documents WHERE deletedAt IS NULL', (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stats.totalBooks = row.count || 0;
                    this.db.get('SELECT COUNT(*) as count FROM documents WHERE estEmprunte = 1 AND deletedAt IS NULL', (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats.borrowedBooks = row.count || 0;
                        stats.availableBooks = (stats.totalBooks || 0) - (stats.borrowedBooks || 0);
                        this.db.get('SELECT COUNT(*) as count FROM authors WHERE deletedAt IS NULL', (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            stats.totalAuthors = row.count || 0;
                            this.db.get('SELECT COUNT(*) as count FROM categories WHERE deletedAt IS NULL', (err, row) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                stats.totalCategories = row.count || 0;
                                this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE deletedAt IS NULL', (err, row) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    stats.totalBorrowers = row.count || 0;
                                    this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "student" AND deletedAt IS NULL', (err, row) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        stats.totalStudents = row.count || 0;
                                        this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "staff" AND deletedAt IS NULL', (err, row) => {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            stats.totalStaff = row.count || 0;
                                            // Compter les livres en retard
                                            const now = new Date().toISOString();
                                            this.db.get(`
                      SELECT COUNT(*) as count FROM borrow_history 
                      WHERE status = 'active' AND expectedReturnDate < ? AND deletedAt IS NULL
                    `, [now], (err, row) => {
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
        });
    }
    // Méthode pour nettoyer la base de données (utile pour les tests)
    async clearDatabase() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('DELETE FROM borrow_history', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.db.run('DELETE FROM books', (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.db.run('DELETE FROM borrowers', (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            this.db.run('DELETE FROM authors', (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                this.db.run('DELETE FROM categories', (err) => {
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
        });
    }
    // ===============================
    // NOUVELLES MÉTHODES POUR DOCUMENTS
    // ===============================
    async getDocuments() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        ORDER BY d.lastModified DESC
      `, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const documents = rows.map((row) => ({
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
                            ? `${row.borrower_firstName} ${row.borrower_lastName}`
                            : undefined,
                        localId: row.localId,
                        remoteId: row.remoteId,
                        syncStatus: row.syncStatus,
                        lastModified: row.lastModified,
                        version: row.version,
                        deletedAt: row.deletedAt,
                        createdAt: row.createdAt
                    }));
                    resolve(documents);
                }
            });
        });
    }
    async addDocument(document) {
        return new Promise((resolve, reject) => {
            const localId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const now = new Date().toISOString();
            const stmt = this.db.prepare(`
        INSERT INTO documents (
          auteur, titre, editeur, lieuEdition, annee, descripteurs, cote,
          isbn, description, couverture, estEmprunte,
          localId, syncStatus, lastModified, version, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
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
        });
    }
    async updateDocument(document) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            const stmt = this.db.prepare(`
        UPDATE documents SET 
          auteur = ?, titre = ?, editeur = ?, lieuEdition = ?, annee = ?, 
          descripteurs = ?, cote = ?, isbn = ?, description = ?, couverture = ?,
          lastModified = ?, version = version + 1, syncStatus = 'pending'
        WHERE id = ? AND deletedAt IS NULL
      `);
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
        });
    }
    async deleteDocument(id) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            // Soft delete
            const stmt = this.db.prepare(`
        UPDATE documents 
        SET deletedAt = ?, lastModified = ?, syncStatus = 'pending', version = version + 1
        WHERE id = ? AND deletedAt IS NULL
      `);
            stmt.run([now, now, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve((this.changes || 0) > 0);
                }
            });
            stmt.finalize();
        });
    }
    async searchDocuments(query) {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${query.toLowerCase()}%`;
            this.db.all(`
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
        AND (
          LOWER(d.titre) LIKE ? OR 
          LOWER(d.auteur) LIKE ? OR 
          LOWER(d.editeur) LIKE ? OR
          LOWER(d.descripteurs) LIKE ? OR
          LOWER(d.cote) LIKE ? OR
          LOWER(d.isbn) LIKE ?
        )
        ORDER BY d.lastModified DESC
      `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const documents = rows.map((row) => ({
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
                            ? `${row.borrower_firstName} ${row.borrower_lastName}`
                            : undefined,
                        localId: row.localId,
                        remoteId: row.remoteId,
                        syncStatus: row.syncStatus,
                        lastModified: row.lastModified,
                        version: row.version,
                        deletedAt: row.deletedAt,
                        createdAt: row.createdAt
                    }));
                    resolve(documents);
                }
            });
        });
    }
    // ===============================
    // MÉTHODES DE SYNCHRONISATION
    // ===============================
    async getSyncQueue() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM sync_queue ORDER BY timestamp ASC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const operations = rows.map((row) => ({
                        id: row.id,
                        type: row.type,
                        operation: row.operation,
                        data: JSON.parse(row.data),
                        timestamp: row.timestamp,
                        retryCount: row.retryCount,
                        maxRetries: row.maxRetries
                    }));
                    resolve(operations);
                }
            });
        });
    }
    async addSyncOperation(operation) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        INSERT INTO sync_queue (id, type, operation, data, timestamp, retryCount, maxRetries)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                operation.id,
                operation.type,
                operation.operation,
                JSON.stringify(operation.data),
                operation.timestamp,
                operation.retryCount,
                operation.maxRetries
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }
    async updateSyncOperation(operation) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
        UPDATE sync_queue 
        SET retryCount = ?, data = ?, lastError = ?
        WHERE id = ?
      `);
            stmt.run([
                operation.retryCount,
                JSON.stringify(operation.data),
                '', // lastError sera ajouté plus tard si nécessaire
                operation.id
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }
    async removeSyncOperation(operationId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM sync_queue WHERE id = ?', [operationId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    // Méthodes pour mettre à jour les IDs distants
    async updateDocumentRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE documents SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateAuthorRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE authors SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateCategoryRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE categories SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateBorrowerRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE borrowers SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async updateBorrowHistoryRemoteId(localId, remoteId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE borrow_history SET remoteId = ?, syncStatus = "synced" WHERE localId = ?', [remoteId, localId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map