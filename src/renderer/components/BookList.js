"use strict";
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
exports.BookList = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var BookList = function (_a) {
    var books = _a.books, onBorrow = _a.onBorrow, onDelete = _a.onDelete;
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)(null), activeDropdown = _c[0], setActiveDropdown = _c[1];
    var _d = (0, react_1.useState)('grid'), viewMode = _d[0], setViewMode = _d[1];
    var _e = (0, react_1.useState)('title'), sortBy = _e[0], setSortBy = _e[1];
    var _f = (0, react_1.useState)('all'), filterStatus = _f[0], setFilterStatus = _f[1];
    var _g = (0, react_1.useState)('all'), selectedCategory = _g[0], setSelectedCategory = _g[1];
    var handleDelete = function (book) {
        if (window.confirm("\u00CAtes-vous s\u00FBr de vouloir supprimer \"".concat(book.title, "\" ?"))) {
            onDelete(book.id);
        }
        setActiveDropdown(null);
    };
    var getCategoryColor = function (category) {
        var colors = {
            'Fiction': '#3E5C49',
            'Science-Fiction': '#C2571B',
            'Histoire': '#6E6E6E',
            'Biographie': '#3E5C49',
            'Sciences': '#C2571B',
            'Philosophie': '#6E6E6E',
            'Romance': '#E91E63',
            'Thriller': '#9C27B0',
            'Jeunesse': '#FF9800',
            'Art': '#607D8B'
        };
        return colors[category] || '#6E6E6E';
    };
    // Obtenir toutes les catégories uniques
    var categories = Array.from(new Set(books.map(function (book) { return book.category; })));
    var filteredBooks = books.filter(function (book) {
        // Filtre par statut
        if (filterStatus === 'available')
            return !book.isBorrowed;
        if (filterStatus === 'borrowed')
            return book.isBorrowed;
        // Filtre par catégorie
        if (selectedCategory !== 'all' && book.category !== selectedCategory)
            return false;
        // Filtre par recherche
        if (searchQuery.trim()) {
            var query = searchQuery.toLowerCase();
            return (book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query) ||
                (book.description && book.description.toLowerCase().includes(query)));
        }
        return true;
    });
    var sortedBooks = __spreadArray([], filteredBooks, true).sort(function (a, b) {
        switch (sortBy) {
            case 'author':
                return a.author.localeCompare(b.author);
            case 'date':
                return (b.publishedDate || '').localeCompare(a.publishedDate || '');
            case 'popularity':
                // Simuler la popularité basée sur le statut d'emprunt et la date
                var scoreA = (a.isBorrowed ? 10 : 5) + (a.publishedDate ? parseInt(a.publishedDate) / 100 : 0);
                var scoreB = (b.isBorrowed ? 10 : 5) + (b.publishedDate ? parseInt(b.publishedDate) / 100 : 0);
                return scoreB - scoreA;
            default:
                return a.title.localeCompare(b.title);
        }
    });
    var getBookStats = function () {
        return {
            total: books.length,
            available: books.filter(function (b) { return !b.isBorrowed; }).length,
            borrowed: books.filter(function (b) { return b.isBorrowed; }).length,
            filtered: filteredBooks.length
        };
    };
    var stats = getBookStats();
    return (<div className="book-list">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="header-main">
          <div className="header-text">
            <h1 className="page-title">Collection de livres</h1>
            <p className="page-subtitle">
              {stats.filtered} livre(s) affiché(s) sur {stats.total} au total
            </p>
          </div>
          
          <div className="header-actions">
            <div className="quick-stats">
              <div className="quick-stat available">
                <span className="stat-number">{stats.available}</span>
                <span className="stat-label">Disponibles</span>
              </div>
              <div className="quick-stat borrowed">
                <span className="stat-number">{stats.borrowed}</span>
                <span className="stat-label">Empruntés</span>
              </div>
            </div>
            
            <div className="view-controls">
              <button className={"view-button ".concat(viewMode === 'grid' ? 'active' : '')} onClick={function () { return setViewMode('grid'); }} title="Vue grille">
                <lucide_react_1.Grid size={16}/>
              </button>
              <button className={"view-button ".concat(viewMode === 'list' ? 'active' : '')} onClick={function () { return setViewMode('list'); }} title="Vue liste">
                <lucide_react_1.List size={16}/>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <lucide_react_1.Search className="search-icon" size={20}/>
              <input type="text" placeholder="Rechercher par titre, auteur, catégorie..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="search-input"/>
              {searchQuery && (<button className="clear-search" onClick={function () { return setSearchQuery(''); }}>
                  <lucide_react_1.X size={16}/>
                </button>)}
            </div>
          </div>
          
          <div className="filters-container">
            <div className="filter-group">
              <lucide_react_1.Filter size={16}/>
              <select value={filterStatus} onChange={function (e) { return setFilterStatus(e.target.value); }} className="filter-select">
                <option value="all">Tous les livres</option>
                <option value="available">Disponibles</option>
                <option value="borrowed">Empruntés</option>
              </select>
            </div>
            
            <div className="filter-group">
              <lucide_react_1.Tag size={16}/>
              <select value={selectedCategory} onChange={function (e) { return setSelectedCategory(e.target.value); }} className="filter-select">
                <option value="all">Toutes les catégories</option>
                {categories.map(function (category) { return (<option key={category} value={category}>{category}</option>); })}
              </select>
            </div>
            
            <div className="filter-group">
              <lucide_react_1.SortAsc size={16}/>
              <select value={sortBy} onChange={function (e) { return setSortBy(e.target.value); }} className="filter-select">
                <option value="title">Trier par titre</option>
                <option value="author">Trier par auteur</option>
                <option value="date">Trier par date</option>
                <option value="popularity">Trier par popularité</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Quick Filters */}
        {categories.length > 0 && (<div className="category-filters">
            <button className={"category-chip ".concat(selectedCategory === 'all' ? 'active' : '')} onClick={function () { return setSelectedCategory('all'); }}>
              Toutes
            </button>
            {categories.slice(0, 6).map(function (category) { return (<button key={category} className={"category-chip ".concat(selectedCategory === category ? 'active' : '')} onClick={function () { return setSelectedCategory(category); }} style={{
                    '--category-color': getCategoryColor(category)
                }}>
                {category}
              </button>); })}
            {categories.length > 6 && (<span className="more-categories">+{categories.length - 6} autres</span>)}
          </div>)}
      </div>

      {/* Books Content */}
      <div className="books-content">
        {sortedBooks.length > 0 ? (<div className={"books-container ".concat(viewMode)}>
            {sortedBooks.map(function (book) { return (<div key={book.id} className="book-item card-elevated">
                {viewMode === 'grid' ? (
                // Enhanced Grid View
                <>
                    <div className="book-cover">
                      {book.coverUrl ? (<img src={book.coverUrl} alt={book.title}/>) : (<div className="book-cover-placeholder">
                          <lucide_react_1.Book size={32}/>
                        </div>)}
                      
                      {/* Status Badge */}
                      <div className={"status-badge ".concat(book.isBorrowed ? 'borrowed' : 'available')}>
                        {book.isBorrowed ? 'Emprunté' : 'Disponible'}
                      </div>
                      
                      {/* Quick Actions Overlay */}
                      <div className="book-overlay">
                        <div className="overlay-actions">
                          <button className="overlay-button view" onClick={function () { }} title="Voir détails">
                            <lucide_react_1.Eye size={16}/>
                          </button>
                          {!book.isBorrowed && (<button className="overlay-button borrow" onClick={function () { return onBorrow(book); }} title="Emprunter">
                              <lucide_react_1.UserPlus size={16}/>
                            </button>)}
                          <button className="overlay-button menu" onClick={function () { return setActiveDropdown(activeDropdown === book.id ? null : book.id); }} title="Plus d'options">
                            <lucide_react_1.MoreVertical size={16}/>
                          </button>
                        </div>
                        
                        {activeDropdown === book.id && (<div className="dropdown-menu">
                            <button className="dropdown-item" onClick={function () { }}>
                              <lucide_react_1.Eye size={16}/>
                              Voir détails
                            </button>
                            <button className="dropdown-item" onClick={function () { }}>
                              <lucide_react_1.Edit size={16}/>
                              Modifier
                            </button>
                            {!book.isBorrowed && (<button className="dropdown-item primary" onClick={function () { return onBorrow(book); }}>
                                <lucide_react_1.UserPlus size={16}/>
                                Emprunter
                              </button>)}
                            <button className="dropdown-item delete" onClick={function () { return handleDelete(book); }}>
                              <lucide_react_1.Trash2 size={16}/>
                              Supprimer
                            </button>
                          </div>)}
                      </div>
                    </div>
                    
                    <div className="book-content">
                      <div className="book-header">
                        <h3 className="book-title">{book.title}</h3>
                        <div className="book-rating">
                          <lucide_react_1.Star size={14} fill="currentColor"/>
                          <span>4.2</span>
                        </div>
                      </div>
                      
                      <div className="book-meta">
                        <div className="meta-item">
                          <lucide_react_1.User size={14}/>
                          <span>{book.author}</span>
                        </div>
                        {book.publishedDate && (<div className="meta-item">
                            <lucide_react_1.Calendar size={14}/>
                            <span>{book.publishedDate}</span>
                          </div>)}
                      </div>
                      
                      <div className="book-category-section">
                        <span className="category-tag" style={{ backgroundColor: getCategoryColor(book.category) }}>
                          {book.category}
                        </span>
                        {book.isBorrowed && (<span className="trending-badge">
                            <lucide_react_1.TrendingUp size={12}/>
                            Populaire
                          </span>)}
                      </div>
                      
                      {book.description && (<p className="book-description">{book.description}</p>)}
                      
                      {book.isBorrowed && book.borrowerName && (<div className="borrow-info">
                          <div className="borrower-avatar">
                            {book.borrowerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="borrow-details">
                            <span className="borrow-label">Emprunté par</span>
                            <span className="borrower-name">{book.borrowerName}</span>
                            {book.borrowDate && (<span className="borrow-date">
                                le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}
                              </span>)}
                          </div>
                        </div>)}
                      
                      {/* Action Button */}
                      {!book.isBorrowed && (<button className="primary-action-btn" onClick={function () { return onBorrow(book); }}>
                          <lucide_react_1.UserPlus size={16}/>
                          Emprunter maintenant
                        </button>)}
                    </div>
                  </>) : (
                // Enhanced List View
                <div className="book-list-content">
                    <div className="book-list-cover">
                      {book.coverUrl ? (<img src={book.coverUrl} alt={book.title}/>) : (<div className="book-cover-placeholder small">
                          <lucide_react_1.Book size={20}/>
                        </div>)}
                      <div className={"list-status-indicator ".concat(book.isBorrowed ? 'borrowed' : 'available')}>
                        {book.isBorrowed ? '●' : '●'}
                      </div>
                    </div>
                    
                    <div className="book-list-details">
                      <div className="book-list-main">
                        <div className="list-title-section">
                          <h3 className="book-title">{book.title}</h3>
                          <div className="book-rating small">
                            <lucide_react_1.Star size={12} fill="currentColor"/>
                            <span>4.2</span>
                          </div>
                        </div>
                        <p className="book-author">par {book.author}</p>
                        <div className="book-tags">
                          <span className="category-tag small" style={{ backgroundColor: getCategoryColor(book.category) }}>
                            {book.category}
                          </span>
                          {book.publishedDate && (<span className="year-tag">{book.publishedDate}</span>)}
                          {book.isBorrowed && (<span className="status-tag borrowed">Emprunté</span>)}
                        </div>
                      </div>
                      
                      {book.description && (<p className="book-list-description">{book.description}</p>)}
                      
                      {book.isBorrowed && book.borrowerName && (<div className="borrow-info compact">
                          <lucide_react_1.User size={14}/>
                          <span>Emprunté par <strong>{book.borrowerName}</strong></span>
                          {book.borrowDate && (<span>le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}</span>)}
                        </div>)}
                    </div>
                    
                    <div className="book-list-actions">
                      {!book.isBorrowed && (<button className="action-button borrow" onClick={function () { return onBorrow(book); }}>
                          <lucide_react_1.UserPlus size={16}/>
                          Emprunter
                        </button>)}
                      <button className="action-button menu" onClick={function () { return setActiveDropdown(activeDropdown === book.id ? null : book.id); }}>
                        <lucide_react_1.MoreVertical size={16}/>
                      </button>
                      
                      {activeDropdown === book.id && (<div className="dropdown-menu right">
                          <button className="dropdown-item" onClick={function () { }}>
                            <lucide_react_1.Eye size={16}/>
                            Voir détails
                          </button>
                          <button className="dropdown-item" onClick={function () { }}>
                            <lucide_react_1.Edit size={16}/>
                            Modifier
                          </button>
                          {!book.isBorrowed && (<button className="dropdown-item primary" onClick={function () { return onBorrow(book); }}>
                              <lucide_react_1.UserPlus size={16}/>
                              Emprunter
                            </button>)}
                          <button className="dropdown-item delete" onClick={function () { return handleDelete(book); }}>
                            <lucide_react_1.Trash2 size={16}/>
                            Supprimer
                          </button>
                        </div>)}
                    </div>
                  </div>)}
              </div>); })}
          </div>) : (<div className="empty-state">
            <div className="empty-icon">
              {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all' ? (<lucide_react_1.Search size={64}/>) : (<lucide_react_1.Book size={64}/>)}
            </div>
            <h3 className="empty-title">
              {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all'
                ? 'Aucun livre trouvé'
                : 'Aucun livre dans la collection'}
            </h3>
            <p className="empty-description">
              {searchQuery
                ? "Aucun r\u00E9sultat pour \"".concat(searchQuery, "\"")
                : filterStatus !== 'all'
                    ? "Aucun livre ".concat(filterStatus === 'available' ? 'disponible' : 'emprunté', " pour le moment")
                    : selectedCategory !== 'all'
                        ? "Aucun livre dans la cat\u00E9gorie \"".concat(selectedCategory, "\"")
                        : 'Commencez par ajouter des livres à votre collection'}
            </p>
            {(searchQuery || filterStatus !== 'all' || selectedCategory !== 'all') && (<button className="btn-secondary" onClick={function () {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setSelectedCategory('all');
                }}>
                Effacer tous les filtres
              </button>)}
          </div>)}
      </div>

      <style>{"\n        .book-list {\n          height: 100%;\n          display: flex;\n          flex-direction: column;\n          background: #FAF9F6;\n        }\n        \n        .page-header {\n          background: #FFFFFF;\n          padding: 32px;\n          border-bottom: 1px solid #E5DCC2;\n          position: sticky;\n          top: 0;\n          z-index: 10;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.04);\n        }\n        \n        .header-main {\n          display: flex;\n          align-items: flex-start;\n          justify-content: space-between;\n          margin-bottom: 24px;\n        }\n        \n        .page-title {\n          font-size: 32px;\n          font-weight: 800;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n          letter-spacing: -0.5px;\n        }\n        \n        .page-subtitle {\n          color: #6E6E6E;\n          margin: 0;\n          font-size: 16px;\n          font-weight: 500;\n        }\n        \n        .header-actions {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n        }\n        \n        .quick-stats {\n          display: flex;\n          gap: 16px;\n        }\n        \n        .quick-stat {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          padding: 12px 16px;\n          border-radius: 12px;\n          min-width: 80px;\n        }\n        \n        .quick-stat.available {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .quick-stat.borrowed {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .stat-number {\n          font-size: 24px;\n          font-weight: 800;\n          line-height: 1;\n          margin-bottom: 4px;\n        }\n        \n        .stat-label {\n          font-size: 12px;\n          font-weight: 600;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .view-controls {\n          display: flex;\n          background: #F3EED9;\n          border-radius: 12px;\n          padding: 4px;\n          gap: 4px;\n        }\n        \n        .view-button {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          width: 40px;\n          height: 40px;\n          border: none;\n          background: transparent;\n          border-radius: 8px;\n          color: #6E6E6E;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .view-button.active {\n          background: #FFFFFF;\n          color: #3E5C49;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.1);\n        }\n        \n        .search-section {\n          display: flex;\n          gap: 24px;\n          align-items: center;\n          margin-bottom: 20px;\n        }\n        \n        .search-container {\n          flex: 1;\n          max-width: 500px;\n        }\n        \n        .search-input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .search-icon {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .search-input {\n          width: 100%;\n          height: 48px;\n          padding: 0 48px 0 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .search-input:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .search-input::placeholder {\n          color: #6E6E6E;\n        }\n        \n        .clear-search {\n          position: absolute;\n          right: 16px;\n          background: none;\n          border: none;\n          cursor: pointer;\n          color: #6E6E6E;\n          padding: 4px;\n          border-radius: 4px;\n          transition: all 0.2s ease;\n        }\n        \n        .clear-search:hover {\n          color: #2E2E2E;\n          background: #F3EED9;\n        }\n        \n        .filters-container {\n          display: flex;\n          gap: 16px;\n        }\n        \n        .filter-group {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n        }\n        \n        .filter-select {\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          padding: 8px 12px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          font-size: 14px;\n          cursor: pointer;\n          transition: border-color 0.2s ease;\n        }\n        \n        .filter-select:focus {\n          outline: none;\n          border-color: #3E5C49;\n        }\n        \n        .category-filters {\n          display: flex;\n          gap: 8px;\n          flex-wrap: wrap;\n          align-items: center;\n        }\n        \n        .category-chip {\n          padding: 8px 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 20px;\n          background: #FFFFFF;\n          color: #6E6E6E;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          white-space: nowrap;\n        }\n        \n        .category-chip:hover {\n          border-color: var(--category-color, #3E5C49);\n          color: var(--category-color, #3E5C49);\n        }\n        \n        .category-chip.active {\n          background: var(--category-color, #3E5C49);\n          border-color: var(--category-color, #3E5C49);\n          color: #FFFFFF;\n        }\n        \n        .more-categories {\n          font-size: 14px;\n          color: #6E6E6E;\n          font-weight: 500;\n        }\n        \n        .books-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 32px;\n        }\n        \n        .books-container.grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n          gap: 24px;\n        }\n        \n        .books-container.list {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .book-item {\n          background: #FFFFFF;\n          border-radius: 20px;\n          overflow: hidden;\n          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          position: relative;\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .book-item:hover {\n          transform: translateY(-6px);\n          box-shadow: \n            0 16px 40px rgba(62, 92, 73, 0.15),\n            0 8px 24px rgba(62, 92, 73, 0.1);\n        }\n        \n        /* Enhanced Grid View */\n        .book-cover {\n          height: 240px;\n          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .book-cover img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        \n        .book-cover-placeholder {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          height: 100%;\n          color: #6E6E6E;\n        }\n        \n        .book-cover-placeholder.small {\n          width: 60px;\n          height: 80px;\n          border-radius: 8px;\n          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);\n        }\n        \n        .status-badge {\n          position: absolute;\n          top: 12px;\n          right: 12px;\n          padding: 6px 12px;\n          border-radius: 20px;\n          font-size: 12px;\n          font-weight: 600;\n          backdrop-filter: blur(10px);\n        }\n        \n        .status-badge.available {\n          background: rgba(62, 92, 73, 0.9);\n          color: #F3EED9;\n        }\n        \n        .status-badge.borrowed {\n          background: rgba(194, 87, 27, 0.9);\n          color: #F3EED9;\n        }\n        \n        .book-overlay {\n          position: absolute;\n          inset: 0;\n          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);\n          opacity: 0;\n          transition: opacity 0.3s ease;\n          display: flex;\n          flex-direction: column;\n          justify-content: space-between;\n          padding: 16px;\n        }\n        \n        .book-item:hover .book-overlay {\n          opacity: 1;\n        }\n        \n        .overlay-actions {\n          display: flex;\n          gap: 8px;\n          justify-content: flex-end;\n          align-self: flex-start;\n        }\n        \n        .overlay-button {\n          width: 36px;\n          height: 36px;\n          border: none;\n          border-radius: 50%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          backdrop-filter: blur(10px);\n        }\n        \n        .overlay-button.view {\n          background: rgba(255, 255, 255, 0.2);\n          color: #FFFFFF;\n        }\n        \n        .overlay-button.borrow {\n          background: rgba(62, 92, 73, 0.9);\n          color: #F3EED9;\n        }\n        \n        .overlay-button.menu {\n          background: rgba(110, 110, 110, 0.9);\n          color: #FFFFFF;\n        }\n        \n        .overlay-button:hover {\n          transform: scale(1.1);\n        }\n        \n        .dropdown-menu {\n          position: absolute;\n          top: 100%;\n          right: 0;\n          background: #FFFFFF;\n          border: 1px solid #E5DCC2;\n          border-radius: 12px;\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.15);\n          z-index: 20;\n          min-width: 160px;\n          overflow: hidden;\n          margin-top: 8px;\n        }\n        \n        .dropdown-menu.right {\n          right: 0;\n          left: auto;\n        }\n        \n        .dropdown-item {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 12px 16px;\n          border: none;\n          background: none;\n          cursor: pointer;\n          font-size: 14px;\n          color: #2E2E2E;\n          transition: background 0.2s ease;\n          text-align: left;\n        }\n        \n        .dropdown-item:hover {\n          background: #F3EED9;\n        }\n        \n        .dropdown-item.primary {\n          color: #3E5C49;\n          font-weight: 600;\n        }\n        \n        .dropdown-item.primary:hover {\n          background: rgba(62, 92, 73, 0.1);\n        }\n        \n        .dropdown-item.delete {\n          color: #C2571B;\n        }\n        \n        .dropdown-item.delete:hover {\n          background: rgba(194, 87, 27, 0.1);\n        }\n        \n        .book-content {\n          padding: 24px;\n        }\n        \n        .book-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: flex-start;\n          margin-bottom: 16px;\n        }\n        \n        .book-title {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n          line-height: 1.3;\n          flex: 1;\n          margin-right: 12px;\n        }\n        \n        .book-rating {\n          display: flex;\n          align-items: center;\n          gap: 4px;\n          color: #FFB400;\n          font-size: 14px;\n          font-weight: 600;\n        }\n        \n        .book-rating.small {\n          font-size: 12px;\n        }\n        \n        .book-rating.small svg {\n          width: 12px;\n          height: 12px;\n        }\n        \n        .book-meta {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n          margin-bottom: 16px;\n        }\n        \n        .meta-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .book-category-section {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          margin-bottom: 16px;\n          flex-wrap: wrap;\n        }\n        \n        .category-tag {\n          color: #FFFFFF;\n          padding: 6px 12px;\n          border-radius: 16px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .category-tag.small {\n          padding: 4px 8px;\n          font-size: 11px;\n        }\n        \n        .trending-badge {\n          display: flex;\n          align-items: center;\n          gap: 4px;\n          background: rgba(255, 180, 0, 0.1);\n          color: #FFB400;\n          padding: 4px 8px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 600;\n        }\n        \n        .book-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.5;\n          margin: 0 0 20px 0;\n          display: -webkit-box;\n          -webkit-line-clamp: 3;\n          -webkit-box-orient: vertical;\n          overflow: hidden;\n        }\n        \n        .borrow-info {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          background: rgba(194, 87, 27, 0.05);\n          border: 1px solid rgba(194, 87, 27, 0.2);\n          border-radius: 12px;\n          padding: 12px;\n          margin-bottom: 20px;\n        }\n        \n        .borrow-info.compact {\n          background: none;\n          border: none;\n          padding: 0;\n          margin-bottom: 0;\n          font-size: 13px;\n          color: #6E6E6E;\n        }\n        \n        .borrower-avatar {\n          width: 32px;\n          height: 32px;\n          background: #C2571B;\n          color: #FFFFFF;\n          border-radius: 50%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-weight: 700;\n          font-size: 14px;\n        }\n        \n        .borrow-details {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          gap: 2px;\n        }\n        \n        .borrow-label {\n          font-size: 12px;\n          color: #6E6E6E;\n          font-weight: 500;\n        }\n        \n        .borrower-name {\n          font-size: 14px;\n          color: #C2571B;\n          font-weight: 600;\n        }\n        \n        .borrow-date {\n          font-size: 12px;\n          color: #6E6E6E;\n        }\n        \n        .primary-action-btn {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          gap: 8px;\n          padding: 14px 20px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          border: none;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s ease;\n        }\n        \n        .primary-action-btn:hover {\n          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);\n          transform: translateY(-1px);\n          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);\n        }\n        \n        /* Enhanced List View */\n        .book-list-content {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          padding: 20px;\n          position: relative;\n        }\n        \n        .book-list-cover {\n          flex-shrink: 0;\n          position: relative;\n        }\n        \n        .list-status-indicator {\n          position: absolute;\n          top: -4px;\n          right: -4px;\n          width: 12px;\n          height: 12px;\n          border-radius: 50%;\n          font-size: 8px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        \n        .list-status-indicator.available {\n          color: #3E5C49;\n        }\n        \n        .list-status-indicator.borrowed {\n          color: #C2571B;\n        }\n        \n        .book-list-details {\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .book-list-main {\n          margin-bottom: 12px;\n        }\n        \n        .list-title-section {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          margin-bottom: 4px;\n        }\n        \n        .book-author {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0 0 8px 0;\n        }\n        \n        .book-tags {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          flex-wrap: wrap;\n        }\n        \n        .year-tag {\n          background: #F3EED9;\n          color: #6E6E6E;\n          padding: 2px 8px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 500;\n        }\n        \n        .status-tag {\n          padding: 2px 8px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 600;\n        }\n        \n        .status-tag.borrowed {\n          background: #C2571B;\n          color: #FFFFFF;\n        }\n        \n        .book-list-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          line-height: 1.5;\n          margin: 12px 0 0 0;\n          display: -webkit-box;\n          -webkit-line-clamp: 2;\n          -webkit-box-orient: vertical;\n          overflow: hidden;\n        }\n        \n        .book-list-actions {\n          flex-shrink: 0;\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          position: relative;\n        }\n        \n        .action-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 16px;\n          border: none;\n          border-radius: 12px;\n          cursor: pointer;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.2s ease;\n        }\n        \n        .action-button.borrow {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .action-button.borrow:hover {\n          background: #2E453A;\n          transform: translateY(-1px);\n        }\n        \n        .action-button.menu {\n          background: #F3EED9;\n          color: #6E6E6E;\n          padding: 12px;\n        }\n        \n        .action-button.menu:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        /* Empty State Enhanced */\n        .empty-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 80px 32px;\n          text-align: center;\n          color: #6E6E6E;\n        }\n        \n        .empty-icon {\n          color: #C2571B;\n          margin-bottom: 24px;\n          opacity: 0.6;\n        }\n        \n        .empty-title {\n          font-size: 24px;\n          font-weight: 700;\n          margin: 0 0 12px 0;\n          color: #2E2E2E;\n        }\n        \n        .empty-description {\n          margin: 0 0 24px 0;\n          font-size: 16px;\n          line-height: 1.5;\n          max-width: 400px;\n        }\n        \n        .btn-secondary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 24px;\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .btn-secondary:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-1px);\n        }\n        \n        /* Enhanced Animations */\n        @keyframes slideIn {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n        \n        .book-item {\n          animation: slideIn 0.3s ease-out;\n        }\n        \n        .book-item:nth-child(1) { animation-delay: 0ms; }\n        .book-item:nth-child(2) { animation-delay: 50ms; }\n        .book-item:nth-child(3) { animation-delay: 100ms; }\n        .book-item:nth-child(4) { animation-delay: 150ms; }\n        .book-item:nth-child(5) { animation-delay: 200ms; }\n        .book-item:nth-child(6) { animation-delay: 250ms; }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .books-container.grid {\n            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n            gap: 20px;\n          }\n          \n          .header-actions {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .quick-stats {\n            order: 2;\n          }\n          \n          .view-controls {\n            order: 1;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .page-header {\n            padding: 20px 16px;\n          }\n          \n          .header-main {\n            flex-direction: column;\n            align-items: stretch;\n            gap: 16px;\n          }\n          \n          .search-section {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .filters-container {\n            justify-content: space-between;\n            flex-wrap: wrap;\n            gap: 12px;\n          }\n          \n          .category-filters {\n            justify-content: flex-start;\n            overflow-x: auto;\n            padding-bottom: 8px;\n          }\n          \n          .books-content {\n            padding: 16px;\n          }\n          \n          .books-container.grid {\n            grid-template-columns: 1fr;\n            gap: 16px;\n          }\n          \n          .book-list-content {\n            flex-direction: column;\n            gap: 12px;\n            text-align: center;\n          }\n          \n          .book-list-cover {\n            align-self: center;\n          }\n          \n          .book-list-actions {\n            align-self: center;\n            justify-content: center;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .page-title {\n            font-size: 24px;\n          }\n          \n          .search-input {\n            height: 44px;\n            font-size: 14px;\n          }\n          \n          .view-controls {\n            order: -1;\n            align-self: flex-start;\n          }\n          \n          .filters-container {\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .filter-group {\n            flex: 1;\n          }\n          \n          .filter-select {\n            flex: 1;\n          }\n          \n          .book-content {\n            padding: 20px;\n          }\n          \n          .book-cover {\n            height: 200px;\n          }\n          \n          .overlay-actions {\n            gap: 6px;\n          }\n          \n          .overlay-button {\n            width: 32px;\n            height: 32px;\n          }\n          \n          .primary-action-btn {\n            padding: 12px 16px;\n            font-size: 13px;\n          }\n          \n          .action-button {\n            padding: 10px 12px;\n            font-size: 13px;\n          }\n          \n          .category-chip {\n            padding: 6px 12px;\n            font-size: 13px;\n          }\n        }\n        \n        /* Performance optimizations */\n        .book-item {\n          contain: layout style paint;\n        }\n        \n        .book-cover img {\n          will-change: transform;\n        }\n        \n        .book-overlay {\n          will-change: opacity;\n        }\n        \n        /* Accessibility improvements */\n        @media (prefers-reduced-motion: reduce) {\n          .book-item,\n          .overlay-button,\n          .primary-action-btn,\n          .action-button {\n            transition: none;\n            animation: none;\n          }\n          \n          .book-item:hover {\n            transform: none;\n          }\n        }\n        \n        /* High contrast mode support */\n        @media (prefers-contrast: high) {\n          .book-item {\n            border: 2px solid;\n          }\n          \n          .search-input,\n          .filter-select {\n            border-width: 3px;\n          }\n          \n          .category-chip {\n            border-width: 3px;\n          }\n        }\n        \n        /* Dark mode support (future-proofing) */\n        @media (prefers-color-scheme: dark) {\n          .book-list {\n            background: #1a1a1a;\n          }\n          \n          .page-header,\n          .book-item {\n            background: #2d2d2d;\n            border-color: #404040;\n          }\n          \n          .page-title,\n          .book-title {\n            color: #ffffff;\n          }\n          \n          .page-subtitle,\n          .book-author,\n          .meta-item {\n            color: #a0a0a0;\n          }\n          \n          .search-input,\n          .filter-select {\n            background: #2d2d2d;\n            border-color: #404040;\n            color: #ffffff;\n          }\n        }\n      "}</style>
    </div>);
};
exports.BookList = BookList;
