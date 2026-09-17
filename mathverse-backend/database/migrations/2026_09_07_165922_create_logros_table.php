<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logros', function (Blueprint $table) {
            $table->id();

            $table->foreignId('estudiante_id')
                ->constrained('estudiantes')
                ->onDelete('cascade');

            $table->string('nombre');

            $table->text('descripcion');

            $table->boolean('desbloqueado')->default(false);

            $table->timestamp('fecha_desbloqueo')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logros');
    }
};