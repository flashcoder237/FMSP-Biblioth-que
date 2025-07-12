"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const PrintManager = ({ books, stats, categories, onClose }) => {
    const [selectedType, setSelectedType] = (0, react_1.useState)('inventory');
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    const printOptions = [
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
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };
    const handlePrint = async () => {
        setIsProcessing(true);
        try {
            const printData = { books, stats, categories };
            let success = false;
            switch (selectedType) {
                case 'inventory':
                    success = await window.electronAPI.printInventory(printData);
                    break;
                case 'available':
                    success = await window.electronAPI.printAvailableBooks(printData);
                    break;
                case 'borrowed':
                    success = await window.electronAPI.printBorrowedBooks(printData);
                    break;
            }
            if (success) {
                showMessage('success', 'Document envoyé à l\'imprimante avec succès');
            }
            else {
                showMessage('error', 'Erreur lors de l\'impression');
            }
        }
        catch (error) {
            console.error('Print error:', error);
            showMessage('error', 'Erreur lors de l\'impression');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleExportCSV = async () => {
        setIsProcessing(true);
        try {
            const exportData = { books, stats, categories };
            const filePath = await window.electronAPI.exportCSV(exportData);
            if (filePath) {
                showMessage('success', `Fichier CSV exporté : ${filePath.split(/[/\\]/).pop()}`);
            }
            else {
                showMessage('error', 'Export annulé ou erreur');
            }
        }
        catch (error) {
            console.error('Export error:', error);
            showMessage('error', 'Erreur lors de l\'export CSV');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const getPreviewData = () => {
        switch (selectedType) {
            case 'inventory':
                return {
                    title: 'Inventaire Complet',
                    items: books,
                    description: `${stats.totalBooks} livre(s) au total`,
                    icon: lucide_react_1.BarChart3
                };
            case 'available':
                return {
                    title: 'Livres Disponibles',
                    items: books.filter(book => !book.isBorrowed),
                    description: `${stats.availableBooks} livre(s) disponible(s)`,
                    icon: lucide_react_1.BookOpen
                };
            case 'borrowed':
                return {
                    title: 'Livres Empruntés',
                    items: books.filter(book => book.isBorrowed),
                    description: `${stats.borrowedBooks} livre(s) emprunté(s)`,
                    icon: lucide_react_1.Clock
                };
        }
    };
    const previewData = getPreviewData();
    const selectedOption = printOptions.find(opt => opt.id === selectedType);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "print-manager-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { className: "print-manager-modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { size: 28 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h2", { className: "modal-title", children: "Impression & Export" }), (0, jsx_runtime_1.jsx)("p", { className: "modal-subtitle", children: "G\u00E9n\u00E9rez des rapports professionnels de votre biblioth\u00E8que" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "close-button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), message && ((0, jsx_runtime_1.jsxs)("div", { className: `message ${message.type}`, children: [message.type === 'success' ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: message.text })] })), (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "options-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Choisir le type de rapport" }), (0, jsx_runtime_1.jsx)("p", { className: "section-description", children: "S\u00E9lectionnez le contenu \u00E0 inclure dans votre document" })] }), (0, jsx_runtime_1.jsx)("div", { className: "print-options", children: printOptions.map((option) => ((0, jsx_runtime_1.jsxs)("div", { className: `option-card ${selectedType === option.id ? 'selected' : ''}`, onClick: () => setSelectedType(option.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: "option-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", style: { background: option.gradient }, children: (0, jsx_runtime_1.jsx)(option.icon, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-badge", children: [option.count, " \u00E9l\u00E9ment", option.count > 1 ? 's' : ''] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("h4", { className: "option-title", children: option.title }), (0, jsx_runtime_1.jsx)("p", { className: "option-description", children: option.description }), (0, jsx_runtime_1.jsx)("div", { className: "option-features", children: option.features.map((feature, index) => ((0, jsx_runtime_1.jsx)("span", { className: "feature-tag", children: feature }, index))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "option-indicator", children: selectedType === option.id && (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16 }) })] }, option.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "preview-title-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Aper\u00E7u du contenu" }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-stats", children: [(0, jsx_runtime_1.jsx)(previewData.icon, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: previewData.description })] })] }), (0, jsx_runtime_1.jsxs)("button", { className: "preview-button", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 16 }), "Pr\u00E9visualiser"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "preview-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "preview-icon", style: { background: selectedOption?.gradient }, children: (0, jsx_runtime_1.jsx)(selectedOption.icon, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-info", children: [(0, jsx_runtime_1.jsx)("h4", { className: "preview-title", children: previewData.title }), (0, jsx_runtime_1.jsxs)("p", { className: "preview-subtitle", children: ["G\u00E9n\u00E9r\u00E9 le ", new Date().toLocaleDateString('fr-FR')] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "preview-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "preview-table", children: [(0, jsx_runtime_1.jsxs)("div", { className: "table-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Titre" }), (0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Auteur" }), (0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Cat\u00E9gorie" }), selectedType === 'borrowed' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Emprunteur" }), (0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Date" })] })), selectedType !== 'borrowed' && ((0, jsx_runtime_1.jsx)("div", { className: "header-cell", children: "Statut" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "table-body", children: [previewData.items.slice(0, 4).map((book, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "table-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: (0, jsx_runtime_1.jsx)("div", { className: "cell-content", children: (0, jsx_runtime_1.jsx)("div", { className: "book-title", children: book.title }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: book.author }), (0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: (0, jsx_runtime_1.jsx)("span", { className: "category-badge", children: book.category }) }), selectedType === 'borrowed' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: (0, jsx_runtime_1.jsx)("strong", { children: book.borrowerName }) }), (0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : '-' })] })), selectedType !== 'borrowed' && ((0, jsx_runtime_1.jsx)("div", { className: "table-cell", children: (0, jsx_runtime_1.jsx)("span", { className: `status-badge ${book.isBorrowed ? 'borrowed' : 'available'}`, children: book.isBorrowed ? 'Emprunté' : 'Disponible' }) }))] }, index))), previewData.items.length > 4 && ((0, jsx_runtime_1.jsx)("div", { className: "table-row more-items", children: (0, jsx_runtime_1.jsxs)("div", { className: "table-cell more-text", children: ["... et ", previewData.items.length - 4, " autre(s) \u00E9l\u00E9ment(s)"] }) }))] })] }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "footer-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: "Format PDF professionnel" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-item", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: "Export CSV pour donn\u00E9es" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "footer-actions", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn-secondary", onClick: handleExportCSV, disabled: isProcessing, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 18 }), isProcessing ? 'Export...' : 'Exporter CSV'] }), (0, jsx_runtime_1.jsx)("button", { className: "btn-primary", onClick: handlePrint, disabled: isProcessing, children: isProcessing ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 18 }), "G\u00E9n\u00E9ration..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { size: 18 }), "Imprimer"] })) })] })] })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .print-manager-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .print-manager-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(243, 238, 217, 0.1));
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
          transform: scale(1.05);
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 600;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .message.success {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .message.error {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .section-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-title-section {
          flex: 1;
        }
        
        .preview-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
          margin-top: 4px;
        }
        
        .preview-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preview-button:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .option-card {
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(62, 92, 73, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .option-card:hover::before {
          opacity: 1;
        }
        
        .option-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
          border-color: #3E5C49;
        }
        
        .option-card.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.02);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .option-card.selected::before {
          opacity: 1;
        }
        
        .option-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .option-badge {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .option-title {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }
        
        .option-description {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        
        .option-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .feature-tag {
          background: #F3EED9;
          color: #6E6E6E;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .option-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 24px;
          height: 24px;
          background: #3E5C49;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }
        
        .option-card.selected .option-indicator {
          opacity: 1;
          transform: scale(1);
        }
        
        .preview-card {
          background: #FEFEFE;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .preview-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .preview-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 2px 0;
        }
        
        .preview-subtitle {
          font-size: 12px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .preview-content {
          padding: 24px;
        }
        
        .preview-table {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #E5DCC2;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .header-cell {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #2E2E2E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .table-body {
          max-height: 240px;
          overflow-y: auto;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          border-bottom: 1px solid #F3EED9;
          transition: background 0.2s ease;
        }
        
        .table-row:hover {
          background: #FEFEFE;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .table-row.more-items {
          grid-template-columns: 1fr;
          background: #F3EED9;
        }
        
        .table-cell {
          padding: 16px 20px;
          font-size: 14px;
          color: #2E2E2E;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .cell-content {
          width: 100%;
        }
        
        .book-title {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .more-text {
          text-align: center;
          font-style: italic;
          color: #6E6E6E;
          justify-content: center;
        }
        
        .category-badge {
          background: #3E5C49;
          color: #F3EED9;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .status-badge.available {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .status-badge.borrowed {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          background: #FEFEFE;
        }
        
        .footer-info {
          display: flex;
          gap: 32px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .footer-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
          transform: translateY(-1px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          box-shadow: 0 4px 16px rgba(62, 92, 73, 0.3);
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.4);
        }
        
        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .print-options {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
          
          .header-cell,
          .table-cell {
            padding: 12px 16px;
          }
          
          .modal-content {
            padding: 24px;
            gap: 32px;
          }
        }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 12px;
          }
          
          .print-manager-modal {
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 24px 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .footer-info {
            display: none;
          }
          
          .footer-actions {
            width: 100%;
            justify-content: stretch;
          }
          
          .btn-secondary,
          .btn-primary {
            flex: 1;
            justify-content: center;
          }
          
          .option-card {
            padding: 20px;
          }
          
          .preview-content {
            padding: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .modal-header {
            padding: 20px 16px;
          }
          
          .modal-content {
            padding: 16px;
            gap: 24px;
          }
          
          .modal-footer {
            padding: 16px;
            flex-direction: column;
            gap: 16px;
          }
          
          .footer-actions {
            flex-direction: column;
          }
          
          .option-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .option-badge {
            text-align: center;
          }
          
          .table-header,
          .table-row {
            display: block;
          }
          
          .header-cell,
          .table-cell {
            display: block;
            padding: 8px 16px;
            border-bottom: 1px solid #F3EED9;
          }
          
          .header-cell {
            background: #E5DCC2;
            font-weight: 700;
          }
          
          .table-cell:last-child {
            border-bottom: none;
          }
        }
      ` })] }));
};
exports.PrintManager = PrintManager;
