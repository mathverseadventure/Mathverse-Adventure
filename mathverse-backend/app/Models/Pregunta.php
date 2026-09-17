<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    protected $table = 'preguntas';

    protected $fillable = [
        'nivel_id',
        'enunciado',
        'tipo',
        'imagen'
    ];

    public function nivel()
    {
        return $this->belongsTo(Nivel::class);
    }

    public function respuestas()
    {
        return $this->hasMany(Respuesta::class);
    }
}