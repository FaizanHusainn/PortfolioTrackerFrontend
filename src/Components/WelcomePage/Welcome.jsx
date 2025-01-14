import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'
import HoldingTable from '../Holdings/HoldingTable';


function Welcome() {
    const [username, setUsername] = useState('');
    console.log(username);

    useEffect(() => {
        // Fetch the token from local storage
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token to get the username
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.sub); // Assuming the username is stored in the "sub" claim
        }
    }, []);

    return (
        <div>
              {/* Pass the username to the HoldingsTable component */}
               {/* Render the HoldingTable only if username is available */}
            {username && <HoldingTable username={username} />}
    
        </div>
    );
}

export default Welcome;
