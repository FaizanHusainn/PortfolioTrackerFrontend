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

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgressMessage('Creating an account...');

        try {
            // Step 1: Signup the user
            const signupResponse = await axios.post('http://localhost:8080/user/add', {
                userName: username,
                password: password,
                email: email,
                pan: pan,
            });

            if (signupResponse.status === 200) {
                setProgressMessage('Account created! Adding stocks...');

                // Step 2: Save the token in local storage
                localStorage.setItem('token', signupResponse.data);

                // Step 3: Call the stocks API with the username
                const token = localStorage.getItem('token'); // Retrieve the token
                const stocksResponse = await axios.post(
                    `http://localhost:8080/stocks/${username}`,
                    {}, // Request body (if required)
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the headers
                        },
                    }
                );

                if (stocksResponse.status === 200) {
                    setSuccess('Signup successful! Redirecting to the dashboard...');
                    setTimeout(() => {
                        navigate('/welcome'); // Redirect to the welcome page
                    }, 2000); // Wait 2 seconds before redirecting
                }
            }
        } catch (err) {
            console.error('Error during API call:', err.response ? err.response.data : err.message);
            setError('Signup failed. Please try again.');
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
            alignContent : 'center',
            justifyContent : 'center'
            
        }}>
        <div className="Signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPan(e.target.value)}
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

            {/* Temporary button to test the stocks API independently */}
            {/* <button
                type="button"
                onClick={async () => {
                    try {
                        const token = localStorage.getItem('token'); // Retrieve the token
                        const response = await axios.post(
                            `http://localhost:8080/stocks/${username}`,
                            {}, // Request body (if required)
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Include the token in the headers
                                },
                            }
                        );
                        console.log('Stocks API response:', response.data);
                    } catch (err) {
                        console.error('Stocks API error:', err.response ? err.response.data : err.message);
                    }
                }}
                style={{ marginTop: '20px' }}
            >
                Test Stocks API
            </button> */}
        </div>
        </div>
    );
}

export default Signup;