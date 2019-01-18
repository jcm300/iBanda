var express = require('express')
var router = express.Router()
var axios = require("axios")

router.get('/authors/:author', (req,res) => {
    axios.get(req.app.locals.url + "api/article/author/" + req.params.author)
        .then(articles => res.render("articles/articlesBy", {articles: articles.data, tag: "Author", by: req.params.author}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        }) 
})

router.get('/topics/:topic', (req,res) => {
    axios.get(req.app.locals.url + "api/article/topic/" + req.params.topic)
        .then(articles => res.render("articles/articlesBy", {articles: articles.data, tag: "Topic", by: req.params.topic}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        }) 
})

router.get('/article/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/article/" + req.params.id)
        .then(article => res.render("articles/updateArticle", {article: article.data}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            res.render("error", {message: "getting article", error: error})
        }) 
})

router.get('/article', (req,res) => {
    res.render("articles/newArticle")
})

router.get('/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/article/" + req.params.id)
        .then(article => res.render("articles/article", {article: article.data}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            res.render("error", {message: "getting article", error: error})
        }) 
})

router.get('/', (req,res) => {
    res.render("articles/articles")
})

router.post('/', (req, res) => {
   axios.post(req.app.locals.url + "api/article", req.body)
       .then(() => res.redirect(req.app.locals.url + "articles"))
       .catch(error => {
           console.log("Error in insert article: " + error)
           res.render("error", {message: "Insertion of article", error: error})
       })
})

router.put('/:id', (req, res) => {
   axios.put(req.app.locals.url + "api/article/" + req.params.id, req.body)
       .then(() => res.jsonp(req.app.locals.url + "articles/" + req.params.id))
       .catch(error => {
           console.log("Error in update article: " + error)
           res.status(500).jsonp("Error on update of article" + error)
       })
})

module.exports = router