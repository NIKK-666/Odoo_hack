import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

let toastId = 0;
let addToastFn: (toast: Omit<Toast, 'id'>) => void = () => {};

export const toast = {
  success: (title: string, message?: string) => addToastFn({ type: 'success', title, message }),
  error: (title: string, message?: string) => addToastFn({ type: 'error', title, message }),
  warning: (title: string, message?: string) => addToastFn({ type: 'warning', title, message }),
  info: (title: string, message?: string) => addToastFn({ type: 'info', title, message }),
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (toast: Omit<Toast, 'id'>) => {
      const newToast: Toast = {
        ...toast,
        id: (++toastId).toString(),
        duration: toast.duration || 5000
      };

      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, newToast.duration);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              max-w-sm p-4 rounded-lg border shadow-lg transform transition-all duration-300
              ${styles[toast.type]}
            `}
          >
            <div className="flex items-start">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <p className="font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-sm opacity-90">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 flex-shrink-0 opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}