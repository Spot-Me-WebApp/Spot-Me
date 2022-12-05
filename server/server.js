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
const { Server } = require('socket.io')
const { PriorityQueue } = require('./PriorityQueue');


//Socket.IO Connection ----------------------------------------------------------------------------


const io = new Server({
    path: '/socket.io/',
    cors: {
        origin: ['http://192.168.1.151:19000'],
        credentials: true,
    },
})

io.listen(process.env.SOCKET_PORT)

io.on("connection", (socket) => {
    console.log(`${socket.id} user just connected!`);

    socket.on("createRoom", (roomName) => {
        socket.join(roomName);
        console.log(roomName)
        // Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: generateID(), name: roomName, messages: [] });
        //Returns the updated chat rooms via another event
        socket.emit("roomsList", chatRooms);
    });

    socket.on("findRoom", (id) => {
        const result = chatRooms.filter(room => room.id === id)
        socket.emit("foundRoom", result[0].messages)
    })

    socket.on("newMessage", (data) => {
        const { room_id, message, user, timestamp } = data;

        //Finds the room where the message was sent
        const result = chatRooms.filter((room) => room.id === room_id);

        //Create the data structure for the message
        const newMessage = {
            id: generateID(),
            text: message,
            user,
            time: `${timestamp.hour}:${timestamp.mins}`,
        };
        //Updates the chatroom messages
        socket.to(result[0].name).emit("roomMessage", newMessage);
        result[0].messages.push(newMessage);

        //Trigger the events to reflect the new changes
        socket.emit("roomsList", chatRooms);
        socket.emit("foundRoom", result[0].messages);
    });

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("A user disconnected");
    });
})

const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [
    {
        id: generateID(),
        name: "Novu Hangouts",
        messages: [
            {
                id: generateID(),
                text: "Hello guys, welcome!",
                time: "07:50",
                user: "Tomer",
            },
            {
                id: generateID(),
                text: "Hi Tomer, thank you! 😇",
                time: "08:50",
                user: "David",
            },
        ],
    }
];



app.get('/getChatRooms', (req, res) => {
    res.json(chatRooms)
})





//Socket.IO Connection ----------------------------------------------------------------------------


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
    const { bio, expLevel, methods, imageData, id, gyms } = req.body;
    const user = await User.findById(id)
    await user.updateOne(
        { bio: bio, expLevel: expLevel }
    )
    //add new methods to user's methods array
    await user.updateOne({ $addToSet: { methods: methods } })
    //add new gyms to user's gyms array
    await user.updateOne({ $addToSet: { gyms: gyms } })
    //deletedMethods is an array with the user's methods that are not found in the inputted methods array
    const deletedMethods = user.methods.filter(el => !methods.includes(el))
    await user.updateOne({ $pull: { methods: { $in: deletedMethods } } })
    //deletedGyms is an array with the user's gyms that are not found in the inputted gyms array
    const deletedGyms = user.gyms.filter(el => !gyms.includes(el))
    await user.updateOne({ $pull: { gyms: { $in: deletedGyms } } })
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

//------------------------------------------------------Match Making-------------------------------------------------------
app.get('/getQueue', async (req, res) => {
    //Search database for users whose gyms are within certain distance of current user and add points for that
    //give more points for users who are extra close
    //add points for shared passions and experience level
    //add users to priority queue with users having the most points getting the most priority
    //***10miles is 0.1429 degrees */
    const currentUserGyms = req.user.gyms;
    const cardStack = new PriorityQueue();
    let userPointsRanking = [];
    //Find users who goes to a gym within a 10 mile radius of one of the gyms that the current user goes to 
    for (let gym of currentUserGyms) {
        const results = await User.find({
            gyms: { $elemMatch: { latitude: { $gte: gym.latitude - 0.1429, $lte: gym.latitude + 0.1429 }, longitude: { $gte: gym.longitude - 0.1429, $lte: gym.longitude + 0.1429 } } }
        })
        //all these users initially have 0 points
        results.forEach(res => {
            if (!userPointsRanking.some(el => el.user._id.equals(res._id)) && !res._id.equals(req.user._id)) {
                userPointsRanking.push({ user: res, points: 0 })
            }
        })
    }

    for (let element of userPointsRanking) {
        //if the user has a gym in common with the current user, add 3 points
        if (element.user.gyms.some(el => currentUserGyms.includes(el))) {
            element.points += 6;
        }
        //for each method they have in common, add 1 point
        element.user.methods.forEach(m => {
            if (req.user.methods.includes(m)) { element.points += 1; }
        })
        const ageDifference = Math.abs(req.user.dob.getFullYear() - element.user.dob.getFullYear())
        if (ageDifference <= 4) {
            element.points += -0.2 * ageDifference + 1;
        }
        if (req.user.expLevel === element.user.expLevel) { element.points += 1; }
        cardStack.enqueue(element.user, element.points);
    }
    res.json(cardStack);
})

app.post('/handleSwipe', async (req, res) => {
    const { swipedUser, isRightSwipe } = req.body;
    const currUser = await User.findById(req.user._id)
    const swipedUserDocument = await User.findById(swipedUser._id);
    //If you swipe right on someone who already swiped right on you, it's a match. Add each user to the other's matches array.
    if (isRightSwipe && swipedUserDocument.rightSwipes.includes(req.user._id)) {
        await currUser.updateOne({ $addToSet: { matches: swipedUser._id } })
        await swipedUserDocument.updateOne({ $addToSet: { matches: req.user._id } })
        return res.send({ matched: true })
    }
    //If you swipe right on someone and they haven't swiped right on you, add them to the current user's right swipes array
    else if (isRightSwipe && !swipedUser.rightSwipes.includes(req.user._id)) {
        await currUser.updateOne({ $addToSet: { rightSwipes: swipedUser._id } })
        return res.send(`${swipedUser.name} added to right swipes`)
    }
    //If you swipe left on someone, add them to current user's left swipes array
    else {
        await currUser.updateOne({ $addToSet: { leftSwipes: swipedUser._id } })
        return res.send(`${swipedUser.name} added to left swipes`)
    }
})



//------------------------------------------------------Match Making-------------------------------------------------------

//-----------------------------------------------------SCHEDDULING---------------------------------------------------------


app.post('/sendGymRequest', async (req, res) => {
    const { requestRecipient } = req.body;
    const curr = await User.findById(req.user._id);
    const recipientId = await User.findById(req.user._id);


})

app.get('/getGymRequests', async (req, res) => {
    
})

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