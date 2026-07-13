import { useState } from 'react';
import { MapPin, Clock, Star, Users, ArrowRight } from 'lucide-react';

function AvatarPlaceholder({ name, size = 'md' }) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const colors = ['bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-indigo-500', 'bg-emerald-500'];
  const colorIdx = (name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`${sizeClasses[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function RideCard({ ride, onJoin }) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    if (joined) return;
    setJoining(true);
    try {
      if (onJoin) await onJoin(ride.id);
      setJoined(true);
    } finally {
      setJoining(false);
    }
  };

  const seatColor = ride.seatsAvailable === 1
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-teal-50 text-teal-700 border-teal-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col gap-4">
      {/* Driver header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AvatarPlaceholder name={ride.driver?.name} size="md" />
          <div>
            <p className="font-semibold text-[#0A1F44] text-sm leading-tight">{ride.driver?.name}</p>
            <StarRating rating={ride.driver?.rating || 5} />
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${seatColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
          {ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'Seat' : 'Seats'} Left
        </span>
      </div>

      {/* Route */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="w-2 h-2 rounded-full border-2 border-slate-400 flex-shrink-0"></div>
          <span className="truncate">{ride.origin}</span>
        </div>
        <div className="ml-[3px] border-l-2 border-dashed border-slate-200 h-4"></div>
        <div className="flex items-center gap-2 text-[#0A1F44] text-sm font-medium">
          <MapPin className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
          <span className="truncate">{ride.destination}</span>
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Departure</p>
          <p className="text-xl font-bold text-[#0A1F44] leading-tight">{ride.departureTime}</p>
        </div>
        <button
          id={`join-ride-${ride.id}`}
          onClick={handleJoin}
          disabled={joining || joined}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 ${
            joined
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-[#14B8A6] hover:bg-teal-500 text-white hover:scale-[1.03] shadow-sm hover:shadow-teal-200'
          }`}
        >
          {joining ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : joined ? (
            'Requested!'
          ) : (
            <>Request to Join <ArrowRight className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
    </div>
  );
}

export { AvatarPlaceholder, StarRating };
