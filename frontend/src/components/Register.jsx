import React, { useState } from 'react';
import person from '../assets/images/person.png';
import telephone from '../assets/images/phone.png';
import email from '../assets/images/mail.png';
import lock from '../assets/images/lock.png';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Sending data:', formData);

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
        throw new Error(errorData || 'Registration failed');
      }

      const data = await response.json(); // Fa chestia care vine in JaSON
      console.log('Registration successful:', data);
      alert('User registered successfully!');
    } catch (error) {
      console.error('There was an error registering the user:', error.message);
      alert('Failed to register user. Please try again.');
    }
  };

  return (
    <section className="hero">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="label-container">Jenant... Fa-ti cont mai repede...</h1>

          <div className="form-group">
            <label className="label-container">Username:</label>
            <div className="input-wrapper">
              <img src={person} alt="person" className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
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
              />
            </div>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </section>
  );
}

export default Register;
