import React from 'react';
import { ProfileForm } from '../components/Profile/ProfileForm';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <ProfileForm user={user} onSave={onUpdateUser} />
    </div>
  );
};