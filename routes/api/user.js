var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
var auth = require("../../auth/auth")

router.get('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.getUser(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.createUser(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/views/:id', auth.isAuthenticated, function(req, res) {
    Users.updateViews(req.params.id,req.body.idPiece)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

router.put('/downloads/:id', auth.isAuthenticated, function(req, res) {
    Users.updateDownloads(req.params.id,req.body.idPiece)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

router.put('/deleteStat', auth.isAuthenticated, function(req, res) {
    Users.deleteStat(req.body.idPiece)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.updateUser(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.deleteUser(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;