import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Star, Users, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrainingProgramCard = ({ program, index, isEnrolled, progress, onEnroll, onStartTraining }) => {
  return (
    <motion.div
      key={program.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-effect rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      <div className="relative">
        <img-replace
          src={program.thumbnail}
          alt={program.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-yellow-400 text-green-900 rounded-full text-xs font-medium">
            {program.level}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white">
            {program.price}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick={() => onStartTraining(program.id)}
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Play className="w-5 h-5 text-green-900 ml-1" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{program.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{program.modules} modules</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white/70">{program.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-white/60">
            <Users className="w-4 h-4" />
            <span>{program.students.toLocaleString()} students</span>
          </div>
          <span className="text-sm text-white/70">by {program.instructor}</span>
        </div>

        {isEnrolled && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {(program.features || []).slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {isEnrolled ? (
          <Button 
            onClick={() => onStartTraining(program.id)}
            className="w-full btn-primary"
          >
            Continue Training
          </Button>
        ) : (
          <Button 
            onClick={() => onEnroll(program.id)}
            className="w-full btn-primary"
          >
            Enroll Now
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TrainingProgramCard;