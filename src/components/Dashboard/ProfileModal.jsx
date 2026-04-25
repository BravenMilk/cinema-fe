import React, { useState } from 'react';
import { X, User, Mail, Phone, Loader2, ShieldCheck, Save, AlertCircle } from 'lucide-react';
import { useProfile } from '../../hooks/auth/useProfile';

const ProfileModal = ({ user, isOpen, onClose }) => {
  const { updateProfile, loading, error, success, setSuccess } = useProfile();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#ffffff',
    width: '100%',
    padding: '12px 12px 12px 44px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', zIndex: 1 }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
            <div className="h-0.5 w-12 mt-1 rounded-full" style={{ background: '#e50914' }} />
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#666'; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-10 flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <ShieldCheck className="w-8 h-8" style={{ color: '#4ade80' }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Berhasil!</h3>
              <p className="text-sm" style={{ color: '#666' }}>Profil berhasil diperbarui</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl flex items-center gap-2 text-sm"
                  style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}>
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {[
                { label: 'Nama Lengkap', icon: User, type: 'text', key: 'name', placeholder: 'Nama kamu' },
                { label: 'Email', icon: Mail, type: 'email', key: 'email', placeholder: 'email@contoh.com' },
                { label: 'No. Telepon', icon: Phone, type: 'text', key: 'phone', placeholder: '08xxxxxxxxxx' },
              ].map(({ label, icon: Icon, type, key, placeholder }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#444' }} />
                    <input type={type} value={formData[key]} placeholder={placeholder}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                      required />
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="btn-red w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
