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


    const handleChange = event => {
        console.log(event.target.value)
        setRegisterExpLevel(event.target.value);
    };

    return (
        <div>
            <button onClick={authWithGoogle}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg> Sign up with Google</button>
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