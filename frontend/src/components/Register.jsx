import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);  // Added state for loading
  const [error, setError] = useState(''); // Added state for error handling

  const navigate = useNavigate();

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

    setIsLoading(true); // Set loading state to true
    setError(''); // Reset previous errors

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

      const data = await response.json(); // Get response data
      console.log('Registration successful:', data);
      navigate('/signin.html'); // Navigate to the login page after successful registration
    } catch (error) {
      console.error('There was an error registering the user:', error.message);
      setError('Failed to register user. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <section className="hero">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="label-container">Jenant... Fa-ti cont mai repede...</h1>

          {/* Error display */}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="label-container">Username:</label>
            <div className="input-wrapper">
              <img src={person} alt="person" className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label-container">Phone:</label>
            <div className="input-wrapper">
              <img src={telephone} alt="telephone" className="input-icon" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label-container">Email:</label>
            <div className="input-wrapper">
              <img src={email} alt="email" className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label-container">Password:</label>
            <div className="input-wrapper">
              <img src={lock} alt="lock" className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label-container">Confirm Password:</label>
            <div className="input-wrapper">
              <img src={lock} alt="lock" className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
