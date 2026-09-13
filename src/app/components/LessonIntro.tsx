import { motion } from 'motion/react';
import { BookOpen, Play, X } from 'lucide-react';
import dragonCharacter from 'figma:asset/a7a237254f335b0739e1c16c0d3ef0796ab00ae9.png';

interface LessonIntroProps {
  category: string;
  lessonTitle: string;
  onStart: () => void;
  onClose: () => void;
}

const lessonContent: Record<string, { intro: string; explanation: string; example: string; tips: string[] }> = {
  suma: {
    intro: '¡Bienvenido a la aventura de la Suma! La suma es juntar o agregar cosas.',
    explanation: 'Cuando sumas, estás contando cuántos elementos hay en total. Por ejemplo, si tienes 3 manzanas y consigues 2 más, ahora tienes 5 manzanas.',
    example: '3 + 2 = 5',
    tips: [
      'Comienza contando con los dedos',
      'Piensa en juntar grupos de objetos',
      'El orden no importa: 3+2 es igual a 2+3',
      'Practica sumando de izquierda a derecha',
    ]
  },
  resta: {
    intro: '¡Hora de aprender la Resta! Restar es quitar o sacar cosas de un grupo.',
    explanation: 'Cuando restas, estás quitando elementos de un total. Si tienes 5 dulces y comes 2, te quedan 3 dulces.',
    example: '5 - 2 = 3',
    tips: [
      'Siempre resta el número más pequeño del más grande',
      'Puedes contar hacia atrás desde el primer número',
      'Piensa en "quitar" objetos de un grupo',
      'Si restas cero, el número no cambia',
    ]
  },
  multiplicacion: {
    intro: '¡La Multiplicación es suma rápida! Es sumar el mismo número varias veces.',
    explanation: 'Multiplicar es como tener grupos iguales. 3 × 4 significa 3 grupos de 4, o sea: 4 + 4 + 4 = 12',
    example: '3 × 4 = 12 (es lo mismo que 4 + 4 + 4)',
    tips: [
      'Memoriza las tablas del 1 al 10',
      'Cualquier número × 0 = 0',
      'Cualquier número × 1 = ese mismo número',
      'El orden no importa: 3×4 es igual a 4×3',
    ]
  },
  division: {
    intro: '¡Dividir es repartir en partes iguales!',
    explanation: 'Cuando divides, estás separando un total en grupos iguales. Si tienes 12 galletas y las repartes entre 3 amigos, cada uno recibe 4.',
    example: '12 ÷ 3 = 4',
    tips: [
      'La división es lo contrario de la multiplicación',
      'Piensa en repartir equitativamente',
      'No puedes dividir entre cero',
      'Usa las tablas de multiplicar al revés',
    ]
  },
  potencias: {
    intro: '¡Las Potencias son multiplicación poderosa!',
    explanation: 'Una potencia es multiplicar un número por sí mismo varias veces. 2³ significa 2 × 2 × 2 = 8',
    example: '2³ = 2 × 2 × 2 = 8',
    tips: [
      'El exponente indica cuántas veces multiplicas',
      'Cualquier número elevado a 1 es él mismo',
      'Cualquier número elevado a 0 es 1',
      'Memoriza los cuadrados: 2²=4, 3²=9, 4²=16',
    ]
  },
  radicacion: {
    intro: '¡La Radicación busca el número original de una potencia!',
    explanation: 'La raíz cuadrada busca qué número multiplicado por sí mismo da el resultado. √16 = 4 porque 4 × 4 = 16',
    example: '√16 = 4 (porque 4 × 4 = 16)',
    tips: [
      'La raíz cuadrada es lo contrario de elevar al cuadrado',
      'Memoriza: √4=2, √9=3, √16=4, √25=5',
      'Solo números positivos tienen raíz cuadrada real',
      'Piensa: "¿qué número multiplicado por sí mismo da este resultado?"',
    ]
  },
  polinomios: {
    intro: '¡Los Polinomios juntan números y variables!',
    explanation: 'Un polinomio es una expresión con números y letras (variables). Resolvemos sustituyendo las letras por valores y calculando.',
    example: '2(3) + 5 = 6 + 5 = 11',
    tips: [
      'Resuelve primero lo que está en paréntesis',
      'Multiplica antes de sumar o restar',
      'Agrupa términos similares',
      'Sigue el orden de operaciones: paréntesis, multiplicación, suma',
    ]
  },
};

export function LessonIntro({ category, lessonTitle, onStart, onClose }: LessonIntroProps) {
  const content = lessonContent[category] || lessonContent.suma;

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
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white drop-shadow-lg">
                {lessonTitle}
              </h2>
              <p className="text-white/90 font-bold">Preparémonos para aprender</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dragon Intro */}
          <div className="flex items-start gap-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
            <motion.img
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              src={dragonCharacter}
              alt="Draco"
              className="w-24 h-24 flex-shrink-0"
            />
            <div>
              <p className="text-lg font-bold text-gray-800 mb-2">
                ¡Hola, aventurero! Soy Draco 🔥
              </p>
              <p className="text-gray-700 font-semibold">
                {content.intro}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
              📚 ¿Cómo funciona?
            </h3>
            <p className="text-gray-700 font-semibold leading-relaxed">
              {content.explanation}
            </p>
          </div>

          {/* Example */}
          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
            <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
              💡 Ejemplo
            </h3>
            <p className="text-3xl font-black text-center text-gray-800 py-4">
              {content.example}
            </p>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
              ⭐ Consejos de Draco
            </h3>
            <ul className="space-y-2">
              {content.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border-2 border-green-200"
                >
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700 font-semibold">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-white" />
            ¡Empezar la Práctica!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
