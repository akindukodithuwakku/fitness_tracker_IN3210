import { Tabs } from 'expo-router';
import React from 'react';
import { Activity, Heart, User } from 'react-native-feather';
import { View, Text, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';

function HeaderTitle({ title }: { title: string }) {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || '';

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {displayName && (
        <Text style={styles.headerSubtitle}>Welcome, {displayName}</Text>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Exercises',
          headerTitle: () => <HeaderTitle title="Exercises" />,
          tabBarIcon: ({ color, size }) => <Activity width={size} height={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          headerTitle: () => <HeaderTitle title="Favourites" />,
          tabBarIcon: ({ color, size }) => <Heart width={size} height={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: () => <HeaderTitle title="Profile" />,
          tabBarIcon: ({ color, size }) => <User width={size} height={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
