import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import backgroundImage from '../../assets/HomeBG.jpg'; // Import the image

function HomePage() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div 
            className="homepage-container" 
            style={{ backgroundImage: `url(${backgroundImage})` }} // Set background dynamically
        >
            <div className="content-wrapper">
                <h2>Welcome to Portfolio Tracker</h2>
                <p className="subtitle">Manage your investments with ease and precision.</p>
                <div className="button-container">
                    <button onClick={goToLogin}>Login</button>
                    <button onClick={goToSignup}>Signup</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;