import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@fitness_tracker:auth_token',
  USER_DATA: '@fitness_tracker:user_data',
  FAVOURITES: '@fitness_tracker:favourites',
  THEME: '@fitness_tracker:theme',
} as const;

export const storage = {
  // Auth
  async saveAuthToken(token: string): Promise<void> {
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Cannot save undefined or null token');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // User Data
  async saveUserData(user: unknown): Promise<void> {
    if (!user) {
      throw new Error('Cannot save undefined or null user data');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUserData<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async removeUserData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Favourites
  async saveFavourites(favourites: unknown[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
  },

  async getFavourites<T>(): Promise<T[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
    return data ? JSON.parse(data) : [];
  },

  // Theme
  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getTheme(): Promise<'light' | 'dark' | null> {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme as 'light' | 'dark' | null;
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.FAVOURITES,
      STORAGE_KEYS.THEME,
    ]);
  },
};

