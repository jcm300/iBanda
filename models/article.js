var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ArticleSchema = new Schema(
    {
       title: {type: String, require: true},
       subtitle: {type: String},
       date: {type: String, require: true},
       authors: [String],
       body: {type: String, require: true},
       topics: [String]
    }
)

module.exports = mongoose.model("Article",ArticleSchema,"articles")