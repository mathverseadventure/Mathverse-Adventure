<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\Progreso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EstudianteController extends Controller
{
    // Mostrar todos los estudiantes
    public function index()
    {
        return Estudiante::all();
    }

    // Registrar un estudiante
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'apellido' => 'required',
            'correo' => 'required|email|unique:estudiantes',
            'password' => 'required|min:6',
            'edad' => 'required',
            'grado' => 'required'
        ]);

        $estudiante = Estudiante::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => strtolower(trim($request->correo)),
            'password' => Hash::make($request->password),
            'edad' => $request->edad,
            'grado' => $request->grado,
            'avatar' => $request->avatar
        ]);

        // Crear progreso automáticamente
        Progreso::create([
            'estudiante_id' => $estudiante->id,
            'vidas' => 20,
            'vidas_fecha' => now()->toDateString(),
        ]);

        return response()->json([
            'mensaje' => 'Estudiante registrado correctamente',
            'estudiante' => $estudiante->makeHidden(['password'])
        ], 201);
    }

    // Mostrar un estudiante
    public function show(string $id)
    {
        return Estudiante::findOrFail($id);
    }

    // Actualizar
    public function update(Request $request, string $id)
    {
        $estudiante = Estudiante::findOrFail($id);

        $estudiante->update($request->all());

        return response()->json($estudiante);
    }

    // Eliminar
    public function destroy(string $id)
    {
        Estudiante::destroy($id);

        return response()->json([
            'mensaje' => 'Estudiante eliminado'
        ]);
    }

    // LOGIN DEL ESTUDIANTE SEGURO
    public function login(Request $request)
    {
        // 1. Validación estricta en el servidor
        $credentials = $request->validate([
            'correo' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $correo = strtolower(trim($credentials['correo']));
        $estudiante = Estudiante::where('correo', $correo)->first();

        // 2. Prevención de enumeración de usuarios y Timing Attacks
        // Usamos un hash falso para que el tiempo de respuesta sea constante incluso si el correo no existe
        $dummyHash = '$2y$10$e8w8G18QZf9vH9k/72gOteJ.gqV7t972827182819281928192819';
        $passwordMatches = $estudiante
            ? Hash::check($credentials['password'], $estudiante->password)
            : Hash::check($credentials['password'], $dummyHash);

        if (!$estudiante || !$passwordMatches) {
            return response()->json([
                'message' => 'Credenciales inválidas. Verifique su correo y contraseña.'
            ], 401);
        }

        // 3. Regeneración de sesión contra Session Fixation (si hay sesión activa)
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // 4. Retornar datos ocultando contraseña
        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'estudiante' => $estudiante->makeHidden(['password'])
        ]);
    }

    public function actualizarMetaPoints(Request $request, $id)
    {
        $request->validate([
            'meta_points' => 'required|integer|min:1'
        ]);

        $estudiante = Estudiante::findOrFail($id);

        // Sumar las monedas ganadas al total del estudiante.
        $estudiante->meta_points += $request->meta_points;

        $estudiante->save();

        return response()->json([
            'mensaje' => 'Meta Points actualizados correctamente.',
            'meta_points' => $estudiante->meta_points
        ]);
    }
}
