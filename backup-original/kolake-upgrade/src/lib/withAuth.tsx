import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase'; // Your firebase config

export function withAuth(Component: React.ComponentType) {
  return function AuthWrapper(props: any) {
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) router.push('/login');
      });
      return () => unsubscribe();
    }, [auth, router]);

    return <Component {...props} />;
  };
}
