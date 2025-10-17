import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { initializeRealisticData } from '@/utils/initializeData';

const DataInitializer = () => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const result = await initializeRealisticData();
      if (result.success) {
        setInitialized(true);
        toast({
          title: "Success!",
          description: "Site data has been initialized with realistic content.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to initialize data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-yellow-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Initialize Site Data</h3>
        <p className="text-white/70 mb-6">
          Set up realistic statistics, sample courses, and success stories for your site.
        </p>

        {initialized ? (
          <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span>Data has been initialized successfully!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>Click below to initialize your site with sample data</span>
          </div>
        )}

        <div className="space-y-3 text-sm text-white/60 mb-6">
          <p>✓ Site Statistics: 1,247 farmers trained, 892 certificates issued</p>
          <p>✓ Sample Courses: 5 comprehensive agricultural courses</p>
          <p>✓ Success Stories: Real testimonials from farmers</p>
          <p>✓ Contact Information: Already configured with real details</p>
        </div>

        <Button
          onClick={handleInitialize}
          disabled={loading || initialized}
          className="btn-primary"
        >
          {loading ? 'Initializing...' : initialized ? 'Already Initialized' : 'Initialize Data'}
        </Button>
      </div>
    </motion.div>
  );
};

export default DataInitializer;