import React, { useState, useEffect } from 'react';
import emailIcon from '../assets/images/mail.png';
import lockIcon from '../assets/images/lock.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setIsLoading(true);  
    setError(''); 

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
        console.log('User email:', formData.email);
        const { token } = result;
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        alert('Login failed. Please try again.');
        const error = await response.json();
        console.error('Login failed:', error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);  
    }
  };

  return (
    <section className="hero" autocomplete="off">
      <div className="login-container" autocomplete="off">
        <form onSubmit={handleSubmit} className="login-form" autocomplete="off">
          <h1>Loghează-te, chiorăie mațele!</h1>
          {error && <div className="error-message">{error}</div>}
          <p></p><p><p></p></p>
          <p></p>
          <div className="form-group" autocomplete="off">
            <div className="input-wrapper" autocomplete="off" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={emailIcon} alt="email" className="input-icon" autocomplete="off"/>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="E-mail"
                autocomplete="off"
              />
            </div>
          </div>
          <div className="form-group" autocomplete="off">
            <div className="input-wrapper" autocomplete="off" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={lockIcon} alt="lock" className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                autocomplete="off"
              />
            </div>
          </div>
          <div className="baka-div">
            <button className="button-login" type="submit" disabled={isLoading} >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
