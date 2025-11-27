<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline style to set the HTML background color --}}
        <style>
            html {
                background-color: #ffffff;
            }
        </style>

        <title inertia>{{ config('app.name', 'macOS Icons') }}</title>
        
        {{-- SEO Meta Tags --}}
        <meta name="description" content="Download beautiful, high-quality macOS-style icons for your projects. Free icon library with modern design.">
        <meta name="keywords" content="macos icons, icons, free icons, icon library, design resources">
        <meta name="author" content="macOS Icons">
        
        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'macOS Icons') }}">
        <meta property="og:description" content="Download beautiful, high-quality macOS-style icons for your projects.">
        <meta property="og:image" content="{{ asset('logo.svg') }}">
        
        {{-- Twitter --}}
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="{{ config('app.name', 'macOS Icons') }}">
        <meta property="twitter:description" content="Download beautiful, high-quality macOS-style icons for your projects.">
        <meta property="twitter:image" content="{{ asset('logo.svg') }}">

        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}?v=2">
        <link rel="icon" type="image/png" href="{{ asset('favicon.ico') }}?v=2" sizes="32x32">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
        <meta name="theme-color" content="#000000">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
