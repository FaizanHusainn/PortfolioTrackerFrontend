import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';
import backgroundImage from '../../assets/loginBG.jpg';



function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {   
            console.log("LInk : " +`${import.meta.env.VITE_REACT_APP_API_URL}`);
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login`, { userName: username, password: password });
            if (response.status === 200) {
                // Save the token in local storage
                localStorage.setItem('token', response.data);

                // Redirect to the welcome page
                navigate('/welcome');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div
            className="login-container"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="form-wrapper">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
