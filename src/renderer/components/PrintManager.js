"use strict";
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
exports.PrintManager = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var PrintManager = function (_a) {
    var books = _a.books, stats = _a.stats, categories = _a.categories, onClose = _a.onClose;
    var _b = (0, react_1.useState)('inventory'), selectedType = _b[0], setSelectedType = _b[1];
    var _c = (0, react_1.useState)(false), isProcessing = _c[0], setIsProcessing = _c[1];
    var _d = (0, react_1.useState)(null), message = _d[0], setMessage = _d[1];
    var printOptions = [
        {
            id: 'inventory',
            title: 'Inventaire Complet',
            description: 'Liste détaillée de tous les livres avec statuts',
            icon: lucide_react_1.FileText,
            color: '#3E5C49',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #2E453A 100%)',
            count: stats.totalBooks,
            features: ['Informations complètes', 'Statuts des emprunts', 'Métadonnées']
        },
        {
            id: 'available',
            title: 'Livres Disponibles',
            description: 'Collection des ouvrages disponibles à l\'emprunt',
            icon: lucide_react_1.BookOpen,
            color: '#3E5C49',
            gradient: 'linear-gradient(135deg, #3E5C49 0%, #4A6B57 100%)',
            count: stats.availableBooks,
            features: ['Livres en rayon', 'Prêts à emprunter', 'Tri par catégorie']
        },
        {
            id: 'borrowed',
            title: 'Livres Empruntés',
            description: 'Suivi des emprunts en cours avec emprunteurs',
            icon: lucide_react_1.Clock,
            color: '#C2571B',
            gradient: 'linear-gradient(135deg, #C2571B 0%, #A8481A 100%)',
            count: stats.borrowedBooks,
            features: ['Noms des emprunteurs', 'Dates d\'emprunt', 'Alertes retard']
        }
    ];
    var showMessage = function (type, text) {
        setMessage({ type: type, text: text });
        setTimeout(function () { return setMessage(null); }, 5000);
    };
    var handlePrint = function () { return __awaiter(void 0, void 0, void 0, function () {
        var printData, success, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsProcessing(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    printData = { books: books, stats: stats, categories: categories };
                    success = false;
                    _a = selectedType;
                    switch (_a) {
                        case 'inventory': return [3 /*break*/, 2];
                        case 'available': return [3 /*break*/, 4];
                        case 'borrowed': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, window.electronAPI.printInventory(printData)];
                case 3:
                    success = _b.sent();
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, window.electronAPI.printAvailableBooks(printData)];
                case 5:
                    success = _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, window.electronAPI.printBorrowedBooks(printData)];
                case 7:
                    success = _b.sent();
                    return [3 /*break*/, 8];
                case 8:
                    if (success) {
                        showMessage('success', 'Document envoyé à l\'imprimante avec succès');
                    }
                    else {
                        showMessage('error', 'Erreur lors de l\'impression');
                    }
                    return [3 /*break*/, 11];
                case 9:
                    error_1 = _b.sent();
                    console.error('Print error:', error_1);
                    showMessage('error', 'Erreur lors de l\'impression');
                    return [3 /*break*/, 11];
                case 10:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleExportCSV = function () { return __awaiter(void 0, void 0, void 0, function () {
        var exportData, filePath, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    exportData = { books: books, stats: stats, categories: categories };
                    return [4 /*yield*/, window.electronAPI.exportCSV(exportData)];
                case 2:
                    filePath = _a.sent();
                    if (filePath) {
                        showMessage('success', "Fichier CSV export\u00E9 : ".concat(filePath.split(/[/\\]/).pop()));
                    }
                    else {
                        showMessage('error', 'Export annulé ou erreur');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Export error:', error_2);
                    showMessage('error', 'Erreur lors de l\'export CSV');
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var getPreviewData = function () {
        switch (selectedType) {
            case 'inventory':
                return {
                    title: 'Inventaire Complet',
                    items: books,
                    description: "".concat(stats.totalBooks, " livre(s) au total"),
                    icon: lucide_react_1.BarChart3
                };
            case 'available':
                return {
                    title: 'Livres Disponibles',
                    items: books.filter(function (book) { return !book.isBorrowed; }),
                    description: "".concat(stats.availableBooks, " livre(s) disponible(s)"),
                    icon: lucide_react_1.BookOpen
                };
            case 'borrowed':
                return {
                    title: 'Livres Empruntés',
                    items: books.filter(function (book) { return book.isBorrowed; }),
                    description: "".concat(stats.borrowedBooks, " livre(s) emprunt\u00E9(s)"),
                    icon: lucide_react_1.Clock
                };
        }
    };
    var previewData = getPreviewData();
    var selectedOption = printOptions.find(function (opt) { return opt.id === selectedType; });
    if (!selectedOption) {
        return <div>Erreur: option sélectionnée invalide</div>;
    }
    return (<div className="print-manager-overlay">
      <div className="print-manager-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <lucide_react_1.Printer size={28}/>
            </div>
            <div className="header-text">
              <h2 className="modal-title">Impression & Export</h2>
              <p className="modal-subtitle">Générez des rapports professionnels de votre bibliothèque</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <lucide_react_1.X size={20}/>
          </button>
        </div>

        {/* Message */}
        {message && (<div className={"message ".concat(message.type)}>
            {message.type === 'success' ? <lucide_react_1.Check size={20}/> : <lucide_react_1.AlertCircle size={20}/>}
            <span>{message.text}</span>
          </div>)}

        <div className="modal-content">
          {/* Options Selection */}
          <div className="options-section">
            <div className="section-header">
              <h3 className="section-title">Choisir le type de rapport</h3>
              <p className="section-description">Sélectionnez le contenu à inclure dans votre document</p>
            </div>
            
            <div className="print-options">
              {printOptions.map(function (option) { return (<div key={option.id} className={"option-card ".concat(selectedType === option.id ? 'selected' : '')} onClick={function () { return setSelectedType(option.id); }}>
                  <div className="option-header">
                    <div className="option-icon" style={{ background: option.gradient }}>
                      <option.icon size={24}/>
                    </div>
                    <div className="option-badge">
                      {option.count} élément{option.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="option-content">
                    <h4 className="option-title">{option.title}</h4>
                    <p className="option-description">{option.description}</p>
                    
                    <div className="option-features">
                      {option.features.map(function (feature, index) { return (<span key={index} className="feature-tag">
                          {feature}
                        </span>); })}
                    </div>
                  </div>
                  
                  <div className="option-indicator">
                    {selectedType === option.id && <lucide_react_1.Check size={16}/>}
                  </div>
                </div>); })}
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <div className="section-header">
              <div className="preview-title-section">
                <h3 className="section-title">Aperçu du contenu</h3>
                <div className="preview-stats">
                  <previewData.icon size={16}/>
                  <span>{previewData.description}</span>
                </div>
              </div>
              <button className="preview-button">
                <lucide_react_1.Eye size={16}/>
                Prévisualiser
              </button>
            </div>
            
            <div className="preview-card">
              <div className="preview-header">
                <div className="preview-icon" style={{ background: selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.gradient }}>
                  <selectedOption.icon size={20}/>
                </div>
                <div className="preview-info">
                  <h4 className="preview-title">{previewData.title}</h4>
                  <p className="preview-subtitle">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              
              <div className="preview-content">
                <div className="preview-table">
                  <div className="table-header">
                    <div className="header-cell">Titre</div>
                    <div className="header-cell">Auteur</div>
                    <div className="header-cell">Catégorie</div>
                    {selectedType === 'borrowed' && (<>
                        <div className="header-cell">Emprunteur</div>
                        <div className="header-cell">Date</div>
                      </>)}
                    {selectedType !== 'borrowed' && (<div className="header-cell">Statut</div>)}
                  </div>
                  
                  <div className="table-body">
                    {previewData.items.slice(0, 4).map(function (book, index) { return (<div key={index} className="table-row">
                        <div className="table-cell">
                          <div className="cell-content">
                            <div className="book-title">{book.title}</div>
                          </div>
                        </div>
                        <div className="table-cell">{book.author}</div>
                        <div className="table-cell">
                          <span className="category-badge">{book.category}</span>
                        </div>
                        {selectedType === 'borrowed' && (<>
                            <div className="table-cell">
                              <strong>{book.borrowerName}</strong>
                            </div>
                            <div className="table-cell">
                              {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '-'}
                            </div>
                          </>)}
                        {selectedType !== 'borrowed' && (<div className="table-cell">
                            <span className={"status-badge ".concat(book.isBorrowed ? 'borrowed' : 'available')}>
                              {book.isBorrowed ? 'Emprunté' : 'Disponible'}
                            </span>
                          </div>)}
                      </div>); })}
                    
                    {previewData.items.length > 4 && (<div className="table-row more-items">
                        <div className="table-cell more-text">
                          ... et {previewData.items.length - 4} autre(s) élément(s)
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <div className="info-item">
              <lucide_react_1.FileText size={16}/>
              <span>Format PDF professionnel</span>
            </div>
            <div className="info-item">
              <lucide_react_1.Download size={16}/>
              <span>Export CSV pour données</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button className="btn-secondary" onClick={handleExportCSV} disabled={isProcessing}>
              <lucide_react_1.Download size={18}/>
              {isProcessing ? 'Export...' : 'Exporter CSV'}
            </button>
            <button className="btn-primary" onClick={handlePrint} disabled={isProcessing}>
              {isProcessing ? (<>
                  <lucide_react_1.Zap size={18}/>
                  Génération...
                </>) : (<>
                  <lucide_react_1.Printer size={18}/>
                  Imprimer
                </>)}
            </button>
          </div>
        </div>
      </div>

      <style>{"\n        .print-manager-overlay {\n          position: fixed;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: rgba(46, 46, 46, 0.7);\n          backdrop-filter: blur(8px);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 1000;\n          padding: 20px;\n        }\n        \n        .print-manager-modal {\n          background: #FFFFFF;\n          border-radius: 24px;\n          width: 100%;\n          max-width: 1000px;\n          max-height: 90vh;\n          overflow: hidden;\n          display: flex;\n          flex-direction: column;\n          box-shadow: \n            0 24px 48px rgba(62, 92, 73, 0.2),\n            0 8px 24px rgba(62, 92, 73, 0.12);\n          border: 1px solid rgba(229, 220, 194, 0.3);\n        }\n        \n        .modal-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 32px;\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .modal-header::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          right: 0;\n          width: 200px;\n          height: 100%;\n          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));\n          transform: skewX(-15deg);\n          transform-origin: top;\n        }\n        \n        .header-content {\n          display: flex;\n          align-items: center;\n          gap: 20px;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .header-icon {\n          width: 56px;\n          height: 56px;\n          background: rgba(243, 238, 217, 0.2);\n          border-radius: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          backdrop-filter: blur(10px);\n        }\n        \n        .modal-title {\n          font-size: 24px;\n          font-weight: 800;\n          margin: 0 0 4px 0;\n          letter-spacing: -0.3px;\n        }\n        \n        .modal-subtitle {\n          font-size: 14px;\n          opacity: 0.9;\n          margin: 0;\n          line-height: 1.4;\n        }\n        \n        .close-button {\n          background: rgba(243, 238, 217, 0.15);\n          border: 1px solid rgba(243, 238, 217, 0.3);\n          color: #F3EED9;\n          padding: 12px;\n          border-radius: 12px;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          position: relative;\n          z-index: 1;\n        }\n        \n        .close-button:hover {\n          background: rgba(243, 238, 217, 0.25);\n          transform: scale(1.05);\n        }\n        \n        .message {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 16px 32px;\n          font-size: 14px;\n          font-weight: 600;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .message.success {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .message.error {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .modal-content {\n          flex: 1;\n          overflow-y: auto;\n          padding: 32px;\n          display: flex;\n          flex-direction: column;\n          gap: 40px;\n        }\n        \n        .section-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          margin-bottom: 24px;\n        }\n        \n        .section-title {\n          font-size: 20px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 4px 0;\n        }\n        \n        .section-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .preview-title-section {\n          flex: 1;\n        }\n        \n        .preview-stats {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 14px;\n          color: #6E6E6E;\n          margin-top: 4px;\n        }\n        \n        .preview-button {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 8px 16px;\n          background: #F3EED9;\n          border: 1px solid #E5DCC2;\n          border-radius: 8px;\n          color: #6E6E6E;\n          font-size: 14px;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n        }\n        \n        .preview-button:hover {\n          background: #EAEADC;\n          color: #2E2E2E;\n        }\n        \n        .print-options {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n          gap: 20px;\n        }\n        \n        .option-card {\n          background: #FFFFFF;\n          border: 2px solid #E5DCC2;\n          border-radius: 16px;\n          padding: 24px;\n          cursor: pointer;\n          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .option-card::before {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: linear-gradient(135deg, transparent 0%, rgba(62, 92, 73, 0.02) 100%);\n          opacity: 0;\n          transition: opacity 0.3s ease;\n        }\n        \n        .option-card:hover::before {\n          opacity: 1;\n        }\n        \n        .option-card:hover {\n          transform: translateY(-4px);\n          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);\n          border-color: #3E5C49;\n        }\n        \n        .option-card.selected {\n          border-color: #3E5C49;\n          background: rgba(62, 92, 73, 0.02);\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);\n        }\n        \n        .option-card.selected::before {\n          opacity: 1;\n        }\n        \n        .option-header {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          margin-bottom: 16px;\n        }\n        \n        .option-icon {\n          width: 48px;\n          height: 48px;\n          border-radius: 12px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .option-badge {\n          background: #F3EED9;\n          color: #6E6E6E;\n          padding: 4px 12px;\n          border-radius: 20px;\n          font-size: 12px;\n          font-weight: 600;\n        }\n        \n        .option-title {\n          font-size: 18px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 8px 0;\n        }\n        \n        .option-description {\n          font-size: 14px;\n          color: #6E6E6E;\n          margin: 0 0 16px 0;\n          line-height: 1.5;\n        }\n        \n        .option-features {\n          display: flex;\n          flex-wrap: wrap;\n          gap: 8px;\n        }\n        \n        .feature-tag {\n          background: #F3EED9;\n          color: #6E6E6E;\n          padding: 4px 8px;\n          border-radius: 8px;\n          font-size: 11px;\n          font-weight: 500;\n        }\n        \n        .option-indicator {\n          position: absolute;\n          top: 16px;\n          right: 16px;\n          width: 24px;\n          height: 24px;\n          background: #3E5C49;\n          border-radius: 50%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n          opacity: 0;\n          transform: scale(0.8);\n          transition: all 0.3s ease;\n        }\n        \n        .option-card.selected .option-indicator {\n          opacity: 1;\n          transform: scale(1);\n        }\n        \n        .preview-card {\n          background: #FEFEFE;\n          border: 1px solid #E5DCC2;\n          border-radius: 16px;\n          overflow: hidden;\n        }\n        \n        .preview-header {\n          display: flex;\n          align-items: center;\n          gap: 16px;\n          padding: 20px 24px;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .preview-icon {\n          width: 40px;\n          height: 40px;\n          border-radius: 10px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #F3EED9;\n        }\n        \n        .preview-title {\n          font-size: 16px;\n          font-weight: 700;\n          color: #2E2E2E;\n          margin: 0 0 2px 0;\n        }\n        \n        .preview-subtitle {\n          font-size: 12px;\n          color: #6E6E6E;\n          margin: 0;\n        }\n        \n        .preview-content {\n          padding: 24px;\n        }\n        \n        .preview-table {\n          background: #FFFFFF;\n          border-radius: 12px;\n          overflow: hidden;\n          border: 1px solid #E5DCC2;\n        }\n        \n        .table-header {\n          display: grid;\n          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;\n          background: #F3EED9;\n          border-bottom: 1px solid #E5DCC2;\n        }\n        \n        .header-cell {\n          padding: 16px 20px;\n          font-size: 12px;\n          font-weight: 700;\n          color: #2E2E2E;\n          text-transform: uppercase;\n          letter-spacing: 0.5px;\n        }\n        \n        .table-body {\n          max-height: 240px;\n          overflow-y: auto;\n        }\n        \n        .table-row {\n          display: grid;\n          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;\n          border-bottom: 1px solid #F3EED9;\n          transition: background 0.2s ease;\n        }\n        \n        .table-row:hover {\n          background: #FEFEFE;\n        }\n        \n        .table-row:last-child {\n          border-bottom: none;\n        }\n        \n        .table-row.more-items {\n          grid-template-columns: 1fr;\n          background: #F3EED9;\n        }\n        \n        .table-cell {\n          padding: 16px 20px;\n          font-size: 14px;\n          color: #2E2E2E;\n          display: flex;\n          align-items: center;\n          overflow: hidden;\n        }\n        \n        .cell-content {\n          width: 100%;\n        }\n        \n        .book-title {\n          font-weight: 600;\n          white-space: nowrap;\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n        \n        .more-text {\n          text-align: center;\n          font-style: italic;\n          color: #6E6E6E;\n          justify-content: center;\n        }\n        \n        .category-badge {\n          background: #3E5C49;\n          color: #F3EED9;\n          padding: 4px 10px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 600;\n        }\n        \n        .status-badge {\n          padding: 4px 10px;\n          border-radius: 12px;\n          font-size: 11px;\n          font-weight: 600;\n        }\n        \n        .status-badge.available {\n          background: rgba(62, 92, 73, 0.1);\n          color: #3E5C49;\n        }\n        \n        .status-badge.borrowed {\n          background: rgba(194, 87, 27, 0.1);\n          color: #C2571B;\n        }\n        \n        .modal-footer {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 24px 32px;\n          border-top: 1px solid #E5DCC2;\n          background: #FEFEFE;\n        }\n        \n        .footer-info {\n          display: flex;\n          gap: 32px;\n        }\n        \n        .info-item {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          font-size: 12px;\n          color: #6E6E6E;\n        }\n        \n        .footer-actions {\n          display: flex;\n          gap: 12px;\n        }\n        \n        .btn-secondary, .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 16px 24px;\n          border-radius: 12px;\n          font-size: 16px;\n          font-weight: 600;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          border: none;\n          position: relative;\n          overflow: hidden;\n        }\n        \n        .btn-secondary {\n          background: #F3EED9;\n          color: #6E6E6E;\n          border: 2px solid #E5DCC2;\n        }\n        \n        .btn-secondary:hover:not(:disabled) {\n          background: #EAEADC;\n          color: #2E2E2E;\n          transform: translateY(-1px);\n        }\n        \n        .btn-primary {\n          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);\n          color: #F3EED9;\n          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);\n        }\n        \n        .btn-primary:hover:not(:disabled) {\n          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);\n          transform: translateY(-2px);\n          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);\n        }\n        \n        .btn-secondary:disabled,\n        .btn-primary:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          transform: none;\n        }\n        \n        /* Responsive Design */\n        @media (max-width: 1024px) {\n          .print-options {\n            grid-template-columns: 1fr;\n            gap: 16px;\n          }\n          \n          .table-header,\n          .table-row {\n            grid-template-columns: 1fr;\n          }\n          \n          .header-cell,\n          .table-cell {\n            padding: 12px 16px;\n          }\n          \n          .modal-content {\n            padding: 24px;\n            gap: 32px;\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .print-manager-overlay {\n            padding: 12px;\n          }\n          \n          .print-manager-modal {\n            border-radius: 20px;\n          }\n          \n          .modal-header {\n            padding: 24px 20px;\n            flex-direction: column;\n            gap: 16px;\n            text-align: center;\n          }\n          \n          .header-content {\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .modal-content {\n            padding: 20px;\n          }\n          \n          .section-header {\n            flex-direction: column;\n            align-items: stretch;\n            gap: 12px;\n          }\n          \n          .footer-info {\n            display: none;\n          }\n          \n          .footer-actions {\n            width: 100%;\n            justify-content: stretch;\n          }\n          \n          .btn-secondary,\n          .btn-primary {\n            flex: 1;\n            justify-content: center;\n          }\n          \n          .option-card {\n            padding: 20px;\n          }\n          \n          .preview-content {\n            padding: 16px;\n          }\n        }\n        \n        @media (max-width: 480px) {\n          .modal-header {\n            padding: 20px 16px;\n          }\n          \n          .modal-content {\n            padding: 16px;\n            gap: 24px;\n          }\n          \n          .modal-footer {\n            padding: 16px;\n            flex-direction: column;\n            gap: 16px;\n          }\n          \n          .footer-actions {\n            flex-direction: column;\n          }\n          \n          .option-header {\n            flex-direction: column;\n            gap: 12px;\n            align-items: stretch;\n          }\n          \n          .option-badge {\n            text-align: center;\n          }\n          \n          .table-header,\n          .table-row {\n            display: block;\n          }\n          \n          .header-cell,\n          .table-cell {\n            display: block;\n            padding: 8px 16px;\n            border-bottom: 1px solid #F3EED9;\n          }\n          \n          .header-cell {\n            background: #E5DCC2;\n            font-weight: 700;\n          }\n          \n          .table-cell:last-child {\n            border-bottom: none;\n          }\n        }\n      "}</style>
    </div>);
};
exports.PrintManager = PrintManager;
