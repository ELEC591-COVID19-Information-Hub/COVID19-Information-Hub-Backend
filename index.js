const express = require('express');
const MongoClient = require('mongodb').MongoClient; 
// const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;
const url = "mongodb://localhost:27017/comp539"; 


MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created");
    var dbase = db.db("Comp590");

    dbase.createCollection("newsPosts", function (err, res) {
        if (err) throw err;
        console.log("Collection newsPosts created");
    });

    dbase.createCollection("comments", function (err, res) {
        if (err) throw err;
        console.log("Collection comments created");
        db.close();
    });
});


app.get('/get_posts', function(req, res) {
    MongoClient.connect(url, function(err, db) { 
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var newsCollection = db.db("Comp590");
        var whereStr = {
            "sateName" : req.query.stateName,
            "date" : req.query.date
        }

        newsCollection.collection("newsPosts").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
})

app.post('/new_post', function(req, res) {
    MongoDB.connect(url, function(err, db) {
        if (err) throw err;

        var newsCollection = db.db("Comp590");
        var dataToAdd = {
            "stateName" : req.query.stateName,
            "date" : req.query.date,
            "content" : req.query.content,
            "publisher" : req.query.publisher,
            "newsID" : req.query.newsID
        }

        newsCollection.collection("newsPosts").insertOne(dataToAdd, function(err, res) {
            if (err) throw err;
            console.log("Inserted news/post successfully");
            // res.end("success");
            db.close();
        });
    });
}) 

app.get('/get_comments', function(req, res) {
    MongoClient.connect(url, function(err, db) { 
        if (err) throw err;
        console.log("Connected to MongoDB"); 

        var newsCollection = db.db("Comp590");
        var whereStr = {
            "newsID" : "123123123"
        }

        newsCollection.collection("comments").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result[0]);
            db.close();
        });
    });
})

app.post('/new_comment', function(req, res) {
    MongoDB.connect(url, function(err, db) {
        if (err) throw err;

        var newsCollection = db.db("Comp590");
        var dataToAdd = {
            "newsID" : req.query.newsID,
            "commentID" : req.query.commentID,
            "commenterName" : req.query.commenterName,
            "content" : req.query.content,
            "date" : req.query.date
        }

        newsCollection.collection("comments").insertOne(dataToAdd, function(err, res) {
            if (err) throw err;
            console.log("Inserted comment successfully");
            // res.end("success");
            db.close();
        });
    });
})

var server = app.listen(port, function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("Running on http://%s:%s", host, port)
})