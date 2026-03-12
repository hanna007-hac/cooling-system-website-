import { useState, useRef, useEffect } from 'react';
import { Bell, Sun, Moon, User, ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../context';
import { t } from '../i18n';
import type { Lang } from '../types';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'FR', label: 'Français' },
  { code: 'EN', label: 'English' },
  { code: 'AR', label: 'العربية' },
];

export default function Topbar() {
  const { lang, setLang, theme, setTheme, username, setToken, setPage, addToast } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    setPage('dashboard');
  };

  const triggerSearch = () => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return;

    if (q.includes('dash')) setPage('dashboard');
    else if (q.includes('energy')) setPage('energy');
    else if (q.includes('secur')) setPage('security');
    else if (q.includes('material') || q.includes('mat')) setPage('material');
    else if (q.includes('user')) setPage('users');
    else if (q.includes('profile')) setPage('profile');
    else if (q.includes('setting')) setPage('settings');
    else addToast('No matching section found.', 'error');
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#0d1117] border-b border-gray-100 dark:border-[#1f2937] sticky top-0 z-20">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t(lang, 'search')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && triggerSearch()}
          className="bg-gray-50 dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-lg px-4 py-2 pl-9 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-green-500 w-56 transition-all"
        />
        <svg className="absolute left-3 top-2.5 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Bell / Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-xl shadow-xl py-1.5 w-72 z-50 animate-fadeIn">
              <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                Notifications
              </p>
              <div className="max-h-60 overflow-y-auto text-sm">
                <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <p className="text-gray-800 dark:text-slate-200">
                    Cooling System is running normally.
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-slate-500">Just now</p>
                </div>
                <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <p className="text-gray-800 dark:text-slate-200">
                    No new security alerts detected.
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-slate-500">Today</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? t(lang, 'light_mode') : t(lang, 'dark_mode')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setShowLang(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-semibold"
          >
            <Globe size={14} />
            {lang}
          </button>
          {showLang && (
            <div className="absolute right-0 top-10 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-xl shadow-xl py-1.5 w-36 z-50 animate-fadeIn">
              <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                {t(lang, 'language')}
              </p>
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLang(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
                    ${lang === l.code
                      ? 'text-green-500 bg-green-500/5 font-semibold'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
          >
            <User size={16} />
            <span className="font-medium hidden sm:block max-w-[120px] truncate">{username}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-10 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-xl shadow-xl py-1.5 w-44 z-50 animate-fadeIn">
              <button
                onClick={() => { setPage('profile'); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <User size={14} /> {t(lang, 'profile')}
              </button>
              <button
                onClick={() => { setPage('settings'); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                {t(lang, 'settings')}
              </button>
              <div className="border-t border-gray-100 dark:border-[#1f2937] my-1" />
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                {t(lang, 'logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
