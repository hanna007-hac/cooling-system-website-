import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { api } from '../api';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const TT = { backgroundColor: '#161b27', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

function MiniCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl p-5">
      <h3 className="font-bold text-gray-900 dark:text-white text-base">{title}</h3>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">{subtitle}</p>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { lang, username, displayName, addToast } = useApp();
  const isDark = document.documentElement.classList.contains('dark');
  const ax = { fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 };

  // temp → { indoor_temp, humidity, server_load, external_temp, ac_level, fans_active, hour, timestamp }
  const [tempData, setTempData] = useState<any[]>([]);
  // freq → { time, users, signal, freq_used }
  const [freqData, setFreqData] = useState<any[]>([]);
  // rbs → { user_count, time_of_day, signal_strength, traffic_type, rbs }
  const [rbsData, setRbsData] = useState<any[]>([]);
  // logs → all fields
  const [logsData, setLogsData] = useState<any[]>([]);
  // material → { id, name, last_maintenance, next_maintenance, status, time_left }
  const [matData, setMatData] = useState<any[]>([]);

  useEffect(() => {
    // Temperature chart: x=hour, y=indoor_temp
    api.getSystemStats()
      .then(d => setTempData(
        d.slice(-10).map((item: any) => ({
          t: item.hour !== undefined ? `${item.hour}:00` : new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          indoor_temp: item.indoor_temp,
          external_temp: item.external_temp,
        }))
      ))
      .catch(() => addToast('Failed to load temperature data', 'error'));

    // Frequency chart: x=time, y=freq_used
    api.getFrequencyData()
      .then(d => setFreqData(
        d.slice(-8).map((item: any) => ({
          t: `T${item.time}`,
          freq_used: item.freq_used,
          signal: item.signal,
          users: item.users,
        }))
      ))
      .catch(() => addToast('Failed to load frequency data', 'error'));

    // RBS chart: x=time_of_day, y=rbs
    api.getRbsData()
      .then(d => setRbsData(
        d.slice(-8).map((item: any) => ({
          t: `${item.time_of_day}h`,
          rbs: item.rbs,
          signal_strength: item.signal_strength,
        }))
      ))
      .catch(() => addToast('Failed to load RBS data', 'error'));

    // Logs/security: group by day
    api.getLogs()
      .then(d => setLogsData(
        d.slice(-7).map((item: any) => ({
          day: item.timestamp ? new Date(item.timestamp).toLocaleDateString([], { weekday: 'short' }) : '-',
          v: 1,
        }))
      ))
      .catch(() => addToast('Failed to load logs', 'error'));

    // Material: stock status
    api.getMaterialList()
      .then(d => setMatData(
        d.slice(-6).map((item: any) => ({
          name: item.name,
          time_left: item.time_left,
          status: item.status,
        }))
      ))
      .catch(() => addToast('Failed to load materials', 'error'));
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(lang, 'dashboard')}</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500">
          {t(lang, 'welcome')}{' '}
          <span className="text-gray-700 dark:text-slate-300 font-medium">
            {displayName || username}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Indoor vs External Temperature */}
        <MiniCard title={t(lang, 'temperature')} subtitle="Indoor vs External (°C)">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
              <XAxis dataKey="t" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Line type="monotone" dataKey="indoor_temp" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Indoor" />
              <Line type="monotone" dataKey="external_temp" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} name="External" />
            </LineChart>
          </ResponsiveContainer>
        </MiniCard>

        {/* Frequency */}
        <MiniCard title={t(lang, 'frequency')} subtitle="freq_used by time slot">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={freqData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
              <XAxis dataKey="t" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="freq_used" fill="#22c55e" radius={[3,3,0,0]} name="Frequency Used" />
            </BarChart>
          </ResponsiveContainer>
        </MiniCard>

        {/* RBS */}
        <MiniCard title={t(lang, 'rb_cells')} subtitle="RBS by time of day">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rbsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
              <XAxis dataKey="t" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="rbs" fill="#3b82f6" radius={[3,3,0,0]} name="RBS" />
            </BarChart>
          </ResponsiveContainer>
        </MiniCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Security logs */}
        <MiniCard title={t(lang, 'security')} subtitle="Recent security events">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={logsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
              <XAxis dataKey="day" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="v" fill="#ef4444" radius={[3,3,0,0]} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        </MiniCard>

        {/* Material time_left */}
        <MiniCard title={t(lang, 'material')} subtitle="Days until next maintenance">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={matData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
              <XAxis dataKey="name" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="time_left" fill="#22c55e" radius={[3,3,0,0]} name="Days Left" />
            </BarChart>
          </ResponsiveContainer>
        </MiniCard>
      </div>
    </div>
  );
}
