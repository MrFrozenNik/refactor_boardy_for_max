<x-layouts.app>
    <x-slot:title>Создать пост</x-slot:title>

    <h1 class="mb-4">Создать новый пост</h1>

    <x-posts.form :action="route('posts.store')"/>
</x-layouts.app>
