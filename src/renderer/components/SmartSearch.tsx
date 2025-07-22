import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Book, 
  User, 
  Calendar,
  Tag,
  BookOpen,
  Star,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';

interface SmartSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  data?: any[];
  placeholder?: string;
  className?: string;
}

interface SearchFilters {
  type: 'all' | 'documents' | 'borrowers' | 'history';
  category?: string;
  author?: string;
  year?: string;
  status?: 'available' | 'borrowed' | 'overdue';
  dateRange?: {
    start: string;
    end: string;
  };
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'document' | 'author' | 'category' | 'borrower' | 'quick-action';
  icon: any;
  description?: string;
  action?: () => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  data = [], 
  placeholder = "Rechercher dans la bibliothèque...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate smart suggestions based on query
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions(generateQuickActions());
      return;
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const newSuggestions: SearchSuggestion[] = [];

    // Search in documents
    const documentMatches = data.filter(item => 
      item.titre?.toLowerCase().includes(query.toLowerCase()) ||
      item.auteur?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    documentMatches.forEach(doc => {
      newSuggestions.push({
        id: `doc-${doc.id}`,
        text: doc.titre,
        type: 'document',
        icon: Book,
        description: `par ${doc.auteur} • ${doc.descripteurs}`
      });
    });

    // Add category suggestions
    const categoryMatches = ['Fiction', 'Sciences', 'Histoire', 'Philosophie', 'Art']
      .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2);

    categoryMatches.forEach(cat => {
      newSuggestions.push({
        id: `cat-${cat}`,
        text: cat,
        type: 'category',
        icon: Tag,
        description: 'Catégorie'
      });
    });

    // Add author suggestions
    const authorMatches = Array.from(new Set(data.map(item => item.auteur)))
      .filter(author => author?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2);

    authorMatches.forEach(author => {
      newSuggestions.push({
        id: `author-${author}`,
        text: author,
        type: 'author',
        icon: Star,
        description: 'Auteur'
      });
    });

