var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ArticleSchema = new Schema(
    {
       title: {type: String, required: true},
       subtitle: {type: String},
       date: {type: String, required: true},
       authors: [String],
       body: {type: String, required: true},
       topics: [String],
       visible: {type: Boolean, required: true}
    }
)

module.exports = mongoose.model("Article",ArticleSchema,"articles")