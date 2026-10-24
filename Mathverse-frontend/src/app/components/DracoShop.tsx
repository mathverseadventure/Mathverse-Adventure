import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShoppingBag,
  Check,
  Coins,
  Sparkles,
  Lock,
  ChevronRight,
  RotateCcw,
  PartyPopper,
  Lightbulb,
} from "lucide-react";
import { useUser } from "../utils/userContext";
import {
  DRACO_OUTFITS,
  DRACO_SHOP_ITEMS,
  getDracoOutfit,
  DracoOutfit,
} from "../utils/dracoAvatars";
import { DracoAvatar } from "./DracoAvatar";

interface DracoShopProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generador de efectos de sonido sintetizados (Web Audio API)
function playSound(type: "buy" | "equip" | "error") {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "buy") {
      // Fanfarria alegre de compra (3 tonos ascendentes)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.25);
      });
    } else if (type === "equip") {
      // Sonido de equipar (doble toque mágico)
      [440, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } else {
      // Tono de error/insuficiente saldo
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Silencio si el navegador no permite audio antes de interacción
  }
}

export function DracoShop({ isOpen, onClose }: DracoShopProps) {
  const { user, purchaseOutfit, equipOutfit } = useUser();
  const [feedbackModal, setFeedbackModal] = useState<{
    show: boolean;
    type: "purchased" | "equipped" | "insufficient";
    outfit?: DracoOutfit;
    missingPoints?: number;
  }>({ show: false, type: "purchased" });

  if (!isOpen || !user) return null;

  const currentEquippedOutfit = getDracoOutfit(user.equippedOutfit);

  const handlePurchase = (outfit: DracoOutfit) => {
    if (user.metaPoints < outfit.cost) {
      playSound("error");
      setFeedbackModal({
        show: true,
        type: "insufficient",
        outfit,
        missingPoints: outfit.cost - user.metaPoints,
      });
      return;
    }

    const success = purchaseOutfit(outfit.id, outfit.cost);
    if (success) {
      playSound("buy");
      // Equipar automáticamente o preguntar al usuario
      equipOutfit(outfit.id);
      setFeedbackModal({
        show: true,
        type: "purchased",
        outfit,
      });
    }
  };

  const handleEquip = (outfitId: string) => {
    const outfit = getDracoOutfit(outfitId);
    equipOutfit(outfitId);
    playSound("equip");
    setFeedbackModal({
      show: true,
      type: "equipped",
      outfit,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border-4 border-yellow-300"
      >
        {/* Cabecera de la Tienda */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-5 sm:p-6 flex items-center justify-between text-white shadow-md relative overflow-hidden">
          {/* Brillos decorativos */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50 transform -rotate-3">
              <ShoppingBag className="w-8 h-8 sm:w-9 sm:h-9 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow">
                  Tienda de Draco
                </h2>
                <Sparkles className="hidden sm:inline-block w-6 h-6 text-yellow-200" />
              </div>
              <p className="text-yellow-100 font-bold text-xs sm:text-sm">
                ¡Personaliza a tu dragón favorito con trajes legendarios!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Saldo de MetaPoints */}
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md rounded-2xl px-3.5 py-2 border-2 border-yellow-200/60 shadow-inner">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 animate-bounce" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[10px] sm:text-xs font-bold text-yellow-200 uppercase">
                  Tus Puntos
                </span>
                <span className="text-base sm:text-xl font-black text-white drop-shadow">
                  {user.metaPoints}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Cerrar tienda"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </button>
          </div>
        </div>

        {/* Contenido Principal con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-amber-50/50 via-white to-purple-50/30">
          {/* Banner: Tu Draco Actual */}
          <div className="mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl border-4 border-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 rounded-3xl p-2 backdrop-blur-md shadow-inner flex items-center justify-center border-2 border-white/40 flex-shrink-0">
                <DracoAvatar
                  outfitId={user.equippedOutfit}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                  alt="Draco Actual"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-purple-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  <Sparkles className="w-3.5 h-3.5" /> Traje en Uso
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 flex items-center justify-center sm:justify-start gap-2.5">
                  <span>{currentEquippedOutfit.name}</span>
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-yellow-300">
                    <currentEquippedOutfit.icon className="w-5 h-5" />
                  </div>
                </h3>
                <p className="text-purple-100 text-xs sm:text-sm font-semibold max-w-md">
                  {currentEquippedOutfit.description}
                </p>
              </div>
            </div>

            {/* Si no tiene el Original puesto, botón para volver a Draco Original */}
            {user.equippedOutfit !== "original" && user.equippedOutfit !== "default" && (
              <button
                onClick={() => handleEquip("original")}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-white/40 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Usar Draco Original</span>
              </button>
            )}
          </div>

          {/* Título de la Colección */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2">
                <span>Vestuario y Colección</span>
                <span className="text-sm font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                  {DRACO_SHOP_ITEMS.length} Avatares
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                Personaliza a tu dragón con trajes o vuelve al Draco Original en cualquier momento
              </p>
            </div>
          </div>

          {/* Grid de las Tarjetas de Draco */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {DRACO_SHOP_ITEMS.map((outfit) => {
              const isOriginal = outfit.id === "original";
              const owned = isOriginal || user.dracoOutfits.includes(outfit.id);
              const equipped =
                user.equippedOutfit === outfit.id ||
                (isOriginal && user.equippedOutfit === "default");
              const canAfford = outfit.cost === 0 || user.metaPoints >= outfit.cost;

              return (
                <motion.div
                  key={outfit.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-3xl p-5 sm:p-6 border-4 flex flex-col justify-between transition-all shadow-lg ${
                    equipped
                      ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-400 ring-4 ring-emerald-200"
                      : owned
                      ? "bg-white border-blue-300 hover:border-blue-400"
                      : canAfford
                      ? "bg-white border-yellow-300 hover:border-yellow-400"
                      : "bg-gray-50/90 border-gray-200 opacity-80"
                  }`}
                >
                  {/* Etiqueta de estado en la esquina superior */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      <outfit.icon className="w-5 h-5" />
                    </div>
                    {equipped ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                        En uso
                      </span>
                    ) : owned ? (
                      <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-black text-xs px-3 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Desbloqueado
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 font-black text-xs px-3 py-1 rounded-full border border-amber-200">
                        <Coins className="w-3.5 h-3.5 text-yellow-600" />
                        <span>{outfit.cost} MP</span>
                      </div>
                    )}
                  </div>

                  {/* Avatar Central Grande y Colorido */}
                  <div className="my-2 py-3 flex flex-col items-center justify-center">
                    <div
                      className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-3 flex items-center justify-center relative transition-transform hover:scale-105 duration-300 ${
                        equipped
                          ? "bg-emerald-100/60"
                          : owned
                          ? "bg-blue-50"
                          : "bg-gradient-to-b from-gray-100 to-amber-50"
                      }`}
                    >
                      <DracoAvatar
                        outfitId={outfit.id}
                        className="w-full h-full object-contain filter drop-shadow-md"
                        alt={outfit.name}
                        showGlow={equipped}
                      />
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-gray-800 mt-3 text-center">
                      {outfit.name}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-purple-600 uppercase tracking-wide">
                      {outfit.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 text-center font-medium mt-1 px-2 line-clamp-2">
                      {outfit.description}
                    </p>
                  </div>

                  {/* Barra inferior: Precio y Botón de Acción */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Precio
                        </span>
                        <span className="text-base sm:text-lg font-black text-gray-800">
                          {outfit.cost === 0 ? "Gratis" : `${outfit.cost} MP`}
                        </span>
                      </div>
                    </div>

                    {/* Botón Dinámico según Estado */}
                    {equipped ? (
                      <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-md cursor-default">
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>Equipado</span>
                      </div>
                    ) : owned ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEquip(outfit.id)}
                        className="bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Equipar</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: canAfford ? 1.05 : 1 }}
                        whileTap={{ scale: canAfford ? 0.95 : 1 }}
                        onClick={() => handlePurchase(outfit)}
                        className={`px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all ${
                          canAfford
                            ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:from-yellow-500 hover:to-red-600"
                            : "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Comprar</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Bloqueado</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Modal / Toast de Feedback Visual al Comprar o Equipar */}
      <AnimatePresence>
        {feedbackModal.show && feedbackModal.outfit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setFeedbackModal({ show: false, type: "purchased" })}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 relative overflow-hidden"
            >
              {feedbackModal.type === "purchased" ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-3xl p-2 flex items-center justify-center">
                    <DracoAvatar
                      outfitId={feedbackModal.outfit.id}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-inner">
                    <PartyPopper className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-800 mt-2">
                    ¡Felicidades!
                  </h4>
                  <p className="text-purple-600 font-bold text-lg">
                    ¡Has desbloqueado a {feedbackModal.outfit.name}!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Draco ha sido equipado con su nuevo traje y se mostrará en toda la aventura.
                  </p>
                  <button
                    onClick={() => setFeedbackModal({ show: false, type: "purchased" })}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    ¡Genial, gracias!
                  </button>
                </>
              ) : feedbackModal.type === "equipped" ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-3xl p-2 flex items-center justify-center">
                    <DracoAvatar
                      outfitId={feedbackModal.outfit.id}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-800 mt-2">
                    ¡Traje Equipado!
                  </h4>
                  <p className="text-indigo-600 font-bold text-lg flex items-center justify-center gap-1.5">
                    <span>{feedbackModal.outfit.name}</span>
                    <feedbackModal.outfit.icon className="w-5 h-5" />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ahora Draco te acompañará con este traje en todos los módulos y pruebas.
                  </p>
                  <button
                    onClick={() => setFeedbackModal({ show: false, type: "equipped" })}
                    className="mt-5 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    ¡Listo para jugar!
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                    <Coins className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-black text-gray-800">
                    ¡MetaPoints Insuficientes!
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Necesitas{" "}
                    <span className="font-black text-red-500">
                      {feedbackModal.missingPoints} MetaPoints más
                    </span>{" "}
                    para comprar este traje.
                  </p>
                  <p className="text-xs text-purple-600 font-semibold mt-2 flex items-center justify-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>¡Completa lecciones con ≥70% o resuelve puzzles para ganar más monedas!</span>
                  </p>
                  <button
                    onClick={() => setFeedbackModal({ show: false, type: "insufficient" })}
                    className="mt-5 w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 transition-colors"
                  >
                    Entendido
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export default DracoShop;
