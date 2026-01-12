
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  
  const [lightboxMode, setLightboxMode] = useState<'image' | 'video' | 'tour'>('image');
  const [zoomScale, setZoomScale] = useState(1);
  const [lastTap, setLastTap] = useState(0);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [isGeneratingTour, setIsGeneratingTour] = useState(false);
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

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
      id: 'com1',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Nexus Tech Headquarters',
      location: 'Greater Noida West',
      description: 'Corporate office with open workstations and acoustic meeting pods.',
      stats: { area: '5500 sqft', rooms: '45 Seats', style: 'Modern Corporate', year: '2024' }
    },
    { 
      id: 'com2',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-interior-design-with-big-windows-39977-large.mp4',
      name: 'Urban Attire Boutique',
      location: 'Noida Sector 62',
      description: 'High-end retail shop with custom metal racking and spotlighting.',
      stats: { area: '1200 sqft', rooms: 'Retail Shop', style: 'Industrial Chic', year: '2023' }
    },
    { 
      id: 'com4',
      cat: 'commercial',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-modern-lighting-39980-large.mp4',
      name: 'Artisan Brew Cafe',
      location: 'Noida Sector 18',
      description: 'A cozy minimalist cafe with rustic oak textures and designer lighting.',
      stats: { area: '1500 sqft', rooms: '32 Covers', style: 'Rustic Modern', year: '2024' }
    },
    { 
      id: 'k1',
      cat: 'kitchen', 
      url: 'https://images.unsplash.com/photo-1556912177-c54030639a4c',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-design-39976-large.mp4',
      name: 'Island Gourmet Hub',
      location: 'Greater Noida West',
      description: 'High-gloss acrylic kitchen with integrated appliances.',
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
      name: 'The Azure Master Suite',
      location: 'Indirapuram',
      description: 'Master bedroom with walk-in closet.',
      stats: { area: '210 sqft', rooms: 'Suite', style: 'Scandinavian', year: '2023' }
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
    const locationMatch = locationFilter === 'all' || item.location === locationFilter;
    return categoryMatch && styleMatch && locationMatch;
  }), [items, filter, styleFilter, locationFilter]);

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
      setInitialDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = dist / initialDistance;
      const newScale = Math.min(Math.max(zoomScale * scaleDelta, 1), 5);
      setZoomScale(newScale);
      setInitialDistance(dist);
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
        prompt: `A professional ultra-high-quality 360-degree panoramic interior view of ${currentItem.name}, showing a luxury ${currentItem.cat} with ${currentItem.stats.style} design. Expansive perspective, seamless edges, high-end materials, photorealistic lighting, 8k resolution, cinematic architecture photography.`,
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
              Explore our diverse portfolio of high-end residences and performance-driven commercial spaces across Delhi NCR. Experience them in 3D using our AI visualization engine.
            </p>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100 relative">
              {['all', 'full-home', 'commercial', 'kitchen', 'living', 'bedroom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`relative px-5 py-2.5 rounded-full transition-all uppercase text-[10px] font-bold tracking-[0.15em] z-10 flex items-center gap-2.5 ${
                    filter === cat ? 'text-white' : 'text-gray-400 hover:text-[#001f3f]'
                  }`}
                >
                  {cat.replace('-', ' ')}
                  {filter === cat && (
                    <motion.div 
                      layoutId="activeCat" 
                      className="absolute inset-0 bg-[#001f3f] rounded-full -z-10 shadow-lg shadow-[#001f3f]/10" 
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group">
                <select 
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className={`bg-white border py-3.5 pl-6 pr-12 rounded-2xl shadow-sm text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 transition-all appearance-none cursor-pointer ${styleFilter !== 'all' ? 'border-[#c5a059] text-[#001f3f]' : 'border-gray-100 text-gray-400'}`}
                >
                  <option value="all">Any Style</option>
                  {Array.from(new Set(items.map(i => i.stats.style))).map(style => <option key={style} value={style}>{style}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
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
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="masonry-item break-inside-avoid flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
                >
                  <button 
                    onClick={(e) => toggleFavorite(e, item.id)} 
                    className={`absolute top-6 right-6 z-20 p-3 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-[#c5a059] text-white' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'}`}
                  >
                    <svg className="h-5 w-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>

                  <div onClick={() => { setSelectedIndex(idx); setDirection(0); }} className="relative overflow-hidden cursor-pointer h-72">
                    <img src={getOptimizedUrl(item.url, 800)} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt={item.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-8">
                       <h4 className="text-white text-2xl font-bold font-serif">{item.name}</h4>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <h4 className="text-[#001f3f] font-bold text-xl font-serif mb-1 truncate">{item.name}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{item.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                       <button onClick={() => { setSelectedIndex(idx); setDirection(0); }} className="flex-1 bg-[#001f3f] text-white py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] hover:bg-[#c5a059] transition-all uppercase shadow-lg shadow-[#001f3f]/10">View Experience</button>
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
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 z-[220]">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Project Perspective</span>
                <h3 className="text-white text-3xl font-bold font-serif">{filteredItems[selectedIndex].name}</h3>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                  <button onClick={() => setLightboxMode('image')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'image' ? 'bg-[#c5a059] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>IMAGE</button>
                  <button onClick={() => setLightboxMode('video')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'video' ? 'bg-[#c5a059] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>CINEMATIC</button>
                  <button onClick={() => setLightboxMode('tour')} className={`px-6 py-2.5 rounded-xl text-[9px] font-bold tracking-widest transition-all ${lightboxMode === 'tour' ? 'bg-[#c5a059] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>3D TOUR</button>
                </div>
                <button onClick={closeLightbox} className="p-4 bg-white/5 hover:bg-red-500/20 rounded-2xl text-white transition-all border border-white/10 group">
                  <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Main Experience Slider */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Navigation Arrows */}
              <div className="absolute left-8 md:left-12 z-[210] hidden md:block">
                <button onClick={showPrev} className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl text-white/30 hover:text-[#c5a059] transition-all border border-white/5 group">
                  <svg className="h-8 w-8 group-active:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
              <div className="absolute right-8 md:right-12 z-[210] hidden md:block">
                <button onClick={showNext} className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl text-white/30 hover:text-[#c5a059] transition-all border border-white/5 group">
                  <svg className="h-8 w-8 group-active:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Progress Counter */}
              <div className="absolute bottom-40 right-12 z-[210] hidden md:block">
                <div className="flex items-center gap-4 text-white/20 font-serif text-5xl">
                  <span className="text-[#c5a059]">{String(selectedIndex + 1).padStart(2, '0')}</span>
                  <span className="text-xl">/</span>
                  <span className="text-sm tracking-widest">{String(filteredItems.length).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Zoom Indicator */}
              {zoomScale > 1 && lightboxMode === 'image' && (
                <div className="absolute top-40 left-1/2 -translate-x-1/2 z-[210] bg-[#c5a059] text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest shadow-2xl animate-bounce">
                  MAGNIFIED {zoomScale.toFixed(1)}X - DRAG TO INSPECT
                </div>
              )}

              <AnimatePresence initial={false} custom={direction} mode="wait">
                {lightboxMode === 'video' ? (
                  <motion.div 
                    key={`vid-${selectedIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full max-w-6xl aspect-video bg-black rounded-[4rem] overflow-hidden shadow-3xl mx-6 border-4 border-white/5"
                  >
                    <video autoPlay loop muted src={filteredItems[selectedIndex].videoUrl} className="w-full h-full object-cover" />
                  </motion.div>
                ) : lightboxMode === 'tour' ? (
                  <motion.div 
                    key={`tour-${selectedIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full h-full flex items-center justify-center"
                  >
                    {filteredItems[selectedIndex].aiTourUrl ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.div 
                          animate={{ x: ["0%", "-50%", "0%"] }}
                          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                          className="h-full flex whitespace-nowrap"
                          style={{ width: '200%' }}
                        >
                          <img src={filteredItems[selectedIndex].aiTourUrl} className="h-full w-1/2 object-cover" alt="Panorama" />
                          <img src={filteredItems[selectedIndex].aiTourUrl} className="h-full w-1/2 object-cover" alt="Panorama" />
                        </motion.div>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
                          <button onClick={generateAITour} className="text-white/40 hover:text-white text-[9px] font-bold tracking-[0.5em] uppercase transition-all">REGENERATE AI PERSPECTIVE</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-8">
                        <div className="text-center space-y-4">
                          <h4 className="text-3xl font-serif text-white/20">3D Visualization Studio</h4>
                          <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">Synthesis of architectural 3D panoramas for this project is available on-demand using our design engine.</p>
                        </div>
                        <button 
                          onClick={generateAITour}
                          disabled={isGeneratingTour}
                          className="bg-[#c5a059] text-white px-12 py-6 rounded-full font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-[#001f3f] transition-all shadow-3xl flex items-center gap-4"
                        >
                          {isGeneratingTour ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                          {isGeneratingTour ? 'Synthesizing...' : 'Generate 3D Visual'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key={`img-${selectedIndex}`}
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
                     <motion.div
                        style={{ x: dragX, y: dragY, scale: zoomScale, cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
                        drag={zoomScale > 1}
                        dragConstraints={{ left: -800 * zoomScale, right: 800 * zoomScale, top: -800 * zoomScale, bottom: 800 * zoomScale }}
                        dragElastic={0.05}
                        className="relative"
                      >
                        <img 
                          src={getOptimizedUrl(filteredItems[selectedIndex].url, 2400)} 
                          className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 pointer-events-none select-none" 
                          alt="Detail View"
                        />
                        {/* Zoom Tooltip */}
                        <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[8px] font-bold text-white/50 tracking-widest uppercase pointer-events-none">
                          Double tap to {zoomScale > 1 ? 'zoom out' : 'zoom in'}
                        </div>
                      </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Meta */}
            <div className="w-full bg-[#001a35] p-10 md:p-16 border-t border-white/5 backdrop-blur-3xl z-[220]">
              <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="flex gap-12 items-center flex-wrap justify-center">
                   <div className="text-center lg:text-left">
                      <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2">Area Scale</p>
                      <p className="text-white text-lg font-bold font-serif">{filteredItems[selectedIndex].stats.area}</p>
                   </div>
                   <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                   <div className="text-center lg:text-left">
                      <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2">Architectural Style</p>
                      <p className="text-white text-lg font-bold font-serif uppercase tracking-widest">{filteredItems[selectedIndex].stats.style}</p>
                   </div>
                   <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                   <div className="text-center lg:text-left">
                      <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2">Completed</p>
                      <p className="text-[#c5a059] text-lg font-bold font-serif">{filteredItems[selectedIndex].stats.year}</p>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                   <button className="flex-1 bg-white text-[#001f3f] px-12 py-6 rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl">
                      Get A Similar Quote
                   </button>
                   <button className="flex-1 bg-white/5 text-white border border-white/10 px-12 py-6 rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-white/10 transition-all">
                      Share Project
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
