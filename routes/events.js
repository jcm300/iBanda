var express = require('express')
var router = express.Router()
var axios = require("axios")
var auth = require("../auth/auth")

router.get('/event/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(event => res.render("events/updateEvent", {event: event.data}))
        .catch(error => {
            console.log("Error while getting event: " + error)
            res.render("error", {message: "getting event", error: error})
        }) 
})

router.get('/list/:date', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/event/date/" + req.params.date, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(events => res.render("events/listEvents", {events: events.data}))
        .catch(error => {
            console.log("Error while getting events: " + error)
            res.render("error", {message: "getting events", error: error})
        })
})

router.get('/list', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/event", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(events => res.render("events/listEvents", {events: events.data}))
        .catch(error => {
            console.log("Error while getting events: " + error)
            res.render("error", {message: "getting events", error: error})
        })
})

router.get('/event', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("events/newEvent")
})

router.get('/export', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/event", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
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

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(event => res.render("events/event", {userType: req.session.type, event: event.data}))
        .catch(error => {
            console.log("Error while showing event: " + error)
            res.render("error", {message: "showing event", error: error})
        })
})

router.get('/', auth.isAuthenticated, (req,res) => {
    res.render("events/events", {userType: req.session.type})
})

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.post(req.app.locals.url + "api/event", req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
       .then(() => res.redirect(req.app.locals.url + "events"))
       .catch(error => {
           console.log("Error in insert event: " + error)
           res.render("error", {message: "Insertion of event", error: error})
       })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.put(req.app.locals.url + "api/event/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
       .then(() => res.jsonp(req.app.locals.url + "events/" + req.params.id))
       .catch(error => {
           console.log("Error in update event: " + error)
           res.status(500).jsonp("Error on update of event" + error)
       })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.delete(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
       .then(() => res.jsonp(req.app.locals.url + "events"))
       .catch(error => {
           console.log("Error in delete event: " + error)
           res.status(500).jsonp("Error on delete event" + error)
       })
})

module.exports = router