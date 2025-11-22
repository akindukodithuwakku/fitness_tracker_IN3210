import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('Index: Checking authentication status...');
    console.log('Index: Is authenticated:', isAuthenticated);
    console.log('Index: User:', user);

    // Small delay to ensure Redux state is loaded
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('Index: Redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('Index: Redirecting to login');
        router.replace('/(auth)/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0a7ea4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

