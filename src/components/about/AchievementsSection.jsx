import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const AchievementsSection = () => {
    const [achievements, setAchievements] = useState([
        { number: '...', label: 'Farmers Trained' },
        { number: '...', label: 'Sustainable Projects' },
        { number: '...', label: 'States Reached' },
        { number: '...', label: 'Average Yield Increase' }
    ]);
    const [loadingAchievements, setLoadingAchievements] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingAchievements(true);
            const { data, error } = await supabase.from('site_stats').select('*').order('updated_at', { ascending: false }).limit(1).single();
            if (!error && data) {
                setAchievements([
                    { number: data.farmers_trained?.toLocaleString() || '0', label: 'Farmers Trained' },
                    { number: data.sustainable_projects?.toLocaleString() || '0', label: 'Sustainable Projects' },
                    { number: '25+', label: 'States Reached' }, // Static or update if you have this in Supabase
                    { number: (data.yield_improvement ? data.yield_improvement + '%' : '0%'), label: 'Average Yield Increase' }
                ]);
            }
            setLoadingAchievements(false);
        };
        fetchStats();
    }, []);

    return (
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
                    {loadingAchievements ? (
                        <div className="col-span-4 text-center text-white/70 text-lg">Loading achievements...</div>
                    ) : (
                        achievements.map((achievement, index) => (
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default AchievementsSection; 