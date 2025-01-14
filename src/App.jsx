import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage';
import Signup from './Components/SignUpPage/Signup';
import Login from './Components/LoginPage/Login';
import HoldingTable from './Components/Holdings/HoldingTable';
import Welcome from './Components/WelcomePage/Welcome';
import AddStocks from './Components/Stocks/AddStocks';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/holdings" element={<HoldingTable />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/addstock" element={<AddStocks />} />
        <Route path='/dashboard' element = {<Dashboard/>}/>
      </Routes>
    </div>

    
  );
  
}

export default App;
