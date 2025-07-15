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
  const existingUser = await storage.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(userData.password);
  return await storage.createUser({
    ...userData,
    password: hashedPassword,
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}
