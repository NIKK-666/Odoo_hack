import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { authService } from '../services/authService';
import { swapService } from '../services/swapService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import { toast } from '../components/UI/Toaster';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageSquare, 
  User,
  Calendar,
  Globe,
  Filter
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
  totalSwaps: number;
  isPublic: boolean;
}

export default function Browse() {
  const { user } = useAuth();
  const { addNotification } = useApp();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, locationFilter]);

  const loadUsers = async () => {
    try {
      const allUsers = await authService.getAllUsers();
      const publicUsers = allUsers.filter(u => u.isPublic && u.id !== user?.id);
      setUsers(publicUsers);
    } catch (error) {
      toast.error('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(u =>
        u.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRequestSwap = (targetUser: UserProfile) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
    setRequestData({
      skillOffered: '',
      skillWanted: '',
      message: ''
    });
  };

  const submitSwapRequest = async () => {
    if (!selectedUser || !user) return;

    if (!requestData.skillOffered || !requestData.skillWanted) {
      toast.error('Error', 'Please select skills for the swap');
      return;
    }

    try {
      await swapService.createSwapRequest({
        senderId: user.id,
        receiverId: selectedUser.id,
        senderName: user.name,
        receiverName: selectedUser.name,
        skillOffered: requestData.skillOffered,
        skillWanted: requestData.skillWanted,
        message: requestData.message
      });

      addNotification({
        type: 'swap_request',
        title: 'Swap Request Sent',
        message: `Your swap request has been sent to ${selectedUser.name}`,
        read: false
      });

      toast.success('Request sent', `Your swap request has been sent to ${selectedUser.name}`);
      setShowRequestModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Error', 'Failed to send swap request');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
        <p className="text-gray-600">Discover talented individuals and request skill swaps</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Found {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>Showing public profiles only</span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || locationFilter 
                ? 'Try adjusting your search criteria' 
                : 'No public profiles available at the moment'
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((profile) => (
            <Card key={profile.id} hover>
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    {profile.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                  <Globe className="w-4 h-4 text-green-500" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{profile.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{profile.totalSwaps} swaps</span>
                  </div>
                </div>

                {/* Skills Offered */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Offers</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsOffered.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="info" size="sm">{skill}</Badge>
                    ))}
                    {profile.skillsOffered.length > 3 && (
                      <Badge variant="default" size="sm">+{profile.skillsOffered.length - 3}</Badge>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Wants</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsWanted.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="warning" size="sm">{skill}</Badge>
                    ))}
                    {profile.skillsWanted.length > 3 && (
                      <Badge variant="default" size="sm">+{profile.skillsWanted.length - 3}</Badge>
                    )}
                  </div>
                </div>

                {/* Availability */}
                {profile.availability.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Available</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.availability[0]}</span>
                      {profile.availability.length > 1 && (
                        <span className="text-gray-400">+{profile.availability.length - 1}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => handleRequestSwap(profile)}
                  className="w-full"
                  size="sm"
                >
                  Request Swap
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Swap Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Request Swap with {selectedUser.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I can offer:
                </label>
                <select
                  value={requestData.skillOffered}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillOffered: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a skill you offer</option>
                  {user?.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to learn:
                </label>
                <select
                  value={requestData.skillWanted}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillWanted: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a skill they offer</option>
                  {selectedUser.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional):
                </label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Introduce yourself and explain what you're looking for..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={submitSwapRequest} className="flex-1">
                  Send Request
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowRequestModal(false)}
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