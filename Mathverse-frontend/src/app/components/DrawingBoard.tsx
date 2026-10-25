import { useRef, useState, useEffect } from "react";
import { Pencil, Eraser, Trash2, Minus, Plus } from "lucide-react";

const COLORS = [
  "#111827",
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#ca8a04",
  "#9333ea",
  "#ea580c",
];

interface DrawingBoardProps {
  className?: string;
  height?: number;
}

export function DrawingBoard({ className = "", height = 320 }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const ratio = window.devicePixelRatio || 1;
      const width = parent.clientWidth;

      // Dimensiones de píxeles reales del canvas
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Limpiar completamente el canvas a nivel de búfer de píxeles
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Aplicar transformación para pantallas retina/HiDPI
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [height]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 3 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  /**
   * Limpieza total y segura del Tablero (Canvas):
   * 1. Resetea la matriz de transformación a escala 1:1 para abarcar todas las dimensiones reales (canvas.width, canvas.height).
   * 2. Ejecuta clearRect() en todo el canvas para eliminar los píxeles dibujados.
   * 3. Rellena con fondo blanco limpio.
   * 4. Llama a ctx.beginPath() para reiniciar los trazos y prevenir "fantasmas" o conexiones indeseadas con dibujos anteriores.
   */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Resetear cualquier trazo activo
    ctx.beginPath();

    // 2. Guardar el estado de contexto actual
    ctx.save();

    // 3. Resetear transformación a escala 1:1 absoluta
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 4. Limpiar completamente todos los píxeles del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 5. Rellenar de blanco uniforme
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 6. Restaurar la transformación escalada previa (devicePixelRatio)
    ctx.restore();

    // 7. Reiniciar trazo vacío para evitar que se redibujen trazos anteriores
    ctx.beginPath();
    setIsDrawing(false);
  };

  return (
    <div className={`bg-white rounded-2xl border-2 border-indigo-200 p-3 sm:p-4 shadow-sm ${className}`}>
      {/* Barra de herramientas del Tablero */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Botón Lápiz (min 44x44px) */}
        <button
          type="button"
          onClick={() => setTool("pen")}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            tool === "pen"
              ? "border-indigo-600 bg-indigo-100 text-indigo-700 shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
          title="Lápiz de dibujo"
        >
          <Pencil className="w-5 h-5" />
        </button>

        {/* Botón Borrador (min 44x44px) */}
        <button
          type="button"
          onClick={() => setTool("eraser")}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            tool === "eraser"
              ? "border-indigo-600 bg-indigo-100 text-indigo-700 shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
          title="Borrador suave"
        >
          <Eraser className="w-5 h-5" />
        </button>

        {/* Botón Caneca: Limpiar Tablero Completo (min 44x44px) */}
        <button
          type="button"
          onClick={clearCanvas}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Limpiar Tablero por completo"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Control de grosor del trazo */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 ml-1">
          <button
            type="button"
            onClick={() => setLineWidth((w) => Math.max(2, w - 1))}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 cursor-pointer"
            title="Reducir grosor"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black w-8 text-center text-gray-700">{lineWidth}px</span>
          <button
            type="button"
            onClick={() => setLineWidth((w) => Math.min(20, w + 1))}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 cursor-pointer"
            title="Aumentar grosor"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Paleta de colores táctil */}
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full border-2 transition-transform cursor-pointer ${
                color === c && tool === "pen"
                  ? "border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-300"
                  : "border-white hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              title={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Área del lienzo interactivo */}
      <div className="w-full touch-none relative rounded-xl overflow-hidden border-2 border-indigo-100">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair bg-white block"
          style={{ height }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  );
}
