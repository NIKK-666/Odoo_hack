import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface Notification {
  id: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'swap_completed' | 'admin_message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppContextType {
  swapRequests: SwapRequest[];
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  setSwapRequests: React.Dispatch<React.SetStateAction<SwapRequest[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <AppContext.Provider value={{
      swapRequests,
      notifications,
      addNotification,
      markNotificationRead,
      setSwapRequests
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}