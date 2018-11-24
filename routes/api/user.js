var express = require('express');
var router = express.Router();
var Users = require("../../controllers/user")
var bcrypt = require("bcrypt")
const saltRounds = 12

router.get('/:id', function(req, res) {
    Users.getUser(req.params.id)
         .then(dados => res.jsonp(dados))
         .catch(erro => res.status(500).jsonp(erro))
});

router.get('/', function(req, res) {
    Users.list()
         .then(dados => res.jsonp(dados))
         .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', function(req, res) {
    bcrypt.hash(req.body.password,saltRounds)
        .then( hash => {
            return Users.createUser(req.body.name,req.body.email,hash)
                    .then(dados => res.jsonp(dados))
                    .catch(erro2 => res.status(500).jsonp(erro2))
        })
        .catch(erro => res.status(500).jsonp(erro))
});

router.put('/:id', function(req, res) {
    bcrypt.hash(req.body.password,saltRounds)
        .then( hash => {
            return Users.updateUser(req.params.id,req.body.name,req.body.email,hash)
                    .then(dados => res.jsonp(dados))
                    .catch(erro2 => res.status(500).jsonp(erro2))
        })
        .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
