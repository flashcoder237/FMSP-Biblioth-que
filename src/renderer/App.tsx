import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BookList } from './components/BookList';
import { BorrowedBooks } from './components/BorrowedBooks';
import { AddBook } from './components/AddBook';
import { Book, Author, Category, Stats } from '../preload';

type ViewType = 'dashboard' | 'books' | 'borrowed' | 'add-book';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    totalAuthors: 0,
    totalCategories: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, authorsData, categoriesData, statsData] = await Promise.all([
        window.electronAPI.getBooks(),
        window.electronAPI.getAuthors(),
        window.electronAPI.getCategories(),
        window.electronAPI.getStats()
      ]);

      setBooks(booksData);
      setAuthors(authorsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleAddBook = async (book: Omit<Book, 'id'>) => {
    try {
      await window.electronAPI.addBook(book);
      await loadData();
      setCurrentView('books');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre:', error);
    }
  };

  const handleBorrowBook = async (bookId: number, borrowerName: string) => {
    try {
      await window.electronAPI.borrowBook(bookId, borrowerName);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'emprunt:', error);
    }
  };

  const handleReturnBook = async (bookId: number) => {
    try {
      await window.electronAPI.returnBook(bookId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du retour:', error);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await window.electronAPI.deleteBook(bookId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await window.electronAPI.searchBooks(query);
        setBooks(searchResults);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    } else {
      await loadData();
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            books={books}
            categories={categories}
          />
        );
      case 'books':
        return (
          <BookList
            books={books}
            onBorrow={handleBorrowBook}
            onDelete={handleDeleteBook}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        );
      case 'borrowed':
        return (
          <BorrowedBooks
            books={books.filter(book => book.isBorrowed)}
            onReturn={handleReturnBook}
          />
        );
      case 'add-book':
        return (
          <AddBook
            authors={authors}
            categories={categories}
            onAddBook={handleAddBook}
            onCancel={() => setCurrentView('books')}
          />
        );
      default:
        return (
          <Dashboard 
            stats={stats} 
            onNavigate={setCurrentView}
            books={books}
            categories={categories}
          />
        );
    }
  };

  return (
    <div className="app">
      <TitleBar />
      <div className="app-content">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          stats={stats}
        />
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>
      <style>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        
        .app-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .main-content {
          flex: 1;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px 0 0 0;
          margin-left: 1px;
        }
      `}</style>
    </div>
  );
};