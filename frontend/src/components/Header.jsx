import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
    console.log('Logged out');
  };

  const registerClass =
    location.pathname === '/signup.html' ? 'button login' : 'button register';

  const loginClass =
    ((location.pathname === '/signin.html') || (location.pathname === '/')) ? 'button login' : 'button register';
  
  const recipesClass =
    location.pathname === '/recipes.html' ? 'button login' : 'button register';

  const addClass =
    location.pathname === '/addreci.html' ? 'button login' : 'button register';

  const profileClass =
    location.pathname === '/profile.html' ? 'button login' : 'button register';

  return (
    <header className="header">
      <div className="header-corner-trick-left"></div>
      <div className="header-corner-trick-left-2"></div>
      <div className="header-corner-trick-right"></div>
      <div className="header-corner-trick-right-2"></div>

      <div className="nav-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="nav-links">
        {!isLoggedIn ? (
          <>         
            <Link to="/recipes.html" className={ recipesClass }>Recipes</Link>
            <div className="spacer"></div>
          </>
        ): (
          <>
          <Link to="/recipes.html" className={ recipesClass }>Recipes</Link>
          <Link to="/addreci.html" className={ addClass }>Add Recipe</Link>
          <div className = "spacer"></div>
          </>
        )}
        </nav>

        <div>
          {!isLoggedIn ? (
            <div className="nav-links">
              <Link to="/signin.html" className={ loginClass } id="login-button">Login</Link>
              <Link to="/signup.html" className={ registerClass } id="signup-button">Register</Link>
            </div>
          ):(
            <div className="nav-buttons">
              <Link to="/signin.html" className="button login" id="profile-button" onClick={handleLogout}>Logout</Link>
              <Link to="/profile.html" className={ profileClass } id="profile-button">Profile</Link>
              
            </div> 
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
