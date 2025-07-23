import React, { useRef, useEffect, useState } from 'react';
import { Book, RotateCcw, ZoomIn, ZoomOut, Move3d, Eye, Layers } from 'lucide-react';

interface Document3DViewProps {
  document: {
    titre: string;
    auteur: string;
    couverture?: string;
    descripteurs: string;
    annee?: number;
    pages?: number;
    couleur?: string;
  };
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
}

export const Document3DView: React.FC<Document3DViewProps> = ({ 
  document, 
  className = '',
  interactive = true,
  autoRotate = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotation, setRotation] = useState({ x: -15, y: 25, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'document' | 'wireframe' | 'exploded'>('document');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const render = () => {
      drawDocument3D(ctx, canvas.offsetWidth, canvas.offsetHeight);
      if (autoRotate && !isDragging) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    setIsLoaded(true);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, zoom, viewMode, isDragging, autoRotate]);

  const drawDocument3D = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Document dimensions
    const documentWidth = 80 * zoom;
    const documentHeight = 120 * zoom;
    const documentDepth = 12 * zoom;
    
    // Convert rotation to radians
    const rx = (rotation.x * Math.PI) / 180;
    const ry = (rotation.y * Math.PI) / 180;
    const rz = (rotation.z * Math.PI) / 180;
    
    // 3D transformation functions
    const rotateX = (x: number, y: number, z: number) => [
      x,
      y * Math.cos(rx) - z * Math.sin(rx),
      y * Math.sin(rx) + z * Math.cos(rx)
    ];
    
    const rotateY = (x: number, y: number, z: number) => [
      x * Math.cos(ry) + z * Math.sin(ry),
      y,
      -x * Math.sin(ry) + z * Math.cos(ry)
    ];
    
    const project = (x: number, y: number, z: number) => {
      const rotatedX = rotateX(x, y, z);
      const [x1, y1, z1] = rotateY(rotatedX[0], rotatedX[1], rotatedX[2]);
      const distance = 400;
      const scale = distance / (distance + z1);
      return [
        centerX + x1 * scale,
        centerY - y1 * scale,
        z1
      ];
    };

    // Define document vertices
    const vertices = [
      // Front face
      [-documentWidth/2, -documentHeight/2, documentDepth/2],
      [documentWidth/2, -documentHeight/2, documentDepth/2],
      [documentWidth/2, documentHeight/2, documentDepth/2],
      [-documentWidth/2, documentHeight/2, documentDepth/2],
      // Back face
      [-documentWidth/2, -documentHeight/2, -documentDepth/2],
      [documentWidth/2, -documentHeight/2, -documentDepth/2],
      [documentWidth/2, documentHeight/2, -documentDepth/2],
      [-documentWidth/2, documentHeight/2, -documentDepth/2]
    ];

    // Project all vertices
    const projectedVertices = vertices.map(([x, y, z]) => project(x, y, z));

    // Define faces (quads)
    const faces = [
      { vertices: [0, 1, 2, 3], color: getDocumentColor('front'), name: 'front' },
      { vertices: [5, 4, 7, 6], color: getDocumentColor('back'), name: 'back' },
      { vertices: [4, 0, 3, 7], color: getDocumentColor('spine'), name: 'spine' },
      { vertices: [1, 5, 6, 2], color: getDocumentColor('edge'), name: 'edge' },
      { vertices: [4, 5, 1, 0], color: getDocumentColor('top'), name: 'top' },
      { vertices: [3, 2, 6, 7], color: getDocumentColor('bottom'), name: 'bottom' }
    ];

    // Sort faces by z-depth (painter's algorithm)
    const sortedFaces = faces.map(face => ({
      ...face,
      avgZ: face.vertices.reduce((sum, idx) => sum + projectedVertices[idx][2], 0) / 4
    })).sort((a, b) => a.avgZ - b.avgZ);

    // Draw faces
    sortedFaces.forEach(face => {
      if (viewMode === 'wireframe') {
        drawWireframeFace(ctx, face, projectedVertices);
      } else {
        drawSolidFace(ctx, face, projectedVertices);
      }
    });

    // Draw document details if close enough
    if (zoom > 0.8) {
      drawDocumentDetails(ctx, projectedVertices, sortedFaces);
    }

    // Draw exploded view if selected
    if (viewMode === 'exploded') {
      drawExplodedView(ctx, projectedVertices);
    }
  };

  const getDocumentColor = (face: string): string => {
    const baseColor = document.couleur || '#3E5C49';
    
    switch (face) {
      case 'front':
        return baseColor;
      case 'back':
        return adjustBrightness(baseColor, -20);
      case 'spine':
        return adjustBrightness(baseColor, -40);
      case 'edge':
        return '#F3EED9';
      case 'top':
      case 'bottom':
        return adjustBrightness(baseColor, -30);
      default:
        return baseColor;
    }
  };

  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const drawSolidFace = (
    ctx: CanvasRenderingContext2D, 
    face: any, 
    vertices: number[][]
  ) => {
    ctx.beginPath();
    const [x0, y0] = vertices[face.vertices[0]];
    ctx.moveTo(x0, y0);
    
    face.vertices.forEach((vertexIdx: number, i: number) => {
      if (i > 0) {
        const [x, y] = vertices[vertexIdx];
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    
    // Create gradient based on face orientation
    const gradient = ctx.createLinearGradient(
      vertices[face.vertices[0]][0],
      vertices[face.vertices[0]][1],
      vertices[face.vertices[2]][0],
      vertices[face.vertices[2]][1]
    );
    
    gradient.addColorStop(0, face.color);
    gradient.addColorStop(1, adjustBrightness(face.color, -15));
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add subtle border
    ctx.strokeStyle = adjustBrightness(face.color, -40);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  const drawWireframeFace = (
    ctx: CanvasRenderingContext2D, 
    face: any, 
    vertices: number[][]
  ) => {
    ctx.beginPath();
    const [x0, y0] = vertices[face.vertices[0]];
    ctx.moveTo(x0, y0);
    
    face.vertices.forEach((vertexIdx: number) => {
      const [x, y] = vertices[vertexIdx];
      ctx.lineTo(x, y);
    });
    
    ctx.closePath();
    ctx.strokeStyle = '#3E5C49';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawDocumentDetails = (
    ctx: CanvasRenderingContext2D, 
    vertices: number[][],
    faces: any[]
  ) => {
    // Find front face
    const frontFace = faces.find(f => f.name === 'front');
    if (!frontFace || frontFace.avgZ < 0) return;

    const frontVertices = frontFace.vertices.map((idx: number) => vertices[idx]);
    const [x1, y1] = frontVertices[0];
    const [x2, y2] = frontVertices[2];
    
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    
    if (width < 60 || height < 80) return;

    // Draw title
    ctx.save();
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    
    // Wrap text
    const maxWidth = width * 0.8;
    const words = document.titre.split(' ');
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Draw title lines
    lines.forEach((line, i) => {
      ctx.fillText(line, centerX, centerY - 20 + (i * 16));
    });
    
    // Draw author
    ctx.font = '10px Arial';
    ctx.fillText(document.auteur, centerX, centerY + 30);
    
    ctx.restore();
  };

  const drawExplodedView = (ctx: CanvasRenderingContext2D, vertices: number[][]) => {
    // Draw connecting lines for exploded view
    ctx.strokeStyle = 'rgba(62, 92, 73, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Connect corresponding vertices
    for (let i = 0; i < 4; i++) {
      const [x1, y1] = vertices[i];
      const [x2, y2] = vertices[i + 4];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      ...prev,
      y: prev.y + deltaX * 0.5,
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5))
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setRotation({ x: -15, y: 25, z: 0 });
    setZoom(1);
  };

  return (
    <div className={`document-3d-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="document-3d-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {interactive && (
        <div className="document-3d-controls">
          <div className="control-group">
            <button
              className="control-button"
              onClick={resetView}
              title="Réinitialiser la vue"
            >
              <RotateCcw size={16} />
            </button>
            
            <button
              className="control-button"
              onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
              title="Zoom avant"
            >
              <ZoomIn size={16} />
            </button>
            
            <button
              className="control-button"
              onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
              title="Zoom arrière"
            >
              <ZoomOut size={16} />
            </button>
          </div>
          
          <div className="control-group">
            <button
              className={`control-button ${viewMode === 'document' ? 'active' : ''}`}
              onClick={() => setViewMode('document')}
              title="Vue normale"
            >
              <Book size={16} />
            </button>
            
            <button
              className={`control-button ${viewMode === 'wireframe' ? 'active' : ''}`}
              onClick={() => setViewMode('wireframe')}
              title="Vue filaire"
            >
              <Layers size={16} />
            </button>
            
            <button
              className={`control-button ${viewMode === 'exploded' ? 'active' : ''}`}
              onClick={() => setViewMode('exploded')}
              title="Vue éclatée"
            >
              <Move3d size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .document-3d-container {
          position: relative;
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #F8F6F0 0%, #E8E4D8 100%);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(229, 220, 194, 0.4);
        }

        .document-3d-canvas {
          width: 100%;
          height: 100%;
          cursor: ${interactive ? (isDragging ? 'grabbing' : 'grab') : 'default'};
          transition: opacity 0.3s ease;
          opacity: ${isLoaded ? 1 : 0};
        }

        .document-3d-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .control-button {
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          transition: all 0.2s ease;
        }

        .control-button:hover {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .control-button.active {
          background: #3E5C49;
          color: white;
        }

        .control-button:active {
          transform: scale(0.95);
        }

        /* Loading state */
        .document-3d-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid rgba(62, 92, 73, 0.2);
          border-top: 3px solid #3E5C49;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          opacity: ${isLoaded ? 0 : 1};
          transition: opacity 0.3s ease;
        }

        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .document-3d-container {
            height: 250px;
          }

          .document-3d-controls {
            top: 8px;
            right: 8px;
          }

          .control-group {
            padding: 4px;
          }

          .control-button {
            width: 28px;
            height: 28px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .control-group {
            background: white;
            border: 1px solid #000;
          }

          .control-button {
            border: 1px solid #ccc;
          }

          .control-button.active {
            border-color: #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .document-3d-canvas,
          .control-button {
            transition: none;
          }

          .document-3d-container::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};