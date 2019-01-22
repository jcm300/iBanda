var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
var auth = require("../../auth/auth")

router.get('/views/most/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getPieceViews(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/downloads/most/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getPieceDownloads(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

router.get('/views/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getViews(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/downloads/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getDownloads(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/viewsAll', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getAllViews()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/downloadsAll', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getAllDownloads()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/viewsMostUser', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getUserWithMostViews()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/downloadsMostUser', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getUserWithMostDownloads()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/viewsMost', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getMostViewed()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/downloadsMost', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getMostDownloaded()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/usersViews', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getUsersViews()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/usersDownloads', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getUsersDownloads()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

module.exports = router