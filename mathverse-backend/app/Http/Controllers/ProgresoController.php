<?php

namespace App\Http\Controllers;

use App\Models\Progreso;
use Illuminate\Http\Request;

class ProgresoController extends Controller
{
    public function show($estudiante_id)
    {
        $progreso = Progreso::where('estudiante_id', $estudiante_id)->first();

        if (!$progreso) {
            return response()->json([
                'message' => 'Progreso no encontrado.',
            ], 404);
        }

        return response()->json($progreso);
    }

    public function update(Request $request, $estudiante_id)
    {
        $progreso = Progreso::where('estudiante_id', $estudiante_id)->firstOrFail();

        $progreso->update($request->only([
            'nivel_actual',
            'mundo_actual',
            'experiencia',
            'vidas',
            'monedas',
            'porcentaje_avance',
            'detalle_niveles',
            'diagnostico',
            'desbloqueos',
            'vidas_fecha',
        ]));

        return response()->json([
            'message' => 'Progreso actualizado correctamente.',
            'progreso' => $progreso,
        ]);
    }
}
