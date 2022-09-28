import React, { useState } from "react"
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function Register() {

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerDOB, setRegisterDOB] = useState("");
    const [registerBio, setRegisterBio] = useState("");
    let navigate = useNavigate();

    //For experience level
    const expLevelOptions = [
        { value: '', text: '--Choose an option--' },
        { value: 'Beginner', text: 'Beginner' },
        { value: 'Intermediate', text: 'Intermediate' },
        { value: 'Advanced', text: 'Advanced' },
    ];

    const [registerExpLevel, setRegisterExpLevel] = useState(expLevelOptions[0].value);
    //For methods
    const methods = ['Lifting', 'Calisthenics', 'Cardio']
    const [checkedState, setCheckedState] = useState(
        new Array(methods.length).fill(false)
    );

    const handleMethodChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    const registerUser = () => {
        let registerMethods = [];
        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i] === true) {
                registerMethods.push(methods[i])
            } else continue;
        }
        axios({
            baseURL: "http://localhost:3001",
            method: 'post',
            data: {
                username: registerUsername,
                password: registerPassword,
                name: registerName,
                dob: registerDOB,
                bio: registerBio,
                expLevel: registerExpLevel,
                methods: registerMethods
            },
            url: "/register"
        }).then((response) => navigate(`/profile/${response.data._id}`))
            .catch((err) => console.log(err))
    }

    //_self means to open the window in the current tab.
    const authWithGoogle = () => window.open('http://localhost:3001/login/google', '_self')
    const authWithFacebook = () => window.open('http://localhost:3001/login/facebook', '_self')


    const handleChange = event => {
        console.log(event.target.value)
        setRegisterExpLevel(event.target.value);
    };

    return (
        <div>
            <div>
                {/* Google login button */}
                <button onClick={authWithGoogle} className="inputInfo" id="login-social-btn"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    width="24" height="24"
                    viewBox="4 -8 52 52"
                ><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg> Sign up with Google</button>
            </div>
            <div>
                {/* Facebook login button */}
                <button onClick={authWithFacebook} className="inputInfo" id="login-social-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="28" height="28"
                        viewBox="4 -12 56 56"
                    ><path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path></svg>
                    Sign Up with Facebook
                </button>
            </div>
            <h1>Sign Up</h1>
            <div>
                <label htmlFor="username">Username </label>
                {/* Stores whatever user inputs into registerUsername, the state value */}
                <input type="text" name="username" onChange={e => setRegisterUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password </label>
                {/* Stores whatever user inputs into registerPassword, the state value */}
                <input type="password" name="password" onChange={e => setRegisterPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="name">Your Name </label>
                <input type="text" name="name" onChange={e => setRegisterName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" name="dob" min="1930-01-01" max="2008-12-31" onChange={e => setRegisterDOB(e.target.value)} />
            </div>
            <div>
                <label htmlFor="bio">Bio (Brief description about yourself)</label>
                <textarea name="bio" id="bio" cols="30" rows="5" onChange={e => setRegisterBio(e.target.value)}></textarea>
            </div>
            {/* Exercise methods */}
            <div>
                <div>How do you like to exercise? (Select all that apply)</div>
                <ul>
                    {methods.map((name, index) => {
                        return (
                            <div key={index}>
                                <div>
                                    <input type="checkbox" name={name} id={`checkbox-${index}`} value={name} checked={checkedState[index]}
                                        onChange={() => handleMethodChange(index)} />
                                    <label htmlFor={`checkbox-${index}`}>{name}</label>
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </div>
            <div>
                <label htmlFor="expLevel">What's your experience level?</label>
                <select name="expLevel" id="expLevel" value={registerExpLevel} onChange={handleChange}>
                    {expLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.text}</option>
                    ))}
                </select>
            </div>
            <button onClick={registerUser}>Register</button>
        </div>
    )
}

export default Register