var mongoose = require("mongoose")
var Schema = mongoose.Schema

var EventSchema = new Schema(
    {
        title: {type: String, required: true},
        desc: {type: String},
        local: {type: String},
        startDate: {type: String, required: true},
        startHour: {type: String, required: true},
        endDate: {type: String, required: true},
        endHour: {type: String, required: true}
    }
)

module.exports = mongoose.model("Event",EventSchema,"events")