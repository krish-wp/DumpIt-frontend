import { NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '../context/AppStore.jsx';

function AppLayout() {
  const {
    sessionReady,
    sessionStatus,
    startSession,
    deleteSession,
    busy,
    error,
    setError,
  } = useAppStore();

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="brand">
          <span className="brand-mark">DI</span>
          <div>
            <p className="brand-title">DumpIt</p>
            <p className="brand-subtitle">Anonymous notes workspace</p>
          </div>
        </div>

        <nav className="nav-rail">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/feed">Feed</NavLink>
          <NavLink to="/session">Session</NavLink>
          <NavLink to="/dumps">Dumps</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>

        <div className="side-panel">
          <p className="eyebrow">Session</p>
          <div className={`status ${sessionReady ? 'ok' : 'idle'}`}>
            {sessionReady ? 'Active' : 'Idle'}
          </div>
          <p className="muted">{sessionStatus}</p>
          <div className="button-col">
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
        </div>
      </aside>

      <div className="app-main">
        <header className="top-bar">
          <div>
            <p className="eyebrow">DumpIt Console</p>
            <h1>Structured control for anonymous dumps</h1>
          </div>
          <div className="top-actions">
            <span className="status-chip">
              {sessionReady ? 'Session ready' : 'Session required'}
            </span>
            <NavLink className="ghost" to="/settings">
              API settings
            </NavLink>
          </div>
        </header>

        {error ? (
          <div className="alert" onClick={() => setError('')}>
            <strong>Notice:</strong> {error}
            <span className="alert-close">Dismiss</span>
          </div>
        ) : null}

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
