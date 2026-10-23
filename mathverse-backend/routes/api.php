<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\ProgresoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\ChatController;

// Estudiantes
Route::get('/estudiantes', [EstudianteController::class, 'index']);
Route::post('/estudiantes', [EstudianteController::class, 'store']);
Route::put('/estudiantes/{id}/meta-points', [EstudianteController::class, 'actualizarMetaPoints']);

// Login del estudiante (protegido contra fuerza bruta con rate limit)
Route::post('/login', [EstudianteController::class, 'login'])->middleware('throttle:5,1');

// Docentes
Route::post('/docentes', [DocenteController::class, 'store']);
// Login de docentes (protegido contra fuerza bruta con rate limit)
Route::post('/docentes/login', [DocenteController::class, 'login'])->middleware('throttle:5,1');

// Progreso del estudiante
Route::get('/progreso/{estudiante_id}', [ProgresoController::class, 'show']);
Route::put('/progreso/{estudiante_id}', [ProgresoController::class, 'update']);

// Chat con Draco (IA)
Route::post('/chat', [ChatController::class, 'chat']);
