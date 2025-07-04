import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearningResources = ({ onDownload, onCommunityClick }) => {
  const resources = [
    {
      icon: FileText,
      title: 'PDF Guides',
      description: 'Comprehensive handbooks and reference materials',
      action: () => onDownload('guides'),
      buttonText: 'Download Guides',
      color: 'text-yellow-400'
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn industry-recognized certifications',
      action: () => onDownload('certificates'),
      buttonText: 'View Certificates',
      color: 'text-green-400'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow learners and experts',
      action: onCommunityClick,
      buttonText: 'Join Discussion',
      color: 'text-purple-400'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-900/20 to-green-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Learning <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Access additional materials to enhance your agricultural knowledge
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-effect rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <resource.icon className={`w-8 h-8 ${resource.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
              <p className="text-white/70 mb-4">{resource.description}</p>
              <Button onClick={resource.action} className="btn-secondary">
                {resource.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningResources;