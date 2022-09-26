import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
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
            <h1>Login</h1>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" onChange={e => setLoginUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button onClick={loginUser}>Login</button>
        </div>
    )
}

export default Login