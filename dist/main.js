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
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DatabaseService_1 = require("./services/DatabaseService");
let mainWindow;
let dbService;
function createWindow() {
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
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:8080');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}
electron_1.app.whenReady().then(async () => {
    dbService = new DatabaseService_1.DatabaseService();
    await dbService.initialize();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// IPC Handlers
electron_1.ipcMain.handle('window-controls:minimize', () => {
    mainWindow.minimize();
});
electron_1.ipcMain.handle('window-controls:maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.handle('window-controls:close', () => {
    mainWindow.close();
});
// Database IPC Handlers
electron_1.ipcMain.handle('db:getBooks', async () => {
    return await dbService.getBooks();
});
electron_1.ipcMain.handle('db:addBook', async (_, book) => {
    return await dbService.addBook(book);
});
electron_1.ipcMain.handle('db:updateBook', async (_, book) => {
    return await dbService.updateBook(book);
});
electron_1.ipcMain.handle('db:deleteBook', async (_, id) => {
    return await dbService.deleteBook(id);
});
electron_1.ipcMain.handle('db:getAuthors', async () => {
    return await dbService.getAuthors();
});
electron_1.ipcMain.handle('db:addAuthor', async (_, author) => {
    return await dbService.addAuthor(author);
});
electron_1.ipcMain.handle('db:getCategories', async () => {
    return await dbService.getCategories();
});
electron_1.ipcMain.handle('db:addCategory', async (_, category) => {
    return await dbService.addCategory(category);
});
electron_1.ipcMain.handle('db:searchBooks', async (_, query) => {
    return await dbService.searchBooks(query);
});
electron_1.ipcMain.handle('db:getBorrowedBooks', async () => {
    return await dbService.getBorrowedBooks();
});
electron_1.ipcMain.handle('db:borrowBook', async (_, bookId, borrowerName) => {
    return await dbService.borrowBook(bookId, borrowerName);
});
electron_1.ipcMain.handle('db:returnBook', async (_, bookId) => {
    return await dbService.returnBook(bookId);
});
electron_1.ipcMain.handle('db:getStats', async () => {
    return await dbService.getStats();
});
// Print IPC Handlers
electron_1.ipcMain.handle('print:inventory', async (_, data) => {
    return await createPrintWindow(data, 'inventory');
});
electron_1.ipcMain.handle('print:available-books', async (_, data) => {
    return await createPrintWindow(data, 'available');
});
electron_1.ipcMain.handle('print:borrowed-books', async (_, data) => {
    return await createPrintWindow(data, 'borrowed');
});
electron_1.ipcMain.handle('export:csv', async (_, data) => {
    return await exportToCSV(data);
});
async function createPrintWindow(data, type) {
    return new Promise((resolve) => {
        const printWindow = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        });
        const htmlContent = generatePrintHTML(data, type);
        printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: false,
                printBackground: true,
                margins: {
                    marginType: 'minimum'
                }
            }, (success, failureReason) => {
                printWindow.close();
                if (!success) {
                    console.error('Print failed:', failureReason);
                }
                resolve(success);
            });
        });
    });
}
function generatePrintHTML(data, type) {
    const now = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    let title = '';
    let content = '';
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
    }
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          margin: 20mm;
          size: A4;
        }
        
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.4;
        }
        
        .header {
          border-bottom: 3px solid #22c55e;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #22c55e;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        
        .header .subtitle {
          color: #666;
          font-size: 14px;
          margin: 5px 0;
        }
        
        .header .date {
          color: #888;
          font-size: 12px;
          margin-top: 10px;
        }
        
        .stats-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .content-section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .books-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 12px;
        }
        
        .books-table th,
        .books-table td {
          padding: 10px 8px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .books-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #d1d5db;
        }
        
        .books-table tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .category-tag {
          background: #22c55e;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
        }
        
        .status-available {
          color: #22c55e;
          font-weight: 600;
        }
        
        .status-borrowed {
          color: #ef4444;
          font-weight: 600;
        }
        
        .borrower-info {
          font-size: 11px;
          color: #666;
        }
        
        .footer {
          position: fixed;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 10px;
          color: #888;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="subtitle">Système de Gestion de Bibliothèque</div>
        <div class="date">Généré le ${now}</div>
      </div>
      
      ${content}
      
      <div class="footer">
        Bibliothèque - Système de Gestion • Page {page} sur {pages}
      </div>
    </body>
    </html>
  `;
}
function generateInventoryContent(data) {
    const { books, stats, categories } = data;
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${stats.totalBooks}</div>
        <div class="stat-label">Total Livres</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.availableBooks}</div>
        <div class="stat-label">Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.borrowedBooks}</div>
        <div class="stat-label">Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalAuthors}</div>
        <div class="stat-label">Auteurs</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalCategories}</div>
        <div class="stat-label">Catégories</div>
      </div>
    </div>
    
    <div class="content-section">
      <h2 class="section-title">Inventaire Complet</h2>
      <table class="books-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Catégorie</th>
            <th>ISBN</th>
            <th>Année</th>
            <th>Statut</th>
            <th>Emprunteur</th>
            <th>Date Emprunt</th>
          </tr>
        </thead>
        <tbody>
          ${books.map((book) => `
            <tr>
              <td><strong>${book.title}</strong></td>
              <td>${book.author}</td>
              <td><span class="category-tag">${book.category}</span></td>
              <td>${book.isbn || '-'}</td>
              <td>${book.publishedDate || '-'}</td>
              <td>
                <span class="${book.isBorrowed ? 'status-borrowed' : 'status-available'}">
                  ${book.isBorrowed ? 'Emprunté' : 'Disponible'}
                </span>
              </td>
              <td>${book.borrowerName || '-'}</td>
              <td>
                ${book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '-'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
function generateAvailableBooksContent(data) {
    const { books, stats } = data;
    const availableBooks = books.filter((book) => !book.isBorrowed);
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${availableBooks.length}</div>
        <div class="stat-label">Livres Disponibles</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalBooks}</div>
        <div class="stat-label">Total Livres</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${((availableBooks.length / stats.totalBooks) * 100).toFixed(1)}%</div>
        <div class="stat-label">Taux Disponibilité</div>
      </div>
    </div>
    
    <div class="content-section">
      <h2 class="section-title">Livres Disponibles à l'Emprunt</h2>
      <table class="books-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Catégorie</th>
            <th>ISBN</th>
            <th>Année Publication</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${availableBooks.map((book) => `
            <tr>
              <td><strong>${book.title}</strong></td>
              <td>${book.author}</td>
              <td><span class="category-tag">${book.category}</span></td>
              <td>${book.isbn || '-'}</td>
              <td>${book.publishedDate || '-'}</td>
              <td>${book.description ? book.description.substring(0, 100) + '...' : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
function generateBorrowedBooksContent(data) {
    const { books, stats } = data;
    const borrowedBooks = books.filter((book) => book.isBorrowed);
    return `
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-value">${borrowedBooks.length}</div>
        <div class="stat-label">Livres Empruntés</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalBooks}</div>
        <div class="stat-label">Total Livres</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${((borrowedBooks.length / stats.totalBooks) * 100).toFixed(1)}%</div>
        <div class="stat-label">Taux Emprunt</div>
      </div>
    </div>
    
    <div class="content-section">
      <h2 class="section-title">Livres Actuellement Empruntés</h2>
      <table class="books-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Catégorie</th>
            <th>Emprunteur</th>
            <th>Date Emprunt</th>
            <th>Durée</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${borrowedBooks.map((book) => {
        const borrowDate = new Date(book.borrowDate);
        const today = new Date();
        const daysBorrowed = Math.ceil((today.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
        const status = daysBorrowed > 30 ? 'En retard' : daysBorrowed > 14 ? 'Bientôt en retard' : 'Normal';
        return `
              <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td><span class="category-tag">${book.category}</span></td>
                <td><strong>${book.borrowerName}</strong></td>
                <td>${borrowDate.toLocaleDateString('fr-FR')}</td>
                <td>${daysBorrowed} jour(s)</td>
                <td>
                  <span class="${status === 'En retard' ? 'status-borrowed' : 'status-available'}">
                    ${status}
                  </span>
                </td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
    </div>
  `;
}
async function exportToCSV(data) {
    try {
        const { filePath } = await electron_1.dialog.showSaveDialog(mainWindow, {
            title: 'Exporter en CSV',
            defaultPath: `bibliotheque_export_${new Date().toISOString().split('T')[0]}.csv`,
            filters: [
                { name: 'CSV Files', extensions: ['csv'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (!filePath)
            return null;
        const { books } = data;
        const csvHeaders = [
            'Titre',
            'Auteur',
            'Catégorie',
            'ISBN',
            'Année Publication',
            'Description',
            'Statut',
            'Emprunteur',
            'Date Emprunt'
        ];
        const csvRows = books.map((book) => [
            `"${book.title}"`,
            `"${book.author}"`,
            `"${book.category}"`,
            `"${book.isbn || ''}"`,
            `"${book.publishedDate || ''}"`,
            `"${book.description || ''}"`,
            `"${book.isBorrowed ? 'Emprunté' : 'Disponible'}"`,
            `"${book.borrowerName || ''}"`,
            `"${book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : ''}"`
        ]);
        const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        fs.writeFileSync(filePath, '\ufeff' + csvContent, 'utf8'); // BOM pour Excel
        return filePath;
    }
    catch (error) {
        console.error('Export CSV failed:', error);
        return null;
    }
}
