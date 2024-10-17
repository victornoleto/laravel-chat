<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Styles -->
		<link rel="stylesheet" href="{{ asset('assets/css/vendor.min.css') }}" />
		<link rel="stylesheet" href="{{ asset('assets/css/setup.min.css') }}" />
		<link rel="stylesheet" href="{{ asset('assets/css/styles.min.css') }}" />

    </head>

    <body class="bg-dark">
        
        <main>
            {{ $slot }}
        </main>

        <script src="{{ asset('assets/js/vendor.min.js') }}"></script>
        <script src="{{ asset('assets/js/scripts.min.js') }}"></script>

        <script>
            var echoConfig = {
                broadcaster: 'reverb',
                key: @json(config('broadcasting.reverb.key')),
                wsHost: @json(config('broadcasting.reverb.host')),
                wsPort: {{ config('broadcasting.reverb.port') }},
                wssPort: {{ config('broadcasting.reverb.secure_port') }},
                enabledTransports: ['ws', 'wss'],
                forceTLS: false,
            };
            window.Echo = new Echo(echoConfig);
        </script>

    </body>
    
</html>
