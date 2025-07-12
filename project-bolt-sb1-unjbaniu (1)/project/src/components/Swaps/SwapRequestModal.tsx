import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft } from 'lucide-react';
import { ref, onValue, push, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Skill, SwapRequest } from '../../types';
import toast from 'react-hot-toast';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedSkill: Skill;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  requestedSkill
}) => {
  const { currentUser, userProfile } = useAuth();
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const skillsRef = ref(database, 'skills');
    const userSkillsQuery = query(skillsRef, orderByChild('userId'), equalTo(currentUser.uid));
    
    const unsubscribe = onValue(userSkillsQuery, (snapshot) => {
      const skills: Skill[] = [];
      snapshot.forEach((child) => {
        const skill = { id: child.key, ...child.val() } as Skill;
        if (skill.isActive) {
          skills.push(skill);
        }
      });
      setUserSkills(skills);
    });

    return unsubscribe;
  }, [currentUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill) {
      toast.error('Please select a skill to offer');
      return;
    }

    setLoading(true);

    try {
      const offeredSkill = userSkills.find(skill => skill.id === selectedSkill);
      if (!offeredSkill) return;

      const swapRequest: Omit<SwapRequest, 'id'> = {
        fromUserId: currentUser!.uid,
        toUserId: requestedSkill.userId,
        fromUserName: userProfile?.displayName || currentUser!.displayName || 'Unknown User',
        toUserName: requestedSkill.userName,
        offeredSkillId: selectedSkill,
        requestedSkillId: requestedSkill.id,
        offeredSkillTitle: offeredSkill.title,
        requestedSkillTitle: requestedSkill.title,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await push(ref(database, 'swaps'), swapRequest);
      toast.success('Swap request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error sending swap request:', error);
      toast.error('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Request Skill Swap</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Requesting</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{requestedSkill.title}</h3>
                  <p className="text-sm text-gray-600">by {requestedSkill.userName}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a skill to offer
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose one of your skills...</option>
                    {userSkills.map(skill => (
                      <option key={skill.id} value={skill.id}>
                        {skill.title} ({skill.level})
                      </option>
                    ))}
                  </select>
                  {userSkills.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      You need to post at least one skill before requesting swaps.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Introduce yourself and explain why you'd like to make this swap..."
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || userSkills.length === 0}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};