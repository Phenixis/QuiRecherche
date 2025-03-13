'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';

type ValuesContextType = {
  appName: string;
  companyName: string;
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
  appName,
  companyName,
}: {
  children: ReactNode;
  appName: string;
  companyName: string;
}) {

  return (
    <ValuesContext.Provider value={{ appName, companyName}}>
      {children}
    </ValuesContext.Provider>
  );
}
