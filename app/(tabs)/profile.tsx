import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { Button } from '@/components/Button';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { User } from 'react-native-feather';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logoutUser());
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || 'User';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, isDark && styles.avatarContainerDark]}>
            <User width={48} height={48} color={isDark ? '#4fc3f7' : '#0a7ea4'} />
          </View>
          <ThemedText style={styles.name}>{displayName}</ThemedText>
          {user?.email && <ThemedText style={styles.email}>{user.email}</ThemedText>}
        </View>

        <View style={styles.section}>
          <View style={[styles.infoRow, isDark && styles.infoRowDark]}>
            <ThemedText style={styles.label}>Username</ThemedText>
            <ThemedText style={styles.value}>{user?.username || 'N/A'}</ThemedText>
          </View>
          {user?.firstName && (
            <View style={[styles.infoRow, isDark && styles.infoRowDark]}>
              <ThemedText style={styles.label}>First Name</ThemedText>
              <ThemedText style={styles.value}>{user.firstName}</ThemedText>
            </View>
          )}
          {user?.lastName && (
            <View style={[styles.infoRow, isDark && styles.infoRowDark]}>
              <ThemedText style={styles.label}>Last Name</ThemedText>
              <ThemedText style={styles.value}>{user.lastName}</ThemedText>
            </View>
          )}
          {user?.email && (
            <View style={[styles.infoRow, isDark && styles.infoRowDark]}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <ThemedText style={styles.value}>{user.email}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          <DarkModeToggle />
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainerDark: {
    backgroundColor: '#1e3a4a',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoRowDark: {
    borderBottomColor: '#3a3a3c',
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  logoutButton: {
    borderColor: '#ff3b30',
  },
});

