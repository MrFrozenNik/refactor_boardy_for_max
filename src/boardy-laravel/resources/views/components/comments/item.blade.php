@props(['comment'])

<div class="card mb-2">
    <div class="card-body">
        <p class="card-text mb-1">{{ $comment->body }}</p>
        <small class="text-muted">
            <strong>{{ $comment->author->name }}</strong> •
            {{ $comment->created_at->format('d.m.Y H:i') }}
        </small>
    </div>
</div>
