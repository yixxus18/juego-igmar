<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('juegos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jugador1_id')->nullable()->constrained("users"); 
            $table->foreignId('jugador2_id')->nullable()->constrained("users"); 
            $table->integer('barcos_destruidos_jugador1')->default(0);
            $table->integer('barcos_destruidos_jugador2')->default(0);
            $table->boolean('turno')->default(1);
            $table->integer('velocidad')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('juegos');
    }
};
