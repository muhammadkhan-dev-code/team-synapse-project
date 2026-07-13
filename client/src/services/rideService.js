/**
 * Ride Service — Mock data with real Unsplash photos
 */

const MOCK_RIDES = [
  {
    id: 'ride_001',
    title: 'Morning Campus Commute',
    driver: {
      id: 'usr_d01',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      rating: 5.0, totalReviews: 42, isVerified: true, verifiedType: 'Student',
    },
    origin: 'Campus Central Hub',
    destination: 'Downtown Tech District',
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
    title: 'North Library Express',
    driver: {
      id: 'usr_d02',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
      rating: 4.9, totalReviews: 67, isVerified: true, verifiedType: 'Faculty',
    },
    origin: 'North Campus Library',
    destination: 'East Side Commons',
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
    title: 'Engineering to City Transit',
    driver: {
      id: 'usr_d03',
      name: 'Dr. James Miller',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
      rating: 5.0, totalReviews: 30, isVerified: true, verifiedType: 'Faculty',
    },
    origin: 'South Engineering Wing',
    destination: 'City Transit Station',
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
    title: 'Student Union to Airport',
    driver: {
      id: 'usr_d04',
      name: 'Jordan Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
      rating: 4.2, totalReviews: 19, isVerified: true, verifiedType: 'Student',
    },
    origin: 'Student Union',
    destination: 'Airport Terminal 2',
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
    title: 'Evening Campus Commuter',
    driver: {
      id: 'usr_001',
      name: 'Alexander Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
      rating: 4.9, totalReviews: 128, isVerified: true, verifiedType: 'Student',
      major: 'CS Major', year: 'Senior Year',
      bio: '"Quiet rider, usually listening to podcasts. Always on time and prefer the AC on low."',
      totalRides: 86,
    },
    origin: 'North Campus Hub',
    destination: 'Downtown Tech Center',
    departureTime: '17:30',
    date: 'Oct 24',
    seatsAvailable: 3,
    totalSeats: 4,
    price: 4.50,
    status: 'confirmed',
    participants: [
      { id: 'p_01', user: { id: 'usr_p01', name: 'Maya Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', rating: 5.0, totalRides: 45 }, status: 'accepted' },
    ],
    pendingRequests: [
      { id: 'p_02', user: { id: 'usr_p02', name: 'Liam Henderson', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', rating: 4.9, totalRides: 12 }, status: 'pending' },
    ],
    notes: 'Quiet ride, podcasts playing.',
    estimatedTime: '22 min',
    tag: 'Confirmed',
  },
];

const MOCK_MY_RIDES_OFFERED = [
  {
    id: 'rh_001', origin: 'Campus North', destination: 'West Station',
    dateTime: 'Yesterday, 4:30 PM', vehicle: 'Honda Civic (White)',
    passengerCount: 3, passengers: [{ id: 'p1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop' }, { id: 'p2', avatar: '' }],
    ratingReceived: 5, status: 'completed',
  },
  {
    id: 'rh_002', origin: 'Engineering Block', destination: 'Downtown Hub',
    dateTime: 'Oct 12, 10:15 AM', vehicle: 'Honda Civic (White)',
    passengerCount: 1, passengers: [{ id: 'p1', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop' }],
    ratingReceived: 4, status: 'completed',
  },
];

const MOCK_MY_RIDES_TAKEN = [
  {
    id: 'rh_003', origin: 'Student Union', destination: 'City Library',
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
