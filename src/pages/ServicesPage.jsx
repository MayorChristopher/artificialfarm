import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Tractor, 
  FlaskConical, 
  Lightbulb, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Education & Training',
      description: 'Our academy offers a rich learning environment with online courses, certifications, live discussions, and downloadable resources to build your expertise.',
      features: [
        'Comprehensive online courses',
        'Industry-recognized certifications',
        'Real-time discussions & Q&A',
        'Downloadable PDFs and guides'
      ],
      link: '/academy',
      image: 'https://images.unsplash.com/photo-1531482615713-2c657695c282'
    },
    {
      icon: Tractor,
      title: 'Production',
      description: 'We provide hands-on support to establish and scale your farming operations, from initial setup and soil analysis to deploying advanced greenhouse and drone technology.',
      features: [
        'Complete farm setup support',
        'Advanced soil profiling',
        'Greenhouse installation & management',
        'Precision drone deployment'
      ],
      link: '/contact',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad649'
    },
    {
      icon: FlaskConical,
      title: 'Research',
      description: 'Engage with our research division to access project documentation, case studies, and community trial results. We champion open-source data to drive the industry forward.',
      features: [
        'In-depth project documentation',
        'Actionable agricultural case studies',
        'Community-driven field trials',
        'Downloadable research papers'
      ],
      link: '/research',
      image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a296'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'At the heart of our mission is innovation. We develop and implement Agri-IoT systems, robotics, smart sensors, and AI-based planning to create the farms of the future.',
      features: [
        'Custom Agri-IoT systems',
        'Farm robotics & automation',
        'Smart sensor networks',
        'AI-based farm planning'
      ],
      link: '/journey',
      image: 'https://images.unsplash.com/photo-1631074065369-9b4b456a6de4'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Explore our services: Education & Training, Production support, cutting-edge Research, and agricultural Innovation with AI and IoT." />
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
              Our <span className="text-yellow-400">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80">
              A complete ecosystem of services to support every aspect of modern agriculture, from learning the basics to deploying advanced AI.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 space-y-20">
        {services.map((service, index) => (
          <section key={service.title} className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:grid-flow-row-dense lg:grid-cols-2 lg:[&>*:last-child]:col-start-1' : ''}`}
            >
              <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                </div>
                
                <p className="text-white/80 mb-6">{service.description}</p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={service.link}>
                  <Button className="btn-primary w-full sm:w-auto">
                    Explore This Area
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative h-80 rounded-xl overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              </motion.div>
            </motion.div>
          </section>
        ))}
      </div>
    </>
  );
};

export default ServicesPage;