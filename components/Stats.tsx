
import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: "Happy Homes", value: "5000+", icon: "🏠" },
  { label: "Design Experts", value: "200+", icon: "🎨" },
  { label: "Warranty", value: "10 Years", icon: "🛡️" },
  { label: "Delivery", value: "45 Days", icon: "🚚" }
];

const Stats: React.FC = () => {
  return (
    <section className="py-12 bg-white relative z-30 -mt-10 mx-4 md:mx-8 rounded-[3rem] shadow-2xl border border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-[#001f3f] mb-1 font-serif">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
