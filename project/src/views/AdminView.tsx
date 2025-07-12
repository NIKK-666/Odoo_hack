import React from 'react';
import { AdminDashboard } from '../components/Admin/AdminDashboard';
import { AdminStats } from '../types';

const mockAdminStats: AdminStats = {
  totalUsers: 156,
  totalSwaps: 89,
  activeSwaps: 23,
  averageRating: 4.7,
  topSkills: [
    { skill: 'React Development', count: 15 },
    { skill: 'Spanish Language', count: 12 },
    { skill: 'Digital Photography', count: 10 },
    { skill: 'Guitar Playing', count: 9 },
    { skill: 'Python Programming', count: 8 },
    { skill: 'Yoga Instruction', count: 7 }
  ]
};

export const AdminView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <AdminDashboard stats={mockAdminStats} />
    </div>
  );
};