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
  console.log('authenticateUser called with identifier:', identifier);
  
  try {
    // Try to find user by email first, then by username
    let user = await storage.getUserByEmail(identifier);
    console.log('getUserByEmail result:', user ? 'Found user' : 'No user found');
    
    if (!user) {
      // If not found by email, try by username
      user = await storage.getUserByUsername(identifier);
      console.log('getUserByUsername result:', user ? 'Found user' : 'No user found');
    }
    
    if (!user) {
      console.log('No user found for identifier:', identifier);
      throw new Error("Invalid credentials");
    }

    console.log('User found:', user.username, user.email, 'hasPassword:', !!user.password, 'passwordLength:', user.password?.length);
    
    if (!user.password) {
      console.error('User password is empty/null for:', user.username);
      throw new Error("Invalid credentials");
    }

    try {
      const isValid = await verifyPassword(password, user.password);
      console.log('Password verification result:', isValid);
      
      if (!isValid) {
        console.log('Password verification failed for user:', user.username);
        throw new Error("Invalid credentials");
      }
    } catch (bcryptError: any) {
      console.error('Bcrypt verification error:', bcryptError.message, 'code:', bcryptError.code);
      throw new Error("Invalid credentials");
    }

    console.log('Authentication successful for user:', user.username);
    return user;
  } catch (error: any) {
    console.error('authenticateUser error:', error.message);
    throw error;
  }
}

export async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail("archimedes@journowl.app");
    if (existingAdmin) {
      console.log("Admin user already exists");
      return existingAdmin;
    }

    // Check by username too
    const existingByUsername = await storage.getUserByUsername("archimedes");
    if (existingByUsername) {
      console.log("Admin username already exists");
      return existingByUsername;
    }

    const hashedPassword = await hashPassword("7756guru");
    const adminUser = await storage.createUser({
      email: "archimedes@journowl.app",
      username: "archimedes", 
      password: hashedPassword,
      role: "admin",
      level: 99,
      xp: 999999,
      currentPlan: "power",
      promptsRemaining: 999999,
      emailVerified: true,
      requiresEmailVerification: false
    });

    console.log("Admin user created successfully:", adminUser.username);
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}
