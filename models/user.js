var mongoose = require("mongoose")
var Schema = mongoose.Schema

var StatisticsSchema = new Schema(
    {
        idPiece: {type: String},
        views: {type: Number},
        downloads: {type: Number}
    }
)

var UserSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, index: {unique: true}},
        password: {type: String, required: true},
        type: {type: String, required: true},
        stats: {type: [StatisticsSchema]}
    }
)

module.exports = mongoose.model("User",UserSchema,"users")