
import React from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearningResourceCard = ({ resource, index, onDownload, onWatch }) => {
  return (
    <motion.div
      key={resource.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
          {resource.type === 'video' ? (
            <Video className="w-6 h-6 text-yellow-400" />
          ) : (
            <FileText className="w-6 h-6 text-yellow-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
          <p className="text-white/70 text-sm mb-3">{resource.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-white/60">
              {resource.type === 'video' ? (
                <span>Duration: {resource.duration}</span>
              ) : (
                <span>Pages: {resource.pages}</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-white/60">
              <Download className="w-3 h-3" />
              <span>{resource.downloads}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {resource.type === 'video' ? (
              <Button
                onClick={() => onWatch(resource.id, resource.title)}
                className="btn-primary text-sm px-4 py-2"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch
              </Button>
            ) : (
              <Button
                onClick={() => onDownload(resource.id, resource.title)}
                className="btn-primary text-sm px-4 py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningResourceCard;
