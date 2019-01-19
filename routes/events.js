var express = require('express')
var router = express.Router()
var axios = require("axios")

router.get('/event/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id)
        .then(event => res.render("events/updateEvent", {event: event.data}))
        .catch(error => {
            console.log("Error while getting event: " + error)
            res.render("error", {message: "getting event", error: error})
        }) 
})

router.get('/list/:date', (req,res) => {
    axios.get(req.app.locals.url + "api/event/date/" + req.params.date)
        .then(events => res.render("events/listEvents", {events: events.data}))
        .catch(error => {
            console.log("Error while getting events: " + error)
            res.render("error", {message: "getting events", error: error})
        })
})

router.get('/list', (req,res) => {
    axios.get(req.app.locals.url + "api/event")
        .then(events => res.render("events/listEvents", {events: events.data}))
        .catch(error => {
            console.log("Error while getting events: " + error)
            res.render("error", {message: "getting events", error: error})
        })
})

router.get('/event', (req,res) => {
    res.render("events/newEvent")
})

router.get('/export', (req,res) => {
    axios.get(req.app.locals.url + "api/event")
        .then(events => {
            //clean json
            events.data.forEach(e => {
                delete e._id
                delete e.__v
            })
            //send json
            res.setHeader("Content-Type", "application/json")
            res.set('Content-Disposition', 'attachment; filename=agenda.json')
            res.write(JSON.stringify(events.data, null, 4))
            res.end()
        })
        .catch(error => {
            console.log("Error while getting events: " + error)
            res.render("error", {message: "getting events", error: error})
        })
})

router.get('/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id)
        .then(event => res.render("events/event", {event: event.data}))
        .catch(error => {
            console.log("Error while showing event: " + error)
            res.render("error", {message: "showing event", error: error})
        })
})

router.get('/', (req,res) => {
    res.render("events/events")
})

router.post('/', (req, res) => {
   axios.post(req.app.locals.url + "api/event", req.body)
       .then(() => res.redirect(req.app.locals.url + "events"))
       .catch(error => {
           console.log("Error in insert event: " + error)
           res.render("error", {message: "Insertion of event", error: error})
       })
})

router.put('/:id', (req, res) => {
   axios.put(req.app.locals.url + "api/event/" + req.params.id, req.body)
       .then(() => res.jsonp(req.app.locals.url + "events/" + req.params.id))
       .catch(error => {
           console.log("Error in update event: " + error)
           res.status(500).jsonp("Error on update of event" + error)
       })
})

router.delete('/:id', (req, res) => {
   axios.delete(req.app.locals.url + "api/event/" + req.params.id)
       .then(() => res.jsonp(req.app.locals.url + "events"))
       .catch(error => {
           console.log("Error in delete event: " + error)
           res.status(500).jsonp("Error on delete event" + error)
       })
})

module.exports = router