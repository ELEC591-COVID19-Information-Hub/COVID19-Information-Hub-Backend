const express = require("express");
const process = require("process");
const auth = require('./src/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const article = require("./src/article");
const data = require("./src/data")
const app = express()
// TODO: determine front-end address
// app.use(cors({
//     origin: '',
//     credentials: true,
// }))
app.use(bodyParser.json())
app.use(cookieParser())
data(app)
auth(app);
article(app)
app.get('/', (req, resp) => {
    resp.send('test')
})

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    const addr = server.address();
    if (addr != null) {
        const address = addr
        // // if (addr as AddressInfo)
        console.log(`Server listening at https://${address.address}:${address.port}`)
    }
});


