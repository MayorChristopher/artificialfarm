import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ActiveCourses = ({ courses, onCourseAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Continue Learning</h2>
        <Link to="/dashboard/courses">
          <Button className="bg-white/5 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 text-sm">
            View All Courses
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{course.title}</h3>
                <p className="text-white/60 text-sm mb-2">by {course.instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
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
                  <Button
                    onClick={() => onCourseAction('continue', course.id)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300 text-sm"
                  >
                    Continue
                  </Button>
                </div>
                <p className="text-white/50 text-xs mt-2">Next: {course.nextLesson}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActiveCourses;