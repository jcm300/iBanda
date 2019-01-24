var mongoose = require("mongoose")
var Schema = mongoose.Schema

var EntrySchema = new Schema(
    {
       desc: {type: String, required: true}
    }
)

module.exports = mongoose.model("Entry",EntrySchema,"entries")