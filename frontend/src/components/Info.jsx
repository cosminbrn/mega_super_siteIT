import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import chef from '../assets/images/chef.png';
import { useNavigate, Link } from 'react-router-dom';

function Info() {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to view this page');
            navigate('/signin.html');
            return;
        }

        const decoded = jwtDecode(token);
        const {userId} = decoded;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                console.log('Fetched user data:', data); 
                setUserData(data); 
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user info:', error.message);
                setError('naspa de tine nu a mers');
                setLoading(false);
            }
        }; 

        fetchUserData();
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>eroare boss lasa-te</div>
    }

    if (!userData) {
        return <div>No user data available</div>;
    } 
    const user = userData.user;

    const flexing = {
        display: 'flex',
    } 
    return (
        <div>
            <section className="hero">
                <div className="info-container">
                        <img src={chef} alt="Chef"></img>
                        <div className="info-group">
                            <strong>Name:</strong> { user.username }
                        </div>
                </div>
                <div className="info-container">
                    <h3>User Info</h3>
                        <div className="info-group">
                            <strong>Email:</strong> { user.email }
                        </div>
                        <div className="info-group">
                            <strong>Telephone:</strong> {user.phone || 'ma sincud nu merge'}
                        </div>
                        <div className="info-group">
                            <strong>Group:</strong> 313CA
                        </div>
                </div>
            </section>
        </div>
    );
}

export default Info;