import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang, Theme, Page } from './types';

interface AppCtx {
  lang: Lang; setLang: (l: Lang) => void;
  theme: Theme; setTheme: (t: Theme) => void;
  page: Page; setPage: (p: Page) => void;
  token: string | null; setToken: (t: string | null) => void;
  username: string; setUsername: (u: string) => void;
  email: string; setEmail: (e: string) => void;
  displayName: string; setDisplayName: (v: string) => void;
  isSuperuser: boolean; setIsSuperuser: (v: boolean) => void;
  toasts: Toast[]; addToast: (msg: string, type?: 'error' | 'success') => void;
}

interface Toast { id: number; msg: string; type: 'error' | 'success'; }

const Ctx = createContext<AppCtx>(null!);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'EN');
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [page, setPage] = useState<Page>('dashboard');
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [email, setEmailState] = useState(() => localStorage.getItem('email') || '');
  const [displayName, setDisplayNameState] = useState(() => localStorage.getItem('display_name') || '');
  const [isSuperuser, setIsSuperuser] = useState(() => localStorage.getItem('superuser') === 'true');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lang', lang);
  }, [lang, theme]);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };

  const setEmail = (e: string) => {
    setEmailState(e);
    if (e) localStorage.setItem('email', e);
    else localStorage.removeItem('email');
  };

  const setDisplayName = (v: string) => {
    setDisplayNameState(v);
    if (v) localStorage.setItem('display_name', v);
    else localStorage.removeItem('display_name');
  };

  let toastId = 0;
  const addToast = (msg: string, type: 'error' | 'success' = 'error') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <Ctx.Provider value={{
      lang, setLang, theme, setTheme, page, setPage,
      token, setToken, username, setUsername,
      email, setEmail, displayName, setDisplayName,
      isSuperuser, setIsSuperuser, toasts, addToast,
    }}>
      {children}
    </Ctx.Provider>
  );
}
