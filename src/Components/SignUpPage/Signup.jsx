import React, { useState } from 'react';
import axios from 'axios';
import './SignupStyle.css';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import backgroundImage from '../../assets/loginBG.jpg'; // For the circular loader

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [pan, setPan] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const navigate = useNavigate();

    // Validate PAN (10 characters and uppercase)
    const validatePAN = (pan) => {
        return pan.length === 10 && /^[A-Z0-9]+$/.test(pan);
    };

    // Validate username (no spaces)
    const validateUsername = (username) => {
        return !username.includes(' ');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgressMessage('Creating An Account And Adding Stocks ...');

        // Validate PAN
        if (!validatePAN(pan)) {
            setError('PAN must be exactly 10 characters long and contain only uppercase letters and numbers.');
            setLoading(false);
            return;
        }

        // Validate username
        if (!validateUsername(username)) {
            setError('Username cannot contain spaces.');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Signup the user
            const signupResponse = await axios.post('http://localhost:8080/user/add', {
                userName: username,
                password: password,
                email: email,
                pan: pan.toUpperCase(), // Convert PAN to uppercase
            });

            if (signupResponse.status === 200) {
                setProgressMessage('Account created! Adding stocks...');

                // Step 2: Save the token in local storage
                localStorage.setItem('token', signupResponse.data);

                // Step 3: Call the stocks API with the username
                const token = localStorage.getItem('token');

                setSuccess('Signup successful! Redirecting to the dashboard...');
                setTimeout(() => {
                    navigate('/welcome'); // Redirect to the welcome page
                }, 2000);
            }
        } catch (err) {
            console.error('Error during API call:', err.response ? err.response.data : err.message);

            // Handle specific error messages
            if (err.response && err.response.data) {
                if (err.response.status === 409) {
                    // Username already exists
                    setError('Username already exists. Please choose a different username.');
                } else if (err.response.data.message === "Alpha Vantage API Limit Exhausted") {
                    // API limit exhausted
                    setError('Alpha Vantage API Limit Exhausted. Please try again tomorrow.');
                } else {
                    // Other errors
                    setError(err.response.data.message || 'Signup failed. Please try again.');
                }
            } else {
                // Network or other errors
                setError('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            alignContent: 'center',
            justifyContent: 'center'
        }}>
            <div className="Signup-container">
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} // Remove spaces
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>PAN</label>
                        <input
                            type="text"
                            value={pan}
                            onChange={(e) => setPan(e.target.value.toUpperCase())} // Convert to uppercase
                            maxLength={10} // Limit to 10 characters
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <CircularProgress /> {/* Circular loader */}
                            <p>{progressMessage}</p> {/* Progress message */}
                        </div>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Signup'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;