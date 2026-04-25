import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function BaseModal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl", footer }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div className={`relative w-full ${maxWidth} rounded-2xl overflow-hidden flex flex-col animate-fade-in`}
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', maxHeight: '90vh', zIndex: 1 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#111111' }}>
          <div>
            <h2 className="text-base font-bold text-white">{title}</h2>
            <div className="h-0.5 w-10 mt-1.5 rounded-full" style={{ background: '#e50914' }} />
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e50914'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 flex items-center justify-end gap-3 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,17,0.98)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
