import { useState } from "react";
import { useUser } from "../utils/userContext";
import { getDracoOutfit } from "../utils/dracoAvatars";

interface DracoAvatarProps {
  outfitId?: string;
  className?: string;
  alt?: string;
  showBadge?: boolean;
  showGlow?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "custom";
}

const SIZE_MAP = {
  xs: "w-8 h-8",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
  "2xl": "w-48 h-48",
  custom: "",
};

export function DracoAvatar({
  outfitId,
  className = "",
  alt,
  showBadge = false,
  showGlow = false,
  size = "custom",
}: DracoAvatarProps) {
  const { user } = useUser();
  const currentOutfitId = outfitId || user?.equippedOutfit || "original";
  const outfit = getDracoOutfit(currentOutfitId);
  const IconComponent = outfit.icon;

  const [imgSrc, setImgSrc] = useState(outfit.image);

  // Si cambia el outfit, actualizar imagen
  if (imgSrc !== outfit.image && !imgSrc.includes("error")) {
    setImgSrc(outfit.image);
  }

  const handleImgError = () => {
    if (imgSrc !== outfit.fallbackImage) {
      setImgSrc(outfit.fallbackImage);
    }
  };

  const sizeClasses = size !== "custom" ? SIZE_MAP[size] : "";

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}
      style={
        showGlow
          ? {
              filter: `drop-shadow(0 0 18px ${outfit.colors.glow})`,
            }
          : undefined
      }
    >
      <img
        src={imgSrc}
        alt={alt || outfit.name}
        onError={handleImgError}
        className="w-full h-full object-contain filter drop-shadow transition-transform duration-300 pointer-events-none"
      />

      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 bg-white text-gray-800 rounded-full p-1.5 shadow-lg border-2 border-gray-100 flex items-center justify-center"
          title={outfit.name}
        >
          <IconComponent className="w-3.5 h-3.5 text-indigo-600" />
        </span>
      )}
    </div>
  );
}

export default DracoAvatar;
