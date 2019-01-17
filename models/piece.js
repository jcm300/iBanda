var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ScoreSchema = new Schema(
    {
        voice: {type: String},
        clave: {type: String},
        tune: {type: String},
        path: {type: String, required: true}
    }
)

var InstrumentSchema = new Schema(
    {
        name: {type: String, required: true},
        score: {type: ScoreSchema, required: true}
    }
)

var PieceSchema = new Schema(
    {
       title: {type: String, required: true},
       composer: {type: String},
       type: {type: String, required: true},
       arrangement: {type: String},
       instruments: {type: [InstrumentSchema], required: true}
    }
)

module.exports = mongoose.model("Piece",PieceSchema,"pieces")