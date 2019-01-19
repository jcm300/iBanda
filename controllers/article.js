var Article = require("../models/article")

const Articles = module.exports

Articles.list = () => {
    return Article
        .find()
        .sort({date: -1})
        .exec()
}

Articles.listVisibles = () => {
    return Article
        .find({visible: true})
        .sort({date: -1})
        .exec()
}

Articles.getArticle = id => {
    return Article
        .findOne({_id: id})
        .exec()
}

Articles.createArticle = article => {
    return Article.create(article)
}

Articles.updateArticle = (id, article) => {
    return Article
        .findOneAndUpdate({_id: id}, article, {useFindAndModify: false})
        .exec()
}

Articles.changeVisibility = (id, visibleI) => {
    return Article
        .findByIdAndUpdate({_id: id}, {$set: {visible: visibleI}}, {useFindAndModify: false})
        .exec()
}

Articles.deleteArticle = id => {
    return Article
        .findOneAndDelete({_id: id})
        .exec()
}

Articles.getArticlesByDate = dateI => {
    return Article
        .find({date: dateI})
        .exec()
}

Articles.getArticlesByAuthor = authorI => {
    return Article
        .find({authors: authorI})
        .exec()
}

Articles.getArticlesByTopic = topicI => {
    return Article
        .find({topics: topicI})
        .exec()
}