import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import Loginform from './components/loginform/Loginform';

const App = () => {
  const [userName, setUserName] = useState(null); // State to hold logged-in user's name

  const handleUserLogin = (name) => {
    setUserName(name); // Update the username state when user logs in
  };

  const handleUserLogout = () => {
    setUserName(null); // Clear the username when user logs out
  };

  return (
    <Router>
      <Navbar userName={userName} onLogout={handleUserLogout} /> {/* Pass username and logout function to Navbar */}
      <Routes>
        <Route path='/home' element={userName ? <Home /> : <Navigate to='/login' />} /> {/* Redirect to login if not logged in */}
        <Route path='/login' element={<Loginform onUserLogin={handleUserLogin} />} />
        <Route path='/' element={<Navigate to='/login' />} /> {/* Redirect root path to login */}
      </Routes>
    </Router>
  );
};

export default App;
