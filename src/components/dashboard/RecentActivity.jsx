import React from 'react';
import { motion } from 'framer-motion';

const RecentActivity = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.title}</p>
              <p className="text-white/50 text-xs">
                {new Date(activity.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;