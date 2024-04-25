<?php

namespace App\Http\Controllers;

use App\Events\PartidaGanadaPorDesconexion;
use App\Models\Juego;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Partida;
use App\Events\NuevaReparacion;
class PartidaController extends Controller
{
    public function store(Request $request)
{
    $user = Auth::user(); // Obtener el usuario autenticado a partir del token

    if (!$user) {
        return response()->json(["msg" => "Usuario no encontrado"], 404);
    }

    // Buscar una partida existente sin player2_id
    $partida = Partida::whereNull('player2_id')->first();

    if ($partida) {
        // Asignar el player2_id al segundo jugador
        $partida->player2_id = $user->id;
        $partida->save();
        event(new NuevaReparacion($partida));
        return response()->json(["Partida encontrada"], 200);
    } else {
        // Si no hay una partida disponible, crear una nueva
        $partida = new Partida();
        $partida->player1_id = $user->id;
        $partida->save();
        event(new NuevaReparacion($partida));
    }

    return response()->json(["Partida enviada"], 200);
}

public function index(Request $request)
{
  $data=Partida::all()->toArray();
  return response()->json($data, 200);
}

public function resultados(Request $request)
{
    $user = Auth::user(); // Obtener el usuario autenticado a partir del token

    if (!$user) {
        return response()->json(["msg" => "Usuario no encontrado"], 404);
    }
    
    $partidas = Juego::with(['jugador1', 'jugador2']) // Cargar las relaciones para evitar N+1 queries
                    ->where(function($query) use ($user) {
                        $query->where('jugador1_id', $user->id)
                              ->orWhere('jugador2_id', $user->id);
                    })
                    ->where(function($query) {
                        $query->where('barcos_destruidos_jugador1', 6)
                              ->orWhere('barcos_destruidos_jugador2', 6);
                    })
                    ->get();

    $resultados = $partidas->map(function ($partida) {
        $ganador = $partida->barcos_destruidos_jugador1 > $partida->barcos_destruidos_jugador2 ? $partida->jugador1 : $partida->jugador2;
        return [
            'jugador1_nombre' => $partida->jugador1->name, // Asumiendo que el campo se llama 'name'
            'jugador2_nombre' => $partida->jugador2->name,
            'ganador_nombre' => $ganador->name,
        ];
    });

    return response()->json($resultados, 200);
}


    // Este es un ejemplo conceptual, necesitarás adaptarlo a tu lógica de aplicación
public function jugadorSeDesconecto($jugadorId, $partidaId)
{
    event(new PartidaGanadaPorDesconexion($partidaId));
}
}
