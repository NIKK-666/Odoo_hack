import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { swapService } from '../services/swapService';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Star,
  Calendar,
  Globe,
  Lock,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { swapRequests, setSwapRequests } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    if (!user) return;
    
    try {
      const requests = await swapService.getSwapRequests(user.id);
      setSwapRequests(requests);
    } catch (error) {
      console.error('Failed to load swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Swaps',
      value: user?.totalSwaps || 0,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Rating',
      value: user?.rating ? user.rating.toFixed(1) : '0.0',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Pending Requests',
      value: swapRequests.filter(req => req.status === 'pending').length,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  const recentRequests = swapRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your skill swaps today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Overview */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Overview</h2>
            <div className="flex items-center space-x-2">
              {user?.isPublic ? (
                <>
                  <Globe className="w-4 h-4 text-green-600" />
                  <Badge variant="success">Public</Badge>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gray-600" />
                  <Badge variant="default">Private</Badge>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Skills I Offer</h3>
              {user?.skillsOffered.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No skills added yet</p>
                    <p className="text-sm">Add skills to start swapping!</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="info">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Skills I Want</h3>
              {user?.skillsWanted.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No skills requested yet</p>
                    <p className="text-sm">Add skills you want to learn!</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="warning">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
              {user?.availability.length === 0 ? (
                <p className="text-gray-500">No availability set</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.availability.map((time, index) => (
                    <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Swap Requests */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Swap Requests</h2>
          
          {recentRequests.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No swap requests yet</p>
                <p className="text-sm">Browse skills to make your first request!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {request.senderId === user?.id ? request.receiverName : request.senderName}
                      </span>
                    </div>
                    <Badge 
                      variant={
                        request.status === 'accepted' ? 'success' :
                        request.status === 'rejected' ? 'error' :
                        request.status === 'completed' ? 'info' : 'warning'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{request.skillOffered}</span>
                    <span className="mx-2">↔</span>
                    <span className="font-medium">{request.skillWanted}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate">
                    {request.message}
                  </p>
                  
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}