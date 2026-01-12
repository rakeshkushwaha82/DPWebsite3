
import React from 'react';
import { motion } from 'framer-motion';

const downloadItems = [
  {
    title: "2024 Interior Price List",
    desc: "Detailed cost breakdown for modular kitchens, wardrobes, and full-home packages.",
    file: "DP_Interior_PriceList_2024.pdf",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  {
    title: "Project Portfolio 2024",
    desc: "A high-fidelity PDF lookbook featuring our premium commercial and residential transformations.",
    file: "DP_Interior_Catalog_2024.pdf",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  {
    title: "Office & Retail Guide",
    desc: "Structural and aesthetic guidelines for commercial project optimization.",
    file: "DP_Commercial_Guide.pdf",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  }
];

const Downloads: React.FC = () => {
  const handleDownload = (filename: string) => {
    // Simulate professional download trigger
    alert(`Initializing high-speed download for: ${filename}\n(Note: In a live environment, this would link to a secure AWS S3 or CDN hosted PDF)`);
  };

  return (
    <section id="downloads" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[#001f3f]/[0.01] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Resources</span>
          <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-6">Expert Toolkits</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {downloadItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#fcfcfc] p-10 rounded-[3rem] border border-gray-100 hover:border-[#c5a059]/30 transition-all hover:shadow-2xl group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#c5a059] shadow-lg mb-8 group-hover:bg-[#001f3f] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#001f3f] font-serif mb-4">{item.title}</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-10">{item.desc}</p>
              
              <button 
                onClick={() => handleDownload(item.file)}
                className="w-full flex items-center justify-between px-8 py-5 bg-white rounded-2xl border border-gray-100 text-[10px] font-bold tracking-[0.2em] uppercase text-[#001f3f] hover:bg-[#c5a059] hover:text-white transition-all group/btn"
              >
                <span>Download PDF</span>
                <svg className="w-5 h-5 transform group-hover/btn:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-[#001f3f] rounded-[3.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
             <h4 className="text-white text-3xl font-serif mb-2">Need a Custom Estimate?</h4>
             <p className="text-gray-400 text-sm">Send your floor plan directly to <span className="text-[#c5a059] font-medium">rakeshkushwaha82@gmail.com</span></p>
          </div>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="relative z-10 bg-[#c5a059] text-white px-12 py-6 rounded-2xl font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-[#001f3f] transition-all">
             Request Detailed Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default Downloads;
