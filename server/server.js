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
//const { createProxyMiddleware } = require('http-proxy-middleware')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


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
//cors allows the backend to accept requests from any domain (including the front end react app)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

//Requests to URLs with /api will go through proxy server first to bypass browser security issues
// app.use('/api/*', createProxyMiddleware({
//     target: "http://localhost:12345",
//     changeOrigin: true
// }))

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
//Import local strategy config
require('./passportLocalConfig')(passport);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/oauth2/redirect/google"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));


//Used to parse incoming requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//MIDDLEWARES-------------------------------------------------------------------------------------------------------------------

//Routes-----------------------------------------------------------------------------------------------

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }),
    function (req, res) {
        res.send(req.user)
    });

app.post('/register', async (req, res) => {
    if (User.findOne({ username: req.body.username }).count() > 0) {
        return res.send("User already exists");
    }

    const { username, password, name, dob, bio, expLevel } = req.body;
    const newUser = new User({ username, name, dob, bio, expLevel });
    const registeredUser = await User.register(newUser, password);
    res.send("You are logged in")
})

app.get('/getUser/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user)
})

//------------------------------------------------------GOOGLE OAUTH ROUTES-------------------------------------------------------
//When a user clicks the button to login with google, it will hit this route and then redirect to the route below this one
app.get('/login/google', passport.authenticate('google'));

//Processes the authentication response and logs the user in
app.get('/oauth2/redirect/google', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true })),
    function (req, res) {
        res.send(req.user);
    }
//------------------------------------------------------GOOGLE OAUTH ROUTES-------------------------------------------------------

//Routes---------------------------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`);
})