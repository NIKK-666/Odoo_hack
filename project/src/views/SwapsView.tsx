import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { SwapRequestCard } from '../components/Swaps/SwapRequestCard';
import { mockSwapRequests, mockUsers, mockSkills } from '../data/mockData';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SwapsViewProps {
  user: User;
}

export const SwapsView: React.FC<SwapsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'history'>('incoming');
  const [swapRequests, setSwapRequests] = useLocalStorage('swapRequests', mockSwapRequests);

  const handleAcceptRequest = (requestId: string) => {
    setSwapRequests(swapRequests.map(request =>
      request.id === requestId
        ? { ...request, status: 'accepted' as const, updatedAt: new Date().toISOString() }
        : request
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setSwapRequests(swapRequests.map(request =>
      request.id === requestId
        ? { ...request, status: 'rejected' as const, updatedAt: new Date().toISOString() }
        : request
    ));
  };

  const handleCancelRequest = (requestId: string) => {
    setSwapRequests(swapRequests.map(request =>
      request.id === requestId
        ? { ...request, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
        : request
    ));
  };

  const handleRateRequest = (requestId: string) => {
    // In a real app, this would open a rating modal
    console.log('Rate request:', requestId);
  };

  const incomingRequests = swapRequests.filter(request => 
    request.toUserId === user.id && request.status === 'pending'
  );

  const outgoingRequests = swapRequests.filter(request => 
    request.fromUserId === user.id && ['pending', 'accepted'].includes(request.status)
  );

  const historyRequests = swapRequests.filter(request => 
    (request.fromUserId === user.id || request.toUserId === user.id) && 
    ['completed', 'rejected', 'cancelled'].includes(request.status)
  );

  const tabs = [
    { id: 'incoming', label: 'Incoming', icon: Clock, count: incomingRequests.length },
    { id: 'outgoing', label: 'Outgoing', icon: Calendar, count: outgoingRequests.length },
    { id: 'history', label: 'History', icon: CheckCircle, count: historyRequests.length }
  ];

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'incoming': return incomingRequests;
      case 'outgoing': return outgoingRequests;
      case 'history': return historyRequests;
      default: return [];
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Swaps</h1>
          <p className="text-gray-600">Manage your skill exchange requests and connections</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Swap Requests */}
      <div className="space-y-4">
        {getCurrentRequests().map(request => {
          const fromUser = mockUsers.find(u => u.id === request.fromUserId);
          const toUser = mockUsers.find(u => u.id === request.toUserId);
          const offeredSkill = mockSkills.find(s => s.id === request.offeredSkillId);
          const requestedSkill = mockSkills.find(s => s.id === request.requestedSkillId);

          if (!fromUser || !toUser || !offeredSkill || !requestedSkill) return null;

          const isOutgoing = request.fromUserId === user.id;

          return (
            <SwapRequestCard
              key={request.id}
              request={request}
              fromUser={fromUser}
              toUser={toUser}
              offeredSkill={offeredSkill}
              requestedSkill={requestedSkill}
              isOutgoing={isOutgoing}
              onAccept={activeTab === 'incoming' ? handleAcceptRequest : undefined}
              onReject={activeTab === 'incoming' ? handleRejectRequest : undefined}
              onCancel={activeTab === 'outgoing' ? handleCancelRequest : undefined}
              onRate={activeTab === 'history' ? handleRateRequest : undefined}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {getCurrentRequests().length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'incoming' && <Clock className="w-12 h-12 text-gray-400" />}
              {activeTab === 'outgoing' && <Calendar className="w-12 h-12 text-gray-400" />}
              {activeTab === 'history' && <CheckCircle className="w-12 h-12 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'incoming' && 'No incoming requests'}
              {activeTab === 'outgoing' && 'No outgoing requests'}
              {activeTab === 'history' && 'No swap history'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'incoming' && "You don't have any pending swap requests."}
              {activeTab === 'outgoing' && "You haven't sent any swap requests yet."}
              {activeTab === 'history' && "You don't have any completed swaps yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};