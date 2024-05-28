const db = require("../db/connection")
const { 
    reject404 
} = require("../error_handlers/utils.error._handler");

const {
    convertDateTotimestamp
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