<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nivels', function (Blueprint $table) {
            $table->id();

            $table->string('nombre');
            $table->string('tema');

            $table->integer('mundo');
            $table->integer('orden');

            $table->enum('dificultad', ['Fácil', 'Media', 'Difícil']);

            $table->string('imagen')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nivels');
    }
};