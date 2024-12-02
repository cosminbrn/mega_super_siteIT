import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Recipes from './pages/Recipes';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addreci.html" element={<AddRecipe />} />
        <Route path="/signin.html" element={<SignIn />} />
        <Route path="/signup.html" element={<SignUp />} />
        <Route path="/profile.html" element={<Profile />} />
        <Route path="/recipes.html" element={<Recipes />} />
      </Routes>
    </Router>
  );
}

export default App;
