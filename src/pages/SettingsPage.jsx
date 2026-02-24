import { useAppStore } from '../context/AppStore.jsx';

function SettingsPage() {
  const { apiBase, setApiBase, debug } = useAppStore();

  return (
    <section className="grid-two">
      <div className="panel">
        <p className="eyebrow">API settings</p>
        <h2>Base URL</h2>
        <label className="field">
          Current API base
          <input
            value={apiBase}
            onChange={(event) => setApiBase(event.target.value)}
            placeholder="http://localhost:8000/api/v1"
          />
        </label>
        <p className="muted">
          Keep this set to your local backend while developing.
        </p>
      </div>

      <div className="panel log">
        <p className="eyebrow">Debug</p>
        <h2>Last API response</h2>
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </div>
    </section>
  );
}

export default SettingsPage;
