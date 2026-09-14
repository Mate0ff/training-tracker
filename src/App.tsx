import { HashRouter } from 'react-router-dom';
import { AppShell } from './components';
import { AppRoutes } from './routes';

function App() {
  return (
    <HashRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </HashRouter>
  );
}

export default App;
