import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const CoreValues = () => {
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

    return (
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
    );
};

export default CoreValues; 