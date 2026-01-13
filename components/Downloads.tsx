
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const LogoSVG = ({ color = "#c5a059", className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="24" fill="#001a35"/>
    <path d="M32 30V70H44C54 70 62 62 62 50C62 38 54 30 44 30H32Z" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 30V75M48 52C58 52 68 48 68 38C68 28 58 24 48 24" stroke={color} strokeWidth="3.5" strokeLinecap="round" transform="translate(4, 4)" />
    <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" fill="#f7e1ad" />
  </svg>
);

const LogoWithText = ({ light = true }) => (
  <div className="flex items-center gap-4">
    <div className="w-14 h-14 flex-shrink-0">
      <LogoSVG color="#c5a059" />
    </div>
    <div className="flex flex-col">
      <span className={`font-serif font-bold text-2xl tracking-tighter leading-none ${light ? 'text-white' : 'text-[#001f3f]'}`}>
        DP <span className="text-[#c5a059]">INTERIOR</span>
      </span>
      <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#c5a059] mt-1">Design Perfection</span>
    </div>
  </div>
);

const PDFFooter = ({ pageNum, totalPages }) => (
  <div className="absolute bottom-8 left-0 w-full px-12 flex flex-col z-10 bg-inherit">
    <div className="w-full h-[1px] bg-white/10 mb-6"></div>
    <div className="flex justify-between items-end">
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">DP Interior | Boutique Design Studio</p>
        <p className="text-[8px] font-medium text-white/50 tracking-wider uppercase leading-relaxed">
          Shop No-AGF 141, Gaur World Smart Street, Sec-16B, Greater Noida West, UP 201306
        </p>
        <div className="flex gap-4 items-center">
          <p className="text-[8px] font-bold text-white/40 tracking-[0.2em]">TEL: +91 98999 65110</p>
          <div className="w-1 h-1 rounded-full bg-[#c5a059]/40"></div>
          <p className="text-[8px] font-bold text-[#c5a059] tracking-[0.3em]">WWW.DPINTERIORSERVICES.COM</p>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="flex gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]/20"></div>
        </div>
        <p className="text-white/20 font-mono text-[10px] tracking-widest uppercase">Page {pageNum} of {totalPages}</p>
      </div>
    </div>
  </div>
);

const catalogueProducts = [
  {
    name: "Statuario Luxe Kitchen",
    specs: "BWP IS:710 Marine Ply, Anti-Fingerprint Acrylic, Blum Legrabox",
    features: "Built-in Coffee Hub, Smart Motion Lighting, Profile Handles",
    image: "https://images.unsplash.com/photo-1556911223-e27027788ddf?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Heritage Oak Wardrobe",
    specs: "High-Gloss Scratch-Resistant Laminate, Soft-Close Hettich",
    features: "Sensor Internal Lighting, Hidden Vault, Jewelry Pull-outs",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Executive Focus Suite",
    specs: "Acoustic Fabric Paneling, Toughened Glass, Ergonomic Desking",
    features: "Cable Management, Dimmer Lighting, Integrated Tech-Port",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Royal Velvet Living",
    specs: "Custom Suede Sectional, Exotic Wood Veneer, Layered Lighting",
    features: "Atmospheric Backlighting, Hidden Sound System, Bar Nook",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
  }
];

const downloadItems = [
  {
    id: 'pricelist',
    title: "2026 Interior Price List",
    desc: "Updated cost breakdown for modular kitchens, luxury wardrobes, and premium 2026 commercial transformations.",
    file: "DP_Interior_PriceList_2026.pdf",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    tag: "Updated 2026"
  },
  {
    id: 'catalogue',
    title: "Product Catalogue",
    desc: "Comprehensive 2025-2026 collection featuring detailed specs for Residential and Commercial designs.",
    file: "DP_Product_Catalogue.pdf",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800",
    tag: "Catalog"
  },
  {
    id: 'profile',
    title: "Company Profile",
    desc: "Discover our heritage and commitment to architectural excellence in Delhi NCR.",
    file: "DP_Company_Profile.pdf",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    tag: "Corporate"
  },
  {
    id: 'flipbook',
    title: "Digital Flipbook",
    desc: "An interactive magazine experience including all luxury commercial and home categories.",
    file: "DP_Digital_Magazine.pdf",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    tag: "Interactive",
    isFlipbook: true
  }
];

const flipbookPages = [
  { 
    title: "The Grand Villa", 
    category: "Full Home", 
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    details: "Premium statuario marble flooring with hand-crafted wood veneers. Features a double-height ceiling and smart ambient lighting system."
  },
  { 
    title: "Gourmet Studio", 
    category: "Kitchen", 
    image: "https://images.unsplash.com/photo-1556911223-e27027788ddf",
    details: "Anti-fingerprint acrylic finishes, Blum Legrabox systems, and quartz countertops with built-in warming drawers and appliances."
  },
  { 
    title: "Corporate Horizon", 
    category: "Office", 
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    details: "Ergonomic workspace optimization featuring acoustic glass partitions and biophilic design elements to enhance employee focus."
  },
  { 
    title: "Signature Boutique", 
    category: "Retail", 
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    details: "Bespoke retail display pods with precision spotlighting and exotic stone wall treatments for a premium luxury customer journey."
  }
];

const Downloads: React.FC = () => {
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [currentFlipPage, setCurrentFlipPage] = useState(0);

  const pricelistRef = useRef<HTMLDivElement>(null);
  const catalogueRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (containerRef: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (!containerRef.current) return;
    setActiveDownloadId(fileName);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pages = containerRef.current.querySelectorAll('.pdf-page');
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#001a35'
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      doc.save(fileName);
    } catch (error) {
      console.error('PDF Generation Failed:', error);
    } finally {
      setActiveDownloadId(null);
    }
  };

  const handleAction = (item: typeof downloadItems[0]) => {
    if (item.isFlipbook) {
      setShowFlipbook(true);
    } else {
      handleDownload(item.id, item.file);
    }
  };

  const handleDownload = (id: string, filename: string) => {
    if (id === 'catalogue') generatePDF(catalogueRef, filename);
    if (id === 'pricelist') generatePDF(pricelistRef, filename);
    if (id === 'profile') generatePDF(profileRef, filename);
    if (id === 'flipbook') generatePDF(flipbookRef, filename);
  };

  const pageBaseStyles = "pdf-page text-white flex flex-col relative overflow-hidden bg-[#001a35]";
  const overlayStyles = "absolute inset-0 bg-gradient-to-b from-[#001a35]/70 via-transparent to-[#001a35]/90 z-0";

  return (
    <section id="downloads" className="py-24 bg-[#fcfcfc] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#001f3f]/[0.01] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Design Toolkit</span>
            <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-6 leading-tight">Resources of <br/><span className="text-[#c5a059]">Distinction</span></h2>
            <div className="w-24 h-1 bg-[#c5a059] mx-auto mb-10"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {downloadItems.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }} 
              className="group relative bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#001f3f]/40 group-hover:bg-transparent transition-all duration-500"></div>
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest">{item.tag}</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#001f3f] font-serif mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-8 line-clamp-3">{item.desc}</p>
                <button 
                  onClick={() => handleAction(item)} 
                  className="mt-auto w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-bold tracking-[0.2em] uppercase text-[#001f3f] group-hover:bg-[#001f3f] group-hover:text-white transition-all shadow-sm"
                >
                  {item.isFlipbook ? 'VIEW FLIPBOOK' : (activeDownloadId === item.file ? 'GENERATING...' : 'DOWNLOAD PDF')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 16l5 5m0 0l5-5m-5 5V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLIPBOOK PREVIEW MODAL */}
      <AnimatePresence>
        {showFlipbook && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#001a35]/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-5xl aspect-[3/2] flex flex-col">
              <div className="flex justify-between items-center mb-8 px-4">
                <LogoWithText />
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleDownload('flipbook', 'DP_Digital_Magazine.pdf')}
                    disabled={activeDownloadId !== null}
                    className="px-8 py-3 bg-[#c5a059] text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#001a35] transition-all shadow-xl"
                  >
                    {activeDownloadId ? 'GENERATING...' : 'DOWNLOAD FULL MAGAZINE'}
                  </button>
                  <button onClick={() => setShowFlipbook(false)} className="p-3 bg-white/5 rounded-full text-white hover:bg-red-500/20 transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 relative flex items-center justify-center gap-8 overflow-hidden">
                <button 
                  onClick={() => setCurrentFlipPage(prev => Math.max(0, prev - 1))}
                  className="p-6 bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth="2"/></svg>
                </button>

                <div className="relative flex-1 h-full bg-white rounded-[3rem] overflow-hidden shadow-3xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFlipPage}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="absolute inset-0 flex flex-col"
                    >
                      <img src={flipbookPages[currentFlipPage].image} className="w-full h-2/3 object-cover" crossOrigin="anonymous" />
                      <div className="flex-1 p-16 flex flex-col justify-center items-center text-center">
                        <span className="text-[#c5a059] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">{flipbookPages[currentFlipPage].category}</span>
                        <h4 className="text-[#001f3f] text-5xl font-serif mb-6">{flipbookPages[currentFlipPage].title}</h4>
                        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                          {flipbookPages[currentFlipPage].details}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setCurrentFlipPage(prev => Math.min(flipbookPages.length - 1, prev + 1))}
                  className="p-6 bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
                </button>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {flipbookPages.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentFlipPage(i)}
                    className={`h-1.5 rounded-full transition-all ${currentFlipPage === i ? 'w-12 bg-[#c5a059]' : 'w-4 bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIDDEN PDF TEMPLATES */}
      <div className="pdf-container">
        
        {/* CATALOGUE TEMPLATE */}
        <div ref={catalogueRef}>
          {/* Page 1: Cover */}
          <div className={`${pageBaseStyles} items-center justify-center text-center`}>
            <div className="absolute inset-0 z-[-1]">
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=95&w=1200" className="w-full h-full object-cover" alt="Luxury Interior" crossOrigin="anonymous" />
            </div>
            <div className={overlayStyles}></div>
            <div className="relative z-10 p-12 flex flex-col items-center">
              <div className="mb-12 scale-150"><LogoWithText /></div>
              <h1 className="text-8xl font-serif font-bold uppercase tracking-tighter leading-[0.8] mb-12">Architectural<br/><span className="text-[#c5a059]">Distinction</span></h1>
              <div className="w-32 h-2 bg-[#c5a059] mb-12"></div>
              <p className="text-2xl tracking-[0.8em] font-bold uppercase text-white/80">Product Collection 2025-26</p>
            </div>
            <PDFFooter pageNum={1} totalPages={4} />
          </div>

          {/* Page 2: Commercial Focus */}
          <div className={pageBaseStyles}>
            <div className="relative z-10 p-16 flex flex-col h-full">
              <div className="flex justify-between items-center mb-12"><LogoWithText /></div>
              <span className="text-[#c5a059] font-bold tracking-[0.6em] uppercase text-[10px] mb-6">Corporate Aesthetics</span>
              <h2 className="text-6xl font-serif mb-12 max-w-lg leading-tight">Elevating Brand<br/>Commercial Spaces.</h2>
              <div className="grid grid-cols-2 gap-10 mt-auto pb-32">
                <div className="p-10 bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
                  <h3 className="text-[#c5a059] font-serif text-3xl mb-4">Executive Hubs</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">Engineered workstations and conference suites that optimize corporate performance.</p>
                </div>
                <div className="p-10 bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
                  <h3 className="text-[#c5a059] font-serif text-3xl mb-4">Retail Soul</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">Experiential retail architecture designed to convert footfall into brand identity.</p>
                </div>
              </div>
            </div>
            <PDFFooter pageNum={2} totalPages={4} />
          </div>

          {/* Page 3: Product Showcase */}
          <div className={pageBaseStyles}>
             <div className="relative z-10 p-16 flex flex-col h-full">
                <div className="flex justify-between items-center mb-12"><LogoWithText /></div>
                <div className="grid grid-cols-2 gap-8 mb-16">
                  {catalogueProducts.slice(0, 2).map((p, i) => (
                    <div key={i} className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5">
                      <img src={p.image} className="h-48 w-full object-cover" crossOrigin="anonymous" />
                      <div className="p-8">
                        <h4 className="text-[#c5a059] font-serif text-2xl mb-2">{p.name}</h4>
                        <p className="text-[9px] text-white/50 uppercase tracking-widest leading-relaxed">{p.specs}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {catalogueProducts.slice(2, 4).map((p, i) => (
                    <div key={i} className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5">
                      <img src={p.image} className="h-48 w-full object-cover" crossOrigin="anonymous" />
                      <div className="p-8">
                        <h4 className="text-[#c5a059] font-serif text-2xl mb-2">{p.name}</h4>
                        <p className="text-[9px] text-white/50 uppercase tracking-widest leading-relaxed">{p.specs}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             <PDFFooter pageNum={3} totalPages={4} />
          </div>

          {/* Page 4: Trust Page */}
          <div className={pageBaseStyles}>
            <div className="absolute inset-0 z-[-1]">
              <img src="https://images.unsplash.com/photo-1581572866643-e3ff2473fb84?auto=format&fit=crop&q=95&w=1200" className="w-full h-full object-cover opacity-30" alt="Process" crossOrigin="anonymous" />
            </div>
            <div className="relative z-10 p-20 flex flex-col h-full items-center justify-center text-center">
              <div className="mb-16 scale-125"><LogoWithText /></div>
              <h2 className="text-7xl font-serif mb-8 text-white tracking-tighter">Engineered For <span className="text-[#c5a059]">Excellence.</span></h2>
              <p className="text-xl text-white/60 font-light max-w-2xl leading-relaxed mb-16">
                Every structural component, hinge, and veneer is scrutinized to meet our rigorous DP Standards of architectural integrity.
              </p>
              <div className="grid grid-cols-3 gap-12 w-full max-w-4xl border-t border-white/10 pt-16">
                <div><p className="text-4xl font-serif text-[#c5a059] mb-2">45 Days</p><p className="text-[9px] uppercase tracking-widest text-white/40">Guaranteed Delivery</p></div>
                <div><p className="text-4xl font-serif text-[#c5a059] mb-2">10 Years</p><p className="text-[9px] uppercase tracking-widest text-white/40">Service Warranty</p></div>
                <div><p className="text-4xl font-serif text-[#c5a059] mb-2">5000+</p><p className="text-[9px] uppercase tracking-widest text-white/40">Happy Clients</p></div>
              </div>
            </div>
            <PDFFooter pageNum={4} totalPages={4} />
          </div>
        </div>

        {/* PRICE LIST TEMPLATE 2026 */}
        <div ref={pricelistRef}>
          <div className={`${pageBaseStyles} p-0 bg-[#001a35]`}>
             <div className="h-[40%] relative">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=95&w=1200" className="w-full h-full object-cover opacity-60" alt="Finance" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001a35] via-transparent to-black/40"></div>
                <div className="absolute top-12 left-12 scale-110"><LogoWithText /></div>
                <div className="absolute bottom-16 left-20">
                  <span className="text-[#c5a059] font-bold tracking-[0.5em] uppercase text-xs mb-4 block">Exclusive 2026 Guide</span>
                  <h1 className="text-7xl font-serif text-white uppercase tracking-tighter leading-none">Investment<br/><span className="text-[#c5a059]">Transparency</span></h1>
                </div>
             </div>
             <div className="flex-1 p-20 space-y-12">
                <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h3 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.5em] border-b border-[#c5a059]/30 pb-4">Residential Packs</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center"><span className="text-xl font-serif">2 BHK Executive</span><span className="text-xl font-bold text-[#c5a059]">₹6.5L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif">3 BHK Signature</span><span className="text-xl font-bold text-[#c5a059]">₹9.8L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif">4 BHK Presidential</span><span className="text-xl font-bold text-[#c5a059]">₹14.5L+</span></div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.5em] border-b border-[#c5a059]/30 pb-4">Commercial Packs</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center"><span className="text-xl font-serif text-white">Office Luxury</span><span className="text-xl font-bold text-[#c5a059]">₹5.0L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif text-white">Office Signature</span><span className="text-xl font-bold text-[#c5a059]">₹9.0L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif text-white">Luxury Shop</span><span className="text-xl font-bold text-[#c5a059]">₹4.0L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif text-white">Showroom Signature</span><span className="text-xl font-bold text-[#c5a059]">₹6.0L+</span></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-16">
                   <div className="space-y-8">
                    <h3 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-[0.5em] border-b border-[#c5a059]/30 pb-4">Modular Systems</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center"><span className="text-xl font-serif">Island Kitchens</span><span className="text-xl font-bold text-[#c5a059]">₹2.4L+</span></div>
                      <div className="flex justify-between items-center"><span className="text-xl font-serif">Luxury Wardrobes</span><span className="text-xl font-bold text-[#c5a059]">₹0.9L+</span></div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 flex items-center justify-center">
                    <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-[0.2em] text-center font-bold">
                      Design • 3D Renders • Logistics • Execution • 10-Year Warranty
                    </p>
                  </div>
                </div>
             </div>
             <PDFFooter pageNum={1} totalPages={1} />
          </div>
        </div>

        {/* FLIPBOOK PDF TEMPLATE */}
        <div ref={flipbookRef}>
          {flipbookPages.map((page, pIdx) => (
            <div key={pIdx} className={`${pageBaseStyles} p-0 bg-[#001a35]`}>
              <div className="h-3/5 relative">
                <img src={`${page.image}?auto=format&fit=crop&q=95&w=1200`} className="w-full h-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001a35] via-transparent to-transparent"></div>
                <div className="absolute top-12 left-16 z-10 scale-110"><LogoWithText /></div>
              </div>
              <div className="flex-1 p-20 flex flex-col justify-center bg-[#001a35]">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-[1px] bg-[#c5a059]"></div>
                  <span className="text-[#c5a059] font-bold tracking-[0.6em] uppercase text-xs">{page.category} Series Experience</span>
                </div>
                <h2 className="text-7xl font-serif text-white mb-8 leading-tight tracking-tighter">{page.title}</h2>
                <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl mb-12">{page.details}</p>
                <div className="flex gap-12 border-l-4 border-[#c5a059] pl-10">
                   <p className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold">Bespoke Architectural Engineering</p>
                </div>
              </div>
              <PDFFooter pageNum={pIdx + 1} totalPages={flipbookPages.length} />
            </div>
          ))}
        </div>

        {/* PROFILE TEMPLATE */}
        <div ref={profileRef}>
          <div className={pageBaseStyles}>
            <div className="absolute inset-0 z-[-1]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=1200" className="w-full h-full object-cover opacity-60" alt="Corporate Profile" crossOrigin="anonymous" />
            </div>
            <div className="absolute inset-0 bg-[#001a35]/85 z-0"></div>
            <div className="relative z-10 p-24 flex flex-col h-full justify-center">
              <div className="mb-24 scale-125 origin-left"><LogoWithText /></div>
              <h1 className="text-9xl font-serif mb-12 leading-[0.8] tracking-tighter">Legacy of<br/><span className="text-[#c5a059]">Precision.</span></h1>
              <p className="text-3xl font-light text-white/60 max-w-2xl leading-relaxed mb-24">
                DP Interior has redefined the architectural landscape of Greater Noida, serving elite clients across the NCR since our inception.
              </p>
              <div className="grid grid-cols-2 gap-20 border-t border-white/10 pt-20">
                <div><p className="text-7xl font-serif text-[#c5a059] mb-4">45 Days</p><p className="text-sm uppercase tracking-[0.6em] text-white/40 font-bold">Delivery Commitment</p></div>
                <div><p className="text-7xl font-serif text-[#c5a059] mb-4">10 Years</p><p className="text-sm uppercase tracking-[0.6em] text-white/40 font-bold">Structural Assurance</p></div>
              </div>
            </div>
            <PDFFooter pageNum={1} totalPages={1} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Downloads;
