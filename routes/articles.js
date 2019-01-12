var express = require('express')
var router = express.Router()
var axios = require("axios")

var url = "http://localhost:3000/"

router.get('/authors/:author', (req,res) => {
    axios.get(url + "api/article/author/" + req.params.author)
        .then(articles => res.render("articles/articlesBy", {url: url, articles: articles.data, tag: "Author", by: req.params.author}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        }) 
})

router.get('/topics/:topic', (req,res) => {
    axios.get(url + "api/article/topic/" + req.params.topic)
        .then(articles => res.render("articles/articlesBy", {url: url, articles: articles.data, tag: "Topic", by: req.params.topic}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        }) 
})

router.get('/article', (req,res) => {
    res.render("articles/newArticle",{url: url})
})

router.get('/:id', (req,res) => {
    axios.get(url + "api/article/" + req.params.id)
        .then(article => res.render("articles/article", {url: url, article: article.data}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            res.render("error", {message: "getting article", error: error})
        }) 
})

router.get('/', (req,res) => {
    res.render("articles/articles",{url: url})
})

router.post('/', (req, res) => {
   axios.post(url + "api/article", req.body)
       .then(() => res.redirect(url + "articles"))
       .catch(error => {
           console.log("Error in insert article: " + error)
           res.render("error", {message: "Insertion of article", error: error})
       })
})

module.exports = router