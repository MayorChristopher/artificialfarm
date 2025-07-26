import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
    const handleExploreServices = () => {
        window.location.href = '/consulting';
    };

    const handleContactUs = () => {
        window.location.href = '/contact';
    };

    return (
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
    );
};

export default CallToAction; 