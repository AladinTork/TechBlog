const router = require('express').Router();
const bcrypt = require('bcrypt');
const userDataFilePath = require('../../seeds/userData.json');
const { User } = require('../../models'); // If you're using Sequelize for DB operations

// Login route
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
      attributes: ['id', 'username', 'password_hash'],
    });

    if (!userData) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userData.password_hash
    );

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Save user session
    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.username = userData.username; // Save username
      req.session.loggedIn = true;

      return res.json({ success: true });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'An error occurred. Please try again later.' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username already taken. Please choose another.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password_hash: hashedPassword, // Store the hashed password
    });

    // Save user session after successful signup
    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      return res.json({ success: true });
    });
  } catch (err) {
    console.error('Error during sign-up:', err); // Log the error to get more details
    res.status(500).json({
      message: 'An error occurred during sign-up. Please try again later.',
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end(); // No content returned after successful logout
    });
  } else {
    res.status(404).end(); // If the user wasn't logged in, return a 404 error
  }
});

module.exports = router;
