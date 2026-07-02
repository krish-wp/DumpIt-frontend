import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '../context/AppStore.jsx';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    sessionReady,
    sessionStatus,
    startSession,
    deleteSession,
    busy,
    error,
    setError,
  } = useAppStore();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-shell">
      <button
        className="hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`side-nav ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">DI</span>
          <div>
            <p className="brand-title">DumpIt</p>
            <p className="brand-subtitle">Anonymous notes workspace</p>
          </div>
        </div>

        <nav className="nav-rail">
          <NavLink to="/" end onClick={() => setSidebarOpen(false)}>
            Overview
          </NavLink>
          <NavLink to="/feed" onClick={() => setSidebarOpen(false)}>
            Feed
          </NavLink>
          <NavLink to="/session" onClick={() => setSidebarOpen(false)}>
            Session
          </NavLink>
          <NavLink to="/dumps" onClick={() => setSidebarOpen(false)}>
            Dumps
          </NavLink>
          <NavLink to="/settings" onClick={() => setSidebarOpen(false)}>
            Settings
          </NavLink>
        </nav>

        <div className="side-spacer" />

        <div className="side-panel">
          <div className="side-panel-header">
            <p className="eyebrow">Session</p>
            <div className={`status ${sessionReady ? 'ok' : 'idle'}`}>
              {sessionReady ? 'Active' : 'Idle'}
            </div>
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
