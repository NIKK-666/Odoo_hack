import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import { Skill } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { ref, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import toast from 'react-hot-toast';

interface SkillCardProps {
  skill: Skill;
  showActions?: boolean;
  onSwapRequest?: (skill: Skill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, showActions = false, onSwapRequest }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const isOwner = currentUser?.uid === skill.userId;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    setLoading(true);
    try {
      await remove(ref(database, `skills/${skill.id}`));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setLoading(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{skill.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{skill.location}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{skill.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {skill.userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{skill.userName}</p>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500 ml-1">4.8</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showActions && isOwner ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit skill"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            !isOwner && onSwapRequest && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSwapRequest(skill)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Request Swap</span>
              </motion.button>
            )
          )}
        </div>
      </div>

      {skill.tags && skill.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skill.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};