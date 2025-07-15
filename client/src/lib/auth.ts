import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  username: string;
  level: number;
  xp: number;
}

export interface AuthResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", { email, password });
  return response.json();
}

export async function register(email: string, username: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", { email, username, password });
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await apiRequest("GET", "/api/auth/me");
  return response.json();
}
