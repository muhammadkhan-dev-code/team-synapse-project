import { Link } from 'react-router-dom';
import { Clock, DollarSign, ShieldCheck, ArrowRight, Play, Car, MapPin, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: <Clock className="w-7 h-7 text-[#2563EB]" />,
    title: 'Time-saving',
    desc: 'Real-time tracking and instant matching mean no more standing at bus stops. Get to class exactly when you need to.',
  },
  {
    icon: <DollarSign className="w-7 h-7 text-[#2563EB]" />,
    title: 'Cost-sharing',
    desc: 'Split fuel and parking costs seamlessly. A sustainable choice that\'s easier on your student budget.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-[#2563EB]" />,
    title: 'Verified Trust',
    desc: 'Mandatory university email verification and internal rating systems ensure you\'re always riding with peers.',
  },
];

const steps = [
  { num: 1, icon: <Car className="w-5 h-5" />, title: 'Post', desc: 'Drivers share their destination and schedule in seconds. Passengers can post ride requests too.' },
  { num: 2, icon: <MapPin className="w-5 h-5" />, title: 'Search', desc: 'Filter by time, location, or department. Find the perfect match for your campus commute.' },
  { num: 3, icon: <MessageSquare className="w-5 h-5" />, title: 'Connect', desc: 'Secure in-app messaging to finalize pickup points and confirm details safely.' },
  { num: 4, icon: <Car className="w-5 h-5" />, title: 'Ride', desc: 'Meet your ride, confirm with a secure code, and enjoy a stress-free journey to campus.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-100 via-blue-50 to-[#F8FAFC] pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1F44] leading-tight tracking-tight mb-5">
              Never Wait for a<br />Ride Again
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md">
              Join the smart campus community. Secure, real-time ride-sharing designed exclusively for students and faculty. Save time, cut costs, and travel safer together.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                to="/login"
                id="hero-get-started"
                className="bg-[#0A1F44] hover:bg-[#0d2a5c] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Get Started
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2.5 text-[#0A1F44] font-semibold hover:text-[#2563EB] transition-colors"
              >
                <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                How it works
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">

              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-2xl font-extrabold text-[#0A1F44]">50+</p>
                <p className="text-xs text-slate-500 font-medium">Campus Locations</p>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="hidden md:block">
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 h-[380px] shadow-2xl flex flex-col justify-end p-8 border border-white/10">
              <img 
                src="/uni-1.jpg" 
                alt="UET Lahore Campus Carpool" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/40 to-transparent"></div>
              
              <div className="relative z-10">
                <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest bg-[#14B8A6]/10 border border-[#14B8A6]/30 px-3 py-1 rounded-full inline-block mb-3 backdrop-blur-sm">
                  UET Lahore Campus Transit
                </span>
                <h2 className="text-white text-3xl font-extrabold leading-tight">
                  Safe. Simple. Shared.
                </h2>
                <p className="text-slate-200 text-xs mt-2 max-w-sm">
                  Commute sustainably with verified students and faculty leaving UET Lahore campuses.
                </p>
                <div className="mt-5 flex gap-2">
                  {['Verified Cars', 'No Costly Cabs', 'Save CO₂'].map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-white/95 bg-white/15 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why UniRideSync */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-[#0A1F44] mb-3">Why UniRideSync?</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Built for the academic lifestyle, our platform prioritizes the three pillars of modern campus transit.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-5 transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-[#0A1F44] mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-3">PROCESS</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1F44] leading-tight mb-5">
              Seamless from<br />A to B
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Our intuitive interface handles the logistics so you can focus on your studies.
            </p>
            {/* Mini map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-48 relative flex items-center justify-center">
              <img 
                src="/uni-0.jpg" 
                alt="UET Lahore Main Campus" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-teal-900/30 to-slate-900/60"></div>
              <div className="text-center relative z-10">
                <MapPin className="w-10 h-10 text-[#38BDF8] mx-auto mb-2" />
                <p className="text-sm font-bold text-white uppercase tracking-wider">UET LAHORE MAIN CAMPUS</p>
                <p className="text-xs text-slate-300 mt-1">GT Road, Lahore, Pakistan</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {steps.map(({ num, icon, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0A1F44] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {num}
                  </div>
                  <div className="text-slate-400">{icon}</div>
                </div>
                <h4 className="font-bold text-[#0A1F44] mb-1.5">{title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-[#0A1F44]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to change how you commute?
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Download the UniRideSync app or sign up on the web today. Exclusive for verified university communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              id="cta-create-account"
              className="bg-white text-[#0A1F44] font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg hover:scale-[1.02]"
            >
              Create Account
            </Link>
            <Link
              to="/dashboard"
              id="cta-explore-rides"
              className="border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
            >
              Explore Rides
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
