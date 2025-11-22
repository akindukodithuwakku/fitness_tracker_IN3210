import { Exercise, User } from '@/types';

const API_BASE_URL = 'https://dummyjson.com';
const TIMEOUT_MS = 10000; // 10 seconds

// API Response types
interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string; // DummyJSON uses 'accessToken' not 'token'
  refreshToken?: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string; // For registration, we generate our own token
}

// Helper function to handle fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      // Provide more helpful error messages
      if (error.message.includes('Network request failed')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
    }
    throw error;
  }
}

// Authentication API
export const authApi = {
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { username: credentials.username });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful, received data:', JSON.stringify(data, null, 2));
      
      // DummyJSON returns accessToken, not token
      return {
        ...data,
        token: data.accessToken || data.token, // Support both formats
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during login');
    }
  },

  // Note: DummyJSON doesn't have a real register endpoint, so we'll simulate it
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<RegisterResponse> {
    try {
      console.log('Attempting registration with:', { username: userData.username, email: userData.email });
      
      // Simulating registration by using the add user endpoint
      // In a real app, this would be a proper registration endpoint
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          password: userData.password,
        }),
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful');
      
      // Generate a mock token since DummyJSON doesn't provide one for registration
      return {
        ...data,
        token: `mock-token-${data.id}-${Date.now()}`,
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during registration');
    }
  },
};

// Exercise API (for later features)
export const exerciseApi = {
  async getExercises(): Promise<Exercise[]> {
    // Placeholder - will be implemented in Feature 3
    return [];
  },

  async getExerciseById(id: string): Promise<Exercise | null> {
    // Placeholder - will be implemented in Feature 4
    return null;
  },
};

