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

    const expLevelOptions = [
        { value: '', text: '--Choose an option--' },
        { value: 'Beginner', text: 'Beginner' },
        { value: 'Intermediate', text: 'Intermediate' },
        { value: 'Advanced', text: 'Advanced' },
    ];

    const [registerExpLevel, setRegisterExpLevel] = useState(expLevelOptions[0].value);
    // const [registerMethods, setRegisterMethods] = useState("");
    const registerUser = () => {
        axios({
            method: 'post',
            data: {
                username: registerUsername,
                password: registerPassword,
                name: registerName,
                dob: registerDOB,
                bio: registerBio,
                expLevel: registerExpLevel,
                //methods: registerMethods
            },
            withCredentials: true,
            url: "http://localhost:3001/register"
        }).then((response) => navigate(`/profile/${response.data._id}`))
            .catch((err) => console.log(err))
    }



    const handleChange = event => {
        console.log(event.target.value)
        setRegisterExpLevel(event.target.value);
    };

    return (
        <div>
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
            {/* <div>
                <legend>How do you like to exercise? (Select all that apply)</legend>
                <div>
                    <input type="checkbox" id="lifting" name="methods" value="Lifting" on />
                    <label for="lifting">Lifting</label>
                </div>
                <div>
                    <input type="checkbox" id="calisthenics" name="methods" value="Calisthenics" />
                    <label for="calisthenics">Calisthenics</label>
                </div>
                <div>
                    <input type="checkbox" id="cardio" name="methods" value="Cardio" />
                    <label for="cardio">Cardio</label>
                </div>
            </div> */}
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