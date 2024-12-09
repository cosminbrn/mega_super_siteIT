const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'amongus';
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  methods: ['GET, POST, PUT, DELETE'],
};

app.use(express.json());
app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

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
    res.status(500).json({ message: 'Internal server error: Unable to fetch users.' });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to fetch user.' });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to fetch recipes.' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to fetch recipe.' });
  }
});

app.post('/user', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, phone, and password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to create user.' });
  }
});

app.post('/recipe', upload.single('image'), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const recipe = await Recipe.create({
      title,
      description,
      author,
      image,
    });

    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to create recipe.' });
  }
});

app.put('/recipe/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewer, rating } = req.body;

    if (!reviewer || typeof rating === 'undefined') {
      return res.status(400).json({ message: 'Reviewer and rating are required.' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    recipe.reviews.push({ reviewer, rating });

    const totalRatings = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
    recipe.rating = totalRatings / recipe.reviews.length;
    recipe.reviewCount = recipe.reviews.length;

    await recipe.save();

    res.status(200).json({ message: 'Review added successfully.', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to add review.' });
  }
});

app.delete('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully.', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to delete recipe.' });
  }
});

app.delete('/recipes', async (req, res) => {
  try {
    await Recipe.deleteMany({});
    res.status(200).json({ message: 'All recipes deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to delete recipes.' });
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to update user.' });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: Unable to delete user.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to process login.' });
  }
});

mongoose.connect('mongodb+srv://cosminbaroana06:JaJK8NuLCziLf0H6@cluster0.nfmul.mongodb.net/node-API?retryWrites=true&w=majority')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });
