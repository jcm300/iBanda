var Piece = require("../models/piece")

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

Pieces.deletePiece = id => {
    return Piece
        .findOneAndDelete({_id: id})
        .exec()
}