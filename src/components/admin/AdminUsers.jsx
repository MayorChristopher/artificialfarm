import React, { useState } from 'react';
import { Search, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import UserModal from './UserModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminUsers = ({ 
  searchTerm, 
  setSearchTerm, 
  users, 
  onUserAction,
  currentUser
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserView = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Join Date'],
      ...users.map(user => [
        user.name || '',
        user.email || '',
        user.role || '',
        user.status || '',
        user.joinDate || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Export successful", description: `Exported ${users.length} users to CSV` });
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
          />
        </div>
        <Button onClick={handleExportUsers} className="btn-cta">
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="text-white font-medium">{user.name}</h4>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/50">Joined: {user.joinDate}</span>
                    <span className="text-white/30">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'instructor' ? 'bg-blue-500/20 text-blue-400' :
                      user.role === 'moderator' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role === 'admin' ? '⚡ Admin' :
                       user.role === 'instructor' ? '👨🏫 Instructor' :
                       user.role === 'moderator' ? '🛡️ Moderator' :
                       '👤 User'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {user.status}
                </span>
                <Button onClick={() => handleUserView(user)} className="btn-info-sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button onClick={() => handleUserEdit(user)} className="btn-primary-sm">
                  <Edit className="w-3 h-3" />
                </Button>
                {currentUser?.id !== user.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-2 py-1 rounded">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user {user.name} ({user.email}) and all of their associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUserAction('delete', user.id)} className="bg-red-600 hover:bg-red-700">
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          onUserAction('refresh');
          setIsModalOpen(false);
        }}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminUsers;