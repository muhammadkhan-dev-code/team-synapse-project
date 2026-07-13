const MOCK_PROFILE = {
  id: 'usr_001',
  name: 'Alexander Chen',
  email: 'alexander.chen@university.edu',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  rating: 4.9,
  totalReviews: 128,
  totalRides: 86,
  badges: ['Safe Driver', 'Punctual', 'Great Conversation'],
  isVerified: true,
  verifiedType: 'Student',
  major: 'CS Major',
  year: 'Senior Year',
  bio: '"Quiet rider, usually listening to podcasts. Always on time and prefer the AC on low."',
  co2Saved: 142,
  routesCount: 4,
  vehicle: { make: 'Toyota', model: 'Camry', year: '2022', color: 'Navy Blue', licensePlate: 'ABC-1234' },
};

export async function getUserProfile(id) {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PROFILE;
}

export async function getMyProfile() {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PROFILE;
}

export async function updateProfile(data) {
  await new Promise((r) => setTimeout(r, 600));
  const updated = { ...MOCK_PROFILE, ...data };
  localStorage.setItem('uniride_user', JSON.stringify(updated));
  return updated;
}
