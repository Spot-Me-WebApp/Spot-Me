//Load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Import dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const User = require('./models/user')
const cors = require('cors')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const multer = require('multer')
const { storage, cloudinary } = require('./cloudinary');
const { response } = require('express');
const upload = multer({ storage })


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
//cors allows the backend to accept requests from frontend domain

app.use(cors({
    origin: 'http://192.168.1.151:19000',
    credentials: true,
    optionsSuccessStatus: 200 //Some old browsers dont accept default, 204
}));


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
app.use(flash());

//Import passport local, google, and facebook strategy config
require('./passportLocalConfig')(passport);
require('./passportGoogleConfig')(passport);
require('./passportFacebookConfig')(passport);

app.use(passport.initialize());
app.use(passport.session());

//Used to parse incoming requests
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))

//Set response headers for CORS
app.use((req, res, next) => {
    res.set({
        'Access-Control-ALlow-Headers': 'true',
        'Access-Control-Allow-Origin': 'http://192.168.1.151:19000',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    })
    next();
})

//MIDDLEWARES-------------------------------------------------------------------------------------------------------------------

//Routes-----------------------------------------------------------------------------------------------
//For local authentication
app.post('/login',
    passport.authenticate('local', { failureFlash: true, keepSessionInfo: true }),
    function (req, res) {
        res.send(req.user)
    });
//For local registration
app.post('/register', async (req, res) => {
    const userExists = await User.findOne({ username: req.body.username }).count() > 0 ? true : false;
    if (userExists) {
        return res.send("User already exists");
    }
    console.log(req.body)
    const { username, password, name, dob, bio, expLevel, methods, image } = req.body;
    const newUser = new User({ username, name, dob, bio, expLevel, methods });
    newUser.images.push(image);
    const registeredUser = await User.register(newUser, password);
    res.send(registeredUser)
})


//For providing a user's missing data after authentication with google or facebook.
app.post('/registerOauth', async (req, res) => {
    console.log(req.body)
    const { _id, dob, bio, expLevel, methods } = req.body;
    const user = await User.findById(_id);
    user.dob = dob;
    user.bio = bio;
    user.expLevel = expLevel;
    user.methods = methods;
    await user.save();
    return res.send(user);
})

app.get('/getUser/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user)
})

app.get('/isLoggedIn', (req, res) => {
    if (req.user) {
        res.json(req.user)
    } else {
        res.send("Couldn't get req.user")
    }
})

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return res.send(err); }
        res.json(req.user)
    })
})

//------------------------------------------------------GOOGLE OAUTH ROUTES-------------------------------------------------------
//When a user clicks the button to login with google, it will hit this route and then redirect to the route below this one
app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//Processes the authentication response and logs the user in
app.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000/', failureMessage: true, keepSessionInfo: true
}))
//------------------------------------------------------GOOGLE OAUTH ROUTES-------------------------------------------------------

//------------------------------------------------------FACEBOOK OAUTH ROUTES------------------------------------------------
app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/login',
    successRedirect: 'http://localhost:3000/', failureMessage: true, keepSessionInfo: true
}));
//------------------------------------------------------FACEBOOK OAUTH ROUTES------------------------------------------------


//------------------------------------------------------IMAGE UPLOAD & DELETE--------------------------------------------------
app.post('/image', async (req, res) => {
    await cloudinary.uploader.upload(req.body.image, {
        folder: "Spot-Me/"
    })
        .then((response) =>
            res.json({
                url: response.secure_url,
                filename: response.public_id.slice(response.public_id.indexOf('/') + 1) + '.' + response.format
            })
        )
        .catch((err) => console.log(err))
})

//Routes---------------------------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`);
})