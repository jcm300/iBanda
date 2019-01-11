var express = require('express');
var router = express.Router();
var Events = require("../../controllers/event")

router.get('/:id', function(req, res) {
    Events.getEvent(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/', function(req, res) {
    Events.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/date/:date', function(req, res) {
    Events.getEventsByDate(req.params.date)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/hour/:hour', function(req, res) {
    Events.getEventsByHour(req.params.hour)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/date_hour?date=:date&hour=:hour', function(req, res) {
    Events.getEventsByDateHour(req.params.date, req.params.hour)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.get('/local/:local', function(req, res) {
    Events.getEventsByLocal(req.params.local)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.post('/', function(req, res) {
    Events.createEvent(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.put('/:id', function(req, res) {
    Events.updateEvent(req.params.id,req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

router.delete('/:id', function(req, res) {
    Events.deleteEvent(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router;