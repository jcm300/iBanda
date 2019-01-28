var express = require('express')
var router = express.Router()
var axios = require("axios")
var auth = require("../auth/auth")

router.get('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    Promise.all([
                    axios.get(req.app.locals.url + "api/user/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/views/most/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/downloads/most/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/views/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/downloads/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                ])
            .then(results => {
                res.render("statistics/userStats", {user: results[0].data, mostVPiece: results[1].data,mostDPiece: results[2].data, totalViews: results[3].data, totalDownloads: results[4].data})
            })
            .catch(error => {
                console.log("Error while showing user/getting statistics: " + error)
                req.flash('error','Error. Try again!')
                res.redirect(req.app.locals.url + 'statistics')
            })
})

router.get('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    Promise.all([
                    axios.get(req.app.locals.url + "api/user", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/viewsAll", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/downloadsAll", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/viewsMostUser", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/downloadsMostUser", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/viewsMost", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/downloadsMost", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/usersViews", {headers: {"cookie": req.headers.cookie}, withCredentials: true}),
                    axios.get(req.app.locals.url + "api/statistic/usersDownloads", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                ])
        .then( results => {
            res.render("statistics/statistics", {
                    users: results[0].data, totalViews: results[1].data, totalDownloads: results[2].data, 
                    userMViews: results[3].data, userMDownloads: results[4].data, pieceMViews: results[5].data, 
                    pieceMDownloads: results[6].data, views: results[7].data, downloads: results[8].data,
                    error: req.flash('error')
                })
        })
        .catch(error => {
            console.log("Error while getting users/statistics: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'main')
        })
})

module.exports = router