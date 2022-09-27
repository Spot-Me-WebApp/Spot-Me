import React, { useState } from 'react';
import TinderCard from "react-tinder-card";
import './ProfileCards.css';

function ProfileCards() {

    const [user, setUser] = useState([
        {
            name: 'Sara',
            age: '22',
            expLevel: 'Advanced',
            url: 'https://preview.redd.it/hhrdzccz03291.jpg?width=1080&format=pjpg&auto=webp&s=2993170814049169cba8602cbf507b89a63ac5c8'
        },
    ]);
    

  return (
    <div>
        {user.map((user)=> (
            <TinderCard
                className="swipe"
                key={user.name}
                preventSwipe={['up', 'down']}
            
            >
                <div 
                style={{ backgroundImage: `url(${user.url})` }}
                className='card'>
                    <h3>{user.name}</h3>
                </div>
            </TinderCard>
        ))}
    </div>
  )
}

export default ProfileCards