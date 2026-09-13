import { motion } from 'motion/react';
import { X, ShoppingBag, Check, Coins } from 'lucide-react';
import dragonCharacter from 'figma:asset/a7a237254f335b0739e1c16c0d3ef0796ab00ae9.png';
import { useUser } from '../utils/userContext';

interface DracoShopProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Outfit {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
}

const outfits: Outfit[] = [
  { id: 'default', name: 'Draco Original', description: '¡El look clásico de Draco!', cost: 0, emoji: '🐉' },
  { id: 'wizard', name: 'Mago Matemático', description: 'Sombrero mágico con estrellas', cost: 100, emoji: '🧙‍♂️' },
  { id: 'scientist', name: 'Científico Draco', description: 'Bata de laboratorio y gafas', cost: 150, emoji: '🔬' },
  { id: 'superhero', name: 'Súper Draco', description: 'Capa de superhéroe', cost: 200, emoji: '🦸' },
  { id: 'pirate', name: 'Pirata Matemático', description: 'Sombrero y parche de pirata', cost: 250, emoji: '🏴‍☠️' },
  { id: 'astronaut', name: 'Astronauta Draco', description: 'Traje espacial', cost: 300, emoji: '🚀' },
  { id: 'ninja', name: 'Ninja de Números', description: 'Disfraz de ninja', cost: 350, emoji: '🥷' },
  { id: 'king', name: 'Rey Draco', description: 'Corona dorada y capa real', cost: 500, emoji: '👑' },
];

export function DracoShop({ isOpen, onClose }: DracoShopProps) {
  const { user, purchaseOutfit, equipOutfit } = useUser();

  if (!isOpen || !user) return null;

  const handlePurchase = (outfit: Outfit) => {
    if (purchaseOutfit(outfit.id, outfit.cost)) {
      alert(`¡Felicidades! Has desbloqueado: ${outfit.name}`);
    } else {
      alert(`No tienes suficientes MetaPoints. Necesitas ${outfit.cost - user.metaPoints} más.`);
    }
  };

  const handleEquip = (outfitId: string) => {
    equipOutfit(outfitId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Tienda de Draco</h2>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-1">
                <Coins className="w-5 h-5 text-yellow-200" />
                <span className="text-white font-black">{user.metaPoints} MetaPoints</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Outfit */}
          <div className="mb-8 bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-300">
            <div className="flex items-center gap-4">
              <img src={dragonCharacter} alt="Draco" className="w-24 h-24" />
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Outfit Actual</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {outfits.find(o => o.id === user.equippedOutfit)?.emoji}{' '}
                  {outfits.find(o => o.id === user.equippedOutfit)?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Outfits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outfits.map((outfit) => {
              const owned = user.dracoOutfits.includes(outfit.id);
              const equipped = user.equippedOutfit === outfit.id;
              const canAfford = user.metaPoints >= outfit.cost;

              return (
                <motion.div
                  key={outfit.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-2xl border-4 ${
                    equipped
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400'
                      : owned
                      ? 'bg-white border-blue-300'
                      : canAfford
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{outfit.emoji}</span>
                      <div>
                        <h3 className="text-lg font-black text-gray-800">{outfit.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{outfit.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="font-black text-gray-800">{outfit.cost}</span>
                    </div>

                    {equipped ? (
                      <div className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-full">
                        <Check className="w-5 h-5 text-white" />
                        <span className="font-bold text-white">Equipado</span>
                      </div>
                    ) : owned ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEquip(outfit.id)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold"
                      >
                        Equipar
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: canAfford ? 1.05 : 1 }}
                        whileTap={{ scale: canAfford ? 0.95 : 1 }}
                        onClick={() => canAfford && handlePurchase(outfit)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-full font-bold ${
                          canAfford
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Comprar
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
