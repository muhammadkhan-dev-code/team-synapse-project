import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../controllers/useAuth';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper for hash scrolling or redirecting
  const handleNavClick = (anchorId) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + anchorId);
    } else {
      const element = document.querySelector(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const publicLinks = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'About', onClick: () => handleNavClick('#about') },
    { label: 'For Drivers', onClick: () => handleNavClick('#for-drivers') },
    { label: 'Safety', onClick: () => handleNavClick('#why-choose') },
    { label: 'Reviews', onClick: () => handleNavClick('#reviews') },
    { label: 'Support', onClick: () => handleNavClick('#support') },
  ];

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/post-ride', label: 'Post a Ride' },
    { to: '/my-rides', label: 'My Rides' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-[#0A1F30] text-white sticky top-0 z-50 border-b border-white/10 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tight hover:opacity-90 transition-all">
          <img src="/logo.png" alt="logo" className='h-10 w-10 object-contain rounded-lg' />
          <span className="font-logo">
            UniRideSync
          </span>
        </Link>

        {/* Middle: Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {isAuthenticated ? (
            authLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
                    ? 'text-[#14B8A6] border-b-2 border-[#14B8A6] rounded-none pb-1 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))
          ) : (
            publicLinks.map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))
          )}
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <button
                onClick={toggleTheme}
                className="border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Dark</span>
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login?admin=true"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Admin Portal
              </Link>

              <Link
                to="/signup"
                className="bg-white hover:bg-slate-100 text-[#0A1F44] text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                Become a Driver
              </Link>

              <button
                onClick={toggleTheme}
                className="border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d2550] border-t border-white/10 px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          {isAuthenticated ? (
            authLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-base font-semibold transition ${isActive ? 'bg-white/10 text-[#14B8A6]' : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))
          ) : (
            publicLinks.map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                {label}
              </button>
            ))
          )}

          <div className="h-px bg-white/10 my-2"></div>

          {/* Mobile Right Side CTAs */}
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { toggleTheme(); setMobileOpen(false); }}
                  className="border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-[#14B8A6]" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#14B8A6]" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login?admin=true"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
                >
                  Admin Portal
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-white text-[#0A1F44] font-bold py-3 rounded-xl transition shadow hover:bg-slate-100 cursor-pointer"
                >
                  Become a Driver
                </Link>
                <button
                  onClick={() => { toggleTheme(); setMobileOpen(false); }}
                  className="border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-[#14B8A6]" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#14B8A6]" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
