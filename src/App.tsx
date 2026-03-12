import { useApp } from './context';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EnergyPage from './pages/EnergyPage';
import SecurityPage from './pages/SecurityPage';
import MaterialPage from './pages/MaterialPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';

function PageContent() {
  const { page } = useApp();
  switch (page) {
    case 'dashboard': return <DashboardPage />;
    case 'energy': return <EnergyPage />;
    case 'security': return <SecurityPage />;
    case 'material': return <MaterialPage />;
    case 'users': return <UsersPage />;
    case 'profile': return <ProfilePage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardPage />;
  }
}

export default function App() {
  const { token } = useApp();
  if (!token) return <><LoginPage /><Toast /></>;
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0d1117]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <PageContent />
        </main>
      </div>
      <Toast />
    </div>
  );
}
