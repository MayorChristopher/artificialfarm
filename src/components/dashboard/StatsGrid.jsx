import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <div key={stat.label} className="glass-effect rounded-xl p-6 text-center">
          <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}{stat.suffix || ''}{stat.total && `/${stat.total}`}
          </div>
          <div className="text-white/70 text-sm">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;