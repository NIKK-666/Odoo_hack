interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  senderName: string;
  receiverName: string;
}

interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

class SwapService {
  private swapRequests: SwapRequest[] = [
    {
      id: '1',
      senderId: '2',
      receiverId: '1',
      skillOffered: 'React Development',
      skillWanted: 'Project Management',
      message: 'Hi! I would love to learn project management skills from you in exchange for React development help.',
      status: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      senderName: 'John Doe',
      receiverName: 'Admin User'
    }
  ];

  private feedback: Feedback[] = [];

  async createSwapRequest(data: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) {
    const newRequest: SwapRequest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.swapRequests.push(newRequest);
    return newRequest;
  }

  async getSwapRequests(userId: string) {
    return this.swapRequests.filter(req => 
      req.senderId === userId || req.receiverId === userId
    );
  }

  async updateSwapStatus(requestId: string, status: SwapRequest['status']) {
    const requestIndex = this.swapRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
      this.swapRequests[requestIndex].status = status;
      return this.swapRequests[requestIndex];
    }
    throw new Error('Swap request not found');
  }

  async deleteSwapRequest(requestId: string) {
    const requestIndex = this.swapRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
      this.swapRequests.splice(requestIndex, 1);
      return true;
    }
    return false;
  }

  async submitFeedback(data: Omit<Feedback, 'id' | 'createdAt'>) {
    const newFeedback: Feedback = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    this.feedback.push(newFeedback);
    return newFeedback;
  }

  async getFeedback(userId: string) {
    return this.feedback.filter(fb => fb.toUserId === userId);
  }

  async getAllSwaps() {
    return this.swapRequests;
  }
}

export const swapService = new SwapService();