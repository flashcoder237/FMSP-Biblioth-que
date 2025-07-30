import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { Document, Book, Author, Category, Stats, Borrower, BorrowHistory, HistoryFilter, SyncOperation, createBookFromDocument } from '../preload';

interface SQLiteRunResult {
  lastID: number;
  changes: number;
}


// Interface pour les erreurs SQLite
interface SQLiteError extends Error {
  code?: string;
  errno?: number;
}

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'bibliotheque.db');
    this.db = new sqlite3.Database(dbPath);
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Table des auteurs avec support sync et isolation par institution
        this.db.run(`
          CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            biography TEXT,
            birthDate TEXT,
            nationality TEXT,
            institution_code TEXT NOT NULL DEFAULT '',
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, institution_code)
          )
        `);

        // Table des catégories avec support sync et isolation par institution
        this.db.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            color TEXT DEFAULT '#3E5C49',
            institution_code TEXT NOT NULL DEFAULT '',
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, institution_code)
          )
        `);

        // Table des emprunteurs avec support sync et isolation par institution
        this.db.run(`
          CREATE TABLE IF NOT EXISTS borrowers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK (type IN ('student', 'staff')),
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            matricule TEXT NOT NULL,
            classe TEXT,
            cniNumber TEXT,
            position TEXT,
            email TEXT,
            phone TEXT,
            institution_code TEXT NOT NULL DEFAULT '',
            -- Métadonnées de synchronisation
            localId TEXT UNIQUE,
            remoteId TEXT,
            syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
            lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            deletedAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(matricule, institution_code)
          )
        `);

        // Table des documents (nouvelle structure) avec isolation par institution
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
            cote TEXT NOT NULL,
            institution_code TEXT NOT NULL DEFAULT '',
            
            -- Champs optionnels
            isbn TEXT,
            description TEXT,
            couverture TEXT,
            type TEXT DEFAULT 'book' CHECK (type IN ('book', 'mémoire', 'thèse', 'rapport', 'article', 'autre')),
            
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
            
            UNIQUE(cote, institution_code),
            FOREIGN KEY (emprunteurId) REFERENCES borrowers(id)
          )
        `);

        // Ajouter la colonne type si elle n'existe pas (migration)
        this.db.run(`
          ALTER TABLE documents ADD COLUMN type TEXT DEFAULT 'book' CHECK (type IN ('book', 'mémoire', 'thèse', 'rapport', 'article', 'autre'))
        `, (err) => {
          // Ignorer l'erreur si la colonne existe déjà
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de la colonne type:', err);
          }
        });

        // Vérifier et recréer la table borrow_history si nécessaire (migration)
        this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='borrow_history'`, (err, row) => {
          if (err) {
            console.error('Erreur lors de la vérification de borrow_history:', err);
            return;
          }
          
          if (!row) {
            console.log('Table borrow_history manquante, création...');
            // La table n'existe pas, la créer avec isolation par institution
            this.db.run(`
              CREATE TABLE borrow_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                documentId INTEGER NOT NULL,
                borrowerId INTEGER NOT NULL,
                borrowDate DATETIME NOT NULL,
                expectedReturnDate DATETIME NOT NULL,
                actualReturnDate DATETIME,
                status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
                notes TEXT,
                institution_code TEXT NOT NULL DEFAULT '',
                localId TEXT UNIQUE,
                remoteId TEXT,
                syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
                lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
                version INTEGER DEFAULT 1,
                deletedAt DATETIME,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (documentId) REFERENCES documents(id),
                FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
              )
            `, (createErr) => {
              if (createErr) {
                console.error('Erreur lors de la création de borrow_history:', createErr);
              } else {
                console.log('Table borrow_history créée avec succès');
              }
            });
          } else {
            // Vérifier les colonnes de la table existante
            this.db.all(`PRAGMA table_info(borrow_history)`, (pragmaErr, columns) => {
              if (pragmaErr) {
                console.error('Erreur lors de la vérification des colonnes:', pragmaErr);
                return;
              }
              
              const columnNames = columns.map((col: any) => col.name);
              if (!columnNames.includes('documentId')) {
                console.error('Colonne documentId manquante dans borrow_history!');
                // Recréer la table avec le bon schéma
                this.db.run(`DROP TABLE IF EXISTS borrow_history`);
                this.db.run(`
                  CREATE TABLE borrow_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    documentId INTEGER NOT NULL,
                    borrowerId INTEGER NOT NULL,
                    borrowDate DATETIME NOT NULL,
                    expectedReturnDate DATETIME NOT NULL,
                    actualReturnDate DATETIME,
                    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
                    notes TEXT,
                    localId TEXT UNIQUE,
                    remoteId TEXT,
                    syncStatus TEXT DEFAULT 'pending' CHECK (syncStatus IN ('synced', 'pending', 'conflict', 'error')),
                    lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
                    version INTEGER DEFAULT 1,
                    deletedAt DATETIME,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (documentId) REFERENCES documents(id),
                    FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
                  )
                `, (recreateErr) => {
                  if (recreateErr) {
                    console.error('Erreur lors de la recréation de borrow_history:', recreateErr);
                  } else {
                    console.log('Table borrow_history recréée avec succès');
                  }
                });
              }
            });
          }
        });

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
            documentId INTEGER NOT NULL,
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
            FOREIGN KEY (documentId) REFERENCES documents(id),
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
        `);

        // Migrations pour ajouter institution_code aux tables existantes
        this.db.run(`ALTER TABLE documents ADD COLUMN institution_code TEXT NOT NULL DEFAULT ''`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de institution_code à documents:', err);
          }
        });

        this.db.run(`ALTER TABLE authors ADD COLUMN institution_code TEXT NOT NULL DEFAULT ''`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de institution_code à authors:', err);
          }
        });

        this.db.run(`ALTER TABLE categories ADD COLUMN institution_code TEXT NOT NULL DEFAULT ''`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de institution_code à categories:', err);
          }
        });

        this.db.run(`ALTER TABLE borrowers ADD COLUMN institution_code TEXT NOT NULL DEFAULT ''`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de institution_code à borrowers:', err);
          }
        });

        this.db.run(`ALTER TABLE borrow_history ADD COLUMN institution_code TEXT NOT NULL DEFAULT ''`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de institution_code à borrow_history:', err);
          }
          // Dernière migration terminée, continuer avec l'initialisation
          this.seedInitialData().then(resolve).catch(reject);
        });
      });
    });
  }

  private async seedInitialData(): Promise<void> {
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
          type: 'student' as const,
          firstName: 'Jean',
          lastName: 'Dupont',
          matricule: 'ET001',
          classe: 'Terminale C',
          email: 'jean.dupont@ecole.cm'
        },
        {
          type: 'student' as const,
          firstName: 'Marie',
          lastName: 'Martin',
          matricule: 'ET002',
          classe: 'Première D',
          email: 'marie.martin@ecole.cm'
        },
        {
          type: 'staff' as const,
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
          type: 'book' as const,
          isbn: '978-2-253-00001-1',
          description: 'Roman historique français décrivant la vie de divers personnages français dans la première moitié du XIXe siècle.',
          estEmprunte: false,
          syncStatus: 'synced' as const,
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
          type: 'book' as const,
          isbn: '978-2-253-00002-2',
          description: 'Premier roman d\'Albert Camus, publié en 1942. Il prend place dans la lignée des récits qui illustrent la philosophie de l\'absurde.',
          estEmprunte: false,
          syncStatus: 'synced' as const,
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
          type: 'book' as const,
          isbn: '978-2-253-00003-3',
          description: 'Premier tome du cycle de Fondation, une saga de science-fiction se déroulant dans un futur lointain.',
          estEmprunte: false,
          syncStatus: 'synced' as const,
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
          type: 'rapport' as const,
          description: 'Ouvrage fondamental sur la découverte et les applications de la radioactivité.',
          estEmprunte: false,
          syncStatus: 'synced' as const,
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
          type: 'book' as const,
          isbn: '978-2-253-00004-4',
          description: 'Roman d\'aventures de Jules Verne décrivant les exploits du capitaine Nemo à bord du Nautilus.',
          estEmprunte: false,
          syncStatus: 'synced' as const,
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
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données:', error);
    }
  }

  // CRUD Borrowers
  async getBorrowers(institutionCode?: string): Promise<Borrower[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM borrowers WHERE deletedAt IS NULL';
      let params: any[] = [];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ' AND institution_code = ?';
        params.push(institutionCode);
      }
      
      query += ' ORDER BY lastName, firstName';
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Borrower[]);
        }
      });
    });
  }

  async addBorrower(borrower: Omit<Borrower, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO borrowers (type, firstName, lastName, matricule, classe, cniNumber, position, email, phone, institution_code, localId, syncStatus, lastModified, version, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
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
        institutionCode || '',
        borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        borrower.syncStatus || 'pending',
        borrower.lastModified || now,
        borrower.version || 1,
        borrower.createdAt || now
      ], function(this: sqlite3.Statement & { lastID?: number }, err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: borrowers.matricule')) {
            reject(new Error('Un emprunteur avec ce matricule existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve(this.lastID || 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async updateBorrower(borrower: Borrower, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      let query = `
        UPDATE borrowers SET 
          type = ?, firstName = ?, lastName = ?, matricule = ?, 
          classe = ?, cniNumber = ?, position = ?, email = ?, phone = ?,
          lastModified = ?, version = version + 1, syncStatus = 'pending'
        WHERE id = ? AND deletedAt IS NULL`;
      
      let params = [
        borrower.type,
        borrower.firstName,
        borrower.lastName,
        borrower.matricule,
        borrower.classe || null,
        borrower.cniNumber || null,
        borrower.position || null,
        borrower.email || null,
        borrower.phone || null,
        now,
        borrower.id
      ];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND institution_code = ?`;
        params.push(institutionCode);
      }
      
      const stmt = this.db.prepare(query);
      
      stmt.run(params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteBorrower(id: number, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Vérifier s'il n'y a pas d'emprunts actifs
      let checkQuery = 'SELECT COUNT(*) as count FROM borrow_history WHERE borrowerId = ? AND status = "active" AND deletedAt IS NULL';
      let checkParams: any[] = [id];
      
      if (institutionCode && institutionCode.trim() !== '') {
        checkQuery += ' AND institution_code = ?';
        checkParams.push(institutionCode);
      }
      
      this.db.get(checkQuery, checkParams, (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count > 0) {
          reject(new Error('Impossible de supprimer : cet emprunteur a des documents non rendus'));
          return;
        }
        
        let deleteQuery = 'UPDATE borrowers SET deletedAt = ?, syncStatus = "pending", version = version + 1 WHERE id = ?';
        let deleteParams = [new Date().toISOString(), id];
        
        if (institutionCode && institutionCode.trim() !== '') {
          deleteQuery += ' AND institution_code = ?';
          deleteParams.push(institutionCode);
        }
        
        this.db.run(deleteQuery, deleteParams, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        });
      });
    });
  }

  async searchBorrowers(query: string, institutionCode?: string): Promise<Borrower[]> {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${query}%`;
      
      let sqlQuery = `
        SELECT * FROM borrowers 
        WHERE deletedAt IS NULL
        AND (firstName LIKE ? OR lastName LIKE ? OR matricule LIKE ? OR classe LIKE ? OR position LIKE ?)`;
      
      let params = [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery];
      
      if (institutionCode && institutionCode.trim() !== '') {
        sqlQuery += ` AND institution_code = ?`;
        params.push(institutionCode);
      }
      
      sqlQuery += ` ORDER BY lastName, firstName`;
      
      this.db.all(sqlQuery, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Borrower[]);
        }
      });
    });
  }

  // Documents CRUD mis à jour (méthodes Books pour compatibilité)
  async getBooks(institutionCode?: string): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL`;
      
      let params: any[] = [];
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND d.institution_code = ?`;
        params.push(institutionCode);
      }
      
      query += ` ORDER BY d.createdAt DESC`;
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const books = rows.map((row: any) => createBookFromDocument(row as Document));
          resolve(books);
        }
      });
    });
  }

  

  // Gestion des emprunts
 async borrowDocument(documentId: number, borrowerId: number, expectedReturnDate: string, institutionCode?: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const borrowDate = new Date().toISOString();
    const database = this.db; // Capturer this.db dans une variable locale
    
    database.serialize(() => {
      database.run('BEGIN TRANSACTION');
      
      const stmt1 = database.prepare(`
        INSERT INTO borrow_history (documentId, borrowerId, borrowDate, expectedReturnDate, status, institution_code, localId, syncStatus, lastModified, version, createdAt)
        VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      const localId = `borrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      stmt1.run([documentId, borrowerId, borrowDate, expectedReturnDate, institutionCode || '', localId, 'pending', now, 1, now], function(this: sqlite3.RunResult, err: Error | null) {
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
        
        stmt2.run([borrowerId, borrowDate, expectedReturnDate, documentId], (err: Error | null) => {
          if (err) {
            database.run('ROLLBACK');
            reject(err);
          } else {
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

  // Legacy method for backward compatibility
  async borrowBook(documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> {
    return this.borrowDocument(documentId, borrowerId, expectedReturnDate);
  }

  async returnBook(borrowHistoryId: number, notes?: string, institutionCode?: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const returnDate = new Date().toISOString();
    const database = this.db; // Capturer this.db dans une variable locale
    
    database.serialize(() => {
      database.run('BEGIN TRANSACTION');
      
      database.get('SELECT documentId FROM borrow_history WHERE id = ?', [borrowHistoryId], (err: Error | null, row: any) => {
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
        
        const documentId = row.documentId;
        
        const stmt1 = database.prepare(`
          UPDATE borrow_history SET 
            actualReturnDate = ?, 
            status = 'returned',
            notes = ?
          WHERE id = ?
        `);
        
        stmt1.run([returnDate, notes || null, borrowHistoryId], function(this: sqlite3.RunResult, err: Error | null) {
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
          
          stmt2.run([returnDate, documentId], function(this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              database.run('ROLLBACK');
              reject(err);
            } else {
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

  async getBorrowedDocuments(institutionCode?: string): Promise<BorrowHistory[]> {
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
        JOIN documents d ON bh.documentId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.status = 'active' AND bh.deletedAt IS NULL AND d.deletedAt IS NULL`;
      
      let params: any[] = [];
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND bh.institution_code = ?`;
        params.push(institutionCode);
      }
      
      query += ` ORDER BY bh.borrowDate DESC`;
      
      this.db.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const history = rows.map(row => ({
            id: row.id,
            documentId: row.documentId,
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
            document: {
              id: row.documentId,
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
              cote: `${row.category.substring(0,3)}-${row.author.substring(0,3)}-001`.toUpperCase(),
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

  async getBorrowHistory(filter?: HistoryFilter, institutionCode?: string): Promise<BorrowHistory[]> {
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
        JOIN documents d ON bh.documentId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
      `;
      
      const conditions: string[] = ['bh.deletedAt IS NULL', 'd.deletedAt IS NULL'];
      const params: any[] = [];
      
      if (institutionCode && institutionCode.trim() !== '') {
        conditions.push('bh.institution_code = ?');
        params.push(institutionCode);
      }
      
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
        
        if (filter.documentId) {
          conditions.push('bh.documentId = ?');
          params.push(filter.documentId);
        }
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY bh.borrowDate DESC';
      
      this.db.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const history = rows.map(row => ({
            id: row.id,
            documentId: row.documentId,
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
            document: {
              id: row.documentId,
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
              cote: `${row.category.substring(0,3)}-${row.author.substring(0,3)}-001`.toUpperCase(),
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
  async getAuthors(institutionCode?: string): Promise<Author[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM authors WHERE deletedAt IS NULL';
      let params: any[] = [];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ' AND institution_code = ?';
        params.push(institutionCode);
      }
      
      query += ' ORDER BY name';
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Author[]);
        }
      });
    });
  }

  async addAuthor(author: Omit<Author, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO authors (name, biography, birthDate, nationality, institution_code, localId, syncStatus, lastModified, version, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      stmt.run([
        author.name,
        author.biography,
        author.birthDate,
        author.nationality,
        institutionCode || '',
        author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author.syncStatus || 'pending',
        author.lastModified || now,
        author.version || 1,
        author.createdAt || now
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID || 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async getCategories(institutionCode?: string): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM categories WHERE deletedAt IS NULL';
      let params: any[] = [];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ' AND institution_code = ?';
        params.push(institutionCode);
      }
      
      query += ' ORDER BY name';
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Category[]);
        }
      });
    });
  }

  async addCategory(category: Omit<Category, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO categories (name, description, color, institution_code, localId, syncStatus, lastModified, version, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      stmt.run([
        category.name,
        category.description,
        category.color || '#3E5C49',
        institutionCode || '',
        category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category.syncStatus || 'pending',
        category.lastModified || now,
        category.version || 1,
        category.createdAt || now
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID || 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async searchBooks(query: string, institutionCode?: string): Promise<Book[]> {
    // Méthode de compatibilité - utilise searchDocuments() et convertit le résultat
    try {
      const documents = await this.searchDocuments(query, institutionCode);
      return documents.map(doc => createBookFromDocument(doc));
    } catch (error) {
      throw error;
    }
  }

  async getStats(institutionCode?: string): Promise<Stats> {
  return new Promise((resolve, reject) => {
    this.db.serialize(() => {
      const stats: any = {};
      
      let whereClause = institutionCode ? 'WHERE deletedAt IS NULL AND institution_code = ?' : 'WHERE deletedAt IS NULL';
      let params = institutionCode ? [institutionCode] : [];
      
      console.log('🔍 DEBUG getStats - Institution filtering:', {
        institutionCode,
        whereClause,
        params
      });
      
      // Utiliser documents au lieu de books
      this.db.get(`SELECT COUNT(*) as count FROM documents ${whereClause}`, params, (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        stats.totalDocuments = row.count || 0;
        
        let borrowedWhereClause = institutionCode ? 'WHERE estEmprunte = 1 AND deletedAt IS NULL AND institution_code = ?' : 'WHERE estEmprunte = 1 AND deletedAt IS NULL';
        this.db.get(`SELECT COUNT(*) as count FROM documents ${borrowedWhereClause}`, params, (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          stats.borrowedDocuments = row.count || 0;
          stats.availableDocuments = (stats.totalDocuments || 0) - (stats.borrowedDocuments || 0);
          
          this.db.get(`SELECT COUNT(*) as count FROM authors ${whereClause}`, params, (err: Error | null, row: any) => {
            if (err) {
              reject(err);
              return;
            }
            stats.totalAuthors = row.count || 0;
            
            this.db.get(`SELECT COUNT(*) as count FROM categories ${whereClause}`, params, (err: Error | null, row: any) => {
              if (err) {
                reject(err);
                return;
              }
              stats.totalCategories = row.count || 0;
              
              this.db.get(`SELECT COUNT(*) as count FROM borrowers ${whereClause}`, params, (err: Error | null, row: any) => {
                if (err) {
                  reject(err);
                  return;
                }
                stats.totalBorrowers = row.count || 0;
                
                let studentWhereClause = institutionCode ? 'WHERE type = "student" AND deletedAt IS NULL AND institution_code = ?' : 'WHERE type = "student" AND deletedAt IS NULL';
                this.db.get(`SELECT COUNT(*) as count FROM borrowers ${studentWhereClause}`, params, (err: Error | null, row: any) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  stats.totalStudents = row.count || 0;
                  
                  let staffWhereClause = institutionCode ? 'WHERE type = "staff" AND deletedAt IS NULL AND institution_code = ?' : 'WHERE type = "staff" AND deletedAt IS NULL';
                  this.db.get(`SELECT COUNT(*) as count FROM borrowers ${staffWhereClause}`, params, (err: Error | null, row: any) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    stats.totalStaff = row.count || 0;
                    
                    // Compter les documents en retard
                    const now = new Date().toISOString();
                    let overdueWhereClause = institutionCode ? 'WHERE status = \'active\' AND expectedReturnDate < ? AND deletedAt IS NULL AND institution_code = ?' : 'WHERE status = \'active\' AND expectedReturnDate < ? AND deletedAt IS NULL';
                    let overdueParams = institutionCode ? [now, institutionCode] : [now];
                    this.db.get(`
                      SELECT COUNT(*) as count FROM borrow_history 
                      ${overdueWhereClause}
                    `, overdueParams, (err: Error | null, row: any) => {
                      if (err) {
                        reject(err);
                        return;
                      }
                      stats.overdueDocuments = row.count || 0;
                      resolve(stats as Stats);
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
  async clearDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Vérifier et supprimer les tables existantes
        const tables = ['borrow_history', 'documents', 'borrowers', 'authors', 'categories'];
        let deletedCount = 0;
        
        const deleteFromTable = (tableName: string) => {
          this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
            if (err) {
              console.error(`Erreur lors de la vérification de la table ${tableName}:`, err);
              reject(err);
              return;
            }
            
            if (row) {
              // La table existe, on peut la vider
              this.db.run(`DELETE FROM ${tableName}`, (deleteErr) => {
                if (deleteErr) {
                  console.error(`Erreur lors de la suppression de ${tableName}:`, deleteErr);
                  reject(deleteErr);
                  return;
                }
                console.log(`Table ${tableName} vidée avec succès`);
                deletedCount++;
                if (deletedCount === tables.length) {
                  resolve();
                }
              });
            } else {
              console.log(`Table ${tableName} n'existe pas, ignorée`);
              deletedCount++;
              if (deletedCount === tables.length) {
                resolve();
              }
            }
          });
        };
        
        // Supprimer de toutes les tables
        tables.forEach(deleteFromTable);
      });
    });
  }

  // ===============================
  // NOUVELLES MÉTHODES POUR DOCUMENTS
  // ===============================

  async getDocuments(institutionCode?: string): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          d.*,
          b.firstName as borrower_firstName,
          b.lastName as borrower_lastName
        FROM documents d
        LEFT JOIN borrowers b ON d.emprunteurId = b.id
        WHERE d.deletedAt IS NULL
      `;
      
      let params: any[] = [];
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND d.institution_code = ?`;
        params.push(institutionCode);
      }
      
      query += ` ORDER BY d.lastModified DESC`;
      
      console.log('🔍 DEBUG getDocuments - institutionCode:', institutionCode);
      console.log('🔍 DEBUG getDocuments - query:', query);
      console.log('🔍 DEBUG getDocuments - params:', params);
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const documents = rows.map((row: any) => ({
            id: row.id,
            auteur: row.auteur,
            titre: row.titre,
            editeur: row.editeur,
            lieuEdition: row.lieuEdition,
            annee: row.annee,
            descripteurs: row.descripteurs,
            cote: row.cote,
            type: row.type || 'book',
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

  async addDocument(document: Omit<Document, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const localId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT INTO documents (
          auteur, titre, editeur, lieuEdition, annee, descripteurs, cote, type,
          isbn, description, couverture, estEmprunte, institution_code,
          localId, syncStatus, lastModified, version, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        document.auteur,
        document.titre,
        document.editeur,
        document.lieuEdition,
        document.annee,
        document.descripteurs,
        document.cote,
        document.type || 'book',
        document.isbn || null,
        document.description || null,
        document.couverture || null,
        document.estEmprunte ? 1 : 0,
        institutionCode || '',
        localId,
        'pending',
        now,
        1,
        now
      ], function(this: sqlite3.Statement & { lastID?: number }, err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
            reject(new Error('Un document avec cette cote existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve(this.lastID || 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async updateDocument(document: Document, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      let query = `
        UPDATE documents SET 
          auteur = ?, titre = ?, editeur = ?, lieuEdition = ?, annee = ?, 
          descripteurs = ?, cote = ?, type = ?, isbn = ?, description = ?, couverture = ?,
          lastModified = ?, version = version + 1, syncStatus = 'pending'
        WHERE id = ? AND deletedAt IS NULL`;
      
      let params = [
        document.auteur,
        document.titre,
        document.editeur,
        document.lieuEdition,
        document.annee,
        document.descripteurs,
        document.cote,
        document.type || 'book',
        document.isbn || null,
        document.description || null,
        document.couverture || null,
        now,
        document.id
      ];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND institution_code = ?`;
        params.push(institutionCode);
      }
      
      const stmt = this.db.prepare(query);
      
      stmt.run(params, function(this: sqlite3.Statement & { changes?: number }, err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: documents.cote')) {
            reject(new Error('Un autre document avec cette cote existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve((this.changes || 0) > 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteDocument(id: number, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      let query = `
        UPDATE documents 
        SET deletedAt = ?, lastModified = ?, syncStatus = 'pending', version = version + 1
        WHERE id = ? AND deletedAt IS NULL`;
      
      let params = [now, now, id];
      
      if (institutionCode && institutionCode.trim() !== '') {
        query += ` AND institution_code = ?`;
        params.push(institutionCode);
      }
      
      const stmt = this.db.prepare(query);
      
      stmt.run(params, function(this: sqlite3.Statement & { changes?: number }, err: SQLiteError | null) {
        if (err) {
          reject(err);
        } else {
          resolve((this.changes || 0) > 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async searchDocuments(query: string, institutionCode?: string): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${query.toLowerCase()}%`;
      
      let sqlQuery = `
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
        )`;
      
      let params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
      
      if (institutionCode && institutionCode.trim() !== '') {
        sqlQuery += ` AND d.institution_code = ?`;
        params.push(institutionCode);
      }
      
      sqlQuery += ` ORDER BY d.lastModified DESC`;
      
      this.db.all(sqlQuery, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const documents = rows.map((row: any) => ({
            id: row.id,
            auteur: row.auteur,
            titre: row.titre,
            editeur: row.editeur,
            lieuEdition: row.lieuEdition,
            annee: row.annee,
            descripteurs: row.descripteurs,
            cote: row.cote,
            type: row.type || 'book',
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

  async getSyncQueue(): Promise<SyncOperation[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM sync_queue ORDER BY timestamp ASC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const operations = rows.map((row: any) => ({
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

  async addSyncOperation(operation: SyncOperation): Promise<void> {
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
        } else {
          resolve();
        }
      });
      
      stmt.finalize();
    });
  }

  async updateSyncOperation(operation: SyncOperation): Promise<void> {
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
        } else {
          resolve();
        }
      });
      
      stmt.finalize();
    });
  }

  async removeSyncOperation(operationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM sync_queue WHERE id = ?', [operationId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Méthodes pour mettre à jour les IDs distants
  async updateDocumentRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE documents SET remoteId = ?, syncStatus = "synced" WHERE localId = ?',
        [remoteId, localId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateAuthorRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE authors SET remoteId = ?, syncStatus = "synced" WHERE localId = ?',
        [remoteId, localId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateCategoryRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE categories SET remoteId = ?, syncStatus = "synced" WHERE localId = ?',
        [remoteId, localId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateBorrowerRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE borrowers SET remoteId = ?, syncStatus = "synced" WHERE localId = ?',
        [remoteId, localId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateBorrowHistoryRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE borrow_history SET remoteId = ?, syncStatus = "synced" WHERE localId = ?',
        [remoteId, localId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Fonction pour nettoyer toutes les données (pour debug et réinitialisation)
  async clearAllData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Vérifier et supprimer les données de toutes les tables
        const tables = ['borrow_history', 'documents', 'borrowers', 'authors', 'categories'];
        let processedCount = 0;
        let hasError = false;
        
        const clearTable = (tableName: string) => {
          this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
            if (err) {
              console.error(`Erreur lors de la vérification de la table ${tableName}:`, err);
              if (!hasError) {
                hasError = true;
                reject(err);
              }
              return;
            }
            
            if (row) {
              // La table existe, on peut la vider
              this.db.run(`DELETE FROM ${tableName}`, (deleteErr) => {
                if (deleteErr) {
                  console.error(`Erreur lors de la suppression de ${tableName}:`, deleteErr);
                  if (!hasError) {
                    hasError = true;
                    reject(deleteErr);
                  }
                  return;
                }
                console.log(`Table ${tableName} vidée avec succès`);
                processedCount++;
                if (processedCount === tables.length && !hasError) {
                  console.log('Toutes les données ont été supprimées avec succès');
                  resolve(true);
                }
              });
            } else {
              console.log(`Table ${tableName} n'existe pas, ignorée`);
              processedCount++;
              if (processedCount === tables.length && !hasError) {
                console.log('Toutes les données ont été supprimées avec succès');
                resolve(true);
              }
            }
          });
        };
        
        // Nettoyer toutes les tables
        tables.forEach(clearTable);
      });
    });
  }

  // ===============================
  // MÉTHODES DE MIGRATION DES DONNÉES
  // ===============================

  async assignOrphanDataToInstitution(institutionCode: string): Promise<{
    documents: number;
    authors: number;
    categories: number;
    borrowers: number;
    borrowHistory: number;
  }> {
    return new Promise((resolve, reject) => {
      const results = {
        documents: 0,
        authors: 0,
        categories: 0,
        borrowers: 0,
        borrowHistory: 0
      };

      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');

        // Assigner les documents orphelins
        this.db.run(
          `UPDATE documents SET institution_code = ?, lastModified = ?, syncStatus = 'pending' WHERE institution_code = '' OR institution_code IS NULL`,
          [institutionCode, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Erreur lors de l\'assignation des documents:', err);
            } else {
              results.documents = this.changes || 0;
            }
          }
        );

        // Assigner les auteurs orphelins
        this.db.run(
          `UPDATE authors SET institution_code = ?, lastModified = ?, syncStatus = 'pending' WHERE institution_code = '' OR institution_code IS NULL`,
          [institutionCode, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Erreur lors de l\'assignation des auteurs:', err);
            } else {
              results.authors = this.changes || 0;
            }
          }
        );

        // Assigner les catégories orphelines
        this.db.run(
          `UPDATE categories SET institution_code = ?, lastModified = ?, syncStatus = 'pending' WHERE institution_code = '' OR institution_code IS NULL`,
          [institutionCode, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Erreur lors de l\'assignation des catégories:', err);
            } else {
              results.categories = this.changes || 0;
            }
          }
        );

        // Assigner les emprunteurs orphelins
        this.db.run(
          `UPDATE borrowers SET institution_code = ?, lastModified = ?, syncStatus = 'pending' WHERE institution_code = '' OR institution_code IS NULL`,
          [institutionCode, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Erreur lors de l\'assignation des emprunteurs:', err);
            } else {
              results.borrowers = this.changes || 0;
            }
          }
        );

        // Assigner l'historique d'emprunts orphelin
        const db = this.db; // Capturer la référence pour le callback
        db.run(
          `UPDATE borrow_history SET institution_code = ?, lastModified = ?, syncStatus = 'pending' WHERE institution_code = '' OR institution_code IS NULL`,
          [institutionCode, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Erreur lors de l\'assignation de l\'historique:', err);
              db.run('ROLLBACK');
              reject(err);
            } else {
              results.borrowHistory = this.changes || 0;
              db.run('COMMIT');
              resolve(results);
            }
          }
        );
      });
    });
  }

  async getOrphanDataCount(): Promise<{
    documents: number;
    authors: number;
    categories: number;
    borrowers: number;
    borrowHistory: number;
  }> {
    return new Promise((resolve, reject) => {
      const results = {
        documents: 0,
        authors: 0,
        categories: 0,
        borrowers: 0,
        borrowHistory: 0
      };

      let completedQueries = 0;
      const totalQueries = 5;

      const checkComplete = () => {
        completedQueries++;
        if (completedQueries === totalQueries) {
          resolve(results);
        }
      };

      // Compter les documents orphelins
      this.db.get(
        `SELECT COUNT(*) as count FROM documents WHERE (institution_code = '' OR institution_code IS NULL) AND deletedAt IS NULL`,
        (err, row: any) => {
          if (err) {
            console.error('Erreur lors du comptage des documents:', err);
          } else {
            results.documents = row.count || 0;
          }
          checkComplete();
        }
      );

      // Compter les auteurs orphelins
      this.db.get(
        `SELECT COUNT(*) as count FROM authors WHERE (institution_code = '' OR institution_code IS NULL) AND deletedAt IS NULL`,
        (err, row: any) => {
          if (err) {
            console.error('Erreur lors du comptage des auteurs:', err);
          } else {
            results.authors = row.count || 0;
          }
          checkComplete();
        }
      );

      // Compter les catégories orphelines
      this.db.get(
        `SELECT COUNT(*) as count FROM categories WHERE (institution_code = '' OR institution_code IS NULL) AND deletedAt IS NULL`,
        (err, row: any) => {
          if (err) {
            console.error('Erreur lors du comptage des catégories:', err);
          } else {
            results.categories = row.count || 0;
          }
          checkComplete();
        }
      );

      // Compter les emprunteurs orphelins
      this.db.get(
        `SELECT COUNT(*) as count FROM borrowers WHERE (institution_code = '' OR institution_code IS NULL) AND deletedAt IS NULL`,
        (err, row: any) => {
          if (err) {
            console.error('Erreur lors du comptage des emprunteurs:', err);
          } else {
            results.borrowers = row.count || 0;
          }
          checkComplete();
        }
      );

      // Compter l'historique orphelin
      this.db.get(
        `SELECT COUNT(*) as count FROM borrow_history WHERE (institution_code = '' OR institution_code IS NULL) AND deletedAt IS NULL`,
        (err, row: any) => {
          if (err) {
            console.error('Erreur lors du comptage de l\'historique:', err);
          } else {
            results.borrowHistory = row.count || 0;
          }
          checkComplete();
        }
      );
    });
  }

  // ===============================
  // MÉTHODE POUR ACTIVITÉ RÉCENTE
  // ===============================

  async getRecentActivity(limit: number = 10, institutionCode?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Combiner trois requêtes pour l'activité récente :
      // 1. Documents récemment ajoutés
      // 2. Emprunts récents 
      // 3. Retours récents

      const activities: any[] = [];
      let queriesCompleted = 0;
      const totalQueries = 3;

      const checkComplete = () => {
        queriesCompleted++;
        if (queriesCompleted === totalQueries) {
          // Trier par date et limiter les résultats
          activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          resolve(activities.slice(0, limit));
        }
      };

      // 1. Documents récemment ajoutés (dernières 7 jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      let documentsQuery = `
        SELECT 
          d.titre, d.auteur, d.createdAt,
          'add' as type
        FROM documents d
        WHERE d.deletedAt IS NULL 
        AND d.createdAt >= ?`;
      
      let documentsParams = [sevenDaysAgo.toISOString()];
      
      if (institutionCode && institutionCode.trim() !== '') {
        documentsQuery += ` AND d.institution_code = ?`;
        documentsParams.push(institutionCode);
      }
      
      documentsQuery += ` ORDER BY d.createdAt DESC LIMIT 5`;
      
      this.db.all(documentsQuery, documentsParams, (err, rows: any[]) => {
        if (err) {
          console.error('Erreur lors de la récupération des documents récents:', err);
        } else {
          rows.forEach(row => {
            activities.push({
              type: 'add',
              title: 'Nouveau document ajouté',
              description: `${row.titre} par ${row.auteur}`,
              timestamp: row.createdAt,
              time: this.formatRelativeTime(row.createdAt)
            });
          });
        }
        checkComplete();
      });

      // 2. Emprunts récents (dernières 48 heures)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      let borrowsQuery = `
        SELECT 
          bh.borrowDate,
          d.titre, d.auteur,
          br.firstName, br.lastName
        FROM borrow_history bh
        JOIN documents d ON bh.documentId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.borrowDate >= ?
        AND bh.deletedAt IS NULL`;
      
      let borrowsParams = [twoDaysAgo.toISOString()];
      
      if (institutionCode && institutionCode.trim() !== '') {
        borrowsQuery += ` AND bh.institution_code = ?`;
        borrowsParams.push(institutionCode);
      }
      
      borrowsQuery += ` ORDER BY bh.borrowDate DESC LIMIT 5`;

      this.db.all(borrowsQuery, borrowsParams, (err, rows: any[]) => {
        if (err) {
          console.error('Erreur lors de la récupération des emprunts récents:', err);
        } else {
          rows.forEach(row => {
            activities.push({
              type: 'borrow',
              title: 'Document emprunté',
              description: `${row.titre} par ${row.firstName} ${row.lastName}`,
              timestamp: row.borrowDate,
              time: this.formatRelativeTime(row.borrowDate)
            });
          });
        }
        checkComplete();
      });

      // 3. Retours récents (dernières 48 heures)
      let returnsQuery = `
        SELECT 
          bh.actualReturnDate,
          d.titre, d.auteur,
          br.firstName, br.lastName
        FROM borrow_history bh
        JOIN documents d ON bh.documentId = d.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.actualReturnDate >= ?
        AND bh.actualReturnDate IS NOT NULL
        AND bh.deletedAt IS NULL`;
      
      let returnsParams = [twoDaysAgo.toISOString()];
      
      if (institutionCode && institutionCode.trim() !== '') {
        returnsQuery += ` AND bh.institution_code = ?`;
        returnsParams.push(institutionCode);
      }
      
      returnsQuery += ` ORDER BY bh.actualReturnDate DESC LIMIT 5`;
      
      this.db.all(returnsQuery, returnsParams, (err, rows: any[]) => {
        if (err) {
          console.error('Erreur lors de la récupération des retours récents:', err);
        } else {
          rows.forEach(row => {
            activities.push({
              type: 'return',
              title: 'Document rendu',
              description: `${row.titre} par ${row.firstName} ${row.lastName}`,
              timestamp: row.actualReturnDate,
              time: this.formatRelativeTime(row.actualReturnDate)
            });
          });
        }
        checkComplete();
      });
    });
  }

  private formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'À l\'instant';
    } else if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  // ===============================
  // GESTION DES INFORMATIONS D'INSTITUTION
  // ===============================

  async saveInstitutionInfo(info: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Créer la table si elle n'existe pas
        this.db.run(`
          CREATE TABLE IF NOT EXISTS institution_info (
            institutionCode TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            shortName TEXT,
            address TEXT,
            city TEXT,
            postalCode TEXT,
            country TEXT,
            phone TEXT,
            email TEXT,
            website TEXT,
            logo TEXT,
            description TEXT,
            type TEXT,
            director TEXT,
            librarian TEXT,
            establishedYear INTEGER,
            reportHeader TEXT,
            reportFooter TEXT,
            primaryColor TEXT,
            secondaryColor TEXT,
            lastModified TEXT,
            version INTEGER DEFAULT 1
          )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Insérer ou mettre à jour
          const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO institution_info (
              institutionCode, name, shortName, address, city, postalCode, country,
              phone, email, website, logo, description, type, director, librarian,
              establishedYear, reportHeader, reportFooter, primaryColor, secondaryColor,
              lastModified, version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          stmt.run([
            info.institutionCode,
            info.name,
            info.shortName || null,
            info.address,
            info.city,
            info.postalCode || null,
            info.country,
            info.phone || null,
            info.email || null,
            info.website || null,
            info.logo || null,
            info.description || null,
            info.type,
            info.director || null,
            info.librarian || null,
            info.establishedYear || null,
            info.reportHeader || null,
            info.reportFooter || null,
            info.primaryColor || '#3E5C49',
            info.secondaryColor || '#C2571B',
            info.lastModified,
            info.version || 1
          ], function(this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
            } else {
              console.log('✅ Institution info saved for:', info.institutionCode);
              resolve();
            }
          });
        });
      });
    });
  }

  async getInstitutionInfo(institutionCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM institution_info WHERE institutionCode = ?',
        [institutionCode],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }
}