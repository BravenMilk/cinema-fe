import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Moon, Shield, ChevronRight, Save, LogOut, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full p-0.5 transition-all duration-300 flex-shrink-0"
        style={{ background: value ? '#e50914' : 'rgba(255,255,255,0.1)', boxShadow: value ? '0 0 12px rgba(229,9,20,0.4)' : 'none' }}>
        <div className="w-5 h-5 bg-white rounded-full transition-transform duration-300"
            style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
);

const SectionTitle = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 px-1 mb-3">
        <Icon className="w-3.5 h-3.5" style={{ color: '#e50914' }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#e50914' }}>{children}</span>
    </div>
);

const InfoRow = ({ icon: Icon, label, value, accent = false }) => (
    <div className="p-5 flex items-center justify-between group cursor-pointer transition-colors"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: accent ? 'rgba(248,113,113,0.08)' : 'rgba(229,9,20,0.08)' }}>
                <Icon className="w-4 h-4" style={{ color: accent ? '#f87171' : '#e50914' }} />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#555555' }}>{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
            </div>
        </div>
        <ChevronRight className="w-4 h-4 transition-colors" style={{ color: '#444444' }} />
    </div>
);

export default function Settings() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="p-6 md:p-10 min-h-full max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                    Pengaturan
                </h1>
                <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#555555' }}>
                    Kelola profil & preferensi akun
                </p>
            </div>

            {/* Account */}
            <section>
                <SectionTitle icon={User}>Informasi Akun</SectionTitle>
                <div className="rounded-2xl overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <InfoRow icon={User} label="Nama Lengkap" value={user?.name || 'User'} />
                    <InfoRow icon={Mail} label="Email Address" value={user?.email || 'user@example.com'} />
                    <InfoRow icon={Phone} label="No. Telepon" value={user?.phone || '-'} />
                    <div className="p-5 flex items-center justify-between group cursor-pointer transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(248,113,113,0.08)' }}>
                                <Lock className="w-4 h-4" style={{ color: '#f87171' }} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#555555' }}>Keamanan</p>
                                <p className="text-sm font-bold text-white">Ubah Password</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4" style={{ color: '#444444' }} />
                    </div>
                </div>
            </section>

            {/* Preferences */}
            <section>
                <SectionTitle icon={Bell}>Notifikasi & Tampilan</SectionTitle>
                <div className="rounded-2xl overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(229,9,20,0.08)' }}>
                                <Bell className="w-4 h-4" style={{ color: '#e50914' }} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Push Notifications</p>
                                <p className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: '#555555' }}>Info film & promo terbaru</p>
                            </div>
                        </div>
                        <Toggle value={notifications} onChange={setNotifications} />
                    </div>
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(229,9,20,0.08)' }}>
                                <Moon className="w-4 h-4" style={{ color: '#e50914' }} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Dark Mode</p>
                                <p className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: '#555555' }}>Tema gelap aktif</p>
                            </div>
                        </div>
                        <Toggle value={darkMode} onChange={setDarkMode} />
                    </div>
                </div>
            </section>

            {/* Role badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#e50914' }} />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#e50914' }}>Role Akun</p>
                    <p className="text-sm font-bold text-white capitalize">{user?.role?.name || 'Member'}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="flex-1 py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                    <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
                <button onClick={logout}
                    className="sm:w-auto px-8 py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171'; }}>
                    <LogOut className="w-4 h-4" /> Keluar
                </button>
            </div>

            <p className="text-center text-[9px] font-black uppercase tracking-widest" style={{ color: '#222222' }}>
                CinePass v1.0.4 · Build 030224
            </p>
        </div>
    );
}
