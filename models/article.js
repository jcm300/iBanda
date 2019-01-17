var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ArticleSchema = new Schema(
    {
       title: {type: String, required: true},
       subtitle: {type: String},
       date: {type: String, required: true},
       authors: [String],
       body: {type: String, required: true},
       topics: [String]
    }
)

module.exports = mongoose.model("Article",ArticleSchema,"articles")