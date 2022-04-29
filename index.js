const express = require('express')
const auth = require('./src/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

// todo: update mongoose address
const connectionString = 'mongodb+srv://new-user1:123@cluster0.rjizs.mongodb.net/backend?retryWrites=true&w=majority';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
auth(app);


const port = process.env.PORT || 3001;

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


