"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface VerificationContextType {
  verified: boolean;
  setVerified: (verified: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(false);

  return (
    <VerificationContext.Provider value={{ verified, setVerified }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
