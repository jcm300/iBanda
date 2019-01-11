var mongoose = require("mongoose")
var Schema = mongoose.Schema

var EventSchema = new Schema(
    {
        title: {type: String, require: true},
        desc: {type: String},
        local: {type: String},
        startDate: {type: String, require: true},
        startHour: {type: String, require: true},
        endDate: {type: String, require: true},
        endHour: {type: String, require: true}
    }
)

module.exports = mongoose.model("Event",EventSchema,"events")