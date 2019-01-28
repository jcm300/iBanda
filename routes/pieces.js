var express = require('express')
var router = express.Router()
var axios = require("axios")
var formidable = require("formidable")
var admzip = require("adm-zip")
var fs = require("fs")
var fsExtra = require("fs.extra")
var formidable = require("formidable")
var mongoose = require('mongoose')
var rimraf = require('rimraf')
var auth = require("../auth/auth")

router.get('/ingestion', auth.isAuthenticated, auth.havePermissions(["2"]), (req, res) => {
    res.render('pieces/ingestion', {error: req.flash('error')})
})

router.get('/addInst/:id', auth.isAuthenticated, auth.havePermissions(["1","2"]), (req, res) => {
    res.render('pieces/addInst.pug', {idP: req.params.id, error: req.flash('error')})
})

router.get('/updInst', auth.isAuthenticated, auth.havePermissions(["1","2"]), (req, res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.query.idP, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => {
            piece.data.instruments.forEach(inst => {
                if(inst._id == req.query.idI)
                    res.render("pieces/updInst", {idP: req.query.idP, inst: inst, error: req.flash('error')})
            })
        })
        .catch(error => {
            console.log("Error while getting piece: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'pieces/' + req.params.idP)
        })
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
            //update user stats
            axios.put(req.app.locals.url + "api/user/downloads/" + req.session._id, {idPiece: req.params.id}, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                .then(() => console.log("User stats updated!"))
                .catch(error2 => console.log("Error in update stats user: " + error2))
        })
        .catch(error => {
            console.log("Error in get piece: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'pieces/' + req.params.id)
        })
})

router.get('/piece/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req,res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => res.render("pieces/updatePiece", {piece: piece.data, error: req.flash('error')}))
        .catch(error => {
            console.log("Error while getting piece: " + error)
            res.render("error", {message: "getting piece", error: error})
        }) 
})

router.get('/:id', auth.isAuthenticated, (req,res) => {
    axios.get(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(piece => {
            res.render("pieces/piece", {userType: req.session.type, piece: piece.data, success: req.flash('success'), error: req.flash('error')})
            //update user stats
            axios.put(req.app.locals.url + "api/user/views/" + req.session._id, {idPiece: req.params.id}, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                .then(() => console.log("User stats updated!"))
                .catch(error2 => console.log("Error in update stats user: " + error2))
        })
        .catch(error => {
            console.log("Error in get piece: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'pieces')
        })
})

router.get('/', auth.isAuthenticated, (req, res) => {
    axios.get(req.app.locals.url + "api/piece", {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(pieces => res.render('pieces/dissemination',{userType: req.session.type, pieces: pieces.data, success: req.flash('success'), error: req.flash('error')}))
        .catch(error => {
            console.log("Error in get pieces: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'main')
        }) 
})

router.post('/addInst/:id', auth.isAuthenticated, auth.havePermissions(["1","2"]), function(req, res) {
    var form = new formidable.IncomingForm()

    form.parse(req, (error, fields, formData)=>{
        if(!error){
            if(formData.file!=null){
                if(formData.file.type=="application/pdf"){
                    var fsend = formData.file.path
                    var fnew = "public/scores/" + req.params.id + "/" + formData.file.name
                    var id = new mongoose.Types.ObjectId()
                    fields['_id'] = id.toHexString()
                    //if filename already exists put the name will be the id of instrument
                    if(fs.existsSync(fnew)){
                        fnew = "public/scores/" + req.params.id + "/" + fields['_id'] + ".pdf"
                        fields['score.path'] = fields['_id'] + ".pdf"
                    }else{
                        fields['score.path'] = formData.file.name
                    }
                    fsExtra.move(fsend,fnew, error2 => {
                        if(error2){
                            console.log("Error moving file: " + error2)
                            req.flash('error','Error. Try again!')
                            res.redirect(req.app.locals.url + 'pieces/addInst/' + req.params.id)
                        }else{
                            axios.post(req.app.locals.url + "api/piece/addInst/" + req.params.id, fields, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                                .then(() => {
                                    req.flash('success','Instrument created!')
                                    res.redirect(req.app.locals.url + "pieces/" + req.params.id)
                                })
                                .catch(error => {
                                    console.log("Error in add instrument: " + error)
                                    req.flash('error','Error. Try again!')
                                    res.redirect(req.app.locals.url + 'pieces/addInst/' + req.params.id)
                                })
                        }
                    }) 
                }else{
                    console.log("File is not a PDF!")
                    req.flash('error','Error. File is not a PDF!')
                    res.redirect(req.app.locals.url + 'pieces/addInst/' + req.params.id)
                }
            }
        }else{
            console.log("Error in add instrument: " + error)
            req.flash('error','Error. Try again!')
            res.redirect(req.app.locals.url + 'pieces/addInst/' + req.params.id)
        }
    })
});

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
                                    req.flash('success','SIP ingested with success!')
                                    res.redirect(req.app.locals.url + "pieces")
                                })
                                .catch(error => {
                                    console.log("Error in insert SIP in DB: " + error)
                                    req.flash('error',"Error. Maybe manifest doesn't have the necessary attributes? Try again!")
                                    res.redirect(req.app.locals.url + 'pieces/ingestion')
                                })
                        }else{
                            console.log("Error in insert SIP: Some referenced files not exists")
                            req.flash('error','Error. Some referenced files not exists! Try again!')
                            res.redirect(req.app.locals.url + 'pieces/ingestion')
                        }
                    }else{
                        console.log("Error in insert SIP: JSON Syntax incorrect")
                        req.flash('error',"Error. JSON Syntax incorrect! Instruments doesn't exist! Try again!")
                        res.redirect(req.app.locals.url + 'pieces/ingestion')
                    }
                }else{
                    console.log("Error in insert SIP: Manifest not exists or in subfolder")
                    req.flash('error',"Error. Manifest not exists or in subfolder! Try again!")
                    res.redirect(req.app.locals.url + 'pieces/ingestion')
                }
            }catch(e){
                console.log("Error in insert SIP: " + e)
                req.flash('error',"Error. Maybe manifest doesn't use JSON syntax? Try again!")
                res.redirect(req.app.locals.url + 'pieces/ingestion')
            }
        }
    })
})

