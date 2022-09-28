import React, {useState, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


function Schedule() {
    const [date, setDate] = useState(new Date())
   
   
   
   return (
    <div className="app">
      <h1 className="header">Spot Me Scheduler</h1>
      <div className="calendar-container">
        <Calendar onChange={setDate} value={date}/>
      </div>
      <div className="text-center">
         Selected date: {date.toDateString()}
      </div>
    </div>
     )
   
   }
   
   export default Schedule;