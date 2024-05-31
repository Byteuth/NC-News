const db = require("../db/connection")
const { 
    reject404,
    rejectInvalidQuery
} = require("../error_handlers/utils.error._handler");

const {
    convertDateTotimestamp,
} = require("./utils.models")

const {
    findTopics
} = require("./topics.models")







exports.selectArticleById = (articleId) => {
    return db.query(
        `SELECT *
        FROM articles
        WHERE article_id = $1;`, 
        [articleId]
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

exports.selectArticles = async (query) => {
    const topics = await findTopics()
    const topicExists = topics.some((topic) => topic.slug === query) 
    const topicSlug = query

    const queryWithTopicString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.topic = ($1)
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC;` 

    const queryAll = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC;`

    
    if (topicExists === true) {
        return db.query(
            queryWithTopicString,
            [topicSlug]
        )
        .then((result )=> {
            const articles = result.rows
            if (articles.length === 0) return []
            console.log(articles.length)
            return articles
        })
    }
    else if (!query) {
        return db.query(
            queryAll
        )
        .then((result )=> {
            // console.log(result.rows)
            return result.rows
        })
    }
    else {
        return rejectInvalidQuery()
    }
    

}

exports.selectCommentsByArticleId = (articleId) => { 
    return db.query(
        `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
        FROM comments
        WHERE comments.article_id = $1
        ORDER BY comments.created_at ASC;`,
        [articleId]
    )
    .then((result) => {
        if (result.rowCount === 0){
            return reject404();
            }
        const commentsList = result.rows
        // commentsList.comment_count = commentsList.length
        // //console.log(commentsList)
        return commentsList

    })
}

exports.insertComment = (articleId, comment) => {
    const commentMsg = comment.body
    const username = comment.username

    return db.query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [commentMsg, username, articleId]
    )
    .then(result => {
        const insertedComment = result.rows[0]
            if (!insertedComment) {
                return reject404()
            }
            return insertedComment
    })
}


exports.updateVotesValue = (articleId, newVote) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [newVote, articleId]
    )
    .then(result => {       
        const updatedArticle = result.rows[0]
            if (!updatedArticle) {
                return reject404()
            }
            return updatedArticle
    })
}

