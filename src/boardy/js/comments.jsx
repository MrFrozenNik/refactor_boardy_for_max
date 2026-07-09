const {useState, useEffect, useRef} = React;
const API = 'http://localhost:3000';
const PARENT_ID = 1;

const client = axios.create({
    baseURL: API,
    headers: {'Content-Type': 'application/json'},
});

async function apiFetch(path, {body, ...rest} = {}) {
    const res = await client.request({
        url: path,
        data: body,
        ...rest,
    });
    return res.status !== 204 ? res.data : null;
}

const CommentItem = ({item, onSave, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.body);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);


    useEffect(() => {
        return () => controllerRef.current?.abort();
    }, []);

    const startEdit = () => {
        setEditText(item.body);
        setIsEditing(true);
        setError(null);
    }

    const cancelEdit = () => {
        controllerRef.current?.abort();
        setIsEditing(false);
        setError(null);
    }

    const handleSave = async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setSaving(true);
        setError(null);
        try {
            await onSave(item.id, editText, controller.signal);
            setIsEditing(false);
        } catch (e) {
            if (axios.isCancel(e)) return;
            setError('Не удалось сохранить комментарий');
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    const handleDelete = async () => {
        if (!confirm("Удалить комментарий?")) return;
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            await onDelete(item.id, controller.signal);
        } catch (e) {
            if (axios.isCancel(e)) return;
            setError('Не удалось удалить комментарий');
            console.error(e);
        }
    }

    return (
        <div className="card mb-2">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <strong>{item.author_name}</strong>
                    <small className="text-muted">{item.created_at}</small>
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <div className="input-group">
                            <input
                                className="form-control form-control-sm"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                disabled={saving}
                            />
                            <button
                                className="btn btn-sm btn-success"
                                onClick={handleSave}
                                disabled={saving || !editText.trim()}
                            >
                                {saving ? '...' : '✓'}
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEdit}
                                disabled={saving}
                            >
                                ✕
                            </button>
                        </div>
                        {error && <div className="text-danger small mt-1">{error}</div>}
                    </div>
                ) : (
                    <div>
                        <p className="mb-1">{item.body}</p>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={startEdit}>
                            ✏️
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                            🗑️
                        </button>
                        {error && <div className="text-danger small mt-1">{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

const CommentForm = ({onSubmit}) => {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);

    useEffect(() => {
        return () => controllerRef.current?.abort();
    }, []);

    const submit = async () => {
        if (!text.trim()) return;
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setSubmitting(true);
        setError(null);
        try {
            await onSubmit(text, controller.signal);
            setText('');
        } catch (e) {
            if (axios.isCancel(e)) return;
            setError('Не удалось отправить комментарий.');
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-3">
            <div className="input-group">
                <input
                    className="form-control"
                    placeholder="Комментарий..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && submit()}
                    disabled={submitting}
                />
                <button className="btn btn-primary" onClick={submit} disabled={submitting}>
                    {submitting ? '...' : 'Отправить'}
                </button>
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}


const CommentsList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const load = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const data = await apiFetch(`/api/posts/${PARENT_ID}/comments`);
            setItems(data.items);
        } catch (e) {
            setLoadError('Не удалось загрузить комментарии.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, []);

    const handleAdd = async (text, signal) => {
        await apiFetch(`/api/posts/${PARENT_ID}/comments`, {
            method: 'POST',
            body: {body: text},
            signal,
        });
        await load();
    }

    const handleSave = async (id, body, signal) => {
        await apiFetch(`/api/comments/${id}`, {
            method: 'PUT',
            body: {body},
            signal,
        });
        await load();
    }

    const handleDelete = async (id, signal) => {
        await apiFetch(`/api/comments/${id}`, {method: 'DELETE', signal});
        await load();
    }

    if (loading) return <span className="text-muted"> Загрузка..</span>;

    return (<div>
        {loadError && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{loadError}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => load()}>
                    Повторить
                </button>
            </div>
        )}

        {items.map(item => (
            <CommentItem
                key={item.id}
                item={item}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        ))}

        <CommentForm onSubmit={handleAdd}/>
    </div>);
}

ReactDOM.createRoot(document.getElementById('app')).render(<CommentsList/>);
