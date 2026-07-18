import {
  CreditCard,
  HelpCircle,
  Lock,
  MapPin,
  Play,
  Shield,
  Smartphone,
  Star,
  UserCheck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',

    tag: 'VERIFIED · SAFE · RELIABLE'
  },
  {
    img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',

    tag: 'COMMUNITY · SHARING · TRUST'
  },
  {
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',

    tag: 'REAL-TIME · MAPS · NAVIGATION'
  },
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',

    tag: 'CASH · BANK TRANSFER · SECURITY'
  }
]

export default function LandingPage () {
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto transition for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex flex-col font-sans transition-colors duration-300'>
      <Navbar />
      {' '}
      <section className='relative bg-gray-800  pt-20 pb-28 overflow-hidden border-b'>

        <div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative '>
         
          <div className='flex flex-col items-start text-left'>
            <h1 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight'>
              Your Trusted Campus
              <br />
              <span className='text-transparent bg-clip-text bg-amber-200'>
                Ride-Hailing
              </span>{' '}
              Platform
            </h1>

            <p className='text-slate-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl'>
              UniRideSync is a university transportation app built for safe
              campus rides, verified drivers, and reliable student mobility
              across university communities in Nigeria.
            </p>

            <div className='flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto'>
              <a
                href='#download'
                className='flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] cursor-pointer'
              >
                <Play className='w-5 h-5 fill-current' />
                <span>Get UniRide on Google Play</span>
              </a>

              <Link
                to='/signup'
                className='flex-1 sm:flex-none inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#0A1F44] font-bold px-7 py-4 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] cursor-pointer'
              >
                Become a Driver
              </Link>
            </div>
          </div>

          {/* Hero Right (Interactive Carousel matching Screenshot 1 Right) */}
          <div className='w-full  relative'>
            <div className='relative w-full aspect-[4/3] sm:h-[450px] md:h-[480px] rounded-xl overflow-hidden  border border-white/10 group bg-slate-950'>
              {/* Slides */}
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 z-4' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.img}
                    alt='Campus Ride'
                    className='w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30'></div>
                </div>
              ))}

              {/* Top Left overlay on Image */}

              {/* Bottom Content overlay on Image */}
              <div className='absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col gap-4'>
                {/* Horizontal line and slide details */}
              

                {/* Slides Navigation Indicators */}
                <div className='flex gap-2'>
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeSlide
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section (Screenshot 2 Layout) */}
      <section
        id='about'
        className='py-24 bg-white px-6 border-b border-slate-100'
      >
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16 max-w-3xl mx-auto'>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-[#0A1F44] tracking-tight mb-4'>
              About Our University Transportation Platform
            </h2>
            <p className='text-slate-500 text-lg leading-relaxed'>
              UniRideSync is a secure campus ride-sharing platform designed
              exclusively for university students and faculty who need
              dependable campus transportation in Nigeria.
            </p>
          </div>

          {/* Grid Content */}
          <div className='grid md:grid-cols-2 gap-10 items-stretch'>
            {/* Left Column Card */}
            <div className='bg-slate-50 border border-slate-200/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-center'>
              <h3 className='text-2xl font-bold text-[#0A1F44] mb-6 flex items-center gap-2.5'>
                <span className='w-2 h-6 bg-[#2563EB] rounded-full'></span>
                Our Mission
              </h3>

              <div className='space-y-5 text-slate-600 text-base leading-relaxed'>
                <p>
                  UniRideSync reimagines campus transportation with a
                  student-first platform where riders can create accounts,
                  request rides, track drivers in real time, and complete secure
                  payments with less friction.
                </p>
                <p>
                  Our campus mobility software includes biometric
                  authentication, single-device restriction, and secure ride
                  check-in codes. Every driver completes identity verification
                  and screening before approval.
                </p>
                <p>
                  UniRideSync combines modern real-time technology with
                  operational safety controls to deliver safe campus rides,
                  reliable driver coordination, and affordable university
                  transportation.
                </p>
              </div>
            </div>

            {/* Right Column Image Block with text overlay */}
            <div className='relative rounded-3xl overflow-hidden shadow-lg min-h-[350px] md:min-h-full group'>
              <img
                src='https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80'
                alt='Student driving on campus'
                className='w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20'></div>

              {/* Centered text overlay */}
              <div className='absolute inset-0 flex flex-col justify-end p-8 sm:p-10 text-left'>
                <h4 className='text-2xl sm:text-3xl font-extrabold text-white mb-2'>
                  Making Campus Travel Simple
                </h4>
                <p className='text-slate-300 font-semibold flex items-center gap-2 text-sm sm:text-base'>
                  <span>Safe</span>
                  <span className='w-1.5 h-1.5 bg-[#14B8A6] rounded-full'></span>
                  <span>Reliable</span>
                  <span className='w-1.5 h-1.5 bg-[#14B8A6] rounded-full'></span>
                  <span>Affordable</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Current Fare Policy Section (Screenshot 3 Layout) */}
      <section
        id='for-drivers'
        className='py-24 bg-[#0A1F44] bg-grid-plus px-6 text-white border-b border-white/10 relative'
      >
        <div className='absolute inset-0 bg-[#0d244c]/70 pointer-events-none'></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight mb-3'>
              Current Fare Policy
            </h2>
            <p className='text-slate-300 text-lg max-w-md mx-auto font-medium'>
              Active fare settings - Admin controlled mode
            </p>
          </div>

          {/* Cards Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { label: 'Base Fare', value: '₦500' },
              { label: 'Per KM Rate', value: '₦50/km' },
              { label: 'Per Minute Rate', value: '₦10/min' },
              { label: 'Minimum Fare', value: '₦200' }
            ].map((card, i) => (
              <div
                key={i}
                className='bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm hover:bg-white/10 hover:border-[#14B8A6]/40 hover:scale-[1.02] transition-all duration-300 group'
              >
                <p className='text-slate-300 text-sm font-semibold tracking-wider mb-4 uppercase group-hover:text-white transition-colors'>
                  {card.label}
                </p>
                <p className='text-[#F59E0B] text-4xl font-extrabold tracking-tight'>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className='text-center text-slate-400 text-sm mt-12 italic'>
            * Fares are calculated automatically based on distance and duration.
            Drivers earn competitive rates for every ride.
          </p>
        </div>
      </section>
      {/* Why Students Choose UniRideSync Section (Screenshot 4 Layout) */}
      <section id='why-choose' className='py-24 bg-[#F8FAFC] px-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16 max-w-3xl mx-auto'>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-[#0A1F44] tracking-tight mb-4'>
              Why Students Choose UniRideSync
            </h2>
            <p className='text-slate-500 text-lg leading-relaxed'>
              Experience a secure campus ride-hailing platform designed for
              university students who need fast, safe, and reliable daily
              transportation.
            </p>
          </div>

          {/* 3x2 Cards Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Shield className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Biometric Security',
                desc: 'Advanced biometric authentication and single-device binding ensures only verified students can access the platform.'
              },
              {
                icon: <MapPin className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Real-Time Tracking',
                desc: 'Track your ride in real-time with GPS-enabled live location updates powered by OpenStreetMap and OpenRouteService.'
              },
              {
                icon: <CreditCard className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Flexible Payments',
                desc: 'Choose between cash or bank transfer payments. View driver bank details securely after booking confirmation.'
              },
              {
                icon: <UserCheck className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Verified Drivers',
                desc: 'All drivers undergo thorough verification with ID uploads and admin approval before they can offer rides.'
              },
              {
                icon: <Lock className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Secure Check-In',
                desc: '4-digit check-in codes ensure you board the right ride. Codes are generated per ride for maximum security.'
              },
              {
                icon: <Smartphone className='w-6 h-6 text-[#14B8A6]' />,
                title: 'Mobile-First Design',
                desc: 'Built specifically for mobile devices with an intuitive interface designed for students on the go.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className='bg-white border border-slate-150/60 rounded-3xl p-8 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left'
              >
                {/* Icon box (dark square matching layout) */}
                <div className='bg-[#0A1F44] text-white p-3.5 rounded-2xl mb-6 shadow-md shadow-[#0A1F44]/20 flex items-center justify-center'>
                  {feature.icon}
                </div>
                <h4 className='font-bold text-xl text-[#0A1F44] mb-3'>
                  {feature.title}
                </h4>
                <p className='text-slate-500 text-sm leading-relaxed'>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Reviews Anchor for Scroll Support */}
      <section
        id='reviews'
        className='py-12 bg-white px-6 border-t border-slate-100'
      >
        <div className='max-w-7xl mx-auto text-center'>
          <div className='inline-flex items-center gap-1 text-amber-500 mb-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className='w-5 h-5 fill-current' />
            ))}
          </div>
          <blockquote className='text-xl font-bold text-[#0A1F44] max-w-2xl mx-auto mb-4 leading-relaxed'>
            "UniRideSync makes getting around campus so simple. I save money
            every week by carpooling, and it's great knowing everyone is
            verified."
          </blockquote>
          <cite className='text-slate-500 text-sm font-semibold not-italic'>
            — Tobi A., Lagos State University Student
          </cite>
        </div>
      </section>
      {/* Support / Contact Section */}
      <section
        id='support'
        className='py-20 bg-[#0A1F44] text-white px-6 relative border-t border-white/10'
      >
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <HelpCircle className='w-12 h-12 text-[#14B8A6] mx-auto mb-6' />
          <h2 className='text-3xl sm:text-4xl font-extrabold mb-4'>
            Need Help or Have Questions?
          </h2>
          <p className='text-slate-300 text-lg mb-10 max-w-lg mx-auto'>
            Our support desk is active 24/7 for verified students and drivers.
            Reach out to our campus ambassadors anytime.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              to='/login'
              className='bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02]'
            >
              Get Started Now
            </Link>
            <a
              href='mailto:support@uniridesync.edu'
              className='border border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02]'
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
