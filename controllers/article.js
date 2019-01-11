var Article = require("../models/article")

const Articles = module.exports

Articles.list = () => {
    return Article
        .find()
        .sort({name: -1})
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
        .findOneAndUpdate({_id: id}, article)
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
}

Articles.getArticlesByAuthor = authorI => {
    return Article
        .find({authors: {author: authorI}})
}

Articles.getArticlesByTopic = topicI => {
    return Article
        .find({topics: {topic: topicI}})
}