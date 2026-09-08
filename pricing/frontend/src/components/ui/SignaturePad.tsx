import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, PenTool } from 'lucide-react';

export interface Point {
  x: number;
  y: number;
}

export interface SignaturePadProps {
  onSignatureChange?: (svgString: string) => void;
  height?: number;
  width?: number;
  strokeColor?: string;
  strokeWidth?: number;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  dateStr?: string;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  height = 220,
  width = 640,
  strokeColor = '#183d89',
  strokeWidth = 3,
  placeholder = 'Zde se podepište...',
  title = 'Za Partnera (Podpis)',
  subtitle,
  location,
  dateStr,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [strokeColor, strokeWidth]);

  const getCanvasCoordinates = (e: any): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    const coord = getCanvasCoordinates(e);
    if (!coord) return;

    setIsDrawing(true);
    setCurrentStroke([coord]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(coord.x, coord.y);
      }
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coord = getCanvasCoordinates(e);
    if (!coord) return;

    setCurrentStroke(prev => [...prev, coord]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      const newStrokes = [...strokes, currentStroke];
      setStrokes(newStrokes);
      notifyParent(newStrokes);
    }
    setCurrentStroke([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
    onSignatureChange?.('');
  };

  const notifyParent = (allStrokes: Point[][]) => {
    if (allStrokes.length === 0) {
      onSignatureChange?.('');
      return;
    }
    const paths = allStrokes.map(stroke => {
      if (stroke.length === 0) return '';
      const dAttr = stroke.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      return `<path d="${dAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
    }).join('');

    const svgString = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${paths}</svg>`;
    onSignatureChange?.(svgString);
  };

  return (
    <div className={`flex flex-col justify-between p-1 select-none ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {title && <span className="text-[10px] text-black/50 uppercase font-semibold block tracking-wider">{title}</span>}
          {subtitle && <span className="text-xs font-bold text-black block mt-0.5">{subtitle}</span>}
        </div>
        {strokes.length > 0 && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[11px] text-[#183d89] hover:underline font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Smazat
          </button>
        )}
      </div>

      {(location !== undefined || dateStr !== undefined) && (
        <div className="text-[10px] text-black/60 font-mono my-1 bg-stone-100 py-0.5 px-2 rounded-lg border border-black/5 select-none">
          V {location?.trim() || '__________'} dne: {dateStr || new Date().toLocaleDateString('cs-CZ')}
        </div>
      )}

      {/* Drawing Area Canvas */}
      <div className="relative h-28 bg-white border border-black/15 rounded-xl overflow-hidden cursor-crosshair shadow-2xs">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block bg-white touch-none"
        />
        {strokes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-black/35 pointer-events-none select-none">
            <PenTool className="w-3.5 h-3.5 text-[#183d89]/50 mr-1.5" />
            <span>{placeholder}</span>
          </div>
        )}
      </div>
    </div>
  );
};
