import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CareersPage = () => {
  const handleApply = () => {
    toast({
      title: "🚧 Feature in Development",
      description: "Our online application portal is coming soon. For now, please send your resume to careers@artificialfarms.com",
    });
  };

  return (
    <>
      <Helmet>
        <title>Careers - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Join our team and help shape the future of agriculture in Africa. Explore exciting career opportunities at Artificial Farm Academy & Consultants." />
      </Helmet>
      <div className="container mx-auto px-4 pt-24 pb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Join Our Team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-white/80 max-w-3xl mx-auto mb-12"
        >
          We are always looking for passionate and talented individuals to help us revolutionize agriculture. While we don't have specific openings right now, we'd love to hear from you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button onClick={handleApply} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300">
            Contact HR
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default CareersPage;