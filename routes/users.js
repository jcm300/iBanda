var express = require('express')
var router = express.Router()
var axios = require("axios")

router.get('/user/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/user/" + req.params.id)
        .then(user => res.render("users/updateUser", {user: user.data}))
        .catch(error => {
            console.log("Error while getting user: " + error)
            res.render("error", {message: "getting user", error: error})
        }) 
})

router.get('/user', (req,res) => {
    res.render("users/newUser")
})

router.get('/:id', (req,res) => {
    axios.get(req.app.locals.url + "api/user/" + req.params.id)
        .then(user => res.render("users/user", {user: user.data}))
        .catch(error => {
            console.log("Error while showing user: " + error)
            res.render("error", {message: "showing user", error: error})
        })
})

router.get('/', (req,res) => {
    axios.get(req.app.locals.url + "api/user")
        .then(users => res.render("users/users", {users: users.data}))
        .catch(error => {
            console.log("Error while getting user: " + error)
            res.render("error", {message: "getting user", error: error})
        })
})

router.post('/', (req, res) => {
    axios.post(req.app.locals.url + "api/user", req.body)
        .then(() => res.redirect(req.app.locals.url + "users"))
        .catch(error => {
            console.log("Error in insert user: " + error)
            res.render("error", {message: "Insertion of user", error: error})
        })
})

router.put('/:id', (req, res) => {
    axios.put(req.app.locals.url + "api/user/" + req.params.id, req.body)
        .then(() => res.jsonp(req.app.locals.url + "users/" + req.params.id))
        .catch(error => {
            console.log("Error in update user: " + error)
            res.status(500).jsonp("Error on update of user" + error)
        })
})

router.delete('/:id', (req, res) => {
    axios.delete(req.app.locals.url + "api/user/" + req.params.id)
        .then(() => res.jsonp(req.app.locals.url + "users"))
        .catch(error => {
            console.log("Error in delete user: " + error)
            res.status(500).jsonp("Error on delete user" + error)
        })
})

module.exports = router