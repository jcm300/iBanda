var express = require('express');
var router = express.Router();
var axios = require('axios')
const passport = require("passport")
const jwt = require("jsonwebtoken")
var fs = require("fs")
var auth = require("../auth/auth")

router.get("/main", auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + 'api/article', {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(articles => {
            res.render("menus/main",{idU: req.session._id, userType: req.session.type, articles: articles.data, error: req.flash('error')})
        })
        .catch(error => {
            console.log("Error in get articles: " + error)
            res.render("error", {message: "Get articles", error: error})
        })
})

router.get('/logout', auth.isAuthenticated, function(req, res){
    req.session.destroy()
    req.logOut()
    res.redirect('/')
});

router.get("/", (req, res) => {
    if(req.session.token==null || req.session.flash.error!=null) res.render("menus/login",{error: req.flash('error')})
    else res.redirect(req.app.locals.url + "main")
})

router.post("/login", async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try{
            if(err || !user) {
                if(!user) {
                    req.flash('error',info.message)
                    return res.redirect(req.app.locals.url)
                }else return next(err)
            }
            req.login(user, {session: false}, async (error) => {
                if(error) return next(error)
                var myuser = {_id: user._id, email: user.email}
                //Token Generation
                var privateKey = fs.readFileSync("./auth/private.key", "utf8")
                var token = jwt.sign({user: myuser}, privateKey, {expiresIn: '30m'})
                req.session.token = token
                req.session._id = user._id
                req.session.type = user.type
                res.redirect(req.app.locals.url + "main")
            })
        }catch(error){
            return next(error)
        }
    })(req,res,next)
})

module.exports = router