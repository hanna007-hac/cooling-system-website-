import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { api } from '../api';

// Material fields: id, name, last_maintenance, next_maintenance, status, time_left
type Tab = 'maintenance' | 'inventory';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    good: 'bg-green-900/40 text-green-400',
    ok: 'bg-green-900/40 text-green-400',
    bad: 'bg-red-900/40 text-red-400',
    critical: 'bg-red-900/40 text-red-400',
    warning: 'bg-orange-900/40 text-orange-400',
    maintenance: 'bg-orange-900/40 text-orange-400',
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${map[status?.toLowerCase()] ?? 'bg-gray-800 text-gray-400'}`}>
      {status ?? '—'}
    </span>
  );
}

export default function MaterialPage() {
  const { lang, addToast } = useApp();
  const [tab, setTab] = useState<Tab>('maintenance');
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    api.getMaterialList()
      .then(d => setMaterials(d))
      .catch(() => addToast('failed_to_load_data', 'error'));
  }, []);

  const goodCount = materials.filter(m => m.status?.toLowerCase() === 'good' || m.status?.toLowerCase() === 'ok').length;
  const badCount = materials.length - goodCount;

  return (
    <div className="p-6 space-y-5 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(lang, 'material')}</h1>

      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl p-1 flex gap-1">
        {([
          { key: 'maintenance', label: t(lang, 'maintenance') },
          { key: 'inventory', label: t(lang, 'mat_mgmt_tab') },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-gray-100 dark:bg-[#0d1117] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl p-6">

        {/* Maintenance tab: last_maintenance, next_maintenance, time_left, status */}
        {tab === 'maintenance' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{t(lang, 'maintenance')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Maintenance schedule from backend</p>
            {materials.length === 0
              ? <p className="text-center text-gray-400 dark:text-slate-600 py-12 text-sm">No data found</p>
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#1f2937]">
                      {['id', 'name', 'last_maintenance', 'next_maintenance', 'time_left', 'status'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((m: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">{m.id}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-slate-200">{m.name}</td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400 text-xs">{m.last_maintenance ?? '—'}</td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400 text-xs">{m.next_maintenance ?? '—'}</td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400">{m.time_left ?? '—'} days</td>
                        <td className="py-3.5 px-4"><StatusBadge status={m.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </>
        )}

        {/* Inventory tab: same data, different view */}
        {tab === 'inventory' && (
          <>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{t(lang, 'mat_mgmt')}</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">{t(lang, 'mat_inventory')}</p>
            {materials.length === 0
              ? <p className="text-center text-gray-400 dark:text-slate-600 py-12 text-sm">No data found</p>
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-[#1f2937]">
                      {['id', 'name', 'status', 'time_left'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((m: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">{m.id}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-slate-200">{m.name}</td>
                        <td className="py-3.5 px-4"><StatusBadge status={m.status} /></td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400">{m.time_left ?? '—'} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: t(lang, 'total_items'), value: materials.length },
                { label: 'Good Status', value: goodCount },
                { label: 'Needs Attention', value: badCount },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 dark:bg-[#0d1117] rounded-xl p-4 border border-gray-100 dark:border-[#1f2937] text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
