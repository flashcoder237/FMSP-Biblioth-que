const Nedb = require('nedb');
import * as path from 'path';
import { app } from 'electron';
import { Document, Book, Author, Category, Stats, Borrower, BorrowHistory, HistoryFilter, SyncOperation, createBookFromDocument } from '../preload';

export class DatabaseService {
  private documentsDb: any;
  private authorsDb: any;
  private categoriesDb: any;
  private borrowersDb: any;
  private borrowHistoryDb: any;
  private syncQueueDb: any;
  private institutionInfoDb: any;

  constructor() {
    const dbDir = path.join(app.getPath('userData'), 'nedb');
    
    this.documentsDb = new Nedb({
      filename: path.join(dbDir, 'documents.db'),
      autoload: true
    });
    
    this.authorsDb = new Nedb({
      filename: path.join(dbDir, 'authors.db'),
      autoload: true
    });
    
    this.categoriesDb = new Nedb({
      filename: path.join(dbDir, 'categories.db'),
      autoload: true
    });
    
    this.borrowersDb = new Nedb({
      filename: path.join(dbDir, 'borrowers.db'),
      autoload: true
    });
    
    this.borrowHistoryDb = new Nedb({
      filename: path.join(dbDir, 'borrow_history.db'),
      autoload: true
    });
    
    this.syncQueueDb = new Nedb({
      filename: path.join(dbDir, 'sync_queue.db'),
      autoload: true
    });
    
    this.institutionInfoDb = new Nedb({
      filename: path.join(dbDir, 'institution_info.db'),
      autoload: true
    });
  }

