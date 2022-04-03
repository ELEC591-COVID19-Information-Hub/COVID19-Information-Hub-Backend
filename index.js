const express = require('express');
const { stringify } = require('querystring');
const MongoClient = require('mongodb').MongoClient; 
// const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;
const url = "mongodb://localhost:27017/comp539"; 

app.get('/post.html', function (req, res) {
    res.sendFile( __dirname + "/" + "post.html" );
});

app.get('/comment.html', function (req, res) {
   res.sendFile( __dirname + "/" + "comment.html" );
});

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


app.get('/get_posts', function(req, res) {
    MongoClient.connect(url, function(err, db) { 
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");
        var whereStr = {
            "sateName" : req.query.stateName,
            "date" : req.query.date
        };

        comp590DB.collection("newsPosts").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
});

app.get('/new_post', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        console.log(req.query.stateName);

        var comp590DB = db.db("Comp590");
        var dataToAdd = {
            "stateName" : req.query.stateName,
            "date" : req.query.date,
            "content" : req.query.content,
            "publisher" : req.query.publisher,
            "newsID" : req.query.newsID
        };

        console.log(stringify(dataToAdd));

        comp590DB.collection("newsPosts").insertOne(dataToAdd, function(err, res) {
            if (err) throw err;
            console.log("Inserted news/post successfully");
            db.close();
        });
    });

    res.end("Success");
});

app.get('/get_comments', function(req, res) {
    MongoClient.connect(url, function(err, db) { 
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var comp590DB = db.db("Comp590");
        var whereStr = {
            "newsID" : req.query.newsID
        };

        comp590DB.collection("comments").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
});

app.get('/new_comment', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        var comp590DB = db.db("Comp590");
        var dataToAdd = {
            "newsID" : req.query.newsID,
            "commentID" : req.query.commentID,
            "commenterName" : req.query.commenterName,
            "content" : req.query.content,
            "date" : req.query.date
        };

        comp590DB.collection("comments").insertOne(dataToAdd, function(err, res) {
            if (err) throw err;
            console.log("Inserted comment successfully");
            db.close();
        });
    });

    res.end("Success");
});

var server = app.listen(port, function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("Running on http://%s:%s", host, port)
});