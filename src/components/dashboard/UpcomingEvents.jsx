import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const UpcomingEvents = ({ events }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Upcoming Events</h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium text-sm mb-2">{event.title}</h3>
            <div className="flex items-center space-x-2 text-white/60 text-xs mb-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <Clock className="w-3 h-3 ml-2" />
              <span>{event.time}</span>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              event.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
              event.status === 'registered' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {event.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UpcomingEvents;