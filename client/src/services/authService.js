/**
 * Auth Service
 * Handles authentication operations.
 * Currently uses mock data — swap with real API calls when backend is ready.
 */

// ─── Mock Data ──────────────────────────────────────────
const MOCK_USER = {
  id: 'usr_001',
  name: 'Alexander Chen',
  email: 'alexander.chen@university.edu',
  avatar: '',
  rating: 4.9,
  totalReviews: 128,
  totalRides: 86,
  badges: ['Safe Driver', 'Punctual', 'Great Conversation'],
  isVerified: true,
  verifiedType: 'Student',
  major: 'CS Major',
  year: 'Senior Year',
  bio: 'Quiet rider, usually listening to podcasts. Always on time and prefer the AC on low.',
  co2Saved: 142,
  routesCount: 4,
  vehicle: {
    make: 'Toyota',
    model: 'Camry',
    year: '2022',
    color: 'Navy Blue',
    licensePlate: 'ABC-1234',
  },
};

const MOCK_TOKEN = 'mock_jwt_token_uniride_2024';

// ─── Service Methods ────────────────────────────────────

/**
 * Login with university email and password.
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Response: { user: User, token: string }
 */
export async function login(email, password) {
  // TODO: Replace with real API call
  // return apiRequest('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, password }),
  // });

  await new Promise((r) => setTimeout(r, 800)); // Simulate network delay

  if (!email.endsWith('.edu')) {
    throw new Error('Please use your university email address (.edu)');
  }

  const user = { ...MOCK_USER, email };
  localStorage.setItem('uniride_token', MOCK_TOKEN);
  localStorage.setItem('uniride_user', JSON.stringify(user));

  return { user, token: MOCK_TOKEN };
}

/**
 * Register a new account.
 * POST /api/auth/register
 * Body: { name: string, email: string, password: string }
 * Response: { user: User, token: string }
 */
export async function register(data) {
  // TODO: Replace with real API call
  await new Promise((r) => setTimeout(r, 800));

  const user = { ...MOCK_USER, ...data, id: 'usr_' + Date.now() };
  localStorage.setItem('uniride_token', MOCK_TOKEN);
  localStorage.setItem('uniride_user', JSON.stringify(user));

  return { user, token: MOCK_TOKEN };
}

/**
 * Logout the current user.
 * POST /api/auth/logout
 */
export function logout() {
  localStorage.removeItem('uniride_token');
  localStorage.removeItem('uniride_user');
}

/**
 * Get the currently authenticated user from local storage.
 * GET /api/auth/me (when backend is ready)
 */
export function getCurrentUser() {
  const stored = localStorage.getItem('uniride_user');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Check if a user is currently authenticated.
 */
export function isAuthenticated() {
  return !!localStorage.getItem('uniride_token');
}
