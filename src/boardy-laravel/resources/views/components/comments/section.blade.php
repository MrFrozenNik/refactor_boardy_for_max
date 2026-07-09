@props(['post'])

<section>
    <h3 class="mb-4">Комментарии ({{ $post->comments->count() }})</h3>

    @auth
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Оставить комментарий</h5>
                <form action="{{ route('comments.store') }}" method="POST">
                    @csrf
                    <input type="hidden" name="post_id" value="{{ $post->id }}">
                    <div class="mb-3">
                             <textarea name="body"
                                       class="form-control @error('body') is-invalid @enderror"
                                       rows="3" placeholder="Ваш комментарий..."
                                       required>{{ old('body') }}</textarea>
                        @error('body')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <button type="submit" class="btn btn-primary">Отправить комментарий</button>
                </form>
            </div>
        </div>
    @else
        <div class="alert alert-info">
            <a href="{{ route('login') }}">Войдите</a>, чтобы комментировать.
        </div>
    @endauth

    @forelse ($post->comments as $comment)
        <x-comments.item :comment="$comment"/>
    @empty
        <p class="text-muted">Комментариев пока нет.</p>
    @endforelse
</section>
