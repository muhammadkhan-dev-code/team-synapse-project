import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Car, GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../controllers/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex">
        {/* Left Illustration Panel */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#f5f0e8] to-[#e8dcc8] flex-col items-center justify-end overflow-hidden">
          {/* Campus road illustration */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Sky */}
            <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-[#d4e8d4] to-[#e8f0e8]"></div>
            {/* Building dome */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-16 h-10 bg-[#c8c0b0] rounded-t-full border-4 border-[#b8b0a0]"></div>
              <div className="w-32 h-24 bg-[#d0c8b8] border-4 border-[#b8b0a0] grid grid-cols-4 gap-1 p-2">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="bg-[#a0b8a0] rounded-sm opacity-60"></div>
                ))}
              </div>
            </div>
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#c8c0a8] to-[#e0d8c0]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-full bg-[#b0a888] opacity-50" style={{clipPath:'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
            {/* Car */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-20 h-10 bg-gradient-to-b from-[#1a3a1a] to-[#0d1f0d] rounded-t-2xl rounded-b-lg shadow-xl">
                <div className="flex justify-between px-2 pt-1">
                  <div className="w-4 h-3 bg-[#14B8A6]/60 rounded-sm"></div>
                  <div className="w-4 h-3 bg-[#14B8A6]/60 rounded-sm"></div>
                </div>
              </div>
              <div className="flex justify-between px-2 -mt-1">
                <div className="w-4 h-4 bg-slate-700 rounded-full border-2 border-slate-500"></div>
                <div className="w-4 h-4 bg-slate-700 rounded-full border-2 border-slate-500"></div>
              </div>
            </div>
          </div>

          {/* Overlay text */}
          <div className="relative z-10 text-center pb-8 px-6">
            <h2 className="text-2xl font-extrabold text-[#0A1F44] leading-tight">Campus Commute<br/>Reimagined</h2>
            <p className="text-slate-600 text-sm mt-2">Join thousands of students and faculty sharing rides across campus safely and sustainably.</p>
          </div>
        </div>

        {/* Right Login Panel */}
        <div className="flex-1 bg-[#0A1F44] relative">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.07]">
            {Array.from({length:12}).map((_,i)=>(
              <div key={i} className="absolute w-full h-px bg-white" style={{top:`${i*8.33}%`}}/>
            ))}
            {Array.from({length:12}).map((_,i)=>(
              <div key={i} className="absolute h-full w-px bg-white" style={{left:`${i*8.33}%`}}/>
            ))}
          </div>

          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <img src="/logo.png" alt="logo" className="h-8 w-8 object-contain rounded-md" />
              <span className="font-logo">
                UniRideSync
              </span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#0A1F44]">Login</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back to your campus network.</p>
              </div>

              <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">University Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      id="login-remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#2563EB]"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-[#2563EB] font-medium hover:underline">Forgot password?</a>
                </div>

                {/* Error */}
                {(localError || error) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {localError || error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Login to UniRideSync <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* University Portal */}
              <button
                id="login-university-portal"
                type="button"
                className="w-full flex items-center justify-center gap-2.5 border border-slate-200 text-[#0A1F44] font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                <GraduationCap className="w-5 h-5 text-[#2563EB]" />
                Sign in with University Portal
              </button>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#2563EB] font-bold hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
