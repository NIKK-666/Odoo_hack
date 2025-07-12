import React, { useState } from 'react';
import { User, MapPin, Camera, Clock, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileFormProps {
  user: UserType;
  onSave: (user: UserType) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location || '',
    profilePhoto: user.profilePhoto || '',
    isPublic: user.isPublic,
    availability: user.availability
  });

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Mornings',
    'Flexible'
  ];

  const handleAvailabilityChange = (option: string) => {
    const newAvailability = formData.availability.includes(option)
      ? formData.availability.filter(a => a !== option)
      : [...formData.availability, option];
    
    setFormData({ ...formData, availability: newAvailability });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserType = {
      ...user,
      ...formData
    };
    onSave(updatedUser);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Update your information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo URL (Optional)
          </label>
          <div className="relative">
            <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              value={formData.profilePhoto}
              onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          {formData.profilePhoto && (
            <div className="mt-2">
              <img
                src={formData.profilePhoto}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Clock className="inline w-5 h-5 mr-2" />
            Availability
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availabilityOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.availability.includes(option)}
                  onChange={() => handleAvailabilityChange(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              {formData.isPublic ? (
                <Eye className="w-5 h-5 text-blue-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Make profile public
              </span>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            {formData.isPublic 
              ? 'Your profile and skills will be visible to other users'
              : 'Your profile will be private and not shown in search results'
            }
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};