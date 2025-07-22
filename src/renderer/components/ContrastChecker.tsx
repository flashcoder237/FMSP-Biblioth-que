import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Settings, Palette } from 'lucide-react';

interface ContrastIssue {
  element: HTMLElement;
  foregroundColor: string;
  backgroundColor: string;
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
  selector: string;
  text: string;
}

interface ContrastCheckerProps {
  autoFix?: boolean;
  showPanel?: boolean;
  onIssuesFound?: (issues: ContrastIssue[]) => void;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({
  autoFix = false,
  showPanel = false,
  onIssuesFound
}) => {
  const [issues, setIssues] = useState<ContrastIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(showPanel);
  const [fixedCount, setFixedCount] = useState(0);

  // Function to get computed styles
  const getComputedColor = (element: HTMLElement, property: 'color' | 'backgroundColor'): string => {
    const style = window.getComputedStyle(element);
    return style.getPropertyValue(property);
  };

  // Convert RGB to relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Parse RGB color string
  const parseRGB = (color: string): [number, number, number] | null => {
    const match = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*[\\d.]+)?\\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }

    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      } else if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }

    // Handle named colors - basic set
    const namedColors: { [key: string]: [number, number, number] } = {
      'white': [255, 255, 255],
      'black': [0, 0, 0],
      'red': [255, 0, 0],
      'green': [0, 128, 0],
      'blue': [0, 0, 255],
      'transparent': [255, 255, 255], // Treat as white for calculation
    };

    if (namedColors[color]) {
      return namedColors[color];
    }

    return null;
  };

  // Calculate contrast ratio
  const getContrastRatio = (foreground: string, background: string): number => {
    const fg = parseRGB(foreground);
    const bg = parseRGB(background);

    if (!fg || !bg) return 1; // Default to failing ratio

    const l1 = getLuminance(fg[0], fg[1], fg[2]);
    const l2 = getLuminance(bg[0], bg[1], bg[2]);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  // Get the effective background color by walking up the DOM tree
  const getEffectiveBackgroundColor = (element: HTMLElement): string => {
    let current: HTMLElement | null = element;
    
    while (current) {
      const bgColor = getComputedColor(current, 'backgroundColor');
      const rgb = parseRGB(bgColor);
      
      // If we found a non-transparent background
      if (rgb && !(rgb[0] === 0 && rgb[1] === 0 && rgb[2] === 0) && !bgColor.includes('transparent')) {
        return bgColor;
      }
      
      current = current.parentElement;
    }
    
    return 'rgb(255, 255, 255)'; // Default to white
  };

  // Generate CSS selector for an element
  const generateSelector = (element: HTMLElement): string => {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }
    
    return element.tagName.toLowerCase();
  };

  // Fix contrast issues automatically
  const fixContrastIssue = (issue: ContrastIssue): void => {
    const element = issue.element;
    
    // Try to fix by adjusting text color
    if (issue.ratio < 4.5) {
      const bg = parseRGB(issue.backgroundColor);
      if (bg) {
        const luminance = getLuminance(bg[0], bg[1], bg[2]);
        // If background is dark, use light text; if light, use dark text
        const newColor = luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
        element.style.color = newColor;
        
        // Verify the fix worked
        const newRatio = getContrastRatio(newColor, issue.backgroundColor);
        if (newRatio >= 4.5) {
          setFixedCount(prev => prev + 1);
        }
      }
    }
  };

  // Scan the DOM for contrast issues
  const scanForContrastIssues = (): void => {
    setIsScanning(true);
    const foundIssues: ContrastIssue[] = [];
    
    // Get all text-containing elements
    const textElements = document.querySelectorAll('*:not(script):not(style)');
    
    textElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if element has no text content or is hidden
      if (!htmlElement.textContent?.trim() || 
          htmlElement.offsetParent === null ||
          window.getComputedStyle(htmlElement).display === 'none') {
        return;
      }

      // Skip if text is too short to be meaningful
      if (htmlElement.textContent.trim().length < 3) {
        return;
      }

      const foregroundColor = getComputedColor(htmlElement, 'color');
      const backgroundColor = getEffectiveBackgroundColor(htmlElement);
      
      const ratio = getContrastRatio(foregroundColor, backgroundColor);
      
      // WCAG standards: AA requires 4.5:1, AAA requires 7:1
      let level: 'AA' | 'AAA' | 'fail';
      if (ratio >= 7) {
        level = 'AAA';
      } else if (ratio >= 4.5) {
        level = 'AA';
      } else {
        level = 'fail';
      }

      // Only report issues that fail AA standards
      if (level === 'fail') {
        foundIssues.push({
          element: htmlElement,
          foregroundColor,
          backgroundColor,
          ratio: Math.round(ratio * 100) / 100,
          level,
          selector: generateSelector(htmlElement),
          text: htmlElement.textContent.trim().substring(0, 100)
        });
      }
    });

    setIssues(foundIssues);
    setIsScanning(false);
    
    if (onIssuesFound) {
      onIssuesFound(foundIssues);
    }

    // Auto-fix if enabled
    if (autoFix) {
      foundIssues.forEach(fixContrastIssue);
    }
  };

  // Auto-scan on mount
  useEffect(() => {
    // Wait for DOM to be fully loaded
    const timer = setTimeout(() => {
      scanForContrastIssues();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Re-scan when DOM changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Debounce the scanning
      const timer = setTimeout(() => {
        scanForContrastIssues();
      }, 2000);

      return () => clearTimeout(timer);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, []);

  const scrollToElement = (issue: ContrastIssue) => {
    issue.element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Highlight the element temporarily
    const originalOutline = issue.element.style.outline;
    issue.element.style.outline = '3px solid #DC2626';
    issue.element.style.outlineOffset = '2px';
    
    setTimeout(() => {
      issue.element.style.outline = originalOutline;
      issue.element.style.outlineOffset = '';
    }, 3000);
  };

  const getIssueIcon = (level: string) => {
    switch (level) {
      case 'fail':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'AA':
        return <CheckCircle size={16} className="text-yellow-500" />;
      case 'AAA':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  return (
    <>
      {/* Floating Control Button */}
      <button
        className="contrast-checker-toggle"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        title="Vérificateur de contraste"
      >
        <Eye size={20} />
        {issues.length > 0 && (
          <span className="issue-badge">{issues.length}</span>
        )}
      </button>

      {/* Contrast Issues Panel */}
      {isPanelOpen && (
        <div className="contrast-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Palette size={18} />
              <span>Contraste & Accessibilité</span>
            </div>
            <button
              className="close-button"
              onClick={() => setIsPanelOpen(false)}
            >
              <EyeOff size={18} />
            </button>
          </div>

          <div className="panel-content">
            <div className="stats-row">
              <div className="stat">
                <span className="stat-value">{issues.length}</span>
                <span className="stat-label">Problèmes détectés</span>
              </div>
              <div className="stat">
                <span className="stat-value">{fixedCount}</span>
                <span className="stat-label">Corrigés automatiquement</span>
              </div>
            </div>

            <div className="actions-row">
              <button
                className="action-button primary"
                onClick={scanForContrastIssues}
                disabled={isScanning}
              >
                {isScanning ? 'Analyse...' : 'Ré-analyser'}
              </button>
              <button
                className="action-button secondary"
                onClick={() => issues.forEach(fixContrastIssue)}
                disabled={issues.length === 0}
              >
                Corriger tout
              </button>
            </div>

            {issues.length === 0 ? (
              <div className="no-issues">
                <CheckCircle size={48} className="success-icon" />
                <h3>Excellent !</h3>
                <p>Aucun problème de contraste détecté. Votre interface est accessible !</p>
              </div>
            ) : (
              <div className="issues-list">
                <h4>Problèmes de contraste :</h4>
                {issues.map((issue, index) => (
                  <div key={index} className="issue-item">
                    <div className="issue-header">
                      {getIssueIcon(issue.level)}
                      <span className="issue-ratio">
                        Ratio: {issue.ratio}:1
                      </span>
                      <button
                        className="locate-button"
                        onClick={() => scrollToElement(issue)}
                        title="Localiser l'élément"
                      >
                        Localiser
                      </button>
                    </div>
                    <div className="issue-details">
                      <div className="issue-selector">{issue.selector}</div>
                      <div className="issue-text">"{issue.text}"</div>
                      <div className="color-info">
                        <span 
                          className="color-sample" 
                          style={{ backgroundColor: issue.backgroundColor }}
                        ></span>
                        <span 
                          className="color-sample" 
                          style={{ backgroundColor: issue.foregroundColor }}
                        ></span>
                      </div>
                    </div>
                    <button
                      className="fix-button"
                      onClick={() => fixContrastIssue(issue)}
                    >
                      Corriger
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .contrast-checker-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          background: #3E5C49;
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .contrast-checker-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(62, 92, 73, 0.4);
        }

        .issue-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #DC2626;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          text-align: center;
        }

        .contrast-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 400px;
          max-height: 80vh;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          z-index: 10001;
          overflow: hidden;
          border: 1px solid rgba(229, 220, 194, 0.4);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: white;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .panel-content {
          padding: 20px;
          max-height: calc(80vh - 80px);
          overflow-y: auto;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat {
          text-align: center;
          padding: 16px;
          background: rgba(248, 246, 240, 0.8);
          border-radius: 12px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #3E5C49;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6B7280;
        }

        .actions-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .action-button {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.primary {
          background: #3E5C49;
          color: white;
        }

        .action-button.primary:hover:not(:disabled) {
          background: #2E453A;
        }

        .action-button.secondary {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .action-button.secondary:hover:not(:disabled) {
          background: rgba(62, 92, 73, 0.2);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-issues {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          color: #10B981;
          margin-bottom: 16px;
        }

        .no-issues h3 {
          margin: 0 0 8px 0;
          color: #1F2937;
        }

        .no-issues p {
          margin: 0;
          color: #6B7280;
          font-size: 14px;
        }

        .issues-list h4 {
          margin: 0 0 16px 0;
          color: #1F2937;
          font-size: 16px;
        }

        .issue-item {
          background: rgba(248, 246, 240, 0.6);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border-left: 4px solid #DC2626;
        }

        .issue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .issue-ratio {
          font-weight: 600;
          color: #DC2626;
          font-size: 14px;
        }

        .locate-button {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid #3B82F6;
          color: #3B82F6;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .locate-button:hover {
          background: #3B82F6;
          color: white;
        }

        .issue-details {
          margin-bottom: 12px;
        }

        .issue-selector {
          font-family: monospace;
          font-size: 12px;
          color: #6B7280;
          margin-bottom: 4px;
        }

        .issue-text {
          font-size: 13px;
          color: #374151;
          margin-bottom: 8px;
          max-height: 40px;
          overflow: hidden;
        }

        .color-info {
          display: flex;
          gap: 8px;
        }

        .color-sample {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid #E5E7EB;
        }

        .fix-button {
          background: #10B981;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .fix-button:hover {
          background: #059669;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contrast-panel {
            top: 10px;
            right: 10px;
            left: 10px;
            width: auto;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .actions-row {
            flex-direction: column;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .contrast-panel {
            border: 2px solid #000;
          }

          .issue-item {
            border: 1px solid #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .contrast-checker-toggle,
          .action-button,
          .locate-button,
          .fix-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};