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
            'correo' => $request->correo,
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
            'estudiante' => $estudiante
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

    // LOGIN DEL ESTUDIANTE
public function login(Request $request)
{
    $request->validate([
        'correo' => 'required|email',
        'password' => 'required'
    ]);

    $estudiante = Estudiante::where('correo', $request->correo)->first();

    if (!$estudiante) {
        return response()->json([
            'message' => 'Correo no encontrado.'
        ], 404);
    }

    if (!Hash::check($request->password, $estudiante->password)) {
        return response()->json([
            'message' => 'Contraseña incorrecta.'
        ], 401);
    }

    return response()->json([
        'message' => 'Inicio de sesión exitoso.',
        'estudiante' => $estudiante
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
