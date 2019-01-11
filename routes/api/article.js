var express = require('express');
var router = express.Router();
var Articles = require("../../controllers/article")

router.get('/:id', function(req, res) {
    Articles.getArticle(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', function(req, res) {
    Articles.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/date/:date', function(req, res) {
    Articles.getArticlesByDate(req.params.date)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/author/:author', function(req, res) {
    Articles.getArticlesByAuthor(req.params.author)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/topic/:topic', function(req, res) {
    Articles.getArticlesByTopic(req.params.topic)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', function(req, res) {
    Articles.createArticle(req.body)
        .then(data => res.jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', function(req, res) {
    Articles.updateArticle(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

module.exports = router;