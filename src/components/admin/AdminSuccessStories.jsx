import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MapPin, User, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    content: '',
    rating: 5,
    avatar_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      toast({
        title: "Error fetching stories",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStory) {
        const { error } = await supabase
          .from('success_stories')
          .update(formData)
          .eq('id', editingStory.id);

        if (error) throw error;
        toast({ title: "Success story updated successfully!" });
      } else {
        const { error } = await supabase
          .from('success_stories')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success story created successfully!" });
      }

      setShowModal(false);
      setEditingStory(null);
      resetForm();
      fetchStories();
    } catch (error) {
      toast({
        title: "Error saving story",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;

    try {
      const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success story deleted successfully!" });
      fetchStories();
    } catch (error) {
      toast({
        title: "Error deleting story",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      role: story.role,
      location: story.location,
      content: story.content,
      rating: story.rating,
      avatar_url: story.avatar_url || '',
      is_featured: story.is_featured || false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      location: '',
      content: '',
      rating: 5,
      avatar_url: '',
      is_featured: false
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Success Stories Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setEditingStory(null);
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Story
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white/70">Loading success stories...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-6 relative"
            >
              {story.is_featured && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <img
                  src={story.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.name}`}
                  alt={story.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{story.name}</h4>
                  <p className="text-white/60 text-sm">{story.role}</p>
                  <p className="text-white/50 text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {story.location}
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-white/80 text-sm mb-4 line-clamp-3">
                "{story.content}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs">
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(story)}
                    className="btn-secondary-sm"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(story.id)}
                    className="btn-danger-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
              </h3>
              <Button
                onClick={() => setShowModal(false)}
                className="btn-ghost p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-white mb-2 block">Role/Profession</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="e.g., Rice Farmer, Agro-entrepreneur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="e.g., Kebbi State, Nigeria"
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="text-white mb-2 block">Rating</Label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-white/10 border-white/20 text-white rounded-lg px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num} className="bg-green-900">
                        {num} Star{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="avatar_url" className="text-white mb-2 block">Avatar URL (Optional)</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white mb-2 block">Testimonial Content</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-white/10 border-white/20 text-white rounded-lg px-3 py-2 placeholder:text-white/50"
                  placeholder="Enter the success story testimonial..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded border-white/20 bg-white/10 text-yellow-400 focus:ring-yellow-400"
                />
                <Label htmlFor="is_featured" className="text-white">
                  Feature this story on homepage
                </Label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Story'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSuccessStories;