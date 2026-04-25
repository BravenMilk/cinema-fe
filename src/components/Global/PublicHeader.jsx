import { Link, useLocation } from "react-router-dom";
import { Clapperboard, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PublicHeader() {
    const location = useLocation();
    const { token, user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="px-6 py-8 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0f172a]/80">
            <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Clapperboard className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">CinePass</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold">
                <Link to="/" className={`${isActive('/') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-400 hover:text-white transition-colors'}`}>Movies</Link>
                <Link to="/cinemas" className={`${isActive('/cinemas') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-400 hover:text-white transition-colors'}`}>Cinemas</Link>
                <Link to="/tickets" className={`${isActive('/tickets') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-400 hover:text-white transition-colors'}`}>Ticket Prices</Link>
                <Link to="/cities" className={`${isActive('/cities') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-slate-400 hover:text-white transition-colors'}`}>Cities</Link>
            </nav>

            <div className="flex items-center space-x-4">
                {token ? (
                    <div className="flex items-center space-x-4">
                        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all text-slate-300">
                            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                            <span className="hidden sm:inline">Portal Admin</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5 group"
                            title="Keluar Sesi"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="px-6 py-2.5 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-all">
                            Masuk
                        </Link>
                        <Link to="/register" className="hidden sm:block px-6 py-2.5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/20 text-sm font-bold hover:bg-indigo-500 transition-all">
                            Daftar
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
