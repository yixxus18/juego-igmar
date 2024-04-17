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
    Schema::create('partida', function (Blueprint $table) {
        $table->id();
        $table->foreignId('player1_id')->constrained("users");
        $table->foreignId('player2_id')->nullable()->constrained("users"); // Asegúrate de usar () después de nullable
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
{
    Schema::dropIfExists("partida");
}
};
