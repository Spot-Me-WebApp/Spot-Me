import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Project Home</h1>
            {/* Link to Login.js */}
            <Link to={'./login'}>
                <button variant="raised">
                    Login
                </button>
            </Link>
            <Link to={'./register'}>
                <button variant="raised">
                    Sign Up
                </button>
            </Link>
        </div>
    )
}

export default Home;