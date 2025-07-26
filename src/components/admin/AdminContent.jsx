import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article',
    content: '',
    author: '',
    is_published: true
  });

  const contentTypes = [
    { value: 'all', label: 'All Content' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'research', label: 'Research' },
    { value: 'course', label: 'Courses' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journey_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching content", description: error.message, variant: "destructive" });
        return;
      }

      setContent(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load content", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = useMemo(() => {
    let filtered = content;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [content, typeFilter, searchTerm]);

  const handleAddContent = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      const contentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        content: formData.content || '',
        author: formData.author || 'Admin',
        is_published: formData.is_published,
        date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('journey_content')
        .insert([contentData]);

      if (error) {
        toast({ title: "Add failed", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Content added", description: "New content has been created successfully." });
      setShowAddModal(false);
      resetForm();
      fetchContent();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add content", variant: "destructive" });
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      const contentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        content: formData.content || '',
        author: formData.author || 'Admin',
        is_published: formData.is_published
      };

      const { error } = await supabase
        .from('journey_content')
        .update(contentData)
        .eq('id', editingContent.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Content updated", description: "Content has been updated successfully." });
      setEditingContent(null);
      resetForm();
      fetchContent();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update content", variant: "destructive" });
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('journey_content')
        .delete()
        .eq('id', contentId);

      if (error) {
        toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        return;
      }

      setContent(prev => prev.filter(c => c.id !== contentId));
      toast({ title: "Content deleted", description: "Content has been removed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete content", variant: "destructive" });
    }
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'article',
      content: item.content || '',
      author: item.author || '',
      is_published: item.is_published !== false
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'article',
      content: '',
      author: '',
      is_published: true
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'research': return FileText;
      case 'course': return BookOpen;
      default: return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'text-blue-400';
      case 'research': return 'text-purple-400';
      case 'course': return 'text-green-400';
      default: return 'text-yellow-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-white/50 mx-auto mb-4 animate-spin" />
        <p className="text-white/70">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Management</h2>
          <p className="text-white/70">Manage articles, videos, research, and course content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchContent} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-green-900 border border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-green-900">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-green-900 text-white">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No content found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className={`w-5 h-5 ${getTypeColor(item.type)}`} />
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_published 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-2">{item.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Type: {item.type}</span>
                        <span>Author: {item.author || 'Admin'}</span>
                        <span>Date: {formatDate(item.date || item.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-green-900 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-green-900 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Content Modal */}
      {(showAddModal || editingContent) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h3>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingContent(null);
                  resetForm();
                }}
                className="bg-white/10 hover:bg-white/20 text-white"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={editingContent ? handleUpdateContent : handleAddContent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter content title"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-white font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="article" className="bg-green-900 text-white">Article</option>
                    <option value="video" className="bg-green-900 text-white">Video</option>
                    <option value="research" className="bg-green-900 text-white">Research</option>
                    <option value="course" className="bg-green-900 text-white">Course</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white font-medium">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter content description"
                  rows={3}
                  required
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div>
                <label className="text-white font-medium">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter content details (optional)"
                  rows={6}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Enter author name"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                    className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="ml-2 text-white/70 text-sm">Published</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-green-900"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingContent ? 'Update Content' : 'Add Content'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContent(null);
                    resetForm();
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-green-900 border border-white/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;