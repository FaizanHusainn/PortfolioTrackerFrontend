import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../assets/holdingsBG.jpg';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
    const location = useLocation();
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        pan: '',
    });
    const [error, setError] = useState('');
    const username = location.state?.username || ''; // Retrieve username from navigation state
    const [holdings, setHoldings] = useState([]);

    console.log("Username in Dashboard: " + username);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User is not authenticated.');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setUserData({
                        userName: response.data.userName,
                        email: response.data.email,
                        pan: response.data.pan,
                    });
                }
            } catch (err) {
                setError('Failed to fetch user data.');
            }
        };

        if (username) {
            fetchUserData();
        } else {
            setError('No username provided.');
        }
    }, [username]);

    useEffect(() => {
        console.log("Holding table username: " + username);

        if (!username) {
            setError("Username not found. Please log in.");
            return;
        }

        const fetchHoldings = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                const response = await axios.get(`http://localhost:8080/holdings/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });
                setHoldings(response.data);
            } catch (err) {
                setError("Failed to fetch holdings. Please try again later.");
            }
        };

        fetchHoldings();
    }, [username]);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div
            className="dashboard-container"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                padding: '20px',
            }}
        >
            <div className="dashboard-content">
                <div className="user-info">
                    <h2 className="dashboard-title2">Dashboard</h2>
                    <div className="user-details">
                        <p><strong>Username:</strong> {userData.userName}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>PAN:</strong> {userData.pan}</p>
                    </div>
                </div>

                <div className="holdings-section">
                    <h3 className="holdings-title">Your Holdings</h3>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Ticker</th>
                                <th>Quantity</th>
                                <th>Buy Price</th>
                                <th>Realtime Price</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding) => (
                                <tr key={holding.id}>
                                    <td>{holding.stock}</td>
                                    <td>{holding.ticker}</td>
                                    <td>{holding.quantity}</td>
                                    <td>{holding.buyPrice}</td>
                                    <td>{holding.realtimePrice}</td>
                                    <td>{holding.totalValue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;