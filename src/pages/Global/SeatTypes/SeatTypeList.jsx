import { useSeatTypes } from "../../../hooks/global/SeatTypes/useSeatTypes";
import { Link } from "react-router-dom";
import PublicHeader from "../../../components/Global/PublicHeader";
import { Info, Loader2, ChevronRight, Armchair, Gem, Sparkles } from "lucide-react";

const SEAT_THEMES = {
    vip: {
        description: "Layanan kelas utama dengan kursi 'full recliner'. Privasi dan kenyamanan adalah prioritas kami.",
        features: ["Premium Leather Recliner", "USB Charging Port", "Personal Pillow & Blanket", "Lounge Access"],
        accent: '#e50914',
        accentBg: 'rgba(229,9,20,0.1)',
        icon: <Gem className="w-9 h-9" />
    },
    sweet: {
        description: "Didesain untuk momen berdua yang lebih intim. Kursi sofa tanpa sekat tengah untuk pengalaman romantis.",
        features: ["Double Sofa Design", "Extra Legroom", "Side Table for Snacks", "Special Couple Package"],
        accent: '#ff6b9d',
        accentBg: 'rgba(255,107,157,0.1)',
        icon: <Sparkles className="w-9 h-9" />
    },
    default: {
        description: "Standar kenyamanan tinggi dengan posisi pandang simetris dan kualitas audio jernih.",
        features: ["Ergonomic Seating", "Cup Holder", "Premium Audio", "Adjustable Headrest"],
        accent: '#e50914',
        accentBg: 'rgba(229,9,20,0.08)',
        icon: <Armchair className="w-9 h-9" />
    }
};

export default function SeatTypeList() {
    const { seatTypes, loading, error } = useSeatTypes();

    const getTheme = (name) => {
        const n = name.toLowerCase();
        if (n.includes('vip') || n.includes('premiere')) return SEAT_THEMES.vip;
        if (n.includes('sweet') || n.includes('couple')) return SEAT_THEMES.sweet;
        return SEAT_THEMES.default;
    };

    return (
        <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#ffffff' }}>
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase italic">
                        Pilih <span style={{ color: '#e50914' }}>Kenyamananmu</span>
                    </h1>
                    <p className="font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: '#666666' }}>
                        Setiap kelas kursi menawarkan pengalaman menonton yang unik dan berkesan.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                        <p className="animate-pulse" style={{ color: '#555555' }}>Menyiapkan informasi harga...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        <p className="font-bold" style={{ color: '#f87171' }}>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {seatTypes.map((type) => {
                            const theme = getTheme(type.name);
                            return (
                                <div key={type.id}
                                    className="group relative rounded-2xl p-10 transition-all duration-300 overflow-hidden"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${theme.accent}44`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                                    {/* Glow */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: theme.accent }} />

                                    <div className="relative z-10">
                                        <div className="flex justify-center mb-6">
                                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300"
                                                style={{ background: theme.accentBg, color: theme.accent }}>
                                                {theme.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black mb-4 text-center tracking-tight uppercase italic">{type.name}</h3>
                                        <p className="text-center font-medium mb-8 leading-relaxed min-h-[60px]" style={{ color: '#666666' }}>
                                            {theme.description}
                                        </p>

                                        <div className="space-y-3 mb-10">
                                            {theme.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-3 text-sm" style={{ color: '#aaaaaa' }}>
                                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.accent }} />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <span className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#444444' }}>Mulai Dari</span>
                                                <div className="text-3xl font-black tracking-tight flex items-baseline">
                                                    <span className="text-sm mr-1 font-bold" style={{ color: '#666666' }}>Rp</span>
                                                    <span style={{ color: theme.accent }}>
                                                        {new Intl.NumberFormat('id-ID').format(Number(type.additional_price))}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link to="/login"
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = theme.accent; e.currentTarget.style.borderColor = theme.accent; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA Banner */}
                <div className="mt-20 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10"
                    style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)' }}>
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black mb-4 tracking-tight uppercase italic">Butuh Bantuan Memilih?</h2>
                        <p className="font-medium leading-relaxed" style={{ color: '#666666' }}>
                            Layanan pelanggan kami siap membantu Anda kapan saja untuk memastikan pengalaman menonton tak terlupakan.
                        </p>
                    </div>
                    <button
                        className="px-10 py-4 font-black rounded-2xl flex items-center transition-all whitespace-nowrap uppercase tracking-widest text-xs"
                        style={{ background: '#e50914', color: '#ffffff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                        <Info className="w-5 h-5 mr-3" /> Hubungi Kami
                    </button>
                </div>
            </main>
        </div>
    );
}
