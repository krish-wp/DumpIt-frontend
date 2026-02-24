import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const DEFAULT_API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

const AppContext = createContext(null);

export const dumpStatuses = [
  'Draft',
  'Processing',
  'Visible',
  'Review',
  'Hidden',
];
export const commentStatuses = ['Draft', 'Visible', 'Hidden'];

export function AppProvider({ children }) {
  const [apiBase, setApiBase] = useState(() => {
    return localStorage.getItem('dumpit-api-base') || DEFAULT_API_BASE;
  });
  const [sessionStatus, setSessionStatus] = useState('Not started');
  const [sessionReady, setSessionReady] = useState(false);
  const [dumps, setDumps] = useState([]);
  const [publicDumps, setPublicDumps] = useState([]);
  const [filters, setFilters] = useState({ status: '', topic: '' });
  const [selectedDumpId, setSelectedDumpId] = useState('');
  const [selectedDump, setSelectedDump] = useState(null);
  const [editDump, setEditDump] = useState({ text: '', topic: '', status: '' });
  const [comments, setComments] = useState([]);
  const [publicComments, setPublicComments] = useState({});
  const [activeCommentId, setActiveCommentId] = useState('');
  const [editComment, setEditComment] = useState({ text: '', status: '' });
  const [debug, setDebug] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState({
    session: false,
    dumps: false,
    comments: false,
  });

  const baseUrl = useMemo(() => apiBase.replace(/\/+$/, ''), [apiBase]);

  const request = useCallback(
    async (path, options = {}) => {
      const { method = 'GET', body } = options;
      const url = `${baseUrl}${path}`;

      setError('');
      const startTime = performance.now();

      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      });

      const durationMs = Math.round(performance.now() - startTime);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setDebug({
        request: { url, method, body },
        response: data,
        status: res.status,
        ok: res.ok,
        durationMs,
      });

      if (!res.ok) {
        const message = data?.message || `Request failed (${res.status})`;
        throw new Error(message);
      }

      return data;
    },
    [baseUrl],
  );

  const startSession = async () => {
    setBusy((prev) => ({ ...prev, session: true }));
    try {
      const data = await request('/session/start-session', { method: 'POST' });
      setSessionStatus(data?.message || 'Session active');
      setSessionReady(true);
    } catch (err) {
      setSessionStatus('Session failed');
      setSessionReady(false);
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, session: false }));
    }
  };

  const deleteSession = async () => {
    setBusy((prev) => ({ ...prev, session: true }));
    try {
      const data = await request('/session/delete-session', {
        method: 'DELETE',
      });
      setSessionStatus(data?.message || 'Session deleted');
      setSessionReady(false);
      setDumps([]);
      setSelectedDump(null);
      setSelectedDumpId('');
      setComments([]);
      setActiveCommentId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, session: false }));
    }
  };

  const loadDumps = async () => {
    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.topic) params.set('topic', filters.topic);
      const data = await request(`/dump?${params.toString()}`);
      setDumps(data?.dumps || []);
      if (data?.dumps?.length && !selectedDumpId) {
        setSelectedDumpId(data.dumps[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const loadPublicDumps = async () => {
    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const params = new URLSearchParams();
      if (filters.topic) params.set('topic', filters.topic);
      const data = await request(`/dump/public?${params.toString()}`);
      setPublicDumps(data?.dumps || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const loadPublicComments = async (dumpId) => {
    if (!dumpId) return;
    setBusy((prev) => ({ ...prev, comments: true }));
    try {
      const data = await request(`/dump/public/${dumpId}/comments`);
      setPublicComments((prev) => ({
        ...prev,
        [dumpId]: data?.comments || [],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, comments: false }));
    }
  };

  const getDump = async (dumpId) => {
    if (!dumpId) return;
    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const data = await request(`/dump/${dumpId}`);
      setSelectedDump(data?.dump || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const createDump = async (payload) => {
    const { text, topic, action } = payload;

    if (!text?.trim()) {
      setError('Text is required.');
      return null;
    }

    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const data = await request('/dump/', {
        method: 'POST',
        body: { text: text.trim(), topic: topic || undefined, action },
      });
      const nextDump = data?.dump;
      if (nextDump?._id) {
        setSelectedDumpId(nextDump._id);
        setSelectedDump(nextDump);
      }
      await loadDumps();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const updateDump = async () => {
    if (!selectedDumpId) {
      setError('Select a dump first.');
      return null;
    }

    const payload = {};
    const nextText = editDump.text.trim();
    const nextTopic = editDump.topic.trim();
    if (nextText && nextText !== selectedDump?.text) payload.text = nextText;
    if (nextTopic !== (selectedDump?.topic || '')) payload.topic = nextTopic;
    if (editDump.status && editDump.status !== selectedDump?.status) {
      payload.status = editDump.status;
    }

    if (!Object.keys(payload).length) {
      setError('No changes to update.');
      return null;
    }

    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const data = await request(`/dump/${selectedDumpId}`, {
        method: 'PATCH',
        body: payload,
      });
      setSelectedDump(data?.dump || selectedDump);
      await loadDumps();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const deleteDump = async (dumpId = selectedDumpId) => {
    if (!dumpId) {
      setError('Select a dump first.');
      return null;
    }

    setBusy((prev) => ({ ...prev, dumps: true }));
    try {
      const data = await request(`/dump/${dumpId}`, {
        method: 'DELETE',
      });
      if (dumpId === selectedDumpId) {
        setSelectedDump(null);
        setSelectedDumpId('');
        setComments([]);
        setActiveCommentId('');
      }
      await loadDumps();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, dumps: false }));
    }
  };

  const loadComments = async (dumpId = selectedDumpId) => {
    if (!dumpId) return;
    setBusy((prev) => ({ ...prev, comments: true }));
    try {
      const data = await request(`/dump/${dumpId}/comments`);
      setComments(data?.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy((prev) => ({ ...prev, comments: false }));
    }
  };

  const createComment = async (payload) => {
    const { text, action } = payload;

    if (!selectedDumpId) {
      setError('Select a dump first.');
      return null;
    }

    if (!text?.trim()) {
      setError('Comment text is required.');
      return null;
    }

    setBusy((prev) => ({ ...prev, comments: true }));
    try {
      const data = await request(`/dump/${selectedDumpId}/comments/`, {
        method: 'POST',
        body: { text: text.trim(), action },
      });
      await loadComments(selectedDumpId);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, comments: false }));
    }
  };

  const updateComment = async () => {
    if (!selectedDumpId || !activeCommentId) {
      setError('Select a dump and comment first.');
      return null;
    }

    const payload = {};
    const nextText = editComment.text.trim();
    if (nextText) payload.text = nextText;
    if (editComment.status) payload.status = editComment.status;

    if (!Object.keys(payload).length) {
      setError('No changes to update.');
      return null;
    }

    setBusy((prev) => ({ ...prev, comments: true }));
    try {
      const data = await request(
        `/dump/${selectedDumpId}/comments/${activeCommentId}`,
        {
          method: 'PATCH',
          body: payload,
        },
      );
      await loadComments(selectedDumpId);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, comments: false }));
    }
  };

  const deleteComment = async () => {
    if (!selectedDumpId || !activeCommentId) {
      setError('Select a dump and comment first.');
      return null;
    }

    setBusy((prev) => ({ ...prev, comments: true }));
    try {
      const data = await request(
        `/dump/${selectedDumpId}/comments/${activeCommentId}`,
        { method: 'DELETE' },
      );
      setActiveCommentId('');
      await loadComments(selectedDumpId);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy((prev) => ({ ...prev, comments: false }));
    }
  };

  useEffect(() => {
    if (selectedDumpId) {
      getDump(selectedDumpId);
      loadComments(selectedDumpId);
    }
  }, [selectedDumpId]);

  useEffect(() => {
    if (selectedDump) {
      setEditDump({
        text: selectedDump.text || '',
        topic: selectedDump.topic || '',
        status: selectedDump.status || '',
      });
    }
  }, [selectedDump]);

  useEffect(() => {
    if (!activeCommentId) return;
    const current = comments.find((comment) => comment._id === activeCommentId);
    if (current) {
      setEditComment({
        text: current.text || '',
        status: current.status || '',
      });
    }
  }, [activeCommentId, comments]);

  useEffect(() => {
    localStorage.setItem('dumpit-api-base', apiBase);
  }, [apiBase]);

  const value = {
    apiBase,
    setApiBase,
    sessionStatus,
    sessionReady,
    dumps,
    publicDumps,
    filters,
    setFilters,
    selectedDumpId,
    setSelectedDumpId,
    selectedDump,
    editDump,
    setEditDump,
    comments,
    activeCommentId,
    setActiveCommentId,
    editComment,
    setEditComment,
    debug,
    error,
    setError,
    busy,
    startSession,
    deleteSession,
    loadDumps,
    loadPublicDumps,
    loadPublicComments,
    getDump,
    publicComments,
    createDump,
    updateDump,
    deleteDump,
    loadComments,
    createComment,
    updateComment,
    deleteComment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}
