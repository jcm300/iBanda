var User = require("../models/user")

const Users = module.exports

Users.list = () => {
    return User
        .find()
        .sort({name: -1})
        .exec()
}

Users.getUser = id => {
    return User
        .findOne({_id: id})
        .exec()
}

Users.createUser = user => {
    return User.create(user)
}

Users.updateUser = (id, user) => {
    return User
        .findOneAndUpdate({_id: id}, user, {useFindAndModify: false})
        .exec()
}

Users.deleteUser = id => {
    return User
        .findOneAndDelete({_id: id})
        .exec()
}