var express = require('express')
var router = express.Router()
var axios = require("axios")
var auth = require("../auth/auth")

router.get('/user/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/user/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(user => res.render("users/updateUser", {user: user.data}))
        .catch(error => {
            console.log("Error while getting user: " + error)
            res.render("error", {message: "getting user", error: error})
        }) 
})

router.get('/user', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("users/newUser")
})

router.get('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/user/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(user => res.render("users/user", {user: user.data}))
        .catch(error => {
            console.log("Error while showing user: " + error)
            res.render("error", {message: "showing user", error: error})
        })
})

router.get('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/user", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(users => res.render("users/users", {users: users.data}))
        .catch(error => {
            console.log("Error while getting user: " + error)
            res.render("error", {message: "getting user", error: error})
        })
})

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.post(req.app.locals.url + "api/user", req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => res.redirect(req.app.locals.url + "users"))
        .catch(error => {
            console.log("Error in insert user: " + error)
            res.render("error", {message: "Insertion of user", error: error})
        })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.put(req.app.locals.url + "api/user/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => res.jsonp(req.app.locals.url + "users/" + req.params.id))
        .catch(error => {
            console.log("Error in update user: " + error)
            res.status(500).jsonp("Error on update of user" + error)
        })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.delete(req.app.locals.url + "api/user/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => res.jsonp(req.app.locals.url + "users"))
        .catch(error => {
            console.log("Error in delete user: " + error)
            res.status(500).jsonp("Error on delete user" + error)
        })
})

module.exports = router