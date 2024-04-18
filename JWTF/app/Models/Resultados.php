<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resultados extends Model
{
    use HasFactory;

    protected $table = 'resultados'; // Asegúrate de que el nombre de la tabla sea correcto
    protected $timestamps = false;
    protected $fillable = ['jugador1_id', 'jugador2_id', 'ganador_id']; // Atributos que se pueden asignar masivamente

    // Relación con el modelo User para el jugador 1
    public function jugador1()
    {
        return $this->belongsTo(User::class, 'jugador1_id');
    }

    // Relación con el modelo User para el jugador 2
    public function jugador2()
    {
        return $this->belongsTo(User::class, 'jugador2_id');
    }

    // Relación con el modelo User para el ganador
    public function ganador()
    {
        return $this->belongsTo(User::class, 'ganador_id');
    }
}
