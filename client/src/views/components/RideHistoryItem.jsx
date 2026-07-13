import { Bus, ArrowRight } from 'lucide-react';

function StarRatingDisplay({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function RideHistoryItem({ ride }) {
  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    active: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200">
      {/* Left: Icon + Route + Meta */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Bus className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-semibold text-[#0A1F44] text-sm">
            <span>{ride.origin}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{ride.destination}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {ride.dateTime} · {ride.vehicle}
          </p>
          {ride.passengers && ride.passengers.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {ride.passengers.slice(0, 3).map((p, i) => (
                <div key={p.id || i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center -ml-1 first:ml-0">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1">{ride.passengerCount} Passenger{ride.passengerCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Rating + Status */}
      <div className="flex flex-col items-start sm:items-end gap-2 sm:flex-shrink-0">
        {ride.ratingReceived !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rating Received:</span>
            <StarRatingDisplay rating={ride.ratingReceived} />
          </div>
        )}
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusStyles[ride.status] || statusStyles.completed}`}>
          {ride.status}
        </span>
      </div>
    </div>
  );
}
