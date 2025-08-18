import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        <Link to="/consulting">
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300 justify-start">
            <Calendar className="w-4 h-4 mr-2" />
            Book Consultation
          </Button>
        </Link>
        <Link to="/academy">
          <Button className="w-full bg-white/5 hover:bg-white/15 text-white font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 justify-start">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </Link>
        <Button 
          onClick={() => toast({
            title: "📜 Certificates",
            description: "🚧 Certificate download isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
          })}
          className="w-full bg-white/5 hover:bg-white/15 text-white font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Certificates
        </Button>
        <Link to="/contact">
          <Button className="w-full bg-white/5 hover:bg-white/15 text-white font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickActions;