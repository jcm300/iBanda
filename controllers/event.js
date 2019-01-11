var Event = require("../models/event")

const Events = module.exports

Events.list = () => {
    return Event
        .find()
        .sort({name: -1})
        .exec()
}

Events.getEvent = id => {
    return Event
        .findOne({_id: id})
        .exec()
}

Events.createEvent = event => {
    return Event.create(event)
}

Events.updateEvent = (id, event) => {
    return Event
        .findOneAndUpdate({_id: id}, event)
        .exec()
}

Events.deleteEvent = id => {
    return Event
        .findOneAndDelete({_id: id})
        .exec()
}

Events.getEventsByDate = date => {
    return Event
        .find({ $and: [{ startDate: {$lte: date} }, { endDate: {$gte: date} }] })
        .sort({startDate: 1, startHour: 1})
}

Events.getEventsByHour = hour => {
    return Event
        .find({ $and: [{ startHour: {$lte: hour} }, { endHour: {$gte: hour} }] })
        .sort({startDate: 1, startHour: 1})
}

Events.getEventsByDateHour = (date, hour) => {
    return Event
        .find({ $and: [{ startDate: {$lte: date} }, { endDate: {$gte: date} }, { startHour: {$lte: hour} }, { endHour: {$gte: hour} }] })
        .sort({startDate: 1, startHour: 1})
}

Events.getEventsByLocal = localI => {
    return Event
        .find({local: localI})
}