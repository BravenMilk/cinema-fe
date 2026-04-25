import { useRegister } from "../hooks/auth/useRegister";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, UserPlus, Loader2, ShieldCheck, Clapperboard } from "lucide-react";

export default function Register() {
  const { formData, handleChange, error, loading, handleSubmit } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: '#0a0a0a' }}>

      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e50914, transparent)' }} />

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: '#e50914', boxShadow: '0 0 30px rgba(229,9,20,0.35)' }}>
            <Clapperboard className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Buat <span style={{ color: '#e50914' }}>Akun</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#555' }}>Dapatkan akses eksklusif ke setiap film terbaru</p>
        </div>

        <div className="rounded-2xl p-6"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl text-sm animate-fade-in"
                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                  <input name="name" type="text" required className="input-cinema form-input pl-10"
                    placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                  <input name="email" type="email" required className="input-cinema form-input pl-10"
                    placeholder="nama@email.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="form-label">No. Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                  <input name="phone" type="number" className="input-cinema form-input pl-10"
                    placeholder="0812xxxx" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                  <input name="password" type="password" required className="input-cinema form-input pl-10"
                    placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="form-label">Konfirmasi Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                  <input name="passwordConfirmation" type="password" required className="input-cinema form-input pl-10"
                    placeholder="••••••••" value={formData.passwordConfirmation} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-red w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Daftar Akun Sekarang</>}
            </button>

            <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm" style={{ color: '#555' }}>
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold transition-colors" style={{ color: '#e50914' }}>
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
