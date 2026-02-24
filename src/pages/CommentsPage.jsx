import { commentStatuses, useAppStore } from '../context/AppStore.jsx';

function CommentsPage() {
  const {
    selectedDumpId,
    comments,
    activeCommentId,
    setActiveCommentId,
    editComment,
    setEditComment,
    loadComments,
    createComment,
    updateComment,
    deleteComment,
    busy,
  } = useAppStore();

  const handleCreate = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (form.get('text') || '').toString();
    const action = (form.get('action') || 'Draft').toString();
    const result = await createComment({ text, action });
    if (result) event.currentTarget.reset();
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    await updateComment();
  };

  return (
    <section className="split">
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Comments</p>
            <h2>Moderate comments for the selected dump</h2>
          </div>
          <button
            className="ghost"
            onClick={() => loadComments(selectedDumpId)}
            disabled={busy.comments || !selectedDumpId}
          >
            Refresh
          </button>
        </div>

        <form onSubmit={handleCreate} className="form">
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
            <button
              className="primary"
              type="submit"
              disabled={!selectedDumpId || busy.comments}
            >
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
      </div>

      <div className="panel">
        <p className="eyebrow">Editor</p>
        <h2>Update comment</h2>
        {activeCommentId ? (
          <form onSubmit={handleUpdate} className="form">
            <label className="field">
              Edit text
              <textarea
                value={editComment.text}
                onChange={(event) =>
                  setEditComment((prev) => ({
                    ...prev,
                    text: event.target.value,
                  }))
                }
                rows="5"
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
              onClick={deleteComment}
              disabled={busy.comments}
            >
              Delete comment
            </button>
          </form>
        ) : (
          <div className="empty">Select a comment to edit.</div>
        )}
      </div>
    </section>
  );
}

export default CommentsPage;
