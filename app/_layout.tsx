import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store, AppDispatch } from '@/store';
import { AuthGuard } from '@/components/AuthGuard';
import { loadTheme } from '@/store/slices/themeSlice';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load saved theme preference on app start
    dispatch(loadTheme());
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        <Slot />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </AuthGuard>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
