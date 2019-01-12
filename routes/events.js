var express = require('express')
var router = express.Router()
var axios = require("axios")

var url = "http://localhost:3000/" 

router.get('/event/:id', (req,res) => {
    axios.get(url + "api/event/" + req.params.id)
        .then(event => res.render("events/updateEvent", {url: url, event: event.data}))
        .catch(error => {
            console.log("Error while getting event: " + error)
            res.render("error", {message: "getting event", error: error})
        }) 
})

router.get('/event', (req,res) => {
    res.render("events/newEvent",{url: url})
})

router.get('/:id', (req,res) => {
    axios.get(url + "api/event/" + req.params.id)
        .then(event => res.render("events/event", {url: url, event: event.data}))
        .catch(error => {
            console.log("Error while showing event: " + error)
            res.render("error", {message: "showing event", error: error})
        })
})

router.get('/', (req,res) => {
    res.render("events/events",{url: url})
})

router.post('/', (req, res) => {
   axios.post(url + "api/event", req.body)
       .then(() => res.redirect(url + "events"))
       .catch(error => {
           console.log("Error in insert event: " + error)
           res.render("error", {message: "Insertion of event", error: error})
       })
})

router.put('/:id', (req, res) => {
   axios.put(url + "api/event/" + req.params.id, req.body)
       .then(() => res.jsonp(url + "events/" + req.params.id))
       .catch(error => {
           console.log("Error in update event: " + error)
           res.status(500).jsonp("Error on update of event" + error)
       })
})

router.delete('/:id', (req, res) => {
   axios.delete(url + "api/event/" + req.params.id)
       .then(() => res.jsonp(url + "events"))
       .catch(error => {
           console.log("Error in delete event: " + error)
           res.status(500).jsonp("Error on delete event" + error)
       })
})

module.exports = router