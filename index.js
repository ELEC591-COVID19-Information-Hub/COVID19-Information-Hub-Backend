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


// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
