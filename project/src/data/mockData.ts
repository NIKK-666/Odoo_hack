import { User, UserSkill, SwapRequest, Rating } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublic: true,
    availability: ['Weekends', 'Evenings'],
    rating: 4.8,
    totalSwaps: 12,
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublic: true,
    availability: ['Flexible', 'Weekends'],
    rating: 4.6,
    totalSwaps: 8,
    joinedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublic: true,
    availability: ['Evenings', 'Weekdays'],
    rating: 4.9,
    totalSwaps: 15,
    joinedDate: '2023-11-10',
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@skillswap.com',
    isPublic: false,
    availability: [],
    rating: 0,
    totalSwaps: 0,
    joinedDate: '2023-01-01',
    isAdmin: true,
  }
];

export const mockSkills: UserSkill[] = [
  {
    id: 's1',
    userId: '1',
    name: 'React Development',
    category: 'Programming',
    level: 'Expert',
    description: 'Full-stack React development with TypeScript and modern tooling',
    type: 'offered'
  },
  {
    id: 's2',
    userId: '1',
    name: 'Spanish Language',
    category: 'Languages',
    level: 'Beginner',
    description: 'Looking to learn conversational Spanish for travel',
    type: 'wanted'
  },
  {
    id: 's3',
    userId: '2',
    name: 'Guitar Playing',
    category: 'Music',
    level: 'Intermediate',
    description: 'Acoustic and electric guitar, blues and rock styles',
    type: 'offered'
  },
  {
    id: 's4',
    userId: '2',
    name: 'Python Programming',
    category: 'Programming',
    level: 'Intermediate',
    description: 'Data science and machine learning with Python',
    type: 'wanted'
  },
  {
    id: 's5',
    userId: '3',
    name: 'Digital Photography',
    category: 'Creative',
    level: 'Advanced',
    description: 'Portrait and landscape photography, photo editing',
    type: 'offered'
  },
  {
    id: 's6',
    userId: '3',
    name: 'Yoga Instruction',
    category: 'Fitness',
    level: 'Expert',
    description: 'Hatha and Vinyasa yoga instruction and practice',
    type: 'offered'
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: 'sr1',
    fromUserId: '2',
    toUserId: '1',
    offeredSkillId: 's3',
    requestedSkillId: 's1',
    status: 'pending',
    message: 'Hi Sarah! I\'d love to learn React from you in exchange for guitar lessons. I have experience with JavaScript and would like to advance my web development skills.',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'sr2',
    fromUserId: '1',
    toUserId: '3',
    offeredSkillId: 's1',
    requestedSkillId: 's5',
    status: 'accepted',
    message: 'Hi Emily! I\'m interested in learning photography and can teach you React development in return.',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  }
];

export const mockRatings: Rating[] = [
  {
    id: 'r1',
    swapRequestId: 'sr2',
    fromUserId: '1',
    toUserId: '3',
    rating: 5,
    feedback: 'Emily was an excellent teacher! Very patient and knowledgeable about photography techniques.',
    createdAt: '2024-01-25T16:00:00Z'
  }
];