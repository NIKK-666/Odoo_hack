import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Clock, Check, X, MessageCircle, User } from 'lucide-react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { SwapRequest } from '../types';
import toast from 'react-hot-toast';

export const SwapRequests: React.FC = () => {
  const { currentUser } = useAuth();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    if (!currentUser) return;

    const swapsRef = ref(database, 'swaps');
    const unsubscribe = onValue(swapsRef, (snapshot) => {
      const requests: SwapRequest[] = [];
      snapshot.forEach((child) => {
        const swap = { id: child.key, ...child.val() } as SwapRequest;
        if (swap.fromUserId === currentUser.uid || swap.toUserId === currentUser.uid) {
          requests.push(swap);
        }
      });
      setSwapRequests(requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      await update(ref(database, `swaps/${requestId}`), {
        status,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const receivedRequests = swapRequests.filter(req => req.toUserId === currentUser?.uid);
  const sentRequests = swapRequests.filter(req => req.fromUserId === currentUser?.uid);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Rejected';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your skill exchange requests</p>
        </div>

        {/* Tabs - Following Mockup Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'received'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Swap Requests ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent Requests ({sentRequests.length})
            </button>
          </div>
        </div>

        {/* Requests List - Following Mockup Card Layout */}
        <div className="space-y-4">
          {(activeTab === 'received' ? receivedRequests : sentRequests).map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {(activeTab === 'received' ? request.fromUserName : request.toUserName).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeTab === 'received' ? request.fromUserName : request.toUserName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-1">
                    {activeTab === 'received' ? 'They Offer' : 'You Offer'}
                  </h4>
                  <p className="text-blue-800">{request.offeredSkillTitle}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-1">
                    {activeTab === 'received' ? 'They Want' : 'You Want'}
                  </h4>
                  <p className="text-green-800">{request.requestedSkillTitle}</p>
                </div>
              </div>

              {request.message && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700">{request.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {request.status === 'accepted' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  )}
                </div>

                {activeTab === 'received' && request.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(request.id, 'declined')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(request.id, 'accepted')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {(activeTab === 'received' ? receivedRequests : sentRequests).length === 0 && (
            <div className="text-center py-12">
              <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No {activeTab} requests
              </h3>
              <p className="text-gray-600">
                {activeTab === 'received' 
                  ? 'You haven\'t received any swap requests yet'
                  : 'You haven\'t sent any swap requests yet'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Following Mockup */}
        {(activeTab === 'received' ? receivedRequests : sentRequests).length > 6 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                &lt;
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};