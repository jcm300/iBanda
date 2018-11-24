var User = require("../models/user")
var mongo = require("mongodb")

const Users = module.exports

Users.list = () => {
    return User
        .find()
        .sort({name: -1})
        .exec()
}

Users.getUser = (idI) => {
    var idObj = new mongo.ObjectId(idI);
    return User
        .find({_id: idObj})
        .exec()
}

Users.createUser = (nameI, emailI, passwordI) => {
    return User
        .insertMany([{name: nameI, email: emailI, password: passwordI}])
}

Users.updateUser = (idI, nameI, emailI, passwordI) => {
    var idObj = new mongo.ObjectId(idI);
    return User
        .updateOne({_id: idObj},{name: nameI, email: emailI, password: passwordI})
        .exec()
}
