import { useSeatTypes } from "../../../hooks/global/SeatTypes/useSeatTypes";
import { Link } from "react-router-dom";
import PublicHeader from "../../../components/Global/PublicHeader";
import { Info, Loader2, ChevronRight, Armchair, Gem, Sparkles, Wifi, Coffee, Tv, Smartphone } from "lucide-react";

const SEAT_THEMES = {
    vip: {
        description: "Layanan kelas utama dengan kursi 'full recliner' yang dapat direbahkan maksimal. Privasi dan kenyamanan adalah prioritas kami.",
        features: ["Premium Leather Recliner", "USB Charging Port", "Personal Pillow & Blanket", "Lounge Access"],
        gradient: "from-amber-500 to-orange-600",
        icon: <Gem className="w-10 h-10" />
    },
    sweet: {
        description: "Didesain khusus untuk momen berdua yang lebih intim. Kursi sofa tanpa sekat tengah untuk pengalaman menonton yang romantis.",
        features: ["Double Sofa Design", "Extra Legroom", "Side Table for Snacks", "Special Couple Package"],
        gradient: "from-rose-500 to-pink-600",
        icon: <Sparkles className="w-10 h-10" />
    },
    default: {
        description: "Standar kenyamanan tinggi dengan posisi pandang simetris dan kualitas audio yang jernih untuk kepuasan menonton.",
        features: ["Ergonomic Seating", "Cup Holder", "Premium Audio", "Adjustable Headrest"],
        gradient: "from-indigo-500 to-violet-600",
        icon: <Armchair className="w-10 h-10" />
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
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Rasakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">kenyamanan</span>
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                        Pilih tipe kursi yang sesuai dengan kenyamananmu. Setiap kelas menawarkan pengalaman menonton yang unik dan berkesan.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 animate-pulse">Menyiapkan informasi harga...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-500/5 border border-rose-500/10 p-12 rounded-[2.5rem] text-center">
                        <p className="text-rose-400 font-bold">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {seatTypes.map((type) => {
                            const theme = getTheme(type.name);

                            return (
                                <div key={type.id} className="group relative bg-[#1e293b]/40 border border-white/5 rounded-xl p-10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-white/5 overflow-hidden">
                                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${theme.gradient} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity`}></div>
                                    <div className="w-full flex justify-center items-center mt-6">
                                        <div className={`w-20 h-20 bg-gradient-to-tr ${theme.gradient} rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            {theme.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 text-center tracking-tight uppercase italic">{type.name}</h3>
                                    <p className="text-slate-400 font-medium mb-10 leading-relaxed text-center min-h-[80px]">
                                        {theme.description}
                                    </p>
                                    <div className="space-y-4 mb-12">
                                        {theme.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-sm text-slate-300">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Mulai Dari</span>
                                            <div className="text-3xl font-black tracking-tight flex items-baseline">
                                            <span className="text-sm mr-1 font-bold text-slate-400">Rp</span>
                                            {new Intl.NumberFormat('id-ID').format(Number(type.additional_price))}
                                        </div>
                                        </div>
                                        <Link to="/login" className="w-14 h-14 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl flex items-center justify-center transition-all border border-white/10 hover:border-transparent">
                                            <ChevronRight className="w-6 h-6" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Butuh Bantuan Memilih?</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Layanan pelanggan kami siap membantu Anda kapan saja untuk memastikan pengalaman menonton Anda tak terlupakan.
                        </p>
                    </div>
                    <button className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center hover:bg-indigo-500 hover:text-white transition-all shadow-xl whitespace-nowrap">
                        <Info className="w-5 h-5 mr-3" /> Hubungi Kami
                    </button>
                </div>
            </main>
        </div>
    );
}