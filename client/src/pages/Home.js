import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {

    const [userData, setUserData] = useState([]);
    const [registerDOB, setRegisterDOB] = useState("");
    const [registerBio, setRegisterBio] = useState("");
    const expLevelOptions = [
        { value: '', text: '--Choose an option--' },
        { value: 'Beginner', text: 'Beginner' },
        { value: 'Intermediate', text: 'Intermediate' },
        { value: 'Advanced', text: 'Advanced' },
    ];
    const [registerExpLevel, setRegisterExpLevel] = useState(expLevelOptions[0].value);
    const handleExpChange = event => {
        console.log(event.target.value)
        setRegisterExpLevel(event.target.value);
    };
    //For Methods
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
    let navigate = useNavigate();

    const registerOauthUser = () => {
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
                _id: userData._id,
                dob: registerDOB,
                bio: registerBio,
                expLevel: registerExpLevel,
                methods: registerMethods
            },
            url: "/registerOauth"
        }).then((response) => navigate(`/profile/${response.data._id}`))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        async function fetchData() {
            await axios({
                url: 'http://localhost:3001/isLoggedIn',
                withCredentials: true
            })
                .then((response) => {
                    console.log(response);
                    setUserData(response.data);
                })
                .catch((error) => console.log(error));
        }
        fetchData();
    }, [])

    //If we get a JSON response from isLoggedIn and the user's data isnt complete, render a form to provide missing data.
    if (typeof userData !== "string" && !userData.dob) {
        return (
            <div>
                <h1>Hey, {userData.name}</h1>
                <h2>Tell us about yourself.</h2>
                <div>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" name="dob" min="1930-01-01" max="2008-12-31" onChange={e => setRegisterDOB(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="bio">Bio (Brief description about yourself)</label>
                    <textarea name="bio" id="bio" cols="30" rows="5" onChange={e => setRegisterBio(e.target.value)}></textarea>
                </div>
                <div>
                    <label htmlFor="expLevel">What's your experience level?</label>
                    <select name="expLevel" id="expLevel" value={registerExpLevel} onChange={handleExpChange}>
                        {expLevelOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.text}</option>
                        ))}
                    </select>
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
                <button onClick={registerOauthUser}>Submit</button>
            </div>
        )
    }

    return (
        <div>
            <h1>Spot Me</h1>
            <h2>Welcome!</h2>
            {typeof userData !== "string" &&
                <p>{`${userData.name}`}</p>
            }
            {typeof userData === "string" &&
                <div>
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
                </div >
            }
        </div >
    )
}

export default Home;