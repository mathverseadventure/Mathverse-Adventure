<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Puntaje extends Model
{
    protected $table = 'puntajes';

    protected $fillable = [
        'estudiante_id',
        'nivel_id',
        'puntos',
        'estrellas',
        'tiempo'
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function nivel()
    {
        return $this->belongsTo(Nivel::class);
    }
}