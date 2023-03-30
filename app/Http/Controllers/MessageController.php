<?php

namespace App\Http\Controllers;

use App\Events\MessageCreatedEvent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller {

    /**
     * Retrieve last messages
     *
     * @return \Illuminate\Http\Response
     */
    public function get(): Response {

        $messages = Message::with('user')
            ->orderBy('created_at', 'desc')
            //->inRandomOrder()
            ->limit(10)
            ->get();

        return response($messages);
    }

    /**
     * Store a menssage
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request) {

        $contents = $request->getContent();

        $data = json_decode($contents, true);

        if (json_last_error() != JSON_ERROR_NONE) {
            return response('Invalid response', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $validator = Validator::make($data, [
            'text' => ['required', 'string', 'max:100']
        ]);

        if ($validator->fails()) {
            return response($validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        Log::debug(get_class($this), $data);

        $message = Message::create([
            'user_id' => Auth::id(),
            'text' => $data['text']
        ]);

        // Carregar relacionamento
        $message->user;

        MessageCreatedEvent::dispatch($message->toArray());
    }
}
