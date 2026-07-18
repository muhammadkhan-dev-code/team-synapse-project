import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Reset steps: 1 = Email submission, 2 = Verify Code, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  // Submit email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.endsWith('.edu')) {
      setLocalError('Please enter a valid university email address (.edu).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  // OTP changes
  const handleOtpChange = (index, val) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next field
    if (val !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  // Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setLocalError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocalError('');
      setStep(3);
    }, 600);
  };

  // Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Illustration Panel */}
        <div className="hidden md:flex md:w-1/2 relative flex-col items-center justify-between p-12 text-white overflow-hidden bg-[#0A1F44]">
          <img 
            src="/uni-0.jpg" 
            alt="UET Lahore Academic Campus" 
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/65 to-transparent"></div>
          
          <div className="relative z-10 w-full flex items-center gap-2.5">
            <img src="/logo.png" alt="logo" className="h-9 w-9 object-contain rounded-md" />
            <span className="font-logo text-xl text-white">UniRideSync</span>
          </div>

          <div className="relative z-10 text-center my-auto flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#2563EB] to-blue-400 rounded-3xl flex items-center justify-center shadow-lg mb-8">
              <Key className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-white">
              Password Recovery
            </h2>
            <p className="text-slate-200 max-w-sm text-sm leading-relaxed mb-6">
              Recover your UniRideSync account easily. Enter your university email and follow the simulated recovery steps to access the UET Lahore campus transit network.
            </p>
          </div>

          <div className="relative z-10 text-xs text-slate-400">
            © 2026 Team Synapse · UniRideSync Smart Campus Transit
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 bg-[#0A1F44] relative min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.05] bg-grid-plus"></div>

          <div className="relative z-10 p-8 md:p-12 w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full transition-all">
              
              {/* STEP 1: Enter Email */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0A1F44]">Forgot Password</h1>
                    <p className="text-slate-500 text-sm mt-1">Enter your registered .edu university email to receive a recovery code.</p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0A1F44] mb-2">University Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jdoe@university.edu"
                          required
                          className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                        />
                      </div>
                    </div>

                    {localError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2 rounded-xl">
                        {localError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow hover:shadow-lg disabled:opacity-60 text-sm cursor-pointer"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Send Code <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-6">
                    <Link to="/login" className="text-xs text-slate-500 hover:text-[#2563EB] flex items-center justify-center gap-1 font-semibold">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                  </div>
                </div>
              )}

              {/* STEP 2: Verify Code */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Key className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0A1F44]">Verify Code</h1>
                    <p className="text-slate-500 text-xs mt-1">
                      We simulated sending a 6-digit recovery code to <strong className="text-slate-700">{email}</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex justify-between gap-1.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                        />
                      ))}
                    </div>

                    <div className="text-center text-xs text-slate-400">
                      Hint: Enter code <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">123456</span> to reset password.
                    </div>

                    {localError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2 rounded-xl text-center">
                        {localError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 flex items-center justify-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition text-xs cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold py-2.5 rounded-xl transition text-xs shadow disabled:opacity-60 cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Verify <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: Reset Password */}
              {step === 3 && (
                <div>
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0A1F44]">New Password</h1>
                    <p className="text-slate-500 text-sm mt-1">Please enter and confirm your new password below.</p>
                  </div>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0A1F44] mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
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

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                        />
                      </div>
                    </div>

                    {localError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl">
                        {localError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl transition-all shadow hover:shadow-lg disabled:opacity-60 text-sm cursor-pointer"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Reset Password <ShieldCheck className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: Success Message */}
              {step === 4 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 animate-pulse">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-[#0A1F44] mb-2">Password Reset!</h1>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Your password has been successfully reset. You can now login using your new password.
                  </p>
                  
                  <Link
                    to="/login"
                    className="w-full bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold py-3 rounded-xl transition duration-200 shadow hover:shadow-lg text-sm block cursor-pointer"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
