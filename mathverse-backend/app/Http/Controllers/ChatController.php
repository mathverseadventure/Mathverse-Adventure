<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Mensaje canónico y amable cuando el usuario pregunta algo fuera del dominio matemático.
     */
    private const OFF_TOPIC_REPLY = "¡Hola! Soy Draco, tu asistente de MathVerse. Solo puedo ayudarte con dudas de matemáticas de quinto grado (suma, resta, multiplicación, división, potencias, raíces o polinomios). ¡Pregúntame algo de eso!";

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = trim($request->message);

        // CONDICIÓN EXACTA: Detección estricta de consultas fuera del dominio de matemáticas
        // Si el usuario pregunta de moda, deportes, historia, etc., responder ÚNICAMENTE el mensaje de restricción
        if (!$this->isMathQuery($userMessage)) {
            return response()->json([
                'reply' => self::OFF_TOPIC_REPLY,
            ]);
        }

        $apiKey = env('OPENAI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'reply' => $this->fallbackMathReply($userMessage),
            ]);
        }

        try {
            $response = Http::withToken($apiKey)
                ->timeout(30)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
                    'temperature' => 0.3,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => "Eres Draco, el dragón tutor de matemáticas de MathVerse Adventure para niños de quinto de primaria (10-11 años) en español.\n"
                                . "REGLA CRÍTICA:\n"
                                . "1. Solo respondes preguntas estrictamente matemáticas (suma, resta, multiplicación, división, potencias, radicación/raíces cuadradas o polinomios básicos).\n"
                                . "2. Si la pregunta NO es de matemáticas (por ejemplo moda, música, videojuegos, chistes, deportes, ciencias u otros temas), debes responder EXACTAMENTE y de forma única:\n"
                                . "'" . self::OFF_TOPIC_REPLY . "'\n"
                                . "3. NUNCA respondas con la plantilla de 'Cómo resolver un problema' ni el ejemplo de las cajas si la pregunta no es matemática.\n"
                                . "4. Si la pregunta SÍ es matemática, responde con:\n"
                                . "   - Explicación conceptual clara (1-2 oraciones sencillas)\n"
                                . "   - Pasos ordenados paso a paso\n"
                                . "   - Ejemplo numérico concreto resuelto\n"
                                . "   - Un ejercicio corto para practicar\n"
                                . "5. Mantén un tono alegre, pedagógico, sin emojis y en español claro.",
                        ],
                        [
                            'role' => 'user',
                            'content' => $userMessage,
                        ],
                    ],
                ]);

            if (!$response->successful()) {
                Log::warning('OpenAI chat error', ['status' => $response->status(), 'body' => $response->body()]);
                return response()->json([
                    'reply' => $this->fallbackMathReply($userMessage),
                ]);
            }

            $reply = data_get($response->json(), 'choices.0.message.content');

            return response()->json([
                'reply' => $reply ?: $this->fallbackMathReply($userMessage),
            ]);
        } catch (\Throwable $e) {
            Log::error('Chat AI exception', ['error' => $e->getMessage()]);

            return response()->json([
                'reply' => $this->fallbackMathReply($userMessage),
            ]);
        }
    }

    /**
     * Condición exacta para determinar si la consulta del usuario pertenece al dominio matemático.
     * Evalúa operadores, expresiones numéricas y palabras clave de los 7 módulos de 5° grado.
     */
    private function isMathQuery(string $message): bool
    {
        $lower = mb_strtolower(trim($message));

        // 1. Detección de operaciones aritméticas directas (ej. "2+2", "45 * 3", "100 / 5", "3^2")
        if (preg_match('/[0-9]+\s*[\+\-\*\/×÷\^=]\s*[0-9]+/', $lower)) {
            return true;
        }

        // 2. Símbolos matemáticos explícitos
        $mathSymbols = ['+', '-', '×', '÷', '*', '/', '=', '√', '^', '²', '³', '≤', '≥'];
        foreach ($mathSymbols as $symbol) {
            if (str_contains($lower, $symbol)) {
                return true;
            }
        }

        // 3. Vocabulario de los 7 módulos de MathVerse Adventure para 5to de primaria
        $mathKeywords = [
            // Módulo 1: Suma
            'suma', 'sumar', 'adicion', 'adición', 'sumando', 'sumados',
            // Módulo 2: Resta
            'resta', 'restar', 'sustraccion', 'sustracción', 'diferencia', 'prestando', 'minuendo', 'sustraendo',
            // Módulo 3: Multiplicación
            'multiplica', 'multiplicar', 'multiplicacion', 'multiplicación', 'producto', 'factor', 'factores', 'tabla del', 'tablas',
            // Módulo 4: División
            'divisi', 'dividir', 'division', 'división', 'cociente', 'residuo', 'resto', 'divisor', 'dividendo', 'repartir',
            // Módulo 5: Potencias
            'potencia', 'potencias', 'potenciacion', 'potenciación', 'exponente', 'base de la potencia', 'elevado al', 'al cuadrado', 'al cubo',
            // Módulo 6: Radicación
            'radicacion', 'radicación', 'raiz', 'raíz', 'raices', 'raíces', 'raiz cuadrada', 'raíz cuadrada', 'raiz cubica', 'raíz cúbica', 'radical',
            // Módulo 7: Polinomios
            'polinomio', 'polinomios', 'monomio', 'monomios', 'binomio', 'trinomio', 'algebra', 'álgebra', 'variable', 'incognita', 'incógnita', 'ecuacion', 'ecuación', 'termino semejante', 'término semejante',
            // Términos generales de la materia de matemáticas
            'matematica', 'matemática', 'matematicas', 'matemáticas', 'math',
            'numero', 'número', 'numeros', 'números', 'cifra', 'cifras',
            'calculo', 'cálculo', 'calcular', 'operacion', 'operación', 'operaciones',
            'fraccion', 'fracción', 'fracciones', 'decimal', 'decimales', 'porcentaje',
            'geometria', 'geometría', 'perimetro', 'perímetro', 'area', 'área',
        ];

        foreach ($mathKeywords as $keyword) {
            if (str_contains($lower, $keyword)) {
                return true;
            }
        }

        // 4. Preguntas con números combinadas con solicitud de cálculo ("cuánto es", "resultado de", etc.)
        if (preg_match('/[0-9]+/', $lower)) {
            $calcTriggers = ['cuanto', 'cuánto', 'resultado', 'resolver', 'calcula', 'dar'];
            foreach ($calcTriggers as $trigger) {
                if (str_contains($lower, $trigger)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Respuestas deterministas pedagógicas para los 7 módulos matemáticos.
     * Si por algún motivo no se identifica una operación concreta pero es matemática,
     * orienta al estudiante en los 7 temas sin usar ejemplos confusos como el de las cajas.
     */
    private function fallbackMathReply(string $message): string
    {
        $lower = mb_strtolower($message);

        // 1. SUMA
        if (str_contains($lower, 'suma') || str_contains($lower, '+')) {
            return "Idea clara: La suma junta dos o más cantidades para obtener un total.\n\n"
                . "Pasos:\n"
                . "1. Alinea los números por unidades, decenas y centenas.\n"
                . "2. Suma de derecha a izquierda.\n"
                . "3. Si una columna suma 10 o más, anota las unidades y lleva las decenas a la siguiente columna.\n\n"
                . "Ejemplo: 145 + 234 = 379.\n\n"
                . "Practica: ¿Cuánto es 328 + 154?";
        }

        // 2. RESTA
        if (str_contains($lower, 'resta') || str_contains($lower, '-')) {
            return "Idea clara: La resta quita una cantidad menor de una mayor para hallar la diferencia.\n\n"
                . "Pasos:\n"
                . "1. Coloca el número mayor arriba (minuendo).\n"
                . "2. Resta de derecha a izquierda (unidades, decenas, etc.).\n"
                . "3. Si el dígito de arriba es menor que el de abajo, pídele 1 prestado a la columna vecina izquierda.\n\n"
                . "Ejemplo: 96 - 42 = 54.\n\n"
                . "Practica: ¿Cuánto es 85 - 38?";
        }

        // 3. MULTIPLICACIÓN
        if (str_contains($lower, 'multiplica') || str_contains($lower, '×') || str_contains($lower, 'x') || str_contains($lower, '*')) {
            return "Idea clara: La multiplicación es sumar un mismo número varias veces de forma abreviada.\n\n"
                . "Pasos:\n"
                . "1. Identifica los factores.\n"
                . "2. Multiplica las unidades por cada dígito superior.\n"
                . "3. Si multiplicas por dos cifras, deja un espacio a la derecha y suma los productos parciales.\n\n"
                . "Ejemplo: 7 × 8 = 56 (equivale a sumar 7 ocho veces).\n\n"
                . "Practica: ¿Cuánto es 12 × 5?";
        }

        // 4. DIVISIÓN
        if (str_contains($lower, 'divisi') || str_contains($lower, '÷') || str_contains($lower, '/')) {
            return "Idea clara: La división reparte una cantidad en partes exactamente iguales.\n\n"
                . "Pasos:\n"
                . "1. Observa cuántas veces cabe el divisor en el dividendo.\n"
                . "2. Multiplica y resta para encontrar el residuo.\n"
                . "3. Baja la siguiente cifra y repite el procedimiento.\n\n"
                . "Ejemplo: 48 ÷ 6 = 8 (porque 6 × 8 = 48).\n\n"
                . "Practica: ¿Cuánto es 72 ÷ 9?";
        }

        // 5. POTENCIAS
        if (str_contains($lower, 'potencia') || str_contains($lower, 'exponente') || str_contains($lower, 'elevado') || str_contains($lower, '^')) {
            return "Idea clara: Una potencia expresa la multiplicación repetida de un mismo número.\n\n"
                . "Pasos:\n"
                . "1. Identifica la base (número a multiplicar) y el exponente (cuántas veces multiplicarlo).\n"
                . "2. Multiplica la base por sí misma tantas veces como diga el exponente.\n\n"
                . "Ejemplo: 3² = 3 × 3 = 9. O 2³ = 2 × 2 × 2 = 8.\n\n"
                . "Practica: ¿Cuánto resulta 4²?";
        }

        // 6. RADICACIÓN / RAÍCES
        if (str_contains($lower, 'raiz') || str_contains($lower, 'raíz') || str_contains($lower, 'radica') || str_contains($lower, '√')) {
            return "Idea clara: La raíz cuadrada es la operación inversa de elevar al cuadrado; busca qué número multiplicado por sí mismo da el radicando.\n\n"
                . "Pasos:\n"
                . "1. Observa el número dentro del radical.\n"
                . "2. Pregúntate: '¿Qué número multiplicado por sí mismo da este valor?'.\n\n"
                . "Ejemplo: √64 = 8 porque 8 × 8 = 64.\n\n"
                . "Practica: ¿Cuál es la raíz cuadrada de 49 (√49)?";
        }

        // 7. POLINOMIOS / ÁLGEBRA
        if (str_contains($lower, 'polinomio') || str_contains($lower, 'monomio') || str_contains($lower, 'variable') || str_contains($lower, 'algebra') || str_contains($lower, 'álgebra') || str_contains($lower, 'ecuacion') || str_contains($lower, 'ecuación')) {
            return "Idea clara: Un polinomio combina números y letras (variables) con operaciones matemáticas.\n\n"
                . "Pasos:\n"
                . "1. Identifica los términos que tienen la misma variable (términos semejantes).\n"
                . "2. Suma o resta los coeficientes de esos términos.\n"
                . "3. Si tienes un valor numérico para la variable, reemplázala y resuelve las operaciones.\n\n"
                . "Ejemplo: Si x = 4, entonces 2x + 5 = 2(4) + 5 = 8 + 5 = 13.\n\n"
                . "Practica: Si x = 3, ¿cuánto es 3x + 2?";
        }

        // Si la pregunta tiene términos matemáticos generales pero no un tema específico
        return "Idea clara: En matemáticas de quinto grado resolvemos operaciones paso a paso con orden y lógica.\n\n"
            . "Dime con cuál de estos temas deseas que te ayude hoy:\n"
            . "• Suma o Resta\n"
            . "• Multiplicación o División\n"
            . "• Potencias o Raíces Cuadradas\n"
            . "• Polinomios y Ecuaciones Básicas";
    }
}
