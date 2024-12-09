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
    console.log(error.message);
    res.status(500).json({ message: 'unucky bro nu merge sercerul' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'pff nicetry' });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ recipes });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
});

app.post('/user', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

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
    console.log('haha fraiere nu e bine', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/recipe', upload.single('image'), async (req, res) => {
  try {
    const { title, description, rating = 0, author, reviewCount = 0 } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const recipe = await Recipe.create({
      title,
      description,
      rating,
      image,
      author,
      reviewCount,
    });

    res.status(200).json({ recipe });
  } catch (error) {
    console.log('Error creating recipe:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Updating the recipe rating with weighted average calculation
app.put('/recipe/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || typeof rating !== 'number') {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Calculate the new weighted rating
    const updatedRating = ((recipe.rating * recipe.reviewCount) + rating) / (recipe.reviewCount + 1);
    const updatedReviewCount = recipe.reviewCount + 1;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
      rating: updatedRating,
      reviewCount: updatedReviewCount,
    }, { new: true });

    res.status(200).json({ updatedRecipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Increment reviewCount by 1 for a recipe
app.put('/recipe/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body; // Get the new rating from the request body

    // Find the recipe
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Calculate the new weighted rating
    const updatedRating = ((recipe.rating * recipe.reviewCount) + rating) / (recipe.reviewCount + 1);
    const updatedReviewCount = recipe.reviewCount + 1;

    // Update the recipe
    recipe.rating = updatedRating;
    recipe.reviewCount = updatedReviewCount;

    // Save the updated recipe
    const updatedRecipe = await recipe.save();

    res.status(200).json({ updatedRecipe });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/recipes', async (req, res) => {
  try {
    await Recipe.deleteMany({});
    res.status(200).json({ message: 'All recipes deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to delete recipes' });
  }
});

mongoose.connect('mongodb+srv://cosminbaroana06:JaJK8NuLCziLf0H6@cluster0.nfmul.mongodb.net/node-API?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  console.log('Connected to the database');
}).catch((err) => {
  console.log('Error connecting to the database');
});
