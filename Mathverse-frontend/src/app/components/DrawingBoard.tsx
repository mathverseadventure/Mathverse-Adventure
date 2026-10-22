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
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={`bg-white rounded-2xl border-2 border-indigo-200 p-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setTool("pen")}
          className={`p-2 rounded-xl border-2 ${tool === "pen" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
          title="Lápiz"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setTool("eraser")}
          className={`p-2 rounded-xl border-2 ${tool === "eraser" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
          title="Borrador"
        >
          <Eraser className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={clearCanvas}
          className="p-2 rounded-xl border-2 border-gray-200"
          title="Limpiar"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            onClick={() => setLineWidth((w) => Math.max(2, w - 1))}
            className="p-1 rounded-lg border border-gray-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold w-8 text-center">{lineWidth}px</span>
          <button
            type="button"
            onClick={() => setLineWidth((w) => Math.min(20, w + 1))}
            className="p-1 rounded-lg border border-gray-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1 ml-auto">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
              className={`w-7 h-7 rounded-full border-2 ${color === c && tool === "pen" ? "border-gray-800 scale-110" : "border-white"}`}
              style={{ backgroundColor: c }}
              title="Color"
            />
          ))}
        </div>
      </div>
      <div className="w-full touch-none">
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl border border-gray-200 cursor-crosshair bg-white"
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
