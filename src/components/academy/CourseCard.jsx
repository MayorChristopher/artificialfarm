import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Download, 
  Clock, 
  Users, 
  Star, 
  Video, 
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseCard = ({ 
  course, 
  index, 
  isAuthenticated, 
  onVideoPlay, 
  onEnrollment, 
  onDownload 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-effect rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.price === 'Free' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-400 text-green-900'
          }`}>
            {course.price}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white">
            {course.level}
          </span>
        </div>
        {course.isEnrolled && (
          <button
            onClick={() => onVideoPlay(course.id, 1)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-green-900 ml-1" />
            </div>
          </button>
        )}
        {!course.isEnrolled && !isAuthenticated && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Lock className="w-8 h-8 text-white/70" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Video className="w-4 h-4" />
              <span>{course.lessons} lessons</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white/70">{course.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-white/60">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <span className="text-sm text-white/70">by {course.instructor}</span>
        </div>

        {course.isEnrolled && course.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {course.isEnrolled ? (
            <Button 
              onClick={() => onVideoPlay(course.id, 1)}
              className="flex-1 btn-primary"
            >
              Continue Learning
            </Button>
          ) : (
            <Button 
              onClick={() => onEnrollment(course.id)}
              className="flex-1 btn-primary"
            >
              {course.price === 'Free' ? 'Enroll Free' : 'Enroll Now'}
            </Button>
          )}
          <Button 
            onClick={() => onDownload(course.id)}
            className="btn-secondary px-3"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;