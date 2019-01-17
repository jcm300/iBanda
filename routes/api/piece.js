var express = require('express');
var router = express.Router();
var Pieces = require("../../controllers/piece")

router.get('/:id', function(req, res) {
    Pieces.getPiece(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', function(req, res) {
    Pieces.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', function(req, res) {
    Pieces.createPiece(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', function(req, res) {
    Pieces.updatePiece(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', function(req, res) {
    Pieces.deletePiece(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;