router.put('/updInst', auth.isAuthenticated, auth.havePermissions(["1","2"]), function(req, res) {
    var form = new formidable.IncomingForm()

    form.parse(req, (error, fields, formData)=>{
        if(!error){
            if(formData.file!=null){
                if(formData.file.type=="application/pdf"){
                    var path = "public/scores/" + req.query.idP 
                    //create folder if not exists
                    if(!fs.existsSync(path)) fs.mkdirSync(path)
                    var path = path + "/" + fields['score.path']
                    //delete old file
                    if(fs.existsSync(path)) fs.unlinkSync(path)
                    //use the name of file to save
                    var path = "public/scores/" + req.query.idP + "/" + formData.file.name
                    fields['score.path'] = formData.file.name
                    //if filename already exists put the name will be the id of instrument
                    if(fs.existsSync(path)) {
                        path = "public/scores/" + req.query.idP + "/" + req.query.idI + ".pdf"
                        fields['score.path'] = req.query.idI + ".pdf" 
                    }
                    fsExtra.move(formData.file.path, path, error2 => {
                        if(error2){
                            console.log("Error moving file: " + error2)
                            req.flash('error','Error. Try again!')
                            res.jsonp(req.app.locals.url + 'pieces/updInst?idP=' + req.query.idP + '&idI=' + req.query.idI)
                        }else{
                            //update BD
                            axios.put(req.app.locals.url + "api/piece/updInst?idP=" + req.query.idP + "&idI=" + req.query.idI, fields, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                                .then(() => {
                                    req.flash('success', 'Instrument updated!')
                                    res.jsonp(req.app.locals.url + "pieces/" + req.query.idP)
                                })
                                .catch(error => {
                                    console.log("Error in update instrument: " + error)
                                    req.flash('error','Error. Try again!')
                                    res.jsonp(req.app.locals.url + 'pieces/updInst?idP=' + req.query.idP + '&idI=' + req.query.idI)
                                })
                        }
                    }) 
                }else{
                    console.log("File is not a PDF!")
                    req.flash('error','Error. File is not a PDF! Try again!')
                    res.jsonp(req.app.locals.url + 'pieces/updInst?idP=' + req.query.idP + '&idI=' + req.query.idI)
                }
            }
        }else{
            console.log("Error in update instrument: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'pieces/updInst?idP=' + req.query.idP + '&idI=' + req.query.idI)
        }
    })
});

router.put('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.put(req.app.locals.url + "api/piece/" + req.params.id, req.body, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(() => {
            req.flash('success',"Piece updated!")
            res.jsonp(req.app.locals.url + "pieces/" + req.params.id)
        })
        .catch(error => {
            console.log("Error in update piece: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'pieces/piece' + req.params.id) 
        })
})

router.delete('/remInst', auth.isAuthenticated, auth.havePermissions(["1","2"]), function(req, res) {
    axios.delete(req.app.locals.url + "api/piece/remInst?idP=" + req.query.idP + "&idI=" + req.query.idI, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then(resp => {
            var insts = resp.data.instruments
            insts.forEach(i => {
                if(i._id == req.query.idI){
                    var path = "public/scores/" + req.query.idP + "/" + i.score.path 
                    if(fs.existsSync(path)) fs.unlinkSync(path)
                }
            })
            req.flash('success','Instrument deleted!')
            res.jsonp(req.app.locals.url + "pieces/" + req.query.idP)
        })
        .catch(error => {
            console.log("Error in delete instrument: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'pieces/' + req.query.idP)
        })
})

router.delete('/:id', auth.isAuthenticated, auth.havePermissions(["1"]), (req, res) => {
    axios.delete(req.app.locals.url + "api/piece/" + req.params.id, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
        .then( p => {
            rimraf.sync("public/scores/" + p.data._id)
            req.flash('success','Piece deleted!')
            res.jsonp(req.app.locals.url + "pieces")
            //update user stats
            axios.put(req.app.locals.url + "api/user/deleteStat", {idPiece: req.params.id}, {headers: {"cookie": req.headers.cookie}, withCredentials: true})
                .then(() => console.log("Users stats updated!"))
                .catch(error2 => console.log("Error in update stats users: " + error2))
        })
        .catch(error => {
            console.log("Error in delete piece: " + error)
            req.flash('error','Error. Try again!')
            res.jsonp(req.app.locals.url + 'pieces/' + req.params.id)
        })
})

module.exports = router