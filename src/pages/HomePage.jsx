import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Users,
  Award,
  TrendingUp,
  Leaf,
  Cog,
  BookOpen,
  Tractor,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const HomePage = () => {
  const [stats, setStats] = useState([
    { icon: Users, label: 'Farmers Trained', value: '...', color: 'text-blue-400' },
    { icon: Award, label: 'Certificates Issued', value: '...', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Yield Improvement', value: '...', color: 'text-green-400' },
    { icon: Leaf, label: 'Sustainable Projects', value: '...', color: 'text-emerald-400' }
  ]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const { data, error } = await supabase.from('site_stats').select('*').order('updated_at', { ascending: false }).limit(1).single();
      if (error || !data) {
        setLoadingStats(false);
        return;
      }
      setStats([
        { icon: Users, label: 'Farmers Trained', value: data.farmers_trained?.toLocaleString() || '0', color: 'text-blue-400' },
        { icon: Award, label: 'Certificates Issued', value: data.certificates_issued?.toLocaleString() || '0', color: 'text-yellow-400' },
        { icon: TrendingUp, label: 'Yield Improvement', value: (data.yield_improvement ? data.yield_improvement + '%' : '0%'), color: 'text-green-400' },
        { icon: Leaf, label: 'Sustainable Projects', value: data.sustainable_projects?.toLocaleString() || '0', color: 'text-emerald-400' }
      ]);
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: Cog,
      title: 'Innovation',
      description: 'Cutting-edge agricultural technology and smart farming solutions',
      color: 'text-yellow-400'
    },
    {
      icon: Tractor,
      title: 'Technology',
      description: 'Modern farming equipment and precision agriculture tools',
      color: 'text-blue-400'
    },
    {
      icon: Leaf,
      title: 'Growth',
      description: 'Sustainable practices that promote long-term agricultural success',
      color: 'text-green-400'
    },
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Comprehensive training programs and research-based learning',
      color: 'text-purple-400'
    }
  ];

  const testimonials = [
    {
      name: 'Adebayo Ogundimu',
      role: 'Rice Farmer, Kebbi State',
      content: 'AFA transformed my farming methods. My rice yield increased by 60% using their precision agriculture techniques.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adebayo'
    },
    {
      name: 'Fatima Hassan',
      role: 'Agro-entrepreneur, Kaduna',
      content: 'The consulting services helped me establish a successful agro-processing business. Highly recommended!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima'
    },
    {
      name: 'Chinedu Okoro',
      role: 'Poultry Farmer, Anambra',
      content: 'Their training programs are world-class. I learned modern poultry management that doubled my profits.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chinedu'
    }
  ];

  const handleVideoPlay = () => {
    toast({
      title: "🎥 Video Player",
      description: "Video player feature will be available soon! Stay tuned for our farm technology overview."
    });
  };

  const handleScheduleConsultation = () => {
    window.location.href = '/consulting';
  };

  const handleJoinAcademy = () => {
    window.location.href = '/academy';
  };

  return (
    <>
      <Helmet>
        <title>Artificial Farm Academy & Consultants - Learn to do more</title>
        <meta name="description" content="Empowering farmers through technology, innovation, and training. Aid innovation in farming, seed tech, agro-input production and supply." />
      </Helmet>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-green-900/20" />

        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-16 h-16 border-2 border-yellow-400/30 rounded-full"
          />
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-40 right-20 w-8 h-8 bg-green-400/20 rounded-full"
          />
          <motion.div
            animate={{ x: [-30, 30, -30] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-40 left-20 w-12 h-12 border border-yellow-400/20 rotate-45"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight mt-12"
            >
              Transforming Agriculture With{' '}
              <span className="text-yellow-400">Tomorrow's Technology</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
            >
              Empowering farmers through innovation, education, and sustainable practices.
              Join thousands who have learned to do more with modern agricultural solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button onClick={handleScheduleConsultation} className="btn-primary text-lg px-8 py-4 rounded-full">
                Book a Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button onClick={handleJoinAcademy} className="btn-secondary text-lg px-8 py-4 rounded-full">
                Join the Academy
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden glass-effect p-4">
                <iframe
                  className="w-full h-64 md:h-80 object-cover rounded-xl"
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="Farm Technology Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm text-white/60 mt-2">Watch: Farm Technology Overview</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-green-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loadingStats ? (
              <div className="col-span-4 text-center text-white/70 text-lg">Loading statistics...</div>
            ) : (
              stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Core <span className="text-yellow-400">Values</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Every symbol in our brand represents our commitment to transforming agriculture through innovation and education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
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
              Success <span className="text-yellow-400">Stories</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Hear from farmers and entrepreneurs who have transformed their agricultural practices with our guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-white/80 leading-relaxed">
                  "{testimonial.content}"
                </p>
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
              Ready to Transform Your <span className="text-yellow-400">Agricultural Journey?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Join thousands of farmers who have already started their journey towards sustainable,
              profitable, and innovative agriculture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Proven Results</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Ongoing Support</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="btn-primary text-lg px-8 py-4 rounded-full">
                  Start Learning Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="btn-secondary text-lg px-8 py-4 rounded-full">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;