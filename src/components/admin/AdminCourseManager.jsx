import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Save, 
  X,
  BookOpen,
  Users,
  Clock,
  Star,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    difficulty: 'beginner',
    duration: '',
    price: 0,
    total_lessons: 0,
    thumbnail_url: '',
    content: ''
  });

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

      if (error) {
        toast({ title: 'Error', description: 'Could not load courses', variant: 'destructive' });
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load courses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      category: '',
      difficulty: 'beginner',
      duration: '',
      price: 0,
      total_lessons: 0,
      thumbnail_url: '',
      content: ''
    });
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.instructor) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        total_lessons: parseInt(formData.total_lessons) || 0,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingCourse) {
        result = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
      } else {
        courseData.created_at = new Date().toISOString();
        result = await supabase
          .from('courses')
          .insert([courseData]);
      }

      if (result.error) {
        toast({ title: 'Error', description: result.error.message, variant: 'destructive' });
      } else {
        toast({ 
          title: 'Success', 
          description: editingCourse ? 'Course updated successfully!' : 'Course created successfully!' 
        });
        setShowForm(false);
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not save course', variant: 'destructive' });
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      category: course.category || '',
      difficulty: course.difficulty || 'beginner',
      duration: course.duration || '',
      price: course.price || 0,
      total_lessons: course.total_lessons || 0,
      thumbnail_url: course.thumbnail_url || '',
      content: course.content || ''
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

      if (error) {
        toast({ title: 'Error', description: 'Could not delete course', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Course deleted successfully!' });
        fetchCourses();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete course', variant: 'destructive' });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Course Management</h2>
            <p className="text-white/70">
              {courses.length} course{courses.length !== 1 ? 's' : ''} • Create and manage learning content
            </p>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>
        </div>
      </motion.div>

      {/* Course Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            <Button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-white/80">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructor" className="text-white/80">Instructor *</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter instructor name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-white/80">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Agriculture, Technology"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-white/80">Difficulty Level</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label htmlFor="duration" className="text-white/80">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., 2h 30m"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-white/80">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="total_lessons" className="text-white/80">Total Lessons</Label>
                <Input
                  id="total_lessons"
                  name="total_lessons"
                  type="number"
                  value={formData.total_lessons}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url" className="text-white/80">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Image URL"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white/80">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 min-h-[100px]"
                placeholder="Enter course description"
                required
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-white/80">Course Content</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 min-h-[150px]"
                placeholder="Enter course content or lesson structure"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-green-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white truncate">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      ${course.price || 0}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-white/60 mb-4">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {course.total_lessons || 0} lessons
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleEdit(course)}
                    className="btn-secondary"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(course.id)}
                    className="btn-secondary"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button 
                    className="btn-secondary"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {courses.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
            <p className="text-white/70 mb-4">Create your first course to get started</p>
            <Button 
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Course
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseManager; 