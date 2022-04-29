<<<<<<< HEAD
const express = require('express')
const auth = require('./src/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

// todo: update mongoose address
const connectionString = 'mongodb+srv://new-user1:123@cluster0.rjizs.mongodb.net/backend?retryWrites=true&w=majority';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});


=======
const express = require('express');
const { stringify } = require('querystring');
const MongoClient = require('mongodb').MongoClient; 
>>>>>>> origin/wenbo
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
auth(app);


const port = process.env.PORT || 3001;
const url = "mongodb://localhost:27017/comp539"; 


const url = "mongodb://localhost:27017"; 
const MongoClient = require('mongodb').MongoClient; 


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/texas', (req, res) => {

    MongoClient.connect(url, function(err, db) { 
        if (err) throw err; 
        console.log("Connected to MongoDB!"); 
        var covidData = db.db("Comp590").collection("Covid_Data");
        var whereStr = {"state" : "Texas", "date" : "2020-02-18"};

        covidData.find(whereStr).toArray(function(err,result) { 
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close(); 
        });

    });

});



// Frontend send JSON data to backend
app.use(express.json());

// // Create the database and collections
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log("Database created");
//     var dbase = db.db("Comp590");

//     dbase.createCollection("newsPosts", function (err, res) {
//         if (err) throw err;
//         console.log("Collection newsPosts created");
//     });

//     dbase.createCollection("comments", function (err, res) {
//         if (err) throw err;
//         console.log("Collection comments created");
//         db.close();
//     });
// });

// Current states news topic list. need: [stateName, date]
app.get('/get_news_topics', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Connected to MongoDB");

        var comp590DB = db.db("Comp590");

        // current state
        var state = {
            "stateName" : req.body.stateName
        };

        var options = {
            // project only topic, ID, and date
            projection : {
                '_id': 1,
                'topic' : 1,
                'date' : 1
            }
        }

        comp590DB.collection("newsPosts").find(state, options).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
});


// Get the news data, classified by sateName and date, need: [stateName, date]
app.get('/get_news_date', function(req, res) {
    MongoClient.connect(url, function(err, db) { 
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");
        var whereStr = {
            "sateName" : req.body.stateName,
            "date" : req.body.date
        };

        comp590DB.collection("newsPosts").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
});


// Submit new post, need: [stateName, topic, date, content, publisher]
app.post('/new_news', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var comp590DB = db.db("Comp590");

        var dataToAdd = {
            "stateName" : req.body.stateName,
            "topic" : req.body.topic,
            "date" : req.body.date,
            "content" : req.body.content,
            "publisher" : req.body.publisher,
            // "newsID" : req.body.newsID
        };

        // console.log(stringify(dataToAdd));

        comp590DB.collection("newsPosts").insertOne(dataToAdd, function(err, result) {
            if (err) throw err;
            console.log("Inserted news/post successfully");
            // return new news' _id
            res.json(result["insertedId"]);
            db.close();
        });
    });
});


// Current news' comment list, need: [newsID]
app.get('/get_comments', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");

        // the current news' id
        var newsIDToFind = {
            // news' ID
            "newsID" : req.body.newsID
        };

        comp590DB.collection("comments").find(newsIDToFind).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
});


// Submit a new comment, need: [newsID, commenterName, content, date, isResponse, replyTo]
// if this is a comment replying to another comment, the <isResponse> should be true, the <replyTo> is 
// the commentID of the comment that is replied.
// Or the <isResponse> should be false and <replyTo> is ignored.
app.put('/new_comment', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");
        var dataToAdd = {
            "newsID" : req.body.newsID,
            // "commentID" : req.body.commentID,
            "commenterName" : req.body.commenterName,
            "content" : req.body.content,
            "date" : req.body.date,
            "isResponse" : req.body.isResponse,
            // Empty if isResponse is false
            "replyTo" : req.body.replyTo
        };

        // console.log(stringify(dataToAdd));

        comp590DB.collection("comments").insertOne(dataToAdd, function(err, result) {
            if (err) throw err;
            console.log("Inserted comment successfully");
            // return new comment's _id
            res.json(result["insertedId"]);
            db.close();
        });
    });
});

// Current comment's response list.
app.get('/get_responses', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");
        var responseToFind = {
            "newsID" : req.body.newsID,
            "isResponse" : req.body.replyTo,
            // to which comment's id you reply
            "replyTo" : req.body.replyTo
        };

        comp590DB.collection("comments").find(responseToFind).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });        
    });
});


// Run the server
var server = app.listen(port, function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("Running on http://%s:%s", host, port)
});