import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Mail,
    User,
    Phone,
    Building,
    Calendar,
    Eye,
    Trash2,
    Search,
    RefreshCw,
    Reply,
    Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const subjectOptions = [
        { value: 'all', label: 'All Subjects' },
        { value: 'general', label: 'General Inquiry' },
        { value: 'consulting', label: 'Consulting Services' },
        { value: 'academy', label: 'Academy & Training' },
        { value: 'partnerships', label: 'Partnerships' }
    ];

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast({ title: "Error fetching messages", description: error.message, variant: "destructive" });
                return;
            }

            setMessages(data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load messages", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = useMemo(() => {
        let filtered = messages;

        if (subjectFilter !== 'all') {
            filtered = filtered.filter(message => message.subject === subjectFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(message =>
                message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.company?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [messages, subjectFilter, searchTerm]);

    const handleDelete = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', messageId);

            if (error) {
                toast({ title: "Delete failed", description: error.message, variant: "destructive" });
                return;
            }

            setMessages(prev => prev.filter(m => m.id !== messageId));
            toast({ title: "Message deleted", description: "Message has been removed" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
        }
    };

    const handleReply = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSubjectLabel = (subject) => {
        const option = subjectOptions.find(opt => opt.value === subject);
        return option ? option.label : subject;
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-white/50 mx-auto mb-4 animate-spin" />
                <p className="text-white/70">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Message Management</h2>
                    <p className="text-white/70">Manage and respond to contact form messages</p>
                </div>
                <Button onClick={fetchMessages} className="btn-secondary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="glass-effect rounded-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                            <Input
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            {subjectOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-green-900 text-white">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
                {filteredMessages.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <p className="text-white/70">No messages found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                                {getSubjectLabel(message.subject)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-yellow-400" />
                                                <span className="text-white/70">{message.email}</span>
                                            </div>
                                            {message.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-white/70">{message.phone}</span>
                                                </div>
                                            )}
                                            {message.company && (
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-white/70">{message.company}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-yellow-400" />
                                                <span className="text-white/70">{formatDate(message.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-3 rounded-lg">
                                            <p className="text-white/80 text-sm">{truncateText(message.message)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                setShowDetails(true);
                                            }}
                                            className="btn-secondary"
                                            size="sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            onClick={() => handleReply(message.email)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            size="sm"
                                        >
                                            <Reply className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            onClick={() => handleDelete(message.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            size="sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Details Modal */}
            {showDetails && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">Message Details</h3>
                            <Button
                                onClick={() => setShowDetails(false)}
                                className="bg-white/10 hover:bg-white/20 text-white"
                                size="sm"
                            >
                                ×
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-semibold mb-2">From</h4>
                                <p className="text-white">{selectedMessage.name}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-white font-semibold mb-2">Email</h4>
                                    <p className="text-white">{selectedMessage.email}</p>
                                </div>
                                {selectedMessage.phone && (
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">Phone</h4>
                                        <p className="text-white">{selectedMessage.phone}</p>
                                    </div>
                                )}
                            </div>

                            {selectedMessage.company && (
                                <div>
                                    <h4 className="text-white font-semibold mb-2">Company</h4>
                                    <p className="text-white">{selectedMessage.company}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-white font-semibold mb-2">Subject</h4>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                    {getSubjectLabel(selectedMessage.subject)}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-2">Message</h4>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-white/80 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-2">Received</h4>
                                <p className="text-white">{formatDate(selectedMessage.created_at)}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={() => handleReply(selectedMessage.email)}
                                className="btn-primary flex-1"
                            >
                                <Reply className="w-4 h-4 mr-2" />
                                Reply
                            </Button>
                            <Button
                                onClick={() => setShowDetails(false)}
                                className="btn-secondary flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages; 