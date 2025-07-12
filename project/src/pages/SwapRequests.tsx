import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { swapService } from '../services/swapService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { toast } from '../components/UI/Toaster';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  Trash2,
  User,
  ArrowRightLeft
} from 'lucide-react';

interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  senderName: string;
  receiverName: string;
}

export default function SwapRequests() {
  const { user } = useAuth();
  const { swapRequests, setSwapRequests, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    if (!user) return;
    
    try {
      const requests = await swapService.getSwapRequests(user.id);
      setSwapRequests(requests);
    } catch (error) {
      toast.error('Error', 'Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const receivedRequests = swapRequests.filter(req => req.receiverId === user?.id);
  const sentRequests = swapRequests.filter(req => req.senderId === user?.id);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await swapService.updateSwapStatus(requestId, 'accepted');
      await loadSwapRequests();
      
      const request = swapRequests.find(req => req.id === requestId);
      if (request) {
        addNotification({
          type: 'swap_accepted',
          title: 'Swap Request Accepted',
          message: `You accepted a swap request from ${request.senderName}`,
          read: false
        });
      }
      
      toast.success('Request accepted', 'The swap request has been accepted');
    } catch (error) {
      toast.error('Error', 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await swapService.updateSwapStatus(requestId, 'rejected');
      await loadSwapRequests();
      
      const request = swapRequests.find(req => req.id === requestId);
      if (request) {
        addNotification({
          type: 'swap_rejected',
          title: 'Swap Request Rejected',
          message: `You rejected a swap request from ${request.senderName}`,
          read: false
        });
      }
      
      toast.success('Request rejected', 'The swap request has been rejected');
    } catch (error) {
      toast.error('Error', 'Failed to reject request');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await swapService.deleteSwapRequest(requestId);
      await loadSwapRequests();
      toast.success('Request deleted', 'The swap request has been deleted');
    } catch (error) {
      toast.error('Error', 'Failed to delete request');
    }
  };

  const handleMarkCompleted = async (request: SwapRequest) => {
    setSelectedSwap(request);
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    if (!selectedSwap || !user) return;

    try {
      // Submit feedback
      await swapService.submitFeedback({
        swapId: selectedSwap.id,
        fromUserId: user.id,
        toUserId: selectedSwap.senderId === user.id ? selectedSwap.receiverId : selectedSwap.senderId,
        rating: feedbackData.rating,
        comment: feedbackData.comment
      });

      // Mark swap as completed
      await swapService.updateSwapStatus(selectedSwap.id, 'completed');
      await loadSwapRequests();

      addNotification({
        type: 'swap_completed',
        title: 'Swap Completed',
        message: `You've completed a swap with ${selectedSwap.senderId === user.id ? selectedSwap.receiverName : selectedSwap.senderName}`,
        read: false
      });

      toast.success('Feedback submitted', 'Thank you for your feedback!');
      setShowFeedbackModal(false);
      setSelectedSwap(null);
      setFeedbackData({ rating: 5, comment: '' });
    } catch (error) {
      toast.error('Error', 'Failed to submit feedback');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <Star className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your incoming and outgoing skill swap requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Request Lists */}
      <div className="space-y-6">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
                  <p className="text-gray-600">When others request swaps with you, they'll appear here</p>
                </div>
              </Card>
            ) : (
              receivedRequests.map((request) => (
                <Card key={request.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.senderName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(request.status) as any}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="info">{request.skillOffered}</Badge>
                        <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        <Badge variant="warning">{request.skillWanted}</Badge>
                      </div>

                      {request.message && (
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                          "{request.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === 'accepted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkCompleted(request)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                  <p className="text-gray-600">Browse skills to send your first swap request</p>
                </div>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <Card key={request.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.receiverName}</h3>
                          <p className="text-sm text-gray-600">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(request.status) as any}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="info">{request.skillOffered}</Badge>
                        <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        <Badge variant="warning">{request.skillWanted}</Badge>
                      </div>

                      {request.message && (
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                          "{request.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {request.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {request.status === 'accepted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkCompleted(request)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Complete Swap & Leave Feedback
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How was your experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackData(prev => ({ ...prev, rating }))}
                      className={`p-1 ${
                        rating <= feedbackData.rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional):
                </label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this skill swap..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={submitFeedback} className="flex-1">
                  Submit & Complete
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}