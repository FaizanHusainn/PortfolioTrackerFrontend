import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from '../../assets/holdingsBG.jpg';
import './HoldingTable.css'; // Import the CSS file

function Holdings({ username }) {
  const [holdings, setHoldings] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Holding table username : " + username);

    if (!username) {
      setError("Username not found. Please log in.");
      return;
    }

    const fetchHoldings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/holdings/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token
            },
          }
        );
        setHoldings(response.data);
      } catch (err) {
        setError("Failed to fetch holdings. Please try again later.");
      }
    };

    fetchHoldings();
  }, [username]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/holdings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      // Remove the row locally after successful API call
      setHoldings((prevHoldings) =>
        prevHoldings.filter((holding) => holding.id !== id)
      );
    } catch (err) {
      setError("Failed to delete holding. Please try again later.");
    }
  };

  const handleCalculatePortfolioValue = async () => {
    setLoading(true); // Show loader
    setError(null); // Reset error

    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/holdings/get-portfolio-value/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );
      setPortfolioValue(Number(response.data).toFixed(2)); // Round the value to 4 digits
    } catch (err) {
      setError("Failed to calculate portfolio value. Please try again later.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  const goToAddStock = () => {
    navigate("/addstock");
  };

  const goToAddDashboard = () => {
    navigate("/dashboard", { state: { username } }); // Pass username in the navigation state
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div
      className="holdings-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        padding: '20px',
      }}
    >
      <header className="header">
        <h1 className="holdings-header">User Holdings</h1>
        <div className="button-group">
          <button className="modern-button" onClick={goToAddStock}>Add Stock</button>
          <button className="modern-button" onClick={goToAddDashboard}>Dashboard</button>
          <button style={{background : 'red'}} className="modern-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <table className="modern-table">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Ticker</th>
            <th>Buy Date</th>
            <th>Quantity</th>
            <th>Buy Price</th>
            <th>Realtime Price</th>
            <th>Total Value</th>
            <th>Remove Stocks</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id}>
              <td>{holding.stock}</td>
              <td>{holding.ticker}</td>
              <td>{holding.date}</td>
              <td>{holding.quantity}</td>
              <td>{holding.buyPrice.toFixed(2)}</td>
              <td>{holding.realtimePrice.toFixed(2)}</td>
              <td>{holding.totalValue.toFixed(2)}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(holding.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="portfolio-value-section">
        <button
          className="modern-button"
          onClick={handleCalculatePortfolioValue}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Portfolio Value"}
        </button>
        {portfolioValue && (
          <div className="portfolio-value-display">
            <h3>Portfolio Value:</h3>
            <span className="portfolio-value">${portfolioValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Holdings;