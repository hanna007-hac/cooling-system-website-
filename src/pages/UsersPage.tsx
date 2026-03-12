import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { t } from '../i18n';
import { api } from '../api';
import { X, Trash2, Plus } from 'lucide-react';

// Users fields: id, username, first_name, last_name, email, is_active, is_superuser

export default function UsersPage() {
  const { lang, addToast } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    is_active: true, is_superuser: false,
  });

  const fetchUsers = () => {
    api.getUsers()
      .then((d: any) => setUsers(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => addToast('Failed to fetch data from /users/admin/users/: API request failed', 'error'));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!form.first_name || !form.email) return;
    setLoading(true);
    try {
      await api.createUser(form);
      addToast('User created successfully', 'success');
      setShowModal(false);
      setForm({ first_name: '', last_name: '', email: '', is_active: true, is_superuser: false });
      fetchUsers();
    } catch {
      addToast('Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteUser(id);
      setUsers(u => u.filter((u: any) => u.id !== id));
      addToast('User deleted', 'success');
    } catch {
      addToast('Failed to delete user', 'error');
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(lang, 'users')}</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">
          <Plus size={16} /> {t(lang, 'add_user')}
        </button>
      </div>

      <div className="bg-white dark:bg-[#161b27] border border-gray-100 dark:border-[#1f2937] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#1f2937]">
              {['id', 'First Name', 'Last Name', 'Email', 'Statut', 'is superuser', 'actions'].map(h => (
                <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400 dark:text-slate-600 text-sm">No users found</td>
              </tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-50 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-4 px-5 text-gray-500 dark:text-slate-500 text-xs font-mono">{u.id}</td>
                <td className="py-4 px-5 font-medium text-gray-800 dark:text-slate-200">{u.first_name}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-slate-400">{u.last_name}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-slate-400">{u.email}</td>
                <td className="py-4 px-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {u.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_superuser ? 'bg-blue-900/40 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                    {u.is_superuser ? 'yes' : 'no'}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <button onClick={() => handleDelete(u.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161b27] border border-gray-200 dark:border-[#1f2937] rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#1f2937]">
              <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">{t(lang, 'add_new_user')}</h3>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {[
                { key: 'first_name', label: t(lang, 'first_name'), type: 'text' },
                { key: 'last_name', label: t(lang, 'last_name'), type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-2">{label}</label>
                  <input type={type} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-slate-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                  />
                </div>
              ))}
              {[
                { key: 'is_active', label: t(lang, 'is_active') },
                { key: 'is_superuser', label: t(lang, 'is_superuser') },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-500 dark:text-slate-400">{label}</label>
                  <button onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}
                    className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center transition-all
                      ${(form as any)[key] ? 'bg-gray-600 border-gray-500' : 'bg-white dark:bg-[#0d1117] border-gray-200 dark:border-[#1f2937]'}`}>
                    {(form as any)[key] && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-[#1f2937]">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                {t(lang, 'cancel')}
              </button>
              <button onClick={handleCreate} disabled={loading}
                className="px-5 py-2 bg-[#1e2a3a] hover:bg-[#263548] text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60">
                {loading ? '...' : t(lang, 'create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
