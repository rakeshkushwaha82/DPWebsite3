
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const LogoSVG = ({ color = "#c5a059" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" rx="24" fill="#001a35"/>
    <path d="M32 30V70H44C54 70 62 62 62 50C62 38 54 30 44 30H32Z" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 30V75M48 52C58 52 68 48 68 38C68 28 58 24 48 24" stroke={color} strokeWidth="3.5" strokeLinecap="round" transform="translate(4, 4)" />
    <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" fill="#f7e1ad" />
  </svg>
);

const downloadItems = [
  {
    id: 'pricelist',
    title: "2024 Interior Price List",
    desc: "A comprehensive cost breakdown for premium modular kitchens, wardrobes, and living room transformations.",
    file: "DP_Interior_PriceList_2024.pdf",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    tag: "Finance"
  },
  {
    id: 'catalogue',
    title: "Product Catalogue",
    desc: "Our complete 2024 collection including Luxury Residential and Commercial Office/Retail designs.",
    file: "DP_Product_Catalogue_2024.pdf",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    tag: "Catalog"
  },
  {
    id: 'profile',
    title: "Company Profile",
    desc: "Discover our heritage and commitment to architectural excellence in Delhi NCR.",
    file: "DP_Company_Profile.pdf",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800",
    tag: "Corporate"
  }
];

const Downloads: React.FC = () => {
  const catalogueRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async (id: string, filename: string) => {
    if (id === 'catalogue') {
      await generatePDF();
      return;
    }
    const mockPdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const link = document.createElement('a');
    link.href = mockPdfUrl;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = async () => {
    if (!catalogueRef.current) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pages = catalogueRef.current.querySelectorAll('.pdf-page');
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      doc.save('DP_Interior_Signature_Catalogue_2024.pdf');
    } catch (error) {
      console.error('PDF Generation Failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const pdfBgStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05
  };

  return (
    <section id="downloads" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[#001f3f]/[0.01] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Resources</span>
            <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-6">Signature Toolkits</h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light leading-relaxed mb-10">Download our latest commercial and residential design portfolios.</p>
            <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {downloadItems.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-3xl transition-all duration-700">
              <div className="h-64 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-[#001f3f]/40 group-hover:bg-transparent transition-all duration-500"></div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-bold text-[#001f3f] font-serif mb-4">{item.title}</h3>
                <button onClick={() => handleDownload(item.id, item.file)} disabled={isGenerating && item.id === 'catalogue'} className="w-full flex items-center justify-between px-8 py-5 bg-[#fcfcfc] rounded-2xl border border-gray-100 text-[10px] font-bold tracking-[0.2em] uppercase text-[#001f3f] group-hover:bg-[#001f3f] group-hover:text-white transition-all shadow-sm">
                  <span>{isGenerating && item.id === 'catalogue' ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pdf-container" ref={catalogueRef}>
        {/* Page 1: Cover */}
        <div className="pdf-page bg-[#001f3f] text-white flex flex-col justify-center items-center text-center relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=90&w=1200')`, backgroundSize: 'cover' }}></div>
          <div className="w-48 h-48 mb-12 relative z-10"><LogoSVG color="#c5a059" /></div>
          <h1 className="text-6xl font-serif mb-4 relative z-10 uppercase tracking-tighter">Signature Catalogue</h1>
          <div className="w-24 h-1 bg-[#c5a059] mb-8 relative z-10"></div>
          <p className="text-[#c5a059] tracking-[0.6em] font-bold text-lg mb-20 uppercase relative z-10">Commercial & Residential 2024</p>
        </div>

        {/* Page 2: About with Luxury Background */}
        <div className="pdf-page bg-white flex flex-col relative">
          <div className="absolute inset-0" style={pdfBgStyle}></div>
          <header className="flex justify-between items-center border-b pb-4 mb-10 border-gray-100 relative z-10">
            <div className="flex items-center gap-3"><div className="w-8 h-8"><LogoSVG /></div><span className="font-serif font-bold text-[#001f3f]">DP INTERIOR</span></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Page 02 / 06</span>
          </header>
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl font-serif text-[#001f3f] mb-8">Architectural Perfection</h2>
            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed text-sm">Our legacy is built on structural precision and artistic vision. We transform empty spaces into hubs of luxury and innovation across the Delhi NCR region.</p>
                    <div className="p-8 bg-[#001f3f]/[0.02] border border-[#001f3f]/10 rounded-3xl">
                        <h3 className="text-[#c5a059] font-bold text-[10px] uppercase tracking-widest mb-4">Core Strengths</h3>
                        <ul className="space-y-3 text-xs text-gray-500">
                            <li>• Turnkey Project Management</li>
                            <li>• 45-Day Guaranteed Delivery</li>
                            <li>• BWP Grade Materials Only</li>
                        </ul>
                    </div>
                </div>
                <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" className="w-full h-80 object-cover rounded-3xl" alt="Residential" />
            </div>
          </div>
          <footer className="mt-auto pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase flex justify-between relative z-10">
            <span>Designed by : PRVM Consultancy services 9910691877</span>
            <span>rakeshkushwaha82@gmail.com</span>
          </footer>
        </div>

        {/* Page 3: Residential Services */}
        <div className="pdf-page bg-white flex flex-col relative">
          <div className="absolute inset-0" style={pdfBgStyle}></div>
          <header className="flex justify-between items-center border-b pb-4 mb-10 border-gray-100 relative z-10">
             <div className="flex items-center gap-3"><div className="w-8 h-8"><LogoSVG /></div><span className="font-serif font-bold text-[#001f3f]">DP INTERIOR</span></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase">Page 03 / 06</span>
          </header>
          <div className="flex-1 space-y-12 relative z-10">
            <h2 className="text-3xl font-serif text-[#001f3f]">Residential Masterpieces</h2>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1556912177-c54030639a4c?auto=format&fit=crop&q=80&w=800" className="w-full h-40 object-cover rounded-2xl" alt="Kitchen" />
                <h3 className="text-xl font-serif text-[#001f3f]">Luxury Kitchens</h3>
                <p className="text-[11px] text-gray-500">Marine grade ply with anti-fingerprint finishes.</p>
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" className="w-full h-40 object-cover rounded-2xl" alt="Living" />
                <h3 className="text-xl font-serif text-[#001f3f]">Living Spaces</h3>
                <p className="text-[11px] text-gray-500">Italian marble and textured wall transformations.</p>
              </div>
            </div>
          </div>
          <footer className="mt-auto pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase flex justify-between relative z-10">
            <span>Designed by : PRVM Consultancy services 9910691877</span>
            <span>+91 98999 65110</span>
          </footer>
        </div>

        {/* Page 4: Commercial Excellence (OFFICES & SHOPS) */}
        <div className="pdf-page bg-white flex flex-col relative">
          <div className="absolute inset-0" style={pdfBgStyle}></div>
          <header className="flex justify-between items-center border-b pb-4 mb-10 border-gray-100 relative z-10">
             <div className="flex items-center gap-3"><div className="w-8 h-8"><LogoSVG /></div><span className="font-serif font-bold text-[#001f3f]">DP INTERIOR</span></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase">Page 04 / 06</span>
          </header>
          <div className="flex-1 space-y-12 relative z-10">
            <h2 className="text-3xl font-serif text-[#001f3f]">Commercial & Retail Solutions</h2>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover rounded-2xl" alt="Office" />
                <h3 className="text-xl font-serif text-[#001f3f]">Corporate Offices</h3>
                <p className="text-[11px] text-gray-500">High-productivity hubs with acoustic glass partitions and ergonomic modular desks.</p>
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover rounded-2xl" alt="Showroom" />
                <h3 className="text-xl font-serif text-[#001f3f]">Luxury Showrooms</h3>
                <p className="text-[11px] text-gray-500">Retail architecture that enhances brand prestige with signature lighting and exotic stones.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <img src="https://images.unsplash.com/photo-1555529731-118a5bb67af7?auto=format&fit=crop&q=80&w=400" className="w-full h-24 object-cover rounded-lg" alt="Shop 1" />
                <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=400" className="w-full h-24 object-cover rounded-lg" alt="Office 2" />
                <img src="https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&q=80&w=400" className="w-full h-24 object-cover rounded-lg" alt="Retail 3" />
            </div>
          </div>
          <footer className="mt-auto pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase flex justify-between relative z-10">
            <span>Designed by : PRVM Consultancy services 9910691877</span>
            <span>Commercial Interiors</span>
          </footer>
        </div>

        {/* Page 5: Portfolio Grid */}
        <div className="pdf-page bg-white flex flex-col relative">
          <div className="absolute inset-0" style={pdfBgStyle}></div>
          <header className="flex justify-between items-center border-b pb-4 mb-10 border-gray-100 relative z-10">
             <div className="flex items-center gap-3"><div className="w-8 h-8"><LogoSVG /></div><span className="font-serif font-bold text-[#001f3f]">DP INTERIOR</span></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase">Page 05 / 06</span>
          </header>
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl font-serif text-[#001f3f] mb-8 uppercase">Spaces of Distinction</h2>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" className="w-full h-44 object-cover rounded-xl" alt="P1" />
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" className="w-full h-44 object-cover rounded-xl" alt="P2" />
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" className="w-full h-44 object-cover rounded-xl" alt="P3" />
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" className="w-full h-44 object-cover rounded-xl" alt="P4" />
            </div>
          </div>
          <footer className="mt-auto pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase flex justify-between relative z-10">
            <span>Designed by : PRVM Consultancy services 9910691877</span>
            <span>Signature Series</span>
          </footer>
        </div>

        {/* Page 6: Contact */}
        <div className="pdf-page bg-white flex flex-col relative">
          <div className="absolute inset-0" style={pdfBgStyle}></div>
          <header className="flex justify-between items-center border-b pb-4 mb-10 border-gray-100 relative z-10">
             <div className="flex items-center gap-3"><div className="w-8 h-8"><LogoSVG /></div><span className="font-serif font-bold text-[#001f3f]">DP INTERIOR</span></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase">Page 06 / 06</span>
          </header>
          <div className="flex-1 flex flex-col justify-center text-center relative z-10">
            <h2 className="text-4xl font-serif text-[#001f3f] mb-12">Visit Our Studio</h2>
            <div className="max-w-md mx-auto space-y-8">
              <div className="p-8 bg-white border border-[#c5a059]/30 rounded-[3rem] shadow-sm">
                <h4 className="text-[#c5a059] font-bold text-xs tracking-widest uppercase mb-4">Gaur World Smart Street</h4>
                <p className="text-gray-600 text-sm">Shop No-AGF 141, Sec-16B,<br/>Greater Noida West, UP 201306</p>
              </div>
              <p className="text-3xl font-serif text-[#001f3f]">+91 98999 65110</p>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.4em]">rakeshkushwaha82@gmail.com</p>
            </div>
          </div>
          <footer className="mt-auto pt-4 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase flex justify-between relative z-10">
            <span>Designed by : PRVM Consultancy services 9910691877</span>
            <span>© 2024 DP Interior</span>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Downloads;
