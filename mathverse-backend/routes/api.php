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

// Login del estudiante
Route::post('/login', [EstudianteController::class, 'login']);

// Docentes
Route::post('/docentes', [DocenteController::class, 'store']);
Route::post('/docentes/login', [DocenteController::class, 'login']);

// Progreso del estudiante
Route::get('/progreso/{estudiante_id}', [ProgresoController::class, 'show']);
Route::put('/progreso/{estudiante_id}', [ProgresoController::class, 'update']);

// Chat con Draco (IA)
Route::post('/chat', [ChatController::class, 'chat']);
