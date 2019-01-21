var express = require('express');
var router = express.Router();
var Events = require("../../controllers/event")
var auth = require("../../auth/auth")

router.get('/date/:date', auth.isAuthenticated, function(req, res) {
    Events.getEventsByDate(req.params.date)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/hour/:hour', auth.isAuthenticated, function(req, res) {
    Events.getEventsByHour(req.params.hour)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/date_hour?date=:date&hour=:hour', auth.isAuthenticated, function(req, res) {
    Events.getEventsByDateHour(req.params.date, req.params.hour)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/local/:local', auth.isAuthenticated, function(req, res) {
    Events.getEventsByLocal(req.params.local)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/:id', auth.isAuthenticated, function(req, res) {
    Events.getEvent(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', auth.isAuthenticated, function(req, res) {
    Events.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Events.createEvent(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Events.updateEvent(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), function(req, res) {
    Events.deleteEvent(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;