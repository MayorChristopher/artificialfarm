import React from 'react';
import { motion } from 'framer-motion';
import { Cog, Tractor, Leaf, BookOpen } from 'lucide-react';

const BrandSymbols = () => {
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
    );
};

export default BrandSymbols; 