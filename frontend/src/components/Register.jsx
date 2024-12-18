import React, { useState, useEffect } from 'react';
import person from '../assets/images/person.png';
import telephone from '../assets/images/phone.png';
import email from '../assets/images/mail.png';
import lock from '../assets/images/lock.png';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);  
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const addAutofillClass = (input) => {
    if (input.value) {
      input.classList.add('autofill');
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      addAutofillClass(input);
      input.addEventListener('focus', () => {
        setTimeout(() => {
          addAutofillClass(input);
        }, 100);
      });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true); 
    setError(''); 

    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status); 

      if (!response.ok) {
        const errorData = await response.text(); 
        console.error('Error:', errorData);
        setError('Registration failed: ' + (errorData || 'Please try again.'));
        setIsLoading(false);
        return;
      }

      const data = await response.json(); 
      console.log('Registration successful:', data);
      navigate('/signin.html');
    } catch (error) {
      console.error('There was an error registering the user:', error.message);
      setError('Failed to register user. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <section className="hero">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Hai, fă foamea cu noi!</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="input-wrapper">
              <img src={person} alt="person" className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder='Full Name'
                onFocus={(e) => addAutofillClass(e.target)} 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <img src={telephone} alt="telephone" className="input-icon" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Telephone"
                onFocus={(e) => addAutofillClass(e.target)} 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <img src={email} alt="email" className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="E-mail"
                onFocus={(e) => addAutofillClass(e.target)} 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <img src={lock} alt="lock" className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                onFocus={(e) => addAutofillClass(e.target)} 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <img src={lock} alt="lock" className="input-icon" />
              <input
                className="font"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                onFocus={(e) => addAutofillClass(e.target)} 
              />
            </div>
          </div>

          <div className="baka-div">
            <button className="button-login" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
