import React from 'react';
import { Search, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        <Button onClick={() => onUserAction('export', 'all')} className="btn-secondary">
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
                  <p className="text-white/50 text-xs">Joined: {user.joinDate} • Role: {user.role}</p>
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
                <Button onClick={() => onUserAction('view', user.id)} className="btn-secondary text-xs px-2 py-1">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button onClick={() => onUserAction('edit', user.id)} className="btn-secondary text-xs px-2 py-1">
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
    </div>
  );
};

export default AdminUsers;