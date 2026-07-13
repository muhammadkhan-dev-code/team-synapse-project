import { useState } from 'react';
import { Mail, Star, Car, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import RideHistoryItem from '../components/RideHistoryItem';
import { useProfile } from '../../controllers/useProfile';
import { useMyRides } from '../../controllers/useRides';

function AvatarLarge({ name }) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0A1F44] flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
      {initials}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { offered, taken, loading: ridesLoading } = useMyRides();
  const [activeTab, setActiveTab] = useState('offered');

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile + Ride History */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <AvatarLarge name={profile?.name} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-extrabold text-[#0A1F44]">{profile?.name}</h1>
                    {profile?.isVerified && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#14B8A6] bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified {profile.verifiedType}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StarRating rating={profile?.rating || 5} />
                      <span className="text-sm font-semibold text-[#0A1F44]">{profile?.rating}</span>
                      <span className="text-sm text-slate-500">({profile?.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Car className="w-3.5 h-3.5" />
                      <span className="font-semibold text-[#0A1F44]">Gold Driver</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {profile?.badges?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {profile.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] transition-all cursor-default"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ride History Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-100">
                {[
                  { key: 'offered', label: 'Rides Offered' },
                  { key: 'taken', label: 'Rides Taken' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    id={`tab-${key}`}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === key
                        ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 flex flex-col gap-3">
                {ridesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  (activeTab === 'offered' ? offered : taken).map((ride) => (
                    <RideHistoryItem key={ride.id} ride={ride} />
                  ))
                )}
                {!ridesLoading && (activeTab === 'offered' ? offered : taken).length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-8">No rides to show.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats Sidebar */}
          <div className="flex flex-col gap-5">
            <StatsCard
              label="Total CO₂ Saved"
              value={`${profile?.co2Saved || 0}kg`}
              subtitle={`Equivalent to ${Math.round((profile?.co2Saved || 0) / 25)} trees planted`}
              color="navy"
            />
            <StatsCard
              label="Rides Shared"
              value={profile?.totalRides || 0}
              subtitle={`Across ${profile?.routesCount || 0} different routes`}
              color="blue"
            />

            {/* Vehicle Details */}
            {profile?.vehicle && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Vehicle Details</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1F44] text-sm">
                      {profile.vehicle.make} {profile.vehicle.model} ({profile.vehicle.year})
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {profile.vehicle.color} · {profile.vehicle.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            {profile?.bio && (
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <p className="text-sm text-slate-600 leading-relaxed italic">{profile.bio}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {profile.major} · {profile.year}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
