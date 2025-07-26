import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
    return (
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
                            src="https://res.cloudinary.com/dic5sbkn3/image/upload/v1753528451/about-image_vyifi2.jpg"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutHero; 