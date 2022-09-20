const User = require("./models/user");
const localStrategy = require("passport-local")

module.exports = function (passport) {
    passport.use(new localStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password !== password) { return done(null, false); }
                return done(null, user);
            });
        }
    ));
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
                username: user.username,
            };
            cb(err, userInformation);
        });
    });
};