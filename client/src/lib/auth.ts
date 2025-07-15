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
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  return response.json();
}

export async function register(email: string, username: string, password: string): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ email, username, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }
  return response.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Not authenticated");
    }
    return response.json();
  } catch (error) {
    console.error('getCurrentUser failed:', error);
    throw error;
  }
}
