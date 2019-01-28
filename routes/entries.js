var express = require('express')
var router = express.Router()
var axios = require("axios")
var formidable = require("formidable")
var fs = require("fs")
var auth = require("../auth/auth")
var fsExtra = require("fs.extra")

router.get('/entry/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entry => res.render("entries/updateEntry", {entry: entry.data, error: req.flash('error')}))
        .catch(error => {
            console.log("Error while getting entry: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'entries/' + req.params.id)
        }) 
})

router.get('/entry', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("entries/newEntry", {error: req.flash('error')})
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entry => res.render("entries/entry", {userType: req.session.type, entry: entry.data, success: req.flash('success'), error: req.flash('error')}))
        .catch(error => {
            console.log("Error while showing entry: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'entries')
        })
})

router.get('/', auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + "api/entry", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entries => res.render('entries/entries',{userType: req.session.type, entries: entries.data, success: req.flash('success'), error: req.flash('error')}))
        .catch(error => {
            console.log("Error in get entries: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'main')
        }) 
})

router.post('/', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    var form = new formidable.IncomingForm()

    form.parse(req, (error, fields, formData)=>{
        if(!error){
            if(formData.file.type=="application/pdf"){
                var entryInfo = {desc: fields.desc}
                axios.post(req.app.locals.url + "api/entry", entryInfo, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                    .then(p => {
                        var fsend = formData.file.path
                        var fnew = "public/pdfs/" + p.data._id + ".pdf"
                        fsExtra.move(fsend,fnew, error2 => {
                            if(!error2){
                                req.flash('success','Entry created!')
                                res.redirect(req.app.locals.url + "entries")
                            }else{
                                axios.delete(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                                    .then( () => {
                                        console.log("Error moving file: " + error2)
                                        req.flash('error','Error. Try again!')
                                        res.redirect(req.app.locals.url + 'entries/entry')
                                    })
                                    .catch(error3 => {
                                        console.log("Error in delete entry after error in move file: " + error3)
                                        req.flash('error','Error. Try again!')
                                        res.redirect(req.app.locals.url + 'entries/entry')
                                    })
                            }
                        }) 
                    })
                    .catch(error4 => {
                        console.log("Error in insert entry: " + error4)
                        req.flash('error','Error. Try again!')
                        res.redirect(req.app.locals.url + 'entries/entry')
                    })
            }else{
                console.log("File is not a PDF!")
                req.flash('error','Error. File is not a PDF!')
                res.redirect(req.app.locals.url + 'entries/entry')
            }
        }else{
            console.log("Error on parse form: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'entries/entry')
        }
    })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    var form = new formidable.IncomingForm()

    form.parse(req, (error, fields, formData)=>{
        if(!error){
            if(formData.file!=null){
                if(formData.file.type=="application/pdf"){
                    var fsend = formData.file.path
                    var fnew = "public/pdfs/" + req.params.id + ".pdf"
                    fs.unlinkSync(fnew)
                    fsExtra.move(fsend,fnew, error2 => {
                        if(error2){
                            console.log("Error moving file: " + error2)
                            req.flash('error','Error. Try again!')
                            res.jsonp(req.app.locals.url + 'entries/entry' + req.params.id)
                        }
                    }) 
                }else{
                    console.log("File is not a PDF!")
                    req.flash('error','Error. File is not a PDF!')
                    res.jsonp(req.app.locals.url + 'entries/entry/' + req.params.id)
                }
            }
            var entryInfo = {_id: req.params.id, desc: fields.desc}
            axios.put(req.app.locals.url + "api/entry/" + req.params.id, entryInfo, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                .then(() => {
                    req.flash('success','Entry updated!')
                    res.jsonp(req.app.locals.url + "entries/" + req.params.id)
                })
                .catch(error3 => {
                    console.log("Error in update entry in DB: " + error3)
                    req.flash('error','Error. Try again!')
                    res.jsonp(req.app.locals.url + 'entries/entry/' + req.params.id)
                })
        }else{
            console.log("Error in update entry: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'entries/entry/' + req.params.id)
        }
    })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.delete(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then( p => {
            fs.unlinkSync("public/pdfs/" + p.data._id + ".pdf")
            req.flash('success','Entry deleted!')
            res.jsonp(req.app.locals.url + "entries")
        })
        .catch(error => {
            console.log("Error in delete entry: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'entries/' + req.params.id)
        })
})

module.exports = router