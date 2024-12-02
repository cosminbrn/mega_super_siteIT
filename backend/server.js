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
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200,
  methods: ['GET, POST, PUT, DELETE'],
}

app.use(express.json());
app.use(cors(corsOptions));  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage: storage});

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

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'pff nicetry' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    res.status(200).json({ recipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'pff nicetry' });
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

app.delete('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return res.status(404).json({ message: 'nu esti in baza mea de date >< =(' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/recipe', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ recipes });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message : 'nt nt nt nice try bro'});
  }
});

app.post('/recipe', upload.single('image'), async (req, res) => {
  try {
    const { title, description, rating, author } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const recipe = await Recipe.create({
      title,
      description,
      rating,
      image,
      author,
    })

    res.status(200).json({ recipe});
  } catch (error) {
    console.log('haha fraiere nu e bine', error.message);
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
    res.status(500).json({ message: 'uneori trebuie sa te gandesti daca ai ce cauta aici sincer poti sa mergi si la alta facultate gen ASE' });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'nu esti in baza mea de date >< =(' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


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

   
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    console.log(`Login successful for user: ${email}`);

    // E chestia aia cu tokenul care nu prea ai inteles ce face, las-o aici nu o modifica ca merge
    //const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    //res.status(200).json({ message: 'Login successful', token });
    // Aceiasi chestie ca mai sus, dar mai usor de inteles
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

mongoose.connect('mongodb+srv://cosminbaroana06:JaJK8NuLCziLf0H6@cluster0.nfmul.mongodb.net/node-API?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
  console.log('Connected to the database');
}).catch((err) => {
  console.log('Error connecting to the database');
})
