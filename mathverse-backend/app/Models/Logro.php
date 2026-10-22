<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logro extends Model
{
    protected $table = 'logros';

    protected $fillable = [
        'estudiante_id',
        'nombre',
        'descripcion',
        'desbloqueado',
        'fecha_desbloqueo'
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }
}