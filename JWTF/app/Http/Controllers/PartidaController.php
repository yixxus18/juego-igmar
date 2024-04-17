<?php

namespace App\Http\Controllers;

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

}
