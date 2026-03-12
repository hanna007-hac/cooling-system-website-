import { useState } from 'react';
import { useApp } from '../context';
import { api } from '../api';
import { t } from '../i18n';

export default function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { lang, addToast } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) return;
    setLoading(true);
    try {
      await api.register({ username, email, password });
      addToast('Account created successfully. You can now log in.', 'success');
      onSwitchToLogin();
    } catch {
      addToast('Registration failed. Please check the data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#0d1117] flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative w-full max-w-md mx-4 animate-fadeIn">
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cooling System</span>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {t(lang, 'create_account') || 'Create a new account'}
          </p>
        </div>
        <div className="bg-white dark:bg-[#161b27] rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#1f2937] p-8">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t(lang, 'sign_up') || 'Sign up'}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t(lang, 'username')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
                bg-white dark:bg-[#0d1117] text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                border-gray-200 dark:border-[#1f2937]"
            />
            <input
              type="email"
              placeholder={t(lang, 'email') || 'Email'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
                bg-white dark:bg-[#0d1117] text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                border-gray-200 dark:border-[#1f2937]"
            />
            <input
              type="password"
              placeholder={t(lang, 'password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all
                bg-white dark:bg-[#0d1117] text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                border-gray-200 dark:border-[#1f2937]"
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-[#1e2a3a] hover:bg-[#263548] text-white font-semibold py-3 rounded-lg transition-all text-sm disabled:opacity-60"
            >
              {loading ? '...' : (t(lang, 'sign_up') || 'Sign up')}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-slate-500">
            {t(lang, 'have_account') || 'Already have an account?'}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-500 hover:text-green-600 font-semibold"
            >
              {t(lang, 'sign_in') || 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

