const {
    selectArticles,
    selectArticleById,
    selectCommentsById
} = require('../models/article.models')



exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
}

exports.getArticlesById = (req, res, next) => {
    const body = req.params
    const articleId = body.article_id  
    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({article: article});
    })
    .catch(next)
}


exports.getCommentsByArticleId = (req, res, next) => {
    const body = req.params
    const articleId = body.article_id   
    selectCommentsById(articleId)
    .then((comments) => {
        res.status(200).send({article: comments});
    })
    .catch(next)
}