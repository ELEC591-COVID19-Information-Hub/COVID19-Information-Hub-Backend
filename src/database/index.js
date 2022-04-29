const {connect, connection} = require("mongoose");

const md5 = require("md5");
const userSchema = require("../models/userSchema");
const articleSchema = require("../models/articleSchema");
const dataSchema = require("../models/dataSchema")
const session = require("express-session");
const defaultHeadline = 'This is my headline'
// const uri = "mongodb+srv://root:thisiskey@jz-cluster.bcp4t.mongodb.net/dev-blog?retryWrites=true&w=majority";
const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""

connect(uri, (err) => {
    if (err) {
        console.error(err)
    }
})
const db = connection

db.on('error', (err) => {
    console.error(err)
})

db.once('open', () => {
})


async function GetProfileByUsername(username) {
    return userSchema.findOne({username: username})
}


async function GetUserByUsername(username) {
    return userSchema.findOne({username: username})
}

async function GetAllArticlesByUser(username) {
    return articleSchema.find({author: username})
}

async function GetAllArticlesMatchingUsername(usernames) {
    return articleSchema.find({author: {$in: usernames}}).sort({date: -1})
}

async function GetArticlesById(id) {
    return articleSchema.findOne({pid: id})

}

async function GetAllArticles() {
    return articleSchema.find()
}

async function GetArticleByState(state) {
    return articleSchema.find({state: state})
}

async function UpdateUserPassword(username, password) {
    let salt = md5(username + new Date().getTime());
    password = md5(salt + password);
    return userSchema.updateOne({username}, {
        $set: {
            password,
            salt
        }
    })
}

async function GetCovidDataByDate(date) {
    return dataSchema.find({date: date})
}

async function UpdateArticleComments(article) {
    return articleSchema.updateOne({pid: article.pid}, {
        $set: {comments: article.comments}
    })
}

async function UpdateArticleText(article) {
    return articleSchema.updateOne({pid: article.pid}, {
        $set: {text: article.text}
    })
}

module.exports = {
    GetProfileByUsername,
    GetUserByUsername,
    GetAllArticlesByUser,
    GetAllArticlesMatchingUsername,
    GetArticlesById, GetCovidDataByDate,
    GetArticleByState, GetAllArticles, UpdateUserPassword, UpdateArticleComments, UpdateArticleText
}