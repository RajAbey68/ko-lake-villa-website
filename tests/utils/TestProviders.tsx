import * as React from 'react';

export function TestProviders({ children }: { children: React.ReactNode }) {
  // Add any Context providers your components require here.
  return <>{children}</>;
}