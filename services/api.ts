import { Exercise } from "@/types";

const API_BASE_URL = "https://dummyjson.com";
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
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = TIMEOUT_MS
): Promise<Response> {
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
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout. Please check your internet connection."
        );
      }
      // Provide more helpful error messages
      if (error.message.includes("Network request failed")) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }
    }
    throw error;
  }
}

// Authentication API
export const authApi = {
  async login(credentials: {
    username: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      // DummyJSON returns accessToken, not token
      return {
        ...data,
        token: data.accessToken || data.token,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred during login");
    }
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      return {
        ...data,
        token: `mock-token-${data.id}-${Date.now()}`,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred during registration");
    }
  },
};

// Exercise API - API Ninjas Exercises API
const EXERCISE_API_KEY = "z/DEdTtkhcY2jOUzN0HO/g==kMA8ZXqI2ztgOogs";
const EXERCISE_API_BASE = "https://api.api-ninjas.com/v1";
const USE_MOCK_DATA = false;

interface ExerciseApiResponse {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

// Mock data for fallback or testing
const MOCK_EXERCISES: Exercise[] = [
  {
    id: "push-ups-1",
    name: "Push-ups",
    type: "strength",
    muscle: "chest",
    equipment: "body_only",
    difficulty: "beginner",
    instructions:
      "Start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor. Push yourself back up to the starting position.",
  },
  {
    id: "squats-2",
    name: "Squats",
    type: "strength",
    muscle: "quadriceps",
    equipment: "body_only",
    difficulty: "beginner",
    instructions:
      "Stand with feet shoulder-width apart. Lower your body by bending your knees and hips. Keep your back straight and chest up. Return to starting position.",
  },
  {
    id: "plank-3",
    name: "Plank",
    type: "strength",
    muscle: "abdominals",
    equipment: "body_only",
    difficulty: "beginner",
    instructions:
      "Start in a forearm plank position. Keep your body in a straight line from head to heels. Hold this position, engaging your core muscles.",
  },
  {
    id: "bicep-curls-4",
    name: "Bicep Curls",
    type: "strength",
    muscle: "biceps",
    equipment: "dumbbells",
    difficulty: "beginner",
    instructions:
      "Stand with a dumbbell in each hand, arms fully extended. Curl the weights up to shoulder level. Lower back down with control.",
  },
  {
    id: "tricep-dips-5",
    name: "Tricep Dips",
    type: "strength",
    muscle: "triceps",
    equipment: "body_only",
    difficulty: "intermediate",
    instructions:
      "Sit on the edge of a bench or chair. Place hands beside your hips. Slide off the edge and lower your body. Push back up using your triceps.",
  },
  {
    id: "lunges-6",
    name: "Lunges",
    type: "strength",
    muscle: "quadriceps",
    equipment: "body_only",
    difficulty: "beginner",
    instructions:
      "Step forward with one leg. Lower your hips until both knees are bent at 90 degrees. Push back to starting position. Alternate legs.",
  },
  {
    id: "bench-press-7",
    name: "Bench Press",
    type: "strength",
    muscle: "chest",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Lie on a bench with a barbell. Lower the bar to your chest. Press the bar back up to starting position.",
  },
  {
    id: "deadlift-8",
    name: "Deadlift",
    type: "strength",
    muscle: "quadriceps",
    equipment: "barbell",
    difficulty: "expert",
    instructions:
      "Stand with feet hip-width apart, barbell over feet. Bend at hips and knees to grip bar. Lift bar by extending hips and knees. Lower with control.",
  },
  {
    id: "crunches-9",
    name: "Crunches",
    type: "strength",
    muscle: "abdominals",
    equipment: "body_only",
    difficulty: "beginner",
    instructions:
      "Lie on your back with knees bent. Place hands behind head. Lift your shoulders off the ground. Lower back down with control.",
  },
  {
    id: "shoulder-press-10",
    name: "Shoulder Press",
    type: "strength",
    muscle: "shoulders",
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions:
      "Stand or sit with dumbbells at shoulder height. Press weights overhead until arms are fully extended. Lower back to starting position.",
  },
];

export const exerciseApi = {
  async getExercises(
    muscle?: string,
    difficulty?: string
  ): Promise<Exercise[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_EXERCISES.filter((ex) => !muscle || ex.muscle === muscle);
    }

    try {
      const targetMuscle = muscle || "abdominals";

      const response = await fetchWithTimeout(
        `${EXERCISE_API_BASE}/exercises?muscle=${targetMuscle}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": EXERCISE_API_KEY,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch exercises`);
      }

      const data: ExerciseApiResponse[] = await response.json();

      if (!data || data.length === 0) {
        return MOCK_EXERCISES.filter((ex) => !muscle || ex.muscle === muscle);
      }

      return data.map((item, index) => ({
        id: `${item.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name: item.name,
        type: item.type,
        muscle: item.muscle,
        equipment: item.equipment,
        difficulty: item.difficulty,
        instructions: item.instructions,
      }));
    } catch {
      return MOCK_EXERCISES.filter((ex) => !muscle || ex.muscle === muscle);
    }
  },

  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const mockExercise = MOCK_EXERCISES.find((ex) => ex.id === id);
      if (mockExercise) {
        return mockExercise;
      }

      const allExercises = await this.getExercises();
      return allExercises.find((ex) => ex.id === id) || null;
    } catch {
      return null;
    }
  },

  async searchExercises(query: string): Promise<Exercise[]> {
    try {
      const response = await fetchWithTimeout(
        `${EXERCISE_API_BASE}/exercises?name=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": EXERCISE_API_KEY,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search exercises`);
      }

      const data: ExerciseApiResponse[] = await response.json();

      return data.map((item, index) => ({
        id: `${item.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name: item.name,
        type: item.type,
        muscle: item.muscle,
        equipment: item.equipment,
        difficulty: item.difficulty,
        instructions: item.instructions,
      }));
    } catch (error) {
      throw error;
    }
  },

  async getMixedExercises(): Promise<Exercise[]> {
    try {
      if (USE_MOCK_DATA) {
        return MOCK_EXERCISES;
      }

      const muscleGroups = [
        "abdominals",
        "biceps",
        "chest",
        "quadriceps",
        "triceps",
      ];
      const allExercises: Exercise[] = [];

      for (const muscle of muscleGroups) {
        try {
          const exercises = await this.getExercises(muscle);
          allExercises.push(...exercises.slice(0, 2));
        } catch {
          // Continue with other muscle groups
        }
      }

      if (allExercises.length === 0) {
        return MOCK_EXERCISES;
      }

      return allExercises;
    } catch {
      return MOCK_EXERCISES;
    }
  },
};
