const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200,
  methods: ['GET, POST, PUT, DELETE'],
}

app.use(express.json());
app.use(cors(corsOptions));  

app.get('/', (req, res) => {
    res.send('Welcome to the homepage');
})

app.get('/blog', (req, res) => {
  res.send('Welcome to thdsfdsfdse');
})

app.get('/user', async(req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/user/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/user', async(req, res) => {
  try {
      const user = await User.create(req.body);
      res.status(200).json({ user });
  } catch (error) {
    console.log('Error while creating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.put('/user/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if(!user) {
      return res.status(404).json({message: 'amongus fail'});
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({ updatedUser });
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.delete('/user/:id', async(req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({message: error.message});
    }
})

mongoose.connect('mongodb+srv://cosminbaroana06:JaJK8NuLCziLf0H6@cluster0.nfmul.mongodb.net/node-API?retryWrites=true&w=majority&appName=Cluster0').then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
  console.log('Connected to the database');
}).catch((err) => {
  console.log('Error connecting to the database');
})