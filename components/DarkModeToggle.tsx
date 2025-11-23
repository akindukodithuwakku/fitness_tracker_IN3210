import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'react-native-feather';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveTheme } from '@/store/slices/themeSlice';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DarkModeToggleProps {
  style?: any;
}

export function DarkModeToggle({ style }: DarkModeToggleProps) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  const handleToggle = async (value: boolean) => {
    const newMode = value ? 'dark' : 'light';
    await dispatch(saveTheme(newMode));
  };
  
  const handleSystemToggle = async () => {
    await dispatch(saveTheme('system'));
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View style={styles.iconTextContainer}>
            {isDark ? (
              <Moon width={20} height={20} color={isDark ? '#fff' : '#333'} />
            ) : (
              <Sun width={20} height={20} color={isDark ? '#fff' : '#333'} />
            )}
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={handleToggle}
            trackColor={{ false: '#e0e0e0', true: '#0a7ea4' }}
            thumbColor={themeMode === 'dark' ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {themeMode !== 'system' && (
          <TouchableOpacity
            style={styles.systemButton}
            onPress={handleSystemToggle}
            activeOpacity={0.7}
          >
            <Text style={[styles.systemButtonText, isDark && styles.systemButtonTextDark]}>
              Use System Theme
            </Text>
          </TouchableOpacity>
        )}
        
        {themeMode === 'system' && (
          <Text style={[styles.systemInfo, isDark && styles.systemInfoDark]}>
            Following system preference ({colorScheme})
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardDark: {
    backgroundColor: '#2c2c2e',
    borderColor: '#3a3a3c',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  systemButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
  },
  systemButtonText: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  systemButtonTextDark: {
    color: '#4fc3f7',
  },
  systemInfo: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  systemInfoDark: {
    color: '#999',
  },
});

