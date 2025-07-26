import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Database,
    Shield,
    Bell,
    Mail,
    Globe,
    Save,
    RefreshCw,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'Artificial Farm Academy',
        contactEmail: 'info@artificialfarms.com',
        maintenanceMode: false,
        allowRegistrations: true
    });
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalConsultations: 0,
        totalMessages: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersCount, coursesCount, consultationsCount, contactsCount] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('courses').select('id', { count: 'exact' }),
                supabase.from('consultations').select('id', { count: 'exact' }),
                supabase.from('contacts').select('id', { count: 'exact' })
            ]);

            setStats({
                totalUsers: usersCount.count || 0,
                totalCourses: coursesCount.count || 0,
                totalConsultations: consultationsCount.count || 0,
                totalMessages: contactsCount.count || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Settings saved",
                description: "System settings have been updated successfully."
            });
        } catch (error) {
            toast({
                title: "Save failed",
                description: "Failed to save settings. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Settings</h2>
                    <p className="text-white/70">Manage platform configuration</p>
                </div>
                <Button onClick={handleSaveSettings} className="btn-primary" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-effect rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers}</div>
                    <div className="text-white/70 text-sm">Total Users</div>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalCourses}</div>
                    <div className="text-white/70 text-sm">Total Courses</div>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalConsultations}</div>
                    <div className="text-white/70 text-sm">Consultations</div>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalMessages}</div>
                    <div className="text-white/70 text-sm">Messages</div>
                </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">General Settings</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-white font-medium">Site Name</label>
                            <p className="text-white/60 text-sm">The name of your platform</p>
                        </div>
                        <div className="sm:w-64">
                            <Input
                                value={settings.siteName}
                                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-white font-medium">Contact Email</label>
                            <p className="text-white/60 text-sm">Primary contact email address</p>
                        </div>
                        <div className="sm:w-64">
                            <Input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-white font-medium">Maintenance Mode</label>
                            <p className="text-white/60 text-sm">Enable maintenance mode to restrict access</p>
                        </div>
                        <div className="sm:w-64">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                                    className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                                />
                                <span className="ml-2 text-white/70 text-sm">
                                    {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-white font-medium">Allow Registrations</label>
                            <p className="text-white/60 text-sm">Allow new user registrations</p>
                        </div>
                        <div className="sm:w-64">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.allowRegistrations}
                                    onChange={(e) => handleSettingChange('allowRegistrations', e.target.checked)}
                                    className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                                />
                                <span className="ml-2 text-white/70 text-sm">
                                    {settings.allowRegistrations ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Security Status</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Authentication</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Secure</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Database</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Connected</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">SSL Certificate</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Valid</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-effect rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                            <Bell className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">System Status</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Email Alerts</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Active</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Error Logging</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Enabled</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Backup Status</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Up to date</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminSettings; 