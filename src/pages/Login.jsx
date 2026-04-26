import { useLogin } from "../hooks/auth/useLogin";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Clapperboard, Loader2, CheckCircle } from "lucide-react";

export default function Login() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#0a0a0a' }}>

      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0505 100%)' }}>
        {/* Red glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)' }} />

        {/* Film strip decoration */}
        <div className="absolute left-0 top-0 h-full w-6 flex flex-col justify-around py-6 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-3 mx-auto rounded-sm" style={{ background: '#e50914' }} />
          ))}
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#e50914' }}>
            <Clapperboard className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">CinePass</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#e50914' }}>Selamat Datang Kembali</p>
            <h2 className="text-5xl font-black uppercase italic leading-tight text-white tracking-tighter">
              Layar Besar<br />Menunggumu
            </h2>
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#555555' }}>
            Masuk dan amankan kursi terbaikmu sebelum kehabisan.
          </p>
          <div className="flex gap-3 pt-2">
            {['4K Ultra HD', 'Dolby Atmos', 'E-Ticket'].map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#e50914' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs" style={{ color: '#222222' }}>© 2026 CinePass Entertainment Group</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
        {/* Mobile glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full blur-[100px] opacity-15 pointer-events-none lg:hidden"
          style={{ background: '#e50914' }} />

        <div className="w-full max-w-sm z-10">
          {/* Mobile logo */}
          <div className="text-center mb-10 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: '#e50914', boxShadow: '0 0 40px rgba(229,9,20,0.35)' }}>
              <Clapperboard className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Cine<span style={{ color: '#e50914' }}>Pass</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: '#444444' }}>Masuk untuk memesan kursi favoritmu</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Masuk Akun</h2>
            <p className="text-sm mt-2" style={{ color: '#444444' }}>Belum punya akun?{' '}
              <Link to="/register" className="font-bold transition-colors" style={{ color: '#e50914' }}>Daftar gratis</Link>
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl p-7"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {justRegistered && (
                <div className="p-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Akun berhasil dibuat! Silakan masuk.
                </div>
              )}
              {error && (
                <div className="p-3 rounded-xl text-sm text-center animate-fade-in"
                  style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}>
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555555' }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444444' }} />
                  <input type="email" required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-medium text-sm focus:outline-none transition-all text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    placeholder="nama@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555555' }}>Password</label>
                  <a href="#" className="text-xs font-semibold transition-colors" style={{ color: '#e50914' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff2d3a'}
                    onMouseLeave={e => e.currentTarget.style.color = '#e50914'}>
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444444' }} />
                  <input type="password" required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-medium text-sm focus:outline-none transition-all text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all mt-2"
                style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.25)' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ff1a1a'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#e50914'; }}>
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Masuk Sekarang</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>

          {/* Mobile register link */}
          <p className="text-center mt-6 text-sm lg:hidden" style={{ color: '#444444' }}>
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold transition-colors" style={{ color: '#e50914' }}>
              Daftar Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
