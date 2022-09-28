import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

function Profile() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userData, setUserData] = useState([]);
    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            await axios.get(`http://localhost:3001/getUser/${id}`)
                .then((response) => {
                    console.log(response)
                    setIsLoaded(true);
                    setUserData(response.data)
                })
                .catch((error) => {
                    setIsLoaded(true);
                    setError(error)
                    console.log(error)
                })
        }
        fetchData()
    }, [])

    const logoutUser = () => {
        axios({
            url: 'http://localhost:3001/logout',
            withCredentials: true
        }).then((response) => {
            console.log(response);
            if (response.data === null) {
                navigate('/')
            }
        }).catch((err) => console.log(err))
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>Hey, {userData.name}</h1>
                <h3>Here's your information</h3>
                <p>Username: {userData.username}</p>
                <p>Date of Birth: {userData.dob.slice(0, 10)}</p>
                {userData.methods.length > 0 &&
                    <div>Favorite types of exercise:
                        <ul>
                            {userData.methods.map(method => <p key={uuidv4()}>{method}</p>)}
                        </ul>
                    </div>
                }
                <p>Experience Level: {userData.expLevel}</p>
                <button onClick={logoutUser}>Logout</button>
            </div>
        )
    }
}

export default Profile