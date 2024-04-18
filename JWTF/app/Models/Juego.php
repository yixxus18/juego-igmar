<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Juego extends Model
{
    use HasFactory;

    protected $table = 'juegos';
    protected $fillable = ['jugador1_id', 'jugador2_id', 'barcos_destruidos_jugador1', 'barcos_destruidos_jugador2', 'turno','velocidad'];
}
