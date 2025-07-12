import React, { useState } from 'react';
import { Plus, BookOpen, Target, Edit, Trash2 } from 'lucide-react';
import { SkillCard } from '../components/Skills/SkillCard';
import { SkillForm } from '../components/Skills/SkillForm';
import { UserSkill, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MySkillsViewProps {
  user: User;
}

export const MySkillsView: React.FC<MySkillsViewProps> = ({ user }) => {
  const [userSkills, setUserSkills] = useLocalStorage<UserSkill[]>('userSkills', []);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'offered' | 'wanted'>('offered');
  const [activeTab, setActiveTab] = useState<'offered' | 'wanted'>('offered');

  const handleAddSkill = (skillData: Omit<UserSkill, 'id' | 'userId'>) => {
    const newSkill: UserSkill = {
      ...skillData,
      id: Date.now().toString(),
      userId: user.id
    };
    setUserSkills([...userSkills, newSkill]);
    setShowForm(false);
  };

  const handleDeleteSkill = (skillId: string) => {
    setUserSkills(userSkills.filter(skill => skill.id !== skillId));
  };

  const offeredSkills = userSkills.filter(skill => skill.type === 'offered');
  const wantedSkills = userSkills.filter(skill => skill.type === 'wanted');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Skills</h1>
            <p className="text-gray-600">Manage the skills you offer and want to learn</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setFormType('offered');
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill Offered</span>
            </button>
            <button
              onClick={() => {
                setFormType('wanted');
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill Wanted</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('offered')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'offered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Skills I Offer ({offeredSkills.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wanted')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'wanted'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Skills I Want ({wantedSkills.length})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'offered' && offeredSkills.map(skill => (
          <div key={skill.id} className="relative group">
            <SkillCard
              skill={skill}
              user={user}
              showContactButton={false}
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'wanted' && wantedSkills.map(skill => (
          <div key={skill.id} className="relative group">
            <SkillCard
              skill={skill}
              user={user}
              showContactButton={false}
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'offered' && offeredSkills.length === 0) || 
        (activeTab === 'wanted' && wantedSkills.length === 0)) && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'offered' ? (
                <BookOpen className="w-12 h-12 text-gray-400" />
              ) : (
                <Target className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'offered' ? 'skills offered' : 'skills wanted'} yet
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'offered' 
                ? 'Add skills you can teach to start connecting with learners.'
                : 'Add skills you want to learn to find potential teachers.'
              }
            </p>
            <button
              onClick={() => {
                setFormType(activeTab);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Add Your First Skill
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <SkillForm
          type={formType}
          onSubmit={handleAddSkill}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};