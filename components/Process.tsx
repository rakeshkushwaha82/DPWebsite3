
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: "01", title: "Consultation", desc: "Meet our experts to discuss your vision and requirements." },
  { num: "02", title: "3D Design", desc: "See your dream home in life-like 3D renders." },
  { num: "03", title: "Execution", desc: "Our skilled craftsmen bring the designs to life." },
  { num: "04", title: "Move In", desc: "Quality check and handover of your beautiful home." }
];

const Process: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">How It Works</span>
            <h2 className="text-5xl md:text-6xl text-[#001f3f] font-bold font-serif mb-8">Seamless Journey from <br />Plan to Perfection.</h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-12">
              We've simplified the complex interior design process into four easy steps. 
              Relax as we handle everything from the first sketch to the final polish.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="text-4xl font-bold text-[#c5a059]/30 font-serif leading-none">{step.num}</span>
                  <div>
                    <h4 className="text-xl font-bold text-[#001f3f] mb-2">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="rounded-[4rem] overflow-hidden shadow-2xl rotate-3 transform transition-transform hover:rotate-0 duration-700">
               <img src="https://images.unsplash.com/photo-1581572866643-e3ff2473fb84?auto=format&fit=crop&q=80&w=1200" alt="Process" />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-[#c5a059] p-10 rounded-[3rem] shadow-2xl hidden md:block">
               <p className="text-white font-bold text-3xl font-serif">45 Days</p>
               <p className="text-white/80 text-sm uppercase tracking-widest font-bold">Guaranteed</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
