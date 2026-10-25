import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import API from '../../services/api';
import { useUser } from '../utils/userContext';
import { DracoAvatar } from './DracoAvatar';
import { getDracoOutfit } from '../utils/dracoAvatars';

interface Message {
  text: string;
  sender: 'user' | 'draco';
  timestamp: Date;
}

interface DracoChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const OFF_TOPIC_REPLY =
  '¡Hola! Soy Draco, tu asistente de MathVerse. Solo puedo ayudarte con dudas de matemáticas de quinto grado (suma, resta, multiplicación, división, potencias, raíces o polinomios). ¡Pregúntame algo de eso!';

/**
 * Valida del lado del cliente si el mensaje contiene términos u operaciones matemáticas de 5° grado.
 */
function isMathQueryClient(message: string): boolean {
  const lower = message.toLowerCase().trim();

  // Expresiones numéricas con operadores
  if (/\d+\s*[\+\-\*\/×÷\^=]\s*\d+/.test(lower)) return true;
  if (/[\+\-\*\/×÷√\^=]/.test(lower)) return true;

  const mathKeywords = [
    'suma', 'sumar', 'adicion', 'adición',
    'resta', 'restar', 'sustraccion', 'sustracción', 'menos', 'diferencia',
    'multiplica', 'multiplicar', 'multiplicacion', 'multiplicación', 'producto', 'tabla',
    'divisi', 'dividir', 'division', 'división', 'cociente', 'residuo',
    'potencia', 'potencias', 'potenciacion', 'potenciación', 'exponente', 'elevado', 'cuadrado', 'cubo',
    'raiz', 'raíz', 'raices', 'raíces', 'radicacion', 'radicación',
    'polinomio', 'polinomios', 'monomio', 'algebra', 'álgebra', 'variable', 'ecuacion', 'ecuación',
    'matematica', 'matemática', 'matematicas', 'matemáticas', 'calculo', 'cálculo', 'calcular',
    'numero', 'número', 'numeros', 'números', 'fraccion', 'fracción', 'fracciones',
  ];

  if (mathKeywords.some((kw) => lower.includes(kw))) return true;

  if (/\d+/.test(lower)) {
    const triggers = ['cuanto', 'cuánto', 'resultado', 'resolver', 'calcula'];
    if (triggers.some((t) => lower.includes(t))) return true;
  }

  return false;
}

export function DracoChatbot({ isOpen, onClose }: DracoChatbotProps) {
  const { user } = useUser();
  const equippedOutfit = getDracoOutfit(user?.equippedOutfit);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '¡Hola! Soy Draco, tu asistente de MathVerse. Solo puedo ayudarte con dudas de matemáticas de quinto grado (suma, resta, multiplicación, división, potencias, raíces o polinomios). ¡Pregúntame algo de eso!',
      sender: 'draco',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { text: userText, sender: 'user', timestamp: new Date() },
    ]);

    // CONDICIÓN INMEDIATA: Si la consulta no es matemática, responder directamente el mensaje amable
    if (!isMathQueryClient(userText)) {
      setMessages((prev) => [
        ...prev,
        { text: OFF_TOPIC_REPLY, sender: 'draco', timestamp: new Date() },
      ]);
      return;
    }

    setLoading(true);

    try {
      const respuesta = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const datos = await respuesta.json();
      const reply = datos.reply || OFF_TOPIC_REPLY;

      setMessages((prev) => [
        ...prev,
        { text: reply, sender: 'draco', timestamp: new Date() },
      ]);
    } catch {
      // Fallback local determinista si el servidor está desconectado
      setMessages((prev) => [
        ...prev,
        {
          text: OFF_TOPIC_REPLY,
          sender: 'draco',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-orange-400 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 via-amber-500 to-red-500 p-3 sm:p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl p-1 flex items-center justify-center shadow-inner">
                <DracoAvatar outfitId={user?.equippedOutfit} className="w-full h-full object-contain" alt="Draco" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg sm:text-xl flex items-center gap-2">
                  <span>{equippedOutfit.name}</span>
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-yellow-200">
                    <equippedOutfit.icon className="w-4 h-4" />
                  </div>
                </h3>
                <p className="text-orange-100 text-xs sm:text-sm font-bold">Tutor de matemáticas 5°</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 cursor-pointer"
              title="Cerrar chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-[240px] bg-gradient-to-b from-orange-50/30 to-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl font-semibold whitespace-pre-wrap text-sm sm:text-base leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md rounded-br-none'
                      : 'bg-white text-gray-800 border-2 border-orange-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs sm:text-sm font-bold text-orange-600 animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>Draco está pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t-2 border-gray-100 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Pregunta algo de matemáticas..."
              className="flex-1 px-4 py-3 min-h-[44px] rounded-xl border-2 border-gray-200 font-bold text-sm sm:text-base text-gray-800 focus:border-orange-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 min-h-[44px] min-w-[44px] rounded-xl font-black hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
