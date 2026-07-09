@props(['action', 'method' => 'POST', 'post' => null])

<form action="{{ $action }}" method="POST">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    <div class="mb-3">
        <label for="title" class="form-label">Заголовок</label>
        <input type="text" name="title" id="title"
               class="form-control @error('title') is-invalid @enderror"
               value="{{ old('title', $post?->title) }}" required maxlength="200">
        @error('title')
        <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label for="body" class="form-label">Текст поста</label>
        <textarea name="body" id="body"
                  class="form-control @error('body') is-invalid @enderror"
                  rows="10" required maxlength="5000">{{ old('body', $post?->body) }}</textarea>
        @error('body')
        <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <button type="submit"
            class="btn {{ $method === 'PUT' ? 'btn-warning' : 'btn-primary' }}">
        {{ $method === 'PUT' ? 'Сохранить изменения' : 'Опубликовать' }}
    </button>

    <a href="{{ $method === 'PUT' ? route('posts.show', $post) : route('posts.index') }}"
       class="btn btn-secondary">Отмена</a>
</form>
