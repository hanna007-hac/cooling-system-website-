import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { api } from '../api';

type Tab = 'rfid' | 'alerts' | 'stats';

function Badge({ value, trueLabel = 'active', falseLabel = 'inactive' }: { value: boolean | string; trueLabel?: string; falseLabel?: string }) {
  const isTrue = value === true || value === 'true' || value === 'active' || value === 'critical' || value === 'warning';
  const colorMap: Record<string, string> = {
    critical: 'bg-red-900/40 text-red-400',
    warning: 'bg-orange-900/40 text-orange-400',
    active: 'bg-green-900/40 text-green-400',
    inactive: 'bg-gray-800 text-gray-400',
  };
  const strVal = String(value);
  const cls = colorMap[strVal] ?? (isTrue ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400');
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>{strVal}</span>;
}

export default function SecurityPage() {
  const { lang, addToast } = useApp();
  const [tab, setTab] = useState<Tab>('rfid');
  // rfid fields: id_rfid, name, last_access, is_active
  const [rfidList, setRfidList] = useState<any[]>([]);
  // logs fields: __all__ (id, timestamp, + whatever fields LogEntry has)
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.getRfidList()
      .then(d => setRfidList(d))
      .catch(() => addToast('Failed to load RFID data', 'error'));

    api.getLogs()
      .then(d => setLogs(d))
      .catch(() => addToast('Failed to load security logs', 'error'));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'rfid', label: t(lang, 'rfid_users') },
    { key: 'alerts', label: t(lang, 'theft_alerts') },
    { key: 'stats', label: t(lang, 'stats') },
  ];

  return (
    <div className="p-6 space-y-5 animate-fadeIn" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(lang, 'security')}</h1>

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

        {/* RFID Users: id_rfid, name, last_access, is_active */}
        {tab === 'rfid' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{t(lang, 'rfid_users')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">RFID Access Control</p>
            {rfidList.length === 0
              ? <p className="text-center text-gray-400 dark:text-slate-600 py-12 text-sm">No RFID users found</p>
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#1f2937]">
                      {['id_rfid', 'name', 'last_access', 'is_active'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rfidList.map((u: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">{u.id_rfid}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-slate-200">{u.name}</td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400 text-xs">
                          {u.last_access ? new Date(u.last_access).toLocaleString() : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge value={u.is_active ? 'active' : 'inactive'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </>
        )}

        {/* Logs / Alerts: all fields from LogEntry */}
        {tab === 'alerts' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{t(lang, 'theft_alerts')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">{t(lang, 'security_notifs')}</p>
            {logs.length === 0
              ? <p className="text-center text-gray-400 dark:text-slate-600 py-12 text-sm">No alerts found</p>
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#1f2937]">
                      {['ID', 'Timestamp', ...Object.keys(logs[0] ?? {}).filter(k => k !== 'id' && k !== 'timestamp').slice(0, 4)].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">{log.id}</td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400 text-xs">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                        </td>
                        {Object.keys(log).filter(k => k !== 'id' && k !== 'timestamp').slice(0, 4).map(k => (
                          <td key={k} className="py-3.5 px-4 text-gray-600 dark:text-slate-400">
                            {typeof log[k] === 'boolean'
                              ? <Badge value={log[k] ? 'active' : 'inactive'} />
                              : String(log[k] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </>
        )}

        {/* Stats */}
        {tab === 'stats' && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total RFID Users', value: rfidList.length, color: 'text-blue-400' },
              { label: 'Active RFID', value: rfidList.filter((r: any) => r.is_active).length, color: 'text-green-400' },
              { label: 'Total Log Entries', value: logs.length, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 dark:bg-[#0d1117] rounded-xl p-6 border border-gray-100 dark:border-[#1f2937] text-center">
                <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
