var User = require("../models/user")
var bcrypt = require("bcrypt")
var mongoose = require("mongoose")
const saltRounds = 12

const Users = module.exports

Users.list = () => {
    return User
        .find()
        .sort({name: -1})
        .exec()
}

Users.findOne = emailI => {
    return User
        .findOne({email: emailI})
}

Users.getUser = id => {
    return User
        .findOne({_id: id})
        .exec()
}

Users.isValidPassword = (password, passwordStored) => {
    return bcrypt.compare(password, passwordStored)
}

Users.createUser = user => {
    user.password = bcrypt.hashSync(user.password,saltRounds)
    return User.create(user)
}

Users.approve = id => {
    return User
        .findOneAndUpdate({_id: id}, {$set: {approved: true}}, {useFindAndModify: false})
        .exec()
}

Users.updateUser = (id, user) => {
    return User
        .findOneAndUpdate({_id: id}, {$set: {name: user.name, email: user.email, type: user.type}}, {useFindAndModify: false})
        .exec()
}

Users.updatePassword = async (id, prevPass, newPass) => {
    var user = await User.findOne({_id: id})
    if(bcrypt.compareSync(prevPass,user.password)){
        newPass = bcrypt.hashSync(newPass,saltRounds) 
        return User
            .findOneAndUpdate({_id: id}, {$set: {password: newPass}}, {useFindAndModify: false})
            .exec()
    }else return null
}

//get total views of a user
Users.getViews = async id => {
    var user = await User.findOne({_id: id}) 
    var values = user.stats.map(a => a.views)
    var total = values.reduce((total, num) => total+=num,0)
    return total
}

//get total downloads of a user
Users.getDownloads = async id => {
    var user = await User.findOne({_id: id}) 
    var values = user.stats.map(a => a.downloads)
    var total = values.reduce((total, num) => total+=num,0)
    return total
}

//get piece most viewed by a user
Users.getPieceViews = async id => {
    var user = await User.findOne({_id: id}) 
    var max = user.stats.reduce((prev, current) => (prev.views > current.views) ? prev : current, 0)
    return max
}

//get piece most downloaded by a user
Users.getPieceDownloads = async id => {
    var user = await User.findOne({_id: id}) 
    var max = user.stats.reduce((prev, current) => (prev.downloads > current.downloads) ? prev : current, 0)
    return max
}

//get total views of app
Users.getAllViews = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].views)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var values = mR.results.map(a => a.value)
    var total = values.reduce((total, num) => total+=num, 0)
    return total
}

//get total downloads of app
Users.getAllDownloads = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].downloads)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var values = mR.results.map(a => a.value)
    var total = values.reduce((total, num) => total+=num, 0)
    return total
}

//get users views
Users.getUsersViews = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].views)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var views = new Object()
    mR.results.forEach(v => views[v._id]=v.value)
    return views
}

//get users downloads
Users.getUsersDownloads = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].downloads)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var downloads = new Object()
    mR.results.forEach(v => downloads[v._id]=v.value)
    return downloads
}

//get user with most views
Users.getUserWithMostViews = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].views)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var max = mR.results.reduce((prev, current) => (prev.value > current.value) ? prev : current, 0)
    return max
}

//get user with most downloads
Users.getUserWithMostDownloads = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this._id,this.stats[i].downloads)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var max = mR.results.reduce((prev, current) => (prev.value > current.value) ? prev : current, 0)
    return max
}

//get piece most viewed
Users.getMostViewed = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this.stats[i].idPiece,this.stats[i].views)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var max = mR.results.reduce((prev, current) => (prev.value > current.value) ? prev : current, 0)
    return max
}

//get piece most downloaded
Users.getMostDownloaded = async () => {
    var o = {}
    o.map = function() {
            for(var i=0; i<this.stats.length; i++)
                emit(this.stats[i].idPiece,this.stats[i].downloads)
        }
    o.reduce = function(key, values){
            return Array.sum(values)
        }
    o.out = {inline:1}
    var mR = await User.mapReduce(o)
    var max = mR.results.reduce((prev, current) => (prev.value > current.value) ? prev : current, 0)
    return max
}

Users.updateViews = async (id, idPiece) => {
    var user = await User.findOne({_id: new mongoose.Types.ObjectId(id), stats: { $elemMatch: { idPiece: idPiece} }})
    if(user){
        return User
            .findOneAndUpdate({ _id: id, stats: { $elemMatch: { idPiece: idPiece} } },{ $inc: {"stats.$.views": 1} }, {useFindAndModify: false} )
    }else{
        return User
            .findOneAndUpdate({ _id: id },{ $push: {stats: {idPiece: idPiece, views: 1, downloads: 0}} }, {useFindAndModify: false} ) 
    }
}

Users.updateDownloads = async (id, idPiece) => {
    var user = await User.findOne({_id: new mongoose.Types.ObjectId(id), stats: { $elemMatch: { idPiece: idPiece} }})
    if(user){
        return User
            .findOneAndUpdate({ _id: id, stats: { $elemMatch: { idPiece: idPiece} } },{ $inc: {"stats.$.downloads": 1} }, {useFindAndModify: false} )
    }else{
        return User
            .findOneAndUpdate({ _id: id },{ $push: {stats: {idPiece: idPiece, views: 0, downloads: 1}} }, {useFindAndModify: false} ) 
    }
}

Users.deleteStat = idPiece => {
    return User
        .updateMany({},{ $pull: {stats: { idPiece: idPiece}}},{useFindAndModify: false})
}

Users.deleteUser = id => {
    return User
        .findOneAndDelete({_id: id})
        .exec()
}