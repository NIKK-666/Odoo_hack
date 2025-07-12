import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { swapService } from '../services/swapService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Input from '../components/UI/Input';
import { toast } from '../components/UI/Toaster';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Download,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Megaphone
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalSwaps: number;
  pendingSwaps: number;
  completedSwaps: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSwaps: 0,
    pendingSwaps: 0,
    completedSwaps: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'messages'>('overview');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [allUsers, allSwaps] = await Promise.all([
        authService.getAllUsers(),
        swapService.getAllSwaps()
      ]);

      setUsers(allUsers);
      setSwaps(allSwaps);

      setStats({
        totalUsers: allUsers.length,
        totalSwaps: allSwaps.length,
        pendingSwaps: allSwaps.filter(s => s.status === 'pending').length,
        completedSwaps: allSwaps.filter(s => s.status === 'completed').length
      });
    } catch (error) {
      toast.error('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcastMessage = () => {
    if (!broadcastMessage.trim()) {
      toast.error('Error', 'Please enter a message');
      return;
    }

    // In a real app, this would send notifications to all users
    toast.success('Message sent', 'Broadcast message has been sent to all users');
    setBroadcastMessage('');
  };

  const downloadReport = (type: 'users' | 'swaps' | 'activity') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          location: u.location,
          skillsOffered: u.skillsOffered.length,
          skillsWanted: u.skillsWanted.length,
          rating: u.rating,
          totalSwaps: u.totalSwaps,
          isPublic: u.isPublic,
          createdAt: u.createdAt
        }));
        filename = 'users-report.json';
        break;
      case 'swaps':
        data = swaps;
        filename = 'swaps-report.json';
        break;
      case 'activity':
        data = {
          stats,
          generated: new Date().toISOString(),
          topSkills: getTopSkills()
        };
        filename = 'activity-report.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Download started', `${filename} is being downloaded`);
  };

  const getTopSkills = () => {
    const skillCounts: { [key: string]: number } = {};
    
    users.forEach(user => {
      user.skillsOffered.forEach((skill: string) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <Ban className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access the admin panel</p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, monitor activity, and oversee platform operations</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'swaps', label: 'Swaps', icon: MessageSquare },
          { id: 'messages', label: 'Messages', icon: Megaphone }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingSwaps}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Skills */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Most Popular Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTopSkills().slice(0, 8).map(({ skill, count }, index) => (
                <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{skill}</span>
                  <Badge variant="info">{count} users</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => downloadReport('users')}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download User Report
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadReport('swaps')}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Swap Report
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadReport('activity')}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Activity Report
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={user.isPublic ? 'success' : 'default'}>
                        {user.isPublic ? 'Public' : 'Private'}
                      </Badge>
                      <Badge variant="info">{user.totalSwaps} swaps</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="danger" size="sm">
                    <Ban className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Swaps Tab */}
      {activeTab === 'swaps' && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Swap Management</h2>
          <div className="space-y-4">
            {swaps.map((swap) => (
              <div key={swap.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{swap.senderName}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">{swap.receiverName}</span>
                  </div>
                  <Badge 
                    variant={
                      swap.status === 'accepted' ? 'success' :
                      swap.status === 'rejected' ? 'error' :
                      swap.status === 'completed' ? 'info' : 'warning'
                    }
                  >
                    {swap.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Badge variant="info" size="sm">{swap.skillOffered}</Badge>
                  <span>↔</span>
                  <Badge variant="warning" size="sm">{swap.skillWanted}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(swap.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Broadcast Messages</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send platform-wide message
              </label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter your message to all users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <div className="mt-4 flex space-x-3">
                <Button onClick={sendBroadcastMessage}>
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="secondary" onClick={() => setBroadcastMessage('')}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">Welcome to SkillSwap! We're excited to have you join our community.</p>
                  <p className="text-xs text-gray-500 mt-2">Sent 2 days ago</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">Platform maintenance scheduled for this weekend. Service may be temporarily unavailable.</p>
                  <p className="text-xs text-gray-500 mt-2">Sent 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}