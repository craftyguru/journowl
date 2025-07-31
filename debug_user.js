// Quick debug script to check djfluent user
import { storage } from './server/storage.js';

async function debugUser() {
  try {
    console.log('Looking for djfluent user...');
    
    // Try to find by username
    const userByUsername = await storage.getUserByUsername('djfluent');
    console.log('By username:', userByUsername);
    
    // Try to find by email containing djfluent
    const userByEmail = await storage.getUserByEmail('djfluent@gmail.com');
    console.log('By email (djfluent@gmail.com):', userByEmail);
    
    // List all users to see what's in database
    console.log('All users in database:');
    // This would need a custom query since storage doesn't have getAllUsers
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugUser();