// Mock authentication service - In production, replace with Supabase
class AuthService {
  private users: any[] = [
    {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      location: 'New York, NY',
      skillsOffered: ['Project Management', 'Leadership'],
      skillsWanted: ['Graphic Design', 'Marketing'],
      availability: ['Weekends', 'Evenings'],
      isPublic: true,
      role: 'admin',
      rating: 4.8,
      totalSwaps: 15,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'user@example.com',
      password: 'user123',
      name: 'John Doe',
      location: 'San Francisco, CA',
      skillsOffered: ['React', 'JavaScript', 'TypeScript'],
      skillsWanted: ['Design', 'Photography'],
      availability: ['Weekends'],
      isPublic: true,
      role: 'user',
      rating: 4.5,
      totalSwaps: 8,
      createdAt: '2024-01-15T00:00:00Z'
    }
  ];

  async login(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  async register(userData: any) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    if (this.users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      role: 'user',
      rating: 0,
      totalSwaps: 0,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  async getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  async logout() {
    localStorage.removeItem('currentUser');
  }

  async updateProfile(userId: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...data };
      const { password: _, ...userWithoutPassword } = this.users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    throw new Error('User not found');
  }

  async getAllUsers() {
    return this.users.map(({ password, ...user }) => user);
  }

  async searchUsers(skill?: string, location?: string) {
    let filtered = this.users.filter(u => u.isPublic);
    
    if (skill) {
      filtered = filtered.filter(u => 
        u.skillsOffered.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    
    if (location) {
      filtered = filtered.filter(u => 
        u.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return filtered.map(({ password, ...user }) => user);
  }
}

export const authService = new AuthService();