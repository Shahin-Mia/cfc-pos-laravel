<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- PWA  -->
    <meta name="theme-color" content="#ff5f00" />
    <link rel="apple-touch-icon" href="{{ asset('storage/images/cfc-logo.png') }}">
    <link rel="manifest" href="{{ asset('/manifest.json') }}">

    <!-- favicon -->
    <link rel="icon" href="{{asset('favicon.png')}}" type="image/x-icon">

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia


    <script src="{{ asset('/sw.js') }}">
    </script>
    <script>
        if ("serviceWorker" in navigator) {
            // Register a service worker hosted at the root of the
            // site using the default scope.
            navigator.serviceWorker.register("/sw.js").then(
                (registration) => {
                    console.log("Service worker registration succeeded:", registration);
                },
                (error) => {
                    console.error(`Service worker registration failed: ${error}`);
                },
            );
        } else {
            console.error("Service workers are not supported.");
        }
    </script>
    <!-- Block right click -->
    {{-- <script>
        document.addEventListener('contextmenu', event => event.preventDefault());
    </script>
    
    <!-- Block keyboard shortcuts -->
    <script>
        document.onkeydown = function(e) {
            if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
                return false;
            }
        };
    </script> --}}

</body>

</html>