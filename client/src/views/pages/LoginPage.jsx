import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../controllers/useAuth';

/**
 * Reusable Input Field Component
 */
function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  rightElement,
  required = false,
  testId,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          data-testid={testId}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-2.5 text-sm border rounded-lg bg-slate-50 transition-all focus:outline-none ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
            }`}
          {...props}
        />
        {rightElement && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Error Alert Component
 */
function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-3 animate-in fade-in">
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800 text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-700 font-semibold text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Success Alert Component
 */
function SuccessAlert({ message }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3 animate-in fade-in">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <p className="text-green-800 text-sm font-medium">{message}</p>
    </div>
  );
}

/**
 * Form Validation Utility
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

/**
 * Main Login Page Component
 */
export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  // Validation state
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validation effect
  useEffect(() => {
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    }
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  }, [password, touched.password]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting...');

      // Add a small delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    }
  };

  const handleDemoLogin = useCallback(() => {
    setEmail('demo@uet.edu.pk');
    setPassword('demo123');
    setTouched({ email: true, password: true });
  }, []);

  const handleClearError = useCallback(() => {
    setErrors(prev => ({ ...prev, form: '' }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mt-8 mb-4">

          <p className="text-slate-300 text-xl  text-center">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
          {/* Header with background image */}
          <div
            className="h-28 bg-cover bg-center relative sm:h-32"
            style={{
              backgroundImage: 'url(/login.jpg)',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-white"></div>
          </div>

          {/* Form Container */}
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center mb-8 -mt-3">
              <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Error Alert */}
              {(authError || errors.form) && (
                <ErrorAlert
                  message={authError || errors.form}
                  onDismiss={handleClearError}
                />
              )}

              {/* Success Alert */}
              <SuccessAlert message={success} />

              {/* Email Field */}
              <InputField
                label="Email Address"
                type="email"
                placeholder="student@uet.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : ''}
                icon={Mail}
                testId="login-email"
                required
              />

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/forgotpassword"
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    required
                    data-testid="login-password"
                    className={`w-full pl-12 pr-12 py-2.5 text-sm border rounded-lg bg-slate-50 transition-all focus:outline-none ${touched.password && errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer py-2 hover:text-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-teal-500 cursor-pointer"
                  data-testid="login-remember"
                />
                <span className="text-xs">Remember me for 30 days</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                data-testid="login-submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* University Portal Button */}
              <button
                type="button"
                data-testid="login-university-portal"
                className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-sm"
              >
                🎓 Sign in with University Portal
              </button>

              {/* Demo Login Button (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full text-xs py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Demo Login
                </button>
              )}
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-slate-600 mt-8">
              New to UniRideSync?{' '}
              <Link
                to="/signup"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}