<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('progresos', function (Blueprint $table) {
            $table->json('detalle_niveles')->nullable()->after('porcentaje_avance');
            $table->json('diagnostico')->nullable()->after('detalle_niveles');
            $table->json('desbloqueos')->nullable()->after('diagnostico');
            $table->string('vidas_fecha')->nullable()->after('desbloqueos');
        });
    }

    public function down(): void
    {
        Schema::table('progresos', function (Blueprint $table) {
            $table->dropColumn(['detalle_niveles', 'diagnostico', 'desbloqueos', 'vidas_fecha']);
        });
    }
};
