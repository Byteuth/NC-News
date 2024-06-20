const {
    selectArticles,
    selectArticleById,
    selectCommentsByArticleId,
    insertComment,
    updateVotesValue
} = require('../models/article.models')



exports.getArticles = (req, res, next) => {
    const {topic} = req.query.topic
    selectArticles(topic)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const body = req.params
    const articleId = body.article_id  
    const articleListPromise = selectArticleById(articleId)
    const commentsListPromise = selectCommentsByArticleId(articleId)
    Promise.all([articleListPromise, commentsListPromise])
    .then(([article, comments])=>{
        article.comment_count = comments.length
        res.status(200).send({article: article});
        return article
    })
    .catch(next)
}

exports.getArticlesByQuery = async (req, res, next) => {
    getArticles()
    .then((articles) => {
        res.status(200).send({articles: articles});
    })
}


exports.getCommentsByArticleId = (req, res, next) => {
    const body = req.params
    const articleId = body.article_id   
    selectCommentsByArticleId(articleId)
    .then((comments) => {
        res.status(200).send({article: comments});
    }) 
    .catch(next)
}


exports.addCommentToArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    const comment = req.body
    insertComment(articleId, comment)
    .then((postedComment) => {
        res.status(201).send({postedComment: postedComment});
    })
    .catch(next)
}

exports.patchArticleVotesByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    const newVote = req.body.inc_votes
    console.log(newVote)
    updateVotesValue(articleId, newVote)
    .then((updatedArticle) => {
        res.status(202).send({updatedArticle: updatedArticle});
    })
    .catch(next)
}


