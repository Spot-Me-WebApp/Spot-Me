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
const upload = multer({ storage })
const http = require("http").Server(app)
const PORT = 4000


//Socket.IO Connection ----------------------------------------------------------------------------

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "<http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log('user connected !');

    socket.on("createRoom", (roomName) => {
        socket.join(roomName);
        
        chatRooms.unshift({ id: generateID(), roomName, messages: [] });
        
        socket.emit("roomsList", chatRooms);
    });

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log('user disconnected !');
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

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

//Import passport local strategy config
require('./passportLocalConfig')(passport);

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

//For login through google/facebook
app.post('/login/oauth', async (req, res) => {
    const user = await User.findOne({ uri: req.body.uri })
    req.login(user, (err) => {
        if (err) { return res.send(err) }
        res.json(req.user)
    })
})
//For user registration
app.post('/register', async (req, res) => {
    const userExists = await User.findOne({ username: req.body.username }).count() > 0 ? true : false;
    if (userExists) {
        return res.send("User already exists");
    }
    console.log(req.body)
    const { username, password, name, dob, bio, expLevel, methods, imageData, provider, uri, gyms } = req.body;
    if (provider && uri) {
        const newUser = new User({ username, name, dob, bio, expLevel, methods, provider, uri });
        imageData.forEach(i => newUser.images.push(i))
        gyms.forEach(g => newUser.gyms.push(g))
        await newUser.save();
        return res.send(newUser)
    } else {
        const newUser = new User({ username, name, dob, bio, expLevel, methods });
        imageData.forEach(i => newUser.images.push(i))
        gyms.forEach(g => newUser.gyms.push(g))
        const registeredUser = await User.register(newUser, password);
        res.send(registeredUser)
    }
})


app.get('/getUser/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user)
})

app.put('/edituser', async (req, res) => {
    const { bio, expLevel, methods, imageData, id } = req.body;
    const user = await User.findById(id)
    await user.updateOne(
        { bio: bio, expLevel: expLevel }
    )
    //add new methods to user's methods array
    await user.updateOne({ $addToSet: { methods: methods } })
    //deletedMethods is an array with the user's methods that are not found in the inputted methods array
    const deletedMethods = user.methods.filter(el => !methods.includes(el))
    await user.updateOne({ $pull: { methods: { $in: deletedMethods } } })
    imageData.forEach(i => user.images.push(i))
    await user.save();
    const updatedUser = await User.findById(id)
    console.log(updatedUser)
    res.json(updatedUser)
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
//When a user clicks sign up with google
app.post('/register/google', async (req, res) => {

});

//Processes the authentication response and logs the user in

//------------------------------------------------------GOOGLE OAUTH ROUTES-------------------------------------------------------

//------------------------------------------------------FACEBOOK OAUTH ROUTES------------------------------------------------
app.get('/login/facebook', passport.authenticate('facebook'));


// //------------------------------------------------------FACEBOOK OAUTH ROUTES------------------------------------------------


//------------------------------------------------------IMAGE UPLOAD & DELETE--------------------------------------------------
app.post('/image', async (req, res) => {
    const responses = [];
    const uploadedImages = []
    req.body.images.forEach((img) => {
        const response = cloudinary.uploader.upload(img.uri, {
            folder: "Spot-Me/"
        })
        responses.push(response);
        //response is a promise for the individual API call.
    })
    await Promise.all(responses)
        .then((response) => {
            console.log('all promises resolved')
            response.map((r, i) => uploadedImages.push({ url: r.secure_url, filename: r.public_id.slice(r.public_id.indexOf('/') + 1) + '.' + r.format, position: req.body.images[i].position }))
        })
        .catch((err) => console.log(err))
    //Promise.all turns the array of promises into one promise
    console.log(uploadedImages)
    res.send(uploadedImages)
})

app.put('/image', async (req, res) => {
    const user = await User.findById(req.body.id)
    const newImages = req.body.images.filter(i => i.isNew);
    for (let img of user.images) {
        const inputImg = req.body.images.find(element => element.position === img.position)
        //if user has image with position x, and req.body.images doesn't have img with position x OR 
        //img with position x isNew, then delete that image from cloudinary and database
        if (!inputImg || inputImg.isNew) {
            await cloudinary.uploader.destroy("Spot-Me/" + img.filename.substring(0, img.filename.indexOf('.')));
            await user.updateOne({ $pull: { images: { position: img.position } } });
            await user.save();
        }
    }
    //Upload new images
    const responses = [];
    const uploadedImages = [];
    newImages.forEach((img) => {
        const response = cloudinary.uploader.upload(img.uri, {
            folder: "Spot-Me/"
        })
        responses.push(response);
    })
    await Promise.all(responses)
        .then((response) => {
            console.log('all promises resolved')
            response.map((r, i) => uploadedImages.push({ url: r.secure_url, filename: r.public_id.slice(r.public_id.indexOf('/') + 1) + '.' + r.format, position: newImages[i].position }))
        })
        .catch((err) => console.log(err))
    console.log(uploadedImages)
    res.send(uploadedImages)
})

//Routes---------------------------------------------------------------------------------------------------

app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`);
})