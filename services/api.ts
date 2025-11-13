import { Exercise, User } from '@/types';

const API_BASE_URL = 'https://dummyjson.com';

// API Response types
interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// Authentication API
export const authApi = {
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Note: DummyJSON doesn't have a real register endpoint, so we'll simulate it
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<RegisterResponse> {
    // Simulating registration by using the add user endpoint
    // In a real app, this would be a proper registration endpoint
    const response = await fetch(`${API_BASE_URL}/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Generate a mock token since DummyJSON doesn't provide one for registration
    return {
      ...data,
      token: `mock-token-${data.id}-${Date.now()}`,
    };
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

