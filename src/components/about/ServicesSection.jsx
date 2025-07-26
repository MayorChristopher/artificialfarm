import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const ServicesSection = () => {
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

    return (
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
    );
};

export default ServicesSection; 