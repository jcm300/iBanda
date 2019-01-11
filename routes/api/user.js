var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
var bcrypt = require("bcrypt")
const saltRounds = 12

router.get('/:id', function(req, res) {
    Users.getUser(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', function(req, res) {
    Users.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', function(req, res) {
    bcrypt.hash(req.body.password,saltRounds)
        .then( hash => {
            var user = {name: req.body.name, email: req.body.email, password: hash}
            return Users.createUser(user)
                .then(data => res.jsonp(data))
                .catch(error2 => res.status(500).jsonp(error2))
        })
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', function(req, res) {
    bcrypt.hash(req.body.password,saltRounds)
        .then( hash => {
            var user = {name: req.body.name, email: req.body.email, password: hash}
            return Users.updateUser(req.params.id,user)
                .then(data => res.jsonp(data))
                .catch(error2 => res.status(500).jsonp(error2))
        })
        .catch(error => res.status(500).jsonp(error))
});

module.exports = router;