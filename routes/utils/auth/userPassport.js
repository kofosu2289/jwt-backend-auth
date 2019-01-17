const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const User = require('../../users/model/User');

const keys = "iAmBeCoMeDeAtH" || process.env.SECRET_KEY;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        /*
            {
                id: 123456,
                username: "hamsterlord",
                email: "hamster@lord.com",
                password: "abc123"
            }

        */
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err))
    }))
}