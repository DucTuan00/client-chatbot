import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import Loginform from './components/loginform/Loginform';
import {jwtDecode} from 'jwt-decode'

const App = () => {
  const [userName, setUserName] = useState(null); // State to hold logged-in user's name

  const handleUserLogin = (name) => {
    setUserName(name); // Update the username state when user logs in
  };

  useEffect(() => {
    // Check if user is logged in and set userName accordingly
    const token = localStorage.getItem('token');
    setUserName(token ? jwtDecode(token).user.name : null)
  }, [])

  return (
    <Router>
      <Navbar userName={userName} onUserLogin={handleUserLogin} />
      <Routes>
        <Route path='/' element={userName ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Loginform onUserLogin={handleUserLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
