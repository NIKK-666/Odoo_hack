import React, { useState } from 'react';
import { Users, TrendingUp, Star, Activity, Download, MessageSquare, Shield, Ban } from 'lucide-react';
import { AdminStats } from '../../types';

interface AdminDashboardProps {
  stats: AdminStats;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'swaps', label: 'Swap Monitoring', icon: Activity },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Platform management and analytics</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-5 h-5" />
            <span>Administrator Access</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-2xl font-semibold text-blue-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Total Swaps</p>
                    <p className="text-2xl font-semibold text-green-900">{stats.totalSwaps}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Active Swaps</p>
                    <p className="text-2xl font-semibold text-purple-900">{stats.activeSwaps}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Avg Rating</p>
                    <p className="text-2xl font-semibold text-yellow-900">{stats.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topSkills.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between bg-white p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <span className="text-sm text-gray-500 ml-2">#{index + 1}</span>
                    </div>
                    <span className="text-blue-600 font-semibold">{skill.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <div className="flex space-x-3">
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2">
                  <Ban className="w-4 h-4" />
                  <span>Ban User</span>
                </button>
                <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">User management features would be implemented here.</p>
              <p className="text-sm text-gray-500 mt-1">This would include user search, moderation tools, and ban/unban functionality.</p>
            </div>
          </div>
        )}

        {/* Swap Monitoring Tab */}
        {activeTab === 'swaps' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Swap Monitoring</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">Swap monitoring and moderation tools would be implemented here.</p>
              <p className="text-sm text-gray-500 mt-1">This would include reviewing pending swaps, handling disputes, and monitoring feedback.</p>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">User Activity Report</h4>
                <p className="text-sm text-gray-600">Export user registration and activity data</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Swap Statistics</h4>
                <p className="text-sm text-gray-600">Download comprehensive swap analytics</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Feedback Logs</h4>
                <p className="text-sm text-gray-600">Export all user feedback and ratings</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};