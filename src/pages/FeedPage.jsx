import { useEffect, useState } from 'react';
import { useAppStore } from '../context/AppStore.jsx';

function FeedPage() {
  const {
    publicDumps,
    filters,
    setFilters,
    loadPublicDumps,
    loadPublicComments,
    publicComments,
    busy,
  } = useAppStore();
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setFilters((prev) => ({ ...prev, status: '', topic: prev.topic || '' }));
  }, [setFilters]);

  useEffect(() => {
    loadPublicDumps();
  }, [filters.topic, loadPublicDumps]);

  const toggleComments = async (dumpId) => {
    setExpanded((prev) => ({ ...prev, [dumpId]: !prev[dumpId] }));
    if (!publicComments[dumpId]) {
      await loadPublicComments(dumpId);
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Feed</p>
          <h2>Visible dumps</h2>
        </div>
        <button
          className="ghost"
          onClick={loadPublicDumps}
          disabled={busy.dumps}
        >
          Refresh
        </button>
      </div>

      <div className="list">
        {publicDumps.length ? (
          publicDumps.map((dump) => (
            <div key={dump._id} className="list-item">
              <div className="feed-link">
                <span className="list-title">{dump.topic || 'Untitled'}</span>
                <span className="list-meta">{dump.status}</span>
                <span className="list-body">
                  {dump.text?.slice(0, 180) || 'No text'}
                  {dump.text?.length > 180 ? '...' : ''}
                </span>
              </div>
              <button
                className="ghost feed-toggle"
                type="button"
                onClick={() => toggleComments(dump._id)}
                disabled={busy.comments}
              >
                {expanded[dump._id] ? 'Hide comments' : 'Show comments'}
              </button>
              {expanded[dump._id] ? (
                <div className="feed-comments">
                  {(publicComments[dump._id] || []).length ? (
                    publicComments[dump._id].slice(0, 3).map((comment) => (
                      <p key={comment._id} className="feed-comment">
                        {comment.text}
                      </p>
                    ))
                  ) : (
                    <p className="feed-comment muted">No comments yet.</p>
                  )}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="empty">No visible dumps yet.</div>
        )}
      </div>
    </section>
  );
}

export default FeedPage;
