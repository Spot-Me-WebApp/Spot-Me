import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Schedule from './pages/Schedule';

export default function App() {
  return (
    <div className='App'>
    <div className='navbar'>
    <nav>
      <Link to='/'>Home</Link> <Link to='/profile/:id'>Profile</Link> <Link>Menu</Link>
    </nav>
    </div>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
    </div>
  )
}


