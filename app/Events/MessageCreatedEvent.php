<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class MessageCreatedEvent implements ShouldBroadcastNow {

    use Dispatchable, InteractsWithSockets;

    public array $message;

    public function __construct(array $message) {
        $this->message = $message;
    }

    public function broadcastOn() {
        return new Channel('chat');
    }

    public function broadcastAs() {
        return 'MessageCreated';
    }

    public function broadcastWith() {
        return $this->message;
    }
}
