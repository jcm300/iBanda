var express = require('express');
var router = express.Router();
var Pieces = require("../../controllers/piece")
var auth = require("../../auth/auth")

router.get('/:id', auth.isAuthenticated, function(req, res) {
    Pieces.getPiece(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', auth.isAuthenticated, function(req, res) {
    Pieces.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', auth.isAuthenticated, auth.havePermissions(["2"]), function(req, res) {
    Pieces.createPiece(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Pieces.updatePiece(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Pieces.deletePiece(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;