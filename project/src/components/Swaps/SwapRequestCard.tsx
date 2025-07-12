import React from 'react';
import { Check, X, Clock, Star, Calendar, User } from 'lucide-react';
import { SwapRequest, User as UserType, UserSkill } from '../../types';

interface SwapRequestCardProps {
  request: SwapRequest;
  fromUser: UserType;
  toUser: UserType;
  offeredSkill: UserSkill;
  requestedSkill: UserSkill;
  isOutgoing: boolean;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
  onRate?: (requestId: string) => void;
}

export const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  request,
  fromUser,
  toUser,
  offeredSkill,
  requestedSkill,
  isOutgoing,
  onAccept,
  onReject,
  onCancel,
  onRate
}) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-700'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const otherUser = isOutgoing ? toUser : fromUser;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={otherUser.profilePhoto || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100`}
            alt={otherUser.name}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{otherUser.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{otherUser.totalSwaps} swaps</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">
            {isOutgoing ? 'You offer' : 'They offer'}
          </h4>
          <p className="text-blue-700 font-semibold">{offeredSkill.name}</p>
          <p className="text-blue-600 text-sm">{offeredSkill.category} • {offeredSkill.level}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-1">
            {isOutgoing ? 'You want' : 'They want'}
          </h4>
          <p className="text-purple-700 font-semibold">{requestedSkill.name}</p>
          <p className="text-purple-600 text-sm">{requestedSkill.category} • {requestedSkill.level}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">{request.message}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Requested {formatDate(request.createdAt)}</span>
        </div>

        <div className="flex space-x-2">
          {request.status === 'pending' && !isOutgoing && onAccept && onReject && (
            <>
              <button
                onClick={() => onReject(request.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>
              <button
                onClick={() => onAccept(request.id)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
            </>
          )}

          {request.status === 'pending' && isOutgoing && onCancel && (
            <button
              onClick={() => onCancel(request.id)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel Request
            </button>
          )}

          {request.status === 'accepted' && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Swap in progress</span>
            </div>
          )}

          {request.status === 'completed' && onRate && (
            <button
              onClick={() => onRate(request.id)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center space-x-1"
            >
              <Star className="w-4 h-4" />
              <span>Rate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};