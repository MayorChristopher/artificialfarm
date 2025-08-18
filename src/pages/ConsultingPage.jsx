import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Zap,
  Rocket,
  CheckCircle,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConsultingPage = () => {
  const navigate = useNavigate();
  
  const colorVariants = {
    blue: {
      bg: 'bg-blue-400/20',
      text: 'text-blue-400',
      badgeBg: 'bg-blue-400/10',
      badgeText: 'text-blue-300'
    },
    yellow: {
      bg: 'bg-yellow-400/20',
      text: 'text-yellow-400',
      badgeBg: 'bg-yellow-400/10',
      badgeText: 'text-yellow-300'
    },
    green: {
      bg: 'bg-green-400/20',
      text: 'text-green-400',
      badgeBg: 'bg-green-400/10',
      badgeText: 'text-green-300'
    }
  };
  const consultationPhases = [
    {
      phase: 'Beginner',
      title: 'Phase 1: Foundational Farming',
      target: 'New farmers, students, and enthusiasts',
      description: 'An introduction to the core principles of modern agriculture. This phase covers everything from understanding soil health to setting up your first small-scale farm with basic tech.',
      goals: [
        'Understand soil composition and testing',
        'Learn basic crop selection and rotation',
        'Set up a small-scale farming operation',
        'Introduction to essential farming tools'
      ],
      examples: [
        { title: 'Hydroponics Setup', image: 'https://images.unsplash.com/photo-1591993433543-f61b3b41d8e1' },
        { title: 'Soil Testing Demo', image: 'https://images.unsplash.com/photo-1591178663884-b3538059a456' },
      ],
      icon: User,
      color: 'blue'
    },
    {
      phase: 'Intermediate',
      title: 'Phase 2: Scaling Operations',
      target: 'Semi-pro agriculturists and growing farm owners',
      description: 'Dive deeper into efficient farm management. This phase focuses on scaling up production with the help of technology, covering crop management, livestock integration, and data analysis.',
      goals: [
        'Implement efficient crop management cycles',
        'Integrate livestock for a circular farm economy',
        'Utilize basic farm management software',
        'Optimize irrigation and resource use'
      ],
      examples: [
        { title: 'Drone Crop Dusting', image: 'https://images.unsplash.com/photo-1620775878959-3d7f7e9b5a3f' },
        { title: 'Automated Greenhouse', image: 'https://images.unsplash.com/photo-1627920197407-a9a3b9346e04' },
      ],
      icon: Zap,
      color: 'yellow'
    },
    {
      phase: 'Advanced',
      title: 'Phase 3: Agri-Tech Mastery',
      target: 'AgriTech professionals and large-scale farm managers',
      description: 'Master the art of precision agriculture. This phase is for professionals looking to leverage AI, IoT, and smart drones to create highly efficient, data-driven farming ecosystems.',
      goals: [
        'Deploy and manage smart drone fleets',
        'Implement AI-driven crop monitoring systems',
        'Master precision fertilization and pest control',
        'Develop sustainable, high-yield farm models'
      ],
      examples: [
        { title: 'AI-Powered Crop Analysis', image: 'https://images.unsplash.com/photo-1615895395788-7323838634e7' },
        { title: 'Robotic Harvesting', image: 'https://images.unsplash.com/photo-1631074065369-9b4b456a6de4' },
      ],
      icon: Rocket,
      color: 'green'
    }
  ];

  const handleStartNow = () => {
    navigate('/consultation');
  };

  return (
    <>
      <Helmet>
        <title>Consultation Structure - Artificial Farm Academy</title>
        <meta name="description" content="Engage with our three-phase consultation structure designed for beginner, intermediate, and advanced agricultural professionals. No monetization, just hands-on engagement." />
      </Helmet>

      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-green-900/30" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Consultation <span className="text-yellow-400">Structure</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80">
              A phased approach to agricultural mastery. Join our community and grow with us, from foundational knowledge to Agri-Tech excellence.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 space-y-20">
        {consultationPhases.map((phase, index) => {
          const color = colorVariants[phase.color];
          return (
            <section key={phase.phase} className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="glass-effect rounded-2xl p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 ${color.bg}  rounded-full flex items-center justify-center`}>
                        <phase.icon className={`w-6 h-6 ${color.text}`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color.badgeBg} ${color.badgeText}`}>
                        {phase.phase}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3">{phase.title}</h2>
                    <p className="text-white/70 mb-2 font-semibold">Target Audience: {phase.target}</p>
                    <p className="text-white/80 mb-6">{phase.description}</p>

                    <div className="space-y-3 mb-8">
                      {phase.goals.map((goal, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-white/90">{goal}</span>
                        </div>
                      ))}
                    </div>

                    <Button onClick={handleStartNow} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300 w-full sm:w-auto">
                      Start Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white/90 text-center lg:text-left">Real Examples</h3>
                    {phase.examples.map((example, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden group">
                        <img className="w-full h-40 object-cover" src={example.image} alt={example.title} />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <p className="absolute bottom-2 left-3 text-white text-sm font-semibold">{example.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default ConsultingPage;