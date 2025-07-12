import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Star, Edit, Plus, Trash2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ref, onValue, query, orderByChild, equalTo, remove } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Skill } from '../types';
import toast from 'react-hot-toast';

export const UserProfile: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'offered' | 'wanted'>('offered');

  useEffect(() => {
    if (!currentUser) return;

    const skillsRef = ref(database, 'skills');
    const userSkillsQuery = query(skillsRef, orderByChild('userId'), equalTo(currentUser.uid));
    
    const unsubscribe = onValue(userSkillsQuery, (snapshot) => {
      const skills: Skill[] = [];
      snapshot.forEach((child) => {
        skills.push({ id: child.key, ...child.val() } as Skill);
      });
      setUserSkills(skills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await remove(ref(database, `skills/${skillId}`));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header - Following Mockup Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {(userProfile?.displayName || currentUser?.displayName || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {userProfile?.displayName || currentUser?.displayName || 'User'}
              </h1>
              <p className="text-gray-600 mb-4">{userProfile?.bio || 'No bio available'}</p>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{userProfile?.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {new Date(userProfile?.joinedAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span>{userProfile?.rating || 0} ({userProfile?.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Skills Section - Following Mockup Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('offered')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'offered'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills Offered ({userSkills.length})
            </button>
            <button
              onClick={() => setActiveTab('wanted')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'wanted'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills Wanted (0)
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'offered' ? 'My Skills' : 'Skills I Want to Learn'}
              </h2>
              <Link
                to="/post-skill"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </Link>
            </div>

            {activeTab === 'offered' && userSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{skill.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{skill.category}</span>
                      <span>{skill.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        skill.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {skill.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {skill.tags && skill.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {skill.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {activeTab === 'offered' ? 'No skills posted yet' : 'No skills wanted yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'offered' 
                    ? 'Share your expertise with the community'
                    : 'Add skills you want to learn'
                  }
                </p>
                <Link
                  to="/post-skill"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>
                    {activeTab === 'offered' ? 'Post Your First Skill' : 'Add Wanted Skill'}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Rating and Feedback Section - Following Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating and Feedback</h2>
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Complete your first skill swap to receive reviews</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};