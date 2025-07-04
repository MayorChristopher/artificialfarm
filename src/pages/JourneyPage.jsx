import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import ContentCard from '@/components/journey/ContentCard';

const JourneyPage = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Content' },
    { id: 'event', name: 'Events' },
    { id: 'story', name: 'Success Stories' },
    { id: 'research', name: 'Research' }
  ];

  useEffect(() => {
    fetchJourneyData();
  }, []);

  useEffect(() => {
    let filtered = journeyData;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(filtered);
  }, [journeyData, selectedCategory, searchTerm]);

  const fetchJourneyData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('journey_content').select('*').order('date', { ascending: false });
    if (error) {
      toast({ title: 'Error loading journey data', description: error.message, variant: 'destructive' });
    } else {
      setJourneyData(data);
    }
    setLoading(false);
  };

  const handleAction = (type, id) => toast({ title: `🚀 ${type}`, description: `Feature for item ${id} is coming soon!` });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center"><p className="text-white/70">Loading journey content...</p></div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Our Journey - Artificial Farm Academy</title></Helmet>
      <section className="relative py-20"><div className="container mx-auto px-4 relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto"><h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Agricultural <span className="text-yellow-400">Journey</span></h1></motion.div></div></section>
      <section className="py-8 bg-green-900/20"><div className="container mx-auto px-4"><div className="flex flex-col md:flex-row gap-4 items-center justify-between"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" /><Input type="text" placeholder="Search our journey..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/10 border-white/20" /></div><div className="flex items-center space-x-2"><Filter className="w-5 h-5 text-white/70" /><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:border-yellow-400">{categories.map(c => <option key={c.id} value={c.id} className="bg-green-900">{c.name}</option>)}</select></div></div></div></section>
      <section className="py-20"><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Milestones & <span className="text-yellow-400">Memories</span></h2></div>{filteredData.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredData.map((item, index) => (<ContentCard key={item.id} item={item} index={index} onVideoPlay={() => handleAction('Video', item.id)} onImageView={() => handleAction('Image', item.id)} onStoryRead={() => handleAction('Story', item.id)} onEventDetails={() => handleAction('Event', item.id)} />))}</div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><h3>No content found</h3></motion.div>)}</div></section>
    </>
  );
};

export default JourneyPage;