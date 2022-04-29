const md5 = require('md5');
const {v4: uuid} = require('uuid');
const session = require('express-session');
const User = require('./userSchema');
let cookieKey = "sid";
// todo: update redis addr

const redis = require('redis').createClient(process.env.REDIS_URL ? process.env.REDIS_URL : "");
const redis_session_key = 'sessions';

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
    redis.hget(redis_session_key, sid, (err, user) => {
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

    const userObj = await User.findOne({username: username});
    if (!userObj || userObj.length === 0) {
        return res.sendStatus(404);
    }

    let hash = md5(userObj.salt + password);
    if (hash !== userObj.hash)
        return res.sendStatus(403);

    const sid = uuid()

    await redis.hmset(redis_session_key, sid, userObj.username);
    res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, httpOnly: true});
    return res.status(200).send({"username": username, "result": "success"});
}

async function register(req, res) {
    let usercheck = await User.find({username: req.body.username});
    if (!usercheck && usercheck.length !== 0) {
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
    redis.hdel(redis_session_key, sid);
    res.clearCookie(cookieKey);
    res.send({result: "success"})
}


async function password(req, res) {
    let password = req.body.password;
    if (!password || password === "") {
        return response.sendStatus(400)
    }
    await User.findOneAndUpdate({username: req.username}, {password: password});
    res.send({result: "success", username: req.username})
}

module.exports = (app) => {
    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true
    }));
    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', password);

}