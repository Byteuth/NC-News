const {
    selectArticles,
    selectArticleById
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
