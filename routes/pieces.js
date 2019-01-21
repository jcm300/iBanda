var express = require('express')
var router = express.Router()
var axios = require("axios")
var formidable = require("formidable")
var admzip = require("adm-zip")
var fs = require("fs")
var rimraf = require('rimraf')
var auth = require("../auth/auth")

router.get('/ingestion', auth.isAuthenticated, auth.havePermissions(["2"]), (req, res) => {
    res.render('pieces/ingestion')
})

router.get('/export/:id', auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => {
            //clean json
            var id = piece.data._id
            delete piece.data._id
            delete piece.data.__v
            piece.data.instruments.forEach( inst => {
                delete inst._id
                delete inst.score._id
            })
            //write json
            fs.writeFileSync("public/scores/" + id + "/iBanda-SIP.json", JSON.stringify(piece.data, null, 4))
            //create zip buffer
            var zip = new admzip()
            zip.addLocalFolder("public/scores/" + id)
            var zipToSend = zip.toBuffer()
            //send zip
            res.setHeader("Content-Type", "application/zip")
            res.set('Content-Disposition', 'attachment; filename=' + id + '.zip')
            res.set('Content-Length', zipToSend.length)
            res.write(zipToSend, 'binary')
            res.end(null,'binary')
            //delete json
            fs.unlinkSync("public/scores/" + id + "/iBanda-SIP.json")
        })
        .catch(error => {
            console.log("Error in get piece: " + error)
            res.render("error", {message: "Get piece", error: error})
        })
})

router.get('/piece/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => res.render("pieces/updatePiece", {piece: piece.data}))
        .catch(error => {
            console.log("Error while getting piece: " + error)
            res.render("error", {message: "getting piece", error: error})
        }) 
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => res.render("pieces/piece", {userType: req.session.type, piece: piece.data}))
        .catch(error => {
            console.log("Error in get piece: " + error)
            res.render("error", {message: "Get piece", error: error})
        })
})

router.get('/', auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + "api/piece", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(pieces => res.render('pieces/dissemination',{userType: req.session.type, pieces: pieces.data}))
        .catch(error => {
            console.log("Error in get pieces: " + error)
            res.render("error", {message: "Get of pieces", error: error})
        }) 
})

//ingestion
router.post('/', auth.isAuthenticated, auth.havePermissions(["2"]), (req, res) => {
    var form = new formidable.IncomingForm()

    form.parse(req, (error, fields, formData) => {
        if(!error){
            var fsend = formData.file.path
            try{
                var zip = new admzip(fsend)
            
                //verify if manifest exists on zip
                var zipEntries = zip.getEntries()
                var manifestExists = false
                zipEntries.forEach(e => {
                    if(e.entryName=="iBanda-SIP.json") manifestExists = true
                })
                
                if(manifestExists){
                    var json = JSON.parse(zip.readAsText("iBanda-SIP.json"))
                    if(json.instruments!=null){
                        var allFilesExists = true
                        json.instruments.forEach(inst => {
                            var fileExists = false
                            zipEntries.forEach(e => {
                                if(inst.score.path!=null && e.entryName==inst.score.path) fileExists = true
                            })
                            if(!fileExists) allFilesExists = false
                        })
                        if(allFilesExists){
                            axios.post(req.app.locals.url + "api/piece", json, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                                .then( p => {
                                    p.data.instruments.forEach( inst => {
                                        zip.extractEntryTo(inst.score.path,"public/scores/" + p.data._id + "/",true)
                                    })
                                    res.redirect(req.app.locals.url + "pieces")
                                })
                                .catch(error => {
                                    console.log("Error in insert SIP in DB: " + error)
                                    res.render("error", {message: "Insertion of SIP in DB", error: error})
                                })
                        }else{
                            console.log("Error in insert SIP: Some referenced files not exists")
                            res.render("error", {message: "Insertion of SIP", error: "Some referenced files not exists!"})
                        }
                    }else{
                        console.log("Error in insert SIP: JSON Syntax incorrect")
                        res.render("error", {message: "Insertion of SIP", error: "JSON Syntax incorrect! Instruments doesn't exist!"}) 
                    }
                }else{
                    console.log("Error in insert SIP: Manifest not exists or in subfolder")
                    res.render("error", {message: "Insertion of SIP", error: "Manifest not exists or in subfolder!"}) 
                }
            }catch(e){
                console.log("Error in insert SIP: " + e)
                res.render("error", {message: "Insertion of SIP", error: e})
            }
        }
    })
})

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.put(req.app.locals.url + "api/piece/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => res.jsonp(req.app.locals.url + "pieces/" + req.params.id))
        .catch(error => {
            console.log("Error in update piece: " + error)
            res.status(500).jsonp("Error on update of piece" + error)
        })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.delete(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then( p => {
            rimraf.sync("public/scores/" + p.data._id)
            res.jsonp(req.app.locals.url + "pieces")
        })
        .catch(error => {
            console.log("Error in delete piece: " + error)
            res.status(500).jsonp("Error on delete piece" + error)
        })
})

module.exports = router