import { useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';

export default function ProfilePage() {
  const {
    lang,
    username,
    email,
    displayName,
    setDisplayName,
    setEmail,
    setToken,
    setPage,
  } = useApp();

  const [nameInput, setNameInput] = useState(displayName || username);
  const [emailInput, setEmailInput] = useState(email);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setDisplayName(nameInput.trim());
    setEmail(emailInput.trim());
    setTimeout(() => {
      setSaving(false);
    }, 300);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    setPage('dashboard');
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t(lang, 'profile')}
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500">
          Cooling System • {t(lang, 'profile')}
        </p>
      </div>

      {/* Header card with avatar */}
      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6 flex items-center gap-4 max-w-2xl">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">
          {(displayName || username || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400 dark:text-slate-500">
            {t(lang, 'welcome')} to Cooling System
          </p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayName || username || '-'}
          </h2>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {email || 'No email set'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Account information */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t(lang, 'account_information') || 'Account information'}
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">
                {t(lang, 'username')}
              </label>
              <input
                disabled
                value={username}
                className="bg-gray-50/80 dark:bg-[#0d1117] border border-gray-200 dark:border-[#1f2937] rounded-lg px-3 py-2 text-gray-700 dark:text-slate-200 text-sm cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                Login username (managed by the backend).
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">
                Display name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#1f2937] rounded-lg px-3 py-2 text-gray-800 dark:text-slate-200 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-slate-400">
                {t(lang, 'email') || 'Email'}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#1f2937] rounded-lg px-3 py-2 text-gray-800 dark:text-slate-200 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger / actions */}
        <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Session
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
              Log out from Cooling System on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/60 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

