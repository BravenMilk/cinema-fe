import React from 'react';
import { User, Info, Settings, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

const SettingsDropdown = ({ user, isOpen, onEditProfile, onLogout, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl overflow-hidden animate-slide-down"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', zIndex: 9999 }}>

      {/* User info */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
            <User className="w-5 h-5" style={{ color: '#e50914' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" style={{ color: '#e50914' }} />
              <span className="text-xs capitalize" style={{ color: '#555' }}>{user?.role?.name || 'Guest'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2">
        {[
          { icon: User, label: 'Edit Profile', color: '#e50914', action: () => { onEditProfile(); onClose(); } },
          { icon: Info, label: 'Tentang Website', color: '#4ade80', action: onClose },
          { icon: Settings, label: 'Pengaturan', color: '#fbbf24', action: onClose },
        ].map(({ icon: Icon, label, color, action }) => (
          <button key={label} onClick={action}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-sm" style={{ color: '#aaa' }}>{label}</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#555' }} />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => { onLogout(); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: '#e50914' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e50914'; }}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsDropdown;
