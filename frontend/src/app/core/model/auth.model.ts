export type RegisterRole = 'TRAVELER' | 'TRAVEL_MANAGER';

export type Role = RegisterRole | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RegisterRole;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  user: UserResponse;
}