import React, { useState } from 'react';
import emailIcon from '../assets/images/mail.png';
import lockIcon from '../assets/images/lock.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [error, setError] = useState(''); // Error state for login failure
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
    setIsLoading(true);  // Set loading state to true
    setError(''); // Reset previous errors

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful:', result);
        const { token } = result;
        localStorage.setItem('token', token);  // Store token in localStorage
        navigate('/');  // Redirect to the home page after successful login
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);  // Reset loading state
    }
  };

  return (
    <section className="hero">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="label-container">Login NOW!!1!</h1>

          {/* Error display */}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="label-container">Email:</label>
            <div className="input-wrapper">
              <img src={emailIcon} alt="email" className="input-icon" />
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
              <img src={lockIcon} alt="lock" className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
