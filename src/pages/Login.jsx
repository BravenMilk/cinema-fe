import { useLogin } from "../hooks/auth/useLogin";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Clapperboard, Loader2 } from "lucide-react";

export default function Login() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#0a0a0a' }}>

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e50914, transparent)' }} />

      {/* Film strips */}
      <div className="absolute left-0 top-0 h-full w-5 hidden lg:flex flex-col justify-around py-4 opacity-10">
        {[...Array(18)].map((_, i) => <div key={i} className="film-hole" />)}
      </div>
      <div className="absolute right-0 top-0 h-full w-5 hidden lg:flex flex-col justify-around py-4 opacity-10">
        {[...Array(18)].map((_, i) => <div key={i} className="film-hole" />)}
      </div>

      <div className="w-full max-w-sm z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: '#e50914', boxShadow: '0 0 40px rgba(229,9,20,0.4)' }}>
            <Clapperboard className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Cine<span style={{ color: '#e50914' }}>Pass</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#555' }}>Masuk untuk memesan kursi favoritmu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl text-sm text-center animate-fade-in"
                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}>
                {error}
              </div>
            )}

            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                <input type="email" required
                  className="input-cinema form-input pl-10"
                  placeholder="nama@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                <input type="password" required
                  className="input-cinema form-input pl-10"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium transition-colors" style={{ color: '#e50914' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff2d3a'}
                onMouseLeave={e => e.currentTarget.style.color = '#e50914'}>
                Lupa Password?
              </a>
            </div>

            <button type="submit" disabled={loading}
              className="btn-red w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Masuk Sekarang</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm" style={{ color: '#555' }}>
                Belum punya akun?{' '}
                <Link to="/register" className="font-semibold transition-colors" style={{ color: '#e50914' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff2d3a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#e50914'}>
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: '#222' }}>© 2026 CinePass Entertainment Group</p>
      </div>
    </div>
  );
}
