var express = require('express');
var router = express.Router();
var Entries = require("../../controllers/entry")
var auth = require("../../auth/auth")

router.get('/:id', auth.isAuthenticated, function(req, res) {
    Entries.getEntry(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', auth.isAuthenticated, function(req, res) {
    Entries.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Entries.createEntry(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Entries.updateEntry(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Entries.deleteEntry(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;