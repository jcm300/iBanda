var express = require('express')
var router = express.Router()
var axios = require("axios")
var formidable = require("formidable")
var admzip = require("adm-zip")
var fs = require("fs")

router.get('/', (req, res) => {
    res.render('ingestion')
})

//ingestion
router.post('/', (req, res) => {
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
                            axios.post(req.app.locals.url + "api/piece", json)
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

module.exports = router