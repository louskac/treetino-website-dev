<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
{{--        <script>--}}
{{--            (function() {--}}
{{--                const appearance = '{{ $appearance ?? "system" }}';--}}

{{--                if (appearance === 'system') {--}}
{{--                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;--}}

{{--                    if (prefersDark) {--}}
{{--                        document.documentElement.classList.add('dark');--}}
{{--                    }--}}
{{--                }--}}
{{--            })();--}}
{{--        </script>--}}

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Treetino') }}</title>
        <meta name="description" content="Treetino je patentovaný chytrý energetický strom kombinující solární listy, vertikální větrné mikroturbíny, bateriové úložiště a dobíjení elektromobilů na půdorysu pouhého 1 m².">
        <meta name="application-name" content="Treetino">
        <meta name="apple-mobile-web-app-title" content="Treetino">
        <meta name="theme-color" content="#09090b">

        <link rel="icon" href="/favicon.ico" sizes="48x48">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Treetino">
        <meta property="og:url" content="https://www.treetino.eu/">
        <meta property="og:title" content="Treetino — Chytrý energetický strom | Smart Solar &amp; Wind Energy Tree">
        <meta property="og:description" content="Patentovaný hybridní energetický strom kombinující solární a větrnou energii, bateriové úložiště a EV dobíjení na půdorysu 1 m².">
        <meta property="og:image" content="https://www.treetino.eu/og-image.jpg">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@treetino_corp">
        <meta name="twitter:title" content="Treetino — Chytrý energetický strom | Smart Solar &amp; Wind Energy Tree">
        <meta name="twitter:description" content="Patentovaný hybridní energetický strom kombinující solární a větrnou energii, bateriové úložiště a EV dobíjení na půdorysu 1 m².">
        <meta name="twitter:image" content="https://www.treetino.eu/og-image.jpg">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">

        @routes()
        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-background text-foreground">
        @inertia
    </body>
</html>
