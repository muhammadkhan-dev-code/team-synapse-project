import { useState } from 'react';
import { MapPin, Clock, ChevronDown, Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ destination, time, seats });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-end"
    >
      {/* Destination */}
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Time */}
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-slate-600"
          />
        </div>
      </div>

      {/* Seats */}
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seats</label>
        <div className="relative">
          <select
            id="search-seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full pl-4 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all appearance-none text-slate-600"
          >
            <option value="">Any Seats</option>
            <option value="1">1 Seat</option>
            <option value="2">2 Seats</option>
            <option value="3">3 Seats</option>
            <option value="4">4+ Seats</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Search Button */}
      <button
        id="search-rides-btn"
        type="submit"
        className="flex items-center gap-2 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow hover:shadow-lg hover:scale-[1.02] whitespace-nowrap"
      >
        <Search className="w-4 h-4" />
        Search Rides
      </button>
    </form>
  );
}
