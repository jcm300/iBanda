var express = require('express')
var router = express.Router()
var axios = require("axios")
var formidable = require("formidable")
var fs = require("fs")
var auth = require("../auth/auth")
var fsExtra = require("fs.extra")

router.get('/entry/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entry => res.render("entries/updateEntry", {entry: entry.data}))
        .catch(error => {
            console.log("Error while getting entry: " + error)
            res.render("error", {message: "getting entry", error: error})
        }) 
})

router.get('/entry', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    res.render("entries/newEntry")
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entry => res.render("entries/entry", {userType: req.session.type, entry: entry.data}))
        .catch(error => {
            console.log("Error while showing entry: " + error)
            res.render("error", {message: "showing entry", error: error})
        })
})

router.get('/', auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + "api/entry", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(entries => res.render('entries/entries',{userType: req.session.type, entries: entries.data}))
        .catch(error => {
            console.log("Error in get entries: " + error)
            res.render("error", {message: "Get of entries", error: error})
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
                                res.redirect(req.app.locals.url + "entries")
                            }else{
                                axios.delete(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                                    .then( () => {
                                        console.log("Error moving file: " + error2)
                                        res.render("error", {message: "Error moving file: ", error: error2})
                                    })
                                    .catch(error3 => {
                                        console.log("Error in delete entry after error in move file: " + error3)
                                        res.render("error", {message: "Error on delete entry after error in move file", error: error3})
                                    })
                            }
                        }) 
                    })
                    .catch(error4 => {
                        console.log("Error in insert entry: " + error4)
                        res.render("error", {message: "Insertion of entry", error: error4})
                    })
            }else{
                console.log("File is not a PDF!")
                res.render("error",{message: "File is not a PDF!"})
            }
        }else{
            console.log("Error on parse form: " + error)
            res.render("error",{message: "Error on parse form: ", error: error})
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
                            res.status(500).jsonp("Error moving file: " + error2)
                        }
                    }) 
                }else{
                    console.log("File is not a PDF!")
                    res.status(500).jsonp("File is not a PDF!")
                }
            }
            console.log(formData)
            console.log(fields)
            var entryInfo = {_id: req.params.id, desc: fields.desc}
            axios.put(req.app.locals.url + "api/entry/" + req.params.id, entryInfo, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                .then(() => res.jsonp(req.app.locals.url + "entries/" + req.params.id))
                .catch(error3 => {
                    console.log("Error in update entry in DB: " + error3)
                    res.status(500).jsonp("Error on update of entry in DB" + error3)
                })
        }else{
            console.log("Error in update entry: " + error)
            res.status(500).jsonp("Error on update of entry" + error)
        }
    })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.delete(req.app.locals.url + "api/entry/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then( p => {
            fs.unlinkSync("public/pdfs/" + p.data._id + ".pdf")
            res.jsonp(req.app.locals.url + "entries")
        })
        .catch(error => {
            console.log("Error in delete entry: " + error)
            res.status(500).jsonp("Error on delete entry" + error)
        })
})

module.exports = router