import React, { createContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
}

interface UserContextProps {
  email: string;
  setEmail: (email: string) => void;
  userId: number;
  setUserId: (userId: number) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ email, setEmail, userId, user, setUser, setUserId, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
