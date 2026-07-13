import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, FileText, ShieldCheck, Info, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCreateRide } from '../../controllers/useRides';

export default function PostRidePage() {
  const navigate = useNavigate();
  const { postRide, loading, error, success } = useCreateRide();

  const [form, setForm] = useState({
    destination: '',
    origin: '',
    departureTime: '',
    seatsAvailable: '',
    price: '',
    notes: '',
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postRide({
        ...form,
        seatsAvailable: Number(form.seatsAvailable),
        totalSeats: Number(form.seatsAvailable),
        price: Number(form.price),
      });
      setTimeout(() => navigate('/my-rides'), 1500);
    } catch (err) {
      // error shown via hook
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#0A1F44]">Share Your Journey</h1>
            <p className="text-slate-500 mt-2">
              Fill in the details below to offer a seat to your fellow campus members.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              Ride posted successfully! Redirecting to My Rides...
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <form id="post-ride-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Origin */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Pickup / Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="post-origin"
                    type="text"
                    value={form.origin}
                    onChange={update('origin')}
                    placeholder="Where are you departing from?"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]" />
                  <input
                    id="post-destination"
                    type="text"
                    value={form.destination}
                    onChange={update('destination')}
                    placeholder="Where are you heading?"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              {/* Row: Departure Time + Seats */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Departure Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="post-departure-time"
                      type="datetime-local"
                      value={form.departureTime}
                      onChange={update('departureTime')}
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Seats Available</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      id="post-seats"
                      value={form.seatsAvailable}
                      onChange={update('seatsAvailable')}
                      required
                      className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all appearance-none"
                    >
                      <option value="">Seats</option>
                      <option value="1">1 Seat</option>
                      <option value="2">2 Seats</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  Estimated Cost Share <span className="text-slate-400 font-normal">(per person, optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    id="post-price"
                    type="number"
                    min="0"
                    step="0.50"
                    value={form.price}
                    onChange={update('price')}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  <FileText className="inline w-4 h-4 mr-1.5 text-slate-400" />
                  Optional Notes
                </label>
                <textarea
                  id="post-notes"
                  value={form.notes}
                  onChange={update('notes')}
                  placeholder="e.g. Bringing a small bag, no smoking in car, specific pickup point..."
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all resize-none"
                />
              </div>

              {/* Safety Notice */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                <p className="text-sm text-[#2563EB] font-medium">
                  Your ride will be visible to verified students and staff only.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="post-ride-submit"
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2.5 bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow hover:shadow-lg hover:scale-[1.01] disabled:opacity-60 text-base"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Post Ride <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          {/* Guidelines */}
          <div className="grid grid-cols-2 gap-5 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A1F44]">Community Guidelines</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Please respect departure times and maintain a clean environment for passengers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A1F44]">Safety First</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Always verify the profile of passengers before confirming the pickup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
