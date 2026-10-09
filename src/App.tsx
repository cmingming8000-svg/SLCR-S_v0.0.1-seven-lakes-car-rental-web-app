import { useState, useMemo, useEffect } from 'react';
import {
  Car, MapPin, Clock, Phone, Calendar, Users, Plane, Compass,
  ChevronRight, CheckCircle2, Upload, FileText,
  Package, Luggage, Shield, ArrowRight, Menu, X,
  CalendarDays, BarChart3, CircleDot, Trash2, Eye,
  Sparkles, Zap, Award, Navigation, Gauge, Fuel,
  ChevronDown, Star, AlertCircle
} from 'lucide-react';

// ==================== TYPES ====================
interface Booking {
  id: string;
  type: 'rental' | 'carpool';
  vehicle?: string;
  serviceType?: string;
  date: string;
  time: string;
  pickup: string;
  destination?: string;
  hours?: number;
  contact: string;
  withDriver?: boolean;
  baggage?: string;
  totalPrice?: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'No-Show';
  submittedAt: string;
}

// ==================== VEHICLE DATA ====================
const vehicles = [
  { id: 'sedan', name: 'Sedan', model: 'Mitsubishi Mirage', rate: 150, seats: 4, transmission: 'AT', fuel: 'Gasoline', image: '/images/mirage-sedan.png' },
  { id: 'suv', name: 'SUV', model: 'Toyota Avanza', rate: 200, seats: 7, transmission: 'MT/AT', fuel: 'Gasoline', image: '/images/avanza-suv.png' },
  { id: 'pickup', name: 'Pickup', model: 'Isuzu D-Max', rate: 200, seats: 5, transmission: 'MT/AT', fuel: 'Diesel', image: '/images/dmax-pickup.png' },
  { id: 'van', name: 'Hiace Van / L300', model: 'Toyota Hiace / Mitsubishi L300', rate: 250, seats: 12, transmission: 'MT', fuel: 'Diesel', image: '/images/hiace-van.png' },
];

const DRIVER_FEE = 100;

// ==================== SAMPLE BOOKINGS ====================
const sampleBookings: Booking[] = [
  { id: 'BK001', type: 'rental', vehicle: 'sedan', serviceType: 'Self-Drive', date: '2026-01-20', time: '08:00', pickup: 'SM City San Pablo', destination: 'Pagsanjan Falls', hours: 8, contact: '09171234567', withDriver: false, totalPrice: 1200, status: 'Confirmed', submittedAt: '2026-01-18' },
  { id: 'BK002', type: 'rental', vehicle: 'suv', serviceType: 'With Driver', date: '2026-01-20', time: '09:00', pickup: 'Seven Lakes Subd.', destination: 'Caliraya Lake', hours: 6, contact: '09189876543', withDriver: true, totalPrice: 1800, status: 'Pending', submittedAt: '2026-01-19' },
  { id: 'BK003', type: 'rental', vehicle: 'van', serviceType: 'With Driver', date: '2026-01-21', time: '06:00', pickup: 'NAIA Terminal 3', destination: 'San Pablo City', hours: 4, contact: '09201112233', withDriver: true, totalPrice: 1400, status: 'Confirmed', submittedAt: '2026-01-17' },
  { id: 'BK004', type: 'carpool', date: '2026-01-20', time: '07:30', pickup: 'San Pablo', destination: 'Manila (EDSA)', contact: '09154445566', baggage: 'Without baggage', status: 'Pending', submittedAt: '2026-01-19' },
  { id: 'BK005', type: 'carpool', date: '2026-01-21', time: '14:00', pickup: 'Starmalls EDSA', destination: 'San Pablo City', contact: '09167778899', baggage: 'With baggage', status: 'Cancelled', submittedAt: '2026-01-18' },
  { id: 'BK006', type: 'rental', vehicle: 'pickup', serviceType: 'Self-Drive', date: '2026-01-22', time: '10:00', pickup: 'Lucban, Quezon', destination: 'Mt. Banahaw', hours: 5, contact: '09173334455', withDriver: false, totalPrice: 1000, status: 'No-Show', submittedAt: '2026-01-16' },
];

