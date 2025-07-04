import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  ExternalLink,
  Video,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContentCard = ({ 
  item, 
  index, 
  onVideoPlay, 
  onImageView, 
  onStoryRead, 
  onEventDetails 
}) => {
  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return Video;
      case 'image':
        return ImageIcon;
      case 'story':
        return FileText;
      case 'event':
        return Calendar;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ContentIcon = getContentIcon(item.type);

  const handleAction = () => {
    if (item.type === 'video') onVideoPlay(item.videoUrl);
    else if (item.type === 'image') onImageView(item.imageUrl);
    else if (item.type === 'story') onStoryRead(item.id);
    else onEventDetails(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-effect rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={item.thumbnail || item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
            <ContentIcon className="w-4 h-4 text-white" />
            <span className="text-xs text-white capitalize">{item.type}</span>
          </div>
        </div>
        
        {item.type === 'video' && (
          <button
            onClick={() => onVideoPlay(item.videoUrl)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-green-900 ml-1" />
            </div>
          </button>
        )}
        
        {item.type === 'image' && (
          <button
            onClick={() => onImageView(item.imageUrl)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-green-900" />
            </div>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-white/60 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(item.date)}</span>
          {item.location && (
            <>
              <span>•</span>
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-3">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{item.views?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{item.likes?.toLocaleString() || 0}</span>
            </div>
          </div>

          <Button
            onClick={handleAction}
            className="btn-secondary text-xs px-3 py-1"
          >
            {item.type === 'story' ? 'Read More' : 'View'}
          </Button>
        </div>

        {item.type === 'story' && item.readTime && (
          <div className="mt-2 text-xs text-white/50">
            {item.readTime} • by {item.author}
          </div>
        )}

        {item.type === 'event' && (
          <div className="mt-2 flex items-center space-x-4 text-xs text-white/60">
            <span>{item.attendees} attendees</span>
            <span>{item.speakers} speakers</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentCard;