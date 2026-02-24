import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dumpStatuses, useAppStore } from '../context/AppStore.jsx';

function DumpsPage() {
  const {
    dumps,
    filters,
    setFilters,
    loadDumps,
    busy,
    createDump,
    deleteDump,
    selectedDumpId,
    setSelectedDumpId,
  } = useAppStore();
  const [section, setSection] = useState('my');

  const handleSectionChange = (nextSection) => {
    setSection(nextSection);
    if (nextSection !== 'my') {
      setSelectedDumpId('');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (form.get('text') || '').toString();
    const topic = (form.get('topic') || '').toString();
    const action = (form.get('action') || 'Draft').toString();
    const result = await createDump({ text, topic, action });
    if (result) event.currentTarget.reset();
  };

  const handleDeleteDump = async (event, dumpId) => {
    event.preventDefault();
    event.stopPropagation();
    await deleteDump(dumpId);
  };

  return (
    <div className="stack">
      <div className="tab-row">
        <button
          className={`tab ${section === 'my' ? 'active' : ''}`}
          type="button"
          onClick={() => handleSectionChange('my')}
        >
          My dumps
        </button>
        <button
          className={`tab ${section === 'post' ? 'active' : ''}`}
          type="button"
          onClick={() => handleSectionChange('post')}
        >
          Post dump
        </button>
      </div>

      {section === 'my' ? (
        <div className="stack">
          <div className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">My dumps</p>
                <h2>Browse and filter dumps</h2>
              </div>
              <button
                className="ghost"
                onClick={loadDumps}
                disabled={busy.dumps}
              >
                Refresh
              </button>
            </div>

            <div className="filters">
              <label className="field">
                Status
                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="">All</option>
                  {dumpStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Topic
                <input
                  value={filters.topic}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      topic: event.target.value,
                    }))
                  }
                  placeholder="e.g. Focus"
                />
              </label>
            </div>

            <div className="list">
              {dumps.length ? (
                dumps.map((dump) => (
                  <div
                    key={dump._id}
                    className={`list-item ${
                      selectedDumpId === dump._id ? 'active' : ''
                    }`}
                  >
                    <Link
                      className="feed-link"
                      to={`/dumps/${dump._id}`}
                      onClick={() => setSelectedDumpId(dump._id)}
                    >
                      <span className="list-title">
                        {dump.topic || 'Untitled'}
                      </span>
                      <span className="list-meta">{dump.status}</span>
                      <span className="list-body">
                        {dump.text?.slice(0, 120) || 'No text'}
                        {dump.text?.length > 120 ? '...' : ''}
                      </span>
                    </Link>
                    <button
                      className="ghost"
                      type="button"
                      onClick={(event) => handleDeleteDump(event, dump._id)}
                      disabled={busy.dumps}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty">No dumps yet.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="panel">
          <p className="eyebrow">Post dump</p>
          <h2>New dump</h2>
          <form onSubmit={handleCreate} className="form">
            <label className="field">
              Text
              <textarea
                name="text"
                rows="7"
                placeholder="Write the dump..."
                required
              />
            </label>
            <label className="field">
              Topic
              <input name="topic" placeholder="Optional tag" />
            </label>
            <label className="field">
              Action
              <select name="action" defaultValue="Draft">
                <option>Draft</option>
                <option>Publish</option>
              </select>
            </label>
            <button className="primary" type="submit" disabled={busy.dumps}>
              {busy.dumps ? 'Saving...' : 'Save dump'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DumpsPage;
