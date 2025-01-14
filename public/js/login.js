const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { User } = require('../../models');

// Load user data from JSON file
const userDataPath = path.resolve(__dirname, '../../seeds/userData.json');
const users = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

// Seed user data into the database
const seedUsers = async () => {
  try {
    for (const user of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: user.email } });
      if (!existingUser) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(user.password_hash, 10);
        
        // Create the user in the database
        await User.create({
          username: `${user.first_name.toLowerCase()}_${user.last_name.toLowerCase()}`, // Generate username
          email: user.email,
          password: hashedPassword,
        });
      }
    }
    console.log('Users seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

module.exports = { seedUsers };
