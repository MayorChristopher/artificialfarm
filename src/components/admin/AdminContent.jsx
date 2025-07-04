import React from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen, 
  Video, 
  FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminContent = ({ 
  searchTerm, 
  setSearchTerm, 
  content, 
  onContentAction 
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
          />
        </div>
        <Button onClick={() => onContentAction('create', 'new')} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      <div className="space-y-3">
        {content.map((item) => (
          <div key={item.id} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-green-500/20 rounded-full flex items-center justify-center">
                  {item.type === 'course' && <BookOpen className="w-5 h-5 text-yellow-400" />}
                  {item.type === 'video' && <Video className="w-5 h-5 text-blue-400" />}
                  {item.type === 'story' && <FileText className="w-5 h-5 text-green-400" />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-white/60 text-sm">by {item.author}</p>
                  <p className="text-white/50 text-xs">{item.date} • {item.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'published' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.status}
                </span>
                <Button onClick={() => onContentAction('view', item.id)} className="btn-secondary text-xs px-2 py-1">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button onClick={() => onContentAction('edit', item.id)} className="btn-secondary text-xs px-2 py-1">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button onClick={() => onContentAction('delete', item.id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-2 py-1 rounded">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;