import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { Skill } from '../types';
import { SkillCard } from '../components/Skills/SkillCard';
import { SwapRequestModal } from '../components/Swaps/SwapRequestModal';
import { useAuth } from '../contexts/AuthContext';

export const BrowseSkills: React.FC = () => {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const categories = ['Programming', 'Design', 'Music', 'Languages', 'Cooking', 'Sports', 'Art', 'Business'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    const skillsRef = ref(database, 'skills');
    const unsubscribe = onValue(skillsRef, (snapshot) => {
      const skillsList: Skill[] = [];
      snapshot.forEach((child) => {
        const skill = { id: child.key, ...child.val() } as Skill;
        if (skill.isActive && skill.userId !== currentUser?.uid) {
          skillsList.push(skill);
        }
      });
      setSkills(skillsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    let filtered = skills;

    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    if (selectedLevel) {
      filtered = filtered.filter(skill => skill.level === selectedLevel);
    }

    setFilteredSkills(filtered);
  }, [skills, searchTerm, selectedCategory, selectedLevel]);

  const handleSwapRequest = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowSwapModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Discover amazing skills to learn and exchange</p>
        </div>

        {/* Search and Filters - Following Mockup Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skills, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Skills Grid - Following Mockup Card Layout */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SkillCard
                  skill={skill}
                  onSwapRequest={handleSwapRequest}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available skills
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLevel('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </motion.button>
          </div>
        )}

        {/* Pagination - Following Mockup */}
        {filteredSkills.length > 9 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                &lt;
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">7</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Swap Request Modal */}
        {selectedSkill && (
          <SwapRequestModal
            isOpen={showSwapModal}
            onClose={() => {
              setShowSwapModal(false);
              setSelectedSkill(null);
            }}
            requestedSkill={selectedSkill}
          />
        )}
      </div>
    </div>
  );
};