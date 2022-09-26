const User = require('./models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {

    //give instructions on how to store a user in the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    //give instructions on how to remove a user from the session
    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => {
            if (err) {
                done(null, false, { error: err });
            } else {
                done(null, user);
            }
        });
    });


    //Makes passport google-authentication work
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/oauth2/redirect/google"
    },
        async function (accessToken, refreshToken, profile, cb) {
            //If user already registered
            const registered = await User.findOne({ uri: profile.id }).count() > 0 ? true : false;

            if (registered) {
                const user = await User.findOne({ uri: profile.id });
                //console.log(user);
                return cb(null, user);
            }
            //If user not registered yet
            else {
                console.log(profile)
                const user = new User({
                    uri: profile.id,
                    provider: profile.provider,
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    username: profile.emails[0].value
                })
                user.save();
                return cb(null, user);
            }
        }
    ));


};