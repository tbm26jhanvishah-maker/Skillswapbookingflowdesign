import { useState, useEffect } from 'react';
import { getUser, updateUser } from './api';
import { currentUser as mockCurrentUser } from './mockData';
import type { User } from './mockData';

const CURRENT_USER_ID = 'current-user';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      let userData = await getUser(CURRENT_USER_ID);
      
      // If user doesn't exist, create it with mock data
      if (!userData) {
        await updateUser(CURRENT_USER_ID, mockCurrentUser);
        userData = mockCurrentUser;
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      // Fallback to mock data
      setUser(mockCurrentUser);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!user) return false;
    
    const success = await updateUser(CURRENT_USER_ID, { ...user, ...updates });
    if (success) {
      setUser({ ...user, ...updates });
    }
    return success;
  };

  return { user, loading, updateUser: updateCurrentUser, reload: loadUser };
}
