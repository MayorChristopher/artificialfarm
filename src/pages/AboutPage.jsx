import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Globe, 
  Leaf, 
  Cog, 
  BookOpen, 
  Tractor,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  const brandSymbols = [
    {
      icon: Cog,
      title: 'Innovation',
      description: 'Driving technological advancement in agriculture through research and development of cutting-edge farming solutions.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: Tractor,
      title: 'Technology in Farming',
      description: 'Integrating modern equipment, precision agriculture, and smart farming techniques for optimal productivity.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Leaf,
      title: 'Growth & Sustainability',
      description: 'Promoting sustainable agricultural practices that ensure long-term environmental and economic viability.',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: BookOpen,
      title: 'Education & Research',
      description: 'Providing comprehensive training programs and conducting research to advance agricultural knowledge.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from training to consulting services.'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and methods to solve agricultural challenges creatively.'
    },
    {
      title: 'Sustainability',
      description: 'We promote practices that protect the environment while ensuring economic viability.'
    },
    {
      title: 'Empowerment',
      description: 'We believe in empowering farmers with knowledge and tools to succeed independently.'
    },
    {
      title: 'Collaboration',
      description: 'We work together with communities, partners, and stakeholders to achieve common goals.'
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our interactions and business practices.'
    }
  ];

  const achievements = [
    { number: '5,000+', label: 'Farmers Trained' },
    { number: '150+', label: 'Sustainable Projects' },
    { number: '25+', label: 'States Reached' },
    { number: '40%', label: 'Average Yield Increase' }
  ];

  const services = [
    {
      title: 'Consulting Services',
      description: 'Expert guidance on farm management, crop selection, and agricultural business development.',
      features: ['Farm Assessment', 'Business Planning', 'Technology Integration', 'Market Analysis']
    },
    {
      title: 'Educational Programs',
      description: 'Comprehensive training courses covering modern farming techniques and agricultural innovation.',
      features: ['Online Courses', 'Hands-on Training', 'Certification Programs', 'Research Access']
    },
    {
      title: 'Innovation Support',
      description: 'Research and development support for new agricultural technologies and sustainable practices.',
      features: ['R&D Projects', 'Technology Testing', 'Innovation Labs', 'Pilot Programs']
    }
  ];

  const handleLearnMore = () => {
    document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactUs = () => {
    window.location.href = '/contact';
  };

  const handleExploreServices = () => {
    window.location.href = '/consulting';
  };

  return (
    <>
      <Helmet>
        <title>About Us - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Learn about our mission to aid innovation in farming, seed tech, agro-input production and supply. Supporting farmers and communities through sustainable projects and research." />
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
              About <span className="text-yellow-400">Artificial Farm Academy</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Empowering the future of agriculture through innovation, education, and sustainable practices
            </p>
            <div className="flex justify-center">
              <img  
                className="w-full max-w-3xl h-64 md:h-80 object-cover rounded-2xl glass-effect p-4"
                alt="Agricultural innovation center with modern farming equipment and training facilities"
               src="https://images.unsplash.com/photo-1554048807-b043cffa8118" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-green-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-white/80 leading-relaxed">
                "Aid innovation in farming, seed tech, agro-input production and supply." 
                We are committed to transforming agriculture through cutting-edge technology and sustainable practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-white/80 leading-relaxed">
                "Support farmers and communities through sustainable projects and research." 
                We envision a future where every farmer has access to modern agricultural knowledge and tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Slogan</h2>
              <p className="text-white/80 leading-relaxed">
                <span className="text-yellow-400 font-semibold text-xl">"Learn to do more"</span><br />
                This embodies our commitment to continuous learning and improvement in agricultural practices.
              </p>
            </motion.div>
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
              Our Brand <span className="text-yellow-400">Symbols</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Every element of our brand represents our core values and commitment to agricultural excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandSymbols.map((symbol, index) => (
              <motion.div
                key={symbol.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 ${symbol.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <symbol.icon className={`w-8 h-8 ${symbol.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{symbol.title}</h3>
                    <p className="text-white/80 leading-relaxed">{symbol.description}</p>
                  </div>
                </div>
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
              Our <span className="text-yellow-400">Achievements</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Numbers that reflect our impact on Nigerian agriculture and farming communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {achievement.number}
                </div>
                <div className="text-white/70">{achievement.label}</div>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Core <span className="text-yellow-400">Values</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The principles that guide our work and define our commitment to agricultural excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold text-white">{value.title}</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services-section" className="py-20 bg-green-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What We <span className="text-yellow-400">Offer</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive solutions for modern agricultural challenges through education, consulting, and innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
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
              Ready to Join Our <span className="text-yellow-400">Agricultural Revolution?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Whether you're a farmer looking to improve your practices or an entrepreneur seeking agricultural opportunities, 
              we're here to support your journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleExploreServices} className="btn-primary text-lg px-8 py-4 rounded-full">
                Explore Our Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button onClick={handleContactUs} className="btn-secondary text-lg px-8 py-4 rounded-full">
                Contact Us Today
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;