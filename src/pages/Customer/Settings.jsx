import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Moon, Languages, Shield, ChevronRight, Save, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="p-6 md:p-10 min-h-full max-w-4xl mx-auto space-y-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Settings</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Konfigurasi Profil & Preferensi Anda</p>
            </header>

            <div className="space-y-6">
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                        <User className="w-3 h-3" /> Account Information
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
                        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Full Name</p>
                                    <p className="text-sm font-bold text-white uppercase">{user?.name || 'User'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Email Address</p>
                                    <p className="text-sm font-bold text-white uppercase">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center text-rose-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Security</p>
                                    <p className="text-sm font-bold text-white uppercase">Change Password</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pt-6">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                        <Bell className="w-3 h-3" /> Notifications & Display
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">Push Notifications</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dapatkan info film & promo terbaru</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-indigo-600' : 'bg-slate-800'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                                    <Moon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">Dark Mode</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gunakan tema gelap di malam hari</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-slate-800'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                <div className="pt-10 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20">
                        <Save className="w-4 h-4" /> Simpan Perubahan
                    </button>
                    <button onClick={logout} className="px-8 py-5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-black rounded-2xl uppercase tracking-widest text-[10px] transition-all border border-rose-500/20 flex items-center justify-center gap-3">
                        <LogOut className="w-4 h-4" /> Keluar Akun
                    </button>
                </div>

                <div className="pt-10 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                        CinePass v1.0.4 • Build 030224
                    </p>
                </div>
            </div>
        </div>
    );
}
