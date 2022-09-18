const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    dob: {
        type: Date,
        required: true,
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
        enum: ['Lifting', 'Calisthenics', 'Cardio'],
        required: false,
        unique: false
    },

})

//adds username and password fields to userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)