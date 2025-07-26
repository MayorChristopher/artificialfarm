import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';

const MissionVision = () => {
    return (
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
                            <span className="text-yellow-400 font-semibold text-xl">"Learn to produce more"</span><br />
                            This embodies our commitment to continuous learning and improvement in agricultural practices.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision; 