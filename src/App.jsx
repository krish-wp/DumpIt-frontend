import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppStore.jsx';
import AppLayout from './components/AppLayout.jsx';
import Home from './pages/Home.jsx';
import FeedPage from './pages/FeedPage.jsx';
import SessionPage from './pages/SessionPage.jsx';
import DumpsPage from './pages/DumpsPage.jsx';
import DumpDetailPage from './pages/DumpDetailPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/dumps" element={<DumpsPage />} />
            <Route path="/dumps/:dumpId" element={<DumpDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
