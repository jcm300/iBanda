var express = require('express')
var router = express.Router()
var axios = require("axios")
var auth = require("../auth/auth")
var antlr4 = require('antlr4/index')
var AgendaLexer = require('../grammars/agenda/agendaLexer').agendaLexer
var AgendaParser = require('../grammars/agenda/agendaParser').agendaParser
var AgendaListener = require('../grammars/agenda/agendaListener').agendaListener

router.get('/event/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(event => res.render("events/updateEvent", {event: event.data, error: req.flash('error')}))
        .catch(error => {
            console.log("Error while getting event: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'events/' + req.params.id)
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

router.get('/grammar', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("events/grammar", {input: req.flash("input"), errors: req.flash("grammarError")})
})

router.get('/event', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("events/newEvent", {error: req.flash('error')})
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
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'events')
        })
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(event => res.render("events/event", {userType: req.session.type, event: event.data, success: req.flash('success'), error: req.flash('error')}))
        .catch(error => {
            console.log("Error while showing event: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'events')
        })
})

router.get('/', auth.isAuthenticated, (req,res) => {
    res.render("events/events", {userType: req.session.type, success: req.flash('success'), error: req.flash('error')})
})

router.post('/grammar', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    var chars = new antlr4.InputStream(req.body.grammar);
    var lexer = new AgendaLexer(chars);
    var tokens  = new antlr4.CommonTokenStream(lexer);
    var parser = new AgendaParser(tokens);
    
    var log = []

    //replace console.error
    var exLogError = console.error
    console.error = function(msg) {
        log.push(msg)
    }

    parser.buildParseTrees = true;   
    //call first rule
    var tree = parser.agenda();
    var agendaListener = new AgendaListener();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(agendaListener, tree);
    //reset console.error
    console.error = exLogError

    if(log.length!=0 || tree.errors.length!=0){
        var errors = log.concat(tree.errors)
        req.flash("input",req.body.grammar)
        req.flash("grammarError",errors)
        res.redirect(req.app.locals.url + "events/grammar")
    }else{
        axios.post(req.app.locals.url + "api/event/insertMany", tree.val, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
            .then(() => {
                req.flash('success', "Inserted Events!")    
                res.redirect(req.app.locals.url + "events")
            })
            .catch(error => {
                console.log("Error in insert many events: " + error)
                req.flash('grammarError','Error. Try again!')
                res.redirect(req.app.locals.url + 'events/grammar')
        })
    }
})

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.post(req.app.locals.url + "api/event", req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success',"Event created!")   
            res.redirect(req.app.locals.url + "events")
        })
        .catch(error => {
            console.log("Error in insert event: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'events/event')
        })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.put(req.app.locals.url + "api/event/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success', "Event updated!")   
            res.jsonp(req.app.locals.url + "events/" + req.params.id)
        })
        .catch(error => {
            console.log("Error in update event: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'events/event/' + req.params.id)
        })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
   axios.delete(req.app.locals.url + "api/event/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success', "Event deleted!")   
            res.jsonp(req.app.locals.url + "events")
        })
        .catch(error => {
            console.log("Error in delete event: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'events/' + req.params.id)
        })
})

module.exports = router