import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  commentStatuses,
  dumpStatuses,
  useAppStore,
} from '../context/AppStore.jsx';

function DumpDetailPage() {
  const {
    selectedDump,
    setSelectedDumpId,
    editDump,
    setEditDump,
    updateDump,
    deleteDump,
    comments,
    activeCommentId,
    setActiveCommentId,
    editComment,
    setEditComment,
    createComment,
    updateComment,
    deleteComment,
    busy,
  } = useAppStore();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.dumpId) {
      setSelectedDumpId(params.dumpId);
    }
  }, [params.dumpId, setSelectedDumpId]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    await updateDump();
  };

  const handleDelete = async () => {
    const result = await deleteDump();
    if (result) {
      navigate('/dumps');
    }
  };

  const handleCreateComment = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (form.get('text') || '').toString();
    const action = (form.get('action') || 'Draft').toString();
    const result = await createComment({ text, action });
    if (result) event.currentTarget.reset();
  };

  const handleUpdateComment = async (event) => {
    event.preventDefault();
    await updateComment();
  };

  const handleDeleteComment = async () => {
    await deleteComment();
  };

  if (!selectedDump) {
    return (
      <section className="panel">
        <p className="eyebrow">Dump detail</p>
        <h2>Select a dump to view details.</h2>
        <p className="muted">Go back to the dumps list and pick one.</p>
      </section>
    );
  }

  return (
    <div className="stack">
      <section className="panel detail">
        <div className="detail-head">
          <div>
            <p className="eyebrow">Dump detail</p>
            <h2>{selectedDump.topic || 'Untitled'}</h2>
          </div>
          <span
            className={`status ${selectedDump.status === 'Visible' ? 'ok' : 'idle'}`}
          >
            {selectedDump.status}
          </span>
        </div>

        <p className="detail-text">{selectedDump.text}</p>

        <form onSubmit={handleUpdate} className="form">
          <label className="field">
            Edit text
            <textarea
              value={editDump.text}
              onChange={(event) =>
                setEditDump((prev) => ({ ...prev, text: event.target.value }))
              }
              rows="5"
            />
          </label>
          <div className="field-row">
            <label className="field">
              Topic
              <input
                value={editDump.topic}
                onChange={(event) =>
                  setEditDump((prev) => ({
                    ...prev,
                    topic: event.target.value,
                  }))
                }
              />
            </label>
            <label className="field">
              Status
              <select
                value={editDump.status}
                onChange={(event) =>
                  setEditDump((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              >
                {dumpStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="primary" type="submit" disabled={busy.dumps}>
              Update dump
            </button>
            <button
              className="ghost"
              type="button"
              onClick={handleDelete}
              disabled={busy.dumps}
            >
              Delete dump
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Comments</p>
            <h2>Comment thread</h2>
          </div>
        </div>

        <form onSubmit={handleCreateComment} className="form">
          <label className="field">
            New comment
            <textarea
              name="text"
              rows="4"
              placeholder="Add a comment..."
              required
            />
          </label>
          <div className="field-row">
            <label className="field">
              Action
              <select name="action" defaultValue="Draft">
                <option>Draft</option>
                <option>Publish</option>
              </select>
            </label>
            <button className="primary" type="submit" disabled={busy.comments}>
              Add comment
            </button>
          </div>
        </form>

        <div className="list">
          {comments.length ? (
            comments.map((comment) => (
              <button
                key={comment._id}
                className={`list-item ${activeCommentId === comment._id ? 'active' : ''}`}
                onClick={() => setActiveCommentId(comment._id)}
              >
                <span className="list-title">{comment.status}</span>
                <span className="list-body">{comment.text}</span>
              </button>
            ))
          ) : (
            <div className="empty">No comments yet.</div>
          )}
        </div>

        {activeCommentId ? (
          <form onSubmit={handleUpdateComment} className="form">
            <label className="field">
              Edit comment
              <textarea
                value={editComment.text}
                onChange={(event) =>
                  setEditComment((prev) => ({
                    ...prev,
                    text: event.target.value,
                  }))
                }
                rows="4"
              />
            </label>
            <div className="field-row">
              <label className="field">
                Status
                <select
                  value={editComment.status}
                  onChange={(event) =>
                    setEditComment((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  {commentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="primary"
                type="submit"
                disabled={busy.comments}
              >
                Update comment
              </button>
            </div>
            <button
              className="ghost"
              type="button"
              onClick={handleDeleteComment}
              disabled={busy.comments}
            >
              Delete comment
            </button>
          </form>
        ) : (
          <div className="empty">Select a comment to edit.</div>
        )}
      </section>
    </div>
  );
}

export default DumpDetailPage;
