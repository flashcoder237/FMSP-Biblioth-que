import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { Book, Author, Category, Stats, Borrower, BorrowHistory, HistoryFilter } from '../preload';

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
        // Table des auteurs
        this.db.run(`
          CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            biography TEXT,
            birthDate TEXT,
            nationality TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Table des catégories
        this.db.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            color TEXT DEFAULT '#3E5C49',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Table des emprunteurs
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
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Table des livres - mise à jour
        this.db.run(`
          CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT,
            category TEXT NOT NULL,
            publishedDate TEXT,
            description TEXT,
            coverUrl TEXT,
            isBorrowed BOOLEAN DEFAULT 0,
            borrowerId INTEGER,
            borrowDate TEXT,
            expectedReturnDate TEXT,
            returnDate TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(isbn) ON CONFLICT IGNORE,
            FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
          )
        `);

        // Table historique des emprunts
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
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bookId) REFERENCES books(id),
            FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            this.seedInitialData().then(resolve).catch(reject);
          }
        });
      });
    });
  }

  private async seedInitialData(): Promise<void> {
    try {
      // Vérifier si des données existent déjà
      const existingBooks = await this.getBooks();
      if (existingBooks.length > 0) {
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

      const books = [
        {
          title: 'Les Misérables',
          author: 'Victor Hugo',
          isbn: '978-2-253-00001-1',
          category: 'Fiction',
          publishedDate: '1862',
          description: 'Roman historique français décrivant la vie de divers personnages français dans la première moitié du XIXe siècle.',
          isBorrowed: false
        },
        {
          title: 'L\'Étranger',
          author: 'Albert Camus',
          isbn: '978-2-253-00002-2',
          category: 'Fiction',
          publishedDate: '1942',
          description: 'Premier roman d\'Albert Camus, publié en 1942. Il prend place dans la lignée des récits qui illustrent la philosophie de l\'absurde.',
          isBorrowed: false
        },
        {
          title: 'Fondation',
          author: 'Isaac Asimov',
          isbn: '978-2-253-00003-3',
          category: 'Science-Fiction',
          publishedDate: '1951',
          description: 'Premier tome du cycle de Fondation, une saga de science-fiction se déroulant dans un futur lointain.',
          isBorrowed: false
        }
      ];

      // Ajouter les catégories
      for (const category of categories) {
        await this.addCategory(category);
      }

      // Ajouter les auteurs
      for (const author of authors) {
        await this.addAuthor(author);
      }

      // Ajouter les emprunteurs
      for (const borrower of borrowers) {
        await this.addBorrower(borrower);
      }

      // Ajouter les livres
      for (const book of books) {
        await this.addBook(book);
      }

      console.log('Données d\'exemple ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données:', error);
    }
  }

  // CRUD Borrowers
  async getBorrowers(): Promise<Borrower[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM borrowers ORDER BY lastName, firstName', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Borrower[]);
        }
      });
    });
  }

  async addBorrower(borrower: Omit<Borrower, 'id'>): Promise<number> {
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
      ], function(err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: borrowers.matricule')) {
            reject(new Error('Un emprunteur avec ce matricule existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve(this.lastID);
        }
      });
      
      stmt.finalize();
    });
  }

  async updateBorrower(borrower: Borrower): Promise<boolean> {
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
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteBorrower(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Vérifier s'il n'y a pas d'emprunts actifs
      this.db.get('SELECT COUNT(*) as count FROM borrow_history WHERE borrowerId = ? AND status = "active"', 
        [id], (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count > 0) {
          reject(new Error('Impossible de supprimer : cet emprunteur a des livres non rendus'));
          return;
        }
        
        this.db.run('DELETE FROM borrowers WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        });
      });
    });
  }

  async searchBorrowers(query: string): Promise<Borrower[]> {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${query}%`;
      this.db.all(`
        SELECT * FROM borrowers 
        WHERE firstName LIKE ? OR lastName LIKE ? OR matricule LIKE ? OR classe LIKE ? OR position LIKE ?
        ORDER BY lastName, firstName
      `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Borrower[]);
        }
      });
    });
  }

  // Books CRUD mis à jour
  async getBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM books ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  async addBook(book: Omit<Book, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const isbn = book.isbn && book.isbn.trim() ? book.isbn.trim() : null;
      
      const stmt = this.db.prepare(`
        INSERT INTO books (title, author, isbn, category, publishedDate, description, coverUrl, isBorrowed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        book.title,
        book.author,
        isbn,
        book.category,
        book.publishedDate,
        book.description,
        book.coverUrl,
        book.isBorrowed ? 1 : 0
      ], function(err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: books.isbn')) {
            reject(new Error('Un livre avec cet ISBN existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve(this.lastID);
        }
      });
      
      stmt.finalize();
    });
  }

  async updateBook(book: Book): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const isbn = book.isbn && book.isbn.trim() ? book.isbn.trim() : null;
      
      const stmt = this.db.prepare(`
        UPDATE books SET 
          title = ?, author = ?, isbn = ?, category = ?, publishedDate = ?, 
          description = ?, coverUrl = ?, isBorrowed = ?, borrowerId = ?, 
          borrowDate = ?, expectedReturnDate = ?, returnDate = ?
        WHERE id = ?
      `);
      
      stmt.run([
        book.title,
        book.author,
        isbn,
        book.category,
        book.publishedDate,
        book.description,
        book.coverUrl,
        book.isBorrowed ? 1 : 0,
        book.borrowerId || null,
        book.borrowDate,
        book.expectedReturnDate,
        book.returnDate,
        book.id
      ], function(err: SQLiteError | null) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message && err.message.includes('UNIQUE constraint failed: books.isbn')) {
            reject(new Error('Un autre livre avec cet ISBN existe déjà'));
          } else {
            reject(err);
          }
        } else {
          resolve(this.changes > 0);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteBook(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Vérifier s'il n'y a pas d'emprunts actifs
      this.db.get('SELECT COUNT(*) as count FROM borrow_history WHERE bookId = ? AND status = "active"', 
        [id], (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count > 0) {
          reject(new Error('Impossible de supprimer : ce livre est actuellement emprunté'));
          return;
        }
        
        this.db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        });
      });
    });
  }

  // Gestion des emprunts
  async borrowBook(bookId: number, borrowerId: number, expectedReturnDate: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const borrowDate = new Date().toISOString();
      
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        // Créer l'entrée dans l'historique
        const stmt1 = this.db.prepare(`
          INSERT INTO borrow_history (bookId, borrowerId, borrowDate, expectedReturnDate, status)
          VALUES (?, ?, ?, ?, 'active')
        `);
        
        stmt1.run([bookId, borrowerId, borrowDate, expectedReturnDate], function(err: any) {
          if (err) {
            this.db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          const historyId = this.lastID;
          
          // Mettre à jour le livre
          const stmt2 = this.db.prepare(`
            UPDATE books SET 
              isBorrowed = 1, 
              borrowerId = ?, 
              borrowDate = ?, 
              expectedReturnDate = ?
            WHERE id = ?
          `);
          
          stmt2.run([borrowerId, borrowDate, expectedReturnDate, bookId], function(err: any) {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
            } else {
              this.db.run('COMMIT');
              resolve(historyId);
            }
          });
          
          stmt2.finalize();
        });
        
        stmt1.finalize();
      });
    });
  }

  async returnBook(borrowHistoryId: number, notes?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const returnDate = new Date().toISOString();
      
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        // Récupérer les infos de l'emprunt
        this.db.get('SELECT bookId FROM borrow_history WHERE id = ?', [borrowHistoryId], (err: any, row: any) => {
          if (err) {
            this.db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          if (!row) {
            this.db.run('ROLLBACK');
            reject(new Error('Emprunt non trouvé'));
            return;
          }
          
          const bookId = row.bookId;
          
          // Mettre à jour l'historique
          const stmt1 = this.db.prepare(`
            UPDATE borrow_history SET 
              actualReturnDate = ?, 
              status = 'returned',
              notes = ?
            WHERE id = ?
          `);
          
          stmt1.run([returnDate, notes || null, borrowHistoryId], function(err: any) {
            if (err) {
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }
            
            // Mettre à jour le livre
            const stmt2 = this.db.prepare(`
              UPDATE books SET 
                isBorrowed = 0, 
                borrowerId = NULL, 
                borrowDate = NULL,
                expectedReturnDate = NULL,
                returnDate = ?
              WHERE id = ?
            `);
            
            stmt2.run([returnDate, bookId], function(err: any) {
              if (err) {
                this.db.run('ROLLBACK');
                reject(err);
              } else {
                this.db.run('COMMIT');
                resolve(this.changes > 0);
              }
            });
            
            stmt2.finalize();
          });
          
          stmt1.finalize();
        });
      });
    });
  }

  async getBorrowedBooks(): Promise<BorrowHistory[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          bh.*,
          b.title, b.author, b.category, b.coverUrl,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position
        FROM borrow_history bh
        JOIN books b ON bh.bookId = b.id
        JOIN borrowers br ON bh.borrowerId = br.id
        WHERE bh.status = 'active'
        ORDER BY bh.borrowDate DESC
      `, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const history = rows.map(row => ({
            id: row.id,
            bookId: row.bookId,
            borrowerId: row.borrowerId,
            borrowDate: row.borrowDate,
            expectedReturnDate: row.expectedReturnDate,
            actualReturnDate: row.actualReturnDate,
            status: row.status,
            notes: row.notes,
            createdAt: row.createdAt,
            book: {
              id: row.bookId,
              title: row.title,
              author: row.author,
              category: row.category,
              coverUrl: row.coverUrl
            },
            borrower: {
              id: row.borrowerId,
              firstName: row.firstName,
              lastName: row.lastName,
              type: row.type,
              matricule: row.matricule,
              classe: row.classe,
              position: row.position
            }
          }));
          resolve(history);
        }
      });
    });
  }

  async getBorrowHistory(filter?: HistoryFilter): Promise<BorrowHistory[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          bh.*,
          b.title, b.author, b.category, b.coverUrl,
          br.firstName, br.lastName, br.type, br.matricule, br.classe, br.position
        FROM borrow_history bh
        JOIN books b ON bh.bookId = b.id
        JOIN borrowers br ON bh.borrowerId = br.id
      `;
      
      const conditions: string[] = [];
      const params: any[] = [];
      
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
      
      this.db.all(query, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const history = rows.map(row => ({
            id: row.id,
            bookId: row.bookId,
            borrowerId: row.borrowerId,
            borrowDate: row.borrowDate,
            expectedReturnDate: row.expectedReturnDate,
            actualReturnDate: row.actualReturnDate,
            status: row.status,
            notes: row.notes,
            createdAt: row.createdAt,
            book: {
              id: row.bookId,
              title: row.title,
              author: row.author,
              category: row.category,
              coverUrl: row.coverUrl
            },
            borrower: {
              id: row.borrowerId,
              firstName: row.firstName,
              lastName: row.lastName,
              type: row.type,
              matricule: row.matricule,
              classe: row.classe,
              position: row.position
            }
          }));
          resolve(history);
        }
      });
    });
  }

  // Autres méthodes existantes
  async getAuthors(): Promise<Author[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM authors ORDER BY name', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Author[]);
        }
      });
    });
  }

  async addAuthor(author: Omit<Author, 'id'>): Promise<number> {
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

  async getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Category[]);
        }
      });
    });
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO categories (name, description, color)
        VALUES (?, ?, ?)
      `);
      
      stmt.run([
        category.name,
        category.description,
        category.color
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

  async searchBooks(query: string): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${query}%`;
      this.db.all(`
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR description LIKE ?
        ORDER BY title
      `, [searchQuery, searchQuery, searchQuery, searchQuery], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  async getStats(): Promise<Stats> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stats: Partial<Stats> = {};
        
        this.db.get('SELECT COUNT(*) as count FROM books', (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          stats.totalBooks = row.count || 0;
          
          this.db.get('SELECT COUNT(*) as count FROM books WHERE isBorrowed = 1', (err, row: any) => {
            if (err) {
              reject(err);
              return;
            }
            stats.borrowedBooks = row.count || 0;
            stats.availableBooks = (stats.totalBooks || 0) - (stats.borrowedBooks || 0);
            
            this.db.get('SELECT COUNT(*) as count FROM authors', (err, row: any) => {
              if (err) {
                reject(err);
                return;
              }
              stats.totalAuthors = row.count || 0;
              
              this.db.get('SELECT COUNT(*) as count FROM categories', (err, row: any) => {
                if (err) {
                  reject(err);
                  return;
                }
                stats.totalCategories = row.count || 0;
                
                this.db.get('SELECT COUNT(*) as count FROM borrowers', (err, row: any) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  stats.totalBorrowers = row.count || 0;
                  
                  this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "student"', (err, row: any) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    stats.totalStudents = row.count || 0;
                    
                    this.db.get('SELECT COUNT(*) as count FROM borrowers WHERE type = "staff"', (err, row: any) => {
                      if (err) {
                        reject(err);
                        return;
                      }
                      stats.totalStaff = row.count || 0;
                      
                      // Compter les livres en retard
                      const now = new Date().toISOString();
                      this.db.get(`
                        SELECT COUNT(*) as count FROM borrow_history 
                        WHERE status = 'active' AND expectedReturnDate < ?
                      `, [now], (err, row: any) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                        stats.overdueBooks = row.count || 0;
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
}