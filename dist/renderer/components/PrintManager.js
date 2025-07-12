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
            description: 'Tous les livres avec détails complets',
            icon: lucide_react_1.FileText,
            color: 'bg-blue-500',
            count: stats.totalBooks
        },
        {
            id: 'borrowed',
            title: 'Livres Empruntés',
            description: 'Livres actuellement en circulation',
            icon: lucide_react_1.Clock,
            color: 'bg-orange-500',
            count: stats.borrowedBooks
        }
    ];
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };
    const handlePrint = async () => {
        setIsProcessing(true);
        try {
            const printData = {
                books,
                stats,
                categories
            };
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
                showMessage('success', 'Impression lancée avec succès !');
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
            const exportData = {
                books,
                stats,
                categories
            };
            const filePath = await window.electronAPI.exportCSV(exportData);
            if (filePath) {
                showMessage('success', `Fichier exporté: ${filePath.split(/[\\/]/).pop()}`);
            }
            else {
                showMessage('error', 'Export annulé ou erreur');
            }
        }
        catch (error) {
            console.error('Export error:', error);
            showMessage('error', 'Erreur lors de l\'export');
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
                    items: [
                        `${stats.totalBooks} livres au total`,
                        `${stats.availableBooks} livres disponibles`,
                        `${stats.borrowedBooks} livres empruntés`,
                        `${stats.totalAuthors} auteurs référencés`,
                        `${stats.totalCategories} catégories`
                    ]
                };
            case 'available':
                const availableBooks = books.filter(book => !book.isBorrowed);
                return {
                    title: 'Livres Disponibles',
                    items: [
                        `${availableBooks.length} livres disponibles`,
                        `Taux de disponibilité: ${((availableBooks.length / stats.totalBooks) * 100).toFixed(1)}%`,
                        'Détails: Titre, Auteur, Catégorie, ISBN, Année',
                        'Triés par ordre alphabétique'
                    ]
                };
            case 'borrowed':
                const borrowedBooks = books.filter(book => book.isBorrowed);
                return {
                    title: 'Livres Empruntés',
                    items: [
                        `${borrowedBooks.length} livres en circulation`,
                        `Taux d'emprunt: ${((borrowedBooks.length / stats.totalBooks) * 100).toFixed(1)}%`,
                        'Informations emprunteurs incluses',
                        'Durées d\'emprunt calculées',
                        'Alertes de retard affichées'
                    ]
                };
        }
    };
    const previewData = getPreviewData();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "print-manager-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { className: "print-manager", children: [(0, jsx_runtime_1.jsxs)("div", { className: "print-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { className: "header-icon", size: 24 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "header-title", children: "Impression & Export" }), (0, jsx_runtime_1.jsx)("p", { className: "header-subtitle", children: "G\u00E9n\u00E9rer des rapports de votre biblioth\u00E8que" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "close-button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), message && ((0, jsx_runtime_1.jsxs)("div", { className: `message ${message.type}`, children: [message.type === 'success' ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { children: message.text })] })), (0, jsx_runtime_1.jsxs)("div", { className: "print-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "options-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Type de rapport" }), (0, jsx_runtime_1.jsx)("div", { className: "print-options", children: printOptions.map((option) => ((0, jsx_runtime_1.jsxs)("button", { className: `print-option ${selectedType === option.id ? 'selected' : ''}`, onClick: () => setSelectedType(option.id), children: [(0, jsx_runtime_1.jsx)("div", { className: `option-icon ${option.color}`, children: (0, jsx_runtime_1.jsx)(option.icon, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "option-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "option-title", children: option.title }), (0, jsx_runtime_1.jsx)("div", { className: "option-description", children: option.description }), (0, jsx_runtime_1.jsxs)("div", { className: "option-count", children: [option.count, " \u00E9l\u00E9ment(s)"] })] })] }, option.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "Aper\u00E7u du rapport" }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "preview-header", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 18 }), (0, jsx_runtime_1.jsx)("span", { className: "preview-title", children: previewData.title })] }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-content", children: [(0, jsx_runtime_1.jsx)("p", { className: "preview-description", children: "Ce rapport inclura :" }), (0, jsx_runtime_1.jsx)("ul", { className: "preview-list", children: previewData.items.map((item, index) => ((0, jsx_runtime_1.jsx)("li", { children: item }, index))) })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "print-actions", children: (0, jsx_runtime_1.jsxs)("div", { className: "action-group", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn-secondary", onClick: handleExportCSV, disabled: isProcessing, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 16 }), "Exporter CSV"] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-primary", onClick: handlePrint, disabled: isProcessing, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { size: 16 }), isProcessing ? 'Traitement...' : 'Imprimer'] })] }) })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .print-manager-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .print-manager {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .print-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          color: #22c55e;
        }
        
        .header-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }
        
        .header-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          margin: 0 24px 16px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        
        .message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        
        .print-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 24px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }
        
        .options-section {
          margin-bottom: 32px;
        }
        
        .print-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .print-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .print-option:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .print-option.selected {
          background: #f0fdf4;
          border-color: #22c55e;
        }
        
        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .option-content {
          flex: 1;
          text-align: left;
        }
        
        .option-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .option-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .option-count {
          font-size: 12px;
          color: #22c55e;
          font-weight: 600;
        }
        
        .preview-section {
          margin-bottom: 24px;
        }
        
        .preview-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .preview-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .preview-content {
          padding: 20px;
        }
        
        .preview-description {
          font-size: 14px;
          color: #374151;
          margin: 0 0 12px 0;
          font-weight: 500;
        }
        
        .preview-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .preview-list li {
          padding: 6px 0;
          font-size: 14px;
          color: #6b7280;
          position: relative;
          padding-left: 20px;
        }
        
        .preview-list li::before {
          content: '•';
          color: #22c55e;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .print-actions {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .action-group {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover {
          background: #16a34a;
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-green-500 { background-color: #22c55e; }
        .bg-orange-500 { background-color: #f97316; }
        
        @media (max-width: 768px) {
          .print-manager-overlay {
            padding: 8px;
          }
          
          .print-manager {
            max-height: 95vh;
          }
          
          .print-header {
            padding: 16px 16px 0;
          }
          
          .print-content {
            padding: 0 16px;
          }
          
          .print-actions {
            padding: 16px;
          }
          
          .action-group {
            flex-direction: column;
          }
          
          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      ` })] }));
};
exports.PrintManager = PrintManager;
