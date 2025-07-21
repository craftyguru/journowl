import bcrypt from "bcrypt";
import { storage } from "../storage";
import { type InsertUser } from "@shared/schema";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: InsertUser) {
  const existingUser = await storage.getUserByEmail((userData as any).email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword((userData as any).password);
  return await storage.createUser({
    ...userData,
    password: hashedPassword,
  });
}

export async function authenticateUser(identifier: string, password: string) {
  // Try to find user by email first, then by username
  let user = await storage.getUserByEmail(identifier);
  
  if (!user) {
    // If not found by email, try by username
    user = await storage.getUserByUsername(identifier);
  }
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(password, user.password || "");
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}
