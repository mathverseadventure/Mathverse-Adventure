<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DocenteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'correo' => 'required|email|unique:docentes,correo',
            'password' => 'required|string|min:6',
            'colegio' => 'required|string|max:255',
            'curso' => 'required|string|max:100',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'apellido.required' => 'El apellido es obligatorio.',
            'correo.required' => 'El correo es obligatorio.',
            'correo.email' => 'El correo no es válido.',
            'correo.unique' => 'Este correo ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'colegio.required' => 'El colegio es obligatorio.',
            'curso.required' => 'El curso es obligatorio.',
        ]);

        $docente = Docente::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => $request->correo,
            'password' => Hash::make($request->password),
            'colegio' => $request->colegio,
            'curso' => $request->curso,
        ]);

        return response()->json([
            'mensaje' => 'Docente registrado correctamente',
            'docente' => $docente,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'password' => 'required',
        ]);

        $docente = Docente::where('correo', $request->correo)->first();

        if (!$docente) {
            return response()->json([
                'message' => 'Correo no encontrado.',
            ], 404);
        }

        if (!Hash::check($request->password, $docente->password)) {
            return response()->json([
                'message' => 'Contraseña incorrecta.',
            ], 401);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'docente' => $docente,
        ]);
    }
}
