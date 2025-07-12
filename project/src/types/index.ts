export interface User {
  uid: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  joinedAt: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  userId: string;
  userName: string;
  userEmail: string;
  location: string;
  duration: string;
  createdAt: string;
  isActive: boolean;
  tags: string[];
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  offeredSkillId: string;
  requestedSkillId: string;
  offeredSkillTitle: string;
  requestedSkillTitle: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  swapId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}