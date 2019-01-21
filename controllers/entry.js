var Entry = require("../models/entry")

const Entries = module.exports

Entries.list = () => {
    return Entry
        .find()
        .exec()
}

Entries.getEntry = id => {
    return Entry
        .findOne({_id: id})
        .exec()
}

Entries.createEntry = pdf => {
    return Entry.create(pdf)
}

Entries.updateEntry = (id, pdf) => {
    return Entry
        .findOneAndUpdate({_id: id}, pdf, {useFindAndModify: false})
        .exec()
}

Entries.deleteEntry = id => {
    return Entry
        .findOneAndDelete({_id: id})
        .exec()
}