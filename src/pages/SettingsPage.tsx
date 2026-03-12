import { useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';

export default function SettingsPage() {
  const { lang, theme, setTheme, setLang } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t(lang, 'settings')}
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500">
          Cooling System • {t(lang, 'settings')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Appearance */}
        <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t(lang, 'appearance') || 'Appearance'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Choose how Cooling System looks on this device.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 px-4 py-3 rounded-xl text-sm border transition-colors flex items-center justify-between ${
                theme === 'light'
                  ? 'bg-white dark:bg-[#0d1117] border-green-500 text-green-500'
                  : 'bg-white dark:bg-[#0d1117] border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-slate-300'
              }`}
            >
              <span>{t(lang, 'light_mode') || 'Light'}</span>
              <span className="w-4 h-4 rounded-full bg-yellow-300" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 px-4 py-3 rounded-xl text-sm border transition-colors flex items-center justify-between ${
                theme === 'dark'
                  ? 'bg-white dark:bg-[#0d1117] border-green-500 text-green-500'
                  : 'bg-white dark:bg-[#0d1117] border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-slate-300'
              }`}
            >
              <span>{t(lang, 'dark_mode') || 'Dark'}</span>
              <span className="w-4 h-4 rounded-full bg-slate-800" />
            </button>
          </div>
        </div>

        {/* Language & notifications */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t(lang, 'language')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Switch between English, French and Arabic.
            </p>
            <div className="flex items-center gap-2 mt-2">
              {['EN', 'FR', 'AR'].map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code as any)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    lang === code
                      ? 'border-green-500 text-green-500 bg-green-500/5'
                      : 'border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-slate-300 bg-white dark:bg-[#0d1117]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Control basic notification behavior inside the dashboard UI.
            </p>
            <button
              onClick={() => setNotificationsEnabled(v => !v)}
              className={`mt-3 inline-flex items-center justify-between w-full px-4 py-2 rounded-lg border text-sm transition-colors ${
                notificationsEnabled
                  ? 'border-green-500 text-green-500 bg-green-500/5'
                  : 'border-gray-200 dark:border-[#1f2937] text-gray-500 dark:text-slate-400 bg-white dark:bg-[#0d1117]'
              }`}
            >
              <span>In-app notifications</span>
              <span
                className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                  notificationsEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    notificationsEnabled ? 'translate-x-4' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

