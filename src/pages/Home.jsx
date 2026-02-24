import { useAppStore } from '../context/AppStore.jsx';

function Home() {
  const { sessionReady, sessionStatus, dumps, comments } = useAppStore();

  return (
    <section className="grid-two">
      <div className="panel hero-card">
        <p className="eyebrow">Welcome</p>
        <h2>Keep dumps private until you are ready to publish.</h2>
        <p className="muted">
          This workspace is split into clear flows: session control, dump
          creation, and comment moderation.
        </p>
        <div className="status-row">
          <span className={`status ${sessionReady ? 'ok' : 'idle'}`}>
            {sessionReady ? 'Session active' : 'Session idle'}
          </span>
          <span className="muted">{sessionStatus}</span>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Snapshot</p>
        <div className="stat-grid">
          <div className="stat">
            <p className="stat-label">Dumps loaded</p>
            <p className="stat-value">{dumps.length}</p>
          </div>
          <div className="stat">
            <p className="stat-label">Comments loaded</p>
            <p className="stat-value">{comments.length}</p>
          </div>
          <div className="stat">
            <p className="stat-label">Active session</p>
            <p className="stat-value">{sessionReady ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
