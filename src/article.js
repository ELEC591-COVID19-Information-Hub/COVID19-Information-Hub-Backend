const {GetAllArticles, GetArticleByState, GetArticlesById, UpdateArticleComments, UpdateArticleText} = require("./database");
const articleSchema = require("./models/articleSchema");

async function getArticles(req, response) {

    if (req.params.state) {
        // Get article by state
        GetArticleByState(req.params.state).then((articles) => {
            if (articles === null) {
                response.status(404).send({articles: []})
                return
            }
            response.send(articles);
        })
    } else {
        GetAllArticles().then((articles) => {
            if (articles === null) {
                response.status(404).send({articles: []})
                return
            }
            response.send(articles);
        })
    }
}

async function addArticle(req, response) {
    let text = req.body.text
    if (!text) {
        return response.sendStatus(400)
    }
    let post = new articleSchema({
        author: req.username,
        comments: [],
        date: new Date(),
        title: req.body.title,
        text: text,
        state: req.body.state
    })
    await post.save().then((res) => {
        if (res) {
            response.send({articles: [res]})
        }
    }).catch(err => {
        if (err) {
            console.error(err)
        }
    })
}

function updateArticle(req, response) {
    if (!req.params.id) {
        return response.status(400)
    }
    if (!req.body.text) {
        return response.status(400)
    }
    GetArticlesById(parseInt(req.params.id)).then(article => {
        if (article === null) {
            console.log("not found")
            response.sendStatus(404)
            return
        }
        if (req.body.commentId !== undefined) {
            // Update or create new comment
            const commentId = parseInt(req.body.commentId)
            if (isNaN(commentId)) {
                response.sendStatus(400)
                return
            }
            if (commentId === -1) {
                // Create a new comment
                let newId = article.comments.length
                article.comments.forEach((element) => {
                    if (element.id >= newId) {
                        newId = element.id + 1
                    }
                })
                article.comments.push({author: req.username, text: req.body.text, id: newId})
                UpdateArticleComments(article).then((res) => {
                    response.send({articles: [article]})
                })
                return
            } else {
                // Update a comment
                let comment = article.comments.filter(comment => comment.id === commentId)[0]
                if (comment === undefined) {
                    return response.sendStatus(404)
                }
                if (comment.author !== req.username) {
                    return response.sendStatus(401)
                }
                comment.text = req.body.text
                article.comments = article.comments.map(data => {
                    if (data.id === comment.id) {
                        data = {
                            ...data,
                            text: comment.text
                        }
                    }
                    return data
                })
                UpdateArticleComments(article).then((res) => {
                    response.send({articles: [article]})
                })
                return
            }
        } else {
            if (req.username !== article.author) {
                return response.sendStatus(401)
            }
            article.text = req.body.text
            UpdateArticleText(article).then(res => {
                if (res) {
                    return response.send({articles: [article]})
                }
            })
        }
    }).catch(err => {
        if (err) {
            console.error(err)
            response.sendStatus(500)
        }
    })

}

module.exports = {

    getArticles,
    updateArticle,
    addArticle
}
