import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function Login() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    let navigate = useNavigate();

    const loginUser = () => {
        axios({
            method: "post",
            data: {
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "http://localhost:3001/login"
        }).then((response) => navigate(`/profile/${response.data._id}`))
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <h1>SPOT ME</h1>
            <div className='loginBlock'>
                <label htmlFor="username"></label>
                <input className="inputInfo" type="text" id="username" name="username" placeholder="Username" onChange={e => setLoginUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password"></label>
                <input className="inputInfo" type="password" name="password" id="password" placeholder="Password" onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button className='loginButton' onClick={loginUser}>LOG IN</button>
            <div className="registerButton">Don't have an account? <Link to={'/register'}>SIGN UP</Link></div>
        </div>
    )
}

export default Login