
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface ProjectStats {
  area: string;
  rooms: string;
  style: string;
  year: string;
}

interface GalleryItem {
  id: string;
  cat: 'kitchen' | 'living' | 'bedroom' | 'full-home' | 'commercial';
  url: string;
  videoUrl: string;
  tourUrl?: string;
  aiTourUrl?: string;
  name: string;
  location: string;
  description: string;
  stats: ProjectStats;
}

interface GalleryProps {
  onBookConsultation: (service: string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  })
};

const Gallery: React.FC<GalleryProps> = ({ onBookConsultation }) => {
  const [filter, setFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  
  const [lightboxMode, setLightboxMode] = useState<'image' | 'video' | 'tour'>('image');
  const [zoomScale, setZoomScale] = useState(1);
  const [lastTap, setLastTap] = useState(0);
  const [isGeneratingTour, setIsGeneratingTour] = useState(false);
  
  const initialPinchDistance = useRef<number | null>(null);
  const startScale = useRef<number>(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  const springScale = useSpring(zoomScale, { stiffness: 300, damping: 30 });

  const [items, setItems] = useState<GalleryItem[]>([
    { 
      id: 'fh1',
      cat: 'full-home',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-39977-large.mp4',
      name: 'The Grand Avenue Villa',
      location: 'Noida Sector 150',
      description: 'A complete luxury transformation of a 4BHK villa.',
      stats: { area: '3200 sqft', rooms: '4 BHK Villa', style: 'Modern Classic', year: '2024' }
    },
    { 
      id: 'off1',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Nexus Tech Office',
      location: 'Sec-16, Greater Noida West',
      description: 'Next-gen collaborative workspace with ergonomic acoustic pods.',
      stats: { area: '4500 sqft', rooms: '50 Seats', style: 'High-Tech', year: '2024' }
    },
    { 
      id: 'shp1',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Elite Couture Boutique',
      location: 'Gaur World Smart Street',
      description: 'Luxury retail space with gold-accents and signature lighting.',
      stats: { area: '1200 sqft', rooms: 'Showroom', style: 'Art Deco', year: '2023' }
    },
    { 
      id: 'off3',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Dynamic Co-working Hub',
      location: 'Noida Sector 62',
      description: 'Agile workspace designed for startups and creative professionals.',
      stats: { area: '2800 sqft', rooms: 'Open Plan', style: 'Industrial Modern', year: '2024' }
    },
    { 
      id: 'shp2',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcd',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-modern-lighting-39980-large.mp4',
      name: 'Gemstone Jewelers HQ',
      location: 'Gaur City Mall',
      description: 'Ultra-luxury showroom featuring high-security glass and bespoke lighting.',
      stats: { area: '1800 sqft', rooms: 'Showroom', style: 'Royal Gold', year: '2024' }
    },
    { 
      id: 'off4',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Corporate Executive Suites',
      location: 'Advant Navis, Noida',
      description: 'Minimalist corporate headquarters with Italian marble and oak finishes.',
      stats: { area: '6500 sqft', rooms: 'Floor Plan', style: 'Minimalist Luxury', year: '2024' }
    },
    { 
      id: 'shp3',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-modern-lighting-39980-large.mp4',
      name: 'Vogue Fashion Studio',
      location: 'Greater Noida West',
      description: 'Contemporary fashion boutique with high-gloss textures and geometric mirrors.',
      stats: { area: '950 sqft', rooms: 'Retail', style: 'Contemporary', year: '2023' }
    },
    { 
      id: 'com4',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-modern-lighting-39980-large.mp4',
      name: 'Artisan Brew Cafe',
      location: 'Noida Sector 18',
      description: 'A cozy minimalist cafe with rustic oak textures.',
      stats: { area: '1500 sqft', rooms: '32 Covers', style: 'Rustic Modern', year: '2024' }
    },
    { 
      id: 'k1',
      cat: 'kitchen', 
      url: 'https://images.unsplash.com/photo-1556912177-c54030639a4c',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-design-39976-large.mp4',
      name: 'Island Gourmet Hub',
      location: 'Greater Noida West',
      description: 'High-gloss acrylic kitchen with smart integrated units.',
      stats: { area: '250 sqft', rooms: 'Modular', style: 'Minimalist', year: '2023' }
    },
    { 
      id: 'l1',
      cat: 'living', 
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-and-modern-living-room-39977-large.mp4',
      name: 'Urban Sanctuary Living',
      location: 'Gaur City 2',
      description: 'Features a floating TV unit and acoustic paneling.',
      stats: { area: '450 sqft', rooms: '3 BHK', style: 'Contemporary', year: '2024' }
    },
    { 
      id: 'b1',
      cat: 'bedroom', 
      url: 'https://images.unsplash.com/photo-1616594111360-630630639a4c',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxurious-and-modern-bedroom-39978-large.mp4',
      name: 'Azure Master Suite',
      location: 'Indirapuram',
      description: 'Luxury master bedroom with a boutique walk-in closet.',
      stats: { area: '280 sqft', rooms: 'Premium Suite', style: 'Scandinavian', year: '2024' }
    }
  ]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dp_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('dp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    springScale.set(zoomScale);
  }, [zoomScale, springScale]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const getOptimizedUrl = (url: string, width: number, quality: number = 80) => {
    return `${url}?auto=format&fit=crop&q=${quality}&w=${width}`;
  };

  const filteredItems = useMemo(() => items.filter(item => {
    const categoryMatch = filter === 'all' || item.cat === filter;
    const styleMatch = styleFilter === 'all' || item.stats.style === styleFilter;
    return categoryMatch && styleMatch;
  }), [items, filter, styleFilter]);

  const resetZoom = useCallback(() => {
    setZoomScale(1);
    dragX.set(0);
    dragY.set(0);
  }, [dragX, dragY]);

  const closeLightbox = () => {
    setSelectedIndex(null);
    resetZoom();
    setLightboxMode('image');
  };

  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setDirection(1);
      setSelectedIndex((prev) => (prev! + 1) % filteredItems.length);
      resetZoom();
    }
  }, [selectedIndex, filteredItems.length, resetZoom]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setDirection(-1);
      setSelectedIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
      resetZoom();
    }
  }, [selectedIndex, filteredItems.length, resetZoom]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (zoomScale > 1) {
        resetZoom();
      } else {
        setZoomScale(2.5);
      }
    }
    setLastTap(now);
  }, [lastTap, zoomScale, resetZoom]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = dist;
      startScale.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = dist / initialPinchDistance.current;
      const newScale = Math.min(Math.max(startScale.current * scaleDelta, 1), 5);
      setZoomScale(newScale);
    }
  };

  const generateAITour = async () => {
    if (selectedIndex === null) return;
    const currentItem = filteredItems[selectedIndex];
    setIsGeneratingTour(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `360 panorama interior of ${currentItem.name}, luxury ${currentItem.cat} by DP Interior, style ${currentItem.stats.style}. Professional architectural photography, photorealistic, 8k.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      const base64EncodeString = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64EncodeString}`;

      setItems(prevItems => prevItems.map(item => 
        item.id === currentItem.id ? { ...item, aiTourUrl: imageUrl } : item
      ));
      
      setLightboxMode('tour');
    } catch (error) {
      console.error("AI Tour generation failed:", error);
    } finally {
      setIsGeneratingTour(false);
    }
  };

  const zoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.5, 5));
  };
  
  const zoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <section id="gallery" className="py-24 bg-[#fcfcfc] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col mb-16 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Portfolio</span>
            <h2 className="text-5xl md:text-6xl text-[#001f3f] mb-6 font-bold leading-tight font-serif">Spaces of <span className="text-[#c5a059]">Distinction.</span></h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Experience our latest commercial office, retail shops, and luxury home transformations through our interactive cinematic slider.
            </p>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100 relative">
              {['all', 'full-home', 'commercial', 'kitchen', 'living', 'bedroom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-5 py-2.5 rounded-full transition-all uppercase text-[10px] font-bold tracking-[0.15em] z-10 flex items-center gap-2.5 ${
                    filter === cat ? 'text-white' : 'text-gray-400 hover:text-[#001f3f]'
                  }`}
                >
                  {cat.replace('-', ' ')}
                  {filter === cat && (
                    <motion.div layoutId="activeCat" className="absolute inset-0 bg-[#001f3f] rounded-full -z-10 shadow-lg shadow-[#001f3f]/10" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredItems.map((item, idx) => {
              const isFav = favorites.includes(item.id);
              return (
                <motion.div 
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="masonry-item break-inside-avoid flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
                >
                  <button onClick={(e) => toggleFavorite(e, item.id)} className={`absolute top-6 right-6 z-20 p-3 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-[#c5a059] text-white' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'}`}>
                    <svg className="h-5 w-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>

                  <div onClick={() => { setSelectedIndex(idx); setDirection(0); }} className="relative overflow-hidden cursor-pointer h-72">
                    <img src={getOptimizedUrl(item.url, 800)} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt={item.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-8">
                       <h4 className="text-white text-2xl font-bold font-serif">{item.name}</h4>
                       <p className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest mt-2">{item.location}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <h4 className="text-[#001f3f] font-bold text-xl font-serif mb-1 truncate">{item.name}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{item.stats.style}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => { setSelectedIndex(idx); setDirection(0); }} className="w-full bg-gray-50 text-[#001f3f] py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] hover:bg-[#001f3f] hover:text-white transition-all uppercase shadow-sm">Enter Virtual Space</button>
                      <button onClick={() => onBookConsultation(`${item.name} (${item.stats.style})`)} className="w-full border border-gray-100 text-gray-400 py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] hover:border-[#c5a059] hover:text-[#c5a059] transition-all uppercase">Book Consultation</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#001f3f]/98 backdrop-blur-3xl touch-none"
          >
            <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 z-[220]">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Signature Project Experience</span>
                <h3 className="text-white text-3xl md:text-4xl font-bold font-serif">{filteredItems[selectedIndex].name}</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                  <button onClick={() => setLightboxMode('image')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'image' ? 'bg-[#c5a059] text-white' : 'text-white/40'}`}>IMAGE</button>
                  <button onClick={() => setLightboxMode('video')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'video' ? 'bg-[#c5a059] text-white' : 'text-white/40'}`}>CINEMATIC</button>
                  <button onClick={() => setLightboxMode('tour')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'tour' ? 'bg-[#c5a059] text-white' : 'text-white/40'}`}>3D TOUR</button>
                </div>
                <button onClick={closeLightbox} className="p-4 bg-white/5 hover:bg-red-500/20 rounded-2xl text-white transition-all">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden" ref={imageContainerRef}>
              <div className="absolute left-8 z-[210] hidden md:block">
                <button onClick={showPrev} className="p-6 bg-white/5 rounded-3xl text-white/30 hover:text-white border border-white/5 transition-all active:scale-90"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth="1.5"/></svg></button>
              </div>
              <div className="absolute right-8 z-[210] hidden md:block">
                <button onClick={showNext} className="p-6 bg-white/5 rounded-3xl text-white/30 hover:text-white border border-white/5 transition-all active:scale-90"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth="1.5"/></svg></button>
              </div>

              <AnimatePresence>
                {lightboxMode === 'image' && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 z-[210] hidden lg:flex flex-col gap-4 bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-white/10"
                  >
                    <button onClick={zoomIn} className="p-3 text-white/60 hover:text-white transition-colors border-b border-white/5" title="Zoom In">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={resetZoom} className="p-3 text-white/60 hover:text-white transition-colors" title="Reset Zoom">
                      <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button onClick={zoomOut} className="p-3 text-white/60 hover:text-white transition-colors border-t border-white/5" title="Zoom Out">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div 
                  key={`${lightboxMode}-${selectedIndex}`} 
                  custom={direction} 
                  variants={slideVariants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                  className="w-full h-full flex items-center justify-center p-6 md:p-24" 
                  onTouchStart={handleTouchStart} 
                  onTouchMove={handleTouchMove} 
                  onClick={handleTap}
                >
                   {lightboxMode === 'image' && (
                     <motion.div 
                        style={{ 
                          x: dragX, 
                          y: dragY, 
                          scale: springScale, 
                          cursor: zoomScale > 1 ? 'grab' : 'zoom-in',
                          transition: 'cursor 0.3s ease'
                        }} 
                        drag={zoomScale > 1} 
                        dragElastic={0.1}
                        dragConstraints={imageContainerRef}
                        className="relative"
                      >
                        <img 
                          src={getOptimizedUrl(filteredItems[selectedIndex].url, 2400)} 
                          className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-3xl border border-white/5 select-none" 
                          alt="Detail View"
                          draggable={false}
                        />
                        {zoomScale > 1 && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none border border-white/10">
                            Zoom: {zoomScale.toFixed(1)}x
                          </div>
                        )}
                     </motion.div>
                   )}
                   {lightboxMode === 'video' && <video autoPlay loop muted src={filteredItems[selectedIndex].videoUrl} className="max-w-6xl aspect-video rounded-[3rem] object-cover shadow-3xl" />}
                   {lightboxMode === 'tour' && (
                     <div className="flex flex-col items-center gap-10">
                        {filteredItems[selectedIndex].aiTourUrl ? (
                          <img src={filteredItems[selectedIndex].aiTourUrl} className="max-w-6xl h-auto rounded-[3rem]" />
                        ) : (
                          <button onClick={generateAITour} className="bg-[#c5a059] text-white px-12 py-6 rounded-full font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-[#001f3f] transition-all shadow-3xl">
                            {isGeneratingTour ? 'Synthesizing...' : 'Generate 3D Architectural Panorama'}
                          </button>
                        )}
                     </div>
                   )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full bg-[#001a35] p-10 border-t border-white/5 z-[220]">
              <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="flex gap-12 items-center flex-wrap justify-center">
                   <div className="text-center lg:text-left">
                      <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2">Area Scale</p>
                      <p className="text-white text-lg font-bold font-serif">{filteredItems[selectedIndex].stats.area}</p>
                   </div>
                   <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                   <div className="text-center lg:text-left">
                      <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2">Design Concept</p>
                      <p className="text-white text-lg font-bold font-serif uppercase tracking-widest">{filteredItems[selectedIndex].stats.style}</p>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                   <button 
                     onClick={() => {
                        onBookConsultation(`${filteredItems[selectedIndex].name} (${filteredItems[selectedIndex].stats.style})`);
                        closeLightbox();
                     }} 
                     className="flex-1 bg-white text-[#001f3f] px-12 py-6 rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl"
                    >
                      Book Consultation for this Project
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
