const express = require('express')
const app = express();
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


