/**
 * Ride Service — Mock data with real Unsplash photos
 */

const MOCK_RIDES = [
  {
    id: 'ride_001',
    title: 'UET Main Campus to GT Road',
    driver: {
      id: 'usr_d01',
      name: 'Alex Rivera',
      avatar: '',
      rating: 5.0, totalReviews: 42, isVerified: true, verifiedType: 'Student',
    },
    origin: 'UET Main Campus',
    destination: 'GT Road',
    departureTime: '08:30 AM',
    date: 'Today',
    seatsAvailable: 2,
    totalSeats: 4,
    price: 3.50,
    status: 'active',
    participants: [], pendingRequests: [],
    notes: '',
    estimatedTime: '18 min',
    tag: 'Popular',
  },
  {
    id: 'ride_002',
    title: 'UET Library Express to Hostel',
    driver: {
      id: 'usr_d02',
      name: 'Sarah Chen',
      avatar: '',
      rating: 4.9, totalReviews: 67, isVerified: true, verifiedType: 'Faculty',
    },
    origin: 'UET Main Library',
    destination: 'UET Boys Hostel',
    departureTime: '09:15 AM',
    date: 'Today',
    seatsAvailable: 1,
    totalSeats: 3,
    price: 2.00,
    status: 'active',
    participants: [], pendingRequests: [],
    notes: 'Music-free ride preferred.',
    estimatedTime: '22 min',
    tag: 'Last Seat',
  },
  {
    id: 'ride_003',
    title: 'UET Mechanical Wing to Lahore Junction',
    driver: {
      id: 'usr_d03',
      name: 'Dr. James Miller',
      avatar: '',
      rating: 5.0, totalReviews: 30, isVerified: true, verifiedType: 'Faculty',
    },
    origin: 'UET Mechanical Block',
    destination: 'Lahore Junction Station',
    departureTime: '10:00 AM',
    date: 'Today',
    seatsAvailable: 3,
    totalSeats: 4,
    price: 4.00,
    status: 'active',
    participants: [], pendingRequests: [],
    notes: '',
    estimatedTime: '30 min',
    tag: 'Faculty',
  },
  {
    id: 'ride_004',
    title: 'UET Campus to Allama Iqbal Airport',
    driver: {
      id: 'usr_d04',
      name: 'Jordan Smith',
      avatar: '',
      rating: 4.2, totalReviews: 19, isVerified: true, verifiedType: 'Student',
    },
    origin: 'UET Main Campus',
    destination: 'Allama Iqbal Airport',
    departureTime: '11:45 AM',
    date: 'Today',
    seatsAvailable: 4,
    totalSeats: 5,
    price: 6.50,
    status: 'active',
    participants: [], pendingRequests: [],
    notes: 'Luggage OK, no smoking.',
    estimatedTime: '45 min',
    tag: 'Airport',
  },
  {
    id: 'ride_005',
    title: 'UET Main Gate to Faisal Town',
    driver: {
      id: 'usr_001',
      name: 'Alexander Chen',
      avatar: '',
      rating: 4.9, totalReviews: 128, isVerified: true, verifiedType: 'Student',
      major: 'CS Major', year: 'Senior Year',
      bio: '"Quiet rider, usually listening to podcasts. Always on time and prefer the AC on low."',
      totalRides: 86,
    },
    origin: 'UET Main Gate',
    destination: 'Faisal Town',
    departureTime: '17:30',
    date: 'Oct 24',
    seatsAvailable: 3,
    totalSeats: 4,
    price: 4.50,
    status: 'confirmed',
    participants: [
      { id: 'p_01', user: { id: 'usr_p01', name: 'Maya Chen', avatar: '', rating: 5.0, totalRides: 45 }, status: 'accepted' },
    ],
    pendingRequests: [
      { id: 'p_02', user: { id: 'usr_p02', name: 'Liam Henderson', avatar: '', rating: 4.9, totalRides: 12 }, status: 'pending' },
    ],
    notes: 'Quiet ride, podcasts playing.',
    estimatedTime: '22 min',
    tag: 'Confirmed',
  },
];

const MOCK_MY_RIDES_OFFERED = [
  {
    id: 'rh_001', origin: 'UET Main Campus', destination: 'GT Road',
    dateTime: 'Yesterday, 4:30 PM', vehicle: 'Honda Civic (White)',
    passengerCount: 3, passengers: [{ id: 'p1', avatar: '' }, { id: 'p2', avatar: '' }],
    ratingReceived: 5, status: 'completed',
  },
  {
    id: 'rh_002', origin: 'UET Mechanical Block', destination: 'Lahore Junction Station',
    dateTime: 'Oct 12, 10:15 AM', vehicle: 'Honda Civic (White)',
    passengerCount: 1, passengers: [{ id: 'p1', avatar: '' }],
    ratingReceived: 4, status: 'completed',
  },
];

const MOCK_MY_RIDES_TAKEN = [
  {
    id: 'rh_003', origin: 'UET Main Library', destination: 'UET Boys Hostel',
    dateTime: 'Oct 10, 9:00 AM', vehicle: 'Toyota Camry (Blue)',
    passengerCount: 0, passengers: [],
    ratingReceived: 5, status: 'completed',
  },
];

export async function getAvailableRides(filters = {}) {
  await new Promise((r) => setTimeout(r, 600));
  let rides = [...MOCK_RIDES].filter((r) => r.status === 'active');
  if (filters.destination) {
    const q = filters.destination.toLowerCase();
    rides = rides.filter((r) =>
      r.destination.toLowerCase().includes(q) || r.origin.toLowerCase().includes(q)
    );
  }
  if (filters.seats) rides = rides.filter((r) => r.seatsAvailable >= Number(filters.seats));
  if (filters.sort === 'price_asc') rides.sort((a, b) => a.price - b.price);
  return rides;
}

export async function getRideById(id) {
  await new Promise((r) => setTimeout(r, 400));
  const ride = MOCK_RIDES.find((r) => r.id === id);
  if (!ride) throw new Error('Ride not found');
  return ride;
}

export async function createRide(data) {
  await new Promise((r) => setTimeout(r, 800));
  return { id: 'ride_' + Date.now(), status: 'active', driver: JSON.parse(localStorage.getItem('uniride_user') || '{}'), participants: [], pendingRequests: [], ...data };
}

export async function requestToJoin(rideId) {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, message: 'Request sent successfully!' };
}

export async function acceptParticipant(rideId, userId) {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true };
}

export async function declineParticipant(rideId, userId) {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true };
}

export async function getMyRides() {
  await new Promise((r) => setTimeout(r, 500));
  return { offered: MOCK_MY_RIDES_OFFERED, taken: MOCK_MY_RIDES_TAKEN };
}

export async function getActiveRide() {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_RIDES.find((r) => r.id === 'ride_005') || null;
}
