const {
    selectArticles,
    selectArticleById,
    selectCommentsById,
    insertComment
} = require('../models/article.models')



exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
    .catch(next)
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


exports.addCommentToArticleId = (req, res, next) => {
    const comment = req.body
    const articleId = req.params.article_id
    insertComment(articleId, comment)
    .then((postedComment) => {
        res.status(200).send({postedComment: postedComment});
    })
    .catch(next)
}