
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import Gallery from './components/Gallery';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [prefilledService, setPrefilledService] = useState<string | null>(null);

  const handleBookConsultation = (service: string) => {
    setPrefilledService(service);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar onConsultClick={() => setShowAIAssistant(true)} />
      
      <main>
        <Hero onStartClick={() => setShowAIAssistant(true)} />
        <Stats />
        <Services 
          onConsultClick={() => setShowAIAssistant(true)} 
          onBookConsultation={handleBookConsultation}
        />
        <Process />
        <Gallery />
        <Testimonials />
        <Contact prefilledService={prefilledService} />
      </main>

      <Footer />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#c5a059] hover:bg-[#b08e4d] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 group"
      >
        <span className="hidden group-hover:inline ml-2 font-medium">Design with AI</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIAssistant && (
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
