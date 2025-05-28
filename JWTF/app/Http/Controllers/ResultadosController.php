<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Resultados;

class ResultadosController extends Controller
{
    public function store(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(["msg" => "Usuario no encontrado"], 404);
    }

    // Buscar una partida existente sin player2_id
    $partida = Resultados::whereNull('player2_id')->first();

    if ($partida) {
        // Asignar el player2_id al segundo jugador
        $partida->player2_id = $user->id;
        $partida->save();
        event(new Resultados($partida));
        return response()->json(["Partida encontrada"], 200);
    } else {
        // Si no hay una partida disponible, crear una nueva
        $partida = new Resultados();
        $partida->player1_id = $user->id;
        $partida->save();
        event(new NuevaReparacion($partida));
    }

    return response()->json(["Partida enviada"], 200);
}

}
