<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nivel extends Model
{
    protected $table = 'nivels';

    protected $fillable = [
        'nombre',
        'tema',
        'mundo',
        'orden',
        'dificultad',
        'imagen'
    ];

    public function preguntas()
    {
        return $this->hasMany(Pregunta::class);
    }

    public function puntajes()
    {
        return $this->hasMany(Puntaje::class);
    }
}