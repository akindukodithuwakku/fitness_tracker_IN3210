import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}

const THEME_STORAGE_KEY = '@fitnesstracker:theme';

const initialState: ThemeState = {
  mode: 'system',
  isLoading: false,
};

export const loadTheme = createAsyncThunk('theme/load', async () => {
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as ThemeMode) || 'system';
  } catch (error) {
    return 'system';
  }
});

export const saveTheme = createAsyncThunk(
  'theme/save',
  async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      return mode;
    } catch (error) {
      throw error;
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      // Toggle between light and dark only (skip system)
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.isLoading = false;
      })
      .addCase(loadTheme.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      });
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

