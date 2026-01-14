
import React from 'react';

const LogoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="goldGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a059" />
        <stop offset="50%" stopColor="#f7e1ad" />
        <stop offset="100%" stopColor="#b08d44" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="#001a35"/>
    <path d="M32 30V70H44C54 70 62 62 62 50C62 38 54 30 44 30H32Z" stroke="url(#goldGradientFooter)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 30V75M48 52C58 52 68 48 68 38C68 28 58 24 48 24" stroke="url(#goldGradientFooter)" strokeWidth="3.5" strokeLinecap="round" transform="translate(4, 4)" />
    <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" fill="#f7e1ad" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001a35] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-10 right-[-10%] text-[18vw] font-serif font-bold text-white/[0.01] pointer-events-none select-none tracking-tighter">
        DESIGN PERFECTION
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white border border-[#c5a059]/20 rounded-3xl flex items-center justify-center overflow-hidden shadow-3xl p-2 flex-shrink-0">
                <LogoSVG />
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tighter block font-serif leading-none">DP <span className="text-[#c5a059]">INTERIOR</span></span>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold block mt-2">Design Perfection</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed font-light text-sm max-w-xs">
              Redefining luxury living and commercial excellence across Delhi NCR. We combine structural precision with artistic vision.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'LI', 'TW'].map(social => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#c5a059] hover:border-[#c5a059] transition-all group">
                  <span className="text-[11px] font-bold group-hover:text-[#001a35] transition-colors">{social}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.5em] text-[10px] mb-12">Expertise</h4>
            <ul className="space-y-6 text-gray-400 font-light text-sm">
              <li><a href="#services" className="hover:text-[#c5a059] transition-colors flex items-center gap-3">Modular Kitchens</a></li>
              <li><a href="#services" className="hover:text-[#c5a059] transition-colors flex items-center gap-3">Luxury Offices</a></li>
              <li><a href="#services" className="hover:text-[#c5a059] transition-colors flex items-center gap-3">Showroom Design</a></li>
              <li><a href="#services" className="hover:text-[#c5a059] transition-colors flex items-center gap-3">Full Home Interiors</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.5em] text-[10px] mb-12">The Studio</h4>
            <div className="space-y-8 text-gray-400 font-light text-sm">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <p className="leading-relaxed">Shop No-AGF 141, Gaur World Smart Street, Sec-16B, Greater Noida West</p>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1.01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <p>+91 98999 65110<br/>+91 81783 75393</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[#c5a059] font-bold uppercase tracking-[0.5em] text-[10px] mb-12">Connect</h4>
            <p className="text-gray-400 text-xs mb-8 font-light leading-relaxed">Join 5000+ elite homeowners receiving our curated design trends.</p>
            <div className="relative group">
              <input type="email" placeholder="Email Address" className="w-full bg-white/5 border-b border-white/20 py-5 px-3 text-sm focus:outline-none focus:border-[#c5a059] transition-all" />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#c5a059] p-3 hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">
              © 2026 DP Interior. Crafting Designer Sanctuaries.
            </p>
            <p className="text-[#c5a059] text-[9px] uppercase tracking-[0.3em] font-bold">
              Designed by : PRVM Consultancy services 9910691877
            </p>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500">
            <a href="#" className="hover:text-[#c5a059] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#c5a059] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
