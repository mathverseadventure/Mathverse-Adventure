/**
 * Servicio y utilidades de progresión y validación para MathVerse Adventure.
 * Centraliza la regla de negocio del 70% de aciertos para aprobación y desbloqueo de niveles.
 */

export const PASSING_THRESHOLD = 70; // 70% de aciertos mínimos requeridos

export interface ValidationResult {
  isCorrect: boolean;
  userAnswer: number | string;
  correctAnswer: number | string;
  cssClass: 'correcto' | 'incorrecto';
  feedbackText: string;
}

/**
 * Valida una respuesta de ejercicio matemático y devuelve metadatos de retroalimentación
 * @param userAnswer Respuesta ingresada por el estudiante
 * @param correctAnswer Respuesta correcta esperada
 */
export function validateAnswer(
  userAnswer: number | string,
  correctAnswer: number | string
): ValidationResult {
  const isCorrect = Number(userAnswer) === Number(correctAnswer);

  return {
    isCorrect,
    userAnswer,
    correctAnswer,
    cssClass: isCorrect ? 'correcto' : 'incorrecto',
    feedbackText: isCorrect
      ? '¡Correcto! ¡Excelente trabajo!'
      : `Incorrecto. La respuesta correcta es ${correctAnswer}.`,
  };
}

/**
 * Calcula el porcentaje de precisión redondeado
 */
export function calculateAccuracy(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

/**
 * Determina si un porcentaje de aciertos aprueba el nivel
 */
export function isPassingAccuracy(accuracy: number): boolean {
  return accuracy >= PASSING_THRESHOLD;
}

/**
 * Calcula las estrellas asignadas en función de la precisión
 * 3 estrellas: >= 90%
 * 2 estrellas: >= 80%
 * 1 estrella:  >= 70% (Aprobado)
 * 0 estrellas: < 70%  (Reprobado, requiere reintento)
 */
export function calculateStars(accuracy: number): number {
  if (accuracy >= 90) return 3;
  if (accuracy >= 80) return 2;
  if (accuracy >= PASSING_THRESHOLD) return 1;
  return 0;
}

/**
 * Verifica estrictamente si una lección/nivel está desbloqueada para el estudiante.
 *
 * Reglas:
 * 1. El nivel 1 siempre está desbloqueado por defecto.
 * 2. Si el nivel está dentro de los niveles desbloqueados por diagnóstico o progresión previa, está desbloqueado.
 * 3. Si el nivel anterior (nivel - 1) fue completado con al menos el 70% de aciertos, el nivel actual se desbloquea.
 * 4. En cualquier otro caso, permanece bloqueado.
 */
export function isLessonUnlocked(
  categoryId: string,
  lessonLevel: number,
  themeUnlocks: Record<string, number> = {},
  userProgress: Record<string, Record<number, { completed?: boolean; accuracy?: number }>> = {}
): boolean {
  // El Nivel 1 siempre es accesible
  if (lessonLevel <= 1) return true;

  // Desbloqueado registrado en themeUnlocks (ej. por prueba diagnóstica o progreso guardado)
  const maxUnlocked = themeUnlocks[categoryId] ?? 1;
  if (lessonLevel <= maxUnlocked) return true;

  // Verificación del nivel previo: debe estar completado con al menos 70% de aciertos
  const previousLevel = userProgress[categoryId]?.[lessonLevel - 1];
  if (
    previousLevel &&
    previousLevel.completed &&
    (previousLevel.accuracy ?? 0) >= PASSING_THRESHOLD
  ) {
    return true;
  }

  return false;
}
