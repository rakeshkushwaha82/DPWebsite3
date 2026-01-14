
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
    desc: "Ergonomic 2026 designs with high-grade BWP Marine Ply and smart storage.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    details: "Our modular kitchens are engineered for Indian cooking styles while maintaining European aesthetic standards. We focus on 'The Golden Triangle' efficiency.",
    philosophy: "We follow the 'Ergo-Workflow' philosophy, adjusting counter heights and zoning storage by frequency of use.",
    materials: [
      { name: "BWP IS:710 Marine Ply", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { name: "Anti-Fingerprint Laminate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
    ],
    materialBadges: [{ label: "Waterproof", icon: Icons.Waterproof }, { label: "Termite Proof", icon: Icons.TermiteProof }],
    features: ["Oil-pullouts", "Magic Corners", "Built-in Appliances", "G-Profile Handles"],
    gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1565538810643-95bdb8104517?auto=format&fit=crop&q=80&w=1200"],
    techSpecs: [
        { label: "Delivery", value: "45 Days", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" /></svg> }
    ]
  },
  {
    title: "Commercial Offices",
    desc: "Bespoke corporate interiors for 2026 designed for productivity and brand identity.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    details: "Transforming workspaces into hubs of innovation. From acoustic optimization to ergonomic furniture.",
    philosophy: "Agile workspace methodology focusing on collaborative zones and individual focus pods.",
    materials: [
        { name: "Acoustic Panels", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V5l12 7-12 7z" strokeWidth="2" /></svg> },
        { name: "Toughened Glass", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3z" strokeWidth="2" /></svg> }
    ],
    materialBadges: [{ label: "Fire Retardant", icon: Icons.Durable }, { label: "Acoustic Tech", icon: Icons.EcoFriendly }],
    features: ["Glass Partitions", "Modular Workstations", "Executive Cabins", "Conference Suites"],
    gallery: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200"],
    techSpecs: [
        { label: "Execution", value: "Turnkey", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" /></svg> }
    ]
  },
  {
    title: "Luxury Showrooms",
    desc: "Experiential retail spaces designed to enhance product luxury and customer journey.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    details: "High-impact retail architecture that converts footfall into brand loyalty. Signature lighting and premium finishes.",
    philosophy: "Experiential retail logic focusing on visual merchandising and premium customer comfort.",
    materials: [
        { name: "Mirror Polished Steel", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" strokeWidth="2" /></svg> },
        { name: "Exotic Stone", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12l-18 12V0l18 12z" strokeWidth="2" /></svg> }
    ],
    materialBadges: [{ label: "High Gloss", icon: Icons.EcoFriendly }, { label: "Signature Style", icon: Icons.Waterproof }],
    features: ["Display Kiosks", "Accent Lighting", "Experience Zones", "Custom Shelving"],
    gallery: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1555529731-118a5bb67af7?auto=format&fit=crop&q=80&w=1200"],
    techSpecs: [
        { label: "Concept", value: "3D Visualized", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /></svg> }
    ]
  },
  {
    title: "Residential Masterpieces",
    desc: "Complete home interiors from concept to 45-day guaranteed 2026 move-in.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    details: "Comprehensive design solutions for 2BHK, 3BHK, and luxury villas across Delhi NCR.",
    philosophy: "Atmospheric equilibrium using layered lighting and texture-rich wall treatments.",
    materials: [
        { name: "Premium Veneer", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" strokeWidth="2" /></svg> },
        { name: "Italian Marble", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" strokeWidth="2" /></svg> }
    ],
    materialBadges: [{ label: "Turnkey", icon: Icons.Durable }, { label: "Eco-Grade", icon: Icons.EcoFriendly }],
    features: ["False Ceilings", "Wardrobe Systems", "Wall Paneling", "Furniture Curation"],
    gallery: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"],
    techSpecs: [
        { label: "Move-In", value: "45 Days", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth="2" /></svg> }
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
          <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-6">Commercial & Residential Excellence</h2>
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
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[#001f3f] mb-2 font-serif">{service.title}</h3>
                <p className="text-gray-500 mb-6 font-light leading-relaxed line-clamp-2 text-sm">{service.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {service.materialBadges.slice(0, 2).map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[#c5a059]">{badge.icon}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{badge.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-4">
                  <button onClick={(e) => { e.stopPropagation(); onBookConsultation(service.title); }} className="w-full bg-[#c5a059] text-white py-4 rounded-2xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#001f3f] transition-all shadow-lg active:scale-95">Book Free Consultation</button>
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
              <button onClick={() => setSelectedService(null)} className="absolute top-8 right-8 z-[120] bg-white hover:bg-[#c5a059] text-[#001f3f] hover:text-white p-3 rounded-full shadow-2xl transition-all border border-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

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
                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4 z-20">
                  <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2"/></svg>
                  </button>
                  <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-1/2 overflow-y-auto p-8 lg:p-16 space-y-12 bg-white no-scrollbar">
                <h3 className="text-4xl lg:text-5xl font-bold font-serif text-[#001f3f] leading-tight">{selectedService.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{selectedService.philosophy}</p>
                
                <div className="grid grid-cols-2 gap-6">
                    {selectedService.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => { onBookConsultation(selectedService.title); setSelectedService(null); }} className="flex-1 bg-[#001f3f] text-white py-6 rounded-2xl font-bold tracking-[0.4em] text-sm hover:bg-[#c5a059] transition-all uppercase shadow-xl">Get A Free Quote</button>
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
