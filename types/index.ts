export interface Exercise {
  id: string;
  name: string;
  type?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: string;
  instructions?: string;
  image?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

