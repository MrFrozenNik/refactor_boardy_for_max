<x-layouts.app>
    <x-slot:title>Редактировать пост</x-slot:title>

    <h1 class="mb-4">Редактировать пост</h1>

    <x-posts.form :action="route('posts.update', $post)" method="PUT" :post="$post"/>
</x-layouts.app>
