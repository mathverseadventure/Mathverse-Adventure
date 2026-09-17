<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progresos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('estudiante_id')
                ->constrained('estudiantes')
                ->onDelete('cascade');

            $table->integer('nivel_actual')->default(1);
            $table->integer('mundo_actual')->default(1);

            $table->integer('experiencia')->default(0);
            $table->integer('vidas')->default(5);
            $table->integer('monedas')->default(0);

            $table->decimal('porcentaje_avance', 5, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progresos');
    }
};