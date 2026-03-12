import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { api } from '../api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const TT = { backgroundColor: '#161b27', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };
type Tab = 'solar' | 'temperature' | 'rb' | 'frequency';

export default function EnergyPage() {
  const { lang, addToast } = useApp();
  const [tab, setTab] = useState<Tab>('solar');
  const isDark = document.documentElement.classList.contains('dark');
  const ax = { fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 11 };

  // temp/SystemStat: indoor_temp, humidity, server_load, external_temp, ac_level, fans_active, hour, timestamp
  const [systemStats, setSystemStats] = useState<any[]>([]);
  // freq: time, users, signal, freq_used
  const [freqData, setFreqData] = useState<any[]>([]);
  // rbs: user_count, time_of_day, signal_strength, traffic_type, rbs
  const [rbsData, setRbsData] = useState<any[]>([]);

  useEffect(() => {
    api.getSystemStats()
      .then(d => setSystemStats(d.map((item: any) => ({
        hour: `${item.hour}:00`,
        indoor_temp: item.indoor_temp,
        external_temp: item.external_temp,
        humidity: item.humidity,
        server_load: item.server_load,
        ac_level: item.ac_level,
        fans_active: item.fans_active,
      }))))
      .catch(() => addToast('failed_to_load_data', 'error'));

    api.getFrequencyData()
      .then(d => setFreqData(d.map((item: any) => ({
        t: `T${item.time}`,
        freq_used: item.freq_used,
        signal: item.signal,
        users: item.users,
      }))))
      .catch(() => addToast('failed_to_load_data', 'error'));

    api.getRbsData()
      .then(d => setRbsData(d.map((item: any) => ({
        t: `${item.time_of_day}h`,
        rbs: item.rbs,
        signal_strength: item.signal_strength,
        user_count: item.user_count,
        traffic_type: item.traffic_type,
      }))))
      .catch(() => addToast('failed_to_load_data', 'error'));
  }, []);

  // Latest stat for summary cards
  const latest = systemStats[0] ?? {};

  const tabs: { key: Tab; label: string }[] = [
    { key: 'solar', label: t(lang, 'solar_panels') },
    { key: 'temperature', label: t(lang, 'temperature') },
    { key: 'rb', label: t(lang, 'rb_cells') },
    { key: 'frequency', label: t(lang, 'frequency') },
  ];

  return (
    <div className="p-6 space-y-5 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(lang, 'energy')}</h1>

      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl p-1 flex gap-1">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl p-6">

        {/* Solar Panels = System overview (indoor_temp + server_load) */}
        {tab === 'solar' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t(lang, 'solar_stats')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">Indoor Temperature & Server Load</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
                <XAxis dataKey="hour" tick={ax} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={ax} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={ax} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="indoor_temp" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3 }} name="Indoor Temp (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="server_load" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 3 }} name="Server Load (%)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Indoor Temp', value: `${latest.indoor_temp ?? '--'}°C`, color: 'text-red-400' },
                { label: 'Server Load', value: `${latest.server_load ?? '--'}%`, color: 'text-green-400' },
                { label: 'AC Level', value: `${latest.ac_level ?? '--'}`, color: 'text-blue-400' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 dark:bg-[#0d1117] rounded-xl p-4 border border-gray-100 dark:border-[#1f2937]">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Temperature tab: indoor + external + humidity */}
        {tab === 'temperature' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t(lang, 'temp_stats')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">Indoor Temp, External Temp & Humidity by hour</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
                <XAxis dataKey="hour" tick={ax} axisLine={false} tickLine={false} />
                <YAxis tick={ax} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Legend />
                <Line type="monotone" dataKey="indoor_temp" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3 }} name="Indoor (°C)" />
                <Line type="monotone" dataKey="external_temp" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 3 }} name="External (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {/* RB Cells: rbs + signal_strength by time_of_day */}
        {tab === 'rb' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t(lang, 'rb_stats')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">RBS & Signal Strength by time of day</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rbsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
                <XAxis dataKey="t" tick={ax} axisLine={false} tickLine={false} />
                <YAxis tick={ax} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Legend />
                <Bar dataKey="rbs" fill="#22c55e" radius={[4,4,0,0]} name="RBS" />
                <Bar dataKey="signal_strength" fill="#3b82f6" radius={[4,4,0,0]} name="Signal Strength" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* Frequency: freq_used + signal by time */}
        {tab === 'frequency' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t(lang, 'frequency')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">Frequency used & Signal by time slot</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={freqData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#f3f4f6'} />
                <XAxis dataKey="t" tick={ax} axisLine={false} tickLine={false} />
                <YAxis tick={ax} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Legend />
                <Line type="monotone" dataKey="freq_used" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 3 }} name="Freq Used" />
                <Line type="monotone" dataKey="signal" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 3 }} name="Signal" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