// ==================== MAIN APP ====================
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const tabs = [
    { label: 'Car Rental', icon: Car, desc: 'Book a vehicle' },
    { label: 'Carpool', icon: Users, desc: 'Share a ride' },
    { label: 'Admin', icon: BarChart3, desc: 'Manage bookings' },
  ];

  return (
    <div className="min-h-screen bg-[#edeae4] font-sans antialiased">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
        scrolled ? 'glass py-3 sm:py-3' : 'bg-transparent py-4 sm:py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center relative min-h-[44px]">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 glass-dark rounded-2xl p-1.5">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`nav-button relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === i
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-navy-900 shadow-lg shadow-amber-500/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" strokeWidth={activeTab === i ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden absolute right-0 text-white p-3 rounded-xl glass-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-4 glass-dark rounded-2xl p-2 animate-scale-in">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === i
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-navy-900'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">{tab.label}</p>
                  <p className={`text-xs ${activeTab === i ? 'text-navy-900/60' : 'text-white/40'}`}>{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {activeTab < 2 && <HeroSection />}

      {/* Tab Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${activeTab < 2 ? 'pt-8 sm:pt-12 pb-12 sm:pb-16' : 'pt-24 sm:pt-28 pb-12 sm:pb-16'}`}>
        {activeTab === 0 && <CarRentalForm onSubmit={addBooking} />}
        {activeTab === 1 && <CarpoolForm onSubmit={addBooking} />}
        {activeTab === 2 && (
          <AdminDashboard
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            onDelete={deleteBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative footer-lake-gradient text-white/60 pt-12 sm:pt-16 pb-8 noise-overlay safe-bottom overflow-hidden">
        {/* Subtle landscape silhouette in footer */}
        <div className="absolute bottom-0 left-0 right-0 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 1440 200" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.5)" d="M0,160L60,144C120,128,240,96,360,90.7C480,85,600,112,720,122.7C840,133,960,128,1080,117.3C1200,107,1320,91,1380,82.7L1440,75L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/logo.png"
                  alt="Seven Lakes Car Rental Logo"
                  className="w-12 h-12 rounded-full object-cover shadow-lg"
                />
                <div>
                  <h3 className="text-white font-bold">Seven Lakes Car Rental</h3>
                  <p className="text-amber-400/60 text-xs">San Pablo, Laguna</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-md">
                Serving Laguna, Batangas, Cavite & South Luzon. We provide reliable car rental and carpool services with a focus on safety, comfort, and customer satisfaction. <span className="text-amber-400/80 font-medium">Driven by trust.</span>
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Daily Rentals</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Weekly & Long-Term</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Airport Transfers</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Tour Packages</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Carpool Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" /> +63 917 XXX XXXX</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> San Pablo City, Laguna</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 24/7 Available</li>
              </ul>
            </div>
          </div>
          <div className="section-divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-center sm:text-left">© 2026 Seven Lakes Car Rental. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap justify-center">
              <span className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== HERO SECTION ====================
function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center noise-overlay">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-navy-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Subtle mountain silhouette - inspired by Seven Lakes landscape */}
        <div className="absolute bottom-0 left-0 right-0 opacity-[0.08] pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.3)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Subtle water reflection effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-[0.05] pointer-events-none" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 md:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Brand - Main Focus */}
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex flex-col items-center lg:items-start gap-4">
                <img 
                  src="/images/logo.png"
                  alt="Seven Lakes Car Rental Logo"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl shadow-amber-500/30 ring-4 ring-white/10"
                />
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tight">
                    Seven Lakes
                  </h1>
                  <p className="text-amber-400 text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] uppercase mt-1">
                    Car Rental
                  </p>
                </div>
              </div>
            </div>

            {/* Tagline - Smaller */}
            <p className="text-white/70 text-xl sm:text-2xl md:text-3xl font-light mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Ride. <span className="gradient-text font-medium">Your Way.</span>
            </p>

            <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Serving Laguna, Batangas, Cavite & South Luzon. <span className="text-amber-400/80 font-medium">Driven by trust.</span>
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: Clock, text: 'Daily, Weekly & Long-Term' },
                { icon: Car, text: 'Self-Drive / With Driver' },
                { icon: Plane, text: 'Airport Transfers (NAIA/Clark)' },
                { icon: Compass, text: 'Tour Packages' },
              ].map((badge, i) => (
                <div key={i} className="pill glass-dark text-white/80 hover:text-white hover:bg-white/10 cursor-default">
                  <badge.icon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button className="btn-primary flex items-center gap-2.5 text-sm">
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2.5 text-white/70 hover:text-white text-sm font-medium transition-colors group">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-amber-400/10 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
                Explore Fleet
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 mt-10 sm:mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {[
                { value: '300+', label: 'Happy Clients' },
                { value: '5★', label: 'Rating' },
                { value: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/40 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Featured car */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Glow behind car */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-3xl blur-2xl" />
              
              {/* Main car card */}
              <div className="relative glass-dark rounded-3xl overflow-hidden">
                {/* Most Popular badge - positioned above the image */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div>
                    <p className="text-white/50 text-xs font-medium tracking-wider">FEATURED VEHICLE</p>
                    <p className="text-white font-bold text-xl">Toyota Avanza</p>
                    <p className="text-white/50 text-sm">7-seater SUV</p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">Most Popular</span>
                  </div>
                </div>
                <img
                  src={vehicles[1].image}
                  alt="Toyota Avanza"
                  className="w-full h-64 object-cover"
                />
                <div className="px-6 py-5 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>7 seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <Fuel className="w-3.5 h-3.5" />
                      <span>Gasoline</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-black text-2xl">₱200</p>
                    <p className="text-white/40 text-xs">per hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave - gentle water ripple */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 80L1440 80L1440 45C1440 45 1320 30 1200 35C1080 40 960 55 840 50C720 45 600 25 480 30C360 35 240 55 120 50C60 47.5 0 40 0 40L0 80Z" fill="#edeae4" />
          <path d="M0 80L1440 80L1440 55C1440 55 1320 45 1200 50C1080 55 960 65 840 60C720 55 600 40 480 45C360 50 240 65 120 60C60 57.5 0 50 0 50L0 80Z" fill="#edeae4" opacity="0.6" />
        </svg>
      </div>
    </section>
  );
}

// ==================== CAR RENTAL FORM ====================
function CarRentalForm({ onSubmit }: { onSubmit: (b: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => void }) {
  const [serviceType, setServiceType] = useState<'self-drive' | 'with-driver'>('self-drive');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    hours: 1,
    contact: '',
  });
  const [filesUploaded, setFilesUploaded] = useState({ id1: false, id2: false, meralco: false });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const vehicle = vehicles.find(v => v.id === selectedVehicle)!;
  const driverFee = serviceType === 'with-driver' ? DRIVER_FEE : 0;
  const totalPrice = (vehicle.rate + driverFee) * formData.hours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.pickup || !formData.contact || !agreed) return;
    if (!filesUploaded.id1 || !filesUploaded.id2 || !filesUploaded.meralco) return;

    onSubmit({
      type: 'rental',
      vehicle: selectedVehicle,
      serviceType: serviceType === 'with-driver' ? 'With Driver' : 'Self-Drive',
      date: formData.date,
      time: formData.time,
      pickup: formData.pickup,
      destination: formData.destination,
      hours: formData.hours,
      contact: formData.contact,
      withDriver: serviceType === 'with-driver',
      totalPrice,
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/50 rounded-full px-3 sm:px-4 py-1.5 mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-amber-700 text-[10px] sm:text-xs font-semibold tracking-wide">QUICK BOOKING</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-3 tracking-tight">Car Rental Booking</h2>
        <p className="text-gray-500 text-base sm:text-lg">Choose your vehicle and schedule your ride in minutes</p>
      </div>

      {submitted && (
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-5 flex items-center gap-4 animate-scale-in">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-900">Booking Submitted Successfully!</p>
            <p className="text-green-700 text-sm">We'll contact you shortly to confirm your reservation.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type */}
        <div className="modern-card-static p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">Service Type</h3>
              <p className="text-xs text-gray-500">Choose how you want to drive</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setServiceType('self-drive')}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                serviceType === 'self-drive'
                  ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg shadow-amber-500/10'
                  : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
              }`}
            >
              {serviceType === 'self-drive' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-navy-900" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  serviceType === 'self-drive' ? 'bg-amber-400 shadow-lg shadow-amber-400/30' : 'bg-white shadow-sm'
                }`}>
                  <Car className={`w-6 h-6 ${serviceType === 'self-drive' ? 'text-navy-900' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-bold text-navy-900">Self-Drive</p>
                  <p className="text-sm text-gray-500">Take the wheel yourself</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setServiceType('with-driver')}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                serviceType === 'with-driver'
                  ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg shadow-amber-500/10'
                  : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
              }`}
            >
              {serviceType === 'with-driver' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-navy-900" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  serviceType === 'with-driver' ? 'bg-amber-400 shadow-lg shadow-amber-400/30' : 'bg-white shadow-sm'
                }`}>
                  <Users className={`w-6 h-6 ${serviceType === 'with-driver' ? 'text-navy-900' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-bold text-navy-900">With Driver</p>
                  <p className="text-sm text-gray-500">Professional driver included</p>
                  <span className="inline-block mt-1 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">+₱100/hr</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="modern-card-static p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
                <Gauge className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900">Select Vehicle</h3>
                <p className="text-xs text-gray-500">Choose from our well-maintained fleet</p>
              </div>
            </div>
          </div>
          <div className="grid vehicle-grid-mobile grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVehicle(v.id)}
                className={`rounded-2xl border-2 transition-all duration-300 text-center overflow-hidden group ${
                  selectedVehicle === v.id
                    ? 'border-amber-400 shadow-xl shadow-amber-500/15 ring-4 ring-amber-400/10'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }`}
              >
                {/* Vehicle Image */}
                <div className="relative h-40 vehicle-img-wrapper">
                  <img
                    src={v.image}
                    alt={`${v.model} - ${v.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {selectedVehicle === v.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <CheckCircle2 className="w-5 h-5 text-navy-900" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </div>
                {/* Vehicle Info */}
                <div className="p-4 pt-2">
                  <p className="font-bold text-navy-900 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{v.model}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{v.seats}</span>
                      <span className="flex items-center gap-0.5"><Fuel className="w-3 h-3" />{v.fuel}</span>
                    </div>
                    <span className="inline-block bg-navy-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                      ₱{v.rate}/hr
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Vehicle Preview */}
        <div className="modern-card-static overflow-hidden">
          <div className="relative h-48 sm:h-52 md:h-64 overflow-hidden">
            {/* Scenic gradient background - lake & sky inspired */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-navy-800 to-navy-900" />
            <img
              src={vehicle.image}
              alt={vehicle.model}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-amber-400 text-[10px] sm:text-xs font-semibold tracking-wider mb-1">SELECTED VEHICLE</p>
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-black tracking-tight truncate">{vehicle.name}</p>
                <p className="text-white/60 text-xs sm:text-sm truncate">{vehicle.model}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3">
                  <p className="text-amber-400 font-black text-xl sm:text-2xl md:text-3xl leading-none">₱{vehicle.rate}</p>
                  <p className="text-white/50 text-[10px] sm:text-xs font-medium">per hour</p>
                </div>
              </div>
            </div>
          </div>
          {/* Specs bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 bg-white">
            {[
              { icon: Users, label: 'Seats', value: `${vehicle.seats} pax` },
              { icon: Gauge, label: 'Trans', value: vehicle.transmission },
              { icon: Fuel, label: 'Fuel', value: vehicle.fuel },
              { icon: Navigation, label: 'Type', value: vehicle.name },
            ].map((spec, i) => (
              <div key={i} className="flex flex-col items-center py-4 px-2">
                <spec.icon className="w-4 h-4 text-amber-500 mb-1.5" />
                <p className="text-[10px] text-gray-400 font-medium">{spec.label}</p>
                <p className="text-xs font-bold text-navy-900">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div className="modern-card-static p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">Booking Details</h3>
              <p className="text-xs text-gray-500">When and where do you need the car?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Rental Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Pick-up Time *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Duration (Hours) *</label>
              <input
                type="number"
                min={1}
                max={72}
                required
                value={formData.hours}
                onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) || 1 })}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Pick-up Location *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., SM City San Pablo"
                  value={formData.pickup}
                  onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                  className="modern-input pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Destination</label>
              <div className="relative">
                <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., Pagsanjan Falls"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="modern-input pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contact Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="09XX XXX XXXX"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="modern-input pl-11"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Calculator */}
        <div className="modern-card-static overflow-hidden">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Price Estimate</h3>
                <p className="text-xs text-white/40">Transparent pricing, no hidden fees</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{vehicle.name} ({vehicle.model})</p>
                    <p className="text-white/40 text-xs">₱{vehicle.rate}/hr × {formData.hours} hr(s)</p>
                  </div>
                </div>
                <span className="text-white font-bold">₱{(vehicle.rate * formData.hours).toLocaleString()}</span>
              </div>
              {serviceType === 'with-driver' && (
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Driver's Fee</p>
                      <p className="text-white/40 text-xs">₱{DRIVER_FEE}/hr × {formData.hours} hr(s)</p>
                    </div>
                  </div>
                  <span className="text-white font-bold">₱{(DRIVER_FEE * formData.hours).toLocaleString()}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
                <span className="text-white/60 font-medium">Total Estimated Cost</span>
                <div className="text-right sm:text-right">
                  <p className="text-3xl sm:text-4xl font-black gradient-text price-mobile">₱{totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements & Agreement */}
        <div className="modern-card-static p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">Requirements & Agreement</h3>
              <p className="text-xs text-gray-500">Upload documents and accept terms</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-navy-900 font-semibold mb-2">Required Documents</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Two (2) Valid IDs (including Driver's License)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Latest Meralco Bill (proof of address)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <FileUploadButton
              label="Valid ID #1"
              uploaded={filesUploaded.id1}
              onUpload={() => setFilesUploaded({ ...filesUploaded, id1: true })}
            />
            <FileUploadButton
              label="Valid ID #2 (License)"
              uploaded={filesUploaded.id2}
              onUpload={() => setFilesUploaded({ ...filesUploaded, id2: true })}
            />
            <FileUploadButton
              label="Meralco Bill"
              uploaded={filesUploaded.meralco}
              onUpload={() => setFilesUploaded({ ...filesUploaded, meralco: true })}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="modern-checkbox mt-0.5"
            />
            <span className="text-sm text-gray-600 group-hover:text-navy-900 transition-colors leading-relaxed">
              I hereby agree to the <span className="text-amber-600 font-semibold underline decoration-amber-400/50 underline-offset-2">Seven Lakes Car Rental Agreement</span>. 
              I confirm that all information provided is accurate and I accept full responsibility for the vehicle during the rental period.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!agreed || !filesUploaded.id1 || !filesUploaded.id2 || !filesUploaded.meralco}
          className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none text-base flex items-center justify-center gap-3 py-5"
        >
          <CheckCircle2 className="w-5 h-5" />
          Submit Booking Request
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

// ==================== FILE UPLOAD BUTTON ====================
function FileUploadButton({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed transition-all duration-300 ${
        uploaded
          ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
        uploaded ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        {uploaded ? (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        ) : (
          <Upload className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <span className={`text-xs font-semibold ${uploaded ? 'text-green-700' : 'text-gray-600'}`}>
        {uploaded ? 'Uploaded ✓' : label}
      </span>
    </button>
  );
}

// ==================== CARPOOL FORM ====================
function CarpoolForm({ onSubmit }: { onSubmit: (b: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => void }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    contact: '',
    baggage: 'without',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'carpool',
      date: formData.date,
      time: formData.time,
      pickup: formData.pickup,
      destination: formData.destination,
      contact: formData.contact,
      baggage: formData.baggage === 'with' ? 'With baggage' : 'Without baggage',
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/50 rounded-full px-3 sm:px-4 py-1.5 mb-4">
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-amber-700 text-[10px] sm:text-xs font-semibold tracking-wide">SHARE & SAVE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-3 tracking-tight">Carpool Booking</h2>
        <p className="text-gray-500 text-base sm:text-lg">Share your ride, save on costs. Travel together!</p>
      </div>

      {submitted && (
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-5 flex items-center gap-4 animate-scale-in">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-900">Carpool Request Submitted!</p>
            <p className="text-green-700 text-sm">We'll match you with a ride and notify you of the details.</p>
          </div>
        </div>
      )}

      <div className="modern-card-static overflow-hidden">
        {/* How it works banner */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />
          {/* Subtle landscape silhouette */}
          <div className="absolute bottom-0 left-0 right-0 opacity-[0.06] pointer-events-none">
            <svg viewBox="0 0 800 100" className="w-full h-auto" preserveAspectRatio="none">
              <path fill="rgba(255,255,255,0.5)" d="M0,100L0,70Q100,50 200,65T400,55T600,70T800,60L800,100Z" />
            </svg>
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-lg">How Carpool Works</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { step: '01', text: 'Submit travel details' },
                { step: '02', text: 'Get matched with rides' },
                { step: '03', text: 'Share the cost' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-amber-400 font-black text-base sm:text-lg mb-1">{item.step}</p>
                  <p className="text-white/60 text-[10px] sm:text-xs leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Date of Travel *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="modern-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Preferred Time *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="modern-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Pick-up Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g., San Pablo City Hall"
                value={formData.pickup}
                onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                className="modern-input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Drop-off Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g., Ayala Mall Manila Bay"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className="modern-input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contact Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                required
                placeholder="09XX XXX XXXX"
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                className="modern-input pl-11"
              />
            </div>
          </div>

          {/* Baggage */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Baggage Status *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, baggage: 'without' })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  formData.baggage === 'without'
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg shadow-amber-500/10'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  formData.baggage === 'without' ? 'bg-amber-400 shadow-lg shadow-amber-400/30' : 'bg-white shadow-sm'
                }`}>
                  <Package className={`w-6 h-6 ${formData.baggage === 'without' ? 'text-navy-900' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-bold ${formData.baggage === 'without' ? 'text-navy-900' : 'text-gray-600'}`}>
                  Without Baggage
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, baggage: 'with' })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  formData.baggage === 'with'
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg shadow-amber-500/10'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  formData.baggage === 'with' ? 'bg-amber-400 shadow-lg shadow-amber-400/30' : 'bg-white shadow-sm'
                }`}>
                  <Luggage className={`w-6 h-6 ${formData.baggage === 'with' ? 'text-navy-900' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-bold ${formData.baggage === 'with' ? 'text-navy-900' : 'text-gray-600'}`}>
                  With Baggage
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary text-base flex items-center justify-center gap-3 py-5"
          >
            <Users className="w-5 h-5" />
            Request Carpool Ride
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({
  bookings,
  onUpdateStatus,
  onDelete,
}: {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDelete: (id: string) => void;
}) {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const calendarDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [selectedMonth]);

  const getBookingsForDay = (day: number) => {
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr);
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200/50',
    'Confirmed': 'bg-green-50 text-green-700 border-green-200/50',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200/50',
    'No-Show': 'bg-gray-50 text-gray-600 border-gray-200/50',
  };

  const statusDots: Record<string, string> = {
    'Pending': 'bg-yellow-400',
    'Confirmed': 'bg-green-400',
    'Cancelled': 'bg-red-400',
    'No-Show': 'bg-gray-400',
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    noShow: bookings.filter(b => b.status === 'No-Show').length,
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/50 rounded-full px-3 sm:px-4 py-1.5 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-700 text-[10px] sm:text-xs font-semibold tracking-wide">ADMIN PANEL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-base sm:text-lg mt-1">Manage bookings, vehicles, and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="modern-input w-auto text-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid stat-grid-mobile grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total" value={stats.total} icon={BarChart3} gradient="from-navy-900 to-navy-700" textColor="text-white" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} gradient="from-yellow-400 to-amber-500" textColor="text-navy-900" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle2} gradient="from-green-400 to-emerald-500" textColor="text-white" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={X} gradient="from-red-400 to-rose-500" textColor="text-white" />
        <StatCard label="No-Show" value={stats.noShow} icon={CircleDot} gradient="from-gray-400 to-slate-500" textColor="text-white" />
      </div>

      {/* Calendar / Matrix */}
      <div className="modern-card-static p-6 md:p-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-sm sm:text-base">Vehicle Availability</h3>
                <p className="text-xs text-gray-500">Track bookings across your fleet</p>
              </div>
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-white shadow-sm text-navy-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-navy-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fleet Matrix
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="calendar-mobile-scroll">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 min-w-[500px]">
              {calendarDays.map((day, i) => {
                const dayBookings = day ? getBookingsForDay(day) : [];
                return (
                  <div
                    key={i}
                    className={`min-h-[85px] p-2 rounded-xl border transition-all ${
                      day
                        ? dayBookings.length > 0
                          ? 'border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30'
                          : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                        : 'border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="font-bold text-gray-700 text-sm mb-1.5">{day}</div>
                        {dayBookings.slice(0, 2).map(b => (
                          <div
                            key={b.id}
                            className={`truncate rounded-lg px-1.5 py-1 mb-1 text-[10px] font-semibold cursor-pointer hover:opacity-80 transition-opacity border ${statusColors[b.status]}`}
                            onClick={() => setSelectedBooking(b)}
                          >
                            {b.type === 'rental' ? '🚗' : '👥'} {b.id}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-[10px] text-gray-400 font-medium">+{dayBookings.length - 2} more</div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-3 font-bold text-navy-900 text-xs uppercase tracking-wider">Vehicle</th>
                  <th className="text-center py-4 px-3 font-bold text-navy-900 text-xs uppercase tracking-wider">Bookings</th>
                  <th className="text-center py-4 px-3 font-bold text-navy-900 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => {
                  const vehicleBookings = bookings.filter(b => b.vehicle === v.id && b.status !== 'Cancelled');
                  const isAvailable = vehicleBookings.length === 0;
                  return (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img src={v.image} alt={v.model} className="w-16 h-12 object-cover rounded-xl border border-gray-100" />
                          <div>
                            <p className="font-bold text-navy-900">{v.name}</p>
                            <p className="text-xs text-gray-500">{v.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-3">
                        <span className="inline-flex items-center gap-1.5 bg-navy-900 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                          {vehicleBookings.length} active
                        </span>
                      </td>
                      <td className="text-center py-4 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                          isAvailable ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-yellow-50 text-yellow-700 border border-yellow-200/50'
                        }`}>
                          <CircleDot className="w-3 h-3" />
                          {isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Management */}
      <div className="modern-card-static p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">Booking Management</h3>
              <p className="text-xs text-gray-500">Track and manage all reservations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {Object.entries(statusDots).map(([status, color]) => (
              <span key={status} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-gray-500">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {status}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${statusDots[booking.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-bold text-navy-900 text-sm">{booking.id}</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold border ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                      <span className="text-[11px] bg-navy-900 text-amber-400 px-2.5 py-0.5 rounded-lg font-semibold">
                        {booking.type === 'rental' ? '🚗 Rental' : '👥 Carpool'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1.5">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {booking.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {booking.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {booking.pickup}</span>
                      {booking.destination && <span className="flex items-center gap-1.5"><Compass className="w-3 h-3" /> {booking.destination}</span>}
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {booking.contact}</span>
                    </div>
                    {booking.type === 'rental' && (
                      <div className="mt-2 text-xs flex items-center gap-3">
                        <span className="text-gray-500">
                          {vehicles.find(v => v.id === booking.vehicle)?.name} • {booking.serviceType} • {booking.hours}hr
                        </span>
                        <span className="font-bold text-amber-600">₱{booking.totalPrice?.toLocaleString()}</span>
                      </div>
                    )}
                    {booking.type === 'carpool' && booking.baggage && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                        <Luggage className="w-3 h-3" /> {booking.baggage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 ml-5 lg:ml-0">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-navy-900 transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <select
                      value={booking.status}
                      onChange={e => onUpdateStatus(booking.id, e.target.value as Booking['status'])}
                      className="text-[11px] sm:text-xs border border-gray-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 pr-6 sm:pr-8 focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none appearance-none bg-white font-medium cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No-Show">No-Show</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="p-2 sm:p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 modern-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Booking Details</p>
                <h3 className="text-2xl font-black text-navy-900">{selectedBooking.id}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${statusColors[selectedBooking.status]}`}>
                {selectedBooking.status}
              </span>
              <span className="text-xs bg-navy-900 text-amber-400 px-3 py-1.5 rounded-lg font-semibold">
                {selectedBooking.type === 'rental' ? 'Car Rental' : 'Carpool'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
              <DetailRow label="Date" value={selectedBooking.date} />
              <DetailRow label="Time" value={selectedBooking.time} />
              <DetailRow label="Pick-up" value={selectedBooking.pickup} />
              {selectedBooking.destination && <DetailRow label="Destination" value={selectedBooking.destination} />}
              {selectedBooking.type === 'rental' && (
                <>
                  <DetailRow label="Vehicle" value={`${vehicles.find(v => v.id === selectedBooking.vehicle)?.name} (${vehicles.find(v => v.id === selectedBooking.vehicle)?.model})`} />
                  <DetailRow label="Service" value={selectedBooking.serviceType || ''} />
                  <DetailRow label="Duration" value={`${selectedBooking.hours} hour(s)`} />
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="text-xl font-black gradient-text">₱{selectedBooking.totalPrice?.toLocaleString()}</span>
                  </div>
                </>
              )}
              {selectedBooking.type === 'carpool' && <DetailRow label="Baggage" value={selectedBooking.baggage || ''} />}
              <DetailRow label="Contact" value={selectedBooking.contact} />
              <DetailRow label="Submitted" value={selectedBooking.submittedAt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-navy-900 font-semibold">{value}</span>
    </div>
  );
}

// ==================== STAT CARD ====================
function StatCard({ label, value, icon: Icon, gradient, textColor }: { label: string; value: number; icon: any; gradient: string; textColor: string }) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} ${textColor} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <Icon className="w-5 h-5 opacity-60 mb-3" />
      <p className="text-3xl font-black leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold opacity-70">{label}</p>
    </div>
  );
}
