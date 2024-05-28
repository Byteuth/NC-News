const db = require("../db/connection")
const { 
    reject_404 
} = require("../error_handlers/utils.error._handler");

exports.findTopics = () => {
    return db.query(
        `SELECT *
        FROM topics;`
    )
    .then((result) => {
        const topics = result.rows
        if (topics === '{}') return reject_404()
        return topics
    })
}