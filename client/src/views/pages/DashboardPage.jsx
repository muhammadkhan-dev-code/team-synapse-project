import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import RideCard from '../components/RideCard';
import { useRides } from '../../controllers/useRides';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-3.5 w-28 bg-slate-200 rounded mb-2"></div>
          <div className="h-2.5 w-20 bg-slate-100 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
        <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
      </div>
      <div className="h-px bg-slate-100 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-7 w-20 bg-slate-100 rounded"></div>
        <div className="h-9 w-32 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { rides, loading, error, search, joinRide } = useRides();
  const [sort, setSort] = useState('latest');
  const [visibleCount, setVisibleCount] = useState(6);

  const sortedRides = [...rides].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    return 0; // latest = default order
  });

  const visibleRides = sortedRides.slice(0, visibleCount);

  const handleSearch = (filters) => {
    const sortFilter = sort === 'price_asc' ? { ...filters, sort: 'price_asc' } : filters;
    search(sortFilter);
    setVisibleCount(6);
  };

  const handleSort = (newSort) => {
    setSort(newSort);
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A1F44]">
            Find your next campus ride
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Browse available rides or search for your destination</p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Available Rides Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0A1F44]">Available Rides</h2>
            {!loading && (
              <p className="text-slate-500 text-sm mt-0.5">
                {rides.length} ride{rides.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <button
              id="sort-latest"
              onClick={() => handleSort('latest')}
              className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                sort === 'latest'
                  ? 'bg-[#0A1F44] text-white border-[#0A1F44] shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              Latest First
            </button>
            <button
              id="sort-price"
              onClick={() => handleSort('price_asc')}
              className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                sort === 'price_asc'
                  ? 'bg-[#0A1F44] text-white border-[#0A1F44] shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              Price: Low to High
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Ride Cards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : visibleRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} onJoin={joinRide} />
              ))}
        </div>

        {/* Empty State */}
        {!loading && rides.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChevronDown className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 mb-2">No rides found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search filters</p>
          </div>
        )}

        {/* Load More */}
        {!loading && visibleCount < sortedRides.length && (
          <div className="flex justify-center mt-10">
            <button
              id="load-more-rides"
              onClick={() => setVisibleCount((v) => v + 3)}
              className="flex items-center gap-2 border border-slate-200 bg-white text-[#0A1F44] font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 hover:shadow transition-all text-sm"
            >
              Load More Rides <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
