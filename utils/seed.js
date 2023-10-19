const connection = require('../config/connection');
const { User } = require('../models');
const { getRandomName } = require('./data')

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Delete the 'users' collection if it exists
  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  }

  // Create an empty array to hold the users
  const users = [];

  // Function to generate a random email
  const getRandomEmail = () => {
    const email = `${Math.random().toString(36).substring(2, 10)}@example.com`;
    return email;
  };

  // Loop 20 times to add random users to the 'users' array
  for (let i = 0; i < 3; i++) {
    const username = getRandomName(); // Assuming getRandomName is a function that generates random names.
    const email = getRandomEmail();
    
    users.push({
      username,
      email,
      thoughts: [], // Initialize with an empty array of thoughts
      friends: [], // Initialize with an empty array of friends
    });
  }

  // Add users to the 'users' collection and await the results
  await User.collection.insertMany(users);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});

