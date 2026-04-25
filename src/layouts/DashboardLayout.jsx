import React, { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, MapPin, Clapperboard, MonitorPlay, ShieldCheck, LogOut,
  UserCircle2, Settings, Bell, Armchair, Calendar, Ticket, Search, Menu,
  Info, X, Globe, ChevronRight
} from "lucide-react";
import NotificationDropdown from "../components/Dashboard/NotificationDropdown";
import SettingsDropdown from "../components/Dashboard/SettingsDropdown";
import ProfileModal from "../components/Dashboard/ProfileModal";
import { useNotifications } from "../hooks/global/Notifications/useNotifications";

export default function DashboardLayout() {
  const { token, user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { notifications, loading: notifLoading, hasUnread, markAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-dropdown')) {
        setIsNotificationOpen(false);
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!token) return <Navigate to="/login" />;

  const allNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'customer', 'petugas', 'staf'] },
    { label: 'City Management', path: '/admin/cities', icon: MapPin, roles: ['admin'] },
    { label: 'Cinema Management', path: '/admin/cinemas', icon: Clapperboard, roles: ['admin'] },
    { label: 'Hall Management', path: '/admin/halls', icon: MonitorPlay, roles: ['admin'] },
    { label: 'Movie Management', path: '/admin/movies', icon: Clapperboard, roles: ['admin'] },
    { label: 'Role Management', path: '/admin/roles', icon: ShieldCheck, roles: ['admin'] },
    { label: 'Seat Tier', path: '/admin/seat-types', icon: Settings, roles: ['admin'] },
    { label: 'Seat Inventory', path: '/admin/seats', icon: Armchair, roles: ['admin'] },
    { label: 'Showtimes', path: '/admin/showtimes', icon: Calendar, roles: ['admin', 'staff', 'staf'] },
    { label: 'Transaction Ledger', path: '/admin/bookings', icon: Ticket, roles: ['admin'] },
    { label: 'Ticket Scanner', path: '/staff/scanner', icon: ShieldCheck, roles: ['admin', 'staff', 'petugas', 'staf'] },
    { label: 'Sold Tickets', path: '/staff/tickets', icon: Ticket, roles: ['admin', 'staff', 'staf'] },
    { label: 'Browse Movies', path: '/customer/movies', icon: Clapperboard, roles: ['customer'] },
    { label: 'Explore Cities', path: '/customer/cities', icon: Globe, roles: ['customer'] },
    { label: 'Cinema Circuits', path: '/customer/cinemas', icon: MapPin, roles: ['customer'] },
    { label: 'My Bookings', path: '/customer/bookings', icon: Ticket, roles: ['customer'] },
    { label: 'Settings', path: '/customer/settings', icon: Settings, roles: ['customer', 'admin', 'staff', 'staf'] },
    { label: 'About CinePass', path: '/about', icon: Info, roles: ['customer', 'admin', 'staff', 'staf'] },
  ];

  const allowedNavItems = allNavItems.filter(item =>
    item.roles.includes(user?.role?.name?.toLowerCase())
  );
  const filteredNavItems = allowedNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isActive = (path) => location.pathname === path;
  const pageTitle = () => {
    const found = allNavItems.find(i => i.path === location.pathname);
    return found ? found.label : location.pathname.split('/').pop().replace(/-/g, ' ');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0a', color: '#ffffff' }}>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-all duration-300 shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-64'}`}
        style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e50914' }}>
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-white">Cine<span style={{ color: '#e50914' }}>Pass</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg transition-colors text-gray-600 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: '#444' }} />
            <input type="text" placeholder="Cari menu..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder:text-gray-700" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto no-scrollbar pb-4">
          <p className="text-xs font-bold uppercase tracking-widest px-2 mb-2" style={{ color: '#333' }}>Menu</p>
          <div className="space-y-0.5">
            {filteredNavItems.length > 0 ? filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                  style={active ? {
                    background: 'rgba(229,9,20,0.1)',
                    borderLeft: '2px solid #e50914',
                    paddingLeft: '10px'
                  } : { borderLeft: '2px solid transparent', paddingLeft: '10px' }}>
                  <Icon className="w-4 h-4 shrink-0 transition-colors"
                    style={{ color: active ? '#e50914' : '#444' }} />
                  <span className="text-sm transition-colors"
                    style={{ color: active ? '#ffffff' : '#666', fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'rgba(229,9,20,0.4)' }} />}
                </Link>
              );
            }) : (
              <p className="text-xs text-center py-4" style={{ color: '#444' }}>Menu tidak ditemukan</p>
            )}
          </div>
        </nav>

        {/* User */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <UserCircle2 className="w-5 h-5" style={{ color: '#e50914' }} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs capitalize" style={{ color: '#555' }}>{user?.role?.name || 'Member'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)', color: '#e50914' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; e.currentTarget.style.color = '#e50914'; }}>
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-30"
          style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#666' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-white capitalize hidden sm:block">{pageTitle()}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification */}
            <div className="relative header-dropdown">
              <button
                onClick={() => { if (!isNotificationOpen) markAsRead(); setIsNotificationOpen(!isNotificationOpen); setIsSettingsOpen(false); }}
                className="relative p-2 rounded-xl transition-all"
                style={{ background: isNotificationOpen ? 'rgba(229,9,20,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isNotificationOpen ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.06)'}`, color: isNotificationOpen ? '#e50914' : '#666' }}>
                <Bell className="w-4 h-4" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#e50914' }} />}
              </button>
              <NotificationDropdown notifications={notifications} loading={notifLoading} isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
            </div>

            {/* Settings */}
            <div className="relative header-dropdown">
              <button
                onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsNotificationOpen(false); }}
                className="p-2 rounded-xl transition-all"
                style={{ background: isSettingsOpen ? 'rgba(229,9,20,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isSettingsOpen ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.06)'}`, color: isSettingsOpen ? '#e50914' : '#666' }}>
                <Settings className="w-4 h-4" />
              </button>
              <SettingsDropdown user={user} isOpen={isSettingsOpen} onEditProfile={() => setIsProfileModalOpen(true)} onLogout={logout} onClose={() => setIsSettingsOpen(false)} />
            </div>
          </div>
        </header>

        {/* Profile Modal - z-index above header */}
        <ProfileModal user={user} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto min-h-full page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
