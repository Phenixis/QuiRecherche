'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { use } from 'react';
import { User } from '@/lib/db/schema';

type ValuesContextType = {
  user: User | null;
  appName: string;
  companyName: string;
  setUser: (user: User | null) => void;
};

const ValuesContext = createContext<ValuesContextType | null>(null);

export function useValues(): ValuesContextType {
  let context = useContext(ValuesContext);
  if (context === null) {
    throw new Error('useValues must be used within a ValuesProvider');
  }
  return context;
}

export function ValuesProvider({
  children,
  userPromise,
  appName,
  companyName,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
  appName: string;
  companyName: string;
}) {
  let initialUser = use(userPromise);
  let [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <ValuesContext.Provider value={{ user, setUser, appName, companyName}}>
      {children}
    </ValuesContext.Provider>
  );
}
