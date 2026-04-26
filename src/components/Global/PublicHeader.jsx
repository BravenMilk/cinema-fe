import { Link, useLocation } from "react-router-dom";
import { Clapperboard, LayoutDashboard, LogOut, Film, Building2, MapPin, Ticket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
    { to: "/", label: "Movies", icon: Film },
    { to: "/cinemas", label: "Cinemas", icon: Building2 },
    { to: "/tickets", label: "Tiket", icon: Ticket },
    { to: "/cities", label: "Kota", icon: MapPin },
];

export default function PublicHeader() {
    const location = useLocation();
    const { token, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop Header */}
            <header className="px-6 py-5 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50"
                style={{ background: 'rgba(10,10,10,0.85)' }}>
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #e50914, #b8070f)' }}>
                        <Clapperboard className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">CinePass</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-bold">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to}
                            className={`transition-colors pb-1 ${isActive(to)
                                ? 'text-white border-b-2'
                                : 'text-slate-400 hover:text-white'}`}
                            style={isActive(to) ? { borderColor: '#e50914' } : {}}>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-3">
                    {token ? (
                        <>
                            <Link to="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cccccc' }}>
                                <LayoutDashboard className="w-4 h-4" style={{ color: '#e50914' }} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <button onClick={logout}
                                className="p-2.5 rounded-full transition-all group"
                                style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#e50914' }}
                                title="Keluar">
                                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#cccccc' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                Masuk
                            </Link>
                            <Link to="/register"
                                className="hidden sm:block px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                                style={{ background: '#e50914', color: '#ffffff' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
                style={{
                    background: 'rgba(10,10,10,0.95)',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))'
                }}>
                {navLinks.map(({ to, label, icon: Icon }) => {
                    const active = isActive(to);
                    return (
                        <Link key={to} to={to}
                            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
                            style={{
                                background: active ? 'rgba(229,9,20,0.12)' : 'transparent',
                                color: active ? '#e50914' : '#666666',
                                minWidth: '60px'
                            }}>
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                        </Link>
                    );
                })}
                {token ? (
                    <Link to="/dashboard"
                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
                        style={{ color: '#666666', minWidth: '60px' }}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Portal</span>
                    </Link>
                ) : (
                    <Link to="/login"
                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all"
                        style={{
                            background: isActive('/login') ? 'rgba(229,9,20,0.12)' : 'transparent',
                            color: isActive('/login') ? '#e50914' : '#666666',
                            minWidth: '60px'
                        }}>
                        <LogOut className="w-5 h-5 rotate-180" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Masuk</span>
                    </Link>
                )}
            </nav>

            {/* Spacer for mobile bottom nav */}
            <div className="md:hidden h-[72px]" />
        </>
    );
}
