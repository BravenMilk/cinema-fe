import React from 'react';
import { Users, Target, Award, Globe, Heart, Clapperboard } from 'lucide-react';

export default function About() {
    return (
        <div className="p-6 md:p-10 min-h-full space-y-12">
            {/* Hero */}
            <div className="relative py-16 md:py-24 rounded-3xl overflow-hidden text-center"
                style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0000 100%)', border: '1px solid rgba(229,9,20,0.2)' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-[80px] opacity-30"
                        style={{ background: '#e50914' }} />
                </div>
                <div className="relative z-10 space-y-4 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4"
                        style={{ background: '#e50914', boxShadow: '0 0 40px rgba(229,9,20,0.4)' }}>
                        <Clapperboard className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                        Tentang<br />CinePass
                    </h1>
                    <p className="max-w-xl mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed" style={{ color: '#888888' }}>
                        Mendefinisikan ulang pengalaman menonton bioskop dengan teknologi modern sejak 2024.
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Target, title: "Visi Kami", desc: "Menjadi platform pemesanan tiket bioskop nomor satu yang mengedepankan inovasi dan kemudahan akses bagi seluruh pecinta film." },
                    { icon: Heart, title: "Nilai Kami", desc: "Kami percaya bahwa setiap detik waktu Anda berharga. Oleh karena itu, kami memberikan layanan tercepat dan terpercaya." },
                    { icon: Award, title: "Kualitas", desc: "Bekerja sama dengan jaringan bioskop terbaik untuk memastikan Anda mendapatkan kualitas tontonan yang maksimal." },
                ].map((item, idx) => (
                    <div key={idx}
                        className="p-8 rounded-2xl space-y-4 transition-all duration-300 group"
                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)' }}>
                            <item.icon className="w-5 h-5" style={{ color: '#e50914' }} />
                        </div>
                        <h3 className="text-lg font-black uppercase italic text-white tracking-tight">{item.title}</h3>
                        <p className="text-xs font-medium leading-relaxed" style={{ color: '#666666' }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Innovation section */}
            <div className="relative rounded-2xl overflow-hidden p-8 md:p-14"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none"
                    style={{ background: '#e50914' }} />

                <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                    <div className="flex-1 space-y-6">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#e50914' }}>Platform Kami</p>
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-tight">
                                Inovasi Tanpa<br />Batas
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
                            CinePass bukan sekadar aplikasi booking. Kami adalah ekosistem digital yang menghubungkan narasi film dengan penontonnya. Dengan sistem QR Code terintegrasi, pembayaran instan, dan manajemen kursi real-time.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-5 py-3 rounded-xl flex items-center gap-2"
                                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)' }}>
                                <Users className="w-4 h-4" style={{ color: '#e50914' }} />
                                <span className="text-xs font-black text-white uppercase tracking-widest">10k+ Pengguna</span>
                            </div>
                            <div className="px-5 py-3 rounded-xl flex items-center gap-2"
                                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)' }}>
                                <Globe className="w-4 h-4" style={{ color: '#e50914' }} />
                                <span className="text-xs font-black text-white uppercase tracking-widest">50+ Kota</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/5 aspect-video rounded-2xl overflow-hidden relative group flex-shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Cinema" />
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ background: '#e50914' }} />
                    </div>
                </div>
            </div>

            <p className="text-center text-[9px] font-black uppercase tracking-widest" style={{ color: '#222222' }}>
                © 2026 CinePass Indonesia · All Rights Reserved
            </p>
        </div>
    );
}
