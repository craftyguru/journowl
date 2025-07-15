const { createUser } = require('./dist/server/services/auth.js');

async function createAdminUser() {
  try {
    const adminUser = await createUser({
      email: 'CraftyGuru@1ofakindpiece.com',
      username: 'CraftyGuru_Admin',
      password: '7756guru'
    });
    
    // Update to admin role
    const { storage } = require('./dist/server/storage.js');
    await storage.updateUser(adminUser.id, { role: 'admin' });
    
    console.log('✅ Admin user created successfully:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
