import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, ShieldCheck, ArrowUpRight, Users, Calendar, Wallet, MapPin, Star, ArrowRight, Loader2, Activity, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../hooks/global/Movies/useMovies';
import { useCities } from '../hooks/global/Cities/useCities';
import { useCustomerBookings } from '../hooks/customer/useCustomerBookings';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { time: '10:00', sales: 120 }, { time: '12:00', sales: 450 },
  { time: '14:00', sales: 300 }, { time: '16:00', sales: 900 },
  { time: '18:00', sales: 1200 }, { time: '20:00', sales: 1500 }, { time: '22:00', sales: 800 },
];

const cardBorder = { border: '1px solid rgba(255,255,255,0.06)' };

const StatCard = ({ label, value, trend, icon: Icon, accent }) => (
  <div className="p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 cursor-default"
    style={{ background: '#111111', ...cardBorder }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229,9,20,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
    <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full blur-2xl opacity-10" style={{ background: accent }} />
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#4ade80' }}>
        {trend} <ArrowUpRight className="w-3 h-3" />
      </span>
    </div>
    <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(229,9,20,0.5)' }}>{label}</p>
    <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-6 p-5 md:p-8">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          System <span style={{ color: '#e50914' }}>Overview</span>
        </h1>
        <p className="text-xs font-medium uppercase tracking-widest mt-2 flex items-center gap-2" style={{ color: 'rgba(229,9,20,0.5)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
          Live monitoring & operations
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)', color: '#e50914' }}>
        <Clock className="w-3.5 h-3.5" />
        {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    </header>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Monthly Revenue" value="Rp 45.2M" trend="+12.5%" icon={Wallet} accent="#e50914" />
      <StatCard label="Active Users" value="1,284" trend="+8.2%" icon={Users} accent="#818cf8" />
      <StatCard label="Tickets Sold" value="842" trend="+14.1%" icon={Ticket} accent="#fb923c" />
      <StatCard label="Conversion" value="64.2%" trend="+2.4%" icon={Activity} accent="#f472b6" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: '#111111', ...cardBorder }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Ticket Sales Trends</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(229,9,20,0.5)' }}>Real-time hourly volume</p>
          </div>
          <select className="text-xs font-medium px-3 py-1.5 rounded-lg focus:outline-none" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)', color: '#e50914' }}>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e50914" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#e50914" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#555555', fontSize: 10 }} dy={8} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(229,9,20,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="sales" stroke="#e50914" strokeWidth={2.5} fillOpacity={1} fill="url(#redGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-6 flex flex-col" style={{ background: '#111111', ...cardBorder }}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold text-white">Live Sales</h2>
          <button style={{ color: '#555555' }}><MoreHorizontal className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4 flex-1">
          {[
            { id: 'TIC-OPHRHAHL', movie: 'Spidermen', user: 'Budi S.', time: '09:37' },
            { id: 'TIC-FW5LSZLA', movie: 'Avengers', user: 'Sari W.', time: '10:12' },
            { id: 'TIC-JFREBLZG', movie: 'Batman', user: 'Andi P.', time: '11:03' },
            { id: 'TIC-T0SQ1JUZ', movie: 'Dune 3', user: 'Rina K.', time: '11:45' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)' }}>
                <Ticket className="w-4 h-4" style={{ color: '#e50914' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.movie}</p>
                <p className="text-xs truncate" style={{ color: '#555555' }}>{item.id} · {item.user}</p>
              </div>
              <span className="text-xs shrink-0" style={{ color: '#555555' }}>{item.time}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-5 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)', color: '#e50914' }}>
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

const StaffDashboard = () => (
  <div className="space-y-6 p-5 md:p-8">
    <header>
      <h1 className="text-3xl font-black text-white">Operational <span className="red-shimmer">Hub</span></h1>
      <p className="text-xs uppercase tracking-widest mt-2" style={{ color: 'rgba(229,9,20,0.5)' }}>Daily tasks & ticket scanning</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="p-8 rounded-2xl flex flex-col items-center text-center gap-4 cursor-pointer transition-all hover:-translate-y-1"
        style={{ background: 'linear-gradient(135deg, #1a0000, #2a0000)', border: '1px solid rgba(229,9,20,0.4)', boxShadow: '0 20px 60px rgba(229,9,20,0.1)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(229,9,20,0.15)' }}>
          <ShieldCheck className="w-7 h-7" style={{ color: '#e50914' }} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Quick Scan</h3>
          <p className="text-xs mt-1" style={{ color: 'rgba(229,9,20,0.6)' }}>Ready to verify check-ins</p>
        </div>
      </div>
      <div className="p-8 rounded-2xl flex flex-col justify-center gap-2" style={{ background: '#111111', ...cardBorder }}>
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(229,9,20,0.5)' }}>Scheduled Today</span>
        <span className="text-2xl font-black text-white">12 Showtimes</span>
      </div>
      <div className="p-8 rounded-2xl flex flex-col justify-center gap-2" style={{ background: '#111111', ...cardBorder }}>
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(229,9,20,0.5)' }}>Checked In</span>
        <span className="text-2xl font-black" style={{ color: '#4ade80' }}>184 / 240</span>
        <span className="text-xs" style={{ color: '#555555' }}>Tickets verified</span>
      </div>
    </div>
  </div>
);

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { movies, loading: mLoading } = useMovies();
  const { cities } = useCities();
  const { bookings, loading: bLoading } = useCustomerBookings();
  const latestBooking = bookings[0];

  return (
    <div className="space-y-6 p-5 md:p-8">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111111 0%, #1a0000 100%)', border: '1px solid rgba(229,9,20,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: '#e50914' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.25)', color: '#e50914' }}>
              Member Area
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Selamat Datang, <span className="red-shimmer">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: '#555555' }}>Temukan film terbaik hari ini dan buat pesananmu.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="px-5 py-4 rounded-2xl text-center" style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(229,9,20,0.6)' }}>Loyalty Points</p>
              <p className="text-2xl font-black red-shimmer">1,250</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movies */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Now Playing</h2>
            <button onClick={() => navigate('/customer/movies')}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: '#e50914' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff1a1a'}
              onMouseLeave={e => e.currentTarget.style.color = '#e50914'}>
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mLoading ? [1, 2, 3, 4].map(i => (
              <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: '#111111' }} />
            )) : movies.slice(0, 4).map(movie => (
              <div key={movie.id} className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229,9,20,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <img src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600"; }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)' }} />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: '#e50914', color: '#ffffff' }}>
                    {movie.rating || 'SU'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-3 h-3 fill-current" style={{ color: '#e50914' }} />
                    <span className="text-xs font-semibold" style={{ color: '#e50914' }}>4.8</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-2">{movie.title}</h3>
                  <button onClick={() => navigate('/customer/movies')}
                    className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                    style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914' }}>
                    Pesan Tiket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Latest booking */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: '#111111', ...cardBorder }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(229,9,20,0.5)' }}>Reservasi Terakhir</p>
            {bLoading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#e50914' }} />
                <span className="text-xs" style={{ color: '#555555' }}>Memuat...</span>
              </div>
            ) : latestBooking ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-20 rounded-xl shrink-0 flex items-center justify-center" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.1)' }}>
                    <Ticket className="w-6 h-6" style={{ color: 'rgba(229,9,20,0.3)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{latestBooking.showtime?.movie?.title}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={{ background: 'rgba(229,9,20,0.1)', color: '#e50914' }}>{latestBooking.status}</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3 h-3" style={{ color: '#555555' }} />
                      <span className="text-xs truncate" style={{ color: '#555555' }}>{latestBooking.showtime?.hall?.cinema?.name}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/customer/bookings')}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: '#e50914', color: '#ffffff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                  Lihat Tiket
                </button>
              </div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Ticket className="w-10 h-10 mx-auto mb-3" style={{ color: '#555555' }} />
                <p className="text-xs" style={{ color: '#555555' }}>Belum ada tiket</p>
              </div>
            )}
          </div>

          {/* City selector */}
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #111111, #1a0000)', border: '1px solid rgba(229,9,20,0.25)', boxShadow: '0 20px 50px rgba(229,9,20,0.06)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: '#e50914' }} />
            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-1">Pilih Kota</h3>
              <p className="text-xs mb-4" style={{ color: 'rgba(229,9,20,0.6)' }}>Lihat bioskop di kotamu</p>
              <div className="relative mb-3">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#e50914' }} />
                <select onChange={() => navigate('/customer/cinemas')} defaultValue=""
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-xs font-medium appearance-none focus:outline-none"
                  style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', color: '#ffffff' }}>
                  <option value="" disabled style={{ background: '#111111' }}>Pilih Kota</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id} style={{ background: '#111111' }}>{city.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => navigate('/customer/cinemas')}
                className="red-btn w-full py-3 rounded-xl text-xs font-bold">
                Explore Cinemas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role?.name?.toLowerCase();

  switch (role) {
    case 'admin': return <AdminDashboard />;
    case 'staf':
    case 'staff':
    case 'petugas': return <StaffDashboard />;
    case 'customer': return <CustomerDashboard user={user} />;
    default: return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xs uppercase tracking-widest" style={{ color: '#555555' }}>Unauthorized Role</p>
      </div>
    );
  }
}
