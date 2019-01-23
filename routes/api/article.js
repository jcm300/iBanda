var express = require('express');
var router = express.Router();
var Articles = require("../../controllers/article")
var auth = require("../../auth/auth")

router.get('/date/:date', auth.isAuthenticated, function(req, res) {
    Articles.getArticlesByDate(req.params.date)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/author/:author', auth.isAuthenticated, function(req, res) {
    Articles.getArticlesByAuthor(req.params.author)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/topic/:topic', auth.isAuthenticated, function(req, res) {
    Articles.getArticlesByTopic(req.params.topic)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/:id', auth.isAuthenticated, function(req, res) {
    Articles.getArticle(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', auth.isAuthenticated, function(req, res) {
    Articles.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/insertMany', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Articles.insertMany(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Articles.createArticle(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/visible/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req,res) {
    Articles.changeVisibility(req.params.id,req.body.visible)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Articles.updateArticle(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Articles.deleteArticle(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;