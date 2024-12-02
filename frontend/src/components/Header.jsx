import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [location]); 

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
    console.log('Logged out');
  };

  return (
    <header>
      <div className="nav-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="nav-links">
        {!isLoggedIn ? (
          <>         
            <Link to="/recipes.html" className="nav-button">Recipes</Link>
          </>
        ): (
          <>
          <Link to="/recipes.html" className="nav-button">Recipes</Link>
          <Link to="/addreci.html" className="nav-button">Add Recipe</Link>
          </>
        )}
        </nav>

        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link to="/signin.html" className="fancy-button" id="login-button">Login</Link>
              <Link to="/signup.html" className="fancy-button" id="signup-button">Sign Up</Link>
            </>
          ):(
            <>
              <Link to="/profile.html" className="fancy-button" id="profile-button">Profile</Link>
              <Link to="/signin.html" className="fancy-button" id="profile-button" onClick={handleLogout}>Logout</Link>
            </> 
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
