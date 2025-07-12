import React from 'react';
import { Star, MapPin, Clock, MessageCircle } from 'lucide-react';
import { UserSkill, User } from '../../types';

interface SkillCardProps {
  skill: UserSkill;
  user: User;
  onContact?: (skill: UserSkill, user: User) => void;
  showContactButton?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  user,
  onContact,
  showContactButton = true
}) => {
  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-orange-100 text-orange-700',
    Expert: 'bg-red-100 text-red-700'
  };

  const categoryColors = {
    Programming: 'bg-blue-100 text-blue-700',
    Languages: 'bg-purple-100 text-purple-700',
    Music: 'bg-pink-100 text-pink-700',
    Creative: 'bg-indigo-100 text-indigo-700',
    Fitness: 'bg-green-100 text-green-700',
    Business: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{skill.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[skill.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}>
              {skill.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[skill.level]}`}>
              {skill.level}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={user.profilePhoto || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`}
              alt={user.name}
            />
            <span className="font-medium text-gray-700">{user.name}</span>
          </div>
          {user.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{user.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {showContactButton && onContact && (
          <button
            onClick={() => onContact(skill, user)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center space-x-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect</span>
          </button>
        )}
      </div>

      {user.availability.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Available: {user.availability.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};