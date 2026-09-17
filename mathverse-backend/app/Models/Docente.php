<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    protected $table = 'docentes';

    protected $fillable = [
        'nombre',
        'apellido',
        'correo',
        'password',
        'colegio',
        'curso',
    ];

    protected $hidden = [
        'password',
    ];
}
