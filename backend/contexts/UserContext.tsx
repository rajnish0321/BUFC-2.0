import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from '@/components/LoadingScreen';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'staff';
  stallName?: string; // Optional for staff users
  phone?: string;
  avatar?: string;
  createdAt?: string;
  // Student specific fields
  studentId?: string;
  department?: string;
  year?: string;
  hostel?: string;
  // Staff specific fields
  location?: string;
  workingHours?: string;
}

export interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'User',
          role: session.user.user_metadata.role || 'student',
          stallName: session.user.user_metadata.stallName,
          phone: session.user.user_metadata.phone,
          avatar: session.user.user_metadata.avatar,
          createdAt: session.user.user_metadata.createdAt,
          studentId: session.user.user_metadata.studentId,
          department: session.user.user_metadata.department,
          year: session.user.user_metadata.year,
          hostel: session.user.user_metadata.hostel,
          location: session.user.user_metadata.location,
          workingHours: session.user.user_metadata.workingHours,
        });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'User',
          role: session.user.user_metadata.role || 'student',
          stallName: session.user.user_metadata.stallName,
          phone: session.user.user_metadata.phone,
          avatar: session.user.user_metadata.avatar,
          createdAt: session.user.user_metadata.createdAt,
          studentId: session.user.user_metadata.studentId,
          department: session.user.user_metadata.department,
          year: session.user.user_metadata.year,
          hostel: session.user.user_metadata.hostel,
          location: session.user.user_metadata.location,
          workingHours: session.user.user_metadata.workingHours,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    // Clear user state immediately
    setUser(null);
    
    // Clear all auth-related storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Force clear Supabase session without waiting
    supabase.auth.signOut().catch(() => {});
    
    // Show success message
    toast({
      title: "Success",
      description: "Logged out successfully",
      variant: "default",
    });
    
    // Force reload the page to clear any cached state
    window.location.href = '/';
    
    // Return resolved promise to satisfy the type
    return Promise.resolve();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


