import { authApi } from "@/services/api";
import { User } from "@/types";
import { storage } from "@/utils/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // First check if user is locally registered
      const localUser = await storage.findRegisteredUser(
        credentials.username,
        credentials.password
      );

      if (localUser) {
        // Login with local user
        const user: User = {
          id: localUser.id,
          username: localUser.username,
          email: localUser.email,
          firstName: localUser.firstName || "",
          lastName: localUser.lastName || "",
        };

        const token = `local-token-${localUser.id}-${Date.now()}`;
        await storage.saveAuthToken(token);
        await storage.saveUserData(user);

        return { user, token };
      }

      // Try DummyJSON API for test credentials
      const response = await authApi.login(credentials);

      const token = response.accessToken;
      if (!token) {
        throw new Error("Login failed: No authentication token received");
      }

      const user: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      };

      await storage.saveAuthToken(token);
      await storage.saveUserData(user);

      return { user, token };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Check if username already exists locally
      const existingUsers = await storage.getRegisteredUsers();
      if (
        existingUsers.some(
          (u) => u.username === userData.username || u.email === userData.email
        )
      ) {
        throw new Error("Username or email already exists");
      }

      // Create local user
      const userId = `local-${Date.now()}`;
      const localUser = {
        id: userId,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      };

      // Save to local storage
      await storage.saveRegisteredUser(localUser);

      const user: User = {
        id: userId,
        username: localUser.username,
        email: localUser.email,
        firstName: localUser.firstName,
        lastName: localUser.lastName,
      };

      const token = `local-token-${userId}-${Date.now()}`;
      await storage.saveAuthToken(token);
      await storage.saveUserData(user);

      return { user, token };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async () => {
    const token = await storage.getAuthToken();
    const user = await storage.getUserData<User>();

    if (token && user) {
      return { user, token };
    }

    return null;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await storage.removeAuthToken();
  await storage.removeUserData();
});

const authSlice = createSlice({
  name: "auth",
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
    builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
