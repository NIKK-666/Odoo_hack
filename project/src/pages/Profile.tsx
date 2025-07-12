import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import { toast } from '../components/UI/Toaster';
import { 
  User, 
  MapPin, 
  Globe, 
  Lock, 
  Plus, 
  X, 
  Calendar,
  Star,
  TrendingUp
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    isPublic: user?.isPublic || false
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated', 'Your profile has been saved successfully');
    } catch (error) {
      toast.error('Update failed', 'Could not update your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSkillOffered = async () => {
    if (!newSkillOffered.trim()) return;
    
    const updatedSkills = [...(user?.skillsOffered || []), newSkillOffered.trim()];
    try {
      await updateProfile({ skillsOffered: updatedSkills });
      setNewSkillOffered('');
      toast.success('Skill added', 'Your skill has been added to your profile');
    } catch (error) {
      toast.error('Error', 'Could not add skill');
    }
  };

  const removeSkillOffered = async (skillToRemove: string) => {
    const updatedSkills = (user?.skillsOffered || []).filter(skill => skill !== skillToRemove);
    try {
      await updateProfile({ skillsOffered: updatedSkills });
      toast.success('Skill removed', 'The skill has been removed from your profile');
    } catch (error) {
      toast.error('Error', 'Could not remove skill');
    }
  };

  const addSkillWanted = async () => {
    if (!newSkillWanted.trim()) return;
    
    const updatedSkills = [...(user?.skillsWanted || []), newSkillWanted.trim()];
    try {
      await updateProfile({ skillsWanted: updatedSkills });
      setNewSkillWanted('');
      toast.success('Skill added', 'Your skill request has been added');
    } catch (error) {
      toast.error('Error', 'Could not add skill');
    }
  };

  const removeSkillWanted = async (skillToRemove: string) => {
    const updatedSkills = (user?.skillsWanted || []).filter(skill => skill !== skillToRemove);
    try {
      await updateProfile({ skillsWanted: updatedSkills });
      toast.success('Skill removed', 'The skill request has been removed');
    } catch (error) {
      toast.error('Error', 'Could not remove skill');
    }
  };

  const addAvailability = async () => {
    if (!newAvailability.trim()) return;
    
    const updatedAvailability = [...(user?.availability || []), newAvailability.trim()];
    try {
      await updateProfile({ availability: updatedAvailability });
      setNewAvailability('');
      toast.success('Availability added', 'Your availability has been updated');
    } catch (error) {
      toast.error('Error', 'Could not add availability');
    }
  };

  const removeAvailability = async (availabilityToRemove: string) => {
    const updatedAvailability = (user?.availability || []).filter(av => av !== availabilityToRemove);
    try {
      await updateProfile({ availability: updatedAvailability });
      toast.success('Availability removed', 'Your availability has been updated');
    } catch (error) {
      toast.error('Error', 'Could not remove availability');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your skills, availability, and profile settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              <Button
                variant={isEditing ? 'secondary' : 'outline'}
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY"
                  />

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Make my profile public
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleSaveProfile} loading={loading}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.location || 'No location set'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user?.isPublic ? (
                      <>
                        <Globe className="w-4 h-4 text-green-600" />
                        <Badge variant="success">Public Profile</Badge>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-600" />
                        <Badge variant="default">Private Profile</Badge>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Skills Offered */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills I Offer</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill you can teach"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                />
                <Button onClick={addSkillOffered}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {user?.skillsOffered.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkillOffered(skill)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Skills Wanted */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills I Want to Learn</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill you want to learn"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                />
                <Button onClick={addSkillWanted}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {user?.skillsWanted.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkillWanted(skill)}
                      className="hover:text-yellow-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Availability */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Availability</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., Weekends, Evenings, Monday 6-8 PM"
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                />
                <Button onClick={addAvailability}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {user?.availability.map((time, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">{time}</span>
                    </div>
                    <button
                      onClick={() => removeAvailability(time)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700">Rating</span>
                </div>
                <span className="font-semibold">{user?.rating ? user.rating.toFixed(1) : '0.0'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">Total Swaps</span>
                </div>
                <span className="font-semibold">{user?.totalSwaps || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">Member Since</span>
                </div>
                <span className="text-sm text-gray-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Skills
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Update Availability
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}