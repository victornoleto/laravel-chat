<x-app-layout>

    {{-- <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot> --}}

    <div id="chat" class="shadow rounded" data-user-id="{{ auth()->id() }}">

        <div id="messages">
            <div class="bg"></div>
            <ul></ul>
        </div>

        <div id="input" class="p-3 bg-dark-tint">

            <form action="">

                <div class="d-flex gap-3 w-100">
                    <input id="name" type="text" name="name" class="form-control w-100" placeholder="Digite uma mensagem..." required autofocus />
                    <button type="submit" class="btn btn-dark fw-bold">Enviar</button>
                </div>

                {{-- <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" required autofocus />
                <x-primary-button class="ml-6">Enviar</x-primary-button> --}}

            </form>

        </div>
        
    </div>

</x-app-layout>
