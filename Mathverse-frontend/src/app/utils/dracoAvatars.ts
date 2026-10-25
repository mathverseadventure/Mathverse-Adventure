import {
  Compass,
  Wand2,
  Shield,
  Gem,
  Flame,
  type LucideIcon,
} from "lucide-react";

// Importación directa de las imágenes con transparencia optimizada
import dracoExploradorPng from "@/assets/images/avatares/draco-explorador.png";
import dracoMagoPng from "@/assets/images/avatares/draco-mago.png";
import dracoGuerreroPng from "@/assets/images/avatares/draco-guerrero.png";
import dracoHechiceroPng from "@/assets/images/avatares/draco-hechicero.png";
import dracoDefaultPng from "@/assets/images/draco.png";

export interface DracoOutfit {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  image: string;
  fallbackImage: string;
  pngPath: string; // Ruta pública: /assets/avatares/draco-[id].png
  colors: {
    bgGradient: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    accent: string;
  };
}

export const DRACO_OUTFITS: DracoOutfit[] = [
  {
    id: "original",
    name: "Draco Original",
    subtitle: "El dragón clásico",
    description:
      "¡El fiel dragón original de MathVerse sin ningún traje especial! Siempre disponible para acompañarte en tu viaje matemático.",
    cost: 0, // Siempre desbloqueado y gratuito
    icon: Flame,
    image: dracoDefaultPng,
    fallbackImage: "/assets/avatares/draco-default.png",
    pngPath: "/assets/avatares/draco-default.png",
    colors: {
      bgGradient: "from-amber-400 via-orange-500 to-red-500",
      cardBorder: "border-orange-300",
      badgeBg: "bg-orange-500",
      badgeText: "text-orange-100",
      glow: "rgba(249, 115, 22, 0.45)",
      accent: "#f97316",
    },
  },
  {
    id: "explorador",
    name: "Draco Explorador",
    subtitle: "Rumbo a la aventura",
    description:
      "¡Equipado con sombrero de safari, mochila, mapa, lupa y brújula dorada para explorar los misterios de las matemáticas!",
    cost: 500,
    icon: Compass,
    image: dracoExploradorPng,
    fallbackImage: "/assets/avatares/draco-explorador.png",
    pngPath: "/assets/avatares/draco-explorador.png",
    colors: {
      bgGradient: "from-emerald-400 via-teal-500 to-green-600",
      cardBorder: "border-emerald-300",
      badgeBg: "bg-emerald-600",
      badgeText: "text-emerald-100",
      glow: "rgba(16, 185, 129, 0.45)",
      accent: "#10b981",
    },
  },
  {
    id: "mago",
    name: "Draco Mago",
    subtitle: "Encantador de números",
    description:
      "¡Con sombrero azul estrellado, túnica mágica y báculo con gema resplandeciente para dominar hechizos numéricos!",
    cost: 1000,
    icon: Wand2,
    image: dracoMagoPng,
    fallbackImage: "/assets/avatares/draco-mago.png",
    pngPath: "/assets/avatares/draco-mago.png",
    colors: {
      bgGradient: "from-purple-500 via-indigo-600 to-blue-600",
      cardBorder: "border-purple-300",
      badgeBg: "bg-purple-600",
      badgeText: "text-purple-100",
      glow: "rgba(139, 92, 246, 0.45)",
      accent: "#8b5cf6",
    },
  },
  {
    id: "guerrero",
    name: "Draco Guerrero",
    subtitle: "Defensor del reino",
    description:
      "¡Armado con armadura reluciente, yelmo con visera, espada noble y escudo con el emblema del dragón para superar batallas duras!",
    cost: 2000,
    icon: Shield,
    image: dracoGuerreroPng,
    fallbackImage: "/assets/avatares/draco-guerrero.png",
    pngPath: "/assets/avatares/draco-guerrero.png",
    colors: {
      bgGradient: "from-red-500 via-rose-600 to-amber-600",
      cardBorder: "border-red-300",
      badgeBg: "bg-red-600",
      badgeText: "text-red-100",
      glow: "rgba(239, 68, 68, 0.45)",
      accent: "#ef4444",
    },
  },
  {
    id: "hechicero",
    name: "Draco Hechicero",
    subtitle: "Poder arcano",
    description:
      "¡Envuelto en capucha mística violeta con el orbe de cristal cósmico para descifrar las fórmulas más legendarias!",
    cost: 3500,
    icon: Gem,
    image: dracoHechiceroPng,
    fallbackImage: "/assets/avatares/draco-hechicero.png",
    pngPath: "/assets/avatares/draco-hechicero.png",
    colors: {
      bgGradient: "from-pink-500 via-purple-600 to-fuchsia-700",
      cardBorder: "border-pink-300",
      badgeBg: "bg-pink-600",
      badgeText: "text-pink-100",
      glow: "rgba(236, 72, 153, 0.45)",
      accent: "#ec4899",
    },
  },
];

// Opciones disponibles en la tienda (incluye Draco Original como opción gratuita y los 4 trajes temáticos)
export const DRACO_SHOP_ITEMS = DRACO_OUTFITS;

/**
 * Normaliza identificadores de atuendos, soportando Draco Original por defecto
 */
export function normalizeOutfitId(outfitId?: string | null): string {
  if (!outfitId) return "original";
  const id = outfitId.toLowerCase().trim();
  if (id === "default" || id === "original" || id === "clasico") return "original";
  if (id === "wizard") return "mago";
  if (id === "superhero" || id === "knight") return "guerrero";
  if (id === "sorcerer") return "hechicero";
  if (id === "explorer") return "explorador";
  if (DRACO_OUTFITS.some((o) => o.id === id)) return id;
  return "original";
}

/**
 * Obtiene la definición completa del atuendo de Draco
 */
export function getDracoOutfit(outfitId?: string | null): DracoOutfit {
  const normalized = normalizeOutfitId(outfitId);
  return DRACO_OUTFITS.find((o) => o.id === normalized) || DRACO_OUTFITS[0];
}

/**
 * Retorna la URL de la imagen del atuendo actual de Draco
 */
export function getDracoAvatarImage(outfitId?: string | null): string {
  const outfit = getDracoOutfit(outfitId);
  return outfit.image;
}
