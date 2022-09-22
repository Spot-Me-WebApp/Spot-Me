import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Spot Me</h1>
            <h2>Welcome!</h2>
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