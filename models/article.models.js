const db = require("../db/connection")
const { 
    reject404 
} = require("../error_handlers/utils.error._handler");

const {
    convertDateTotimestamp,
} = require("./utils.models")






exports.selectArticleById = (article_id) => {
    return db.query(
        `SELECT *
        FROM articles
        WHERE article_id = $1;`, 
        [article_id]
    )
    .then((result) => {
        if (result.rowCount === 0){
        return reject404();
        }
        const resultArticleList = result.rows
        const resultArtical = resultArticleList[0]    
        const article = convertDateTotimestamp(resultArtical)
        return article
    })
}

exports.selectArticles = () => {
    return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
        FROM articles
        ORDER BY articles.created_at DESC;`
    )
    .then(async (result) => {
        const articles = result.rows

        const articlesWithCommentCount = await Promise.all(
            articles.map(async (article) => {
            const article_id = article.article_id
            const result = await db.query(
                `SELECT *
                FROM comments
                WHERE comments.article_id = $1;`,
                [article_id]
            )
            const commentsList = result.rows
            const commentCount = commentsList.length

            return {
                ...article,
                comment_count: commentCount
            };
        }))
        return articlesWithCommentCount
    })
}

exports.selectCommentsById = (article_id) => {
    
    return db.query(
        `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
        FROM comments
        WHERE comments.article_id = $1
        ORDER BY comments.created_at ASC;`,
        [article_id]
    )
    .then((result) => {
        if (result.rowCount === 0){
            return reject404();
            }
        const commentsList = result.rows
        return commentsList

    })
}