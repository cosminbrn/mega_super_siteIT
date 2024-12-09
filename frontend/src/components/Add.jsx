import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import upload_button from '../assets/images/upload_button.png';

function Add() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: 3, 
        image: null, 
        author: '', 
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin.html');
            return;
        }

        const decoded = jwtDecode(token);
        const { userId } = decoded; 

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setFormData((prevData) => ({
                    ...prevData,
                    author: userData.user.username, 
                }));
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0], 
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError('');

        const formDataToSend = new FormData(); 

   
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('rating', formData.rating);
        formDataToSend.append('author', formData.author);

       
        if (formData.image) {
            formDataToSend.append('image', formData.image); 
        }

        try {
            const response = await fetch('http://localhost:3000/recipe', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error:', errorData);
                setError('Upload failed: ' + (errorData || 'Please try again.'));
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Upload successful:', data);
        } catch (error) {
            console.error('There was an error uploading the recipe:', error.message);
            setError('Failed to upload recipe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero">
            <div className="add-container">
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="add-group">
                        
                        <div className="input-wrapper">
                            <input
                                name="title"
                                placeholder='Recipe name:'
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="add-group">
                        <div className="input-wrapper">
                            <input
                                placeholder='Description:'
                                name="description"
                                value={formData.description} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="add-group">
                        
                        <label htmlFor="image-upload" className="image-label">
                            <img src={upload_button} alt="Click to upload" className="upload-image" />
                        </label>
                        <input 
                            type="file" 
                            id="image-upload" 
                            className="hidden-input" 
                            accept="image/*" 
                            name="image"
                            onChange={handleChange}
                        />
                        
                    </div>

                    <button type="submit" disabled={isLoading} className="button-login">
                        {isLoading ? 'Submitting...' : 'Add recipe'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Add;
