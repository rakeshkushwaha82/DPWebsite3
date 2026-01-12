
import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#001f3f]">
      {/* Dynamic Background Image with Depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#001f3f]/80 to-transparent z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=90&w=2400" 
          alt="Luxury Interior Design" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#c5a059]"></div>
              <span className="text-[#c5a059] font-bold tracking-[0.6em] text-[10px] uppercase block">
                Luxury Home Interiors
              </span>
            </div>
            
            <h1 className="text-6xl md:text-9xl text-white font-bold leading-[0.9] mb-10 font-serif tracking-tighter">
              Crafting <br />
              <span className="text-[#c5a059] italic">Designer</span> Homes.
            </h1>
            
            <p className="text-gray-300 text-lg md:text-2xl font-light leading-relaxed mb-12 max-w-2xl border-l border-[#c5a059]/30 pl-8">
              End-to-end interior solutions from Greater Noida's most trusted design studio. Experience transparency, precision, and <span className="text-white font-medium">45-day guaranteed delivery.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onStartClick}
                className="bg-[#c5a059] text-white px-12 py-6 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white hover:text-[#001f3f] transition-all shadow-[0_20px_40px_-10px_rgba(197,160,89,0.5)] flex items-center justify-center gap-4 group"
              >
                BOOK FREE CONSULTATION
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a 
                href="#gallery"
                className="bg-white/5 backdrop-blur-xl text-white border border-white/20 px-12 py-6 rounded-full font-bold text-xs tracking-[0.3em] hover:bg-white/10 transition-all text-center flex items-center justify-center"
              >
                EXPLORE GALLERY
              </a>
            </div>

            {/* HomeLane Style Trust Badges */}
            <div className="mt-20 flex flex-wrap gap-12 items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 flex items-center justify-center border border-[#c5a059]/20">
                  <svg className="w-5 h-5 text-[#c5a059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xs tracking-wider">45 DAYS</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Guaranteed Delivery</p>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 flex items-center justify-center border border-[#c5a059]/20">
                  <svg className="w-5 h-5 text-[#c5a059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-xs tracking-wider">10 YEARS</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Service Warranty</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
