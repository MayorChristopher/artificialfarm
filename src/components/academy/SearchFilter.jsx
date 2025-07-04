import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) => {
  return (
    <section className="py-8 bg-gradient-to-r from-green-900/20 to-yellow-900/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/70" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:border-yellow-400"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-green-900 text-white">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter;