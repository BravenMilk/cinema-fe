import React from 'react';
import { Info, Users, Shield, Target, Award, Globe, Heart } from 'lucide-react';

export default function About() {
    return (
        <div className="p-6 md:p-10 min-h-full space-y-16">
            <header className="relative py-20 overflow-hidden rounded-[3rem] bg-indigo-600">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/20 blur-[100px] rounded-full"></div>
                </div>

                <div className="relative z-10 text-center space-y-6 px-4">
                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
                        Tentang <br /> CinePass
                    </h1>
                    <p className="max-w-2xl mx-auto text-indigo-100 font-bold uppercase tracking-[0.3em] text-[10px] leading-relaxed">
                        Mendefinisikan ulang pengalaman menonton bioskop dengan teknologi modern dan kenyamanan premium sejak 2024.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Target, title: "Visi Kami", desc: "Menjadi platform pemesanan tiket bioskop nomor satu yang mengedepankan inovasi dan kemudahan akses bagi seluruh pecinta film." },
                    { icon: Heart, title: "Nilai Kami", desc: "Kami percaya bahwa setiap detik waktu Anda berharga. Oleh karena itu, kami memberikan layanan tercepat dan terpercaya." },
                    { icon: Award, title: "Kualitas", desc: "Bekerja sama dengan jaringan bioskop terbaik untuk memastikan Anda mendapatkan kualitas tontonan yang maksimal." },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-10 space-y-6 hover:bg-white/8 transition-all">
                        <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic text-white tracking-tight">{item.title}</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="relative bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden p-12 md:p-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px]"></div>

                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
                            Inovasi Tanpa <br /> Batas
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-sm font-medium">
                            CinePass tidak hanya sekadar aplikasi booking. Kami adalah ekosistem digital yang menghubungkan narasi film dengan penontonnya. Dengan sistem QR Code terintegrasi, pembayaran instan, dan manajemen kursi real-time, kami menghapus hambatan antara Anda dan layar lebar.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                <Users className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">10k+ Pengguna</span>
                            </div>
                            <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                <Globe className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">50+ Kota</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 aspect-video bg-slate-800 rounded-3xl overflow-hidden border border-white/5 relative group">
                        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Cinema" />
                        <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
