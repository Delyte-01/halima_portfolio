"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingContextValue {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined
);

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isLoading, setLoading] = useState(true);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
  return ctx;
}
