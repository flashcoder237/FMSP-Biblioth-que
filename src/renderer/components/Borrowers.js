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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrowers = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Borrowers = function (_a) {
    var onClose = _a.onClose, onRefreshData = _a.onRefreshData;
    var _b = (0, react_1.useState)([]), borrowers = _b[0], setBorrowers = _b[1];
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)('all'), filterType = _d[0], setFilterType = _d[1];
    var _e = (0, react_1.useState)(false), showAddModal = _e[0], setShowAddModal = _e[1];
    var _f = (0, react_1.useState)(null), editingBorrower = _f[0], setEditingBorrower = _f[1];
    var _g = (0, react_1.useState)(false), isLoading = _g[0], setIsLoading = _g[1];
    var _h = (0, react_1.useState)({
        type: 'student',
        firstName: '',
        lastName: '',
        matricule: '',
        classe: '',
        cniNumber: '',
        position: '',
        email: '',
        phone: '',
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: 1
    }), borrower = _h[0], setBorrower = _h[1];
    var _j = (0, react_1.useState)({}), formErrors = _j[0], setFormErrors = _j[1];
    (0, react_1.useEffect)(function () {
        loadBorrowers();
    }, []);
    var loadBorrowers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.electronAPI.getBorrowers()];
                case 1:
                    data = _a.sent();
                    setBorrowers(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erreur lors du chargement des emprunteurs:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var validateForm = function () {
        var errors = {};
        if (!borrower.firstName.trim()) {
            errors.firstName = 'Le prénom est requis';
        }
        if (!borrower.lastName.trim()) {
            errors.lastName = 'Le nom est requis';
        }
        if (!borrower.matricule.trim()) {
            errors.matricule = 'Le matricule est requis';
        }
        if (borrower.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(borrower.email)) {
            errors.email = 'Format email invalide';
        }
        if (borrower.phone && !/^[\d\s\+\-\(\)]{6,}$/.test(borrower.phone)) {
            errors.phone = 'Format téléphone invalide';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    var handleSearch = function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var results, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSearchQuery(query);
                    if (!query.trim()) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, window.electronAPI.searchBorrowers(query)];
                case 2:
                    results = _a.sent();
                    setBorrowers(results);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Erreur lors de la recherche:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    loadBorrowers();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var resetForm = function () {
        setBorrower({
            type: 'student',
            firstName: '',
            lastName: '',
            matricule: '',
            classe: '',
            cniNumber: '',
            position: '',
            email: '',
            phone: '',
            syncStatus: 'pending',
            lastModified: new Date().toISOString(),
            version: 1
        });
        setFormErrors({});
        setEditingBorrower(null);
    };
    var handleAddBorrower = function () {
        resetForm();
        setShowAddModal(true);
    };
    var handleEditBorrower = function (editBorrower) {
        setBorrower({
            type: editBorrower.type,
            firstName: editBorrower.firstName,
            lastName: editBorrower.lastName,
            matricule: editBorrower.matricule,
            classe: editBorrower.classe || '',
            cniNumber: editBorrower.cniNumber || '',
            position: editBorrower.position || '',
            email: editBorrower.email || '',
            phone: editBorrower.phone || '',
            syncStatus: editBorrower.syncStatus,
            lastModified: new Date().toISOString(),
            version: (editBorrower.version || 1) + 1
        });
        setFormErrors({});
        setEditingBorrower(editBorrower);
        setShowAddModal(true);
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, 10, 11]);
                    if (!editingBorrower) return [3 /*break*/, 3];
                    return [4 /*yield*/, window.electronAPI.updateBorrower(__assign(__assign({}, borrower), { id: editingBorrower.id }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, window.electronAPI.addBorrower(borrower)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    setShowAddModal(false);
                    resetForm();
                    return [4 /*yield*/, loadBorrowers()];
                case 6:
                    _a.sent();
                    if (!onRefreshData) return [3 /*break*/, 8];
                    return [4 /*yield*/, onRefreshData()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    error_3 = _a.sent();
                    console.error('Erreur:', error_3);
                    if (error_3.message && error_3.message.includes('matricule')) {
                        setFormErrors({ matricule: 'Un emprunteur avec ce matricule existe déjà' });
                    }
                    else {
                        alert(error_3.message || 'Erreur lors de l\'opération');
                    }
                    return [3 /*break*/, 11];
                case 10:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (borrower) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("\u00CAtes-vous s\u00FBr de vouloir supprimer ".concat(borrower.firstName, " ").concat(borrower.lastName, " ?"))) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, window.electronAPI.deleteBorrower(borrower.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadBorrowers()];
                case 3:
                    _a.sent();
                    if (!onRefreshData) return [3 /*break*/, 5];
                    return [4 /*yield*/, onRefreshData()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    alert(error_4.message || 'Erreur lors de la suppression');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var filteredBorrowers = borrowers.filter(function (borrower) {
        if (filterType !== 'all' && borrower.type !== filterType)
            return false;
        return true;
    });
    var studentCount = borrowers.filter(function (b) { return b.type === 'student'; }).length;
    var staffCount = borrowers.filter(function (b) { return b.type === 'staff'; }).length;
    return (<div className="borrowers-overlay">
      <div className="borrowers-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <lucide_react_1.Users size={28}/>
            </div>
            <div className="header-text">
              <h2 className="modal-title">Gestion des Emprunteurs</h2>
              <p className="modal-subtitle">
                {borrowers.length} emprunteur(s) • {studentCount} étudiant(s) • {staffCount} personnel(s)
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <lucide_react_1.X size={20}/>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon student">
              <lucide_react_1.GraduationCap size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{studentCount}</span>
              <span className="stat-label">Étudiants</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon staff">
              <lucide_react_1.Briefcase size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{staffCount}</span>
              <span className="stat-label">Personnel</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon total">
              <lucide_react_1.Users size={20}/>
            </div>
            <div className="stat-content">
              <span className="stat-value">{borrowers.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <lucide_react_1.Search className="search-icon" size={20}/>
              <input type="text" placeholder="Rechercher par nom, prénom, matricule..." value={searchQuery} onChange={function (e) { return handleSearch(e.target.value); }} className="search-input"/>
              {searchQuery && (<button className="clear-search" onClick={function () { return handleSearch(''); }}>
                  <lucide_react_1.X size={16}/>
                </button>)}
            </div>
          </div>
          
          <div className="controls-right">
            <div className="filter-group">
              <lucide_react_1.Filter size={16}/>
              <select value={filterType} onChange={function (e) { return setFilterType(e.target.value); }} className="filter-select">
                <option value="all">Tous</option>
                <option value="student">Étudiants</option>
                <option value="staff">Personnel</option>
              </select>
            </div>
            
            <button className="btn-primary" onClick={handleAddBorrower}>
              <lucide_react_1.Plus size={18}/>
              Ajouter
            </button>
          </div>
        </div>

        {/* Borrowers List */}
        <div className="borrowers-content">
          {filteredBorrowers.length > 0 ? (<div className="borrowers-grid">
              {filteredBorrowers.map(function (borrower) { return (<div key={borrower.id} className={"borrower-card ".concat(borrower.type)}>
                  <div className="card-header">
                    <div className="borrower-type">
                      {borrower.type === 'student' ? (<lucide_react_1.GraduationCap size={20}/>) : (<lucide_react_1.Briefcase size={20}/>)}
                      <span>{borrower.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                    </div>
                    
                    <div className="card-actions">
                      <button className="action-btn view" onClick={function () { }} title="Voir détails">
                        <lucide_react_1.Eye size={16}/>
                      </button>
                      <button className="action-btn edit" onClick={function () { return handleEditBorrower(borrower); }} title="Modifier">
                        <lucide_react_1.Edit size={16}/>
                      </button>
                      <button className="action-btn delete" onClick={function () { return handleDelete(borrower); }} title="Supprimer">
                        <lucide_react_1.Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="borrower-name">
                      {borrower.firstName} {borrower.lastName}
                    </h3>
                    
                    <div className="borrower-details">
                      <div className="detail-item">
                        <lucide_react_1.Hash size={14}/>
                        <span>{borrower.matricule}</span>
                      </div>
                      
                      {borrower.type === 'student' && borrower.classe && (<div className="detail-item">
                          <lucide_react_1.School size={14}/>
                          <span>{borrower.classe}</span>
                        </div>)}
                      
                      {borrower.type === 'staff' && borrower.position && (<div className="detail-item">
                          <lucide_react_1.Building size={14}/>
                          <span>{borrower.position}</span>
                        </div>)}
                      
                      {borrower.email && (<div className="detail-item">
                          <lucide_react_1.Mail size={14}/>
                          <span>{borrower.email}</span>
                        </div>)}
                    </div>
                  </div>
                </div>); })}
            </div>) : (<div className="empty-state">
              <lucide_react_1.Users size={64}/>
              <h3>Aucun emprunteur trouvé</h3>
              <p>
                {searchQuery || filterType !== 'all'
                ? 'Aucun résultat pour les critères sélectionnés'
                : 'Commencez par ajouter des emprunteurs'}
              </p>
            </div>)}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (<div className="add-modal-overlay" onClick={function () { return setShowAddModal(false); }}>
            <div className="add-modal" onClick={function (e) { return e.stopPropagation(); }}>
              <div className="add-modal-header">
                <h3>{editingBorrower ? 'Modifier' : 'Ajouter'} un emprunteur</h3>
                <button className="modal-close" onClick={function () { return setShowAddModal(false); }}>
                  <lucide_react_1.X size={20}/>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="add-form">
                <div className="form-section">
                  <label className="form-label">Type d'emprunteur *</label>
                  <div className="type-selector">
                    <button type="button" className={"type-button ".concat(borrower.type === 'student' ? 'active' : '')} onClick={function () { return setBorrower(function (prev) { return (__assign(__assign({}, prev), { type: 'student' })); }); }}>
                      <lucide_react_1.GraduationCap size={20}/>
                      Étudiant
                    </button>
                    <button type="button" className={"type-button ".concat(borrower.type === 'staff' ? 'active' : '')} onClick={function () { return setBorrower(function (prev) { return (__assign(__assign({}, prev), { type: 'staff' })); }); }}>
                      <lucide_react_1.Briefcase size={20}/>
                      Personnel
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input type="text" value={borrower.firstName} onChange={function (e) {
                setBorrower(function (prev) { return (__assign(__assign({}, prev), { firstName: e.target.value })); });
                if (formErrors.firstName) {
                    setFormErrors(function (prev) { return (__assign(__assign({}, prev), { firstName: '' })); });
                }
            }} className={"form-input ".concat(formErrors.firstName ? 'error' : '')} required/>
                    {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input type="text" value={borrower.lastName} onChange={function (e) {
                setBorrower(function (prev) { return (__assign(__assign({}, prev), { lastName: e.target.value })); });
                if (formErrors.lastName) {
                    setFormErrors(function (prev) { return (__assign(__assign({}, prev), { lastName: '' })); });
                }
            }} className={"form-input ".concat(formErrors.lastName ? 'error' : '')} required/>
                    {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Matricule *</label>
                    <input type="text" value={borrower.matricule} onChange={function (e) {
                setBorrower(function (prev) { return (__assign(__assign({}, prev), { matricule: e.target.value })); });
                if (formErrors.matricule) {
                    setFormErrors(function (prev) { return (__assign(__assign({}, prev), { matricule: '' })); });
                }
            }} className={"form-input ".concat(formErrors.matricule ? 'error' : '')} required/>
                    {formErrors.matricule && <span className="error-text">{formErrors.matricule}</span>}
                  </div>
                  
                  {borrower.type === 'student' ? (<div className="form-group">
                      <label className="form-label">Classe</label>
                      <input type="text" value={borrower.classe} onChange={function (e) { return setBorrower(function (prev) { return (__assign(__assign({}, prev), { classe: e.target.value })); }); }} className="form-input" placeholder="ex: Terminale C"/>
                    </div>) : (<>
                      <div className="form-group">
                        <label className="form-label">N° CNI</label>
                        <input type="text" value={borrower.cniNumber} onChange={function (e) { return setBorrower(function (prev) { return (__assign(__assign({}, prev), { cniNumber: e.target.value })); }); }} className="form-input"/>
                      </div>
                      <div className="form-group span-full">
                        <label className="form-label">Poste</label>
                        <input type="text" value={borrower.position} onChange={function (e) { return setBorrower(function (prev) { return (__assign(__assign({}, prev), { position: e.target.value })); }); }} className="form-input" placeholder="ex: Professeur de Mathématiques"/>
                      </div>
                    </>)}
                  
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" value={borrower.email} onChange={function (e) {
                setBorrower(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); });
                if (formErrors.email) {
                    setFormErrors(function (prev) { return (__assign(__assign({}, prev), { email: '' })); });
                }
            }} className={"form-input ".concat(formErrors.email ? 'error' : '')}/>
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input type="tel" value={borrower.phone} onChange={function (e) {
                setBorrower(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); });
                if (formErrors.phone) {
                    setFormErrors(function (prev) { return (__assign(__assign({}, prev), { phone: '' })); });
                }
            }} className={"form-input ".concat(formErrors.phone ? 'error' : '')}/>
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={function () { return setShowAddModal(false); }} disabled={isLoading}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    <lucide_react_1.Save size={16}/>
                    {isLoading ? 'Enregistrement...' : editingBorrower ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>)}
      </div>

      <style>{"\n        .borrowers-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.7);\n          backdrop-filter: blur(8px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n        }\n        \n        .borrowers-modal {\n          background: #FFFFFF;\n          border-radius: 24px;\n          width: 100%;\n          max-width: 1200px;\n          max-height: 90vh;\n          overflow: hidden;\n          display: flex;\n          flex-direction: column;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 32px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n        }\n        \n        .header-content {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n        }\n        \n        .header-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        \n        .modal-title {\n          font-size: 24px;\n          font-weight: 800;\n          margin: 0 0 4px 0;\n        }\n        \n        .modal-subtitle {\n          font-size: 14px;\n          opacity: 0.9;\n          margin: 0;\n        }\n        \n        .close-button {\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n        }\n        \n        .close-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n        }\n        \n        .stats-section {\n          display: flex;\n          gap: 20px;\n          padding: 24px 32px;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .stat-card {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          background: #FFFFFF;\n          padding: 16px 20px;\n          border-radius: 12px;\n          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);\n          flex: 1;\n        }\n        \n        .stat-icon {\n          width: 40px;\n          height: 40px;\n          border-radius: 10px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #FFFFFF;\n        }\n        \n        .stat-icon.student {\n          background: #3E5C49;\n        }\n        \n        .stat-icon.staff {\n          background: #C2571B;\n        }\n        \n        .stat-icon.total {\n          background: #6E6E6E;\n        }\n        \n        .stat-value {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          display: block;\n        }\n        \n        .stat-label {\n          font-size: 12px;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .controls-section {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 24px 32px;\n          border-bottom: 1px solid #E5DCC2;\n          background: #FFFFFF;\n        }\n        \n        .search-container {\n          flex: 1;\n          max-width: 400px;\n        }\n        \n        .search-input-wrapper {\n          position: relative;\n          display: flex;\n          align-items: center;\n        }\n        \n        .search-icon {\n          position: absolute;\n          left: 16px;\n          color: #6E6E6E;\n          z-index: 2;\n        }\n        \n        .search-input {\n          width: 100%;\n          height: 48px;\n          padding: 0 48px 0 48px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          font-size: 16px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .search-input:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .clear-search {\n          position: absolute;\n          right: 16px;\n          background: none;\n          border: none;\n          cursor: pointer;\n          color: #6E6E6E;\n          padding: 4px;\n          border-radius: 4px;\n          transition: all 0.2s ease;\n        }\n        \n        .clear-search:hover {\n          color: #2E2E2E;\n          background: #F3EED9;\n        }\n        \n        .controls-right {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n        }\n        \n        .filter-group {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          color: #6E6E6E;\n        }\n        \n        .filter-select {\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          padding: 8px 12px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          font-size: 14px;\n          cursor: pointer;\n        }\n        \n        .filter-select:focus {\n          outline: none;\n          border-color: #3E5C49;\n        }\n        \n        .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 20px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          border: none;\n          border-radius: 12px;\n          font-size: 14px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s ease;\n        }\n        \n        .btn-primary:hover {\n          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);\n          transform: translateY(-1px);\n        }\n        \n        .borrowers-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 32px;\n        }\n        \n        .borrowers-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n          gap: 20px;\n        }\n        \n        .borrower-card {\n          background: #FFFFFF;\n          border-radius: 16px;\n          border: 1px solid #E5DCC2;\n          overflow: hidden;\n          transition: all 0.3s ease;\n          position: relative;\n        }\n        \n        .borrower-card::before {\n          content: '';\n          position: absolute;\n          left: 0;\n          top: 0;\n          bottom: 0;\n          width: 4px;\n          background: #3E5C49;\n        }\n        \n        .borrower-card.staff::before {\n          background: #C2571B;\n        }\n        \n        .borrower-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);\n        }\n        \n        .card-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 16px 20px;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .borrower-type {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 12px;\n          font-weight: 600;\n          color: #6E6E6E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .card-actions {\n          display: flex;\n          gap: 4px;\n        }\n        \n        .action-btn {\n          width: 32px;\n          height: 32px;\n          border: none;\n          border-radius: 8px;\n          cursor: pointer;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          transition: all 0.2s ease;\n        }\n        \n        .action-btn.view {\n          background: #F3EED9;\n          color: #6E6E6E;\n        }\n        \n        .action-btn.view:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .action-btn.edit {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .action-btn.edit:hover {\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .action-btn.delete {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .action-btn.delete:hover {\n          background: #C2571B;\n          color: #F3EED9;\n        }\n        \n        .card-content {\n          padding: 20px;\n        }\n        \n        .borrower-name {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 16px 0;\n        }\n        \n        .borrower-details {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .detail-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 14px;\n          color: #6E6E6E;\n        }\n        \n        .empty-state {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 80px 32px;\n          text-align: center;\n          color: #6E6E6E;\n        }\n        \n        .empty-state h3 {\n          font-size: 20px;\n          font-weight: 700;\n          margin: 16px 0 8px 0;\n          color: #2E2E2E;\n        }\n        \n        .empty-state p {\n          margin: 0;\n          font-size: 14px;\n        }\n        \n        /* Add Modal */\n        .add-modal-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.8);\n          backdrop-filter: blur(4px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1100;\n          padding: 20px;\n        }\n        \n        .add-modal {\n          background: #FFFFFF;\n          border-radius: 20px;\n          width: 100%;\n          max-width: 600px;\n          max-height: 90vh;\n          overflow-y: auto;\n          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);\n        }\n        \n        .add-modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 24px 32px;\n          border-bottom: 1px solid #E5DCC2;\n          background: #F3EED9;\n        }\n        \n        .add-modal-header h3 {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0;\n        }\n        \n        .modal-close {\n          background: rgba(110, 110, 110, 0.1);\n          border: none;\n          cursor: pointer;\n          padding: 8px;\n          border-radius: 8px;\n          color: #6E6E6E;\n          transition: all 0.2s ease;\n        }\n        \n        .modal-close:hover {\n          background: rgba(110, 110, 110, 0.2);\n          color: #2E2E2E;\n        }\n        \n        .add-form {\n          padding: 32px;\n        }\n        \n        .form-section {\n          margin-bottom: 24px;\n        }\n        \n        .form-label {\n          display: block;\n          font-size: 14px;\n          font-weight: 600;\n          color: #2E2E2E;\n          margin-bottom: 8px;\n        }\n        \n        .type-selector {\n          display: flex;\n          gap: 12px;\n        }\n        \n        .type-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 16px 20px;\n          border: 2px solid #E5DCC2;\n          border-radius: 12px;\n          background: #FFFFFF;\n          color: #6E6E6E;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          font-size: 14px;\n          font-weight: 500;\n          flex: 1;\n          justify-content: center;\n        }\n        \n        .type-button:hover {\n          border-color: #3E5C49;\n          color: #3E5C49;\n        }\n        \n        .type-button.active {\n          border-color: #3E5C49;\n          background: #3E5C49;\n          color: #F3EED9;\n        }\n        \n        .form-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 20px;\n          margin-bottom: 24px;\n        }\n        \n        .form-group {\n          display: flex;\n          flex-direction: column;\n          gap: 8px;\n        }\n        \n        .form-group.span-full {\n          grid-column: 1 / -1;\n        }\n        \n        .form-input {\n          width: 100%;\n          padding: 12px 16px;\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          font-size: 14px;\n          background: #FFFFFF;\n          color: #2E2E2E;\n          transition: all 0.2s ease;\n        }\n        \n        .form-input:focus {\n          outline: none;\n          border-color: #3E5C49;\n          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);\n        }\n        \n        .form-input.error {\n          border-color: #C2571B;\n          background: rgba(194, 87, 27, 0.05);\n        }\n        \n        .error-text {\n          font-size: 12px;\n          color: #C2571B;\n          font-weight: 500;\n        }\n        \n        .form-actions {\n          display: flex;\n          gap: 12px;\n          justify-content: flex-end;\n          padding-top: 24px;\n          border-top: 1px solid #E5DCC2;\n        }\n        \n        .btn-secondary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 12px 20px;\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n          border-radius: 8px;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .btn-secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .btn-primary:disabled,\n        .btn-secondary:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n        }\n        \n        /* Responsive */\n        @media (max-width: 768px) {\n          .borrowers-modal {\n            margin: 12px;\n            border-radius: 20px;\n          }\n          \n          .modal-header {\n            padding: 20px;\n            flex-direction: column;\n            gap: 16px;\n            text-align: center;\n          }\n          \n          .stats-section {\n            padding: 16px 20px;\n            flex-direction: column;\n            gap: 12px;\n          }\n          \n          .controls-section {\n            padding: 16px 20px;\n            flex-direction: column;\n            gap: 16px;\n            align-items: stretch;\n          }\n          \n          .controls-right {\n            justify-content: space-between;\n          }\n          \n          .borrowers-content {\n            padding: 16px 20px;\n          }\n          \n          .borrowers-grid {\n            grid-template-columns: 1fr;\n            gap: 16px;\n          }\n          \n          .form-grid {\n            grid-template-columns: 1fr;\n          }\n          \n          .type-selector {\n            flex-direction: column;\n          }\n          \n          .form-actions {\n            flex-direction: column-reverse;\n          }\n          \n          .btn-primary,\n          .btn-secondary {\n            width: 100%;\n            justify-content: center;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .add-modal {\n            margin: 8px;\n            border-radius: 16px;\n          }\n          \n          .add-modal-header,\n          .add-form {\n            padding: 20px 16px;\n          }\n          \n          .borrower-card {\n            border-radius: 12px;\n          }\n          \n          .card-header,\n          .card-content {\n            padding: 16px;\n          }\n        }\n      "}</style>
    </div>);
};
exports.Borrowers = Borrowers;
