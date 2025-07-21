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
exports.BorrowedBooks = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var BorrowedBooks = function (_a) {
    var books = _a.books, onReturn = _a.onReturn;
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('date'), sortBy = _c[0], setSortBy = _c[1];
    var _d = (0, react_1.useState)('all'), filterStatus = _d[0], setFilterStatus = _d[1];
    var handleReturn = function (book) {
        if (window.confirm("Confirmer le retour de \"".concat(book.title, "\" emprunt\u00E9 par ").concat(book.borrowerName, " ?"))) {
            onReturn(book.id);
        }
    };
    var getDaysOverdue = function (borrowDate) {
        var borrowed = new Date(borrowDate);
        var today = new Date();
        var diffTime = today.getTime() - borrowed.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var getStatusInfo = function (borrowDate) {
        var days = getDaysOverdue(borrowDate);
        if (days <= 14) {
            return {
                status: 'normal',
                color: '#3E5C49',
                bgColor: 'rgba(62, 92, 73, 0.1)',
                text: "".concat(days, " jour(s)"),
                priority: 1
            };
        }
        else if (days <= 30) {
            return {
                status: 'warning',
                color: '#C2571B',
                bgColor: 'rgba(194, 87, 27, 0.1)',
                text: "".concat(days, " jour(s) - \u00C0 surveiller"),
                priority: 2
            };
        }
        else {
            return {
                status: 'overdue',
                color: '#DC2626',
                bgColor: 'rgba(220, 38, 38, 0.1)',
                text: "".concat(days, " jour(s) - En retard"),
                priority: 3
            };
        }
    };
    // ✅ Filter only borrowed books and apply search/status filters
    var borrowedBooks = books.filter(function (book) { return book.isBorrowed; });
    var filteredBooks = borrowedBooks.filter(function (book) {
        var _a;
        // Filtre par recherche
        var matchesSearch = !searchQuery ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((_a = book.borrowerName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
        // Filtre par statut
        if (filterStatus === 'all')
            return matchesSearch;
        var statusInfo = getStatusInfo(book.borrowDate);
        return matchesSearch && statusInfo.status === filterStatus;
    });
    var sortedBooks = __spreadArray([], filteredBooks, true).sort(function (a, b) {
        switch (sortBy) {
            case 'borrower':
                return (a.borrowerName || '').localeCompare(b.borrowerName || '');
            case 'title':
                return a.title.localeCompare(b.title);
            case 'status':
                var statusA = getStatusInfo(a.borrowDate);
                var statusB = getStatusInfo(b.borrowDate);
                return statusB.priority - statusA.priority;
            case 'date':
            default:
                return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
        }
    });
    var getStatusCounts = function () {
        var counts = { normal: 0, warning: 0, overdue: 0 };
        borrowedBooks.forEach(function (book) {
            if (book.borrowDate) {
                var status_1 = getStatusInfo(book.borrowDate).status;
                if (status_1 in counts)
                    counts[status_1]++;
            }
        });
        return counts;
    };
    var statusCounts = getStatusCounts();
    return (<div className="borrowed-books">
      {/* Hero Header */}
      <div className="page-header">
        <div className="header-background">
          <div className="background-pattern"></div>
        </div>
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <lucide_react_1.Clock size={36}/>
            </div>
            <div className="header-text">
              <h1 className="page-title">Livres empruntés</h1>
              <p className="page-subtitle">
                {books.length} livre(s) actuellement en circulation
              </p>
            </div>
          </div>
          
          {/* Status Overview */}
          <div className="status-overview">
            <div className="status-card normal">
              <div className="status-icon">
                <lucide_react_1.CheckCircle size={20}/>
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.normal}</span>
                <span className="status-label">Normal</span>
              </div>
            </div>
            
            <div className="status-card warning">
              <div className="status-icon">
                <lucide_react_1.Clock size={20}/>
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.warning}</span>
                <span className="status-label">À surveiller</span>
              </div>
            </div>
            
            <div className="status-card overdue">
              <div className="status-icon">
                <lucide_react_1.AlertTriangle size={20}/>
              </div>
              <div className="status-info">
                <span className="status-count">{statusCounts.overdue}</span>
                <span className="status-label">En retard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <lucide_react_1.Search className="search-icon" size={20}/>
            <input type="text" placeholder="Rechercher par titre, auteur ou emprunteur..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="search-input"/>
            {searchQuery && (<button className="clear-search" onClick={function () { return setSearchQuery(''); }}>
                <lucide_react_1.X size={16}/>
              </button>)}
          </div>
        </div>
        
        <div className="filters-container">
          <div className="filter-group">
            <lucide_react_1.Filter size={16}/>
            <select value={filterStatus} onChange={function (e) { return setFilterStatus(e.target.value); }} className="filter-select">
              <option value="all">Tous les statuts</option>
              <option value="normal">Normal (≤14 jours)</option>
              <option value="warning">À surveiller (15-30 jours)</option>
              <option value="overdue">En retard (&gt;30 jours)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <lucide_react_1.ArrowUpDown size={16}/>
            <select value={sortBy} onChange={function (e) { return setSortBy(e.target.value); }} className="filter-select">
              <option value="date">Trier par date d'emprunt</option>
              <option value="borrower">Trier par emprunteur</option>
              <option value="title">Trier par titre</option>
              <option value="status">Trier par statut</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="books-content">
        {sortedBooks.length > 0 ? (<div className="borrowed-list">
            {sortedBooks.map(function (book) {
                var statusInfo = getStatusInfo(book.borrowDate);
                return (<div key={book.id} className={"borrowed-card ".concat(statusInfo.status)}>
                  <div className="card-content">
                    <div className="book-info">
                      <div className="book-cover">
                        {book.coverUrl ? (<img src={book.coverUrl} alt={book.title}/>) : (<div className="book-cover-placeholder">
                            <lucide_react_1.Book size={24}/>
                          </div>)}
                      </div>
                      
                      <div className="book-details">
                        <div className="book-main">
                          <h3 className="book-title">{book.title}</h3>
                          <p className="book-author">par {book.author}</p>
                          <div className="book-category">
                            <span className="category-badge">{book.category}</span>
                          </div>
                        </div>
                        
                        <div className="borrow-details">
                          <div className="detail-item">
                            <lucide_react_1.User size={16}/>
                            <span className="borrower-name">{book.borrowerName}</span>
                          </div>
                          <div className="detail-item">
                            <lucide_react_1.Calendar size={16}/>
                            <span>Emprunté le {new Date(book.borrowDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="status-section">
                      <div className="status-indicator" style={{
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color
                    }}>
                        <div className="status-dot" style={{ backgroundColor: statusInfo.color }}></div>
                        <span className="status-text">{statusInfo.text}</span>
                      </div>
                      
                      <div className="card-actions">
                        <button className="action-button view" title="Voir détails">
                          <lucide_react_1.Eye size={18}/>
                        </button>
                        <button className="action-button return" onClick={function () { return handleReturn(book); }} title="Marquer comme rendu">
                          <lucide_react_1.RotateCcw size={18}/>
                          <span>Retour</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>);
            })}
          </div>) : (<div className="empty-state">
            <div className="empty-illustration">
              {books.length === 0 ? (<lucide_react_1.CheckCircle size={80}/>) : (<lucide_react_1.Search size={80}/>)}
            </div>
            <h3 className="empty-title">
              {books.length === 0 ? 'Aucun livre emprunté' : 'Aucun résultat'}
            </h3>
            <p className="empty-description">
              {books.length === 0
                ? 'Tous les livres sont actuellement disponibles dans la bibliothèque.'
                : searchQuery
                    ? "Aucun r\u00E9sultat pour \"".concat(searchQuery, "\"")
                    : 'Aucun livre ne correspond aux filtres sélectionnés.'}
            </p>
            {(searchQuery || filterStatus !== 'all') && (<button className="btn-secondary" onClick={function () {
                    setSearchQuery('');
                    setFilterStatus('all');
                }}>
                Effacer les filtres
              </button>)}
          </div>)}
      </div>

      <style>{"\n        .borrowed-books {\n          height: 100%;\n          display: flex;\n          flex-direction: column;\n          background: #FAF9F6;\n        }\n        \n        .page-header {\n          position: relative;\n          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);\n          color: #F3EED9;\n          padding: 40px 32px;\n          overflow: hidden;\n        }\n        \n        .header-background {\n          position: absolute;\n          inset: 0;\n          overflow: hidden;\n        }\n        \n        .background-pattern {\n          position: absolute;\n          inset: 0;\n          background-image: \n            radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),\n            radial-gradient(circle at 80% 20%, rgba(243, 238, 217, 0.1) 0%, transparent 50%),\n            radial-gradient(circle at 40% 40%, rgba(243, 238, 217, 0.05) 0%, transparent 50%);\n          animation: float 15s ease-in-out infinite;\n        }\n        \n        @keyframes float {\n          0%, 100% { transform: translate(0, 0) scale(1); }\n          33% { transform: translate(30px, -30px) scale(1.05); }\n          66% { transform: translate(-20px, 20px) scale(0.95); }\n        }\n        \n        .header-content {\n          position: relative;\n          z-index: 1;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .header-main {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          margin-bottom: 32px;\n        }\n        \n        .header-icon {\n          width: 72px;\n          height: 72px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 20px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          backdrop-filter: blur(10px);\n        }\n        \n        .page-title {\n          font-size: 36px;\n          font-weight: 800;\n          margin: 0 0 8px 0;\n          line-height: 1.2;\n          letter-spacing: -0.5px;\n        }\n        \n        .page-subtitle {\n          font-size: 18px;\n          opacity: 0.9;\n          margin: 0;\n          line-height: 1.4;\n        }\n        \n        .status-overview {\n          display: flex;\n          gap: 20px;\n        }\n        \n        .status-card {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          background: rgba(243, 238, 217, 0.15);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          border-radius: 16px;\n          padding: 20px 24px;\n          transition: all 0.3s ease;\n        }\n        \n        .status-card:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: translateY(-2px);\n        }\n        \n        .status-icon {\n          width: 40px;\n          height: 40px;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .status-card.normal .status-icon {\n          background: rgba(62, 92, 73, 0.3);\n        }\n        \n        .status-card.warning .status-icon {\n          background: rgba(194, 87, 27, 0.3);\n        }\n        \n        .status-card.overdue .status-icon {\n          background: rgba(220, 38, 38, 0.3);\n        }\n        \n        .status-count {\n          font-size: 24px;\n          font-weight: 800;\n          line-height: 1;\n          margin-bottom: 4px;\n          display: block;\n        }\n        \n        .status-label {\n          font-size: 12px;\n          opacity: 0.9;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .controls-section {\n          background: #FFFFFF;\n          padding: 24px 32px;\n          border-bottom: 1px solid #E5DCC2;\n          display: flex;\n          gap: 24px;\n          align-items: center;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.04);\n        }\n        \n        .search-container {\n          flex: 1;\n          max-width: 500px;\n        }\n        \n        .search-input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .search-icon {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .search-input {\n          width: 100%;\n          height: 48px;\n          padding: 0 48px 0 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .search-input:focus {\n          outline: none;\n          border-color: #C2571B;\n          box-shadow: 0 0 0 3px rgba(194, 87, 27, 0.1);\n        }\n        \n        .search-input::placeholder {\n          color: #6E6E6E;\n        }\n        \n        .clear-search {\n          position: absolute;\n          right: 16px;\n          background: none;\n          border: none;\n          cursor: pointer;\n          color: #6E6E6E;\n          padding: 4px;\n          border-radius: 4px;\n          transition: all 0.2s ease;\n        }\n        \n        .clear-search:hover {\n          color: #2E2E2E;\n          background: #F3EED9;\n        }\n        \n        .filters-container {\n          display: flex;\n          gap: 16px;\n        }\n        \n        .filter-group {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n        }\n        \n        .filter-select {\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          padding: 8px 12px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          font-size: 14px;\n          cursor: pointer;\n          transition: border-color 0.2s ease;\n        }\n        \n        .filter-select:focus {\n          outline: none;\n          border-color: #C2571B;\n        }\n        \n        .books-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 32px;\n        }\n        \n        .borrowed-list {\n          display: flex;\n          flex-direction: column;\n          gap: 20px;\n          max-width: 1200px;\n          margin: 0 auto;\n        }\n        \n        .borrowed-card {\n          background: #FFFFFF;\n          border-radius: 20px;\n          overflow: hidden;\n          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          border: 1px solid #E5DCC2;\n          position: relative;\n        }\n        \n        .borrowed-card::before {\n          content: '';\n          position: absolute;\n          left: 0;\n          top: 0;\n          bottom: 0;\n          width: 4px;\n          background: #3E5C49;\n          transition: background 0.3s ease;\n        }\n        \n        .borrowed-card.warning::before {\n          background: #C2571B;\n        }\n        \n        .borrowed-card.overdue::before {\n          background: #DC2626;\n        }\n        \n        .borrowed-card:hover {\n          transform: translateY(-4px);\n          box-shadow: \n            0 12px 32px rgba(62, 92, 73, 0.12),\n            0 4px 16px rgba(62, 92, 73, 0.08);\n        }\n        \n        .card-content {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 24px;\n          gap: 24px;\n        }\n        \n        .book-info {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .book-cover {\n          width: 64px;\n          height: 88px;\n          border-radius: 12px;\n          overflow: hidden;\n          flex-shrink: 0;\n          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.2);\n        }\n        \n        .book-cover img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        \n        .book-cover-placeholder {\n          width: 100%;\n          height: 100%;\n          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #6E6E6E;\n        }\n        \n        .book-details {\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .book-main {\n          margin-bottom: 16px;\n        }\n        \n        .book-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n          line-height: 1.3;\n        }\n        \n        .book-author {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0 0 8px 0;\n        }\n        \n        .category-badge {\n          background: #3E5C49;\n          color: #F3EED9;\n          padding: 4px 12px;\n          border-radius: 12px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .borrow-details {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .detail-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .borrower-name {\n          font-weight: 600;\n          color: #2E2E2E;\n        }\n        \n        .status-section {\n          display: flex;\n          flex-direction: column;\n          align-items: flex-end;\n          gap: 16px;\n          flex-shrink: 0;\n        }\n        \n        .status-indicator {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 8px 16px;\n          border-radius: 20px;\n          font-size: 14px;\n          font-weight: 600;\n          border: 1px solid currentColor;\n        }\n        \n        .status-dot {\n          width: 8px;\n          height: 8px;\n          border-radius: 50%;\n          animation: pulse 2s infinite;\n        }\n        \n        .card-actions {\n          display: flex;\n          gap: 8px;\n        }\n        \n        .action-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 16px;\n          border: none;\n          border-radius: 12px;\n          cursor: pointer;\n          font-size: 14px;\n          font-weight: 600;\n          transition: all 0.2s ease;\n        }\n        \n        .action-button.view {\n          background: #F3EED9;\n          color: #6E6E6E;\n          padding: 12px;\n        }\n        \n        .action-button.view:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .action-button.return {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .action-button.return:hover {\n          background: #2E453A;\n          transform: translateY(-1px);\n          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);\n        }\n        \n        /* Empty State */\n        .empty-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 80px 32px;\n          text-align: center;\n          max-width: 600px;\n          margin: 0 auto;\n        }\n        \n        .empty-illustration {\n          color: #C2571B;\n          margin-bottom: 32px;\n          opacity: 0.6;\n        }\n        \n        .empty-title {\n          font-size: 28px;\n          font-weight: 700;\n          margin: 0 0 16px 0;\n          color: #2E2E2E;\n        }\n        \n        .empty-description {\n          margin: 0 0 32px 0;\n          font-size: 16px;\n          line-height: 1.6;\n          color: #6E6E6E;\n        }\n        \n        .btn-secondary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 24px;\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .btn-secondary:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-1px);\n        }\n        \n        /* Animations */\n        @keyframes pulse {\n          0%, 100% {\n            opacity: 1;\n            transform: scale(1);\n          }\n          50% {\n            opacity: 0.7;\n            transform: scale(1.1);\n          }\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .status-overview {\n            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n            gap: 16px;\n          }\n          \n          .controls-section {\n            flex-direction: column;\n            gap: 16px;\n            align-items: stretch;\n          }\n          \n          .search-container {\n            max-width: none;\n          }\n          \n          .filters-container {\n            justify-content: space-between;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .page-header {\n            padding: 24px 16px;\n          }\n          \n          .header-main {\n            flex-direction: column;\n            text-align: center;\n            gap: 16px;\n          }\n          \n          .page-title {\n            font-size: 28px;\n          }\n          \n          .page-subtitle {\n            font-size: 16px;\n          }\n          \n          .status-overview {\n            justify-content: center;\n            flex-wrap: wrap;\n          }\n          \n          .status-card {\n            padding: 16px 20px;\n          }\n          \n          .controls-section {\n            padding: 16px;\n          }\n          \n          .books-content {\n            padding: 16px;\n          }\n          \n          .card-content {\n            flex-direction: column;\n            align-items: stretch;\n            gap: 20px;\n          }\n          \n          .book-info {\n            flex-direction: column;\n            text-align: center;\n          }\n          \n          .status-section {\n            align-items: center;\n            flex-direction: row;\n            justify-content: space-between;\n          }\n          \n          .borrow-details {\n            align-items: center;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .header-icon {\n            width: 56px;\n            height: 56px;\n          }\n          \n          .status-overview {\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .status-card {\n            padding: 12px 16px;\n          }\n          \n          .status-count {\n            font-size: 20px;\n          }\n          \n          .filters-container {\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .filter-group {\n            flex: 1;\n          }\n          \n          .filter-select {\n            flex: 1;\n          }\n          \n          .borrowed-card {\n            border-radius: 16px;\n          }\n          \n          .card-content {\n            padding: 20px 16px;\n          }\n          \n          .book-cover {\n            width: 56px;\n            height: 76px;\n          }\n          \n          .book-title {\n            font-size: 18px;\n          }\n          \n          .card-actions {\n            width: 100%;\n            justify-content: space-between;\n          }\n          \n          .action-button.return {\n            flex: 1;\n            justify-content: center;\n          }\n        }\n      "}</style>
    </div>);
};
exports.BorrowedBooks = BorrowedBooks;
