
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

interface NavbarProps {
  onConsultClick: () => void;
}

export const LogoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a059" />
        <stop offset="50%" stopColor="#f7e1ad" />
        <stop offset="100%" stopColor="#b08d44" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="#001a35"/>
    <path d="M32 30V70H44C54 70 62 62 62 50C62 38 54 30 44 30H32Z" stroke="url(#goldGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 30V75M48 52C58 52 68 48 68 38C68 28 58 24 48 24" stroke="url(#goldGradient)" strokeWidth="3.5" strokeLinecap="round" transform="translate(4, 4)" />
    <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" fill="#f7e1ad" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onConsultClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = ['Home', 'Services', 'Gallery', 'Downloads', 'Testimonials', 'Contact'];

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#c5a059] z-[110] origin-left"
        style={{ scaleX }}
      />

      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out ${
        isScrolled || isOpen 
          ? 'bg-white/98 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] py-2' 
          : 'bg-transparent py-8'
      }`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div 
            className="flex items-center gap-5 cursor-pointer group" 
            onClick={() => {
              window.scrollTo({top: 0, behavior: 'smooth'});
              setIsOpen(false);
            }}
          >
            <div className={`relative transition-all duration-700 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 p-1.5 ${
              isScrolled ? 'w-12 h-12 md:w-14 md:h-14' : 'w-14 h-14 md:w-18 md:h-18'
            }`}>
              <LogoSVG />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold tracking-[0.05em] block leading-tight font-serif transition-all duration-500 ${
                isScrolled ? 'text-xl md:text-2xl text-[#001f3f]' : 'text-2xl md:text-4xl text-white'
              } ${isOpen ? 'text-[#001f3f]' : ''}`}>
                DP <span className="text-[#c5a059]">INTERIOR</span>
              </span>
              <span className={`uppercase tracking-[0.6em] font-bold transition-all duration-500 ${
                isScrolled ? 'text-[7px] md:text-[8px] text-[#c5a059]' : 'text-[8px] md:text-[9px] text-gray-400'
              } ${isOpen ? 'text-[#c5a059]' : ''}`}>
                Design Perfection
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-10 text-sm font-bold tracking-[0.15em] uppercase">
              {navLinks.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className={`transition-all hover:text-[#c5a059] relative py-2 group ${
                    isScrolled ? 'text-gray-600' : 'text-white'
                  }`}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c5a059] transition-all duration-500 group-hover:w-full" />
                </button>
              ))}
            </div>
            <button 
              onClick={onConsultClick}
              className={`transition-all duration-500 font-bold text-xs tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 px-10 py-4 rounded-full ${
                isScrolled 
                  ? 'bg-[#001f3f] text-white hover:bg-[#c5a059]' 
                  : 'bg-white text-[#001f3f] hover:bg-[#c5a059] hover:text-white'
              }`}
            >
              Consult Now
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-4 rounded-2xl transition-all duration-500 ${
              isScrolled || isOpen ? 'text-[#001f3f] bg-gray-50' : 'text-white bg-white/5 backdrop-blur-md'
            }`}
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.svg 
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg 
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[95] bg-white pt-32 pb-12 px-8 flex flex-col justify-between lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-10">
              {navLinks.map((item, idx) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className="text-left group flex items-center gap-6"
                >
                  <span className="text-gray-200 text-3xl font-serif">0{idx + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-5xl font-serif font-bold text-[#001f3f] group-hover:text-[#c5a059] transition-colors">
                      {item}
                    </span>
                    <div className="h-1.5 w-0 bg-[#c5a059] group-hover:w-24 transition-all duration-500 mt-2"></div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="space-y-8">
              <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center gap-4 text-center">
                <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-[0.4em]">Designer Hotline</p>
                <a href="tel:+919899965110" className="text-3xl font-bold text-[#001f3f] hover:text-[#c5a059] transition-colors">
                  +91 98999 65110
                </a>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">Studios at Greater Noida West</p>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onConsultClick();
                }}
                className="w-full bg-[#001f3f] text-white py-7 rounded-[2.5rem] font-bold tracking-[0.4em] text-sm hover:bg-[#c5a059] transition-all shadow-2xl uppercase"
              >
                Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
