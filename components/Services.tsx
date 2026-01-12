
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HardwareDetail {
  brand: string;
  model?: string;
  benefit: string;
  warranty: string;
}

interface TechSpec {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface MaterialBadge {
  label: string;
  icon: React.ReactNode;
}

interface ServiceDetail {
  title: string;
  desc: string;
  image: string;
  details: string;
  philosophy: string;
  materials: { name: string; icon: React.ReactNode }[];
  materialBadges: MaterialBadge[];
  gallery: string[];
  features: string[];
  hardwareDetails?: HardwareDetail[];
  techSpecs?: TechSpec[];
}

// Reusable SVG Icons for Material Attributes
const Icons = {
  Waterproof: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.594 15.12a2 2 0 00-1.022.547l-2.387 2.387a2 2 0 001.414 3.414h16.8a2 2 0 001.414-3.414l-2.387-2.387z" />
    </svg>
  ),
  Durable: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  EcoFriendly: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  TermiteProof: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
};

const services: ServiceDetail[] = [
  {
    title: "Modular Kitchens",
    desc: "Ergonomic designs with high-grade materials and smart storage solutions.",
    image: "https://images.unsplash.com/photo-1556912177-c54030639a4c?auto=format&fit=crop&q=80&w=800",
    details: "Our modular kitchens are engineered for Indian cooking styles while maintaining European aesthetic standards. We focus on 'The Golden Triangle' efficiency.",
    philosophy: "We follow the 'Ergo-Workflow' philosophy, adjusting counter heights and zoning storage by frequency of use.",
    materials: [
      { name: "BWP IS:710 Marine Ply", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { name: "Anti-Fingerprint Laminate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { name: "Scratch-Resistant Quartz", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
    ],
    materialBadges: [
      { label: "Waterproof", icon: Icons.Waterproof },
      { label: "Termite Proof", icon: Icons.TermiteProof },
      { label: "Eco-Friendly", icon: Icons.EcoFriendly },
    ],
    features: ["Oil-pullouts", "Magic Corners", "Built-in Appliances", "G-Profile Handles"],
    techSpecs: [
      { label: "Delivery", value: "45 Days", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { label: "Warranty", value: "10 Years", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { label: "Hardware", value: "German (Hettich)", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
    ],
    hardwareDetails: [
      { brand: "Hettich", model: "Sensys & Quadro", benefit: "German-engineered silent closing.", warranty: "Lifetime" },
      { brand: "Blum", model: "Aventos", benefit: "Top-tier lift systems.", warranty: "10 Year" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556912177-c54030639a4c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1565538810643-95bdb8104517?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Living & Dining",
    desc: "Luxury lounge areas and elegant dining spaces tailored to your lifestyle.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    details: "The social heart of your home. We create expansive living zones that blend comfort with conversation.",
    philosophy: "Atmospheric equilibrium using layered lighting and texture-rich wall treatments.",
    materials: [
      { name: "Italian Marble", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" strokeWidth="2"/></svg> },
      { name: "Teak Wood Accents", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeWidth="2"/></svg> }
    ],
    materialBadges: [
      { label: "Durable", icon: Icons.Durable },
      { label: "Premium Finish", icon: Icons.EcoFriendly },
      { label: "Luxury Grade", icon: Icons.TermiteProof },
    ],
    features: ["TV Unit Design", "Foyer Partitions", "False Ceilings", "Statement Wall Textures"],
    techSpecs: [
      { label: "Comfort", value: "Ergonomic", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2"/></svg> },
      { label: "Finish", value: "PU / Veneer", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" strokeWidth="2"/></svg> }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1567016432779-094069958ad5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1583847268964-b28dc2f51f92?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Master Bedrooms",
    desc: "Sanctuaries of comfort with custom wardrobes and ambient lighting.",
    image: "https://images.unsplash.com/photo-1616594111360-630630639a4c?auto=format&fit=crop&q=80&w=800",
    details: "Designing for rest. Our master suites feature floor-to-ceiling wardrobes and custom-upholstered headboards.",
    philosophy: "Tactile serenity prioritizing acoustic comfort and soft textures.",
    materials: [
      { name: "Soft-touch PU", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z" strokeWidth="2"/></svg> },
      { name: "Tempered Glass", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18" strokeWidth="2"/></svg> }
    ],
    materialBadges: [
      { label: "Quiet Close", icon: Icons.Durable },
      { label: "Anti-Scratch", icon: Icons.EcoFriendly },
      { label: "Termite Proof", icon: Icons.TermiteProof },
    ],
    features: ["Walk-in Closets", "Integrated Vanities", "Mood Lighting", "Smart Mirrors"],
    techSpecs: [
      { label: "Storage", value: "Optimized", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeWidth="2"/></svg> },
      { label: "Quietness", value: "Soft-Close", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" strokeWidth="2"/></svg> }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1616594111360-630630639a4c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    title: "Space Saving Furniture",
    desc: "Innovative multi-functional units for modern urban apartments.",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ad5?auto=format&fit=crop&q=80&w=800",
    details: "Maximized utility for compact living. We specialize in Murphy beds and expandable tables.",
    philosophy: "Geometry of intelligence. Every square inch is an opportunity.",
    materials: [
      { name: "Hydraulic Lifts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="2"/></svg> },
      { name: "Honeycomb Panel", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/></svg> }
    ],
    materialBadges: [
      { label: "Eco-Friendly", icon: Icons.EcoFriendly },
      { label: "High Strength", icon: Icons.Durable },
      { label: "Precision Tech", icon: Icons.TermiteProof },
    ],
    features: ["Wall-mounted Desks", "Transforming Beds", "Under-stair Storage", "Slide-out Pantry"],
    techSpecs: [
      { label: "Efficiency", value: "Space-Max", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4" strokeWidth="2"/></svg> },
      { label: "Tech", value: "Precision", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8" strokeWidth="2"/></svg> }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1567016432779-094069958ad5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];

interface ServicesProps {
  onConsultClick: () => void;
  onBookConsultation: (service: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onConsultClick, onBookConsultation }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const nextSlide = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedService) {
      setGalleryIndex((prev) => (prev + 1) % selectedService.gallery.length);
    }
  }, [selectedService]);

  const prevSlide = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedService) {
      setGalleryIndex((prev) => (prev - 1 + selectedService.gallery.length) % selectedService.gallery.length);
    }
  }, [selectedService]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [selectedService]);

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Our Expertise</span>
          <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-6">Expertise in Every Corner</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -12, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 31, 63, 0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 group cursor-pointer flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[#001f3f]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-4 right-4">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                      <span className="text-[8px] font-bold text-[#001f3f] uppercase tracking-widest">Premium Grade</span>
                   </div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[#001f3f] mb-2 font-serif">{service.title}</h3>
                <p className="text-gray-500 mb-6 font-light leading-relaxed line-clamp-2 text-sm">{service.desc}</p>
                
                {/* Compact Material Attribute Badges on Card */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.materialBadges.slice(0, 2).map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[#c5a059]">{badge.icon}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{badge.label}</span>
                    </div>
                  ))}
                  {service.materialBadges.length > 2 && (
                    <div className="flex items-center px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">+{service.materialBadges.length - 2}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <button onClick={(e) => { e.stopPropagation(); onBookConsultation(service.title); }} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#001f3f] transition-all shadow-lg active:scale-95">Book Free Consultation</button>
                  <button className="w-full text-gray-400 font-bold text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 hover:text-[#001f3f] transition-all group/link">
                    Explore Details
                    <svg className="h-3 w-3 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-7xl max-h-[92vh] rounded-[3.5rem] overflow-hidden shadow-3xl flex flex-col lg:flex-row relative"
            >
              {/* Close Button */}
              <button onClick={() => setSelectedService(null)} className="absolute top-8 right-8 z-[120] bg-white hover:bg-[#c5a059] text-[#001f3f] hover:text-white p-3 rounded-full shadow-2xl transition-all border border-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Left Side: Cinematic Carousel */}
              <div className="w-full lg:w-1/2 h-[45vh] lg:h-auto relative bg-black">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={galleryIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={selectedService.gallery[galleryIndex]} 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4 z-20">
                  <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2"/></svg>
                  </button>
                  <div className="flex items-center gap-2">
                    {selectedService.gallery.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === galleryIndex ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/30'}`} />
                    ))}
                  </div>
                  <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-24 left-10 lg:left-16 right-10 pointer-events-none">
                  <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-3 block">Luxury Series</span>
                  <h3 className="text-4xl lg:text-6xl font-bold font-serif text-white mb-6 leading-tight">{selectedService.title}</h3>
                </div>
              </div>

              {/* Right Side: Structured Details */}
              <div className="w-full lg:w-1/2 overflow-y-auto p-8 lg:p-16 space-y-12 bg-white no-scrollbar">
                
                {/* Tech Specs Section */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedService.techSpecs?.map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:shadow-lg transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#c5a059] shadow-sm group-hover:bg-[#001f3f] group-hover:text-white transition-all">
                        {spec.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                        <p className="text-xs font-bold text-[#001f3f]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Material Quality Assurance Section (New) */}
                <section>
                  <h4 className="text-[#001f3f] font-bold text-[10px] uppercase tracking-[0.3em] mb-6">Material Quality Assurance</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {selectedService.materialBadges.map((badge, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
                          {badge.icon}
                        </div>
                        <span className="text-[10px] font-bold text-[#001f3f] uppercase tracking-wider text-center">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* About Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-[#c5a059] rounded-full"></div>
                    <h4 className="text-[#001f3f] font-bold text-xs uppercase tracking-[0.3em]">Design Intent</h4>
                  </div>
                  <p className="text-gray-500 font-light leading-relaxed mb-6 italic">"{selectedService.details}"</p>
                  <p className="text-gray-600 font-medium leading-relaxed">{selectedService.philosophy}</p>
                </section>

                {/* Materials & Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <h4 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Premium Materials</h4>
                    <div className="space-y-4">
                      {selectedService.materials.map((mat, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">{mat.icon}</div>
                          <span className="text-[11px] font-bold text-[#001f3f] uppercase tracking-wider">{mat.name}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Standard Features</h4>
                    <div className="space-y-4">
                      {selectedService.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#001f3f]"></div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Hardware Partners */}
                {selectedService.hardwareDetails && (
                  <section className="pt-8 border-t border-gray-100">
                    <h4 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Hardware Partners</h4>
                    <div className="space-y-6">
                      {selectedService.hardwareDetails.map((hw, i) => (
                        <div key={i} className="flex justify-between items-start p-6 bg-gray-50 rounded-2xl">
                          <div>
                            <h5 className="text-[#001f3f] font-bold text-sm mb-1">{hw.brand} • {hw.model}</h5>
                            <p className="text-[10px] text-gray-400 font-medium">{hw.benefit}</p>
                          </div>
                          <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest border border-[#c5a059]/30 px-3 py-1 rounded-full">{hw.warranty} Warranty</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Call to Action */}
                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => { onBookConsultation(selectedService.title); setSelectedService(null); }} className="flex-1 bg-[#001f3f] text-white py-6 rounded-2xl font-bold tracking-[0.4em] text-[10px] hover:bg-[#c5a059] transition-all uppercase shadow-xl">Get A Free Quote</button>
                  <button onClick={() => { setSelectedService(null); onConsultClick(); }} className="flex-1 bg-white border border-[#001f3f] text-[#001f3f] py-6 rounded-2xl font-bold tracking-[0.4em] text-[10px] hover:bg-gray-50 transition-all uppercase">Design with AI</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
