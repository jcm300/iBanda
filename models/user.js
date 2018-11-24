var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = new Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true, index: {unique: true}},
        password: {type: String, require: true}
    }
)

module.exports = mongoose.model("User",UserSchema,"users")
