import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, type = 'success', title, message, actionLabel = 'Ok, Mengerti', onAction }) {
  if (!isOpen) return null;

  const config = {
    success: { icon: CheckCircle2, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', btnBg: '#22c55e' },
    error: { icon: XCircle, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', btnBg: '#e50914' },
    info: { icon: Info, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', btnBg: '#3b82f6' },
    warning: { icon: AlertCircle, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', btnBg: '#f59e0b' },
  };

  const c = config[type] || config.success;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl p-6 text-center animate-fade-in"
        style={{ background: '#111111', border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.8)', zIndex: 1 }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: '#444' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#444'}>
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon className="w-8 h-8" style={{ color: c.color }} />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm mb-6" style={{ color: '#666' }}>{message}</p>

        <button onClick={() => { if (onAction) onAction(); onClose(); }}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: c.btnBg }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
