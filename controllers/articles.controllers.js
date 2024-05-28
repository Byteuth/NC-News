const {selectArticleById} = require('../models/article.models')

exports.getArticlesById = (req, res, next) => {
    const body = req.params
    const articleId = body.article_id
    
    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({article: article});
    })
    .catch(next)

}
