import { Suspense } from 'react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" />
  </div>
);


export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);