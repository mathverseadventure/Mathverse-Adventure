import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle } from 'lucide-react';
import dragonCharacter from 'figma:asset/a7a237254f335b0739e1c16c0d3ef0796ab00ae9.png';

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
      text: '¡Hola! Soy Draco, tu asistente matemático 🔥 ¿En qué puedo ayudarte hoy?',
      sender: 'draco',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDracoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Detect non-math topics
    const nonMathKeywords = ['hola como estas', 'que tal', 'quien eres', 'cuantos años tienes', 'donde vives', 
      'que comes', 'juego', 'deporte', 'musica', 'pelicula', 'color favorito', 'animal', 'comida'];
    
    const isNonMath = nonMathKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (isNonMath && !lowerMessage.includes('suma') && !lowerMessage.includes('resta') && 
        !lowerMessage.includes('multiplic') && !lowerMessage.includes('divid') && 
        !lowerMessage.includes('potencia') && !lowerMessage.includes('raíz') && 
        !lowerMessage.includes('matemática')) {
      return '¡Hola! 🐉 Soy Draco, tu asistente matemático. Solo puedo ayudarte con preguntas sobre matemáticas. ¿Quieres que te explique sobre suma, resta, multiplicación, división, potencias, raíces o polinomios?';
    }

    // Suma - Respuestas detalladas
    if (lowerMessage.includes('suma') || lowerMessage.includes('sumar') || lowerMessage.includes('mas') || lowerMessage.includes('+')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '🎯 La SUMA es una operación que combina dos o más números para obtener un total.\n\n' +
               '📚 Ejemplo del día a día: Si tienes 3 manzanas en una canasta y luego pones 5 manzanas más, ¿cuántas manzanas tienes en total?\n' +
               '✅ 3 + 5 = 8 manzanas\n\n' +
               '💡 Tips importantes:\n' +
               '• El orden no importa: 3+5 es igual a 5+3\n' +
               '• Sumar con los dedos está bien para comenzar\n' +
               '• Practica sumando objetos que puedas ver y tocar\n\n' +
               '🔥 ¿Quieres que te ponga un problema de práctica?';
      }
      if (lowerMessage.includes('difícil') || lowerMessage.includes('dificil')) {
        return '¡No te preocupes! 💪 Aquí está mi método secreto para sumar números grandes:\n\n' +
               '1️⃣ Separa las centenas, decenas y unidades\n' +
               '2️⃣ Suma las unidades primero\n' +
               '3️⃣ Luego las decenas\n' +
               '4️⃣ Por último las centenas\n\n' +
               'Ejemplo: 47 + 35\n' +
               '• Unidades: 7 + 5 = 12 (guardo 2, llevo 1)\n' +
               '• Decenas: 4 + 3 + 1 = 8\n' +
               '• Resultado: 82\n\n' +
               '¿Quieres otro ejemplo?';
      }
      return '¡La suma es genial! 🎯 Es como juntar cosas.\n\n' +
             '🍎 Ejemplo: Tienes 4 galletas y tu amigo te da 3 más. Ahora tienes 4 + 3 = 7 galletas.\n\n' +
             '⚡ Dato curioso: Los números que sumas se llaman "sumandos" y el resultado es la "suma" o "total".\n\n' +
             '¿Quieres que te explique cómo sumar números más grandes?';
    }

    // Resta - Respuestas detalladas
    if (lowerMessage.includes('resta') || lowerMessage.includes('restar') || lowerMessage.includes('menos') || lowerMessage.includes('-')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '✂️ La RESTA es quitar una cantidad de otra.\n\n' +
               '🍕 Ejemplo del día a día: Tienes 10 rebanadas de pizza y te comes 4. ¿Cuántas te quedan?\n' +
               '✅ 10 - 4 = 6 rebanadas\n\n' +
               '💡 Tips importantes:\n' +
               '• Siempre resta el número pequeño del grande (si no quieres negativos)\n' +
               '• Puedes contar hacia atrás en tus dedos\n' +
               '• Si restas cero, el número no cambia: 5 - 0 = 5\n\n' +
               '🔥 ¿Tienes algún problema específico que quieras resolver?';
      }
      if (lowerMessage.includes('prestar') || lowerMessage.includes('llevada')) {
        return '🤔 Restar con préstamo parece difícil, ¡pero es fácil con mi método!\n\n' +
               'Ejemplo: 52 - 27\n\n' +
               '1️⃣ Mira las unidades: 2 - 7 no se puede\n' +
               '2️⃣ "Pide prestado" 1 decena: 12 - 7 = 5\n' +
               '3️⃣ Ahora decenas: 4 - 2 = 2\n' +
               '4️⃣ Resultado: 25\n\n' +
               '🎯 Piensa en cambiar un billete de $10 por monedas de $1\n\n' +
               '¿Quieres que te explique con otro ejemplo?';
      }
      return '¡La resta es como quitar cosas! ✂️\n\n' +
             '🎮 Ejemplo: Tienes 15 vidas en un juego y pierdes 6. Te quedan 15 - 6 = 9 vidas.\n\n' +
             '⚡ Dato curioso: En una resta, el número grande se llama "minuendo", el que restas es el "sustraendo" y el resultado es la "diferencia".\n\n' +
             '¿Quieres practicar con resta que necesita préstamo?';
    }

    // Multiplicación - Respuestas detalladas
    if (lowerMessage.includes('multiplic') || lowerMessage.includes('tabla') || lowerMessage.includes('×') || lowerMessage.includes('por')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '🚀 La MULTIPLICACIÓN es suma rápida del mismo número varias veces.\n\n' +
               '🎁 Ejemplo del día a día: Tienes 4 cajas con 6 chocolates cada una. ¿Cuántos chocolates tienes?\n' +
               '✅ 4 × 6 = 24 chocolates (es lo mismo que 6 + 6 + 6 + 6)\n\n' +
               '💡 Tips importantes:\n' +
               '• Cualquier número × 0 = 0\n' +
               '• Cualquier número × 1 = ese mismo número\n' +
               '• El orden no importa: 3×4 = 4×3\n' +
               '• Memoriza las tablas del 1 al 10, ¡te facilitará todo!\n\n' +
               '🔥 ¿Quieres trucos para aprender las tablas más rápido?';
      }
      if (lowerMessage.includes('tabla') || lowerMessage.includes('truco')) {
        return '🎯 ¡Aquí van mis TRUCOS SECRETOS para las tablas!\n\n' +
               '✌️ Tabla del 2: Suma el número a sí mismo (2×4 = 4+4 = 8)\n' +
               '✋ Tabla del 5: Siempre termina en 5 o 0\n' +
               '🔟 Tabla del 10: Agrega un 0 al final (10×3 = 30)\n' +
               '🎪 Tabla del 9: Los dedos son mágicos\n' +
               '   - Baja el dedo del número que multiplicas\n' +
               '   - Los dedos a la izquierda = decenas\n' +
               '   - Los dedos a la derecha = unidades\n\n' +
               '🌟 ¿Quieres que te explique otro truco específico?';
      }
      return '¡Las tablas de multiplicar son tu superpoder matemático! 🚀\n\n' +
             '⚽ Ejemplo: Si 1 equipo de fútbol tiene 11 jugadores y hay 3 equipos, ¿cuántos jugadores hay?\n' +
             '✅ 3 × 11 = 33 jugadores\n\n' +
             '⚡ Multiplicar es como tener grupos iguales de cosas.\n\n' +
               '¿Te cuento trucos para memorizar las tablas del 9?';
    }

    // División - Respuestas detalladas
    if (lowerMessage.includes('divid') || lowerMessage.includes('repartir') || lowerMessage.includes('÷') || lowerMessage.includes('entre')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '🍕 La DIVISIÓN es repartir equitativamente en partes iguales.\n\n' +
               '🎂 Ejemplo del día a día: Tienes 12 galletas y 4 amigos. Si repartes igual para todos, ¿cuántas galletas recibe cada uno?\n' +
               '✅ 12 ÷ 4 = 3 galletas por amigo\n\n' +
               '💡 Tips importantes:\n' +
               '• La división es lo contrario de la multiplicación\n' +
               '• No puedes dividir entre 0 (¡es imposible!)\n' +
               '• Si conoces las tablas, ¡dividir es fácil!\n' +
               '• Ejemplo: 20 ÷ 4 = ? piensa "¿4 por cuánto es 20?" = 5\n\n' +
               '🔥 ¿Quieres saber sobre división con residuo?';
      }
      if (lowerMessage.includes('residuo') || lowerMessage.includes('resto') || lowerMessage.includes('sobra')) {
        return '🎯 ¡La división con RESIDUO es cuando sobran cosas!\n\n' +
               '🍬 Ejemplo: Tienes 17 dulces para repartir entre 5 niños.\n' +
               '• 17 ÷ 5 = 3 dulces para cada niño\n' +
               '• Sobran 2 dulces (residuo)\n' +
               '• Se escribe: 17 = 5 × 3 + 2\n\n' +
               '💡 El residuo SIEMPRE es menor que el divisor\n\n' +
               '🌟 ¿Quieres otro ejemplo con residuo?';
      }
      return '¡Dividir es repartir en partes iguales! 🍕\n\n' +
             '🎮 Ejemplo: Tienes 24 puntos y 6 niveles. ¿Cuántos puntos por nivel?\n' +
             '✅ 24 ÷ 6 = 4 puntos por nivel\n\n' +
             '⚡ Truco: Usa las tablas al revés: "¿6 por cuánto da 24?" = 4\n\n' +
             '¿Te explico sobre división que tiene residuo?';
    }

    // Potencias - Respuestas detalladas
    if (lowerMessage.includes('potencia') || lowerMessage.includes('exponente') || lowerMessage.includes('cuadrado') || lowerMessage.includes('elevado')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '⚡ Las POTENCIAS son multiplicar un número por sí mismo varias veces.\n\n' +
               '📦 Ejemplo del día a día: Un cubo Rubik tiene 3 cubitos por lado. ¿Cuántos cubitos en total?\n' +
               '✅ 3 × 3 × 3 = 3³ = 27 cubitos\n\n' +
               '💡 Tips importantes:\n' +
               '• Se lee "3 elevado al cubo" o "3 a la 3"\n' +
               '• El número grande es la "base"\n' +
               '• El número pequeño arriba es el "exponente"\n' +
               '• 2² se lee "dos al cuadrado" = 2 × 2 = 4\n' +
               '• Cualquier número elevado a 1 es él mismo: 5¹ = 5\n' +
               '• Cualquier número elevado a 0 es 1: 7⁰ = 1\n\n' +
               '🔥 ¿Quieres aprender los cuadrados del 1 al 10?';
      }
      if (lowerMessage.includes('memorizar') || lowerMessage.includes('lista')) {
        return '🎯 ¡Memoriza estos CUADRADOS PERFECTOS!\n\n' +
               '1² = 1 × 1 = 1\n' +
               '2² = 2 × 2 = 4\n' +
               '3² = 3 × 3 = 9\n' +
               '4² = 4 × 4 = 16\n' +
               '5² = 5 × 5 = 25\n' +
               '6² = 6 × 6 = 36\n' +
               '7² = 7 × 7 = 49\n' +
               '8² = 8 × 8 = 64\n' +
               '9² = 9 × 9 = 81\n' +
               '10² = 10 × 10 = 100\n\n' +
               '💪 Practica estos todos los días, ¡son súper útiles!\n\n' +
               '¿Te ayudo con algo más?';
      }
      return '¡Las potencias son súper poderosas! ⚡\n\n' +
             '📱 Ejemplo: Tu teléfono tiene 2 GB de memoria. Si duplicas la capacidad 3 veces, ¿cuánto tendrás?\n' +
             '✅ 2 × 2 × 2 = 2³ = 8 GB\n\n' +
             '⚡ Las potencias se usan en computadoras, áreas de cuadrados, volúmenes de cubos y ¡hasta en el dinero que crece en el banco!\n\n' +
             '¿Quieres que te enseñe los cuadrados perfectos del 1 al 10?';
    }

    // Radicación - Respuestas detalladas
    if (lowerMessage.includes('raíz') || lowerMessage.includes('raiz') || lowerMessage.includes('radical') || lowerMessage.includes('√')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '🌱 La RAÍZ CUADRADA busca qué número multiplicado por sí mismo da el resultado.\n\n' +
               '🏠 Ejemplo del día a día: Un jardín cuadrado tiene un área de 49 m². ¿Cuánto mide cada lado?\n' +
               '✅ √49 = 7 metros (porque 7 × 7 = 49)\n\n' +
               '💡 Tips importantes:\n' +
               '• Es la operación inversa de elevar al cuadrado\n' +
               '• √ es el símbolo de raíz\n' +
               '• Memoriza: √4=2, √9=3, √16=4, √25=5, √36=6\n' +
               '• Solo números positivos tienen raíz cuadrada real\n\n' +
               '🔥 ¿Quieres practicar encontrando raíces?';
      }
      if (lowerMessage.includes('cubica') || lowerMessage.includes('cúbica')) {
        return '🎲 La RAÍZ CÚBICA busca qué número multiplicado 3 veces da el resultado.\n\n' +
               '📦 Ejemplo: Una caja cúbica tiene volumen de 27 cm³. ¿Cuánto mide cada lado?\n' +
               '✅ ³√27 = 3 cm (porque 3 × 3 × 3 = 27)\n\n' +
               '💡 Raíces cúbicas útiles:\n' +
               '³√1 = 1\n' +
               '³√8 = 2\n' +
               '³√27 = 3\n' +
               '³√64 = 4\n' +
               '³√125 = 5\n\n' +
               '¿Necesitas más ejemplos?';
      }
      return '¡Las raíces son fascinantes! 🌱\n\n' +
             '🔲 Ejemplo: Quieres hacer un cuadrado con 64 fichas. ¿Cuántas fichas van en cada lado?\n' +
             '✅ √64 = 8 fichas por lado\n\n' +
             '⚡ Truco: Piensa al revés de las potencias. Si 5² = 25, entonces √25 = 5\n\n' +
             '¿Te explico sobre raíz cúbica?';
    }

    // Polinomios - Respuestas detalladas
    if (lowerMessage.includes('polinomio') || lowerMessage.includes('variable') || lowerMessage.includes('expresión') || lowerMessage.includes('algebra')) {
      if (lowerMessage.includes('como') || lowerMessage.includes('que es') || lowerMessage.includes('explica')) {
        return '📐 Los POLINOMIOS son expresiones con números y letras (variables).\n\n' +
               '🛒 Ejemplo del día a día: Cada manzana cuesta 2 pesos y compras "x" manzanas más 5 pesos de bolsa.\n' +
               '✅ Costo total = 2x + 5\n' +
               '   Si x = 3 manzanas: 2(3) + 5 = 6 + 5 = 11 pesos\n\n' +
               '💡 Tips importantes:\n' +
               '• Las letras (x, y, z) representan números desconocidos\n' +
               '• Resuelve primero lo que está en paréntesis\n' +
               '• Multiplica antes de sumar o restar\n' +
               '• Agrupa términos similares: 3x + 2x = 5x\n\n' +
               '🔥 ¿Quieres resolver un polinomio juntos?';
      }
      return '¡Los polinomios son ecuaciones con letras! 📐\n\n' +
             '🎮 Ejemplo: Tienes x puntos y ganas el doble más 10. Tu puntaje es 2x + 10\n' +
             'Si x = 15: 2(15) + 10 = 30 + 10 = 40 puntos\n\n' +
               '⚡ Las variables son como cajas misteriosas que guardan números.\n\n' +
             '¿Quieres que te explique paso a paso cómo resolver uno?';
    }

    // Ayuda general
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('ayudar') || lowerMessage.includes('cómo') || lowerMessage.includes('como') || lowerMessage.includes('que puedes')) {
      return '🐉 ¡Soy Draco, tu mentor matemático! Puedo explicarte:\n\n' +
             '➕ SUMA - Juntar cantidades\n' +
             '➖ RESTA - Quitar cantidades\n' +
             '✖️ MULTIPLICACIÓN - Suma rápida de grupos iguales\n' +
             '➗ DIVISIÓN - Repartir en partes iguales\n' +
             '⚡ POTENCIAS - Multiplicar un número por sí mismo\n' +
             '🌱 RAÍCES - Encontrar el número original\n' +
             '📐 POLINOMIOS - Expresiones con variables\n\n' +
             '💡 Solo pregúntame sobre matemáticas y te explicaré con ejemplos del día a día.\n\n' +
             '¿Sobre qué tema quieres aprender hoy?';
    }

    // Motivación
    if (lowerMessage.includes('difícil') || lowerMessage.includes('dificil') || lowerMessage.includes('no puedo') || lowerMessage.includes('no entiendo') || lowerMessage.includes('no se')) {
      return '¡No te rindas, campeón! 💪🔥\n\n' +
             'Las matemáticas son como los videojuegos: al principio parecen difíciles, pero con práctica te vuelves experto.\n\n' +
             '🎯 Mis consejos:\n' +
             '1️⃣ Divide el problema en partes pequeñas\n' +
             '2️⃣ Usa objetos reales para practicar\n' +
             '3️⃣ No tengas miedo de equivocarte (¡yo también me equivoco!)\n' +
             '4️⃣ Practica un poco cada día\n\n' +
             '🌟 ¿Qué tema específico te está costando? ¡Te ayudaré paso a paso!';
    }

    // Gracias
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
      return '¡De nada, campeón matemático! 🎉🐉\n\n' +
             'Recuerda: Cada problema que resuelves te hace más fuerte. ¡Sigue practicando y serás un maestro!\n\n' +
             '💪 Estoy aquí siempre que necesites ayuda con matemáticas.\n\n' +
             '¿Hay algo más que quieras aprender hoy?';
    }

    // Saludo
    if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('buenas')) {
      return '¡Hola, súper estudiante! 🐉🔥\n\n' +
             'Soy Draco, tu dragón matemático favorito. Estoy aquí para ayudarte a dominar las matemáticas con explicaciones divertidas y ejemplos de la vida real.\n\n' +
             '📚 Puedo explicarte sobre:\n' +
             '• Operaciones básicas (suma, resta, multiplicación, división)\n' +
             '• Temas avanzados (potencias, raíces, polinomios)\n' +
             '• Trucos y técnicas para resolver más rápido\n\n' +
             '¿Sobre qué tema matemático quieres charlar hoy?';
    }

    // Respuesta por defecto
    return '🤔 Hmm, no estoy seguro de entender tu pregunta sobre matemáticas.\n\n' +
           '💡 Puedo ayudarte con:\n' +
           '✓ Suma, resta, multiplicación, división\n' +
           '✓ Potencias y raíces\n' +
           '✓ Polinomios y expresiones algebraicas\n' +
           '✓ Trucos y consejos para resolver problemas\n\n' +
           '🎯 Intenta preguntarme algo como:\n' +
           '• "¿Cómo se hace una suma con llevadas?"\n' +
           '• "Explícame las tablas de multiplicar"\n' +
           '• "¿Qué es una potencia?"\n\n' +
           '¿Qué te gustaría aprender?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Get Draco's response
    setTimeout(() => {
      const dracoMessage: Message = {
        text: getDracoResponse(input),
        sender: 'draco',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, dracoMessage]);
    }, 1000);

    setInput('');
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-orange-500 p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.img
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              src={dragonCharacter}
              alt="Draco"
              className="w-16 h-16"
            />
            <div>
              <h2 className="text-2xl font-black text-white">Chat con Draco</h2>
              <p className="text-white/90 text-sm font-semibold">Tu asistente matemático</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-purple-50 to-pink-50">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                    : 'bg-white border-2 border-purple-200 text-gray-800'
                }`}
              >
                {message.sender === 'draco' && (
                  <div className="flex items-center gap-2 mb-2">
                    <img src={dragonCharacter} alt="Draco" className="w-6 h-6" />
                    <span className="font-black text-sm text-purple-600">Draco</span>
                  </div>
                )}
                <p className="font-semibold">{message.text}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t-2 border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregúntale a Draco sobre matemáticas..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none font-semibold"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating Chat Button
export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-8 w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center z-40 border-4 border-white"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </motion.button>
  );
}