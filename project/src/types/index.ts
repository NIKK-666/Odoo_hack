export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  isPublic: boolean;
  availability: string[];
  rating: number;
  totalSwaps: number;
  joinedDate: string;
  isAdmin?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

export interface UserSkill extends Skill {
  userId: string;
  type: 'offered' | 'wanted';
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSwaps: number;
  activeSwaps: number;
  averageRating: number;
  topSkills: { skill: string; count: number }[];
}