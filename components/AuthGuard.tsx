import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, usePathname } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUserFromStorage } from '@/store/slices/authSlice';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load user from storage on app startup
    const initAuth = async () => {
      console.log('AuthGuard: Initializing authentication...');
      await dispatch(loadUserFromStorage());
      setIsLoading(false);
      console.log('AuthGuard: Initialization complete');
    };

    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    console.log('AuthGuard: Current path:', pathname);
    console.log('AuthGuard: Segments:', segments);
    console.log('AuthGuard: Is authenticated:', isAuthenticated);

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and trying to access protected routes
      console.log('AuthGuard: Not authenticated, redirecting to login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and trying to access auth screens
      console.log('AuthGuard: Authenticated in auth group, redirecting to tabs');
      router.replace('/(tabs)');
    } else if (isAuthenticated && pathname === '/') {
      // If authenticated and on root, go to tabs
      console.log('AuthGuard: Authenticated on root, redirecting to tabs');
      router.replace('/(tabs)');
    } else if (!isAuthenticated && pathname === '/') {
      // If not authenticated and on root, go to login
      console.log('AuthGuard: Not authenticated on root, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

