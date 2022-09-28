const User = require('./models/user')
const FacebookStrategy = require('passport-facebook').Strategy;

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

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3001/auth/facebook/callback"
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
                    name: profile.displayName,
                    username: profile.displayName
                })
                user.save();
                return cb(null, user);
            }
        }
    ))
}