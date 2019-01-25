var Piece = require("../models/piece")
var mongoose = require("mongoose")

const Pieces = module.exports

Pieces.list = () => {
    return Piece
        .find()
        .exec()
}

Pieces.getPiece = id => {
    return Piece
        .findOne({_id: id})
        .exec()
}

Pieces.createPiece = piece => {
    return Piece.create(piece)
}

Pieces.updatePiece = (id, piece) => {
    return Piece
        .findOneAndUpdate({_id: id}, piece, {useFindAndModify: false})
        .exec()
}

Pieces.addInst = (id,inst) => {
    return Piece
        .findOneAndUpdate({ _id: id },{ $push: {instruments: inst} }, {useFindAndModify: false} )
        .exec()
}

Pieces.updateInst = (idPiece, idInst, inst) => {
    return Piece
        .findOneAndUpdate({ _id: new mongoose.Types.ObjectId(idPiece), instruments: { $elemMatch: { _id: new mongoose.Types.ObjectId(idInst)} } },{ $set: {"instruments.$": inst} }, {useFindAndModify: false} )
        .exec()
}

Pieces.remInst = (idPiece, idInst) => {
    return Piece
        .findOneAndUpdate({ _id: new mongoose.Types.ObjectId(idPiece)},{ $pull: {instruments: { _id: new mongoose.Types.ObjectId(idInst)}}},{useFindAndModify: false})
        .exec()
}

Pieces.deletePiece = id => {
    return Piece
        .findOneAndDelete({_id: id})
        .exec()
}