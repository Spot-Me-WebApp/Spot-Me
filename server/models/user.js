const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');


const imageSchema = {
    url: String,
    filename: String,
    position: Number
}

const userSchema = new Schema({

    //This will only exist for users who register with google or facebook. uri is a unique id associated with a user's google/facebook account
    uri: {
        type: String,
        required: false,
        unique: true
    },
    //This will only exist for users who register with google or facebook
    provider: {
        type: String,
        required: false,
        enum: ['google', 'facebook']
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false,
        unique: true
    },
    dob: {
        type: Date,
        required: false,
        unique: false
    },
    bio: {
        type: String,
        required: false,
        unique: false
    },
    expLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: false,
        unique: false
    },
    methods: {
        type: [String],
        //Example for now
        enum: ['Powerlifting', 'Calisthenics', 'Cardio', 'Bodybuilding', 'Olympic Lifting', 'Filming'],
        required: false,
        unique: false
    },
    images: [imageSchema]
})

//adds username and password fields to userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)