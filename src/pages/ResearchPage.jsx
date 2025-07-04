import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  Users,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Research' },
    { id: 'crop-science', name: 'Crop Science' },
    { id: 'soil-health', name: 'Soil Health' },
    { id: 'technology', name: 'AgTech' },
    { id: 'sustainability', name: 'Sustainability' },
    { id: 'climate', name: 'Climate Adaptation' }
  ];

  const researchPapers = [
    {
      id: 1,
      title: 'Precision Agriculture Implementation in Nigerian Rice Farming',
      authors: 'Dr. Adebayo Ogundimu, Prof. Fatima Hassan',
      category: 'technology',
      date: '2024-01-15',
      downloads: 1250,
      abstract: 'This study examines the impact of precision agriculture technologies on rice yield and resource efficiency in Northern Nigeria.',
      fileSize: '2.4 MB',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Sustainable Soil Management Practices for Smallholder Farmers',
      authors: 'Dr. Chinedu Okoro, Dr. Amina Bello',
      category: 'soil-health',
      date: '2024-01-10',
      downloads: 980,
      abstract: 'Comprehensive analysis of soil conservation techniques and their economic impact on small-scale agricultural operations.',
      fileSize: '3.1 MB',
      type: 'PDF'
    },
    {
      id: 3,
      title: 'Climate-Resilient Crop Varieties for West African Agriculture',
      authors: 'Prof. Kemi Adeyemi, Dr. Yusuf Ibrahim',
      category: 'climate',
      date: '2023-12-20',
      downloads: 1560,
      abstract: 'Development and testing of drought-resistant crop varieties adapted to changing climate conditions in West Africa.',
      fileSize: '4.2 MB',
      type: 'PDF'
    },
    {
      id: 4,
      title: 'IoT-Based Smart Irrigation Systems: A Nigerian Case Study',
      authors: 'Eng. Fatima Hassan, Dr. Adebayo Ogundimu',
      category: 'technology',
      date: '2023-11-30',
      downloads: 750,
      abstract: 'Implementation and evaluation of Internet of Things technology for optimized water management in agricultural systems.',
      fileSize: '1.8 MB',
      type: 'PDF'
    },
    {
      id: 5,
      title: 'Economic Impact of Organic Farming Certification in Nigeria',
      authors: 'Prof. Amina Bello, Dr. Chinedu Okoro',
      category: 'sustainability',
      date: '2023-10-15',
      downloads: 890,
      abstract: 'Analysis of market premiums and economic benefits of organic certification for Nigerian agricultural producers.',
      fileSize: '2.7 MB',
      type: 'PDF'
    },
    {
      id: 6,
      title: 'Integrated Pest Management in Tropical Crop Production',
      authors: 'Dr. Kemi Adeyemi, Eng. Yusuf Ibrahim',
      category: 'crop-science',
      date: '2023-09-25',
      downloads: 1120,
      abstract: 'Sustainable pest control strategies combining biological, cultural, and minimal chemical interventions.',
      fileSize: '3.5 MB',
      type: 'PDF'
    }
  ];

  const openSourceData = [
    {
      id: 1,
      title: 'Nigerian Agricultural Weather Data (2020-2024)',
      description: 'Comprehensive weather dataset covering temperature, rainfall, and humidity across 36 states',
      format: 'CSV, JSON',
      size: '45 MB',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      title: 'Crop Yield Database - West Africa',
      description: 'Historical crop yield data for major crops including rice, maize, cassava, and yam',
      format: 'CSV, Excel',
      size: '12 MB',
      lastUpdated: '2024-01-15'
    },
    {
      id: 3,
      title: 'Soil Analysis Dataset - Northern Nigeria',
      description: 'Soil composition, pH levels, and nutrient content data from 500+ farm locations',
      format: 'CSV, JSON',
      size: '8.2 MB',
      lastUpdated: '2024-01-10'
    }
  ];

  const filteredResearch = researchPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (paperId, title) => {
    toast({
      title: "📥 Download Started",
      description: `Downloading "${title}"...`
    });
  };

  const handleDatasetDownload = (datasetId, title) => {
    toast({
      title: "📊 Dataset Download",
      description: `Preparing "${title}" for download...`
    });
  };

  return (
    <>
      <Helmet>
        <title>Research - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Access our latest agricultural research papers, studies, and open-source datasets. Download comprehensive research on crop science, soil health, and agricultural technology." />
      </Helmet>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-green-900/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Agricultural <span className="text-yellow-400">Research</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Access cutting-edge research, downloadable studies, and open-source agricultural data
            </p>
            <div className="flex justify-center">
              <img  
                className="w-full max-w-3xl h-64 md:h-80 object-cover rounded-2xl glass-effect p-4"
                alt="Agricultural research laboratory with scientists conducting crop and soil analysis"
               src="https://images.unsplash.com/photo-1582719471384-894fbb16e074" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-green-900/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search research papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/70" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:border-yellow-400"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-green-900 text-white">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Research <span className="text-yellow-400">Publications</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Download our latest research papers and studies on agricultural innovation and sustainable farming practices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredResearch.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase tracking-wide">
                        {categories.find(c => c.id === paper.category)?.name}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-white/50">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(paper.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{paper.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-white/60">
                    <Download className="w-3 h-3" />
                    <span>{paper.downloads}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{paper.title}</h3>
                <p className="text-sm text-white/70 mb-3">by {paper.authors}</p>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{paper.abstract}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{paper.type} Document</span>
                  <Button
                    onClick={() => handleDownload(paper.id, paper.title)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredResearch.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No research found</h3>
              <p className="text-white/70">Try adjusting your search terms or category filters</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-yellow-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Open Source <span className="text-yellow-400">Data</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Access our comprehensive agricultural datasets for research, analysis, and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {openSourceData.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{dataset.title}</h3>
                    <p className="text-xs text-white/60">Last updated: {dataset.lastUpdated}</p>
                  </div>
                </div>

                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {dataset.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-white/60">
                    <p>Format: {dataset.format}</p>
                    <p>Size: {dataset.size}</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleDatasetDownload(dataset.id, dataset.title)}
                  className="w-full btn-secondary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Dataset
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-effect rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Collaborate on <span className="text-yellow-400">Research</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Interested in collaborating on agricultural research? Join our research network and contribute to advancing sustainable farming practices.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="btn-primary text-lg px-8 py-4 rounded-full"
              >
                Join Research Network
              </Button>
              <Button 
                onClick={() => window.location.href = '/academy'}
                className="btn-secondary text-lg px-8 py-4 rounded-full"
              >
                Access Training Materials
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ResearchPage;