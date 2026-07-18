import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1F30] border-t border-white/10 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-lg">
              <img src="/logo.png" alt="logo" className="h-7 w-7 object-contain rounded-md" />
              <span className="font-logo">
                UniRideSync
              </span>
            </Link>
            <p className="text-slate-450 text-sm mt-1">
              Connecting campus, one ride at a time.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#support" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>

          {/* Copyright */}
          <p className="text-slate-500 text-sm">
            © 2026 UniRideSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
