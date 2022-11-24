const mongoose = require('mongoose');


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
