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
          <Button className="w-full btn-primary text-sm justify-start">
            <Calendar className="w-4 h-4 mr-2" />
            Book Consultation
          </Button>
        </Link>
        <Link to="/academy">
          <Button className="w-full btn-secondary text-sm justify-start">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </Link>
        <Button 
          onClick={() => toast({
            title: "📜 Certificates",
            description: "🚧 Certificate download isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
          })}
          className="w-full btn-secondary text-sm justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Certificates
        </Button>
        <Link to="/contact">
          <Button className="w-full btn-secondary text-sm justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickActions;