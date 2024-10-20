import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import Loginform from './components/loginform/Loginform';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Loginform />} />
      </Routes>
    </Router>
  )
}

export default App