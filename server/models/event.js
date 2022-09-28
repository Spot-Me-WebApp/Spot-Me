const mongoose = require('mongoose');
const { Schema } = mongoose;



const eventSchema = new Schema({
    
    name: {
        type: userSchema,
        required: true
    },
    gym: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        unique: false
    },
    

})

