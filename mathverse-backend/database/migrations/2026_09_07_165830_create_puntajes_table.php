<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puntajes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('estudiante_id')
                ->constrained('estudiantes')
                ->onDelete('cascade');

            $table->foreignId('nivel_id')
                ->constrained('nivels')
                ->onDelete('cascade');

            $table->integer('puntos');

            $table->integer('estrellas')->default(0);

            $table->integer('tiempo');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puntajes');
    }
};
