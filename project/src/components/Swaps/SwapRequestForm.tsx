import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { UserSkill, User } from '../../types';

interface SwapRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  targetSkill: UserSkill | null;
  targetUser: User | null;
  userSkills: UserSkill[];
  onSubmit: (data: {
    offeredSkillId: string;
    requestedSkillId: string;
    message: string;
    toUserId: string;
  }) => void;
}

export const SwapRequestForm: React.FC<SwapRequestFormProps> = ({
  isOpen,
  onClose,
  targetSkill,
  targetUser,
  userSkills,
  onSubmit
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !targetSkill || !targetUser) return null;

  const offeredSkills = userSkills.filter(skill => skill.type === 'offered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId || !message.trim()) return;

    onSubmit({
      offeredSkillId: selectedSkillId,
      requestedSkillId: targetSkill.id,
      message: message.trim(),
      toUserId: targetUser.id
    });

    onClose();
    setSelectedSkillId('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Request Skill Swap</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-purple-900 mb-1">You want to learn:</h4>
            <p className="text-purple-700 font-semibold">{targetSkill.name}</p>
            <p className="text-purple-600 text-sm">{targetSkill.category} • {targetSkill.level}</p>
            <p className="text-purple-600 text-sm mt-1">from {targetUser.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What skill would you like to offer in return?
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a skill to offer</option>
              {offeredSkills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.category} • {skill.level})
                </option>
              ))}
            </select>
            {offeredSkills.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                You need to add some offered skills first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to {targetUser.name}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Introduce yourself and explain why you'd like to learn this skill..."
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={!selectedSkillId || !message.trim() || offeredSkills.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};