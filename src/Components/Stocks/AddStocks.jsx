import React, { useEffect, useState } from "react";
import axios from "axios";
import './AddStocks.css'; // Import the CSS file

function AddStocks() {
  const [stocks, setStocks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [buyPrices, setBuyPrices] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch the list of stocks from the API
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing. Please log in.");
        }

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/stocks`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        });
        setStocks(response.data);

        // Initialize quantities and buyPrices with default values
        const initialQuantities = {};
        const initialBuyPrices = {};
        response.data.forEach((stock) => {
          initialQuantities[stock.uuid] = 1; // Default quantity is 1
          initialBuyPrices[stock.uuid] = ""; // Default buyPrice is empty
        });
        setQuantities(initialQuantities);
        setBuyPrices(initialBuyPrices);
      } catch (err) {
        setError("Failed to fetch stocks. Please try again later.");
      }
    };

    fetchStocks();
  }, []);

  const handleQuantityChange = (uuid, increment) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [uuid]: Math.max(1, (prevQuantities[uuid] || 1) + increment),
    }));
  };

  const handleBuyPriceChange = (uuid, value) => {
    setBuyPrices((prevBuyPrices) => ({
      ...prevBuyPrices,
      [uuid]: value,
    }));
  };

  const handleAddStock = async (uuid, stockname, ticker) => {
    try {
        // Check if Buy Price is empty
        if (!buyPrices[uuid]) {
            alert("Buy Price is a mandatory field. Please enter a value.");
            return; // Stop execution if Buy Price is empty
        }

        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authorization token is missing. Please log in.");
        }

        const username = extractUsernameFromToken(token);
        if (!username) {
            throw new Error("Failed to extract username from token.");
        }

        const payload = {
            username,
            stock: stockname,
            ticker,
            quantity: quantities[uuid],
            buyPrice: buyPrices[uuid],
        };

        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/holdings`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data === "Stock added successfully") {
            setSuccessMessage(`Stock ${stockname} added successfully!`);
            setError(null); // Clear any previous errors
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            // Handle structured error response
            setError(err.response.data.message);
        } else {
            setError(
                err.response?.status === 401
                    ? "Unauthorized: Please check your login credentials."
                    : "Failed to add stock. Please try again."
            );
        }
    }
};

  const extractUsernameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload
      console.log("Decoded Token Payload:", payload);

      // Adjust this to the actual key where the username is stored
      return payload.username || payload.sub || null;
    } catch (err) {
      console.error("Error decoding token: ", err.message);
      return null;
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-stocks-container">
      <h1 className="add-stocks-title">Available Stocks</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <table className="modern-table">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Buy Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.uuid}>
              <td>{stock.stockname}</td>
              <td>{stock.ticker}</td>
              <td>
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(stock.uuid, -1)}>
                    -
                  </button>
                  <span>{quantities[stock.uuid]}</span>
                  <button onClick={() => handleQuantityChange(stock.uuid, 1)}>
                    +
                  </button>
                </div>
              </td>
              <td>
                <input
                  type="number"
                  value={buyPrices[stock.uuid]}
                  onChange={(e) => handleBuyPriceChange(stock.uuid, e.target.value)}
                  placeholder="Enter buy price"
                  required
                />
              </td>
              <td>
                <button
                  className="add-stock-button"
                  onClick={() =>
                    handleAddStock(stock.uuid, stock.stockname, stock.ticker)
                  }
                >
                  Add Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddStocks;