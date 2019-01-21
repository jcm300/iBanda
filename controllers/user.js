var User = require("../models/user")
var bcrypt = require("bcrypt")
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

Users.updateUser = (id, user) => {
    user.password = bcrypt.hashSync(user.password,saltRounds)
    return User
        .findOneAndUpdate({_id: id}, user, {useFindAndModify: false})
        .exec()
}

Users.deleteUser = id => {
    return User
        .findOneAndDelete({_id: id})
        .exec()
}