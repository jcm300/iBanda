var express = require('express')
var router = express.Router()
var axios = require("axios")
var auth = require("../auth/auth")
var antlr4 = require('antlr4/index')
var NewsLexer = require('../grammars/news/newsLexer').newsLexer
var NewsParser = require('../grammars/news/newsParser').newsParser
var NewsListener = require('../grammars/news/newsListener').newsListener

router.get('/authors/:author', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/article/author/" + req.params.author, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(articles => res.render("articles/articlesBy", {userType: req.session.type, articles: articles.data, tag: "Author", by: req.params.author}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'articles')
        }) 
})

router.get('/topics/:topic', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/article/topic/" + req.params.topic, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(articles => res.render("articles/articlesBy", {userType: req.session.type, articles: articles.data, tag: "Topic", by: req.params.topic}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'articles')
        }) 
})

router.get('/article/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/article/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(article => res.render("articles/updateArticle", {article: article.data, error: req.flash('error')}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'articles/' + req.params.id)
        }) 
})

router.get('/list/:date', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/article/date/" + req.params.date, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(articles => res.render("articles/listArticles", {userType: req.session.type, articles: articles.data}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        })
})

router.get('/list', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/article", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(articles => res.render("articles/listArticles", {userType: req.session.type, articles: articles.data}))
        .catch(error => {
            console.log("Error while getting articles: " + error)
            res.render("error", {message: "getting articles", error: error})
        })
})

router.get('/grammar', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("articles/grammar", {input: req.flash("input"), errors: req.flash("grammarError")})
})

router.get('/article', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("articles/newArticle", {error: req.flash('error')})
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/article/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(article => res.render("articles/article", {userType: req.session.type, article: article.data, success: req.flash('success'), error: req.flash('error')}))
        .catch(error => {
            console.log("Error while getting article: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'articles')
        }) 
})

router.get('/', auth.isAuthenticated, (req,res) => {
    res.render("articles/articles", {userType: req.session.type, success: req.flash('success'), error: req.flash('error')})
})

router.post('/grammar', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    var chars = new antlr4.InputStream(req.body.grammar);
    var lexer = new NewsLexer(chars);
    var tokens  = new antlr4.CommonTokenStream(lexer);
    var parser = new NewsParser(tokens);
    
    var log = []

    //replace console.error
    var exLogError = console.error
    console.error = function(msg) {
        log.push(msg)
    }

    parser.buildParseTrees = true;   
    //call first rule
    var tree = parser.newspaper();
    var newsListener = new NewsListener();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(newsListener, tree);
    //reset console.error
    console.error = exLogError

    if(log.length!=0 || tree.errors.length!=0){
        var errors = log.concat(tree.errors)
        req.flash("input",req.body.grammar)
        req.flash("grammarError",errors)
        res.redirect(req.app.locals.url + "articles/grammar")
    }else{
        tree.val.forEach(a => a.visible=true)
        axios.post(req.app.locals.url + "api/article/insertMany", tree.val, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
            .then(() => {
                req.flash('success', "Inserted Articles!")   
                res.redirect(req.app.locals.url + "articles")
            })
            .catch(error => {
                console.log("Error in insert many articles: " + error)
                req.flash('grammarError','Error. Try again!')
                res.redirect(req.app.locals.url + 'articles/grammar')
        })
    }
})

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.post(req.app.locals.url + "api/article", req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success', 'Article created!')
            res.redirect(req.app.locals.url + "articles")
        })
        .catch(error => {
            console.log("Error in insert article: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'articles/article')
        })
})

router.put('/visible/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.put(req.app.locals.url + "api/article/visible/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success',"Article visibility changed!")
            res.jsonp(req.app.locals.url + "articles/" + req.params.id)
        })
        .catch(error => {
            console.log("Error in update visibility of article: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'articles/' + req.params.id)
        })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.put(req.app.locals.url + "api/article/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success', 'Article updated!')
            res.jsonp(req.app.locals.url + "articles/" + req.params.id)
        })
        .catch(error => {
            console.log("Error in update article: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'articles/article' + req.params.id)
        })
})

module.exports = router