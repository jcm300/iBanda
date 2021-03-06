var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
var auth = require("../../auth/auth")

router.get('/approve/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Users.approve(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

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

router.post('/', auth.authenticated, function(req, res) {
    req.body.approved = false
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

router.put('/updPass/:id', auth.isAuthenticated, function(req, res) {
    if(req.params.id==req.session._id){
        Users.updatePassword(req.params.id,req.body.prevPass,req.body.newPass)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }else{
        res.jsonp("You have no permission to modify a pass of another user!")
    }
});

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