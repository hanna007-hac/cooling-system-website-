import { useApp } from '../context';
import { t } from '../i18n';
import type { Page } from '../types';
import {
  LayoutDashboard, Zap, ShieldCheck, Package, Users, ChevronLeft, User as UserIcon, Settings as SettingsIcon
} from 'lucide-react';
import { useState } from 'react';

const navItems: { key: Page; icon: React.FC<any> }[] = [
  { key: 'dashboard', icon: LayoutDashboard },
  { key: 'energy', icon: Zap },
  { key: 'security', icon: ShieldCheck },
  { key: 'material', icon: Package },
  { key: 'users', icon: Users },
  { key: 'profile', icon: UserIcon },
  { key: 'settings', icon: SettingsIcon },
];

const pageKeys: Record<Page, string> = {
  dashboard: 'dashboard',
  energy: 'energy',
  security: 'security',
  material: 'material',
  users: 'users',
  profile: 'profile',
  settings: 'settings',
};

export default function Sidebar() {
  const { lang, page, setPage, theme } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const isRTL = lang === 'AR';

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`relative flex flex-col h-screen bg-white dark:bg-[#0d1117] border-r border-gray-100 dark:border-[#1f2937] transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-gray-100 dark:border-[#1f2937] ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider leading-none">نظام التبريد</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Cooling System</span>
          </div>
        )}
        {collapsed && <span className="text-lg font-extrabold text-green-500">C</span>}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className={`absolute -right-3 top-14 bg-white dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-full p-1 shadow-sm z-10 hover:border-green-500 transition-colors ${isRTL ? '!-left-3 !right-auto' : ''}`}
      >
        <ChevronLeft size={12} className={`text-gray-500 dark:text-slate-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ key, icon: Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active
                  ? 'text-green-500 bg-green-500/10 font-semibold'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} className={active ? 'text-green-500' : ''} />
              {!collapsed && <span>{t(lang, pageKeys[key])}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
