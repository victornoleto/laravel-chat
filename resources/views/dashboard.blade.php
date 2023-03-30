<x-app-layout>

    {{-- <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot> --}}

    <!-- Scripts -->
    @vite([
        'resources/css/chat.css',
        'resources/js/websocket.js',
        'resources/js/chat.js'
    ])

    <div id="chat" class="shadow rounded bg-white" data-user-id="{{ Auth::id() }}">
        <div id="messages">
            <ul></ul>
        </div>
        <div id="input" class="p-6">
            <form action="">
                <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" required autofocus />
                <x-primary-button class="ml-6">Enviar</x-primary-button>
            </form>
        </div>
    </div>

</x-app-layout>
