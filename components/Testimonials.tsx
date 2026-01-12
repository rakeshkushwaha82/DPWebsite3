
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const testimonialsData = [
  {
    name: "Rahul Sharma",
    role: "Homeowner, Gaur City",
    service: "Modular Kitchens",
    quote: "DP Interior transformed our shell of a flat into a warm, inviting home. Their attention to detail in the modular kitchen is unmatched in Noida.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
    rating: 5,
    gender: 'male' as const
  },
  {
    name: "Anjali Gupta",
    role: "Proprietor, AG Studios",
    service: "Living & Dining",
    quote: "The office interiors they designed for us are both functional and aesthetic. It's boosted our team productivity significantly!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    rating: 5,
    gender: 'female' as const
  },
  {
    name: "Vikram Malhotra",
    role: "IT Professional",
    service: "Master Bedrooms",
    quote: "Professionalism at its best. They delivered our wardrobe and fall ceiling work ahead of schedule without compromising on quality.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    rating: 5,
    gender: 'male' as const
  },
  {
    name: "Priya Verma",
    role: "Creative Director",
    service: "Modular Kitchens",
    quote: "The wall paneling work is exquisite. They really understood the vibe I was going for and executed it perfectly. Highly recommended for premium homes.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    rating: 5,
    gender: 'female' as const
  },
  {
    name: "Tania Bansal",
    role: "Homeowner, Greater Noida",
    service: "Space Saving Furniture",
    quote: "Mera studio apartment itna chota tha, but DP Interior ne space-saving furniture se ise bilkul change kar diya. Murphy bed is actually a life-saver, folding ke baad pata bhi nahi chalta! Superb quality.",
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=600",
    rating: 5,
    gender: 'female' as const
  }
];

export const SERVICE_CATEGORIES = ['All', 'Modular Kitchens', 'Living & Dining', 'Master Bedrooms', 'Space Saving Furniture'];

const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const filteredTestimonials = useMemo(() => {
    return filter === 'All' 
      ? testimonialsData 
      : testimonialsData.filter(t => t.service === filter);
  }, [filter]);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: testimonialsData.length };
    SERVICE_CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = testimonialsData.filter(t => t.service === cat).length;
    });
    return counts;
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const nextSlide = useCallback(() => {
    if (filteredTestimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev === filteredTestimonials.length - 1 ? 0 : prev + 1));
  }, [filteredTestimonials.length]);

  const prevSlide = () => {
    if (filteredTestimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || filteredTestimonials.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, filteredTestimonials.length]);

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Client Stories</span>
          <h2 className="text-4xl md:text-5xl mb-4 text-[#001f3f] font-serif">Voices of Satisfaction</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto mb-10"></div>
          
          {/* Category Filter with Counts */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setIsAutoPlaying(false); }}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border flex items-center gap-2 ${
                  filter === cat 
                    ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-lg' 
                    : 'bg-transparent text-gray-400 border-gray-100 hover:border-[#c5a059]'
                }`}
              >
                {cat}
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${filter === cat ? 'bg-[#c5a059] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-12">
          {filteredTestimonials.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out" 
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {filteredTestimonials.map((t, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 px-4">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 p-10 md:p-16 rounded-[3rem] relative transition-all shadow-sm hover:shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-10"
                      >
                        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative">
                          <img 
                            src={t.image} 
                            alt={t.name} 
                            className="w-full h-full rounded-3xl object-cover shadow-xl border-4 border-white" 
                          />
                          <div className="absolute -bottom-4 -right-4 bg-[#c5a059] text-white p-3 rounded-2xl shadow-lg">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3L22.017 3V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H4.01697C3.46468 8 3.01697 7.55228 3.01697 7V3L11.017 3V15C11.017 18.3137 8.3307 21 5.01697 21H3.01697Z" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="inline-block px-3 py-1 bg-[#c5a059]/10 text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
                              {t.service}
                            </span>
                            <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${t.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                              {t.gender === 'female' ? (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                              )}
                              Verified {t.gender === 'female' ? 'Madam' : 'Sir'}
                            </span>
                          </div>
                          <div className="flex gap-1 mb-6 justify-center md:justify-start">
                            {[...Array(t.rating)].map((_, i) => (
                              <svg key={i} className="w-6 h-6 text-[#c5a059] fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic font-light font-serif">
                            "{t.quote}"
                          </p>
                          <div>
                            <h4 className="font-bold text-2xl text-[#001f3f]">{t.name}</h4>
                            <p className="text-[#c5a059] font-medium uppercase tracking-widest text-sm mt-1">{t.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredTestimonials.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 bg-white text-[#001f3f] p-4 rounded-full shadow-2xl hover:bg-[#c5a059] hover:text-white transition-all z-20 group"
                    aria-label="Previous testimonial"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
                    className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 bg-white text-[#001f3f] p-4 rounded-full shadow-2xl hover:bg-[#c5a059] hover:text-white transition-all z-20 group"
                    aria-label="Next testimonial"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="flex justify-center gap-3 mt-12">
                    {filteredTestimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentIndex === idx ? 'w-12 bg-[#c5a059]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-light italic">No reviews yet for this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
