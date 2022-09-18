//Load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Import dependencies
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport');
const passportLocal = require("passport-local").Strategy;

//Database Connection-------------------------------------------------------------------------------
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Database connected");
});
//Database Connection---------------------------------------------------------------------------------

//MIDDLEWARES--------------------------------------------------------------------------------------------------------------
//cors lets the app accept requests from any domain(from frontend or backend)
app.use(cors({
    origin: "http://localhost:3000",  //react app url
    credentials: true
}))
app.use(session({
    secret: 'burgers',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //date.now gives milliseconds so this indicates that cookie will expire in one day
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//Used to parse incoming requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//MIDDLEWARES-------------------------------------------------------------------------------------------------------------------

//Routes-----------------------------------------------------------------------------------------------

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("That User Doesn't Exist")
        else {
            req.login(user, err => {
                if (err) throw err;
                res.send("You Are Logged In!")
                console.log(req.user)
            })
        }
    })(req, res, next);
})

app.post('/register', async (req, res) => {
    if (User.findOne({ username: req.body.username }).count() > 0) {
        throw error("User already exists");
    }

    const { username, password, name, dob, bio, expLevel } = req.body;
    const newUser = new User({ username, name, dob, bio, expLevel });
    const registeredUser = await User.register(newUser, password);
    res.send("You are logged in")
})
//Routes---------------------------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`);
})