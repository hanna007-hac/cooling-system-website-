import { useApp } from '../context';


export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`animate-toastIn flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-xs
            ${toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-green-600 text-white'
            }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-xs uppercase tracking-wide opacity-80 mb-0.5">
              {toast.type === 'error' ? 'error' : 'success'}
            </p>
            <p>{toast.msg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
