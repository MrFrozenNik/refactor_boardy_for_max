(function () {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;

    const wsUrl = feed.dataset.wsUrl;

    function connect() {
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => console.log('✅. WS connected');
        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === 'new_post') prependPost(msg.post);
            } catch (err) {
                console.error('WS parse error:', err);
            }
        };
        ws.onclose = () => setTimeout(connect, 3000);
        ws.onerror = (err) => console.error('WS error:', err);
    }

    function prependPost(post) {
        const el = document.createElement('article');
        el.className = 'card mb-3';
        el.innerHTML = `
                 <div class="card-body">
                     <h3 class="card-title">
                         <a href="/posts/${post.id}" class="text-decoration-none text-dark">
                             ${escapeHtml(post.title)}
                         </a>
                     </h3>
                    <h6 class="card-subtitle mb-2 text-muted">
                        Автор: ${escapeHtml(post.author)} •
                        ${new Date(post.created_at).toLocaleString('ru-RU', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                        })}
                    </h6>
                    <p class="card-text">${escapeHtml(post.body.substring(0, 200))}${post.body.length > 200 ? '...' : ''}</p>
                    <a href="/posts/${post.id}" class="btn btn-sm btn-outline-primary">Читать далее</a>
                </div>`;
        feed.prepend(el);
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(() => el.style.opacity = '1', 10);
    }

    function escapeHtml(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    connect();
})();
