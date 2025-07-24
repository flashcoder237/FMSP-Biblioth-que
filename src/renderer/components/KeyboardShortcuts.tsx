import React, { useEffect, useState, createContext, useContext } from 'react';
import { 
  Command, 
  Search, 
  Plus, 
  BookOpen, 
  Users, 
  Settings, 
  Home,
  X,
  Keyboard,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'search' | 'general';
  icon?: any;
  modifier?: 'ctrl' | 'alt' | 'shift';
}

interface KeyboardShortcutsContextType {
  registerShortcut: (id: string, shortcut: Shortcut) => void;
  unregisterShortcut: (id: string) => void;
  showHelp: () => void;
  hideHelp: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
  onNavigate?: (view: any) => void;
  onOpenAddDocument?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
}

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({
  children,
  onNavigate,
  onOpenAddDocument,
  onOpenSearch,
  onOpenSettings
}) => {
  const [shortcuts, setShortcuts] = useState<Record<string, Shortcut>>({});
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [commandPalette, setCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Default shortcuts
  useEffect(() => {
    const defaultShortcuts: Record<string, Shortcut> = {
      'home': {
        key: 'h',
        description: 'Accueil / Dashboard',
        action: () => onNavigate?.('dashboard'),
        category: 'navigation',
        icon: Home
      },
      'documents': {
        key: 'd',
        description: 'Liste des documents',
        action: () => onNavigate?.('documents'),
        category: 'navigation',
        icon: BookOpen
      },
      'borrowed': {
        key: 'b',
        description: 'Documents empruntés',
        action: () => onNavigate?.('borrowed'),
        category: 'navigation',
        icon: BookOpen
      },
      'borrowers': {
        key: 'u',
        description: 'Gestion des emprunteurs',
        action: () => onNavigate?.('borrowers'),
        category: 'navigation',
        icon: Users
      },
      'add-document': {
        key: 'n',
        description: 'Nouveau document',
        action: () => onOpenAddDocument?.(),
        category: 'actions',
        icon: Plus,
        modifier: 'ctrl'
      },
      'search': {
        key: 'k',
        description: 'Recherche rapide',
        action: () => setCommandPalette(true),
        category: 'search',
        icon: Search,
        modifier: 'ctrl'
      },
      'settings': {
        key: ',',
        description: 'Paramètres',
        action: () => onOpenSettings?.(),
        category: 'general',
        icon: Settings,
        modifier: 'ctrl'
      },
      'help': {
        key: '?',
        description: 'Aide et raccourcis',
        action: () => setShowHelpPanel(true),
        category: 'general',
        icon: Keyboard,
        modifier: 'shift'
      },
      'command-palette': {
        key: 'p',
        description: 'Palette de commandes',
        action: () => setCommandPalette(true),
        category: 'general',
        icon: Command,
        modifier: 'ctrl'
      }
    };

    setShortcuts(defaultShortcuts);
  }, [onNavigate, onOpenAddDocument, onOpenSearch, onOpenSettings]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      setPressedKeys(prev => new Set([...prev, event.key.toLowerCase()]));

      // Check for modifier combinations
      const key = event.key.toLowerCase();
      const hasCtrl = event.ctrlKey || event.metaKey;
      const hasAlt = event.altKey;
      const hasShift = event.shiftKey;

      // Find matching shortcut
      const matchingShortcut = Object.values(shortcuts).find(shortcut => {
        if (shortcut.key !== key) return false;
        
        switch (shortcut.modifier) {
          case 'ctrl':
            return hasCtrl && !hasAlt && !hasShift;
          case 'alt':
            return !hasCtrl && hasAlt && !hasShift;
          case 'shift':
            return !hasCtrl && !hasAlt && hasShift;
          default:
            return !hasCtrl && !hasAlt && !hasShift;
        }
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }

      // ESC to close modals
      if (key === 'escape') {
        setShowHelpPanel(false);
        setCommandPalette(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shortcuts, isEnabled]);

  const registerShortcut = (id: string, shortcut: Shortcut) => {
    setShortcuts(prev => ({ ...prev, [id]: shortcut }));
  };

  const unregisterShortcut = (id: string) => {
    setShortcuts(prev => {
      const newShortcuts = { ...prev };
      delete newShortcuts[id];
      return newShortcuts;
    });
  };

  const showHelp = () => setShowHelpPanel(true);
  const hideHelp = () => setShowHelpPanel(false);

  // Group shortcuts by category
  const groupedShortcuts = Object.values(shortcuts).reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Filtered shortcuts for command palette
  const filteredShortcuts = Object.values(shortcuts).filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.key.includes(searchQuery.toLowerCase())
  );

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    search: 'Recherche',
    general: 'Général'
  };

  const categoryIcons = {
    navigation: Home,
    actions: Zap,
    search: Search,
    general: Command
  };

  return (
    <KeyboardShortcutsContext.Provider value={{
      registerShortcut,
      unregisterShortcut,
      showHelp,
      hideHelp,
      isEnabled,
      setEnabled: setIsEnabled
    }}>
      {children}

      {/* Keyboard Shortcuts Help Panel */}
      {showHelpPanel && (
        <div className="shortcuts-overlay" onClick={() => setShowHelpPanel(false)}>
          <div className="shortcuts-panel" onClick={e => e.stopPropagation()}>
            <div className="shortcuts-header">
              <div className="header-content">
                <Keyboard size={24} />
                <div>
                  <h2>Raccourcis Clavier</h2>
                  <p>Naviguez plus rapidement dans votre bibliothèque</p>
                </div>
              </div>
              <button 
                className="close-button"
                onClick={() => setShowHelpPanel(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="shortcuts-content">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <div key={category} className="shortcuts-category">
                    <div className="category-header">
                      <Icon size={18} />
                      <h3>{categoryLabels[category as keyof typeof categoryLabels]}</h3>
                    </div>
                    <div className="shortcuts-list">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div key={index} className="shortcut-item">
                          {shortcut.icon && <shortcut.icon size={16} />}
                          <span className="shortcut-description">{shortcut.description}</span>
                          <div className="shortcut-keys">
                            {shortcut.modifier && (
                              <kbd className="key-modifier">
                                {shortcut.modifier === 'ctrl' ? '⌘' : shortcut.modifier}
                              </kbd>
                            )}
                            <kbd className="key">{shortcut.key.toUpperCase()}</kbd>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="shortcuts-footer">
              <div className="toggle-section">
                <button
                  className={`toggle-button ${isEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => setIsEnabled(!isEnabled)}
                >
                  {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  {isEnabled ? 'Raccourcis activés' : 'Raccourcis désactivés'}
                </button>
              </div>
              <p className="shortcuts-tip">
                💡 Astuce: Utilisez <kbd>Ctrl</kbd> + <kbd>K</kbd> pour la palette de commandes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      {commandPalette && (
        <div className="command-palette-overlay" onClick={() => setCommandPalette(false)}>
          <div className="command-palette" onClick={e => e.stopPropagation()}>
            <div className="command-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tapez une commande ou recherchez..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd className="escape-hint">ESC</kbd>
            </div>
            
            <div className="command-results">
              {filteredShortcuts.length > 0 ? (
                filteredShortcuts.map((shortcut, index) => (
                  <button
                    key={index}
                    className="command-item"
                    onClick={() => {
                      shortcut.action();
                      setCommandPalette(false);
                      setSearchQuery('');
                    }}
                  >
                    {shortcut.icon && <shortcut.icon size={18} />}
                    <span className="command-description">{shortcut.description}</span>
                    <div className="command-keys">
                      {shortcut.modifier && (
                        <kbd className="key-modifier">
                          {shortcut.modifier === 'ctrl' ? '⌘' : shortcut.modifier}
                        </kbd>
                      )}
                      <kbd className="key">{shortcut.key.toUpperCase()}</kbd>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-results">
                  <Search size={32} />
                  <p>Aucune commande trouvée pour "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Shortcuts Help Panel */
        .shortcuts-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .shortcuts-panel {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .shortcuts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: white;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-content h2 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 10px;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
          z-index: 1001;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .shortcuts-content {
          padding: 32px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .shortcuts-category {
          margin-bottom: 32px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #374151;
        }

        .category-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .shortcuts-list {
          display: grid;
          gap: 12px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(248, 246, 240, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(229, 220, 194, 0.4);
        }

        .shortcut-description {
          flex: 1;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .shortcut-keys {
          display: flex;
          gap: 4px;
        }

        .key, .key-modifier {
          background: #374151;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          font-family: monospace;
          min-width: 24px;
          text-align: center;
        }

        .key-modifier {
          background: #6B7280;
        }

        .shortcuts-footer {
          padding: 24px 32px;
          background: rgba(248, 246, 240, 0.4);
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .toggle-button.enabled {
          background: #10B981;
          color: white;
        }

        .toggle-button.disabled {
          background: #EF4444;
          color: white;
        }

        .shortcuts-tip {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
        }

        /* Command Palette */
        .command-palette-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 10001;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
          animation: fadeIn 0.2s ease;
        }

        .command-palette {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .command-search {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
        }

        .command-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #374151;
          background: transparent;
        }

        .command-search input::placeholder {
          color: #9CA3AF;
        }

        .escape-hint {
          background: #F3F4F6;
          color: #6B7280;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .command-results {
          max-height: 400px;
          overflow-y: auto;
        }

        .command-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px 20px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease;
          border-bottom: 1px solid rgba(229, 220, 194, 0.2);
        }

        .command-item:hover {
          background: rgba(62, 92, 73, 0.05);
        }

        .command-item:last-child {
          border-bottom: none;
        }

        .command-description {
          flex: 1;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .command-keys {
          display: flex;
          gap: 4px;
        }

        .no-results {
          padding: 40px 20px;
          text-align: center;
          color: #9CA3AF;
        }

        .no-results p {
          margin: 12px 0 0 0;
          font-size: 14px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(32px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .shortcuts-panel {
            margin: 10px;
            max-height: calc(100vh - 20px);
          }

          .shortcuts-header {
            padding: 20px;
          }

          .shortcuts-content {
            padding: 20px;
          }

          .shortcuts-footer {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .command-palette-overlay {
            padding-top: 60px;
            padding-left: 10px;
            padding-right: 10px;
          }

          .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .shortcut-keys {
            align-self: flex-end;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .shortcuts-panel,
          .command-palette {
            border: 2px solid #000;
          }

          .shortcut-item,
          .command-item {
            border: 1px solid #ccc;
          }

          .key, .key-modifier {
            border: 1px solid #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .shortcuts-overlay,
          .command-palette-overlay,
          .shortcuts-panel,
          .command-palette,
          .shortcut-item,
          .command-item,
          .toggle-button {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </KeyboardShortcutsContext.Provider>
  );
};