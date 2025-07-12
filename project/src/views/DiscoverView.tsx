import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { SkillCard } from '../components/Skills/SkillCard';
import { SwapRequestForm } from '../components/Swaps/SwapRequestForm';
import { mockUsers, mockSkills } from '../data/mockData';
import { UserSkill, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DiscoverViewProps {
  currentUser: User;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSkills] = useLocalStorage<UserSkill[]>('userSkills', []);

  const categories = ['Programming', 'Languages', 'Music', 'Creative', 'Fitness', 'Business'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Get public users (exclude current user)
  const publicUsers = mockUsers.filter(user => 
    user.isPublic && user.id !== currentUser.id
  );

  // Get skills from public users
  const availableSkills = mockSkills.filter(skill => 
    skill.type === 'offered' && 
    publicUsers.some(user => user.id === skill.userId)
  );

  const filteredSkills = useMemo(() => {
    return availableSkills.filter(skill => {
      const user = publicUsers.find(u => u.id === skill.userId);
      if (!user) return false;

      const matchesSearch = searchTerm === '' || 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || skill.category === selectedCategory;
      const matchesLevel = selectedLevel === '' || skill.level === selectedLevel;
      const matchesLocation = locationFilter === '' || 
        (user.location && user.location.toLowerCase().includes(locationFilter.toLowerCase()));

      return matchesSearch && matchesCategory && matchesLevel && matchesLocation;
    });
  }, [availableSkills, publicUsers, searchTerm, selectedCategory, selectedLevel, locationFilter]);

  const handleContact = (skill: UserSkill, user: User) => {
    setSelectedSkill(skill);
    setSelectedUser(user);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = (data: any) => {
    // In a real app, this would make an API call
    console.log('Swap request submitted:', data);
    setShowRequestForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Skills</h1>
          <p className="text-gray-600">Find people with skills you want to learn</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search skills, keywords, or descriptions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filter by location"
              />
            </div>

            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => {
          const user = publicUsers.find(u => u.id === skill.userId);
          if (!user) return null;

          return (
            <SkillCard
              key={skill.id}
              skill={skill}
              user={user}
              onContact={handleContact}
              showContactButton={true}
            />
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more results.
            </p>
          </div>
        </div>
      )}

      <SwapRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        targetSkill={selectedSkill}
        targetUser={selectedUser}
        userSkills={userSkills}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
};