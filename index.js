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
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}))
app.use(bodyParser.json())
app.use(cookieParser())
data(app)
app.get('/articles/:state?', article.getArticles)

auth(app);
app.put('/articles/:id', article.updateArticle)
app.post('/article', article.addArticle)

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


