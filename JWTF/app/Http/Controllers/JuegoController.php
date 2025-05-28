<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Juego;
use App\Events\ActualizacionJuego;
class JuegoController extends Controller
{
    public function index()
       {
           $juegos = Juego::all();
           return response()->json($juegos, 200);
       }

       public function store(Request $request)
       {
           $user = Auth::user(); // Obtener el usuario autenticado a partir del token

           if (!$user) {
               return response()->json(["msg" => "Usuario no encontrado"], 404);
           }

           $juego = Juego::whereNull('jugador2_id')->first();

           if ($juego) {
               // Si existe un juego sin jugador2, asignar el usuario autenticado como jugador2
               $juego->jugador2_id = $user->id;
               $juego->turno = 1;
           } else {
               // Si no existe tal juego, crear uno nuevo con el usuario autenticado como jugador1
               $juego = new Juego();
               $juego->jugador1_id = $user->id;
               // Aquí asumimos que siempre habrá un jugador2 cuando se crea un nuevo juego
               $juego->turno = 1;
           }

           $juego->save();
           event(new ActualizacionJuego($juego));

           return response()->json($juego, 201);
       }

       public function update(Request $request, $id)
       {
           $user = Auth::user(); // Obtener el usuario autenticado a partir del token

           if (!$user) {
               return response()->json(["msg" => "Usuario no encontrado"], 404);
           }

           $juego = Juego::find($id);

           if (!$juego) {
               return response()->json(['message' => 'Partida no encontrada'], 404);
           }

           // Actualizar los campos solo si se envían en la solicitud
           if ($request->has('barcos_destruidos_jugador1')) {
               $juego->barcos_destruidos_jugador1 = $request->barcos_destruidos_jugador1;
           }

           if ($request->has('barcos_destruidos_jugador2')) {
               $juego->barcos_destruidos_jugador2 = $request->barcos_destruidos_jugador2;
           }

           if ($request->has('turno')) {
               $juego->turno = $request->turno;
           }

           if ($request->has('velocidad')) {
               $juego->velocidad = $request->velocidad;
           }

           $juego->save();
           event(new ActualizacionJuego($juego));

           return response()->json($juego);
       }

}

