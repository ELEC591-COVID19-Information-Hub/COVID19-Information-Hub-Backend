const md5 = require('md5');
const {v4: uuid} = require('uuid');
const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./userSchema');

// let sessionUser = {};
let cookieKey = "sid";

// let userObjs = {};
// todo: update redis addr
const redis = require('redis').createClient("redis://:p3384f9050dcc31c341d827fbc269afc9682d98c51740333f7e4df1a930148fb9@ec2-3-220-161-139.compute-1.amazonaws.com:12269");

// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
//
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });
//
// passport.use(new GoogleStrategy({
//             clientID: '460405852651-rt87fg5moas7f38qhd31d26tba6g83fp.apps.googleusercontent.com',
//             clientSecret: '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',
//             callbackURL: "/auth/google/callback"
//         },
//         function (accessToken, refreshToken, profile, done) {
//             let user = {
//                 /*'email': profile.emails[0].value,
//                 'name' : profile.name.givenName + ' ' + profile.name.familyName,
//                 'id'   : profile.id,*/
//                 'token': accessToken
//             };
//             // You can perform any necessary actions with your user at this point,
//             // e.g. internal verification against a users table,
//             // creating new user entries, etc.
//
//             // return done(null, user);
//             User.findOrCreate({googleId: profile.id}, function (err, user) {
//                 if (err) {
//                     return done(err);
//                 }
//                 return done(null, user);
//             });
//         })
// );


function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }
    redis.hget('sessions', sid, (err, user) => {
        if (err)
            return res.sendStatus(401);

        const userObj = JSON.parse(user);

        if (userObj === null)
            return res.sendStatus(401);

        req.username = userObj.username;
        return next();
    });

}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    // let user = userObjs[username];
    //
    // if (!user) {
    //     return res.sendStatus(401)
    // }
    const userObj = await User.findOne({username: username});
    if (userObj.length === 0) {
        return res.sendStatus(404);
    }

    let hash = md5(userObj.salt + password);
    if (hash !== userObj.hash)
        return res.sendStatus(403);

    const sid = uuid()

    redis.hmset('sessions', sid, JSON.stringify(userObj));
    res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, httpOnly: true});
    return res.status(200).send({"username": username, "result": "success"});
}

async function register(req, res) {
    let usercheck = await User.find({username: req.body.username});
    if (usercheck.length !== 0) {
        return res.status(403).send({result: "Username already exists."});
    }
    let username = req.body.username;
    let password = req.body.password;


    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    // userObjs[username] = {salt: salt, hash: hash};

    let user = new User({username: username, salt: salt, hash: hash});

    await user.save();

    res.send({result: "success", username: username});


}


function logout(req, res) {
    let sid = req.cookies[cookieKey];
    redis.hdel('sessions', sid);
    delete req.cookies[cookieKey]
    res.send({result: "success"})
}


async function password(req, res) {
    let password = req.body.password;

    await User.findOneAndUpdate({username: req.username}, {password: password});
    res.send({result: "success", username: req.username})


}

module.exports = (app) => {
    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true
    }));

    // app.use(passport.initialize());
    // app.use(passport.session());

    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', password);

    // app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));
    //
    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: 'http://sh106frontend.surge.sh',
    //         failureRedirect: 'http://sh106frontend.surge.sh'
    //     }));
}