  async initialize(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Créer les index pour améliorer les performances
        this.documentsDb.ensureIndex({ fieldName: 'cote' });
        this.documentsDb.ensureIndex({ fieldName: 'institution_code' });
        this.documentsDb.ensureIndex({ fieldName: 'deletedAt' });
        
        this.authorsDb.ensureIndex({ fieldName: 'name' });
        this.authorsDb.ensureIndex({ fieldName: 'institution_code' });
        this.authorsDb.ensureIndex({ fieldName: 'deletedAt' });
        
        this.categoriesDb.ensureIndex({ fieldName: 'name' });
        this.categoriesDb.ensureIndex({ fieldName: 'institution_code' });
        this.categoriesDb.ensureIndex({ fieldName: 'deletedAt' });
        
        this.borrowersDb.ensureIndex({ fieldName: 'matricule' });
        this.borrowersDb.ensureIndex({ fieldName: 'institution_code' });
        this.borrowersDb.ensureIndex({ fieldName: 'deletedAt' });
        
        this.borrowHistoryDb.ensureIndex({ fieldName: 'documentId' });
        this.borrowHistoryDb.ensureIndex({ fieldName: 'borrowerId' });
        this.borrowHistoryDb.ensureIndex({ fieldName: 'status' });
        this.borrowHistoryDb.ensureIndex({ fieldName: 'institution_code' });
        this.borrowHistoryDb.ensureIndex({ fieldName: 'deletedAt' });
        
        this.syncQueueDb.ensureIndex({ fieldName: 'timestamp' });
        this.institutionInfoDb.ensureIndex({ fieldName: 'institutionCode' });
        
        console.log('NeDB initialized successfully');
        await this.seedInitialData();
        resolve();
      } catch (error) {
        reject(error);
      }
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
      const query: any = { deletedAt: { $exists: false } };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      this.borrowersDb.find(query).sort({ lastName: 1, firstName: 1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const borrowers = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(borrowers);
        }
      });
    });
  }

  async addBorrower(borrower: Omit<Borrower, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      // Vérifier si un emprunteur avec ce matricule existe déjà
      const checkQuery: any = {
        matricule: borrower.matricule,
        institution_code: institutionCode || '',
        deletedAt: { $exists: false }
      };
      
      this.borrowersDb.findOne(checkQuery, (err: any, existingBorrower: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (existingBorrower) {
          reject(new Error('Un emprunteur avec ce matricule existe déjà'));
          return;
        }
        
        const doc = {
          type: borrower.type,
          firstName: borrower.firstName,
          lastName: borrower.lastName,
          matricule: borrower.matricule,
          classe: borrower.classe || null,
          cniNumber: borrower.cniNumber || null,
          position: borrower.position || null,
          email: borrower.email || null,
          phone: borrower.phone || null,
          institution_code: institutionCode || '',
          localId: borrower.localId || `borrower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          syncStatus: borrower.syncStatus || 'pending',
          lastModified: borrower.lastModified || now,
          version: borrower.version || 1,
          createdAt: borrower.createdAt || now
        };
        
        this.borrowersDb.insert(doc, (err: any, newDoc: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(newDoc._id);
          }
        });
      });
    });
  }

  async updateBorrower(borrower: Borrower, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const query: any = {
        _id: borrower.id,
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      const update = {
        $set: {
          type: borrower.type,
          firstName: borrower.firstName,
          lastName: borrower.lastName,
          matricule: borrower.matricule,
          classe: borrower.classe || null,
          cniNumber: borrower.cniNumber || null,
          position: borrower.position || null,
          email: borrower.email || null,
          phone: borrower.phone || null,
          lastModified: now,
          syncStatus: 'pending'
        },
        $inc: { version: 1 }
      };
      
      this.borrowersDb.update(query, update, {}, (err: any, numReplaced: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced > 0);
        }
      });
    });
  }

  async deleteBorrower(id: number, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Vérifier s'il n'y a pas d'emprunts actifs
      const checkQuery: any = {
        borrowerId: id,
        status: 'active',
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        checkQuery.institution_code = institutionCode;
      }
      
      this.borrowHistoryDb.count(checkQuery, (err: any, count: number) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (count > 0) {
          reject(new Error('Impossible de supprimer : cet emprunteur a des documents non rendus'));
          return;
        }
        
        const deleteQuery: any = {
          _id: id
        };
        
        if (institutionCode && institutionCode.trim() !== '') {
          deleteQuery.institution_code = institutionCode;
        }
        
        const update = {
          $set: {
            deletedAt: new Date().toISOString(),
            syncStatus: 'pending'
          },
          $inc: { version: 1 }
        };
        
        this.borrowersDb.update(deleteQuery, update, {}, (err: any, numReplaced: number) => {
          if (err) {
            reject(err);
          } else {
            resolve(numReplaced > 0);
          }
        });
      });
    });
  }

  async searchBorrowers(query: string, institutionCode?: string): Promise<Borrower[]> {
    return new Promise((resolve, reject) => {
      const searchRegex = new RegExp(query, 'i');
      
      const searchQuery: any = {
        deletedAt: { $exists: false },
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { matricule: searchRegex },
          { classe: searchRegex },
          { position: searchRegex }
        ]
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        searchQuery.institution_code = institutionCode;
      }
      
      this.borrowersDb.find(searchQuery).sort({ lastName: 1, firstName: 1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const borrowers = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(borrowers);
        }
      });
    });
  }

  // Documents CRUD
  async getDocuments(institutionCode?: string): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      const query: any = { deletedAt: { $exists: false } };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      this.documentsDb.find(query).sort({ lastModified: -1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          // Mapper les documents avec les emprunteurs si nécessaire
          const documents = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(documents);
        }
      });
    });
  }

  async addDocument(document: Omit<Document, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      // Vérifier si un document avec cette cote existe déjà
      const checkQuery: any = {
        cote: document.cote,
        institution_code: institutionCode || '',
        deletedAt: { $exists: false }
      };
      
      this.documentsDb.findOne(checkQuery, (err: any, existingDoc: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (existingDoc) {
          reject(new Error('Un document avec cette cote existe déjà'));
          return;
        }
        
        const doc = {
          auteur: document.auteur,
          titre: document.titre,
          editeur: document.editeur,
          lieuEdition: document.lieuEdition,
          annee: document.annee,
          descripteurs: document.descripteurs,
          cote: document.cote,
          type: document.type || 'book',
          isbn: document.isbn || null,
          description: document.description || null,
          couverture: document.couverture || null,
          estEmprunte: document.estEmprunte || false,
          institution_code: institutionCode || '',
          localId: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          syncStatus: 'pending',
          lastModified: now,
          version: 1,
          createdAt: now
        };
        
        this.documentsDb.insert(doc, (err: any, newDoc: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(newDoc._id);
          }
        });
      });
    });
  }

  async updateDocument(document: Document, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const query: any = {
        _id: document.id,
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      const update = {
        $set: {
          auteur: document.auteur,
          titre: document.titre,
          editeur: document.editeur,
          lieuEdition: document.lieuEdition,
          annee: document.annee,
          descripteurs: document.descripteurs,
          cote: document.cote,
          type: document.type || 'book',
          isbn: document.isbn || null,
          description: document.description || null,
          couverture: document.couverture || null,
          lastModified: now,
          syncStatus: 'pending'
        },
        $inc: { version: 1 }
      };
      
      this.documentsDb.update(query, update, {}, (err: any, numReplaced: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced > 0);
        }
      });
    });
  }

  async deleteDocument(id: number, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const query: any = {
        _id: id,
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      const update = {
        $set: {
          deletedAt: now,
          lastModified: now,
          syncStatus: 'pending'
        },
        $inc: { version: 1 }
      };
      
      this.documentsDb.update(query, update, {}, (err: any, numReplaced: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced > 0);
        }
      });
    });
  }

  async searchDocuments(query: string, institutionCode?: string): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      const searchRegex = new RegExp(query, 'i');
      
      const searchQuery: any = {
        deletedAt: { $exists: false },
        $or: [
          { titre: searchRegex },
          { auteur: searchRegex },
          { editeur: searchRegex },
          { descripteurs: searchRegex },
          { cote: searchRegex },
          { isbn: searchRegex }
        ]
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        searchQuery.institution_code = institutionCode;
      }
      
      this.documentsDb.find(searchQuery).sort({ lastModified: -1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const documents = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(documents);
        }
      });
    });
  }

  // Books CRUD (pour compatibilité)
  async getBooks(institutionCode?: string): Promise<Book[]> {
    try {
      const documents = await this.getDocuments(institutionCode);
      return documents.map(doc => createBookFromDocument(doc));
    } catch (error) {
      throw error;
    }
  }

  async searchBooks(query: string, institutionCode?: string): Promise<Book[]> {
    try {
      const documents = await this.searchDocuments(query, institutionCode);
      return documents.map(doc => createBookFromDocument(doc));
    } catch (error) {
      throw error;
    }
  }

  // Authors CRUD
  async getAuthors(institutionCode?: string): Promise<Author[]> {
    return new Promise((resolve, reject) => {
      const query: any = { deletedAt: { $exists: false } };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      this.authorsDb.find(query).sort({ name: 1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const authors = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(authors);
        }
      });
    });
  }

  async addAuthor(author: Omit<Author, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const doc = {
        name: author.name,
        biography: author.biography,
        birthDate: author.birthDate,
        nationality: author.nationality,
        institution_code: institutionCode || '',
        localId: author.localId || `author_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: author.syncStatus || 'pending',
        lastModified: author.lastModified || now,
        version: author.version || 1,
        createdAt: author.createdAt || now
      };
      
      this.authorsDb.insert(doc, (err: any, newDoc: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc._id);
        }
      });
    });
  }

  // Categories CRUD
  async getCategories(institutionCode?: string): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      const query: any = { deletedAt: { $exists: false } };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      this.categoriesDb.find(query).sort({ name: 1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const categories = docs.map(doc => ({
            ...doc,
            id: doc._id
          }));
          resolve(categories);
        }
      });
    });
  }

  async addCategory(category: Omit<Category, 'id'>, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const doc = {
        name: category.name,
        description: category.description,
        color: category.color || '#3E5C49',
        institution_code: institutionCode || '',
        localId: category.localId || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: category.syncStatus || 'pending',
        lastModified: category.lastModified || now,
        version: category.version || 1,
        createdAt: category.createdAt || now
      };
      
      this.categoriesDb.insert(doc, (err: any, newDoc: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc._id);
        }
      });
    });
  }

  // Stats
  async getStats(institutionCode?: string): Promise<Stats> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseQuery: any = { deletedAt: { $exists: false } };
        
        if (institutionCode && institutionCode.trim() !== '') {
          baseQuery.institution_code = institutionCode;
        }

        // Count documents
        const totalDocuments = await new Promise<number>((resolve, reject) => {
          this.documentsDb.count(baseQuery, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count borrowed documents
        const borrowedDocuments = await new Promise<number>((resolve, reject) => {
          this.documentsDb.count({ ...baseQuery, estEmprunte: true }, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count authors
        const totalAuthors = await new Promise<number>((resolve, reject) => {
          this.authorsDb.count(baseQuery, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count categories
        const totalCategories = await new Promise<number>((resolve, reject) => {
          this.categoriesDb.count(baseQuery, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count borrowers
        const totalBorrowers = await new Promise<number>((resolve, reject) => {
          this.borrowersDb.count(baseQuery, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count students
        const totalStudents = await new Promise<number>((resolve, reject) => {
          this.borrowersDb.count({ ...baseQuery, type: 'student' }, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count staff
        const totalStaff = await new Promise<number>((resolve, reject) => {
          this.borrowersDb.count({ ...baseQuery, type: 'staff' }, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        // Count overdue documents
        const now = new Date().toISOString();
        const overdueQuery: any = {
          status: 'active',
          expectedReturnDate: { $lt: now },
          deletedAt: { $exists: false }
        };
        
        if (institutionCode && institutionCode.trim() !== '') {
          overdueQuery.institution_code = institutionCode;
        }

        const overdueDocuments = await new Promise<number>((resolve, reject) => {
          this.borrowHistoryDb.count(overdueQuery, (err: any, count: number) => {
            if (err) reject(err);
            else resolve(count);
          });
        });

        const stats: Stats = {
          totalDocuments,
          availableDocuments: totalDocuments - borrowedDocuments,
          borrowedDocuments,
          totalAuthors,
          totalCategories,
          totalBorrowers,
          totalStudents,
          totalStaff,
          overdueDocuments
        };

        resolve(stats);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Emprunts
  async borrowDocument(documentId: number, borrowerId: number, expectedReturnDate: string, institutionCode?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const borrowDate = new Date().toISOString();
      const now = new Date().toISOString();
      
      // Créer l'historique d'emprunt
      const historyDoc = {
        documentId,
        borrowerId,
        borrowDate,
        expectedReturnDate,
        status: 'active',
        institution_code: institutionCode || '',
        localId: `borrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        syncStatus: 'pending',
        lastModified: now,
        version: 1,
        createdAt: now
      };
      
      this.borrowHistoryDb.insert(historyDoc, (err: any, newDoc: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Mettre à jour le document
        const updateQuery = { _id: documentId };
        const update = {
          $set: {
            estEmprunte: true,
            emprunteurId: borrowerId,
            dateEmprunt: borrowDate,
            dateRetourPrevu: expectedReturnDate
          }
        };
        
        this.documentsDb.update(updateQuery, update, {}, (err: any, numReplaced: number) => {
          if (err) {
            reject(err);
          } else {
            resolve(newDoc._id);
          }
        });
      });
    });
  }

  async borrowBook(documentId: number, borrowerId: number, expectedReturnDate: string): Promise<number> {
    return this.borrowDocument(documentId, borrowerId, expectedReturnDate);
  }

  async returnBook(borrowHistoryId: number, notes?: string, institutionCode?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const returnDate = new Date().toISOString();
      
      // Récupérer l'historique d'emprunt
      this.borrowHistoryDb.findOne({ _id: borrowHistoryId }, (err: any, borrowHistory: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!borrowHistory) {
          reject(new Error('Emprunt non trouvé'));
          return;
        }
        
        // Mettre à jour l'historique
        const historyUpdate = {
          $set: {
            actualReturnDate: returnDate,
            status: 'returned',
            notes: notes || null
          }
        };
        
        this.borrowHistoryDb.update({ _id: borrowHistoryId }, historyUpdate, {}, (err: any, numReplaced: number) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Mettre à jour le document
          const docUpdate = {
            $set: {
              estEmprunte: false,
              dateRetour: returnDate
            },
            $unset: {
              emprunteurId: true,
              dateEmprunt: true,
              dateRetourPrevu: true
            }
          };
          
          this.documentsDb.update({ _id: borrowHistory.documentId }, docUpdate, {}, (err: any, numReplaced: number) => {
            if (err) {
              reject(err);
            } else {
              resolve(numReplaced > 0);
            }
          });
        });
      });
    });
  }

  async getBorrowedDocuments(institutionCode?: string): Promise<BorrowHistory[]> {
    return new Promise((resolve, reject) => {
      const query: any = {
        status: 'active',
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      this.borrowHistoryDb.find(query).sort({ borrowDate: -1 }).exec(async (err: any, histories: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        
        try {
          const results = [];
          
          for (const history of histories) {
            // Récupérer le document
            const document = await new Promise<any>((resolve, reject) => {
              this.documentsDb.findOne({ _id: history.documentId }, (err: any, doc: any) => {
                if (err) reject(err);
                else resolve(doc);
              });
            });
            
            // Récupérer l'emprunteur
            const borrower = await new Promise<any>((resolve, reject) => {
              this.borrowersDb.findOne({ _id: history.borrowerId }, (err: any, doc: any) => {
                if (err) reject(err);
                else resolve(doc);
              });
            });
            
            if (document && borrower) {
              results.push({
                ...history,
                id: history._id,
                document: {
                  ...document,
                  id: document._id
                },
                borrower: {
                  ...borrower,
                  id: borrower._id
                }
              });
            }
          }
          
          resolve(results);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getBorrowHistory(filter?: HistoryFilter, institutionCode?: string): Promise<BorrowHistory[]> {
    return new Promise((resolve, reject) => {
      const query: any = {
        deletedAt: { $exists: false }
      };
      
      if (institutionCode && institutionCode.trim() !== '') {
        query.institution_code = institutionCode;
      }
      
      if (filter) {
        if (filter.startDate) {
          query.borrowDate = { $gte: filter.startDate };
        }
        
        if (filter.endDate) {
          if (query.borrowDate) {
            query.borrowDate.$lte = filter.endDate + ' 23:59:59';
          } else {
            query.borrowDate = { $lte: filter.endDate + ' 23:59:59' };
          }
        }
        
        if (filter.status && filter.status !== 'all') {
          query.status = filter.status;
        }
        
        if (filter.borrowerId) {
          query.borrowerId = filter.borrowerId;
        }
        
        if (filter.documentId) {
          query.documentId = filter.documentId;
        }
      }
      
      this.borrowHistoryDb.find(query).sort({ borrowDate: -1 }).exec(async (err: any, histories: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        
        try {
          const results = [];
          
          for (const history of histories) {
            // Récupérer le document
            const document = await new Promise<any>((resolve, reject) => {
              this.documentsDb.findOne({ _id: history.documentId }, (err: any, doc: any) => {
                if (err) reject(err);
                else resolve(doc);
              });
            });
            
            // Récupérer l'emprunteur
            const borrower = await new Promise<any>((resolve, reject) => {
              this.borrowersDb.findOne({ _id: history.borrowerId }, (err: any, doc: any) => {
                if (err) reject(err);
                else resolve(doc);
              });
            });
            
            if (document && borrower) {
              results.push({
                ...history,
                id: history._id,
                document: {
                  ...document,
                  id: document._id
                },
                borrower: {
                  ...borrower,
                  id: borrower._id
                }
              });
            }
          }
          
          resolve(results);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Sync
  async getSyncQueue(): Promise<SyncOperation[]> {
    return new Promise((resolve, reject) => {
      this.syncQueueDb.find({}).sort({ timestamp: 1 }).exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          const operations = docs.map(doc => ({
            id: doc.id,
            type: doc.type,
            operation: doc.operation,
            data: JSON.parse(doc.data),
            timestamp: doc.timestamp,
            retryCount: doc.retryCount,
            maxRetries: doc.maxRetries
          }));
          resolve(operations);
        }
      });
    });
  }

  async addSyncOperation(operation: SyncOperation): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = {
        id: operation.id,
        type: operation.type,
        operation: operation.operation,
        data: JSON.stringify(operation.data),
        timestamp: operation.timestamp,
        retryCount: operation.retryCount,
        maxRetries: operation.maxRetries
      };
      
      this.syncQueueDb.insert(doc, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async updateSyncOperation(operation: SyncOperation): Promise<void> {
    return new Promise((resolve, reject) => {
      const update = {
        $set: {
          retryCount: operation.retryCount,
          data: JSON.stringify(operation.data)
        }
      };
      
      this.syncQueueDb.update({ id: operation.id }, update, {}, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async removeSyncOperation(operationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.syncQueueDb.remove({ id: operationId }, {}, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Institution info
  async saveInstitutionInfo(info: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.institutionInfoDb.update(
        { institutionCode: info.institutionCode },
        { $set: info },
        { upsert: true },
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Institution info saved for:', info.institutionCode);
            resolve();
          }
        }
      );
    });
  }

  async getInstitutionInfo(institutionCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.institutionInfoDb.findOne({ institutionCode }, (err: any, doc: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc || null);
        }
      });
    });
  }

  // Utilitaires
  async clearAllData(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.documentsDb.remove({}, { multi: true }, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        await new Promise<void>((resolve, reject) => {
          this.authorsDb.remove({}, { multi: true }, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        await new Promise<void>((resolve, reject) => {
          this.categoriesDb.remove({}, { multi: true }, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        await new Promise<void>((resolve, reject) => {
          this.borrowersDb.remove({}, { multi: true }, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        await new Promise<void>((resolve, reject) => {
          this.borrowHistoryDb.remove({}, { multi: true }, (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        console.log('Toutes les données ont été supprimées avec succès');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getRecentActivity(limit: number = 10, institutionCode?: string): Promise<any[]> {
    // Implémentation simplifiée pour NeDB
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  async assignOrphanDataToInstitution(institutionCode: string): Promise<any> {
    // Implémentation simplifiée pour NeDB
    return new Promise((resolve) => {
      resolve({
        documents: 0,
        authors: 0,
        categories: 0,
        borrowers: 0,
        borrowHistory: 0
      });
    });
  }

  async getOrphanDataCount(): Promise<any> {
    // Implémentation simplifiée pour NeDB
    return new Promise((resolve) => {
      resolve({
        documents: 0,
        authors: 0,
        categories: 0,
        borrowers: 0,
        borrowHistory: 0
      });
    });
  }

  // Méthodes pour mettre à jour les IDs distants
  async updateDocumentRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.documentsDb.update(
        { localId: localId },
        { $set: { remoteId: remoteId, syncStatus: 'synced' } },
        {},
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateAuthorRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authorsDb.update(
        { localId: localId },
        { $set: { remoteId: remoteId, syncStatus: 'synced' } },
        {},
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateCategoryRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoriesDb.update(
        { localId: localId },
        { $set: { remoteId: remoteId, syncStatus: 'synced' } },
        {},
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateBorrowerRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.borrowersDb.update(
        { localId: localId },
        { $set: { remoteId: remoteId, syncStatus: 'synced' } },
        {},
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async updateBorrowHistoryRemoteId(localId: string, remoteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.borrowHistoryDb.update(
        { localId: localId },
        { $set: { remoteId: remoteId, syncStatus: 'synced' } },
        {},
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}