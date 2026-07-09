@props(['post', 'excerpt' => false])

<article class="card mb-3">
    <div class="card-body">
        <h3 class="card-title">
            <a href="{{ route('posts.show', $post) }}" class="text-decoration-none text-dark">
                {{ $post->title }}
            </a>
        </h3>
        <h6 class="card-subtitle mb-2 text-muted">
            Автор: {{ $post->author->name }} •
            {{ $post->created_at->format('d.m.Y H:i') }}
        </h6>
        <p class="card-text" @style(['white-space: pre-wrap' => !$excerpt])>
            {{ $excerpt ? Str::limit($post->body, 200) : nl2br(e($post->body)) }}
        </p>
        @if ($excerpt)
            <a href="{{ route('posts.show', $post) }}" class="btn btn-sm btn-outline-primary">Читать далее</a>
        @endif
    </div>
</article>
