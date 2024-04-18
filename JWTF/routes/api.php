<?php


use App\Mail\ValidatorEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\DispositivosController;
use App\Http\Controllers\ReparacionesController;
use App\Http\Controllers\ReparacionDispositivoController;
use App\Http\Controllers\AccesoriosController;
use App\Http\Controllers\OrdenVentaController;
use App\Http\Controllers\OrdenVentaAccesorioController;
use App\Http\Controllers\CitasController;
use App\Http\Controllers\IngresoReparacionesController;
use App\Http\Controllers\LogHistoryController;
use App\Http\Controllers\ReportesController;
use App\Http\Controllers\PartidaController;
use App\Http\Controllers\JuegoController;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', [AuthController::class,'login'])->middleware('auth.active');
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    Route::post('refresh', 'App\Http\Controllers\AuthController@refresh');
    Route::post('me', 'App\Http\Controllers\AuthController@me');
    Route::post('register', 'App\Http\Controllers\AuthController@register');
    Route::get('activate/{user}', 'App\Http\Controllers\AuthController@activate')->name('activate')->middleware('signed');
    Route::post('verify', [AuthController::class,'verify']);
    Route::post('verificar', [AuthController::class,'verificarcodigo']);

    Route::get('get',[UserController::class,'index']);
    Route::post('post',[UserController::class,'store'])->middleware('authrole2');
    Route::delete('delete/{id}',[UserController::class,'destroy'])->middleware('authrole')->where('id','[0-9]+');
    Route::put('put/{id}',[UserController::class,'update'])->middleware('authrole2')->where('id','[0-9]+');

    Route::post('/partida', [PartidaController::class, 'store']);
    Route::get('/partida', [PartidaController::class, 'index']);


    Route::get('/juegos', [JuegoController::class, 'index']);
   Route::post('/juegos', [JuegoController::class, 'store']);

   Route::put('/juegos/{id}', [JuegoController::class, 'update']);
});



