import { Link } from 'react-router-dom';
import { Plus, Car } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RideHistoryItem from '../components/RideHistoryItem';
import { useMyRides } from '../../controllers/useRides';

export default function MyRidesPage() {
  const { offered, taken, loading } = useMyRides();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A1F44]">My Rides</h1>
            <p className="text-slate-500 text-sm mt-1">Track your rides offered and taken</p>
          </div>
          <Link
            to="/post-ride"
            id="my-rides-post-btn"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow text-sm"
          >
            <Plus className="w-4 h-4" />
            Post a Ride
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Active Ride Preview */}
            <div className="bg-gradient-to-r from-[#0A1F44] to-[#1e3a6e] rounded-2xl p-6 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Active Ride</p>
                  <h2 className="text-xl font-extrabold">Evening Campus Commuter</h2>
                  <p className="text-white/60 text-sm mt-1">North Campus Hub → Downtown Tech Center</p>
                  <p className="text-white/50 text-xs mt-1">Today, 17:30 · 3 seats left · $4.50</p>
                </div>
                <Link
                  to="/rides/ride_005"
                  id="view-active-ride"
                  className="flex items-center gap-2 bg-white text-[#0A1F44] font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-sm shadow whitespace-nowrap"
                >
                  <Car className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>

            {/* Rides Offered */}
            <div>
              <h2 className="text-lg font-bold text-[#0A1F44] mb-4">
                Rides Offered
                <span className="ml-2 text-sm font-normal text-slate-400">({offered.length})</span>
              </h2>
              {offered.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {offered.map((ride) => (
                    <RideHistoryItem key={ride.id} ride={ride} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                  <Car className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">You haven't offered any rides yet.</p>
                  <Link to="/post-ride" className="text-[#2563EB] font-semibold text-sm hover:underline mt-2 inline-block">
                    Post your first ride
                  </Link>
                </div>
              )}
            </div>

            {/* Rides Taken */}
            <div>
              <h2 className="text-lg font-bold text-[#0A1F44] mb-4">
                Rides Taken
                <span className="ml-2 text-sm font-normal text-slate-400">({taken.length})</span>
              </h2>
              {taken.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {taken.map((ride) => (
                    <RideHistoryItem key={ride.id} ride={ride} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                  <p className="text-slate-500 text-sm">You haven't taken any rides yet.</p>
                  <Link to="/dashboard" className="text-[#2563EB] font-semibold text-sm hover:underline mt-2 inline-block">
                    Find a ride
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
