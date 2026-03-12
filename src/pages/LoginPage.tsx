import { useState } from 'react';
import { useApp } from '../context';
import { api } from '../api';
import { t } from '../i18n';
import RegisterPage from './RegisterPage';

export default function LoginPage() {
  const { lang, setToken, setUsername, addToast } = useApp();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    if (!user || !pass) return;
    setLoading(true);
    try {
      // POST /users/token/ → { access, refresh }
      const data = await api.login(user, pass);
      setToken(data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setUsername(user);
      localStorage.setItem('username', user);
    } catch {
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#0d1117] flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative w-full max-w-md mx-4 animate-fadeIn">
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cooling System</span>
        </div>
        <div className="bg-white dark:bg-[#161b27] rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#1f2937] p-8">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t(lang, 'sign_in')}
          </h2>
          <div className="space-y-4">
            <input type="text" placeholder={t(lang, 'username')} value={user}
              onChange={e => setUser(e.target.value)}
              onFocus={() => setFocused('user')} onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
                bg-white dark:bg-[#0d1117] text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                ${focused === 'user' ? 'border-gray-800 dark:border-white ring-1 ring-gray-800 dark:ring-white' : 'border-gray-200 dark:border-[#1f2937]'}`}
            />
            <input type="password" placeholder={t(lang, 'password')} value={pass}
              onChange={e => setPass(e.target.value)}
              onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
                bg-white dark:bg-[#0d1117] text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                ${focused === 'pass' ? 'border-gray-800 dark:border-white ring-1 ring-gray-800 dark:ring-white' : 'border-gray-200 dark:border-[#1f2937]'}`}
            />
            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-[#1e2a3a] hover:bg-[#263548] text-white font-semibold py-3 rounded-lg transition-all text-sm disabled:opacity-60">
              {loading ? '...' : t(lang, 'login')}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-slate-500">
            {t(lang, 'no_account') || "Don't have an account?"}{' '}
            <button
              onClick={() => setShowRegister(true)}
              className="text-green-500 hover:text-green-600 font-semibold"
            >
              {t(lang, 'sign_up') || 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
