"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatusBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const SyncStatusBar = ({ syncStatus, networkStatus, onManualSync, onRetrySync, onClearErrors }) => {
    const [showDetails, setShowDetails] = (0, react_1.useState)(false);
    const [lastUpdateTime, setLastUpdateTime] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const updateTime = () => {
            if (syncStatus.lastSync) {
                const now = new Date();
                const lastSync = new Date(syncStatus.lastSync);
                const diffMs = now.getTime() - lastSync.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 1) {
                    setLastUpdateTime('À l\'instant');
                }
                else if (diffMins < 60) {
                    setLastUpdateTime(`Il y a ${diffMins} min`);
                }
                else {
                    const diffHours = Math.floor(diffMins / 60);
                    setLastUpdateTime(`Il y a ${diffHours}h${diffMins % 60}min`);
                }
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 30000); // Mettre à jour toutes les 30s
        return () => clearInterval(interval);
    }, [syncStatus.lastSync]);
    const getConnectionStatusDisplay = () => {
        if (!networkStatus.isOnline) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Hors ligne" })] }));
        }
        if (syncStatus.syncInProgress) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-blue-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Synchronisation..." })] }));
        }
        if (syncStatus.errors.length > 0) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Erreurs de sync" })] }));
        }
        if (syncStatus.pendingOperations > 0) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-orange-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", children: [syncStatus.pendingOperations, " en attente"] })] }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Synchronis\u00E9" })] }));
    };
    const getSyncButtonState = () => {
        if (!networkStatus.isOnline) {
            return {
                disabled: true,
                text: 'Hors ligne',
                className: 'bg-gray-300 text-gray-500 cursor-not-allowed'
            };
        }
        if (syncStatus.syncInProgress) {
            return {
                disabled: true,
                text: 'Sync...',
                className: 'bg-blue-500 text-white cursor-not-allowed'
            };
        }
        return {
            disabled: false,
            text: 'Synchroniser',
            className: 'bg-blue-500 text-white hover:bg-blue-600'
        };
    };
    const buttonState = getSyncButtonState();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white border-b border-gray-200 px-4 py-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [getConnectionStatusDisplay(), syncStatus.lastSync && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Derni\u00E8re sync: ", lastUpdateTime] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [syncStatus.errors.length > 0 && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowDetails(true), className: "flex items-center gap-1 text-red-600 hover:text-red-700 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-4 h-4" }), syncStatus.errors.length, " erreur", syncStatus.errors.length > 1 ? 's' : ''] })), (0, jsx_runtime_1.jsxs)("button", { onClick: onManualSync, disabled: buttonState.disabled, className: `px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${buttonState.className}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: `w-3 h-3 ${syncStatus.syncInProgress ? 'animate-spin' : ''}` }), buttonState.text] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDetails(true), className: "p-1 text-gray-500 hover:text-gray-700 rounded", title: "Voir les d\u00E9tails", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }) })] })] }) }), showDetails && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800", children: "Statut de synchronisation" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDetails(false), className: "p-1 text-gray-500 hover:text-gray-700 rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-6 overflow-y-auto max-h-[60vh]", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-800 mb-3", children: "Statut g\u00E9n\u00E9ral" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Connexion r\u00E9seau:" }), (0, jsx_runtime_1.jsx)("span", { className: networkStatus.isOnline ? 'text-green-600' : 'text-red-600', children: networkStatus.isOnline ? 'En ligne' : 'Hors ligne' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Type de connexion:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-800", children: networkStatus.connectionType })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Synchronisation en cours:" }), (0, jsx_runtime_1.jsx)("span", { className: syncStatus.syncInProgress ? 'text-blue-600' : 'text-gray-600', children: syncStatus.syncInProgress ? 'Oui' : 'Non' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Op\u00E9rations en attente:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-orange-600 font-medium", children: syncStatus.pendingOperations })] }), syncStatus.lastSync && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Derni\u00E8re synchronisation:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-800", children: new Date(syncStatus.lastSync).toLocaleString('fr-FR') })] }))] })] }), syncStatus.errors.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium text-gray-800", children: ["Erreurs de synchronisation (", syncStatus.errors.length, ")"] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClearErrors, className: "text-sm text-red-600 hover:text-red-700", children: "Effacer toutes" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3 max-h-64 overflow-y-auto", children: syncStatus.errors.map((error) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-red-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-red-800", children: [error.type, " - ", error.operation] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mb-2", children: error.error }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-red-600", children: ["Tentatives: ", error.retryCount, " \u2022 ", new Date(error.timestamp).toLocaleString('fr-FR')] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onRetrySync(error.entityId), className: "ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700", children: "R\u00E9essayer" })] }) }, error.id))) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-800 mb-3", children: "Connectivit\u00E9" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [networkStatus.isOnline ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "w-8 h-8 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.CloudOff, { className: "w-8 h-8 text-red-500" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-800", children: networkStatus.isOnline ? 'Connecté au cloud' : 'Mode hors ligne' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: networkStatus.isOnline
                                                                        ? 'Toutes les données sont synchronisées automatiquement'
                                                                        : 'Les modifications sont sauvegardées localement en attente de connexion' })] })] }), !networkStatus.isOnline && syncStatus.pendingOperations > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-orange-50 border border-orange-200 rounded p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-orange-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", children: [syncStatus.pendingOperations, " modification", syncStatus.pendingOperations > 1 ? 's' : '', " en attente"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-orange-700 mt-1", children: "Ces modifications seront synchronis\u00E9es automatiquement d\u00E8s la reconnexion." })] }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t p-4 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDetails(false), className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors", children: "Fermer" }) })] }) }))] }));
};
exports.SyncStatusBar = SyncStatusBar;
