import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const AdminStatsManager = () => {
    const [siteStats, setSiteStats] = useState({
        farmers_trained: '',
        certificates_issued: '',
        yield_improvement: '',
        sustainable_projects: '',
        id: null
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsSaving, setStatsSaving] = useState(false);

    useEffect(() => {
        fetchSiteStats();
    }, []);

    const fetchSiteStats = async () => {
        setStatsLoading(true);
        const { data, error } = await supabase
            .from('site_stats')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!error && data) {
            setSiteStats({
                farmers_trained: data.farmers_trained,
                certificates_issued: data.certificates_issued,
                yield_improvement: data.yield_improvement,
                sustainable_projects: data.sustainable_projects,
                id: data.id
            });
        }
        setStatsLoading(false);
    };

    const handleStatsChange = (e) => {
        setSiteStats(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStatsSave = async (e) => {
        e.preventDefault();
        setStatsSaving(true);

        try {
            const statsData = {
                farmers_trained: parseInt(siteStats.farmers_trained) || 0,
                certificates_issued: parseInt(siteStats.certificates_issued) || 0,
                yield_improvement: parseInt(siteStats.yield_improvement) || 0,
                sustainable_projects: parseInt(siteStats.sustainable_projects) || 0,
                updated_at: new Date().toISOString()
            };

            let result;
            if (siteStats.id) {
                result = await supabase
                    .from('site_stats')
                    .update(statsData)
                    .eq('id', siteStats.id);
            } else {
                result = await supabase
                    .from('site_stats')
                    .insert([statsData]);
            }

            if (result.error) {
                toast({ title: "Error", description: "Could not save stats.", variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Stats updated successfully!" });
                if (!siteStats.id && result.data) {
                    setSiteStats(prev => ({ ...prev, id: result.data[0].id }));
                }
            }
        } catch (error) {
            toast({ title: "Error", description: "Could not save stats.", variant: "destructive" });
        } finally {
            setStatsSaving(false);
        }
    };

    if (statsLoading) {
        return (
            <div className="glass-effect rounded-2xl p-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-white/20 rounded mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 bg-white/10 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8"
        >
            <h3 className="text-xl font-bold text-white mb-6">Site Statistics</h3>
            <form onSubmit={handleStatsSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="farmers_trained" className="text-white/80">Farmers Trained</Label>
                        <Input
                            id="farmers_trained"
                            name="farmers_trained"
                            type="number"
                            value={siteStats.farmers_trained}
                            onChange={handleStatsChange}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="certificates_issued" className="text-white/80">Certificates Issued</Label>
                        <Input
                            id="certificates_issued"
                            name="certificates_issued"
                            type="number"
                            value={siteStats.certificates_issued}
                            onChange={handleStatsChange}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="yield_improvement" className="text-white/80">Yield Improvement (%)</Label>
                        <Input
                            id="yield_improvement"
                            name="yield_improvement"
                            type="number"
                            value={siteStats.yield_improvement}
                            onChange={handleStatsChange}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="sustainable_projects" className="text-white/80">Sustainable Projects</Label>
                        <Input
                            id="sustainable_projects"
                            name="sustainable_projects"
                            type="number"
                            value={siteStats.sustainable_projects}
                            onChange={handleStatsChange}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="0"
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={statsSaving}
                    className="btn-primary w-full"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {statsSaving ? 'Saving...' : 'Save Statistics'}
                </Button>
            </form>
        </motion.div>
    );
};

export default AdminStatsManager; 