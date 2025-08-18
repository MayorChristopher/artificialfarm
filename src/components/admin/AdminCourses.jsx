import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Video,
  BookOpen,
  Clock,
  Users,
  Star,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    category: '',
    level: 'Beginner',
    price: 0,
    video_url: 'https://youtu.be/5tIvkNO75T4?si=LMSECXeLiDgvlzxT',
    thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    lessons: []
  });

  const categories = ['Smart Farming', 'Irrigation', 'Crop Management', 'Soil Analysis', 'Technology'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: 4.5,
        students: 0,
        lessons: formData.lessons.length || 5
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Course created successfully" });
      }

      setShowForm(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      price: course.price || 0,
      video_url: course.video_url || 'https://youtu.be/5tIvkNO75T4?si=LMSECXeLiDgvlzxT',
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
      lessons: course.lessons || []
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      toast({ title: "Success", description: "Course deleted successfully" });
      fetchCourses();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      category: '',
      level: 'Beginner',
      price: 0,
      video_url: 'https://youtu.be/5tIvkNO75T4?si=LMSECXeLiDgvlzxT',
      thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
      lessons: []
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-white/50 mx-auto mb-4 animate-spin" />
        <p className="text-white/70">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Management</h2>
          <p className="text-white/70">Create and manage courses with video content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchCourses} className="btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditingCourse(null);
                resetForm();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <Input
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 resize-none"
              rows={3}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-green-900">{cat}</option>
                ))}
              </select>

              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level} className="bg-green-900">{level}</option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Duration (e.g., 2 hours)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <Input
                placeholder="Video URL (YouTube, Vimeo, etc.)"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <Input
              placeholder="Thumbnail URL"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />

            <Button type="submit" className="btn-primary w-full">
              <Save className="w-4 h-4 mr-2" />
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </form>
        </motion.div>
      )}

      <div className="glass-effect rounded-xl p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {course.rating || 4.5}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">
                      ${course.price || 'Free'}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(course)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(course.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;