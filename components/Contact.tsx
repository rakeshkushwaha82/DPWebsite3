
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactProps {
  prefilledService?: string | null;
}

const Contact: React.FC<ContactProps> = ({ prefilledService }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [selectedInterest, setSelectedInterest] = useState<string>('Full Home');

  // Update selection when prefilledService changes
  useEffect(() => {
    if (prefilledService) {
      setSelectedInterest(prefilledService);
    }
  }, [prefilledService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => setFormStatus('success'), 1500);
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const serviceOptions = [
    'Modular Kitchens', 
    'Living & Dining', 
    'Master Bedrooms', 
    'Space Saving Furniture',
    'Full Home'
  ];

  return (
    <section id="contact" className="py-24 bg-[#fcfcfc] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#001f3f]/[0.02] -skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Action Center */}
          <div className="lg:w-5/12 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Let's Connect</span>
              <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif leading-tight mb-6">
                Ready to Start Your <span className="text-[#c5a059] italic">Dream Project?</span>
              </h2>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                Visit our design studio in Greater Noida West or connect with our experts virtually. We're here to turn your vision into reality.
              </p>
            </motion.div>

            <div className="space-y-8">
              {/* WhatsApp Quick Connect */}
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/919899965110" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-6 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 hover:border-[#c5a059]/30 transition-all group"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest mb-1">Instant Expert Advice</h4>
                  <p className="text-xl font-bold text-[#001f3f]">WhatsApp Us Now</p>
                </div>
              </motion.a>

              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 gap-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] flex-shrink-0 group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001f3f] mb-1 font-serif text-lg tracking-wide">The Design Studio</h4>
                    <p className="text-gray-500 font-light leading-relaxed">
                      Shop No-AGF 141, Gaur World Smart Street, <br /> Sec-16B, Greater Noida West
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#001f3f]/10 flex items-center justify-center text-[#001f3f] flex-shrink-0 group-hover:bg-[#001f3f] group-hover:text-white transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001f3f] mb-1 font-serif text-lg tracking-wide">Talk to an Expert</h4>
                    <p className="text-gray-500 font-light">+91 98999 65110 <span className="mx-2 opacity-30">|</span> +91 81783 75393</p>
                    <p className="text-[#c5a059] text-xs mt-1 font-bold uppercase tracking-wider">Available 10 AM - 8 PM</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Map Integration */}
              <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[320px] border border-gray-100 group relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.097063467362!2d77.4267425!3d28.5668636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf16e680a3a7f%3A0xc49667f33d06173a!2sGaur%20World%20Smart%20Street!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                ></iframe>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs font-bold text-[#001f3f] text-center">Located in the heart of Gaur World Smart Street</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Portal */}
          <div className="lg:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-white p-10 md:p-20 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,31,63,0.1)] border relative transition-all duration-700 ${prefilledService ? 'border-[#c5a059]/50 shadow-[#c5a059]/10' : 'border-gray-50'}`}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#c5a059]/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="mb-12">
                <h3 className="text-4xl font-bold text-[#001f3f] font-serif mb-4">Request a Consultation</h3>
                <p className="text-gray-400 font-light">Get a personalized design quote in under 24 hours.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      id="name"
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c5a059] focus:outline-none transition-colors text-[#001f3f] font-medium" 
                      placeholder=" " 
                    />
                    <label 
                      htmlFor="name"
                      className="absolute left-0 -top-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:font-light peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type="tel" 
                      id="phone"
                      className="peer w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c5a059] focus:outline-none transition-colors text-[#001f3f] font-medium" 
                      placeholder=" " 
                    />
                    <label 
                      htmlFor="phone"
                      className="absolute left-0 -top-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:font-light peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all"
                    >
                      Phone Number
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    required
                    type="email" 
                    id="email"
                    className="peer w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c5a059] focus:outline-none transition-colors text-[#001f3f] font-medium" 
                    placeholder=" " 
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-0 -top-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:font-light peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all"
                  >
                    Email Address
                  </label>
                </div>

                <div className="space-y-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">Your Interest</span>
                  <div className="flex flex-wrap gap-4">
                    {serviceOptions.map((item) => (
                      <label key={item} className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="service" 
                          value={item} 
                          className="hidden peer" 
                          checked={selectedInterest === item}
                          onChange={() => setSelectedInterest(item)}
                        />
                        <span className="px-6 py-3 rounded-2xl border-2 border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest peer-checked:bg-[#001f3f] peer-checked:text-white peer-checked:border-[#001f3f] hover:border-[#c5a059]/20 transition-all inline-block shadow-sm">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    id="message"
                    rows={4} 
                    className="peer w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c5a059] focus:outline-none transition-colors text-[#001f3f] font-medium resize-none" 
                    placeholder=" "
                  ></textarea>
                  <label 
                    htmlFor="message"
                    className="absolute left-0 -top-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:font-light peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all"
                  >
                    Share your requirements
                  </label>
                </div>

                <div className="pt-6 relative">
                  <AnimatePresence mode="wait">
                    {formStatus === 'idle' && (
                      <motion.button 
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="submit"
                        className="w-full bg-[#001f3f] text-white py-6 rounded-[2rem] font-bold tracking-[0.4em] text-xs hover:bg-[#c5a059] transition-all shadow-2xl uppercase relative overflow-hidden group"
                      >
                        <span className="relative z-10">Send Inquiry</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </motion.button>
                    )}
                    {formStatus === 'submitting' && (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full bg-gray-100 text-[#001f3f] py-6 rounded-[2rem] flex items-center justify-center gap-4"
                      >
                        <div className="w-5 h-5 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-[0.2em] text-xs uppercase">Processing...</span>
                      </motion.div>
                    )}
                    {formStatus === 'success' && (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-green-500 text-white py-6 rounded-[2rem] flex items-center justify-center gap-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold tracking-[0.2em] text-xs uppercase">Inquiry Received</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
