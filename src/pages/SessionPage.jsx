import { useAppStore } from '../context/AppStore.jsx';

function SessionPage() {
  const { sessionReady, sessionStatus, startSession, deleteSession, busy } =
    useAppStore();

  return (
    <section className="grid-two">
      <div className="panel">
        <p className="eyebrow">Session control</p>
        <h2>Start or end an anonymous session</h2>
        <p className="muted">
          Sessions are required before creating or viewing dumps.
        </p>
        <div className="button-row">
          <button
            className="primary"
            onClick={startSession}
            disabled={busy.session}
          >
            {busy.session ? 'Working...' : 'Start session'}
          </button>
          <button
            className="ghost"
            onClick={deleteSession}
            disabled={busy.session}
          >
            End session
          </button>
        </div>
        <div className="status-line">
          <span>Status</span>
          <strong>{sessionStatus}</strong>
        </div>
      </div>

      <div className="panel">
        <p className="eyebrow">Session state</p>
        <div className="status-row">
          <span className={`status ${sessionReady ? 'ok' : 'idle'}`}>
            {sessionReady ? 'Active' : 'Inactive'}
          </span>
          <span className="muted">
            {sessionReady
              ? 'You can now create dumps and comments.'
              : 'Start a session to continue.'}
          </span>
        </div>
        <div className="note-card">
          <p>
            Tip: if your session expires, refresh the session before loading
            dumps again.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SessionPage;
