import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Add() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: 0, 
        image: null, // Change from string to null for file handling
        author: '', 
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not authenticated. Redirecting to sign-in...');
            navigate('/signin.html');
            return;
        }

        const decoded = jwtDecode(token);
        const { userId } = decoded; // Extract userId from token

        // Fetch user data
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
                    author: userData.user.username, // Assuming the response has 'username'
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
            // Handle file input change
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0], // Set the first file
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

        const formDataToSend = new FormData(); // Use FormData to send the file

        // Append form fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('rating', formData.rating);
        formDataToSend.append('author', formData.author);

        // Append the file
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
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1 className="label-container">Add Recipe</h1>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label className="label-container">Title:</label>
                        <div className="input-wrapper">
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-container">Description</label>
                        <div className="input-wrapper">
                            <input
                                name="description"
                                value={formData.description} 
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-container">Upload Image</label>
                        <div className="input-wrapper">
                            <input
                                type="file" // Change to type="file"
                                name="image"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Add;
