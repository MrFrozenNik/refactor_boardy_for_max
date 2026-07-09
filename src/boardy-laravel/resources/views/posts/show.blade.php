<x-layouts.app>
    <x-slot:title>{{ $post->title }}</x-slot:title>

    <article class="mb-4">
        <x-posts.card :post="$post"/>

        <div class="mb-4">
            @can('update', $post)
                <a href="{{ route('posts.edit', $post) }}" class="btn btn-sm btn-warning">Редактировать</a>
            @endcan

            @can('delete', $post)
                <form action="{{ route('posts.destroy', $post) }}" method="POST" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-sm btn-danger"
                            onclick="return confirm('Удалить пост?')">Удалить
                    </button>
                </form>
            @endcan

            <a href="{{ route('posts.index') }}" class="btn btn-sm btn-secondary">Назад к ленте</a>
        </div>
    </article>

    <x-comments.section :post="$post"/>
</x-layouts.app>
