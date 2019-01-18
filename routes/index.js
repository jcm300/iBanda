var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get("/main", (req, res) => {
    axios.get(req.app.locals.url + 'api/article')
        .then(articles => {
            res.render("menus/main",{userType: "1", articles: articles.data})
        })
        .catch(error => {
            console.log("Error in get articles: " + error)
            res.render("error", {message: "Get articles", error: error})
        })
})

router.get("/", (req, res) => {
    res.render("menus/login")
})

module.exports = router