<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'estudiantes';

    protected $fillable = [
        'nombre',
        'apellido',
        'correo',
        'password',
        'edad',
        'grado',
        'avatar',
        'meta_points',
    ];

    protected $hidden = [
        'password'
    ];

    public function progreso()
    {
        return $this->hasOne(Progreso::class);
    }
}