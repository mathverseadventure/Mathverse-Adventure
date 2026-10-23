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
            'correo' => strtolower(trim($request->correo)),
            'password' => Hash::make($request->password),
            'colegio' => $request->colegio,
            'curso' => $request->curso,
        ]);

        return response()->json([
            'mensaje' => 'Docente registrado correctamente',
            'docente' => $docente->makeHidden(['password']),
        ], 201);
    }

    // LOGIN DE DOCENTES SEGURO
    public function login(Request $request)
    {
        // 1. Validación estricta en el servidor
        $credentials = $request->validate([
            'correo' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $correo = strtolower(trim($credentials['correo']));
        $docente = Docente::where('correo', $correo)->first();

        // 2. Prevención de enumeración de usuarios y Timing Attacks
        $dummyHash = '$2y$10$e8w8G18QZf9vH9k/72gOteJ.gqV7t972827182819281928192819';
        $passwordMatches = $docente
            ? Hash::check($credentials['password'], $docente->password)
            : Hash::check($credentials['password'], $dummyHash);

        if (!$docente || !$passwordMatches) {
            return response()->json([
                'message' => 'Credenciales inválidas. Verifique su correo y contraseña.',
            ], 401);
        }

        // 3. Regeneración de sesión contra Session Fixation
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // 4. Retornar datos ocultando contraseña
        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'docente' => $docente->makeHidden(['password']),
        ]);
    }
}
