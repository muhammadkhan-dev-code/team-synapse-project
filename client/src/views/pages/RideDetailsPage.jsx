import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Share2, MapPin, Clock, Calendar, Users, DollarSign,
  Star, Car, ShieldCheck, Pencil, XCircle, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticipantRow from '../components/ParticipantRow';
import { useRideDetail } from '../../controllers/useRides';

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="text-slate-400">{icon}</div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-extrabold text-[#0A1F44]">{value}</p>
    </div>
  );
}

function AvatarPlaceholder({ name }) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0A1F44] flex items-center justify-center text-white text-xl font-extrabold shadow-lg">
      {initials}
    </div>
  );
}

// Default ride (id=ride_005) if no param
const DEFAULT_RIDE_ID = 'ride_005';

export default function RideDetailsPage() {
  const { id } = useParams();
  const rideId = id || DEFAULT_RIDE_ID;
  const { ride, loading, error, accept, decline, actionLoading } = useRideDetail(rideId);

  const statusStyles = {
    confirmed: 'bg-teal-50 text-[#14B8A6] border border-teal-100',
    active: 'bg-blue-50 text-[#2563EB] border border-blue-100',
    completed: 'bg-slate-100 text-slate-600 border border-slate-200',
    cancelled: 'bg-red-50 text-red-600 border border-red-100',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <h2 className="text-xl font-bold text-[#0A1F44] mb-2">Ride not found</h2>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <Link to="/dashboard" className="text-[#2563EB] font-semibold hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allParticipants = [
    ...(ride.participants || []),
    ...(ride.pendingRequests || []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link to="/my-rides" className="hover:text-[#2563EB] font-medium transition-colors">MY RIDES</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">RIDE DETAILS</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/my-rides" className="flex items-center gap-1.5 text-slate-500 text-sm mb-2 hover:text-[#2563EB] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A1F44]">
              {ride.title || 'Ride Details'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full capitalize ${statusStyles[ride.status] || statusStyles.active}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {ride.status}
            </span>
            <button
              id="share-ride-btn"
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#2563EB] hover:border-blue-200 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-slate-100 rounded-2xl h-64 relative overflow-hidden border border-slate-100 shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-[#2563EB] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">Interactive Map</p>
                  <p className="text-xs text-slate-400 mt-1">Route visualization coming soon</p>
                </div>
              </div>
              {/* Route overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between shadow">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0A1F44]">
                    <div className="w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white shadow"></div>
                    {ride.origin}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0A1F44]">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {ride.destination}
                  </div>
                </div>
                {ride.estimatedTime && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Est. Time</p>
                    <p className="text-xl font-extrabold text-[#0A1F44]">{ride.estimatedTime}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ride Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoCard icon={<Clock className="w-4 h-4" />} label="Departure" value={ride.departureTime} />
              <InfoCard icon={<Calendar className="w-4 h-4" />} label="Date" value={ride.date} />
              <InfoCard icon={<Users className="w-4 h-4" />} label="Seats" value={`${ride.seatsAvailable} Left`} />
              <InfoCard icon={<DollarSign className="w-4 h-4" />} label="Price" value={`$${ride.price?.toFixed(2)}`} />
            </div>

            {/* Ride Participants */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#0A1F44]">Ride Participants</h2>
                {ride.pendingRequests?.length > 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                    {ride.pendingRequests.length} Pending Request{ride.pendingRequests.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {/* Pending requests first */}
                {ride.pendingRequests?.map((p) => (
                  <ParticipantRow
                    key={p.id}
                    participant={p}
                    onAccept={accept}
                    onDecline={decline}
                    loading={actionLoading}
                  />
                ))}
                {/* Accepted participants */}
                {ride.participants?.map((p) => (
                  <ParticipantRow
                    key={p.id}
                    participant={p}
                    loading={actionLoading}
                  />
                ))}
                {allParticipants.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No participants yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Driver Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <AvatarPlaceholder name={ride.driver?.name} />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#14B8A6] rounded-full flex items-center justify-center border-2 border-white">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-[#0A1F44] text-lg">{ride.driver?.name}</h3>
              <p className="text-slate-500 text-sm">{ride.driver?.major} · {ride.driver?.year}</p>
              <div className="flex justify-center gap-6 my-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xl font-extrabold text-[#0A1F44]">{ride.driver?.rating?.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
                <div className="w-px bg-slate-100"></div>
                <div>
                  <p className="text-xl font-extrabold text-[#0A1F44]">{ride.driver?.totalRides || 128}</p>
                  <p className="text-xs text-slate-500">Total Rides</p>
                </div>
              </div>
              {ride.driver?.bio && (
                <p className="text-xs text-slate-500 italic bg-slate-50 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
                  {ride.driver.bio}
                </p>
              )}
              <button
                id="view-driver-profile"
                className="w-full border-2 border-[#2563EB] text-[#2563EB] font-semibold py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm"
              >
                View Full Profile
              </button>
            </div>

            {/* Vehicle Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Vehicle Details</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A1F44] text-sm">Toyota Camry (2022)</p>
                  <p className="text-xs text-slate-500">Navy Blue · ABC-1234</p>
                </div>
              </div>
            </div>

            {/* Manage Ride */}
            <div className="bg-[#0A1F44] rounded-2xl p-5 shadow-lg">
              <p className="text-white font-bold mb-4">Manage Ride</p>
              <div className="flex flex-col gap-3">
                <button
                  id="edit-ride-btn"
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all text-sm border border-white/10"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Details
                </button>
                <button
                  id="cancel-ride-btn"
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
