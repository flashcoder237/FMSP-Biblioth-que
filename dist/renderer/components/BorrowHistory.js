"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowHistory = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const BorrowHistory = ({ onClose }) => {
    const [history, setHistory] = (0, react_1.useState)([]);
    const [filteredHistory, setFilteredHistory] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [filters, setFilters] = (0, react_1.useState)({
        startDate: '',
        endDate: '',
        borrowerType: 'all',
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        loadHistory();
    }, []);
    (0, react_1.useEffect)(() => {
        applyFilters();
    }, [history, filters, searchQuery]);
    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await window.electronAPI.getBorrowHistory();
            setHistory(data);
        }
        catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const applyFilters = () => {
        let filtered = [...history];
        // Appliquer les filtres de date
        if (filters.startDate) {
            filtered = filtered.filter(item => new Date(item.borrowDate) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            filtered = filtered.filter(item => new Date(item.borrowDate) <= new Date(filters.endDate + ' 23:59:59'));
        }
        // Filtre par type d'emprunteur
        if (filters.borrowerType !== 'all') {
            filtered = filtered.filter(item => item.borrower?.type === filters.borrowerType);
        }
        // Filtre par statut
        if (filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === filters.status);
        }
        // Recherche textuelle
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.book?.title.toLowerCase().includes(query) ||
                item.book?.author.toLowerCase().includes(query) ||
                `${item.borrower?.firstName} ${item.borrower?.lastName}`.toLowerCase().includes(query) ||
                item.borrower?.matricule.toLowerCase().includes(query));
        }
        setFilteredHistory(filtered);
    };
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            borrowerType: 'all',
            status: 'all'
        });
        setSearchQuery('');
    };
    const handlePrint = async () => {
        try {
            const printData = {
                history: filteredHistory,
                filters,
                stats: getFilteredStats()
            };
            await window.electronAPI.printBorrowHistory(printData);
        }
        catch (error) {
            console.error('Erreur lors de l\'impression:', error);
        }
    };
    const handleExport = async () => {
        try {
            const exportData = {
                history: filteredHistory,
                filters,
                stats: getFilteredStats()
            };
            const filePath = await window.electronAPI.exportCSV(exportData);
            if (filePath) {
                alert(`Fichier exporté : ${filePath.split(/[/\\]/).pop()}`);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };
    const getFilteredStats = () => {
        const total = filteredHistory.length;
        const active = filteredHistory.filter(h => h.status === 'active').length;
        const returned = filteredHistory.filter(h => h.status === 'returned').length;
        const overdue = filteredHistory.filter(h => h.status === 'overdue').length;
        const students = filteredHistory.filter(h => h.borrower?.type === 'student').length;
        const staff = filteredHistory.filter(h => h.borrower?.type === 'staff').length;
        return { total, active, returned, overdue, students, staff };
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 16, className: "text-blue-500" });
            case 'returned':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 16, className: "text-green-500" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 16, className: "text-red-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 16 });
        }
    };
    const getStatusLabel = (status) => {
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
    const stats = getFilteredStats();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "history-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { className: "history-modal", children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "header-icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.History, { size: 28 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-text", children: [(0, jsx_runtime_1.jsx)("h2", { className: "modal-title", children: "Historique des Emprunts" }), (0, jsx_runtime_1.jsxs)("p", { className: "modal-subtitle", children: [stats.total, " emprunt(s) \u2022 ", stats.active, " actif(s) \u2022 ", stats.returned, " rendu(s)"] })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "close-button", onClick: onClose, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stats-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon total", children: (0, jsx_runtime_1.jsx)(lucide_react_1.History, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-value", children: stats.total }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Total" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon active", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-value", children: stats.active }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "En cours" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon returned", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-value", children: stats.returned }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "Rendus" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-icon overdue", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-content", children: [(0, jsx_runtime_1.jsx)("span", { className: "stat-value", children: stats.overdue }), (0, jsx_runtime_1.jsx)("span", { className: "stat-label", children: "En retard" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filters-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "filters-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "search-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "search-input-wrapper", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "search-icon", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rechercher par livre, auteur, emprunteur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && ((0, jsx_runtime_1.jsx)("button", { className: "clear-search", onClick: () => setSearchQuery(''), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }) }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-controls", children: [(0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 16 }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: filters.startDate, onChange: (e) => handleFilterChange('startDate', e.target.value), className: "date-input", placeholder: "Date d\u00E9but" }), (0, jsx_runtime_1.jsx)("span", { className: "filter-separator", children: "\u00E0" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: filters.endDate, onChange: (e) => handleFilterChange('endDate', e.target.value), className: "date-input", placeholder: "Date fin" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 16 }), (0, jsx_runtime_1.jsxs)("select", { value: filters.borrowerType, onChange: (e) => handleFilterChange('borrowerType', e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les emprunteurs" }), (0, jsx_runtime_1.jsx)("option", { value: "student", children: "\u00C9tudiants" }), (0, jsx_runtime_1.jsx)("option", { value: "staff", children: "Personnel" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "filter-group", children: (0, jsx_runtime_1.jsxs)("select", { value: filters.status, onChange: (e) => handleFilterChange('status', e.target.value), className: "filter-select", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "Tous les statuts" }), (0, jsx_runtime_1.jsx)("option", { value: "active", children: "En cours" }), (0, jsx_runtime_1.jsx)("option", { value: "returned", children: "Rendus" }), (0, jsx_runtime_1.jsx)("option", { value: "overdue", children: "En retard" })] }) }), (0, jsx_runtime_1.jsxs)("button", { className: "reset-filters-btn", onClick: resetFilters, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }), "R\u00E9initialiser"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "actions-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "results-info", children: [filteredHistory.length, " r\u00E9sultat(s) affich\u00E9(s)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "export-actions", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn-secondary", onClick: handleExport, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 16 }), "Exporter CSV"] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-primary", onClick: handlePrint, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Printer, { size: 16 }), "Imprimer"] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "history-content", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "loading-state", children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), (0, jsx_runtime_1.jsx)("p", { children: "Chargement de l'historique..." })] })) : filteredHistory.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "history-list", children: filteredHistory.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: `history-item ${item.status}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "item-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "status-section", children: [getStatusIcon(item.status), (0, jsx_runtime_1.jsx)("span", { className: "status-label", children: getStatusLabel(item.status) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dates-section", children: [(0, jsx_runtime_1.jsxs)("span", { className: "borrow-date", children: ["Emprunt\u00E9 le ", new Date(item.borrowDate).toLocaleDateString('fr-FR')] }), item.actualReturnDate && ((0, jsx_runtime_1.jsxs)("span", { className: "return-date", children: ["Rendu le ", new Date(item.actualReturnDate).toLocaleDateString('fr-FR')] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "item-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "book-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "book-cover", children: item.book?.coverUrl ? ((0, jsx_runtime_1.jsx)("img", { src: item.book.coverUrl, alt: item.book.title })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Book, { size: 24 })) }), (0, jsx_runtime_1.jsxs)("div", { className: "book-details", children: [(0, jsx_runtime_1.jsx)("h4", { className: "book-title", children: item.book?.title }), (0, jsx_runtime_1.jsxs)("p", { className: "book-author", children: ["par ", item.book?.author] }), (0, jsx_runtime_1.jsx)("span", { className: "book-category", children: item.book?.category })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrower-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "borrower-type", children: [item.borrower?.type === 'student' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.GraduationCap, { size: 16 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Briefcase, { size: 16 })), (0, jsx_runtime_1.jsx)("span", { children: item.borrower?.type === 'student' ? 'Étudiant' : 'Personnel' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "borrower-info", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "borrower-name", children: [item.borrower?.firstName, " ", item.borrower?.lastName] }), (0, jsx_runtime_1.jsxs)("p", { className: "borrower-details", children: [item.borrower?.matricule, item.borrower?.type === 'student' && item.borrower.classe &&
                                                                        ` • ${item.borrower.classe}`, item.borrower?.type === 'staff' && item.borrower.position &&
                                                                        ` • ${item.borrower.position}`] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "timeline-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-dot borrow" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-label", children: "Emprunt" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-date", children: [new Date(item.borrowDate).toLocaleDateString('fr-FR'), " \u00E0", ' ', new Date(item.borrowDate).toLocaleTimeString('fr-FR', {
                                                                                hour: '2-digit', minute: '2-digit'
                                                                            })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-dot expected" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-label", children: "Retour pr\u00E9vu" }), (0, jsx_runtime_1.jsx)("div", { className: "timeline-date", children: new Date(item.expectedReturnDate).toLocaleDateString('fr-FR') })] })] }), item.actualReturnDate && ((0, jsx_runtime_1.jsxs)("div", { className: "timeline-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-dot return" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-label", children: "Retour effectu\u00E9" }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-date", children: [new Date(item.actualReturnDate).toLocaleDateString('fr-FR'), " \u00E0", ' ', new Date(item.actualReturnDate).toLocaleTimeString('fr-FR', {
                                                                                hour: '2-digit', minute: '2-digit'
                                                                            })] })] })] }))] })] }), item.notes && ((0, jsx_runtime_1.jsxs)("div", { className: "item-notes", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Notes :" }), " ", item.notes] }))] }, item.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "empty-state", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { size: 64 }), (0, jsx_runtime_1.jsx)("h3", { children: "Aucun historique trouv\u00E9" }), (0, jsx_runtime_1.jsx)("p", { children: Object.values(filters).some(f => f && f !== 'all') || searchQuery
                                        ? 'Aucun résultat pour les critères sélectionnés'
                                        : 'L\'historique des emprunts apparaîtra ici' }), (Object.values(filters).some(f => f && f !== 'all') || searchQuery) && ((0, jsx_runtime_1.jsx)("button", { className: "btn-secondary", onClick: resetFilters, children: "Effacer les filtres" }))] })) })] }), (0, jsx_runtime_1.jsx)("style", { children: `
        .history-overlay {
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
        
        .history-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
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
          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);
          color: #F3EED9;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .stats-section {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);
          flex: 1;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .stat-icon.total { background: #6E6E6E; }
        .stat-icon.active { background: #3B82F6; }
        .stat-icon.returned { background: #3E5C49; }
        .stat-icon.overdue { background: #DC2626; }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filters-section {
          padding: 24px 32px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .filters-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6E6E6E;
          box-shadow: 0 0 0 3px rgba(110, 110, 110, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2E2E2E;
          background: #F3EED9;
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .date-input, .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-separator {
          margin: 0 8px;
          color: #6E6E6E;
          font-size: 14px;
        }
        
        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #F3EED9;
          border: 1px solid #E5DCC2;
          border-radius: 8px;
          color: #6E6E6E;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-filters-btn:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .results-info {
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .export-actions {
          display: flex;
          gap: 12px;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #F3EED9;
          color: #6E6E6E;
          border: 1px solid #E5DCC2;
        }
        
        .btn-secondary:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary {
          background: #6E6E6E;
          color: #F3EED9;
        }
        
        .btn-primary:hover {
          background: #5A5A5A;
        }
        
        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E5DCC2;
          border-top: 3px solid #6E6E6E;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .history-item {
          background: #FFFFFF;
          border: 1px solid #E5DCC2;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .history-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #6E6E6E;
        }
        
        .history-item.active::before { background: #3B82F6; }
        .history-item.returned::before { background: #3E5C49; }
        .history-item.overdue::before { background: #DC2626; }
        
        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(62, 92, 73, 0.12);
        }
        
        .item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F9FAFB;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .status-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dates-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        
        .borrow-date, .return-date {
          font-size: 12px;
          color: #6E6E6E;
        }
        
        .return-date {
          font-weight: 600;
          color: #3E5C49;
        }
        
        .item-content {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 24px;
          padding: 20px;
        }
        
        .book-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .book-cover {
          width: 48px;
          height: 64px;
          background: linear-gradient(135deg, #F3EED9 0%, #E5DCC2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
          flex-shrink: 0;
          overflow: hidden;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-title {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        .book-author {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 8px 0;
        }
        
        .book-category {
          background: #6E6E6E;
          color: #F3EED9;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .borrower-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .borrower-name {
          font-size: 16px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 4px 0;
        }
        
        .borrower-details {
          font-size: 13px;
          color: #6E6E6E;
          margin: 0;
        }
        
        .timeline-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .timeline-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .timeline-dot.borrow { background: #3B82F6; }
        .timeline-dot.expected { background: #F59E0B; }
        .timeline-dot.return { background: #3E5C49; }
        
        .timeline-label {
          font-size: 11px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .timeline-date {
          font-size: 12px;
          color: #2E2E2E;
          margin-top: 2px;
        }
        
        .item-notes {
          padding: 16px 20px;
          background: #FEF7F0;
          border-top: 1px solid #E5DCC2;
          font-size: 13px;
          color: #6E6E6E;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #2E2E2E;
        }
        
        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }
        
        .text-blue-500 { color: #3B82F6; }
        .text-green-500 { color: #3E5C49; }
        .text-red-500 { color: #DC2626; }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .item-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .filter-controls {
            justify-content: space-between;
          }
        }
        
        @media (max-width: 768px) {
          .history-modal {
            margin: 12px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-section {
            padding: 16px 20px;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .stat-card {
            flex: 1;
            min-width: calc(50% - 6px);
          }
          
          .filters-section {
            padding: 16px 20px;
          }
          
          .history-content {
            padding: 16px 20px;
          }
          
          .book-section {
            flex-direction: column;
            text-align: center;
          }
          
          .timeline-section {
            align-items: center;
          }
        }
      ` })] }));
};
exports.BorrowHistory = BorrowHistory;
