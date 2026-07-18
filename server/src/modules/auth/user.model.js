const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

/**
 * User Schema — SRS Section 6.3 (Entity: Users)
 *
 * Fields:
 *   name           — FR-1.4: basic profile
 *   email          — FR-1.1: university email; unique, lowercase
 *   password       — FR-1.5: bcrypt hashed; select: false so it's never returned by default
 *   phone          — FR-1.4: optional contact number
 *   profilePhoto   — FR-1.4: optional URL string (upload separately)
 *   isVerified     — FR-1.2: flips to true after OTP verification
 *   role           — 'student' (default) | 'admin'
 *   otp            — hashed OTP for email verification / resend
 *   otpExpiry      — Date when OTP expires
 *   refreshToken   — stores latest refresh token (plain; acceptable for hackathon scope)
 *   averageRating  — computed aggregate; updated by Ratings module
 *   totalRatings   — denominator for averageRating computation
 *   createdAt/updatedAt — mongoose timestamps
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // NEVER returned in query results by default
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    otp: {
      type: String,
      select: false, // never leak the OTP hash in API responses
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre-save hook: hash password before saving if it has been modified.
 * Uses cost factor 12 as mandated by the security baseline.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

/**
 * Instance method: compare a plaintext password against the stored hash.
 * Deliberately does not re-select password — caller must ensure it's loaded.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', userSchema);
