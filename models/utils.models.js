exports.convertDateTotimestamp = (article) => {
    const createdAt = article.created_at
    const timestamp = parseInt(new Date(createdAt + 'Z').getTime())

    const articleString = JSON.stringify(article)
    const fixedArticle = JSON.parse(articleString)

    fixedArticle.created_at = timestamp

    return fixedArticle
}


exports.selectCommentsById = (article_id) => {

    return article_id
}