    setSuggestions(newSuggestions);
  }, [query, data]);

  const generateQuickActions = (): SearchSuggestion[] => [
    {
      id: 'quick-available',
      text: 'Documents disponibles',
      type: 'quick-action',
      icon: BookOpen,
      description: 'Voir tous les livres disponibles',
      action: () => handleQuickSearch('status:available')
    },
    {
      id: 'quick-recent',
      text: 'Ajouts récents',
      type: 'quick-action',
      icon: TrendingUp,
      description: 'Documents ajoutés récemment',
      action: () => handleQuickSearch('recent')
    },
    {
      id: 'quick-popular',
      text: 'Plus empruntés',
      type: 'quick-action',
      icon: Zap,
      description: 'Les livres les plus populaires',
      action: () => handleQuickSearch('popular')
    },
    {
      id: 'quick-overdue',
      text: 'Retards',
      type: 'quick-action',
      icon: Clock,
      description: 'Documents en retard',
      action: () => handleQuickSearch('status:overdue')
    }
  ];

  const handleQuickSearch = (searchType: string) => {
    setQuery(searchType);
    handleSearch(searchType);
    setIsExpanded(false);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      setRecentSearches(newRecentSearches);
    }
    
    onSearch(searchQuery, filters);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.action) {
      suggestion.action();
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else {
          handleSearch();
          setIsExpanded(false);
        }
        break;
      case 'Escape':
        setIsExpanded(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions(generateQuickActions());
    inputRef.current?.focus();
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`smart-search ${isExpanded ? 'expanded' : ''} ${className}`} ref={searchRef}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
          />
          {query && (
            <button className="clear-button" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
          <button 
            className={`filter-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-row">
              <label>Type:</label>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  type: e.target.value as any 
                }))}
              >
                <option value="all">Tout</option>
                <option value="documents">Documents</option>
                <option value="borrowers">Emprunteurs</option>
                <option value="history">Historique</option>
              </select>
            </div>
            
            <div className="filter-row">
              <label>Statut:</label>
              <select 
                value={filters.status || ''} 
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  status: e.target.value as any || undefined 
                }))}
              >
                <option value="">Tous</option>
                <option value="available">Disponible</option>
                <option value="borrowed">Emprunté</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
          </div>
        )}

        {/* Search Suggestions */}
        {isExpanded && (
          <div className="suggestions-panel">
            {suggestions.length > 0 && (
              <div className="suggestions-section">
                <div className="suggestions-header">
                  {query ? 'Suggestions' : 'Actions rapides'}
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-icon">
                      <suggestion.icon size={18} />
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-text">{suggestion.text}</div>
                      {suggestion.description && (
                        <div className="suggestion-description">{suggestion.description}</div>
                      )}
                    </div>
                    <div className="suggestion-type">{suggestion.type}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="suggestions-section">
                <div className="suggestions-header">Recherches récentes</div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="suggestion-item recent"
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                      setIsExpanded(false);
                    }}
                  >
                    <div className="suggestion-icon">
                      <Clock size={16} />
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-text">{search}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .smart-search {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-container {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          border: 1px solid rgba(229, 220, 194, 0.4);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: hidden;
        }

        .smart-search.expanded .search-container {
          box-shadow: 
            0 20px 40px rgba(62, 92, 73, 0.15),
            0 8px 16px rgba(62, 92, 73, 0.08);
          border-color: #3E5C49;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
        }

        .search-icon {
          color: #6B7280;
          transition: color 0.2s ease;
        }

        .smart-search.expanded .search-icon {
          color: #3E5C49;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          color: #1F2937;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #9CA3AF;
        }

        .clear-button, .filter-button {
          padding: 8px;
          border: none;
          background: rgba(107, 114, 128, 0.1);
          border-radius: 8px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover, .filter-button:hover {
          background: rgba(107, 114, 128, 0.2);
          color: #374151;
        }

        .filter-button.active {
          background: #3E5C49;
          color: white;
        }

        .filters-panel {
          padding: 16px 20px;
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          background: rgba(248, 246, 240, 0.5);
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-row label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          min-width: 60px;
        }

        .filter-row select {
          padding: 6px 12px;
          border: 1px solid rgba(229, 220, 194, 0.6);
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #374151;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .filter-row select:focus {
          border-color: #3E5C49;
        }

        .suggestions-panel {
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          max-height: 400px;
          overflow-y: auto;
        }

        .suggestions-section {
          padding: 8px 0;
        }

        .suggestions-header {
          padding: 12px 20px 8px;
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 12px;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background: rgba(62, 92, 73, 0.08);
        }

        .suggestion-item.recent {
          opacity: 0.8;
        }

        .suggestion-icon {
          width: 36px;
          height: 36px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
          flex-shrink: 0;
        }

        .suggestion-content {
          flex: 1;
        }

        .suggestion-text {
          font-size: 15px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 2px;
        }

        .suggestion-description {
          font-size: 13px;
          color: #6B7280;
        }

        .suggestion-type {
          font-size: 11px;
          color: #9CA3AF;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
          background: rgba(156, 163, 175, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .search-input-wrapper {
            padding: 14px 16px;
          }

          .search-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .filters-panel {
            flex-direction: column;
            gap: 12px;
          }

          .filter-row {
            justify-content: space-between;
          }

          .filter-row label {
            min-width: auto;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .search-container {
            border: 2px solid #000;
            background: #fff;
          }

          .suggestion-item:hover,
          .suggestion-item.selected {
            background: #000;
            color: #fff;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .search-container,
          .suggestion-item,
          .clear-button,
          .filter-button {
            transition: none;
          }
        }

        /* Dark mode considerations */
        @media (prefers-color-scheme: dark) {
          .search-container {
            background: rgba(31, 41, 55, 0.95);
            border-color: rgba(75, 85, 99, 0.4);
          }

          .search-input {
            color: #F3F4F6;
          }

          .search-input::placeholder {
            color: #6B7280;
          }

          .filters-panel {
            background: rgba(17, 24, 39, 0.5);
          }

          .suggestion-text {
            color: #F3F4F6;
          }
        }
      `}</style>
    </div>
  );
};