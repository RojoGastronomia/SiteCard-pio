require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createInitialUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB Atlas');

    await mongoose.connection.db.admin().ping();
    console.log('✅ Database connection verified');

    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    const credentials = [
      {
        name: 'Administrador',
        email: 'admin@rojogastronomia.com',
        password: 'Admin@123',
        role: 'admin'
      },
      {
        name: 'Funcionário',
        email: 'funcionario@rojogastronomia.com',
        password: 'Func@123',
        role: 'employee'
      },
      {
        name: 'Cliente',
        email: 'cliente@gmail.com',
        password: 'Cliente@123',
        role: 'client'
      }
    ];

    // Create users with hashed passwords
    for (const userData of credentials) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created ${user.role} user: ${user.email}`);
    }

    console.log('\n✅ Users created successfully!');
    console.log('\nLogin credentials:');
    console.log('------------------------');
    credentials.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('------------------------');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('\nAuthentication failed. Please check:');
      console.error('1. Your username and password in the connection string');
      console.error('2. The user exists in MongoDB Atlas');
      console.error('3. The user has the correct permissions');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

createInitialUsers();