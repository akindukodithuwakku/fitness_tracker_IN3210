import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useAppSelector } from '@/store/hooks';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const themeMode = useAppSelector((state) => state.theme.mode);
  
  // If theme mode is set to 'system', use system preference, otherwise use the stored preference
  if (themeMode === 'system') {
    return systemColorScheme ?? 'light';
  }
  
  return themeMode;
}
