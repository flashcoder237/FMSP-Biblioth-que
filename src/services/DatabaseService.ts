import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { Book, Author, Category, Stats } from '../preload';

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
            color TEXT DEFAULT '#22c55e',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Table des livres - ISBN peut être NULL et UNIQUE seulement si non NULL
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
            borrowerName TEXT,
            borrowDate TEXT,
            returnDate TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(isbn) ON CONFLICT IGNORE
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
        { name: 'Fiction', description: 'Romans et nouvelles', color: '#22c55e' },
        { name: 'Science-Fiction', description: 'Littérature futuriste', color: '#3b82f6' },
        { name: 'Histoire', description: 'Livres historiques', color: '#f59e0b' },
        { name: 'Biographie', description: 'Vies de personnalités', color: '#ef4444' },
        { name: 'Sciences', description: 'Ouvrages scientifiques', color: '#8b5cf6' },
        { name: 'Philosophie', description: 'Réflexions philosophiques', color: '#06b6d4' },
      ];

      const authors = [
        { name: 'Victor Hugo', biography: 'Écrivain français du XIXe siècle', nationality: 'Française' },
        { name: 'Albert Camus', biography: 'Philosophe et écrivain français', nationality: 'Française' },
        { name: 'Isaac Asimov', biography: 'Auteur de science-fiction', nationality: 'Américaine' },
        { name: 'Marie Curie', biography: 'Physicienne et chimiste', nationality: 'Française' },
        { name: 'Jules Verne', biography: 'Écrivain français de science-fiction', nationality: 'Française' },
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
        },
        {
          title: 'Notre-Dame de Paris',
          author: 'Victor Hugo',
          isbn: '978-2-253-00004-4',
          category: 'Fiction',
          publishedDate: '1831',
          description: 'Roman historique de Victor Hugo publié en 1831. L\'histoire se déroule à Paris en 1482.',
          isBorrowed: true,
          borrowerName: 'Jean Dupont',
          borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // Il y a 10 jours
        },
        {
          title: 'Vingt Mille Lieues sous les mers',
          author: 'Jules Verne',
          isbn: '978-2-253-00005-5',
          category: 'Science-Fiction',
          publishedDate: '1870',
          description: 'Roman d\'aventures de Jules Verne paru en 1870, décrivant le voyage du professeur Aronnax à bord du Nautilus.',
          isBorrowed: false
        },
        {
          title: 'Le Mythe de Sisyphe',
          author: 'Albert Camus',
          isbn: '978-2-253-00006-6',
          category: 'Philosophie',
          publishedDate: '1942',
          description: 'Essai philosophique d\'Albert Camus publié en 1942, traitant du concept d\'absurdité de l\'existence humaine.',
          isBorrowed: true,
          borrowerName: 'Marie Martin',
          borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // Il y a 25 jours
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

      // Ajouter les livres
      for (const book of books) {
        await this.addBook(book);
      }

      console.log('Données d\'exemple ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données:', error);
    }
  }

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
      // Si l'ISBN est vide, le mettre à NULL pour éviter les conflits
      const isbn = book.isbn && book.isbn.trim() ? book.isbn.trim() : null;
      
      const stmt = this.db.prepare(`
        INSERT INTO books (title, author, isbn, category, publishedDate, description, coverUrl, isBorrowed, borrowerName, borrowDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        book.borrowerName || null,
        book.borrowDate || null
      ], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE constraint failed: books.isbn')) {
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
      // Si l'ISBN est vide, le mettre à NULL
      const isbn = book.isbn && book.isbn.trim() ? book.isbn.trim() : null;
      
      const stmt = this.db.prepare(`
        UPDATE books SET 
          title = ?, author = ?, isbn = ?, category = ?, publishedDate = ?, 
          description = ?, coverUrl = ?, isBorrowed = ?, borrowerName = ?, 
          borrowDate = ?, returnDate = ?
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
        book.borrowerName,
        book.borrowDate,
        book.returnDate,
        book.id
      ], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE constraint failed: books.isbn')) {
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
      this.db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

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

  async getBorrowedBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM books WHERE isBorrowed = 1 ORDER BY borrowDate DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  async borrowBook(bookId: number, borrowerName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const borrowDate = new Date().toISOString();
      this.db.run(`
        UPDATE books SET 
          isBorrowed = 1, 
          borrowerName = ?, 
          borrowDate = ?
        WHERE id = ?
      `, [borrowerName, borrowDate, bookId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  async returnBook(bookId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const returnDate = new Date().toISOString();
      this.db.run(`
        UPDATE books SET 
          isBorrowed = 0, 
          borrowerName = NULL, 
          borrowDate = NULL,
          returnDate = ?
        WHERE id = ?
      `, [returnDate, bookId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
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
                resolve(stats as Stats);
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
        this.db.run('DELETE FROM books', (err) => {
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
  }
}