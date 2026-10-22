<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = trim($request->message);

        if ($this->looksNonMath($userMessage)) {
            return response()->json([
                'reply' => "¡Hola! Soy Draco y solo puedo ayudarte con matemáticas de quinto de primaria. "
                    . "Pregúntame sobre suma, resta, multiplicación, división, potencias, raíces o polinomios. "
                    . "Si quieres hablar de ciencias u otro tema, mejor pregunta a tu docente.",
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
                    'temperature' => 0.4,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => "Eres Draco, un dragón amable que enseña matemáticas a niños de quinto de primaria (10-11 años) en español.\n"
                                . "REGLAS ESTRICTAS:\n"
                                . "1. Solo respondes preguntas de matemáticas (suma, resta, multiplicación, división, potencias, raíces, polinomios básicos).\n"
                                . "2. Si preguntan de otro tema (ciencias, historia, etc.), di claramente que solo ayudas con matemáticas.\n"
                                . "3. Estructura SIEMPRE tu respuesta así:\n"
                                . "   - Idea clara (1-2 oraciones)\n"
                                . "   - Pasos numerados sencillos\n"
                                . "   - Un ejemplo con números\n"
                                . "   - Una pregunta corta para practicar\n"
                                . "4. Usa lenguaje simple, motivador y sin emojis.\n"
                                . "5. No inventes datos ni hables de temas no matemáticos.",
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

    private function looksNonMath(string $message): bool
    {
        $lower = mb_strtolower($message);
        $nonMath = [
            'ciencia', 'ciencias naturales', 'biología', 'biologia', 'química', 'quimica',
            'física', 'fisica', 'historia', 'geografía', 'geografia', 'inglés', 'ingles',
            'español', 'espanol', 'literatura', 'deportes', 'fútbol', 'futbol',
        ];

        foreach ($nonMath as $word) {
            if (str_contains($lower, $word)) {
                $mathHints = ['suma', 'resta', 'multiplica', 'divisi', 'número', 'numero', 'fracción', 'fraccion', 'potencia', 'raíz', 'raiz', 'polinomio', 'ecuación', 'ecuacion'];
                foreach ($mathHints as $hint) {
                    if (str_contains($lower, $hint)) {
                        return false;
                    }
                }
                return true;
            }
        }

        return false;
    }

    private function fallbackMathReply(string $message): string
    {
        $lower = mb_strtolower($message);

        if (str_contains($lower, 'suma') || str_contains($lower, '+')) {
            return "Idea clara: La suma junta cantidades.\n\n"
                . "Pasos:\n1. Escribe los números alineados.\n2. Suma de derecha a izquierda.\n3. Si llega a 10 o más, lleva 1 a la siguiente columna.\n\n"
                . "Ejemplo: 48 + 27 = 75.\n\n"
                . "Practica: ¿Cuánto es 56 + 39?";
        }

        if (str_contains($lower, 'resta') || str_contains($lower, '-')) {
            return "Idea clara: La resta quita una cantidad de otra.\n\n"
                . "Pasos:\n1. Coloca el número mayor arriba.\n2. Resta columna por columna.\n3. Si no alcanza, pide prestado a la izquierda.\n\n"
                . "Ejemplo: 82 - 47 = 35.\n\n"
                . "Practica: ¿Cuánto es 91 - 58?";
        }

        if (str_contains($lower, 'multiplica') || str_contains($lower, '×') || str_contains($lower, 'x')) {
            return "Idea clara: Multiplicar es sumar el mismo número varias veces.\n\n"
                . "Pasos:\n1. Recuerda la tabla.\n2. Multiplica por cada cifra.\n3. Suma los resultados parciales.\n\n"
                . "Ejemplo: 12 × 4 = 48.\n\n"
                . "Practica: ¿Cuánto es 15 × 6?";
        }

        if (str_contains($lower, 'divisi') || str_contains($lower, '÷')) {
            return "Idea clara: Dividir es repartir en partes iguales.\n\n"
                . "Pasos:\n1. Pregunta cuántas veces cabe el divisor.\n2. Multiplica y resta.\n3. Baja la siguiente cifra si hace falta.\n\n"
                . "Ejemplo: 56 ÷ 7 = 8.\n\n"
                . "Practica: ¿Cuánto es 72 ÷ 8?";
        }

        return "¡Hola! Soy Draco y te ayudo solo con matemáticas de quinto.\n\n"
            . "Estructura para resolver un problema:\n1. Lee con calma.\n2. Identifica la operación.\n3. Haz el cálculo paso a paso.\n4. Revisa tu respuesta.\n\n"
            . "Ejemplo: Si tienes 3 cajas con 12 lápices, 3 × 12 = 36 lápices.\n\n"
            . "Pregúntame sobre suma, resta, multiplicación, división, potencias, raíces o polinomios.";
    }
}
