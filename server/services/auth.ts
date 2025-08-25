import bcrypt from "bcrypt";
import { storage } from "../storage";
import { type InsertUser, type User } from "@shared/schema";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: Partial<User>) {
  const existingUser = await storage.getUserByEmail((userData as any).email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword((userData as any).password);
  // ⬇️ write to the real column name
  return await storage.createUser({
    ...userData,
    password_hash: hashedPassword,
  } as any);
}

export async function authenticateUser(identifier: string, password: string) {
  console.log("authenticateUser called with identifier:", identifier);

  // email then username
  let user = await storage.getUserByEmail(identifier);
  if (!user) user = await storage.getUserByUsername(identifier);

  if (!user) throw new Error("Invalid credentials");

  const hash = user.password_hash;
  console.log("User found:", user.username, user.email, "hasPassword:", !!hash);

  const isValid = hash ? await verifyPassword(password, hash) : false;
  console.log("Password verification result:", isValid);

  if (!isValid) throw new Error("Invalid credentials");
  return user;
}

export async function createAdminUser() {
  // if you keep this seeder, also write to `password`
  const existing = await storage.getUserByEmail("archimedes@journowl.app")
                 ?? await storage.getUserByUsername("archimedes");
  if (existing) return existing;

  const hashedPassword = await hashPassword("7756guru");
  return await storage.createUser({
    email: "archimedes@journowl.app",
    username: "archimedes",
    password_hash: hashedPassword,
    role: "admin",
    level: 99,
    xp: 999999,
    currentPlan: "power",
    promptsRemaining: 999999,
    emailVerified: true,
  } as any);
}
