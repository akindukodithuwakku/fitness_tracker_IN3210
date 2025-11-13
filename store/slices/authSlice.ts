import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { authApi } from '@/services/api';
import { storage } from '@/utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const user: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      };
      
      // Save to storage
      await storage.saveAuthToken(response.token);
      await storage.saveUserData(user);
      
      return { user, token: response.token };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      const user: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      };
      
      // Save to storage
      await storage.saveAuthToken(response.token);
      await storage.saveUserData(user);
      
      return { user, token: response.token };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const token = await storage.getAuthToken();
    const user = await storage.getUserData<User>();
    
    if (token && user) {
      return { user, token };
    }
    
    return null;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await storage.removeAuthToken();
    await storage.removeUserData();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
    
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
    
    // Load user from storage
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      });
    
    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

