import React, { useState } from 'react';
import emailIcon from '../assets/images/mail.png';
import lockIcon from '../assets/images/lock.png';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful:', result);
        // Handle successful login
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        // Handle login failure
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="hero">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="label-container">Login NOW!!1!</h1>

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

          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}

export default Login;
