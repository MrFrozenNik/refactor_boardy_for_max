<x-layouts.app>
    <x-slot:title>Лента постов</x-slot:title>

    <h1 class="mb-4">Лента постов</h1>
    <div id="posts-feed"
         data-ws-url="{{ app()->environment('production') ? 'wss://api.' . config('app.fastapi_domain') . '/ws' : 'ws://localhost:8000/ws' }}">
        @forelse ($posts as $post)
            <x-posts.card :post="$post" :excerpt="true"/>
        @empty
            <div class="alert alert-info">Постов пока нет.</div>
        @endforelse
    </div>

    <div class="d-flex justify-content-center mt-4">
        {{ $posts->links() }}
    </div>

    <x-slot:scripts>
        @vite('resources/js/posts/websocket.js')
    </x-slot:scripts>
</x-layouts.app>
