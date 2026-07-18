import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../controllers/useAuth';

// ─────────────────────────────────────────────
// Reusable Components (aligned with LoginPage)
// ─────────────────────────────────────────────

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  rightElement,
  required = false,
  testId,
  helperText,
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
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          data-testid={testId}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-2.5 text-sm border rounded-lg bg-slate-50 transition-all focus:outline-none ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
            }`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {helperText && !error && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

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

function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3 animate-in fade-in">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <p className="text-green-800 text-sm font-medium">{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Validation Utilities
// ─────────────────────────────────────────────

function validateName(name) {
  if (!name) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  if (!email.endsWith('.edu') && !email.endsWith('.edu.pk')) {
    return 'Only university email addresses (.edu or .edu.pk) are allowed';
  }
  return '';
}

function validatePhone(phone) {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, '')))
    return 'Enter a valid Pakistani mobile number (e.g. 03001234567)';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number';
  return '';
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
}

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const strengths = [
    { score: 1, label: 'Weak', color: 'bg-red-500' },
    { score: 2, label: 'Fair', color: 'bg-orange-500' },
    { score: 3, label: 'Good', color: 'bg-yellow-500' },
    { score: 4, label: 'Strong', color: 'bg-green-500' },
  ];
  return strengths[Math.min(score - 1, 3)] || { score: 0, label: 'None', color: 'bg-slate-200' };
}

// ─────────────────────────────────────────────
// Step 1: Registration Form
// ─────────────────────────────────────────────

function Step1Form({ formData, errors, touched, onChange, onBlur, onSubmit, isLoading }) {
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-500 text-sm mt-1">Fill in your details to get started</p>
      </div>

      {/* Full Name */}
      <InputField
        label="Full Name"
        type="text"
        placeholder="e.g. Ahmed Khan"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        onBlur={() => onBlur('name')}
        error={touched.name ? errors.name : ''}
        icon={User}
        required
        testId="signup-name"
      />

      {/* University Email */}
      <InputField
        label="University Email"
        type="email"
        placeholder="student@university.edu.pk"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        onBlur={() => onBlur('email')}
        error={touched.email ? errors.email : ''}
        icon={Mail}
        required
        helperText="Must end in .edu or .edu.pk"
        testId="signup-email"
      />

      {/* Phone Number */}
      <InputField
        label="Phone Number"
        type="tel"
        placeholder="03001234567"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        onBlur={() => onBlur('phone')}
        error={touched.phone ? errors.phone : ''}
        icon={Phone}
        required
        helperText="Pakistani mobile number"
        testId="signup-phone"
      />

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            onBlur={() => onBlur('password')}
            placeholder="••••••••"
            required
            data-testid="signup-password"
            className={`w-full pl-12 pr-12 py-2.5 text-sm border rounded-lg bg-slate-50 transition-all focus:outline-none ${touched.password && errors.password
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
              }`}
          />
          <button
            type="button"
            onClick={() => onChange('showPassword', !formData.showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label={formData.showPassword ? 'Hide password' : 'Show password'}
          >
            {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength */}
        {formData.password && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                />
              </div>
              <span className="text-slate-600 font-medium text-[10px] min-w-fit">
                {passwordStrength.label}
              </span>
            </div>
            <ul className="text-[10px] text-slate-500 space-y-0.5">
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                ✓ Uppercase letter
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                ✓ Number
              </li>
              <li className={formData.password.length >= 6 ? 'text-green-600' : ''}>
                ✓ At least 6 characters
              </li>
            </ul>
          </div>
        )}

        {touched.password && errors.password && (
          <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type={formData.showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            onBlur={() => onBlur('confirmPassword')}
            placeholder="••••••••"
            required
            data-testid="signup-confirm-password"
            className={`w-full pl-12 pr-12 py-2.5 text-sm border rounded-lg bg-slate-50 transition-all focus:outline-none ${touched.confirmPassword && errors.confirmPassword
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : formData.confirmPassword && !errors.confirmPassword
                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
              }`}
          />
          <button
            type="button"
            onClick={() => onChange('showConfirmPassword', !formData.showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label={formData.showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {formData.showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {/* Match indicator */}
        {formData.confirmPassword && !errors.confirmPassword && (
          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
            <CheckCircle className="w-3 h-3" />
            <span>Passwords match</span>
          </div>
        )}
        {touched.confirmPassword && errors.confirmPassword && (
          <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.confirmPassword}</span>
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer py-1 hover:text-slate-700 transition-colors">
        <input
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => onChange('agreeToTerms', e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded accent-teal-500 cursor-pointer flex-shrink-0"
          data-testid="signup-terms"
        />
        <span className="text-xs">
          I agree to the{' '}
          <Link to="/terms" className="text-teal-600 font-semibold hover:text-teal-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-teal-600 font-semibold hover:text-teal-700">
            Privacy Policy
          </Link>
        </span>
      </label>
      {touched.agreeToTerms && errors.agreeToTerms && (
        <div className="flex items-center gap-1 text-red-600 text-xs -mt-2">
          <AlertCircle className="w-3 h-3" />
          <span>{errors.agreeToTerms}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.agreeToTerms}
        data-testid="signup-step1-submit"
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="text-xs text-slate-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* University Portal */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-sm"
      >
        🎓 Sign up with University Portal
      </button>

      {/* Login Link */}
      <p className="text-center text-xs text-slate-600 mt-4">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// Step 2: OTP Verification
// ─────────────────────────────────────────────

function Step2Form({ email, otp, onOtpChange, onOtpKeyDown, onSubmit, onBack, error, isLoading, success }) {
  const otpComplete = otp.every((digit) => digit !== '');

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Verify Your Email</h2>
        <p className="text-slate-500 text-sm mt-1">
          We sent a 6-digit code to{' '}
          <strong className="text-slate-700 break-all">{email}</strong>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-between gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onOtpChange(idx, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(idx, e)}
            data-testid={`otp-input-${idx}`}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all hover:border-slate-300"
            placeholder="•"
          />
        ))}
      </div>

      {/* Demo hint */}
      <div className="text-center text-xs text-slate-400 bg-slate-50 py-2.5 rounded-lg">
        Demo code:{' '}
        <span className="font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
          123456
        </span>
      </div>

      {/* Alerts */}
      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-semibold py-2.5 rounded-lg transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={!otpComplete || isLoading}
          data-testid="signup-step2-submit"
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-2.5 rounded-lg transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Verify & Register <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Resend */}
      <p className="text-center text-xs text-slate-400">
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={() => alert('Verification code resent! (Simulated)')}
          className="text-teal-600 font-semibold hover:text-teal-700 transition-colors bg-transparent border-0 cursor-pointer"
        >
          Resend
        </button>
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// Main SignupPage Component
// ─────────────────────────────────────────────

export default function SignupPage() {
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    agreeToTerms: false,
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: '',
    otp: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    agreeToTerms: false,
  });

  // Live validation on change
  useEffect(() => {
    if (touched.name) setErrors((p) => ({ ...p, name: validateName(formData.name) }));
  }, [formData.name, touched.name]);

  useEffect(() => {
    if (touched.email) setErrors((p) => ({ ...p, email: validateEmail(formData.email) }));
  }, [formData.email, touched.email]);

  useEffect(() => {
    if (touched.phone) setErrors((p) => ({ ...p, phone: validatePhone(formData.phone) }));
  }, [formData.phone, touched.phone]);

  useEffect(() => {
    if (touched.password) setErrors((p) => ({ ...p, password: validatePassword(formData.password) }));
  }, [formData.password, touched.password]);

  useEffect(() => {
    if (touched.confirmPassword)
      setErrors((p) => ({
        ...p,
        confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      }));
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFieldBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleStep1Submit = useCallback(
    (e) => {
      e.preventDefault();
      setSuccess('');

      const nameError = validateName(formData.name);
      const emailError = validateEmail(formData.email);
      const phoneError = validatePhone(formData.phone);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      const termsError = !formData.agreeToTerms ? 'You must agree to the Terms of Service' : '';

      setErrors({ name: nameError, email: emailError, phone: phoneError, password: passwordError, confirmPassword: confirmPasswordError, agreeToTerms: termsError, otp: '' });
      setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true, agreeToTerms: true });

      if (nameError || emailError || phoneError || passwordError || confirmPasswordError || termsError) return;

      setStep(2);
    },
    [formData]
  );

  const handleOtpChange = useCallback(
    (index, value) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    },
    [otp]
  );

  const handleStep2Submit = useCallback(
    async (e) => {
      e.preventDefault();
      const enteredOtp = otp.join('');

      if (enteredOtp.length < 6) {
        setErrors((prev) => ({ ...prev, otp: 'Please enter all 6 digits' }));
        return;
      }

      setErrors((prev) => ({ ...prev, otp: '' }));

      try {
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          isVerified: true,
        });
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 500);
      } catch (err) {
        setErrors((prev) => ({ ...prev, otp: err.message || 'Registration failed' }));
      }
    },
    [formData, otp, register, navigate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Page subtitle */}
        <div className="text-center mt-8 mb-4">
          <p className="text-slate-300 text-xl text-center">Create your UniRideSync account</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">

          <div
            className="h-28 bg-cover bg-center relative sm:h-32"
            style={{
              backgroundImage: 'url(/signup.jpg)',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-white"></div>
          </div>

          {/* Form */}
          <div className="px-6 py-6 sm:px-8">
            {step === 1 && (
              <Step1Form
                formData={formData}
                errors={errors}
                touched={touched}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                onSubmit={handleStep1Submit}
                isLoading={loading}
              />
            )}
            {step === 2 && (
              <Step2Form
                email={formData.email}
                otp={otp}
                onOtpChange={handleOtpChange}
                onOtpKeyDown={handleOtpKeyDown}
                onSubmit={handleStep2Submit}
                onBack={() => setStep(1)}
                error={errors.otp || authError}
                isLoading={loading}
                success={success}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}