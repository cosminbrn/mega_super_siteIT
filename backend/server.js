const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Token handling
const JWT_SECRET = 'amongus'; 
const bcrypt = require('bcryptjs'); // Add bcryptjs for password hashing

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200,
  methods: ['GET, POST, PUT, DELETE'],
}

app.use(express.json());
app.use(cors(corsOptions));  

app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});

app.get('/blog', (req, res) => {
  res.send('Welcome to the blog page');
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Unlucky, server error!' });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error retrieving user info' });
  }
});

app.post('/user', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password

    // Create the user with the hashed password
    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword, // Store the hashed password
    });

    res.status(200).json({ user });
  } catch (error) {
    console.log('Error during user creation', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({ updatedUser });
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({ message: 'Server error, please check your request' });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in the database' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login endpoint with password comparison using bcrypt
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    console.log(`Login successful for user: ${email}`);

    // Generate JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Connect to MongoDB and start server
mongoose.connect('mongodb+srv://cosminbaroana06:JaJK8NuLCziLf0H6@cluster0.nfmul.mongodb.net/node-API?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Error connecting to the database', err);
  });
