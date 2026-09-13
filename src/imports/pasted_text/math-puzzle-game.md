*PROMPT*

Diseña un *puzzle matemático interactivo* para estudiantes. El objetivo es que el jugador elija correctamente entre dos números o resultados matemáticos siguiendo una instrucción que cambia en cada ronda.

### 1. Acceso al juego

* Debe existir *un ícono o botón principal* que permita ingresar al puzzle desde la plataforma.

### 2. Pantalla de inicio

Debe mostrar:

* *Título del juego*
* *Instrucciones claras de cómo se juega*
* Explicación breve de:

  * Elegir entre dos números o resultados.
  * Seguir la instrucción superior (mayor o menor).
  * Uso del botón *igual* si ambos valores son iguales.
  * Uso del botón *descartar* si el jugador no puede resolver la operación.
* Botón *"Iniciar juego"*

### 3. Mecánica del juego

El puzzle funciona de la siguiente manera:

1. En la parte superior aparece un *título aleatorio* que indica la regla de la ronda:

   * *"Elegir el número mayor"* → el título debe mostrarse en *color rojo*.
   * *"Elegir el número menor"* → el título debe mostrarse en *color azul*.

2. Debajo aparecen *dos números o resultados matemáticos* entre los que el jugador debe elegir.

Ejemplo:

* 12 vs 10

Si la instrucción es *mayor, el jugador debe elegir **12*.
Si la instrucción es *menor, debe elegir **10*.

3. A medida que el jugador avanza, los números se reemplazan por *operaciones matemáticas*.

Ejemplos:

* 5 + 3 vs 10 − 1
* 6 × 2 vs 15 − 1
* 20 ÷ 2 vs 7 + 5

### 4. Operaciones matemáticas

Las operaciones disponibles son:

* suma (+)
* resta (−)
* multiplicación (×)
* división (÷)

Las operaciones *dependen de los módulos matemáticos habilitados para el estudiante en la plataforma*.
Solo deben aparecer las operaciones que el estudiante tenga activadas.

### 5. Caso especial

Si ambos resultados son iguales:

Ejemplo:

* 6 + 2 vs 10 − 2

Debe aparecer un *botón especial llamado "Igual"* que el jugador puede presionar.

### 6. Botón descartar

Debe existir un botón *"Descartar"*.

Reglas:

* Permite saltar una operación que el jugador no puede resolver.
* Solo se puede usar *hasta 5 veces durante la partida*.
aqui generas una barra indicando cuantas ya has descartado para que el estudiante lo pueda visualizar

### 7. Tiempo de juego

* El jugador tiene *1 minuto y 30 segundos (90 segundos)* para completar la mayor cantidad de rondas posibles.

### 8. Pantalla final

Cuando se acaba el tiempo aparece una pantalla con:

* *Puntaje final*
* *Número de respuestas correctas*
* *Número de errores*
* Botón *"Volver a jugar"*
* Botón *"Salir del juego"*

### 9. Flujo completo del juego

El flujo debe ser:

1. Ícono de acceso al puzzle
2. Pantalla de inicio con instrucciones
3. Ejecución del juego (rondas de selección)
4. Pantalla final con resultados y opciones