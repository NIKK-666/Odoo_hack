import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, X, MessageCircle } from 'lucide-react';
import { SwapRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { ref, update } from 'firebase/database';
import { database } from '../../firebase/config';
import toast from 'react-hot-toast';

interface SwapRequestCardProps {
  request: SwapRequest;
}

export const SwapRequestCard: React.FC<SwapRequestCardProps> = ({ request }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const isReceiver = currentUser?.uid === request.toUserId;
  const isSender = currentUser?.uid === request.fromUserId;

  const handleStatusUpdate = async (status: 'accepted' | 'declined') => {
    setLoading(true);
    try {
      await update(ref(database, `swaps/${request.id}`), {
        status,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Swap ${status} successfully`);
    } catch (error) {
      console.error('Error updating swap status:', error);
      toast.error('Failed to update swap status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">
              {isSender ? `To: ${request.toUserName}` : `From: ${request.fromUserName}`}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Offering:</span> {request.offeredSkillTitle}</p>
            <p><span className="font-medium">Requesting:</span> {request.requestedSkillTitle}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-xs">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {request.message && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700">{request.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {request.status === 'accepted' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Chat</span>
            </motion.button>
          )}
        </div>

        {isReceiver && request.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusUpdate('declined')}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              <span>Decline</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusUpdate('accepted')}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              <span>Accept</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};