'use client';

/**
 * Toast Notification Component
 * Global toast notification system matching UPD design
 */

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const toast: ToastMessage = {
    id: toastCounter++,
    message,
    type,
  };
  toastListeners.forEach(listener => listener(toast));
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      
      // Auto-remove after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 4000);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const borderColors = {
    success: '#1e8a52',
    error: '#c8401a',
    info: '#1a6bc8',
  };

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="fixed bottom-[28px] right-[28px] bg-[#0d0d0d] text-white px-[20px] py-[13px] rounded-[6px] text-[13.5px] shadow-[0_8px_32px_rgba(13,13,13,0.14)] flex items-center gap-[10px] z-999 max-w-[320px] animate-toast"
          style={{
            borderLeft: `4px solid ${borderColors[toast.type]}`,
          }}
        >
          <span className="text-[16px]">{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </>
  );
}
