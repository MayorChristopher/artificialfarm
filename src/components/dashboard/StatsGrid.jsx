import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats = [] }) => {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
    >
      {stats.map((stat) => {
        if (!stat || !stat.icon || !stat.label) return null;
        
        return (
          <div key={stat.label} className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.bgColor || 'bg-white/10'} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color || 'text-white'}`} />
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
              {stat.value || 0}{stat.suffix || ''}{stat.total && `/${stat.total}`}
            </div>
            <div className="text-white/70 text-xs sm:text-sm">{stat.label}</div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default StatsGrid;