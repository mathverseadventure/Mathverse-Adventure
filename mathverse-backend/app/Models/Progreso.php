<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progreso extends Model
{
    protected $table = 'progresos';

    protected $fillable = [
        'estudiante_id',
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
    ];

    protected $casts = [
        'detalle_niveles' => 'array',
        'diagnostico' => 'array',
        'desbloqueos' => 'array',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }
}
