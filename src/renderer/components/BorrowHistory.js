"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.BorrowHistory = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var BorrowHistory = function (_a) {
    var onClose = _a.onClose;
    var _b = (0, react_1.useState)([]), history = _b[0], setHistory = _b[1];
    var _c = (0, react_1.useState)([]), filteredHistory = _c[0], setFilteredHistory = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)({
        startDate: '',
        endDate: '',
        borrowerType: 'all',
        status: 'all'
    }), filters = _e[0], setFilters = _e[1];
    var _f = (0, react_1.useState)(''), searchQuery = _f[0], setSearchQuery = _f[1];
    (0, react_1.useEffect)(function () {
        loadHistory();
    }, []);
    (0, react_1.useEffect)(function () {
        applyFilters();
    }, [history, filters, searchQuery]);
    var loadHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, window.electronAPI.getBorrowHistory()];
                case 2:
                    data = _a.sent();
                    setHistory(data);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Erreur lors du chargement de l\'historique:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var applyFilters = function () {
        var filtered = __spreadArray([], history, true);
        // Appliquer les filtres de date
        if (filters.startDate) {
            filtered = filtered.filter(function (item) {
                return new Date(item.borrowDate) >= new Date(filters.startDate);
            });
        }
        if (filters.endDate) {
            filtered = filtered.filter(function (item) {
                return new Date(item.borrowDate) <= new Date(filters.endDate + ' 23:59:59');
            });
        }
        // Filtre par type d'emprunteur
        if (filters.borrowerType !== 'all') {
            filtered = filtered.filter(function (item) { var _a; return ((_a = item.borrower) === null || _a === void 0 ? void 0 : _a.type) === filters.borrowerType; });
        }
        // Filtre par statut
        if (filters.status !== 'all') {
            filtered = filtered.filter(function (item) { return item.status === filters.status; });
        }
        // Recherche textuelle
        if (searchQuery.trim()) {
            var query_1 = searchQuery.toLowerCase();
            filtered = filtered.filter(function (item) {
                var _a, _b, _c, _d, _e;
                return ((_a = item.book) === null || _a === void 0 ? void 0 : _a.title.toLowerCase().includes(query_1)) ||
                    ((_b = item.book) === null || _b === void 0 ? void 0 : _b.author.toLowerCase().includes(query_1)) ||
                    "".concat((_c = item.borrower) === null || _c === void 0 ? void 0 : _c.firstName, " ").concat((_d = item.borrower) === null || _d === void 0 ? void 0 : _d.lastName).toLowerCase().includes(query_1) ||
                    ((_e = item.borrower) === null || _e === void 0 ? void 0 : _e.matricule.toLowerCase().includes(query_1));
            });
        }
        setFilteredHistory(filtered);
    };
    var handleFilterChange = function (key, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    };
    var resetFilters = function () {
        setFilters({
            startDate: '',
            endDate: '',
            borrowerType: 'all',
            status: 'all'
        });
        setSearchQuery('');
    };
    var handlePrint = function () { return __awaiter(void 0, void 0, void 0, function () {
        var printData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    printData = {
                        history: filteredHistory,
                        filters: filters,
                        stats: getFilteredStats()
                    };
                    return [4 /*yield*/, window.electronAPI.printBorrowHistory(printData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Erreur lors de l\'impression:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var exportData, filePath, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    exportData = {
                        history: filteredHistory,
                        filters: filters,
                        stats: getFilteredStats()
                    };
                    return [4 /*yield*/, window.electronAPI.exportCSV(exportData)];
                case 1:
                    filePath = _a.sent();
                    if (filePath) {
                        alert("Fichier export\u00E9 : ".concat(filePath.split(/[/\\]/).pop()));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Erreur lors de l\'export:', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getFilteredStats = function () {
        var total = filteredHistory.length;
        var active = filteredHistory.filter(function (h) { return h.status === 'active'; }).length;
        var returned = filteredHistory.filter(function (h) { return h.status === 'returned'; }).length;
        var overdue = filteredHistory.filter(function (h) { return h.status === 'overdue'; }).length;
        var students = filteredHistory.filter(function (h) { var _a; return ((_a = h.borrower) === null || _a === void 0 ? void 0 : _a.type) === 'student'; }).length;
        var staff = filteredHistory.filter(function (h) { var _a; return ((_a = h.borrower) === null || _a === void 0 ? void 0 : _a.type) === 'staff'; }).length;
        return { total: total, active: active, returned: returned, overdue: overdue, students: students, staff: staff };
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'active':
                return <lucide_react_1.Clock size={16} className="text-blue-500"/>;
            case 'returned':
                return <lucide_react_1.CheckCircle size={16} className="text-green-500"/>;
            case 'overdue':
                return <lucide_react_1.AlertTriangle size={16} className="text-red-500"/>;
            default:
                return <lucide_react_1.Clock size={16}/>;
        }
    };
    var getStatusLabel = function (status) {
        switch (status) {
            case 'active':
                return 'En cours';
            case 'returned':
                return 'Rendu';
            case 'overdue':
                return 'En retard';
            default:
                return status;
        }
    };
    var stats = getFilteredStats();
    return (<div className="history-overlay">
      <div className="history-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <lucide_react_1.History size={28}/>
            </div>
            <div className="header-text">
              <h2 className="modal-title">Historique des Emprunts</h2>
              <p className="modal-subtitle">
                {stats.total} emprunt(s) • {stats.active} actif(s) • {stats.returned} rendu(s)
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <lucide_react_1.X size={20}/>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon total">
              <lucide_react_1.History size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon active">
              <lucide_react_1.Clock size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">En cours</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon returned">
              <lucide_react_1.CheckCircle size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.returned}</span>
              <span className="stat-label">Rendus</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon overdue">
              <lucide_react_1.AlertTriangle size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.overdue}</span>
              <span className="stat-label">En retard</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-container">
              <div className="search-input-wrapper">
                <lucide_react_1.Search className="search-icon" size={20}/>
                <input type="text" placeholder="Rechercher par livre, auteur, emprunteur..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="search-input"/>
                {searchQuery && (<button className="clear-search" onClick={function () { return setSearchQuery(''); }}>
                    <lucide_react_1.X size={16}/>
                  </button>)}
              </div>
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <lucide_react_1.Calendar size={16}/>
                <input type="date" value={filters.startDate} onChange={function (e) { return handleFilterChange('startDate', e.target.value); }} className="date-input" placeholder="Date début"/>
                <span className="filter-separator">à</span>
                <input type="date" value={filters.endDate} onChange={function (e) { return handleFilterChange('endDate', e.target.value); }} className="date-input" placeholder="Date fin"/>
              </div>
              
              <div className="filter-group">
                <lucide_react_1.Filter size={16}/>
                <select value={filters.borrowerType} onChange={function (e) { return handleFilterChange('borrowerType', e.target.value); }} className="filter-select">
                  <option value="all">Tous les emprunteurs</option>
                  <option value="student">Étudiants</option>
                  <option value="staff">Personnel</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select value={filters.status} onChange={function (e) { return handleFilterChange('status', e.target.value); }} className="filter-select">
                  <option value="all">Tous les statuts</option>
                  <option value="active">En cours</option>
                  <option value="returned">Rendus</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
              
              <button className="reset-filters-btn" onClick={resetFilters}>
                <lucide_react_1.X size={16}/>
                Réinitialiser
              </button>
            </div>
          </div>
          
          <div className="actions-row">
            <div className="results-info">
              {filteredHistory.length} résultat(s) affiché(s)
            </div>
            
            <div className="export-actions">
              <button className="btn-secondary" onClick={handleExport}>
                <lucide_react_1.Download size={16}/>
                Exporter CSV
              </button>
              <button className="btn-primary" onClick={handlePrint}>
                <lucide_react_1.Printer size={16}/>
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="history-content">
          {isLoading ? (<div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement de l'historique...</p>
            </div>) : filteredHistory.length > 0 ? (<div className="history-list">
              {filteredHistory.map(function (item) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return (<div key={item.id} className={"history-item ".concat(item.status)}>
                  <div className="item-header">
                    <div className="status-section">
                      {getStatusIcon(item.status)}
                      <span className="status-label">{getStatusLabel(item.status)}</span>
                    </div>
                    
                    <div className="dates-section">
                      <span className="borrow-date">
                        Emprunté le {new Date(item.borrowDate).toLocaleDateString('fr-FR')}
                      </span>
                      {item.actualReturnDate && (<span className="return-date">
                          Rendu le {new Date(item.actualReturnDate).toLocaleDateString('fr-FR')}
                        </span>)}
                    </div>
                  </div>
                  
                  <div className="item-content">
                    <div className="book-section">
                      <div className="book-cover">
                        {((_a = item.book) === null || _a === void 0 ? void 0 : _a.coverUrl) ? (<img src={item.book.coverUrl} alt={item.book.title}/>) : (<lucide_react_1.Book size={24}/>)}
                      </div>
                      
                      <div className="book-details">
                        <h4 className="book-title">{(_b = item.book) === null || _b === void 0 ? void 0 : _b.title}</h4>
                        <p className="book-author">par {(_c = item.book) === null || _c === void 0 ? void 0 : _c.author}</p>
                        <span className="book-category">{(_d = item.book) === null || _d === void 0 ? void 0 : _d.category}</span>
                      </div>
                    </div>
                    
                    <div className="borrower-section">
                      <div className="borrower-type">
                        {((_e = item.borrower) === null || _e === void 0 ? void 0 : _e.type) === 'student' ? (<lucide_react_1.GraduationCap size={16}/>) : (<lucide_react_1.Briefcase size={16}/>)}
                        <span>{((_f = item.borrower) === null || _f === void 0 ? void 0 : _f.type) === 'student' ? 'Étudiant' : 'Personnel'}</span>
                      </div>
                      
                      <div className="borrower-info">
                        <h4 className="borrower-name">
                          {(_g = item.borrower) === null || _g === void 0 ? void 0 : _g.firstName} {(_h = item.borrower) === null || _h === void 0 ? void 0 : _h.lastName}
                        </h4>
                        <p className="borrower-details">
                          {(_j = item.borrower) === null || _j === void 0 ? void 0 : _j.matricule}
                          {((_k = item.borrower) === null || _k === void 0 ? void 0 : _k.type) === 'student' && item.borrower.classe &&
                        " \u2022 ".concat(item.borrower.classe)}
                          {((_l = item.borrower) === null || _l === void 0 ? void 0 : _l.type) === 'staff' && item.borrower.position &&
                        " \u2022 ".concat(item.borrower.position)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="timeline-section">
                      <div className="timeline-item">
                        <div className="timeline-dot borrow"></div>
                        <div className="timeline-content">
                          <div className="timeline-label">Emprunt</div>
                          <div className="timeline-date">
                            {new Date(item.borrowDate).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(item.borrowDate).toLocaleTimeString('fr-FR', {
                        hour: '2-digit', minute: '2-digit'
                    })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-dot expected"></div>
                        <div className="timeline-content">
                          <div className="timeline-label">Retour prévu</div>
                          <div className="timeline-date">
                            {new Date(item.expectedReturnDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      {item.actualReturnDate && (<div className="timeline-item">
                          <div className="timeline-dot return"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Retour effectué</div>
                            <div className="timeline-date">
                              {new Date(item.actualReturnDate).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(item.actualReturnDate).toLocaleTimeString('fr-FR', {
                            hour: '2-digit', minute: '2-digit'
                        })}
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                  
                  {item.notes && (<div className="item-notes">
                      <strong>Notes :</strong> {item.notes}
                    </div>)}
                </div>);
            })}
            </div>) : (<div className="empty-state">
              <lucide_react_1.History size={64}/>
              <h3>Aucun historique trouvé</h3>
              <p>
                {Object.values(filters).some(function (f) { return f && f !== 'all'; }) || searchQuery
                ? 'Aucun résultat pour les critères sélectionnés'
                : 'L\'historique des emprunts apparaîtra ici'}
              </p>
              {(Object.values(filters).some(function (f) { return f && f !== 'all'; }) || searchQuery) && (<button className="btn-secondary" onClick={resetFilters}>
                  Effacer les filtres
                </button>)}
            </div>)}
        </div>
      </div>

      <style>{"\n        .history-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.7);\n          backdrop-filter: blur(8px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n        }\n        \n        .history-modal {\n          background: #FFFFFF;\n          border-radius: 24px;\n          width: 100%;\n          max-width: 1200px;\n          max-height: 90vh;\n          overflow: hidden;\n          display: flex;\n          flex-direction: column;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 32px;\n          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);\n          color: #F3EED9;\n        }\n        \n        .header-content {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n        }\n        \n        .header-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        \n        .modal-title {\n          font-size: 24px;\n          font-weight: 800;\n          margin: 0 0 4px 0;\n        }\n        \n        .modal-subtitle {\n          font-size: 14px;\n          opacity: 0.9;\n          margin: 0;\n        }\n        \n        .close-button {\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n        }\n        \n        .close-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n        }\n        \n        .stats-section {\n          display: flex;\n          gap: 20px;\n          padding: 24px 32px;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .stat-card {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          background: #FFFFFF;\n          padding: 16px 20px;\n          border-radius: 12px;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);\n          flex: 1;\n        }\n        \n        .stat-icon {\n          width: 40px;\n          height: 40px;\n          border-radius: 10px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #FFFFFF;\n        }\n        \n        .stat-icon.total { background: #6E6E6E; }\n        .stat-icon.active { background: #3B82F6; }\n        .stat-icon.returned { background: #3E5C49; }\n        .stat-icon.overdue { background: #DC2626; }\n        \n        .stat-value {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          display: block;\n        }\n        \n        .stat-label {\n          font-size: 12px;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .filters-section {\n          padding: 24px 32px;\n          background: #FFFFFF;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .filters-row {\n          display: flex;\n          align-items: center;\n          gap: 24px;\n          margin-bottom: 16px;\n        }\n        \n        .search-container {\n          flex: 1;\n          max-width: 400px;\n        }\n        \n        .search-input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .search-icon {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .search-input {\n          width: 100%;\n          height: 48px;\n          padding: 0 48px 0 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .search-input:focus {\n          outline: none;\n          border-color: #6E6E6E;\n          box-shadow: 0 0 0 3px rgba(110, 110, 110, 0.1);\n        }\n        \n        .clear-search {\n          position: absolute;\n          right: 16px;\n          background: none;\n          border: none;\n          cursor: pointer;\n          color: #6E6E6E;\n          padding: 4px;\n          border-radius: 4px;\n          transition: all 0.2s ease;\n        }\n        \n        .clear-search:hover {\n          color: #2E2E2E;\n          background: #F3EED9;\n        }\n        \n        .filter-controls {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          flex-wrap: wrap;\n        }\n        \n        .filter-group {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n        }\n        \n        .date-input, .filter-select {\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          padding: 8px 12px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          font-size: 14px;\n          cursor: pointer;\n        }\n        \n        .filter-separator {\n          margin: 0 8px;\n          color: #6E6E6E;\n          font-size: 14px;\n        }\n        \n        .reset-filters-btn {\n          display: flex;\n          align-items: center;\n          gap: 6px;\n          padding: 8px 12px;\n          background: #F3EED9;\n          border: 1px solid #E5DCC2;\n          border-radius: 8px;\n          color: #6E6E6E;\n          font-size: 12px;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .reset-filters-btn:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .actions-row {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n        }\n        \n        .results-info {\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .export-actions {\n          display: flex;\n          gap: 12px;\n        }\n        \n        .btn-secondary, .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 8px 16px;\n          border-radius: 8px;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          border: none;\n        }\n        \n        .btn-secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 1px solid #E5DCC2;\n        }\n        \n        .btn-secondary:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .btn-primary {\n          background: #6E6E6E;\n          color: #F3EED9;\n        }\n        \n        .btn-primary:hover {\n          background: #5A5A5A;\n        }\n        \n        .history-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 24px 32px;\n        }\n        \n        .loading-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 80px 32px;\n          text-align: center;\n          color: #6E6E6E;\n        }\n        \n        .loading-spinner {\n          width: 40px;\n          height: 40px;\n          border: 3px solid #E5DCC2;\n          border-top: 3px solid #6E6E6E;\n          border-radius: 50%;\n          animation: spin 1s linear infinite;\n          margin-bottom: 16px;\n        }\n        \n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        \n        .history-list {\n          display: flex;\n          flex-direction: column;\n          gap: 16px;\n        }\n        \n        .history-item {\n          background: #FFFFFF;\n          border: 1px solid #E5DCC2;\n          border-radius: 16px;\n          overflow: hidden;\n          transition: all 0.3s ease;\n          position: relative;\n        }\n        \n        .history-item::before {\n          content: '';\n          position: absolute;\n          left: 0;\n          top: 0;\n          bottom: 0;\n          width: 4px;\n          background: #6E6E6E;\n        }\n        \n        .history-item.active::before { background: #3B82F6; }\n        .history-item.returned::before { background: #3E5C49; }\n        .history-item.overdue::before { background: #DC2626; }\n        \n        .history-item:hover {\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);\n        }\n        \n        .item-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 16px 20px;\n          background: #F9FAFB;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .status-section {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n        }\n        \n        .status-label {\n          font-size: 12px;\n          font-weight: 600;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .dates-section {\n          display: flex;\n          flex-direction: column;\n          align-items: flex-end;\n          gap: 4px;\n        }\n        \n        .borrow-date, .return-date {\n          font-size: 12px;\n          color: #6E6E6E;\n        }\n        \n        .return-date {\n          font-weight: 600;\n          color: #3E5C49;\n        }\n        \n        .item-content {\n          display: grid;\n          grid-template-columns: 2fr 1.5fr 1fr;\n          gap: 24px;\n          padding: 20px;\n        }\n        \n        .book-section {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n        }\n        \n        .book-cover {\n          width: 48px;\n          height: 64px;\n          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);\n          border-radius: 8px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #6E6E6E;\n          flex-shrink: 0;\n          overflow: hidden;\n        }\n        \n        .book-cover img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        \n        .book-title {\n          font-size: 16px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n          line-height: 1.3;\n        }\n        \n        .book-author {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0 0 8px 0;\n        }\n        \n        .book-category {\n          background: #6E6E6E;\n          color: #F3EED9;\n          padding: 2px 8px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 600;\n        }\n        \n        .borrower-section {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .borrower-type {\n          display: flex;\n          align-items: center;\n          gap: 6px;\n          font-size: 11px;\n          font-weight: 600;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .borrower-name {\n          font-size: 16px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .borrower-details {\n          font-size: 13px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .timeline-section {\n          display: flex;\n          flex-direction: column;\n          gap: 12px;\n        }\n        \n        .timeline-item {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n        }\n        \n        .timeline-dot {\n          width: 12px;\n          height: 12px;\n          border-radius: 50%;\n          flex-shrink: 0;\n        }\n        \n        .timeline-dot.borrow { background: #3B82F6; }\n        .timeline-dot.expected { background: #F59E0B; }\n        .timeline-dot.return { background: #3E5C49; }\n        \n        .timeline-label {\n          font-size: 11px;\n          font-weight: 600;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .timeline-date {\n          font-size: 12px;\n          color: #2E2E2E;\n          margin-top: 2px;\n        }\n        \n        .item-notes {\n          padding: 16px 20px;\n          background: #FEF7F0;\n          border-top: 1px solid #E5DCC2;\n          font-size: 13px;\n          color: #6E6E6E;\n        }\n        \n        .empty-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 80px 32px;\n          text-align: center;\n          color: #6E6E6E;\n        }\n        \n        .empty-state h3 {\n          font-size: 20px;\n          font-weight: 700;\n          margin: 16px 0 8px 0;\n          color: #2E2E2E;\n        }\n        \n        .empty-state p {\n          margin: 0 0 24px 0;\n          font-size: 14px;\n        }\n        \n        .text-blue-500 { color: #3B82F6; }\n        .text-green-500 { color: #3E5C49; }\n        .text-red-500 { color: #DC2626; }\n        \n        /* Responsive */\n        @media (max-width: 1024px) {\n          .item-content {\n            grid-template-columns: 1fr;\n            gap: 20px;\n          }\n          \n          .filters-row {\n            flex-direction: column;\n            align-items: stretch;\n            gap: 16px;\n          }\n          \n          .filter-controls {\n            justify-content: space-between;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .history-modal {\n            margin: 12px;\n            border-radius: 20px;\n          }\n          \n          .modal-header {\n            padding: 20px;\n            flex-direction: column;\n            gap: 16px;\n            text-align: center;\n          }\n          \n          .stats-section {\n            padding: 16px 20px;\n            flex-wrap: wrap;\n            gap: 12px;\n          }\n          \n          .stat-card {\n            flex: 1;\n            min-width: calc(50% - 6px);\n          }\n          \n          .filters-section {\n            padding: 16px 20px;\n          }\n          \n          .history-content {\n            padding: 16px 20px;\n          }\n          \n          .book-section {\n            flex-direction: column;\n            text-align: center;\n          }\n          \n          .timeline-section {\n            align-items: center;\n          }\n        }\n      "}</style>
    </div>);
};
exports.BorrowHistory = BorrowHistory;
