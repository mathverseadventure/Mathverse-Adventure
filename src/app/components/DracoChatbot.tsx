import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Pencil } from 'lucide-react';
import dragonCharacter from '../../assets/draco.png';
import API from '../../services/api';
import { DrawingBoard } from './DrawingBoard';

interface Message {
  text: string;
  sender: 'user' | 'draco';
  timestamp: Date;
}

interface DracoChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DracoChatbot({ isOpen, onClose }: DracoChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '¡Hola! Soy Draco, tu asistente matemático. Solo respondo preguntas de matemáticas de quinto. ¿En qué te ayudo?',
      sender: 'draco',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'chat' | 'board'>('chat');
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
    setLoading(true);

    try {
      const respuesta = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const datos = await respuesta.json();
      const reply =
        datos.reply ||
        'Solo puedo ayudarte con matemáticas. Pregúntame sobre suma, resta, multiplicación, división, potencias, raíces o polinomios.';

      setMessages((prev) => [
        ...prev,
        { text: reply, sender: 'draco', timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No pude conectar con el servidor. Mientras tanto: recuerda que solo ayudo con matemáticas. Intenta de nuevo en un momento.',
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
        className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-b-8 border-orange-400 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={dragonCharacter} alt="Draco" className="w-14 h-14" />
              <div>
                <h3 className="text-white font-black text-xl">Draco</h3>
                <p className="text-orange-100 text-sm font-semibold">Tutor de matemáticas</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/20">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b-2 border-gray-100">
            <button
              type="button"
              onClick={() => setTab('chat')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 ${
                tab === 'chat' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-500'
              }`}
            >
              <MessageCircle className="w-4 h-4" /> Chat
            </button>
            <button
              type="button"
              onClick={() => setTab('board')}
              className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 ${
                tab === 'board' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-500'
              }`}
            >
              <Pencil className="w-4 h-4" /> Tablero
            </button>
          </div>

          {tab === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl font-semibold whitespace-pre-wrap text-sm ${
                        msg.sender === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-orange-50 text-gray-800 border-2 border-orange-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm font-bold text-orange-600">Draco está pensando...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t-2 border-gray-100 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Pregunta de matemáticas..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 font-semibold focus:border-orange-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 overflow-y-auto">
              <p className="text-sm font-bold text-gray-600 mb-2">
                Usa el tablero para resolver a mano. Lápiz, colores y borrador listos.
              </p>
              <DrawingBoard height={360} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
