<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NuevaReparacion implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $partida;

    public function __construct($partida)
    {
        $this->partida = $partida;
    }

    public function broadcastOn()
    {
        return new Channel('nuevapartida');
    }
}